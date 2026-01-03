import IO from 'socket.io-client';
import Toast from './components/Toast';
import action from './state/action';
import store from './state/store';
import {
    AddLinkmanAction,
    AddLinkmanActionType,
    AddLinkmanHistoryMessagesAction,
    AddLinkmanHistoryMessagesActionType,
    AddlinkmanMessageAction,
    AddlinkmanMessageActionType,
    ConnectAction,
    ConnectActionType,
    DeleteLinkmanMessageAction,
    DeleteLinkmanMessageActionType,
    Friend,
    Group,
    Message,
    RemoveLinkmanAction,
    RemoveLinkmanActionType,
    SetGuestAction,
    SetGuestActionType,
    State,
    Temporary,
    UpdateGroupPropertyAction,
    UpdateGroupPropertyActionType,
    UpdateUserPropertyAction,
    UpdateUserPropertyActionType,
    User,
} from './types/redux';
import getFriendId from './utils/getFriendId';
import platform from './utils/platform';
import { getStorageValue } from './utils/storage';
import { getServerHost, getServerHostAsync } from './utils/constant';

const { dispatch } = store;

const options = {
    transports: ['websocket'],
};

// 创建 socket 实例（初始使用默认地址，后续会重新连接）
let currentHost = getServerHost();
let socket = IO(currentHost, options);

/**
 * 设置 socket 事件监听器
 */
function setupSocketListeners() {
    // 移除旧的事件监听器（如果存在）
    socket.removeAllListeners();

    socket.on('connect', async () => {
        dispatch({
            type: ConnectActionType,
            value: true,
        } as ConnectAction);

        const token = await getStorageValue('token');

        if (token) {
            const [err, res] = await fetch(
                'loginByToken',
                {
                    token,
                    ...platform,
                },
                { toast: false },
            );
            if (err) {
                guest();
            } else {
                const user = res;
                action.setUser(user);

                const linkmanIds = [
                    ...user.groups.map((g: Group) => g._id),
                    ...user.friends.map((f: Friend) => f._id),
                ];
                const [err2, linkmans] = await fetch('getLinkmansLastMessagesV2', {
                    linkmans: linkmanIds,
                });
                if (!err2) {
                    action.setLinkmansLastMessages(linkmans);
                }
            }
        } else {
            guest();
        }
    });

    socket.on('disconnect', () => {
        dispatch({
            type: ConnectActionType,
            value: false,
        } as ConnectAction);
    });

    socket.on('message', (message: Message) => {
        const state = store.getState() as State;
        const linkman = state.linkmans.find((x) => x._id === message.to);
        if (linkman) {
            dispatch({
                type: AddlinkmanMessageActionType,
                linkmanId: message.to,
                message,
            } as AddlinkmanMessageAction);
        } else {
            const newLinkman: Temporary = {
                _id: getFriendId((state.user as User)._id, message.from._id),
                type: 'temporary',
                createTime: Date.now(),
                avatar: message.from.avatar,
                name: message.from.username,
                messages: [],
                unread: 1,
            };
            dispatch({
                type: AddLinkmanActionType,
                linkman: newLinkman,
                focus: false,
            } as AddLinkmanAction);

            fetch('getLinkmanHistoryMessages', {
                linkmanId: newLinkman._id,
                existCount: 0,
            }).then(([err, res]) => {
                if (!err) {
                    dispatch({
                        type: AddLinkmanHistoryMessagesActionType,
                        linkmanId: newLinkman._id,
                        messages: res,
                    } as AddLinkmanHistoryMessagesAction);
                }
            });
        }
    });

    socket.on(
        'changeGroupName',
        ({ groupId, name }: { groupId: string; name: string }) => {
            dispatch({
                type: UpdateGroupPropertyActionType,
                groupId,
                key: 'name',
                value: name,
            } as UpdateGroupPropertyAction);
        },
    );

    socket.on('deleteGroup', ({ groupId }: { groupId: string }) => {
        dispatch({
            type: RemoveLinkmanActionType,
            linkmanId: groupId,
        } as RemoveLinkmanAction);
    });

    socket.on('changeTag', (tag: string) => {
        dispatch({
            type: UpdateUserPropertyActionType,
            key: 'tag',
            value: tag,
        } as UpdateUserPropertyAction);
    });

    socket.on(
        'deleteMessage',
        ({ linkmanId, messageId }: { linkmanId: string; messageId: string }) => {
            dispatch({
                type: DeleteLinkmanMessageActionType,
                linkmanId,
                messageId,
            } as DeleteLinkmanMessageAction);
        },
    );
}

/**
 * 重新连接 socket（当服务器地址改变时调用）
 */
export async function reconnectSocket() {
    const newHost = await getServerHostAsync();
    if (newHost !== currentHost) {
        // 断开旧连接
        socket.disconnect();
        // 创建新连接
        currentHost = newHost;
        socket = IO(currentHost, options);
        // 重新设置事件监听器
        setupSocketListeners();
        // 连接
        socket.connect();
    } else {
        // 如果地址相同，只是重新连接
        socket.disconnect();
        socket.connect();
    }
}

function fetch<T = any>(
    event: string,
    data: any = {},
    { toast = true } = {},
): Promise<[string | null, T | null]> {
    return new Promise((resolve) => {
        socket.emit(event, data, (res: any) => {
            if (typeof res === 'string') {
                if (toast) {
                    Toast.danger(res);
                }
                resolve([res, null]);
            } else {
                resolve([null, res]);
            }
        });
    });
}

async function guest() {
    const [err, res] = await fetch('guest', {});
    if (!err) {
        dispatch({
            type: SetGuestActionType,
            linkmans: [res],
        } as SetGuestAction);
    }
}

// 初始化时设置事件监听器
setupSocketListeners();

// 延迟连接，等待应用检查服务器配置
// 如果用户首次启动，会在配置服务器后再连接
setTimeout(async () => {
    const host = await getServerHostAsync();
    if (host !== currentHost) {
        currentHost = host;
        socket.disconnect();
        socket = IO(currentHost, options);
        setupSocketListeners();
    }
    // 只有在已配置服务器地址时才连接
    const savedHost = await getStorageValue('serverHost');
    if (savedHost) {
        socket.connect();
    }
}, 1000);

export default socket;
