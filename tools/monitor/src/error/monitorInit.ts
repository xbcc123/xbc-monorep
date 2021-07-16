import { JsError } from './jsError'
import { CustomError } from './customError'
import { IntefaceError } from './intefaceError'
import { StaticError } from './staticError'
import { InitOptions } from './options';
import { IMonitorInitOptions } from '../types';
import { InitAsyncData } from './initAsyncData';

// 脚本初始化
export class MonitorInit {
  options: IMonitorInitOptions
  constructor(options: IMonitorInitOptions) {
    this.options = options
    console.log('monitor--初始化开始');
    this.init()
    console.log('monitor--初始化完成');
  }
  init() {
    new InitOptions(this.options)
    new InitAsyncData()
    new JsError()
    new CustomError()
    new IntefaceError()
    new StaticError()
  }
}

