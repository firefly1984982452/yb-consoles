<template>
	<!-- 某位老人的照护评估列表 -->
	<div>
        <!-- <div class="title"><el-button v-show="showBack" class="back" size="mini" @click="back">返回</el-button><strong>照护评估列表</strong></div> -->
		<div :class="assessList===true?'contractRecord content':'contractRecord'" style="padding:20px;">
			<div class="block" v-if="tableData.length>0">
				<p class="record_title" v-if="elderName">
					<span>{{elderName}}</span> 
					<span>入住时间 <c style="color:#666">{{checkinDate == null ? '' : checkinDate.substr(0,10)}}</c> &nbsp;&nbsp;&nbsp;&nbsp;照护等级 <c style="color:#666">{{levelName}}</c> {{checkYM}}</span>
				</p>
				<el-timeline>
					<el-timeline-item v-for="(item, index) in tableData" :key="index" :color="index===0?'#F49B31':''" size="large" placement="top">
						<p>
							<span>{{item.createTime}}</span>
						</p>
						<el-card>
							<el-form label-width="70px">
								<el-row>
									<el-col :span="18">
										<el-row>
											<el-col :span="6">
												<el-form-item label="评估类型">{{item.estimateType | typeFilter}}</el-form-item>
											</el-col>
											<el-col :span="6">
												<el-form-item label="评估编号">{{item.estimateNo}}</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="评估周期">{{item.startDate}} 至 {{item.endDate}}</el-form-item>
											</el-col>
										</el-row>
										<el-row style="position:relative;">
											<el-col :span="6">
												<el-form-item label="照护等级">{{item.levelName}}</el-form-item>
											</el-col>
											<el-col :span="6">
												<el-form-item label="评估次数">{{item.estimateCount}}</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="评估人">{{item.creator}}</el-form-item>
											</el-col>
										</el-row>
									</el-col>
									<el-col :span="5" class="btn_group">
									<el-button type="primary" @click="see(item)">查看</el-button>
									<el-button plain @click="print(item)">打印</el-button>
									</el-col> 
								</el-row>
							</el-form>
						</el-card>
					</el-timeline-item>
				</el-timeline>
			</div>
			<div v-if="tableData.length===0" class="noData">
				<div>
					<img src="@/assets/images/unData.png"/>
					<p>暂无数据</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import printMethods from '@/utils/print';
	export default {
		props: ["elderId"],
		data() {
			return {
				loading: true,
				elderName: '',
				checkinDate: '',
				levelName: '',
				checkDay: '',
				checkYM: '',
				tableData: [],
				assessList: false, //是否从评估列表跳转过来的
				showBack : false, //是否显示返回按钮
			}
		},
		created(){
			this.showBack = this.$route.path.indexOf('checkInEdit') !== -1 ? false : true;
			this.assessList = this.$route.query.assessList;
			if(this.$route.query.assessList){
               this.elderId = this.$route.query.elderId;
			}
            this.dataInit();
		},
		methods:{
			...printMethods,
			dataInit(){
                let data = {
					elderId: this.elderId
				};
				axios
				.fetch('elderServer', "/elderEstimate/all", data)
				.then(res => {
					this.tableData = res.data;
					this.handleTable();
				})
			},
			//处理拿到的TableDate数据
			handleTable(){
				this.elderName = this.tableData[0].elderName;//老人姓名
				this.checkinDate = this.tableData[0].checkinDate;//入住时间
				this.levelName = this.tableData[0].levelName; //当前最新的护险等级
			},
			see(data){
                this.repairParams = {
					estimateType: data.estimateType,
					levelName: data.levelName,
					creator: data.creator,
					doctorName: data.doctorName,
					estimateCount: data.estimateCount,
					createTime: data.createTime,
					version: data.version,
				};
				this.$router.push({
					path: "/elder/care/assessView",
					query: {
						sign: "see",
						estimateId: data.estimateId,
						repairParams: JSON.stringify(this.repairParams)
					}
				});
			},
			//以前的打印
			print(data){
				this.openPrint({
					path: "/print/elder/care",
					query: {
						estimateId: data.estimateId
					}
				});
			},
			back () {
      			this.$router.back()
			}
		},
		filters:{
			typeFilter: val=>{
				if(val===0){
                   return val='首次评估'; 
				}else if(val===1){
                   return val='复核评估'; 
				}else if(val===2){
                   return val='持续评估'; 
				}
			}
		}
    }
</script>

<style scoped>
	.title{
        height: 37px;
        border-bottom:1px solid rgba(221,221,221,1);        
        padding:10px 0 10px 20px;
		background-color: #fff;
	}
	.el-button.back{
		width: 60px;
		height: 34px;
		padding:0;
		min-width: 0;
		margin: 0 20px 0 0;
	}
    .contractRecord {
	   padding: 0 15px;
	   background-color: #fff;
	}
	.contractRecord >>> .el-form-item {
       margin-bottom: 0;
	}
	.block >>> .el-card__body {
		padding: 10px 0px 10px 20px!important;
	}
	.contractRecord >>> .el-form-item__content {
		text-align: left;
	}
	.record_title {
       margin-bottom: 20px;
	}
    .record_title span:nth-child(1){
	   margin-right: 10px;
	   font-size: 18px;
	   font-weight: 500;
	   color: #333333;
	}
	.record_title span:nth-child(2){
	   font-size: 14px;
	   color: #999999;
	}
	.contractRecord >>> .el-timeline-item__node--large{
		top: 85px;
	}
	.contractRecord >>> .el-timeline-item__tail{
		top: 85px;
	}
	.contractRecord >>> .el-timeline-item__content{
		width:1078px;
	}
	.el-timeline-item__content p {
       margin-bottom: 15px;
	}
	.el-timeline-item__content p span:nth-child(1){
	   font-size: 16px;
	   font-weight: 500;
       color: #666666;
	}
	.el-timeline-item__content p span:nth-child(2){
		margin: 0 15px 0 5px;
		font-size: 16px;
		font-weight: 500;
		color: #666666;
	}
	.el-timeline-item__content p span:nth-child(3){
		background: #F49B31;
		color: #fff;
		font-size: 14px;
		padding: 5px 10px;
		border-radius: 5px;
	}  
	.btn_group {
		text-align: right;
		position: relative;
		top: 1.5em;
	}
	.btn_group .el-button {
		font-size: 14px;
		padding: 10px 16px;
	}
	.btn_group .el-button:first-child {
        background: #6AAEE7;
	}
	.noData {
		height: 75vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
    .noData p {
		color: #999;
        font-size: 14px;
		text-align: center;
	}
	.otherFee {
        position: absolute;
		right: 50px;
		bottom: 1px;
	}
</style>