<template>
	<div class="app-container" id="userList">
		<div v-if="state==1">
			<router-view></router-view>
		</div>
		<el-row class="warp userList" v-loading="loading" id="tableList" style="padding-top: 0px;background:#ECF0F4;border: none;" v-else>
			<!--日期条件查询   -->
			<el-col class="searchTop">
				<el-form :inline="true" class="search" ref="searchForm" :model="searchForm" label-width="75px">
					<el-row :gutter="0">
						<el-col :xl="4" :lg="6">
							<el-form-item label="员工姓名">
								<el-input v-model="searchForm.employeeName" placeholder="请输入" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xl="5" :lg="6">
							<el-form-item label="月份" label-width="85px">
								<el-date-picker  value-format="yyyy-MM" v-model="searchForm.dateMonth" type="month" placeholder="选择月">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-button
							type
							style="background-color:#2368D3;color:#fff;"
							@click="searchVisitorDate()"
							icon="el-icon-search"
						>查询</el-button>
						<el-button type @click="resizeData()" icon="el-icon-refresh-right">重置</el-button>
					</el-row>
				</el-form>
			</el-col>
			<!-- 2 -->
			<el-col style="background: #fff;border: 1px solid rgb(220, 223, 230);border-radius: 4px;padding-top: 10px;padding-bottom: 20px;">
				<el-row class="btn-grounp-table" :gutter="0" type="flex">
					<el-col :span="24" id="btn-grounp">
						<el-row :gutter="0" class='clearfix' type="flex" justify="end">
							<el-col :span="22" style="padding-top: 10px;padding-left:20px;">
								<span style="font-weight: bolder;letter-spacing: 1.5px">共{{totalPage}}条记录</span>
							</el-col>
							<el-col :xl="2" :lg="3">
						<el-button
							style="background-color:#2368D3;color:#fff;margin:0 0 10px 0" 
							@click="exportExcelData()">
							<i class="iconfont iconjichutubiao-daochubiaoge"></i>导出Excel</el-button>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
				<el-table 
					:data="tableData"
					style="width:98%;position:relative;left:1%;"
					:header-cell-style="{background:'#F3F3F5'}" 
					class="ub-table" 
					border>
					<el-table-column prop="dateMonth" label="月份" width="200">
						<template slot-scope="scope">{{scope.row.dateMonth || '-'}}</template>
					</el-table-column>
					<el-table-column prop="deptName" label="部门" min-width="30">
						<template slot-scope="scope">{{scope.row.deptName || '-'}}</template>
					</el-table-column>
					<el-table-column prop="employeeName" label="姓名" min-width="30">
						<template slot-scope="scope">{{scope.row.employeeName || '-'}}</template>
					</el-table-column>
					<el-table-column prop="oughtNumber" label="应出勤天数" min-width="30">
						<template slot-scope="scope">{{scope.row.oughtNumber || '-'}}</template>
					</el-table-column>
					<el-table-column prop="actualNumber" label="实际出勤天数" min-width="30">
						<template slot-scope="scope">{{scope.row.actualNumber || '-'}}</template>
					</el-table-column>
				</el-table>
				<el-pagination @current-change="handleCurrentChange" :current-page="currentPage3" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
				</el-pagination>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import settings from "@/settings";
	import moment from 'moment'
	export default {
		data() {
			return {
				loading: false,
				searchForm: {
					employeeName: '',
					dateMonth: moment().utc().format('YYYY-MM'),
				},
				tableData:[],
				currentPage3:1,
				totalPage:0,
				pageSize:10

			};
		},
		mounted() {
			this.searchVisitorDate();
		},
		methods: {
			//时间条件搜索
			searchVisitorDate(val) {
				this.loading = true;
				this.searchForm.pageIndex = this.currentPage3;
				this.searchForm.pageSize = this.pageSize;
				axios.fetch('visitServer', "/visitor/query/statisticalAttendance",this.searchForm).then(res => {
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
			resizeData() {
				this.searchForm.dateMonth='',
				this.searchForm.employeeName='',
				this.currentPage3 = 1;
				this.searchVisitorDate();
			},
			/*查询第几页数据*/
			handleCurrentChange(val) {
				this.currentPage3 = val;
				this.searchVisitorDate();
			},
			//导出员工考勤数据
			exportExcelData() {
				const param = {
					dateMonth: this.searchForm.dateMonth,
					employeeName: this.searchForm.employeeName
				};
				var temp = document.createElement("form");
				temp.action =
					settings.servers.visitServer + "/visitor/exportExcel/statisticalAttendance";
				temp.method = "post";
				temp.style.display = "none";
				for (var x in param) {
					var opt = document.createElement("input");
					opt.name = x;
					opt.value = param[x];
					temp.appendChild(opt);
				}
				document.body.appendChild(temp);
				temp.submit();
				document.body.removeChild(temp);
				this.$message.success("导出成功");
			}
		},
	};
</script>
<style scoped>
#userList .el-pagination {
  margin: 20px auto;
  text-align: center;
}
#userList .el-pagination__editor.el-input {
  width: 50px;
}
</style>