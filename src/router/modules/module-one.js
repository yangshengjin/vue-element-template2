/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const moduleRouter = {
  path: '/module',
  component: Layout,
  name: '基本信息',
  iconCls: '',
  children: [
    {
      path: '/page1',
      component: resolve => require(['@/views/module-one/page1.vue'], resolve),
      name: 'Page1'
    },
    {
      path: '/page2',
      component: resolve => require(['@/views/module-one/page2.vue'], resolve),
      name: 'Page2'
    }
  ]
}

export default moduleRouter
