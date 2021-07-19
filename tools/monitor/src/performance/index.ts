const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const config = require('./custom-config.js');


(async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
  const runnerResult = await lighthouse('https://example.com', options, config);

  // `.report` is the HTML report as a string
  // const reportHtml = runnerResult.report;
  // fs.writeFileSync('lhreport.html', reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
  fs.writeFileSync('lhreport.json', JSON.stringify(runnerResult.lhr));

  await chrome.kill();
})();
