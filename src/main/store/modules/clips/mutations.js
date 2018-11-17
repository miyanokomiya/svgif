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
    clip.svgElementList = [...clip.svgElementList, ...svgElementList]
  },
  [types.m.UPDATE_SVG_ELEMENT](state, { clipId, svgElement, svgElementList }) {
    const clip = state.clipList.find(c => c.id === clipId)
    svgElementList = svgElementList || [svgElement]
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
    svgElementIdList.forEach(svgElementId => {
      const index = clip.svgElementList.findIndex(
        elm => elm.id === svgElementId
      )
      clip.svgElementList.splice(index, 1)
    })
  }
}

export default mutations
