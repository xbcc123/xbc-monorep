import { Controller } from 'egg';
import moment from 'moment'
import { changeLineColumnFile } from '../utils/error';

export default class HomeController extends Controller {

  // 收集 上报的错误数据
  public async create() {
    let req = this.ctx.request.body;
    const otherParams = { creatTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') };
    req = Object.assign({}, req, otherParams);
    req = await changeLineColumnFile(req)

    this.service.error.create(req)
    this.ctx.body = {
      code: 200,
      msg: '操作成功'
    }
  }

  // 获取数据展示
  public async list() {
    const req = this.ctx.request.query;
    const res = await this.service.error.list(req);
    const { list, totalSize } = res;
    const result = {
      code: 200,
      data: {
        list,
        page: Number(req.page),
        rowSize: list.length,
        totalSize
      },
    };
    this.ctx.body = result;
  }


}
