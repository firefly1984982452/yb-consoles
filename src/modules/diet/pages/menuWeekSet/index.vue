<template>
  <div class="nurse-project">
    <div class="tab">
      <el-row class="header" :gutter="24">
        <el-col :span="20">
          <el-button v-for="(item, i) in tabs" :key="i" :class="{ cur: iscur == i }" type="text" @click="(iscur = i), tabChange(item.name)">
            <span>{{ item.text }}</span>
          </el-button>
        </el-col>
      </el-row>
      <div class="content">
        <component v-bind:is="tabView"></component>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import child1 from "./child1"; // 
import child2 from "./child2"; // 
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
      tabView: "child1",
      tabs: [
        {
          text: "食堂菜",
          name: "child1"
        },
        {
          text: "小锅菜",
          name: "child2"
        },
      ]
    };
  },
  components: { child1, child2 },
  methods: {
    tabChange: function(tab) {
      this.tabView = tab;
    },
  }
};
</script>

<style lang="less" scoped>
.tab {
    height: 100%;
}
.el-row {
  margin-left: 0!important;
  margin-right: 0!important;
}
.header {
  border-bottom: 1px solid #dddddd;
  background-color: #fff;
  padding: 10px 20px;
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
