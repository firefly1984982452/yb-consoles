<template>
  <!-- 健康档案详情 -->
  <div class="detail">
    <div class="header">
      <el-button class="back-btn" size="mini" @click="back">返回</el-button>
      <el-button size="mini" :class="{active:tabView=='LiveInRecord'}" type='text' @click="tabView='LiveInRecord'">入院记录</el-button>
      <el-button size="mini" :class="{active:tabView=='ProgressNote'}" type='text' @click="tabView='ProgressNote'">病程记录</el-button>
    </div>
    <component v-bind:is="tabView"></component>
  </div>
</template>

<script type="text/javascript">
import LiveInRecord from "./liveInRecord";
import ProgressNote from "./progressNote";
export default {
  name: "HealthFileDetail",
  data() {
    return {
      tabView:'LiveInRecord'
    };
  },
  components: {LiveInRecord,ProgressNote},
  methods: {
    back() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
    display: flex;
    flex-direction: column;
  .header {
    background-color: #fff;
    padding: 10px 0 11px 15px;
    border-radius: 5px;
    margin-bottom: 10px;
    .el-button--text {
      color: #333333ff;
      font-weight: 500;
      font-size: 16px;
      width:110px;
      height: 36px;
    }
    .el-button--text.active {
      background-color: #4687e1ff;
      color: #fff;
    }
  }
}
</style>
