import types from './types'

const getters = {
  [types.g.MAX_SIZE](state) {
    return state.maxSize
  },
  [types.g.CLIP_LIST](state) {
    return state.clipList
  },
  [types.g.SELECTED_CLIP](state) {
    return state.clipList.find(c => c.id === state.selectedId) || null
  },
  [types.g.WHOLE_SIZE](state) {
    return state.clipList.reduce(
      (size, c) => {
        return {
          width: Math.max(size.width, c.width),
          height: Math.max(size.height, c.height)
        }
      },
      { width: 0, height: 0 }
    )
  },
  [types.g.WHOLE_DELAY](state) {
    return state.clipList.reduce((sum, c) => {
      return sum + c.delay
    }, 0)
  },
  [types.g.STATE](state) {
    return state
  },
  [types.g.LAYER_LIST](state) {
    return state.layerList
  },
  [types.g.CURRENT_LAYER_LIST](state, getters) {
    const currentTime = getters[types.g.CURRENT_TIME]
    return state.layerList.filter(layer => {
      return layer.from <= currentTime && currentTime < layer.to
    })
  },
  [types.g.SELECTED_LAYER](state) {
    return state.layerList.find(l => l.id === state.selectedLayerId) || null
  },
  [types.g.CURRENT_TIME](state) {
    return state.currentTime
  }
}

export default getters
