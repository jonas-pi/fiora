import React, { useEffect } from 'react';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';

import './Dialog.less';

/**
 * Dialog 包装器：修复 rc-dialog 在某些浏览器/版本下的 aria-hidden 焦点警告
 *
 * 现象（用户控制台可见）：
 * - “Blocked aria-hidden on an element because its descendant retained focus...”
 *
 * 根因（高概率）：
 * - rc-dialog 的“焦点哨兵”元素（通常是 `div[tabindex="0"]`）有时带 `aria-hidden="true"`
 * - 该元素被 focus 后，浏览器会警告“焦点元素不应被 aria-hidden”
 *
 * 解决策略（尽量小改动）：
 * - 监听 focusin：如果焦点落在 `aria-hidden="true"` 的元素上，则将其改为 `aria-hidden="false"`
 * - 对自定义 CSS/主题无影响，只消除警告并避免潜在的可访问性问题
 */
function fixAriaHiddenFocusTarget(target: EventTarget | null) {
    const el = target as HTMLElement | null;
    if (!el || !(el instanceof HTMLElement)) {
        return;
    }
    if (el.getAttribute('aria-hidden') === 'true') {
        el.setAttribute('aria-hidden', 'false');
    }
}

export default function DialogWrapper(props: any) {
    useEffect(() => {
        const handler = (e: FocusEvent) => fixAriaHiddenFocusTarget(e.target);
        document.addEventListener('focusin', handler, true);

        // 初始也做一次清理：把 rc-dialog 注入的 aria-hidden 哨兵修正掉
        // （避免第一次打开弹窗就报 warning）
        const timer = window.setTimeout(() => {
            const bad = document.querySelectorAll('div[tabindex="0"][aria-hidden="true"]');
            bad.forEach((node) => {
                (node as HTMLElement).setAttribute('aria-hidden', 'false');
            });
        }, 0);

        return () => {
            window.clearTimeout(timer);
            document.removeEventListener('focusin', handler, true);
        };
    }, []);

    return <Dialog {...props} />;
}
