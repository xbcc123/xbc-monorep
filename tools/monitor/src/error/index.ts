import { MonitorInit } from './monitorInit'

// 初始化
const { __SYSTEM__ = '', ___IGNORE_URL_LIST__ =  [] } = window as any
new MonitorInit({__SYSTEM__, ___IGNORE_URL_LIST__})

