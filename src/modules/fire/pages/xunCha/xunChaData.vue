<template>
	<div class="app-container">
		<el-row class="warp" id="staffTableStyle">		
			<el-col>
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<el-row style="text-align: right;">
							<el-button v-for="(item,index) in timeArr" :key="index" :class="timeActive == index ? 'timeBtn' : 'checkTimeBtn' " @click="checkTime(index)">{{item}}</el-button>
						</el-row>
					</div>
					<el-row>
						<el-col :span="8" style="border-right: 1px solid #EEEEEE;">
							<div class="barSex" id="pieSex1" style="width:590px; height:300px"></div>
						</el-col>
						<el-col :span="8" style="border-right: 1px solid #EEEEEE;">
							<div class="barSex" id="pieSex2" style="width:590px; height:300px"></div>
						</el-col>
						<el-col :span="8">
							<div class="barSex" id="pieSex3" style="width:590px; height:300px"></div>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>
		<el-row class="ybBanner">
			<span>技术支持：有伴（上海）智能科技有限公司</span>
		</el-row>
		
	</div>
</template>
<script>
	import axios from "axios";
	import qs from "qs";
	import echarts from 'echarts'
	export default {
		data() {
			return {
				btnArr: ['巡查数据', '巡查分类', '巡查计划', '巡查任务', '巡查点管理'],
				routerArr:['/fire/xunCha/xunChaData','/fire/xunCha/xunChaCataloge','/fire/xunCha/xunChaPlan','/fire/xunCha/xunChaWork','/fire/xunCha/xunChaManager'],
				isactive: '0',
				timeActive: '0',
				show3: false,
				dialogFormVisible: false,
				dialogFormVisible1: false,
				title: '误报原因',
				title1: '报警',
				timeArr: ['日', '周', '月', '季', '年'],
				checkedFalse: '',
				barSex1: null,
				barSex2: null,
				barSex3: null,
				checkData:[{name: '已完成',value: 35},{name: '未完成',value: 117}],
			}
		},
		computed: {
			colorBtn: {
				get() {
					return this.$store.getters.colorBtns;
				},
				set() {}
			},
			firstZhuTi: {
				get() {
					return this.$store.getters.firstColors;
				},
				set() {}
			},
			secondZhuTi: {
				get() {
					return this.$store.getters.secondColors;
				},
				set() {}
			},
			thirdZhuTi: {
				get() {
					return this.$store.getters.thirdColors;
				},
				set() {}
			},
		},
		mounted() {
			this.barBeds()
		},
		created() {
			//			axios
			//				.post("/fire/Info/querySysFireDictByshebeileixin", qs.stringify(data))
			//				.then(res => {
			//					this.loading = false;
			//					if(res.data.code == 200) {
			//						this.option1 = res.data.data;
			//					} else if(res.data.code == "401") {
			//						this.$message({
			//							message: res.data.message,
			//							type: "warning"
			//						});
			//						this.$router.push("/login");
			//					} else {
			//						this.$message.error(res.data.message);
			//					}
			//				});
		},
		methods: {
			checkPage(index) {
				this.isactive = index
			},
			addFacilities() {
				this.$router.push({
					path: '/fire/addFacilities'
				})
			},

			checkTime(index) {
				this.timeActive = index
				let checkArr = [[{name: '已完成',value: 35},{name: '未完成',value: 117}],[{name: '已完成',value: 36},{name: '未完成',value: 157}],[{name: '已完成',value: 56},{name: '未完成',value: 186}],[{name: '已完成',value: 42},{name: '未完成',value: 200}],[{name: '已完成',value: 53},{name: '未完成',value: 85}]]
			    this.checkData =  checkArr[index]
			    this.barBeds()
			},

			barBeds() {
				this.barSex1 = echarts.init(document.getElementById('pieSex1'));
				this.barSex2 = echarts.init(document.getElementById('pieSex2'));
				this.barSex3 = echarts.init(document.getElementById('pieSex3'));

				this.barSex1.setOption({
					tooltip: {
						trigger: 'item',
						formatter: "{b} : {c} ({d}%)"
						//									formatter: function(a) {
						//										let index = a.dataIndex
						////										return(
						////											todayMonthFomatter[index]['name'] +
						////											'<br/>' + todayMonthFomatter[index]['moneyValue'] + '元' +
						////											'<br/>' + todayMonthFomatter[index]['peopleAll'] + '人' + '(按100%发放)' +
						////											'<br/>' + todayMonthFomatter[index]['peopleHalf'] + '人' + '(按50%发放)'
						////										);
						//
						//									},
					},
					graphic: [{
						type: 'text',
						left: 'center',
						top: '45%',
						style: {
							text: '消防巡检计划',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 18,
						}
					}, {
						type: 'text',
						left: 'center',
						top: '55%',
						style: {
							text: '完成率',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 18,
						}
					}],
					series: [{
						name: '',
						type: 'pie',
						radius: ['45%', '70%'],
						center: ['50%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								formatter: '{b}\n{d}%',
								//											borderWidth: 20,
								//											borderRadius: 4,
								//											show: true,
								//											textStyle: {
								//												fontSize: 14,
								//												fontWeight: 'bolder'
								//											}
							},
						},
						labelLine: {
							normal: {
								show: true,
							}
						},
						data: this.checkData,
						itemStyle: {
							color: function(params) {
								var colorList = [
									'#63C4C7', '#DF8B8E'
								];
								return colorList[params.dataIndex]
							},
						},
					}]
				});
				
				this.barSex2.setOption({
					tooltip: {
						trigger: 'item',
						formatter: "{b} : {c} ({d}%)"
						//									formatter: function(a) {
						//										let index = a.dataIndex
						////										return(
						////											todayMonthFomatter[index]['name'] +
						////											'<br/>' + todayMonthFomatter[index]['moneyValue'] + '元' +
						////											'<br/>' + todayMonthFomatter[index]['peopleAll'] + '人' + '(按100%发放)' +
						////											'<br/>' + todayMonthFomatter[index]['peopleHalf'] + '人' + '(按50%发放)'
						////										);
						//
						//									},
					},
					graphic: [{
						type: 'text',
						left: 'center',
						top: '45%',
						style: {
							text: '安防巡检计划',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 18,
						}
					}, {
						type: 'text',
						left: 'center',
						top: '55%',
						style: {
							text: '完成率',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 18,
						}
					}],
					series: [{
						name: '',
						type: 'pie',
						radius: ['45%', '70%'],
						center: ['50%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								formatter: '{b}\n{d}%',
								//											borderWidth: 20,
								//											borderRadius: 4,
								//											show: true,
								//											textStyle: {
								//												fontSize: 14,
								//												fontWeight: 'bolder'
								//											}
							},
						},
						labelLine: {
							normal: {
								show: true,
							}
						},
						data:this.checkData,
						itemStyle: {
							color: function(params) {
								var colorList = [
									'#63C4C7', '#DF8B8E'
								];
								return colorList[params.dataIndex]
							},
						},
					}]
				});
				
				this.barSex3.setOption({
					tooltip: {
						trigger: 'item',
						formatter: "{b} : {c} ({d}%)"
						//									formatter: function(a) {
						//										let index = a.dataIndex
						////										return(
						////											todayMonthFomatter[index]['name'] +
						////											'<br/>' + todayMonthFomatter[index]['moneyValue'] + '元' +
						////											'<br/>' + todayMonthFomatter[index]['peopleAll'] + '人' + '(按100%发放)' +
						////											'<br/>' + todayMonthFomatter[index]['peopleHalf'] + '人' + '(按50%发放)'
						////										);
						//
						//									},
					},
					graphic: [{
						type: 'text',
						left: 'center',
						top: '45%',
						style: {
							text: '办公室巡检计划',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 18,
						}
					}, {
						type: 'text',
						left: 'center',
						top: '55%',
						style: {
							text: '完成率',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 18,
						}
					}],
					series: [{
						name: '',
						type: 'pie',
						radius: ['45%', '70%'],
						center: ['50%', '50%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								formatter: '{b}\n{d}%',
								//											borderWidth: 20,
								//											borderRadius: 4,
								//											show: true,
								//											textStyle: {
								//												fontSize: 14,
								//												fontWeight: 'bolder'
								//											}
							},
						},
						labelLine: {
							normal: {
								show: true,
							}
						},
						data:this.checkData,
						itemStyle: {
							color: function(params) {
								var colorList = [
									'#63C4C7', '#DF8B8E'
								];
								return colorList[params.dataIndex]
							},
						},
					}]
				});
			}
		},

	};
</script>
<style scoped>
	.addBtn {
		margin: 0 0 0 10px;
		float: left;
	}
	
	.checkBtn {
		width: 95px;
		height: 36px;
		border: none;
		margin-bottom: 5px;
	}
	
	.searchBtnsStyle {
		width: 95px;
		height: 36px;
		background: #4687E1;
		border: 1px solid #4687E1;
		border-radius: 4px;
		color: white;
		margin-bottom: 5px;
	}
	
	.checkTimeBtn {
		width: 72px;
		height: 36px;
		background: rgba(255, 255, 255, 1);
		color: #333333;
		margin-left: 0;
		border: none;
		font-weight: 500;
	}
	
	.timeBtn {
		width: 72px;
		height: 36px;
		background: rgba(35, 104, 211, 1);
		border-radius: 4px 0px 0px 4px;
		color: #fff;
		margin-left: 0;
		border: none;
		font-weight: 500;
	}
</style>