import bcrypt from 'bcryptjs';
import assert, { AssertionError } from 'assert';
import jwt from 'jwt-simple';
import { Types } from '@fiora/database/mongoose';

import config from '@fiora/config/server';
import logger from '@fiora/utils/logger';
import getRandomAvatar from '@fiora/utils/getRandomAvatar';
import { SALT_ROUNDS } from '@fiora/utils/const';
import User, { UserDocument } from '@fiora/database/mongoose/models/user';
import Group, { GroupDocument } from '@fiora/database/mongoose/models/group';
import Friend, { FriendDocument } from '@fiora/database/mongoose/models/friend';
import Socket from '@fiora/database/mongoose/models/socket';
import Message, {
    handleInviteV2Messages,
} from '@fiora/database/mongoose/models/message';
import Notification from '@fiora/database/mongoose/models/notification';
import History from '@fiora/database/mongoose/models/history';
import { io } from '../app';
import {
    getNewRegisteredUserIpKey,
    getNewUserKey,
    getBannedUsernameKey,
    DisableRegisterKey,
    Redis,
    DisableRegisterKey,
} from '@fiora/database/redis/initRedis';

const { isValid } = Types.ObjectId;

/** 一天时间 */
const OneDay = 1000 * 60 * 60 * 24;

interface Environment {
    /** 客户端系统 */
    os: string;
    /** 客户端浏览器 */
    browser: string;
    /** 客户端环境信息 */
    environment: string;
}

/**
 * 生成jwt token
 * @param user 用户
 * @param environment 客户端环境信息
 */
function generateToken(user: string, environment: string) {
    return jwt.encode(
        {
            user,
            environment,
            expires: Date.now() + config.tokenExpiresTime,
        },
        config.jwtSecret,
    );
}

/**
 * 处理注册时间不满24小时的用户
 * @param user 用户
 */
async function handleNewUser(user: UserDocument, ip = '') {
    // 将用户添加到新用户列表, 24小时后删除
    if (Date.now() - user.createTime.getTime() < OneDay) {
        const userId = user._id.toString();
        await Redis.set(getNewUserKey(userId), userId, Redis.Day);

        if (ip) {
            const registeredCount = await Redis.get(
                getNewRegisteredUserIpKey(ip),
            );
            await Redis.set(
                getNewRegisteredUserIpKey(ip),
                (parseInt(registeredCount || '0', 10) + 1).toString(),
                Redis.Day,
            );
        }
    }
}

async function getUserNotificationTokens(user: UserDocument) {
    const notifications = (await Notification.find({ user })) || [];
    return notifications.map(({ token }) => token);
}

/**
 * 注册新用户
 * @param ctx Context
 */
export async function register(
    ctx: Context<{ username: string; password: string } & Environment>,
) {
<<<<<<< HEAD
    // 检查Redis中的配置，如果Redis中没有则使用config中的默认值
    const redisDisableRegister = (await Redis.get(DisableRegisterKey)) === 'true';
    const isRegisterDisabled = redisDisableRegister || config.disableRegister;
    assert(!isRegisterDisabled, '注册功能已被禁用, 请联系管理员开通账号');
=======
    // 从 Redis 读取配置，如果不存在则从环境变量读取
    const disableRegisterRedis = await Redis.get(DisableRegisterKey);
    const disableRegister =
        disableRegisterRedis !== null
            ? disableRegisterRedis === 'true'
            : config.disableRegister;
    
    assert(!disableRegister, '注册功能已被禁用, 请联系管理员开通账号');
>>>>>>> 4c250ef99783abfcef7b11db5c49904b3c85077b

    const { username, password, os, browser, environment } = ctx.data;
    assert(username, '用户名不能为空');
    assert(password, '密码不能为空');

    // 检查用户名是否被封禁
    try {
        const isBanned = await Redis.has(getBannedUsernameKey(username));
        assert(!isBanned, '该用户名已被封禁，无法使用');
    } catch (redisError) {
        // Redis连接错误时，记录日志但不阻止注册（降级处理）
        logger.error('[register] Redis error when checking banned username:', redisError);
        // 继续执行，不阻止注册
    }

    const user = await User.findOne({ username });
    assert(!user, '该用户名已存在');

    // 检查24小时内同一IP注册次数限制
    let registeredCountWithin24Hours: string | null = null;
    try {
        registeredCountWithin24Hours = await Redis.get(
            getNewRegisteredUserIpKey(ctx.socket.ip),
        );
    } catch (redisError) {
        // Redis连接错误时，记录日志但不阻止注册（降级处理）
        logger.error('[register] Redis error when checking registration limit:', redisError);
        // 继续执行，不阻止注册
    }
    // 只有在Redis正常连接时才检查注册限制
    if (registeredCountWithin24Hours !== null) {
        const count = parseInt(registeredCountWithin24Hours || '0', 10);
        assert(count < 3, '24小时内同一IP地址最多只能注册3个账号，请稍后再试');
    }

    const defaultGroup = await Group.findOne({ isDefault: true });
    if (!defaultGroup) {
        // TODO: refactor when node types support "Assertion Functions" https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
        throw new AssertionError({ message: '默认群组不存在' });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    let newUser = null;
    try {
        newUser = await User.create({
            username,
            salt,
            password: hash,
            avatar: getRandomAvatar(),
            lastLoginIp: ctx.socket.ip,
        } as UserDocument);
    } catch (err) {
        if ((err as Error).name === 'ValidationError') {
            return '用户名包含不支持的字符或者长度超过限制';
        }
        throw err;
    }

    await handleNewUser(newUser, ctx.socket.ip);

    if (!defaultGroup.creator) {
        defaultGroup.creator = newUser._id;
    }
    defaultGroup.members.push(newUser._id);
    await defaultGroup.save();

    const token = generateToken(newUser._id.toString(), environment);

    ctx.socket.user = newUser._id.toString();
    await Socket.updateOne(
        { id: ctx.socket.id },
        {
            user: newUser._id,
            os,
            browser,
            environment,
        },
    );

    return {
        _id: newUser._id,
        avatar: newUser.avatar,
        username: newUser.username,
        groups: [
            {
                _id: defaultGroup._id,
                name: defaultGroup.name,
                avatar: defaultGroup.avatar,
                creator: defaultGroup.creator,
                createTime: defaultGroup.createTime,
                messages: [],
            },
        ],
        friends: [],
        token,
        isAdmin: false,
        notificationTokens: [],
    };
}

/**
 * 账密登录
 * @param ctx Context
 */
export async function login(
    ctx: Context<{ username: string; password: string } & Environment>,
) {
    const { username, password, os, browser, environment } = ctx.data;
    assert(username, '用户名不能为空');
    assert(password, '密码不能为空');

    const user = await User.findOne({ username });
    if (!user) {
        throw new AssertionError({ message: '该用户不存在' });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    assert(isPasswordCorrect, '密码错误');

    await handleNewUser(user);

    user.lastLoginTime = new Date();
    user.lastLoginIp = ctx.socket.ip;
    await user.save();

    const groups = await Group.find(
        { members: user._id },
        {
            _id: 1,
            name: 1,
            avatar: 1,
            creator: 1,
            createTime: 1,
        },
    );
    groups.forEach((group) => {
        ctx.socket.join(group._id.toString());
    });

    const friends = await Friend.find({ from: user._id }).populate('to', {
        avatar: 1,
        username: 1,
    });

    const token = generateToken(user._id.toString(), environment);

    ctx.socket.user = user._id.toString();
    await Socket.updateOne(
        { id: ctx.socket.id },
        {
            user: user._id,
            os,
            browser,
            environment,
        },
    );

    const notificationTokens = await getUserNotificationTokens(user);

    return {
        _id: user._id,
        avatar: user.avatar,
        username: user.username,
        tag: user.tag,
        groups,
        friends,
        token,
        isAdmin: config.administrator.includes(user._id.toString()),
        notificationTokens,
    };
}

/**
 * token登录
 * @param ctx Context
 */
export async function loginByToken(
    ctx: Context<{ token: string } & Environment>,
) {
    const { token, os, browser, environment } = ctx.data;
    assert(token, 'token不能为空');

    let payload = null;
    try {
        payload = jwt.decode(token, config.jwtSecret);
    } catch (err) {
        return '非法token';
    }

    assert(Date.now() < payload.expires, 'token已过期');
    assert.equal(environment, payload.environment, '非法登录');

    const user = await User.findOne(
        { _id: payload.user },
        {
            _id: 1,
            avatar: 1,
            username: 1,
            tag: 1,
            createTime: 1,
        },
    );
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    await handleNewUser(user);

    user.lastLoginTime = new Date();
    user.lastLoginIp = ctx.socket.ip;
    await user.save();

    const groups = await Group.find(
        { members: user._id },
        {
            _id: 1,
            name: 1,
            avatar: 1,
            creator: 1,
            createTime: 1,
        },
    );
    groups.forEach((group: GroupDocument) => {
        ctx.socket.join(group._id.toString());
    });

    const friends = await Friend.find({ from: user._id }).populate('to', {
        avatar: 1,
        username: 1,
    });

    ctx.socket.user = user._id.toString();
    await Socket.updateOne(
        { id: ctx.socket.id },
        {
            user: user._id,
            os,
            browser,
            environment,
        },
    );

    const notificationTokens = await getUserNotificationTokens(user);

    return {
        _id: user._id,
        avatar: user.avatar,
        username: user.username,
        tag: user.tag,
        groups,
        friends,
        isAdmin: config.administrator.includes(user._id.toString()),
        notificationTokens,
    };
}

/**
 * 游客登录, 只能获取默认群组信息
 * @param ctx Context
 */
export async function guest(ctx: Context<Environment>) {
    const { os, browser, environment } = ctx.data;

    await Socket.updateOne(
        { id: ctx.socket.id },
        {
            os,
            browser,
            environment,
        },
    );

    const group = await Group.findOne(
        { isDefault: true },
        {
            _id: 1,
            name: 1,
            avatar: 1,
            createTime: 1,
            creator: 1,
        },
    );
    if (!group) {
        throw new AssertionError({ message: '默认群组不存在' });
    }
    ctx.socket.join(group._id.toString());

    const messages = await Message.find(
        { to: group._id },
        {
            type: 1,
            content: 1,
            from: 1,
            createTime: 1,
            deleted: 1,
        },
        { sort: { createTime: -1 }, limit: 15 },
    ).populate('from', { username: 1, avatar: 1 });
    await handleInviteV2Messages(messages);
    messages.reverse();

    return { messages, ...group.toObject() };
}

/**
 * 修改用户头像
 * @param ctx Context
 */
export async function changeAvatar(ctx: Context<{ avatar: string }>) {
    const { avatar } = ctx.data;
    assert(avatar, '新头像链接不能为空');

    await User.updateOne(
        { _id: ctx.socket.user },
        {
            avatar,
        },
    );

    return {};
}

/**
 * 添加好友, 单向添加
 * @param ctx Context
 */
export async function addFriend(ctx: Context<{ userId: string }>) {
    const { userId } = ctx.data;
    assert(isValid(userId), '无效的用户ID');
    assert(ctx.socket.user !== userId, '不能添加自己为好友');

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new AssertionError({ message: '添加好友失败, 用户不存在' });
    }

    const friend = await Friend.find({ from: ctx.socket.user, to: user._id });
    assert(friend.length === 0, '你们已经是好友了');

    const newFriend = await Friend.create({
        from: ctx.socket.user as string,
        to: user._id,
    } as FriendDocument);

    return {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        from: newFriend.from,
        to: newFriend.to,
    };
}

/**
 * 删除好友, 单向删除
 * @param ctx Context
 */
export async function deleteFriend(ctx: Context<{ userId: string }>) {
    const { userId } = ctx.data;
    assert(isValid(userId), '无效的用户ID');

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    await Friend.deleteOne({ from: ctx.socket.user, to: user._id });
    return {};
}

/**
 * 修改用户密码
 * @param ctx Context
 */
export async function changePassword(
    ctx: Context<{ oldPassword: string; newPassword: string }>,
) {
    const { oldPassword, newPassword } = ctx.data;
    assert(newPassword, '新密码不能为空');
    assert(oldPassword !== newPassword, '新密码不能与旧密码相同');

    const user = await User.findOne({ _id: ctx.socket.user });
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }
    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);
    assert(isPasswordCorrect, '旧密码不正确');

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;
    await user.save();

    return {
        msg: 'ok',
    };
}

/**
 * 修改用户名
 * @param ctx Context
 */
export async function changeUsername(ctx: Context<{ username: string }>) {
    const { username } = ctx.data;
    assert(username, '新用户名不能为空');

    const user = await User.findOne({ username });
    assert(!user, '该用户名已存在, 换一个试试吧');

    const self = await User.findOne({ _id: ctx.socket.user });
    if (!self) {
        throw new AssertionError({ message: '用户不存在' });
    }

    self.username = username;
    await self.save();

    return {
        msg: 'ok',
    };
}

/**
 * 重置用户密码, 需要管理员权限
 * @param ctx Context
 */
export async function resetUserPassword(ctx: Context<{ username: string }>) {
    const { username } = ctx.data;
    assert(username !== '', 'username不能为空');

    const user = await User.findOne({ username });
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    const newPassword = 'helloworld';
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(newPassword, salt);

    user.salt = salt;
    user.password = hash;
    await user.save();

    return {
        newPassword,
    };
}

/**
 * 删除用户, 需要管理员权限
 * 删除用户及其所有相关数据（消息、群组关系、好友关系等），并强制下线
 * @param ctx Context
 */
export async function deleteUser(ctx: Context<{ username: string }>) {
    const { username } = ctx.data;
    assert(username !== '', 'username不能为空');

    const user = await User.findOne({ username });
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    const userId = user._id.toString();
    
    // 强制断开该用户的所有socket连接
    const userSockets = await Socket.find({ user: userId });
    const socketIds = userSockets.map((s) => s.id);
    socketIds.forEach((socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit('forceLogout', { reason: '账户已被管理员删除' });
            socket.disconnect(true);
        }
    });

    // 删除用户创建的所有消息
    const messages = await Message.find({ from: user._id });
    if (messages.length > 0) {
        // 删除消息相关的历史记录
        await History.deleteMany({
            message: {
                $in: messages.map((message) => message._id),
            },
        });
        // 删除消息
        await Message.deleteMany({ from: user._id });
    }

    // 从所有群组中移除该用户
    const groups = await Group.find({ members: user._id });
    await Promise.all(
        groups.map(async (group) => {
            const index = group.members.indexOf(user._id);
            if (index !== -1) {
                group.members.splice(index, 1);
            }
            // 如果用户是群主，清除群主信息
            if (group.creator?.toString() === userId) {
                // @ts-ignore
                group.creator = null;
            }
            await group.save();
        }),
    );

    // 删除该用户的所有好友关系
    await Friend.deleteMany({ from: user._id });
    await Friend.deleteMany({ to: user._id });

    // 删除该用户的socket记录
    await Socket.deleteMany({ user: user._id });

    // 删除该用户的通知
    await Notification.deleteMany({ user: user._id });

    // 最后删除用户本身
    await User.deleteOne({ _id: user._id });

    return {
        msg: 'ok',
    };
}

/**
 * 更新用户标签, 需要管理员权限
 * @param ctx Context
 */
export async function setUserTag(
    ctx: Context<{ username: string; tag: string }>,
) {
    const { username, tag } = ctx.data;
    assert(username !== '', 'username不能为空');
    assert(tag !== '', 'tag不能为空');
    assert(
        /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]){1,5}$/.test(tag),
        '标签不符合要求, 允许5个汉字或者10个字母',
    );

    const user = await User.findOne({ username });
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    user.tag = tag;
    await user.save();

    const sockets = await Socket.find({ user: user._id });
    const socketIdList = sockets.map((socket) => socket.id);
    if (socketIdList.length) {
        ctx.socket.emit(socketIdList, 'changeTag', user.tag);
    }

    return {
        msg: 'ok',
    };
}

/**
 * 获取指定在线用户 ip
 */
export async function getUserIps(
    ctx: Context<{ userId: string }>,
): Promise<string[]> {
    const { userId } = ctx.data;
    assert(userId, 'userId不能为空');
    assert(isValid(userId), '不合法的userId');

    const sockets = await Socket.find({ user: userId });
    const ipList = sockets.map((socket) => socket.ip) || [];
    return Array.from(new Set(ipList));
}

const UserOnlineStatusCacheExpireTime = 1000 * 60;
function getUserOnlineStatusWrapper() {
    const cache: Record<
        string,
        {
            value: boolean;
            expireTime: number;
        }
    > = {};
    return async function getUserOnlineStatus(
        ctx: Context<{ userId: string }>,
    ) {
        const { userId } = ctx.data;
        assert(userId, 'userId不能为空');
        assert(isValid(userId), '不合法的userId');

        if (cache[userId] && cache[userId].expireTime > Date.now()) {
            return {
                isOnline: cache[userId].value,
            };
        }

        const sockets = await Socket.find({ user: userId });
        const isOnline = sockets.length > 0;
        cache[userId] = {
            value: isOnline,
            expireTime: Date.now() + UserOnlineStatusCacheExpireTime,
        };
        return {
            isOnline,
        };
    };
}
export const getUserOnlineStatus = getUserOnlineStatusWrapper();
