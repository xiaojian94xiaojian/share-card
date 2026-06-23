---
name: share-card
description: >
  Converts conversation highlights into shareable PNG images. Use when the
  user asks to "share", "export", "screenshot", "make a card", "create a
  shareable image", "generate an OG image", "turn this into a post", "make
  a poster", or "这段对话生成图片分享". Two modes: fixed layout (pick a
  template) and adaptive layout (AI designs custom HTML/CSS per content).
  Fixed width + auto height. Default mobile width (750px).
argument-hint: "[内容] [fixed|adaptive]"
---

# Share Card

把对话内容排版为 HTML，渲染成 PNG 图片，方便分享到社交平台。

**尺寸策略：固定宽度，高度随内容自适应。** 内容多长卡片就多高。

## 开始前：必须确认三件事

**用户未明确指定时，用 AskUserQuestion 工具弹出选项，让用户点选，不要用纯文字问。**

如果工具不可用，再用文字列出编号选项，等用户回复数字或字母。

**第一问 — 分享什么内容？**

| 选项 | 标签 | 说明 |
|------|------|------|
| A | 最近一条回复 | 刚才的 Agent 回答 |
| B | 某段代码块 | 对话里的代码片段 |
| C | 整段对话 | 所有来回 |
| D | 自定义范围 | 用户指定 |

**第二问 — 什么排版模式？**（自适应始终放第一个）

| 选项 | 标签 | 说明 |
|------|------|------|
| A | 自适应 | AI 量身定制 |
| B | 森绿亮 | Everforest Light 浅色 |
| C | 森绿暗 | Everforest Dark 暗色 |
| D | 玫瑰朝霞 | Rosé Pine 浅色 |
| E | 霓虹紫 | Dracula 暗色 |
| F | 暖咖 | Gruvbox 暗色 |
| G | 北极蓝灰 | Nord 暗色 |
| H | 简洁白 | GitHub 浅色 |

**两项都确认后才开始生成。宽度固定 mobile 750px。**

---

## 固定排版模式

### 模板选择（强制匹配规则）

**先分析内容类型再选模板。用户选的模板不合适时，主动指出并建议更换。**

所有固定模板都是卡片风（彩色背景 + 圆角卡片），统一 `[CONTENT]` 占位符。

| 文件 | 标签 | 主题 | 色调 |
|------|------|------|------|
| `minimal.html` | 简洁白 | GitHub | 浅灰底 + 白卡片 |
| `nord.html` | 北极蓝灰 | Nord | 蓝灰底 + 暗卡片 |
| `gruvbox.html` | 暖咖 | Gruvbox | 暖棕底 + 深色卡片 |
| `dracula.html` | 霓虹紫 | Dracula | 紫灰底 + 暗紫卡片 |
| `everforest.html` | 森绿暗 | Everforest Dark | 暗绿底 + 深绿卡片 |
| `everforest-light.html` | 森绿亮 | Everforest Light | 米黄底 + 暖白卡片 |
| `rosepine.html` | 玫瑰朝霞 | Rosé Pine Dawn | 粉底 + 白卡片 |

**如果用户的选择和内容不匹配："这篇内容是 X 类型，Y 模板不合适，建议换 Z。继续用 Y 还是换 Z？"**

### 工作流

1. 读取 `${CLAUDE_SKILL_DIR}/templates/<name>.html`
2. 替换占位符 `[SLOT_NAME]` 为实际内容（代码需 HTML 转义）
3. 用 Write 工具写临时 HTML 到 `$env:TEMP\share-card.html`（确保 UTF-8 编码，不要用 PowerShell Set-Content）
4. 运行 `node ${CLAUDE_SKILL_DIR}/scripts/render.js --html $env:TEMP\share-card.html --preset mobile --output ./share-风格名.png`
5. 删除临时 HTML 文件
6. 报告结果（文件名格式：`share-风格名.png`，如 `share-dracula.png`、`share-rosepine.png`）

### 各模板占位符

所有模板统一 `[CONTENT]` 占位符。Agent 把 Markdown 原文转成 HTML 后替换 `[CONTENT]` 即可。

---

## 自适应排版模式

适用于：长对话、内容结构独特、固定模板不够用的场景。

### 工作流

1. 分析内容：主题、语调、结构
2. 构思视觉方向：色彩、字体、布局——自由发挥，参考 `references/catppuccin.md` 或自己搭色
3. 编写完整 HTML（CSS 内联，根容器 `#card-wrapper`）
4. 调用 render.js 渲染
5. 删除临时 HTML 文件
6. 检查输出，必要时调整

### 自适应 HTML 设计约束

**写 HTML 前必读 `${CLAUDE_SKILL_DIR}/references/html-design-guide.md`。** 关键要点：

- 避免 AI 味设计：不要奶油底+衬线大标题+赤陶点缀、不要纯黑底+荧光绿/朱红单色、不要报纸栏布局
- 从内容本身找视觉灵感，不要套默认模板
- 一次只在一个地方大胆，其他地方克制
- CSS 全部内联在 `<style>` 中
- 根容器 `<div id="card-wrapper">`，设 `width: 100%`，**不设固定 height**
- 内容元素 `position: relative` + `z-index: 1`
- 字体栈：`'Segoe UI', -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', sans-serif`
- 代码字体：`'Cascadia Code', 'Fira Code', 'Consolas', monospace`
- 文字至少 16px，四周留白至少 40px
- 可用 `${CLAUDE_SKILL_DIR}/references/catppuccin.md` 里的 4 套色板，也可以自己搭色——不做限制

---

## 渲染命令参考

```
node ${CLAUDE_SKILL_DIR}/scripts/render.js --html <file> --preset mobile --output <path>
```

默认 750px 宽，高度自适应。可选 `--scale 2`（Retina），`--clipboard` 复制到剪贴板。

---

## 首次使用

```
cd ${CLAUDE_SKILL_DIR}/scripts && npm install
```

需要 Chromium 内核浏览器（Edge / Chrome / Chromium），脚本自动查找。Windows 用 Edge，Mac 用 Chrome。

## 故障排除

| 问题 | 解决 |
|------|------|
| 找不到浏览器 | 确认 Edge 已安装 |
| 中文乱码 | `<meta charset="UTF-8">`，字体栈含 `'Microsoft YaHei'` |
| 渲染慢 | 首次 2-3 秒，后续 1-2 秒 |
