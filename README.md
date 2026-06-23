# Share Card

> 将 Claude Code 对话一键生成精美分享卡片

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)   [![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen)]()

简体中文 | [English](README-en.md)

---

## 这是什么

**Share Card** 是一个 [Claude Code](https://claude.ai/code) 技能。在对话中说「分享」，Agent 会把当前回答排版成精美卡片，渲染为 PNG 图片，方便分享到朋友圈、Twitter、GitHub 等平台。

## 快速开始

```bash
# 1. 克隆到目标项目的 skills 目录
git clone https://github.com/YOU/share-card.git .claude/skills/share-card

# 2. 安装依赖（仅 puppeteer-core，不含 Chromium）
cd .claude/skills/share-card/scripts
npm install
```

然后在 Claude Code 对话中说：**「分享」「生成图片」「做成卡片」**

Agent 会引导你点选内容范围和风格，一键出图。

## 两种模式

| 模式               | 说明                                           |
| ------------------ | ---------------------------------------------- |
| **固定模板** | 7 套配色主题，Agent 填入 Markdown 内容直接渲染 |
| **自适应**   | AI 根据内容量身设计 HTML，每次风格不同         |

## 7 套主题

| 浅色             |                 |        |
| ---------------- | --------------- | ------ |
| 🍃 森绿亮        | 🌹 玫瑰朝霞     | 简洁白 |
| Everforest Light | Rosé Pine Dawn | GitHub |

| 暗色            |           |         |             |
| --------------- | --------- | ------- | ----------- |
| 🌲 森绿暗       | 🟣 霓虹紫 | ☕ 暖咖 | 🧊 北极蓝灰 |
| Everforest Dark | Dracula   | Gruvbox | Nord        |

## 工作原理

```
Markdown 内容 → HTML 排版 → headless 浏览器截图 → PNG（750px × 自适应高度）
```

## 项目结构

```
├── SKILL.md              # 技能定义 + Agent 行为指令
├── scripts/
│   └── render.js         # HTML → PNG 渲染器
├── templates/            # 7 套固定模板（内联 CSS）
└── references/           # 设计参考（Catppuccin 色板 + 前端设计指南）
```

## 依赖

| 依赖                     | 说明                       |
| ------------------------ | -------------------------- |
| Node.js ≥ 18            | 运行渲染脚本               |
| Edge / Chrome / Chromium | 系统自带即可，脚本自动查找 |

## 跨平台

Windows 用 Edge，macOS 用 Chrome，Linux 用 Chromium——开箱即用。

## FAQ

**为什么不内置 Chromium？** 为了轻量。puppeteer-core + 系统浏览器仅约 10 MB，puppeteer 含 Chromium 约 350 MB。

**手机端能用吗？** 固定宽度 750px，适配手机竖屏。顶部 100px 留白避免前置摄像头/灵动岛遮挡。

**可以复制到剪贴板吗？** `render.js --clipboard`（需额外 `npm i clipboard-sys`）。

## License

MIT
