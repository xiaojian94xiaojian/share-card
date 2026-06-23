# Share Card

A [Claude Code](https://claude.ai/code) skill that turns conversation highlights into shareable PNG images.

> Convert Claude Code agent responses, code snippets, and chat logs into beautifully formatted cards via HTML → headless browser screenshot.

## Themes

7 preset themes, fixed width 750px (mobile portrait), auto height.

| Light | | |
|--------|----------|--------|
| Everforest Light | Rosé Pine Dawn | GitHub |

| Dark | | | |
|--------|--------|------|----------|
| Everforest Dark | Dracula | Gruvbox | Nord |

Plus an **adaptive mode** where the AI designs a custom HTML layout tailored to your content.

## Installation

Copy the skill into your target project:

```bash
# From the share-card repo to your project root
cp -r share-card/.claude/skills/share-card .claude/skills/share-card

# Install the single rendering dependency (no bundled Chromium)
cd .claude/skills/share-card/scripts
npm install
```

Requires Edge, Chrome, or Chromium installed on your system (auto-detected).

## Usage

In Claude Code, just say:

- "share", "export", "screenshot", "make a card"
- "generate an OG image", "turn this into a post"

The agent will prompt you with clickable options:

1. **What to share?** — latest reply / code block / full conversation / custom
2. **Layout mode?** — adaptive / light theme / dark theme
3. **Which theme?** (if fixed mode) — pick from 7 presets

## How It Works

```
Markdown content → HTML template / adaptive design → headless browser screenshot → PNG
```

- **Fixed mode**: Agent replaces the `[CONTENT]` placeholder in a chosen template with Markdown-to-HTML content
- **Adaptive mode**: Agent reads content, picks a visual direction, writes a complete self-contained HTML page. Color choice is free (Catppuccin palette available as reference)
- **Renderer**: `puppeteer-core` opens your system Edge/Chrome headless, screenshots the `#card-wrapper` element at 750px width. Height is always auto.

## Project Structure

```
.claude/skills/share-card/
├── SKILL.md                  # Skill definition + agent instructions
├── scripts/
│   ├── render.js             # HTML → PNG renderer
│   └── package.json          # puppeteer-core only
├── templates/                # 7 preset templates
│   ├── everforest-light.html
│   ├── rosepine.html
│   ├── minimal.html
│   ├── everforest.html
│   ├── dracula.html
│   ├── gruvbox.html
│   └── nord.html
└── references/
    ├── catppuccin.md         # Catppuccin 4-flavor color palette
    └── html-design-guide.md  # Frontend design guidance
```

## Cross-Platform

| Platform | Primary Browser |
|----------|----------------|
| Windows | Edge |
| macOS | Chrome |
| Linux | Chromium / Chrome |

## Requirements

- Node.js ≥ 18
- A Chromium-based browser (Edge / Chrome / Chromium)

## License

MIT
