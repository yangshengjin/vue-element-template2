import Vue from 'vue'
import './plugins/element.js'

import App from './App.vue'
import router from './router'
import './permission' // permission control
import store from './store'
import '@/styles/base.scss' // global css
Vue.config.productionTip = false

// 注册全局mixins
import mixins from './mixins'
Vue.mixin(mixins)
// 实例化Vue的filter
import * as filters from './filters'
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// 业务API -> 封装成全局变量
Object.defineProperty(Vue.prototype, '$commonApi', {
  value: require('./api/common')
})

// 自定义指令
import onlyNum from './directive/onlyNum'
Vue.use(onlyNum)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
