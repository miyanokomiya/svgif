import types from './types'

const mutations = {
  [types.m.ADD_CLIP](state, { clip, index = -1 }) {
    if (index === -1) {
      index =
        state.selectedId !== -1
          ? state.clipList.findIndex(c => c.id === state.selectedId) + 1
          : state.clipList.length
    }
    state.clipList.splice(index, 0, clip)
    state.selectedId = clip.id
  },
  [types.m.REMOVE_CLIP](state, id) {
    const index = state.clipList.findIndex(c => c.id === id)
    if (index === -1) return
    state.clipList.splice(index, 1)
    if (state.selectedId !== id) return
    if (index > 0) state.selectedId = state.clipList[index - 1].id
    else if (index === 0 && state.clipList.length > 0)
      state.selectedId = state.clipList[0].id
    else state.selectedId = -1
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
  [types.m.SET_CANVAS_MODE](state, canvasMode) {
    state.canvasMode = canvasMode
  }
}

export default mutations
