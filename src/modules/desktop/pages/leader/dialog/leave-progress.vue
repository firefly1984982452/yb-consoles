<template>
  <el-dialog class="leave-progress" :visible.sync="dialog" append-to-body :width="width" top="0vh" title="离院进度" :before-close="handleClose">
    <div class="progress">
      <el-row class="progress_baseInfo">
        <el-col :span="8">
          <span style="font-weight:700;">{{ checkoutViewVo.elderName }}&nbsp;</span>
          <span style="font-weight:700;">{{ checkoutViewVo.checkoutRemark }}&nbsp;</span>
          <span style="font-weight:700;">{{ checkoutViewVo.checkoutDate | dateFormat1 }}&nbsp;</span>
        </el-col>
        <el-col :span="16">
          <div>
            <img src="../../../../../assets/images/tickSign.png" />
            <span>已完成</span>
          </div>
          <div>
            <img src="../../../../../assets/images/yellowCircleSign.png" />
            <span>进行中</span>
          </div>
          <div>
            <img src="../../../../../assets/images/grayCircleSign.png" />
            <span>未开始</span>
          </div>
        </el-col>
      </el-row>

      <el-row class="progress_content">
        <el-steps space="20%" align-center>
          <el-step v-for="(item, index) in elderFlows" :key="index" :title="item.statusDescripton" icon space="10%" :status="item.status">
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
          <ul class="description">
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
  </el-dialog>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "LeaveProgress",
  data() {
    return {
      dialog: false,
      checkoutViewVo: {
        elderName: "",
        checkoutRemark: "",
        checkoutDate: ""
      },
      elderFlows: [],
      width: ""
    };
  },
  components: {},
  filters: {
    dateFormat: value => {
      if (value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    dateFormat1: value => {
      if (value) {
        return moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    }
  },
  created() {
    this.sizeWatch();
  },
  methods: {
    // 监听屏幕大小
    sizeWatch() {
      var offsetWid = document.documentElement.clientWidth;
      var offsetHei = document.documentElement.clientHeight;
      if (offsetWid < 1300) {
        this.width = "66%";
      } else {
        this.width = "66%";
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  padding: 10px 24px 30px;
}
.leave-progress {
  /deep/ .el-dialog {
    border-radius: 8px;
    position: absolute;
    top: 50%;
    width: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    padding-bottom: 24px;
    .title {
      position: absolute;
      top: 0;
      height: 72px;
      line-height: 72px;
      font-size: 20px;
      font-weight: 500;
      color: #222222ff;
    }
    .el-dialog__header {
      font-weight: 700;
    }

    .progress {
      //   padding: 20px;
      .progress_baseInfo {
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        height: 40px;
        line-height: 40px;
        .el-col-8 {
          span {
            font-size: 16px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            line-height: 24px;
          }
        }
        .el-col-16 {
          display: flex;
          justify-content: flex-end;
          div {
            display: flex;
            align-items: center;
            height: 30px;
            color: #333333;
            margin-right: 35px;
            img {
              margin-right: 10px;
              position: relative;
              top: 3px;
            }
          }
          div:last-child {
            margin-right: 0;
            img {
              top: 0;
            }
          }
        }
      }
      .progress_content {
        // background: #f6f7fa;
        margin-top: 20px;
        padding: 120px 0 30px;
        /deep/ .el-steps {
          .el-step {
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
      }
      .description {
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
}
</style>
