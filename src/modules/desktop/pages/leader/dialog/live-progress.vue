<template>
  <el-dialog
    class="live-progress"
    :visible.sync="dialog"
    append-to-body
    :width="width"
    top="0vh"
    title="入院进度"
    :before-close="handleClose"
  >
    <div class="progress">
      <el-row class="progress_baseInfo">
        <el-col :span="8">
          <span>{{elderName}}&nbsp;</span>
          <span>{{checkinRemark}}&nbsp;</span>
          <span>{{checkinDate}}</span>
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

      <el-row class="step-title">业务</el-row>
      <el-row class="progress_content">
        <el-steps space="124px" align-center>
          <el-step
            v-for="(item, index) in elderFlows"
            :key="index"
            icon
            :status="item.status"
            :description="item.statusDescripton"
          >
            <template slot="icon">
              <!-- <div style="text-align:left;left: 6%;margin-right: 0px;">
                <p>哈哈</p>
                <p style="margin-top:10px;">2020-05-18</p>
              </div> -->
              <!-- <img
                v-if="item.status == 0"
                src="../../../../../assets/images/grayCircle.png"
                style="width:20px;"
              /> -->
              <img
                v-if="item.status ==0 "
                src="../../../../../assets/images/yellowCircle.png"
                style="width:30px;"
              />
              <!-- <img v-if="item.currentStatus!=40&&item.status==='process'" src="../../../../../assets/images/click.png" @click="item.currentStatus==50?confirmBusiness():progressDialog()" style="width:30px;">  -->
              <img
                v-if="item.status == 1"
                src="../../../../../assets/images/tick.png"
                style="width:25px;"
              />
            </template>
          </el-step>
        </el-steps>
      </el-row>
      <el-row class="step-title">医务</el-row>
      <el-row class="progress_content">
        <el-steps space="124px" align-center>
          <el-step
            v-for="(item, index) in yiwuData"
            :key="index"
            icon
            :status="item.status"
            :description="item.statusDescripton"
          >
            <template slot="icon">
              <!-- <img
                v-if="item.status === 'wait'"
                src="../../../../../assets/images/grayCircle.png"
                style="width:20px;"
              /> -->
              <img
                v-if="item.status == 0"
                src="../../../../../assets/images/yellowCircle.png"
                style="width:30px;"
              />
              <!-- <img v-if="item.currentStatus!=40&&item.status==='process'" src="../../../../../assets/images/click.png" @click="item.currentStatus==50?confirmBusiness():progressDialog()" style="width:30px;">  -->
              <img
                v-if="item.status == 1"
                src="../../../../../assets/images/tick.png"
                style="width:25px;"
              />
            </template>
          </el-step>
        </el-steps>
      </el-row>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  name: "LiveProgress",
  data() {
    return {
      dialog: false,
      elderName:'',
      checkinDate:'',
      checkinRemark:'',
      elderFlows: [
        {
          statusDescripton: "长者信息",
          status: ""
        },
        {
          statusDescripton: "家属资料",
          status: ""
        },
        {
          statusDescripton: "评估等级",
          status: ""
        },
        {
          statusDescripton: "入住信息",
          status: ""
        },
        {
          statusDescripton: "照料服务",
          status: ""
        },
        {
          statusDescripton: "特殊防护",
          status: ""
        },
        {
          statusDescripton: "合同约定",
          status: ""
        }
      ],
      yiwuData: [
        {
          statusDescripton: "等级评估",
          status: ""
        },
        {
          statusDescripton: "健康档案",
          currentStatus: 40,
          status: ""
        }
      ],
      width:''
    };
  },
  components: {},
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
        this.width = '50%'
      }
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  padding: 10px 24px 30px;
}
.live-progress {
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
      }
    }
  }
}
</style>
