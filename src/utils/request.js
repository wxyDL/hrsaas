import Axios from 'axios'
// 引入element-ui中的message对象
import { Message } from 'element-ui'
// 引入store实例
import store from '@/store'
// 引入存token的时间戳
import { getTimeStamp } from '@/utils/auth'
// 引入路由
import router from '@/router'
// 设置token超时的时间
const TimeOut = 3600

// 创建axios的实例
const service = Axios.create({
  // 设置baseurl
  baseURL: process.env.VUE_APP_BASE_API,
  //   设置超时的时间
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 判断有没有token
  if (store.getters.token) {
    // 判断token的时间戳有没有超时
    if (isCheckTimeStamp()) {
      // 退出登录
      store.dispatch('user/logout')
      // 跳转登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    // 有token则注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data // 响应成功，结构数据
  //   如果success是true，则是成功
  if (success) {
    //   返回成功之后的数据
    return data
  } else {
    //   提示错误信息
    Message.error(message)
    //  并且跳出.then进入catch
    return Promise.reject(new Error(message))
  }
}, error => {
  // 判断服务器的token是不是超时了
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    // 响应错误，提示错误信息
    Message.error(error.message)
  }
  //  并且跳出.then进入catch
  return Promise.reject(error)
})

// token时间戳超时的方法
function isCheckTimeStamp() {
  // 获取当前的时间戳
  const current = Date.now()
  // 获取存入token的时间戳
  const TimeStamp = getTimeStamp()
  return (current - TimeStamp) / 1000 > TimeOut
}

export default service
