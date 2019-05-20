import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Layout = resolve => require(['@/layout'], resolve)

const Index = resolve => require(['@/views/common/Index.vue'], resolve)
const Login = resolve => require(['@/views/common/Login.vue'], resolve)

const errorPage401 = resolve => require(['@/views/errorPage/401.vue'], resolve)
const errorPage404 = resolve => require(['@/views/errorPage/404.vue'], resolve)

/* Router Modules */
import moduleRouter from './modules/module-one'
export default new Router({
  routes: [
    {
      path: '/',
      name: '主页',
      meta: { isConstant: true },
      children: [
        {
          path: '/index',
          name: '首页',
          component: Index,
          meta: { isConstant: true }
        }
      ],
      component: Layout
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    moduleRouter,
    {
      path: '/error',
      component: Layout,
      redirect: 'noredirect',
      name: '错误页面',
      icon: '404',
      children: [
        {
          path: '/401',
          component: errorPage401,
          name: '401',
          meta: { isConstant: true }
        },
        {
          path: '/404',
          component: errorPage404,
          name: '404',
          meta: { isConstant: true }
        }
      ]
    },
    { path: '*', redirect: '/404', hidden: true }
  ]
})
