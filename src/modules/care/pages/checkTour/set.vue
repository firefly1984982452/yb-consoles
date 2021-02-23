<template>
    <div class="nurse-project">
        <div class="tab">
        <el-row class="header" :gutter="24">
            <el-col :span="1.5">
                <el-button size="mini" class="back" @click="back">返回</el-button>
            </el-col>
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
import child1 from "./set-child1";
import child2 from "./set-child2";
export default {
  name: "",
  data() {
    return {
      iscur: 0,
      tabView: "child1",
      tabs: [
        {
          text: "查房时段设置",
          name: "child1"
        },
        {
          text: "查房记录模板",
          name: "child2"
        }
      ]
    };
  },
  components: { child1, child2 },
  methods: {
    tabChange: function(tab) {
      this.tabView = tab;
    },
    back () {
        this.$router.back()
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
