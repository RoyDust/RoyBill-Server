/* eslint-disable array-bracket-spacing */
'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1669012392581_3419';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    // 设置上传位置
    uploadDir: 'app/public/upload',
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'xxx',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'juejue-cost',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // 跨域安全问题
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['*'], // 配置白名单
  };

  // ejs插件
  config.view = {
    mapping: { '.html': 'ejs' },
  };

  // jwt鉴权
  config.jwt = {
    secret: 'Nick',
  };

  // 设置读取方式
  config.multipart = {
    mode: 'file',
  };

  // 解决跨域
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许cookie跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  return {
    ...config,
    ...userConfig,
  };
};
