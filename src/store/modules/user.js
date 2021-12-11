// 引入缓存中的token
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 引入api中的登录接口
import { login, getUserInfo, getUserDateilById } from '@/api/user'
// 引入重置路由的方法
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(), // vuex一初始化的时候获取缓存中的token
  userInfo: {} // 用户资料
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 将token设置到vuex中
    setToken(token) // 将token保存到缓存中
  },
  // 删除token
  removeToken(state) {
    state.token = null // 将vuex中的token设为null
    removeToken() // 将缓存中的token删除
  },
  // 设置用户资料的方法
  setUserInfo(state, result) {
    // 更新state中的用户资料
    state.userInfo = result
  },
  // 删除用户信息
  removeUserInfo(state) {
    // 修改state中的userInfo为空对象
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录的方法
  async login(context, data) {
    // 调用api中的登录接口,返回的是promise对象
    const result = await login(data)
    // 调用commit方法通过mutations修改state中的token
    context.commit('setToken', result)
    // 登录成功设置存入token的时间戳
    setTimeStamp()
  },
  // 获取用户资源接口
  async getUserInfo(context) {
    // 调用获取用户资源的接口获取用户资源
    const result = await getUserInfo()
    // 调用获取用户头像的接口
    const baseInfo = await getUserDateilById(result.userId)
    // 将两个接口的数据进行合并
    const baseResult = { ...result, ...baseInfo }
    // 通过mutations修改state中的userInfo
    context.commit('setUserInfo', baseResult)
    return result
  },
  // 退出登陆的方法
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
    // 重置理由
    resetRouter()
    context.commit('permission/setRouters', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

