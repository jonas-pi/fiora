# [Fiora](https://fiora.suisuijiang.com/) &middot; [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/yinxin630/fiora/blob/master/LICENSE) [![author](https://img.shields.io/badge/author-%E7%A2%8E%E7%A2%8E%E9%85%B1-blue.svg)](http://suisuijiang.com) [![Node.js Version](https://img.shields.io/badge/node.js-14.16.0-blue.svg)](http://nodejs.org/download) [![Test Status](https://github.com/yinxin630/fiora/workflows/Unit%20Test/badge.svg)](https://github.com/yinxin630/fiora/actions?query=workflow%3A%22Unit+Test%22) [![Typescript Status](https://github.com/yinxin630/fiora/workflows/Typescript%20Type%20Check/badge.svg)](https://github.com/yinxin630/fiora/actions?query=workflow%3A%22Typescript+Type+Check%22)


Fiora is an interesting open source chat application. It is developed based on [node.js](https://nodejs.org/), [react](https://reactjs.org/) and [socket.io](https://socket.io/) technologies

- **Richness:** Fiora contains backend, frontend, Android and iOS apps
- **Cross Platform:** Fiora is developed with node.js. Supports Windows / Linux / macOS systems
- **Open Source:** Fiora follows the MIT open source license

Online Example: [https://fiora.suisuijiang.com/](https://fiora.suisuijiang.com/)   
Documentation: [https://yinxin630.github.io/fiora/](https://yinxin630.github.io/fiora/)

**Other Client**   
Vscode Extension: [https://github.com/moonrailgun/fiora-for-vscode](https://github.com/moonrailgun/fiora-for-vscode)   

If you are seek for other open-source IM Application which like discord or slack, maybe try out `Tailchat`: https://tailchat.msgbyte.com/ 

## Features

1. Register an account and log in, it can save your data for a long time
2. Join an existing group or create your own group to communicate with everyone
3. Chat privately with anyone and add them as friends
4. Multiple message types, including text / emoticons / pictures / codes / files / commands, you can also search for emoticons
5. Push notification when you receive a new message, you can customize the notification ringtone, and it can also read the message out
6. Choose the theme you like, and you can set it as any wallpaper and theme color you like
7. Set up an administrator to manage users

## Screenshot

<img src="https://github.com/yinxin630/fiora/raw/master/packages/docs/static/img/screenshots/screenshot-pc.png" alt="PC" style="max-width:800px" />
<img src="https://github.com/yinxin630/fiora/raw/master/packages/docs/static/img/screenshots/screenshot-phone.png" alt="Phone" height="667" style="max-height:667px" />
<img src="https://github.com/yinxin630/fiora/raw/master/packages/docs/static/img/screenshots/screenshot-app.png" alt="App" height="896" style="max-height:896px" />

## Install

Fiora provides two ways to install

- [Install by source code](https://yinxin630.github.io/fiora/docs/install#how-to-run)
- [Install by docker](https://yinxin630.github.io/fiora/docs/install#running-on-the-docker)

## Configuration / 配置说明

Fiora supports configuration through environment variables. Create a `.env` file in the project root directory to configure the following options:

Fiora 支持通过环境变量进行配置。在项目根目录创建 `.env` 文件来配置以下选项：

### Server Configuration / 服务端配置

- `Host` - 服务端主机地址（默认：本机 IP 地址）
- `Port` - 服务端端口（默认：9200）
- `Database` - MongoDB 连接字符串（默认：mongodb://localhost:27017/fiora）
- `RedisHost` - Redis 主机地址（默认：localhost）
- `RedisPort` - Redis 端口（默认：6379）
- `JwtSecret` - JWT 加密密钥（默认：jwtSecret）
- `MaxGroupCount` - 每个用户最大群组数量（默认：3）
- `AllowOrigin` - 允许的 CORS 源（逗号分隔）
- `TokenExpiresTime` - Token 过期时间（毫秒，默认：30 天）
- `Administrator` - 管理员用户 ID（逗号分隔）
- `DisableRegister` - 禁用用户注册（默认：false）
- `DisableCreateGroup` - 禁用用户创建群组（默认：false）
- `MaxFileSize` - 最大文件上传大小（字节，默认：20MB）

### Client Configuration / 客户端配置

- `Server` - 客户端连接的服务端 URL
- `MaxImageSize` - 最大图片上传大小（字节，默认：10MB）
- `MaxBackgroundImageSize` - 最大背景图片大小（字节，默认：10MB）
- `MaxAvatarSize` - 最大头像大小（字节，默认：3MB）
- `MaxFileSize` - 最大文件上传大小（字节，默认：20MB）
- `DefaultTheme` - 默认主题（默认：cool）
- `Sound` - 默认通知音效（默认：default）
- `TagColorMode` - 标签颜色模式（默认：fixedColor）
- `FrontendMonitorAppId` - 前端监控应用 ID
- `DisableDeleteMessage` - 禁用用户删除消息（默认：false）
- `AndroidDownloadUrl` - Android APK 下载链接（用于二维码，建议设置为公网域名以确保手机扫码后可以正常下载）

### Example `.env` file / 示例 `.env` 文件

```bash
# Server Configuration / 服务端配置
Port=9200
Database=mongodb://localhost:27017/fiora
JwtSecret=your-secret-key
Administrator=your-user-id

# Client Configuration / 客户端配置
MaxImageSize=10485760
MaxFileSize=20971520
AndroidDownloadUrl=https://your-domain.com/fiora.apk
```

## Change Log

You can find the Fiora changelog [on the website](https://yinxin630.github.io/fiora/docs/changelog)

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate

1. Fork it (<https://github.com/yinxin630/fiora/fork>)
2. Create your feature branch (`git checkout -b some-feature`)
3. Commit your changes (`git commit -am 'Add some some features'`)
4. Push to the branch (`git push origin some-feature`)
5. Create a new Pull Request

## License

Fiora is [MIT licensed](./LICENSE)
