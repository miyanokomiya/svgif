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
    const originalIndex = state.clipList.findIndex(c => c.id === id)
    const original = state.clipList[originalIndex]
    commit(types.m.ADD_CLIP, {
      clip: getClip({
        delay: original.delay,
        base64: original.base64,
        width: original.width,
        height: original.height,
        svgElementList: original.svgElementList
      }),
      index: index >= 0 ? index : originalIndex + 1
    })
    return Promise.resolve()
  },
  [types.a.CREATE_SVG_ELEMENT](
    { commit },
    { clipId, svgElement, svgElementList }
  ) {
    commit(types.m.ADD_SVG_ELEMENT, { clipId, svgElement, svgElementList })
    return Promise.resolve()
  },
  [types.a.UPDATE_SVG_ELEMENT](
    { commit },
    { clipId, svgElement, svgElementList }
  ) {
    commit(types.m.UPDATE_SVG_ELEMENT, { clipId, svgElement, svgElementList })
    return Promise.resolve()
  },
  [types.a.DELETE_SVG_ELEMENT](
    { commit },
    { clipId, svgElementId, svgElementIdList }
  ) {
    commit(types.m.REMOVE_SVG_ELEMENT, {
      clipId,
      svgElementId,
      svgElementIdList
    })
    return Promise.resolve()
  },
  [types.a.UNDO_SVG_ELEMENT]({ commit }, { clipId }) {
    commit(types.m.UNDO_SVG_ELEMENT, {
      clipId
    })
    return Promise.resolve()
  },
  [types.a.REDO_SVG_ELEMENT]({ commit }, { clipId }) {
    commit(types.m.REDO_SVG_ELEMENT, {
      clipId
    })
    return Promise.resolve()
  }
}

export default actions
