export const types = {
  m: {
    ADD_CLIP: 'ADD_CLIP',
    REMOVE_CLIP: 'REMOVE_CLIP',
    REMOVE_ALL_CLIP: 'REMOVE_ALL_CLIP',
    SELECT_CLIP: 'SELECT_CLIP'
  },
  a: {
    CREATE_CLIP: 'CREATE_CLIP',
    DELETE_CLIP: 'DELETE_CLIP',
    DELETE_ALL_CLIP: 'DELETE_ALL_CLIP',
    SELECT_CLIP: 'SELECT_CLIP'
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
      index = state.selectedId
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
    if (index > 0) state.selectedId = index - 1
    else if (index === 0 && state.clipList.length > 0) state.selectedId = 0
    else state.selectedId = -1
  },
  [types.m.REMOVE_ALL_CLIP](state) {
    state.clipList = []
    state.selectedId = -1
  },
  [types.m.SELECT_CLIP](state, id) {
    if (!state.clipList.find(c => c.id === id)) return
    state.selectedId = id
  }
}

const actions = {
  [types.a.CREATE_CLIP]({ commit }, { clip, index }) {
    console.log('CREATE_CLIP')
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
  return Math.random()
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
