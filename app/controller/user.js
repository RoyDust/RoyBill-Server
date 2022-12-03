'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body; // 注册的账号密码

    // 判空操作
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null,
      };
      return;
    }

    // 验证数据库里面是否已有改账号名
    const userinfo = await ctx.service.user.getUserByName(username); // 获取用户信息
    console.log(userinfo);

    // 判断是否已经存在用户名
    if (userinfo && userinfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号已经被注册，请重新输入',
        data: null,
      };
      return null;
    }

    // 默认头像，放在user.js的最外，避免重复声明
    const defaultAvatar = 'https://p3-passport.byteimg.com/img/user-avatar/9cc01b94d45634043988e47546e38f60~100x100.awebp';
    // 调用service方法，将数据存入数据库
    const res = await ctx.service.user.register({
      username,
      password,
      signature: 'Hello World',
      avatar: defaultAvatar,
    });

    if (res) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }

  // 注册操作
  async login() {
    // app 为全局属性，相当于所有插件都植入到了app对象
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找相对应的id操作
    const userInfo = await ctx.service.user.getUserByName(username);
    // 如果没有找到改用户
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }
    // 如果找到用户，并且判断输入的密码和数据库里的密码
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null,
      };
      return;
    }

    // 如果以上都通过，就生成token加盐
    // app.jwt.sign 方法接收两个参数，
    // 第一个为对象，对象内是要加密的内容；
    // 第二个为加密字符串，在config中
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // token 有效期为 24 小时
    }, app.config.jwt.secret);

    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token,
      },
    };
  }

  // 验证方法
  async test() {
    const { ctx, app } = this;
    // 通过token解析，拿到user_id
    const token = ctx.request.header.authorization; // 请求头获取authorization属性，值为token
    // 通过app.jwt.verify + 加密字符串 解析出token的值
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 响应接口
    ctx.body = {
      code: 200,
      msg: '获取成功',
      data: {
        ...decode,
      },
    };
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    // 通过app.jwt.verify 方法，解析出token的用户信息
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 通过getUserByName 方法，以用户名decode.username 为参数，从数据库获取到用户名
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    // userInfo 中应该有密码信息，所以我们指定返回下面四项给客户端
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar,
      },
    };
  }

  // 修改用户信息
  async editUserInfo() {
    const { ctx, app } = this;
    // 通过post请求，在请求体中获取签名手段 signature
    const { signature = '', avatar = '' } = ctx.request.body;

    try {
      let user_id = '';
      const token = ctx.request.header.authorization;
      // jwt解密token
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;
      // 获取完整用户信息
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      // 通过 service 方法 editUserInfo 修改 signature 信息。
      const res = await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id: user_id,
          signature,
          username: userInfo.username,
          avatar,
        },
      };
    } catch (err) {
      console.log(err);
    }

  }
}

module.exports = UserController;
