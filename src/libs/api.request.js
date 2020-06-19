import HttpRequest from '@/libs/axios'
// const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// import { baseUrl } from '@/config'
const baseUrl = 'https://baidu.com'
const axios = new HttpRequest(baseUrl)
export default axios
