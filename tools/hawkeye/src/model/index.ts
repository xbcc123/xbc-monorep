
// 登陆
export abstract class AbstractLogin {
  // 执行登陆
  abstract run(passContext: any, runOptions: any): Promise<void>
}

export class LoginContext {
  public strategy: AbstractLogin
  constructor(strategy: AbstractLogin) {
    this.strategy = strategy
  }

  public run(passContext: any, runOptions: any) {
    return this.strategy.run(passContext, runOptions)
  }
}
