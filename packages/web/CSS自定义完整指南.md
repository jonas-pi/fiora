# Fiora CSS 自定义完整指南

本文档提供了 Fiora Web 客户端 CSS 自定义的完整参考，允许您像 Jellyfin 媒体服务器那样几乎完全自定义界面外观。

## 目录

1. [基础说明](#基础说明)
2. [主要区域和类名](#主要区域和类名)
3. [布局和容器](#布局和容器)
4. [聊天界面](#聊天界面)
5. [消息样式](#消息样式)
6. [侧边栏](#侧边栏)
7. [输入框和按钮](#输入框和按钮)
8. [对话框和弹窗](#对话框和弹窗)
9. [动画和过渡效果](#动画和过渡效果)
10. [高级技巧](#高级技巧)
11. [完整示例](#完整示例)
12. [快速修复清单](#快速修复清单)
13. [常见问题排查](#常见问题排查)
14. [调试技巧](#调试技巧)
15. [选择器使用最佳实践](#选择器使用最佳实践)
16. [问题示例分析](#问题示例分析)

> **注意**：本文档仅适用于 Web 桌面端。移动端由另一个仓库实现，不在此文档范围内。

---

## 基础说明

### 如何使用

1. 打开设置面板（点击侧边栏的设置图标）
2. 切换到"自定义CSS"标签页
3. 在文本框中粘贴您的 CSS 代码
4. 点击"应用"按钮使更改生效
5. 如需清除，清空文本框后点击"应用"

### 推荐写法（强烈建议）

1. **尽量把所有规则"限制在 `.app` 内"**，例如 `.app .chat { ... }`  
   - 好处：不会误伤浏览器插件注入的 DOM、rc-dialog 内部结构或其它页面元素
   - 示例：
     ```css
     /* ✅ 好 */
     .app .chat { ... }
     
     /* ⚠️ 可能误伤 */
     .chat { ... }
     ```

2. **优先用"稳定选择器"**（见下文"常用类名速查表"）  
   - Fiora Web 使用了 CSS Modules，很多 `.less` 里声明的类在运行时会被 hash
   - 但我们已为核心区域补了"稳定 class"（不带 hash），用户自定义 CSS 请优先使用这些
   - **如何验证选择器是否存在**：
     - 打开浏览器开发者工具（F12）
     - 在控制台（Console）中运行：`document.querySelector('.your-selector') !== null`
     - 如果返回 `true`，说明选择器存在；如果返回 `false`，说明不存在

3. **避免写过于宽泛的选择器**  
   - 不推荐：`* { ... }`、`[role="button"] { ... }`、`.rc-dialog-wrap { ... }`
   - 这些很容易把按钮、弹窗、下拉菜单等交互组件"写坏"
   - 示例：
     ```css
     /* ❌ 错误：会影响所有按钮（包括弹窗内） */
     button { ... }
     
     /* ✅ 正确：只影响特定区域的按钮 */
     .app .chatInput .iconButton { ... }
     ```

4. **⚠️ 不要修改关键布局属性（重要！）**
   - **禁止修改**：`position`, `display`, `flex`, `flex-direction`, `z-index`, `overflow`（对 `.app`, `.child`, `.sidebar`, `.functionBarAndLinkmanList`, `.chat` 等容器）
   - **可以修改**：`background`, `color`, `border-radius`, `box-shadow`, `width`, `height`（尺寸）等视觉属性
   - 修改布局属性会导致元素位置和遮挡关系错误
   - 详见"常见问题排查"章节的"问题 6：元素位置以及遮挡关系错误"

### CSS 优先级

- 自定义 CSS 使用 `!important` 来覆盖默认样式
- 自定义 CSS 在 `<head>` 中最后加载，具有较高优先级
- 建议在需要覆盖的地方使用 `!important`

### 安全限制

以下内容会被自动过滤（出于安全考虑）：
- `javascript:` 协议
- `expression()` 函数（IE 特有）
- 其他可能执行代码的 CSS 特性

**允许的内容：**
- ✅ `data:` URI（可以内嵌图片、字体等）
- ✅ 同源/相对路径资源（例如 `/BackgroundImage/...`、`/Sticker/...`）
- ✅ 所有标准 CSS 属性
- ✅ CSS 变量（CSS Variables）
- ✅ 动画和过渡效果
- ✅ 媒体查询（Media Queries）

**默认禁止的内容（安全优先）：**
- ❌ 外部域名资源加载（例如 `@import https://...`、`url(https://...)`、`url(//...)`）
  - 原因：会产生对第三方的网络请求，可能带来隐私泄露与供应链风险

### 受保护 UI（管理员入口/控制台）

出于“防止误操作把自己锁死”的考虑，Fiora 会对部分关键 UI 做保护：

- 管理员入口（侧边栏按钮）与管理员控制台 **不允许通过自定义 CSS 被隐藏/不可点击**
  - 例如尝试用 `display: none`、`visibility: hidden`、`opacity: 0`、`pointer-events: none` 等方式隐藏，将不会生效

这不会限制你对它们进行 **配色、圆角、阴影、动画等美化**，只是禁止“隐藏/禁用交互”这类危险操作。

---

## 主要区域和类名

### 应用根容器

```css
/* ⚠️ 警告：以下容器请只修改视觉样式，不要修改布局属性 */

/* 整个应用容器 */
.app {
    /* ✅ 可以设置：整体背景、字体等 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    font-family: 'Microsoft YaHei', sans-serif !important;
    
    /* ❌ 禁止修改：position, display, overflow 等布局属性 */
}

/* 毛玻璃效果容器（当启用毛玻璃时） */
.blur {
    /* ✅ 可以设置：背景模糊层 */
    filter: blur(10px) !important;
    
    /* ❌ 禁止修改：position 等布局属性 */
}

.child {
    /* ✅ 可以设置：圆角、阴影等视觉样式 */
    border-radius: 15px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
    
    /* ❌ 禁止修改：position, display, flex 等布局属性 */
}
```

---

## 布局和容器

> **⚠️ 重要警告**：本节中的容器（`.app`, `.child`, `.sidebar`, `.functionBarAndLinkmanList`, `.chat`）使用了关键的布局属性（`position`, `display`, `flex` 等）来控制页面布局。**请勿修改这些布局属性**，否则会导致元素位置和遮挡关系错误。详见"常见问题排查"章节的"问题 6"。

### 主布局结构

```css
/* ⚠️ 警告：以下容器请只修改视觉样式，不要修改布局属性 */

/* 功能栏和联系人列表容器 */
.functionBarAndLinkmanList {
    /* ✅ 可以修改：宽度、背景、颜色等 */
    width: 300px !important;
    background-color: #2c3e50 !important;
    
    /* ❌ 禁止修改：position, display, flex 等布局属性 */
}

/* 联系人列表容器 */
.container {
    /* ✅ 可以修改：背景、颜色等 */
    background-color: #34495e !important;
    
    /* ❌ 禁止修改：flex, display 等布局属性 */
}

/* 联系人列表 */
.linkmanList {
    /* ✅ 可以修改：滚动条样式、背景等 */
    scrollbar-width: thin !important;
    scrollbar-color: #3498db #2c3e50 !important;
}

/* 聊天区域 */
.chat {
    /* ✅ 可以修改：背景、圆角、颜色等 */
    background-color: rgba(245, 245, 250, 0.95) !important;
    border-top-right-radius: 15px !important;
    border-bottom-right-radius: 15px !important;
    
    /* ❌ 禁止修改：flex, display, position 等布局属性 */
}

/* 无联系人时的提示 */
.noLinkman {
    /* 居中提示区域 */
}

.noLinkmanImage {
    /* 无联系人图片 */
    border-radius: 10px !important;
}

.noLinkmanText {
    /* 无联系人文字 */
    color: #999 !important;
    font-size: 16px !important;
}
```

---

## 聊天界面

### 聊天头部栏

```css
/* 聊天头部栏 */
.headerBar {
    height: 70px !important;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1) !important;
    padding: 0 20px !important;
}

/* 头部栏名称 */
.headerBar .name {
    color: #ffffff !important;
    font-size: 18px !important;
    font-weight: 600 !important;
}

/* 头部栏按钮容器 */
.headerBar .buttonContainer {
    /* 按钮组容器 */
}

/* 头部栏图标 */
.headerBar .iconfont {
    color: #ffffff !important;
    transition: color 0.3s ease !important;
}

.headerBar .iconfont:hover {
    color: #f0f0f0 !important;
}
```

### 消息列表

```css
/* 消息列表容器 */
.messageList {
    /* 消息滚动区域 */
    padding: 20px !important;
}

/* 未读消息提示 */
.unread {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: #ffffff !important;
    border-radius: 20px !important;
    padding: 8px 16px !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
}
```

### 聊天输入框

```css
/* 聊天输入框容器 */
.chatInput {
    height: 80px !important;
    background: rgba(255, 255, 255, 0.9) !important;
    border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
    padding: 0 20px !important;
}

/* 输入框表单 */
.chatInput .form {
    /* 输入表单容器 */
}

/* 输入框 */
.chatInput .input {
    border: 2px solid #e0e0e0 !important;
    border-radius: 20px !important;
    padding: 10px 15px !important;
    font-size: 14px !important;
    transition: border-color 0.3s ease !important;
}

.chatInput .input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
}

/* 输入框占位符 */
.chatInput .input::placeholder {
    color: #999 !important;
}

/* 图标按钮 */
.chatInput .iconButton {
    /* 表情、文件等按钮 */
}

.chatInput .iconButton .iconfont {
    color: #666 !important;
    transition: color 0.3s ease !important;
}

.chatInput .iconButton:hover .iconfont {
    color: #667eea !important;
}
```

---

## 消息样式

### 消息容器

```css
/* 单条消息容器 */
.message {
    margin-bottom: 15px !important;
    padding: 0 10px !important;
}

/* 自己发送的消息 */
.message.self {
    /* 右侧消息样式 */
}

/* 消息头像 */
.message .avatar {
    width: 44px !important;
    height: 44px !important;
    border-radius: 50% !important;
    border: 2px solid #ffffff !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* 消息右侧内容区 */
.message .right {
    /* 消息内容区域 */
}

/* 昵称和时间块 */
.message .nicknameTimeBlock {
    margin-bottom: 5px !important;
}

/* 用户标签（铭牌） */
.message .tag {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: #ffffff !important;
    border-radius: 4px !important;
    padding: 2px 8px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
}

/* 昵称 */
.message .nickname {
    color: #333 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
}

/* 时间 */
.message .time {
    color: #999 !important;
    font-size: 12px !important;
}

/* 消息内容块 */
.message .contentButtonBlock {
    /* 内容和按钮容器 */
}

/* 消息气泡 */
.message .content {
    background: #ffffff !important;
    color: #333 !important;
    padding: 10px 15px !important;
    border-radius: 12px !important;
    border-top-left-radius: 0 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    max-width: 70% !important;
    word-wrap: break-word !important;
}

/* 自己发送的消息气泡 */
.message.self .content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: #ffffff !important;
    border-top-left-radius: 12px !important;
    border-top-right-radius: 0 !important;
}

/* 消息箭头（指向头像的小三角） */
.message .arrow {
    /* 消息气泡的箭头 */
}

/* 消息操作按钮列表 */
.message .buttonList {
    /* 撤回、复制等按钮 */
}

/* 消息操作按钮 */
.message .button {
    background: rgba(255, 255, 255, 0.9) !important;
    border-radius: 4px !important;
    padding: 4px 8px !important;
    transition: background 0.3s ease !important;
}

.message .button:hover {
    background: #f0f0f0 !important;
}

/* 文本消息 */
.message .textMessage {
    line-height: 1.6 !important;
    word-break: break-word !important;
}

/* 图片消息 */
.message .imageMessage {
    /* 图片消息容器 */
}

.message .image {
    max-width: 400px !important;
    max-height: 300px !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}
```

---

## 侧边栏

### 侧边栏容器

```css
/* 侧边栏 */
.sidebar {
    width: 80px !important;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%) !important;
    border-top-left-radius: 15px !important;
    border-bottom-left-radius: 15px !important;
}

/* 侧边栏头像 */
.sidebar .avatar {
    margin-top: 50px !important;
    width: 50px !important;
    height: 50px !important;
    border-radius: 50% !important;
    border: 3px solid rgba(255, 255, 255, 0.3) !important;
    cursor: pointer !important;
    transition: transform 0.3s ease !important;
}

.sidebar .avatar:hover {
    transform: scale(1.1) !important;
}

/* 在线状态指示器 */
.sidebar .status {
    /* 状态指示器 */
}

/* 侧边栏标签页 */
.sidebar .tabs {
    margin-top: 50px !important;
}

/* 侧边栏按钮组 */
.sidebar .buttons {
    position: absolute !important;
    bottom: 40px !important;
}

.sidebar .buttons .iconfont {
    color: rgba(255, 255, 255, 0.8) !important;
    transition: color 0.3s ease !important;
}

.sidebar .buttons .iconfont:hover {
    color: #ffffff !important;
}
```

---

## 输入框和按钮

### 通用按钮

```css
/* 所有按钮（通用样式） */
.component-button,
button,
[role="button"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 6px !important;
    padding: 10px 20px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}

.component-button:hover,
button:hover,
[role="button"]:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
}

.component-button:active,
button:active,
[role="button"]:active {
    transform: translateY(0) !important;
}
```

### 输入框

```css
/* 所有输入框 */
.component-input,
input[type="text"],
input[type="password"],
input[type="email"],
textarea {
    border: 2px solid #e0e0e0 !important;
    border-radius: 6px !important;
    padding: 10px 15px !important;
    font-size: 14px !important;
    transition: border-color 0.3s ease !important;
    background: #ffffff !important;
}

.component-input:focus,
input:focus,
textarea:focus {
    border-color: #667eea !important;
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
}
```

---

## 对话框和弹窗

### 对话框

```css
/* 对话框遮罩层 */
.rc-dialog-wrap {
    background: rgba(0, 0, 0, 0.5) !important;
    backdrop-filter: blur(5px) !important;
}

/* 对话框内容 */
.rc-dialog {
    border-radius: 15px !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
    overflow: hidden !important;
}

/* 对话框标题 */
.rc-dialog-title {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: #ffffff !important;
    padding: 15px 20px !important;
    font-size: 18px !important;
    font-weight: 600 !important;
}

/* 对话框主体 */
.rc-dialog-body {
    padding: 20px !important;
    background: #ffffff !important;
}

/* 对话框关闭按钮 */
.rc-dialog-close {
    color: #ffffff !important;
    opacity: 0.8 !important;
    transition: opacity 0.3s ease !important;
}

.rc-dialog-close:hover {
    opacity: 1 !important;
}
```

---

## 动画和过渡效果

### 基础动画

```css
/* 全局过渡效果 */
* {
    transition: background-color 0.3s ease,
                color 0.3s ease,
                border-color 0.3s ease,
                transform 0.3s ease,
                box-shadow 0.3s ease !important;
}

/* 消息出现动画 */
@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message {
    animation: messageSlideIn 0.3s ease !important;
}

/* 按钮悬停动画 */
.component-button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.component-button:hover {
    transform: translateY(-2px) scale(1.02) !important;
}

/* 输入框聚焦动画 */
.chatInput .input {
    transition: all 0.3s ease !important;
}

.chatInput .input:focus {
    transform: scale(1.02) !important;
}
```

### 高级动画

```css
/* 页面加载动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.app {
    animation: fadeIn 0.5s ease !important;
}

/* 消息列表滚动动画 */
.messageList {
    scroll-behavior: smooth !important;
}

/* 侧边栏图标旋转动画 */
.sidebar .iconfont {
    transition: transform 0.3s ease !important;
}

.sidebar .iconfont:hover {
    transform: rotate(15deg) scale(1.1) !important;
}
```

---

## 高级技巧

### 使用 CSS 变量

```css
/* 定义自定义 CSS 变量 */
:root {
    --custom-primary-color: #667eea;
    --custom-secondary-color: #764ba2;
    --custom-background: #f5f5fa;
    --custom-text-color: #333333;
    --custom-border-radius: 12px;
}

/* 使用变量 */
.message .content {
    background: var(--custom-primary-color) !important;
    border-radius: var(--custom-border-radius) !important;
}
```

### 使用渐变背景

```css
/* 线性渐变 */
.app {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

/* 径向渐变 */
.chat {
    background: radial-gradient(circle at top, #667eea, #764ba2) !important;
}

/* 多色渐变 */
.sidebar {
    background: linear-gradient(180deg, 
        #667eea 0%, 
        #764ba2 50%, 
        #f093fb 100%) !important;
}
```

### 使用毛玻璃效果

```css
/* 毛玻璃效果（需要浏览器支持 backdrop-filter） */
.chat {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
}

/* 半透明背景 */
.message .content {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(5px) !important;
}
```

### 自定义滚动条

```css
/* Webkit 浏览器（Chrome, Safari, Edge） */
.linkmanList::-webkit-scrollbar {
    width: 8px !important;
}

.linkmanList::-webkit-scrollbar-track {
    background: #f1f1f1 !important;
    border-radius: 10px !important;
}

.linkmanList::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border-radius: 10px !important;
}

.linkmanList::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
}

/* Firefox */
.linkmanList {
    scrollbar-width: thin !important;
    scrollbar-color: #667eea #f1f1f1 !important;
}
```

### 使用阴影效果

```css
/* 卡片阴影 */
.message .content {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

/* 悬浮阴影 */
.component-button:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
}

/* 内阴影 */
.chatInput .input:focus {
    box-shadow: inset 0 0 0 2px #667eea !important;
}
```

---

## 完整示例

### 示例 1：深色主题

```css
/* 深色主题完整样式 */
.app {
    background: #1a1a1a !important;
}

.chat {
    background: #2d2d2d !important;
}

.message .content {
    background: #3d3d3d !important;
    color: #ffffff !important;
}

.message.self .content {
    background: #667eea !important;
    color: #ffffff !important;
}

.sidebar {
    background: #1a1a1a !important;
}

.headerBar {
    background: #2d2d2d !important;
    border-bottom: 1px solid #444 !important;
}

.chatInput {
    background: #2d2d2d !important;
    border-top: 1px solid #444 !important;
}

.chatInput .input {
    background: #3d3d3d !important;
    color: #ffffff !important;
    border-color: #555 !important;
}
```

### 示例 2：渐变主题

```css
/* 渐变主题 */
.app {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.chat {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px) !important;
}

.sidebar {
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%) !important;
}

.message .content {
    background: linear-gradient(135deg, #ffffff 0%, #f5f5fa 100%) !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2) !important;
}

.message.self .content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: #ffffff !important;
}

.component-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
}
```

### 示例 3：圆角卡片风格

```css
/* 圆角卡片风格 */
.message .content {
    border-radius: 20px !important;
    padding: 12px 18px !important;
}

.message.self .content {
    border-radius: 20px !important;
}

.chatInput .input {
    border-radius: 25px !important;
    padding: 12px 20px !important;
}

.component-button {
    border-radius: 25px !important;
    padding: 12px 30px !important;
}

.rc-dialog {
    border-radius: 20px !important;
}
```

### 示例 4：动画增强

```css
/* 添加丰富的动画效果 */

/* 消息出现动画 */
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.message {
    animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* 按钮点击动画 */
@keyframes buttonPulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.95);
    }
}

.component-button:active {
    animation: buttonPulse 0.2s ease !important;
}

/* 输入框聚焦动画 */
@keyframes inputGlow {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
    }
    50% {
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
    }
}

.chatInput .input:focus {
    animation: inputGlow 2s infinite !important;
}
```

---

## 常用类名速查表

> **说明**：
> - ✅ **稳定选择器**：已确认存在且不会被 hash，可直接使用
> - ⚠️ **需要验证**：可能存在但建议用开发者工具确认
> - ❌ **不推荐**：过于宽泛或可能误伤其他元素

| 类名 | 说明 | 状态 |
|------|------|------|
| `.app` | 应用根容器 | ✅ 稳定 |
| `.blur` | 模糊背景层（毛玻璃底图层） | ✅ 稳定 |
| `.child` | 主内容容器（聊天窗口外框） | ✅ 稳定 |
| `.chat` | 聊天区域 | ✅ 稳定 |
| `.sidebar` | 侧边栏 | ✅ 稳定 |
| `.buttons` | 侧边栏按钮容器 | ✅ 稳定 |
| `.avatar` | 头像（在消息/侧边栏等位置都可能出现） | ✅ 稳定 |
| `.headerBar` | 聊天头部栏 | ✅ 稳定 |
| `.message` | 消息容器 | ✅ 稳定 |
| `.message.self` | 自己发送的消息 | ✅ 稳定 |
| `.message .right` | 消息右侧内容区域 | ✅ 稳定 |
| `.message .nicknameTimeBlock` | 消息昵称和时间块 | ✅ 稳定 |
| `.message .contentButtonBlock` | 消息内容和按钮块 | ✅ 稳定 |
| `.message .content` | 消息气泡 | ✅ 稳定 |
| `.message .arrow` | 消息气泡箭头 | ✅ 稳定 |
| `.message .nickname` | 消息昵称 | ✅ 稳定 |
| `.message .time` | 消息时间 | ✅ 稳定 |
| `.message .buttonList` | 消息操作按钮列表 | ✅ 稳定 |
| `.message .button` | 消息操作按钮 | ✅ 稳定 |
| `.chatInput` | 聊天输入框容器 | ✅ 稳定 |
| `.chatInput .input` | 输入框 | ✅ 稳定 |
| `.chatInput .form` | 输入框表单容器 | ✅ 稳定 |
| `.chatInput .iconButton` | 输入框图标按钮 | ✅ 稳定 |
| `.iconButton` | 图标按钮（表情/发送/功能等） | ✅ 稳定 |
| `.component-button` | 通用按钮（需限制作用域） | ⚠️ 需限制 |
| `.component-input` | 通用输入框（需限制作用域） | ⚠️ 需限制 |
| `.functionBarAndLinkmanList` | 左侧联系人区域外层 | ✅ 稳定 |
| `.container` | 左侧联系人区域内层容器 | ✅ 稳定 |
| `.linkmanList` | 联系人列表 | ✅ 稳定 |
| `.rc-dialog` | 对话框（需限制作用域） | ⚠️ 需限制 |
| `.rc-dialog-wrap` | 对话框包裹层（需限制作用域） | ⚠️ 需限制 |
| `.tag` | 用户标签（铭牌） | ✅ 稳定 |
| `.headerBar .buttonContainer` | 头部栏按钮容器（移动端专用，Web 端不存在） | ❌ 移动端 |
| `.sidebar .status` | 侧边栏在线状态指示器 | ✅ 稳定 |
| `.noLinkman` | 无联系人提示区域 | ⚠️ 需验证 |
| `.noLinkmanImage` | 无联系人图片 | ⚠️ 需验证 |
| `.noLinkmanText` | 无联系人文字 | ⚠️ 需验证 |
| `.sidebar .tabs` | 侧边栏标签页 | ❌ 不存在 |

### 管理员相关（稳定选择器）

以下选择器用于定位管理员 UI（**仅用于美化**，无法用于隐藏/禁用交互）：

- `#admin-entry`：侧边栏管理员入口按钮（稳定 id）
- `.admin-console-dialog`：管理员控制台弹窗本体（稳定 class）
- `.admin-console-wrap`：管理员控制台弹窗 wrap（稳定 class）

---

## 快速修复清单

如果您的 CSS 出现问题，请按以下顺序检查：

### ✅ 检查清单

1. **是否使用了稳定选择器？**
   - [ ] 使用了文档中列出的稳定选择器（如 `.app`, `.chat`, `.message` 等）
   - [ ] 没有使用可能被 hash 的 CSS Modules 类名

2. **是否限制了作用域？**
   - [ ] 主要规则都限制在 `.app` 内（如 `.app .chat { ... }`）
   - [ ] 没有使用过于宽泛的选择器（如 `button`, `input`, `*`）

3. **是否避免了受保护 UI？**
   - [ ] 没有尝试隐藏管理员入口（`#admin-entry`）
   - [ ] 没有尝试隐藏管理员控制台（`.admin-console-wrap`）

4. **⚠️ 是否修改了布局属性？**
   - [ ] **没有修改** `.app`, `.child`, `.sidebar`, `.functionBarAndLinkmanList`, `.chat` 的 `position`, `display`, `flex` 等布局属性
   - [ ] **没有修改** `z-index` 导致遮挡关系错误
   - [ ] 布局正常，元素位置和遮挡关系正确

5. **是否测试了所有功能？**
   - [ ] 弹窗（设置、管理员控制台等）能正常打开和关闭
   - [ ] 按钮和输入框能正常交互
   - [ ] 消息能正常发送和显示
   - [ ] 侧边栏、联系人列表、聊天区域位置正常

6. **是否检查了浏览器控制台？**
   - [ ] 没有 JavaScript 错误
   - [ ] 没有 CSS 解析错误

### 🔧 快速修复步骤

1. **清除自定义 CSS**：在设置中清空 CSS 文本框并点击"应用"
2. **硬刷新页面**：按 `Ctrl+F5`（Windows/Linux）或 `Cmd+Shift+R`（Mac）
3. **逐步添加 CSS**：每次只添加一小部分，确认没问题后再继续
4. **使用开发者工具**：按 `F12` 检查元素的实际 class 名称

---

## 常见问题排查

### 问题 1：CSS 应用后没有效果

**可能原因：**
1. **选择器不存在或已被 hash**：Fiora 使用 CSS Modules，很多类名会被 hash
   - ✅ **解决**：使用文档中列出的“稳定选择器”（见“常用类名速查表”）
   - ✅ **验证**：打开开发者工具（F12），检查元素的实际 class 名称

2. **优先级不够**：默认样式优先级较高
   - ✅ **解决**：在需要覆盖的属性后添加 `!important`

3. **选择器过于宽泛，被其他规则覆盖**
   - ✅ **解决**：使用更具体的选择器，例如 `.app .chat { ... }` 而不是 `.chat { ... }`

4. **浏览器缓存**：修改后没有刷新
   - ✅ **解决**：按 `Ctrl+F5`（Windows/Linux）或 `Cmd+Shift+R`（Mac）硬刷新

### 问题 2：CSS 影响了不该影响的元素

**典型症状：**
- 弹窗内的按钮样式被改变
- 下拉菜单无法正常显示
- 某些交互功能失效

**常见错误写法：**
```css
/* ❌ 错误：过于宽泛，会影响所有按钮（包括弹窗内、下拉菜单等） */
button {
    background: red !important;
}

/* ❌ 错误：会影响所有弹窗（包括管理员控制台） */
.rc-dialog-wrap {
    background: black !important;
}

/* ❌ 错误：会影响所有输入框（包括弹窗内） */
input[type="text"] {
    border: 2px solid red !important;
}
```

**正确写法：**
```css
/* ✅ 正确：限制在应用内，只影响聊天输入框 */
.app .chatInput .input {
    border: 2px solid red !important;
}

/* ✅ 正确：只影响特定区域的按钮 */
.app .chatInput .iconButton {
    background: red !important;
}

/* ✅ 正确：只影响设置对话框（需要更具体的选择器） */
.app .rc-dialog-wrap:has(.rc-dialog-title:contains("设置")) {
    background: rgba(0, 0, 0, 0.5) !important;
}
```

### 问题 3：动画导致性能问题

**症状：**
- 页面卡顿
- 滚动不流畅
- CPU/GPU 占用高

**常见问题：**
```css
/* ❌ 错误：在根容器上使用复杂动画，影响整个页面 */
.app {
    animation: gradientShift 15s ease infinite !important;
    background-size: 200% 200% !important;
}

/* ❌ 错误：每个消息都有动画，消息多时性能差 */
.message {
    animation: fadeInUp 0.4s !important;
}
```

**优化建议：**
```css
/* ✅ 正确：使用 `will-change` 提示浏览器优化 */
.app {
    will-change: background-position !important;
    animation: gradientShift 15s ease infinite !important;
}

/* ✅ 正确：限制动画数量，或使用 `prefers-reduced-motion` 媒体查询 */
@media (prefers-reduced-motion: no-preference) {
    .message {
        animation: fadeInUp 0.4s !important;
    }
}

/* ✅ 正确：只对可见区域的消息应用动画（需要 JS 配合） */
.message.visible {
    animation: fadeInUp 0.4s !important;
}
```

### 问题 4：某些选择器找不到元素

**症状：**
- CSS 规则不生效
- 开发者工具中找不到对应的元素

**可能原因：**
1. **类名不存在**：例如 `.sidebar .tabs` 在 Fiora 中不存在
   - ✅ **解决**：使用开发者工具检查实际 DOM 结构
   - ✅ **参考**：查看本文档的“常用类名速查表”

2. **元素是动态生成的**：某些元素只在特定条件下才渲染
   - ✅ **解决**：使用条件选择器或等待元素出现后再应用样式

3. **元素在弹窗内**：弹窗可能使用 Portal，不在 `.app` 内
   - ✅ **解决**：对弹窗使用更具体的选择器，例如 `.rc-dialog-wrap .rc-dialog`

### 问题 5：管理员控制台无法关闭

**症状：**
- 点击关闭按钮后，弹窗仍然显示

**原因：**
- 自定义 CSS 中的保护规则过于激进，阻止了弹窗的正常关闭逻辑

**解决：**
- 管理员控制台有内置保护机制，**不要尝试用 CSS 隐藏它**
- 如果遇到关闭问题，请清除自定义 CSS 后重试
- 如果问题持续，请检查是否有其他 CSS 规则影响了 `.admin-console-wrap` 的 `aria-hidden` 属性

### 问题 6：元素位置以及遮挡关系错误 ⚠️

**症状：**
- 侧边栏、联系人列表、聊天区域位置错乱
- 元素重叠或遮挡
- 布局完全错位

**常见错误原因：**

1. **修改了关键容器的布局属性**
   ```css
   /* ❌ 错误：修改了 .app 的布局属性 */
   .app {
       position: relative !important;  /* 会破坏布局 */
       display: block !important;      /* 会破坏布局 */
   }
   
   /* ❌ 错误：修改了 .child 的定位方式 */
   .child {
       position: relative !important;  /* 应该是 absolute */
       display: block !important;      /* 应该是 flex */
   }
   
   /* ❌ 错误：修改了 .sidebar 的布局 */
   .sidebar {
       position: absolute !important;  /* 应该是 relative */
       display: block !important;       /* 应该是 flex */
   }
   ```

2. **修改了 z-index 导致遮挡关系错误**
   ```css
   /* ❌ 错误：随意修改 z-index */
   .sidebar {
       z-index: 9999 !important;  /* 可能导致遮挡其他元素 */
   }
   ```

3. **修改了 flex 相关属性**
   ```css
   /* ❌ 错误：修改了 flex 布局 */
   .child {
       flex-direction: column !important;  /* 会破坏水平布局 */
   }
   
   .chat {
       flex: 0 !important;  /* 会破坏聊天区域的尺寸 */
   }
   ```

**正确的做法：**

1. **只修改视觉样式，不修改布局属性**
   ```css
   /* ✅ 正确：只修改背景、颜色、圆角等视觉样式 */
   .app {
       background: linear-gradient(...) !important;
       font-family: ... !important;
   }
   
   .child {
       border-radius: 20px !important;
       box-shadow: ... !important;
   }
   
   /* ✅ 正确：只修改尺寸（但要谨慎） */
   .sidebar {
       width: 100px !important;  /* 可以修改宽度 */
   }
   
   .functionBarAndLinkmanList {
       width: 320px !important;  /* 可以修改宽度 */
   }
   ```

2. **不要修改以下关键布局属性：**
   - ❌ `position`（`.app`, `.child`, `.blur`, `.sidebar`, `.functionBarAndLinkmanList`, `.chat`）
   - ❌ `display`（`.child`, `.sidebar`, `.functionBarAndLinkmanList`, `.chat`）
   - ❌ `flex` / `flex-direction` / `flex-wrap`（`.child`, `.sidebar`, `.chat`）
   - ❌ `z-index`（除非你明确知道在做什么）
   - ❌ `overflow`（`.app` 的 `overflow: hidden` 是必需的）

3. **排查步骤：**
   ```javascript
   // 在浏览器控制台检查布局属性
   
   // 检查 .app
   const app = document.querySelector('.app');
   console.log('app position:', getComputedStyle(app).position);
   console.log('app display:', getComputedStyle(app).display);
   console.log('app overflow:', getComputedStyle(app).overflow);
   
   // 检查 .child
   const child = document.querySelector('.child');
   console.log('child position:', getComputedStyle(child).position);
   console.log('child display:', getComputedStyle(child).display);
   
   // 检查 .sidebar
   const sidebar = document.querySelector('.sidebar');
   console.log('sidebar position:', getComputedStyle(sidebar).position);
   console.log('sidebar display:', getComputedStyle(sidebar).display);
   ```

4. **修复方法：**
   - **立即清除自定义 CSS**：在设置中清空 CSS 文本框并点击"应用"
   - **硬刷新页面**：按 `Ctrl+F5` 清除缓存
   - **逐步添加 CSS**：每次只添加一小部分，确认布局正常后再继续
   - **避免修改布局属性**：只修改 `background`, `color`, `border-radius`, `box-shadow`, `width`, `height`（尺寸）等视觉属性

**关键布局结构说明：**

```
.app (根容器)
  ├─ .blur (模糊背景层，position: absolute)
  └─ .child (主内容容器，position: absolute, display: flex)
      ├─ .sidebar (侧边栏，position: relative, display: flex)
      ├─ .functionBarAndLinkmanList (联系人区域，position: relative, display: flex)
      └─ .chat (聊天区域，flex: 1, display: flex)
```

**重要提示：**
- `.child` 使用 `position: absolute` 和 `display: flex` 来定位和布局
- `.sidebar` 和 `.functionBarAndLinkmanList` 使用 `position: relative` 和 `display: flex`
- `.chat` 使用 `flex: 1` 来占据剩余空间
- **修改这些属性会导致布局完全错乱**

---

## 调试技巧

### 1. 使用浏览器开发者工具

**步骤：**
1. 按 `F12` 打开开发者工具
2. 点击左上角的“选择元素”图标（或按 `Ctrl+Shift+C`）
3. 点击页面上想要修改的元素
4. 在右侧“样式”面板中查看：
   - 实际应用的 CSS 规则
   - 哪些规则被覆盖（显示为删除线）
   - 元素的完整 class 列表

**示例：**
```
实际 DOM：
<div class="message self Message_message_abc123">
  <div class="right Message_right_def456">
    ...
  </div>
</div>

稳定选择器（推荐）：
.message.self { ... }
.message .right { ... }

CSS Modules 选择器（不推荐，会随构建变化）：
.Message_message_abc123 { ... }
```

### 2. 验证选择器是否存在

在浏览器控制台（Console）中运行：

```javascript
// 检查元素是否存在
document.querySelector('.message') !== null  // true 表示存在

// 检查有多少个匹配的元素
document.querySelectorAll('.message').length

// 查看元素的实际 class
document.querySelector('.message').className

// 检查稳定选择器是否可用
document.querySelector('.app .chat') !== null
```

### 3. 逐步测试 CSS

**建议流程：**
1. **先写一个简单的规则测试**，例如：
   ```css
   .app {
       background: red !important;
   }
   ```
2. **确认生效后**，再逐步添加更复杂的规则
3. **每次添加后刷新页面**，确认没有破坏其他功能
4. **保存备份**：在应用大量 CSS 前，先复制一份到文本编辑器

### 4. 使用 CSS 变量便于调试

```css
/* 定义变量 */
:root {
    --my-primary-color: #6366f1;
    --my-border-radius: 12px;
}

/* 使用变量 */
.app .chat {
    background: var(--my-primary-color) !important;
    border-radius: var(--my-border-radius) !important;
}

/* 调试时只需修改变量值 */
```

---

## 选择器使用最佳实践

### ✅ 推荐做法

1. **限制作用域到 `.app` 内**
   ```css
   .app .chat { ... }        /* ✅ 好 */
   .chat { ... }             /* ⚠️ 可能误伤 */
   ```

2. **使用稳定选择器**
   ```css
   .app .message.self { ... }           /* ✅ 好 */
   .app .Message_self_abc123 { ... }    /* ❌ 会被 hash，不推荐 */
   ```

3. **组合使用稳定选择器**
   ```css
   .app .chatInput .input { ... }      /* ✅ 好：具体且稳定 */
   .app input { ... }                  /* ⚠️ 可能误伤其他输入框 */
   ```

4. **对弹窗使用更具体的选择器**
   ```css
   /* ✅ 好：只影响设置对话框 */
   .app .rc-dialog-wrap:has(.rc-dialog-title) {
       ...
   }
   
   /* ❌ 错误：会影响所有弹窗（包括管理员控制台） */
   .rc-dialog-wrap {
       ...
   }
   ```

### ❌ 避免的做法

1. **过于宽泛的选择器**
   ```css
   * { ... }                    /* ❌ 影响所有元素 */
   button { ... }               /* ❌ 影响所有按钮 */
   [role="button"] { ... }      /* ❌ 影响所有可点击元素 */
   input { ... }                /* ❌ 影响所有输入框 */
   ```

2. **依赖 CSS Modules 的 hash 类名**
   ```css
   .Message_message_abc123 { ... }  /* ❌ hash 会变化 */
   ```

3. **直接修改受保护 UI**
   ```css
   #admin-entry {
       display: none !important;  /* ❌ 无效，且可能导致问题 */
   }
   ```

4. **修改关键布局属性（⚠️ 会导致位置和遮挡关系错误）**
   ```css
   /* ❌ 错误：修改布局属性 */
   .app {
       position: relative !important;  /* ❌ 会破坏布局 */
       display: block !important;      /* ❌ 会破坏布局 */
   }
   
   .child {
       position: relative !important;  /* ❌ 应该是 absolute */
       display: block !important;       /* ❌ 应该是 flex */
   }
   
   .sidebar {
       position: absolute !important;  /* ❌ 应该是 relative */
       display: block !important;      /* ❌ 应该是 flex */
   }
   
   .chat {
       flex: 0 !important;  /* ❌ 会破坏聊天区域的尺寸 */
   }
   
   /* ✅ 正确：只修改视觉样式 */
   .app {
       background: ... !important;  /* ✅ 可以 */
   }
   
   .child {
       border-radius: 20px !important;  /* ✅ 可以 */
   }
   ```

5. **在根元素上使用复杂动画**
   ```css
   .app {
       animation: complexAnimation 1s infinite !important;  /* ⚠️ 可能影响性能 */
   }
   ```

---

## 问题示例分析

以下是一份用户提供的 CSS 中可能存在的问题：

### 示例 1：过于宽泛的按钮选择器

```css
/* ❌ 问题代码 */
.component-button,
button,
[role="button"] {
    background: linear-gradient(...) !important;
    ...
}
```

**问题：**
- 会影响所有按钮，包括弹窗内的确认/取消按钮、下拉菜单按钮等
- 可能导致某些交互功能样式异常

**修复建议：**
```css
/* ✅ 修复后 */
.app .component-button {
    background: linear-gradient(...) !important;
    ...
}

/* 如果需要影响特定区域的按钮，使用更具体的选择器 */
.app .chatInput .iconButton {
    ...
}
```

### 示例 2：影响所有弹窗的选择器

```css
/* ❌ 问题代码 */
.rc-dialog-wrap {
    background: rgba(15, 23, 42, 0.85) !important;
    ...
}
```

**问题：**
- 会影响所有弹窗，包括管理员控制台、设置对话框等
- 可能与内置的保护机制冲突

**修复建议：**
```css
/* ✅ 修复后：排除管理员控制台 */
.rc-dialog-wrap:not(.admin-console-wrap) {
    background: rgba(15, 23, 42, 0.85) !important;
    ...
}

/* 或者更具体地指定目标弹窗 */
.app .rc-dialog-wrap:has(.rc-dialog-title:contains("设置")) {
    ...
}
```

### 示例 3：不存在的选择器

```css
/* ❌ 问题代码 */
.sidebar .tabs {
    margin-top: 50px !important;
    ...
}
```

**问题：**
- `.sidebar .tabs` 在 Fiora 中不存在
- 该规则不会生效，但也不会报错

**修复建议：**
```css
/* ✅ 修复后：使用实际存在的选择器 */
.sidebar .buttons {
    margin-top: 50px !important;
    ...
}
```

### 示例 4：性能问题的动画

```css
/* ❌ 问题代码 */
.app {
    animation: gradientShift 15s ease infinite !important;
    background-size: 200% 200% !important;
}

.child {
    animation: floating 6s ease-in-out infinite !important;
}
```

**问题：**
- 在根容器上使用动画会影响整个页面性能
- 多个元素同时动画可能导致卡顿

**修复建议：**
```css
/* ✅ 修复后：添加性能优化提示 */
.app {
    will-change: background-position !important;
    animation: gradientShift 15s ease infinite !important;
    background-size: 200% 200% !important;
}

/* 或者使用 prefers-reduced-motion 尊重用户偏好 */
@media (prefers-reduced-motion: no-preference) {
    .child {
        animation: floating 6s ease-in-out infinite !important;
    }
}
```

### 示例 5：移动端专用选择器

```css
/* ❌ 错误：移动端专用选择器，Web 端不存在 */
.headerBar .buttonContainer { ... }  /* 仅在移动端仓库中存在 */
```

**说明：**
- `.headerBar .buttonContainer` 是移动端专用的选择器，Web 端不存在
- 如果您的 CSS 中包含此类选择器，请删除或替换为 Web 端实际存在的选择器
- 移动端由另一个仓库实现，不在本文档范围内

### 示例 6：可能不存在的选择器

```css
/* ⚠️ 需要验证的选择器 */
.noLinkmanImage { ... }              /* 需要确认是否存在 */
.noLinkmanText { ... }               /* 需要确认是否存在 */
```

**建议：**
- 使用开发者工具验证这些选择器是否存在
- 如果不存在，删除相关规则或使用实际存在的选择器

---

## 注意事项

1. **使用 `!important`**：由于默认样式可能使用较高优先级，建议在需要覆盖的地方使用 `!important`
2. **测试兼容性**：某些 CSS 特性（如 `backdrop-filter`）可能不被所有浏览器支持
3. **性能考虑**：过多的动画和复杂的选择器可能影响性能
4. **备份原始 CSS**：在应用大量自定义 CSS 前，建议先备份
5. **逐步测试**：不要一次性应用大量 CSS，建议逐步添加并测试
6. **尊重用户偏好**：使用 `prefers-reduced-motion` 媒体查询，为不喜欢动画的用户提供选项
7. **仅适用于 Web 桌面端**：本文档仅适用于 Web 桌面端，移动端由另一个仓库实现

---

## 获取更多帮助

如果您需要更多帮助或发现新的可自定义元素，可以：
1. 使用浏览器开发者工具（F12）检查元素
2. 查看源代码中的 `.less` 文件
3. 参考本文档的类名速查表
4. 按照“调试技巧”章节逐步排查问题

祝您自定义愉快！🎨

