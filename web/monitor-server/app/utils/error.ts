import _ from "lodash"
import { IPos, SourceMap } from "xbc-source-map"
// import { sourceInfoFromName } from "./index"

// eg: new SourceMap(2, 104, 'http://localhost:9854/static/js/2.bd2fc96c.chunk.js').getPos()

// 获取真实的 脚本错误 信息
export const changeLineColumnFile = async (req: any) => {
  const { type, lineNumber, columnNumber, fileUrl } = _.cloneDeep(req)
  // let sourceMapUrl = sourceInfoFromName('')
  let sourceMapUrl = process.env.SLURCE_MAP_URL
  console.log(fileUrl, lineNumber, columnNumber);

  // let errorUrl = `${sourceMapUrl}/static/${fileUrl.split('static')[1]}`
  let errorUrl = `${sourceMapUrl}/static/js/main.47e195aa.chunk.js`

  if(type === 1) {
    let sourceMapInfo: Partial<IPos> = {}
    try {
       sourceMapInfo = await new SourceMap(1, 9545, errorUrl).getPos()
    } catch (error) {

    }
    if(sourceMapInfo.status === 'success') {
      const { values } = sourceMapInfo
      return {...req, ...{
        lineNumber: values?.line,
        columnNumber: values?.column,
        fileUrl: values?.source
      }}
    }
  }

  return req
}
