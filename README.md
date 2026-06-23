# Share Card

Claude Code 技能——把对话内容一键生成精美分享卡片。

> 将 Claude Code Agent 的回答、代码、对话记录，通过 HTML 排版 → 渲染为 PNG 图片，方便分享到社交平台。

## 效果速览

7 套配色主题，固定宽度 750px（手机竖屏），高度随内容自适应。

| 森绿亮 | 玫瑰朝霞 | 简洁白 |
|--------|----------|--------|
| Everforest Light | Rosé Pine Dawn | GitHub |

| 森绿暗 | 霓虹紫 | 暖咖 | 北极蓝灰 |
|--------|--------|------|----------|
| Everforest Dark | Dracula | Gruvbox | Nord |

另有**自适应模式**，AI 根据内容量身定制 HTML 设计。

## 安装

将 `skill` 目录复制到目标项目的 `.claude/skills/` 下：

```bash
# 在目标项目根目录
cp -r share-card/.claude/skills/share-card .claude/skills/share-card

# 安装渲染依赖（仅 puppeteer-core，不含 Chromium）
cd .claude/skills/share-card/scripts
npm install
```

需要系统已安装 Edge / Chrome / Chromium 任一浏览器（脚本自动查找）。

## 使用

在 Claude Code 对话中，直接说：

- 「分享」「生成图片」「截图」「做成卡片」
- 「share」「export」「make a card」「generate an OG image」

Agent 会弹出选项让你点选：

1. **分享什么内容？** — 最近回复 / 代码块 / 整段对话 / 自定义
2. **什么排版风格？** — 自适应 / 浅色主题 / 暗色主题
3. **具体主题**（选固定模板时）— 7 套配色任选

## 工作原理

```
Markdown 内容 → HTML 模板/自适应设计 → puppeteer-core 渲染 → PNG
```

- **固定模板**：7 套预设配色，Agent 把 Markdown 转 HTML 填入 `[CONTENT]` 占位符
- **自适应模式**：Agent 读内容、定方向、写完整 HTML/CSS，自由配色（参考 Catppuccin 色板）
- **渲染引擎**：调用系统 Edge/Chrome headless 截图 `#card-wrapper`，固定宽度 750px，高度自适应

## 项目结构

```
.claude/skills/share-card/
├── SKILL.md              # 技能定义 + Agent 指令
├── scripts/
│   ├── render.js         # HTML → PNG 渲染器
│   └── package.json      # puppeteer-core
├── templates/            # 7 套固定模板
│   ├── everforest-light.html
│   ├── rosepine.html
│   ├── minimal.html
│   ├── everforest.html
│   ├── dracula.html
│   ├── gruvbox.html
│   └── nord.html
└── references/
    ├── catppuccin.md     # Catppuccin 4 套色板参考
    └── html-design-guide.md  # 前端设计指南
```

## 跨平台

| 平台 | 首选浏览器 |
|------|-----------|
| Windows | Edge |
| macOS | Chrome |
| Linux | Chromium / Chrome |

## 许可

MIT
