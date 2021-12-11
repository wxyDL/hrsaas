// 注册全局组件
// 引入工具栏组件
import PageTools from './PageTools'
// 引入excel的组件
import UploadExcel from './UploadExcel'
// 引入上传图片的组件
import ImageUpload from './ImageUpload'
// 引入全屏组件并注册
import ScreenFull from './screenfull'
// 主题组件
import ThemePicker from './ThemePicker'
// 多语言组件
import langSelect from './lang'
// 多标签组件
import TagsView from './TagsView'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('langSelect', langSelect)
    Vue.component('TagsView', TagsView)

  }
}
