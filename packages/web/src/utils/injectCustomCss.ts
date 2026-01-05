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

    // 自定义 CSS 注入完成后，确保“受保护 UI”样式在其之后（优先级更高）
    ensureProtectedUiCss();
}

/**
 * 过滤危险的 CSS 代码
 *
 * 安全策略（偏保守，但尽量不影响“自定义主题/布局/字体”诉求）：
 * - ✅ 允许：绝大多数标准 CSS、CSS 变量、动画、媒体查询
 * - ✅ 允许：`data:` 与“相对路径/同源路径”的资源引用（例如用户先上传背景图到本服务，再用 `/BackgroundImage/...` 引用）
 * - ❌ 禁止：`javascript:`、`expression()`、`behavior:`、`-moz-binding` 等可能导致代码执行/安全风险的写法
 * - ❌ 默认禁止：从外部域名加载资源（`@import http(s)://...`、`url(http(s)://...)`、`url(//...)`）
 *   解释：外部 CSS/图片/字体会产生对第三方的网络请求，可能带来隐私泄露与供应链风险；“安全优先”时应当拦截
 *
 * 备注：
 * - 这里使用的是“轻量正则过滤”，不是完整 CSS 解析器；目标是阻止已知高危用法
 * @param cssText 原始 CSS 代码
 * @returns 过滤后的 CSS 代码
 */
function sanitizeCss(cssText: string): string {
    let sanitized = cssText;

    // 移除 expression() (IE 特有，已废弃但可能被利用)
    sanitized = sanitized.replace(/expression\s*\(/gi, '/* blocked expression */');

    // 移除 javascript: 协议（最危险的）
    sanitized = sanitized.replace(/javascript\s*:/gi, '/* blocked javascript */');

    // 移除 url() 中的 javascript:
    sanitized = sanitized.replace(/url\s*\(\s*['"]?javascript:/gi, 'url(/* blocked */');

    // 阻止老旧/高危 CSS 特性
    sanitized = sanitized.replace(/-moz-binding\s*:/gi, '/* blocked -moz-binding */');
    sanitized = sanitized.replace(/behavior\s*:/gi, '/* blocked behavior */');

    /**
     * 阻止外部 @import（只允许相对路径/同源路径/data:）
     * 典型格式：
     * - @import "xxx.css";
     * - @import url("xxx.css");
     */
    sanitized = sanitized.replace(
        /@import\s+(?:url\s*\(\s*)?(?:['"])?([^'")\s]+)(?:['"])?\s*\)?\s*;/gi,
        (full, rawUrl: string) => {
            const u = String(rawUrl || '').trim().toLowerCase();
            const isSafe =
                u.startsWith('/') ||
                u.startsWith('./') ||
                u.startsWith('../') ||
                u.startsWith('data:');
            return isSafe ? full : '/* blocked @import external resource */';
        },
    );

    /**
     * 阻止 url() 中的外部资源（只允许相对路径/同源路径/data:）
     * 例如：
     * - background-image: url(https://example.com/a.png)  => blocked
     * - background-image: url(/BackgroundImage/xxx.png)   => allowed
     * - src: url(data:font/woff2;base64,...)              => allowed
     */
    sanitized = sanitized.replace(
        /url\s*\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
        (full, _quote: string, rawUrl: string) => {
            const u = String(rawUrl || '').trim().toLowerCase();
            const isSafe =
                u.startsWith('/') ||
                u.startsWith('./') ||
                u.startsWith('../') ||
                u.startsWith('data:');

            // 额外拦截协议相对 //xxx 与 http(s)://xxx
            const isExternal =
                u.startsWith('//') || u.startsWith('http://') || u.startsWith('https://');

            if (isExternal || !isSafe) {
                return 'url(/* blocked external resource */)';
            }
            return full;
        },
    );

    return sanitized;
}

/**
 * 从 localStorage 加载自定义 CSS
 */
export function loadCustomCss(): void {
    const customCss = window.localStorage.getItem('customCss') || '';
    if (customCss) {
        injectCustomCss(customCss);
        return;
    }
    // 即便没有自定义 CSS，也要确保保护样式存在（避免被其它样式/扩展影响）
    ensureProtectedUiCss();
}

/**
 * 注入“受保护 UI”样式（必须在用户自定义 CSS 之后）
 *
 * 目标：
 * - 不允许用户通过“自定义 CSS 功能”隐藏管理员入口/管理员控制台（避免把自己锁死）
 * - 用户仍然可以对这些区域做配色/字体等美化，但无法通过 display/visibility/opacity/pointer-events 让它消失
 *
 * 原理：
 * - 我们把保护样式放在 <head> 最后
 * - 并且对关键属性使用 !important
 * - 由于注入顺序固定（用户 CSS 永远先于保护 CSS），用户无法通过该功能覆盖这些保护规则
 */
function ensureProtectedUiCss() {
    const css = `
/* ===== Fiora Protected UI CSS (auto-generated) ===== */
/* 管理员入口（侧边栏按钮）保护 */
#sidebar-root {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
#sidebar-buttons {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
#admin-entry {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
#admin-entry .iconfont {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 管理员控制台（rc-dialog）保护
 * 关键点：只对“打开态”生效（由 Admin.tsx 注入 class：admin-console-visible）
 * - 不能依赖 aria-hidden（在部分场景下可能为空，见用户反馈）
 * - 这样既能防止用户 CSS 隐藏弹窗，又不会阻止正常关闭
 */
.admin-console-wrap.admin-console-visible {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
.admin-console-wrap.admin-console-visible .rc-dialog.admin-console-dialog.admin-console-visible {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
`;

    const existed = document.getElementById('protected-ui-css') as HTMLStyleElement | null;
    if (existed) {
        // 更新内容，并确保它在 <head> 最后（保证覆盖顺序）
        existed.textContent = css;
        existed.remove();
        document.head.appendChild(existed);
        return;
    }
    const style = document.createElement('style');
    style.id = 'protected-ui-css';
    style.textContent = css;
    document.head.appendChild(style);
}

