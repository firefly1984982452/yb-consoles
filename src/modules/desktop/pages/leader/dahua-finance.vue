<template>
  <div class="yz-dahua">
    <el-row :gutter="20" class="container-top">
      <el-col :span="16" class="top-left">
        <div class="today">
          <header class="header">
            <i></i>
            <span>今日动态</span>
          </header>
          <main class="today-main">
            <div class="top">
              <ul>
                <li v-for="(item, i) in todayDynamic" :key="i">
                  <p>{{ todayDynamic[i].itemValue }}</p>
                  <p>{{ todayDynamic[i].title }}</p>
                </li>
              </ul>
            </div>
            <!-- 今日动态-账单数据 -->
          </main>
        </div>
        <div class="approval">
          <header class="header">
            <i></i>
            <span>待办事项</span>
          </header>
          <main class="approval-main">
            <ul>
              <li @click="handleApprove('bill_approve')">
                <p>{{ billCheckItemValue }}</p>
                <p>账单审核</p>
              </li>
              <li @click="handleApprove('bill_receive')">
                <p>{{ billReceviceItemValue }}</p>
                <p>帐单收款</p>
              </li>
              <li @click="handleApprove('qingjia')">
                <p>{{ vacateRecordItemValue }}</p>
                <p>请假记帐</p>
              </li>
              <li style="visibility: hidden;"></li>
              <li style="visibility: hidden;"></li>
            </ul>
          </main>
        </div>
      </el-col>
      <el-col :span="8" class="top-right">
        <div class="tip">
          <header class="header">
            <i></i>
            <span>温馨提示</span>
          </header>
          <mian class="tip-main">
            <template v-if="tips.length > 0">
              <div v-for="(tip, i) in tips" :key="i" @click="checkDetail(tip)" class="has-content">
                <span v-if="tip.messageFrom == 1002" class="live">住</span>
                <span v-else-if="tip.messageFrom == 1004" class="leave">离</span>
                <span v-else-if="tip.messageFrom == 1001" class="meeting">会</span>
                <span v-else-if="tip.messageFrom == 1003" class="elder-birth">寿</span>
                <span v-else-if="tip.messageFrom == 1005" class="birth">员</span>
                <span v-else class="else">订</span>
                <span v-if="tip.messageFrom == 1003 || tip.messageFrom == 1005">
                  <i v-if="tip.title" class="markTodayBirth">{{ tip.title | nameFilter }}&nbsp;&nbsp;</i>
                  {{ tip.description | nameFilter }}
                </span>
                <span v-else>{{ tip.title }}</span>
                <span v-if="tip.messageFrom == 1001">
                  <i class="el-icon-arrow-right"></i>
                </span>
                <span v-if=" tip.messageFrom == 1002 || tip.messageFrom == 1004 ">
                  {{ tip.fromStatus }}
                  <i class="el-icon-arrow-right"></i>
                </span>
              </div>
            </template>
            <div v-else class="no-content">
              <div></div>
              <p>今日暂无温馨提示</p>
            </div>
          </mian>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="container-bottom" style="margin:0!important;">
      <el-col :span="16" class="temp1">
        <div class="watch">
          <header class="header">
            <i></i>
            <span>数据统计</span>
          </header>
          <main class="bottom">
            <ul>
                <li v-for="(item, i) in billItemValue" :key="i" @click="handleShowBill(i)">
                  <span>
                    <img v-if="i === 0" src="../../../../assets/images/yingshou.png" alt />
                    <img v-if="i === 1" src="../../../../assets/images/shishou.png" alt />
                    <img v-if="i === 2" src="../../../../assets/images/qiankuan.png" alt />
                  </span>
                  <span>
                    <p>{{ item.tilte }}&nbsp;{{ item.itemValue }}&nbsp;人</p>
                    <p>{{ item.default | moneyFilter }}</p>
                  </span>
                </li>
            </ul>
          </main>
        </div>
      </el-col>
      <el-col :span="8" class="temp2">
        <div class="warning">
          <header class="header">
            <i></i>
            <span>异常提醒</span>
          </header>
          <main class="warning-main">
            <template v-if="warnings.length > 0">
              <div v-for="(warning, i) in warnings" :key="i" class="has-content" @click="
                warning.messageFrom==2001
                  ? checkWarnigDetail(warning)
                  : null
              ">
                <span :class="{
                  i_red: warning.messageFrom == 2001,
                  i_yellow: warning.messageFrom == 2002,
                  i_purple: warning.messageFrom == 2004 || warning.messageFrom == 2003
                }"></span>
                <span>
                  <!-- <i :class="warning.elderName.length == 2 ? 'w2' : 'w3'"> -->
                  <i>
                    <!-- {{ warning.elderName | elderNameForamt }} -->
                  </i>
                  &nbsp;{{ warning.title }}&nbsp;&nbsp;{{ warning.description }}
                </span>
                <span v-if="warning.messageFrom == 2001">
                  {{ warning.fromStatus }}
                  <i class="el-icon-arrow-right"></i>
                </span>
              </div>
            </template>
            <div v-else class="no-content">
              <div></div>
              <p>今日暂无异常</p>
            </div>
          </main>
        </div>
      </el-col>
    </el-row>
    <LiveApprove ref="live" />
    <LeaveApprove ref="leave" />
    <AccidentApprove ref="accident" :showLeft="showLeft" />
    <Contract ref="contract" :title="title" />
    <Care ref="care" :title="title" />
    <Long ref="long" :title="title" />
    <BillApprove ref="bill_approve" :title="title" />
    <BillReceive ref="bill_receive" :title="title" />
    <QingJia ref="qingjia" :title="title" />
    <Meeting ref="meeting" />
    <LeaveProgress ref="leave_progress" />
    <LiveProgress ref="live_progress" />
    <LiveCheck ref="live_check" />
  </div>
</template>

<script type="text/javascript">
/**审批事项 */
import LiveApprove from "./dialog/live"; //入院审批
import LeaveApprove from "./dialog/leave"; // 离院审批
import AccidentApprove from "./dialog/accident"; // 事故审批
/**督办事项 */
import Contract from "./dialog/contract-delay"; //合同延长
import Long from "./dialog/long-nurse"; //长护险
import Care from "./dialog/care-evaluate"; //照护评估
import BillApprove from "./dialog/bill-approve"; // 账单审核
import BillReceive from "./dialog/bill-approve"; //账单收款
import QingJia from "./dialog/qingjia"; //请假记账
/**温馨提示 */
import Meeting from "./dialog/meeting"; //会议详情弹框
import LeaveProgress from "./dialog/leave-progress"; //离院进度弹框
import LiveProgress from "./dialog/live-progress"; //入院进度弹框
import LiveCheck from "./dialog/live-check"; //入院审批--新的
export default {
  name: "DaHua",
  components: {
    LiveApprove,
    LeaveApprove,
    AccidentApprove,
    Contract,
    Care,
    Long,
    BillApprove,
    BillReceive,
    QingJia,
    Meeting,
    LiveProgress,
    LeaveProgress,
    LiveCheck
  },
  filters: {
    // 格式化两个字名字
    elderNameForamt: function(value) {
      if (value.length == 2) {
        return value.slice(0, 1) + " " + value.slice(1);
      } else {
        return value;
      }
    },
    // 格式钱1,111.00
    moneyFilter: function(money) {
      if (money && money != null && money != "*****") {
        money = String(money);
        var left = money.split(".")[0],
          right = money.split(".")[1];
        right = right
          ? right.length >= 2
            ? "." + right.substr(0, 2)
            : "." + right + "0"
          : ".00";
        var temp = left
          .split("")
          .reverse()
          .join("")
          .match(/(\d{1,3})/g);
        return (
          (Number(money) < 0 ? "-" : "") +
          temp
            .join(",")
            .split("")
            .reverse()
            .join("") +
          right
        );
      } else if (money === 0) {
        //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
        return "0.00";
      } else {
        return money || "";
      }
    }
  },
  data() {
    return {
      showLeft: true,
      // 今日动态数据
      todayDynamic: [
        {
          title: "预约探视",
          itemValue: 0
        },
        {
          title: "预订床位",
          itemValue: 0
        },
        {
          title: "新进长者",
          itemValue: 0
        },
        {
          title: "离院长者",
          itemValue: 0
        },
        {
          title: "收款（0人）",
          itemValue: 0
        }
      ],
      // 今日动态--账单数据
      billItemValue: [
        {
          tilte: "当月应收",
          imgUrl: "../../../../assets/images/yingshou.png",
          default: "*****",
          itemValue: 0,
          itemValue1: 0
        },
        {
          tilte: "当月实收",
          imgUrl: "../../../../assets/images/shishou.png",
          default: "*****",
          itemValue: 0,
          itemValue1: 0
        },
        {
          tilte: "累计欠款",
          imgUrl: "../../../../assets/images/qiankuan.png",
          default: "*****",
          itemValue: 0,
          itemValue1: 0
        }
      ],
      // 审批事项 itemValue
      approvalItemValue: [
        {
          title: "入院",
          itemValue: 0,
          data: [{ elderName: "" }]
        },
        {
          title: "离院",
          itemValue: 0,
          data: [{ elderName: "" }]
        },
        {
          title: "事故",
          itemValue: 0
        },
        {
          title: "请假",
          itemValue: "开发中"
        },
        {
          title: "采购",
          itemValue: "开发中"
        },
        {
          title: "领料",
          itemValue: "开发中"
        }
      ],
      dialogData: [], // 弹框需要的数据
      // 合同延长数据
      contractItemValue: 0,
      // 照护评估数据
      careItemValue: 0,
      // 长护险数据
      longItemValue: 0,
      receivableAmounts: "", // 账单审核&账单收款弹框中的应收款
      //账单审核
      billCheckItemValue: 0,
      // 账单审核-详细数据
      billCheckData: [],
      //账单收款
      billReceviceItemValue: 0,
      billReceviceData: [],
      // 请假记账
      vacateRecordItemValue: 0,
      // vacateRecordData: [],

      // 温馨提示
      tips: [
        // {
        //   type:'live',
        //   status:'办理中'
        // }
      ],
      // 异常提醒
      warnings: [],
      // 弹框标题
      title: ""
    };
  },
  // created() {
  //   this.getWorkbench();
  //   this.initData();
  //   this.getBookingData();
  //   // this.getVacateRecordData();
  //   this.getTips();
  // },
  created(){
    this.getData();
    const timer = setInterval(this.getData, 60000);
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {            
        clearInterval(timer);                              
    })
  },
  methods: {
    getData(){
      this.getWorkbench();
      this.initData();
      this.getBookingData();
      // this.getVacateRecordData();
      this.getTips();
    },
    sizeWatch() {
      var offsetWid = document.documentElement.clientWidth;
      var offsetHei = document.documentElement.clientHeight;
      if (offsetWid < 1300) {
        this.$refs.accident.width = "66%";
      } else {
        this.$refs.accident.width = "47%";
      }
    },
    // 初始化数据
    async initData() {
      const data = {
        category: "机构数据",
        dataType: "工作台数据统计",
        value: ""
      };

      const res = await axios.fetch(
        "statServer",
        "/stat/getStatResultsByIssueValue",
        data
      );
      // if (data.category === "机构数据") {
      for (var i = 0; i < res.data.length; i++) {
        let title = res.data[i].title;
        switch (title) {
          // 预定床位
          case "已预定床位":
            this.todayDynamic[1].itemValue = res.data[i].itemValue;
            break;
          // 新进长者
          case "今日入院":
            this.todayDynamic[2].itemValue = res.data[i].itemValue;
            break;
          // 离院长者
          case "今日离院":
            this.todayDynamic[3].itemValue = res.data[i].itemValue;
            break;
          // 本日收款
          case "实收":
            this.todayDynamic[4].itemValue = res.data[i].itemValue2;
            this.todayDynamic[4].title = '收款（'+res.data[i].itemValue1+'人）';
            break;
          // 应收
          case "应收":
            this.billItemValue[0].itemValue = res.data[i].itemValue1;
            this.billItemValue[0].itemValue1 = res.data[i].itemValue2;
            break;
          // 本月实收
          case "本月收款":
            this.billItemValue[1].itemValue = res.data[i].itemValue1;
            this.billItemValue[1].itemValue1 = res.data[i].itemValue2;
            break;
          // 欠款
          case "欠费":
            this.billItemValue[2].itemValue = res.data[i].itemValue1;
            this.billItemValue[2].itemValue1 = res.data[i].itemValue2;
            break;
          /**审批事项 */
          case "入院":
            this.approvalItemValue[0].itemValue = res.data[i].itemValue;
            break;
          case "离院":
            this.approvalItemValue[1].itemValue = res.data[i].itemValue;
            break;
          case "事故":
            this.approvalItemValue[2].itemValue = res.data[i].itemValue;
            break;
          /** 督办事项 */
          // case "合同延长":
          //   this.contractItemValue = res.data[i].itemValue;
          //   break;
          // case "照护评估":
          //   this.careItemValue = res.data[i].itemValue;
          //   break;
          case "长护险评估":
            this.longItemValue = res.data[i].itemValue;
            break;
          // case "账单审核":
          //   this.billCheckItemValue = res.data[i].itemValue;
          //   break;
          // case "账单收款":
          //   this.billReceviceItemValue = res.data[i].itemValue;
          //   break;
          case "请假记账":
            this.vacateRecordItemValue = res.data[i].itemValue;
            break;
          default:
            break;
        }
      }
      // }
    },
    getWorkbench () {
      // 已审核
      axios.fetch('financeServer', "/accountBill/workbench", {status:0}).then(res => {
        this.billCheckItemValue = res.data.elderNum;
      })
      // 已收款
      axios.fetch('financeServer', "/accountBill/workbench", {status:1}).then(res => {
        this.billReceviceItemValue = res.data.elderNum;
      })
    },
    //
    handleShowBill(index) {
      if (this.billItemValue[index].default == "*****") {
        this.billItemValue[index].default = this.billItemValue[
          index
        ].itemValue1;
      } else {
        this.billItemValue[index].default = "*****";
      }
    },
    // 处理审批事项&&督办事项中点击事件
    handleApprove(name) {
      this.dialogData = [];
      switch (name) {
        // 入院
        case "入院":
          this.getLiveData();
          break;
        case "离院":
          this.getLeaveData();
          break;
        // 事故
        case "事故":
          this.getAccidents();
          break;
        // 合同延长
        case "contract":
          if (this.contractItemValue) {
            this.getContractData();
            this.title = "合同延长";
            this.$refs.contract.dialog = true;
          } else {
            this.$message("暂无数据");
          }
          break;
        // 照护评估
        case "care":
          if (this.careItemValue) {
            this.getCareData();
            this.title = "照护评估";
            this.$refs.care.dialog = true;
          } else {
            this.$message("暂无数据");
          }
          break;
        // 长护险
        case "long":
          if (this.longItemValue) {
            this.getLongData();
            this.title = "长护险评估";
            this.$refs.long.dialog = true;
          } else {
            this.$message("暂无数据");
          }
          break;
        // 账单审核
        case "bill_approve":
          if (this.billCheckItemValue) {
            this.getBillCheckData();
            this.title = "账单待审核";
            this.$refs.bill_approve.dialog = true;
          } else {
            this.$message("暂无数据");
          }
          break;
        // 账单收款
        case "bill_receive":
          if (this.billReceviceItemValue) {
            this.getBillReceviceData();
            this.title = "账单待收款";
            this.$refs.bill_receive.dialog = true;
          } else {
            this.$message("暂无数据");
          }
          break;
        // 请假记账
        case "qingjia":
          if (this.vacateRecordItemValue) {
            this.title = "请假记账";
            this.getVacateRecordData();
          } else {
            this.$message("暂无数据");
          }
          break;
        default:
          this.$message("开发中,敬请期待!");
          break;
      }
    },
    // 查看温馨提示详情
    checkDetail(data) {
      // console.log(data.messageFrom);
      switch (data.messageFrom) {
        // 会议
        case 1001:
          this.getMeetingDetail(data.fromId);
          this.$refs.meeting.dialog = true;
          break;
        // 入住进度
        case 1002:
          this.getLiveProgress(data.fromId);
          this.$refs.live_check.detail = true;
          this.$refs.live_check.dialog = true;
          break;
        // 离院进度
        case 1004:
          this.getLeaveProgress(data.fromId).then(res => {
            this.$refs.leave_progress.elderFlows = res.data.elderFlows
              ? res.data.elderFlows
              : [];
            this.$refs.leave_progress.checkoutViewVo = res.data.checkoutViewVo
              ? res.data.checkoutViewVo
              : {
                  elderName: "",
                  checkoutRemark: "",
                  checkoutDate: ""
                };
            this.$refs.leave_progress.dialog = true;
          });
          break;
        // case 1002:
        //   this.$refs.live_progress.dialog = true;
        //   break;
        default:
          break;
      }
    },
    // 查看异常警告详情
    checkWarnigDetail(data) {
      // 事故详情
      if (data.messageFrom == 2001) {
        this.showLeft = false;
        this.$refs.accident.peoples = [];
        this.$refs.accident.status = data.fromStatus;
        this.sizeWatch();
        this.getAccidentDetail(data.fromId);
        this.$refs.accident.dialog = true;
      }
    },
    // 获取合同延长数据
    async getContractData() {
      const res = await axios.fetch("elderServer", "/elder/maxAll", {
        elderStatus: 100,
        day: 30,
        pageIndex: 1,
        pageSize: 999
      });
      // this.contractData = res.data;
      this.$refs.contract.tableData = res.data;
    },
    // 获取照护评估数据
    async getCareData() {
      const res = await axios.fetch(
        "elderServer",
        "/elderEstimate/elderMaxData",
        {
          day: 30,
          pageIndex: 1,
          pageSize: 999
        }
      );
      this.$refs.care.tableData = res.data;
    },
    // 获取长护险数据
    async getLongData() {
      const res = await axios.fetch("elderServer", "/elderChange/insurance", {
        day: 60,
        pageIndex: 1,
        pageSize: 99
      });
      this.$refs.long.tableData = res.data;
    },
    //获取账单审核数据
    async getBillCheckData() {
      const res = await axios.fetch("financeServer", "/accountBill/workbench",{status:0});
      this.$refs.bill_approve.tableData = res.data.billInfoWorkbenchVos;
      this.$refs.bill_approve.elderNum = res.data.elderNum;
      this.$refs.bill_approve.receivableAmounts = res.data.receivableAmounts;
    },
    //获取账单收款数据
    async getBillReceviceData() {
      const res = await axios.fetch(
        "financeServer",
        "/accountBill/workbench",
        {status:1}
      );
      this.$refs.bill_receive.tableData = res.data.billInfoWorkbenchVos;
      this.$refs.bill_receive.elderNum = res.data.elderNum;
      this.$refs.bill_receive.receivableAmounts = res.data.receivableAmounts;
    },
    //获取请假记账数据
    async getVacateRecordData() {
      const res = await axios.fetch(
        "elderServer",
        "/elderCheckin/infoWorkbenchElderLeave"
      );
      // this.vacateRecordData = res.data;
      this.$refs.qingjia.tableData = res.data;
      this.$refs.qingjia.dialog = true;
    },
    // 获取预约探视数据
    async getBookingData() {
      const res = await axios.fetch(
        "familyServer",
        "/booking/getVisitBookingsTwo",
        {
          area:'',
          date: this.$moment().format("YYYY-MM-DD")
        }
      );
      this.todayDynamic[0].itemValue = res.data.visitBookingViews.length;
    },
    // 获取入院长者数据
    async getLiveData() {
      const res = await axios.fetch("elderServer", "/elderCheckin/workbench");
      if (res.data.length > 0) {
        this.$refs.live.peoples = res.data;
        this.$refs.live.tableData = res.data[0];
        this.$refs.live.dialog = true;
      } else {
        this.$message.warning("暂没有入院需要审批!");
      }
    },
    // 获取离院长者数据
    async getLeaveData() {
      const res = await axios.fetch(
        "elderServer",
        "/elderCheckin/workbenchCheckout"
      );
      if (res.data.length > 0) {
        this.approvalItemValue[1].data = res.data;
        this.$refs.leave.peoples = res.data;
        this.getLeaveDetail(res.data[0].elderId);
        this.$refs.leave.dialog = true;
      } else {
        this.$message.warning("暂没有离院需要审批!");
      }
    },
    // 获取温馨提示和异常数据
    async getTips() {
      const res = await axios.fetch("oaServer", "/oaMessage/all");
      this.tips = res.data.filter(item => {
        return item.messageType === 1;
      });
      this.warnings = res.data.filter(item => {
        return item.messageType === 2;
      });
    },
    // 获取事故数据
    async getAccidents() {
      const res = await axios.fetch("elderServer", "/elderAccident/query", {
        pageIndex: 1,
        pageSize: 99,
        status: 20
      });

      this.$refs.accident.peoples = res.data;
      if (res.data.length > 0) {
        this.getAccidentDetail(res.data[0].accidentId);
        this.showLeft = true;
        this.$refs.accident.width = "66%";
        this.$refs.accident.dialog = true;
      } else {
        this.$message.warning("暂时没有需要审核的事故!");
        return false;
      }
    },
    // 根据老人id调取事故详情
    async getAccidentDetail(id) {
      const res = await axios.fetch("elderServer", "/elderAccident/get", {
        accidentId: id
      });
      if (res.code == 200) {
        this.$refs.accident.tableData = res.data;
      }
    },
    // 获取入住进度数据
    async getLiveProgress(id) {
      const res = await axios.fetch("elderServer", "/elderFlow/all", {
        itemId: id,
        itemType: 0
      });
      // this.$refs.live_check.elderName = res.data.elderName;
      // this.$refs.live_check.checkinDate = res.data.checkinDate;
      // this.$refs.live_check.checkinRemark = res.data.checkinRemark;
      this.$refs.live_check.elderFlows = res.data.elderFlows
        ? res.data.elderFlows
        : [];
      this.$refs.live_check.checkinViewVo = res.data.checkinViewVo
        ? res.data.checkinViewVo
        : {
            elderName: "",
            checkinDate: "",
            buildingName: "",
            bedName: "",
            roomName: ""
          };
    },
    // 获取会议详情
    async getMeetingDetail(id) {
      const res = await axios.fetch("oaServer", "/oaBulletin/all", {
        bulletinId: id
      });
      this.$refs.meeting.detailData = res.data[0];
    },
    // 获取离院进度
    async getLeaveProgress(id) {
      const res = await axios.fetch(
        "elderServer",
        "/elderFlow/all",
        {
         itemId: id,
         itemType: 1
        }
      );
      return res;
    },
    // 获取离院老人信息
    async getLeaveDetail(id) {
      const res = await axios.fetch(
        "elderServer",
        "/elderCheckout/reception/get/serviceEnd",
        {
          elderId: id
        }
      );
      if (res.code == 200) {
        this.$refs.leave.tableData = res.data;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.yz-dahua {
  .deving {
    visibility: hidden;
  }
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /** 共同式样 */
  .today,
  .approval,
  .tip,
  .watch,
  .warning {
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    flex: 1;
    .header {
      position: relative;
      height: 56px;
      line-height: 56px;
      padding-left: 20px;
      i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        width: 20px;
        height: 20px;
        // background-color: pink;
        background: url("../../../../assets/images/today.png") no-repeat 0 0;
      }
      span {
        margin-left: 32px;
      }
    }
  }
  /** 上部分式样 */
  .container-top {
    flex: 1;
    // display: flex;
    // justify-content: space-between;
    margin-bottom: 15px;
    max-height: 553px;
    // 左侧部分
    .top-left {
      // flex: 2;
      padding: 0 13px 0 10px !important;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // margin-right: 15px;
      .today {
        flex: 1;
        margin-bottom: 15px;
        &-main {
          flex: 1;
          .top {
            padding: 0 30px;
            ul {
              height: 100%;
              width: 100%;
              display: flex;
              li {
                width: 20%;
                text-align: center;
                padding: 16px 0;
                p:nth-child(1) {
                  font-size: 36px;
                  font-weight: 500;
                  color: rgba(0, 0, 0, 0.85);
                  line-height: 48px;
                }
                p:nth-child(2) {
                  font-size: 16px;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 0.45);
                  line-height: 22px;
                }
              }
            }
          }
        }
      }
      .approval {
        height: 215px;
        .header {
          i {
            background: url("../../../../assets/images/pendding.png") no-repeat
              0 0;
          }
        }
        &-main {
          flex: 1;
          padding: 0 10px 36px 30px;
          ul {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            li {
              cursor: pointer;
              height: 110px;
              flex: 1;
              margin-right: 20px;
              border-radius: 4px;
              background-size: 100% 100% !important;

              p {
                text-align: center;
              }
              p:nth-child(1) {
                margin: 17px 0 10px;
                font-size: 36px;
                font-weight: 500;
                line-height: 48px;
              }
              p:nth-child(2) {
                font-size: 16px;
                font-weight: 400;
                line-height: 22px;
                color: rgba(0, 0, 0, 0.45);
              }
            }
          }
        }
      }
    }
    //  右侧部分
    .top-right {
      // flex: 1;
      height: 100%;
      // width: 625px;
      padding: 0 10px 0 2px !important;
      .tip {
        height: 100%;
        .header {
          i {
            background: url("../../../../assets/images/tip.png") no-repeat 0 0;
          }
        }
        .tip-main {
          .markTodayBirth {
            color: red;
            font-style: normal;
          }
        }
      }
    }
  }

  /** 下部分式样 */
  .container-bottom {
    height: 313px;
    display: flex;
    justify-content: space-between;
    .temp1 {
      padding: 0 10px 0 0 !important;
      width: 66.66667%;
      .watch {
        display: flex;
        height: 100%;
        .header {
          i {
            background: url("../../../../assets/images/watch.png") no-repeat 0 0;
          }
        }
          .bottom {
            box-sizing: border-box;
            padding: 16px 52px 16px;
            height: 50%;
            ul {
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: space-between;
              li {
                cursor: pointer;
                width: 30%;
                padding: 15px 0;
                display: flex;
                span:nth-child(1) {
                  box-sizing: border-box;
                  display: inline-block;
                  width: 70px;
                  height: 70px;
                  background-color: #f3f8fdff;
                  margin-right: 15px;
                  text-align: center;
                  padding-top: 17px;
                  // margin-top: 17px;
                }
                span:nth-child(2) {
                  flex: 1;
                  p {
                    height: 50%;
                  }
                  p:nth-child(1) {
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.45);
                    line-height: 26px;
                    height: 26px;
                  }
                  p:nth-child(2) {
                    font-size: 30px;
                    font-weight: 500;
                    color: rgba(0, 0, 0, 0.85);
                    line-height: 36px;
                    height: 36px;
                  }
                }
              }
            }
          }
      }
    }
    .temp2 {
      width: 33.33333%;
      display: flex;
      padding: 0 0 0 5px !important;
      .warning {
        width: 100%;
        .header {
          i {
            background: url("../../../../assets/images/warning.png") !important;
          }
        }
        &-main {
          .has-content {
            span:nth-child(1) {
              border-radius: 4px !important;
            }
            .i_red {
              background-color: #fff1f0ff !important;
              background: url("../../../../assets/images/warning_red.png")
                no-repeat 50% 50%;
            }
            .i_yellow {
              background-color: #fffbe6ff !important;
              background: url("../../../../assets/images/warning_yellow.png")
                no-repeat 50% 50%;
            }
            .i_purple {
              background-color: #f9f0ffff !important;
              background: url("../../../../assets/images/warning_purple.png")
                no-repeat 50% 50%;
            }
          }
          .no-content {
            > div {
              background-image: url("../../../../assets/images/warnNoContent.png") !important;
            }
          }
        }
      }
    }
  }

  /**温馨提示&&异常提醒的共通式样 */
  .tip-main,
  .warning-main {
    padding: 0 10px 0 24px;
    flex: 1;
    overflow: auto;
    position: relative;
    .has-content {
      height: 64px;
      line-height: 64px;
      display: flex;
      flex-direction: row;
      cursor: pointer;
      // justify-content: space-between;
      span {
        display: inline-block;
      }
      span:nth-child(1) {
        margin-right: 12px;
        margin-top: 20px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        color: #fff;
        border-radius: 12px;
        font-size: 12px;
      }
      span:nth-child(1).leave {
        background-color: #d568dd;
      }
      span:nth-child(1).live {
        background-color: #27bfd2;
      }
      span:nth-child(1).meeting {
        background-color: #ff9f17;
      }
      span:nth-child(1).birth {
        background-color: #398ef5;
      }
      span:nth-child(1).elder-birth {
        background-color: #ff6775;
      }
      span:nth-child(1).else {
        background-color: #7c6bf3;
      }
      span:nth-child(2) {
        flex: 1;
        // width: 483px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
        i {
          text-align: center;
          font-style: normal;
        }
        i.w2 {
          letter-spacing: 0.3em;
          margin-right: -0.1em;
        }
      }

      span:nth-child(3) {
        font-size: 16px;
        width: 100px;
        text-align: right;
        line-height: 22px;
        height: 64px;
        line-height: 64px;
        color: #f49b31ff;
        cursor: pointer;
        position: relative;
        padding-right:15px;
        // text-align: right;
        i {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    .no-content {
      height: 125px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      width: 120px;
      margin: 0 auto;
      > div {
        // display:block;
        width: 110px !important;
        height: 90px !important;
        margin-bottom: 15px !important;
        background-image: url("../../../../assets/images/tipNoContent.png");
      }
      > p {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 20px;
        text-align: center;
      }
    }
  }
}
/*滚动条样式*/
.yz-dahua::-webkit-scrollbar,
.yz-desktop::-webkit-scrollbar,
.tip-main::-webkit-scrollbar,
.warning-main::-webkit-scrollbar {
  width: 4px;
}
.yz-dahua::-webkit-scrollbar-thumb,
.yz-desktop::-webkit-scrollbar-thumb,
.tip-main::-webkit-scrollbar-thumb,
.warning-main::-webkit-scrollbar-thumb {
  border-radius: 6px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
</style>
