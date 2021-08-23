const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
// import lighthouse from "lighthouse"
const fs = require('fs')
const config = require('./custom-config.js');


// import puppeteer from 'puppeteer'

// declare type puppeteer = any

// 性能检测
class PerformanceMonitor {
  constructor() {

  }

  /**
    * 执行页面信息收集
    *
    * @param {PassContext} passContext
    */
  async run(runOptions) {
    const gathererResults = {};
    // 使用 Puppeteer 创建无头浏览器，创建页面
    const passContext = await this.prepare(runOptions);
    try {
      // 根据用户是否输入了用户名和密码判断是否要登录政采云
      // await this.preLogin(passContext);
      // 页面打开前的钩子函数
      // await this.beforePass(passContext);
      // 打开页面，获取页面数据
      await this.getLhr(passContext);
      // 页面打开后的钩子函数
      // await this.afterPass(passContext, gathererResults);
      // 收集页面性能
      return await this.collectArtifact(passContext, gathererResults);
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

  collectArtifact(passContext, gathererResults) {
    // fs.writeFileSync('pass.html',passContext.report)
    return {}
    // throw new Error('Method not implemented.');
  }

  afterPass(passContext, gathererResults) {
    // throw new Error('Method not implemented.');
  }

  beforePass(passContext) {
    // throw new Error('Method not implemented.');
  }

  preLogin(passContext) {
    // throw new Error('Method not implemented.');
  }

  /**
    * 登录前准备工作，创建浏览器和页面
    *
    * @param {RunOptions} runOptions
    */
  async prepare(runOptions) {
    // puppeteer 启动的配置项
    const launchOptions = {
      headless: true, // 是否无头模式
      defaultViewport: { width: 1440, height: 960 }, // 指定打开页面的宽高
      // 浏览器实例的参数配置，具体配置可以参考此链接：https://peter.sh/experiments/chromium-command-line-switches/
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
      // executablePath: '/usr/bin/chromium-browser', // 默认 Chromium 执行的路径，此路径指的是服务器上 Chromium 安装的位置
    };
    // 服务器上运行时使用服务器上独立安装的 Chromium
    // 本地运行的时候使用 node_modules 中的 Chromium
    // if (process.env.NODE_ENV === 'development') {
    //   delete launchOptions.executablePath;
    // }

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
  async getLhr(passContext) {
    // 获取浏览器对象和检测链接
    const { browser } = passContext;
    // let options = {
    //   port: new URL(browser.wsEndpoint()).port,
    //   output: 'json',
    //   logLevel: 'info',
    //   emulatedFormFactor: 'desktop',
    //   throttling: {
    //     rttMs: 40,
    //     throughputKbps: 10 * 1024,
    //     cpuSlowdownMultiplier: 1,
    //     requestLatencyMs: 0, // 0 means unset
    //     downloadThroughputKbps: 0,
    //     uploadThroughputKbps: 0,
    //   },
    //   disableDeviceEmulation: true,
    //   onlyCategories: ['performance'], // 是否只检测 performance
    //   // chromeFlags: ['--disable-mobile-emulation', '--disable-storage-reset'],
    // }
    const options = {logLevel: 'info', output: 'html', screenEmulation: {width: 1920, height: 1080, deviceScaleFactor: 0, mobile: false, disabled: true }, emulatedUserAgent: true, formFactor: 'desktop', onlyCategories: ['performance'], port: new URL(browser.wsEndpoint()).port};
    // 开始检测
    const { artifacts, lhr, report } = await lighthouse('https://www.taobao.com', options, config);
    // 回填数据
    passContext.lhr = lhr;
    passContext.artifacts = artifacts;
    passContext.report = report;
  }

}


new PerformanceMonitor().run({})
