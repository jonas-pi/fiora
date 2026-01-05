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
10. [响应式设计](#响应式设计)
11. [高级技巧](#高级技巧)
12. [完整示例](#完整示例)

---

## 基础说明

### 如何使用

1. 打开设置面板（点击侧边栏的设置图标）
2. 切换到"自定义CSS"标签页
3. 在文本框中粘贴您的 CSS 代码
4. 点击"应用"按钮使更改生效
5. 如需清除，清空文本框后点击"应用"

### 推荐写法（强烈建议）

1. **尽量把所有规则“限制在 `.app` 内”**，例如 `.app .chat { ... }`  
   - 好处：不会误伤浏览器插件注入的 DOM、rc-dialog 内部结构或其它页面元素
2. **优先用“稳定选择器”**（见下文“常用类名速查表”）  
   - Fiora Web 使用了 CSS Modules，很多 `.less` 里声明的类在运行时会被 hash
   - 但我们已为核心区域补了“稳定 class”（不带 hash），用户自定义 CSS 请优先使用这些
3. **避免写过于宽泛的选择器**  
   - 不推荐：`* { ... }`、`[role="button"] { ... }`、`.rc-dialog-wrap { ... }`
   - 这些很容易把按钮、弹窗、下拉菜单等交互组件“写坏”

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
/* 整个应用容器 */
.app {
    /* 可以设置整体背景、字体等 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    font-family: 'Microsoft YaHei', sans-serif !important;
}

/* 毛玻璃效果容器（当启用毛玻璃时） */
.blur {
    /* 背景模糊层 */
    filter: blur(10px) !important;
}

.child {
    /* 主要内容容器 */
    border-radius: 15px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
}
```

---

## 布局和容器

### 主布局结构

```css
/* 功能栏和联系人列表容器 */
.functionBarAndLinkmanList {
    width: 300px !important;
    background-color: #2c3e50 !important;
}

/* 联系人列表容器 */
.container {
    background-color: #34495e !important;
}

/* 联系人列表 */
.linkmanList {
    /* 滚动条样式 */
    scrollbar-width: thin !important;
    scrollbar-color: #3498db #2c3e50 !important;
}

/* 聊天区域 */
.chat {
    background-color: rgba(245, 245, 250, 0.95) !important;
    border-top-right-radius: 15px !important;
    border-bottom-right-radius: 15px !important;
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

## 响应式设计

### 移动端适配

```css
/* 移动端样式（屏幕宽度小于 500px） */
@media only screen and (max-width: 500px) {
    /* 调整聊天区域 */
    .chat {
        border-radius: 0 !important;
    }
    
    /* 调整侧边栏 */
    .sidebar {
        width: 60px !important;
        border-radius: 0 !important;
    }
    
    /* 调整消息字体 */
    .message .content {
        font-size: 14px !important;
        padding: 8px 12px !important;
    }
    
    /* 调整输入框 */
    .chatInput {
        height: 50px !important;
        padding: 0 10px !important;
    }
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

| 类名 | 说明 |
|------|------|
| `.app` | 应用根容器 |
| `.blur` | 模糊背景层（毛玻璃底图层） |
| `.child` | 主内容容器（聊天窗口外框） |
| `.chat` | 聊天区域 |
| `.sidebar` | 侧边栏 |
| `.buttons` | 侧边栏按钮容器 |
| `.avatar` | 头像（在消息/侧边栏等位置都可能出现） |
| `.headerBar` | 聊天头部栏 |
| `.message` | 消息容器 |
| `.message.self` | 自己发送的消息 |
| `.message .content` | 消息气泡 |
| `.message .arrow` | 消息气泡箭头 |
| `.message .nickname` | 消息昵称 |
| `.message .time` | 消息时间 |
| `.chatInput` | 聊天输入框容器 |
| `.chatInput .input` | 输入框 |
| `.form` | 输入框表单容器 |
| `.iconButton` | 图标按钮（表情/发送/功能等） |
| `.component-button` | 通用按钮 |
| `.component-input` | 通用输入框 |
| `.functionBarAndLinkmanList` | 左侧联系人区域外层 |
| `.container` | 左侧联系人区域内层容器 |
| `.linkmanList` | 联系人列表 |
| `.rc-dialog` | 对话框 |
| `.tag` | 用户标签（铭牌） |

### 管理员相关（稳定选择器）

以下选择器用于定位管理员 UI（**仅用于美化**，无法用于隐藏/禁用交互）：

- `#admin-entry`：侧边栏管理员入口按钮（稳定 id）
- `.admin-console-dialog`：管理员控制台弹窗本体（稳定 class）
- `.admin-console-wrap`：管理员控制台弹窗 wrap（稳定 class）

---

## 注意事项

1. **使用 `!important`**：由于默认样式可能使用较高优先级，建议在需要覆盖的地方使用 `!important`
2. **测试兼容性**：某些 CSS 特性（如 `backdrop-filter`）可能不被所有浏览器支持
3. **性能考虑**：过多的动画和复杂的选择器可能影响性能
4. **响应式设计**：记得为移动端添加媒体查询
5. **备份原始 CSS**：在应用大量自定义 CSS 前，建议先备份

---

## 获取更多帮助

如果您需要更多帮助或发现新的可自定义元素，可以：
1. 使用浏览器开发者工具（F12）检查元素
2. 查看源代码中的 `.less` 文件
3. 参考本文档的类名速查表

祝您自定义愉快！🎨

