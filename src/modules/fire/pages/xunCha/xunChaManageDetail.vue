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
								<el-row >
									<div style="margin: 30px 20px;" id="qrcode"></div>
									<el-button style="width: 140px;margin: 0 25px;cursor: pointer;">打印二维码</el-button>
								</el-row>
							
								</el-col>
								
								<el-col :xl="18" :lg="20" style="margin: 16px -4%;">
								<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="名称">
											<span style="font-weight: bolder;">用户传输装置</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="编号" prop="ef_name">
											<span style="font-weight: bolder;">N01-08</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :xl="6" :lg="8">
										<el-form-item label="位置" prop="sl_reason">
											<span style="font-weight: bolder;">1号楼1号泵房</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="分类名称">
											<span style="font-weight: bolder;">消防巡检</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="周期">
										<span style="font-weight: bolder;">天</span>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :xl="6" :lg="8">
										<el-form-item label="次数">
											<span style="font-weight: bolder;">1</span>
										</el-form-item>
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
	import QRCode from "qrcodejs2"
	import { OssUrlPic, OssUrlNoPic } from "@/common/js/utils.js";

	export default {
		data() {
			return {
				link: "我是二维码",
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
			
		
		},

		methods: {
			qrcode() {
				let that = this;
				let qrcode = new QRCode('qrcode', {
					width: 150,
					height: 150, // 高度
					text: this.link, // 二维码内容
					render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
					background: '#f0f', // 背景色
					foreground: '#ff0' // 前景色
				})
			},


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