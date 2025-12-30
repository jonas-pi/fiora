import React, { useEffect, useState } from 'react';

import { css } from 'linaria';
import Style from './Admin.less';
import Common from './Common.less';
import Dialog from '../../components/Dialog';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Message from '../../components/Message';
import {
    getSealList,
    resetUserPassword,
    sealUser,
    setUserTag,
    sealIp,
    toggleSendMessage,
    toggleNewUserSendMessage,
    toggleRegister,
    toggleCreateGroup,
    getSystemConfig,
    getAllOnlineUsers,
} from '../../service';

const styles = {
    button: css`
        min-width: 100px;
        height: 36px;
        margin-right: 12px;
        padding: 0 10px;
    `,
};

type SystemConfig = {
    disableSendMessage: boolean;
    disableNewUserSendMessage: boolean;
    disableRegister: boolean;
    disableCreateGroup: boolean;
};

interface AdminProps {
    visible: boolean;
    onClose: () => void;
}

function Admin(props: AdminProps) {
    const { visible, onClose } = props;

    const [tagUsername, setTagUsername] = useState('');
    const [tag, setTag] = useState('');
    const [resetPasswordUsername, setResetPasswordUsername] = useState('');
    const [sealUsername, setSealUsername] = useState('');
    const [sealList, setSealList] = useState({ users: [], ips: [] });
    const [sealIpAddress, setSealIpAddress] = useState('');
    const [systemConfig, setSystemConfig] = useState<SystemConfig>();
    const [onlineUsers, setOnlineUsers] = useState<
        Array<{
            userId: string;
            username: string;
            avatar: string;
            ip: string;
            os: string;
            browser: string;
        }>
    >([]);

    async function handleGetSealList() {
        const sealListRes = await getSealList();
        if (sealListRes) {
            setSealList(sealListRes);
        }
    }
    async function handleGetSystemConfig() {
        const systemConfigRes = await getSystemConfig();
        if (systemConfigRes) {
            setSystemConfig(systemConfigRes);
        }
    }
    async function handleGetOnlineUsers() {
        const users = await getAllOnlineUsers();
        if (users) {
            setOnlineUsers(users);
        }
    }
    useEffect(() => {
        if (visible) {
            handleGetSystemConfig();
            handleGetSealList();
            handleGetOnlineUsers();
            // 每 5 秒刷新一次在线用户列表
            const interval = setInterval(() => {
                handleGetOnlineUsers();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [visible]);

    /**
     * 处理更新用户标签
     */
    async function handleSetTag() {
        const isSuccess = await setUserTag(tagUsername, tag.trim());
        if (isSuccess) {
            Message.success('更新用户标签成功, 请刷新页面更新数据');
            setTagUsername('');
            setTag('');
        }
    }

    /**
     * 处理重置用户密码操作
     */
    async function handleResetPassword() {
        const res = await resetUserPassword(resetPasswordUsername);
        if (res) {
            Message.success(`已将该用户的密码重置为:${res.newPassword}`);
            setResetPasswordUsername('');
        }
    }
    /**
     * 处理封禁用户操作
     */
    async function handleSeal() {
        const isSuccess = await sealUser(sealUsername);
        if (isSuccess) {
            Message.success('封禁用户成功');
            setSealUsername('');
            handleGetSealList();
        }
    }

    async function handleSealIp() {
        const isSuccess = await sealIp(sealIpAddress);
        if (isSuccess) {
            Message.success('封禁ip成功');
            setSealIpAddress('');
            handleGetSealList();
        }
    }

    async function handleDisableSendMessage() {
        const isSuccess = await toggleSendMessage(false);
        if (isSuccess) {
            Message.success('开启禁言成功');
            handleGetSystemConfig();
        }
    }
    async function handleEnableSendMessage() {
        const isSuccess = await toggleSendMessage(true);
        if (isSuccess) {
            Message.success('关闭禁言成功');
            handleGetSystemConfig();
        }
    }

    async function handleDisableSNewUserendMessage() {
        const isSuccess = await toggleNewUserSendMessage(false);
        if (isSuccess) {
            Message.success('开启新用户禁言成功');
            handleGetSystemConfig();
        }
    }
    async function handleEnableNewUserSendMessage() {
        const isSuccess = await toggleNewUserSendMessage(true);
        if (isSuccess) {
            Message.success('关闭新用户禁言成功');
            handleGetSystemConfig();
        }
    }

    /**
     * 处理切换注册功能
     */
    async function handleDisableRegister() {
        const isSuccess = await toggleRegister(false);
        if (isSuccess) {
            Message.success('已禁用注册功能');
            handleGetSystemConfig();
        }
    }

    async function handleEnableRegister() {
        const isSuccess = await toggleRegister(true);
        if (isSuccess) {
            Message.success('已启用注册功能');
            handleGetSystemConfig();
        }
    }

    /**
     * 处理切换创建群组功能
     */
    async function handleDisableCreateGroup() {
        const isSuccess = await toggleCreateGroup(false);
        if (isSuccess) {
            Message.success('已禁用创建群组功能');
            handleGetSystemConfig();
        }
    }

    async function handleEnableCreateGroup() {
        const isSuccess = await toggleCreateGroup(true);
        if (isSuccess) {
            Message.success('已启用创建群组功能');
            handleGetSystemConfig();
        }
    }

    return (
        <Dialog
            className={Style.admin}
            visible={visible}
            title="管理员控制台"
            onClose={onClose}
        >
            <div className={Common.container}>
                <div className={Common.block}>
                    {!systemConfig?.disableSendMessage ? (
                        <Button
                            className={styles.button}
                            type="danger"
                            onClick={handleDisableSendMessage}
                        >
                            开启禁言
                        </Button>
                    ) : (
                        <Button
                            className={styles.button}
                            onClick={handleEnableSendMessage}
                        >
                            关闭禁言
                        </Button>
                    )}
                    {!systemConfig?.disableNewUserSendMessage ? (
                        <Button
                            className={styles.button}
                            type="danger"
                            onClick={handleDisableSNewUserendMessage}
                        >
                            开启新用户禁言
                        </Button>
                    ) : (
                        <Button
                            className={styles.button}
                            onClick={handleEnableNewUserSendMessage}
                        >
                            关闭新用户禁言
                        </Button>
                    )}
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>系统配置</p>
                    {!systemConfig?.disableRegister ? (
                        <Button
                            className={styles.button}
                            type="danger"
                            onClick={handleDisableRegister}
                        >
                            禁用注册
                        </Button>
                    ) : (
                        <Button
                            className={styles.button}
                            onClick={handleEnableRegister}
                        >
                            启用注册
                        </Button>
                    )}
                    {!systemConfig?.disableCreateGroup ? (
                        <Button
                            className={styles.button}
                            type="danger"
                            onClick={handleDisableCreateGroup}
                        >
                            禁用创建群组
                        </Button>
                    ) : (
                        <Button
                            className={styles.button}
                            onClick={handleEnableCreateGroup}
                        >
                            启用创建群组
                        </Button>
                    )}
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>在线用户 ({onlineUsers.length})</p>
                    <div className={Style.sealList} style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {onlineUsers.length === 0 ? (
                            <span style={{ color: '#999' }}>暂无在线用户</span>
                        ) : (
                            onlineUsers.map((user) => (
                                <div
                                    key={user.userId}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '4px 0',
                                        borderBottom: '1px solid #eee',
                                    }}
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            marginRight: '8px',
                                        }}
                                    />
                                    <span style={{ flex: 1 }}>{user.username}</span>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            color: '#999',
                                            marginLeft: '8px',
                                        }}
                                        title={`IP: ${user.ip}, OS: ${user.os}, Browser: ${user.browser}`}
                                    >
                                        {user.ip}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>更新用户标签</p>
                    <div className={Style.inputBlock}>
                        <Input
                            className={`${Style.input} ${Style.tagUsernameInput}`}
                            value={tagUsername}
                            onChange={setTagUsername}
                            placeholder="要更新标签的用户名"
                        />
                        <Input
                            className={`${Style.input} ${Style.tagInput}`}
                            value={tag}
                            onChange={setTag}
                            placeholder="标签内容"
                        />
                        <Button className={Style.button} onClick={handleSetTag}>
                            确定
                        </Button>
                    </div>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>重置用户密码</p>
                    <div className={Style.inputBlock}>
                        <Input
                            className={Style.input}
                            value={resetPasswordUsername}
                            onChange={setResetPasswordUsername}
                            placeholder="要重置密码的用户名"
                        />
                        <Button
                            className={Style.button}
                            onClick={handleResetPassword}
                        >
                            确定
                        </Button>
                    </div>
                </div>

                <div className={Common.block}>
                    <p className={Common.title}>封禁用户</p>
                    <div className={Style.inputBlock}>
                        <Input
                            className={Style.input}
                            value={sealUsername}
                            onChange={setSealUsername}
                            placeholder="要封禁的用户名"
                        />
                        <Button className={Style.button} onClick={handleSeal}>
                            确定
                        </Button>
                    </div>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>封禁用户列表</p>
                    <div className={Style.sealList}>
                        {sealList.users.map((username) => (
                            <span className={Style.sealUsername} key={username}>
                                {username}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={Common.block}>
                    <p className={Common.title}>封禁ip</p>
                    <div className={Style.inputBlock}>
                        <Input
                            className={Style.input}
                            value={sealIpAddress}
                            onChange={setSealIpAddress}
                            placeholder="要封禁的ip"
                        />
                        <Button className={Style.button} onClick={handleSealIp}>
                            确定
                        </Button>
                    </div>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>封禁ip列表</p>
                    <div className={Style.sealList}>
                        {sealList.ips.map((ip) => (
                            <span className={Style.sealUsername} key={ip}>
                                {ip}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default Admin;
