<template>
  <div class="project">
    <div class="tab">
      <el-row class="header">
        <el-button v-for="(item, i) in tabs" :key="i" :class="{ cur: iscur == i }" type="text" @click="(iscur = i), tabChange(item.name)">
          <span>{{ item.text }}</span>
        </el-button>
      </el-row>
      <div class="content">
        <component v-bind:is="tabView"></component>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Category from "./category";
import Details from "./details";
export default {
  name: "Project",
  data() {
    return {
      //查询条件数据
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      iscur: 0,// 默认明细界面
      tabView: "Details",// 默认明细界面
      tabs: [
        {
          text: "明细",
          name: "Details"
        },
        {
          text: "分类",
          name: "Category"
        }
      ]
    };
  },
  components: { Category, Details },
  methods: {
    tabChange: function(tab) {
      this.tabView = tab;
    }
  }
};
</script>

<style lang="less" scoped>
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
