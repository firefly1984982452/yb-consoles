<template>
  <div>
  <div class="page">
    <h2 class="title">安置通知单（食堂）</h2>
    <p>
      膳食组：<br/>      
      现有一名老人安排至你处，请做好一切准备。<br/>      
      姓名 {{elderData.baseInfo.elderName}} ，性别 {{elderData.baseInfo.gender}}，生日 {{elderData.baseInfo.birthDay | dateFormat}}，民族 {{elderData.baseInfo.nation}}<br/>      
      膳食 普食<br/>      
      入院时间：{{elderData.baseInfo.checkinDate | dateFormat}}<br/>      
      入房时间：{{elderData.baseInfo.checkinDate | dateFormat}}<br/>      
      护理等级：{{elderData.baseInfo.nursingLevel | levelFilter}}<br/>
      主要疾病：{{elderData.healthInfo.medicalCurrent}}
    </p>
    <p class="btm">{{elderData.baseInfo.tenantName}}业务处</p>
    <p class="btm shearLine">日期：{{elderData.baseInfo.checkinDate | dateFormat}}</p>

     <h2 class="title">安置通知单（食堂）</h2>
    <p>
      膳食组：<br/>      
      现有一名老人安排至你处，请做好一切准备。<br/>      
      姓名 {{elderData.baseInfo.elderName}} ，性别 {{elderData.baseInfo.gender}}，生日 {{elderData.baseInfo.birthDay | dateFormat}}，民族 {{elderData.baseInfo.nation}}<br/>      
      膳食 普食<br/>      
      入院时间：{{elderData.baseInfo.checkinDate | dateFormat}}<br/>      
      入房时间：{{elderData.baseInfo.checkinDate | dateFormat}}<br/>      
      护理等级：{{elderData.baseInfo.nursingLevel | levelFilter}}<br/>
      主要疾病：{{elderData.healthInfo.medicalCurrent}}
    </p>
    <p class="btm">{{elderData.baseInfo.tenantName}}业务处</p>
    <p class="btm">日期：{{elderData.baseInfo.checkinDate | dateFormat}}</p>
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
      //院方护理等级
      levelFilter: val => {
				if(val == 0) {
					val = "无护理";
				} else if(val == 1) {
					val = "护理一级";
				} else if(val == 2) {
					val = "护理二级";
				} else if(val == 3) {
					val = "护理三级";
				} else if(val == 4) {
					val = "护理四级";
				} else if(val == 5) {
					val = "护理五级";
				}else if(val == 6) {
					val = "护理六级";
				}
				return val;
			},
    }
  }
</script>
<style lang="less" scoped>
 .shearLine {
    border-bottom:1px dotted black;
    padding-bottom:20px;
  }
h2{
  &.title{
    // border-bottom: 1px solid #333;

    margin-bottom: 20px;
  }
}
p{
  line-height: 33px;
  &.btm{
    text-align: right;
    padding-right: 20px;
  }
}
</style>