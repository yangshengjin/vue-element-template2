<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu :default-active="$route.path" router mode="vertical" :collapse="isCollapse" :show-timeout="200" :default-openeds="defaultOpeneds" :background-color="variables.menuBg" :text-color="variables.menuText" :active-text-color="variables.menuActiveText">
      <template v-for="nav in menus">
        <el-submenu :index="nav.id+''" :key="nav.id" v-if="nav.children" popper-append-to-body>
          <template slot="title">
            <i :class="nav.icon"></i>
            <span slot="title">{{nav.name}}</span>
          </template>
          <div class="nest-menu">
            <template v-for="child in nav.children">
              <el-menu-item v-if="!child.children" :index="child.url" :key="child.id">
                <span>{{child.name}}</span>
              </el-menu-item>
              <el-submenu :index="child.id+''" v-if="child.children" :key="child.id" popper-append-to-body>
                <template slot="title">
                  <span slot="title">{{child.name}}</span>
                </template>
                <el-menu-item v-for="subchild in child.children" :key="subchild.id" :index="subchild.url">
                  <span>{{subchild.name}}</span>
                </el-menu-item>
              </el-submenu>
            </template>
          </div>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
export default {
  data () {
    return {
      defaultOpeneds: [],
      transform: true
    }
  },
  computed: {
    ...mapGetters([
      'menus',
      'sidebar'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    },
    variables () {
      return variables
    }
  },
  methods: {
    // 展开菜单
    openMenus () {
      this.defaultOpeneds = []
      this.menus.forEach((el) => {
        this.defaultOpeneds.push(el.id + '')
      })
    },
    // 折叠菜单
    packupMenus () {
      this.defaultOpeneds = []
    },
    cuttleClick () {
      this.transform = false
    }
  },
  created () {
    this.openMenus()
  }
}
</script>

<style scoped lang="scss">
</style>
