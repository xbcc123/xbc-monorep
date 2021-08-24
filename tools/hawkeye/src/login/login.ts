import { AbstractLogin } from "../model";

export class Login extends AbstractLogin {
  constructor() {
    super()
  }
  async run(passContext, runOptions) {
    const { page, } = passContext
    const { urls, username, password, origin } = runOptions
    // 跳转至相应的登录页面
    await page.goto(`${origin}${urls[0]}`, { waitUntil: 'networkidle0' });
    // 输入用户账号
    await page.type('.login-form #username', username);
    // 输入用户密码
    await page.type('.login-form #password', password);
    // 点击登录按钮
    await page.click('.login-form .password-login');
    // 等待页面跳转，注意：如果 click() 触发了一个跳转，会有一个独立的 page.waitForNavigation()对象需要等待
    await page.waitForNavigation();

    // 若跳转之后的页面仍处在登录页，说明登录出错
    const pUrl = await page.url();
    if (pUrl.includes('login')) {
      await page.waitForSelector('.form-content > .error-text > .text');
      // 获取错误信息内容
      // const errorText = await page.$eval('.form-content > .error-text > .text', el => el.textContent.trim());
      // 报出错误信息
      // throw new Error(`登录失败，${errorText}`);
      throw new Error(`登录失败`);
    }
  }
}
