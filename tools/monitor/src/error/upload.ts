// 数据上报方法
export class Upload {
  constructor() {

  }

  // 发送数据
  static send(errorInfo, type) {
    console.log(`开始发送数据, 数据信息, type = ${type}` , errorInfo)
  }

}