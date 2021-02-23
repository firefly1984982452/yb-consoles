<template>
  <div>
    <!-- 事故审核 -->
    <el-dialog class="accident-approve" title="事故审核" :visible.sync="dialog" append-to-body :width="width" top="0vh" :before-close="handleClose">
      <div class="header">
        <span v-for="(item, i) in peoples" :class="{ current: current == i }" @click="tabChange(item.accidentId, i)" :key="i">{{ item.elderName }}</span>
      </div>
      <div class="dialog-main">
        <div class="left">
          <div class="part1">
            <p class="title">
              <span>{{ tableData.elderName }}&nbsp;</span>
              <span>{{ tableData.buildingName }}{{ tableData.roomName }}-{{ tableData.bedName }}&nbsp;</span>
              <span>{{ tableData.accidentName }}</span>
            </p>
            <p>
              <span>事故编号</span>
              <span>{{ tableData.accidentNo }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>发生日期</span>
              <span>{{ this.$moment(tableData.accidentTime).format('YYYY年MM月DD日') }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>护理员</span>
              <span>{{ tableData.employeeName }}</span>
            </p>
          </div>
          <div v-if="tableData.accidentDescription" class="part2">
            <p class="title">
              事故原因
              <span>{{ tableData.createTime }}</span>
              <span>{{ tableData.creatorName }}&nbsp;&nbsp;</span>
            </p>
            <p>
              {{ tableData.accidentDescription | nothiongFilter}}
            </p>
          </div>
          <div v-if="tableData.handleAdvice" class="part2">
            <p class="title">
              处理方案
              <span>{{ tableData.handleTime }}</span>
              <span>{{ tableData.handleName }}&nbsp;&nbsp;</span>
            </p>
            <p>
              {{ tableData.handleAdvice | nothiongFilter}}
            </p>
          </div>
          <div v-if="tableData.punishAdvice" class="part2">
            <p class="title">
              处罚方案
              <span>{{ tableData.punishTime }}</span>
              <span>{{ tableData.punishName }}&nbsp;&nbsp;</span>
            </p>
            <p>
              {{ tableData.punishAdvice | nothiongFilter }}
            </p>
          </div>
          <div class="part2" v-if="!showLeft&&tableData.leaderAdvice">
            <p class="title">
              审批建议
              <span>{{ tableData.leaderTime }}</span>
              <span>{{ tableData.leaderName }}&nbsp;&nbsp;</span>
            </p>
            <p>
              {{ tableData.leaderAdvice | nothiongFilter }}
            </p>
          </div>
        </div>
        <div class="right" v-if="showLeft">
          <div class="top">审核意见</div>
          <div class="content">
            <el-input type="textarea" :rows="5" v-model="suggestion"></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirm">审核通过</el-button>
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
    showLeft: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialog: false,
      status:'',
      width:'66%',
      current: 0,
      peoples: [],
      tableData: {},
      suggestion: "同意"
    };
  },
  created() {},
  filters: {
    nothiongFilter: function(value) {
      return value ? value : "无";
    }
  },
  methods: {
    tabChange(accidentId, i) {
      this.current = i;
      this.getAccidentDetail(accidentId);
    },
    async confirm() {
      const param = {
        status : this.tableData.status,
        handleResult: this.suggestion,
        accidentId: this.tableData.accidentId
      };
      if (this.suggestion) {
        const res = await axios.fetch(
          "elderServer",
          "/elderAccident/handle",
          param
        );
        if (res.code == 200) {
          if (this.peoples.length > 1) {
            this.peoples.splice(this.current, 1);
            this.current = 0;
            this.tableData = this.peoples[0];
            this.$message.success("审核成功");
            this.suggestion = "同意";
          } else {
            this.dialog = false;
            this.peoples = [];
            this.tableData = {};
          }
        }
      } else {
        this.$message.warning("请填写审核意见");
      }
    },
    handleClose(done) {
      this.dialog = false;
      this.current = 0;
      this.suggestion = "同意";
    },
    // 根据老人id调取事故详情
    async getAccidentDetail(id) {
      const res = await axios.fetch("elderServer", "/elderAccident/get", {
        accidentId: id
      });
      if (res.code == 200) {
        this.tableData = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.accident-approve {
  /deep/ .el-dialog {
    margin-top: 12px;
    border-radius: 8px;
    // height: 641px;
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
      flex: 1;
      padding: 0;
      display: flex;
      flex-direction: column;
      .header {
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
        // flex: 1;
        height: 520px;
        .left,
        .right {
          padding: 0 24px;
          overflow: auto;
          display: flex;
          flex-direction: column;
          .top {
            height: 64px;
            line-height: 64px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
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
          flex: 1;
          // width: 72%;
          border-right: 1px solid rgba(0, 0, 0, 0.25);
          .part1,
          .part2 {
            margin-bottom: 16px;
            .title {
              height: 40px;
              line-height: 40px;
              font-size: 16px;
              font-weight: 700;
              color: rgba(0, 0, 0, 0.85);
            }
            .title + p {
              font-size: 16px;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              line-height: 28px;
            }
          }
          .part2 {
            .title {
              span {
                float: right;
                font-size: 14px;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
              }
            }
          }
        }
        .right {
          width: 28%;
          .content {
            flex: 1;
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
