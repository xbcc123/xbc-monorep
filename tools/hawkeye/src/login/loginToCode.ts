import { AbstractLogin } from "../model";

export class LoginToCode extends AbstractLogin {
  async run(passContext, runOptions) {
    const { page } = passContext
    const { urls, isAuth, loginUrl, loginedUrl, origin } = runOptions
    if (!isAuth) {
      return
    }
    // 跳转到登陆页面
    await page.goto(`${origin}${urls[0]}`);
    // 监听跳转事件
    if (page.url() === `${origin}${loginUrl}`) {
      console.log('需要输入验证码');
      //等待再一次跳转
      while (true) {
        await page.waitForNavigation()
        console.log(page.url())
        if (page.url() === `${origin}${loginedUrl}`) {
          console.log('登录成功');
          break;
        }
      }
    }
  }
}
