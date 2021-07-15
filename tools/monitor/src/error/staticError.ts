import { SiftAndMakeUpMessage } from "./siftAndMakeUpMessage";
import { Upload } from "./upload";

export class StaticError {
  constructor() {
    this.createdStaticError()
  }

  // 静态资源异常
  public createdStaticError() {
    window.addEventListener('error',function(e){
      let event: any = e
      const typeName: any = event.target.localName;
      let sourceUrl: any = "";
      if (typeName === "link") {
        sourceUrl = event.target.href;
      } else if (typeName === "script") {
        sourceUrl = event.target.src;
      } else if (typeName === "img") {
        sourceUrl = event.target.src;
      }
      if(sourceUrl) {
        let sourceErrorInfo = {
          type: 3,
          errorMsg: typeName,
          url: sourceUrl,
          lineNumber: 0,
          columnNumber: 0,
          errorStack: ``
        }
        const { errorInfo } =  new SiftAndMakeUpMessage(sourceErrorInfo)
        // console.log(e, sourceUrl);
        Upload.send(errorInfo, 'StaticError')
        // var resourceLoadInfo = new ResourceLoadInfo(RESOURCE_LOAD, sourceUrl, typeName, "0");
        // resourceLoadInfo.handleLogInfo(RESOURCE_LOAD, resourceLoadInfo);
      }

    }, true);
  }
}
