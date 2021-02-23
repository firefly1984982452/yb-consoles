<template>
  <div>
    <!-- 入院审核 -->
    <el-dialog class="live-approve" title="入院审核" :visible.sync="dialog" append-to-body :width="width" top="0vh" :before-close="handleClose">
      <div class="header">
        <span v-for="(item, i) in peoples" :class="{ current: current == i }" @click="tabChange(item.elderName, i)" :key="i">{{ item.elderName }}</span>
      </div>
      <div class="dialog-main">
        <div class="left">
          <div class="top">入院审批表</div>
          <div class="content">
            <table class="tableCss">
              <tr>
                <td width="18%" class="grey">姓名</td>
                <td width="15%">{{ tableData.elderName | nothingFilter }}</td>
                <td width="15%" class="grey">性别</td>
                <td width="15%">{{ tableData.gender | nothingFilter }}</td>
                <td width="15%" class="grey">出生年月</td>
                <td>{{ tableData.birthDay | nothingFilter }}</td>
              </tr>
              <tr>
                <td class="grey">籍贯</td>
                <td>{{ tableData.birthPlace | nothingFilter }}</td>
                <td class="grey">民族</td>
                <td>{{ tableData.nation | nothingFilter }}</td>
                <td class="grey">身份证号</td>
                <td>{{ tableData.cardNo | nothingFilter }}</td>
              </tr>
              <tr>
                <td class="grey">政治面貌</td>
                <td>{{ tableData.polity | nothingFilter }}</td>
                <td class="grey">社保卡号</td>
                <td>{{ tableData.insuranceNo }}</td>
                <td class="grey">婚姻状况</td>
                <td>{{ tableData.marriage | nothingFilter }}</td>
              </tr>
              <tr>
                <td class="grey">受教育程度</td>
                <td colspan="5">{{ tableData.educational | nothingFilter }}</td>
              </tr>
              <tr>
                <td class="grey">户口所在地</td>
                <td colspan="5">
                  {{ tableData.registerAddress | nothingFilter }}
                </td>
              </tr>
              <tr>
                <td class="grey">现居住地址</td>
                <td colspan="5">
                  {{ tableData.residenceAddress | nothingFilter }}
                </td>
              </tr>
              <!-- <tr>
                <td rowspan="3" class="grey">联系人情况</td>
                <td class="grey">姓名</td>
                <td>{{ tableData.relationName | nothingFilter }}</td>
                <td colspan="2" class="grey">与老人关系</td>
                <td>{{ tableData.relationType | nothingFilter }}</td>
              </tr> -->
              <!-- <tr>
                <td class="grey">电话</td>
                <td>{{ tableData.relationMobilePhone | nothingFilter }}</td>
                <td colspan="2" class="grey">邮政编码</td>
                <td></td>
              </tr>
              <tr>
                <td class="grey">联系地址</td>
                <td colspan="4">
                  {{ tableData.relationResidenceAddress | nothingFilter }}
                </td>
              </tr> -->
              <tr height="84px">
                <td class="grey">老人体检结论</td>
                <td colspan="5" class="special-td">
                  <span>{{ tableData.reportResult | nothingFilter }}</span>
                  <span></span>
                  <span></span>
                  <span>医务负责人</span>
                  <span><img src="" alt="" /></span>
                </td>
              </tr>
              <tr height="84px">
                <td class="grey">护理等级评估</td>
                <td colspan="5" class="special-td">
                  <span>{{ tableData.nursingLevel | levelFilter }}</span>
                  <span></span>
                  <span></span>
                  <span>评估者</span>
                  <span><img src="" alt="" /></span>
                </td>
              </tr>
              <tr height="84px">
                <td class="grey">入出院管理部门意见</td>
                <td colspan="5" class="special-td">
                  <span>
                    <!-- {{
                    tableData.elderRemark
                  }} -->
                  </span>
                  <!-- <span v-else>无</span> -->
                  <p>入院编号&nbsp;{{ tableData.checkinNo | nothingFilter }}</p>
                  <p>
                    房间床位&nbsp;{{ tableData.buildingName | nothingFilter }}
                  </p>
                  <span>业务员</span>
                  <span><img src="" alt="" /></span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="right">
          <div class="top">审核意见</div>
          <div class="content">
            <el-input type="textarea" :rows="5" v-model="suggestion"></el-input>
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
      current: 0,
      tableData: {},
      suggestion: "同意入院",
      width: ""
    };
  },
  created() {
    this.tableData = this.peoples[0];
  },
  filters: {
    nothingFilter: val => {
      if (!val) {
        return "";
      } else {
        return val;
      }
    },
    levelFilter: val => {
      const arr = ["无护理", "一", "二", "三", "四", "五", "六"];
      if (val === 0) {
        return "无护理";
      }
      if (val === 1 || val === 2 || val === 3) {
        return `轻度（护理${arr[val]}级）`;
      }
      if (val === 4) {
        return `中度（护理${arr[val]}级）`;
      }
      if (val === 5 || val === 6) {
        return `重度（护理${arr[val]}级）`;
      }
    }
  },
  created() {
    this.sizeWatch();
  },
  methods: {
    sizeWatch() {
      var offsetWid = document.documentElement.clientWidth;
      var offsetHei = document.documentElement.clientHeight;
      if (offsetWid < 1300) {
        this.width = "80%";
      } else {
        this.width = "66%";
      }
    },
    tabChange(tab, i) {
      this.current = i;
      this.tableData = this.peoples[i];
    },
    async confirm() {
      const param = {
        elderId: this.tableData.elderId,
        leaderRemark: this.suggestion,
        leaderSign: "//image.youbankeji.com/static/employee/1001.png"
      };
      if (this.suggestion) {
        const res = await axios.fetch(
          "elderServer",
          "/elderCheckin/leader/signature",
          param
        );
        if (res.code == 200) {
          if (this.peoples.length > 1) {
            this.peoples.splice(this.current, 1);
            this.current = 0;
            this.tableData = this.peoples[0];
            this.$message.success("审核成功");
            this.suggestion = "同意入院";
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
      this.suggestion = "同意入院";
    }
  }
};
</script>

<style lang="less" scoped>
.live-approve {
  td {
    padding: 0;
    margin: 0;
  }
  /deep/ .el-dialog {
    margin-top: 12px;
    border-radius: 8px;
    height: 80%;
    overflow: auto;
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
        max-height: 100px;
        overflow: auto;
        padding: 9px 24px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
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
      .dialog-main {
        display: flex;
        flex: 1;
        .left,
        .right {
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
              font-weight: normal;
            }
            .tableCss tr .special-td {
              position: relative;
              line-height: 84px;
              height: 84px;
              color: #666666ff;
              font-weight: 400;
              span:nth-child(1) {
                font-size: 14px;
                font-weight: 600;
                color: black;
                line-height: 20px;
              }
              span:nth-child(4) {
                line-height: 22px;
                height: 22px;
                position: absolute;
                right: 124px;
                bottom: 16px;
              }
              span:nth-child(5) {
                width: 100px;
                height: 40px;
                position: absolute;
                // background-color: pink;
                right: 16px;
                bottom: 12px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .tableCss tr:nth-last-child(1) .special-td {
              line-height: 22px !important;
              // p:nth-child(1) {
              //   font-size: 14px;
              //   font-weight: 600;
              //   color: black;
              //   line-height: 20px;
              // }
              p {
                font-size: 14px;
                font-weight: 600;
                color: black;
                line-height: 20px;
                line-height: 22px !important;
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
