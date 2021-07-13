import { JsError } from './jsError'
import { CustomError } from './customError'
import { IntefaceError } from './intefaceError'
import { StaticError } from './staticError'

// 脚本初始化
export class MonitorInit {
  constructor() {
    this.init()
  }
  init() {
    new JsError()
    new CustomError()
    new IntefaceError()
    new StaticError()
  }
}

