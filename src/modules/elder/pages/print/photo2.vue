<template>
<div>
  <div class="page">
    <h2 class="title">担保人身份证</h2>
    <div class="img-box">
      <img v-if="elderData.familyData.photoCardFront" :src="elderData.familyData.photoCardFront" /><img v-else />
      <img v-if="elderData.familyData.photoCardBack" :src="elderData.familyData.photoCardBack"/><img v-else />
      <p>联系电话：{{elderData.familyData.mobilePhone}}</p>
    </div>
  </div>
  <div class="page">
    <h2 class="title">担保人户口簿</h2>
    <div class="img-box">
      <img v-if="elderData.familyData.photoResidenceHome" :src="elderData.familyData.photoResidenceHome"/><img v-else />
      <img v-if="elderData.familyData.photoResidenceSelf" :src="elderData.familyData.photoResidenceSelf"/><img v-else />
    </div>
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
      console.log(this.elderData)
      this.assembleData();
    },
    methods:{
      //处理数据
      assembleData(){
      },
    },
  }
</script>

<style scoped>
.img-box{
  width: 100%;
  margin: 0 auto;
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
img{
  width:450px;
  height:300px;
}
</style>