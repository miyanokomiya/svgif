export default {
  install: Vue => {
    const state = {
      windowInfo: {
        width: 0,
        height: 0
      },
      selectedElementIdList: []
    }
    const onResize = () => {
      state.windowInfo = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }
    window.addEventListener('resize', onResize)
    onResize()
    Vue.util.defineReactive(Vue.prototype, '$svgif', state)
  }
}
