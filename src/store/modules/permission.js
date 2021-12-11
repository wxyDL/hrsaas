// 引入静态路由
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 权限路由表
  routers: constantRoutes
}
const mutations = {
  // 修改用户登录所拥有权限的路由
  setRouters(state, newRouters) {
    //   静态路由加上当前用户所拥有的新的路由
    state.routers = [...constantRoutes, ...newRouters]
  }
}
const actions = {
  filterRouters(context, menus) {
    const routes = []
    // 查找用户信息里的meuns的值等不等于动态路由对象里的name值
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRouters', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
