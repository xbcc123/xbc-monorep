// const puppeteer = require('puppeteer');

// // 根据不同环境的页面，返回对应环境下登录的 url
// const getLoginPath = target => {
//   if (target.includes('-staging.zcygov.cn')) {
//     return 'https://login-staging.zcygov.cn/user-login/';
//   } else if (target.includes('test.zcygov.cn')) {
//     return 'http://login.test.zcygov.cn/user-login/';
//   } else {
//     return 'https://login.zcygov.cn/user-login/';
//   }
// };

// async function loginSimulation(url, options) {
//     const browser = await puppeteer.launch();
//     // 创建一个匿名的浏览器上下文，这将不会与其他浏览器上下文分享 cookies/cache。
//     const context = await browser.createIncognitoBrowserContext();
//     const page = await context.newPage();

//   // waitUntil对应的参数如下：
//   // load - 页面的load事件触发时
//   // domcontentloaded - 页面的 DOMContentLoaded 事件触发时
//   // networkidle0 - 不再有网络连接时触发（至少500毫秒后）
//   // networkidle2 - 只有2个网络连接时触发（至少500毫秒后）

//   // 若参数中有用户名密码，则先到登录页面进行登录再进行性能检测
//   if (options.username && options.password) {
//     // 跳转至相应的登录页面
//     await page.goto(getLoginPath(url), { waitUntil: 'networkidle0' });
//     // 输入用户账号
//     await page.type('.login-form #username', options.username);
//     // 输入用户密码
//     await page.type('.login-form #password', options.password);
//     // 点击登录按钮
//     await page.click('.login-form .password-login');

//     // 等待页面跳转，注意：如果 click() 触发了一个跳转，会有一个独立的 page.waitForNavigation()对象需要等待
//     await page.waitForNavigation();

//     // 若跳转之后的页面仍处在登录页，说明登录出错
//     const pUrl = await page.url();
//     if (pUrl.includes('login')) {
//       await page.waitForSelector('.form-content > .error-text > .text');
//       // 获取错误信息内容
//       const errorText = await page.$eval('.form-content > .error-text > .text', el => el.textContent.trim());
//       // 报出错误信息
//       throw new Error(`政采云登录失败，${errorText}`);
//     }
//   }
// };

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
