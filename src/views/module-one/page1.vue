<template>
  <!--  车辆列表   -->
  <div>
    <!--工具条-->
    <el-form class="m-form-inline" :inline="true" :model="filters" :label-position="'right'" label-width="70px">
      <el-col :span="24" class="toolbar">
        <el-form-item label="车牌号">
          <el-input v-model="filters.params.plateNum"></el-input>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="filters.params.gpsNum"></el-input>
        </el-form-item>
        <el-form-item label="当前状态" label-width="70px">
          <el-select v-model="filters.params.status">
            <el-option label="全部" :value="-1"></el-option>
            <el-option :label="el.name" :value="el.id" v-for="el in statusOptions" :key="el.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="24" style="padding-left: 10px">
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="usStatus('using')">启用</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="usStatus('notusing')">停用</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="del">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exports">导出</el-button>
        </el-form-item>
      </el-col>
    </el-form>

    <!-- 列表 -->
    <m-table :tableHeader="tableHeader" :tableData="tableData" @handleCurrentChange="handleCurrentChange" @handleSelectionChange="handleSelectionChange" @editRow="editRow" :pagingTotal="pagingTotal">
      <template solt="temp" slot-scope="props">
        <span v-if="props.prop === 'status'">{{props.scope.row[props.prop] | getUStatusDesc}}</span>
        <span v-if="props.prop === 'endTime'">{{props.scope.row[props.prop] | formatDate}}</span>
      </template>
    </m-table>

    <vehicle-form :formModel="formModel" v-if="dialogVisible.status" :dialogFormVisible="dialogVisible" @success="submitForm"></vehicle-form>
  </div>
</template>

<script>
import mTable from '@/components/CmTable'
import vehicleForm from './dialog/vehicle-form'
export default {
  name: 'Page1',
  components: {
    mTable,
    vehicleForm
  },
  data () {
    return {
      filters: {
        pageid: 1,
        params: {
          mainBusPartnerId: 2,
          busPartnerId: -1,
          plateNum: '',
          gpsNum: '',
          status: -1
        }
      },
      tableHeader: [
        { label: '序号', width: '60', prop: '', type: 'index' },
        { label: '主营车队编号', width: '', prop: 'mainBusPartnerCode' },
        { label: '主营车队名称', width: '', prop: 'mainBusPartnerName' },
        { label: '下属车队编号', width: '120', prop: 'busPartnerCode' },
        { label: '下属车队简称', width: '160', prop: 'busPartnerShortName' },
        { label: '车牌号', width: '', prop: 'plateNum' },
        { label: '核定座位数', width: '', prop: 'seatNum' },
        { label: '售票座位数', width: '', prop: 'ticketNum' },
        { label: '驾驶资格要求', width: '', prop: 'drivingQualification' },
        { label: '营运范围', width: '', prop: 'operationRangeName' },
        { label: '营运单位', width: '180', prop: 'operationDeptName' },
        { label: '结算单位', width: '180', prop: 'checkUnitName' },
        { label: 'GPS设备编号', width: '', prop: 'gpsNum' },
        { label: '车辆购置日期', width: '100', prop: 'purchaseTime' },
        { label: '车辆属性', width: '', prop: 'propertyName' },
        { label: '车型', width: '', prop: 'busTypeName' },
        { label: '状态', width: '', prop: 'status', scope: true },
        { label: '启用时间', width: '100', prop: 'startTime' },
        { label: '停运时间', width: '100', prop: 'endTime', scope: true },
        { label: '修改时间', width: '160', prop: 'updatetime' },
        { label: '操作人', width: '160', prop: 'managerName' }
      ],
      formModel: { id: 0 },
      ids: [],
      tableData: [],
      pagingTotal: 0
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.ids = []
      if (val.length > 0) {
        val.forEach(el => {
          this.ids.push(el.id)
        })
      }
    },
    search () { // 查询
      this.$commonApi.QueryBusInfo(this.filters).then(res => {
        if (res.list instanceof Array) {
          this.tableData = res.list
          this.pagingTotal = res.count
        } else {
          this.tableData = []
          this.pagingTotal = 0
        }
      })
    },
    add () { // 打开新增窗口
      this.formModel = {
        id: 0
      }
      this.dialogVisible.status = true
    },
    editRow (i, data) { // 打开修改窗口
      this.formModel = data[i]
      this.dialogVisible.status = true
    },
    handleCurrentChange (val) {  // 点击页码时触发
      this.filters.pageid = val
      this.search()
    },
    submitForm () {
      this.dialogVisible.status = false
      this.search()
    },
    // 删除
    del () {
      if (this.ids.length === 0) {
        this.showInfo('请选择一项后操作')
      } else {
        const _this = this
        const parasm = {
          ids: this.ids
        }
        this.showConfirm('确定删除该数据', function () {
          _this.base.DeleteBusInfo(parasm).then(res => {
            if (res.status === 1) {
              _this.showSuccess('删除成功')
              _this.search()
            } else {
              _this.showError('删除失败')
            }
          })
        })
      }
    },
    usStatus (type) { // 启用停用
      const status = type === 'using' ? 1 : 0
      const desc = type === 'using' ? '启用' : '停用'
      if (this.ids.length === 0) {
        this.showInfo('请选择一项后操作')
      } else {
        const _this = this
        const params = {
          status: status,
          ids: this.ids
        }
        this.showConfirm(`确定${desc}该项`, function () {
          _this.base.StatusBusInfo(params).then(res => {
            if (res.status === 1) {
              _this.showSuccess('操作成功')
              _this.search()
            } else {
              _this.showError('操作失败')
            }
          })
        })
      }
    },
    exports () { // 导出
    }
  },
  created () {
    this.search()
  }
}
</script>
