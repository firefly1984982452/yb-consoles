<template>
  <el-dialog class="contract-delay" :visible.sync="dialog" append-to-body :width="width" top="0vh" :before-close="handleClose">
    <p class="contract-title">
      <span>{{ title }}</span>
      <span>合计&nbsp;{{ tableData.length }}&nbsp;条</span>
    </p>
    <Table :tableHeader="tableHeader" :index="index" :tableData="tableData" :title="title" />
  </el-dialog>
</template>

<script type="text/javascript">
import Table from "@/components/Table";
export default {
  name: "ContractDelay",
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
          label: "房间床位"
        },
        {
          prop: "contractType",
          label: "合同类型",
          format: data => {
            if (data.contractType === 0) {
              return "入院合同";
            } else if (data.contractType === 1) {
              return "延长合同";
            }
          }
        },
        {
          prop: "agreementCount",
          label: "合同次数"
        },
        {
          prop: "contractDuration",
          label: "合同周期",
          width: "240px",
          format: data => {
            let serviceStartDate = data.serviceStartDate
              ? data.serviceStartDate.split(" ")[0]
              : "--";
            let serviceEndDate = data.serviceEndDate
              ? data.serviceEndDate.split(" ")[0]
              : "--";
            // return serviceStartDate + "至" + serviceEndDate;
            if (!serviceStartDate && !serviceEndDate) {
              return "";
            } else if (serviceStartDate && !serviceEndDate) {
              return serviceStartDate + "至--";
            } else if (!serviceStartDate && serviceEndDate) {
              return "--" + serviceEndDate;
            } else {
              return serviceStartDate + "至" + serviceEndDate;
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
.contract-delay {
  /deep/ .el-dialog {
    border-radius: 8px;
    position: absolute;
    top: 50%;
    width: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  position: fixed;
  .contract-title {
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
