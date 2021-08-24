

// 收集器
export abstract class Gatherer {
  abstract beforePass(passContext: any): Promise<void>;
  abstract afterPass(passContext: any): Promise<any>;
}
