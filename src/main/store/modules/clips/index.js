import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  clipList: [],
  selectedId: -1
}

export default {
  state,
  mutations,
  actions,
  getters
}
