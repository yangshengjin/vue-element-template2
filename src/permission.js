import router from './router'
import store from './store'
router.beforeEach((to, from, next) => {
  // 检查是否登录
  let UserInfo = store.state.responseData.UserInfo
  if (UserInfo === null || UserInfo === undefined || !UserInfo.name) {
    if (to.path !== '/login') {
      next({ path: '/login' })
    }
  } else if (to.path === '/login' || to.path === '/') {
    next('/index')
  }
  next()
})

router.afterEach(() => {})
