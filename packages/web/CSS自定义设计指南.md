# CSS 自定义设计指南

本文档列出了 Fiora Web 端所有可自定义的 CSS 类名和选择器，供用户自定义界面样式。

## 📋 目录

1. [主要容器](#主要容器)
2. [侧边栏](#侧边栏)
3. [聊天区域](#聊天区域)
4. [消息相关](#消息相关)
5. [输入框和按钮](#输入框和按钮)
6. [对话框](#对话框)
7. [功能栏和联系人列表](#功能栏和联系人列表)
8. [CSS 变量](#css-变量)
9. [注意事项和限制](#注意事项和限制)
10. [常见问题](#常见问题)

---

## 主要容器

### `.app`
- **说明**：应用根容器，包含整个应用
- **可自定义**：背景、尺寸等
- **示例**：
```css
.app {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
```

### `.child`
- **说明**：主内容容器，包含侧边栏、功能栏和聊天区域
- **可自定义**：圆角、阴影、背景等
- **示例**：
```css
.child {
    border-radius: 15px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
}
```

### `.blur`
- **说明**：模糊背景层
- **可自定义**：模糊效果、背景等
- **示例**：
```css
.blur {
    filter: blur(15px) !important;
}
```

---

## 侧边栏

### `.sidebar`
- **说明**：左侧功能栏容器
- **可自定义**：背景、宽度、圆角等
- **示例**：
```css
.sidebar {
    background: linear-gradient(180deg, #5c9ce6 0%, #34495e 100%) !important;
    width: 90px !important;
}
```

### `.sidebar .avatar`
- **说明**：侧边栏中的用户头像
- **可自定义**：尺寸、边框、圆角等

### `.sidebar .buttons`
- **说明**：侧边栏底部的按钮组
- **可自定义**：间距、对齐等

### `.sidebar .buttons .iconfont`
- **说明**：侧边栏按钮图标
- **可自定义**：颜色、大小等
- **示例**：
```css
.sidebar .buttons .iconfont {
    color: #ffffff !important;
    font-size: 20px !important;
}
```

---

## 聊天区域

### `.chat`
- **说明**：右侧聊天窗口容器
- **可自定义**：背景、圆角、内边距等
- **示例**：
```css
.chat {
    background-color: rgba(235, 245, 255, 0.6) !important;
    border-top-right-radius: 15px !important;
}
```

### `.chat .noLinkman`
- **说明**：无联系人时的提示区域
- **可自定义**：布局、对齐等

### `.chat .noLinkmanImage`
- **说明**：无联系人时的图片
- **可自定义**：尺寸、圆角等

### `.chat .noLinkmanText`
- **说明**：无联系人时的提示文字
- **可自定义**：颜色、字体大小等

---

## 消息相关

### `.message`
- **说明**：消息容器（外层）
- **可自定义**：间距、布局等
- **注意**：消息实际内容在 `.message .content` 中

### `.message .content`
- **说明**：消息内容区域（实际显示消息的地方）
- **可自定义**：背景、颜色、内边距、圆角、阴影等
- **示例**：
```css
.message .content {
    background-color: #ffffff !important;
    color: #333333 !important;
    padding: 12px 15px !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1) !important;
}
```

### `.message .avatar`
- **说明**：消息中的用户头像
- **可自定义**：尺寸、边框、圆角等

### `.message .nickname`
- **说明**：消息中的用户名
- **可自定义**：颜色、字体大小、粗细等
- **示例**：
```css
.message .nickname {
    color: #007AFF !important;
    font-weight: bold !important;
}
```

### `.message .tag`
- **说明**：用户标签（铭牌）
- **可自定义**：背景、颜色、圆角、内边距等
- **示例**：
```css
.message .tag {
    border-radius: 4px !important;
    padding: 2px 6px !important;
}
```

### `.message .time`
- **说明**：消息时间
- **可自定义**：颜色、字体大小等

### `.message .arrow`
- **说明**：消息气泡的小箭头
- **可自定义**：颜色、大小、位置等

### `.message.self`
- **说明**：自己发送的消息
- **可自定义**：布局方向、对齐等

### `.message .buttonList`
- **说明**：消息操作按钮列表（撤回等）
- **可自定义**：位置、样式等

### `.message .button`
- **说明**：消息中的操作按钮
- **可自定义**：背景、圆角、悬停效果等

---

## 输入框和按钮

### `.input`
- **说明**：所有输入框
- **可自定义**：边框、圆角、内边距、背景、焦点样式等
- **示例**：
```css
.input {
    border: 2px solid #d1e3f8 !important;
    border-radius: 8px !important;
    padding: 10px !important;
}

.input:focus {
    border-color: #007AFF !important;
}
```

### `.inputContainer`
- **说明**：输入框容器
- **可自定义**：布局、定位等

### `button`
- **说明**：所有按钮（标签选择器）
- **可自定义**：背景、颜色、圆角、内边距、悬停效果等
- **注意**：Button 组件使用 CSS-in-JS，类名是动态的，使用 `button` 标签选择器
- **示例**：
```css
button {
    border-radius: 8px !important;
    background-color: #007AFF !important;
    color: white !important;
    transition: background-color 0.3s ease !important;
}

button:hover {
    background-color: #0056b3 !important;
}
```

### `button.primary`
- **说明**：主要按钮
- **可自定义**：样式同上

### `button.danger`
- **说明**：危险按钮（删除等）
- **可自定义**：样式同上
- **示例**：
```css
button.danger {
    background-color: #dd514c !important;
}
```

---

## 对话框

### `.dialog`
- **说明**：所有对话框容器
- **可自定义**：圆角、阴影、背景等
- **示例**：
```css
.dialog {
    border-radius: 15px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}
```

### `.dialog .rc-dialog-body`
- **说明**：对话框内容区域
- **可自定义**：内边距、背景等

---

## 功能栏和联系人列表

### `.functionBar`
- **说明**：顶部功能栏
- **可自定义**：背景、高度、边框等

### `.linkmanList`
- **说明**：联系人列表容器
- **可自定义**：背景、滚动条样式等

### `.linkman`
- **说明**：单个联系人项
- **可自定义**：背景、悬停效果、内边距等
- **示例**：
```css
.linkman:hover {
    background-color: rgba(0, 122, 255, 0.1) !important;
}
```

### `.linkman .avatar`
- **说明**：联系人头像
- **可自定义**：尺寸、边框等

### `.linkman .username`
- **说明**：联系人用户名
- **可自定义**：颜色、字体大小等

---

## CSS 变量

Fiora 提供了 CSS 变量系统，可以在自定义 CSS 中使用：

### 主题色变量
- `--primary-color-0` 到 `--primary-color-10`：主题色（透明度 0-1）
- `--primary-color-0_5` 到 `--primary-color-9_5`：主题色（中间透明度值）
- `--primary-text-color-0` 到 `--primary-text-color-10`：文字色（透明度 0-1）

### 使用示例
```css
.custom-element {
    background-color: var(--primary-color-8);
    color: var(--primary-text-color-10);
}
```

---

## 注意事项和限制

### ✅ 可以做的

1. **修改视觉样式**：颜色、字体、大小、间距、圆角、阴影、透明度、边框等
2. **使用 CSS 变量**：使用系统提供的 CSS 变量
3. **添加动画效果**：transition、animation 等
4. **修改布局**：margin、padding、flex 相关属性等（需谨慎）

### ❌ 不能做的（会被自动过滤）

1. **`expression()`** - IE 特有的 CSS 表达式（已废弃）
2. **`javascript:`** - JavaScript 协议
3. **`@import`** - 不允许加载外部资源

### ⚠️ 不建议做的

1. **隐藏重要元素**：
   ```css
   /* 不推荐：可能导致功能失效 */
   button {
       display: none !important;
   }
   ```

2. **破坏布局**：
   ```css
   /* 不推荐：可能导致界面错乱 */
   .chat {
       position: fixed !important;
       z-index: 99999 !important;
   }
   ```

3. **禁用交互**：
   ```css
   /* 不推荐：可能导致无法点击 */
   button {
       pointer-events: none !important;
   }
   ```

4. **修改系统关键类名**：
   - `.hide` - 系统隐藏类（使用 `display: none !important`）
   - `.show` - 系统显示类
   - `.online` / `.offline` - 在线状态指示器
   - `#app` - 根容器（不建议修改）

---

## 常见问题

### Q1: 我的 CSS 代码没有生效？

**可能原因**：
1. 没有点击"应用"按钮
2. 选择器写错了（类名不对）
3. 需要使用 `!important` 提高优先级

**解决方法**：
```css
/* 如果样式不生效，尝试添加 !important */
button {
    background-color: red !important;
}
```

### Q2: 如何只修改某个特定的按钮，而不是所有按钮？

**解决方法**：使用更具体的选择器，或通过浏览器开发者工具（F12）找到更精确的类名

### Q3: 如何恢复默认样式？

**解决方法**：
1. 清空输入框中的所有代码
2. 点击"应用"按钮（此时按钮显示为"清除"）

### Q4: 我的 CSS 代码导致界面错乱怎么办？

**解决方法**：
1. 立即清空 CSS 代码并点击"应用"
2. 刷新页面（F12）
3. 如果还不行，清除浏览器缓存

### Q5: 如何找到正确的类名？

**解决方法**：
1. 按 `F12` 打开开发者工具
2. 点击左上角的"选择元素"图标（或按 `Ctrl+Shift+C`）
3. 将鼠标移到要修改的元素上，点击
4. 在右侧"样式"面板中查看实际的类名
5. 在"元素"面板中可以看到完整的 HTML 结构

### Q6: 为什么 `.component-button` 和 `.component-input` 不生效？

**原因**：这些类名不存在
- Button 组件使用 CSS-in-JS（linaria），类名是动态生成的
- Input 组件的实际类名是 `.input`

**解决方法**：
- 按钮：使用 `button` 标签选择器
- 输入框：使用 `.input` 类名

### Q7: 如何修改消息样式？

**注意**：`.message` 只是容器，实际内容在 `.message .content` 中

**正确写法**：
```css
/* 修改消息内容 */
.message .content {
    background-color: #ffffff !important;
    padding: 12px 15px !important;
}
```

---

## 快速参考

### 常用选择器

| 元素 | 选择器 | 说明 |
|------|--------|------|
| 按钮 | `button` | 所有按钮（标签选择器） |
| 输入框 | `.input` | 所有输入框 |
| 消息容器 | `.message` | 消息外层容器 |
| 消息内容 | `.message .content` | 消息实际内容 |
| 侧边栏 | `.sidebar` | 左侧功能栏 |
| 聊天区域 | `.chat` | 右侧聊天窗口 |
| 对话框 | `.dialog` | 所有对话框 |

### 常用样式属性

- `background-color` / `background` - 背景
- `color` - 文字颜色
- `border` / `border-radius` - 边框和圆角
- `padding` / `margin` - 内边距和外边距
- `font-size` / `font-weight` - 字体大小和粗细
- `box-shadow` - 阴影
- `opacity` - 透明度
- `transition` - 过渡动画

---

## 使用建议

1. **使用 `!important`**：确保样式优先级足够高
2. **先测试单个样式**：确认生效后再添加其他样式
3. **使用开发者工具**：通过 F12 查看实际的类名和样式
4. **备份代码**：修改前先保存一份原始代码
5. **测试响应式**：修改后测试桌面端和移动端效果

---

**提示**：如果不确定某个 CSS 代码是否安全，可以先在开发者工具中测试，确认无误后再粘贴到设置面板中。
