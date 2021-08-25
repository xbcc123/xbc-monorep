import { Gatherer } from './gatherer';

// 实现 Gatherer 抽象类
export default class DOMStats extends Gatherer {
  static instance: DOMStats
  constructor() {
    super();
    if(DOMStats.instance) {
      return DOMStats.instance
    }
    DOMStats.instance = this
  }

  horizontalScrollBar;

  /**
  * 页面打开前的钩子函数
  *
  * @param {PassContext} passContext
  */
  async beforePass(passContext) {
    const { browser } = passContext;
    // 当浏览器的对象发生变化的时候，说明新打开页面了，此时可以获取到标签页 page 对象
    browser.on('targetchanged', async target => {
      const page = await target.page();
      // 等待 dom 文档加载完成的时候
      page.on('domcontentloaded', async () => {
        // 通过 evaluate 方法可以获取到页面上的元素和方法
        this.horizontalScrollBar = await page.evaluate(() => {
          return document.body.scrollWidth > document.body.clientWidth;
        });
      });
    });
  }

  async afterPass() {
    return {
      hasHorizontalScrollBar: !!this.horizontalScrollBar,
    };
  }
}
