import { SiftAndMakeUpMessage } from "./siftAndMakeUpMessage";
import { Upload } from "./upload";

export class JsError {
  constructor() {
    this.createdWinDowOnerror()
    this.createdWindowOnunhandledrejection()
  }

  // 重写 window.onerror 捕获异常
  public createdWinDowOnerror() {
    window.onerror = function(errorMsg, url, lineNumber, columnNumber, errorObj) {
      const errorStack = errorObj ? errorObj.stack : null;
      let sourceErrorInfo = {
        type: 1,
        errorMsg,
        url,
        lineNumber,
        columnNumber,
        errorStack
      }
      const { errorInfo } =  new SiftAndMakeUpMessage(sourceErrorInfo)
      Upload.send(errorInfo, 'onerror')
    };
  }

  // 重写window.onunhandledrejection
  public createdWindowOnunhandledrejection() {
    window.onunhandledrejection = function(e) {
      var errorMsg = "";
      var errorStack = "";
      if (typeof e.reason === "object") {
        errorMsg = e.reason.message;
        errorStack = e.reason.stack;
      } else {
        errorMsg = e.reason;
        errorStack = "";
      }
      let sourceErrorInfo = {
        type: 1,
        errorMsg,
        url: '',
        lineNumber: '',
        columnNumber: '',
        errorStack: `UncaughtInPromiseError: ${errorStack}`
      }
      const { errorInfo } =  new SiftAndMakeUpMessage(sourceErrorInfo)
      // Upload.send(errorInfo, 'onunhandledrejection')
    }
  }

}

