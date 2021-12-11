// 引入多语言组件
import VueI18n from 'vue-i18n'
import Vue from 'vue'
import Cookie from 'js-cookie'
// element的语言包
import ElementZH from 'element-ui/lib/locale/lang/zh-CN'
import ElementEN from 'element-ui/lib/locale/lang/en'
import ElementJA from 'element-ui/lib/locale/lang/ja'
// 自定义语言包
import customZH from './zh'
import customEN from './en'
// 注册多语言组件
Vue.use(VueI18n)
export default new VueI18n({
    locale: Cookie.get('language') || 'zh',
    messages: {
        zh: {
            ...ElementZH,
            ...customZH
        },
        en: {
            ...ElementEN,
            ...customEN
        },
        ja: {
            ElementJA
        }
    }
})