import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  clipList: [],
  selectedId: -1,
  canvasMode: ['select', 'move', 'rectangle'][0]
}

export default {
  state,
  mutations,
  actions,
  getters
}
