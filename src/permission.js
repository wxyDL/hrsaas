// 设置导航守卫
// 引入路由
import router from '@/router'
// 引入store实例
import store from '@/store'
// 引入进度条
import nProgress from 'nprogress'
// 引入进度条的样式
import 'nprogress/nprogress.css'

// 定义白名单
const whiteList = ['/login', '/404']
// 前置导航守卫
router.beforeEach(async(to, from, next) => {
  // 打开进度条
  nProgress.start()
  // 判断是不是有token
  if (store.getters.token) {
    // 有token再判断是不是登录页
    if (to.path === '/login') {
      // 是登录页直接跳转到首页
      next('/')
    } else {
      // 判断是否有用户资料
      if (!store.getters.userId) {
        //   没有用户id表示没有用户资料，则获取用户资料
        const { roles } = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRouters', roles.menus)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        // 不是登录页直接放行
        next()
      }
    }
  } else {
    //   没有token再判断是不是白名单(/login,/404)
    if (whiteList.indexOf(to.path) > -1) {
      // 在白名单内直接放行
      next()
    } else {
      // 不在白名单内跳转登录页
      next('/login')
    }
  }
  //   手动关闭进度条
  nProgress.done()
})

// 后置导航守卫
router.afterEach(() => {
  // 关闭进度条
  nProgress.done()
})
