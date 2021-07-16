import { isIgnoreUrl } from "../utils";
import { SiftAndMakeUpMessage } from "./siftAndMakeUpMessage";
import { Upload } from "./upload";

export class IntefaceError {
  timeRecordArray: any[] = [] // http数组
  constructor() {
    this.createdIntefaceError()
  }

  // 为 XHR 添加了自定义事件
  public setCustomEvent() {
    function ajaxEventTrigger(event) {
      var ajaxEvent = new CustomEvent(event, { detail: this });
      window.dispatchEvent(ajaxEvent);
    }
    const oldXHR = window.XMLHttpRequest;
    function newXHR() {
      const realXHR = new oldXHR();
      realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
      realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
      realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);
      realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);
      realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);
      realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);
      realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);
      realXHR.addEventListener('readystatechange', function () { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
      // 此处的捕获的异常会连日志接口也一起捕获，如果日志上报接口异常了，就会导致死循环了。
      return realXHR;
    }
    window.XMLHttpRequest = newXHR as any;
  }

  // 对收集到的http对象进行处理
  public handleHttpResult(i, tempResponseText) {
     let global = window as any
     if (!this.timeRecordArray[i]) {
        return;
      }
      const timeRecord = {...this.timeRecordArray[i]}
      let url = timeRecord.event.detail.responseURL; // 接口地址
      let status = timeRecord.event.detail.status;  // 接口数据

      if(status !== 200 && status !== 401 && !isIgnoreUrl(global, url)) {
        const { errorInfo } =  new SiftAndMakeUpMessage(this.getSourceErrorInfo(timeRecord, tempResponseText))
        Upload.send(errorInfo, 'IntefaceError')
      }

      // 当前请求成功后就，就将该对象的uploadFlag设置为true, 代表已经上传了
      this.timeRecordArray[i].uploadFlag = true;
  }

  // 自定义事件 接口异常处理
  public createdIntefaceError() {
    this.setCustomEvent()
    const self = this
    window.addEventListener('ajaxLoadStart', function (e) {
      var tempObj = {
        timeStamp: new Date().getTime(),
        event: e,
        simpleUrl: window.location.href.split('?')[0],
        uploadFlag: false,
      }
      self.timeRecordArray.push(tempObj)
    });
    window.addEventListener('ajaxLoadEnd', function () {
      for (var i = 0; i < self.timeRecordArray.length; i++) {
         //  uploadFlag == true 代表这个请求已经被上传过了
        if (self.timeRecordArray[i].uploadFlag === true) {
          continue
        };
        if (self.timeRecordArray[i].event.detail.status > 0) {
          var rType = (self.timeRecordArray[i].event.detail.responseType + "").toLowerCase()
          if (rType !== "blob") {
            const responseText = self.timeRecordArray[i].event.detail.responseText;
            self.handleHttpResult(i, responseText);
          }else {
            // blob 数据暂时先不做处理
            console.log(self.timeRecordArray[i].event.detail);
          }
        }
      }
    });
  }

  // 获取错误信息
  public getSourceErrorInfo(timeRecord, tempResponseText) {
    let responseText = "";
    try {
      responseText = tempResponseText ? JSON.stringify(JSON.parse(tempResponseText)) : "";
    } catch (e) {
      responseText = "";
    }

    let simpleUrl = timeRecord.simpleUrl; // 请求接口的路由信息

    let url = timeRecord.event.detail.responseURL; // 接口地址
    let status = timeRecord.event.detail.status;  // 接口数据
    let statusText = timeRecord.event.detail.statusText; // 接口状态

    let startTime = timeRecord.timeStamp // 接口开始时间
    let endTime = new Date().getTime(); // 接口数据返回时间
    let loadTime = endTime - startTime;  // 接口加载时间

    let errorStack = JSON.stringify({
      simpleUrl,
      url,
      status,
      statusText,
      startTime,
      endTime,
      loadTime
    })

    return {
      type: 4,
      errorMsg: responseText,
      url: '',
      lineNumber: '',
      columnNumber: '',
      httpCode: status,
      errorStack
    }
  }
}
