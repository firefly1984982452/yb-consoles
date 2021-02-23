<template>
	<div class="app-container" id="liveCrList">
		<el-row class="warp" v-loading="loading">
			<el-col class="searchTop">
				<el-form :inline="true" class="search" ref="searchForm" :model="searchForm" label-width="75px">
					<el-row class="row-bg" type="flex" :gutter="0">
						<el-col :xl="4" :lg="5">
							<el-form-item label="老人姓名">
          						<ub-elder v-model="elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
							</el-form-item>
						</el-col>
						<el-col :xl="7" :lg="7" style="margin-left: 1.5%">
							<el-form-item label="时间" label-width="91px">
								<el-date-picker v-model="searchForm.time" type="daterange" format="yyyy/MM/dd " value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" clearable></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- <el-col :xl="7" :lg="7">
							<el-form-item label="回院时间" label-width="91px">
								<el-date-picker v-model="searchForm.endDate" type="daterange" format="yyyy/MM/dd " value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" clearable></el-date-picker>
							</el-form-item>
						</el-col> -->
						<el-button
							type
							style="background-color:#2368D3;color:#fff;"
							@click="searchUser()"
							icon="el-icon-search"
						>查询</el-button>
						<el-button type @click="resizeData()" icon="el-icon-refresh-right">重置</el-button>

					</el-row>
				</el-form>
			</el-col>
			<el-col style="background:#fff;border-radius:4px;border: 1px solid #dcdfe6;padding-top:20px">
				<el-row style="width: 95%;position:relative;left:2%;padding-bottom:20px" class="button-grounp row-bg" :gutter="0" type="flex">
					<el-col :span="2">
						<el-button class="navBtn" :type="stateShow == 0 ? 'primary' : ''" plain @click="selectLive(0)">
							<span class="btn-font-size">待回院&nbsp;<span>({{totalPage}})</span></span>
						</el-button>
					</el-col>
					<el-col :span="2">
						<el-button class="navBtn" :type="stateShow == 1 ? 'primary' : ''" plain @click="selectLive(1)">
							<span class="btn-font-size">已回院&nbsp;<span>({{totalPage1}})</span></span>
						</el-button>
					</el-col>
				</el-row>
				<el-table 
					v-if="stateShow==0" 
					ref="multipleTable" 
					tooltip-effect="dark" 
					:data="tableData" 
					border 
					style="width:95%;position:relative;left:2%;" 
					:cell-style="{padding: '5px 0'}" 
					:header-cell-style="{background:'#F3F3F5'}" 
					class="ub-table">
					<el-table-column prop="id" label="ID号" min-width="50"></el-table-column>
					<el-table-column label="照片" min-width="60">
						<template slot-scope="scope">
              				<ub-image style="height:100px" class="image" fit="cover" :src="scope.row.photoUrl" :defaultSrc="scope.row.photoUrl"></ub-image>
						</template>
					</el-table-column>
					<el-table-column prop="visitorName" label="姓名" min-width="50">
						<template slot-scope="scope">{{scope.row.visitorName | nothingFilter}}</template>
					</el-table-column>
					<el-table-column prop="roomName" label="房间号" min-width="100">
						<template slot-scope="scope">{{scope.row.roomName | nothingFilter}}</template>
					</el-table-column>
					<el-table-column prop="createTime" label="外出时间" min-width="80">
						<template slot-scope="scope">{{scope.row.createTime | nothingFilter}}</template>
					</el-table-column>
					<el-table-column prop="visitorName" label="外出类型" min-width="60">
						<template slot-scope="scope">{{scope.row.visitorName | nothingFilter}}</template>
					</el-table-column>
					<el-table-column prop="visitorName" label="计划回院时间" min-width="100">
						<template slot-scope="scope">{{scope.row.visitorName | nothingFilter}}</template>
					</el-table-column>
					<el-table-column  label="状态" min-width="60">
						<template >已外出</template>
					</el-table-column>
					<el-table-column label="进出记录" min-width="50" style="text-align: center;">
						<template slot-scope="scope" >
							<el-tooltip class="item" effect="dark" content="查看" placement="top-end">
								<i class="iconfont iconcaozuotubiao-chakan" @click="see(scope.row,scope.row.visitorId)" ></i>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!--<span class="resultStyle" style="position: relative;top:4px;">查询结果 ：<b>{{totalPage}}</b>条</span>-->
				<el-pagination 
					style="margin:20px auto;text-align:center;"
					v-if="stateShow==0" 
					@current-change="handleCurrentChange" 
					:current-page="currentPage3" 
					:page-size="10" 
					layout="total, prev, pager, next, jumper" 
					:total="totalPage">
				</el-pagination>
				<!--已回院-->
				<el-table 
					v-if="stateShow==1" 
					ref="multipleTable" 
					tooltip-effect="dark" 
					:data="tableData1" 
					border 
					style="width:95%;position:relative;left:2%;"
					:cell-style="{padding: '5px 0',}"
					:header-cell-style="{background:'#F3F3F5'}" 
					class="ub-table">
					<el-table-column prop="id" label="ID号" min-width="50"></el-table-column>
					<el-table-column label="照片" min-width="60">
						<template slot-scope="scope">
              				<ub-image style="height:100px" class="image" fit="cover" :src="scope.row.photoUrl" :defaultSrc="scope.row.photoUrl"></ub-image>
						</template>
					</el-table-column>
					<el-table-column prop="visitorName" label="姓名" min-width="50">
						<template slot-scope="scope">{{scope.row.visitorName | nothingFilter}}</template>
					</el-table-column>
					<el-table-column prop="roomName" label="房间号" min-width="100">
						<template slot-scope="scope">{{scope.row.roomName | nothingFilter}}</template>
					</el-table-column>
					<el-table-column prop="updateTime" label="日期" min-width="80">
						<template slot-scope="scope">{{scope.row.updateTime | nothingFilter}}</template>
					</el-table-column>
					<el-table-column prop="createTime" label="最早外出时间" min-width="100">
						<template slot-scope="scope">{{scope.row.createTime | nothingFilter}}</template>
					</el-table-column>
					<el-table-column prop="visitType" label="外出类型" min-width="60">
						<template>-</template>
					</el-table-column>
					<el-table-column prop="endTime" label="计划回院时间" min-width="100">
						<template >-</template>
					</el-table-column>
					<el-table-column prop="endTime" label="最晚回院时间" min-width="100">
						<template>-</template>
					</el-table-column>

					<el-table-column label="进出记录" min-width="50" style="text-align: center;">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" content="查看" placement="top-end">
								<i class="iconfont iconcaozuotubiao-chakan" @click="see(scope.row,scope.row.visitorId)" ></i>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!--<span class="resultStyle" style="position: relative;top:4px;">查询结果 ：<b>{{totalPage}}</b>条</span>-->
				<el-pagination
					style="margin:20px auto;text-align:center;" 
					v-if="stateShow==1" @current-change="handleCurrentChange1" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage1">
				</el-pagination>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import ubImage from '@/components/image';
	import ubElder from "@/components/elder";
	export default {
  		components: {ubImage,ubElder},
		data() {
			return {
				elderId:'',
				stateShow: 0,
				loading: true,
				//查询条件数据
				searchForm: {
					elderName: "",
					time:'',
					startDate: '',
					endDate: '',
				},
				tableData: [],
				currentPage:1,
				totalPage:0,
				tableData1: [],
				currentPage3:1,
				totalPage1:0
			};
		},
		mounted() {
			this.getData()
		},
		methods: {
			getData(){
				if(this.stateShow == 0) {
					this.currentPage = 1;
					this.getData1();
				} else {
					this.currentPage3 = 1;
					this.getData2();
				}
			},
			getData1(){
				this.loading = true;
				this.searchForm.startDate = this.searchForm.time ? this.searchForm.time[0] : '';
				this.searchForm.endDate = this.searchForm.time ? this.searchForm.time[1] : '';
				this.searchForm.pageIndex = this.currentPage;
				axios.fetch('visitServer', "/visitor/get/stayBackElder",this.searchForm).then(res => {
					this.loading = false;
					if(res.code == 200) {
						this.tableData = res.data;
						this.totalPage = res.total;
					} else if(res.code == "401") {
						this.$message({
							message: res.message,
							type: "warning"
						});
						this.$router.push("/login");
					} else {
						this.$message.error(res.message);
					}
				})
				.catch(err => {
					this.loading = false;
				});

			},
			getData2(){
				this.loading = true;
				this.searchForm.startDate = this.searchForm.time ? this.searchForm.time[0] : '';
				this.searchForm.endDate = this.searchForm.time ? this.searchForm.time[1] : '';
				this.searchForm.pageIndex = this.currentPage2;
				axios.fetch('visitServer', "/visitor/get/alreadyBackElder",this.searchForm).then(res => {
					this.loading = false;
					if(res.code == 200) {
						this.tableData1 = res.data;
						this.totalPage1 = res.total;
					} else if(res.code == "401") {
						this.$message({
							message: res.message,
							type: "warning"
						});
						this.$router.push("/login");
					} else {
						this.$message.error(res.message);
					}
				})
				.catch(err => {
					this.loading = false;
				});
			},
			/*切换上标题*/
			selectLive(status) {
				this.stateShow = status;
				this.getData();
			},
			/*查询第几页数据*/
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData1();
			},
			/*查询第几页数据*/
			handleCurrentChange1(val) {
				this.currentPage3 = val;
				this.getData2();
			},

			/*按条件查询*/
			searchUser() {
				if(this.stateShow == 0) {
					this.getData1();
				} else {
					this.getData2();
				}
			},
			see(inedx,visitorId) {
				this.$router.push({
					path: "/visit/goOutDetail",
					query: {
						visitorId: visitorId,
					}
				});
			},
			resizeData() {
				this.searchForm.elderName = '';
				this.searchForm.time = '';
				this.searchForm.startDate = '';
				this.searchForm.endDate = '';
				this.searchForm.pageIndex = '';
				this.currentPage = 1;
				this.currentPage3 = 1;
				this.elderId = '';
				this.getData();
			},

		},
		filters: {
			statusFilter: val => {
				return ['','待入住','已完成','已取消'][val];
			}
		}
	};
</script>
<style scoped>
	.navBtn {
		width: 90%!important;
	}
	
	.btn-font-size {
		font-size: 14px;
		font-weight: 500;
	}
</style>