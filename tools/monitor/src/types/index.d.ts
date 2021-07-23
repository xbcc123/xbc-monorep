
// 初始化options
export interface IMonitorInitOptions {
  /** 系统类型 */
  __SYSTEM__: number
  /** 接口上报需要忽略的域名 */
  ___IGNORE_URL_LIST__: any[]
}

/* 用户信息 */
export interface User {
  /** 用户名称 */
  name: string;
  /** 用户昵称 */
  cName?: string;
  /** 用户手机号 */
  phone?: string;
  /** 用户id */
  id: number
}

/* 报错详细信息 自定义报错会有 */
// export interface ErrorObj {
// }

/* 错误信息 */
export interface CommonErrorInfo {
  /** 用户信息 */
  user: User;
  /** ip */
  ip: string;
  /** 时间 */
  date: number;
  /** 城市 */
  city: string;
  /** 报错路由 */
  path: string;
  /** 错误类型 1:js异常,2:自定义异常,3:静态资源异常,4:接口异常  */
  type: number;
  /** 系统名称：1：研判，2：反诈，3：预警，4：其他待扩展 */
  system: number;
  /** 错误信息 */
  errorMessage: string;
  /** 脚本路径 */
  fileUrl: string;
  /** 当前域名 */
  domain: string;
  /** 浏览器类型 谷歌，ie, 火狐，欧朋，... */
  browser: string;
  /** 代码出错的行数 自定义报错会有 */
  lineNumber?: number | string;
  /** 代码出错的列数 自定义报错会有 */
  columnNumber?: number | string;
  errorObj?: string;
  /** 接口异常时候会有 http状态码.... */
  httpCode?: number;

  // 扩展
  /** 浏览器信息 */
  userAgent: any
  /** js异常 soucemap 未解析的信息 */
  errorSourceContent?: any
}

