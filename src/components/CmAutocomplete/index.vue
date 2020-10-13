
<!--
<cm-autocomplete v-model="model.driver1Id" :options="driverOptions"></cm-autocomplete>
-->
<style lang="scss">
.cm-autocomplete {
  // width: auto !important;
  z-index: 9999 !important;
  li {
    line-height: normal;
    padding: 7px;
    // width: 140px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>

<template>
  <el-autocomplete :popper-class="['cm-autocomplete', popperClass]" :class="className" v-model.trim="selectedValue" :trigger-on-focus="triggerOnFocus" @click.native="handleIconClick" :props="{ label: optionLabel, value: optionValue }" :fetch-suggestions="querySearch" @select="handleSelect" icon="search" :on-icon-click="handleIconClick" @change="handleChangeInput">
    <template slot-scope="{ item }">
      <slot v-bind="{ item }"></slot>
    </template>
  </el-autocomplete>
</template>
<script>
export default {
  name: 'cm-autocomplete',
  props: {
    value: [Number, String],
    /*
     格式 options: [{id: 0, name: ''}]
    */
    options: {
      type: [Array],
      default: () => []
    },
    optionLabel: {
      type: [String],
      default: 'name'
    },
    optionValue: {
      type: [String],
      default: 'name'
    },
    triggerOnFocus: {
      type: [Boolean],
      default: true
    },
    isReturnAll: {
      type: [Boolean],
      default: false
    },
    popperClass: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      className: 'autocomplete1',
      restaurants: [],
      selectedValue: ''
    }
  },
  methods: {
    querySearch (queryString, cb) {
      queryString = queryString + ''
      var restaurants = this.restaurants
      var results = queryString && !this.isReturnAll ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant[this.optionValue].toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect (item) {
      this.$emit('input', item[this.optionValue])
      this.$emit('on-change', item)
    },
    handleChangeInput (item) {
      this.$emit('on-change', item)
    },
    // 点击图标触发
    handleIconClick () {
      document.querySelector(`.${this.className} input`).focus()
      document.querySelector(`.${this.className} input`).selectionStart = 0
      document.querySelector(`.${this.className} input`).selectionEnd = this.selectedValue ? String(this.selectedValue).length : 0
      // console.log(ev)
    },
    gengerateID () {
      let nonstr = Math.random().toString(36).substring(3, 8)
      if (!document.getElementById(nonstr)) {
        return 'autocomplete' + nonstr
      } else {
        return this.gengerateID()
      }
    }
  },
  watch: {
    'value' (e) {
      this.selectedValue = e
    },
    'selectedValue' (e) {
      this.$emit('input', e)
      // this.$emit('on-change', e)
    },
    'options' () {
      this.restaurants = this.options
    }
  },
  mounted () {
    this.restaurants = this.options
    this.selectedValue = this.value
  },
  created () {
    this.className = this.gengerateID()
  }
}
</script>
