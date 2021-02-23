<template>
  <div>
    <div class="page">
      <h2 class="title" style="padding-bottom:0;">上海市养老服务合同</h2>
      <h2 class="title" style="padding-top:0;">延长合同</h2>
      <p class="right">合同编号：<span v-if="contractInfo.checkinNo">{{contractInfo.checkinNo}}</span><span v-else>___________</span></p>
      <h4>甲 方 (养老机构): <span v-if="contractInfo.tenantName">{{contractInfo.tenantName}}</span><span v-else>______________________________________</span></h4>
      <h4>乙 方 (入住老年人): <span v-if="contractInfo.elderName">{{contractInfo.elderName}}</span><span v-else>____________________________________</span></h4>
      <h4>丙 方 (担保人): <span v-if="contractInfo.relationName">{{contractInfo.relationName}}</span><span v-else>________________________________________</span></h4>
      <p>甲乙双方于
        <!-- <span v-if="contractInfo.formerServiceStartDate">{{contractInfo.formerServiceStartDate | dateFormat}}</span> -->
        <span >___________</span>
        签订的《上海市养老服务合同》（以下简称合同书）在
        <!-- <span v-if="contractInfo.formerServiceEndDate">{{contractInfo.formerServiceEndDate | dateFormat}}</span -->
        <span>___________</span>
        到期，经双方友好协商达成如下延长协议：</p>
      <p>1. 延长合同从&nbsp;&nbsp;<span v-if="contractInfo.serviceEndDate">{{contractInfo.serviceStartDate | dateFormat}}</span><span v-else>___________</span>&nbsp;&nbsp;至&nbsp;&nbsp;<span v-if="contractInfo.serviceEndDate">{{contractInfo.serviceEndDate | dateFormat}}</span><span v-else>___________</span>。</p>
      <p>2. 合同书第三条第1款中的“托管费”原
        <span v-if="contractInfo.formerBedFee">{{contractInfo.formerBedFee}}</span>
        <span v-else>___________</span>元/月，已调整为
        <span v-if="contractInfo.bedFee">{{contractInfo.bedFee}}</span>
        <span v-else>___________</span>元/月（
        <span v-if="contractInfo.bedFee">{{contractInfo.bedFee | chineseFliter}}</span>
        <span v-else>___________</span>/月）；“护理费”原
        <span v-if="contractInfo.formerCareFee">{{contractInfo.formerCareFee}}</span>
        <span v-else>___________</span>元/月，已调整为
        <span v-if="contractInfo.careFee">{{contractInfo.careFee}}</span>
        <span v-else>___________</span>元/月（
        <span v-if="contractInfo.careFee">{{contractInfo.careFee | chineseFliter}}</span>
        <span v-else>___________</span>/月）；“膳食费”原
        <span v-if="contractInfo.formerDietFee">{{contractInfo.formerDietFee}}</span>
        <span v-else>___________</span>元/天，已调整为
        <span v-if="contractInfo.dietFee">{{contractInfo.dietFee}}</span>
        <span v-else>___________</span>元/天（
        <span v-if="contractInfo.dietFee">{{contractInfo.dietFee | chineseFliter}}</span>
        <span v-else>___________</span>/天）；“被褥费”
        <span v-if="contractInfo.beddingFee">{{contractInfo.beddingFee}}</span>
        <span v-else>___________</span>元/天，（
        <span v-if="contractInfo.beddingFee">{{contractInfo.beddingFee | chineseFliter}}</span>
        <span v-else>___________</span>/天）。
      </p>
      <p>3. 其他条款不做变动。</p>
      <p>4. 本合同一式二份，甲乙双方各执一份。</p>
      <table cellspacing="0" cellpadding="0">
        <tr><td width="50%">甲方（盖章）：{{contractInfo.tenantName}}</td><td width="25%">乙方：{{ contractInfo.elderName }}</td><td width="25%">丙方：{{ contractInfo.relationName }}</td></tr>
        <tr><td>经办人签名：</td><td>签名：</td><td>签名：</td></tr>
        <tr><td>签订日期：</td><td>日期:</td><td>日期:</td></tr>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        agreementId: "",
        contractInfo: {}
      }
    },
    created(){
      this.agreementId = this.$route.query.agreementId;
      this.contractData();
    },
    methods:{
      //老人延长合同数据
      contractData(){
        let data = {
          agreementId: this.agreementId
        };
        axios.fetch('elderServer', '/elder/agreement', data).then(res => {
          this.contractInfo = res.data;
        });
      },
    },
    filters: {
      dateFormat: date => {
        if(date) {
          date = date.split('-')[0]+'年'+date.split('-')[1]+'月'+date.split('-')[2]+'日';
        }else {
          date = "";
        }
        return date;
      },
      chineseFliter: val => {
        if(val) {
            var money = val;
            var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
            //基本单位
            var cnIntRadice = new Array('', '拾', '佰', '仟');
            //对应整数部分扩展单位
            var cnIntUnits = new Array('', '万', '亿', '兆');
            //对应小数部分单位
            var cnDecUnits = new Array('角', '分', '毫', '厘');
            //整数金额时后面跟的字符
            // var cnInteger = '整';
            var cnInteger = '';
            //整型完以后的单位
            var cnIntLast = '圆';
            //最大处理的数字
            var maxNum = 999999999999999.9999;
            //金额整数部分
            var integerNum;
            //金额小数部分
            var decimalNum;
            //输出的中文金额字符串
            var chineseStr = '';
            //分离金额后用的数组，预定义
            var parts;
            if (money == '') { return ''; }
            money = parseFloat(money);
            if (money >= maxNum) {
                //超出最大处理数字
                return '';
            }
            if (money == 0) {
                chineseStr = cnNums[0] + cnIntLast + cnInteger;
                return chineseStr;
            }
            //转换为字符串
            money = money.toString();
            if (money.indexOf('.') == -1) {
                integerNum = money;
                decimalNum = '';
            } else {
                parts = money.split('.');
                integerNum = parts[0];
                decimalNum = parts[1].substr(0, 4);
            }
            //获取整型部分转换
            if (parseInt(integerNum, 10) > 0) {
                var zeroCount = 0;
                var IntLen = integerNum.length;
                for (var i = 0; i < IntLen; i++) {
                    var n = integerNum.substr(i, 1);
                    var p = IntLen - i - 1;
                    var q = p / 4;
                    var m = p % 4;
                    if (n == '0') {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            chineseStr += cnNums[0];
                        }
                        //归零
                        zeroCount = 0;
                        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                    }
                    if (m == 0 && zeroCount < 4) {
                        chineseStr += cnIntUnits[q];
                    }
                }
                chineseStr += cnIntLast;
            }
            //小数部分
            if (decimalNum != '') {
                var decLen = decimalNum.length;
                for (var i = 0; i < decLen; i++) {
                    var n = decimalNum.substr(i, 1);
                    if (n != '0') {
                        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                    }
                }
            }
            if (chineseStr == '') {
                chineseStr += cnNums[0] + cnIntLast + cnInteger;
            } else if (decimalNum == '') {
                chineseStr += cnInteger;
            }
            return chineseStr;

        } else {
            val = "_____元"
        }
        return val
      },
    }
  }
</script>
<style lang="less" scoped>
// .remove_blank {
//   font-size: 0;
//   span {
//     font-size: 16px;
//   }
// }
.page {
  padding: 8% 5% 0;
}
h4{
  line-height: 36px;
}
p{
  text-indent: 2em;
  line-height: 30px;
  &.right{
    text-align: right;
    padding-right: 30px;
  }
}
table{
  width:100%;
  margin-top: 8px;
  text-align: left;
  tr{
    height:40px;
  }
}
</style>