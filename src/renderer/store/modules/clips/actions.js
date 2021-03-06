import { getClip } from '@/commons/models/clip'
import { getLayer } from '@/commons/models/layer'
import types from './types'

const actions = {
  [types.a.SET_MAX_SIZE]({ commit }, maxSize) {
    commit(types.m.SET_MAX_SIZE, maxSize)
    return Promise.resolve()
  },
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
        svgElementList: original.svgElementList,
        svgElementUndoStack: original.svgElementUndoStack,
        svgElementRedoStack: original.svgElementRedoStack
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
  },
  [types.a.JUMP_SVG_ELEMENT_HISTORY]({ commit }, { clipId, to }) {
    commit(types.m.JUMP_SVG_ELEMENT_HISTORY, {
      clipId,
      to
    })
    return Promise.resolve()
  },
  [types.a.CLEAR_SVG_ELEMENT_HISTORY]({ commit }, { clipId }) {
    commit(types.m.CLEAR_SVG_ELEMENT_HISTORY, {
      clipId
    })
    return Promise.resolve()
  },
  [types.a.IMPORT_STATE]({ commit }, state) {
    commit(types.m.IMPORT_STATE, state)
    return Promise.resolve()
  },
  [types.a.CREATE_LAYER]({ commit }, { layer, index } = {}) {
    commit(types.m.ADD_LAYER, {
      layer: getLayer(layer),
      index
    })
    return Promise.resolve()
  },
  [types.a.DELETE_LAYER]({ commit }, id) {
    commit(types.m.REMOVE_LAYER, id)
    return Promise.resolve()
  },
  [types.a.SWAP_LAYER_ORDER]({ commit }, { from, to }) {
    commit(types.m.SWAP_LAYER_ORDER, { from, to })
    return Promise.resolve()
  },
  [types.a.CLONE_LAYER]({ commit, state }, { id, index }) {
    const originalIndex = state.layerList.findIndex(l => l.id === id)
    const original = state.layerList[originalIndex]
    commit(types.m.ADD_LAYER, {
      layer: getLayer({
        from: original.from,
        to: original.to,
        svgElementList: original.svgElementList,
        svgElementUndoStack: original.svgElementUndoStack,
        svgElementRedoStack: original.svgElementRedoStack
      }),
      index: index >= 0 ? index : originalIndex + 1
    })
    return Promise.resolve()
  },
  [types.a.SELECT_LAYER]({ commit }, id) {
    commit(types.m.SELECT_LAYER, id)
    return Promise.resolve()
  },
  [types.a.UPDATE_LAYER_RANGE]({ commit }, { id, from, to }) {
    commit(types.m.UPDATE_LAYER_RANGE, { id, from, to })
    return Promise.resolve()
  },
  [types.a.SET_CURRENT_TIME]({ commit }, currentTime) {
    commit(types.m.SET_CURRENT_TIME, currentTime)
    return Promise.resolve()
  },
  [types.a.SET_EDIT_TARGET_TYPE]({ commit }, type) {
    commit(types.m.SET_EDIT_TARGET_TYPE, type)
    return Promise.resolve()
  }
}

export default actions
