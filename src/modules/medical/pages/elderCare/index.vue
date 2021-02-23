<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true">
      <el-row class="search-area">
        <el-col :span="12">
          <el-form-item v-if="activeName === 'live'" label="登记时间">
            <el-date-picker v-model="liveDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="search">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-else label="离院时间">
            <el-date-picker v-model="leaveDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="search">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" v-if="activeName === 'live'">
            <el-input placeholder="姓名/入院编号" v-model="inputValue" @keyup.native.enter="search" clearable @clear="search" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-else label="">
            <el-input placeholder="姓名/入院编号" v-model="inputValue2" @keyup.native.enter="search" clearable @clear="search" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <p v-if="activeName === 'live'" style="line-height:56px;color:rgba(0,0,0,.4);">
            提示：完成全部入院手续后，入院评估数据不可再修改
          </p>
          <p v-else style="line-height:56px;color:rgba(0,0,0,.4);">
            提示：完成全部离院手续后，离院小结数据不可再修改
          </p>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格内容区域 -->
    <el-tab-pane name="live">
      <!-- :label="liveDataTotals>0?`入院评估（待处理${liveDataTotals}条）`:''" -->
      <span slot="label" class="tab-label">
        <el-badge v-if="liveDataTotals > 0" :value="liveDataTotals" class="item">
          入院评估
        </el-badge>
        <span v-else>入院评估</span>
      </span>
      <LiveEvaluate ref="liveEvaluate" @liveChildInit="liveChildInit" />
    </el-tab-pane>
    <el-tab-pane name="leave">
      <span slot="label" class="tab-label">
        <el-badge v-if="leaveDataTotals > 0" :value="leaveDataTotals" class="item">
          离院办理
        </el-badge>
        <span v-else>离院办理</span>
      </span>
      <LeaveTable ref="leaveHandle" @leaveChildInit="leaveChildInit" />
    </el-tab-pane>
  </el-tabs>
</template>

<script type="text/javascript">
import LiveEvaluate from "./liveList";
import LeaveTable from "./leaveList";
export default {
  components: { LiveEvaluate, LeaveTable },
  name: "LiveLeaveIndex",
  data () {
    return {
      activeName: "live",
      pageIndex: 1,
      /**入院评估 */
      liveDate: "",
      liveDataTotals: 0,
      inputValue: "",
      /**离院办离 */
      leaveDate: "",
      leaveDataTotals: 0,
      inputValue2: ""
    };
  },
  watch: {
    // activeName(newValue, oldValue) {
    //   if (newValue === "leave") {
    //     this.$nextTick(() => {
    //       this.initLeaveData();
    //     });
    //   }
    // }
  },

  beforeRouteEnter (to, from, next) {
    console.log(from);
    if (
      from.path == "/medical/elderCareList/addLeaveHandle" ||
      from.path == "/medical/elderCareList/leaveHandleDetail" ||
      from.path == "/medical/elderCareList/addEvaluation"
    ) {
      to.meta.isBack = true;
    }
    next();
  },
  activated () {
    console.log(this.$route.meta.isBack);
    if (!this.$route.meta.isBack) {
      this.reset();
    }
    this.initLiveData();
    this.initLeaveData();
    this.$route.meta.isBack = false;
  },
  created () {
    // this.initLiveData();
    // this.initLeaveData();
  },
  methods: {
    reset () {
      this.activeName = "live";
      this.pageIndex = 1;
      this.$nextTick(() => {
        this.$refs.liveEvaluate.currentPage = 1;
        this.$refs.leaveHandle.currentPage = 1;
      });
      this.liveDate = this.leaveDate = this.inputValue = this.inputValue2 = "";
    },
    handleClick (tab, event) {
      // console.log(tab, event);
      // if (this.activeName == "leave") {
      //   this.initLeaveData();
      // }
    },
    // 数据查询
    search () {
      console.log(this.leaveDate);
      this.pageIndex = 1;
      this.$nextTick(() => {
        this.$refs.liveEvaluate.currentPage = 1;
        this.$refs.leaveHandle.currentPage = 1;
      });
      if (this.activeName === "live") {
        this.initLiveData();
      } else {
        this.initLeaveData();
      }
    },
    /* *************入住评估******************* */
    // 入住评估初始化数据
    async initLiveData () {
      const res = await axios.fetch("elderServer", "/elderMedical/info", {
        pageIndex: this.pageIndex,
        pageSize: 10,
        startDate: this.liveDate
          ? this.$moment(this.liveDate[0]).format("YYYY-MM-DD")
          : null,
        endDate: this.liveDate
          ? this.$moment(this.liveDate[1]).format("YYYY-MM-DD")
          : null,
        elderName: this.inputValue
      });
      console.log(res);
      if (res.code == 200) {
        this.$refs.liveEvaluate.tableData = res.data;
        this.$refs.liveEvaluate.totalPage = res.total;
        this.liveDataTotals = Number(res.message);
      }
    },
    // 入住评估子组件 页码变化触发父组件事件
    liveChildInit (val) {
      console.log(val);
      this.pageIndex = val;
      this.initLiveData();
    },

    /* *************离院办理******************* */
    async initLeaveData () {
      const res = await axios.fetch(
        "elderServer",
        "/elderCheckout/get/allElderCheckout",
        {
          pageIndex: this.pageIndex,
          pageSize: 10,
          startDate: this.leaveDate
            ? this.$moment(this.leaveDate[0]).format("YYYY-MM-DD")
            : null,
          endDate: this.leaveDate
            ? this.$moment(this.leaveDate[1]).format("YYYY-MM-DD")
            : null,
          elderName: this.inputValue2
        }
      );
      if (res.code == 200) {
        this.$refs.leaveHandle.tableData = res.data;
        this.$refs.leaveHandle.totalPage = res.total;
        this.leaveDataTotals = Number(res.message);
      }
    },
    // 入住评估子组件 页码变化触发父组件事件
    leaveChildInit (val) {
      console.log(val);
      this.pageIndex = val;
      this.initLeaveData();
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding: 15px;
  /deep/.el-tabs__item {
    .tab-label {
      display: inline-block;
      height: 100%;
      position: relative;
      padding: 0 10px;
      .el-badge__content.is-fixed {
        top: 10px;
        right: 0;
      }
    }
  }
}
.el-row.search-area {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  .el-col:nth-child(1) {
    /deep/ .el-input-group__append {
      width: 40px;
      padding: 0;
      text-align: center;
      .el-button {
        min-width: 0px;
        padding: 0;
        height: 35px;
        width: 40px;
      }
    }
  }
  .el-col:nth-child(2) {
    text-align: right;
  }
}
</style>
