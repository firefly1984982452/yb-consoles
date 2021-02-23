<template>
  <div>
    <el-form :inline="true" label-width="70px">
      <div class="search">
        <div class="top">
          <div class="left">
            <el-form-item label="帐单月">
              <el-date-picker type="month" v-model="tag1billTitle" value-format="yyyy-MM" size="mini" placeholder="选择日期" class="incls"></el-date-picker>
            </el-form-item>
            <el-form-item label="收款时间">
              <el-date-picker type="date" v-model="tag1payTime" value-format="yyyy-MM-dd" size="mini" placeholder="请选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="账单状态">
              <el-select v-model="tag1status" clearable placeholder="请选择">
                <el-option label="待审核" value="0"></el-option>
                <el-option label="待收款" value="1"></el-option>
                <el-option label="已收款" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="长者姓名">
              <ub-elder v-model="elderId" @change='item => elderName = item.elderName' clearable></ub-elder>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchFn" style="background-color:#2368D3;">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
          </div>
          <div class="contral">
            <span class="seniorFibler iconfont iconjichutubiao-shaixuan" :class="senior?'yellow':'block'" @click="senior=!senior">
              <span :class="senior?'yellow':'block'">高级筛选</span>
              <i :class="[senior?'el-icon-arrow-up':'el-icon-arrow-down',senior?'yellow':'block']"></i>
            </span>
          </div>
        </div>
        <div v-if="senior" style="margin-top:20px;">

          <el-form-item label="护理区域">
            <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
          </el-form-item>
          <el-form-item label="房间号">
            <el-select filterable v-model="search.roomName" placeholder="请选择房间号">
              <el-option :label="item.roomName" :value="item.roomName" v-for="item in roomList" :key="item.roomId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="护理等级">
            <el-select v-model="tag1Level" clearable placeholder="请选择">
              <el-option v-for="(item,index) in levels" :key="index" :label="item.title" :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账单类型">
            <el-select v-model="billType" clearable size="mini" placeholder="请选择">
              <el-option v-for="(value,key) in billTypes" :key="key" :value="key" :label="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账单编号">
            <el-input placeholder="请输入账单编号" v-model="billNo"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div class="content">
      <ul class="title">
        <el-button @click="mulPrint" type="primary">批量打印</el-button>
        <el-button @click="MonthBill" type="primary" v-show="permissionGenerate">生成账单</el-button>
      </ul>
      <el-table :data="data" @selection-change="handleSelectionChange" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="billNo" label="账单编号" align="center" width="160"></el-table-column>
        <el-table-column prop="billType" label="账单类型" align="center" width="100" :formatter="billTypeValue"></el-table-column>
        <el-table-column prop="elderName" label="长者姓名" align="center"></el-table-column>
        <el-table-column label="房间床位" align="center">
          <template slot-scope="scope">
            {{scope.row.roomName +'-' + scope.row.bedName }}
          </template>
        </el-table-column>
        <el-table-column label="护理等级" align="center">
          <template slot-scope="scope">
            护理{{scope.row.nursingLevel | filterLevel }}级
          </template>
        </el-table-column>
        <el-table-column prop="billTitle" label="帐单月" align="center" width="100"></el-table-column>
        <el-table-column prop="receivableAmount" label="应收金额(元)" align="center" width="120"></el-table-column>
        <el-table-column prop="totalAmount" label="实收金额(元)" align="center" width="120"></el-table-column>
        <el-table-column prop="auditorName" label="审核人" align="center"></el-table-column>
        <el-table-column prop="auditTime" label="审核时间" align="center" width="150"></el-table-column>
        <el-table-column prop="payeeName" label="收款人" align="center"></el-table-column>
        <el-table-column prop="payTime" label="收款时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{scope.row.status==0?'待审核':scope.row.status==1?'待收款':'已收款 '}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击审核" placement="top" v-show="scope.row.status==0">
              <el-button icon="iconfont iconcaozuotubiao-shenhe" @click="topeddingdetail(scope.row.billId)" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消审核" placement="top" v-show="scope.row.status==1 && permissionUncheck">
              <el-button icon="iconfont iconcaozuotubiao-quxiaoshenhe3x" @click="cancelCheck(scope.row.billId)" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="点击收款" placement="top" v-show="scope.row.status==1 && permissionPay">
              <el-button icon="iconfont iconcaozuotubiao-shoufei-zhengchang" @click="topeddingdetail(scope.row.billId)" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消收款" placement="top" v-show="scope.row.status==3 && permissionUnpay">
              <el-button icon="iconfont iconcaozuotubiao-quxiaoshoukuan3x" @click="cancelReceive(scope.row.billId)" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
              <el-button icon="iconfont iconcaozuotubiao-chakan" @click="alreadydetail(scope.row.billId)" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="打印" placement="top">
              <el-button icon="iconfont iconcaozuotubiao-dayin" size="mini" @click="print(scope.row.billId)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" :current-page="pageIndex" @current-change="handleChange" @size-change="handleSizeChange" :pager-count="11" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog title="账单收款" :visible.sync="resolvedialogVisible" class="resolveform" center="true" width="400px">
      <el-form label-width="75px">
        <el-form-item label="姓名">
          {{resolveDetail.elderName}} {{resolveDetail.buildingName}} {{resolveDetail.roomName}}-{{resolveDetail.bedName}}
        </el-form-item>
        <el-form-item label="帐单月">
          {{resolveDetail.billTitle}}
        </el-form-item>
        <el-form-item label="账单编号">
          {{resolveDetail.billNo}}
        </el-form-item>
        <el-form-item label="应收金额" class="prespace">{{resolveDetail.receivableAmount}}元</el-form-item>
        <el-form-item label="实收金额" class="reaspace">{{resolveDetail.receivableAmount}}元</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Receive">收款</el-button>
        <el-button @click="resolvedialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ubElder from "@/components/elder";
import { permission } from "youban-utils";

const billTypes = {
  // 1: '预定房间',
  2: '入院缴费',
  3: '月度结算',
  4: '离院结算',
}

export default {
  components: { ubElder },
  data() {
    return {
      setArea: '',
      levels: [],
      roomList: [],
      elderId: '',
      senior: false,   //是否显示高级搜索
      data: [],
      resolvedialogVisible: false,

      total: 0,
      pageIndex: 1,
      pageSize: 20,

      tag1billTitle: "",
      tag1payTime: "",
      tag1status: "",
      tag1Level: "",
      search: {
        roomName: '',
        area: ''
      },
      elderName: "",

      buildSelect: '',
      buildingOption: [],
      fllorSelect: '',
      floorsOption: [],
      roomSelect: '',
      roomsOption: [],
      billNo: '',
      multipleSelection: [],
      resolveDetail: {},
      permissionGenerate: false, // 手动生成月度账单
      permissionCheck: false, // 月度账单审核
      permissionUncheck: false, // 月度账单取消审核
      permissionPay: false, // 月度账单收款
      permissionUnpay: false, // 月度账单取消收款
      billType: '',
      billTypes: billTypes,
    }
  },
  created() {
    this.permissionGenerate = permission.hasPermission('uban.finance.bill.generate');
    this.permissionCheck = permission.hasPermission('uban.finance.bill.check');
    this.permissionUncheck = permission.hasPermission('uban.finance.bill.uncheck');
    this.permissionPay = permission.hasPermission('uban.finance.bill.pay');
    this.permissionUnpay = permission.hasPermission('uban.finance.bill.unpay');

    window.localStorage.setItem('msg', false);
    axios.fetch('oaServer', "/org/building/list").then(res => {
      if (res.code == 200)
        this.buildingOption = res.data
    })
    this.getdata();
  },
  mounted() {
    this.getLevel();
    this.getRoomList();
    window.addEventListener('storage', evt => {
      if (evt.key === 'msg' && evt.newValue == 'true') {
        this.getdata()
        window.localStorage.setItem('msg', false);
      }
    });
  },
  watch: {
  },
  methods: {
    // 获取所有房间列表
    getRoomList() {
      axios.fetch("oaServer", "/org/room/list", { type: null, pageSize: 1000 }).then(res => {
        this.roomList = res.data;
      });
    },
    getArea(val) {
      this.search.area = val.value;
      this.setArea = val.text;
    },
    getLevel() {
      axios.fetch('commonServer', "/dict/getItemViewsByGroup", { groups: '院方护理等级' }).then(res => {
        if (res.code == 200)
          this.levels = res.data
      })
    },
    // 改变老人或清除当前老人信息
    changePeople(val) { },
    //组装选中老人后的数据
    MonthBill() {
      this.$confirm('是否生成月度帐单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.fetch('financeServer', "/task/create").then(res => {
          if (res.code == 200)
            this.$message.success('成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    mulPrint() {
      if (this.multipleSelection.length > 0) {
        console.log(this.multipleSelection);
        const billIds = this.multipleSelection.map(val => {
          return val.billId;
        })
        console.log(billIds);
        this.print(billIds);
      } else {
        this.$message.warning('请选择需要打印的账单数据');
      }
    },
    handleChange(i) {
      this.pageIndex = i;
      this.getdata();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getdata();
    },
    reset() {
      if (this.$refs.areaCom !== undefined) {
        this.$refs.areaCom.resetArea();
        this.setArea = '';
      }
      this.tag1billTitle = this.tag1payTime = this.tag1status = this.elderName = this.buildSelect = this.fllorSelect = this.roomSelect = this.billNo = this.elderId = this.billType = this.tag1Level = this.search.roomName = '';
      this.searchFn()
    },
    changetag(i) {
      this.getdata();
    },
    changeBuild() {
      this.fllorSelect = [];
      this.roomSelect = ''
      this.roomsOption = []
      this.floorsOption = []
      if (this.buildSelect == '') return;

      let currentFloor = this.getBuildDetail(), temp = []
      for (let i = 0; i < currentFloor.floors; i++) temp.push(i)
      this.floorsOption = temp
    },
    getBuildDetail() {
      for (let i = 0; i < this.buildingOption.length; i++)
        if (this.buildingOption[i].buildingId == this.buildSelect)
          return this.buildingOption[i]
    },
    changefloor() {
      this.roomsOption = []
      this.roomSelect = ''
      if (this.fllorSelect == '') return;
      axios.fetch('oaServer', "/org/room/list", { buildingId: this.buildSelect, floor: this.fllorSelect, pageSize: 1000 }).then(res => {
        if (res.code == 200)
          this.roomsOption = res.data
      })
    },
    searchFn() {
      this.pageIndex = 1;
      this.getdata();
    },
    getdata() {
      let info = {
        areaId: this.search.area,
        roomName: this.search.roomName,
        nursingLevel: this.tag1Level,
        billTitle: this.tag1billTitle,
        payTime: this.tag1payTime,
        status: this.tag1status,
        elderName: this.elderName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        buildingId: this.buildSelect,
        floor: this.fllorSelect,
        roomId: this.roomSelect,
        billNo: this.billNo,
        billType: this.billType
      }
      axios.fetch('financeServer', '/accountBill/list', info).then(res => {
        if (res.code == 200) {
          this.data = res.data
          this.total = res.total
        }
      })
    },
    cancelCheck(id) {
      this.$confirm('是否取消审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.fetch('financeServer', '/accountBill/reverse', {
          billId: id,
          status: 0
        }, 'json').then(res => {
          if (res.code == 200) {
            this.$message.success('取消成功');
            this.getdata();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    cancelReceive(id) {
      this.$confirm('是否取消收款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.fetch('financeServer', '/accountBill/reverse', {
          billId: id,
          status: 1
        }, 'json').then(res => {
          if (res.code == 200) {
            this.$message.success('取消成功');
            this.getdata();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    topeddingdetail(id) {
      let routerUrl = this.$router.resolve({ path: 'electronic/peddingdetail/' + id })
      window.open(routerUrl.href, '_blank');
    },
    alreadydetail(id) {
      let routerUrl = this.$router.resolve({ path: 'electronic/alreadydetail/' + id })
      window.open(routerUrl.href, '_blank');
    },
    print(id) {
      let routerUrl = this.$router.resolve({ path: '/print/electronic/' + id })
      window.open(routerUrl.href, '_blank');
    },
    resolve(row) {
      this.resolveDetail = row;
      this.resolvedialogVisible = true;
    },
    Receive() {
      // 如果是离院结算（4）就不检查是否还有未结清帐单
      if (this.resolveDetail.billType !== 4) {
        this.netCheck();
      } else {
        let params = {
          elderId: this.resolveDetail.elderId,
          status: 1
        }
        axios.fetch('financeServer', '/accountBill/get/noCheck', params).then(res => {
          if (res.code == 200) {
            if (res.total > 0) {
              this.$message.error('该用户有未收款的帐单！')
            } else {
              this.netCheck();
            }
          }
        })
      }
    },
    netCheck() {
      this.$confirm('确认收款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.fetch('financeServer', '/accountBill/edit', {
          billId: +this.resolveDetail.billId,
          status: 3,
          totalAmount: this.resolveDetail.receivableAmount,
          elderId: this.resolveDetail.elderId,
          billType: this.resolveDetail.billType
        }, 'json').then(res => {
          if (res.code == 200) {
            this.$message({ message: '收款成功', type: 'success' });
            this.resolvedialogVisible = false;
            this.getdata();
          }
        })
      }).catch(() => { });
    },
    billTypeValue(row, column, value, index) {
      return billTypes[value];
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "审核详情" || to.name == '未出账单') {
      from.meta.keepAlive = true;
    } else {
      this.reset()
      from.meta.keepAlive = false;
    }
    next();
  },
  filters: {
    filterLevel: val => {
      return ['', '一', '二', '三', '四', '五', '六'][val]
    },
  }
}
</script>
<style lang="less" scoped>
.search {
  min-width: 800px;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .contral {
    margin-right: 20px;
    height: 40px;
    line-height: 40px;
    .yellow {
      color: rgb(242, 129, 79);
    }
    .block {
      color: #222222;
    }
  }
  .el-date-editor--date,
  .el-input,
  .el-select {
    width: 178px;
  }
  .seniorFibler {
    cursor: pointer;
    margin-left: 12px;
    color: #222;
    span {
      margin: 0 2px 0 3px;
    }
  }
}
.content {
  .title {
    .el-button {
      float: right;
      margin: 0 10px 10px 0;
    }
  }
}
.resolveform {
  /deep/ .el-dialog__body {
    background: rgba(248, 248, 248, 1);
    margin: 0 10px 10px;
    .el-form-item {
      margin-bottom: 0;
    }
    .prespace {
      color: #2fc07a;
    }
    .reaspace {
      color: #eb6969;
    }
  }
}
</style>