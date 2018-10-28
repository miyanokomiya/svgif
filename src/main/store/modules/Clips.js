export const types = {
  m: {
    ADD_CLIP: 'ADD_CLIP',
    REMOVE_CLIP: 'REMOVE_CLIP'
  },
  a: {
    CREATE_CLIP: 'CREATE_CLIP',
    DELETE_CLIP: 'DELETE_CLIP'
  },
  g: {
    CLIP_LIST: 'CLIP_LIST'
  }
}

const state = {
  clipList: []
}

const mutations = {
  [types.m.ADD_CLIP](state, { clip, index }) {
    state.clipList.splice(index, 0, clip)
  },
  [types.m.REMOVE_CLIP](state, id) {
    state.clipList = state.clipList.filter(c => c.id !== id)
  }
}

const actions = {
  [types.a.CREATE_CLIP]({ commit }, { clip, index }) {
    console.log('CREATE_CLIP')
    commit(types.m.ADD_CLIP, { clip: { id: createId(), ...clip }, index })
    return Promise.resolve()
  },
  [types.a.DELETE_CLIP]({ commit }, id) {
    commit(types.m.REMOVE_CLIP, id)
    return Promise.resolve()
  }
}

const getters = {
  [types.g.CLIP_LIST](state) {
    return state.clipList
  }
}

function createId() {
  return Math.random()
}

export default {
  state,
  mutations,
  actions,
  getters
}
