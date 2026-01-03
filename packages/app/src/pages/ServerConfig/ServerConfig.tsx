import React, { useRef, useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Form, Label, Button, View, Container } from 'native-base';
import { Actions } from 'react-native-router-flux';

import PageContainer from '../../components/PageContainer';
import { getStorageValue, setStorageValue } from '../../utils/storage';
import { getServerHost } from '../../utils/constant';
import socket from '../../socket';
import Toast from '../../components/Toast';

/**
 * 服务器配置页面
 * 首次启动时显示，允许用户输入服务器地址
 */
export default function ServerConfig() {
    const [serverHost, setServerHost] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const $serverHost = useRef<TextInput>();

    // 加载已保存的服务器地址
    useEffect(() => {
        async function loadServerHost() {
            const savedHost = await getStorageValue('serverHost');
            if (savedHost) {
                setServerHost(savedHost);
            } else {
                // 如果没有保存的地址，使用默认值
                const defaultHost = getServerHost();
                setServerHost(defaultHost);
            }
        }
        loadServerHost();
    }, []);

    /**
     * 验证服务器地址格式
     * 支持 http:// 和 https:// 协议
     * 支持 IP 地址和域名
     */
    function validateServerHost(host: string): boolean {
        if (!host || host.trim() === '') {
            Toast.danger('服务器地址不能为空');
            return false;
        }

        // 移除首尾空格
        const trimmedHost = host.trim();

        // 检查是否包含协议
        if (!trimmedHost.startsWith('http://') && !trimmedHost.startsWith('https://')) {
            Toast.danger('服务器地址必须以 http:// 或 https:// 开头');
            return false;
        }

        // 基本格式验证
        try {
            const url = new URL(trimmedHost);
            if (!url.hostname) {
                Toast.danger('服务器地址格式不正确');
                return false;
            }
        } catch (e) {
            Toast.danger('服务器地址格式不正确，请检查输入');
            return false;
        }

        return true;
    }

    /**
     * 测试服务器连接
     */
    async function testConnection(host: string): Promise<boolean> {
        return new Promise((resolve) => {
            // 创建一个临时的 socket 连接来测试
            const testSocket = require('socket.io-client').default(host, {
                transports: ['websocket'],
                timeout: 5000, // 5秒超时
            });

            const timeout = setTimeout(() => {
                testSocket.disconnect();
                resolve(false);
            }, 5000);

            testSocket.on('connect', () => {
                clearTimeout(timeout);
                testSocket.disconnect();
                resolve(true);
            });

            testSocket.on('connect_error', () => {
                clearTimeout(timeout);
                testSocket.disconnect();
                resolve(false);
            });
        });
    }

    /**
     * 处理提交
     */
    async function handleSubmit() {
        $serverHost.current!.blur();

        if (!validateServerHost(serverHost)) {
            return;
        }

        const trimmedHost = serverHost.trim();
        setIsConnecting(true);

        try {
            // 测试连接
            const isConnected = await testConnection(trimmedHost);
            
            if (!isConnected) {
                Alert.alert(
                    '连接失败',
                    '无法连接到服务器，请检查：\n1. 服务器地址是否正确\n2. 设备是否与服务器在同一网络\n3. 服务器是否正在运行',
                    [{ text: '确定' }]
                );
                setIsConnecting(false);
                return;
            }

            // 保存服务器地址
            await setStorageValue('serverHost', trimmedHost);

            // 重新连接 socket
            const socketModule = require('../../socket');
            if (socketModule && socketModule.reconnectSocket) {
                await socketModule.reconnectSocket();
            } else {
                // 如果 reconnectSocket 不可用，手动重新加载
                const socket = require('../../socket').default;
                socket.disconnect();
                socket.connect();
            }
            
            Toast.success('服务器地址已保存，正在重新连接...');
            
            // 延迟一下让用户看到提示
            setTimeout(() => {
                setIsConnecting(false);
                // 返回到主界面（如果是从设置页面进入的，则返回；否则进入主界面）
                try {
                    const state = Actions.state;
                    if (state && state.routes && state.routes.length > 1) {
                        Actions.pop();
                    } else {
                        Actions.replace('chatlist');
                    }
                } catch (e) {
                    Actions.replace('chatlist');
                }
            }, 1000);
        } catch (error) {
            setIsConnecting(false);
            Toast.danger('连接测试失败，请重试');
        }
    }

    return (
        <PageContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <Container style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>配置服务器地址</Text>
                        <Text style={styles.description}>
                            请输入 Fiora 服务器的地址{'\n'}
                            支持局域网 IP 和域名
                        </Text>
                    </View>

                    <Form style={styles.form}>
                        <Label style={styles.label}>服务器地址</Label>
                        <TextInput
                            style={styles.input}
                            // @ts-ignore
                            ref={$serverHost}
                            value={serverHost}
                            onChangeText={setServerHost}
                            placeholder="http://192.168.1.100:9200"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                            editable={!isConnecting}
                        />
                        <Text style={styles.hint}>
                            示例：{'\n'}
                            • http://192.168.1.100:9200（局域网）{'\n'}
                            • https://fiora.example.com（域名）{'\n'}
                            • http://localhost:9200（本地）
                        </Text>
                    </Form>

                    <Button
                        primary
                        block
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={isConnecting}
                    >
                        <Text style={styles.buttonText}>
                            {isConnecting ? '连接中...' : '保存并连接'}
                        </Text>
                    </Button>
                </Container>
            </KeyboardAvoidingView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        color: '#333',
        fontSize: 16,
    },
    input: {
        height: 48,
        fontSize: 16,
        borderRadius: 8,
        marginBottom: 12,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        lineHeight: 18,
        marginTop: 4,
    },
    button: {
        marginTop: 20,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    },
});

