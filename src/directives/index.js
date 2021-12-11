// 管理所有的自定义指令
export const imagerror = {
  // 指令对象
  inserted(dom, options) {
    dom.src = dom.src || options.value
    //   注册dom的onerror事件
    dom.onerror = function() {
      // 图片出现异常时候的默认图片
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
