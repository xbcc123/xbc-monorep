import { IMonitorInitOptions } from "../types";

// 获取初始化参数
export class InitOptions {
  options: IMonitorInitOptions
  constructor(options) {
    this.options = options
    this.setOptions()
  }

  public setOptions() {
    Object.assign(window, this.options)
  }
}
