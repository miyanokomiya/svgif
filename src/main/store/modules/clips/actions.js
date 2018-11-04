import { getClip } from '@/commons/models/clip'
import types from './types'

const actions = {
  [types.a.CREATE_CLIP]({ commit }, { clip, index }) {
    commit(types.m.ADD_CLIP, {
      clip: getClip(clip),
      index
    })
    return Promise.resolve()
  },
  [types.a.DELETE_CLIP]({ commit }, id) {
    commit(types.m.REMOVE_CLIP, id)
    return Promise.resolve()
  },
  [types.a.DELETE_ALL_CLIP]({ commit }) {
    commit(types.m.REMOVE_ALL_CLIP)
    return Promise.resolve()
  },
  [types.a.SELECT_CLIP]({ commit }, id) {
    commit(types.m.SELECT_CLIP, id)
    return Promise.resolve()
  },
  [types.a.SWAP_CLIP_ORDER]({ commit }, { from, to }) {
    commit(types.m.SWAP_CLIP_ORDER, { from, to })
    return Promise.resolve()
  },
  [types.a.UPDATE_DELAY]({ commit }, { id, delay }) {
    commit(types.m.UPDATE_DELAY, { id, delay })
    return Promise.resolve()
  },
  [types.a.CLONE_CLIP]({ commit, state }, { id, index }) {
    const original = state.clipList.find(c => c.id === id)
    commit(types.m.ADD_CLIP, {
      clip: getClip({
        base64: original.base64,
        width: original.width,
        height: original.height
      }),
      index
    })
    return Promise.resolve()
  },
  [types.a.SET_CANVAS_MODE]({ commit }, canvasMode) {
    commit(types.m.SET_CANVAS_MODE, canvasMode)
    return Promise.resolve()
  },
  [types.a.CREATE_SVG_ELEMENT]({ commit }, { clipId, svgElement }) {
    commit(types.m.ADD_SVG_ELEMENT, { clipId, svgElement })
    return Promise.resolve()
  },
  [types.a.UPDATE_SVG_ELEMENT]({ commit }, { clipId, svgElement }) {
    commit(types.m.UPDATE_SVG_ELEMENT, { clipId, svgElement })
    return Promise.resolve()
  },
  [types.a.DELETE_SVG_ELEMENT]({ commit }, { clipId, svgElementId }) {
    commit(types.m.REMOVE_SVG_ELEMENT, { clipId, svgElementId })
    return Promise.resolve()
  }
}

export default actions
