/**
 * 清除所有用户自定义 CSS
 */
export function clearCustomCss(): void {
    // 移除所有可能的自定义样式标签（防止有多个）
    const oldStyles = document.querySelectorAll('style[id="user-custom-css"]');
    oldStyles.forEach((style) => {
        style.remove();
    });
    
    // 也尝试通过其他方式查找（防止ID不一致的情况）
    const allStyles = document.querySelectorAll('style');
    allStyles.forEach((style) => {
        // 如果样式内容包含用户自定义的标识，也移除（可选，更安全）
        // 这里只移除明确标记的样式标签
    });
}

/**
 * 注入用户自定义 CSS
 * @param cssText CSS 代码文本
 */
export function injectCustomCss(cssText: string) {
    // 先清除所有之前的自定义 CSS
    clearCustomCss();

    // 如果 CSS 代码为空，直接返回（已清除，无需注入）
    if (!cssText || !cssText.trim()) {
        return;
    }

    // 安全过滤：移除危险的 CSS 代码
    const sanitizedCss = sanitizeCss(cssText);

    // 创建新的样式标签
    const style = document.createElement('style');
    style.id = 'user-custom-css';
    style.textContent = sanitizedCss;
    document.head.appendChild(style);
}

/**
 * 过滤危险的 CSS 代码
 * @param cssText 原始 CSS 代码
 * @returns 过滤后的 CSS 代码
 */
function sanitizeCss(cssText: string): string {
    let sanitized = cssText;

    // 移除 expression() (IE 特有，已废弃但可能被利用)
    sanitized = sanitized.replace(/expression\s*\(/gi, '/* blocked expression */');

    // 移除 javascript: 协议
    sanitized = sanitized.replace(/javascript\s*:/gi, '/* blocked javascript */');

    // 移除 @import (防止加载外部资源)
    sanitized = sanitized.replace(/@import\s+/gi, '/* blocked @import */');

    // 移除 url() 中的 javascript:
    sanitized = sanitized.replace(/url\s*\(\s*['"]?javascript:/gi, 'url(/* blocked */');

    // 移除 data: 协议中的危险内容（可选，如果允许 data URI 可以注释掉）
    // sanitized = sanitized.replace(/url\s*\(\s*['"]?data:/gi, 'url(/* blocked data URI */');

    return sanitized;
}

/**
 * 从 localStorage 加载自定义 CSS
 */
export function loadCustomCss(): void {
    const customCss = window.localStorage.getItem('customCss') || '';
    if (customCss) {
        injectCustomCss(customCss);
    }
}

