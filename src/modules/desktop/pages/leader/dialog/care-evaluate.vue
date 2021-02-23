<template>
  <el-dialog
    class="care-evaluate"
    :visible.sync="dialog"
    append-to-body
    top="0vh"
    :width="width"
    :before-close="handleClose"
  >
    <p class="care-title">
      <span>{{ title }}</span>
      <span>合计&nbsp;{{ tableData.length }}&nbsp;条</span>
    </p>
    <Table
      :tableHeader="tableHeader"
      :index="index"
      :tableData="tableData"
      :title="title"
    />
  </el-dialog>
</template>

<script type="text/javascript">
import Table from "@/components/Table";
export default {
  name: "CareEvaluate",
  components: {
    Table
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      index: "index",
      dialog: false,
      tableHeader: [
        {
          prop: "elderName",
          label: "长者姓名"
        },
        {
          prop: "roomName",
          label: "房间床位",
          format: data => {
            return data.roomName + "-" + data.bedName;
          }
        },
        {
          prop: "estimateType",
          label: "评估类型",
          format: data => {
            if (data.estimateType === 0) {
              return "首次评估";
            } else if (data.estimateType === 1) {
              return "复核评估";
            } else if (data.estimateType === 2) {
              return "持续评估";
            } else {
              return "--";
            }
          }
        },
        {
          prop: "estimateCount",
          label: "评估次数"
        },
        {
          prop: "startDate",
          label: "评估周期",
          width: "240px",
          format: data => {
            let startDate = data.startDate
              ? data.startDate.split(" ")[0]
              : "--";
            let endDate = data.endDate ? data.endDate.split(" ")[0] : "--";
            // return startDate + "至" + endDate;
            if (!startDate && !endDate) {
              return "";
            } else if (startDate && !endDate) {
              return startDate + "至--";
            } else if (!startDate && endDate) {
              return "--" + endDate;
            } else {
              return startDate + "至" + endDate;
            }
          }
        }
      ],
      width:''
    };
  },
  created () {
    this.sizeWatch();
  },
  methods: {
    sizeWatch() {
      var offsetWid = document.documentElement.clientWidth;
      var offsetHei = document.documentElement.clientHeight;
      console.log(offsetWid,offsetHei);
      if(offsetWid < 1300 ){
        this.width = '55%'
      } else {
        this.width = '60%'
      }
    },
    handleClose(done) {
      this.dialog = false;
      this.suggestion = "同意入院";
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  padding: 42px 24px 30px;
}
.care-evaluate {
  /deep/ .el-dialog {
    border-radius: 8px;
    position: absolute;
    top: 50%;
    width: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  position: fixed;
  .care-title {
    position: absolute;
    top: 0;
    height: 72px;
    line-height: 72px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(34, 34, 34, 1);
    span:nth-child(2) {
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
  }
}
</style>
