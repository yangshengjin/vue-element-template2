<template>
  <div>
    <el-dialog v-el-drag-dialog :title="title" :visible.sync="status" :width="realWidth" :show-close="showClose" :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape">
      <template slot="title">
        <span class="el-dialog__title">{{ title }}</span>
        <slot name="title"></slot>
      </template>
      <slot></slot>
      <template slot="footer">
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog'
export default {
  directives: {
    elDragDialog
  },
  name: 'cm-dialog',
  props: {
    value: [String, Boolean, Number],
    title: {
      type: [String, Number],
      default: ''
    },
    'close-on-click-modal': {
      type: Boolean,
      default: false
    },
    'width': {
      type: String,
      default: '50%'
    },
    'close-on-press-escape': {
      type: Boolean,
      default: true
    },
    'show-close': {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      realWidth: '50%',
      status: false
    }
  },
  watch: {
    'status' (e) {
      this.$emit('input', e)
    },
    'value' (e) {
      this.status = e
    }
  },
  created () {
    this.status = this.value
    if (this.$store.state.app.device === 'mobile') {
      this.realWidth = '90%'
    } else {
      this.realWidth = this.width
    }
  }
}
</script>
<style>
.el-dialog__footer {
  text-align: center;
}
</style>
