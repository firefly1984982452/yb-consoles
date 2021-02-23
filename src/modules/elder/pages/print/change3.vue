<template>
  <div class="page confirm_table1" stype="over-flow:hidden;">
    <h2 class="title">{{changeInfo.tenantName}}变更确认表</h2>
    <table cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td class="center" width="15%">姓名</td>
        <td class="center" width="35%">{{changeInfo.elderName}}</td>
        <td class="center" width="15%">性别</td>
        <td class="center" width="35%">{{ changeInfo.gender }}</td>
      </tr>
      <tr>
        <td class="center">出生年月</td>
        <td class="center">{{changeInfo.birthDay}}</td>
        <td class="center">区域床号</td>
        <td class="center">{{changeInfo.area}}-{{changeInfo.roomName}}-{{changeInfo.bedName}}</td>
      </tr>
      <tr>
        <td class="center">房间床位</td>
        <td colspan="3" v-if="changeInfo.printBedVos.length>0">
          <p>床位：{{changeInfo.area}}-{{changeInfo.roomName}}-{{changeInfo.bedName}}</p>
          <p>托管费：{{changeInfo.printBedVos[0].currentBedFee}}元/月</p>
          <p>计费时间：{{ $moment(changeInfo.printBedVos[0].currentStart).format('YYYY-MM-DD') }}</p>
        </td>
        <td colspan="3" v-else>
          <p>无</p>
        </td>
      </tr>
      <tr>
        <td class="center">照护等级</td>
        <td colspan="3" v-if="changeInfo.estimatePrintVos.length>0">
          <p>等级：{{changeInfo.estimatePrintVos[0].currentDescription}}</p>
          <p>增加项目：{{ changeInfo.printNursingVos[0].add | otherFilter}}</p>
          <p>减少项目：{{ changeInfo.printNursingVos[0].subtract | otherFilter}}</p>
          <p>护理费：{{changeInfo.printNursingVos[0].currentNursingFee}}元/月</p>
          <p>计费时间：{{ $moment(changeInfo.printNursingVos[0].currentStart).format('YYYY-MM-DD') }}</p>
        </td>
        <td colspan="3" v-else>
          <p>无</p>
        </td>
      </tr>
      <tr>
        <td class="center">外出约定</td>
        <td colspan="3">
          <p v-if="changeInfo.agreeOutPrintVos.length == 0">
            无
          </p>
          <p v-else>
            <span v-if="changeInfo.agreeOutPrintVos[0].currentDescription == '同意'">
              <p>同意老人自主外出</p>
              <p>家属及长者承担外出期间发生意外或突发事件的全部责任</p>
            </span>
            <span v-if="changeInfo.agreeOutPrintVos[0].currentDescription == '不同意'">
              <p>不同意老人自主外出</p>
            </span>
          </p>
        </td>
      </tr>
      <tr>
        <td class="center">发药约定</td>
        <td colspan="3">
          <p v-if="changeInfo.agreeMedicinePrintVos.length == 0">
            无
          </p>
          <p v-else>
            <span v-if="changeInfo.agreeMedicinePrintVos[0].currentDescription == '同意'">
              <p>同意委托院方为老人外出就医配药按医嘱发放</p>
            </span>
            <span v-if="changeInfo.agreeMedicinePrintVos[0].currentDescription == '不同意'">
              <p>不同意委托院方为老人外出就医配药按医嘱发放</p>
            </span>
          </p>
        </td>
      </tr>
      <tr>
        <td class="center">特殊照护</td>
        <td colspan="3" v-if="!changeInfo.securityRisk&&!changeInfo.securityProtected">
          <p>无</p>
        </td>
        <td colspan="3" v-else>
          <p>安全风险：{{ changeInfo.securityRisk | otherFilter }}</p>
          <p>安全措施：{{ changeInfo.securityProtected | otherFilter }}</p>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div style="width:250px;float:right">
            <p>担保人（签字）：<img v-if="changeInfo.guarantorSign" :src="changeInfo.guarantorSign" style="display:inline-block;width:40px;height:20px;" alt=""></p>
            <p v-if="changeInfo.guarantorTime !== null">{{changeInfo.guarantorTime}}</p>
            <p v-else><span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</p>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      elderId: "",
      createTime: "",
      changeInfo: {}
    };
  },
  created() {
    // if (this.$route.query.createTime) {
    this.elderId = this.$route.query.elderId;
    this.createTime = this.$route.query.createTime;
    // }
    this.getChangeData();
  },
  filters: {
    otherFilter: function(value) {
      return value ? value : "无";
    }
  },
  methods: {
    //老人变更事项数据
    getChangeData() {
      let data = {
        elderId: this.elderId,
        createTime: this.$route.query.createTime
      };
      axios.fetch("elderServer", "/elderChange/print", data).then(res => {
        this.changeInfo = res.data;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.page {
  page-break-after: never;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
p {
  line-height: 2.5em;
}
.confirm_table1 p {
  line-height: 2em;
}
.confirm_table2 p {
  line-height: 2.3em;
}
.confirm_table3 p {
  line-height: 1.8em;
}
.confirm_table3 {
  /deep/ td {
    padding: 8px 10px;
  }
}
.measure {
  font-size: 18px;
  h2 {
    margin: 30px 0 50px;
  }
  .first_div {
    padding-bottom: 40px;
    border-bottom: 1px dotted black;
    margin-bottom: 50px;
  }
  .measure_content {
    text-indent: 2em;
    margin: 3em 0;
  }
  .sign_date {
    text-align: right;
    .sign_date_div {
      display: inline-block;
      text-align: center;
      p {
        line-height: 40px;
      }
    }
  }
}
span {
  &.info {
    display: inline-block;
    vertical-align: top;
    height: 21px;
    line-height: 21px;
    text-align: center;
    border-bottom: 1px solid #333;
    width: 100px;
  }
  &.info1 {
    display: inline-block;
    vertical-align: top;
    height: 21px;
    line-height: 21px;
    text-align: center;
    border-bottom: 1px solid #333;
    width: 50px;
  }
  &.info2 {
    display: inline-block;
    vertical-align: top;
    height: 21px;
    line-height: 21px;
    text-align: center;
    border-bottom: 1px solid #333;
    width: 50px;
  }
  &.info3 {
    display: inline-block;
    vertical-align: top;
    height: 2em;
    line-height: 3em;
    text-align: center;
    border-bottom: 1px solid #333;
    width: 80px;
  }
}
.pline {
  h2 {
    font-weight: normal;
  }
  p {
    width: 100%;
    border-bottom: 1px solid #333;
    height: 37px;
    line-height: 38px;
  }
}
</style>