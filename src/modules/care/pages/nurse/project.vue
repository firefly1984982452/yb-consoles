<template>
  <div class="nurse-project">
    <div class="tab">
      <el-row class="header" :gutter="24">
        <el-col :span="20">
          <el-button v-for="(item, i) in tabs" :key="i" :class="{ cur: iscur == i }" type="text" @click="(iscur = i), tabChange(item.name,item.type)">
            <span>{{ item.text }}</span>
          </el-button>
        </el-col>
        <el-col :span="4">
          <div style="text-align:right">
            <el-button type="success" @click="showConfiguration1">房间项目汇总</el-button>
            <el-button type="success" @click="showConfiguration">长者项目汇总</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="content">
        <!-- <component :type="type" v-bind:is="tabView"></component> -->
        <DailyCare :type="type"></DailyCare>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
// import Sanitation from "./sanitation.vue"; // 清洁卫生
import DailyCare from "./daily-care"; // 日常照护
// import Prevention from "./prevention"; // 日常照护
export default {
  name: "NurseProject",
  data() {
    return {
      //查询条件数据
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      dialogAddVisible: false,
      iscur: 0,
      tabView: "DailyCare",
      type: 1,
      tabs: [
        {
          text: "日常照护",
          name: "DailyCare",
          type: 1
        },
        {
          text: "清洁卫生",
          name: "Sanitation",
          type: 2
        },
        // {
        //   text: "预防保健",
        //   name: "Prevention",
        //   type: 3
        // }
      ]
    };
  },
  // components: { DailyCare, Sanitation, Prevention },
  components: { DailyCare },
  methods: {
    tabChange: function(tab, type) {
      this.tabView = tab;
      this.type = type;
    },
    showConfiguration() {
      this.$router.push({
          path: "/care/project/configuration"
      })
    },
    showConfiguration1() {
      this.$router.push({
          path: "/care/project/configurationRoom"
      })
    }
  }
};
</script>

<style lang="less" scoped>
.tab {
  height: 100%;
}
.header {
  border-bottom: 1px solid #dddddd;
  background-color: #fff;
  padding: 10px 20px;
  margin-left: 0!important;
  margin-right: 0!important;
  margin-bottom: 10px;
  /deep/ .el-button {
    i {
      color: #409eff;
      // color: #fff;
      font-weight: 700;
    }
  }
  /deep/ .el-button.cur {
    background-color: #5b8ff9ff;
    color: rgba(255, 255, 255, 1);
    i {
      // color: #409eff;
      color: #fff;
      font-weight: 700;
    }
  }
}
</style>
