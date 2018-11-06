export default {
  install: Vue => {
    const state = {
      windowInfo: {
        width: 0,
        height: 0
      },
      selectedElementIdList: [],
      canvasMode: ['select', 'move', 'draw'][0],
      elementType: ['rectangle'][0],
      elementColor: 'rgba(255, 69, 0, 0.68)'
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
