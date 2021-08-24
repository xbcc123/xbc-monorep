import { AbstractLogin } from "../model";
import axios from 'axios'


export class LoginToApi extends AbstractLogin {
  async run(passContext, runOptions) {
    const { page } = passContext
    const { urls } = runOptions

    // 跳转到登陆页面
    await page.goto(`${origin}${urls[0]}`);
    // 通过接口获取token
    const data: any = await axios.get('xxx')
    // 在浏览器中储存token
    await page.evaluate(() => {
      window.localStorage.setItem('accountid', data);
      window.localStorage.setItem('accountid', data);
    })
  }
}
