'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 通过用户名获取用户信息
  async getUserByName(username) {
    const { app } = this;
    try {
      const res = await app.mysql.get('user', { username });
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // 注册信息写入数据库
  async register(params) {
    const { app } = this;
    try {
      const res = await app.mysql.insert('user', params);
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // 修改信息
  async editUserInfo(params) {
    const { ctx, app } = this;
    try {
      // 通过app.mysql.updata方法，指定修改user表
      const res = await app.mysql.update('user', {
        ...params, // 将params的值解构
      }, {
        id: params.id, // 确定要修改的id
      });
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = UserService;
