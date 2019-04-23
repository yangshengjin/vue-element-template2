<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 左部菜单 -->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <!--头部工具-->
      <navbar/>
      <!--tag标签-->
      <tags-view v-if="device!=='mobile'"/>
      <!--中部内容-->
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Sidebar, Navbar, TagsView, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
export default {
  mixins: [ResizeMixin],
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain
  },
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  },
  created () {
    this.currentPath = this.$route.path
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
