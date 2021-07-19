const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.keyboard.type('Hello World!');
  await page.keyboard.press('ArrowLeft');
  await page.screenshot({path: 'screenshot.png'});


  // 其他操作...
  await browser.close();
});
