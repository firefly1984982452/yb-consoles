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
									<el-col :xl="6" :lg="8">
										<el-form-item label="设备编号" prop="ef_name">
											<span style="font-weight: bolder;">N01-08</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="名称">
											<el-input v-model="searchForm.keyWord2" placeholder="请输入" clearable></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
										<el-col :xl="4" :lg="6">
											<el-form-item label="安装位置" prop="sl_reason">
												<el-select v-model="form.sl_reason" placeholder="请选择" @click.native="selectTool(57)" v-if="sign!='see'">
													<el-option v-for="item in option" :key="item.sutl_name" :label="item.sutl_name" :value="item.sutl_name"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
										<el-col :xl="3" :lg="5">
											<el-select v-model="form.sl_reason" placeholder="请选择" @click.native="selectTool(57)" v-if="sign!='see'">
												<el-option v-for="item in option" :key="item.sutl_name" :label="item.sutl_name" :value="item.sutl_name"></el-option>
											</el-select>
										</el-col>
										<el-col :xl="3" :lg="5">
											<el-select v-model="form.sl_reason" placeholder="请选择" @click.native="selectTool(57)" v-if="sign!='see'">
												<el-option v-for="item in option" :key="item.sutl_name" :label="item.sutl_name" :value="item.sutl_name"></el-option>
											</el-select>
										</el-col>
										<el-col :xl="3" :lg="5">
											<el-select v-model="form.sl_reason" placeholder="请选择" @click.native="selectTool(57)" v-if="sign!='see'">
												<el-option v-for="item in option" :key="item.sutl_name" :label="item.sutl_name" :value="item.sutl_name"></el-option>
											</el-select>
										</el-col>
										<el-col :xl="4" :lg="6">
											<el-input v-model="form.sl_reason" placeholder="请输入" clearable></el-input>
										</el-col>
									</el-row>
								<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="分类名称">
											<el-input v-model="searchForm.keyWord2" placeholder="请输入" clearable></el-input>
										</el-form-item>
									</el-col>
								</el-row>
									<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="周期">
											<el-input v-model="searchForm.keyWord2" placeholder="请输入" clearable></el-input>
										</el-form-item>
									</el-col>
								</el-row>
									<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="次数">
											<el-input v-model="searchForm.keyWord2" placeholder="请输入" clearable></el-input>
										</el-form-item>
									</el-col>
								</el-row>

								<el-row style="margin-left: 120px;">
									<el-col class :xl="2" :lg="2" style="width: 100px;">
										<el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}" @click="saveDict()">保存</el-button>
									</el-col>
									<el-col class :xl="2" :lg="2" style="width: 100px;">
										<el-button>关闭</el-button>
									</el-col>
								</el-row>
							</el-row>

						</div>
					</el-card>
				</el-col>
			</el-form>
		</el-row>
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
</style>