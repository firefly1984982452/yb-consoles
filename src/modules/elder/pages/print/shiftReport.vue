<template>
  <div class="shift_report">
    <h2 class="title">护理交班报告</h2>
    <div class="header">
      <el-form inline="true">
        <el-form-item label="区域">
          {{tableData.areaName}}
        </el-form-item>
        <el-form-item label="日期">
          {{tableData.reportDate}}
        </el-form-item>
        <el-form-item label="班次">
          {{tableData.workTimeName}}({{tableData.timeName}} {{tableData.timeStart | filterTime}} - {{tableData.timeEnd | filterTime}})
        </el-form-item>
      </el-form>
    </div>
    <div class="sum">
      <div class="left">
        <p>
          总人数
          <b>{{tableData.itemCount}}</b>
        </p>
        <p>
          实有人数
          <b>{{tableData.doneCount}}</b>
        </p>
      </div>
      <ul class="right">
        <li v-for="item in tableData.patrolReportDetails" :key="item">
          {{item.tagName}}<b>{{item.tagCount}}</b>
        </li>
      </ul>
    </div>
    <table class="table">
      <thead>
        <td>姓名</td>
        <td>床号</td>
        <td>记录内容</td>
      </thead>
      <tr v-for="item in tableData.patrolItemVos" :key="item">
        <td style="width:80px">
          <p>{{item.elderName}}</p>
          <p v-if="item.isNew">(新入)</p>
        </td>
        <td style="width:80px">
          {{item.roomName}}-{{item.bedName}}
        </td>
        <td>
          {{item.description}}
        </td>
      </tr>
    </table>
    <!-- <div class="info"><span>交班班长：</span><span>{{tableData.leaderName}}</span><span>{{tableData.createTime}}</span></div> -->
    <div class="info" v-if="tableData.currentCarers">
      <span>交班人员：</span>
      <span>{{tableData.currentCarers.replace(/,/g,'、')}}</span>
    </div>
    <!-- <div class="info"><span>接班人员：</span>
      <span>{{tableData.nextCarers.replace(/,/g,'、')}}</span>
    </div> -->
  </div>
</template>

<script type="text/javascript">
var that;
export default {
  name: "ShiftReportPrint",
  data() {
    return {
      tableData: {},
    };
  },
  components: {},
  created() {
    const detailId = Number(this.$route.query.id);
    this.initTableData(detailId);
  },
  methods: {
    initTableData(id) {
      axios
        .fetch("careServer", "/carePatrolReport/all", {
          id,
          isMyReport: false,
        })
        .then((res) => {
          this.tableData = res.data[0];
        });
    },
  },
  beforeCreate() {
    that = this;
  },
  filters: {
    filterTime(val) {
      let index = that.$constant.timeList.findIndex(
        (item) => item.value == val
      );
      if (index !== -1) {
        return that.$constant.timeList[index].name;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.shift_report {
  font-size: 12px;
  .title {
    padding: 0 !important;
    font-size: 24px;
  }
  .header {
    /deep/ .el-form {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .el-form-item {
        margin: 0;
      }
    }
  }
  .sum {
    border: 1px solid black;
    height: 80px;
    display: flex;
    .left {
      flex: 1;
      border-right: 1px solid black;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .right {
      flex: 2;
      //   display: flex;
      li {
        text-align: center;
        display: inline-block;
        width: 25%;
        height: 50%;
        line-height: 40px;
      }
    }
  }
  .table {
    margin-top: 10px;
    tr,
    thead {
      td {
        border: none !important;
      }
    }
    tr,
    thead {
      border-bottom: 1px solid black;
    }
    thead {
      background-color: #f8f8f8;
    }
  }
  .info {
    line-height: 32px;
    // height: 100%;
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
    align-items: center;
    span:nth-child(1) {
      width: 80px;
      text-align: center;
      height: 100%;
      border-radius: 5px;
      padding: 3px;
      display: inline-block;
      background-color: #eee;
      margin-right: 5px;
    }
    span:nth-child(2) {
      flex: 1;
    }
  }
}
</style>
