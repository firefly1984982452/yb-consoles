<template>
  <el-dialog
    class="long-nurse"
    :visible.sync="dialog"
    append-to-body
    :width="width"
    top="0vh"
    :before-close="handleClose"
  >
    <p class="contract-title">
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
          label: "房间床位",
          format: data => {
            return data.roomName + "-" + data.bedName;
          }
        },
        {
          prop: "insuranceLevel",
          label: "长护险等级",
          format: data => {
            if (data.insuranceLevel === 0) {
              return "未评级";
            } else if (data.insuranceLevel === 1) {
              return "护理一级";
            } else if (data.insuranceLevel === 2) {
              return "护理二级";
            } else if (data.insuranceLevel === 3) {
              return "护理三级";
            } else if (data.insuranceLevel === 4) {
              return "护理四级";
            } else if (data.insuranceLevel === 5) {
              return "护理五级";
            } else if (data.insuranceLevel === 6) {
              return "护理六级";
            } else if (data.insuranceLevel === 7) {
              return "外地";
            } else if (data.insuranceLevel === 8) {
              return "不满60岁";
            } else if (data.insuranceLevel === 9) {
              return "享受居家养老";
            } else {
              return "--";
            }
          }
        },
        {
          prop: "startDate",
          label: "评估周期",
          width: "240px",
          format: data => {
            let startDate = data.startDate ? data.startDate.split(" ")[0] : "";
            let endDate = data.endDate ? data.endDate.split(" ")[0] : "";
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
      if(offsetWid < 1300 ){
        this.width = '66%'
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
.long-nurse {
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
