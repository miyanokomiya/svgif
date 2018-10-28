import Vue from 'vue'
import axios from 'axios'

import Recorder from './Recorder.vue'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  components: { Recorder },
  store,
  template: '<Recorder/>'
}).$mount('#recorder')
