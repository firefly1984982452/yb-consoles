<template>
	<div class="app-container">
		<el-row class="warp" id="staffTableStyle">
			<el-col>
				<div class="box-card" style="background: #fff;">
					<el-row>
						<el-form ref="searchForm" :model="searchForm" label-width="70px">
							<el-col :xl="4" :lg="5" style="margin-top: 20px;margin-left: 10px;">
								<el-form-item label="分类名称">
									<el-select v-model="searchForm.pt_name" placeholder="请选择" clearable @change="changeStatus7">
										<el-option v-for="item in option1" :key="item.sfd_id" :label="item.sfd_name" :value="item.sfd_id"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xl="4" :lg="5" style="margin-top: 20px;">
								<el-form-item label="分类描述">
									<el-input v-model="searchForm.pt_represent" placeholder="请输入" clearable></el-input>
								</el-form-item>
							</el-col>
						</el-form>
						<el-col :span="2" class="searchBtns" style="margin-left: 1.5%;margin-top: 20px;">
							<el-button style="background: #2368D3;color: #FFFFFF;" type="" @click="searchData()"><i style="font-size:12px" class="btniconfont iconjichutubiao-chaxun"></i>查询</el-button>
						</el-col>
						<el-col :span="2" class="searchBtns" style="margin-left: 0.5%;margin-top: 20px;">
							<el-button type="" @click="resizeData()"><i class="btniconfont iconjichutubiao-zhongzhi"></i>重置</el-button>
						</el-col>

						<el-button class="addEquipment" @click="addCataloge"><i class="btniconfont iconjichutubiao-tianjia-huise"></i>新增分类</el-button>
						<el-col style="background: rgb(255, 255, 255);border-radius: 4px;">
							<el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="width:95%;position:relative;left:2%;">
								<el-table-column label="分类名称" min-width="100">
									<template slot-scope="scope">{{scope.row.pt_name | nothingFilter}}</template>
								</el-table-column>

								<el-table-column label="创建时间" min-width="140">
									<template slot-scope="scope">{{scope.row.pt_create_time | nothingFilter}}</template>
								</el-table-column>
								<el-table-column label="分类描述" min-width="140">
									<template slot-scope="scope">{{scope.row.pt_represent | nothingFilter}}</template>
								</el-table-column>
								<el-table-column label="状态" min-width="140">
									<template slot-scope="scope">
										<span v-if="scope.row.pt_status==1">有效</span>
										<span v-if="scope.row.pt_status==0">无效</span>
									</template>
								</el-table-column>
								<el-table-column label="操作" min-width="100">
									<template slot-scope="scope">
										<el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
											<el-button size="mini" class="lookta" @click="edit(scope.row)"><i class="btniconfont iconcaozuotubiao-bianji"></i></el-button>
										</el-tooltip>
										<el-tooltip class="item" effect="dark" content="关闭" placement="top-end">
											<el-button size="mini" class="lookta" @click="closeXunCha(scope.row)"><i class="btniconfont iconcaozuotubiao-tingyong-xuanfu"></i></el-button>
										</el-tooltip>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination @current-change="handleCurrentChange" :current-page="currentPage3" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
							</el-pagination>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>
		<el-row class="ybBanner">
			<el-dialog :title="title" :visible.sync="dialogFormVisible" width="23%">
				<el-row class="warp" v-loading="loading" id="">
					<el-col style="margin-top:20px;">
						<el-row :gutter="20">
							<div class="dialogText" v-if="this.pt_status==1">确认要将【消防巡查】设为无效吗？</div>
							<div class="dialogText" v-if="this.pt_status==0">确认要将【消防巡查】设为有效吗？</div>
						</el-row>
						<el-row style="text-align:center;margin:50px 0px 20px 0;" :gutter="10" type="flex" justify="center">
							<el-col class :xl="5" :lg="6">
								<el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}" @click="saveDict()">保存</el-button>
							</el-col>
							<el-col class :xl="5" :lg="6">
								<el-button @click="dialogFormVisible=false">关闭</el-button>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-dialog>
			<span>技术支持：有伴（上海）智能科技有限公司</span>
		</el-row>
	</div>
</template>
<script>
	import axios from "axios";
	import qs from "qs";
	export default {
		data() {
			return {
				dialogFormVisible: false,
				title: '提示',
				option1: [],
				loading: true,
				pt_status: '',
				pt_id: '',
				dataSearch:{},
				searchForm: {
					pt_name: '',
					pt_represent: '',
					page: 1,
					row: 10,
				},
			}
		},
		computed: {
			tableData: {
				get() {
					return this.$store.getters.catalogeDatas;
				},
				set() {}
			},
			totalPage: {
				get() {
					return this.$store.getters.catalogeTotals;
				},
				set() {}
			},
			currentPage3: {
				get() {
					return this.$store.getters.catalogePages;
				},
				set() {}
			},
			firstZhuTi: {
				get() {
					return this.$store.getters.firstColors;
				},
				set() {}
			},
		},
		created() {
			this.allData()
			this.xunChaFenLei()
			this.loading = true;
			this.$store.commit("setCatalogePage", 1);
		},
		methods: {
			addCataloge() {
				this.$router.push({
					path: '/fire/xunCha/addXunChaCataloge'
				})
			},
			xunChaFenLei() {
				axios
					.post("/fire/Info/querySysFireDictByxunjianfenlei")
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.option1 = res.data.data;
						} else if(res.data.code == "401") {
							this.$message({
								message: res.data.message,
								type: "warning"
							});
							this.$router.push("/login");
						} else {
							this.$message.error(res.data.message);
						}
					});
			},

			allData() {
				axios
					.post("/fire/patrol/selectByPrimaryBpynameand", qs.stringify(this.searchForm))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							console.log(res.data.data)
							this.$store.commit("setCatalogePage", 1);
							this.$store.commit("setCatalogeData", res.data.data);
							this.$store.commit("setCatalogeTotal", res.data.total);
						} else if(res.data.code == "401") {
							this.$message({
								message: res.data.message,
								type: "warning"
							});
							this.$router.push("/login");
						} else {
							this.$message.error(res.data.message);
						}
					})
					.catch(err => {
						this.loading = false;
					});
			},
			searchData() {
				this.allData()
			},
			resizeData() {
				this.searchForm.pt_name = ''
				this.searchForm.pt_represent = ''
				this.allData()
			},
			edit(value) {
				this.$router.push({
					path: '/fire/xunCha/addXunChaCataloge',
					query: {
						ptId: 1,
						pt_id: value.pt_id
					}
				})
			},
			closeXunCha(value) {
				this.dialogFormVisible = true
				this.pt_status = value.pt_status
				this.pt_id = value.pt_id
			},
			handleCurrentChange(val) {
				this.searchForm.page = val
				this.allData()
			},
			saveDict() {
				debugger
				if(this.pt_status == 1) {
					this.dataSearch = {
						ptStatus: '0',
						ptId: this.pt_id
					}
				} else {
					this.dataSearch = {
						ptStatus: '1',
						ptId: this.pt_id
					}
				}
				axios
					.post("/fire/patrol/addPatrol", qs.stringify(this.dataSearch))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.dialogFormVisible = false
							console.log(res.data.data)
							this.$store.commit("setCatalogeData", res.data.data);
							this.$store.commit("setCatalogeTotal", res.data.total);

						} else if(res.data.code == "401") {
							this.$message({
								message: res.data.message,
								type: "warning"
							});
							this.$router.push("/login");
						} else {
							this.$message.error(res.data.message);
						}
					})
					.catch(err => {
						this.loading = false;
					});
			}
		}
	};
</script>

<style scoped>
	.addEquipment {
		width: 95px;
		height: 36px;
		background: #6CBC6C;
		color: white;
		float: right;
		margin-right: 1%;
		margin-top: 20px;
	}
	
	.addEquipment .btniconfont {
		color: white;
		font-size: 12px;
	}
	
	.box-card .item {
		margin-bottom: 0px;
	}
	
	.dialogText {
		font-size: 16px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 22px;
	}
</style>