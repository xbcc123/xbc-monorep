import { JsError } from './jsError'
import { CustomError } from './customError'
import { IntefaceError } from './intefaceError'
import { StaticError } from './staticError'

// 脚本初始化
export class MonitorInit {
  constructor() {
    console.log('monitor--初始化开始');
    this.init()
    console.log('monitor--初始化完成');
  }
  init() {
    new JsError()
    new CustomError()
    new IntefaceError()
    new StaticError()
  }
}

