import axios from 'axios'
import {
  getToken
} from "@/libs/util";
// 设置跨域
axios.defaults.withCredentials = true

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        Authorization: getToken("Authorization")
      },
      //防止ie缓存
      params: {
        _: new Date().getTime()
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      if (res.data.code === 400) {
        return Promise.reject('不是同一个会话')
      }
      if (res.data.code !== 200) {
        this.$Message.error(res.data.msg);
        return Promise.reject(res.data.msg)
      }
      this.destroy(url)
      const {
        data,
        status
      } = res
      return {
        data,
        status
      }
    }, error => {
      this.destroy(url)
      if (error.response&&error.response.status === 401) {
        return Promise.reject('没有权限')
      }
      if (error.response) {
        return Promise.reject(error.response.data)
      }
    })
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    options.params&&(Object.assign(options.params,{_: new Date().getTime()}))
    options.data&&(Object.assign(options.data,{_: new Date().getTime()}))
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
