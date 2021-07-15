import { Controller } from 'egg';

export default class HomeController extends Controller {

  // 收集 上报的错误数据
  public async create() {
    const { ctx, service } = this;
    let req = ctx.request.body;
    const otherParams = { update_time: new Date(), creat_time: new Date() };
    req = Object.assign({}, req, otherParams);
    const res = await service.cat.create(req);
    const result = {
      code: 200,
      data: res,
      msg: '操作成功',
    };
    ctx.body = result;
  }

  // 获取数据展示
  public async get() {
    // const { app } = this;
    const results = {};
    // const options = { where: { type: req.type }, offset: Number(req.page) - 1, limit: Number(req.rows) };
    // results.data = await app.mysql.select('cat_txt', options);
    // results.rowSize = await app.mysql.count('cat_txt', { type: req.type });
    return results;
  }


}
