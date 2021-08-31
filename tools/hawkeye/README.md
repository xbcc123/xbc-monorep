## hawkeye

性能检测

## Install

待定...

## Usage
```
new PerformanceMonitor().run({
  /** 检测地址 */
  urls: ['app/index', 'app/tools'],
  /** origin */
  origin: 'https://***/#/',
  /** 登陆页面路由 */
  loginUrl: 'login',
  /** 登陆之后默认跳转的路由，用于检测是否登陆完成 */
  loginedUrl: 'app/index',
  /* 登陆方式 0 无需登陆 1 api登陆 2 pup模拟登陆 3 pup手动登陆   */
  loginType: 3,
})

```

## Features

