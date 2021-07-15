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
    const global = window as any
    return global.returnCitySN?.cip || ''
  }

  // 获取当前时间
  getDate() {
    return new Date().getTime()
  }

  // 获取当前城市
  getCity() {
    const global = window as any
    return global.returnCitySN?.cname || ''
  }

  // 获取详细错误信息
  geterrorObj() {
    const { errorStack } = this.sourceErrorInfo
    return errorStack
  }

  // 获取路由信息
  getPath() {
    if(window.location.hash) {
      return window.location.hash.slice(1)
    }else {
      return window.location.pathname
    }
  }

  // 获取错误类型
  // getType() {
  //   return ""
  // }

  // 获取系统类型
  // getSystem() {
  //   return ""
  // }

  // 获取错误信息
  getErrorMessage() {
    const { errorMsg } = this.sourceErrorInfo
    return errorMsg
  }

  // 错误脚本
  getFileUrl() {
    return ""
  }

  // 浏览器
  getBrowser() {
    var Sys: any = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
    (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0;
     // 根据关系进行判断
    if (Sys.ie) return ('IE: ' + Sys.ie);
    if (Sys.edge) return ('EDGE: ' + Sys.edge);
    if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
    if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
    if (Sys.opera) return ('Opera: ' + Sys.opera);
    if (Sys.safari) return ('Safari: ' + Sys.safari);
    return 'Unkonwn';
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
    const { httpCode = '' } = this.sourceErrorInfo
    return httpCode
  }

  // 获取错误信息
  get errorInfo(): CommonErrorInfo {
    const { type, lineNumber, columnNumber, url: fileUrl } = this.sourceErrorInfo
    const global = window as any
    return {
      // 基础字段 不需要另外做判断
      user: this.getUser() as any,
      ip: this.getIp(),
      date: this.getDate(),
      city: this.getCity(),
      path: this.getPath(),
      type,
      system: global.__SYSTEM__,
      domain: window.location.origin,
      browser: this.getBrowser(),
      // 需要根据type 做不同的处理
      lineNumber,
      columnNumber,
      fileUrl,
      errorMessage: this.getErrorMessage(),
      errorObj: this.geterrorObj(),
      httpCode: this.getHttpCode(),
    }
  }

}



