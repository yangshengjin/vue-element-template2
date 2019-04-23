import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import getters from './getters'
Vue.use(Vuex)
// 获取菜单
let menus = window.localStorage.getItem('menus')
// 获取用户信息
let UserInfo = localStorage.getItem('UserInfo')
try {
  menus = JSON.parse(menus)
  UserInfo = JSON.parse(UserInfo)
} catch (error) {
  console.log(JSON.stringify(error))
  menus = []
  UserInfo = {}
}
/**
 **拿本地菜单(测试供测试使用，请不要随意打开)
 */
menus = require('../libs/menus').default

// 应用初始状态
const state = {
  comm: {
    tableLoading: false,
    tabSelected: 'Home',
    indexConf: {
      isFooter: true,
      isBack: true,
      title: '' // 标题
    },
    Authority: null
  },
  menus: menus, // 存储菜单数据
  responseData: {
    // 服务端接口返回的数据保存在这里
    UserInfo: UserInfo
  }
}

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', false, /\.js$/)
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules
})
