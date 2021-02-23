<template>
  <div class="page page1">
    <h2 class="title">入院介绍</h2>
    <table cellspacing="0" cellpadding="0" class="table" border="1">
      <tr><td width="15%">长者姓名</td><td width="24%">{{elderData.baseInfo.elderName}}</td><td width="15%">性别</td><td width="8%">{{elderData.baseInfo.gender}}</td><td width="13%">  出生年月 </td><td width="25">{{elderData.baseInfo.birthDay | dateFormat}}</td></tr>
      <tr><td>入住日期</td><td>{{elderData.baseInfo.checkinDate | dateFormat}}</td><td>  住养区域 </td><td colspan="3">{{elderData.baseInfo.area}}-{{elderData.baseInfo.roomName}}-{{elderData.baseInfo.bedName}}</td></tr>
    </table>
    <p>尊敬的老人、家属、法定监护人、授权委托人：<br/>您好！<br/>欢迎入住我院，感谢您对我院的信任和支持。现对住养老人进行入院介绍，希望得到您的理解和配合，让我们共同创造一个温馨，和谐，快乐，健康的生活环境。</p>
    <h2>一、入住区域、医务人员、楼层主管、护理人员介绍</h2><br/>
    <h2>二、居室环境宣教</h2><p>1. 呼叫器<br/>2. 家用电器<br/>3. 橱柜、床、卫生设施<br/>4. 内务整理</p>
    <h2>三、安全健康宣教</h2><p>1. 健康状况：应如实的提供住养老人的身体状况、既往病史、药物过敏史及有关详情。<br/>2. 预防跌倒：如自身行走能力、穿着问题、思维问题、安全措施等<br/>3. 预防坠床：如思维混乱、躁动不安、自身能力、安全措施等<br/>4. 外出约定：根据护理级别而定，未签定“老人外出约定”的均不得擅自外出。<br/>5. 安全、正确的使用药物<br/>6. 老人心理与疾病的关系<br/>7. 饮食种类及注意事项<br/>8. 带管入院的注意事项</p>
    <h2>四、管理规章制度</h2><p>1. 住养老人出入院制度<br/>2. 常规工作时间和住养老人生活作息时间<br/>3. 请假制度<br/>4. 禁烟告示：住养老人禁止吸烟<br/>5. 物品管理规定：如不得使用电热毯，电热水袋，蜡烛等危险物品<br/>6. 携带物品规定：如不得携带贵重物品及大量现金，特殊情况交由院方保管<br/>7. 不得擅自调动床位<br/>8. 院方根据住养老人的身体状况或床位的供需情况做出护理区域床位调整<br/></p>
    <h2>五、其它</h2><p>1. 老人住养费，根据市场变化及本院实际进行调整，以院方统一调整时间为准。<br/>2. 新入住老人首月为试住观察期，观察期内不适应生活环境、危及自身或他人人身财产安全等将办理离院撤床手续，解除养老服务合同。</p>
    <p class="bm">
      <span>我已知晓上述入院的全部宣教内容</span><br/>
    </p>
    <div class="bottom">
      <div class="line-div"><span>住养老人（签名）：<img v-if="elderData.baseInfo.elderSign" style="width:80px;height:40px;" :src="elderData.baseInfo.elderSign"></span><span>担保人或授权委托人（签名）：<img v-if="elderData.baseInfo.guarantorSign" style="width:80px;height:40px;" :src="elderData.baseInfo.guarantorSign"></span></div>
      <div class="line-div"><span>宣&nbsp;教&nbsp;人（签&nbsp;名）：<img v-if="elderData.baseInfo.operatorSign" style="width:80px;height:40px;" :src="elderData.baseInfo.operatorSign"></span><span>宣教时间&nbsp;： {{elderData.baseInfo.checkinDate | dateFormat}}</span></div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      elderData: {
        type: Object,
        default() {
          return {
            elderId: "",
            baseInfo: {}, //基础信息和入住管理的数据
            familyData: {}, //家属信息
            healthInfo: {}, //健康状况
          };
        }
      }
    },
    data() {
      return {

      }
    },
    created(){
      this.assembleData();
    },
    methods:{
      //处理数据
      assembleData(){
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
    }
  }
</script>
<style lang="less" scoped>
.bottom {
  width: 70%;
  margin: 0 0 0 20px;
}
.line-div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.page1{
  p{
    line-height: 35px;
    padding: 0 0 20px 20px;
    margin:0 0 10px;
    h2{
      line-height: 40px;
      font-size: 30pxs;
    }
    span{
      font-size: 17px;
      font-weight: bold;
    }
    &.bm{
      border-bottom: none;
    }
  }
}

</style>