---
name: share-card
description: >
  Converts conversation highlights into shareable PNG images. Use when the
  user asks to "share", "export", "screenshot", "make a card", "create a
  shareable image", "generate an OG image", "turn this into a post", "make
  a poster", or "这段对话生成图片分享". Two modes: fixed layout (pick a
  template) and adaptive layout (AI designs custom HTML/CSS per content).
  Fixed width + auto height. Default mobile width (750px).
argument-hint: "[内容] [fixed|adaptive] [mobile|square|wide]"
dependencies: node>=18, npm
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
| B | 简洁黑白版 | 短文、教程、总结（GitHub 风格） |
| C | 北极蓝灰版 | 技术长文（Nord 主题） |
| D | 暖咖版 | 人文医学（Gruvbox 主题） |
| E | 霓虹紫版 | 创意设计（Dracula 主题） |
| F | 森绿版 | 通用技术（Everforest 主题） |

**第三问 — 什么宽度？**

| 选项 | 标签 | 说明 |
|------|------|------|
| A | mobile 750px | 手机竖屏（默认） |
| B | square 1080px | 社交方形 |
| C | wide 1200px | 链接卡片 |

**三项都确认后才开始生成。**

---

## 固定排版模式

### 模板选择（强制匹配规则）

**先分析内容类型再选模板。用户选的模板不合适时，主动指出并建议更换。**

| 模板 | 主题 | 底色 | h1 色 | 调性 |
|------|------|------|-------|------|
| `minimal` 简洁黑白版 | GitHub | `#ffffff` | `#1f2328` | 白底黑字，蓝链接 |
| `nord` 北极蓝灰版 | Nord | `#2E3440` | `#88C0D0` | 冷静克制 |
| `gruvbox` 暖咖版 | Gruvbox | `#282828` | `#FABD2F` | 复古温润 |
| `dracula` 霓虹紫版 | Dracula | `#282A36` | `#BD93F9` | 高对比度 |
| `everforest` 森绿版 | Everforest | `#2D353B` | `#A7C080` | 护眼低刺激 |

所有固定模板都用 `[CONTENT]` 单占位符，Agent 把 Markdown 转 HTML 后替换即可。

**如果用户的选择和内容不匹配："这篇内容是 X 类型，Y 模板不合适，建议换 Z。继续用 Y 还是换 Z？"**

### 工作流

1. 读取 `templates/<name>.html`
2. 替换占位符 `[SLOT_NAME]` 为实际内容（代码需 HTML 转义）
3. 写临时文件 `$env:TEMP\share-card.html`
4. 运行 `node .claude/skills/share-card/scripts/render.js --html $env:TEMP\share-card.html --preset mobile --output ./share-card.png`
5. 删除临时 HTML 文件
6. 报告结果

### 各模板占位符

**minimal：** `[CONTENT]` 一个占位符，替换为 Markdown 转 HTML 后的完整内容。

配色采用 GitHub Markdown 风格：白底黑字、`#1f2328` 标题、`#0969da` 链接、`#656d76` 引用、`#f6f8fa` 代码底、`#d0d7de` 表格线。支持 GitHub 风格的 alert callout（`.markdown-alert-note` 等五个等级）。

Agent 把 Markdown 原文转成 HTML 后替换 `[CONTENT]` 即可。

**nord / gruvbox / dracula / everforest：** 统一 `[CONTENT]` 占位符，用法同 minimal。

---

## 自适应排版模式

适用于：长对话、内容结构独特、固定模板不够用的场景。

### 工作流

1. 分析内容：主题、语调、结构
2. 选  Catppuccin flavor 和强调色（见下表，色值查 `references/catppuccin.md`）
3. 编写完整 HTML（CSS 内联，根容器 `#card-wrapper`，色值用 Catppuccin）
4. 调用 render.js 渲染
5. 删除临时 HTML 文件
6. 检查输出，必要时调整

### 内容→风格映射（强制）

**色值来源：`references/catppuccin.md`。不要自己编颜色。**

| 内容类型 | 视觉方向 | Catppuccin Flavor | 推荐强调色 | 布局 |
|----------|----------|-------------------|-----------|------|
| 教程/指南/文档 | 文档风 | Latte | Blue | 标题→要点→总结 |
| 技术分析/深度文章 | 杂志风 | Macchiato | Teal | 标题→导语→正文 |
| 代码/技术方案 | 终端风 | Mocha | Green | 窗口栏→代码→说明 |
| 思考链/推理过程 | 时间线/步骤条 | Macchiato | Peach | 步骤编号 |

色值用法：`Base` 做卡片底色，`Text` 做文字色，`Subtext0` 做次要文字，`Surface0` 做区块底色，`Overlay0` 做分割线。

**额外约束：**
- 教程/指南禁止用大字报风格
- 代码卡片必须用等宽字体
- 不随意套暗色渐变，要匹配内容气质

### 自适应 HTML 设计约束

**写 HTML 前必读 `references/html-design-guide.md`。** 关键要点：

- 避免 AI 味设计：不要奶油底+衬线大标题+赤陶点缀、不要纯黑底+荧光绿/朱红单色、不要报纸栏布局——除非内容明确需要
- 从内容本身找视觉灵感，不要套默认模板
- 一次只在一个地方大胆，其他地方克制
- CSS 全部内联在 `<style>` 中
- 根容器 `<div id="card-wrapper">`，设 `width: 100%`，**不设固定 height**
- 主题由内容决定：教程/文档用浅色（Latte），技术/代码用暗色（Macchiato/Mocha），对话用中暗（Frappé）
- 字体栈：`'Segoe UI', -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', sans-serif`
- 代码字体：`'Cascadia Code', 'Fira Code', 'Consolas', monospace`
- 文字至少 16px，四周留白至少 40px
- 右下角 "Claude Share" 水印

---

## 渲染命令参考

```
node .claude/skills/share-card/scripts/render.js \
  --html <file> \
  [--preset <mobile|square|wide>] \
  [--width <px>] \
  [--output <path>] \
  [--clipboard] \
  [--scale <1|2|3>]
```

| 参数 | 必需 | 说明 |
|------|------|------|
| `--html` | 是 | HTML 文件路径 |
| `--preset` | 否 | 宽度预设：mobile(750) / square(1080) / wide(1200) |
| `--width` | 否 | 自定义宽度，默认 750 |
| `--output` | 否 | 输出路径，默认 `./<name>-<preset>.png` |
| `--clipboard` | 否 | 渲染后复制到剪贴板 |
| `--scale` | 否 | 缩放因子，默认 2 |

### 宽度预设

| 预设 | 宽度 | 适用 |
|------|------|------|
| `mobile` | 750px（默认） | 手机竖屏 / 微信 / 朋友圈 |
| `square` | 1080px | Instagram / Twitter |
| `wide` | 1200px | Link 卡片 / OG |

**高度始终自适应。** 渲染后输出显示实际尺寸（如 `750×642`）。

---

## 首次使用

```
cd .claude/skills/share-card/scripts && npm install
```

不需要额外安装 Chromium——自动使用系统的 Edge 浏览器。

## 故障排除

| 问题 | 解决 |
|------|------|
| 找不到浏览器 | 确认 Edge 已安装 |
| 中文乱码 | `<meta charset="UTF-8">`，字体栈含 `'Microsoft YaHei'` |
| 内容被裁切 | `#card-wrapper` 不能设固定 height |
| 渲染慢 | 首次 2-3 秒，后续 1-2 秒 |
| 图片模糊 | `--scale` 默认 2，可加到 3 |
| npm install 失败 | Node >= 18，用 PowerShell 执行 |
