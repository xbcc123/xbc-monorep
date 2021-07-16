import { Service } from 'egg';

/**
 * Error Service
 */
export default class ErrorService extends Service {

  // 插入数据
  public async create(req) {
    this.ctx.model.ErrorModel.insertMany(req)
  }

  // 获取数据展示
  public async list(req) {
    req = {...req}
    let results: any = {}, total: any[] = []

    // 分页处理
    req.rows = Number(req.rows)
    req.page = req.page - 1

    // 参数处理
    let options: any = {}
    const { ip, city, path, type, system, errorMessage, fileUrl, domain, browser, httpCode } = req
    options = {
      ip,
      city,
      path,
      type,
      system,
      errorMessage,
      fileUrl,
      domain,
      browser,
      httpCode
    }
    for (const key in options) {
      if(options[key] === undefined) {
        delete options[key]
      }
    }

    // 查询数据
    results.list = await this.ctx.model.ErrorModel.find(options).skip(req.page * req.rows || 0).limit(req.rows || null)
    total = await this.ctx.model.ErrorModel.find()
    results.totalSize = total.length
    return results;
  }

}
