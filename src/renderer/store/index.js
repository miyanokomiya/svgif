import Vue from 'vue'
import Vuex from 'vuex'
import clips from './modules/clips'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    clips
  },
  plugins: process.env.IS_WEB
    ? []
    : [require('vuex-electron').createPersistedState()],
  strict: process.env.NODE_ENV !== 'production'
})
