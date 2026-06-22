// render.js — HTML → PNG, fixed width + auto height. Uses system Edge.
// Usage: node render.js --html <file> [--width 750] [--preset mobile] [--output <path>] [--clipboard]
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, basename, dirname } from 'path';

const PRESETS = {
  mobile: 750,   // phone-friendly
  square: 1080,  // social media
  wide:   1200,  // link cards / OG
};
const DEFAULT_WIDTH = 750;

function parseArgs(argv) {
  const args = { scale: 2, clipboard: false };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--html':      args.html = argv[++i]; break;
      case '--preset':    args.preset = argv[++i]; break;
      case '--width':     args.width = parseInt(argv[++i]); break;
      case '--output':    args.output = argv[++i]; break;
      case '--clipboard': args.clipboard = true; break;
      case '--scale':     args.scale = parseInt(argv[++i]); break;
    }
  }
  if (!args.html) throw new Error('--html <file> is required');

  // Resolve width: preset > explicit --width > default
  if (args.preset) {
    const w = PRESETS[args.preset];
    if (!w) throw new Error(`Unknown preset: ${args.preset}. Use ${Object.keys(PRESETS).join('|')}`);
    args.width = w;
  }
  args.width = args.width || DEFAULT_WIDTH;

  if (!args.output) {
    const base = basename(args.html, '.html');
    const tag = args.preset || `w${args.width}`;
    args.output = `${base}-${tag}.png`;
  }
  return args;
}

async function findEdge() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const exe of candidates) {
    try { readFileSync(exe); return exe; } catch { /* skip */ }
  }
  throw new Error('No Chromium browser found. Install Edge or set CHROME_PATH.');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const html = readFileSync(args.html, 'utf-8');
  const edgePath = await findEdge();

  console.log(`Browser: ${edgePath}`);
  console.log(`Input:   ${args.html}`);
  console.log(`Width:   ${args.width}px @${args.scale}x (height: auto)`);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set viewport width fixed, height tentatively tall
    await page.setViewport({
      width: args.width,
      height: 8000,
      deviceScaleFactor: args.scale,
    });

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

    // Force card-wrapper: fixed width, auto height
    const actualHeight = await page.evaluate((w) => {
      const el = document.getElementById('card-wrapper');
      if (!el) return null;
      el.style.width = w + 'px';
      el.style.height = 'auto';
      el.style.overflow = 'hidden';
      return el.getBoundingClientRect().height;
    }, args.width);

    if (actualHeight === null) {
      // Fallback: no card-wrapper, screenshot body at current viewport
      await page.screenshot({ path: args.output, type: 'png', fullPage: true });
    } else {
      // Resize viewport to exact content height
      const h = Math.ceil(actualHeight);
      await page.setViewport({
        width: args.width,
        height: h,
        deviceScaleFactor: args.scale,
      });

      mkdirSync(dirname(resolve(args.output)), { recursive: true });

      const card = await page.$('#card-wrapper');
      await card.screenshot({ path: args.output, type: 'png' });
    }

    const stat = { path: resolve(args.output) };
    try {
      const buf = readFileSync(args.output);
      stat.sizeKB = (buf.length / 1024).toFixed(0);
    } catch { /* ignore */ }

    const dims = actualHeight
      ? `${args.width}x${Math.ceil(actualHeight)} (${args.width * args.scale}x${Math.ceil(actualHeight) * args.scale} @${args.scale}x)`
      : `full page @${args.scale}x`;

    console.log(`Output:  ${stat.path} (${stat.sizeKB} KB, ${dims})`);

    if (args.clipboard) {
      try {
        const { default: clipboard } = await import('clipboard-sys');
        clipboard.writeImage(readFileSync(args.output));
        console.log('Clipboard: copied');
      } catch {
        console.log('Clipboard: skipped (npm i clipboard-sys to enable)');
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
