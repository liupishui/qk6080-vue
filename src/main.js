// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.base.css'
import 'vue-ydui/dist/ydui.rem.css'
import 'vue-ydui/dist/ydui.flexible.js'
import store from './store/index'
import Api from '@/common/api'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import VeeValidate from 'vee-validate'
Vue.prototype.rootPath = '/vue'
let $api = new Api()
Vue.use(VueI18n)
// http://kazupon.github.io/vue-i18n/started.html#javascript
const messages = {
  'en': require('vee-validate/dist/locale/en'),
  'ZH_CN': require('vee-validate/dist/locale/zh_CN')
}
let i18n = new VueI18n({
  locale: 'ZH_CN',
  messages
})
// https://baianat.github.io/vee-validate/guide/localization.html#vuei18n-integration
// https://www.jianshu.com/p/4dfaf42ce006
// https://www.cnblogs.com/rogerwu/p/7744476.html
// // fails and will log a warning.
// this.$validator.locale = 'ar';

// // works and will regenerate the error messages.
// this.$i18n.locale = 'ar';
Vue.use(VeeValidate, {
  i18nRootKey: 'validations',
  i18n,
  dictionary: {
    'en': require('vee-validate/dist/locale/en'),
    'ZH_CN': require('vee-validate/dist/locale/zh_CN')
  }
})

Vue.prototype.$api = $api
Vue.use(Vuex)
Vue.use(YDUI)
Vue.config.productionTip = true

// https://github.com/axios/axios#creating-an-instance //建立一个实例
let $axios = axios.create({
  baseURL: 'https://www.qk6080.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest'
  }
})
// 添加一个请求拦截
$axios.interceptors.request.use(function (config) {
  // 请求前做一些事情
  // 显示加载状态
  // store.commit('Loading/loadingStart')
  // let TOKEN = sessionStorage.getItem('STORAGE_TOKEN')
  // if (TOKEN) {
  // }
  // 请求验证
  store.commit('Loading/loadingStart')
  if (store.state.Login.token !== '') {
    config.headers.Authorization = `token ${store.state.Login.token}`
  } else {
    // router.push({ path: '/vue/manage' })
  }
  return config
}, function (error) {
  // 处理请求错误
  alert('网络错误，请稍后再试')
  store.commit('Loading/loadingEnd')
  return Promise.reject(error)
})
// 添加一个响应拦截
$axios.interceptors.response.use(function (response) {
  // 处理response数据
  store.commit('Loading/loadingEnd')
  return response
}, function (error) {
  // 处理响应错误
  store.commit('Loading/loadingEnd')
  return Promise.reject(error)
})
Vue.prototype.$axios = $axios

router.beforeEach((to, from, next) => {
  // 路由发生变化验证页面是否需要登录
  console.log('main', to)
  if (to.matched.some(r => r.meta.requireAuth)) { // 这里的requireAuth为路由中定义的 meta:{requireAuth:true}，意思为：该路由添加该字段，表示进入该路由需要登陆的
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) }
      })
    }
  } else {
    next()
  }
  /* 路由发生变化修改页面title */
  // https://blog.csdn.net/nickroprak/article/details/79084856
  //  console.log(to.name)
  if (to.name === 'Dianying') {
    console.log(to.params)
    switch (to.params.typeid) {
      case '0':
        document.title = '电影'
        break
      case '1000':
        document.title = '电视剧'
        break
      case '11':
      {
        console.log(1111212222)
        document.title = '综艺'
        break
      }
      default:
        document.title = '电影'
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

// 加载所有组件
const path = require('path')
const requireComponent = require.context(
  './components', true, /\.vue$/
)
requireComponent.keys().forEach((v, k) => {
  const componentConfig = require('@/' + path.join('./components', v))
  Vue.component(v.substr(1).replace(/\/\S{1}/g, function (v, k) { return v.charAt(1).toUpperCase() }).split('.')[0], componentConfig.default || componentConfig)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
