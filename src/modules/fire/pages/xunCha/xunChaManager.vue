<template>
	<div class="app-container">
		<el-row class="warp" id="staffTableStyle">
			<el-col>
				<div class="box-card" style="background: #fff;">
					<el-row>
						<el-form ref="searchForm" :model="searchForm" label-width="70px">
							<el-col :xl="4" :lg="5" style="margin-top: 20px;margin-left: 10px;">
								<el-form-item label="分类">
									<el-select v-model="searchForm.status7" placeholder="请选择" clearable @change="changeStatus7">
										<el-option v-for="item in option4" :key="item.sfd_id" :label="item.sfd_name" :value="item.sfd_id"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xl="4" :lg="5" style="margin-top: 20px;">
								<el-form-item label="搜索">
									<el-input v-model="searchForm.status4" placeholder="名称或位置" clearable></el-input>
								</el-form-item>
							</el-col>
						</el-form>
						<el-col :span="2" class="searchBtns" style="margin-left: 1.5%;margin-top: 20px;">
							<el-button style="background: #2368D3;color: #FFFFFF;" type="" @click="searchdData()"><i class="btniconfont iconjichutubiao-chaxun"></i>查询</el-button>
						</el-col>
						<el-col :span="2" class="searchBtns" style="margin-left: 0.5%;margin-top: 20px;">
							<el-button type="" @click="resizeData()"><i class="btniconfont iconjichutubiao-zhongzhi"></i>重置</el-button>
						</el-col>
						<el-button class="erWeMa" @click="addCataloge"><i class="btniconfont iconjichutubiao-erweima"></i>批量生成二维码</el-button>
						<el-button class="addManage" @click="piLiangAdd"><i class="btniconfont iconjichutubiao-tianjia-huise"></i>批量新增点位</el-button>
						<el-button class="addEquipment" @click="addManage"><i class="btniconfont iconjichutubiao-tianjia-huise"></i>新增计划</el-button>
						<el-col style="background: rgb(255, 255, 255);border-radius: 4px;">
							<el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="width:95%;position:relative;left:2%;">
								<el-table-column label="编号" width="60" type="index"></el-table-column>
								<el-table-column label="分类" min-width="100">
									<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
								</el-table-column>
								<el-table-column label="名称" min-width="140">
									<template slot-scope="scope">{{scope.row.di_time | nothingFilter}}</template>
								</el-table-column>
								<el-table-column label="编号" min-width="140">
									<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
								</el-table-column>
								<el-table-column label="位置" min-width="140">
									<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
								</el-table-column>
								<el-table-column label="周期" min-width="140">
									<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
								</el-table-column>
								<el-table-column label="次数" min-width="140">
									<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
								</el-table-column>
								<el-table-column label="操作" min-width="100">
									<template slot-scope="scope">
										<el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
											<el-button size="mini" class="lookta" @click="edit(scope.row)"><i class="btniconfont iconcaozuotubiao-bianji"></i></el-button>
										</el-tooltip>
										<el-tooltip class="item" effect="dark" content="查看" placement="top-end">
											<el-button size="mini" class="lookta" @click="see()"><i class="btniconfont iconcaozuotubiao-chakan"></i></el-button>
										</el-tooltip>
										<el-tooltip class="item" effect="dark" content="关闭" placement="top-end">
											<el-button size="mini" class="lookta" @click="dialogFormVisible=true"><i class="btniconfont iconcaozuotubiao-tingyong-xuanfu"></i></el-button>
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
							<div class="dialogText">确认要将【消防巡查】设为无效吗？</div>
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
			<el-dialog :title="title" :visible.sync="dialogFormVisible" width="23%">
				<el-row class="warp" v-loading="loading" id="">
					<el-col style="margin-top:20px;">
						<el-row :gutter="20">
							<div class="dialogText">确认要将【消防巡查】设为无效吗？</div>
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
				btnArr: ['设备管理', '设施管理'],
				isactive: '0',
				show3: false,
				dialogFormVisible: false,
				dialogFormVisible1: false,
				dictForm: [],
				title: '提示',
				
				search: {
					sfd_id2: '',
					sfd_id: '',
					di_status: '',
					di_link_status: '',
				},
				di_manufactor: '',
				activeName2: 'first',
				option4: [],
				option3: [{
					label: '删除',
					value: 0
				}, {
					label: '正常',
					value: 1
				}, {
					label: '报警',
					value: 2
				}, {
					label: '故障',
					value: 3
				}],
				option2: [{
					label: '离线',
					value: 0
				}, {
					label: '在线',
					value: 1
				}],
				option1: [],
				diType: '1',
				loading: true,
				option: [],
				searchForm: {
					type: 1,
					enterDate: [],
					status: "",
					status1: '',
					status2: '',
					status7: '',
					status4: '',
					keyWord: '',
					keyWord2: '',
					enterDate: [],
				},
				lastLink: "",

			}
		},
		computed: {
			state: {
				get() {
					return this.$store.getters.showChilds;
				},
				set() {}
			},
			tableData: {
				get() {
					return this.$store.getters.EquipmentDatas;
				},
				set() {}
			},
			totalPage: {
				get() {
					return this.$store.getters.EquipmentTotals;
				},
				set() {}
			},
			currentPage3: {
				get() {
					return this.$store.getters.EquipmentPages;
				},
				set() {}
			},
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
		created() {
		
			axios
				.post("/fire/Info/querySysFireDictByshebeileixin", qs.stringify(data))
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
			axios
				.post("/fire/Info/querySysFireDictByshebeileibie", qs.stringify(data))
				.then(res => {
					this.loading = false;
					if(res.data.code == 200) {
						this.option4 = res.data.data;
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

			var colorBtn = {
				all: 1,
				dai: 0,
				haved: 0,
			};
			this.$store.commit("setColorBtn", colorBtn);
			this.loading = true;
			this.$store.commit("setEquipmentPage", 1);
			let data = {
				diType: '1',
				enterDate: this.searchForm.enterDate,
				status: this.searchForm.status,
				page: 1,
				rows: 10
			};
			axios
				.post("/fire/Info/queryAllDeviceByType", qs.stringify(data))
				.then(res => {
					this.loading = false;
					if(res.data.code == 200) {
						console.log(res.data.data)
						this.$store.commit("setEquipmentPage", 1);
						this.$store.commit("setEquipmentData", res.data.data);
						this.$store.commit("setEquipmentTotal", res.data.total);
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
		methods: {
			
			addManage() {
				this.$router.push({
					path: '/fire/xunCha/addXunChaManage'
				})
			},
			edit(data) {
				this.$router.push({
					path: '/fire/xunCha/addXunChaManage'
				})
			},
			see(){
				this.$router.push({
					path: '/fire/xunCha/xunChaManageDetail'
				})
			},
			piLiangAdd(){
				this.$router.push({
					path: '/fire/xunCha/piLiangAddXunCha'
				})
			},
			
			changeStatus7(e) {

				this.search.sfd_id = e

			},

			changeStatus4(e) {

				this.search.sfd_id2 = e

			},

			changeStatus2(e) {

				this.search.di_status = e

			},

			changeStatus1(e) {

				this.search.di_link_status = e

			},

			searchdData() {
				let data = {
					di_category_id: this.search.sfd_id2,
					di_type_id: this.search.sfd_id,
					diType: this.diType,
					di_name: this.searchForm.keyWord,
					di_manufactor: this.searchForm.keyWord2,
					enterDate: this.searchForm.di_time,
					di_status: this.search.di_status,
					di_link_status: this.search.di_link_status,
				}
				axios.post('/fire/Info/queryAllDeviceByType', qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.$store.commit("setEquipmentPage", 1);
							this.$store.commit("setEquipmentData", res.data.data);
							this.$store.commit("setEquipmentTotal", res.data.total);
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
			searchdData2() {
				let data = {
					di_category_id: this.search.sfd_id2,
					di_type_id: this.search.sfd_id,
					diType: this.diType,
					di_name: this.searchForm.keyWord,
					di_manufactor: this.searchForm.keyWord2,
					enterDate: this.searchForm.di_time,
					di_status: this.search.di_status,
					di_link_status: this.search.di_link_status,
				}
				axios.post('/fire/Info/queryAllDeviceByType', qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.$store.commit("setEquipmentPage", 1);
							this.$store.commit("setEquipmentData", res.data.data);
							this.$store.commit("setEquipmentTotal", res.data.total);
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
			selectLive(typeh, types) {
				if(this.searchForm.status == "待审核") {
					this.searchForm.status = 0;
				} else if(this.searchForm.status == "已审核") {
					this.searchForm.status = 1;
				} else if(this.searchForm.status == "作废") {
					this.searchForm.status = 2;
				}
				this.searchForm.type = types;
				for(var key in this.colorBtn) {
					if(typeh == key) {
						this.colorBtn[key] = 1;
					} else {
						this.colorBtn[key] = 0;
					}
				}
				this.$store.commit("setSubSetUpPage", 1);
				let data = {
					type: types,
					enterDate: this.searchForm.enterDate,
					status: this.searchForm.status,
					page: 1,
					rows: 10
				};
				this.loading = true;
				axios
					.post("/subsidy/type/querySubType", qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.$store.commit("setSubSetUpData", res.data.data);
							this.$store.commit("setSubSetUpTotal", res.data.total);
							this.$store.commit("setSubSetUpPage", 1);
							if(this.searchForm.status === 0) {
								this.searchForm.status = "待审核";
							} else if(this.searchForm.status == 1) {
								this.searchForm.status = "已审核";
							} else if(this.searchForm.status == 2) {
								this.searchForm.status = "作废";
							}
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
						////console.log(err);
						this.loading = false;
					});
			},
			/*下拉*/
			selectTool(cid) {
				let data = {
					sutl_id: cid
				};
				this.loading = true;
				axios
					.post("/system/sysutil/getSysUtilsByid", qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.option = res.data.data;
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
			//设备类型

			/*查询第几页数据*/
			handleCurrentChange(val) {
				if(this.searchForm.status == "待审核") {
					this.searchForm.status = 0;
				} else if(this.searchForm.status == "已审核") {
					this.searchForm.status = 1;
				} else if(this.searchForm.status == "作废") {
					this.searchForm.status = 2;
				}
				this.currentPage3 = val;
				let data = {
					type: this.searchForm.type,
					enterDate: this.searchForm.enterDate,
					status: this.searchForm.status,
					page: val,
					rows: 10
				};
				this.loading = true;
				axios
					.post("/subsidy/type/querySubType", qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.$store.commit("setSubSetUpData", res.data.data);
							this.$store.commit("setSubSetUpPage", val);
							this.$store.commit("setSubSetUpTotal", res.data.total);
							if(this.searchForm.status === 0) {
								this.searchForm.status = "待审核";
							} else if(this.searchForm.status == 1) {
								this.searchForm.status = "已审核";
							} else if(this.searchForm.status == 2) {
								this.searchForm.status = "作废";
							}
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

			sh(data) {
				this.$store.commit("setShowParent", 1);
				if(this.colorBtn.all == 1) {
					this.$router.push({
						path: "/subsidy/subsidysetUpDetail",
						query: {
							id: data.sepy_id,
							sign: "sh",
							type: data.type
						}
					});
				} else if(this.colorBtn.dai == 1) {
					this.$router.push({
						path: "/subsidy/subsidysetUpDetail",
						query: {
							id: data.so_id,
							sign: "sh",
							type: data.type
						}
					});
				} else if(this.colorBtn.haved == 1) {
					this.$router.push({
						path: "/subsidy/subsidysetUpDetail",
						query: {
							id: data.si_id,
							sign: "sh",
							type: data.type
						}
					});
				}
			},
			del(data) {
				if(this.colorBtn.all == 1) {
					let datas = {
						sepyId: data.sepy_id,
						status: 2
					};
					this.$confirm("确认作废此条吗?", "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: ""
						})
						.then(() => {
							axios
								.post("/subsidy/type/checkSubEmployee", qs.stringify(datas))
								.then(res => {
									this.loading = false;
									if(res.data.code == "200") {
										this.$store.commit("setSubSetUpPage", 1);
										this.$store.commit("setSubSetUpData", res.data.data);
										this.$store.commit("setSubSetUpTotal", res.data.total);
										this.$message({
											message: "作废成功",
											type: "success"
										});
									} else if(res.data.code == "401") {
										this.$message({
											message: res.data.message,
											type: "warning"
										});
										this.loading = false;
										this.$router.push("/login");
									} else {
										this.loading = false;
										this.$message.error(res.data.message);
									}
								});
						})
						.catch(() => {
							this.loading = false;
							this.$message({
								type: "info",
								message: "已取消删除"
							});
						});
				} else if(this.colorBtn.dai == 1) {
					let datas = {
						soId: data.so_id,
						status: 2
					};
					this.$confirm("确认作废此条吗?", "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: ""
						})
						.then(() => {
							axios
								.post("/subsidy/type/checkSubOrg", qs.stringify(datas))
								.then(res => {
									this.loading = false;
									if(res.data.code == "200") {
										this.$store.commit("setSubSetUpPage", 1);
										this.$store.commit("setSubSetUpData", res.data.data);
										this.$store.commit("setSubSetUpTotal", res.data.total);
										this.$message({
											message: "作废成功",
											type: "success"
										});
									} else if(res.data.code == "401") {
										this.$message({
											message: res.data.message,
											type: "warning"
										});
										this.loading = false;
										this.$router.push("/login");
									} else {
										this.loading = false;
										this.$message.error(res.data.message);
									}
								});
						})
						.catch(() => {
							this.loading = false;
							this.$message({
								type: "info",
								message: "已取消删除"
							});
						});
				} else if(this.colorBtn.haved == 1) {
					let datas = {
						siId: data.si_id,
						status: 2
					};
					this.$confirm("确认作废此条吗?", "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: ""
						})
						.then(() => {
							axios
								.post("/subsidy/type/checkSubInsurance", qs.stringify(datas))
								.then(res => {
									this.loading = false;
									if(res.data.code == "200") {
										this.$store.commit("setSubSetUpPage", 1);
										this.$store.commit("setSubSetUpData", res.data.data);
										this.$store.commit("setSubSetUpTotal", res.data.total);
										this.$message({
											message: "作废成功",
											type: "success"
										});
									} else if(res.data.code == "401") {
										this.$message({
											message: res.data.message,
											type: "warning"
										});
										this.loading = false;
										this.$router.push("/login");
									} else {
										this.loading = false;
										this.$message.error(res.data.message);
									}
								});
						})
						.catch(() => {
							this.loading = false;
							this.$message({
								type: "info",
								message: "已取消删除"
							});
						});
				}
			},
			addUser() {
				this.$store.commit("setCompanyNew", 0);
				this.$store.commit("setStaffNew", 0);
				this.$store.commit("setLongNew", 0);
				this.$router.push({
					path: "/subsidy/subsidysetUpDetail",
					query: {
						sign: "add"
					}
				});
				this.$store.commit("setShowParent", 1);
			},
			/*按条件查询预定*/
			searchUser() {
				if(this.searchForm.status == "待审核") {
					this.searchForm.status = 0;
				} else if(this.searchForm.status == "已审核") {
					this.searchForm.status = 1;
				} else if(this.searchForm.status == "作废") {
					this.searchForm.status = 2;
				}
				let data = {
					type: this.searchForm.type,
					enterDate: this.searchForm.di_time,
					status: this.searchForm.status,
					page: 1,
					rows: 10
				};
				this.loading = true;
				axios
					.post("/subsidy/type/querySubType", qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.$store.commit("setSubSetUpData", res.data.data);
							this.$store.commit("setSubSetUpTotal", res.data.total);
							if(this.searchForm.status === 0) {
								this.searchForm.status = "待审核";
							} else if(this.searchForm.status == 1) {
								this.searchForm.status = "已审核";
							} else if(this.searchForm.status == 2) {
								this.searchForm.status = "作废";
							}
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
			flashData() {
				this.currentPage3 = 1;
				this.$store.commit("setEvaluationPage", this.currentPage3);
				var colorBtn = {
					all: 1,
					dai: 0,
					haved: 0,
				};
				this.$store.commit("setColorBtn", colorBtn);
				this.loading = true;
				this.searchForm = {
					type: 1,
					enterDate: [],
					status: "",
				};
				let data = {
					type: this.searchForm.type,
					enterDate: this.searchForm.di_time,
					status: this.searchForm.status,
					page: 1,
					rows: 10
				};
				axios
					.post("/subsidy/type/querySubType", qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.$store.commit("setSubSetUpPage", 1);
							this.$store.commit("setSubSetUpData", res.data.data);
							this.$store.commit("setSubSetUpTotal", res.data.total);
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
		},
		filters: {
			checkTypeFilter: val => {
				if(val == 0) {
					val = "扣分制";
				} else if(val == 1) {
					val = "等级制";
				} else {
					val = "打分制";
				}
				return val;
			},
			statusFilter: val => {
				if(val == 0) {
					val = "待审核";
				} else if(val == 1) {
					val = "已审核";
				} else if(val == 2) {
					val = "作废";
				}
				return val;
			},
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
		margin-right: 0.5%;
		margin-top: 20px;
	}
	.erWeMa{
		width: 132px;
		height: 36px;
		background: #2368D3;
		color: white;
		float: right;
		margin-right: 1%;
		margin-top: 20px;
	}
	.addManage{
		width: 118px;
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
	.addManage .btniconfont {
		color: white;
		font-size: 12px;
	}
	.erWeMa .btniconfont {
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
	/deep/.el-checkbox__label{
		width: 0px;
	}
</style>