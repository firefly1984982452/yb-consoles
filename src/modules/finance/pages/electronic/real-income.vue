<template>
  <div>
    <!-- 实收 -->
    <el-form :inline="true" label-width="70px">
      <div class="search">
        <div class="top">
          <div class="left">
            <el-form-item label="长者姓名">
              <ub-elder v-model="elderId" @change='item => elderName = item.elderName' clearable></ub-elder>
            </el-form-item>
            <el-form-item label="快捷日期">
              <el-button @click="changeDate(0)" :tyep="currentDate === 0 ? 'success' : '' ">当天</el-button>
              <el-button @click="changeDate(1)" :tyep="currentDate === 1 ? 'success' : '' ">本月</el-button>
              <el-button @click="changeDate(2)" :tyep="currentDate === 2 ? 'success' : '' ">本季度</el-button>
              <el-button @click="changeDate(3)" :tyep="currentDate === 3 ? 'success' : '' ">本年度</el-button>
            </el-form-item>
            <el-form-item label="收款日期">
              <el-date-picker type="daterange" v-model="search.date" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchFn" style="background-color:#2368D3;">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
            <span class="iconfont iconjichutubiao-shaixuan" :class="senior ? 'yellow' : 'block'" @click="senior=!senior">
              <span :class="senior ? 'yellow' : 'block'" style="margin-left:8px;">高级筛选</span>
              <i :class="[
            senior ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
            senior ? 'yellow' : 'block'
          ]"></i>
            </span>
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
            </div>
          </div>
        </div>
      </div>
    </el-form>

    <div class="content">
      <ul class="title">
        <span>合计：实收 <b>{{amountDetail.num}}</b> 人次，实收金额 <b>{{amountDetail.amount}}</b> 元</span>
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
        <el-table-column prop="billTitle" label="账单名称" align="center" width="100"></el-table-column>
        <el-table-column prop="feeAmount" label="账单金额(元)" align="center"></el-table-column>
        <el-table-column prop="totalAmount" label="应收金额(元)" align="center"></el-table-column>
        <el-table-column prop="payeeName" label="收款人" align="center"></el-table-column>
        <el-table-column prop="payTime" label="收款时间" align="center"></el-table-column>
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
      currentDate: 4,
      senior: false,   //是否显示高级搜索
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
        area: '',
        date: []
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
    // 本月
    getCurrMonthDays() {
      let start = this.$moment().add('month', 0).format('YYYY-MM') + '-01'
      let end = this.$moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
      return [start, end]
    },
    // 本季
    getCurrJiDays() {
      let start = this.$moment().startOf('quarter').format("YYYY-MM-DD")
      let end = this.$moment().endOf('quarter').format("YYYY-MM-DD")
      return [start, end]
    },
    // 本年
    getCurrYearDays() {
      let start = this.$moment().format('YYYY-01-01')
      let end = this.$moment().format('YYYY-12-31')
      return [start, end]
    },
    changeDate(index) {
      this.currentDate = index;
      let today = this.$moment().format('YYYY-MM-DD ');
      switch (index) {
        case 0:
          this.search.date = [today, today];
          break;
        case 1:
          this.search.date = this.getCurrMonthDays();
          break;
        case 2:
          this.search.date = this.getCurrJiDays();
          break;
        case 3:
          this.search.date = this.getCurrYearDays();
          break;
        case 4:
          break;

        default:
          break;
      }
    },
    reset() {
      if (this.$refs.areaCom !== undefined) {
        this.$refs.areaCom.resetArea();
        this.setArea = '';
      }
      this.search.date = [];
      this.tag1billTitle = this.tag1payTime = this.tag1status = this.elderName = this.billNo = this.elderId = this.billType = this.tag1Level = this.search.roomName = '';
      this.searchFn()
    },
    searchFn() {
      this.pageIndex = 1;
      this.getdata();
    },
    getdata() {
      let info = {
        isPager: true,
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
        billType: this.billType,
        startTime: this.search.date[0],
        endTime: this.search.date[1],
      }
      axios.fetch('financeServer', '/accountReceivable/bill/all', info).then(res => {
        if (res.code == 200) {
          this.data = res.data
          this.total = res.total
        }
      })
      axios.fetch('financeServer', '/accountReceivable/bill/statistics', info).then(res => {
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
        billType: this.billType,
        startTime: this.search.date[0],
        endTime: this.search.date[1],
      }
      axios.fetch('financeServer', '/accountReceivable/bill/all', info).then(res => {
        if (res.code == 200) {
          let i = 1;
          dataToExcel(res.data, {
            index: { title: "序号", format: val => i++ },
            elderName: "长者姓名",
            roomName: "房间名称",
            bedId: "床位名称",
            billTitle: "账单名称",
            feeAmount: "账单金额(元)",
            totalAmount: "应收金额(元)",
            payeeName: "收款人",
            payTime: "收款时间",
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
  .seniorFibler {
    cursor: pointer;
    margin-left: 12px;
    color: #222;
    span {
      margin: 0 2px 0 3px;
    }
  }
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

.yellow {
  color: rgb(242, 129, 79);
}
.block {
  color: #222222;
}
</style>