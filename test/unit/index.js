import Vue from 'vue'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
Vue.config.devtools = false
Vue.config.productionTip = false

function allRequire(context){
  context.keys().forEach(context);
}

allRequire(require.context('./specs', true, /\.spec$/))
allRequire(require.context('../../src/renderer/commons', true, /\.js$/))
allRequire(require.context('../../src/renderer/store', true, /\.js$/))
