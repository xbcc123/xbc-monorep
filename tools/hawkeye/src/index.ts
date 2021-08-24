import { PassContext, RunOptions } from '../types'
import { Login } from './login/login';
import { LoginToApi } from './login/loginToApi';
import { LoginToCode } from './login/loginToCode';
import { LoginContext } from './model';
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const lighthouse = require('lighthouse');
const fs = require('fs')
const path = require('path')
const config = require('./custom-config.js');

// 性能检测
export class PerformanceMonitor {

  /**
    * 执行页面信息收集
    *
    */
  async run(runOptions: RunOptions) {
    console.log(chalk.blue(`执行脚本`));


    // const gathererResults = {};
    // 使用 Puppeteer 创建无头浏览器，创建页面
    const passContext = await this.prepare(runOptions);
    try {
      // 根据用户是否输入了用户名和密码判断是否要登录
      await this.preLogin(passContext, runOptions);
      // 页面打开前的钩子函数 :TODO
      // await this.beforePass(passContext);
      // 打开页面，获取页面数据
      await this.getLhr(passContext, runOptions);
      // 页面打开后的钩子函数 :TODO
      // await this.afterPass(passContext, gathererResults);
      // 收集页面性能
      return await this.collectArtifact(passContext);
    } catch (error) {
      throw error;
    } finally {
      // 关闭页面和无头浏览器
      await this.disposeDriver(passContext);
    }
  }

  disposeDriver(passContext: PassContext) {
    const { browser } = passContext
    browser.close();
  }

  collectArtifact(passContext: PassContext) {
    console.log(chalk.blue(`开始生成${passContext.runnerResults.length}个文件`));
    for (const currentResult of passContext.runnerResults) {
      fs.writeFileSync(`${process.cwd()}/pass${currentResult.url.split('/').slice(-1)}.html`, currentResult.lighthouseResult.report)
      fs.writeFileSync(`${process.cwd()}/pass${currentResult.url.split('/').slice(-1)}}.json`, JSON.stringify(currentResult.lighthouseResult.lhr))
    }
    // for (let i = 0; i < passContext.runnerResults.length; i++) {
    //   currentResult = passContext.runnerResults[i]
    //   fs.writeFileSync(`${process.cwd()}/pass${i}.html`, currentResult.lighthouseresult.report)
    //   fs.writeFileSync(`${process.cwd()}/pass${i}.json`, JSON.stringify(currentResult.lighthouseresult.lhr))
    // }
    return passContext.runnerResults
  }

  /**
    * 执行所有收集器中的 afterPass 方法
    *
    */
  async afterPass(passContext, gathererResults) {
    const { page, gatherers } = passContext;
    // 遍历所有收集器，执行 afterPass 方法
    for (const gatherer of gatherers) {
      const gathererResult = await gatherer.afterPass(passContext);
      gathererResults[gatherer.name] = gathererResult;
    }
    // 执行完所有方法后截图记录
    gathererResults.screenshotBuffer = await page.screenshot();
  }

  beforePass(passContext: PassContext) {
    // throw new Error('Method not implemented.');
  }

  async preLogin(passContext: PassContext, runOptions: RunOptions) {
    console.log(chalk.blue(`开始登陆`));
    const { loginType } = runOptions
    let loginTypeMap: any = {
      0: async () => {},
      1: new LoginContext(new LoginToApi()),
      2: new LoginContext(new Login()),
      3: new LoginContext(new LoginToCode()),
    }
    await loginTypeMap[loginType].run(passContext, runOptions)
  }

  /**
    * 登录前准备工作，创建浏览器和页面
    *
    */
  async prepare(runOptions: RunOptions): Promise<PassContext> {
    console.log(chalk.blue(`创建浏览器`));

    const { loginType } = runOptions
    // puppeteer 启动的配置项
    const launchOptions = {
      headless: loginType !== 3, // 是否无头模式
      defaultViewport: { width: 1920, height: 1080 }, // 指定打开页面的宽高
      // 浏览器实例的参数配置，具体配置可以参考此链接：https://peter.sh/experiments/chromium-command-line-switches/
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
      // executablePath: '/usr/bin/chromium-browser', // 默认 Chromium 执行的路径，此路径指的是服务器上 Chromium 安装的位置
    };
    // 创建浏览器对象
    const browser = await puppeteer.launch(launchOptions);
    // 获取浏览器对象的默认第一个标签页
    const page = (await browser.pages())[0];
    // 返回浏览器和页面对象
    return { browser, page };
  }

  /**
  * 在 Puppeteer 中使用 Lighthouse
  *
  */
  async getLhr(passContext: PassContext, runOptions: RunOptions) {
    console.log(chalk.blue('开始获取性能数据'));

    // 获取浏览器对象和检测链接
    const { browser } = passContext;
    const { urls, origin } = runOptions
    const options = {
      logLevel: 'info',
      output: 'html',
      screenEmulation: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 0,
        mobile: false,
        disabled: true
      },
      emulatedUserAgent: true,
      formFactor: 'desktop',
      onlyCategories: ['performance'],
      port: new URL(browser.wsEndpoint()).port
    };
    passContext.runnerResults = []
    // 开始检测
    for (const item of urls) {
      passContext.runnerResults.push({
        url: item,
        origin,
        lighthouseResult: await lighthouse(`${origin}${item}`, options, config)
      })
    }
  }
}
