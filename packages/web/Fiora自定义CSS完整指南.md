# Fiora 自定义 CSS 完整指南

> 🎨 像 Jellyfin 一样，Fiora 支持高度自由的 CSS 自定义，让您的聊天界面独一无二！

## ⚡ 快速导航

- **新手入门** → [快速开始](#快速开始)
- **主题定制** → [CSS变量体系](#css变量体系)
- **高级定制** → [稳定选择器](#稳定选择器)
- **示例参考** → [完整示例主题](#示例主题)
- **问题排查** → [常见问题](#常见问题)

## 📚 目录

1. [快速开始](#快速开始)
2. [CSS变量体系](#css变量体系)
3. [稳定选择器](#稳定选择器)
4. [安全限制](#安全限制)
5. [完整示例主题](#示例主题)
6. [常用类名速查](#常用类名速查)
7. [常见问题](#常见问题)
8. [进阶技巧](#进阶技巧)

---

## 快速开始

### 方式一：使用CSS变量（推荐）

这是最简单、最稳定的方式。只需重定义CSS变量即可改变主题：

```css
:root {
    /* 改变主色调 */
    --fiora-primary-color: #ff6b6b;
    
    /* 改变背景色 */
    --fiora-bg-primary: #1e1e1e;
    --fiora-chat-bg: #252525;
    
    /* 改变文字颜色 */
    --fiora-text-primary: #ffffff;
}
```

### 方式二：使用稳定选择器

针对特定元素进行样式定制：

```css
/* 联系人列表 */
[data-fiora="linkman-list"] {
    background: #2c2c2c;
}

/* 消息气泡 */
[data-fiora="message-self"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## CSS变量体系

### 颜色变量

#### 主色调
```css
--fiora-primary-color          /* 主色 */
--fiora-primary-hover          /* 主色悬停 */
--fiora-primary-active         /* 主色激活 */
```

#### 背景色
```css
--fiora-bg-primary             /* 主要背景 */
--fiora-bg-secondary           /* 次要背景 */
--fiora-bg-tertiary            /* 第三级背景 */
--fiora-bg-overlay             /* 遮罩层背景 */
```

#### 文字颜色
```css
--fiora-text-primary           /* 主要文字 */
--fiora-text-secondary         /* 次要文字 */
--fiora-text-tertiary          /* 第三级文字 */
--fiora-text-inverse           /* 反色文字 */
```

#### 组件特定变量
```css
/* 侧边栏 */
--fiora-sidebar-bg
--fiora-sidebar-icon-color
--fiora-sidebar-icon-hover
--fiora-sidebar-icon-active

/* 联系人列表 */
--fiora-linkman-list-bg
--fiora-linkman-item-bg
--fiora-linkman-item-hover-bg
--fiora-linkman-item-active-bg
--fiora-linkman-name-color
--fiora-linkman-preview-color
--fiora-linkman-time-color

/* 聊天区域 */
--fiora-chat-bg
--fiora-chat-header-bg
--fiora-chat-input-bg

/* 消息气泡 */
--fiora-message-self-bg        /* 自己发送的消息背景 */
--fiora-message-self-text      /* 自己发送的消息文字 */
--fiora-message-other-bg       /* 他人发送的消息背景 */
--fiora-message-other-text     /* 他人发送的消息文字 */
--fiora-message-time-color     /* 消息时间颜色 */

/* 弹窗 */
--fiora-dialog-bg
--fiora-dialog-mask-bg
--fiora-dialog-header-bg
--fiora-dialog-border
```

### 尺寸变量

```css
/* 容器 */
--fiora-container-width: 95%;
--fiora-container-max-width: 1200px;
--fiora-container-height: 85vh;

/* 宽度 */
--fiora-sidebar-width: 60px;
--fiora-linkman-list-width: 280px;

/* 圆角 */
--fiora-border-radius-sm: 4px;
--fiora-border-radius-md: 8px;
--fiora-border-radius-lg: 12px;
--fiora-border-radius-xl: 16px;
```

### 动画变量

```css
/* 时长 */
--fiora-transition-fast: 0.15s;
--fiora-transition-base: 0.3s;
--fiora-transition-slow: 0.5s;

/* 曲线 */
--fiora-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--fiora-ease-out: cubic-bezier(0, 0, 0.2, 1);
--fiora-ease-in: cubic-bezier(0.4, 0, 1, 1);
```

---

## 稳定选择器

为了让用户CSS更稳定，Fiora为关键元素添加了 `data-fiora` 属性：

### 主要容器

```css
[data-fiora="app"]              /* 应用根容器 */
[data-fiora="main-container"]   /* 主容器 */
[data-fiora="sidebar"]          /* 侧边栏 */
[data-fiora="linkman-area"]     /* 联系人区域 */
[data-fiora="chat-area"]        /* 聊天区域 */
```

### 联系人列表

```css
[data-fiora="linkman-list"]     /* 联系人列表容器 */
[data-fiora="linkman-item"]     /* 联系人条目 */
[data-fiora="linkman-avatar"]   /* 联系人头像 */
[data-fiora="linkman-name"]     /* 联系人名称 */
[data-fiora="linkman-preview"]  /* 消息预览 */
[data-fiora="linkman-time"]     /* 消息时间 */
[data-fiora="linkman-unread"]   /* 未读数badge */
```

### 聊天区域

```css
[data-fiora="chat-header"]      /* 聊天头部 */
[data-fiora="message-list"]     /* 消息列表 */
[data-fiora="message-item"]     /* 消息条目 */
[data-fiora="message-self"]     /* 自己的消息 */
[data-fiora="message-other"]    /* 他人的消息 */
[data-fiora="message-avatar"]   /* 消息头像 */
[data-fiora="message-content"]  /* 消息内容 */
[data-fiora="message-time"]     /* 消息时间 */
[data-fiora="chat-input"]       /* 输入框区域 */
```

### 弹窗

```css
[data-fiora="dialog"]           /* 弹窗容器 */
[data-fiora="dialog-mask"]      /* 弹窗遮罩 */
[data-fiora="dialog-header"]    /* 弹窗标题栏 */
[data-fiora="dialog-body"]      /* 弹窗内容 */
[data-fiora="dialog-footer"]    /* 弹窗底部 */
```

---

## 安全限制

Fiora 实施了**十层安全过滤机制**，确保您的CSS安全可靠：

### 🛡️ 安全机制（十层防护）

| 层级 | 防护内容 | 说明 |
|-----|---------|------|
| 1️⃣ | **长度限制** | 最大500KB，防止DOS攻击 |
| 2️⃣ | **HTML标签过滤** | 移除`<script>`、`<iframe>`等标签 |
| 3️⃣ | **危险协议阻断** | 阻止`javascript:`、`vbscript:`、`data:text/html` |
| 4️⃣ | **表达式过滤** | 移除`expression()`、`eval()` |
| 5️⃣ | **外部脚本阻止** | 禁止`-moz-binding`、`behavior` |
| 6️⃣ | **DOM操作过滤** | 阻止`document.`、`window.`、`alert()` |
| 7️⃣ | **外部@import阻止** | 仅允许同源和data URI |
| 8️⃣ | **外部资源阻止** | 阻止HTTP(S)图片/字体（隐私保护） |
| 9️⃣ | **Unicode欺骗防护** | 移除零宽字符、同形异义字符 |
| 🔟 | **注释长度限制** | 防止超长注释信息泄露 |

### ❌ 被阻止的内容

#### 1. 代码执行尝试
```css
/* 以下全部会被移除 */
background: url(javascript:alert('xss'));
background: url(vbscript:msgbox("xss"));
-moz-binding: url(xss.xml);
behavior: url(xss.htc);
expression(alert('xss'));
```

#### 2. 外部资源加载（隐私保护）
```css
/* 外部HTTP(S)资源会被阻止 */
@import url("https://example.com/style.css");
background: url("https://tracker.com/track.gif"); /* 可能追踪用户 */
@font-face {
    src: url("//cdn.example.com/font.woff"); /* 协议相对URL也被阻止 */
}
```

**为什么阻止外部资源？**
- 🔒 **隐私保护**：防止第三方追踪您的IP地址和使用行为
- 🛡️ **供应链安全**：防止恶意CDN注入代码
- ⚡ **性能保护**：避免外部资源加载失败影响性能

#### 3. HTML标签注入
```css
/* 任何HTML标签都会被移除 */
content: "<script>alert('xss')</script>";
content: "<iframe src='evil.com'></iframe>";
```

#### 4. DOM操作尝试
```css
/* 以下会被阻止 */
content: "document.cookie";
content: "window.location";
content: "eval('code')";
```

### ✅ 允许的内容

#### 1. Data URI（完全安全）
```css
/* ✅ 图片 Data URI */
background: url("data:image/png;base64,iVBORw0KGgoAAAANS...");

/* ✅ SVG Data URI */
background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E...%3C/svg%3E");

/* ✅ 字体 Data URI */
@font-face {
    src: url("data:font/woff2;base64,d09GMgABAAAAA...");
}

/* ✅ CSS Data URI */
@import url("data:text/css;base64,Ym9keSB7...");
```

#### 2. 同源资源（相对/绝对路径）
```css
/* ✅ 绝对路径（同源） */
background: url("/images/bg.png");

/* ✅ 相对路径 */
background: url("./bg.png");
background: url("../images/bg.png");

/* ✅ 同源@import */
@import url("/styles/theme.css");
```

#### 3. 所有标准CSS特性
```css
/* ✅ CSS变量 */
:root {
    --primary-color: #4a90e2;
}

/* ✅ 动画 */
@keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}

/* ✅ 媒体查询 */
@media (max-width: 768px) {
    .container { width: 100%; }
}

/* ✅ 复杂选择器 */
[data-fiora="message-self"]:hover::before {
    content: "👋";
}

/* ✅ Grid/Flexbox */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* ✅ CSS Filter */
.image {
    filter: blur(5px) brightness(0.8);
    backdrop-filter: blur(10px);
}
```

### 🔍 如何检查CSS是否安全？

在浏览器控制台（F12）查看：
```javascript
// 查看过滤后的CSS
const style = document.getElementById('user-custom-css');
console.log(style?.textContent);

// 查看过滤警告
// 被阻止的内容会在控制台输出警告信息
```

### 💡 安全使用建议

1. **优先使用CSS变量**：无需担心选择器稳定性
2. **使用Data URI**：完全内联，无外部请求
3. **避免复制未知来源的CSS**：可能包含恶意代码
4. **定期备份你的CSS**：保存到本地文件
5. **测试后再应用**：先在测试环境验证效果

---

## 示例主题

### 1. 极简深色主题

```css
:root {
    /* 背景 */
    --fiora-bg-primary: #0f0f0f;
    --fiora-bg-secondary: #1a1a1a;
    --fiora-bg-tertiary: #252525;
    
    /* 文字 */
    --fiora-text-primary: #ffffff;
    --fiora-text-secondary: rgba(255, 255, 255, 0.7);
    --fiora-text-tertiary: rgba(255, 255, 255, 0.45);
    
    /* 主色 */
    --fiora-primary-color: #60a5fa;
    
    /* 边框 */
    --fiora-border-color: rgba(255, 255, 255, 0.1);
}

/* 让整个应用使用深色背景 */
[data-fiora="app"] {
    background: #000000;
}

/* 给主容器添加发光效果 */
[data-fiora="main-container"] {
    box-shadow: 
        0 0 60px rgba(96, 165, 250, 0.3),
        0 20px 60px rgba(0, 0, 0, 0.8);
}
```

### 2. 渐变彩色主题

```css
:root {
    --fiora-primary-color: #667eea;
}

/* 侧边栏渐变 */
[data-fiora="sidebar"] {
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

/* 消息气泡渐变 */
[data-fiora="message-self"] [data-fiora="message-content"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* 聊天头部渐变 */
[data-fiora="chat-header"] {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

### 3. 毛玻璃效果主题

```css
:root {
    --fiora-bg-primary: rgba(255, 255, 255, 0.9);
    --fiora-linkman-list-bg: rgba(255, 255, 255, 0.7);
    --fiora-chat-bg: rgba(255, 255, 255, 0.7);
}

/* 整体背景 */
[data-fiora="app"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

/* 毛玻璃效果 */
[data-fiora="main-container"] {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

[data-fiora="linkman-area"],
[data-fiora="chat-area"] {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

/* 消息气泡毛玻璃 */
[data-fiora="message-other"] [data-fiora="message-content"] {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}
```

### 4. 紧凑布局

```css
:root {
    /* 缩小尺寸 */
    --fiora-container-width: 90%;
    --fiora-container-max-width: 1000px;
    --fiora-sidebar-width: 50px;
    --fiora-linkman-list-width: 240px;
    --fiora-linkman-item-padding: 8px;
    --fiora-linkman-avatar-size: 40px;
    
    /* 缩小字体 */
    --fiora-font-size-xs: 11px;
    --fiora-font-size-sm: 13px;
    --fiora-font-size-md: 14px;
}

/* 紧凑的联系人条目 */
[data-fiora="linkman-item"] {
    padding: var(--fiora-linkman-item-padding);
    margin: 4px 8px;
}

/* 紧凑的消息气泡 */
[data-fiora="message-content"] {
    padding: 6px 10px;
    font-size: var(--fiora-font-size-sm);
}
```

---

## 常用类名速查

> 💡 以下类名经过CSS Modules处理可能被hash，建议优先使用 `data-fiora` 属性或 CSS变量

### 📦 主容器

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.app` | 应用根容器 | ⭐⭐⭐ |
| `.child` | 主内容容器 | ⭐⭐⭐ |
| `[data-fiora="main-container"]` | 主容器（稳定） | ⭐⭐⭐⭐⭐ |

### 👤 侧边栏

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.sidebar` | 侧边栏容器 | ⭐⭐⭐ |
| `.sidebar .iconfont` | 侧边栏图标 | ⭐⭐⭐ |
| `[data-fiora="sidebar"]` | 侧边栏（稳定） | ⭐⭐⭐⭐⭐ |
| `#admin-entry` | 管理员入口 | ⭐⭐⭐⭐ |

### 👥 联系人列表

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.functionBarAndLinkmanList` | 联系人区域容器 | ⭐⭐⭐ |
| `.functionBar` | 功能栏（搜索框区域） | ⭐⭐⭐ |
| `.linkmanList` | 联系人列表 | ⭐⭐⭐ |
| `.linkmanList > div` | 联系人条目 | ⭐⭐ |
| `[data-fiora="linkman-area"]` | 联系人区域（稳定） | ⭐⭐⭐⭐⭐ |
| `[data-fiora="linkman-item"]` | 联系人条目（稳定） | ⭐⭐⭐⭐⭐ |

#### 联系人条目细节

```css
/* 联系人头像 */
.linkmanList > div > div:first-child img

/* 联系人名称 */
.linkmanList > div > div:nth-child(2) > div:first-child > p:first-child

/* 消息预览 */
.linkmanList > div > div:nth-child(2) > div:nth-child(2) p

/* 消息时间 */
.linkmanList > div > div:nth-child(2) > div:first-child > p:last-child

/* 未读数badge */
.linkmanList > div > div:nth-child(2) > div:nth-child(2) > div

/* 选中状态 */
.linkmanList > div[class*="focus"]
```

### 💬 聊天区域

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.chat` | 聊天区域容器 | ⭐⭐⭐ |
| `.chat-header` | 聊天头部 | ⭐⭐ |
| `.messageList` | 消息列表 | ⭐⭐⭐ |
| `.message` | 消息条目 | ⭐⭐⭐ |
| `.message.self` | 自己发送的消息 | ⭐⭐⭐⭐ |
| `.message:not(.self)` | 他人发送的消息 | ⭐⭐⭐⭐ |
| `.message .content` | 消息内容气泡 | ⭐⭐⭐⭐ |
| `.message .arrow` | 消息气泡箭头 | ⭐⭐ |
| `[data-fiora="chat-area"]` | 聊天区域（稳定） | ⭐⭐⭐⭐⭐ |
| `[data-fiora="message-self"]` | 自己的消息（稳定） | ⭐⭐⭐⭐⭐ |

### ⌨️ 输入框

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.chatInput` | 输入区域容器 | ⭐⭐⭐ |
| `.chatInput .input` | 输入框 | ⭐⭐⭐ |
| `.chatInput .form` | 输入表单容器 | ⭐⭐ |
| `.chatInput .iconfont.icon-about` | 提示按钮(i) | ⭐⭐⭐⭐ |
| `[data-fiora="chat-input"]` | 输入区域（稳定） | ⭐⭐⭐⭐⭐ |

### 🔲 弹窗

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.rc-dialog-wrap` | 弹窗遮罩层 | ⭐⭐⭐⭐ |
| `.rc-dialog` | 弹窗主体 | ⭐⭐⭐⭐ |
| `.rc-dialog-header` | 弹窗标题栏 | ⭐⭐⭐⭐ |
| `.rc-dialog-body` | 弹窗内容区 | ⭐⭐⭐⭐ |
| `.rc-dialog-close` | 弹窗关闭按钮 | ⭐⭐⭐ |
| `[data-fiora="dialog"]` | 弹窗（稳定） | ⭐⭐⭐⭐⭐ |

**重要提示**：弹窗通过Portal渲染到`body`外，需要直接选择，不能用`.app .rc-dialog`

### 🎨 CSS Modules 注意事项

Fiora使用CSS Modules，某些类名会被hash（如`linkman--3t0ta`）。

**解决方案**：
1. ✅ 使用CSS变量（最稳定）
2. ✅ 使用`data-fiora`属性（未来会添加）
3. ✅ 使用通配符：`[class*="focus"]`
4. ⚠️ 使用结构选择器：`.linkmanList > div`

**示例**：
```css
/* ❌ 不稳定 - class名会变化 */
.linkman--3t0ta {
    background: red;
}

/* ✅ 稳定 - 使用通配符 */
[class*="linkman"] {
    background: red;
}

/* ✅ 稳定 - 使用结构选择器 */
.linkmanList > div {
    background: red;
}

/* ⭐ 最稳定 - 使用CSS变量 */
:root {
    --fiora-linkman-item-bg: red;
}
```

---

## 常见问题

### Q: 为什么我的CSS没有生效？

**A:** 可能的原因：
1. 选择器优先级不够，尝试添加 `!important`
2. 使用了不稳定的CSS Modules类名，请改用 `data-fiora` 属性或CSS变量
3. 浏览器缓存，请 Ctrl+F5 强制刷新

### Q: 如何调试我的自定义CSS？

**A:** 
1. 按 F12 打开浏览器开发者工具
2. 在 Elements 标签中查看元素的 `data-fiora` 属性
3. 在 Console 中运行：
   ```javascript
   // 查看所有Fiora元素
   document.querySelectorAll('[data-fiora]')
   
   // 查看当前CSS变量值
   getComputedStyle(document.documentElement).getPropertyValue('--fiora-primary-color')
   ```

### Q: 如何让弹窗也应用我的主题？

**A:** 弹窗通过Portal渲染，使用CSS变量可以自动应用：
```css
:root {
    --fiora-dialog-bg: #2c2c2c;
    --fiora-text-primary: #ffffff;
}

/* 或直接选择弹窗元素 */
[data-fiora="dialog"] {
    background: #2c2c2c;
    color: #ffffff;
}
```

### Q: 如何保存和分享我的主题？

**A:** 
1. 复制你的CSS代码
2. 保存为 `.css` 文件
3. 分享给其他用户，他们可以直接粘贴到自定义CSS框中

### Q: 我能修改布局吗？

**A:** 可以，但不推荐修改以下属性（可能导致布局错乱）：
- `position`（对于主容器）
- `display: flex` 的方向
- `z-index`（可能影响遮罩层）

推荐修改：
- 宽度、高度（通过CSS变量）
- 内外边距
- 字体、颜色
- 动画效果

### Q: 如何制作动画效果？

**A:** 使用标准CSS动画：
```css
/* 消息入场动画 */
[data-fiora="message-item"] {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 联系人悬停动画 */
[data-fiora="linkman-item"]:hover {
    transform: translateX(5px);
    transition: transform var(--fiora-transition-base) var(--fiora-ease-out);
}
```

---

## 进阶技巧

### 🎯 性能优化

#### 1. 使用CSS变量而非重复定义
```css
/* ❌ 性能差 - 重复定义 */
.header { background: #1e1f22; }
.sidebar { background: #1e1f22; }
.footer { background: #1e1f22; }

/* ✅ 性能好 - 使用变量 */
:root {
    --dark-bg: #1e1f22;
}
.header, .sidebar, .footer {
    background: var(--dark-bg);
}
```

#### 2. 避免过深的选择器
```css
/* ❌ 性能差 - 7层选择器 */
.app .child .chat .messageList .message .content .text {
    color: white;
}

/* ✅ 性能好 - 直接选择 */
.message .text {
    color: white;
}
```

#### 3. 使用will-change提升动画性能
```css
.message {
    /* 提前告知浏览器要动画的属性 */
    will-change: transform, opacity;
    transition: all 0.3s ease;
}

.message:hover {
    transform: translateY(-2px);
}
```

#### 4. 避免触发重排的属性
```css
/* ❌ 触发重排 - 性能差 */
.element:hover {
    width: 150px; /* 改变宽度会重排 */
    padding: 20px; /* 改变内边距会重排 */
}

/* ✅ 仅触发重绘 - 性能好 */
.element:hover {
    transform: scale(1.1); /* 仅重绘 */
    opacity: 0.8; /* 仅重绘 */
}
```

### 🐛 调试技巧

#### 1. 检查CSS是否正确注入
```javascript
// 在浏览器控制台（F12）运行
const customCss = document.getElementById('user-custom-css');
if (customCss) {
    console.log('✅ 自定义CSS已注入');
    console.log('内容长度:', customCss.textContent.length);
    console.log('内容:', customCss.textContent);
} else {
    console.log('❌ 自定义CSS未找到');
}
```

#### 2. 检查CSS变量值
```javascript
// 查看所有Fiora CSS变量
const root = document.documentElement;
const styles = getComputedStyle(root);

// 列出所有以 --fiora- 开头的变量
for (let key of styles) {
    if (key.startsWith('--fiora-')) {
        console.log(key, '=', styles.getPropertyValue(key));
    }
}

// 查看特定变量
console.log('主色调:', styles.getPropertyValue('--fiora-primary-color'));
```

#### 3. 查找元素的data-fiora属性
```javascript
// 查找所有带data-fiora属性的元素
const fioraElements = document.querySelectorAll('[data-fiora]');
console.log(`找到 ${fioraElements.length} 个Fiora元素:`);
fioraElements.forEach(el => {
    console.log('-', el.getAttribute('data-fiora'), el);
});
```

#### 4. 实时修改CSS变量
```javascript
// 临时修改CSS变量测试效果
document.documentElement.style.setProperty('--fiora-primary-color', '#ff6b6b');
document.documentElement.style.setProperty('--fiora-bg-primary', '#1e1e1e');

// 恢复默认
document.documentElement.style.removeProperty('--fiora-primary-color');
```

#### 5. 检查被过滤的内容
```javascript
// 查看控制台警告信息
// 被过滤的内容会输出类似：
// [CSS安全] 阻止外部资源: https://example.com/image.png
```

### 📱 响应式设计

#### 使用媒体查询适配不同屏幕
```css
/* 桌面端（默认） */
:root {
    --fiora-container-width: 95%;
    --fiora-sidebar-width: 70px;
    --fiora-linkman-list-width: 290px;
}

/* 平板（768px-1024px） */
@media (max-width: 1024px) {
    :root {
        --fiora-container-width: 98%;
        --fiora-linkman-list-width: 260px;
    }
}

/* 手机（<768px） */
@media (max-width: 768px) {
    :root {
        --fiora-container-width: 100%;
        --fiora-sidebar-width: 50px;
        --fiora-linkman-list-width: 220px;
        --fiora-font-size-sm: 12px;
    }
    
    /* 在小屏幕上隐藏某些元素 */
    [data-fiora="linkman-preview"] {
        display: none;
    }
}

/* 超大屏幕（>1920px） */
@media (min-width: 1920px) {
    :root {
        --fiora-container-max-width: 1600px;
        --fiora-font-size-md: 18px;
    }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
    :root {
        --fiora-bg-primary: #1e1e1e;
        --fiora-text-primary: #ffffff;
    }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

### 🎨 高级CSS技巧

#### 1. 渐变色文字
```css
.message .content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

#### 2. 毛玻璃效果
```css
[data-fiora="main-container"] {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
}
```

#### 3. 自定义滚动条
```css
/* Webkit浏览器 */
.linkmanList::-webkit-scrollbar {
    width: 8px;
}

.linkmanList::-webkit-scrollbar-track {
    background: #2c2c2c;
}

.linkmanList::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
}

.linkmanList::-webkit-scrollbar-thumb:hover {
    background: #5a5a5a;
}

/* Firefox */
.linkmanList {
    scrollbar-width: thin;
    scrollbar-color: #4a4a4a #2c2c2c;
}
```

#### 4. 3D变换效果
```css
[data-fiora="message-self"] {
    transform-style: preserve-3d;
    perspective: 1000px;
}

[data-fiora="message-self"]:hover {
    transform: rotateY(5deg) rotateX(5deg);
    transition: transform 0.3s ease;
}
```

#### 5. 混合模式
```css
[data-fiora="chat-area"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #667eea, #764ba2);
    opacity: 0.1;
    mix-blend-mode: overlay;
    pointer-events: none;
}
```

### 🔧 实用工具函数

#### CSS中的数学计算
```css
:root {
    /* 使用calc()动态计算 */
    --sidebar-width: 70px;
    --linkman-width: 290px;
    --chat-width: calc(100% - var(--sidebar-width) - var(--linkman-width));
    
    /* 使用clamp()限制范围 */
    --font-size: clamp(12px, 2vw, 18px); /* 最小12px, 最大18px */
    
    /* 使用min/max */
    --container-width: min(95%, 1200px); /* 取较小值 */
}
```

#### 动态颜色调整
```css
:root {
    --primary-h: 210;  /* 色相 */
    --primary-s: 80%;  /* 饱和度 */
    --primary-l: 50%;  /* 亮度 */
    
    --fiora-primary-color: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
    --fiora-primary-hover: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) - 10%));
    --fiora-primary-active: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) - 20%));
}
```

### 📦 CSS模块化

#### 组织你的自定义CSS
```css
/* ========== 1. CSS变量定义 ========== */
:root {
    /* ... */
}

/* ========== 2. 全局样式 ========== */
* {
    /* ... */
}

/* ========== 3. 布局 ========== */
[data-fiora="main-container"] {
    /* ... */
}

/* ========== 4. 组件样式 ========== */
[data-fiora="linkman-item"] {
    /* ... */
}

/* ========== 5. 动画 ========== */
@keyframes slideIn {
    /* ... */
}

/* ========== 6. 媒体查询 ========== */
@media (max-width: 768px) {
    /* ... */
}
```

---

## 技术说明

### CSS加载顺序

1. Fiora默认样式
2. CSS变量定义（cssVariables.css）
3. **用户自定义CSS**（最高优先级）
4. 保护UI样式（仅保护管理员入口，不影响主题）

### 为什么使用data属性而不是class？

1. **稳定性**：`data-fiora` 属性不会被CSS Modules hash
2. **命名空间**：避免与其他类名冲突
3. **语义化**：明确标识Fiora的UI元素

### 如何贡献主题？

欢迎分享你的主题！可以：
1. 在GitHub提交Issue，附上CSS代码和截图
2. 提交Pull Request，将主题添加到预设模板
3. 在社区论坛分享你的作品

---

## 更多资源

- [CSS Variables (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Selectors (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)
- [CSS Animations (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)

---

**提示**：开始时建议先修改CSS变量，熟悉后再使用高级选择器进行精细控制。


> 🎨 像 Jellyfin 一样，Fiora 支持高度自由的 CSS 自定义，让您的聊天界面独一无二！

## ⚡ 快速导航

- **新手入门** → [快速开始](#快速开始)
- **主题定制** → [CSS变量体系](#css变量体系)
- **高级定制** → [稳定选择器](#稳定选择器)
- **示例参考** → [完整示例主题](#示例主题)
- **问题排查** → [常见问题](#常见问题)

## 📚 目录

1. [快速开始](#快速开始)
2. [CSS变量体系](#css变量体系)
3. [稳定选择器](#稳定选择器)
4. [安全限制](#安全限制)
5. [完整示例主题](#示例主题)
6. [常用类名速查](#常用类名速查)
7. [常见问题](#常见问题)
8. [进阶技巧](#进阶技巧)

---

## 快速开始

### 方式一：使用CSS变量（推荐）

这是最简单、最稳定的方式。只需重定义CSS变量即可改变主题：

```css
:root {
    /* 改变主色调 */
    --fiora-primary-color: #ff6b6b;
    
    /* 改变背景色 */
    --fiora-bg-primary: #1e1e1e;
    --fiora-chat-bg: #252525;
    
    /* 改变文字颜色 */
    --fiora-text-primary: #ffffff;
}
```

### 方式二：使用稳定选择器

针对特定元素进行样式定制：

```css
/* 联系人列表 */
[data-fiora="linkman-list"] {
    background: #2c2c2c;
}

/* 消息气泡 */
[data-fiora="message-self"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## CSS变量体系

### 颜色变量

#### 主色调
```css
--fiora-primary-color          /* 主色 */
--fiora-primary-hover          /* 主色悬停 */
--fiora-primary-active         /* 主色激活 */
```

#### 背景色
```css
--fiora-bg-primary             /* 主要背景 */
--fiora-bg-secondary           /* 次要背景 */
--fiora-bg-tertiary            /* 第三级背景 */
--fiora-bg-overlay             /* 遮罩层背景 */
```

#### 文字颜色
```css
--fiora-text-primary           /* 主要文字 */
--fiora-text-secondary         /* 次要文字 */
--fiora-text-tertiary          /* 第三级文字 */
--fiora-text-inverse           /* 反色文字 */
```

#### 组件特定变量
```css
/* 侧边栏 */
--fiora-sidebar-bg
--fiora-sidebar-icon-color
--fiora-sidebar-icon-hover
--fiora-sidebar-icon-active

/* 联系人列表 */
--fiora-linkman-list-bg
--fiora-linkman-item-bg
--fiora-linkman-item-hover-bg
--fiora-linkman-item-active-bg
--fiora-linkman-name-color
--fiora-linkman-preview-color
--fiora-linkman-time-color

/* 聊天区域 */
--fiora-chat-bg
--fiora-chat-header-bg
--fiora-chat-input-bg

/* 消息气泡 */
--fiora-message-self-bg        /* 自己发送的消息背景 */
--fiora-message-self-text      /* 自己发送的消息文字 */
--fiora-message-other-bg       /* 他人发送的消息背景 */
--fiora-message-other-text     /* 他人发送的消息文字 */
--fiora-message-time-color     /* 消息时间颜色 */

/* 弹窗 */
--fiora-dialog-bg
--fiora-dialog-mask-bg
--fiora-dialog-header-bg
--fiora-dialog-border
```

### 尺寸变量

```css
/* 容器 */
--fiora-container-width: 95%;
--fiora-container-max-width: 1200px;
--fiora-container-height: 85vh;

/* 宽度 */
--fiora-sidebar-width: 60px;
--fiora-linkman-list-width: 280px;

/* 圆角 */
--fiora-border-radius-sm: 4px;
--fiora-border-radius-md: 8px;
--fiora-border-radius-lg: 12px;
--fiora-border-radius-xl: 16px;
```

### 动画变量

```css
/* 时长 */
--fiora-transition-fast: 0.15s;
--fiora-transition-base: 0.3s;
--fiora-transition-slow: 0.5s;

/* 曲线 */
--fiora-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--fiora-ease-out: cubic-bezier(0, 0, 0.2, 1);
--fiora-ease-in: cubic-bezier(0.4, 0, 1, 1);
```

---

## 稳定选择器

为了让用户CSS更稳定，Fiora为关键元素添加了 `data-fiora` 属性：

### 主要容器

```css
[data-fiora="app"]              /* 应用根容器 */
[data-fiora="main-container"]   /* 主容器 */
[data-fiora="sidebar"]          /* 侧边栏 */
[data-fiora="linkman-area"]     /* 联系人区域 */
[data-fiora="chat-area"]        /* 聊天区域 */
```

### 联系人列表

```css
[data-fiora="linkman-list"]     /* 联系人列表容器 */
[data-fiora="linkman-item"]     /* 联系人条目 */
[data-fiora="linkman-avatar"]   /* 联系人头像 */
[data-fiora="linkman-name"]     /* 联系人名称 */
[data-fiora="linkman-preview"]  /* 消息预览 */
[data-fiora="linkman-time"]     /* 消息时间 */
[data-fiora="linkman-unread"]   /* 未读数badge */
```

### 聊天区域

```css
[data-fiora="chat-header"]      /* 聊天头部 */
[data-fiora="message-list"]     /* 消息列表 */
[data-fiora="message-item"]     /* 消息条目 */
[data-fiora="message-self"]     /* 自己的消息 */
[data-fiora="message-other"]    /* 他人的消息 */
[data-fiora="message-avatar"]   /* 消息头像 */
[data-fiora="message-content"]  /* 消息内容 */
[data-fiora="message-time"]     /* 消息时间 */
[data-fiora="chat-input"]       /* 输入框区域 */
```

### 弹窗

```css
[data-fiora="dialog"]           /* 弹窗容器 */
[data-fiora="dialog-mask"]      /* 弹窗遮罩 */
[data-fiora="dialog-header"]    /* 弹窗标题栏 */
[data-fiora="dialog-body"]      /* 弹窗内容 */
[data-fiora="dialog-footer"]    /* 弹窗底部 */
```

---

## 安全限制

Fiora 实施了**十层安全过滤机制**，确保您的CSS安全可靠：

### 🛡️ 安全机制（十层防护）

| 层级 | 防护内容 | 说明 |
|-----|---------|------|
| 1️⃣ | **长度限制** | 最大500KB，防止DOS攻击 |
| 2️⃣ | **HTML标签过滤** | 移除`<script>`、`<iframe>`等标签 |
| 3️⃣ | **危险协议阻断** | 阻止`javascript:`、`vbscript:`、`data:text/html` |
| 4️⃣ | **表达式过滤** | 移除`expression()`、`eval()` |
| 5️⃣ | **外部脚本阻止** | 禁止`-moz-binding`、`behavior` |
| 6️⃣ | **DOM操作过滤** | 阻止`document.`、`window.`、`alert()` |
| 7️⃣ | **外部@import阻止** | 仅允许同源和data URI |
| 8️⃣ | **外部资源阻止** | 阻止HTTP(S)图片/字体（隐私保护） |
| 9️⃣ | **Unicode欺骗防护** | 移除零宽字符、同形异义字符 |
| 🔟 | **注释长度限制** | 防止超长注释信息泄露 |

### ❌ 被阻止的内容

#### 1. 代码执行尝试
```css
/* 以下全部会被移除 */
background: url(javascript:alert('xss'));
background: url(vbscript:msgbox("xss"));
-moz-binding: url(xss.xml);
behavior: url(xss.htc);
expression(alert('xss'));
```

#### 2. 外部资源加载（隐私保护）
```css
/* 外部HTTP(S)资源会被阻止 */
@import url("https://example.com/style.css");
background: url("https://tracker.com/track.gif"); /* 可能追踪用户 */
@font-face {
    src: url("//cdn.example.com/font.woff"); /* 协议相对URL也被阻止 */
}
```

**为什么阻止外部资源？**
- 🔒 **隐私保护**：防止第三方追踪您的IP地址和使用行为
- 🛡️ **供应链安全**：防止恶意CDN注入代码
- ⚡ **性能保护**：避免外部资源加载失败影响性能

#### 3. HTML标签注入
```css
/* 任何HTML标签都会被移除 */
content: "<script>alert('xss')</script>";
content: "<iframe src='evil.com'></iframe>";
```

#### 4. DOM操作尝试
```css
/* 以下会被阻止 */
content: "document.cookie";
content: "window.location";
content: "eval('code')";
```

### ✅ 允许的内容

#### 1. Data URI（完全安全）
```css
/* ✅ 图片 Data URI */
background: url("data:image/png;base64,iVBORw0KGgoAAAANS...");

/* ✅ SVG Data URI */
background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E...%3C/svg%3E");

/* ✅ 字体 Data URI */
@font-face {
    src: url("data:font/woff2;base64,d09GMgABAAAAA...");
}

/* ✅ CSS Data URI */
@import url("data:text/css;base64,Ym9keSB7...");
```

#### 2. 同源资源（相对/绝对路径）
```css
/* ✅ 绝对路径（同源） */
background: url("/images/bg.png");

/* ✅ 相对路径 */
background: url("./bg.png");
background: url("../images/bg.png");

/* ✅ 同源@import */
@import url("/styles/theme.css");
```

#### 3. 所有标准CSS特性
```css
/* ✅ CSS变量 */
:root {
    --primary-color: #4a90e2;
}

/* ✅ 动画 */
@keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}

/* ✅ 媒体查询 */
@media (max-width: 768px) {
    .container { width: 100%; }
}

/* ✅ 复杂选择器 */
[data-fiora="message-self"]:hover::before {
    content: "👋";
}

/* ✅ Grid/Flexbox */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* ✅ CSS Filter */
.image {
    filter: blur(5px) brightness(0.8);
    backdrop-filter: blur(10px);
}
```

### 🔍 如何检查CSS是否安全？

在浏览器控制台（F12）查看：
```javascript
// 查看过滤后的CSS
const style = document.getElementById('user-custom-css');
console.log(style?.textContent);

// 查看过滤警告
// 被阻止的内容会在控制台输出警告信息
```

### 💡 安全使用建议

1. **优先使用CSS变量**：无需担心选择器稳定性
2. **使用Data URI**：完全内联，无外部请求
3. **避免复制未知来源的CSS**：可能包含恶意代码
4. **定期备份你的CSS**：保存到本地文件
5. **测试后再应用**：先在测试环境验证效果

---

## 示例主题

### 1. 极简深色主题

```css
:root {
    /* 背景 */
    --fiora-bg-primary: #0f0f0f;
    --fiora-bg-secondary: #1a1a1a;
    --fiora-bg-tertiary: #252525;
    
    /* 文字 */
    --fiora-text-primary: #ffffff;
    --fiora-text-secondary: rgba(255, 255, 255, 0.7);
    --fiora-text-tertiary: rgba(255, 255, 255, 0.45);
    
    /* 主色 */
    --fiora-primary-color: #60a5fa;
    
    /* 边框 */
    --fiora-border-color: rgba(255, 255, 255, 0.1);
}

/* 让整个应用使用深色背景 */
[data-fiora="app"] {
    background: #000000;
}

/* 给主容器添加发光效果 */
[data-fiora="main-container"] {
    box-shadow: 
        0 0 60px rgba(96, 165, 250, 0.3),
        0 20px 60px rgba(0, 0, 0, 0.8);
}
```

### 2. 渐变彩色主题

```css
:root {
    --fiora-primary-color: #667eea;
}

/* 侧边栏渐变 */
[data-fiora="sidebar"] {
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

/* 消息气泡渐变 */
[data-fiora="message-self"] [data-fiora="message-content"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* 聊天头部渐变 */
[data-fiora="chat-header"] {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

### 3. 毛玻璃效果主题

```css
:root {
    --fiora-bg-primary: rgba(255, 255, 255, 0.9);
    --fiora-linkman-list-bg: rgba(255, 255, 255, 0.7);
    --fiora-chat-bg: rgba(255, 255, 255, 0.7);
}

/* 整体背景 */
[data-fiora="app"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

/* 毛玻璃效果 */
[data-fiora="main-container"] {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

[data-fiora="linkman-area"],
[data-fiora="chat-area"] {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

/* 消息气泡毛玻璃 */
[data-fiora="message-other"] [data-fiora="message-content"] {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}
```

### 4. 紧凑布局

```css
:root {
    /* 缩小尺寸 */
    --fiora-container-width: 90%;
    --fiora-container-max-width: 1000px;
    --fiora-sidebar-width: 50px;
    --fiora-linkman-list-width: 240px;
    --fiora-linkman-item-padding: 8px;
    --fiora-linkman-avatar-size: 40px;
    
    /* 缩小字体 */
    --fiora-font-size-xs: 11px;
    --fiora-font-size-sm: 13px;
    --fiora-font-size-md: 14px;
}

/* 紧凑的联系人条目 */
[data-fiora="linkman-item"] {
    padding: var(--fiora-linkman-item-padding);
    margin: 4px 8px;
}

/* 紧凑的消息气泡 */
[data-fiora="message-content"] {
    padding: 6px 10px;
    font-size: var(--fiora-font-size-sm);
}
```

---

## 常用类名速查

> 💡 以下类名经过CSS Modules处理可能被hash，建议优先使用 `data-fiora` 属性或 CSS变量

### 📦 主容器

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.app` | 应用根容器 | ⭐⭐⭐ |
| `.child` | 主内容容器 | ⭐⭐⭐ |
| `[data-fiora="main-container"]` | 主容器（稳定） | ⭐⭐⭐⭐⭐ |

### 👤 侧边栏

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.sidebar` | 侧边栏容器 | ⭐⭐⭐ |
| `.sidebar .iconfont` | 侧边栏图标 | ⭐⭐⭐ |
| `[data-fiora="sidebar"]` | 侧边栏（稳定） | ⭐⭐⭐⭐⭐ |
| `#admin-entry` | 管理员入口 | ⭐⭐⭐⭐ |

### 👥 联系人列表

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.functionBarAndLinkmanList` | 联系人区域容器 | ⭐⭐⭐ |
| `.functionBar` | 功能栏（搜索框区域） | ⭐⭐⭐ |
| `.linkmanList` | 联系人列表 | ⭐⭐⭐ |
| `.linkmanList > div` | 联系人条目 | ⭐⭐ |
| `[data-fiora="linkman-area"]` | 联系人区域（稳定） | ⭐⭐⭐⭐⭐ |
| `[data-fiora="linkman-item"]` | 联系人条目（稳定） | ⭐⭐⭐⭐⭐ |

#### 联系人条目细节

```css
/* 联系人头像 */
.linkmanList > div > div:first-child img

/* 联系人名称 */
.linkmanList > div > div:nth-child(2) > div:first-child > p:first-child

/* 消息预览 */
.linkmanList > div > div:nth-child(2) > div:nth-child(2) p

/* 消息时间 */
.linkmanList > div > div:nth-child(2) > div:first-child > p:last-child

/* 未读数badge */
.linkmanList > div > div:nth-child(2) > div:nth-child(2) > div

/* 选中状态 */
.linkmanList > div[class*="focus"]
```

### 💬 聊天区域

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.chat` | 聊天区域容器 | ⭐⭐⭐ |
| `.chat-header` | 聊天头部 | ⭐⭐ |
| `.messageList` | 消息列表 | ⭐⭐⭐ |
| `.message` | 消息条目 | ⭐⭐⭐ |
| `.message.self` | 自己发送的消息 | ⭐⭐⭐⭐ |
| `.message:not(.self)` | 他人发送的消息 | ⭐⭐⭐⭐ |
| `.message .content` | 消息内容气泡 | ⭐⭐⭐⭐ |
| `.message .arrow` | 消息气泡箭头 | ⭐⭐ |
| `[data-fiora="chat-area"]` | 聊天区域（稳定） | ⭐⭐⭐⭐⭐ |
| `[data-fiora="message-self"]` | 自己的消息（稳定） | ⭐⭐⭐⭐⭐ |

### ⌨️ 输入框

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.chatInput` | 输入区域容器 | ⭐⭐⭐ |
| `.chatInput .input` | 输入框 | ⭐⭐⭐ |
| `.chatInput .form` | 输入表单容器 | ⭐⭐ |
| `.chatInput .iconfont.icon-about` | 提示按钮(i) | ⭐⭐⭐⭐ |
| `[data-fiora="chat-input"]` | 输入区域（稳定） | ⭐⭐⭐⭐⭐ |

### 🔲 弹窗

| 选择器 | 说明 | 推荐使用 |
|--------|------|---------|
| `.rc-dialog-wrap` | 弹窗遮罩层 | ⭐⭐⭐⭐ |
| `.rc-dialog` | 弹窗主体 | ⭐⭐⭐⭐ |
| `.rc-dialog-header` | 弹窗标题栏 | ⭐⭐⭐⭐ |
| `.rc-dialog-body` | 弹窗内容区 | ⭐⭐⭐⭐ |
| `.rc-dialog-close` | 弹窗关闭按钮 | ⭐⭐⭐ |
| `[data-fiora="dialog"]` | 弹窗（稳定） | ⭐⭐⭐⭐⭐ |

**重要提示**：弹窗通过Portal渲染到`body`外，需要直接选择，不能用`.app .rc-dialog`

### 🎨 CSS Modules 注意事项

Fiora使用CSS Modules，某些类名会被hash（如`linkman--3t0ta`）。

**解决方案**：
1. ✅ 使用CSS变量（最稳定）
2. ✅ 使用`data-fiora`属性（未来会添加）
3. ✅ 使用通配符：`[class*="focus"]`
4. ⚠️ 使用结构选择器：`.linkmanList > div`

**示例**：
```css
/* ❌ 不稳定 - class名会变化 */
.linkman--3t0ta {
    background: red;
}

/* ✅ 稳定 - 使用通配符 */
[class*="linkman"] {
    background: red;
}

/* ✅ 稳定 - 使用结构选择器 */
.linkmanList > div {
    background: red;
}

/* ⭐ 最稳定 - 使用CSS变量 */
:root {
    --fiora-linkman-item-bg: red;
}
```

---

## 常见问题

### Q: 为什么我的CSS没有生效？

**A:** 可能的原因：
1. 选择器优先级不够，尝试添加 `!important`
2. 使用了不稳定的CSS Modules类名，请改用 `data-fiora` 属性或CSS变量
3. 浏览器缓存，请 Ctrl+F5 强制刷新

### Q: 如何调试我的自定义CSS？

**A:** 
1. 按 F12 打开浏览器开发者工具
2. 在 Elements 标签中查看元素的 `data-fiora` 属性
3. 在 Console 中运行：
   ```javascript
   // 查看所有Fiora元素
   document.querySelectorAll('[data-fiora]')
   
   // 查看当前CSS变量值
   getComputedStyle(document.documentElement).getPropertyValue('--fiora-primary-color')
   ```

### Q: 如何让弹窗也应用我的主题？

**A:** 弹窗通过Portal渲染，使用CSS变量可以自动应用：
```css
:root {
    --fiora-dialog-bg: #2c2c2c;
    --fiora-text-primary: #ffffff;
}

/* 或直接选择弹窗元素 */
[data-fiora="dialog"] {
    background: #2c2c2c;
    color: #ffffff;
}
```

### Q: 如何保存和分享我的主题？

**A:** 
1. 复制你的CSS代码
2. 保存为 `.css` 文件
3. 分享给其他用户，他们可以直接粘贴到自定义CSS框中

### Q: 我能修改布局吗？

**A:** 可以，但不推荐修改以下属性（可能导致布局错乱）：
- `position`（对于主容器）
- `display: flex` 的方向
- `z-index`（可能影响遮罩层）

推荐修改：
- 宽度、高度（通过CSS变量）
- 内外边距
- 字体、颜色
- 动画效果

### Q: 如何制作动画效果？

**A:** 使用标准CSS动画：
```css
/* 消息入场动画 */
[data-fiora="message-item"] {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 联系人悬停动画 */
[data-fiora="linkman-item"]:hover {
    transform: translateX(5px);
    transition: transform var(--fiora-transition-base) var(--fiora-ease-out);
}
```

---

## 进阶技巧

### 🎯 性能优化

#### 1. 使用CSS变量而非重复定义
```css
/* ❌ 性能差 - 重复定义 */
.header { background: #1e1f22; }
.sidebar { background: #1e1f22; }
.footer { background: #1e1f22; }

/* ✅ 性能好 - 使用变量 */
:root {
    --dark-bg: #1e1f22;
}
.header, .sidebar, .footer {
    background: var(--dark-bg);
}
```

#### 2. 避免过深的选择器
```css
/* ❌ 性能差 - 7层选择器 */
.app .child .chat .messageList .message .content .text {
    color: white;
}

/* ✅ 性能好 - 直接选择 */
.message .text {
    color: white;
}
```

#### 3. 使用will-change提升动画性能
```css
.message {
    /* 提前告知浏览器要动画的属性 */
    will-change: transform, opacity;
    transition: all 0.3s ease;
}

.message:hover {
    transform: translateY(-2px);
}
```

#### 4. 避免触发重排的属性
```css
/* ❌ 触发重排 - 性能差 */
.element:hover {
    width: 150px; /* 改变宽度会重排 */
    padding: 20px; /* 改变内边距会重排 */
}

/* ✅ 仅触发重绘 - 性能好 */
.element:hover {
    transform: scale(1.1); /* 仅重绘 */
    opacity: 0.8; /* 仅重绘 */
}
```

### 🐛 调试技巧

#### 1. 检查CSS是否正确注入
```javascript
// 在浏览器控制台（F12）运行
const customCss = document.getElementById('user-custom-css');
if (customCss) {
    console.log('✅ 自定义CSS已注入');
    console.log('内容长度:', customCss.textContent.length);
    console.log('内容:', customCss.textContent);
} else {
    console.log('❌ 自定义CSS未找到');
}
```

#### 2. 检查CSS变量值
```javascript
// 查看所有Fiora CSS变量
const root = document.documentElement;
const styles = getComputedStyle(root);

// 列出所有以 --fiora- 开头的变量
for (let key of styles) {
    if (key.startsWith('--fiora-')) {
        console.log(key, '=', styles.getPropertyValue(key));
    }
}

// 查看特定变量
console.log('主色调:', styles.getPropertyValue('--fiora-primary-color'));
```

#### 3. 查找元素的data-fiora属性
```javascript
// 查找所有带data-fiora属性的元素
const fioraElements = document.querySelectorAll('[data-fiora]');
console.log(`找到 ${fioraElements.length} 个Fiora元素:`);
fioraElements.forEach(el => {
    console.log('-', el.getAttribute('data-fiora'), el);
});
```

#### 4. 实时修改CSS变量
```javascript
// 临时修改CSS变量测试效果
document.documentElement.style.setProperty('--fiora-primary-color', '#ff6b6b');
document.documentElement.style.setProperty('--fiora-bg-primary', '#1e1e1e');

// 恢复默认
document.documentElement.style.removeProperty('--fiora-primary-color');
```

#### 5. 检查被过滤的内容
```javascript
// 查看控制台警告信息
// 被过滤的内容会输出类似：
// [CSS安全] 阻止外部资源: https://example.com/image.png
```

### 📱 响应式设计

#### 使用媒体查询适配不同屏幕
```css
/* 桌面端（默认） */
:root {
    --fiora-container-width: 95%;
    --fiora-sidebar-width: 70px;
    --fiora-linkman-list-width: 290px;
}

/* 平板（768px-1024px） */
@media (max-width: 1024px) {
    :root {
        --fiora-container-width: 98%;
        --fiora-linkman-list-width: 260px;
    }
}

/* 手机（<768px） */
@media (max-width: 768px) {
    :root {
        --fiora-container-width: 100%;
        --fiora-sidebar-width: 50px;
        --fiora-linkman-list-width: 220px;
        --fiora-font-size-sm: 12px;
    }
    
    /* 在小屏幕上隐藏某些元素 */
    [data-fiora="linkman-preview"] {
        display: none;
    }
}

/* 超大屏幕（>1920px） */
@media (min-width: 1920px) {
    :root {
        --fiora-container-max-width: 1600px;
        --fiora-font-size-md: 18px;
    }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
    :root {
        --fiora-bg-primary: #1e1e1e;
        --fiora-text-primary: #ffffff;
    }
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

### 🎨 高级CSS技巧

#### 1. 渐变色文字
```css
.message .content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

#### 2. 毛玻璃效果
```css
[data-fiora="main-container"] {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
}
```

#### 3. 自定义滚动条
```css
/* Webkit浏览器 */
.linkmanList::-webkit-scrollbar {
    width: 8px;
}

.linkmanList::-webkit-scrollbar-track {
    background: #2c2c2c;
}

.linkmanList::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
}

.linkmanList::-webkit-scrollbar-thumb:hover {
    background: #5a5a5a;
}

/* Firefox */
.linkmanList {
    scrollbar-width: thin;
    scrollbar-color: #4a4a4a #2c2c2c;
}
```

#### 4. 3D变换效果
```css
[data-fiora="message-self"] {
    transform-style: preserve-3d;
    perspective: 1000px;
}

[data-fiora="message-self"]:hover {
    transform: rotateY(5deg) rotateX(5deg);
    transition: transform 0.3s ease;
}
```

#### 5. 混合模式
```css
[data-fiora="chat-area"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #667eea, #764ba2);
    opacity: 0.1;
    mix-blend-mode: overlay;
    pointer-events: none;
}
```

### 🔧 实用工具函数

#### CSS中的数学计算
```css
:root {
    /* 使用calc()动态计算 */
    --sidebar-width: 70px;
    --linkman-width: 290px;
    --chat-width: calc(100% - var(--sidebar-width) - var(--linkman-width));
    
    /* 使用clamp()限制范围 */
    --font-size: clamp(12px, 2vw, 18px); /* 最小12px, 最大18px */
    
    /* 使用min/max */
    --container-width: min(95%, 1200px); /* 取较小值 */
}
```

#### 动态颜色调整
```css
:root {
    --primary-h: 210;  /* 色相 */
    --primary-s: 80%;  /* 饱和度 */
    --primary-l: 50%;  /* 亮度 */
    
    --fiora-primary-color: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
    --fiora-primary-hover: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) - 10%));
    --fiora-primary-active: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) - 20%));
}
```

### 📦 CSS模块化

#### 组织你的自定义CSS
```css
/* ========== 1. CSS变量定义 ========== */
:root {
    /* ... */
}

/* ========== 2. 全局样式 ========== */
* {
    /* ... */
}

/* ========== 3. 布局 ========== */
[data-fiora="main-container"] {
    /* ... */
}

/* ========== 4. 组件样式 ========== */
[data-fiora="linkman-item"] {
    /* ... */
}

/* ========== 5. 动画 ========== */
@keyframes slideIn {
    /* ... */
}

/* ========== 6. 媒体查询 ========== */
@media (max-width: 768px) {
    /* ... */
}
```

---

## 技术说明

### CSS加载顺序

1. Fiora默认样式
2. CSS变量定义（cssVariables.css）
3. **用户自定义CSS**（最高优先级）
4. 保护UI样式（仅保护管理员入口，不影响主题）

### 为什么使用data属性而不是class？

1. **稳定性**：`data-fiora` 属性不会被CSS Modules hash
2. **命名空间**：避免与其他类名冲突
3. **语义化**：明确标识Fiora的UI元素

### 如何贡献主题？

欢迎分享你的主题！可以：
1. 在GitHub提交Issue，附上CSS代码和截图
2. 提交Pull Request，将主题添加到预设模板
3. 在社区论坛分享你的作品

---

## 更多资源

- [CSS Variables (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Selectors (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)
- [CSS Animations (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)

---

**提示**：开始时建议先修改CSS变量，熟悉后再使用高级选择器进行精细控制。
