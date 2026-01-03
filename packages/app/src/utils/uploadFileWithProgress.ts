import { getServerHostAsync } from './constant';

/**
 * 使用 HTTP 上传 base64 文件（移动端），支持进度回调
 * @param base64Data base64 编码的字符串
 * @param fileName 文件名
 * @param onProgress 进度回调函数 (progress: number) => void，progress 范围 0-100
 * @returns Promise<string> 返回文件 URL
 */
export default async function uploadFileWithProgress(
    base64Data: string,
    fileName: string,
    onProgress?: (progress: number) => void,
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        // 获取服务器地址
        const serverHost = await getServerHostAsync();
        const serverUrl = serverHost.replace(/\/$/, '');
        const uploadUrl = `${serverUrl}/api/upload`;

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        
        // 注意：React Native 的 FormData 需要特殊处理 base64
        // 在 React Native 中，FormData.append() 对于字符串会作为文本字段发送
        // 但需要确保 base64 数据格式正确（去除 data URI 前缀如果存在）
        let cleanBase64 = base64Data;
        // 如果包含 data URI 前缀，先去除（虽然服务端也会处理，但提前处理更好）
        if (cleanBase64.includes(',')) {
            cleanBase64 = cleanBase64.split(',')[1];
        }
        
        formData.append('file', cleanBase64);
        formData.append('fileName', fileName);
        formData.append('isBase64', 'true');

        // 监听上传进度
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        });

        // 监听完成
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.error) {
                        reject(new Error(response.error));
                    } else {
                        resolve(response.url);
                    }
                } catch (err) {
                    reject(new Error('解析响应失败'));
                }
            } else {
                reject(new Error(`上传失败: ${xhr.statusText || xhr.status}`));
            }
        });

        // 监听错误
        xhr.addEventListener('error', () => {
            reject(new Error('网络错误'));
        });

        // 监听取消
        xhr.addEventListener('abort', () => {
            reject(new Error('上传已取消'));
        });

        // 发送请求
        xhr.open('POST', uploadUrl);
        xhr.send(formData);
    });
}

