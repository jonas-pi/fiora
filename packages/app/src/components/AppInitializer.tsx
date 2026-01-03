import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import { getStorageValue } from '../utils/storage';
import App from './App';

/**
 * 应用初始化组件
 * 检查是否首次启动，如果是则显示服务器配置页面
 */
export default function AppInitializer() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [shouldShowServerConfig, setShouldShowServerConfig] = useState(false);

    useEffect(() => {
        async function checkInitialization() {
            // 检查是否已配置服务器地址
            const serverHost = await getStorageValue('serverHost');
            const hasServerConfig = !!serverHost;

            // 如果没有配置服务器地址，显示配置页面
            if (!hasServerConfig) {
                setShouldShowServerConfig(true);
                // 延迟一下，确保路由已初始化
                setTimeout(() => {
                    Actions.replace('serverConfig');
                }, 100);
            }

            setIsInitialized(true);
        }

        checkInitialization();
    }, []);

    // 在初始化完成前不渲染主应用
    if (!isInitialized) {
        return null;
    }

    return <App />;
}




