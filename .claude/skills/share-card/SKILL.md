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

**第二问 — 什么排版模式？**

| 选项 | 标签 | 说明 |
|------|------|------|
| A | 简洁风 | 短 Q&A、小技巧 |
| B | 对话风 | 多轮对话 |
| C | 海报风 | 金句、结论 |
| D | 代码风 | 代码片段 |
| E | 自适应 | AI 量身定制 |

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

| 内容特征 | 必须用 | 禁止用 | 原因 |
|----------|--------|--------|------|
| 教程、指南、步骤说明 | `minimal` | poster | 教程要清晰传达信息，不是喊口号 |
| 多轮对话（≥3 个来回） | `chat-bubble` | minimal | 对话结构需要气泡区分说话人 |
| 金句、名言、结论性断语 | `poster` | code-focus | 大字报适合短有力的表达 |
| 代码片段（≥5 行代码） | `code-focus` | poster | 代码需要终端风和等宽字体 |
| 简短 Q&A、摘要、小技巧 | `minimal` | chat-bubble | 单条内容不需要对话结构 |
| 技术方案、架构说明 | 自适应 | poster | 技术内容需要结构化的排版 |

**如果用户的选择和内容不匹配："这篇内容是 X 类型，Y 模板不合适，建议换 Z。继续用 Y 还是换 Z？"**

### 工作流

1. 读取 `templates/<name>.html`
2. 替换占位符 `[SLOT_NAME]` 为实际内容（代码需 HTML 转义）
3. 写临时文件 `$env:TEMP\share-card.html`
4. 运行 `node .claude/skills/share-card/scripts/render.js --html $env:TEMP\share-card.html --preset mobile --output ./share-card.png`
5. 报告结果

### 各模板占位符

**minimal：** `[TITLE]` `[SUBTITLE]` `[BODY]` `[FOOTER]`

**chat-bubble：** `[TITLE]` `[TIMESTAMP]` `[MESSAGES]`
- `[MESSAGES]` 替换为完整气泡 HTML：
  ```html
  <div class="msg user">
    <div class="msg-label">You</div>
    <div class="msg-bubble">用户消息内容</div>
  </div>
  <div class="msg assistant">
    <div class="msg-label">Claude</div>
    <div class="msg-bubble">Agent 回复内容</div>
  </div>
  ```

**poster：** `[HEADLINE]` `[QUOTE]` `[AUTHOR]` `[CONTEXT]`

**code-focus：** `[FILENAME]` `[LANGUAGE]` `[LINE_COUNT]` `[CODE]` `[EXPLANATION]`
- `[CODE]` 需 HTML 转义（`<` → `&lt;`），保留缩进

---

## 自适应排版模式

适用于：长对话、内容结构独特、固定模板不够用的场景。

### 工作流

1. 分析内容：主题、语调、结构
2. 选  Catppuccin flavor 和强调色（见下表，色值查 `references/catppuccin.md`）
3. 编写完整 HTML（CSS 内联，根容器 `#card-wrapper`，色值用 Catppuccin）
4. 调用 render.js 渲染
5. 检查输出，必要时调整

### 内容→风格映射（强制）

**色值来源：`references/catppuccin.md`。不要自己编颜色。**

| 内容类型 | 视觉方向 | Catppuccin Flavor | 推荐强调色 | 布局 |
|----------|----------|-------------------|-----------|------|
| 教程/指南/文档 | 文档风 | Latte | Blue | 标题→要点→总结 |
| 技术分析/深度文章 | 杂志风 | Macchiato | Teal | 标题→导语→正文 |
| 代码/技术方案 | 终端风 | Mocha | Green | 窗口栏→代码→说明 |
| 对话/讨论 | 气泡风 | Frappé | Mauve + Green | 消息列表 |
| 金句/结论 | 大字报 | Mocha | Peach | 居中，一句占满 |
| 思考链/推理过程 | 时间线/步骤条 | Macchiato | Peach | 步骤编号 |

色值用法：`Base` 做卡片底色，`Text` 做文字色，`Subtext0` 做次要文字，`Surface0` 做区块底色，`Overlay0` 做分割线。

**额外约束：**
- 教程/指南禁止用大字报风格
- 代码卡片必须用等宽字体
- 不随意套暗色渐变，要匹配内容气质

### 自适应 HTML 设计约束

- CSS 内联在 `<style>` 中
- 根容器 `<div id="card-wrapper">`，设 `width: 100%`，**不设固定 height**
- 暗色主题首选（`#0d1117` 系背景）
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
