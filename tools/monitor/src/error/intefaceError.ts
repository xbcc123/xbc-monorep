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
      return realXHR;
    }
    window.XMLHttpRequest = newXHR as any;
  }

  // 对收集到的http对象进行处理
  public handleHttpResult(i, tempResponseText) {
     if (!this.timeRecordArray[i]) {
        return;
      }
      let responseText = "";
      try {
        // responseText = tempResponseText ? JSON.stringify(utils.encryptObj(JSON.parse(tempResponseText))) : "";
        responseText = tempResponseText ? JSON.stringify(JSON.parse(tempResponseText)) : "";
      } catch (e) {
        responseText = "";
      }

      let simpleUrl = this.timeRecordArray[i].simpleUrl; // 请求接口的路由信息

      let url = this.timeRecordArray[i].event.detail.responseURL; // 接口地址
      let status = this.timeRecordArray[i].event.detail.status;  // 接口数据
      let statusText = this.timeRecordArray[i].event.detail.statusText; // 接口状态

      let startTime = this.timeRecordArray[i].timeStamp // 接口开始时间
      let endTime = new Date().getTime(); // 接口数据返回时间
      let loadTime = endTime - startTime;  // 接口加载时间
      // console.log(this.timeRecordArray[i].event.detail);

      // console.log('HTTP_LOG', simpleUrl, url, status, statusText, "发起请求", "", startTime, loadTime);
      // console.log('HTTP_LOG', simpleUrl, url, status, statusText, "请求返回", "", startTime, loadTime);

      if(status !== 200 ) {
        let sourceErrorInfo = {
          type: 4,
          errorMsg: '',
          url: '',
          lineNumber: '',
          columnNumber: '',
          httpCode: status,
          errorStack: {
            simpleUrl,
            url,
            status,
            statusText,
            startTime,
            endTime,
            loadTime
          }
        }
        const { errorInfo } =  new SiftAndMakeUpMessage(sourceErrorInfo)
        Upload.send(errorInfo, 'IntefaceError')
      }

      if(loadTime > 10000) {
        let sourceErrorInfo = {
          type: 4,
          errorMsg: '',
          url: '',
          lineNumber: '',
          columnNumber: '',
          errorStack: `UncaughtInPromiseError: `
        }
        const { errorInfo } =  new SiftAndMakeUpMessage(sourceErrorInfo)
        Upload.send(errorInfo, 'IntefaceError: 超时接口')
      }


      // var httpLogInfoStart = new HttpLogInfo('HTTP_LOG', url, status, statusText, "发起请求", this.timeRecordArray[i].timeStamp, 0);
      // httpLogInfoStart.handleLogInfo('HTTP_LOG', httpLogInfoStart);
      // var httpLogInfoEnd = new HttpLogInfo('HTTP_LOG', url, status, statusText, "请求返回", currentTime, loadTime);
      // httpLogInfoEnd.handleLogInfo('HTTP_LOG', httpLogInfoEnd);

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
        simpleUrl: window.location.href.split('?')[0].replace('#', ''),
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
    return

    // 接口请求日志，继承于日志基类MonitorBaseInfo
    // function HttpLogInfo(uploadType, url, status, statusText, statusResult, currentTime, loadTime) {
    //   this.uploadType = uploadType;  // 上传类型
    //   this.httpUrl = url; // 请求地址
    //   this.status = status; // 接口状态
    //   this.statusText = statusText; // 状态描述
    //   this.statusResult = statusResult; // 区分发起和返回状态
    //   this.happenTime = currentTime;  // 客户端发送时间
    //   this.loadTime = loadTime; // 接口请求耗时
    // }
  }
}
