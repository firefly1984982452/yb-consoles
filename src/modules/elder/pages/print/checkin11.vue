<template>
  <div class="page">
    <h2 class="title">老人长护险事宜的知情告知书</h2>
    <h3>尊敬的家属您好：</h3>
    <p>欢迎您入住{{elderData.baseInfo.tenantName}}，如您已办理长护险，请您与上家机构尽快做好结算工作，并速将老人的“长护险转出单”交于本院，因未及时将“长护险转出单”交由本院，而影响到住养老人长护险结算情况的，后果自负！</p>
    <p>特此提示：谢谢您的配合！</p>
    <table cellspacing="0" cellpadding="0" class="table11">
      <tr><td width="50%">告知方：{{elderData.baseInfo.tenantName}}业务部  </td><td width="50%">被告知方住养老人：{{elderData.baseInfo.elderName}}</td></tr>
      <tr><td></td><td>担保人签名：<img v-if="elderData.baseInfo.guarantorSign" style="width:80px;height:40px;" :src="elderData.baseInfo.guarantorSign"></td></tr>
      <tr><td>{{elderData.baseInfo.checkinDate | dateFormat}}</td><td>{{elderData.baseInfo.checkinDate | dateFormat}}</td></tr>
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
h3{
  font-weight: normal;
  line-height: 40px;
}
p{
  text-indent: 2em;
  line-height: 40px;
}
.table11{
  margin-top: 20px;
  width:100%;
  tr{
    height: 40px;
    td{
      padding-left: 2em;
    }
  } 
}
</style>