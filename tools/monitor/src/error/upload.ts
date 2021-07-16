import axios from "axios"

// 数据上报方法
export class Upload {
  constructor() {

  }

  // 发送数据
  static send(errorInfo, type) {
    console.log(`开始发送数据, 数据信息, type = ${type}` , errorInfo)
    axios.post('http://localhost:7001/api/error', errorInfo).then(res => {
    })
  }

}
