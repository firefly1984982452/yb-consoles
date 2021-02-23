<!--批量打印预览页面-->
<template>
  <div>
    <component v-for="item in forms" :key="item" :is="item" :elderData="elderData"></component>
    <div class="tips" v-if="!forms || !forms.length">没有选择任何页面</div>
  </div>
</template>

<script>
import axios from "axios";
import printComponents from './forms'

const list = {};
printComponents.forEach(group => {
  group.children.forEach(item => {
    if(item.component) {
      list[item.name] = item.component;
    }
  });
});

export default {
  components: list,
  data() {
    return {
      forms: [],
      elderId: "",
      elderData: {
        elderId: "",
        baseInfo: {}, //基础信息和入住管理的数据
        familyData: {}, //家属信息
        healthInfo: {}, //健康状况
        careAssess: [] //照护评估
      }
    }
  },
  created() {
    let fns = this.$route.query.forms;
    if(fns) {
      this.forms = fns.split(',');
    }
    this.elderId = this.$route.query.elderId;
    this.elderData.elderId = this.elderId;
    this.initData();
  },
  methods:{
    //初始化本页面的数据
    initData(){
      // this.baseAndCheckIn();
      // this.familyInfo();
      // this.healthCondition();
      Promise.all([this.baseAndCheckIn(),this.familyInfo(),this.healthCondition()]).then(res=>{
        console.log(res);
        this.elderData.baseInfo = res[0].data[0];
        this.elderData.familyData = res[1].data?res[1].data.filter(v=>{return v.isAgent==true})[0]:[];
        this.elderData.healthInfo = res[2].data?res[2].data:{};
      })
      this.getEstimateId();
    },
    //基础信息和入住管理的数据
    baseAndCheckIn(){
      let data = {
        elderId: this.elderId
      };
      return axios.fetch('elderServer', '/elderInfo/all', data)
      // .then(res => {
        // return res;
        // this.elderData.baseInfo = res.data[0];
			// });
    },
    //家属信息
    familyInfo(){
      let data = {
        elderId: this.elderId
      };
      return axios.fetch('elderServer', '/elderRelation/all', data)
      // .then(res => {
        // return res;
        // this.elderData.familyData = res.data.filter(v=>{return v.isAgent==true})[0];
			// });
    },
    //健康状况
    healthCondition(){
      let data = {
        elderId: this.elderId
      };
      return axios.fetch('elderServer', '/elderMedical/all', data)
      // .then(res => {
        // return res;
        // this.elderData.healthInfo = res.data;
			// });
    },
    //获取estimateId
    getEstimateId(){
      let data = {
        elderId: this.elderId
      };
      axios
      .fetch('elderServer', "/elderEstimate/newest", data)
      .then(res => {
        if(res.data){
          let estimateId = res.data.estimateId;
          this.careAssess(estimateId);
        }
      })
    },
    //照护评估
    careAssess(estimateId){
      let data = {
        estimateId: estimateId
      };
      axios
      .fetch("elderServer", "/elderEstimate/item", data)
      .then(res => {
        this.elderData.careAssess = res.data;
      });
    },
  }
}
</script>

<style scoped>
.tips {
  text-align: center;
}
</style>