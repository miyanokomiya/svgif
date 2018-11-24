import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  clipList: [],
  layerList: [],
  selectedLayerId: -1,
  editTargetType: ['clip', 'layer'][0],
  currentTime: 0,
  maxSize: 1200
}

export default {
  state,
  mutations,
  actions,
  getters
}
