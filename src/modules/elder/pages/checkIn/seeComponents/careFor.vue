<template>
    <el-card class="box-card">
        <el-row style="padding:10px 0 10px 20px;border-bottom: 2px solid #ddd;background: #FBFBFC;">
            <el-button @click="selectType('healthCondition')" :class="{'checkBtn':isActive=='healthCondition','searchBtn':isActive!='healthCondition'}">健康评估</el-button>
            <!-- <el-button @click="selectType('functionalEvaluation')" :class="{'checkBtn':isActive=='functionalEvaluation','searchBtn':isActive!='functionalEvaluation'}">功能评估</el-button> -->
            <el-button @click="selectType('careAssess')" :class="{'checkBtn':isActive=='careAssess','searchBtn':isActive!='careAssess'}">照护评估</el-button>
        </el-row>
        <el-row>
            <HealthCondition ref="healthCondition" v-if="isActive==='healthCondition'" :elderId="elderId"></HealthCondition>
            <FunctionalEvaluation ref="functionalEvaluation" v-if="isActive==='functionalEvaluation'" :elderId="elderId"></FunctionalEvaluation>
            <CareAssess ref="careAssess" v-if="isActive==='careAssess'" :elderId="elderId"></CareAssess>
        </el-row>
    </el-card>
</template>

<script>
	import axios from "axios";
	import HealthCondition from '@/modules/elder/pages/checkIn/seeComponents/healthCondition';
    import FunctionalEvaluation from '@/modules/elder/pages/checkIn/seeComponents/functionalEvaluation';
    import CareAssess from '@/modules/elder/pages/checkIn/seeComponents/careAssess';
	export default {
        components: {HealthCondition,FunctionalEvaluation,CareAssess},
        props: ["elderId"],
		data() {
			return {
                isActive: 'healthCondition'
			}
        },
		methods:{
		    selectType(type){
                this.isActive = type;
            }
        }	
    }
</script>

<style scoped>
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
    .box-card >>> .el-card__header {
        background: #fbfbfc;
        color: #333;
        line-height: 25px;
        font-weight: 700;
        padding: 11px 0 11px 20px;
    }
</style>