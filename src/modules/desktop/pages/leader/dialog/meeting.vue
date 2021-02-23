<template>
  <el-dialog
    class="meeting-dialog"
    :visible.sync="dialog"
    append-to-body
    width="30%"
    top="0vh"
    :before-close="handleClose"
  >
    <p class="meeting-title">
      <span>会议通知</span>
    </p>
    <div class="meeting-content">
      <el-row>
        <el-col :span="2">主题</el-col>
        <el-col :span="22">{{ detailData.title }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2">说明</el-col>
        <el-col :span="22"
          >{{ detailData.description }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="2">时间</el-col>
        <el-col :span="22">{{ detailData.beginTime }} 至 {{ detailData.endTime }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2">地点</el-col>
        <el-col :span="22">{{ detailData.location }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2">人员</el-col>
        <el-col :span="22">{{ detailData.participants }}</el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  name: "MeetingDialog",
  data() {
    return {
      dialog: false,
      detailData:{
        title:'',
        description:'',
        time:''
      }
    };
  },
  components: {}
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  padding: 42px 24px 30px;
}
.meeting-dialog {
  /deep/ .el-dialog {
    border-radius: 8px;
    position: absolute;
    top: 50%;
    width: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    padding-bottom: 24px;
    .meeting-title {
      position: absolute;
      top: 0;
      height: 72px;
      line-height: 72px;
      font-size: 20px;
      font-weight: 500;
      color: #222222FF;
    }
    .el-row {
      font-size: 16px;
      line-height: 30px;
      height: 30px;
    //   margin-bottom:24px;
      .el-col:nth-child(2) {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.8);
      }
    }
  }
}
</style>
