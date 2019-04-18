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
let $api = new Api('', {
    interceptorsReq: function(request) { // 请求拦截
        store.commit('Loading/loadingStart')
        return request
    },
    interceptorsRes: function(response) { // 响应拦截
        store.commit('Loading/loadingEnd')
        return response
    },
    errHandler: function(errMsg) { // 错误处理
        // console.log('ggg', errMsg)
    },
    tokenHandler: function(token){ // token默认为'' token存储位置 store.state（存在于内存中，F5刷新微信右上角刷新即消失,但可以根据同一账号角色权限管理状态）,sessionStorage（临时存储页面刷新不消失，浏览器打开新选项卡里的页面不存在token）,localStorage（永久存储,页面刷新不消失）
            // if (store.state.Login.token !== '') {
            //     token = `token ${store.state.Login.token}`
            // } else {
            //     // router.push({ path: '/vue/manage' })
            // }
        if (sessionStorage.getItem('client_access_token') !== null && sessionStorage.getItem('client_access_token') !== '') {
            token = sessionStorage.getItem('client_access_token')
        }
        return token
    }
})

Vue.prototype.$api = $api
Vue.use(Vuex)
Vue.use(YDUI)
Vue.config.productionTip = true

// https://github.com/axios/axios#creating-an-instance //建立一个实例

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
    const componentConfig = requireComponent(v)
    Vue.component(v.substr(1).replace(/\/\S{1}/g, function(v, k) { return v.charAt(1).toUpperCase() }).split('.')[0], componentConfig.default || componentConfig)
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})