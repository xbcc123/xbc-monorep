import { AbstractLogin } from "../model";
const chalk = require('chalk');

export class LoginToCode extends AbstractLogin {
  async run(passContext, runOptions) {
    const { page } = passContext
    const { urls, loginUrl, loginedUrl, origin } = runOptions
    console.log(chalk.blue('开始跳转检测页面', `${origin}${urls[0]}`));
    // 跳转到登陆页面
    await page.goto(`${origin}${urls[0]}`, {timeout: 0});
    // 监听跳转事件
    if (page.url() === `${origin}${loginUrl}`) {
      console.log(chalk.blue('需要输入验证码'));
      //等待再一次跳转
      while (true) {
        await page.waitForNavigation()
        if (page.url() === `${origin}${loginedUrl}`) {
          console.log(chalk.blue('登录成功'));
          break;
        }
      }
    }
  }
}
