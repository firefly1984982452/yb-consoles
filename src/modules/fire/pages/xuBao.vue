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
								<el-col :xl="3" :lg="4">
									<el-row>
										<div style="margin: 30px 20px;" id="qrcode"><img :src="ossUrl+form.di_img"/></div>
									</el-row>
								</el-col>
								<el-col :xl="18" :lg="20" style="margin: 16px -4%;">
									<el-row>
										<el-col :xl="4" :lg="8">
											<el-form-item label="设备编号">
												<span style="font-weight: bolder;">{{form.di_number}}</span>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="4" :lg="6">
											<el-form-item label="设备类别">
												<span style="font-weight: bolder;">{{form.di_category_name}}</span>
											</el-form-item>
										</el-col>
										<el-col :xl="4" :lg="6">
											<el-form-item label="设备类型">
												<span style="font-weight: bolder;">{{form.di_type_name}}</span>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="4" :lg="6">
											<el-form-item label="设备名称">
												<span style="font-weight: bolder;">{{form.di_name}}</span>
											</el-form-item>
										</el-col>
											<el-col :xl="4" :lg="6">
											<el-form-item label="设备型号">
												<span style="font-weight: bolder;">{{form.di_model}}</span>
											</el-form-item>
										</el-col>
									</el-row>

									<el-row>
										<el-col :xl="4" :lg="6">
											<el-form-item label="设备厂家" prop="sl_reason">
												<span style="font-weight: bolder;">{{form.di_manufactor}}</span>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="4" :lg="6">
											<el-form-item label="厂家电话">
												<span style="font-weight: bolder;">{{form.di_phone}}</span>
											</el-form-item>
										</el-col>
										<el-col :xl="4" :lg="6">
											<el-form-item label="安装时间">
												<span style="font-weight: bolder;">{{form.di_time}}</span>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="6" :lg="8">
											<el-form-item label="质保到期时间">
												<span style="font-weight: bolder;">{{form.di_warranty_time}}</span>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="18" :lg="20">
											<el-form-item label="延保记录">
												<p v-for="(item,index) in xuBaoArr" :key="index" style="font-weight: bolder;"><span>{{item.xubaoqian}}&nbsp|&nbsp{{item.dwr_creator}}&nbsp|&nbsp延保至{{item.xubaoho}}</span></p>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row>
										<el-col :xl="6" :lg="8">
											<el-form-item label="延长质保时间" prop="zbtime">
												<el-select v-model="form.zbtime" placeholder="请选择">
													<el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>
								<el-row style="margin-left: 120px;">
									<el-col class :xl="2" :lg="2" style="width: 100px;">
										<el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}" @click="sendData()">保存</el-button>
									</el-col>
									<el-col class :xl="2" :lg="2" style="width: 100px;">
										<el-button @click="closeWeb">关闭</el-button>
									</el-col>
								</el-row>
								</el-col>

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
              option2:[{label:'1年',value:1},{label:'2年',value:2},{label:'3年',value:3}],
              form:{
              	zbtime:'',
              },
              xuBaoArr:[],
              ossUrl:OssUrlPic,
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
            	let diId = this.$route.query.di_id;
            axios
				.get('/fire/Info/selectByPrimaryKeydiid'+`?diId=${diId}`)
				.then(res => {
					this.loading = false;
					if(res.data.code == 200) {
						console.log(this.form)
						this.form = res.data.data;
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
				.post('/fire/Info/selectByPrimaryByweibaoid'+`?diId=${diId}`)
				.then(res => {
					this.loading = false;
					if(res.data.code == 200) {
						console.log(this.form)
						this.xuBaoArr = res.data.data;
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
			sendData(){
				let diId = this.$route.query.di_id;
				let data = {
					dwrId:0,
					dwrTime:this.form.zbtime,
					Extensiontime:this.form.di_warranty_time,
					diId:diId
				}
				
				axios
					.post("/fire/Info/changeDevice", qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == "200") {
		                     this.$router.push("/fire/FireEquipment");
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
			closeWeb(){
				this.$router.back(-1)
			}
		},

	};
</script>

<style>
	.el-textarea__inner {
		height: 130px;
	}
	#qrcode img{
	  width: 150px;
	  height: 150px;	
	}
</style>