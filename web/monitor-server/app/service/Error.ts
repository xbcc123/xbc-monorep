import { Service } from 'egg';

/**
 * Error Service
 */
export default class Error extends Service {

  public async create(req) {
    console.log(req);

    // const { app } = this;
    const results = "错误数据"
    // const results = await app.mysql.insert('cat_txt', req);
    return results;
  }

  // 获取数据展示
  public async list() {
    // const { app } = this;
    const results = {};
    // const options = { where: { type: req.type }, offset: Number(req.page) - 1, limit: Number(req.rows) };
    // const results = {};
    // results.data = await app.mysql.select('cat_txt', options);
    // results.rowSize = await app.mysql.count('cat_txt', { type: req.type });
    return results;
  }

}
