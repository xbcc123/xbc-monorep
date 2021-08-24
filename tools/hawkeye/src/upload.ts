import axios from "axios"

// 数据上报方法
export class Upload {

  // 发送数据
  static send(performanceInfo, type) {
    console.log(`开始发送数据, 数据信息, type = ${type}` , performanceInfo)
    axios.post('http://localhost:7001/api/performance', performanceInfo).then(res => {
    })
  }

}
