# 渲染指南

## render.js 参数

```
node render.js --html <file> [--preset <name>] [--width <px>] [options]
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--html` | string | (必需) | HTML 文件路径 |
| `--preset` | string | mobile | 宽度预设：`mobile` / `square` / `wide` |
| `--width` | number | 750 | 自定义宽度（覆盖 preset） |
| `--output` | string | `./<name>-<preset>.png` | 输出 PNG 路径 |
| `--clipboard` | flag | false | 复制到剪贴板 |
| `--scale` | number | 2 | 设备像素比 |

## 宽度预设

| 预设 | 宽度 | @2x 输出宽度 |
|------|------|-------------|
| `mobile` | 750px | 1500px |
| `square` | 1080px | 2160px |
| `wide` | 1200px | 2400px |

**高度始终自适应。** 输出文件名中的高度是渲染后的实际值（如 `card-mobile-750x642.png`）。

## 渲染流程

1. 设置 viewport 宽度 = 指定宽度，高度 = 8000（临时）
2. 加载 HTML，等待渲染
3. 获取 `#card-wrapper` 的实际高度
4. 重设 viewport 为精确宽度 × 实际高度
5. 对 `#card-wrapper` 元素截图
6. 写入 PNG

## 浏览器查找

1. `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
2. `C:\Program Files\Microsoft\Edge\Application\msedge.exe`

可通过 `$env:CHROME_PATH` 覆盖。

## 剪贴板

需要额外安装：`npm install clipboard-sys`

未安装时 `--clipboard` 静默跳过。

## 性能

| 操作 | 耗时 |
|------|------|
| Edge headless 首次启动 | ~2-3s |
| 后续渲染 | ~1-2s |
| HTML 加载 | ~0.5s |
| 截图写入 | ~0.1s |
