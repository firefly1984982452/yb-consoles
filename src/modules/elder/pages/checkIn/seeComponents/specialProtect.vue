<template>
  <el-card class="box-card" style="margin-bottom:100px;padding-top:30px;">
    <div id="oldManDetail" class="ziliqk ryNew" style="padding-top: 0;">
      <el-form label-width="125px" :rules="rules">
        <el-form-item label="安全风险" label-width="130px">{{securityRisk | nothingFilter}}</el-form-item>
        <el-form-item label="安全措施" label-width="130px">{{securityProtected | nothingFilter}}</el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
	import axios from "axios";
	export default {
    props: ["elderId","notEdit"],
		data() {
			return {
        securityRisk: "",
        securityProtected: ""
      }
    },
    created(){
      this.infoInit();
    },
		methods:{ 
      infoInit(){
        let data = {
          elderId: this.elderId
        }
        axios
        .fetch('elderServer', "/elderInfo/all", data)
        .then(res => {
          let resData = res.data[0];
          this.assembleInitData(resData);
        })
      },
      //处理初始化的数据
      assembleInitData(resData){
        this.securityRisk = resData.securityRisk?resData.securityRisk:"";
        this.securityProtected = resData.securityProtected?resData.securityProtected:"";
      },
    },
    filters: {
      nothingFilter: val=>{
        if(val===""){
          return "无"
        }else {
          return val
        }
      }
    }
  }
</script>

<style scoped>
 
</style>