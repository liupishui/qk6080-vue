import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const path = require('path')
const requireComponent = require.context(
  '@/store', true, /\.js$/
)
var modules = {}
requireComponent.keys().forEach((v, k) => {
  // Vue.component(path.basename(v, '.vue').charAt(0).toUpperCase() + path.basename(v, '.vue').slice(1), componentConfig.default || componentConfig)
  // console.log(v, k)
  if (path.basename(v) !== 'index.js') {
    // modules的首字母大写，如./load/loading.js会转为LoadLoading
    var moduleName = v.substr(1).replace(/\/\S{1}/g, function (v, k) { return v.charAt(1).toUpperCase() }).split('.')[0]
    modules[moduleName] = require('@/' + path.join('./store', v)).default
    modules[moduleName].namespaced = true
  }
})
// console.log(modules)
const store = new Vuex.Store({
  state: {
    product: [{
      name: 'apple',
      price: 20
    }]
  },
  mutations: {},
  actions: {},
  getters: {},
  modules: modules
})
export default store
