<template>
  <el-row class="care-assess" style="padding:20px;">
    <el-col :span="24" class="assessMainInfo">
      <div><span>评估类别:</span><span>首次评估</span></div>
      <div style="width:45em;">
        <span>评估有效期:</span>
        <span>
          <el-date-picker v-model="indate[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
          <el-date-picker v-model="indate[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
        </span>
      </div>
    </el-col>
    <el-col :span="24">
      <el-form>
        <!-- <AssessProject ref='AssessProject' @handleCareAssess='handleCareAssess' :sign="sign"></AssessProject> -->
        <AssessProjectNew ref='AssessProject' @handleCareAssess='handleCareAssess' :sign="sign"></AssessProjectNew>
      </el-form>
    </el-col>
    <el-col v-if="!notEdit" :span="24" style="text-align:center;">
      <el-button type="success" plain @click="save()">保存</el-button>
      <el-button  @click="$router.go(-1)">取消</el-button>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import AssessProject from "@/modules/elder/pages/care/assessProject";
import AssessProjectNew from "@/modules/elder/pages/care/assessProjectNew";
import moment from "moment";
export default {
  components: { AssessProject,AssessProjectNew },
  props: ["elderId", "elderName",'notEdit'],
  data() {
    return {
      sign: "add",
      form: {},
      indate: []
    };
  },
  created() {
    var start = new Date();
    // let nowY = start.getFullYear() + 1;
    // let nowM = start.getMonth() + 1;
    // let nowD = start.getDate();
    // let endDate = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
    let endDate = moment(start)
      .add(1, "y")
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    this.indate = [start, endDate];
  },
  methods: {
    handleCareAssess() {
      // console.log('xyw=====c触发');
      this.$emit("nextStep", "careAssess");
      this.$emit('initTabStyle');
    },
    save() {
      let contentTitleData = {
        estimateType: 0,
        elderId: this.elderId,
        elderName: this.elderName,
        startDate: this.indate[0],
        endDate: this.indate[1],
        liveIn: true
      };
      this.$refs.AssessProject.$emit("hello", contentTitleData);
    }
  }
};
</script>

<style scoped>
.care-assess .table-card {
  background: #fff;
  padding-bottom: 20px;
}
.care-assess .table-card .el-button {
  width: 110px;
  height: 36px;
  margin-right: 20px;
  font-size: 16px;
}
.assessMainInfo > div {
  width: 15em;
  text-align: left;
  display: inline-block;
  font-size: 14px;
}
.assessMainInfo > div > span:nth-child(1) {
  margin-right: 1em;
}
.assessMainInfo > div > span:nth-child(2) {
  color: #333;
}
.el-card >>> .el-card__body {
  padding: 0 !important;
}
</style>
