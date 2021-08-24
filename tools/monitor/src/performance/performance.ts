/*
 * 格式化参数
 */
function formatParams(data = {}) {
    const arr = [];
    for (const name in data) {
        arr.push(
            encodeURIComponent(name) + "=" + encodeURIComponent(data[name])
        );
    }
    return arr.join("&");
}

// 监控参数
interface performanceOptions {
    reportUrl: string; // 上报地址
    appId: string; // 项目ID
    appName: string; // 项目名称,
    env: string; // 环境：dev、test、uat、pro
    infoType: string; // 信息类别
    timeSpan: number; // 发送数据时的时间戳
    userAgent: string; 
    isSendBeacon: boolean;
}

/**
 * 性能监控
 */
 export class PerformanceMonitor {
    options: performanceOptions
    reqDataList: any[]
    constructor(ops) {
        this.options = {
            reportUrl: location.href, // 上报地址
            appId: "", // 项目ID
            appName: "", // 项目名称,
            env: "dev", // 环境：dev、test、uat、pro
            infoType: "preformance", // 信息类别
            timeSpan: Date.now(), // 发送数据时的时间戳
            userAgent: navigator.userAgent,
            isSendBeacon: false
        };
        Object.assign(this.options, ops);
        // 任务列表，存放所有任务
        this.reqDataList = [];
        this.init();
    }

    init() {
        this.listenOnLoad();
    }

    listenOnLoad() {
        window.addEventListener("load", () => {
            console.log('%c触发性能上报', 'color: red');
            
            setTimeout(() => {
                this.delaySetPerformanceData({
                    currenPagetUrl: location.href
                });
            });
        });
    }

    delaySetPerformanceData(obj) {
        this.savePerformanceData(obj);
    }

    getPerformanceData() {
        const timing = window.performance.timing
        const {
                navigationStart = 0, // 准备加载页面的起始时间
                fetchStart = 0, // 开始检查缓存或开始获取资源的时间
                domainLookupStart = 0, //  开始进行dns查询的时间
                domainLookupEnd = 0, //  dns查询结束的时间
                connectStart = 0, // 开始建立连接请求资源的时间
                connectEnd = 0, // 建立连接成功的时间.
                responseStart = 0, // 接收到第一个字节的时间
                responseEnd = 0, // 接收到最后一个字节的时间.
                domInteractive = 0, // 文档解析结束的时间
                domContentLoadedEventEnd = 0, // DOMContentLoaded事件结束的时间
                domComplete = 0, // current document readiness被设置 complete的时间
                loadEventEnd = 0 // onload事件结束的时间
        } = timing;

        // 准备新页面时间耗时
        const prepareNewPageTime = fetchStart - navigationStart;
        // DNS查询耗时
        const queryDNSTime = domainLookupEnd - domainLookupStart;
        // TCP链接耗时
        const connectionTCPTime = connectEnd - connectStart;
        // request请求耗时
        const requestTime = responseEnd - responseStart;
        // 解析dom树耗时
        const analysisDOMTime = domComplete - domInteractive;
        // 白屏时间
        const whiteScreenTime = responseStart - navigationStart;
        // domready时间
        const domReadyTime = domContentLoadedEventEnd - navigationStart;
        // onload执行完成时间时间
        const onloadSuccessTime = loadEventEnd - navigationStart;

        return {
            prepareNewPageTime,
            queryDNSTime,
            connectionTCPTime,
            requestTime,
            analysisDOMTime,
            whiteScreenTime,
            domReadyTime,
            onloadSuccessTime
        };
    }

    async savePerformanceData(obj) {
        const performanceInfo = this.getPerformanceData();
        await Object.assign(performanceInfo, obj, {
            timeSpan: Date.now()
        });
        await this.reqDataList.push(
            Object.assign({}, this.options, performanceInfo)
        );
        await this.asyncSendReport();
    }

    /**
     * 页面的加载方式
     * @param {*} type  navigation.type
     */
    pageLoadMethod(type) {
        switch (type) {
            case 0:
                return "点击链接、地址栏输入、表单提交、脚本操作等方式加载";
            case 1:
                return "通过“重新加载”按钮或者location.reload()方法加载";
            case 2:
                return "网页通过“前进”或“后退”按钮加载";
            default:
                return "任何其他来源的加载";
        }
    }

    asyncSendReport() {
        const { isSendBeacon = false, reportUrl = "" } = this.options;
        let repDataList = this.reqDataList;

        while (repDataList.length > 0) {
            const reqData = repDataList.shift();
            (data => {
                setTimeout(() => {
                    this.sendReport(data, reportUrl, isSendBeacon);
                });
            })(reqData);
        }
    }

    /**
     * 高级浏览器还支持 navigator.sendBeacon方法。
     * 这个方法可以用来发送一些小量数据，该方法是异步的，且在浏览器关闭请求也照样能发，特别适合上报统计的场景。
     * 不支持时使用img的方式上报
     */
    sendReport(performance, reportUrl, isSendBeacon = false) {
        if (isSendBeacon && navigator.sendBeacon) {
            this.sendBeacon(performance, reportUrl);
            return;
        }
        this.sendImage(performance, reportUrl);
    }

    sendBeacon(data, reportUrl) {
        navigator.sendBeacon(reportUrl, JSON.stringify(data));
    }

    sendImage(data, reportUrl) {
        console.log(data);
        return 
        const image = new Image();
        image.src = `${reportUrl}?${formatParams(data)}`;
    }
}
