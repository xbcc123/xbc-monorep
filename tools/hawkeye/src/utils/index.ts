
// 获取脚本执行目录
export const isIgnoreUrl = (global, url) => {
  return !!global.___IGNORE_URL_LIST__.find(ignoreUrl => url.indexOf(ignoreUrl) !== -1)
}
