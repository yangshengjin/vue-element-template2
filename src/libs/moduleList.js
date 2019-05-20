// import * as types from './module_types'
/* 输出各大模块的功能列表 */
// var authority = new authority("系统管理")
// 各大模块拥有的功能
/* 1.对应功能常量说明
   SEARCH=>"搜索",
   ADDEDIT=>"新增/修改",
   CONFIRM=>"确认",
   APPROVAL=>"审核"（通过/不通过）,
   USSTATUS=>"启用/停用",
   EXPORTS=>"导出",
   DELETE=>"删除"
 2.this.moduleList --- 功能列表数据格式为[
                         { "name": "route",
                           "id": 7,
                           operation: ['search', 'edit_add', 'review', 'using', 'exports']
                         },
                         {
                           "name": "plan_classes",
                           "id": 9,
                           operation: ['search', 'edit_add', 'review', 'using', 'exports']
                         }
                       ]
 * */
import $store from '@/store'
var moduleList = function(menus) {
  this.menus = $store.state ? $store.state.menus : menus
  this.role = 1 // $.cookie('appObj')
  this.moduleList = []

  // this.parseOperation = function (name) { // 返回对应模块的功能
  //   var operation = []
  //   switch (name) {
  //     case types.OM_INFO: operation.push('SEARCH', 'ADDEDIT', 'EXPORTS')
  //   }
  //   return operation
  // }
  var _this = this

  var resolMenus = []
  /* 解析完整菜单保存在 resolMenus数组里面 */
  this.menus.forEach(function(el) {
    el.parseName = el.url.replace('/', '')
    if (
      el.children !== undefined &&
      el.children !== '' &&
      el.children.length !== 0
    ) {
      el.children.forEach(function(el1) {
        el1.parseName = el1.url.replace('/', '')
        var obj = {
          id: el1.id,
          roleRefModuleId: el1.roleRefModuleId,
          name: el1.name,
          auths: el1.auths,
          sign: el1.url.replace('/', '')
        }
        if (
          el1.children !== undefined &&
          el1.children !== '' &&
          el1.children.length !== 0
        ) {
          el1.children.forEach(function(el2) {
            el2.parseName = el2.url.replace('/', '')
            var obj = {
              id: el2.id,
              roleRefModuleId: el2.roleRefModuleId,
              name: el2.name,
              auths: el2.auths,
              sign: el2.url.replace('/', '')
            } // 保存id // 保存名字 // 保存权限
            resolMenus.push(obj)
          })
        } else {
          resolMenus.push(obj)
        }
      })
    } else {
      var obj = {
        id: el.id,
        roleRefModuleId: el.roleRefModuleId,
        name: el.name,
        auths: el.auths,
        sign: el.url.replace('/', '')
      }
      resolMenus.push(obj)
    }
  })
  /* 解析完整菜单对应功能权限保存在 authsMenus数组里面 */
  this.authsMenus = []
  // 默认展示有权限的菜单
  this.defaultCheckedKeys = []
  // 保存初始菜单模块权限数据
  this.initAuths = resolMenus
  resolMenus.forEach(function(el) {
    var obj = {}
    obj.id = el.id
    obj.roleRefModuleId = el.roleRefModuleId
    obj.name = el.sign
    // obj.operation = _this.parseOperation(obj.name)
    obj.auths = []
    if (typeof el.auths === 'string') {
      obj.auths = el.auths.split('_')
    }
    _this.authsMenus.push(obj)
    if (obj.auths.length > 0) {
      _this.defaultCheckedKeys.push(el.id)
    }
  })
}
export default moduleList
