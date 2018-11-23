import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  clipList: [],
  layerList: [],
  selectedId: -1,
  selectedLayerId: -1,
  maxSize: 1200
}

export default {
  state,
  mutations,
  actions,
  getters
}
