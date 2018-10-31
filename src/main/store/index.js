import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

import clips from './modules/clips'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    clips
  },
  plugins: [createPersistedState(), createSharedMutations()],
  strict: process.env.NODE_ENV !== 'production'
})
