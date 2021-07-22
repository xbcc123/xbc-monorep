## monitor

监控SDK

## Install

```
npm i xbc-monitor -S
```

## Usage

SPA 项目入口引入

```
# index.tsx
// __SYSTEM__ 系统名称
// ___IGNORE_URL_LIST__ 接口上报需要忽略的域名， 必填上报接口域名
Object.assign(window, { __SYSTEM__: 1, ___IGNORE_URL_LIST__: ['localhost']})
require("xbc-monitor")
```

index.html开头引入获取ip和地址

```
  <script src="http://pv.sohu.com/cityjson"></script>
```

其他错误可以自动识别，自定义错误使用 console.error('c', xxxx)

## Notes

- [ ] script引入
- [ ] 用户信息
