<template>
  <!-- 离院审核 -->
  <div>
    <el-dialog class="leave-check" title="离院审核" :visible.sync="dialog" append-to-body :width="width" top="0vh" :before-close="handleClose">
      <el-row class="header">
        <el-col :span="18" class="elder">
          <span v-for="(item, i) in peoples" :class="{ current: current == i }" @click="tabChange(item, i)" :key="i">
            {{ item.elderName }}
          </span>
        </el-col>
        <el-col :span="6" class="tuli">
          <el-row>
            <el-col :span="7">
              <img src="../../../../../assets/images/tickSign.png" />
              <span>已完成</span>
            </el-col>
            <el-col :span="8">
              <img src="../../../../../assets/images/yellowCircleSign.png" />
              <span>进行中</span>
            </el-col>
            <el-col :span="8">
              <img src="../../../../../assets/images/grayCircleSign.png" />
              <span>未开始</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="progress">
        <el-row class="progress_content">
          <el-steps align-center>
            <el-step v-for="(item, index) in elderFlows" :key="index" icon :status="item.status" :description="item.statusDescripton">
              <template slot="icon">
                <div style="text-align:center;margin-right: 0px;">
                  <p>{{item.handlerName}}</p>
                  <p style="margin-top:10px;font-size:10px;">{{ item.handleTime | dateFormat }}</p>
                </div>
                <template>
                  <img v-if="item.status == 0 && item.isCurrent" src="../../../../../assets/images/yellowCircle.png" />
                  <img v-if="item.status == 1" src="../../../../../assets/images/tick.png" />
                  <img v-if="item.status == 0 && !item.isCurrent" src="../../../../../assets/images/grayCircleSign.png" style="width:25px;" />
                </template>
              </template>
            </el-step>
          </el-steps>
          <div style="width:100%;">
            <!-- 信息和签名 -->
            <ul class="sign">
              <li v-for="(item,i) in elderFlows">
                <template v-if="item.remark">
                  <p v-for="o in item.remark.split('；')">{{o}}</p>
                </template>
                <template v-if="item.handlerSign">
                  <el-row v-for="(k,index) in item.handlerSign.split(';')" :key="index">
                    <img :src="k">
                  </el-row>
                </template>
              </li>
            </ul>
          </div>
        </el-row>
      </div>
      <div class="suggestion" v-if="!finish">
        <div class="tille">审核意见</div>
        <el-input v-model="suggestion" rows="5" type="textarea"></el-input>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!finish">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "LiveCheck",
  data() {
    return {
      elderName: "",
      checkinDate: "",
      checkinRemark: "",
      dialog: false,
      width: "66%",
      peoples: [],
      current: 0,
      finish: false, // 院长审核是否结束
      elderId: "",
      suggestion: "同意离院",
      elderFlows: []
    };
  },
  components: {},
  methods: {
    tabChange(tab, i) {
      console.log(tab);
      this.current = i;
      this.elderId = tab.elderId;
      this.getLeaveProgress(this.elderId);
    },
    confirm() {
      const param = {
        elderId: this.elderId,
        leaderRemark: this.suggestion,
        leaderSign: "//image.youbankeji.com/static/employee/1001.png"
      };
      if (this.suggestion) {
        this.$confirm("确认需要审核?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          const res = await axios.fetch(
            "elderServer",
            "/elderCheckout/leader/signature",
            param
          );
          if (res.code == 200) {
            //   if (this.peoples.length > 1) {
            this.$message.success("审核成功");
            this.getLeaveProgress(this.elderId);
            //   } else {
            //     this.dialog = false;
            //     this.peoples = [];
            //     this.tableData = {};
            //   }
          }
        });
      } else {
        this.$message.warning("请填写审核意见");
      }
    },
    handleClose(done) {
      this.dialog = false;
      this.current = 0;
    },
    // 获取离院进度数据
    async getLeaveProgress(id) {
      const res = await axios.fetch("elderServer", "/elderFlow/all", {
        itemId: id,
        itemType: 1
      });
      //  res.data.forEach(item => {
      //   item.handlerSign = 'https://image.youbankeji.com/static/employee/1001.png;https://image.youbankeji.com/static/employee/1001.png'
      // });
      this.elderFlows = res.data.elderFlows ? res.data.elderFlows : [];
      if (this.elderFlows[this.elderFlows.length - 1].status == 1) {
        this.finish = true;
      } else {
        this.finish = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.leave-check {
  /deep/ .el-dialog {
    border-radius: 8px;
    position: absolute;
    top: 50%;
    height: 70%;
    width: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    padding-bottom: 24px;
    /deep/ .el-dialog__title {
      color: black !important;
    }
    /deep/ .el-dialog__body {
      padding: 0;
    }
    .header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      padding: 12px 20px;
      height: 60px;
      .elder {
        height: 36px;
        overflow: auto;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
      .tuli {
        text-align: right;
        height: 100%;
        line-height: 32px;
        img {
          vertical-align: middle;
        }
      }
    }
    .progress {
      max-height: 300px;
      margin-top: 80px;
      .step-title {
        margin-top: 32px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
      }
      .progress_content {
        // background: #f6f7fa;
        // margin-top: 20px;
        padding: 24px 0 0;
        /deep/ .el-steps {
          .el-step {
            /deep/ .el-step__head.is-1 {
              /deep/ .el-step__line {
                background-color: #3f51b5 !important;
              }
            }
            .el-step__head {
              .el-step__icon {
                width: auto;
                background-color: #f6f7fa;
                border: none;
                div {
                  position: absolute;
                  bottom: 40px;
                  color: #666666;
                }
              }
            }
            .el-step__main {
              // text-align: left;
              // margin-right: 45%;
              .el-step__title.is-finish {
                color: #3f51b5;
                font-weight: bold;
              }
              .el-step__title.is-process {
                color: #f49b31;
              }
              .el-step__title.is-wait {
                color: #333333;
                font-weight: bold;
              }
              .el-step__description {
                padding: 0;
              }
              .el-step.is-center .el-step__line {
                left: 0;
                right: 0;
              }
              .el-step__description.is-finish,
              .el-step__description.is-process,
              .el-step__description.is-wait {
                color: #666666;
                margin-top: 10px;
              }
            }
          }
        }
        /deep/ .el-step__description {
          margin-top: 10px !important;
        }
        /deep/ .el-step__description.is-wait {
          color: #f49b31 !important;
        }

        /deep/ .el-step__description.is-1 {
          color: #3f51b5 !important;
        }
        .sign {
          display: flex;
          width: 100%;
          justify-content: space-around;
          li {
            width: 100%;
            text-align: center;
          }
          img {
            width: 64px;
            height: 32px;
          }
        }
      }
    }
    .suggestion {
      padding: 0 20px;
      height: 200px;
      .tille {
        color: black;
        font-weight: 500;
        font-size: 16px;
        padding: 24px 0;
      }
    }
    /deep/ .el-dialog__footer {
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .el-button {
        width: 100px;
        height: 36px;
      }
      .el-button:nth-child(1) {
        background-color: #3f51b5;
        border: 1px solid #3f51b5;
      }
    }
  }
}
</style>
