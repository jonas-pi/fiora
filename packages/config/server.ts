import ip from 'ip';

const { env } = process;

export default {
    /** 服务端host, 默认为本机ip地址(可能会是局域网地址) */
    host: env.Host || ip.address(),

    // service port
    port: env.Port ? parseInt(env.Port, 10) : 9200,

    // mongodb address
    database: env.Database || 'mongodb://localhost:27017/fiora',

    redis: {
        host: env.RedisHost || 'localhost',
        port: env.RedisPort ? parseInt(env.RedisPort, 10) : 6379,
    },

    // jwt encryption secret
    jwtSecret: env.JwtSecret || 'jwtSecret',

    // Maximize the number of groups
    maxGroupsCount: env.MaxGroupCount ? parseInt(env.MaxGroupCount, 10) : 3,

    allowOrigin: env.AllowOrigin ? env.AllowOrigin.split(',') : null,

    // token expires time
    tokenExpiresTime: env.TokenExpiresTime
        ? parseInt(env.TokenExpiresTime, 10)
        : 1000 * 60 * 60 * 24 * 30,

    // administrator user id
    administrator: env.Administrator ? env.Administrator.split(',') : [],

    /** 禁用注册功能 */
    disableRegister: env.DisableRegister
        ? env.DisableRegister === 'true'
        : false,

    /** disable user create new group */
    disableCreateGroup: env.DisableCreateGroup
        ? env.DisableCreateGroup === 'true'
        : false,

    /** 文件大小限制（字节） */
    maxFileSize: env.MaxFileSize
        ? parseInt(env.MaxFileSize, 10)
        : 20 * 1024 * 1024, // 20MB（原 10MB）

    /** Aliyun OSS */
    aliyunOSS: {
        enable: env.ALIYUN_OSS ? env.ALIYUN_OSS === 'true' : false,
        accessKeyId: env.ACCESS_KEY_ID || '',
        accessKeySecret: env.ACCESS_KEY_SECRET || '',
        roleArn: env.ROLE_ARN || '',
        region: env.REGION || '',
        bucket: env.BUCKET || '',
        endpoint: env.ENDPOINT || '',
    },

    /** 表情包 API 配置 (API盒子) */
    expressionApi: {
        /** API 接口地址 - 官方资源库版 */
        url: env.EXPRESSION_API_URL || 'https://cn.apihz.cn/api/img/apihzbqb.php',
        /** API 接口地址 - 搜狗版 */
        urlSogou: env.EXPRESSION_API_URL_SOGOU || 'https://cn.apihz.cn/api/img/apihzbqbsougou.php',
        /** API 接口地址 - 百度版 */
        urlBaidu: env.EXPRESSION_API_URL_BAIDU || 'https://cn.apihz.cn/api/img/apihzbqbbaidu.php',
        /** 开发者 ID (可在 .env 中配置 EXPRESSION_API_ID 覆盖) */
        id: env.EXPRESSION_API_ID || '10011686',
        /** 开发者 KEY (可在 .env 中配置 EXPRESSION_API_KEY 覆盖) */
        key: env.EXPRESSION_API_KEY || 'aeeb32f7f4f6c597f5366c5e94bde460',
        /** 是否启用聚合搜索（同时搜索官方资源库、搜狗版和百度版） */
        enableAggregate: env.EXPRESSION_API_AGGREGATE !== 'false', // 默认启用
    },
};
