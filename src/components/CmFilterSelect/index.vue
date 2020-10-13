<!--封装下拉组件，可过滤筛选
#参数
@prop value   可通过v-model绑定的数据
@prop options  下拉数据源
@prop disabled 是否禁用
@prop first-option-id 首选项的value值
@prop first-option 是否含有首选项，默认有
@prop parent-index 父组件遍历该组件时可用到，接收该组件在父组件的索引
@prop selected-highlight 选中值时是否高亮选中框。
@prop disabled-option 是否开启禁用子选项
@prop multiple 启用多选
@prop clearable 单选状态下有清空按钮
@prop option-label 选项的key
@prop value-type 下拉选取的值： 1: 取id  2:取name

#事件
@event on-change 选中值发生变化时触发。  回调参数：选中的条目对象
#父组件调用示例：
<cm-filter-select v-model="model.driver1Id" :options="driverOptions"></cm-filter-select>
-->
<template>
  <div :class="selectId !== firstOptionId && selectedHighlight &&'el-form-item__content_danger'">
    <el-select :clearable="Boolean(selectId&&clearable)" v-model="selectId" placeholder="请选择" @change="onChange" :disabled="disabled" filterable :default-first-option="true" :multiple="multiple" @clear="selectId=firstOptionId" @visible-change="visibleChange">
      <el-option v-if="firstOption" label="请选择" :value="firstOptionId"></el-option>
      <el-option :label="el[optionLabel]" :value="el[valueType]" v-for="el in options" :key="el[valueType]" :disabled="disabledOption && el.disabled">
        <slot :el="el"></slot>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'cm-filter-select',
  props: {
    value: [Number, Array, String],
    /*
     格式 options: [{id: 0, name: ''}]
    */
    options: {
      type: [Array],
      default: () => []
    },
    disabled: {
      type: [Boolean],
      default: false
    },
    'first-option-id': {
      type: [Number, String],
      default: -1
    },
    'first-option': {
      type: [Boolean],
      default: true
    },
    'option-label': {
      type: [String],
      default: 'name'
    },
    'parent-index': {
      type: [Number],
      default: 0
    },
    'selected-highlight': {
      type: [Boolean],
      default: false
    },
    'disabled-option': {
      type: [Boolean],
      default: false
    },
    multiple: {
      type: [Boolean],
      default: false
    },
    clearable: {
      type: [Boolean],
      default: true
    },
    'value-type': {
      type: [String, Number],
      default: 'id'
    }
  },
  data () {
    return {
      selectId: -1
    }
  },
  computed: {
  },
  methods: {
    onChange () {
      if (!this.selectId) {
        this.selectId = this.firstOptionId
        this.$emit('input', this.selectId)
        this.$emit('on-change', null, this.parentIndex)
      }else {
        this.$emit('input', this.selectId)
        let model = null
        this.options.forEach(el => {
          if (el[this.valueType] === this.selectId) {
            model = el
          }
        })
        this.$emit('on-change', model, this.parentIndex)
      }
    },
    visibleChange (visible) {
      this.$emit('visible-change', visible, this.parentIndex)
    }
  },
  watch: {
    'value' (e) {
      this.selectId = e
    }
  },
  created () {
    this.selectId = this.value
    if (this.selectId) {
      let model = null
      this.options.forEach((el) => {
        if (el[this.valueType] === this.selectId) {
          model = el
        }
      })
      this.$emit('on-change', model, this.parentIndex)
    }
  }
}
</script>

<style>
.el-select .el-input .el-input__icon.is-show-close {
  color: #324157;
}

.el-select .el-input .el-input__icon.is-show-close:hover {
  color: #324157;
}
</style>
