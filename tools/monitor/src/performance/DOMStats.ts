import { Gatherer } from './gatherer';

// 实现 Gatherer 抽象类
export default class DOMStats extends Gatherer {
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

  /**
  * 页面执行结束后的钩子函数
  *
  * @param {PassContext} passContext
  */
  async afterPass(passContext) {
    const { artifacts } = passContext;
    // 从 lighthouse 结果对象 lhr 中获取 dom 节点的 depth，width 和 totalBodyElements
    const {
      DOMStats: { depth, width, totalBodyElements },
    } = artifacts;
    return {
      numElements: totalBodyElements,
      maxDepth: depth.max,
      maxWidth: width.max,
      hasHorizontalScrollBar: !!this.horizontalScrollBar,
    };
  }
}
