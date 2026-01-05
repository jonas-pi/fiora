/**
 * CSS 预设模板
 * 用户可以在设置中选择这些模板，快速应用预设样式
 */

export interface CssTemplate {
    id: string;
    name: string;
    description: string;
    css: string;
}

export const cssTemplates: CssTemplate[] = [
    {
        id: 'aurora-deep',
        name: '极光',
        description: '深色侧边栏配合极光渐变，包含窗口弹出动画、消息气泡动画等丰富的交互效果',
        css: `/* === Fiora 极光主题 - 三层架构重构版 === */
/* 深色侧边栏配合极光渐变，使用新三层架构 */

/* === 第二层：抽象语义变量层 - 定义调色盘和规格表 === */
:root {
    /* 全局原始值 */
    --fiora-indigo-900: #1e1b4b;
    --fiora-purple-500: #8b5cf6;
    --fiora-purple-600: #7c3aed;
    --fiora-fuchsia-500: #d946ef;
    --fiora-purple-100: #f5f3ff;
    --fiora-gray-50: #f8fafc;
    --fiora-gray-900: #0f172a;
    --fiora-slate-600: #334155;
    
    /* 语义别名 */
    --fiora-color-primary: var(--fiora-purple-500);
    --fiora-color-primary-hover: var(--fiora-purple-600);
    --fiora-color-accent: var(--fiora-fuchsia-500);
    --fiora-bg-app: var(--fiora-gray-50);
    --fiora-bg-container: #ffffff;
    --fiora-bg-sidebar: var(--fiora-indigo-900);
    --fiora-bg-linkman-list: #ffffff;
    --fiora-bg-chat: var(--fiora-gray-50);
    --fiora-bg-chat-input: #ffffff;
    --fiora-text-primary: #000000;
    --fiora-text-secondary: var(--fiora-slate-600);
    --fiora-text-inverse: #ffffff;
    --fiora-border-color: rgba(0, 0, 0, 0.05);
    
    /* 组件特定变量 */
    --fiora-msg-bubble-self-bg: linear-gradient(135deg, var(--fiora-purple-500), var(--fiora-fuchsia-500));
    --fiora-msg-bubble-self-color: var(--fiora-text-inverse);
    --fiora-msg-bubble-other-bg: #ffffff;
    --fiora-msg-bubble-other-color: var(--fiora-text-primary);
    --fiora-linkman-item-bg-active: var(--fiora-purple-100);
    --fiora-sidebar-icon-color: rgba(255, 255, 255, 0.5);
    --fiora-sidebar-icon-color-hover: #ffffff;
    --fiora-sidebar-icon-color-active: #ffffff;
    --fiora-container-width: 95%;
    --fiora-container-max-width: 1200px;
    --fiora-container-height: 85vh;
    --fiora-sidebar-width: 70px;
    --fiora-linkman-list-width: 280px;
    --fiora-border-radius-md: 12px;
    --fiora-border-radius-xl: 16px;
    --fiora-transition-bounce: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    --fiora-ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
    --fiora-ease-popup: cubic-bezier(0.34, 1.56, 0.64, 1);
    --fiora-ease-message: cubic-bezier(0.18, 0.89, 0.32, 1.2);
    --fiora-shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* === 第三层：艺术品表现层 - 应用变量和装饰性细节 === */

/* 主容器居中 */
[data-fiora="main-container"] {
    position: fixed !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: var(--fiora-container-width) !important;
    max-width: var(--fiora-container-max-width) !important;
    height: var(--fiora-container-height) !important;
    background: var(--fiora-bg-container) !important;
    border-radius: var(--fiora-border-radius-xl) !important;
    box-shadow: var(--fiora-shadow-xl) !important;
    margin: 0 !important;
    animation: appEntrance 0.7s var(--fiora-ease-entrance) forwards !important;
}

@keyframes appEntrance {
    from { 
        opacity: 0; 
        transform: translate(-50%, -45%) scale(0.95); 
        filter: blur(10px); 
    }
    to { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1); 
        filter: blur(0); 
    }
}

/* 侧边栏深色背景 */
[data-fiora="sidebar"] {
    background: var(--fiora-bg-sidebar) !important;
    width: var(--fiora-sidebar-width) !important;
    z-index: 20 !important;
}

[data-fiora="sidebar"] .iconfont {
    color: var(--fiora-sidebar-icon-color) !important;
    transition: all var(--fiora-transition-bounce) !important;
}

[data-fiora="sidebar"] .iconfont:hover,
[data-fiora="sidebar"] .iconfont.active {
    color: var(--fiora-sidebar-icon-color-hover) !important;
    transform: scale(1.2) !important;
}

/* 联系人列表 */
[data-fiora="linkman-area"] {
    width: var(--fiora-linkman-list-width) !important;
    background: var(--fiora-bg-linkman-list) !important;
    border-right: 1px solid var(--fiora-border-color) !important;
}

[data-fiora="linkman-item"] {
    margin: 8px 12px !important;
    border-radius: var(--fiora-border-radius-md) !important;
    transition: all var(--fiora-transition-bounce) !important;
}

[data-fiora="linkman-name"] {
    color: var(--fiora-text-primary) !important;
    font-weight: 800 !important;
}

[data-fiora="linkman-time"] {
    position: absolute !important;
    right: 12px !important;
    top: 14px !important;
    font-weight: 600 !important;
}

[data-fiora="linkman-item"][data-fiora~="linkman-focus"] {
    background: var(--fiora-linkman-item-bg-active) !important;
    transform: translateX(5px) !important;
    box-shadow: inset 4px 0 0 var(--fiora-color-primary) !important;
}

/* 消息气泡动效 */
[data-fiora="message-item"]:not([data-self="true"]) {
    animation: msgPop 0.4s var(--fiora-ease-message) both !important;
}

@keyframes msgPop {
    from { opacity: 0; transform: translateY(15px) scale(0.9); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

[data-fiora="message-item"][data-self="true"] [data-fiora="message-content"] {
    background: var(--fiora-msg-bubble-self-bg) !important;
    color: var(--fiora-msg-bubble-self-color) !important;
}

/* 弹窗果冻展开效果（与磨砂玻璃主题一致） */
[data-fiora="dialog-mask"] {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background-color: rgba(0, 0, 0, 0.2) !important;
    backdrop-filter: blur(4px) !important;
}

[data-fiora="dialog"] {
    top: 0 !important;
    position: relative !important;
    margin: 0 !important;
    transform: none !important;
    animation: jellyOpen 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.5) forwards !important;
}

/* 保护设置弹窗不受主题样式影响 */
.rc-dialog.setting,
.dialog.setting {
    position: relative !important;
    top: auto !important;
    margin: 0 !important;
    transform: none !important;
}

@keyframes jellyOpen {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}`,
    },
    {
        id: 'morandi-glass',
        name: '磨砂玻璃',
        description: '温柔莫兰迪配色配合磨砂玻璃效果，包含果冻展开动画、呼吸感气泡等优雅的交互效果',
        css: `/* === Fiora 磨砂玻璃主题 - 三层架构重构版 === */
/* 温柔莫兰迪配色配合磨砂玻璃效果，使用新三层架构 */

/* === 第二层：抽象语义变量层 - 定义调色盘和规格表 === */
:root {
    /* 全局原始值 */
    --fiora-indigo-500: #6366f1;
    --fiora-indigo-600: #4f46e5;
    --fiora-slate-800: #1e293b;
    --fiora-slate-50: #f8fafc;
    
    /* 语义别名 */
    --fiora-color-primary: var(--fiora-indigo-500);
    --fiora-color-primary-hover: var(--fiora-indigo-600);
    --fiora-bg-app: var(--fiora-slate-50);
    --fiora-bg-container: rgba(255, 255, 255, 0.7);
    --fiora-bg-sidebar: rgba(255, 255, 255, 0.2);
    --fiora-bg-linkman-list: rgba(255, 255, 255, 0.4);
    --fiora-bg-chat: rgba(248, 250, 252, 0.5);
    --fiora-bg-chat-input: rgba(248, 250, 252, 0.5);
    --fiora-text-primary: var(--fiora-slate-800);
    --fiora-text-secondary: #475569;
    --fiora-text-inverse: #ffffff;
    --fiora-border-color: rgba(0, 0, 0, 0.05);
    
    /* 组件特定变量 */
    --fiora-msg-bubble-self-bg: var(--fiora-color-primary);
    --fiora-msg-bubble-self-color: var(--fiora-text-inverse);
    --fiora-msg-bubble-other-bg: #ffffff;
    --fiora-msg-bubble-other-color: var(--fiora-text-primary);
    --fiora-msg-bubble-radius: 18px;
    --fiora-linkman-item-bg-active: #ffffff;
    --fiora-container-width: 95%;
    --fiora-container-max-width: 1200px;
    --fiora-container-height: 85vh;
    --fiora-sidebar-width: 70px;
    --fiora-linkman-list-width: 290px;
    --fiora-border-radius-xl: 24px;
    --fiora-spring-easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    --fiora-shadow-xl: 0 30px 60px rgba(0, 0, 0, 0.1);
    --fiora-backdrop-blur: blur(20px);
}

/* === 第三层：艺术品表现层 - 应用变量和装饰性细节 === */

/* 主容器磨砂玻璃效果 */
[data-fiora="main-container"] {
    position: fixed !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: var(--fiora-container-width) !important;
    max-width: var(--fiora-container-max-width) !important;
    height: var(--fiora-container-height) !important;
    background: var(--fiora-bg-container) !important;
    backdrop-filter: var(--fiora-backdrop-blur) !important;
    -webkit-backdrop-filter: var(--fiora-backdrop-blur) !important;
    border-radius: var(--fiora-border-radius-xl) !important;
    box-shadow: var(--fiora-shadow-xl) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    margin: 0 !important;
    animation: slideUpFadeCentered 0.7s var(--fiora-spring-easing) forwards !important;
}

@keyframes slideUpFadeCentered {
    0% { opacity: 0; transform: translate(-50%, -45%) scale(0.96); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

/* 弹窗果冻展开效果 */
[data-fiora="dialog-mask"] {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background-color: rgba(0, 0, 0, 0.2) !important;
    backdrop-filter: blur(4px) !important;
}

[data-fiora="dialog"] {
    top: 0 !important;
    position: relative !important;
    margin: 0 !important;
    transform: none !important;
    animation: jellyOpen 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.5) forwards !important;
}

/* 保护设置弹窗不受主题样式影响 */
.rc-dialog.setting,
.dialog.setting {
    position: relative !important;
    top: auto !important;
    margin: 0 !important;
    transform: none !important;
}

@keyframes jellyOpen {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

/* 侧边栏磨砂玻璃 */
[data-fiora="sidebar"] {
    background: var(--fiora-bg-sidebar) !important;
    width: var(--fiora-sidebar-width) !important;
}

/* 联系人列表磨砂玻璃 */
[data-fiora="linkman-area"] {
    width: var(--fiora-linkman-list-width) !important;
    background: var(--fiora-bg-linkman-list) !important;
}

/* 联系人选中视觉反馈 */
[data-fiora="linkman-item"][data-fiora~="linkman-focus"] {
    background: var(--fiora-linkman-item-bg-active) !important;
    transform: scale(1.05) translateX(5px) !important;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
}

/* 消息气泡 */
[data-fiora="message-item"][data-self="true"] [data-fiora="message-content"] {
    background: var(--fiora-msg-bubble-self-bg) !important;
    color: var(--fiora-msg-bubble-self-color) !important;
    border-radius: var(--fiora-msg-bubble-radius) var(--fiora-msg-bubble-radius) 4px var(--fiora-msg-bubble-radius) !important;
}

[data-fiora="message-item"]:not([data-self="true"]) [data-fiora="message-content"] {
    background: var(--fiora-msg-bubble-other-bg) !important;
    color: var(--fiora-msg-bubble-other-color) !important;
    border-radius: var(--fiora-msg-bubble-radius) var(--fiora-msg-bubble-radius) var(--fiora-msg-bubble-radius) 4px !important;
    border: 1px solid var(--fiora-border-color) !important;
}

/* 输入框聚焦提升感 */
[data-fiora="chat-input-field"]:focus {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15) !important;
    border-color: var(--fiora-color-primary) !important;
}`,
    },
    // 可以在这里添加更多模板
];

/**
 * 根据 ID 获取模板
 */
export function getCssTemplateById(id: string): CssTemplate | undefined {
    return cssTemplates.find((template) => template.id === id);
}

/**
 * 获取所有模板
 */
export function getAllCssTemplates(): CssTemplate[] {
    return cssTemplates;
}
