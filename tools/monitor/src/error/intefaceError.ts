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
      let currentTime = new Date().getTime(); // 接口数据返回时间
      let loadTime = currentTime - startTime;  // 接口加载时间

      console.log(this.timeRecordArray[i].event.detail);

      console.log('HTTP_LOG', simpleUrl, url, status, statusText, "发起请求", "", startTime, loadTime);
      console.log('HTTP_LOG', simpleUrl, url, status, statusText, "请求返回", "", startTime, loadTime);

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
            console.log(self.timeRecordArray[i].event.detail);

          }
        }
      }
    });
    return
    // 设置日志对象类的通用属性
    // function setCommonProperty() {
    //   this.happenTime = new Date().getTime(); // 日志发生时间
    //   this.webMonitorId = WEB_MONITOR_ID;     // 用于区分应用的唯一标识（一个项目对应一个）
    //   this.simpleUrl =  window.location.href.split('?')[0].replace('#', ''); // 页面的url
    //   this.completeUrl =  utils.b64EncodeUnicode(encodeURIComponent(window.location.href)); // 页面的完整url
    //   this.customerKey = utils.getCustomerKey(); // 用于区分用户，所对应唯一的标识，清理本地数据后失效，
    //   // 用户自定义信息， 由开发者主动传入， 便于对线上问题进行准确定位
    //   var wmUserInfo = localStorage.wmUserInfo ? JSON.parse(localStorage.wmUserInfo) : "";
    //   this.userId = utils.b64EncodeUnicode(wmUserInfo.userId || "");
    //   this.firstUserParam = utils.b64EncodeUnicode(wmUserInfo.firstUserParam || "");
    //   this.secondUserParam = utils.b64EncodeUnicode(wmUserInfo.secondUserParam || "");
    // }
    // 接口请求日志，继承于日志基类MonitorBaseInfo
    function HttpLogInfo(uploadType, url, status, statusText, statusResult, currentTime, loadTime) {
      // setCommonProperty.apply(this);
      this.uploadType = uploadType;  // 上传类型
      // this.httpUrl = utils.b64EncodeUnicode(encodeURIComponent(url)); // 请求地址
      this.httpUrl = url; // 请求地址
      this.status = status; // 接口状态
      this.statusText = statusText; // 状态描述
      this.statusResult = statusResult; // 区分发起和返回状态
      this.happenTime = currentTime;  // 客户端发送时间
      this.loadTime = loadTime; // 接口请求耗时
    }

    // // 监听ajax的状态
    // function ajaxEventTrigger(event) {
    //   var ajaxEvent = new CustomEvent(event, { detail: this });
    //   window.dispatchEvent(ajaxEvent);
    // }
    // var oldXHR = window.XMLHttpRequest;
    // function newXHR() {
    //   var realXHR = new oldXHR();
    //   realXHR.addEventListener('loadstart', function () {
    //    ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);
    //   realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);
    //   // 此处的捕获的异常会连日志接口也一起捕获，如果日志上报接口异常了，就会导致死循环了。
    //   // realXHR.onerror = function () {
    //   //   siftAndMakeUpMessage("Uncaught FetchError: Failed to ajax", WEB_LOCATION, 0, 0, {});
    //   // }
    //   return realXHR;
    // }
    // function handleHttpResult(i, tempResponseText) {
    //   if (!this.timeRecordArray[i] || this.timeRecordArray[i].uploadFlag === true) {
    //     return;
    //   }
    //   var responseText = "";
    //   try {
    //     // responseText = tempResponseText ? JSON.stringify(utils.encryptObj(JSON.parse(tempResponseText))) : "";
    //     responseText = tempResponseText ? JSON.stringify(JSON.parse(tempResponseText)) : "";
    //   } catch (e) {
    //     responseText = "";
    //   }
    //   var simpleUrl = this.timeRecordArray[i].simpleUrl;
    //   var currentTime = new Date().getTime();
    //   var url = this.timeRecordArray[i].event.detail.responseURL;
    //   var status = this.timeRecordArray[i].event.detail.status;
    //   var statusText = this.timeRecordArray[i].event.detail.statusText;
    //   var loadTime = currentTime - this.timeRecordArray[i].timeStamp;
    //   // if (!url || url.indexOf(HTTP_UPLOAD_LOG_API) != -1) return;
    //   console.log('发起请求', simpleUrl, url, status, statusText, "发起请求", "", this.timeRecordArray[i].timeStamp, 0);
    //   console.log('请求返回', simpleUrl, url, status, statusText, "请求返回", "", this.timeRecordArray[i].timeStamp, 0);

    //   var httpLogInfoStart = new HttpLogInfo('HTTP_LOG', url, status, statusText, "发起请求", this.timeRecordArray[i].timeStamp, 0);
    //   // httpLogInfoStart.handleLogInfo('HTTP_LOG', httpLogInfoStart);
    //   var httpLogInfoEnd = new HttpLogInfo('HTTP_LOG', url, status, statusText, "请求返回", currentTime, loadTime);
    //   // httpLogInfoEnd.handleLogInfo('HTTP_LOG', httpLogInfoEnd);
    //   // 当前请求成功后就，就将该对象的uploadFlag设置为true, 代表已经上传了
    //   this.timeRecordArray[i].uploadFlag = true;
    // }

    // var this.timeRecordArray = [];
    // window.XMLHttpRequest = newXHR as any;
    // window.addEventListener('ajaxLoadStart', function (e) {
    //   var tempObj = {
    //     timeStamp: new Date().getTime(),
    //     event: e,
    //     simpleUrl: window.location.href.split('?')[0].replace('#', ''),
    //     uploadFlag: false,
    //   }
    //   this.timeRecordArray.push(tempObj)
    // });

    // window.addEventListener('ajaxLoadEnd', function () {
    //   for (var i = 0; i < this.timeRecordArray.length; i++) {
    //     // uploadFlag == true 代表这个请求已经被上传过了
    //     if (this.timeRecordArray[i].uploadFlag === true) continue;
    //     if (this.timeRecordArray[i].event.detail.status > 0) {
    //       var rType = (this.timeRecordArray[i].event.detail.responseType + "").toLowerCase()
    //       if (rType === "blob") {
    //         // (function (index) {
    //         //   var reader = new FileReader();
    //         //   reader.onload = function () {
    //         //     var responseText = reader.result;//内容就在这里
    //         //     handleHttpResult(index, responseText);
    //         //   }
    //         //   try {
    //         //     reader.readAsText(this.timeRecordArray[i].event.detail.response, 'utf-8');
    //         //   } catch (e) {
    //         //     handleHttpResult(index, this.timeRecordArray[i].event.detail.response + "");
    //         //   }
    //         // })(i);
    //       } else {
    //         var responseText = this.timeRecordArray[i].event.detail.responseText;
    //         handleHttpResult(i, responseText);
    //       }
    //     }
    //   }
    // });
  }
}
