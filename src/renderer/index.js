import Vue from 'vue'

import App from './App'
import store from './store'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import plugins from './commons/plugins'

if (process.env.BUILD_STAMP)
  console.log(`Build: ${new Date(process.env.BUILD_STAMP)}`)

document.ondragover = document.ondrop = e => {
  e.preventDefault()
  return false
}

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
  require('electron').ipcRenderer.on(
    'app-dispatch',
    (event, { type, payload }) => {
      store.dispatch(type, payload)
    }
  )
}

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.use(plugins)

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
