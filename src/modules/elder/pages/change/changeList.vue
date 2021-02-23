<template>
	<div>
		<el-form :inline="true" class="search" ref="searchForm" :model="searchForm">
			<el-form-item label="老人姓名">
				<!-- <el-input v-model="searchForm.elderName" placeholder="请输入内容"></el-input> -->
				 <ub-elder v-model="searchForm.elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
			</el-form-item>
			<el-form-item label="变更时间" label-width="5em">
				<el-date-picker v-model="searchForm.startTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
				<el-date-picker v-model="searchForm.endTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
			</el-form-item>
			<el-button type="primary" @click="searchInfo()">查询</el-button>
			<el-button @click="reset()">重置</el-button>
			<el-button style="float:right" icon="el-icon-plus" type="warning" @click="change()">变更</el-button>
		</el-form>
		<div class="content">
			<el-table :data="list" border :span-method="cellMerge" class="table">
				<el-table-column label="变更时间" prop="createTime" min-width="150">
					<template slot-scope="scope">{{scope.row.createTime | datetimeFilter}}</template>
				</el-table-column>
				<el-table-column label="姓名" prop="elderName" min-width="120"></el-table-column>
				<el-table-column label="变更前" width="400">
					<el-table-column label="" prop="category" min-width="150">
                       <template slot-scope="scope">{{scope.row.category | categoryFilter}}</template>
					</el-table-column>
					<el-table-column label="" prop="lastDescription" min-width="250">
                        <template slot-scope="scope">
						    <span v-if="scope.row.category===0||scope.row.category===1">
								{{scope.row.lastDescription}} &nbsp;托管费 {{scope.row.lastFee}}元/月
							</span>
                            <span v-if="scope.row.category===2">
							   {{scope.row.lastDescription}} &nbsp;护理费 {{scope.row.lastFee}}元/月
							</span>
                            <span v-if="scope.row.category===3">
							   <span :style="{'color':scope.row.lastValue===1?'#2FC07A':'#EB6969'}">{{scope.row.lastDescription}}外出</span>
							</span>
							<span v-if="scope.row.category===4">
							   <span :style="{'color':scope.row.lastValue===1?'#2FC07A':'#EB6969'}">{{scope.row.lastDescription}}发药</span>
							</span>
							<span v-if="scope.row.category===6">
							   <span >{{scope.row.lastDescription}}</span>
							</span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="变更后" min-width="600">
					<el-table-column label="" prop="category" min-width="150">
                       <template slot-scope="scope">{{scope.row.category | categoryFilter}}</template>
					</el-table-column>
					<el-table-column label="" prop="currentDescription" min-width="450">
						<template slot-scope="scope">
							<span v-if="scope.row.category===0||scope.row.category===1">
								{{scope.row.currentDescription}} &nbsp;托管费 {{scope.row.currentFee}}元/月  &nbsp;计费时间 {{scope.row.currentStart | datetimeFilter}}
							</span>
							<span v-if="scope.row.category===2">
								{{scope.row.currentDescription}} &nbsp;护理费 {{scope.row.currentFee}}元/月  &nbsp;计费时间 {{scope.row.currentStart | datetimeFilter}}
							</span>
							<span v-if="scope.row.category===3">
								<span :style="{'color':scope.row.currentValue===1?'#2FC07A':'#EB6969'}">{{scope.row.currentDescription}}外出 &nbsp;生效时间 {{scope.row.createTime | datetimeFilter}}</span>
							</span>
							<span v-if="scope.row.category===4">
								<span :style="{'color':scope.row.currentValue===1?'#2FC07A':'#EB6969'}">{{scope.row.currentDescription}}发药 &nbsp;生效时间 {{scope.row.createTime | datetimeFilter}}</span>
							</span>
							<span v-if="scope.row.category===6">
							   <span >{{scope.row.currentDescription}} &nbsp;生效时间 {{scope.row.createTime | datetimeFilter}}</span>
							</span>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="操作人" prop="creator" min-width="150"></el-table-column>
				<el-table-column label="操作" prop="label7" min-width="150">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="打印" placement="top-end">
							<el-button size="mini" @click="print(scope.row)" icon="el-icon-printer"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	import axios from "axios";
	import printMethods from '@/utils/print';
	import ubElder from "@/components/elder";
	export default {
		components: {
			ubElder,
		},
		data() {
			return {
				spanArr: [],  
				pos: 0,
				contentSpanArr: [],
                position: 0,
				loading: false,
				searchForm: { 
					elderName: '',
					isFirst: 0,
					startTime:'',
					endTime:''
				},
				state1: "",
				list: []
			};
		},
		created() {
			this.dataInit();
		},
		methods: {
			cellStyle({row,column,rowIndex,columnIndex}) {
				return 'padding: 5px 0'
			},
			dataInit(){
				axios
				.fetch('elderServer', "/elderChange/list", this.searchForm)
				.then(res => {
					let resData = res.data;
					this.list = resData;
					this.getSpanArr();
				})
			},
			searchInfo() {
				if (this.searchForm.startTime && !this.searchForm.endTime) {
					this.$message.warning("请选择结束时间");
					return false;
				}
				if (!this.searchForm.startTime && this.searchForm.endTime) {
					this.$message.warning("请选择开始时间");
					return false;
				}
				if (this.searchForm.startTime && this.searchForm.endTime) {
					if (
					this.$moment(this.searchForm.startTime).valueOf() >
					this.$moment(this.searchForm.endTime).valueOf()
					) {
					this.$message.warning("开始时间不能超过结束时间");
					return false;
					}
				}
				this.dataInit();
			},
            //获取spanArr
			getSpanArr() {　
				let data = this.list;
				this.spanArr = [];
				this.contentSpanArr = [];
				for (var i = 0; i < data.length; i++) {
					if (i === 0) {
					this.spanArr.push(1);
					this.pos = 0;
					this.contentSpanArr.push(1);
					this.position = 0;
					} else {
					// 判断当前元素与上一个元素是否相同(第1和第2列)
					if (data[i].createTime.substr(0, 10) === data[i - 1].createTime.substr(0, 10)
						&& data[i].elderName === data[i-1].elderName) {
						this.spanArr[this.pos] += 1;
						this.spanArr.push(0);
					} else {
						this.spanArr.push(1);
						this.pos = i;
					}
				}}
			},
			cellMerge({ row, column, rowIndex, columnIndex }) {
			     if (columnIndex === 0 || columnIndex === 1 || columnIndex === 6 || columnIndex === 7) {
					const _row = this.spanArr[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
					rowspan: _row,
					colspan: _col
					};
				}
			},
			/*刷新*/
			reset() {
				this.searchForm = {
				  elderName: '',
				  isFirst: 0,
				  startTime:'',
				  endTime:''
				}
				this.dataInit();
			},
			...printMethods, //引入打印方法
			//打印
			print(data){
				this.openPrint( {
					path: '/print/elder/change',
					query: {
						elderId: data.elderId,
						changeId: data.changeId,
						createTime: data.createTime.split(' ')[0]
					}
				});
			},
			change(){
				// this.$store.state.submitElderServiceSuccess = false;
				this.$router.push({
					path: "/elder/changeList"
				});
			}
		},
		filters:{
			categoryFilter: val=>{
				if(val===0){
                   return val='床位变更'; 
				}else if(val===1){
                   return val='床位调换'; 
				}else if(val===2){
                   return val='照护等级'; 
				}else if(val===3){
                   return val='外出约定'; 
				}else if(val===4){
                   return val='发药约定'; 
				}else if(val===5){
                   return val='长护险'; 
				}else if(val===6){
                   return val='特殊防护'; 
				}
			},
			agreeFilter: val=>{
				if(val===0){
                   return val='不同意'; 
				}else if(val===1){
                   return val='同意'; 
				}
			},
			levelFilter: val => {
				if(val == 0) {
					val = "无护理";
				} else if(val == 1) {
					val = "护理一级";
				} else if(val == 2) {
					val = "护理二级";
				} else if(val == 3) {
					val = "护理三级";
				} else if(val == 4) {
					val = "护理四级";
				} else if(val == 5) {
					val = "护理五级";
				}else if(val == 6) {
					val = "护理六级";
				}
				return val;
			},
			datetimeFilter: val => {
				if(val){
                  val = val.split(' ')[0];
				}else {
                  val = null;
				}
				return val;
			},
		}
	};
</script>
<style scoped>
.content {
	padding: 20px;
}
.table >>> thead tr:nth-child(2) {
	display: none;
}
.table >>> th {
	color: #000;
	font-size: 15px;
	font-weight: bold;
	text-align: center;
}
.table >>> td {
	text-align: center;
}
.el-autocomplete {
	width: 10em;
}
</style>
