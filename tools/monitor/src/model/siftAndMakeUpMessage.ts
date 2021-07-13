// 错误上报

import { CommonErrorInfo } from "./commonErrorInfo";

export class SiftAndMakeUpMessage {
  sourceErrorInfo: any;
  constructor(sourceErrorInfo){
    this.sourceErrorInfo = sourceErrorInfo
  }

  // 获取用户信息
  getUser() {
    return {
      "name":"张三",
      "cName":"滴答",
      "phone": "13545199216",
      "id":"sdfkljsdfj233ksdfsdf",
    }
  }

  // 获取ip信息
  getIp() {
    return ""
  }

  // 获取当前时间
  getCurrentDate() {
    return new Date().getTime()
  }

  // 获取当前城市
  getCity() {
    return ""
  }

  // 获取详细错误信息
  geterrorObj() {
    return ""
  }

  // 获取路由信息
  getPath() {
    return window.location.origin
  }

  // 获取错误类型
  getType() {
    return ""
  }

  // 获取系统类型
  getSystem() {
    return ""
  }

  // 获取错误信息
  getErrorMessage() {
    return ""
  }

  // 错误脚本
  getFileUrl() {
    return ""
  }

  // 错误域名
  getDomain() {
    return window.location.origin
  }

  // 浏览器
  getBrowser() {
    return ""
  }

  // 错误行
  getLineNmber() {
    return ""
  }

  // 错误列
  getCloumnNumber() {
    return ""
  }

  // http状态码
  getHttpCode() {
    return ""
  }

  // 获取错误信息
  get errorInfo(): CommonErrorInfo {
    return {
      user: this.getUser(),
      ip:"192.168.1.109",
      date:"2021-07-02 12:23:35",
      city:"湖北武汉市",
      errorObj:{},
      path:"/",
      type:1,
      system:1,
      errorMessage:"服务器内部错误",
      fileUrl:"/path/index.js",
      domain:"https://www.baidu.com",
      browser:"谷歌",
      lineNmber:12,
      cloumnNumber:30,
      httpCode:400,
    } as any
  }

}



