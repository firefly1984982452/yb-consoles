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
										<el-form-item label="分类名称">
											<el-input v-model="form.ptName" placeholder="请输入" clearable></el-input>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="分类描述">
											<el-input type="textarea" v-model="form.ptRepresent" placeholder="请输入" clearable></el-input>
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
	export default {
		data() {
			return {
				form: {
					ptId: 0,
					ptName: '',
					ptRepresent: ''
				}
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
			let pt_id = this.$route.query.pt_id;
			this.form.ptId = this.$route.query.ptId;
			if(this.form.ptId == 1) {
				axios
					.post("/fire/patrol/selectByPrimaryBpynameandxiangqing" + `?pt_id=${pt_id}`)
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.form.ptName = res.data.data.pt_name
							this.form.ptRepresent = res.data.data.pt_represent
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
		methods: {
			backList() {
				this.$router.back(-1)
			},
			saveDict() {
				
				if(this.form.ptId == 1) {
                     axios
						.post("/fire/patrol/addPatrol", qs.stringify(this.form))
						.then(res => {
							this.loading = false;
							if(res.data.code == 200) {
								console.log(res.data.data)
								this.$store.commit("setCatalogeData", res.data.data);
								this.$store.commit("setCatalogeTotal", res.data.total);
								this.$router.push({path: '/fire/xunCha/xunChaCataloge'})
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

				} else {
					this.form.ptId = 0,
					axios
						.post("/fire/patrol/addPatrol", qs.stringify(this.form))
						.then(res => {
							this.loading = false;
							if(res.data.code == 200) {
								console.log(res.data.data)
								this.$store.commit("setCatalogeData", res.data.data);
								this.$store.commit("setCatalogeTotal", res.data.total);
								this.$router.push({path: '/fire/xunCha/xunChaCataloge'})
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
		},

	};
</script>

<style>
	.el-textarea__inner {
		height: 130px;
	}
</style>