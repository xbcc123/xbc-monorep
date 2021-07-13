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
      const errorInfo =  new SiftAndMakeUpMessage({errorMsg, url, lineNumber, columnNumber, errorStack}).errorInfo
      Upload.send(errorInfo)
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
      const errorInfo =  new SiftAndMakeUpMessage({errorMsg, 0, 0, 0, `UncaughtInPromiseError: ${errorStack}`})
      // 分类解析
      // console.log("on_error", errorMsg, 0, 0, 0, "UncaughtInPromiseError: " + errorStack);
      // siftAndMakeUpMessage("on_error", errorMsg, WEB_LOCATION, 0, 0, "UncaughtInPromiseError: " + errorStack);
    }
  }

}

