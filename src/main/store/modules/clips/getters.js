import types from './types'

const getters = {
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
  }
}

export default getters
