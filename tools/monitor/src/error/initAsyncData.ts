
import axios from "axios";

// 获取异步数据
export class InitAsyncData {
  constructor() {
    this.setIpCity()
    this.setAsyncData()
  }

  public setIpCity() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://pv.sohu.com/cityjson';
    document.body.appendChild(script);

  }

  public setAsyncData() {

    // axios.get('http://pv.sohu.com/cityjson', {
    //   proxy: {
    //     host: '127.0.0.1',
    //     port: 3000,
    //   }
    // }).then(res => {
    //   console.log(res);
    // })
  }

}
