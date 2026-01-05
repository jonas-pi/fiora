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
        id: 'modern-animated',
        name: '现代美学主题 - 动画增强版',
        description: '包含丰富的动画效果，侧边栏图标、消息气泡、按钮等都有平滑的交互动画',
        css: `/* === Fiora 现代美学主题 - 动画增强版 === */

:root {
    --primary-color: #7c3aed;
    --primary-light: #ede9fe;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* === 基础容器修复 === */
.app .child {
    display: flex !important;
    width: 95% !important;
    max-width: 1200px !important;
    height: 85vh !important;
    margin: auto !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    animation: containerFadeIn 0.6s ease-out !important; /* 窗口入场动画 */
}

/* 窗口入场动画 */
@keyframes containerFadeIn {
    from { opacity: 0; transform: scale(0.95) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

/* === 1. 侧边栏图标动画 === */
.app .sidebar .iconfont {
    color: var(--text-secondary) !important;
    transition: var(--transition-smooth) !important;
}

.app .sidebar .iconfont:hover {
    color: var(--primary-color) !important;
    transform: translateY(-3px) scale(1.1) !important;
    filter: drop-shadow(0 4px 6px rgba(124, 58, 237, 0.2)) !important;
}

/* === 2. 联系人列表平滑间距 === */
.app .functionBarAndLinkmanList {
    width: 280px !important;
    flex-shrink: 0 !important;
    background: #ffffff !important;
    border-right: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.app .linkmanList .linkman {
    transition: var(--transition-smooth) !important;
    margin: 4px 8px !important;
    border-radius: 10px !important;
    position: relative !important;
    overflow: hidden !important;
}

/* 选中状态的滑块感 */
.app .linkmanList .linkman.focus {
    background: var(--primary-light) !important;
    transform: translateX(5px) !important;
}

/* 修复时间遮挡：增加右侧内边距 */
.app .linkmanList .linkman {
    padding-right: 15px !important;
}

/* === 3. 消息气泡动效 === */
.app .message {
    animation: messageSlideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) !important;
    animation-fill-mode: both !important;
}

@keyframes messageSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* 消息悬停微动 */
.app .message .content {
    transition: transform 0.2s ease !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05) !important;
}

.app .message:hover .content {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 12px rgba(0,0,0,0.08) !important;
}

/* === 4. 按钮与输入框交互 === */
.app .chatInput .input {
    transition: var(--transition-smooth) !important;
}

.app .chatInput .input:focus {
    background: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
}

/* 发送按钮动画 */
.app .chatInput .iconButton {
    transition: transform 0.2s ease !important;
}

.app .chatInput .iconButton:active {
    transform: scale(0.8) rotate(-15deg) !important;
}

/* === 5. 修复对比色与遮挡 === */
.app .message.self .content {
    background: var(--primary-color) !important;
    color: #ffffff !important;
}

/* 强制保证时间在最右侧且不被覆盖 */
.app .linkman .time {
    position: absolute !important;
    right: 12px !important;
    top: 12px !important;
    background: rgba(255,255,255,0.8) !important; /* 防止背景色干扰文字 */
    padding: 0 4px !important;
    border-radius: 4px !important;
}`,
    },
    {
        id: 'aurora-deep',
        name: '极光深邃 - 动态交互版',
        description: '深色侧边栏配合极光渐变，包含窗口弹出动画、消息气泡动画等丰富的交互效果',
        css: `/* === Fiora 现代美学：极光深邃 & 动态交互最终版 === */

:root {
    /* 核心色值 */
    --side-bg: #1e1b4b;           /* 深靛蓝侧边栏 */
    --accent-main: #8b5cf6;       /* 主紫色 */
    --accent-gradient: linear-gradient(135deg, #8b5cf6, #d946ef);
    --text-primary: #000000;      /* 纯黑：联系人名称最高清晰度 */
    --text-secondary: #334155;    /* 深灰：预览文字 */
    --text-msg-self: #ffffff;     /* 自己消息文字 */
    --text-msg-other: #0f172a;    /* 他人消息文字 */
    
    /* 动画曲线 */
    --transition-bounce: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    --transition-smooth: all 0.3s ease;
}

/* === 1. 基础布局与窗口入场 === */
.app .child {
    display: flex !important;
    width: 95% !important;
    max-width: 1200px !important;
    height: 85vh !important;
    margin: auto !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    background: #ffffff !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important;
    animation: appEntrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

@keyframes appEntrance {
    from { opacity: 0; transform: scale(0.9) translateY(40px); filter: blur(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}

/* === 2. 侧边栏：深色高对比度 === */
.app .sidebar {
    background: var(--side-bg) !important;
    width: 70px !important;
    flex-shrink: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    border: none !important;
    z-index: 20 !important;
}

.app .sidebar .iconfont {
    color: rgba(255, 255, 255, 0.5) !important;
    transition: var(--transition-bounce) !important;
    font-size: 24px !important;
    cursor: pointer !important;
}

.app .sidebar .iconfont:hover,
.app .sidebar .active .iconfont {
    color: #ffffff !important;
    transform: scale(1.2) rotate(5deg) !important;
    filter: drop-shadow(0 0 8px var(--accent-main)) !important;
}

/* === 3. 联系人列表：解决文字模糊与遮挡 === */
.app .functionBarAndLinkmanList {
    width: 280px !important;
    flex-shrink: 0 !important;
    background: #ffffff !important;
    border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.app .linkmanList .linkman {
    margin: 8px 12px !important;
    padding: 12px !important;
    border-radius: 12px !important;
    transition: var(--transition-bounce) !important;
    position: relative !important;
}

.app .linkman .name {
    color: var(--text-primary) !important;
    font-weight: 800 !important; /* 极粗，确保清晰 */
    font-size: 15px !important;
}

.app .linkman .preview {
    color: var(--text-secondary) !important;
    font-weight: 500 !important;
    margin-top: 4px !important;
}

/* 锁定时间位置，解决重叠 */
.app .linkman .time {
    position: absolute !important;
    right: 12px !important;
    top: 14px !important;
    color: #64748b !important;
    font-size: 11px !important;
    font-weight: 600 !important;
}

.app .linkmanList .linkman.focus {
    background: #f5f3ff !important;
    transform: translateX(8px) !important;
    box-shadow: inset 4px 0 0 var(--accent-main) !important;
}

/* === 4. 聊天区域与消息动画 === */
.app .chat {
    flex: 1 !important;
    background: #f8fafc !important;
    min-width: 0 !important;
}

.app .message {
    animation: msgPop 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.2) both !important;
}

@keyframes msgPop {
    from { opacity: 0; transform: translateY(20px) scale(0.9); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.app .message.self .content {
    background: var(--accent-gradient) !important;
    color: var(--text-msg-self) !important;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2) !important;
}

.app .message:not(.self) .content {
    background: #ffffff !important;
    color: var(--text-msg-other) !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
}

/* === 5. 新窗口弹出动画 (核心新增) === */
.app .rc-dialog-wrap {
    background-color: rgba(15, 23, 42, 0.4) !important;
    backdrop-filter: blur(6px) !important; /* 弹出时背景模糊感 */
}

.app .rc-dialog {
    animation: fioraPopup 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
    border-radius: 20px !important;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

@keyframes fioraPopup {
    0% { opacity: 0; transform: scale(0.7) translateY(40px); filter: blur(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}

.app .rc-dialog-title {
    background: var(--accent-gradient) !important;
    color: #ffffff !important;
    font-weight: 700 !important;
}

/* === 6. 输入框交互 === */
.app .chatInput .input {
    transition: var(--transition-smooth) !important;
    border: 1px solid transparent !important;
}

.app .chatInput .input:focus {
    background: #ffffff !important;
    border-color: var(--accent-main) !important;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1) !important;
}

.app .chatInput .iconButton:active {
    transform: scale(0.85) !important; /* 点击按钮回弹感 */
}`,
    },
    {
        id: 'morandi-glass',
        name: '莫兰迪·磨砂玻璃主题',
        description: '温柔莫兰迪配色配合磨砂玻璃效果，包含果冻展开动画、呼吸感气泡等优雅的交互效果',
        css: `/* === Fiora 莫兰迪·磨砂玻璃主题 (Morandi Glass) === */

:root {
    /* 莫兰迪配色：温柔且高对比度 */
    --glass-bg: rgba(255, 255, 255, 0.7);
    --accent-soft: #94a3b8;        /* 莫兰迪蓝灰 */
    --accent-primary: #6366f1;     /* 亮靛蓝（用于强调） */
    --text-deep: #1e293b;          /* 核心文字 */
    --text-sub: #475569;           /* 次要文字 */
    --border-soft: rgba(0, 0, 0, 0.05);
    
    /* 物理反馈动画 */
    --spring-easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* === 1. 整体容器：悬浮磨砂感 === */
.app .child {
    background: var(--glass-bg) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    border-radius: 24px !important;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1) !important;
    animation: slideUpFade 0.8s var(--spring-easing) !important;
}

@keyframes slideUpFade {
    0% { opacity: 0; transform: translateY(50px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* === 2. 侧边栏：极简通透 === */
.app .sidebar {
    background: rgba(255, 255, 255, 0.3) !important;
    width: 72px !important;
    border-right: 1px solid var(--border-soft) !important;
}

.app .sidebar .iconfont {
    color: var(--accent-soft) !important;
    transition: all 0.4s var(--spring-easing) !important;
}

.app .sidebar .iconfont:hover,
.app .sidebar .active .iconfont {
    color: var(--accent-primary) !important;
    transform: scale(1.2) translateY(-2px) !important;
}

/* === 3. 联系人列表：卡片式分层 === */
.app .functionBarAndLinkmanList {
    width: 290px !important;
    background: rgba(255, 255, 255, 0.4) !important;
}

.app .linkmanList .linkman {
    margin: 10px 14px !important;
    padding: 14px !important;
    background: transparent !important;
    border-radius: 16px !important;
    transition: all 0.3s var(--spring-easing) !important;
}

.app .linkman .name {
    color: var(--text-deep) !important;
    font-weight: 700 !important; /* 确保对比度 */
    font-size: 15px !important;
}

.app .linkman .preview {
    color: var(--text-sub) !important;
    font-weight: 400 !important;
}

/* 锁定时间位置 */
.app .linkman .time {
    position: absolute !important;
    right: 15px !important;
    top: 15px !important;
    color: #94a3b8 !important;
    font-size: 11px !important;
}

.app .linkmanList .linkman.focus {
    background: #ffffff !important;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
    transform: scale(1.05) !important;
}

/* === 4. 聊天区：呼吸感气泡 === */
.app .chat {
    background: rgba(248, 250, 252, 0.5) !important;
}

.app .message {
    animation: bubbleSlide 0.5s var(--spring-easing) both !important;
}

@keyframes bubbleSlide {
    0% { opacity: 0; transform: translateX(-20px) scale(0.8); }
    100% { opacity: 1; transform: translateX(0) scale(1); }
}

.app .message.self {
    animation: bubbleSlideSelf 0.5s var(--spring-easing) both !important;
}

@keyframes bubbleSlideSelf {
    0% { opacity: 0; transform: translateX(20px) scale(0.8); }
    100% { opacity: 1; transform: translateX(0) scale(1); }
}

.app .message.self .content {
    background: var(--accent-primary) !important;
    color: #ffffff !important;
    border-radius: 18px 18px 4px 18px !important; /* 非对称圆角 */
}

.app .message:not(.self) .content {
    background: #ffffff !important;
    color: var(--text-deep) !important;
    border-radius: 18px 18px 18px 4px !important;
    border: 1px solid var(--border-soft) !important;
}

/* === 5. 弹窗动画：果冻展开效果 === */
.app .rc-dialog {
    animation: jellyOpen 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.5) forwards !important;
    border-radius: 24px !important;
}

@keyframes jellyOpen {
    0% { transform: scale(0.5); opacity: 0; filter: blur(20px); }
    70% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

.app .rc-dialog-title {
    background: #ffffff !important;
    color: var(--text-deep) !important;
    border-bottom: 1px solid var(--border-soft) !important;
}

/* === 6. 输入框：扩充感动画 === */
.app .chatInput .input {
    transition: all 0.4s var(--spring-easing) !important;
    background: #ffffff !important;
    border: 1px solid var(--border-soft) !important;
    border-radius: 12px !important;
}

.app .chatInput .input:focus {
    transform: translateY(-2px) !important;
    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.1) !important;
    border-color: var(--accent-primary) !important;
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

