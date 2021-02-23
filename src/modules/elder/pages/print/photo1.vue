<template>
<div>
  <div class="page">
    <h2 class="title">老年人身份证</h2>
    <div class="img-box">
      <img v-if="elderData.baseInfo.photoCardFront" :src="elderData.baseInfo.photoCardFront"/><img v-else />
      <img v-if="elderData.baseInfo.photoCardBack" :src="elderData.baseInfo.photoCardBack"/><img v-else />
    </div>
  </div>
  <div class="page">
    <h2 class="title">老年人户口簿</h2>
    <div class="img-box">
      <img v-if="elderData.baseInfo.photoResidenceHome" :src="elderData.baseInfo.photoResidenceHome"/><img v-else />
      <img v-if="elderData.baseInfo.photoResidenceSelf" :src="elderData.baseInfo.photoResidenceSelf"/><img v-else />
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