<template>
  <div>
    <div class="page td_title">
      <h2 class="title">出院流转表</h2>
      <table cellspacing="0" cellpadding="0" class="table">
        <tbody>
          <tr>
            <td>老人信息</td>
            <td>
              <p>现有
                <span v-if="elderCheckoutFlowVo.buildingName">{{elderCheckoutFlowVo.buildingName}}</span><span v-else>_________</span>部门
                <span v-if="elderCheckoutFlowVo.roomName">{{elderCheckoutFlowVo.roomName}}</span><span v-else>________</span>室号
                <span v-if="elderCheckoutFlowVo.bedName">{{elderCheckoutFlowVo.bedName}}</span><span v-else>_________</span>床号
                <span v-if="elderCheckoutFlowVo.elderName">{{elderCheckoutFlowVo.elderName}}</span><span v-else>_________</span>老人，因下列原因
              </p>
              <p class="width22">
                <span><input type="checkbox" :checked="elderCheckoutFlowVo.checkoutRemark==='自动出院'?'checked':''" />自动出院</span>
                <span><input type="checkbox" :checked="elderCheckoutFlowVo.checkoutRemark==='本院死亡'?'checked':''" />本院死亡</span>
                <span><input type="checkbox" :checked="elderCheckoutFlowVo.checkoutRemark==='外院死亡'?'checked':''" />外院死亡</span>
                <span><input type="checkbox" :checked="elderCheckoutFlowVo.checkoutRemark==='其他'?'checked':''" />其他</span>
              </p>
              <p>
                <span>
                  申请人
                  <span v-if="elderCheckoutFlowVo.applyName">{{elderCheckoutFlowVo.applyName}}</span>
                  <span v-else>_________</span>
                </span>
                <span class="right">
                  <span v-if="elderCheckoutFlowVo.applyTime">{{elderCheckoutFlowVo.applyTime | dateFormat}}</span>
                  <span v-else>_____年____月_____日</span>
                </span>
              </p>
            </td>
          </tr>
          <tr>
            <td>护理部门</td>
            <td class="bottom">
              <span>
                负责人签字
                <span v-if="elderCheckoutFlowVo.nurseName">{{elderCheckoutFlowVo.nurseName}}</span>
                <span v-else>_________</span>
              </span>
              <span class="right">
                <span v-if="elderCheckoutFlowVo.nurseTime">{{elderCheckoutFlowVo.nurseTime | dateFormat}}</span>
                <span v-else>_____年____月_____日</span>
              </span>
            </td>
          </tr>
          <tr>
            <td>医务部门</td>
            <td class="bottom">
              <span>
                负责人签字
                <span v-if="elderCheckoutFlowVo.medicalName">{{elderCheckoutFlowVo.medicalName}}</span>
                <span v-else>_________</span>
              </span>
              <span class="right">
                <span v-if="elderCheckoutFlowVo.medicalTime">{{elderCheckoutFlowVo.medicalTime | dateFormat}}</span>
                <span v-else>_____年____月_____日</span>
              </span>
            </td>
          </tr>
          <tr>
            <td>总务部门</td>
            <td class="bottom">
              <span>
                负责人签字
                <span v-if="elderCheckoutFlowVo.generalName">{{elderCheckoutFlowVo.generalName}}</span>
                <span v-else>_________</span>
              </span>
              <span class="right">
                <span v-if="elderCheckoutFlowVo.generalTime">{{elderCheckoutFlowVo.generalTime | dateFormat}}</span>
                <span v-else>_____年____月_____日</span>
              </span>
            </td>
          </tr>
          <tr>
            <td>财务部门</td>
            <td class="bottom">
              <span>
                负责人签字
                <span v-if="elderCheckoutFlowVo.financeName">{{elderCheckoutFlowVo.financeName}}</span>
                <span v-else>_________</span>
              </span>
              <span class="right">
                <span v-if="elderCheckoutFlowVo.financeTime">{{elderCheckoutFlowVo.financeTime | dateFormat}}</span>
                <span v-else>_____年____月_____日</span>
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <p>入出院</p>
              <p>管理部门</p>
            </td>
            <td class="bottom">
              <span>
                负责人签字
                <span v-if="elderCheckoutFlowVo.businessName">{{elderCheckoutFlowVo.businessName}}</span>
                <span v-else>_________</span>
              </span>
              <span class="right">
                <span v-if="elderCheckoutFlowVo.businessTime">{{elderCheckoutFlowVo.businessTime | dateFormat}}</span>
                <span v-else>_____年____月_____日</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="remark right">{{nursingHomeName}}制</p>
      <p class="remark">注：1.护理部门负责老人生活用品等清理；医务部门负责对治疗费用结清；总务部门负责对伙食费等进行结清，财务部门负责总结账。</p>
      <p class="remark">2.入出院管理部门负责说明手续齐全可出院，并负责材料归档。</p>
    </div>
  </div>
</template>

<script>
import tenant from '@/components/_tenant';
export default {
  data() {
    return {
      elderId: "",
      elderCheckoutFlowVo: {}, //离院流转表
      elderServiceEndVo: {}, //服务终结表
      nursingHomeName:''
    };
  },
  created() {
		tenant.fetchCurrentTenant().then(t => {
			this.nursingHomeName = t.tenantName; // 租户名称
		});
    this.elderId = this.$route.query.elderId;
    this.initData();
  },
  methods: {
    //初始化数据
    initData() {
      let data = {
        elderId: this.elderId
      };
      axios.fetch("elderServer", "/elderCheckout/print", data).then(res => {
        this.elderCheckoutFlowVo = res.data.elderCheckoutFlowVo;
        this.elderServiceEndVo = res.data.elderServiceEndVo;
      });
    }
  },
  filters: {
    dateFormat: date => {
      if (date) {
        date = date.split(" ")[0];
        date =
          date.split("-")[0] +
          "年" +
          date.split("-")[1] +
          "月" +
          date.split("-")[2] +
          "日";
      } else {
        date = "";
      }
      return date;
    }
  }
};
</script>
<style lang="less" scoped>
.fontWeight {
  font-weight: bold;
}
.singleWord {
  width: 1em;
  line-height: 36px;
}
.width22 {
  span {
    display: inline-block;
    width: 22%;
  }
}
.applicant {
  padding-left: 50px;
  text-align: left;
  span {
    line-height: 30px;
    display: block;
    input {
      margin-right: 10px;
    }
  }
}
.record {
  position: relative;
  .handleName {
    position: absolute;
    bottom: 20%;
    min-width: 200px;
    right: 3%;
    font-size: 18px;
    text-align: left;
    display: flex;
    line-height: 40px;
    height: 40px;
    img.leaderSign {
      width: 80px;
      height: 40px;
      line-height: 40px;
    }
  }
  .handTime {
    position: absolute;
    bottom: 0;
    right: 10%;
  }
}
.signTable {
  td {
    height: 1.3em;
  }
}
.td_title table {
  tr td {
    text-align: left;
    &.bottom {
      vertical-align: bottom;
    }
    .right {
      float: right;
      margin-right: 30%;
    }
  }
  tr td:first-child {
    width: 2em;
    padding: 30px;
    line-height: 30px;
    font-size: 20px;
  }
  tr:last-child td:first-child {
    width: 4em;
    padding: 15px;
  }
}
table td {
  text-align: center;
}
p {
  margin: 10px 0;
  &.remark {
    font-size: 12px;
  }
  &.right {
    text-align: right;
  }
}
</style>