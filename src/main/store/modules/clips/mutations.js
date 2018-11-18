import types from './types'
import getters from './getters'
import * as elementUtils from '@/commons/utils/element'

// キャンバス全体サイズの変更に伴い、各clip上のsvgElementの位置が変化しなよう調整する
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
  [types.m.ADD_CLIP](state, { clip, index = -1 }) {
    adjustSvgElementPositions({
      state,
      getters,
      mainFunction: () => {
        if (index === -1) {
          index =
            state.selectedId !== -1
              ? state.clipList.findIndex(c => c.id === state.selectedId) + 1
              : state.clipList.length
        }
        state.clipList.splice(index, 0, clip)
        state.selectedId = clip.id
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
        if (state.selectedId !== id) return
        if (index > 0) state.selectedId = state.clipList[index - 1].id
        else if (index === 0 && state.clipList.length > 0)
          state.selectedId = state.clipList[0].id
        else state.selectedId = -1
      }
    })
  },
  [types.m.REMOVE_ALL_CLIP](state) {
    state.clipList = []
    state.selectedId = -1
  },
  [types.m.SELECT_CLIP](state, id) {
    if (!state.clipList.find(c => c.id === id)) return
    state.selectedId = id
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
  [types.m.ADD_SVG_ELEMENT](state, { clipId, svgElement, svgElementList }) {
    const clip = state.clipList.find(c => c.id === clipId)
    svgElementList = svgElementList || [svgElement]

    // 追加した要素リストのidを保存
    clip.svgElementUndoStack.push({
      type: 'ADD',
      svgElementList: svgElementList.map(elm => ({ id: elm.id }))
    })
    // やり直し履歴はクリア
    clip.svgElementRedoStack = []

    clip.svgElementList = [...clip.svgElementList, ...svgElementList]
  },
  [types.m.UPDATE_SVG_ELEMENT](state, { clipId, svgElement, svgElementList }) {
    const clip = state.clipList.find(c => c.id === clipId)
    svgElementList = svgElementList || [svgElement]

    // 更新した要素リストの更新前情報を保存
    clip.svgElementUndoStack.push({
      type: 'UPDATE',
      svgElementList: svgElementList.map(to => {
        const from = clip.svgElementList.find(elm => elm.id === to.id)
        const dif = { id: from.id }
        for (let key in to) {
          if (to[key] !== from[key]) dif[key] = from[key]
        }
        return dif
      })
    })
    // やり直し履歴はクリア
    clip.svgElementRedoStack = []

    svgElementList.forEach(svgElement => {
      const index = clip.svgElementList.findIndex(
        elm => elm.id === svgElement.id
      )
      clip.svgElementList.splice(index, 1, {
        ...clip.svgElementList[index],
        ...svgElement
      })
    })
  },
  [types.m.REMOVE_SVG_ELEMENT](
    state,
    { clipId, svgElementId, svgElementIdList }
  ) {
    svgElementIdList = svgElementIdList || [svgElementId]
    const clip = state.clipList.find(c => c.id === clipId)

    // 削除した要素リストを保存
    clip.svgElementUndoStack.push({
      type: 'REMOVE',
      svgElementList: JSON.parse(
        JSON.stringify(
          svgElementIdList.map(id => {
            const _index = clip.svgElementList.findIndex(elm => elm.id === id)
            return {
              _index,
              ...clip.svgElementList[_index]
            }
          })
        )
      )
    })
    // やり直し履歴はクリア
    clip.svgElementRedoStack = []

    svgElementIdList.forEach(svgElementId => {
      const index = clip.svgElementList.findIndex(
        elm => elm.id === svgElementId
      )
      clip.svgElementList.splice(index, 1)
    })
  },
  [types.m.UNDO_SVG_ELEMENT](state, { clipId }) {
    const clip = state.clipList.find(c => c.id === clipId)
    undo({ clip })
  },
  [types.m.REDO_SVG_ELEMENT](state, { clipId }) {
    const clip = state.clipList.find(c => c.id === clipId)
    redo({ clip })
  },
  [types.m.JUMP_SVG_ELEMENT_HISTORY](state, { clipId, to = 0 }) {
    const clip = state.clipList.find(c => c.id === clipId)
    const redoStack = clip.svgElementRedoStack
    if (to < redoStack.length) {
      // redoStack.length は redo() によって変化する前の値を使う
      for (let i = 0, count = redoStack.length - to; i < count; i++) {
        redo({ clip })
      }
    } else {
      for (let i = redoStack.length + 1; i <= to; i++) {
        undo({ clip })
      }
    }
  }
}

export default mutations
