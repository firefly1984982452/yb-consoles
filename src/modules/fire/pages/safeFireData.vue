<template>
	<div class="app-container" id="dashed" v-loading="loading">
		<div class="dashContainer">
			<el-row style="margin-top: 5px;">
				<el-col :span="8">
					<div class="warningBox">
						<p class="warningNum">0<span>次</span></p>
						<p class="warningTitle">今日报警数</p>
					</div>
					<div class="warningBox">
						<p class="warningNum">0<span>次</span></p>
						<p class="warningTitle">今日未处理报警</p>
					</div>
					<div class="warningBox">
						<p class="warningNum allready">0<span>次</span></p>
						<p class="warningTitle">今日已处理总数</p>
					</div>
					<div class="warningBox">
						<p class="warningNum addNum">0<span>次</span></p>
						<p class="warningTitle">累计报警数</p>
					</div>
				</el-col>
				<el-col style="width: 66.3%;margin-left: 0.3%;">
					<div class="warningEchartBox">
						<el-form ref="searchForm" :model="searchForm" label-width="75px">
							<el-form-item label="" style="position: absolute;z-index: 200;top: 80px;left: 38%;">
								<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchForm.enterDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
										</el-date-picker>
							</el-form-item>
						</el-form>
						<p @click="searchToday" class="todayWraining">今日报警</p>
						<p class="warningEchartTitle">报警类型统计</p>
						<div class="columnBed" id="monthNum" style="width:100%; height:420px;"></div>
					</div>
				</el-col>
				
			</el-row>
			<el-row style="margin-top: 15px;">
				<el-col :span="24">
					<div class="warningEchartBox">
						<p class="warningEchartTitle">
							<el-row style="text-align: right;">
							<el-button v-for="(item,index) in timeArr" :key="index" :class="timeActive == index ? 'timeBtn' : 'checkTimeBtn' " @click="checkTime(index)">{{item}}</el-button>
						   </el-row>
						</p>
						<el-col :span="8" style="border-right: 1px solid #EEEEEE;">
							<div class="barSex" id="pieSex1" style="width:590px; height:300px"></div>
							<p class="echartsItem">告警处理率</p>
						</el-col>
						<el-col :span="8" style="border-right: 1px solid #EEEEEE;">
							<div class="barSex" id="pieSex2" style="width:590px; height:300px"></div>
							<p class="echartsItem">误报原因</p>
						</el-col>
						<el-col :span="8">
							<div class="barSex" id="pieSex3" style="width:590px; height:300px"></div>
							<p class="echartsItem">告警类别</p>
						</el-col>
					</div>
				</el-col>
			</el-row>
			<el-row class="ybBanner">
				<span>技术支持：有伴（上海）智能科技有限公司</span>
			</el-row>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import qs from "qs";
	import echarts from 'echarts'
	export default {
		data() {
			return {
				loading: '',
				checkData:[
				{name: '设备损坏',value: 35},
				{name: '设施检测',value: 23},
				{name: '作业场所扬尘',value: 13},
				{name: '违规操作',value: 23},
				{name: '违规施工',value: 44},
				{name: '场所环境不良',value: 21},
				{name: '其他',value: 9}
				],
				timeArr: ['近7天', '近30天'],
				isactive: '0',
				timeActive: '0',
				searchForm:{
					enterDate:''
				}
			}
		},
		  mounted() {
            this.warningLeiXin(); //报警类型统计
            this.barBeds()
        },
        watch:{
        	
        },
		methods: {			
			warningLeiXin(){
				this.monthNum = echarts.init(document.getElementById('monthNum'));
//				window.addEventListener("resize", function() {
//					this.monthNum.resize()
//				})//图表随时变化
				let num1 = ['20', '70', '10', '50', '80', '20', '30', '68', '60', '40', '46','68']
				let num2 = ['40', '60', '30', '30', '70', '50', '10', '20', '46', '40', '53','68']
				let num3 = ['61', '40', '50', '60', '60', '70', '50', '40', '44', '24', '54','68']
				let month = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','12']
					this.monthNum.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: '' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						show: true,
						data: ['电气温度报警', '剩余电流报警', '烟感报警'],
						type: 'plain', // 普通图例
						orient: 'horizontal', // 水平
						right: 50, // 左距离
						top: 30, // 上距离
						//bottom: 0, // 下距离
						icon: "circle",
						itemWidth: 12, // 设置宽度
						itemHeight: 12, // 设置高度
						itemGap: 30,
						//orient: 'vertical',　
						textStyle: {
							color: '#666666'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						top:'20%',
						bottom: '10%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: month,
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666666'
							},
							formatter: '{value}',
						},
					}],
					yAxis: [{
						type: 'value',
						//name: '床位数量',
						nameGap: 10,
						nameRotate: 90,
						nameTextStyle: {
							'color': '#333',
							'fontSize': 13,
							'padding': [13, 4, 100, -180]
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#666666'
							},
							formatter: '{value}',
						},
						splitLine: { //网格线
							show: true,
							lineStyle: {
								color: ['#EEEEEE'],
								width: 1,
								type: 'solid'
							}　　
						}
					}],
					series: [{
							name: '电气温度报警',
							type: 'bar',
							barWidth: '18',
							stack: "床",
							data: num1,
							itemStyle: {
								normal: {
									label: {
										show: true, //开启显示
										position: 'top', //在上方显示
										textStyle: { //数值样式
											color: '#333',
											fontSize: 16
										}
									},
									color: '#63C4C7',
								}
							},
						}, {
							name: '剩余电流报警',
							type: 'bar',
							stack: "床",
							barWidth: '18',
							data: num2,
							itemStyle: {
								normal: {
									label: {
										show: true, //开启显示
										position: 'top', //在上方显示
										textStyle: { //数值样式
											color: '#333',
											fontSize: 16
										}
									},
									color: "#B2A2DA",
								}
							},

						},
						{
							name: '烟感报警',
							type: 'bar',
							barWidth: '18',
							stack: "床",
							data: num3,
							itemStyle: {
								normal: {
									label: {
										show: true, //开启显示
										position: 'top', //在上方显示
										textStyle: { //数值样式
											color: '#FFFFFF',
											fontSize: 16
										}
									},
									color: '#70AFEA',
								}
							},
						}
					]
				});
			},
			checkTime(index) {
				this.timeActive = index
				let checkArr = [[{name: '设备损坏',value: 35},
				{name: '设施检测',value: 23},
				{name: '作业场所扬尘',value: 13},
				{name: '违规操作',value: 23},
				{name: '违规施工',value: 44},
				{name: '场所环境不良',value: 21},
				{name: '其他',value: 9}],
				[{name: '设备损坏',value: 45},
				{name: '设施检测',value: 43},
				{name: '作业场所扬尘',value: 53},
				{name: '违规操作',value: 53},
				{name: '违规施工',value: 64},
				{name: '场所环境不良',value: 71},
				{name: '其他',value: 29}]]
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
						//formatter: function(a) {
						//let index = a.dataIndex
						////return(
						////todayMonthFomatter[index]['name'] +
						////'<br/>' + todayMonthFomatter[index]['moneyValue'] + '元' +
						////'<br/>' + todayMonthFomatter[index]['peopleAll'] + '人' + '(按100%发放)' +
						////'<br/>' + todayMonthFomatter[index]['peopleHalf'] + '人' + '(按50%发放)'
						////);
						//
						//},
					},
					graphic: [{
						type: 'text',
						left: 'center',
						top: '47%',
						style: {
							text: '36',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 35,
						}
					}, {
						type: 'text',
						left: 'center',
						top: '60%',
						style: {
							text: '告警总数',
							fill: '#666',
							width: 30,
							height: 30,
							fontSize: 16,
						}
					}],
					series: [{
						name: '',
						type: 'pie',
						radius: ['45%', '70%'],
						center: ['50%', '55%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								formatter: '{b}\n{d}%',
								//borderWidth: 20,
								//borderRadius: 4,
								//show: true,
								textStyle: {
									fontSize: 14,
                                    color: "#333333"
																				
									}
							},
						},
						labelLine: {
							normal: {
								show: true,
								lineStyle: {
                                        color: '#DCDFE6'
                                    },
                                    textStyle:{
                                    	 color: '#333333'
                                    }
							}
						},
						data: this.checkData,
						itemStyle: {
							color: function(params) {
								var colorList = [
									'#90716E', '#63C4C7','#B2A2DA', '#70AFEA','#F4BB89', '#DF8B8E','#8F98B1'
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
						top: '47%',
						style: {
							text: '36',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 32,
						}
					}, {
						type: 'text',
						left: 'center',
						top: '60%',
						style: {
							text: '误报总数',
							fill: '#666',
							width: 30,
							height: 30,
							fontSize: 16,
						}
					}],
					series: [{
						name: '',
						type: 'pie',
						radius: ['45%', '70%'],
						center: ['50%', '55%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								formatter: '{b}\n{d}%',
								//											borderWidth: 20,
								//											borderRadius: 4,
								//											show: true,
						textStyle: {
									fontSize: 14,
                                    color: "#333333"
																				
									}
							},
						},
						labelLine: {
							normal: {
								show: true,
								lineStyle: {
                                        color: '#DCDFE6'
                                    },
                                    textStyle:{
                                    	 color: '#333333'
                                    }
							}
						},
						data:this.checkData,
						itemStyle: {
							color: function(params) {
								var colorList = [
									'#90716E', '#63C4C7','#B2A2DA', '#70AFEA','#F4BB89', '#DF8B8E','#8F98B1'
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
						top: '47%',
						style: {
							text: '36',
							fill: '#000',
							width: 30,
							height: 30,
							fontSize: 32,
						}
					}, {
						type: 'text',
						left: 'center',
						top: '60%',
						style: {
							text: '告警总数',
							fill: '#666',
							width: 30,
							height: 30,
							fontSize: 16,
						}
					}],
					series: [{
						name: '',
						type: 'pie',
						radius: ['45%', '70%'],
						center: ['50%', '55%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								formatter: '{b}\n{d}%',
								//											borderWidth: 20,
								//											borderRadius: 4,
								//											show: true,
					      textStyle: {
									fontSize: 14,
                                    color: "#333333"
																				
									}
							},
						},
						labelLine: {
							normal: {
								show: true,
								 lineStyle: {
                                        color: '#DCDFE6'
                                    },
                                    textStyle:{
                                    	 color: '#333333'
                                    }
							}
						},
						data:this.checkData,
						itemStyle: {
							color: function(params) {
								var colorList = [
									'#90716E', '#63C4C7','#B2A2DA', '#70AFEA','#F4BB89', '#DF8B8E','#8F98B1'
								];
								return colorList[params.dataIndex]
							},
						},
					}]
				});
			},
			searchToday(){
				
		
			}
						
		}
	}
</script>

<style scoped>
  .warningBox{
  	width:48%;
	height:215px;
	background:rgba(255,255,255,1);
	box-shadow:0px 5px 5px 0px rgba(0,0,0,0.05);
	border-radius:5px;
	float: left;
  }
  .warningBox:nth-child(even){
  	margin-left: 2.5%;
  }
  .warningBox:nth-child(1){
  	margin-bottom: 18px;
  }
  .warningBox:nth-child(2){
  	margin-bottom: 18px;
  }
  .warningNum{
  	color: #ED9079;
  	font-size: 40px;
  	margin-top: 80px;
  	text-align: center;
  	height: 40px;
  }
  .warningNum span{
  	font-size: 16px;
  }
  .warningTitle{
  	text-align: center;
  	margin: 10px 0;
  }
  .allready{
  	color: #5DC593;
  }
  .addNum{
  	color: #A372E3;
  }
  .warningEchartBox{
  	height:445px;
	background:rgba(255,255,255,1);
	box-shadow:0px 5px 5px 0px rgba(0,0,0,0.05);
	border-radius:5px;
	
  }
  .warningEchartTitle{
  	height:57px;
	background:rgba(251,251,252,1);
	border-radius:0px 0px 5px 5px;
	font-size:18px;
	font-weight:500;
	color:rgba(51,51,51,1);
	line-height:57px;
	text-align: center;
  }
  .todayWraining{
  	width:90px;
	height:36px;
	background:rgba(255,255,255,1);
	border-radius:4px;
	border:1px solid rgba(211,212,214,1);
	font-size:14px;
	font-weight:500;
	color:rgba(51,51,51,1);
    position: absolute;
    top: 80px;
    left: 36%;
    text-align: center;
    line-height: 36px;
    z-index: 500;
    cursor: pointer;
  }
  	.checkTimeBtn {
		width: 72px;
		height: 36px;
		background: rgba(255, 255, 255, 1);
		color: #333333;
		margin-left: 0;
		border: none;
		font-weight: 500;
		margin-right: 20px;
	}
	.checkTimeBtn:nth-child(1){
		margin-right: 0;
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
		margin-right: 20px;
	}
	.timeBtn:nth-child(1){
		margin-right: 0;
	}
	.echartsItem{
	font-size:18px;
	font-family:PingFangSC-Medium,PingFang SC;
	font-weight:500;
	color:rgba(51,51,51,1);
	text-align: center;
	margin: 30px 0;
	}
</style>