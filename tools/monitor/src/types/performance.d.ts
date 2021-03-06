
// 运行参数
export interface RunOptions{
  /** 检测地址 */
  urls: string[],
  /** origin */
  origin: string,
  /** 是否需要登陆 */
  isAuth: boolean,
  /** 登陆页面路由 */
  loginUrl?: string,
  /** 登陆之后默认跳转的路由，用于检测是否登陆完成 */
  loginedUrl?: string,
}


// 收集到的数据
export interface PerformanceInfo {
  /** 检测地址 */
  url: string,
  /** lighthouse 生成的数据 */
  lighthouseResult: any,
  /** 自定义计算的数据 */
  customResult: any,
  /** origin */
  origin: string
}
