
/* 收集器 */
export abstract class Gatherer {
  /* 钩子埋点 */
  abstract beforePass(passContext: any): Promise<void>;
  /* 获取对应的钩子 */
  abstract afterPass(passContext: any): Promise<any>;
}
