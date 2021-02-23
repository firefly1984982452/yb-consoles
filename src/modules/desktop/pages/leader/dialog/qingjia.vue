<template>
  <el-dialog class="qingjia" :visible.sync="dialog" append-to-body :width="width" top="0vh" :before-close="handleClose">
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
    }
  },
  data() {
    return {
      index: null,
      dialog: false,
      tableHeader: [
        {
          prop: "leaveNo",
          label: "请假单号",
          width: "150px"
        },
        {
          prop: "elderName",
          label: "长者姓名",
          width: "100px"
        },
        {
          prop: "roomName",
          label: "房间床位",
          width: "100px",
          format: data => {
            return data.roomName + "-" + data.bedName;
          }
        },
        {
          prop: "startDate",
          label: "请假时间",
          type: "icon",
          format: data => {
            let startDate = data.startDate
              ? data.startDate.split(" ")[0]
              : "--";
            let endDate = data.endDate ? data.endDate.split(" ")[0] : "--";
            return startDate + "至" + endDate;
          }
        },
        {
          prop: "countStart",
          label: "记账周期",
          format: data => {
            let countStart = data.countStart
              ? data.countStart.split(" ")[0]
              : "--";
            let countEnd = data.countEnd ? data.countEnd.split(" ")[0] : "--";
            return (
              countStart +
              "至" +
              countEnd +
              "(" +
              this.$moment(countEnd).diff(this.$moment(countStart), "day") +
              "天)"
            );
          }
        },
        {
          prop: "countDescription",
          label: "计费项",
          width: "170px",
          type: "wrap"
        }
      ],
      tableData: [],
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
        this.width = '80%'
      } else {
        this.width = '60%'
      }
    },
    handleClose(done) {
      this.dialog = false;
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
.qingjia {
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
