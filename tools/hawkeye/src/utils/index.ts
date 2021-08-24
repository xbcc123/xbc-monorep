
// 判断接口报错接口 是否被忽略
export const isIgnoreUrl = (global, url) => {
  return !!global.___IGNORE_URL_LIST__.find(ignoreUrl => url.indexOf(ignoreUrl) !== -1)
}
