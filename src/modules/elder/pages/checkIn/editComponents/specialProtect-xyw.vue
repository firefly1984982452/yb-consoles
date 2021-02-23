<template>
  <el-card class="box-card" style="margin-bottom:100px;padding-top:30px;">
    <div id="oldManDetail" class="ziliqk ryNew" style="padding-top: 0;">
      <el-form label-width="125px" :rules="rules"  :disabled="notEdit==true">
        <el-form-item label="安全风险" label-width="130px">
          <el-radio-group v-model="securityRisk" @change="noRisk">
            <el-radio v-for="(item,index) in risks" :key="index" :label="item">{{item}}</el-radio>
          </el-radio-group>
          <el-input v-model="otherRisk" class="input_width" :disabled="securityRisk!='其他'"></el-input>
        </el-form-item>
        <el-form-item label="安全措施" label-width="130px">
          <el-checkbox-group v-model="securityProtected" :disabled="securityRisk==='无'">
            <el-checkbox v-for="(item,index) in measures" :key="index" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
          <el-input v-model="otherProtected" class="input_width" :disabled="securityProtected.includes('其他')==false"></el-input>        
        </el-form-item>
      </el-form>
    </div>
    
    <el-row class="handleBtn"  v-if="!notEdit">
      <el-button type="success" plain @click="save()">保存</el-button>
      <el-button  @click="$router.go(-1)">取消</el-button>
    </el-row>
  </el-card>
</template>

<script>
	import axios from "axios";
	export default {
    props: ["elderId","notEdit"],
		data() {
			return {
        securityRisk: "",
        securityProtected: [],
        otherRisk: "",
        otherProtected: "",
        risks: ["无","摔跤骨折或造成意外甚至生命危险","其他"],
        measures: ["保护带（防止长者从轮椅滑落）","手套（防止长者误拉鼻饲管或尿袋）","安睡宝（防止长者坠床）","其他"]
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
        this.securityProtected = resData.securityProtected?resData.securityProtected.split(','):[];
        //安全风险
        if(this.securityRisk!="无"&&this.securityRisk!="摔跤骨折或造成意外甚至生命危险"&&this.securityRisk!=""){
          this.securityRisk = "其他";
          this.otherRisk = resData.securityRisk;
        }
        //安全措施
        if(this.securityProtected.length>0){
          for(let i=0; i< this.securityProtected.length; i++){
            if(this.securityProtected[i]!="保护带（防止长者从轮椅滑落）"&&this.securityProtected[i]!="手套（防止长者误拉鼻饲管或尿袋）"&&this.securityProtected[i]!="安睡宝（防止长者坠床）"){
              this.otherProtected = this.securityProtected[i];
              this.securityProtected[i] = "其他";
            }
          }
        }
      },
      //无风险
      noRisk(){
        if(this.securityRisk==="无"){
          this.securityProtected = [];
          this.otherProtected = "";
        }
      },
      //组装需要保存的数据
      assembleSaveData(){
        let securityRisk = this.securityRisk==="其他"?this.otherRisk:this.securityRisk;
        let securityProtected = [].concat(this.securityProtected);
        let protectedIndex = securityProtected.findIndex((value)=>value=="其他");
        if (protectedIndex !== -1) {
          securityProtected.splice(protectedIndex,1,this.otherProtected);
        }
        securityProtected = securityProtected.length>0?securityProtected.join(','):""
        let data = {
          elderId: this.elderId,
          securityRisk: securityRisk,
          securityProtected: securityProtected
        }
        return data;
      },
      save(){
        if(this.securityRisk===""){
          this.$message.error('请选择安全风险');return;
        }else if(this.securityRisk!="无"&&this.securityProtected.length===0){
          this.$message.error('请选择安全措施');return;
        }else if(this.securityRisk==="其他"&&this.otherRisk===""){
          this.$message.error('请填写其他安全风险');return;
        }else if(this.securityProtected.includes('其他')&&this.otherProtected===""){
          this.$message.error('请填写其他安全措施');return;
        }

        let data = this.assembleSaveData();
        // console.log(data)
        axios
        .fetch('elderServer', "/elderCheckin/security", data, "json")
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.$emit(
            "controlNavClick",
            "ContractAppoint",
          );
        })
      }
    }	
  }
</script>

<style lang="less" scoped>
  /deep/ .el-checkbox-group {
    display: inline-block;
  }
  .input_width {
    width: 16em;
  }
  .handleBtn {
      text-align: center;
  }
</style>