<template >
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="药品入库" name="first">
        <storeList v-if="activeName=='first'"></storeList>
      </el-tab-pane>
      <el-tab-pane label="采购申请" name="second">
        <purchase v-if="activeName=='second'"></purchase>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import purchase from "./purchase";
import storeList from "./storeList";

export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: { purchase, storeList },
  created() {
    let activeName = this.$route.query.activeName;
    if (activeName) {
      this.activeName = activeName;
    }
  },
  methods: {},
};
</script>
<style scoped>
/deep/ .el-tabs {
  /* background-color: #ffffff; */
}
/deep/ .el-tabs__header {
  padding-left: 16px;
  padding-top: 10px;
  background-color: #ffffff;
  margin-bottom: 0px;
  border-radius: 6px 6px 0px 0px;
}
</style>