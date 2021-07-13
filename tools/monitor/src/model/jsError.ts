import { SiftAndMakeUpMessage } from "./siftAndMakeUpMessage";

export class JsError {
  constructor() {

  }

  // 重写 window.onerror 捕获异常
  public rewriteWinDowOnerror() {
    window.onerror = function(errorMsg, url, lineNumber, columnNumber, errorObj) {
      var errorStack = errorObj ? errorObj.stack : null;

      // new SiftAndMakeUpMessage("on_error", errorMsg, url, lineNumber, columnNumber, errorStack);
    };
  }

  // 重写window.onunhandledrejection
  public rewriteWindowOnunhandledrejection() {

  }

}

