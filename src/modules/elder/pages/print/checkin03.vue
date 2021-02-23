<template>
  <div class="page">
    <main :class="i===1?' shearLine':''" v-for="i in [1,2]" :key="i">
      <h2 class="title">入院通知单<span v-if="i===1">(存根)</span></h2>
      <p class="right">编号：{{elderData.baseInfo.checkinNo}}</p>
      <p>
        姓名：{{elderData.baseInfo.elderName}} 
        性别：{{elderData.baseInfo.gender}}
        出生年月：{{elderData.baseInfo.birthDay | dateFormat}}
      </p>
      <p>
        收养对象：寄养
      </p>
      <p>
        护理级别：{{elderData.baseInfo.nursingLevel | levelFilter}}
      </p>
      <p>
        家庭地址：
        <!-- {{elderData.baseInfo.registerProvince}}{{elderData.baseInfo.registerCity}}
        {{elderData.baseInfo.registerDistrict}}{{elderData.baseInfo.registerStreet}} -->
        {{elderData.baseInfo.residenceAddress}}
      </p>
      <p>
        联系人姓名：{{elderData.familyData.relationName}}
      </p>
      <p>
        地址：
        <!-- {{elderData.familyData.residenceProvince}}{{elderData.familyData.residenceCity}}
        {{elderData.familyData.residenceDistrict}} -->
        {{elderData.familyData.residenceAddress}}
      </p>
      <p>电话：{{elderData.familyData.mobilePhone}}</p>
      <p>通知于 {{elderData.baseInfo.checkinDate | dateFormat}}进院 {{elderData.baseInfo.roomName}}房间
         {{elderData.baseInfo.bedName}}床
      </p>
        <p class="right">{{nursingHomeName}}业务部</p>
        <p class="right">日期：{{elderData.baseInfo.checkinDate | dateFormat}}</p>
    </main>
  </div>
</template>

<script>
import tenant from '@/components/_tenant';
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
        checked: "",
        maritalStatus: ["已婚","未婚","丧偶","离异"],
        educationLevel: ["小学及以下","初中","高中","大专","本科","研究生及以上"],
        nursingHomeName:''
      }
    },
    created(){
      tenant.fetchCurrentTenant().then(t => {
        this.nursingHomeName = t.tenantName; // 租户名称
      });
      this.assembleData();
    },
    methods:{
      //处理数据
      assembleData(){
        this.elderData.baseInfo.marriage = [this.elderData.baseInfo.marriage];
        this.elderData.baseInfo.educational = [this.elderData.baseInfo.educational];
      }
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
<style scoped>
  .title {
    padding:10px 0;
  }
  .shearLine {
    border-bottom:1px dotted black;
    padding-bottom:10px;
  }
  p{
    padding-left: 100px;
    line-height: 40px;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    padding-right: 100px;
  }
</style>