import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  clipList: [],
  selectedId: -1,
  canvasMode: ['select', 'move', 'draw'][0],
  elementType: ['rectangle'][0],
  elementColor: 'rgba(255, 69, 0, 0.68)'
}

export default {
  state,
  mutations,
  actions,
  getters
}
