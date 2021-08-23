// const puppeteer = require('puppeteer');
// const lighthouse = require('lighthouse');
import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'
const fs = require('fs')
const config = require('./custom-config.js');

// 性能检测
class PerformanceMonitor {
  constructor() {

  }

  /**
    * 执行页面信息收集
    *
    */
  async run(runOptions) {
    // const gathererResults = {};
    // 使用 Puppeteer 创建无头浏览器，创建页面
    const passContext = await this.prepare();
    try {
      // 根据用户是否输入了用户名和密码判断是否要登录政采云
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

  disposeDriver(passContext) {
    const { browser } = passContext
    browser.close();
  }

  collectArtifact(passContext) {
    console.log(`%c开始生成文件${passContext.runnerResults.length}`, 'color: red');
    let currentResult = null
    for (let i = 0; i < passContext.runnerResults.length; i++) {
      currentResult = passContext.runnerResults[i]
      fs.writeFileSync(`pass${i}.html`, currentResult.lighthouseresult.report)
      fs.writeFileSync(`pass${i}.json`, JSON.stringify(currentResult.lighthouseresult.lhr))
    }
    return passContext.runnerResults
  }

  afterPass(passContext, gathererResults) {
    // throw new Error('Method not implemented.');
  }

  beforePass(passContext) {
    // throw new Error('Method not implemented.');
  }

  async preLogin(passContext, runOptions) {
    const { page } = passContext
    const { urls, isAuth, loginUrl, loginedUrl, origin } = runOptions
    if (!isAuth) {
      return
    }
    await page.goto(`${origin}${urls[0]}`);
    //代码中监听跳转事件
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

  /**
    * 登录前准备工作，创建浏览器和页面
    *
    */
  async prepare() {
    // puppeteer 启动的配置项
    const launchOptions = {
      headless: false, // 是否无头模式
      devtool: true,
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
  * @param {RunOptions} runOptions
  */
  async getLhr(passContext, runOptions) {
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
    console.log(`%c开始检测页面 ${urls}`, 'color: red');
    // 开始检测
    for (const item of urls) {
      passContext.runnerResults.push({
        url: item,
        lighthouseresult: await lighthouse(`${origin}${item}`, options, config)
      })
    }
    console.log('%c检测完成', 'color: red');
  }
}

new PerformanceMonitor().run({
  urls: ['app/index', 'app/tools'],
  origin: 'https://test-kepler-pick.jpushoa.com/#/',
  loginUrl: 'login',
  loginedUrl: 'app/index',
  isAuth: true
})
