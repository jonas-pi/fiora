/* eslint-disable camelcase */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import config from '@fiora/config/client';
import setCssVariable from './utils/setCssVariable';
import { loadCustomCss } from './utils/injectCustomCss';
import App from './App';
import store from './state/store';
import getData from './localStorage';

// 引入CSS变量体系（为用户自定义CSS提供基础）
import './styles/cssVariables.css';

// 注册 Service Worker
if (window.location.protocol === 'https:' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(`/service-worker.js`).catch((err) => {
            // 静默处理 Service Worker 注册错误（可能是浏览器扩展冲突）
            console.warn('[Service Worker] 注册失败:', err);
        });
    });
}

// 捕获并忽略浏览器扩展引起的消息通道错误
// 这个错误通常由 Chrome 扩展引起，不影响应用功能
window.addEventListener('error', (event) => {
    if (
        event.error &&
        event.error.message &&
        event.error.message.includes('message channel closed before a response was received')
    ) {
        // 静默忽略这个错误（由浏览器扩展引起）
        event.preventDefault();
        return false;
    }
}, true);

// 捕获未处理的 Promise 拒绝（包括消息通道错误）
window.addEventListener('unhandledrejection', (event) => {
    if (
        event.reason &&
        event.reason.message &&
        event.reason.message.includes('message channel closed before a response was received')
    ) {
        // 静默忽略这个错误（由浏览器扩展引起）
        event.preventDefault();
        return false;
    }
});

// 如果配置了前端监控, 动态加载并启动监控
if (config.frontendMonitorAppId) {
    // @ts-ignore
    import(/* webpackChunkName: "frontend-monitor" */ 'wpk-reporter').then(
        (module) => {
            const WpkReporter = module.default;

            const __wpk = new WpkReporter({
                bid: config.frontendMonitorAppId,
                spa: true,
                rel: config.frontendMonitorAppId,
                uid: () => localStorage.getItem('username') || '',
                plugins: [],
            });

            __wpk.installAll();
        },
    );
}

// 更新 css variable
const { primaryColor, primaryTextColor } = getData();
setCssVariable(primaryColor, primaryTextColor);

// 加载用户自定义 CSS
loadCustomCss();

// 修复 aria-hidden 无障碍性问题
// 延迟加载以确保在 React 渲染完成后执行
setTimeout(() => {
    import('./utils/fixAriaHidden').then(({ observeAriaHidden }) => {
        observeAriaHidden();
    }).catch((err) => {
        console.warn('[fixAriaHidden] 加载失败:', err);
    });
}, 100);

// 请求 Notification 授权
if (
    window.Notification &&
    (window.Notification.permission === 'default' ||
        window.Notification.permission === 'denied')
) {
    window.Notification.requestPermission();
}

if (window.location.pathname !== '/') {
    const { pathname } = window.location;
    window.history.pushState({}, 'fiora', '/');
    if (pathname.startsWith('/invite/group/')) {
        const groupId = pathname.replace(`/invite/group/`, '');
        window.sessionStorage.setItem('inviteGroupId', groupId);
    }
}

ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'),
);
