# 模板使用指南

## 模板总览

| 模板 | 文件 | 适合 | 不适合 |
|------|------|------|--------|
| minimal | `templates/minimal.html` | 短 Q&A、一句话总结 | 对话、代码 |
| chat-bubble | `templates/chat-bubble.html` | 多轮对话 | 单条回复 |
| poster | `templates/poster.html` | 金句、结论、公告 | 详细技术内容 |
| code-focus | `templates/code-focus.html` | 代码片段 | 纯文字对话 |

## minimal — 简洁风

**占位符：** `[TITLE]` `[SUBTITLE]` `[BODY]` `[FOOTER]`

**适用条件：** 内容不超过 200 字、结构简单、不需要视觉分层。

**替换示例：**
```
[TITLE]    → 二分查找优化
[SUBTITLE] → 从 O(n) 到 O(log n)
[BODY]     → 通过每次将搜索空间减半，二分查找在大规模有序数据中...（正文）
[FOOTER]   → 2024-06-22 · Claude
```

**注意事项：** BODY 较长时字号会自动适配（22px），但超过 400 字建议换 poster 或自适应。

## chat-bubble — 对话风

**占位符：** `[TITLE]` `[TIMESTAMP]` `[MESSAGES]`

**MESSAGES 格式：** 每个消息是一个 `.msg` div，必须含 `.msg-label` 和 `.msg-bubble` 两层：

```html
<div class="msg user">
  <div class="msg-label">You</div>
  <div class="msg-bubble">为什么不工作？</div>
</div>
<div class="msg assistant">
  <div class="msg-label">Claude</div>
  <div class="msg-bubble">问题在于 config 未初始化，传入了 null 值。</div>
</div>
```

**最佳实践：**
- 不超过 4 组对话（超出会溢出 1080 高度）
- 内容超过 4 条消息时，只取最关键的几轮
- 每条消息控制在 100 字以内

## poster — 海报风

**占位符：** `[HEADLINE]` `[QUOTE]` `[AUTHOR]` `[CONTEXT]`

**适用条件：** 有明确的「金句」或结论，适合大字展示。

**替换示例：**
```
[HEADLINE] → 性能优化的本质
[QUOTE]    → 不是让快的更快，是让慢的不再慢。
[AUTHOR]   → Claude
[CONTEXT]  → 关于系统性能的讨论
```

**注意事项：** HEADLINE 超过 20 字会被裁切；QUOTE 超过 150 字会溢出。

## code-focus — 代码风

**占位符：** `[FILENAME]` `[LANGUAGE]` `[LINE_COUNT]` `[CODE]` `[EXPLANATION]`

**CODE 替换：** 必须用 `&lt;` `&gt;` `&amp;` 转义 HTML 特殊字符，保留原始缩进：

```html
[CODE] →
<span style="color:#ff7b72">def</span> <span style="color:#d2a8ff">quicksort</span>(arr):
    <span style="color:#ff7b72">if</span> len(arr) &lt;= 1:
        <span style="color:#ff7b72">return</span> arr
    pivot = arr[len(arr) // 2]
    left = [x <span style="color:#ff7b72">for</span> x in arr <span style="color:#ff7b72">if</span> x &lt; pivot]
```

**注意事项：**
- CODE 最多 30 行，超出会溢出代码区域
- 代码区域宽度约 940px，行太长会被折行（white-space: pre-wrap）
- EXPLANATION 控制在 100 字以内
