import _ from 'lodash'
import axios from 'axios'
import Vue from 'vue'
import errorCode from './errorCode'
import {
  DEV_CONF,
  PRO_CONF,
  APILIST
} from './config'
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
  vue.$dialog.toast({
    mes: errorCode['600'],
    timeout: 1000
  })
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
      vue.$dialog.toast({
        mes: errorCode[code],
        timeout: 1000
      })
    }
  }
  if (error.message === 'Network Error') { // 域名解析不到会报次错误
    vue.$dialog.toast({
      mes: '连接不到服务器',
      timeout: 1000
    })
  }
  return Promise.reject(error)
})

async function getToken () {
  //  每次请求前或许token
  //   try {
  //     let tokenRst = await $axios.post('/oauth/token', {
  //       grant_type: 'client_credentials', // 指定授权模式https://www.cnblogs.com/giserliu/p/4372455.html
  //       client_id: 2,
  //       client_secret: '****', // 客户端密码
  //       scope: '*'
  //     }).then((res) => { return res.data.access_token })
  //     return tokenRst
  //   } catch (err) {
  //     vue.$dialog.toast({ mes: '获取token失败，没有权限', timeout: 1000 })
  //   }
  // 本地获取token,一般登录会写入sessionStorage或者localStorage
  if (sessionStorage.getItem('client_access_token') != null && sessionStorage.getItem('client_access_token') !== '') {
    return sessionStorage.getItem('client_access_token')
  } else {
    return false
  }
}

function deepObjectMerge (FirstOBJ, SecondOBJ) { // 深度合并对象
  for (var key in SecondOBJ) {
    FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]' ? deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key]
  }
  return FirstOBJ
}
// 重写axios的post方法，修改默认header参数以及根据APILIST的authorization参数添加验证
async function axiosPost () {
  let baseConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  if (_.filter(APILIST, {
    name: arguments[0]
  }).length) {
    if (_.filter(APILIST, {
      name: arguments[0]
    })[0].authorization) { //
      //   let token = await getToken().then((rst) => {
      //     return rst
      //   })
      if (getToken()) {
        baseConfig.headers.Authorization = getToken()
      } else {
        vue.$dialog.toast({
          mes: '获取token失败/没有权限',
          timeout: 1000
        })
      }
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
// 重写axios的get方法，修改默认headers参数
async function axiosGet () {
  let baseConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  if (arguments.length === 1) {
    return $axios.get(arguments[0], baseConfig)
  }

  if (arguments.length === 2) {
    return $axios.get(arguments[0], deepObjectMerge(baseConfig, {
      params: arguments[1]
    }))
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
  if (process.env.NODE_ENV !== 'production') {
    this.config = DEV_CONF
  } else {
    this.config = PRO_CONF
  }
  if (url) {
    $axios.defaults.baseURL = url // 配置axios请求地址
  } else if (this.config.j_url) {
    $axios.defaults.baseURL = this.config.j_url // 配置axios请求地址
  } else {
    throw Error('请求api地址不能为空')
  }

  for (let apiCurr of APILIST) {
    // 挂载APILIST到api
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
  this.post = function () {
    return axiosPost.apply(this, arguments)
  }
  this.get = function () {
    return axiosGet.apply(this, arguments)
  }
  this.ext = {
    xijulist () {
      return axiosPost('/api/dianying/xiju')
    }
  }

  // 加载默认配置

  // 扩展
  // 加载所有common/api/extend目录下的组件
  const path = require('path')
  const contextExtend = require.context(
    '.', true, /\.\/extend\/(.*)\.js$/
  )
  contextExtend.keys().forEach(ele => {
    let _self = this
    this.ext[path.basename(ele, '.js')] = function () {
      return contextExtend(ele).default.apply(_self, arguments)
    }
  })
}

export default api
