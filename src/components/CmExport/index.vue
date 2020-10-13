<!-- 数据导出组件
@prop exVisible: {
  path: '路径'
  reqData: '导出时需要传的参数',
  show: '导出组件是否显示的状态'
}

@ps: <cm-export :exVisible="exVisible"></cm-export>
-->
<template>
  <div>
    <cm-dialog title="导出类型" width="400px" v-model="exVisible.show">
      <p>
        <el-button type="primary" @click="tapExport(1)">导出当前页</el-button>
        <el-button type="primary" @click="tapExport(0)">导出全部</el-button>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exVisible.show = false">取消</el-button>
      </span>
    </cm-dialog>
  </div>
</template>

<script>
import CmDialog from '../CmDialog'
export default {
  components: { CmDialog },
  name: 'cm-export',
  /**
   * @params {Object} exVisible -包含三个属性如下
   * exVisible: {
   *   path: '路径'
   *   reqData: '导出时需要传的参数',
   *   show: '导出组件是否显示的状态'
   * }
   * */
  props: ['exVisible', 'totalTableCount'],
  methods: {
    tapExport (type) {
      let reqData = this._getModel(this.exVisible.reqData)
      if (type !== 1) {
        reqData.pageid = -1 // 导出全部时的pageid
        if (this.totalTableCount > 65000) {
          this.showAlert('导出的数据超过65000,Excel表不支持加载这么多条数据！请分批导出')
          return
        }
      }
      var data = { data: reqData }
      data = JSON.stringify(data)
      data = encodeURI(data)
      var src = '/' + this.exVisible.path + '?data=' + data
      window.open(src)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
