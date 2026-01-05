# Fiora 自定义 CSS 完整指南

> 🎨 **欢迎来到 Fiora 主题开发的世界！**  
> 像 Jellyfin 一样，Fiora 支持高度自由的 CSS 自定义，让您的聊天界面独一无二！

---

## 📋 目录

- [快速开始](#快速开始)
- [三层样式架构](#三层样式架构)
- [核心变量表](#核心变量表)
- [DOM 树结构](#dom-树结构)
- [Hello World 示例](#hello-world-示例)
- [稳定选择器](#稳定选择器)
- [安全限制](#安全限制)
- [高级技巧](#高级技巧)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)
- [工具和调试](#工具和调试)
- [更多资源](#更多资源)

---

## 🚀 快速开始

### 什么是 Fiora 主题系统？

Fiora 采用**三层样式架构**：

1. **基础层 (Foundation)** - 布局和逻辑（你不需要关心）
2. **变量层 (Design System)** - 50+ 个 CSS 变量（**这是你主要使用的**）
3. **表现层 (Masterpiece)** - 默认主题样式（你可以覆盖）

### 如何创建主题？

**最简单的方式**：只需修改 CSS 变量！

```css
:root {
    --fiora-color-primary: #ff6b6b; /* 改变主色调 */
    --fiora-bg-app: #1a1a1a;         /* 改变背景色 */
}
```

就这么简单！5 行代码就能创建一个完全不同的主题。

### 实时预览功能

Fiora 支持**实时预览**：在设置面板的 CSS 输入框中输入代码，立即看到效果，无需点击"应用"按钮。

- ✅ **实时预览**：输入时即可看到效果
- ✅ **保存主题**：点击"应用"按钮保存到本地存储
- ✅ **安全恢复**：如果 CSS 导致页面异常，访问 `?safeMode=true` 进入安全模式

---

## 🏗️ 三层样式架构

### 架构说明

Fiora 的样式系统分为三层，每一层都有明确的职责：

#### 第一层：基础设施层 (Foundation)

- **职责**：只负责布局和逻辑
- **特点**：使用 `data-fiora` 属性选择器，只设置布局相关的 CSS
- **保护**：防止用户 CSS 破坏关键布局

#### 第二层：抽象语义变量层 (Design System)

- **职责**：定义 50+ 个 CSS 变量
- **特点**：提供全局原始值、语义别名、组件特定变量
- **优势**：用户只需改变变量就能完全改变外观

#### 第三层：艺术品表现层 (Masterpiece)

- **职责**：通过变量赋值定义默认主题
- **特点**：添加装饰性细节（动画、阴影、圆角等）
- **可覆盖**：用户自定义 CSS 可以完全覆盖这一层

### CSS 加载顺序

1. **基础样式层**（第一层）- 布局和逻辑
2. **默认主题层**（第二层 + 第三层）- 变量定义和默认样式
3. **用户自定义 CSS**（最高优先级）- 可以覆盖所有变量和样式
4. **保护 UI 样式**（最后）- 保护管理员入口等关键组件

---

## 🎨 核心变量表

### 主色调变量

```css
--fiora-color-primary: #7c3aed;        /* 主色调（按钮、链接、强调色） */
--fiora-color-primary-hover: #6d28d9;  /* 主色调悬停状态 */
--fiora-color-primary-active: #5b21b6; /* 主色调激活状态 */
--fiora-color-secondary: #007bff;       /* 次要色调 */
--fiora-color-accent: #7c3aed;         /* 强调色 */
```

### 背景色变量

```css
--fiora-bg-app: #ffffff;                /* 应用背景色 */
--fiora-bg-container: #ffffff;         /* 主容器背景色 */
--fiora-bg-sidebar: #f8f9fa;          /* 侧边栏背景色 */
--fiora-bg-linkman-list: #ffffff;      /* 联系人列表背景色 */
--fiora-bg-chat: #f8fafc;             /* 聊天区域背景色 */
--fiora-bg-chat-input: #ffffff;        /* 输入框区域背景色 */
--fiora-bg-dialog: #ffffff;            /* 弹窗背景色 */
--fiora-bg-dialog-mask: rgba(0,0,0,0.3); /* 弹窗遮罩背景色 */
```

### 文字颜色变量

```css
--fiora-text-primary: #1e293b;         /* 主要文字颜色 */
--fiora-text-secondary: #64748b;       /* 次要文字颜色 */
--fiora-text-tertiary: #94a3b8;        /* 三级文字颜色 */
--fiora-text-inverse: #ffffff;         /* 反色文字（用于深色背景） */
```

### 消息气泡变量

```css
--fiora-msg-bubble-self-bg: #7c3aed;   /* 自己消息气泡背景色 */
--fiora-msg-bubble-self-color: #ffffff; /* 自己消息文字颜色 */
--fiora-msg-bubble-other-bg: #f1f5f9;  /* 他人消息气泡背景色 */
--fiora-msg-bubble-other-color: #1e293b; /* 他人消息文字颜色 */
--fiora-msg-bubble-radius: 12px;        /* 消息气泡圆角 */
--fiora-msg-bubble-shadow: none;        /* 消息气泡阴影 */
```

### 联系人列表变量

```css
--fiora-linkman-item-bg: transparent;  /* 联系人条目背景色 */
--fiora-linkman-item-bg-hover: #f5f3ff; /* 联系人条目悬停背景色 */
--fiora-linkman-item-bg-active: #ede9fe; /* 联系人条目激活背景色 */
--fiora-linkman-name-color: #1e293b;    /* 联系人名称颜色 */
--fiora-linkman-preview-color: #64748b; /* 消息预览颜色 */
--fiora-linkman-time-color: #94a3b8;    /* 时间戳颜色 */
```

### 输入框变量

```css
--fiora-input-bg: #ffffff;              /* 输入框背景色 */
--fiora-input-color: #1e293b;           /* 输入框文字颜色 */
--fiora-input-border-color: rgba(0,0,0,0.1); /* 输入框边框颜色 */
--fiora-input-border-radius: 8px;       /* 输入框圆角 */
```

### 尺寸变量

```css
--fiora-container-width: 95%;          /* 容器宽度 */
--fiora-container-max-width: 1200px;    /* 容器最大宽度 */
--fiora-container-height: 85vh;         /* 容器高度 */
```

### 圆角变量

```css
--fiora-border-radius-sm: 4px;          /* 小圆角 */
--fiora-border-radius-md: 8px;          /* 中等圆角 */
--fiora-border-radius-lg: 12px;          /* 大圆角 */
--fiora-border-radius-xl: 16px;         /* 超大圆角 */
```

### 动画变量

```css
--fiora-transition-fast: 0.15s;         /* 快速过渡 */
--fiora-transition-base: 0.3s;          /* 基础过渡 */
--fiora-transition-slow: 0.5s;          /* 慢速过渡 */
--fiora-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1); /* 缓动曲线 */
--fiora-ease-out: cubic-bezier(0, 0, 0.2, 1); /* 缓出曲线 */
--fiora-ease-in: cubic-bezier(0.4, 0, 1, 1); /* 缓入曲线 */
```

---

## 🌳 DOM 树结构

Fiora 使用 `data-fiora` 属性来标识关键元素，这些属性**永远不会改变**，是编写主题的稳定选择器。

### 主要容器

```
[data-fiora="app"]                    # 应用根容器
└── [data-fiora="main-container"]     # 主容器（聊天窗口）
    ├── [data-fiora="sidebar"]        # 侧边栏（左侧图标栏）
    ├── [data-fiora="linkman-area"]   # 联系人区域
    │   └── [data-fiora="linkman-list"] # 联系人列表
    │       └── [data-fiora="linkman-item"] # 联系人条目
    │           ├── [data-fiora="linkman-avatar"]   # 头像
    │           ├── [data-fiora="linkman-name"]     # 名称
    │           ├── [data-fiora="linkman-preview"]  # 消息预览
    │           └── [data-fiora="linkman-time"]    # 时间戳
    └── [data-fiora="chat-area"]      # 聊天区域
        ├── [data-fiora="chat-header"] # 聊天头部
        ├── [data-fiora="message-list"] # 消息列表
        │   └── [data-fiora="message-item"][data-self="true/false"] # 消息条目
        │       ├── [data-fiora="message-avatar"]   # 消息头像
        │       └── [data-fiora="message-content"] # 消息内容
        └── [data-fiora="chat-input"] # 输入框区域
            └── [data-fiora="chat-input-field"] # 输入框
```

### 弹窗结构

```
[data-fiora="dialog-mask"]            # 弹窗遮罩
└── [data-fiora="dialog"]             # 弹窗容器
    ├── [data-fiora="dialog-header"]  # 弹窗标题栏
    ├── [data-fiora="dialog-body"]    # 弹窗内容
    └── [data-fiora="dialog-footer"]  # 弹窗底部
```

---

## 👋 Hello World 示例

### 示例 1：极简红色主题（5 行代码）

```css
:root {
    --fiora-color-primary: #ff6b6b;
    --fiora-bg-app: #fff5f5;
    --fiora-bg-container: #ffffff;
    --fiora-msg-bubble-self-bg: #ff6b6b;
}
```

**效果**：整个应用的主色调变成红色，消息气泡也变成红色。

### 示例 2：深色主题（10 行代码）

```css
:root {
    /* 背景色 */
    --fiora-bg-app: #0a0a0a;
    --fiora-bg-container: #1a1a1a;
    --fiora-bg-sidebar: #1e1e1e;
    --fiora-bg-linkman-list: #1a1a1a;
    --fiora-bg-chat: #1a1a1a;
    
    /* 文字颜色 */
    --fiora-text-primary: #ffffff;
    --fiora-text-secondary: #b0b0b0;
    
    /* 消息气泡 */
    --fiora-msg-bubble-other-bg: #2a2a2a;
    --fiora-msg-bubble-other-color: #ffffff;
}
```

**效果**：整个应用变成深色主题。

### 示例 3：渐变主题（15 行代码）

```css
:root {
    --fiora-bg-app: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --fiora-bg-container: rgba(255, 255, 255, 0.95);
    --fiora-color-primary: #667eea;
    --fiora-msg-bubble-self-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --fiora-msg-bubble-self-color: #ffffff;
}

/* 添加磨砂玻璃效果 */
[data-fiora="main-container"] {
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}
```

**效果**：渐变背景 + 磨砂玻璃效果。

---

## 🎯 稳定选择器

为了让用户 CSS 更稳定，Fiora 为关键元素添加了 `data-fiora` 属性。这些属性**永远不会改变**，是编写主题的稳定选择器。

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
[data-fiora="message-item"][data-self="true"]   /* 自己的消息 */
[data-fiora="message-item"][data-self="false"]  /* 他人的消息 */
[data-fiora="message-avatar"]   /* 消息头像 */
[data-fiora="message-content"]  /* 消息内容 */
[data-fiora="message-time"]     /* 消息时间 */
[data-fiora="chat-input"]       /* 输入框区域 */
[data-fiora="chat-input-field"]  /* 输入框 */
```

### 弹窗

```css
[data-fiora="dialog"]           /* 弹窗容器 */
[data-fiora="dialog-mask"]      /* 弹窗遮罩 */
[data-fiora="dialog-header"]    /* 弹窗标题栏 */
[data-fiora="dialog-body"]      /* 弹窗内容 */
[data-fiora="dialog-footer"]    /* 弹窗底部 */
```

### CSS Modules 注意事项

Fiora 使用 CSS Modules，某些类名会被 hash（如 `linkman--3t0ta`）。

**解决方案**：
1. ✅ 使用 CSS 变量（最稳定）
2. ✅ 使用 `data-fiora` 属性（推荐）
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

/* ⭐ 最稳定 - 使用data-fiora属性 */
[data-fiora="linkman-item"] {
    background: red;
}
```

---

## 🛡️ 安全限制

Fiora 实施了**十层安全过滤机制**，确保您的 CSS 安全可靠：

### 安全机制（十层防护）

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
background: url("./images/bg.png");
background: url("../images/bg.png");
```

#### 3. 标准CSS功能
```css
/* ✅ 所有标准CSS功能都支持 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
backdrop-filter: blur(20px);
animation: slideIn 0.3s ease-out;
transform: translateY(10px);
```

---

## 🎯 高级技巧

### 1. 使用 `data-fiora` 属性选择器

```css
/* ✅ 推荐：使用稳定的 data-fiora 属性 */
[data-fiora="linkman-item"]:hover {
    background: var(--fiora-linkman-item-bg-hover);
}

/* ❌ 不推荐：使用可能变化的 class 名 */
.linkman--3t0ta:hover {
    background: red;
}
```

### 2. 区分自己的消息和他人的消息

```css
/* 自己的消息 */
[data-fiora="message-item"][data-self="true"] [data-fiora="message-content"] {
    background: var(--fiora-msg-bubble-self-bg);
    color: var(--fiora-msg-bubble-self-color);
}

/* 他人的消息 */
[data-fiora="message-item"][data-self="false"] [data-fiora="message-content"] {
    background: var(--fiora-msg-bubble-other-bg);
    color: var(--fiora-msg-bubble-other-color);
}
```

### 3. 添加动画效果

```css
/* 消息入场动画 */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

[data-fiora="message-item"][data-self="false"] {
    animation: slideIn 0.3s ease-out;
}
```

### 4. 自定义弹窗样式

```css
[data-fiora="dialog-mask"] {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

[data-fiora="dialog"] {
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

### 5. 性能优化技巧

#### 使用 CSS 变量而非重复定义
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

#### 避免过深的选择器
```css
/* ❌ 性能差 - 7层选择器 */
.app .child .chat .messageList .message .content .text {
    color: white;
}

/* ✅ 性能好 - 直接选择 */
[data-fiora="message-content"] {
    color: white;
}
```

#### 使用 will-change 提升动画性能
```css
[data-fiora="message-item"] {
    /* 提前告知浏览器要动画的属性 */
    will-change: transform, opacity;
    transition: all 0.3s ease;
}
```

---

## ✅ 最佳实践

### 1. 优先使用 CSS 变量

```css
/* ✅ 推荐 */
:root {
    --fiora-color-primary: #ff6b6b;
}

/* ❌ 不推荐 */
[data-fiora="linkman-item"] {
    color: #ff6b6b; /* 硬编码颜色 */
}
```

**原因**：使用变量可以让用户轻松覆盖你的主题。

### 2. 使用 `!important` 时要谨慎

```css
/* ✅ 仅在必要时使用 */
[data-fiora="main-container"] {
    position: fixed !important; /* 覆盖内联样式 */
}

/* ❌ 不要滥用 */
[data-fiora="linkman-item"] {
    color: red !important; /* 不需要，变量已经足够 */
}
```

### 3. 保持响应式

```css
/* 移动端适配 */
@media (max-width: 768px) {
    :root {
        --fiora-container-width: 100%;
        --fiora-container-height: 100vh;
    }
}
```

### 4. 测试你的主题

- ✅ 测试浅色和深色背景
- ✅ 测试不同屏幕尺寸
- ✅ 测试弹窗和对话框
- ✅ 测试消息气泡的对比度

### 5. 组织你的自定义 CSS

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

## ❓ 常见问题

### Q: 为什么我的CSS没有生效？

**A:** 可能的原因：
1. 选择器优先级不够，尝试添加 `!important`
2. 使用了不稳定的CSS Modules类名，请改用 `data-fiora` 属性或CSS变量
3. 浏览器缓存，请 Ctrl+F5 强制刷新
4. Service Worker 缓存，请清除 Service Worker 缓存

### Q: 如何调试我的自定义CSS？

**A:** 
1. 按 F12 打开浏览器开发者工具
2. 在 Elements 标签中查看元素的 `data-fiora` 属性
3. 在 Console 中运行：
   ```javascript
   // 查看所有Fiora元素
   document.querySelectorAll('[data-fiora]')
   
   // 查看当前CSS变量值
   getComputedStyle(document.documentElement).getPropertyValue('--fiora-color-primary')
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

### Q: 如果我的CSS导致页面无法使用怎么办？

**A:** 使用安全模式：
1. 在 URL 后添加 `?safeMode=true`
2. 安全模式会禁用所有用户自定义 CSS
3. 进入设置面板，清除或修复你的 CSS
4. 移除 URL 中的 `?safeMode=true` 恢复正常模式

---

## 🔧 工具和调试

### 查看所有 CSS 变量

在浏览器控制台运行：

```javascript
// 获取所有 Fiora CSS 变量
const styles = getComputedStyle(document.documentElement);
const variables = Array.from(document.styleSheets)
    .flatMap(sheet => {
        try {
            return Array.from(sheet.cssRules);
        } catch {
            return [];
        }
    })
    .filter(rule => rule.type === CSSRule.STYLE_RULE)
    .flatMap(rule => Array.from(rule.style))
    .filter(prop => prop.startsWith('--fiora-'))
    .map(prop => ({
        name: prop,
        value: styles.getPropertyValue(prop).trim()
    }));

console.table(variables);
```

### 查看 DOM 结构

```javascript
// 查看所有 Fiora 元素
document.querySelectorAll('[data-fiora]').forEach(el => {
    console.log(el.getAttribute('data-fiora'), el);
});
```

### 检查 CSS 是否正确注入

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

### 检查 CSS 变量值

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
```

---

## 📚 更多资源

- [CSS 变量 (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS 选择器 (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors)
- [CSS 动画 (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)
- [CSS 性能优化 (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/Performance/CSS)

---

## 🎨 分享你的主题

创建了满意的主题？欢迎分享！

1. 在 GitHub 提交 Issue，附上 CSS 代码和截图
2. 提交 Pull Request，将主题添加到预设模板
3. 在社区论坛分享你的作品

---

## 🛡️ 样式保护机制

Fiora 内置了样式保护机制，确保关键 UI 组件（如管理员入口、设置面板）不会被用户 CSS 破坏。

### 受保护的组件

- ✅ 管理员入口按钮
- ✅ 侧边栏按钮
- ✅ 设置弹窗
- ✅ 登录/注册弹窗
- ✅ 错误提示

这些组件使用 `z-index: 2147483647` 和 `!important`，防止用户 CSS 导致页面不可用。

### 安全模式

如果您的 CSS 导致页面无法使用，可以通过以下方式恢复：

1. 在 URL 后添加 `?safeMode=true`
2. 安全模式会禁用所有用户自定义 CSS
3. 进入设置面板，清除或修复您的 CSS
4. 移除 URL 中的 `?safeMode=true` 恢复正常模式

---

**提示**：开始时建议先修改CSS变量，熟悉后再使用高级选择器进行精细控制。

**祝你主题开发愉快！** 🎉
