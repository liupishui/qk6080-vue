import _ from 'lodash'
import axios from 'axios'
import Vue from 'vue'
import errorCode from './errorCode'
import apilist from './apilist'
let vue = new Vue()
let $axios = axios.create({
  baseURL: '',
  headers: {}
})

// 添加ajax拦截
$axios.interceptors.request.use(config => {
  // 请求前做一些事情
  return config
}, error => {
  // 处理请求错误
  vue.$dialog.toast({ mes: errorCode['600'], timeout: 1000 })
  return Promise.reject(error)
})
// 添加一个响应拦截
$axios.interceptors.response.use(response => {
  // 处理response数据
  return response
}, error => {
  // 处理响应错误
  for (let code in errorCode) {
    if (~error.message.indexOf(code)) {
      vue.$dialog.toast({ mes: errorCode[code], timeout: 1000 })
    }
  }
  if (error.message === 'Network Error') { // 域名解析不到会报次错误
    vue.$dialog.toast({ mes: '连接不到服务器', timeout: 1000 })
  }
  return Promise.reject(error)
})

async function getToken () {
  try {
    let tokenRst = await $axios.post('/oauth/token', {
      grant_type: 'client_credentials', // 指定授权模式https://www.cnblogs.com/giserliu/p/4372455.html
      client_id: 2,
      client_secret: '****', // 客户端密码
      scope: '*'
    }).then((res) => { return res.data.access_token })
    return tokenRst
  } catch (err) {
    vue.$dialog.toast({ mes: '获取token失败，没有权限', timeout: 1000 })
  }
// 本地获取token,一般登录会写入sessionStorage或者localStorage
//   if (typeof (sessionStorage.getItem('client_access_token')) !== 'undefined' && sessionStorage.getItem('client_access_token') != null && sessionStorage.getItem('client_access_token') !== '') {
//     return sessionStorage.getItem('client_access_token')
//   }
}

function deepObjectMerge (FirstOBJ, SecondOBJ) { // 深度合并对象
  for (var key in SecondOBJ) {
    FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
      ? deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key]
  }
  return FirstOBJ
}

async function axiosPost () {
  let baseConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  if (_.filter(apilist, { name: arguments[0] }).length) {
    if (_.filter(apilist, { name: arguments[0] })[0].authorization) { //
      let token = await getToken().then((rst) => {
        return rst
      })
      baseConfig.headers.Authorization = token
    }
  }
  if (arguments.length === 1) {
    return $axios.post(arguments[0], {}, baseConfig)
  }

  if (arguments.length === 2) {
    return $axios.post(arguments[0], arguments[1], baseConfig)
  }

  if (arguments.length === 3) {
    return $axios.post(arguments[0], arguments[1], deepObjectMerge(baseConfig, arguments[2]))
  }
}

async function axiosGet () {
  let baseConfig = {
  }
  if (arguments.length === 1) {
    return $axios.get(arguments[0], {}, baseConfig)
  }

  if (arguments.length === 2) {
    $axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    $axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    $axios.get(arguments[0], arguments[1]).then(rst => {
    })
    return $axios.get(arguments[0], arguments[1], baseConfig)
  }

  if (arguments.length === 3) {
    return $axios.get(arguments[0], arguments[1], deepObjectMerge(baseConfig, arguments[2]))
  }
}

function apiMaker (apiKeyArr, obj) {
  let finalApi = ''
  let apiMakerInner = function (apiKeyArr, obj) {
    if (apiKeyArr.length > 1) {
      let apiCurrName = apiKeyArr.splice(-1)[0]
      let objectNew = {}
      objectNew[apiCurrName] = obj
      apiMakerInner(apiKeyArr, objectNew)
    } else {
      finalApi = obj
    }
  }
  apiMakerInner(apiKeyArr, obj)
  return finalApi
}

let api = function (url) {
  if (url) {
    $axios.defaults.baseURL = url // 配置axios请求地址
    this.baseUrl = url
  } else {
    throw Error('请求api地址不能为空')
  }

  for (let apiCurr of apilist) {
    // 挂载apilist到api
    let apiCurrArr = apiCurr.name.split('/')
    if (apiCurr.type === 'POST') { // 如果是POST请求
      this[apiCurrArr[0]] = apiMaker(apiCurrArr, function () {
        return axiosPost(apiCurr.name, arguments[0])
      })
    } else {
      this[apiCurrArr[0]] = apiMaker(apiCurrArr, function () {
        return axiosGet(apiCurr.name, arguments[0])
      })
    }
  }

  // 扩展api方法
  this.ext = {
    post () {
      return axiosPost.apply(this, arguments)
    },
    get () {
      return axiosGet.apply(this, arguments)
    },
    xijulist () {
      return axiosPost('/api/dianying/xiju')
    }
  }
  // 扩展
  // 加载所有组件
  const path = require('path')
  const contextExtend = require.context(
    '.', true, /\.\/extend\/(.*)\.js$/
  )
  contextExtend.keys().forEach(ele => {
    this.ext[path.basename(ele, '.js')] = function () { return contextExtend(ele).default.apply(this, arguments) }
  })
}

export default api
