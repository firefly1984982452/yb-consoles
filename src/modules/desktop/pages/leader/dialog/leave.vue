<template>
  <div>
    <!-- 离院审核 -->
    <el-dialog
      class="leave-approve"
      title="离院审核"
      :visible.sync="dialog"
      append-to-body
      width="70%"
      top="0vh"
      :before-close="handleClose"
    >
      <div class="header">
        <span
          v-for="(item, i) in peoples"
          :class="{ current: current == i }"
          @click="tabChange(item, i)"
          :key="i"
          >{{ item.elderName }}</span
        >
      </div>
      <div class="dialog-main">
        <div class="left">
          <div class="top">服务终结对象</div>
          <div class="content">
            <table class="tableCss">
              <tr>
                <td width="10%" class="grey">服务对象</td>
                <td width="20%">{{ tableData.elderName | nothingFilter }}</td>
                <td width="10%" class="grey">入院日期</td>
                <td width="20%">
                  {{
                    this.$moment(tableData.checkinDate).format("YYYY-MM-DD")
                      | nothingFilter
                  }}
                </td>
                <td width="10%" class="grey">离院日期</td>
                <td>
                  {{
                    this.$moment(tableData.checkoutDate).format("YYYY-MM-DD")
                      | nothingFilter
                  }}
                </td>
              </tr>
              <tr>
                <td class="grey">担保人</td>
                <td>{{ tableData.relationName | nothingFilter }}</td>
                <td class="grey">双方关系</td>
                <td>{{ tableData.relationType | nothingFilter }}</td>
                <td class="grey">联系电话</td>
                <td>{{ tableData.mobilePhone | nothingFilter }}</td>
              </tr>
              <tr height="168px" class="special-tr">
                <td class="grey">
                  <span>
                    终止申请方
                  </span>
                </td>
                <td colspan="5">
                  <span>{{ tableData.checkoutRemark | nothingFilter }}</span>
                  <span>担保人</span>
                  <span><img :src="tableData.guarantorSign" alt=""/></span>
                  <span>{{ tableData.guarantorTime }}</span>
                </td>
              </tr>
              <tr height="168px" class="special-tr">
                <td class="grey">
                  <span>
                    出入院
                  </span>
                </td>
                <td colspan="5">
                  <span>{{ tableData.operatorRemark }}</span>
                  <span>经办人</span>
                  <span><img :src="tableData.operatorSign" alt=""/></span>
                  <span>{{ tableData.operatorTime }}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="right">
          <div class="top">审核意见</div>
          <div class="content">
            <el-input  type="textarea" :rows="5" v-model="suggestion"></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirm">确 定</el-button>
              <el-button @click="handleClose">取 消</el-button>
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "LiveApprove",
  props: {
    peoples: {
      type: Array,
      default: [
        {
          elderName: ""
        }
      ]
    }
  },
  data() {
    return {
      dialog: false,
      tableData:{
        elderName:'',
        checkinDate:'',
        checkoutDate:'',
        relationName:'',
        mobilePhone:'',
        relationType:'',
        relationMobilePhone:'',
        checkoutRemark:'',
        guarantorSign:'',//担保人签字图片地址
        operatorSign:'',//经办人签字图片地址
        leaderSign:''
      },
      current: 0,
      // peoples: ["张宇", "苏大强", "李冰冰", "张大强"],
      suggestion: "同意离院"
    };
  },

  filters: {
    nothingFilter: val => {
      if (!val) {
        return "";
      } else {
        return val;
      }
    }
  },
  created() {
    //this.tableData = this.getLeaveDetail(this.peoples[0].elderId);
  },
  methods: {
    tabChange(people, i) {
      this.current = i;
      this.getLeaveDetail(people.elderId)
    },
    async confirm() {
      if (this.suggestion) {
        const param = {
          elderId: this.tableData.elderId,
          leaderRemark: this.suggestion
        };
        const res = await axios.fetch(
          "elderServer",
          "/elderCheckout/leader/signature",
          param
        );
        if (res.code == 200) {
          if (this.peoples.length > 1) {
            this.peoples.splice(this.current, 1);
            this.current = 0;
            this.tableData = this.peoples[0];
            this.suggestion = "同意离院";
          } else {
            this.dialog = false;
            this.peoples = [];
            this.tableData = {};
          }
          this.$message.success("审核成功");
        }
      } else {
        this.$message.warning("请填写审核意见");
      }
    },
    handleClose(done) {
      this.dialog = false;
      this.current = 0;
      this.suggestion = "同意离院";
    },
    async getLeaveDetail(id){
      const res = await axios.fetch('elderServer','/elderCheckout/reception/get/serviceEnd',{
        elderId:id
      })
      if(res.code == 200){
        this.tableData = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.leave-approve {
  td {
    padding: 0;
    margin: 0;
  }
  /deep/ .el-dialog {
    margin-top: 12px;
    border-radius: 8px;
    height: 641px;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__header {
      height: 64px;
      line-height: 64px;
      padding: 0 0 0 24px;
      font-weight: 700;
      font-size: 20px;
    }
    .el-dialog__body {
      // flex: 1;
      height: 577px;
      padding: 0;
      display: flex;
      flex-direction: column;
      .header {
        max-height: 100px;
        overflow: auto;
        // height: 50px;
        padding: 9px 24px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        span {
          display: inline-block;
          width: 74px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          margin-right: 20px;
          color: rgba(51, 51, 51, 1);
          cursor: pointer;
        }
        span.current {
          background-color: #3f51b5ff;
          color: rgba(255, 255, 255, 1);
        }
      }
      .dialog-main {
        display: flex;
        flex: 1;
        height: 520px;
        .left,
        .right {
          overflow: auto;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          .top {
            height: 64px;
            line-height: 64px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
          }
          .content {
            flex: 1;
          }
        }

        /*滚动条样式*/
        .left::-webkit-scrollbar {
          width: 6px;
        }
        .left::-webkit-scrollbar-thumb {
          border-radius: 6px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }
        .left {
          width: 72%;
          border-right: 1px solid rgba(0, 0, 0, 0.25);
          .content {
            // overflow: auto;
            .tableCss {
              width: 100%;
              margin-bottom: 24px;
              // height: 100%;
            }
            .tableCss tr td {
              font-family: PingFangSC-Medium, PingFang SC;
              font-size: 14px;
              height: 42px;
              line-height: 42px;
              padding: 0 0 0 16px !important;
              border: 1px solid #ebeef5;
              text-align: left;
              color: #333333ff;
              font-weight: 700;
            }
            .tableCss tr td.grey {
              background-color: rgba(248, 248, 248, 1);
              color: #666666ff;
              font-weight: 400;
            }
            .tableCss .special-tr {
              td:nth-child(1) {
                position: relative;
                span {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  display: inline-block;
                  width: 20px !important;
                  margin: 0 auto;
                  line-height: 24px;
                }
              }
              td:nth-child(2) {
                position: relative;
                line-height: 168px;
                height: 168px;
                color: #666666ff;
                font-weight: 400;
                span:nth-child(1) {
                  font-weight: 600;
                  color: #333333ff !important;
                }
                span:nth-child(2) {
                  line-height: 22px;
                  height: 22px;
                  position: absolute;
                  right: 124px;
                  bottom: 60px;
                }
                span:nth-child(3) {
                  width: 100px;
                  height: 40px;
                  position: absolute;
                  // background-color: pink;
                  right: 16px;
                  bottom: 48px;
                  img {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                  }
                }
                span:nth-child(4) {
                  // width: 100px;
                  height: 22px;
                  line-height: 22px;
                  position: absolute;
                  // background-color: pink;
                  right: 24px;
                  bottom: 16px;
                }
              }
            }
          }
        }
        .right {
          flex: 1;
          .content {
            .el-textarea {
              box-sizing: border-box;
              height: 118px;
              padding: 0 8px 10px 12px;
              background: rgba(255, 255, 255, 1);
              border-radius: 4px;
              border: 1px solid rgba(220, 223, 230, 1);
              margin-bottom: 32px;
              .el-textarea__inner {
                padding: 0;
                border: none;
              }
            }
            .dialog-footer {
              .el-button {
                width: 100px;
                height: 36px;
                line-height: 12px;
                font-weight: 500;
                color: #333333ff;
              }
              .el-button:nth-child(1) {
                color: rgba(255, 255, 255, 1);
                background-color: #3f51b5ff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
