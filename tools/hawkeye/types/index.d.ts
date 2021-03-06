
// 运行参数
export interface RunOptions{
  /** 检测地址 */
  urls: string[],
  /** origin */
  origin: string,
  /** 是否需要登陆 废弃*/
  // isAuth: boolean,
  /** 登陆页面路由 */
  loginUrl?: string,
  /** 登陆之后默认跳转的路由，用于检测是否登陆完成 */
  loginedUrl?: string,
  /* 登陆方式 0 无需登陆 1 api登陆 2 pup模拟登陆 3 pup手动登陆   */
  loginType: 0 | 1 | 2 | 3,
  /** 账号 */
  username?: string,
  /** 密码 */
  password?: string
  /** 收集器插件 */
  gathererPlugs?: any[]
}

// 运行参数转换后的参数
export interface RunOptionsContext {
  /** 检测地址 */
  urls: url[],
  /** origin */
  runOptions: RunOptions,
}

export interface url {
  url: string,
  urlKey: string
}

// 上下文
export interface PassContext{
  /* 性能数据 */
  runnerResults?: PerformanceInfo[];
  /* 浏览器实例 */
  browser?: any
  /* 页面实例 */
  page?: any
  /* 收集器 */
  gatherers?: any[]
}

// 收集到的数据
export interface PerformanceInfo {
  /** 检测地址 */
  url?: string,
  /** 地址唯一标识 */
  urlKey?: string
  /** lighthouse 生成的数据 */
  lighthouseResult?: any,
  /** 自定义计算的数据 */
  customResult?: any,
  /** 收集器结果 */
  gathererResult?: any,
  /** origin */
  origin?: string
}
