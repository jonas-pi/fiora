import Constants from 'expo-constants';
import { getStorageValue } from './storage';

export const referer = 'https://fiora.suisuijiang.com/';

/**
 * 获取服务器地址（同步版本，用于初始化）
 * 优先级：app.json 中的 extra.serverHost > 默认值
 * 注意：此函数返回默认值，实际使用时应该使用 getServerHostAsync
 */
export function getServerHost(): string {
    // 优先使用 app.json 中的配置（通过 Constants.expoConfig.extra）
    if (Constants.expoConfig?.extra?.serverHost) {
        return Constants.expoConfig.extra.serverHost;
    }
    
    // 默认值：可以根据实际情况修改
    return 'http://localhost:9200';
}

/**
 * 获取服务器地址（异步版本，从本地存储读取）
 * 优先级：本地存储 > app.json 中的 extra.serverHost > 默认值
 */
export async function getServerHostAsync(): Promise<string> {
    // 优先从本地存储读取用户配置的服务器地址
    const savedHost = await getStorageValue('serverHost');
    if (savedHost) {
        return savedHost;
    }
    
    // 其次使用 app.json 中的配置
    if (Constants.expoConfig?.extra?.serverHost) {
        return Constants.expoConfig.extra.serverHost;
    }
    
    // 默认值
    return 'http://localhost:9200';
}
