import { SiftAndMakeUpMessage } from "./siftAndMakeUpMessage";
import { Upload } from "./upload";

// 自定义错误
export class CustomError {
  constructor() {
    this.createdConsoleError()
  }

  // 重写console.error 自定义异常
  public createdConsoleError() {
    const oldError = console.error;
    console.error = function (tempErrorMsg) {
      var errorMsg = (arguments[0] && arguments[0].message) || tempErrorMsg;
      var errorObj = arguments[0] && arguments[0].stack;
        if (!errorObj) {
          if (typeof errorMsg == "object") {
            try {
              errorMsg = JSON.stringify(errorMsg)
            } catch(e) {
              errorMsg = "错误无法解析"
            }
          }
          let sourceErrorInfo = {
            errorMsg,
            url: '',
            lineNumber: 0,
            columnNumber: 0,
            errorStack: `CustomizeError: ${errorMsg}`
          }
          const { errorInfo } =  new SiftAndMakeUpMessage(sourceErrorInfo)
          Upload.send(errorInfo, 'CustomizeError')
        }
        return oldError.apply(console, arguments);
      };

  }
}
