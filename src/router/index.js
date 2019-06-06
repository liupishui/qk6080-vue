import Vue from 'vue'
import VueRouter from 'vue-router'
import _ from 'lodash'
// import Icons from '@/components/Icons'
const path = require('path')
    // const requireComponent = require.context(
    //   '../pages', true, /\.vue$/
    // )
const requireComponent = require.context(
    '../pages', true
)
let requireComponentKeys = requireComponent.keys()
const rootPath = '/vue/'
let componentsAll = {}
var routers = []
let maxDeepPath = ''
requireComponentKeys.forEach((v, k) => {
    // 获取所有组件
    // Vue.component(path.basename(v, '.vue').charAt(0).toUpperCase() + path.basename(v, '.vue').slice(1), componentConfig.default || componentConfig)
    if (v.split(path.sep).length > maxDeepPath.split(path.sep).length) {
        // 求最深路径
        maxDeepPath = v
    }
    if (path.extname(v) === '.vue') {
        let componentName = v.substr(1).replace(/\/\S{1}/g, function(v, k) { return v.charAt(1).toUpperCase() }).split('.')[0]
        let componentConfig = requireComponent(v)
        componentsAll[componentName] = componentConfig.default || componentConfig
    }
})
let pathsAll = []
for (let deep = 1; deep < maxDeepPath.split(path.sep).length; deep++) {
    let currentIndexPath = _.filter(requireComponentKeys, function(val) {
        return val.split(path.sep).length === deep + 1 && val.split(path.sep)[deep] !== ''
    })
    pathsAll.push(currentIndexPath)
        // currentIndexPath.forEach(element=>{
        //   if(path.extname(element)=='.vue'){//是vue文件的时候处理
        //     console.log(11)
        //   }else{//是文件夹的时候处理
        //     console.log(22)
        //   }
        // })
}

function routerAddChild(routers, path, component) {
    let hasAdd = false
    routers.forEach(element => {
        if (element.orgPath === path) {
            element.children.push(component)
            hasAdd = true
        }
    })
    if (hasAdd === false) {
        routers.forEach(element => {
            if (typeof(element.children) !== 'undefined') {
                routerAddChild(element.children, path, component)
            }
        })
    }
}
_.each(pathsAll, function(pathsCurr, index) {
        _.each(pathsCurr, function(pathCurr) {
            if (path.extname(pathCurr) === '.vue') {
                let componentName = pathCurr.substr(1).replace(/\/\S{1}/g, function(v, k) { return v.charAt(1).toUpperCase() }).split('.')[0]
                let componentConfig = require('@/' + path.join('./pages', pathCurr))
                let pathURL = (rootPath + pathCurr.substr(1).split('.')[0]).replace(/\/\//g, '/')
                    // 自定义参数开始
                if (pathURL === rootPath + 'play') {
                    pathURL = rootPath + 'play/:num'
                }

                if (pathURL === rootPath + 'manage/index') {
                    pathURL = rootPath + 'manage/index/:id'
                }
                // 自定义path参数结束
                let componentsAllCurr = {}
                Object.assign(componentsAllCurr, componentsAll)
                componentsAllCurr.default = componentConfig.default || componentConfig
                let routerCurr = {
                        path: pathURL,
                        orgPath: pathCurr,
                        name: componentName,
                        component: componentConfig.default || componentConfig,
                        components: componentsAllCurr,
                        children: [],
                        meta: (componentConfig.default && componentConfig.default.meta) || {}
                    }
                    // 查找最近的父级，找到附加routerCurr，找不到新增加一个routerCurr
                let findParent = '' // 查找到的父级
                let pathCurrArr = pathCurr.split(path.sep) // 当前路径拆为数组,一层层查找父级
                for (let indexFind = index; indexFind > 0; indexFind--) { // 循环查找是否有对应父级
                    pathCurrArr.splice(-1) // 每次删除最后一级
                        // console.log(indexFind, pathCurrArr, pathsAll[indexFind - 1])
                    if (findParent === '') {
                        let filterArr = _.filter(pathsAll[indexFind - 1], function(o) {
                            return o === pathCurrArr.join('/') + '.vue'
                        })
                        if (typeof(filterArr[0]) !== 'undefined') {
                            findParent = filterArr[0]
                        }
                    }
                }
                if (findParent !== '') {
                    // 如果找到父级
                    routerAddChild(routers, findParent, routerCurr)
                } else {
                    // 如果没找到到父级
                    routers.push(routerCurr)
                }
            }
        })
    })
    // console.log('25', '||', routers, maxDeepPath)
Vue.use(VueRouter)

// console.log({
//   mode: 'history',
//   linkActiveClass: 'yd-tabbar-active',
//   linkExactActiveClass: 'yd-tabbar-active',
//   routes: [{
//     path: rootPath,
//     name: 'index',
//     component: index
//   }, ...routers]
// })
let RouterExport = {
        mode: 'history',
        linkActiveClass: 'yd-tabbar-active',
        linkExactActiveClass: 'yd-tabbar-active',
        routes: [{
                path: '*',
                name: '404',
                redirect: '/vue/dianying/dianying'
            },
            {
                path: '',
                redirect: '/vue/dianying/dianying'
            },
            {
                path: '/',
                redirect: '/vue/dianying/dianying'
            },
            {
                path: '/vue',
                redirect: '/vue/dianying/dianying'
            },
            {
                path: '/vue/dianying',
                redirect: '/vue/dianying/dianying'
            },
            {
                path: '/vue/manage',
                redirect: '/vue/manage/index'
            },
            ...routers
        ]
    }
    // console.log(RouterExport.routes)
    // RouterExport.routes.forEach(element => {
    //   if (element.name) {
    //     console.log(element.name)
    //   }
    // })
RouterExport = new VueRouter(RouterExport)
export default RouterExport