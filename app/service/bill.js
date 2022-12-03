'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async add(params) {
    const { app } = this;
    try {
      // 往 bill 表中，插入一条账单数据
      const res = await app.mysql.insert('bill', params);
      return res;
    } catch (err) {
      console.log('添加错误：', err);
      return null;
    }
  }

  // 获取账单列表
  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  // 查询账单
  async detail(id, user_id) {
    const { app } = this;
    try {
      const res = await app.mysql.get('bill', { id, user_id });
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // 更新账单
  async update(params) {
    const { app } = this;
    try {
      const res = await app.mysql.update('bill', {
        ...params,
      }, {
        id: params.id,
        user_id: params.user_id,
      });
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // 删除服务
  async delete(id, user_id) {
    const { ctx, app } = this;
    try {
      const res = await app.mysql.delete('bill', {
        id,
        user_id,
      });
      return res;
    } catch (err) {
      console.log(err);
      return null;
    }
  }


}
module.exports = BillService;
