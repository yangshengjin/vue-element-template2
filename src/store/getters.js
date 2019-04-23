const getters = {
  // 用户信息
  UserInfo: state => state.responseData.UserInfo,
  // 菜单
  menus: state => state.menus,
  sidebar: state => state.app.sidebar
}
export default getters
