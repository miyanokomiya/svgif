import types from './types'
import getters, { getSelectedClipId } from './getters'
import * as elementUtils from '@/commons/utils/element'
import { completeClip } from '@/commons/models/clip'
import { completeLayer } from '@/commons/models/layer'

// キャンバス全体サイズの変更に伴い、各clip上のsvgElementの位置が変化しないよう調整する
export function adjustSvgElementPositions({
  state,
  getters,
  mainFunction = () => {}
}) {
  const fromSize = getters[types.g.WHOLE_SIZE](state)
  mainFunction()
  const toSize = getters[types.g.WHOLE_SIZE](state)
  const difVec = {
    x: (toSize.width - fromSize.width) / 2,
    y: (toSize.height - fromSize.height) / 2
  }
  state.clipList.forEach(clip => {
    clip.svgElementList = clip.svgElementList.map(element =>
      elementUtils.moveElement({ element, vec: difVec })
    )
  })
}

function undo({ clip }) {
  const data = clip.svgElementUndoStack.pop()
  if (!data) return
  if (data.type === 'ADD') {
    // 追加された要素を削除
    const removedList = []
    data.svgElementList.forEach(historyElm => {
      const _index = clip.svgElementList.findIndex(
        elm => elm.id === historyElm.id
      )
      removedList.push({
        _index,
        ...clip.svgElementList[_index]
      })
      clip.svgElementList.splice(_index, 1)
    })
    // 削除対象をredoスタックに追加
    clip.svgElementRedoStack.push({
      type: 'ADD',
      svgElementList: JSON.parse(JSON.stringify(removedList))
    })
  } else if (data.type === 'UPDATE') {
    // 更新された要素を差し戻し
    const updatedList = []
    data.svgElementList.forEach(historyElm => {
      const index = clip.svgElementList.findIndex(
        elm => elm.id === historyElm.id
      )
      const from = clip.svgElementList[index]
      const dif = { id: from.id }
      for (let key in historyElm) {
        if (historyElm[key] !== from[key]) dif[key] = from[key]
      }
      updatedList.push(dif)
      clip.svgElementList.splice(index, 1, {
        ...clip.svgElementList[index],
        ...historyElm
      })
    })
    // 差し戻し対象をredoスタックに追加
    clip.svgElementRedoStack.push({
      type: 'UPDATE',
      svgElementList: JSON.parse(JSON.stringify(updatedList))
    })
  } else if (data.type === 'REMOVE') {
    // 削除された要素を追加
    const addList = []
    data.svgElementList.forEach(historyElm => {
      addList.push({ id: historyElm.id })
      clip.svgElementList.splice(historyElm._index, 0, historyElm)
      delete historyElm._index
    })
    // 追加対象をredoスタックに追加
    clip.svgElementRedoStack.push({
      type: 'REMOVE',
      svgElementList: addList
    })
  }
}

function redo({ clip }) {
  const data = clip.svgElementRedoStack.pop()
  if (!data) return
  if (data.type === 'ADD') {
    // 追加をやり直す
    const addList = []
    data.svgElementList.forEach(historyElm => {
      addList.push({ id: historyElm.id })
      clip.svgElementList.splice(historyElm._index, 0, historyElm)
      delete historyElm._index
    })
    // 追加やり直し対象をundoスタックに追加
    clip.svgElementUndoStack.push({
      type: 'ADD',
      svgElementList: addList
    })
  } else if (data.type === 'UPDATE') {
    // 更新された要素をやり直す
    const updatedList = []
    data.svgElementList.forEach(historyElm => {
      const index = clip.svgElementList.findIndex(
        elm => elm.id === historyElm.id
      )
      const from = clip.svgElementList[index]
      const dif = { id: from.id }
      for (let key in historyElm) {
        if (historyElm[key] !== from[key]) dif[key] = from[key]
      }
      updatedList.push(dif)
      clip.svgElementList.splice(index, 1, {
        ...clip.svgElementList[index],
        ...historyElm
      })
    })
    // 差し戻し対象をredoスタックに追加
    clip.svgElementUndoStack.push({
      type: 'UPDATE',
      svgElementList: JSON.parse(JSON.stringify(updatedList))
    })
  } else if (data.type === 'REMOVE') {
    // 削除をやり直す
    const removedList = []
    data.svgElementList.forEach(historyElm => {
      const _index = clip.svgElementList.findIndex(
        elm => elm.id === historyElm.id
      )
      removedList.push({
        _index,
        ...clip.svgElementList[_index]
      })
      clip.svgElementList.splice(_index, 1)
    })
    // 削除やり直し対象をredoスタックに追加
    clip.svgElementUndoStack.push({
      type: 'REMOVE',
      svgElementList: JSON.parse(JSON.stringify(removedList))
    })
  }
}

const mutations = {
  [types.m.SET_MAX_SIZE](state, maxSize) {
    state.maxSize = maxSize
  },
  [types.m.ADD_CLIP](state, { clip, index = -1 }) {
    adjustSvgElementPositions({
      state,
      getters,
      mainFunction: () => {
        const selectedId = getSelectedClipId(state)
        if (index === -1) {
          index =
            selectedId !== -1
              ? state.clipList.findIndex(c => c.id === selectedId) + 1
              : state.clipList.length
        }
        state.clipList.splice(index, 0, clip)
        state.editTargetType = 'clip'
      }
    })
  },
  [types.m.REMOVE_CLIP](state, id) {
    adjustSvgElementPositions({
      state,
      getters,
      mainFunction: () => {
        const index = state.clipList.findIndex(c => c.id === id)
        if (index === -1) return
        state.clipList.splice(index, 1)
        const wholeDelay = getters[types.g.WHOLE_DELAY](state)
        if (wholeDelay < state.currentTime) {
          state.currentTime = wholeDelay
        }
      }
    })
  },
  [types.m.REMOVE_ALL_CLIP](state) {
    state.clipList = []
    state.layerList = []
    state.selectedLayerId = -1
    state.currentTime = 0
  },
  [types.m.SELECT_CLIP](state, id) {
    state.editTargetType = 'clip'
    // currentTime が選択クリップに包含されてなければ移動する
    let from = 0
    let to = 0
    state.clipList.some(clip => {
      if (clip.id === id) {
        to = from + clip.delay
        return true
      }
      from += clip.delay
    })
    if (state.currentTime < from || to <= state.currentTime) {
      state.currentTime = from
      return true
    }
  },
  [types.m.SWAP_CLIP_ORDER](state, { from, to }) {
    const clip = state.clipList[from]
    state.clipList.splice(from, 1)
    state.clipList.splice(to, 0, clip)
  },
  [types.m.UPDATE_DELAY](state, { id, delay }) {
    const clip = state.clipList.find(c => c.id === id)
    if (!clip) return
    clip.delay = delay
  },
  [types.m.ADD_SVG_ELEMENT](state, { svgElement, svgElementList }) {
    const target = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)
    svgElementList = svgElementList || [svgElement]

    // 追加した要素リストのidを保存
    target.svgElementUndoStack.push({
      type: 'ADD',
      svgElementList: svgElementList.map(elm => ({ id: elm.id }))
    })
    // やり直し履歴はクリア
    target.svgElementRedoStack = []

    target.svgElementList = [...target.svgElementList, ...svgElementList]
  },
  [types.m.UPDATE_SVG_ELEMENT](state, { svgElement, svgElementList }) {
    const target = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)
    svgElementList = svgElementList || [svgElement]

    // 更新した要素リストの更新前情報を保存
    target.svgElementUndoStack.push({
      type: 'UPDATE',
      svgElementList: svgElementList.map(to => {
        const from = target.svgElementList.find(elm => elm.id === to.id)
        const dif = { id: from.id }
        for (let key in to) {
          if (to[key] !== from[key]) dif[key] = from[key]
        }
        return dif
      })
    })
    // やり直し履歴はクリア
    target.svgElementRedoStack = []

    svgElementList.forEach(svgElement => {
      const index = target.svgElementList.findIndex(
        elm => elm.id === svgElement.id
      )
      target.svgElementList.splice(index, 1, {
        ...target.svgElementList[index],
        ...svgElement
      })
    })
  },
  [types.m.REMOVE_SVG_ELEMENT](state, { svgElementId, svgElementIdList }) {
    svgElementIdList = svgElementIdList || [svgElementId]
    const target = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)

    // 削除した要素リストを保存
    target.svgElementUndoStack.push({
      type: 'REMOVE',
      svgElementList: JSON.parse(
        JSON.stringify(
          svgElementIdList.map(id => {
            const _index = target.svgElementList.findIndex(elm => elm.id === id)
            return {
              _index,
              ...target.svgElementList[_index]
            }
          })
        )
      )
    })
    // やり直し履歴はクリア
    target.svgElementRedoStack = []

    svgElementIdList.forEach(svgElementId => {
      const index = target.svgElementList.findIndex(
        elm => elm.id === svgElementId
      )
      target.svgElementList.splice(index, 1)
    })
  },
  [types.m.UNDO_SVG_ELEMENT](state) {
    const target = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)
    undo({ clip: target })
  },
  [types.m.REDO_SVG_ELEMENT](state) {
    const target = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)
    redo({ clip: target })
  },
  [types.m.JUMP_SVG_ELEMENT_HISTORY](state, { to = 0 }) {
    const target = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)
    const redoStack = target.svgElementRedoStack
    if (to < redoStack.length) {
      // redoStack.length は redo() によって変化する前の値を使う
      for (let i = 0, count = redoStack.length - to; i < count; i++) {
        redo({ clip: target })
      }
    } else {
      for (let i = redoStack.length + 1; i <= to; i++) {
        undo({ clip: target })
      }
    }
  },
  [types.m.CLEAR_SVG_ELEMENT_HISTORY](state) {
    const target = getters[types.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER](state)
    target.svgElementUndoStack = []
    target.svgElementRedoStack = []
  },
  [types.m.IMPORT_STATE](state, data = {}) {
    state.clipList = (data.clipList || []).map(completeClip)
    state.layerList = (data.layerList || []).map(completeLayer)
    state.selectedLayerId = data.selectedLayerId || -1
    state.editTargetType = data.editTargetType || 'clip'
    state.currentTime = data.currentTime || 0
    state.maxSize = data.maxSize || 1200
  },
  [types.m.ADD_LAYER](state, { layer, index = -1 }) {
    if (index === -1) {
      index = state.layerList.length
    }
    state.layerList.splice(index, 0, layer)
    state.selectedLayerId = layer.id
    state.editTargetType = 'layer'
  },
  [types.m.REMOVE_LAYER](state, id) {
    const index = state.layerList.findIndex(c => c.id === id)
    if (index === -1) return
    state.layerList.splice(index, 1)
    if (state.selectedLayerId !== id) return
    if (index > 0) state.selectedLayerId = state.layerList[index - 1].id
    else if (index === 0 && state.layerList.length > 0)
      state.selectedLayerId = state.layerList[0].id
    else state.selectedLayerId = -1
  },
  [types.m.SELECT_LAYER](state, id) {
    const layer = state.layerList.find(c => c.id === id)
    if (!layer) return
    state.selectedLayerId = id
    state.editTargetType = 'layer'
    // currentTime が選択レイヤーに包含されてなければ移動する
    if (state.currentTime < layer.from || layer.to <= state.currentTime) {
      state.currentTime = layer.from
    }
  },
  [types.m.UPDATE_LAYER_RANGE](state, { id, from, to }) {
    const layer = state.layerList.find(c => c.id === id)
    if (!layer) return
    layer.from = from
    layer.to = to
  },
  [types.m.SET_CURRENT_TIME](state, currentTime) {
    state.currentTime = currentTime
    const selectedLayer = getters[types.g.SELECTED_LAYER](state)
    if (!selectedLayer) return
    if (selectedLayer.from <= currentTime && currentTime < selectedLayer.to)
      return
    state.selectedLayerId = -1
    state.editTargetType = 'clip'
  },
  [types.m.SET_EDIT_TARGET_TYPE](state, type) {
    state.editTargetType = type
  }
}

export default mutations
