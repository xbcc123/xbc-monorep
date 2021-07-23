import _ from "lodash"
import { IPos, SourceMap } from "xbc-source-map"
// import { sourceInfoFromName } from "./index"

// 获取真实的 脚本错误 信息
export const changeLineColumnFile = async (req: any) => {
  const { type, errorObj } = _.cloneDeep(req)

  if(type === 1) {
    const { lineNumber, columnNumber, fileUrl } = getLineColumn(errorObj)
    let errorUrl = getErrorUrl(fileUrl)
    // let errorUrl = `${sourceMapUrl}/static/js/main.47e195aa.chunk.js`
    let sourceMapInfo: Partial<IPos> = {}
    try {
      //  sourceMapInfo = await new SourceMap(1, 9545, errorUrl).getPos()
       sourceMapInfo = await new SourceMap(lineNumber, columnNumber, errorUrl).getPos()
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

// 需要解析的url
export const getErrorUrl = (fileUrl) => {
  let sourceMapUrl = process.env.SLURCE_MAP_URL
  return `${sourceMapUrl}/static${fileUrl.split('static')[1]}`
}

// js异常 通过js调用栈获取最上面栈的行列
export const getLineColumn = (errorStackSource: any) => {
  let errorStack  = errorStackSource
  const lineColumn = errorStack.split('at ')[1].split('.js:')[1].split(')')[0]
  const lineNumber = lineColumn.split(':')[0]
  const columnNumber = lineColumn.split(':')[1]

  const temporary = errorStack.split('at ')[1].split('(')[1].split(')')[0].split(':')
  const fileUrl = `${temporary[0]}:${temporary[1]}:${temporary[2]}`

  return {
    lineNumber: Number(lineNumber),
    columnNumber: Number(columnNumber),
    fileUrl
  }
}
