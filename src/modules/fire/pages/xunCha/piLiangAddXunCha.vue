<template>
	<div class="app-container createOuts" id="createOut">
		<el-row :gutter="0" style="margin-bottom: 2rem;">
			<!--//:rules="rules"-->
			<el-form :model="form" label-width="120px">
				<el-col :span="24" style="width: 93.7%;margin-left: 3%;">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<el-row>
								<el-col :span="1" class="backBtns">
									<el-button @click="backList()">返回</el-button>
								</el-col>
								<el-col :xl='5' :lg='6'>
									<span><!--新增巡查分类--></span>
								</el-col>
							</el-row>
						</div>
						<div id="familyData">
							<el-row :gutter="20">

								<el-row>
									<el-form ref="searchForm" :model="searchForm" label-width="90px">
										<el-col :xl="4" :lg="5" style="margin-top: 20px;margin-left: 10px;">
											<el-form-item label="选择楼宇">
												<el-select v-model="searchForm.status7" placeholder="请选择" clearable @change="changeStatus7">
													<el-option v-for="item in option4" :key="item.sfd_id" :label="item.sfd_name" :value="item.sfd_id"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :xl="4" :lg="5" style="margin-top: 20px;">
											<el-form-item label="设施设备">
												<el-select v-model="searchForm.status4" placeholder="请选择" clearable @change="changeStatus4">
													<el-option v-for="item in option1" :key="item.sfd_id" :label="item.sfd_name" :value="item.sfd_id"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :xl="2" :lg="2" style="margin: 20px 0 0 18px;width: 100px;">
											<el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}"><i style="font-size: 12px;margin-right: 5px;" class="iconfont iconjichutubiao-chaxun"></i>搜索</el-button>
										</el-col>
									</el-form>
								</el-row>
								<el-row>
									<el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="width:1100px!important;left: 32%!important;margin-bottom: 20px;">
										<el-table-column type="selection" min-width="60">
											<el-checkbox v-model="checked">备选项</el-checkbox>
										</el-table-column>
										<el-table-column label="序号" min-width="60">
											<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
										</el-table-column>
										<el-table-column label="分类" min-width="100">
											<template slot-scope="scope">{{scope.row.di_time | nothingFilter}}</template>
										</el-table-column>
										<el-table-column label="名称" min-width="100">
											<template slot-scope="scope">{{scope.row.di_time | nothingFilter}}</template>
										</el-table-column>
										<el-table-column label="设备编号" min-width="100">
											<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
										</el-table-column>
										<el-table-column label="位置" min-width="140">
											<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
										</el-table-column>
										<el-table-column label="周期类型" min-width="140">
											<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
										</el-table-column>
										<el-table-column label="巡检次数" min-width="140">
											<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
										</el-table-column>
									</el-table>
								</el-row>
								<el-row>
									<el-col :xl="4" :lg="6">
										<el-form-item label="计划分类" label-width="90px">
											<el-select v-model="form.sl_reason" placeholder="请选择" @click.native="selectTool(57)" v-if="sign!='see'">
												<el-input v-model="form.keyWord2" placeholder="请输入" clearable></el-input>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="4" :lg="6">
										<el-form-item label="周期" label-width="90px">
											<el-input v-model="searchForm.keyWord2" placeholder="请输入" clearable></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="4
										" :lg="6">
										<el-form-item label="次数" label-width="90px">
											<el-select v-model="form.sl_reason" placeholder="请选择" @click.native="selectTool(57)" v-if="sign!='see'">
												<el-input v-model="form.keyWord2" placeholder="请输入" clearable></el-input>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
							</el-row>

						</div>
					</el-card>
				</el-col>

			</el-form>
		</el-row>
		<div class="tijiao">
			<el-row :gutter="40">
				<el-col :lg="2" :xl="2">
					<el-button style="width: 100px" type="success" plain @click="sendData()" v-bind:style="{'background':firstZhuTi}">提交</el-button>
				</el-col>
				<el-col :lg="2" :xl="2">
					<el-button style="width: 100px" type plain @click="cancel()">取消</el-button>
				</el-col>
			</el-row>
		</div>
		<el-row class="ybBanner">
			<span>技术支持：有伴（上海）智能科技有限公司</span>
		</el-row>
	</div>
</template>
<script>
	import axios from "axios";
	import qs from "qs";
	import { OssUrlPic, OssUrlNoPic } from "@/common/js/utils.js";
	export default {
		data() {
			return {
				dialogFormVisible: false,
				title: '选择巡查人员',
				checkedFalse: '',
				fasleArr: ['张东飞', '小郑', '江余婷', '小白', '韬哥', '刘真香'],
				dictForm: {
					sfdWeight: '',
					sfdName: '',
				},
				diName: "",
				diTime: "",
				diInstall: "",
				diWarrantyTime: "",
				diManufactor: "",
				diPhone: "",
				diModel: "",
				option4: [],
				option1: [],
				ossUrl: OssUrlPic,
				ossNoUrl: OssUrlNoPic,
				userId: "",
				sign: "",
				st: "222",
				itemData: [],
				option: [],
				form: {},
				searchForm: {
					type: 1,
					enterDate: [],
					status: "",
					status1: '',
					status2: '',
					diTypeId: '',
					diCategoryId: '',
					keyWord: '',
					keyWord2: '',
					enterDate: [],
				},
				bindingArr: [{
					sl_reason: '',
					sl_reason: '',
					sl_reason: ''
				}]
			};
		},
		computed: {
			firstZhuTi: {
				get() {
					return this.$store.getters.firstColors;
				},
				set() {}
			},
		},
		created() {
			axios
				.post("/fire/Info/querySysFireDictByshebeileixin")
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
				.post("/fire/Info/querySysFireDictByshebeileibie")
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

		},

		methods: {
			backList() {
				this.$router.back(-1)
			},
		},

	};
</script>

<style>
	.el-textarea__inner {
		height: 130px;
	}
	
	.checkFalse {
		width: 100%;
		text-align: left;
		height: 40px;
		border-bottom: 1px solid #EEEEEE;
		line-height: 40px;
		margin-right: 0%;
	}
	
	.checkFalseLast {
		width: 100%;
		text-align: left;
		height: 40px;
		border-bottom: none;
		line-height: 40px;
		margin-right: 0%;
	}
	
	.checkFalse:nth-last-child {
		border-bottom: none;
	}
</style>