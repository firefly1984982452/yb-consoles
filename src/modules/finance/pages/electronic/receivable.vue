<template>
  <div>
    <el-card style="margin-bottom: 10px">
      <p><i class="el-icon-info"></i>提示：本月应收数据统计截止到前一天24点。</p>
    </el-card>
    <!-- 应收 -->
    <el-form :inline="true" label-width="70px">
      <div class="search">
        <div class="top">
          <div class="left">
            <el-form-item label="长者姓名">
              <ub-elder v-model="elderId" @change='item => elderName = item.elderName' clearable></ub-elder>
            </el-form-item>
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
            <el-button type="primary" icon="el-icon-search" @click="searchFn" style="background-color:#2368D3;">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <div class="content">
      <ul class="title">
        <span>合计：本月应收 <b>{{amountDetail.num}}</b> 人 应收金额 <b>{{amountDetail.amount}}</b> 元</span>
        <el-button @click="output" type="primary">数据导出</el-button>
      </ul>
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
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
        <el-table-column prop="feeBed" label="托管费(元)" align="center"></el-table-column>
        <el-table-column prop="feeNursing" label="护理费(元)" align="center"></el-table-column>
        <el-table-column prop="feeDiet" label="膳食费(元)" align="center"></el-table-column>
        <el-table-column prop="feeConsume" label="消费项(元)" align="center"></el-table-column>
        <el-table-column prop="feeMedical" label="医药项((元)" align="center"></el-table-column>
        <el-table-column prop="feeInsurance" label="长护险补贴(元)" align="center"></el-table-column>
        <el-table-column prop="feeArrearage" label="欠费金额(元)" align="center"></el-table-column>
        <el-table-column prop="feeAmount" label="应收金额(元)" align="center"></el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" :current-page="pageIndex" @current-change="handleChange" @size-change="handleSizeChange" :pager-count="11" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import ubElder from "@/components/elder";
import { dataToExcel } from '@/components/excel'

export default {
  components: { ubElder },
  data() {
    return {
      setArea: '',
      levels: [],
      roomList: [],
      elderId: '',
      creatorName: '',
      data: [],

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

      amountDetail: {},

      billNo: '',
      billType: '',
    }
  },
  created() {

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
      this.tag1billTitle = this.tag1payTime = this.tag1status = this.elderName = this.billNo = this.elderId = this.billType = this.tag1Level = this.search.roomName = '';
      this.searchFn()
    },
    searchFn() {
      this.pageIndex = 1;
      this.getdata();
    },
    getdata() {
      let info = {
        isPager: false,
        areaId: this.search.area,
        roomName: this.search.roomName,
        nursingLevel: this.tag1Level,
        billTitle: this.tag1billTitle,
        payTime: this.tag1payTime,
        status: this.tag1status,
        elderName: this.elderName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        billNo: this.billNo,
        creatorName: this.creatorName,
        billType: this.billType
      }
      axios.fetch('financeServer', '/accountReceivable/all', info).then(res => {
        if (res.code == 200) {
          this.data = res.data
          this.total = res.total
        }
      })
      axios.fetch('financeServer', '/accountReceivable/statistics', info).then(res => {
        if (res.code == 200) {
          this.amountDetail = res.data;
        }
      })
    },
    // 导出数据
    output() {
      let info = {
        isPager: false,
        areaId: this.search.area,
        roomName: this.search.roomName,
        nursingLevel: this.tag1Level,
        billTitle: this.tag1billTitle,
        payTime: this.tag1payTime,
        status: this.tag1status,
        elderName: this.elderName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        billNo: this.billNo,
        creatorName: this.creatorName,
        billType: this.billType
      }
      axios.fetch('financeServer', '/accountReceivable/all', info).then(res => {
        if (res.code == 200) {
          let i = 1;
          dataToExcel(res.data, {
            index: { title: "序号", format: val => i++ },
            elderName: "长者姓名",
            roomName: "房间名称",
            bedId: "床位名称",
            feeBed: "托管费(元)",
            feeNursing: "护理费(元)",
            feeDiet: "膳食费(元)",
            feeConsume: "消费金额(元)",
            feeMedical: "医药费(元)",
            feeInsurance: "长护险补贴(元)",
            feeArrearage: "欠费金额(元)",
            feeAmount: "应收金额(元)",
            remark: "备注",
          }, `养老机构应收金额明细表.xlsx`, "养老机构应收金额明细表");
          this.$message.success(`导出成功，共计 ${res.total} 条记录`);
        }
      })
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