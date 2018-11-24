import types from './types'

function getSelectedClip(state) {
  let current = 0
  let selectedClip = null
  state.clipList.some(clip => {
    selectedClip = clip
    current += clip.delay
    return state.currentTime < current
  })
  return selectedClip
}

export function getSelectedClipId(state) {
  const clip = getSelectedClip(state)
  return clip ? clip.id : -1
}

const getters = {
  [types.g.MAX_SIZE](state) {
    return state.maxSize
  },
  [types.g.CLIP_LIST](state) {
    return state.clipList
  },
  [types.g.SELECTED_CLIP](state) {
    return getSelectedClip(state)
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
  },
  [types.g.EDIT_TARGET_TYPE](state) {
    return state.editTargetType
  },
  [types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state) {
    return state.editTargetType === 'clip'
      ? getSelectedClip(state)
      : state.layerList.find(l => l.id === state.selectedLayerId) || null
  }
}

export default getters
