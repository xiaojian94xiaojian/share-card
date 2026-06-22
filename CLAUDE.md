# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a Claude Code skill (`share-card`) that converts conversation content into shareable PNG images via HTML → headless Edge screenshot.

## How the skill works

1. Agent generates an HTML file (either from a fixed template in `templates/` or written from scratch in adaptive mode)
2. `scripts/render.js` opens it in system Edge (headless, via `puppeteer-core`) and screenshots `#card-wrapper`
3. Output: PNG with fixed width + auto height, 2x Retina by default

## Key files

| File | Role |
|------|------|
| `SKILL.md` | Skill definition — YAML frontmatter + Agent instructions. Loaded by Claude Code when skill triggers. |
| `scripts/render.js` | HTML → PNG renderer. ES module, accepts `--html`, `--preset`/`--width`, `--output`, `--clipboard`, `--scale`. |
| `scripts/package.json` | Single dependency: `puppeteer-core` (no bundled Chromium — uses system Edge). |
| `templates/*.html` | 4 fixed-layout templates. Each is self-contained with inline CSS. Slots are `[UPPERCASE]` markers that the Agent replaces. |
| `references/catppuccin.md` | 4-flavor color palette used by adaptive mode. |
| `references/design-guidelines.md` | Color, typography, spacing standards for adaptive HTML generation. |

## Commands

```bash
# First-time setup (inside scripts/)
npm install

# Render a card
node scripts/render.js --html <file> --preset mobile --output ./card.png

# Presets: mobile (750px), square (1080px), wide (1200px)
# Height is always auto — determined by #card-wrapper content.
# Add --clipboard to copy to clipboard (needs optional `npm i clipboard-sys`).
```

## Template system

Templates use `[SLOT_NAME]` markers. The Agent reads the template, replaces slots with content, writes a temp file, and passes it to render.js. All CSS is inline — no external files, no build step.

## Installing the skill

Copy `.claude/skills/share-card/` into the target project's `.claude/skills/` directory, then run `npm install` inside `scripts/`.
