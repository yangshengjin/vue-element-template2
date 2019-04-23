<!-- 表格组件http://element-cn.eleme.io/1.4/#/zh-CN/component/table
@prop: tableHeader 自定义表头数据
@prop: tableData 显示的数据
@prop: pagingTotal 总页数 为 -1 时不分页
@prop: editPanel 是否显示编辑或操作面板
@prop: Selection 是否显示多选按钮
@prop: highlightCurrentRow 是否支持单选高亮显示当前行
@prop: max-height 表格最大高度
@prop: pageid 当前页码
@prop: row-class-name 为 Table 中的某一行添加 class，表明该行处于某种状态
@prop: radio-selection 多选按钮变单选
@prop: page-size 每页最多显示多少条数据
@prop: sortable 对应列是否可以排序
@prop: del-button 是否显示删除按钮

@event: handleSelectionChange 多选时当选择项发生变化时会触发该事件
@event: handleCurrentChange 分页时页码发生变化时触发
@event: editRow 点击编辑按钮时触发
@event: handleCurrentRowChange 当表格的当前行发生变化的时候会触发该事件
@event: rowClick 当某一行被点击时会触发该事件
@event: row-dblclick 当某一行被双击时会触发该事件
@event: del-row  点击删除按钮时触发，接收参数：delRow(row,index)

@ps: <m-table :pageid="filters.pageid" :tableHeader="tableHeader" :tableData="tableData" @handleCurrentChange="handleCurrentChange" @handleSelectionChange="handleSelectionChange" :pagingTotal="pagingTotal" :editPanel="false">
      //<template solt="temp" scope="props"> 
        //<span v-if="props.prop === 'ticketDate'">{{props.scope.row[props.prop] | formatDate}}</span>
      //</template>
    </m-table>
1.去掉v-loading="tableLoading"
-->
<template>
  <div>
    <!--列表-->
    <el-table @row-dblclick="rowDblclick" @row-click="rowClick" ref="multipleTable" :row-class-name="rowClassName" :max-height="maxHeight" :data="tableData" border style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange" :highlight-current-row="highlightCurrentRowRef" @current-change="handleCurrentRowChange">
      <el-table-column type="selection" width="40" v-if="showSelection"></el-table-column>

      <el-table-column label="操作" width="50" v-if="showEditPanel">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>

      <el-table-column :sortable="sortable" v-for="el in newTableHeader" :key="el.prop" :type="el.type" :prop="el.prop" :label="el.label" :width="el.width">
        <template slot-scope="scope" name="temp">
          <span v-if="el.type">{{scope.$index + 1}}</span>
          <span v-if="!el.scope">{{scope.row[el.prop]}}</span>
          <slot :scope="scope" :prop="el.prop" :show="el.scope"></slot>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-col v-show="pagingTotal >= 0" :span="24" class="pagina-toolbar">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="jumper,total, prev, pager, next" :total="pagingTotal" style="float:right;"></el-pagination>
    </el-col>

    <!--不分页-->
    <el-col v-show="pagingTotal === -1" :span="24" class="pagina-toolbar">
      <div style="text-align: right;padding-right: 10px">共 {{tableData.length}} 条</div>
    </el-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
var maxHeight = window.innerHeight - 250 // 280
export default {
  name: 'cm-table',
  // ['tableHeader', 'tableData', 'pagingTotal', 'editPanel', 'Selection'],
  props: {
    /*
     * 自定义表头数据
     */
    tableHeader: {
      default: () => [],
      type: Array
    },
    /*
     * 表格数据，主要从数据接口拿来渲染
     */
    tableData: {
      default: () => [],
      type: Array
    },
    /*
     * 分页时用到的总页数
     */
    pagingTotal: {
      default: 0,
      type: Number
    },
    /*
     * 是否显示编辑或操作面板
     */
    editPanel: {
      default: true,
      type: Boolean
    },
    /*
     * 是否显示多选按钮
     */
    Selection: {
      default: true,
      type: Boolean
    },
    // 是否支持单选
    highlightCurrentRow: {
      default: false,
      type: Boolean
    },
    // 最大高度
    'max-height': {
      default: maxHeight,
      type: Number
    },
    // 当前页码
    'pageid': {
      type: Number,
      default: 1
    },
    // 为 Table 中的某一行添加 class，表明该行处于某种状态
    'row-class-name': {
      type: [String, Function],
      default: ''
    },
    // 多选按钮变单选
    'radio-selection': {
      type: Boolean,
      default: false
    },
    // 每页最多显示多少条数据
    'page-size': {
      type: Number,
      default: 15
    },
    // 对应列是否可以排序
    'sortable': {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showEditPanel: true,
      showSelection: true,
      highlightCurrentRowRef: false,
      filters: {
        region: '',
        name: ''
      },
      multipleSelection: [],
      currentPage: 1
    }
  },
  computed: {
    tableLoading () {
      return this.$store.state.comm.tableLoading
    },
    ...mapGetters([
      'UserInfo'
    ]),
    newTableHeader () {
      // 判断是否需要展示主营车队列
      return this.tableHeader.filter(el => {
        if ((el.prop === 'mainBusPartner' || el.prop === 'mainBusPartnerCode' || el.prop === 'mainBusPartnerName') && this.UserInfo.appObj !== 1) {
          el = null
        } else {
          return el
        }
      })
    }
  },
  watch: {
    'pageid' (e) {
      this.currentPage = e
    }
  },
  methods: {
    // 点击多选按钮
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', this.multipleSelection)
    },
    handleClick () {
      console.log(1)
    },
    handleSizeChange (val) {
      console.log(val)
    },
    handleCurrentChange (val) {  // 点击页码时触发
      this.currentPage = val
      this.$emit('handleCurrentChange', val)
    },
    /**
     *  @description 点击编辑按钮 (修改，已适应排序后的数据的处理)
     *  @augments i 行数据的索引
     *  @augments data 行数据
     *  @author ysj
     *  @datetime 2018-03-19 17:25
     */
    editRow (i, data) {
      this.$emit('editRow', 0, [data])
    },
    // 当表格的当前行发生变化的时候会触发该事件
    handleCurrentRowChange (currentRow) {
      if (currentRow !== null) {
        var key = 0
        this.tableData.forEach((el, index) => {
          if (el.id === currentRow.id) {
            key = index
          }
        })
        if (this.radioSelection) {
          setTimeout(() => {
            this.toggleSelection(currentRow)
          }, 100)
        }
        this.$emit('handleCurrentRowChange', currentRow, key)
      }
    },
    // 后期为排班而增加的，自动取消选择多选按钮
    toggleSelection (row) {
      if (row) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(row)
      }
    },
    // 点击每一行触发
    rowClick (row) {
      var key = 0
      this.tableData.forEach((el, index) => {
        if (el.id === row.id) {
          key = index
        }
      })
      this.$emit('row-click', row, key)
    },
    // 双击某一行触发
    rowDblclick (row) {
      this.$emit('row-dblclick', row)
    }
  },
  created () {
    this.highlightCurrentRowRef = this.highlightCurrentRow
    if (this.editPanel === undefined) {
      this.showEditPanel = true
    } else {
      this.showEditPanel = this.editPanel
    }
    if (this.Selection === undefined) {
      this.showSelection = true
    } else {
      this.showSelection = this.Selection
    }
  }
}
</script>

<style>
.el-table .cell,
.el-table th > div {
  padding-left: 4px;
  padding-right: 4px;
}
.pagina-toolbar {
  padding: 5px 0;
}
.el-table th > .cell {
  line-height: 1; /*20px;*/
}
.el-table td,
.el-table th {
  height: 32px;
  padding: 3px 0;
}
.u-icon-suc {
  font-size: 16px;
  color: #13ce66;
}
.u-icon-err {
  font-size: 16px;
  color: #ff4949;
}
.el-table .error-row {
  background: #a5a5a5;
}
.el-table .error-row-text {
  color: red;
}
.el-table .error-row-text .u-props {
  color: red;
}
.el-table__body tr.current-row > td {
  background: #f9af00;
}
.el-table .even-row {
  background: #f3f3f3;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ffe7ae;
}
.el-table .success-row {
  background: #67c23a;
}
</style>
