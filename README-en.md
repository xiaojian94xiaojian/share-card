<h1 align="center">Share Card</h1>
<p align="center">One-click shareable card generation from Claude Code conversations</p>

<p align="center">
  <a href="README.md">简体中文</a>
   · 
  <strong>English</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"/></a>
  <a href="#"><img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen?style=flat-square" alt="Platform"/></a>
</p>

<br/>

## What is this

**Share Card** is a [Claude Code](https://claude.ai/code) skill. Say "share" in a conversation and the agent will typeset the response into a polished card, then render it as a PNG — ready for Twitter, LinkedIn, GitHub, or anywhere you share images.

## Quick Start

#### 1. Global install (recommended — available in all projects)

```bash
git clone https://github.com/xiaojian94xiaojian/share-card.git ~/.claude/skills/share-card
```

> For a single project only: replace `~/.claude/skills/share-card` with `.claude/skills/share-card`

#### 2. Install the single dependency (puppeteer-core, no bundled Chromium)

```bash
cd ~/.claude/skills/share-card/scripts
npm install
```

#### Too lazy? Copy this to your agent and it'll do everything for you

```bash
Install this skill for me: https://github.com/xiaojian94xiaojian/share-card
```

Then in Claude Code, say: **"share", "export", "make a card"**, or use the slash command: **`/share-card`**

The agent will prompt you through content selection and theme picker — point-and-click, no typing.

## Two Modes

| Mode                 | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| **Fixed Template**   | 7 preset themes. Agent fills in Markdown content, renders immediately       |
| **Adaptive**         | AI designs a custom HTML layout from scratch — a different style every time |

## 7 Themes

| Light              |                  |        |
| ------------------ | ---------------- | ------ |
| 🍃 Everforest Light | 🌹 Rosé Pine Dawn | GitHub |

| Dark               |           |          |              |
| ------------------ | --------- | -------- | ------------ |
| 🌲 Everforest Dark  | 🟣 Dracula | ☕ Gruvbox | 🧊 Nord      |

## How It Works

```
Markdown content → HTML layout → headless browser screenshot → PNG (750px × auto height)
```

## Project Structure

```
├── SKILL.md              # Skill definition + agent behavior instructions
├── scripts/
│   └── render.js         # HTML → PNG renderer
├── templates/            # 7 preset templates (inline CSS)
└── references/           # Design references (Catppuccin palette + frontend guide)
```

## Requirements

| Dependency               | Notes                              |
| ------------------------ | ---------------------------------- |
| Node.js ≥ 18            | For the renderer script            |
| Edge / Chrome / Chromium | Already on your system — auto-detected |

## Cross-Platform

Windows → Edge. macOS → Chrome. Linux → Chromium. No configuration needed.

## FAQ

**Why no bundled Chromium?** To stay lean. puppeteer-core + system browser ≈ 10 MB. puppeteer with Chromium ≈ 350 MB.

**Mobile-friendly?** Fixed 750px width, optimized for portrait orientation. 100px top padding avoids notch / dynamic island clipping.

**Clipboard support?** `render.js --clipboard` (requires optional `npm i clipboard-sys`).

<br/>

---

<p align="center">
  <sub>MIT — see <a href="LICENSE">LICENSE</a></sub>
</p>
