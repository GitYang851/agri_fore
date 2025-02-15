import axios from 'axios'
import { ElMessage } from 'element-plus'
import errorCode from './errorCode'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    console.log(error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  function (res) {
    const code = res.data.code || 200
    const msg = res.data.msg || errorCode[code]
    if (code === 200) {
      return Promise.resolve(res.data);
    } else {
      ElMessage({ message: msg, type: 'error' });
      return Promise.reject(new Error(msg));
    }
  },
  function (error) {
    console.log('err' + error)
    let message = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request  failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  },
)

export default service
