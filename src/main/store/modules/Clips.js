export const types = {
  m: {
    ADD_CLIP: 'ADD_CLIP',
    REMOVE_CLIP: 'REMOVE_CLIP',
    REMOVE_ALL_CLIP: 'REMOVE_ALL_CLIP',
    SELECT_CLIP: 'SELECT_CLIP',
    SWAP_ORDER: 'SWAP_ORDER'
  },
  a: {
    CREATE_CLIP: 'CREATE_CLIP',
    DELETE_CLIP: 'DELETE_CLIP',
    DELETE_ALL_CLIP: 'DELETE_ALL_CLIP',
    SELECT_CLIP: 'SELECT_CLIP',
    SWAP_ORDER: 'SWAP_ORDER'
  },
  g: {
    CLIP_LIST: 'CLIP_LIST',
    SELECTED_CLIP: 'SELECTED_CLIP'
  }
}

const state = {
  clipList: [],
  selectedId: -1
}

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
  [types.m.SWAP_ORDER](state, { from, to }) {
    const clip = state.clipList[from]
    state.clipList.splice(from, 1)
    state.clipList.splice(to, 0, clip)
  }
}

const actions = {
  [types.a.CREATE_CLIP]({ commit }, { clip, index }) {
    commit(types.m.ADD_CLIP, {
      clip: {
        id: createId(),
        createdAt: createDate(new Date()),
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
  [types.a.SWAP_ORDER]({ commit }, { from, to }) {
    commit(types.m.SWAP_ORDER, { from, to })
    return Promise.resolve()
  }
}

const getters = {
  [types.g.CLIP_LIST](state) {
    return state.clipList
  },
  [types.g.SELECTED_CLIP](state) {
    return state.clipList.find(c => c.id === state.selectedId)
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

export default {
  state,
  mutations,
  actions,
  getters
}
