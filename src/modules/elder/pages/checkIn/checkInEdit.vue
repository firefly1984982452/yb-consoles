<template>
    <div style="position:relative;">
		<el-form :inline="true" class="search cssNav" label-width="80px" :rules="rules">
			<ul>
				<li type @click="blueNav.includes('baseInfo')?selectType('baseInfo'):''" v-bind:class="{
					'first-orange':isActive=='baseInfo'&&(blueNav.includes('baseInfo') || grayNav.includes('baseInfo')),
					'first-blue':isActive!='baseInfo'&&blueNav.includes('baseInfo'),
					'first-gray':isActive!='baseInfo'&&grayNav.includes('baseInfo')
					}">
					<span class>长者资料</span>
				</li>
				<li
				@click="blueNav.includes('familyInfo')?selectType('familyInfo'):''" v-bind:class="{
					'middle-orange':isActive=='familyInfo'&&(blueNav.includes('familyInfo') || grayNav.includes('familyInfo')),
					'middle-blue':isActive!='familyInfo'&&blueNav.includes('familyInfo'),
					'middle-gray':isActive!='familyInfo'&&grayNav.includes('familyInfo')
				}" style="position:relative;left:-18px;">
					<span class>家属信息</span>
				</li>
				<li @click="blueNav.includes('careFor')?selectType('careFor'):''" v-bind:class="{
					'middle-orange':isActive=='careFor'&&(blueNav.includes('careFor') || grayNav.includes('careFor')),
					'middle-blue':isActive!='careFor'&&blueNav.includes('careFor'),
					'middle-gray':isActive!='careFor'&&grayNav.includes('careFor')
				}" style="position:relative;left:-36px;">
					<span class>等级评估</span>
				</li>
				<li
				@click="blueNav.includes('checkInfo')?selectType('checkInfo'):''" v-bind:class="{
					'middle-orange':isActive=='checkInfo'&&(blueNav.includes('checkInfo') || grayNav.includes('checkInfo')),
					'middle-blue':isActive!='checkInfo'&&blueNav.includes('checkInfo'),
					'middle-gray':isActive!='checkInfo'&&grayNav.includes('checkInfo')
				}" style="position:relative;left:-54px;">
					<span class>入住信息</span>
				</li>
				<li @click="blueNav.includes('firstServer')?selectType('firstServer'):''" v-bind:class="{
					'middle-orange':isActive=='firstServer'&&(blueNav.includes('firstServer') || grayNav.includes('firstServer')),
					'middle-blue':isActive!='firstServer'&&blueNav.includes('firstServer'),
					'middle-gray':isActive!='firstServer'&&grayNav.includes('firstServer') 
				}" style="position:relative;left:-72px;">
					<span class>照料服务</span>
				</li><li @click="blueNav.includes('specialProtect')?selectType('specialProtect'):''" v-bind:class="{
					'middle-orange':isActive=='specialProtect'&&(blueNav.includes('specialProtect') || grayNav.includes('specialProtect')),
					'middle-blue':isActive!='specialProtect'&&blueNav.includes('specialProtect'),
					'middle-gray':isActive!='specialProtect'&&grayNav.includes('specialProtect') 
				}" style="position:relative;left:-85px;">
					<span class>特殊防护</span>
				</li>
				<li @click="blueNav.includes('contractAppoint')?selectType('contractAppoint'):''" v-bind:class="{
					'last-orange':isActive=='contractAppoint'&&(blueNav.includes('contractAppoint') || grayNav.includes('contractAppoint')),
					'last-blue':isActive!='contractAppoint'&&blueNav.includes('contractAppoint'),
					'last-gray':isActive!='contractAppoint'&&grayNav.includes('contractAppoint')
				}" style="position:relative;left:-102px;">
					<span class>合同约定</span>
				</li>
			</ul>
			<span v-if="elderName">长者姓名：{{elderName}}</span>
			<span v-else>长者姓名{{elderName}}</span>
		</el-form>
		<div>
			<BaseInfo ref='BaseInfo' v-if="isActive==='baseInfo'" @baseinfo='baseinfo' :elderId="elderId" :notEdit="notEdit"></BaseInfo>
			<FamilyInfo ref='FamilyInfo' v-if="isActive==='familyInfo'" @familyinfo='familyinfo' :elderId="elderId" :familySaved="familySaved"></FamilyInfo>
			<CareFor ref='CareFor' v-if="isActive==='careFor'" @careFor='careFor' :elderId="elderId" :elderName="elderName" :notEdit="notEdit"></CareFor>
			<CheckInfo ref="CheckInfo" v-if="isActive==='checkInfo'" @CheckInfo='checkInfo' :elderId="elderId" :notEdit="notEdit"></CheckInfo>
            <FirstServer ref="FirstServer" v-if="isActive === 'firstServer'" @firstServer='firstServer' :elderId="elderId" :nursingLevel='nursingLevel' :notEdit="notEdit"></FirstServer>
			<SpecialProtect ref="SpecialProtect" v-if="isActive === 'specialProtect'" @specialProtect='specialProtect' :elderId="elderId" :notEdit="notEdit"></SpecialProtect>
			<ContractAppoint ref='ContractAppoint' v-if="isActive==='contractAppoint'&&blueNav.indexOf('contractAppoint')===-1" @contractAppoint='contractAppoint' :form="contractData" :elderId="elderId" :elderName="elderName" :checkinDate="checkinDate"></ContractAppoint>
		    <ContractRecord ref='ContractAppoint' v-if="isActive==='contractAppoint'&&blueNav.includes('contractAppoint')" :elderId="elderId"></ContractRecord>
        <div v-if="isActive!='familyInfo'&&((isActive!='healthCondition'&&isActive!='checkInfo'&&isActive!='contractAppoint')
		||blueNav.indexOf('contractAppoint')===-1)" class="fake-footer">
		技术支持 有伴（上海）智能科技有限公司
		</div>
		</div>
		<div class="tijiao" v-if="isActive!='familyInfo'&&((isActive!='healthCondition'&&isActive!='checkInfo'&&isActive!='contractAppoint')
		||blueNav.indexOf('contractAppoint')===-1)">
			<el-row :gutter="40">
				<!-- <el-col :lg="3" :xl="2">   -->
					<el-button type="success" plain :style="{'background':firstZhuTi}" @click="save()">保存</el-button>
				<!-- </el-col> -->
				<!-- <el-col :lg="3" :xl="2" > -->
					<el-button type plain @click="cancel()">取消</el-button>
				<!-- </el-col> -->
			</el-row>
		</div>
	</div>
</template>
<script>
	import { axios } from 'youban-utils';
	import BaseInfo from '@/modules/elder/pages/checkIn/editComponents/baseInfo';
	import FamilyInfo from '@/modules/elder/pages/checkIn/editComponents/familyInfo';
	import CareFor from '@/modules/elder/pages/checkIn/editComponents/careFor';
	import CheckInfo from '@/modules/elder/pages/checkIn/editComponents/checkInfo';
	import FirstServer from '@/modules/elder/pages/checkIn/editComponents/firstServer';
	import SpecialProtect from '@/modules/elder/pages/checkIn/editComponents/specialProtect';
	import ContractAppoint from '@/modules/elder/pages/checkIn/editComponents/contractAppoint';
	import ContractRecord from '@/modules/elder/pages/checkIn/editComponents/contractRecord';
	export default {
		components: {
			BaseInfo,
			FamilyInfo,
			CareFor,
			CheckInfo,
			FirstServer,
			SpecialProtect,
			ContractAppoint,
			ContractRecord
		},
		watch: {
			'$store.state.openNavNext'(val) {
				console.log(val)
				this.isActive = 'checkInfo'
				this.blueNav.push(this.isActive);
				this.grayNavRemove(this.isActive);
				this.selectType('checkInfo');
				console.log(this.blueNav)
			},
			'$store.state.editContract'(val) {
				console.log(val,this.blueNav)
				if(val) {
					let index = this.blueNav.indexOf("contractAppoint");
					this.blueNav.splice(index, 1);
					this.isActive = 'contractAppoint';
					this.grayNav.push('contractAppoint')
				}
			}
		},
		data() {
			return {
			   isActive: 'baseInfo',   
			   sign: '',
			   notEdit: false,
			   familySaved: false,//家属信息寿佛偶保存过
			   blueNav: ['baseInfo'],
			   grayNav: ['familyInfo','careFor','checkInfo','firstServer','specialProtect','contractAppoint'],
			   rules: {},
			   elderId:'',
			   elderName: '',
			   nursingLevel: '',
			   checkinDate: ''
			};
		},
		created() {
			this.sign =  this.$route.query.sign;
			if(this.sign === 'repair'){
			   this.elderId	 = this.$route.query.elderId;
			   this.elderName = this.$route.query.elderName;
			   this.nursingLevel =  this.$route.query.nursingLevel;
			   this.checkinDate	 = this.$route.query.checkinDate;
			   this.initTabStyle();
			}
		},
		methods: {

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
							this.blueNav.push(i);
							this.grayNavRemove(i);
						}
					}
					// 说明家属信息已经保存过
					if(res.data.careFor == 1){
						this.familySaved = true;
					}
					this.notEdit = this.blueNav.includes("contractAppoint")?true:false;
				})
		    },
		    grayNavRemove(value){
				let index = this.grayNav.indexOf(value);
				if(index > -1){
				    this.grayNav.splice(index, 1);
				} 
		    },
			selectType(type){
				this.isActive = type;
			},
			cancel() {
				this.$router.push('/elder/checkin');
			},
			save(){
				switch(this.isActive){
					case 'baseInfo':
						this.$refs.BaseInfo.childAction();
						break;
					case 'familyInfo':
						this.$refs.FamilyInfo.childAction();
						break;
					case 'careFor':
						this.$refs.CareFor.childAction();
						break;
					case 'checkInfo':
						this.$refs.CheckInfo.childAction();
						break;	
					case 'firstServer':
						this.$refs.FirstServer.childAction();
						break;
					case 'specialProtect':
						this.$refs.SpecialProtect.childAction();
						break;
					case 'contractAppoint':
						this.$refs.ContractAppoint.childAction();
						break;
				}
			},
			baseinfo(data1,data2,data3,data4){
				this.elderId = data3;
				this.elderName = data4;
				this.isActive = data2;
				if(this.blueNav.indexOf(data1) === -1){
					this.blueNav.push(data1);
					this.grayNavRemove(data1);
					// 下一模块变蓝
					// this.blueNav.push(this.isActive);
					// this.grayNavRemove(this.isActive);
				}
				},
			familyinfo(data1,data2){
					this.isActive = data2;
					this.familySaved = true;
					if(this.blueNav.indexOf(data1) === -1){
					this.blueNav.push(data1);
					this.grayNavRemove(data1);
					}
			},
		    healthCondition(data1,data2){
				this.isActive = data2;
				if(this.blueNav.indexOf(data1) === -1){
				   this.blueNav.push(data1);
				   this.grayNavRemove(data1);
				}
			},
			careFor(data1,data2){
				console.log('care for')
				this.isActive = data2;
				if(this.blueNav.indexOf(data1) === -1){
				   this.blueNav.push(data1);
				   this.grayNavRemove(data1);
				}
			},
			checkInfo(data1,data2,data3,data4){
				console.log('check info')
				this.isActive = data2;
				if(this.blueNav.indexOf(data1) === -1){
				   this.blueNav.push(data1);
				   this.grayNavRemove(data1);
					// 下一模块变蓝
					// this.blueNav.push(this.isActive);
					// this.grayNavRemove(this.isActive);
				}
				this.nursingLevel = data3;
				this.checkinDate = data4;
			},
			firstServer(data1,data2){
				console.log('first')
				this.isActive = data2;
				if(this.blueNav.indexOf(data1) === -1){
				   this.blueNav.push(data1);
				   this.grayNavRemove(data1);
				}
			},
			specialProtect(data1,data2){
				this.isActive = data2;
				if(this.blueNav.indexOf(data1) === -1){
				   this.blueNav.push(data1);
				   this.grayNavRemove(data1);
				}
			},
			contractAppoint(data1){
				if(this.blueNav.indexOf(data1) === -1){
				  this.blueNav.push(data1);
				  this.grayNavRemove(data1);
				}
				this.notEdit = this.blueNav.includes("contractAppoint")?true:false;
			},
		},
	};
</script>
<style scoped>
.tijiao {
    background: #fff;
    position: fixed;
    width: 100%;
    height: 60px;
    -webkit-transform: translateX(-9px);
    transform: translateX(-8px);
    /* -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
    z-index: 1;
    width: calc(100% + 30px);
    bottom: 0px;
    line-height: 60px;
}
.tijiao>div {
    position: relative;
	left: 50%;
	top:50%;
    -webkit-transform: translate(-50%,-50%);
	transform: translate(-50%,-50%);
	width: 230px;
	display: flex;
	justify-content: space-between;
}
.admission-no {
  position:absolute;
  right:15px;
  top:20px;
  color: #222;
  font-size: 18px;
  font-weight: bold;
}
.cssNav {
  background: #fff;
  padding:11px 15px!important;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  position: relative;
  z-index: 1;
}
.cssNav ul {
  display: inline-block;
}
.cssNav li {
  padding: 0 15px;
  line-height: 40px;
  display: inline-block;
  color: #fff;
  font-size: 16px;
}
.cssNav > span {
  float: right;
	height: 40px;
	line-height: 40px;
	font-size: 16px;
  font-weight: bold;
  color: #333;
}
.cssNav .first-orange {
  background-image: url(../../../../assets/images/currentFinishedFirst.png);
  background-repeat: no-repeat;
  background-size: 105px 43px;
  padding-right: 30px;
}
.cssNav .first-blue {
  background-image: url(../../../../assets/images/finishedFirst.png);
  background-repeat: no-repeat;
  background-size: 105px 43px;
  padding-right: 30px;
}
.cssNav .first-gray {
  background-image: url(../../../../assets/images/unfinishedFirst.png);
  background-repeat: no-repeat;
  background-size: 105px 43px;
  padding-right: 30px;
}
.cssNav .middle-orange {
  background-image: url(../../../../assets/images/currentFinished.png);
  background-repeat: no-repeat;
  background-size: 120px 43px;
  padding: 0 30px;
}
.cssNav .middle-blue {
  background-image: url(../../../../assets/images/finished.png);
  background-repeat: no-repeat;
  background-size: 120px 43px;
  padding: 0 30px;
}
.cssNav .middle-gray {
  background-image: url(../../../../assets/images/unfinished.png);
  background-repeat: no-repeat;
  background-size: 120px 43px;
  padding: 0 30px;
}
.cssNav .last-orange {
  background-image: url(../../../../assets/images/currentFinishedLast.png);
  background-repeat: no-repeat;
  background-size: 105px 43px;
  padding-left: 30px;
}
.cssNav .last-blue {
  background-image: url(../../../../assets/images/finishedLast.png);
  background-repeat: no-repeat;
  background-size: 105px 43px;
  padding-left: 30px;
}
.cssNav .last-gray {
  background-image: url(../../../../assets/images/unfinishedLast.png);
  background-repeat: no-repeat;
  background-size: 105px 43px;
  padding-left: 30px;
}
.fake-footer {
	position: absolute;
	bottom: 10px;
	line-height: 50px;
	/* padding: 0px 0px 25px 0px; */
	left: 50%;
	transform: translateX(-50%);
    color: #A5A5A5;
    font-size: 12px;
    font-weight: 300;
}
</style>

