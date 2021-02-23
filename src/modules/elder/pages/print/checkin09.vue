<template>
  <div class="page">
    <h2 class="title">长者住养告知书</h2>
    <p>({{elderData.baseInfo.elderName}})老人，出生于：{{elderData.baseInfo.birthDay | dateFormat}}，因家属无能力给予老人生活照料，自愿加入{{elderData.baseInfo.tenantName}}。 <span v-if="elderData.healthInfo">老人经过体检显示患有{{elderData.healthInfo.medicalCurrent}}等疾病，</span>经{{elderData.baseInfo.tenantName}}首次评估老人为{{elderData.baseInfo.nursingLevel | levelFilter}}生活照料的护理等级。 </p>
    <h2>我们承诺：</h2>
    <p class="in">我们认可{{elderData.baseInfo.tenantName}}的服务现状和首次评估的{{elderData.baseInfo.nursingLevel | levelFilter}}，我们自愿将{{elderData.baseInfo.elderName}}老人，委托{{elderData.baseInfo.tenantName}}给予老人{{elderData.baseInfo.nursingLevel | levelFilter}}生活起居照料， 承诺{{elderData.baseInfo.elderName}}老人住{{elderData.baseInfo.tenantName}}住养期间由于自身疾病或者老人自身生理机能衰退而引起的后果，均由为担保人承担，与{{elderData.baseInfo.tenantName}}无涉。 且承诺：将会根据院方管理制度及消防管理，要求积极配合院方做好老人的相关工作，不携带和存放易燃易爆物品。 </p>
    <table class="tab9">
      <tr><td width="50%">以上告知本人均已知晓</td><td width="50%"></td></tr>
      <tr><td></td><td class="right">住养老人：<img class="sign" v-if="elderData.baseInfo.elderSign" :src="elderData.baseInfo.elderSign" alt="" /><img v-else class="sign" style="visibility:hidden" /></td></tr>
      <tr><td ></td><td  class="right">担保人（家属）：<img class="sign" v-if="elderData.baseInfo.guarantorSign" :src="elderData.baseInfo.guarantorSign" alt="" /><img v-else class="sign" style="visibility:hidden" /></td></tr>
      <tr><td ></td><td class="right"><h2>{{elderData.baseInfo.checkinDate | dateFormat}}</h2></td></tr>
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
.sign{
  width: 100px;
  height: 70px;
}
  .right {
    display: flex;
    justify-content: flex-end;
    padding-right: 100px;
  }
  p{
    line-height: 35px;
    &.in{
      text-indent: 2em;
    }
  }
  h2{
    line-height: 30px;
    margin:20px 0 0;
  }
  .tab9{
    width:100%;
    line-height: 30px;
    margin: 20px 0;
    tr{
      td{
        padding-left: 30px;
        &:last-child{
          text-align: center;
          h2{
            font-size: 20px;
            font-weight: normal;
          }
        }
      }
    }
  }
</style>