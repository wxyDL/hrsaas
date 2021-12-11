import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 引入工具栏组件
import Components from '@/components'

// 引入自定义指定的对象
import * as directives from '@/directives'
// 引入自定义时间过滤器
import * as filters from '@/filters'
// 引入打印机的插件
import Print from 'vue-print-nb'
// 引入混入
import checkPermission from '@/mixin/checkPermission'
// 引入多语言组件
import i18n from '@/lang'
// 注册打印机插件
Vue.use(Print)
// 全局注册混入
Vue.mixin(checkPermission)

// 遍历对象注册指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// 全局注册自定义时间过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) =>i18n.t(key) 
})

Vue.use(Components)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
