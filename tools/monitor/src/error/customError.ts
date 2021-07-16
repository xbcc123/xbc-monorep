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
    console.error = function (errorMsg) {
      // console.error 已经被 react-error-overlay 改写 约定新的自定义规则  console.error('c', '')
      // https://github.com/facebook/create-react-app/blob/main/packages/react-error-overlay/src/effects/proxyConsole.js
        if (arguments[0] === 'c') {
          errorMsg = arguments[1]
          if (typeof errorMsg == "object") {
            try {
              errorMsg = JSON.stringify(errorMsg)
            } catch(e) {
              errorMsg = "错误无法解析"
            }
          }
          let sourceErrorInfo = {
            type: 2,
            errorMsg,
            url: '',
            lineNumber: '',
            columnNumber: '',
            errorStack: errorMsg
          }
          const { errorInfo } =  new SiftAndMakeUpMessage(sourceErrorInfo)
          Upload.send(errorInfo, 'CustomizeError')
        }
        return oldError.apply(console, arguments);
      };
  }
}
