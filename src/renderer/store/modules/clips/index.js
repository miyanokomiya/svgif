import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  clipList: [],
  layerList: [],
  selectedId: -1,
  selectedLayerId: -1,
  editTarget: { type: ['clip', 'layer'][0], id: -1 },
  currentTime: 0,
  maxSize: 1200
}

export default {
  state,
  mutations,
  actions,
  getters
}
