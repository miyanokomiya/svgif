import types from './types'

const actions = {
  [types.a.CREATE_CLIP]({ commit }, { clip, index }) {
    commit(types.m.ADD_CLIP, {
      clip: createClip(clip),
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
      clip: createClip({
        base64: original.base64,
        width: original.width,
        height: original.height
      }),
      index
    })
    return Promise.resolve()
  },
  [types.a.SET_CANVAS_MODE]({ commit }, mode) {
    commit(types.m.SET_CANVAS_MODE, mode)
    return Promise.resolve()
  }
}

function createClip(clip) {
  return {
    id: createId(),
    createdAt: createDate(new Date()),
    delay: 300,
    base64: '',
    width: 0,
    height: 0,
    ...clip
  }
}

function createId() {
  return Math.random() + 1
}

function createDate(dt) {
  const y = dt.getFullYear()
  const m = ('0' + (dt.getMonth() + 1)).slice(-2)
  const d = ('0' + dt.getDate()).slice(-2)
  const hh = ('0' + dt.getHours()).slice(-2)
  const mm = ('0' + dt.getMinutes()).slice(-2)
  const ss = ('0' + dt.getSeconds()).slice(-2)
  return `${y}/${m}/${d} ${hh}:${mm}:${ss}`
}

export default actions
