<template>
  <el-dialog class="bill-approve" :visible.sync="dialog" append-to-body :width="width" top="0vh" :before-close="handleClose">
    <p class="contract-title">
      <span>{{ title }}</span>
      <span>合计&nbsp;{{ elderNum }}人&nbsp;{{ tableData.length }}&nbsp;条,</span>
      <span>应收&nbsp;<i>{{ receivableAmounts }}&nbsp;</i>元</span>
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
    receivableAmounts: {
      type: Number,
      default: 0
    },
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      elderNum:0,
      index: null,
      dialog: false,
      tableHeader: [
        {
          prop: "billNo",
          label: "账单编号",
          width: "145px"
        },
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
          prop: "billType",
          label: "账单类型",
          format: data => {
            if (data.billType === 1) {
              return "预定房间";
            }
            if (data.billType === 2) {
              return "入院缴费";
            }
            if (data.billType === 3) {
              return "月度结算";
            }
            if (data.billType === 4) {
              return "离院结算";
            }
          }
        },
        {
          prop: "billTitle",
          label: "结算月"
        },
        {
          prop: "receivableAmount",
          label: "应缴款",
          type:'markRed'
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
        this.width = '56%'
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
.bill-approve {
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
    span:nth-child(3) {
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      i {
        color: orange;
        font-style: normal;
      }
    }
  }
}
</style>
