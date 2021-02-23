<template>
  <div class="page">
    <h2 class="title">入院申请表</h2>
    <table cellspacing="0" cellpadding="0" class="table">
      <tbody>
        <tr>
          <td>姓名</td>
          <td>{{elderData.baseInfo.elderName}}</td>
          <td>性别</td>
          <td>{{elderData.baseInfo.gender}}</td>
          <td>出生年月</td>
          <td>{{elderData.baseInfo.birthDay | dateFormat}}</td>
        </tr>
        <tr>
          <td>籍贯</td>
          <td>{{elderData.baseInfo.birthPlace}}</td>
          <td>民族</td>
          <td>{{elderData.baseInfo.nation}}</td>
          <td>身份证号</td>
          <td>{{elderData.baseInfo.cardNo}}</td>
        </tr>
        <tr>
          <td>政治面貌</td>
          <td colspan="3">{{elderData.baseInfo.polity}}</td>
          <td>社保卡号</td>
          <td colspan="2">{{elderData.baseInfo.insuranceNo}}</td>
        </tr>
        <tr>
          <td>婚姻状况</td>
          <td colspan="5"> 
            <input type="checkbox" :checked="elderData.baseInfo.marriage==='已婚'?'checked':''"/>已婚
            <input type="checkbox" :checked="elderData.baseInfo.marriage==='未婚'?'checked':''"/>未婚
            <input type="checkbox" :checked="elderData.baseInfo.marriage==='丧偶'?'checked':''"/>丧偶
            <input type="checkbox" :checked="elderData.baseInfo.marriage==='离异'?'checked':''"/>离异
          </td>
        </tr>
        <tr>
          <td>受教育程度</td>
          <td colspan="5">
            <input type="checkbox" :checked="elderData.baseInfo.educational==='小学及以下'?'checked':''"/>小学及以下
            <input type="checkbox" :checked="elderData.baseInfo.educational==='初中'?'checked':''"/>初中
            <input type="checkbox" :checked="elderData.baseInfo.educational==='高中'?'checked':''"/>高中
            <input type="checkbox" :checked="elderData.baseInfo.educational==='大专'?'checked':''"/>大专
            <input type="checkbox" :checked="elderData.baseInfo.educational==='本科'?'checked':''"/>本科
            <input type="checkbox" :checked="elderData.baseInfo.educational==='研究生及以上'?'checked':''"/>研究生及以上
          </td>
        </tr>
        <tr>
          <td>户口所在地</td>
          <td colspan="5">
            {{elderData.baseInfo.registerProvince}}{{elderData.baseInfo.registerCity}}
            {{elderData.baseInfo.registerDistrict}}{{elderData.baseInfo.registerStreet}}
            {{elderData.baseInfo.registerAddress}}
          </td>
        </tr>
        <tr>
          <td>现居住地址</td>
          <td colspan="5">
            {{elderData.baseInfo.residenceProvince}}{{elderData.baseInfo.residenceCity}}
            {{elderData.baseInfo.residenceDistrict}}{{elderData.baseInfo.residenceStreet}}
            {{elderData.baseInfo.residenceAddress}}
          </td>
        </tr>
        <tr>
          <td rowspan="3">联系人情况</td>
          <td>姓名</td>
          <td colspan="2">{{elderData.familyData.relationName}}</td>
          <td>与老人关系</td>
          <td colspan="2">{{elderData.familyData.relationType}}</td>
        </tr>
        <tr>
          <td>电话</td>
          <td colspan="2">{{elderData.familyData.mobilePhone}}</td>
          <td>邮政编码</td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td>联系地址</td>
          <td colspan="4">
            {{elderData.familyData.residenceProvince}}{{elderData.familyData.residenceCity}}
            {{elderData.familyData.residenceDistrict}}{{elderData.familyData.residenceAddress}}
          </td>
        </tr>
        <tr> 
          <td colspan="6">现病史介绍：<span v-if="elderData.healthInfo">{{ elderData.healthInfo.medicalCurrent}}</span></td>
        </tr>
        <tr>
          <td colspan="6">既往病史介绍：<span v-if="elderData.healthInfo">{{elderData.healthInfo.medicalHistory}}</span></td>
        </tr>
        <tr>
          <td colspan="6">
            <p>其他疾病：<span v-if="elderData.healthInfo">{{elderData.healthInfo.medicalOther}}</span></p>
          </td>
        </tr>
        <tr>
          <td>
            申请入住 <br> 原因
          </td>
          <td colspan="5">{{elderData.baseInfo.checkinRemark}}</td>
        </tr>
        <tr class="qianming">
          <td>
            申请人<br />签字
          </td>
          <td colspan="5" style="position:relative;">
            <!-- 委托人 -->
            <img v-if="elderData.baseInfo.guarantorSign" style="width:80px;height:40px;position:absolute;right:120px;" :src="elderData.baseInfo.guarantorSign" alt="">
            <span class="check-in-date">{{elderData.baseInfo.checkinDate}}</span>
          </td>
        </tr>
      </tbody>
    </table>
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
      console.log(this.elderData.healthInfo)
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
.check-in-date {
  float: right;
  margin: 70px 100px 0 0;
}
input{
  margin:0 2px 0 8px;
}
.qianming{
  height:170px;
}

</style>