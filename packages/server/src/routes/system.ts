import fs from 'fs';
import path from 'path';
import axios from 'axios';
import assert, { AssertionError } from 'assert';
import { promisify } from 'util';
import RegexEscape from 'regex-escape';
import OSS, { STS } from 'ali-oss';

import config from '@fiora/config/server';
import logger from '@fiora/utils/logger';
import User from '@fiora/database/mongoose/models/user';
import Group from '@fiora/database/mongoose/models/group';

import Socket from '@fiora/database/mongoose/models/socket';
import {
    getAllSealIp,
    getAllSealUser,
    getSealIpKey,
    getSealUserKey,
    DisableSendMessageKey,
    DisableNewUserSendMessageKey,
    DisableRegisterKey,
    DisableCreateGroupKey,
    DisableDeleteMessageKey,
    getBannedUsernameKey,
    getAllBannedUsernames,
    Redis,
} from '@fiora/database/redis/initRedis';

/** 百度语言合成token */
let baiduToken = '';
/** 最后一次获取token的时间 */
let lastBaiduTokenTime = Date.now();

/**
 * 搜索用户和群组
 * @param ctx Context
 */
export async function search(ctx: Context<{ keywords: string }>) {
    const keywords = ctx.data.keywords?.trim() || '';
    if (keywords === '') {
        return {
            users: [],
            groups: [],
        };
    }

    const escapedKeywords = RegexEscape(keywords);
    const users = await User.find(
        { username: { $regex: escapedKeywords } },
        { avatar: 1, username: 1 },
    );
    const groups = await Group.find(
        { name: { $regex: escapedKeywords } },
        { avatar: 1, name: 1, members: 1 },
    );

    return {
        users,
        groups: groups.map((group) => ({
            _id: group._id,
            avatar: group.avatar,
            name: group.name,
            members: group.members.length,
        })),
    };
}

/**
 * 搜索表情包, 爬其它站资源
 * @param ctx Context
 */
export async function searchExpression(
    ctx: Context<{ keywords: string; limit?: number }>,
) {
    const { keywords, limit = Infinity } = ctx.data;
    if (keywords === '') {
        return [];
    }

    const res = await axios({
        method: 'get',
        url: `https://pic.sogou.com/pics/json.jsp?query=${encodeURIComponent(
            `${keywords} 表情`,
        )}&st=5&start=0&xml_len=60&callback=callback&reqFrom=wap_result&`,
        headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            referrer: `https://pic.sogou.com/pic/emo/searchList.jsp?statref=search_form&uID=hTHHybkSPt37C46z&spver=0&rcer=&keyword=${encodeURIComponent(
                keywords,
            )}`,
            referrerPolicy: 'no-referrer-when-downgrade',
            'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        },
    });
    assert(res.status === 200, '搜索表情包失败, 请重试');

    try {
        const parseDataResult = res.data.match(/callback\((.+)\)/);
        const data = JSON.parse(`${parseDataResult[1]}`);

        type Image = {
            locImageLink: string;
            width: number;
            height: number;
        };
        const images = data.items as Image[];
        return images
            .map(({ locImageLink, width, height }) => ({
                image: locImageLink,
                width,
                height,
            }))
            .filter((image, index) =>
                limit === Infinity ? true : index < limit,
            );
    } catch (err) {
        assert(false, '搜索表情包失败, 数据解析异常');
    }

    return [];
}

/**
 * 获取百度语言合成token
 */
export async function getBaiduToken() {
    if (baiduToken && Date.now() < lastBaiduTokenTime) {
        return { token: baiduToken };
    }

    const res = await axios.get(
        'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=pw152BzvaSZVwrUf3Z2OHXM6&client_secret=fa273cc704b080e85ad61719abbf7794',
    );
    assert(res.status === 200, '请求百度token失败');

    baiduToken = res.data.access_token;
    lastBaiduTokenTime =
        Date.now() + (res.data.expires_in - 60 * 60 * 24) * 1000;
    return { token: baiduToken };
}

/**
 * 封禁用户, 需要管理员权限
 * @param ctx Context
 */
export async function sealUser(ctx: Context<{ username: string }>) {
    const { username } = ctx.data;
    assert(username !== '', 'username不能为空');

    const user = await User.findOne({ username });
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    const userId = user._id.toString();
    const isSealUser = await Redis.has(getSealUserKey(userId));
    assert(!isSealUser, '用户已在封禁名单');

    await Redis.set(getSealUserKey(userId), userId, Redis.Minute * 10);

    return {
        msg: 'ok',
    };
}

/**
 * 解禁用户, 需要管理员权限
 * @param ctx Context
 */
export async function cancelSealUser(ctx: Context<{ username: string }>) {
    const { username } = ctx.data;
    assert(username !== '', 'username不能为空');

    const user = await User.findOne({ username });
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    const userId = user._id.toString();
    const key = getSealUserKey(userId);
    const isSealUser = await Redis.has(key);
    assert(isSealUser, '用户不在封禁名单');

    // 删除Redis key来解禁
    await Redis.del(key);

    return {
        msg: 'ok',
    };
}

/**
 * 获取封禁列表, 包含用户封禁和ip封禁, 需要管理员权限
 * @param ctx Context
 */
export async function getSealList(ctx: Context<any>) {
    const sealUserList = await getAllSealUser();
    const sealIpList = await getAllSealIp();
    const users = await User.find({ _id: { $in: sealUserList } });

    const result = {
        users: users.map((user) => user.username),
        ips: sealIpList,
    };
    return result;
}

const CantSealLocalIp = '不能封禁内网ip';
const CantSealSelf = '闲的没事封自己干啥';
const IpInSealList = 'ip已在封禁名单';

/**
 * 封禁 ip 地址, 需要管理员权限
 */
export async function sealIp(ctx: Context<{ ip: string }>) {
    const { ip } = ctx.data;
    assert(ip !== '::1' && ip !== '127.0.0.1', CantSealLocalIp);
    assert(ip !== ctx.socket.ip, CantSealSelf);

    const isSealIp = await Redis.has(getSealIpKey(ip));
    assert(!isSealIp, IpInSealList);

    await Redis.set(getSealIpKey(ip), ip, Redis.Hour * 6);

    return {
        msg: 'ok',
    };
}

/**
 * 解禁 ip 地址, 需要管理员权限
 */
export async function cancelSealIp(ctx: Context<{ ip: string }>) {
    const { ip } = ctx.data;
    assert(ip !== '', 'ip不能为空');

    const key = getSealIpKey(ip);
    const isSealIp = await Redis.has(key);
    assert(isSealIp, 'ip不在封禁名单');

    // 删除Redis key来解禁
    await Redis.del(key);

    return {
        msg: 'ok',
    };
}

/**
 * 封禁指定用户的所有在线 ip 地址, 需要管理员权限
 */
export async function sealUserOnlineIp(ctx: Context<{ userId: string }>) {
    const { userId } = ctx.data;

    const user = await User.findOne({ _id: userId });
    assert(user, '用户不存在');
    const sockets = await Socket.find({ user: userId });
    const ipList = [
        ...sockets.map((socket) => socket.ip),
        user.lastLoginIp,
    ].filter(
        (ip) =>
            ip !== '' &&
            ip !== '::1' &&
            ip !== '127.0.0.1' &&
            ip !== ctx.socket.ip,
    );

    // 如果全部 ip 都已经封禁过了, 则直接提示
    const isSealIpList = await Promise.all(
        ipList.map((ip) => Redis.has(getSealIpKey(ip))),
    );
    assert(!isSealIpList.every((isSealIp) => isSealIp), IpInSealList);

    await Promise.all(
        ipList.map(async (ip) => {
            await Redis.set(getSealIpKey(ip), ip, Redis.Hour * 6);
        }),
    );

    return {
        msg: 'ok',
    };
}

type STSResult = {
    enable: boolean;
    AccessKeyId: string;
    AccessKeySecret: string;
    bucket: string;
    region: string;
    SecurityToken: string;
    endpoint: string;
};

// eslint-disable-next-line consistent-return
export async function getSTS(): Promise<STSResult> {
    if (!config.aliyunOSS.enable) {
        // @ts-ignore
        return {
            enable: false,
        };
    }

    const sts = new STS({
        accessKeyId: config.aliyunOSS.accessKeyId,
        accessKeySecret: config.aliyunOSS.accessKeySecret,
    });
    try {
        const result = await sts.assumeRole(
            config.aliyunOSS.roleArn,
            undefined,
            undefined,
            'fiora-uploader',
        );
        // @ts-ignore
        return {
            enable: true,
            region: config.aliyunOSS.region,
            bucket: config.aliyunOSS.bucket,
            endpoint: config.aliyunOSS.endpoint,
            ...result.credentials,
        };
    } catch (err) {
        const typedErr = err as Error;
        assert.fail(`获取 STS 失败 - ${typedErr.message}`);
    }
}

export async function uploadFile(
    ctx: Context<{ fileName: string; file: any; isBase64?: boolean }>,
) {
    try {
        if (config.aliyunOSS.enable) {
            const sts = await getSTS();
            const client = new OSS({
                accessKeyId: sts.AccessKeyId,
                accessKeySecret: sts.AccessKeySecret,
                bucket: sts.bucket,
                region: sts.region,
                stsToken: sts.SecurityToken,
            });
            const result = await client.put(
                ctx.data.fileName,
                ctx.data.isBase64
                    ? Buffer.from(ctx.data.file, 'base64')
                    : ctx.data.file,
            );
            if (result.res.status === 200) {
                return {
                    url: `//${config.aliyunOSS.endpoint}/${result.name}`,
                };
            }
            throw Error('上传阿里云OSS失败');
        }

        const [directory, fileName] = ctx.data.fileName.split('/');
        // 修复：使用实际的 __dirname 变量而不是字符串字面量
        const filePath = path.resolve(__dirname, '../public', directory);
        const isExists = await promisify(fs.exists)(filePath);
        if (!isExists) {
            // 确保目录存在，使用 recursive 选项创建多级目录
            await promisify(fs.mkdir)(filePath, { recursive: true });
        }
        // 处理文件数据：如果是 base64 字符串则转换，如果是数组（Uint8Array 转换后的）则转换为 Buffer，否则直接使用
        let fileData: Buffer;
        if (ctx.data.isBase64) {
            // base64 字符串
            fileData = Buffer.from(ctx.data.file, 'base64');
        } else if (Array.isArray(ctx.data.file)) {
            // 从客户端发送的数组（Uint8Array 转换后的普通数组）
            fileData = Buffer.from(ctx.data.file);
        } else if (Buffer.isBuffer(ctx.data.file)) {
            // 已经是 Buffer
            fileData = ctx.data.file;
        } else {
            // 其他情况，尝试转换为 Buffer
            fileData = Buffer.from(ctx.data.file);
        }
        await promisify(fs.writeFile)(
            path.resolve(filePath, fileName),
            fileData,
        );
        return {
            url: `/${ctx.data.fileName}`,
        };
    } catch (err) {
        const typedErr = err as Error;
        logger.error('[uploadFile]', typedErr.message);
        return `上传文件失败:${typedErr.message}`;
    }
}

export async function toggleSendMessage(ctx: Context<{ enable: boolean }>) {
    const { enable } = ctx.data;
    await Redis.set(DisableSendMessageKey, (!enable).toString());
    return {
        msg: 'ok',
    };
}

export async function toggleNewUserSendMessage(
    ctx: Context<{ enable: boolean }>,
) {
    const { enable } = ctx.data;
    await Redis.set(DisableNewUserSendMessageKey, (!enable).toString());
    return {
        msg: 'ok',
    };
}

/**
 * 获取系统配置, 需要管理员权限
 */
export async function getSystemConfig() {
    // 从Redis读取配置，如果不存在则从config读取默认值
    const disableSendMessage = (await Redis.get(DisableSendMessageKey)) === 'true';
    const disableNewUserSendMessage = (await Redis.get(DisableNewUserSendMessageKey)) === 'true';
    const disableRegisterRedis = await Redis.get(DisableRegisterKey);
    const disableCreateGroupRedis = await Redis.get(DisableCreateGroupKey);
    const disableDeleteMessage = (await Redis.get(DisableDeleteMessageKey)) === 'true';
    
    return {
        disableSendMessage,
        disableNewUserSendMessage,
        disableRegister:
            disableRegisterRedis !== null
                ? disableRegisterRedis === 'true'
                : config.disableRegister,
        disableCreateGroup:
            disableCreateGroupRedis !== null
                ? disableCreateGroupRedis === 'true'
                : config.disableCreateGroup,
        disableDeleteMessage,
    };
}

/**
 * 更新系统配置, 需要管理员权限
 * @param ctx Context
 */
export async function updateSystemConfig(ctx: Context<{
    disableSendMessage?: boolean;
    disableNewUserSendMessage?: boolean;
    disableRegister?: boolean;
    disableCreateGroup?: boolean;
    disableDeleteMessage?: boolean;
}>) {
    const { disableSendMessage, disableNewUserSendMessage, disableRegister, disableCreateGroup, disableDeleteMessage } = ctx.data;
    
    // 更新配置到Redis（直接存储传入的值，不需要取反）
    if (typeof disableSendMessage === 'boolean') {
        await Redis.set(DisableSendMessageKey, disableSendMessage.toString());
    }
    if (typeof disableNewUserSendMessage === 'boolean') {
        await Redis.set(DisableNewUserSendMessageKey, disableNewUserSendMessage.toString());
    }
    if (typeof disableRegister === 'boolean') {
        await Redis.set(DisableRegisterKey, disableRegister.toString());
    }
    if (typeof disableCreateGroup === 'boolean') {
        await Redis.set(DisableCreateGroupKey, disableCreateGroup.toString());
    }
    if (typeof disableDeleteMessage === 'boolean') {
        await Redis.set(DisableDeleteMessageKey, disableDeleteMessage.toString());
    }
    
    return {
        msg: 'ok',
    };
}

/**
 * 切换注册功能开关，需要管理员权限
 */
export async function toggleRegister(ctx: Context<{ enable: boolean }>) {
    const { enable } = ctx.data;
    await Redis.set(DisableRegisterKey, (!enable).toString());
    return {
        msg: 'ok',
    };
}

/**
 * 封禁用户名（禁止使用该用户名注册）, 需要管理员权限
 * @param ctx Context
 */
export async function banUsername(ctx: Context<{ username: string }>) {
    const { username } = ctx.data;
    assert(username !== '', '用户名不能为空');
    
    const isBanned = await Redis.has(getBannedUsernameKey(username));
    assert(!isBanned, '该用户名已在封禁名单');
    
    // 永久封禁，不设置过期时间
    await Redis.set(getBannedUsernameKey(username), username, Infinity);
    
    return {
        msg: 'ok',
    };
}

/**
 * 切换创建群组功能开关，需要管理员权限
 */
export async function toggleCreateGroup(ctx: Context<{ enable: boolean }>) {
    const { enable } = ctx.data;
    await Redis.set(DisableCreateGroupKey, (!enable).toString());
    return {
        msg: 'ok',
    };
}

/**
 * 解禁用户名, 需要管理员权限
 * @param ctx Context
 */
export async function unbanUsername(ctx: Context<{ username: string }>) {
    const { username } = ctx.data;
    assert(username !== '', '用户名不能为空');
    
    const key = getBannedUsernameKey(username);
    const isBanned = await Redis.has(key);
    assert(isBanned, '该用户名不在封禁名单');
    
    // 删除Redis key来解禁
    await Redis.del(key);
    
    return {
        msg: 'ok',
    };
}

/**
 * 获取封禁用户名列表, 需要管理员权限
 * @param ctx Context
 */
export async function getBannedUsernameList(ctx: Context<any>) {
    try {
        logger.info('[getBannedUsernameList]', '函数被调用 - 时间戳:', Date.now());
        const bannedUsernames = await getAllBannedUsernames();
        logger.info('[getBannedUsernameList]', '封禁用户名数量:', bannedUsernames.length);
        return {
            usernames: bannedUsernames,
        };
    } catch (err) {
        logger.error('[getBannedUsernameList]', '错误:', err);
        throw err;
    }
}

/**
 * 获取所有在线用户列表，需要管理员权限
 */
export async function getAllOnlineUsers() {
    // 获取所有有用户的 socket 连接
    const sockets = await Socket.find(
        {
            user: { $exists: true, $ne: null },
        },
        {
            user: 1,
            ip: 1,
            os: 1,
            browser: 1,
        },
    ).populate('user', { username: 1, avatar: 1, _id: 1 });

    // 去重，每个用户只保留一个记录
    const userMap = new Map();
    sockets.forEach((socket) => {
        if (socket.user && typeof socket.user === 'object') {
            const userId = socket.user._id.toString();
            if (!userMap.has(userId)) {
                userMap.set(userId, {
                    userId,
                    username: socket.user.username,
                    avatar: socket.user.avatar,
                    ip: socket.ip,
                    os: socket.os || '未知',
                    browser: socket.browser || '未知',
                });
            }
        }
    });

    return Array.from(userMap.values());
}
