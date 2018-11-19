import Vue from 'vue'

import RecorderApp from './RecorderApp'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

document.ondragover = document.ondrop = e => {
  e.preventDefault()
  return false
}

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  components: { RecorderApp },
  template: '<RecorderApp/>'
}).$mount('#recorder')
