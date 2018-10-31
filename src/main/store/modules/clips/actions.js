import types from './types'

const actions = {
  [types.a.CREATE_CLIP]({ commit }, { clip, index }) {
    commit(types.m.ADD_CLIP, {
      clip: {
        id: createId(),
        createdAt: createDate(new Date()),
        delay: 300,
        ...clip
      },
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
