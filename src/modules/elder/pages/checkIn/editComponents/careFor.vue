<template>
    <el-card class="box-card" style="margin-bottom:100px;">
        <el-row style="padding:10px 0 10px 20px;border-bottom: 1px solid #ddd;background: #FBFBFC;">
            <el-button @click="selectType('healthCondition')" :class="{'checkBtn':isActive=='healthCondition','searchBtn':isActive!='healthCondition'}">健康评估</el-button>
            <el-button @click="selectType('functionalEvaluation')" :class="{'checkBtn':isActive=='functionalEvaluation','searchBtn':isActive!='functionalEvaluation'}">功能评估</el-button>
            <el-button @click="selectType('careAssess')" :class="{'checkBtn':isActive=='careAssess','searchBtn':isActive!='careAssess'}">照护评估</el-button>
        </el-row>
        <el-row>
          <HealthCondition ref='HealthCondition' v-if="isActive==='healthCondition'" @healthCondition='contractAppoint' :elderId="elderId" :notEdit="notEdit"></HealthCondition>
          <FunctionalEvaluation ref="FunctionalEvaluation" v-if="isActive === 'functionalEvaluation'" @functionalEvaluation='contractAppoint' :elderId="elderId" :notEdit="notEdit"></FunctionalEvaluation>
          <CareAssess ref="CareAssess" v-if="isActive==='careAssess'&&careForArr.indexOf('careAssess')===-1" @careAssess='contractAppoint' :elderId="elderId" :elderName="elderName" :notEdit="notEdit"></CareAssess>
          <SeeAssess ref="SeeAssess" v-if="isActive==='careAssess'&&careForArr.includes('careAssess')" :elderId="elderId" :elderName="elderName" :notEdit="notEdit"></SeeAssess>
        </el-row>
    </el-card>
</template>

<script>
  import axios from "axios";
  import HealthCondition from '@/modules/elder/pages/checkIn/editComponents/healthCondition';
	import FunctionalEvaluation from '@/modules/elder/pages/checkIn/editComponents/functionalEvaluation';
  import CareAssess from '@/modules/elder/pages/checkIn/editComponents/careAssess';
  import SeeAssess from '@/modules/elder/pages/checkIn/seeComponents/careAssess';

	export default {
    components: {HealthCondition,FunctionalEvaluation,CareAssess,SeeAssess},
    props: ["elderId","elderName","notEdit"],   
		data() {
			return {
        isActive: 'healthCondition',
        sign: '',
        careForArr: []
			}
    },
    created(){
      this.sign = this.$route.query.sign;
      this.initTabStyle();
    },
		methods:{
      initTabStyle(){
				let data = {
					elderId: this.elderId
        }
        axios
				.fetch('elderServer', "/elderInfo/isBright", data)
				.then(res => {
					let repairStatusArr = res.data;
            for(let i in repairStatusArr){
              if(repairStatusArr[i] === 1){
                this.careForArr.push(i);
              }
            }
				})
      },
      contractAppoint(value,data2){
        this.isActive = data2;
        if(this.careForArr.indexOf(value) === -1){
          this.careForArr.push(value);
        }
        if(this.careForArr.includes('careAssess') && this.careForArr.length === 2){
          this.$emit(
            "careFor",
            "careFor",
            "checkInfo"
          )
        }else if(this.careForArr.indexOf('careAssess')===-1&& this.careForArr.length === 3){  
          this.$emit(
            "careFor",
            "careFor",
            "checkInfo"
          )
        }else if(this.sign==='ruzhu' && this.careForArr.length === 1){
          this.$emit(
            "careFor",
            "careFor",
            "checkInfo"
          )
        }
      },
      selectType(type){
        this.isActive = type;
      },
      childAction(){ 
				switch(this.isActive){
				  case 'healthCondition':
					this.$refs.HealthCondition.childAction();
					break;
				  case 'functionalEvaluation':
					this.$refs.FunctionalEvaluation.childAction();
          break;
          case 'careAssess':
            if (this.$refs.CareAssess !== undefined) {
					    this.$refs.CareAssess.childAction();
            } else {
              this.$store.state.openNavNext = true;
              this.$emit(
                "careFor",
                "careFor",
                "checkInfo"
              );
            }
					break;
			  }
			},
    }		
  }
</script>

<style scoped>
  .box-card >>> .el-card__header {
    background: #fbfbfc;
    color: #333;
    line-height: 25px;
    font-weight: 700;
    padding: 11px 0 11px 20px;
  }
  .checkBtn{
    width: 8em;
    color: #fff;
    background-color: #4687E1;
  }
  .searchBtn{
    width: 8em;
    background-color: #FBFBFC;
    border-color: #FBFBFC;
  }
  .el-card >>> .el-card__body {
    padding: 0!important;
  }
</style>