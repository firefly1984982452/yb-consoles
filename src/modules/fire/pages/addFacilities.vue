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
									<span v-if="timeShow">添加设施</span>
									<span v-if="timeShow1">编辑设施</span>
								</el-col>
							</el-row>
						</div>
						<div id="familyData">
							<el-row :gutter="20">
								<el-col :xl="2" :lg="4" style="margin: 10px 0 0 10px;">
									<el-row :gutter="20">
										<img  src="../../assets/equipment.png" />
										<img id="img3" class="img10 picTop" src="" alt="" v-show="zanshiHead==1">
									</el-row>
									<el-row :gutter="20">
										<p class="addImg">上传设施图片</p>
									</el-row>
									<input type="file" id="file" class="filepath" @change="changepic(this)" accept="image/jpg, image/jpeg, image/png, image/PNG">

									<el-row :gutter="20" style="margin-top: 30px;">
										<img  src="../../assets/equipment.png" />
										<img id="img3" class="img11 picTop" src="" alt="" v-show="zanshiHead2==1">
									</el-row>
									<el-row :gutter="20">
										<p class="addImg">上传设施合格证</p>
									</el-row>
									<input type="file" id="file2" class="filepath2" @change="changepic2(this)" accept="image/jpg, image/jpeg, image/png, image/PNG">
								</el-col>

								<el-col :xl="18" :lg="20">
									<el-row :gutter="20">
										<el-col :xl="8" :lg="10">
											<el-form-item label="设施编号" prop="ef_name">
												<span style="font-weight: bolder;">{{form.diNumber}}</span>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="20">
										<el-col :xl="8" :lg="10">
											<el-form-item label="设施名称" prop="diName">
												<el-input v-model="form.diName" placeholder="请输入" clearable></el-input>
											</el-form-item>
										</el-col>

									</el-row>
									<el-row :gutter="20">
										<el-col :xl="8" :lg="10">
											<el-form-item label="设施型号" prop="diModel">
												<el-input v-model="form.diModel" placeholder="请输入" clearable></el-input>
											</el-form-item>
										</el-col>

									</el-row>
									<el-row :gutter="20">
										<el-col :xl="8" :lg="10">
											<el-form-item label="生产厂家" prop="diManufactor">
												<el-input v-model="form.diManufactor" placeholder="请输入" clearable></el-input>
											</el-form-item>
										</el-col>

									</el-row>
									<el-row :gutter="20">
										<el-col :xl="8" :lg="10">
											<el-form-item label="厂家电话" prop="diPhone">
												<el-input v-model="form.diPhone" placeholder="请输入" clearable></el-input>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="20">
										<el-col :xl="8" :lg="10">
											<el-form-item label="安装时间" prop="diTime">
												<el-date-picker v-model="form.diTime " type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
												</el-date-picker>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="20">
										<el-col :xl="5" :lg="7">
											<el-form-item label="安装位置" prop="diBuildingId">
												<el-cascader  v-model="form.diBuildingIdName" clearable placeholder="请选择" @change="handleBuildingChange" :options="options" change-on-select></el-cascader>
											</el-form-item>
										</el-col>
										<el-col :xl="3" :lg="5">
											<el-select v-model="form.diRoomId" placeholder="请选择" @change="changeRoom">
												<el-option v-for="item in optionRoom" :key="item.orgr_id " :label="item.orgr_name" :value="item.orgr_id "></el-option>
											</el-select>
										</el-col>
										<el-col :xl="3" :lg="5">
											<el-select v-model="form.diBedId" placeholder="请选择" @change="changeBed">
												<el-option v-for="item in optionBed" :key="item.orgb_id" :label="item.orgb_name" :value="item.orgb_id"></el-option>
											</el-select>
										</el-col>
										
										<el-col :xl="5" :lg="7">
											<el-input v-model="form.diInstall" placeholder="请输入" clearable></el-input>
										</el-col>
									</el-row>
									<el-row :gutter="20">
										<el-col :xl="8" :lg="10">
											<el-form-item v-if="timeShow" label="质保时间" prop="zbtime">
												<el-select  v-model="form.zbtime" placeholder="请选择">
													<el-option v-for="item in optionTime" :key="item.value" :label="item.label" :value="item.value"></el-option>
												</el-select>
											</el-form-item>
											
											<el-form-item v-if="timeShow1" label="到期时间" prop="di_warranty_time">
												<el-date-picker  v-model="form.di_warranty_time " type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
												</el-date-picker>
											</el-form-item>
											
										</el-col>
									</el-row>
									<el-row :gutter="20">
										<el-col :xl="8" :lg="10">
											<el-form-item label="设施状态" prop="di_status">
												<el-select v-model="form.di_status" placeholder="请选择">
													<el-option v-for="item in option3" :key="item.value" :label="item.label" :value="item.value"></el-option>
												</el-select>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row style="margin-left: 120px;">
										<el-col class :xl="2" :lg="2" style="width: 100px;">
											<el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}" @click="sendData()">保存</el-button>
										</el-col>
										<el-col class :xl="2" :lg="2" style="width: 100px;">
											<el-button>关闭</el-button>
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
	import moment from 'moment'
	export default {
		data() {
			return {
				isShow: false,
				timeShow:true,
				timeShow1:false,
				dialogFormVisible: false,
				dialogFormVisible1: false,
				loading: false,
				optionTime:[{label:'1年',value:1},{label:'2年',value:2},{label:'3年',value:3}],
				option1: [], //设备类别
				option2: [], //设备类型
				options: [], //楼层
				optionRoom: [], //房间
				optionBed: [], //床位
				roomName:'',
				bedName:'',
				zanshiHead:'',
				zanshiHead2:'',
				havePic: 0,
				userPic: "",
				userPic2 :'',
				havePic2:0,
//				props: {
//					label: 'orgd_name',
//					value: 'orgd_id'
//				},
				dictForm: {
					sfdWeight: '',
					sfdName: '',
				},
				title: '添加设备类别',
				title1: '添加设备类型',
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
				ossUrl: OssUrlPic,
				ossNoUrl: OssUrlNoPic,
				userId: "",
				sign: "",
				st: "222",
				itemData: [],
				option: [],
				form: {
					zbtime:'',
					diId:'0',
					diType:'2',
					diNumber: 'Fire-' + moment().utc().format('YYYYMDhhmmss'),
				},
				rules: {
					diCategoryId: [{
						required: true,
						message: "",
						trigger: "blur,change"
					}],
					diTypeId: [{
						required: true,
						message: "",
						trigger: "blur,change"
					}],
					diName: [{
						required: true,
						message: "",
						trigger: "blur,change"
					}],
					diModel: [{
						required: true,
						message: "",
						trigger: "blur,change"
					}],
					diTime : [{
						required: true,
						message: "",
						trigger: "blur,change"
					}],
					diBuildingId: [{
						required: true,
						message: "",
						trigger: "blur,change"
					}],
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
			axios
				.post("/fire/Info/querySysFireDictByshebeileixin")
				.then(res => {
					this.loading = false;
					if(res.data.code == 200) {
						this.option2 = res.data.data;
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
			let diId = this.$route.query.di_id;
			let sign = this.$route.query.sign;
			if(sign=='edit'){		
				this.timeShow = false
				this.timeShow1 = true
			axios
				.get('/fire/Info/selectByPrimaryKeydiidsheshi'+`?diId=${diId}`)
				.then(res => {
					this.loading = false;
					if(res.data.code == 200) {	
						this.zanshiHead = 1;
						this.zanshiHead2 = 1;
                            let data = res.data.data
                      	 	this.form.diNumber = data.di_number,
                      	 	this.form.diName = data.di_name,
                      	    this.form.diModel = data.di_model,
                      	    this.form.diManufactor = data.di_manufactor,
                      	    this.form.diPhone = data.di_phone,
                      	    this.form.diTime = data.di_time,
                      	    this.form.di_warranty_time = data.di_warranty_time
                      	    this.form.di_status = data.di_status
                      	    document.querySelector(".img11").src = this.ossUrl+data.di_certificate;
                      	    document.querySelector(".img10").src = this.ossUrl+data.di_img;
                      	    this.form.diImg = data.di_img;
                      	    this.form.diCertificate = data.di_certificate;
//                    	    this.form.diBuildingIdName = [data.orgbu_id,data.orgr_floor]
//                    	    this.form.diRoomId = data.orgr_name
//                    	    this.form.diBedId = data.orgb_name
                      	    this.form.diInstall = data.di_install
						    console.log(this.form)
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
			}
        

		},
		mounted() {
			let that = this;
			axios
				.post("org/OrgBuilding/queryOrgBuilding")
				.then(res => {
					this.loading = false;
					if(res.data.code == "200") {
						let opt = [];
						let building = res.data.data;
						building.forEach(function(item) {
							let subOpt = {};
							subOpt.value = item.orgbu_id;
							subOpt.label = item.orgbu_name;
							let floor = parseInt(item.orgbu_floor);
							if(typeof floor == "number") {
								let children = [];
								for(let i = 0; i < floor; i++) {
									let sub = {};
									sub.value = i + 1;
									sub.label = i + 1 + "层";
									children.push(sub);
								}
								subOpt.children = children;
							}
							opt.push(subOpt);
						});
						that.options = opt;
					} else if(res.data.code == "401") {
						this.$message({
							message: res.data.message,
							type: "warning"
						});
						this.$router.push("/login");
					}
				})
				.catch(err => {
					this.loading = false;
				});
		},
		methods: {
			backList() {
				this.$router.back(-1)
			},
			handleBuildingChange(value) {
				console.log(value)
				let that = this;
				let data = {
					orgr_building_id: value[0],
					orgr_floor: value[1]
				};
				this.form.diBuildingId = value[0];
				for(var o = 0; o < this.options.length; o++) {
					if(value[0] == this.options[o].value) {
						this.form.diBuildingIdName = this.options[o].label;
					}
				}
				this.loading = true;
				axios
					.post("/org/OrgRoom/queryOrgRoomWithFloor", qs.stringify(data))
					.then(res => {
						if(res.data.code == "200") {
							that.optionRoom = res.data.data;
						} else if(res.data.code == "401") {
							this.$message({
								message: res.data.message,
								type: "warning"
							});
							this.$router.push("/login");
						} else {
							this.$message.error(res.data.message);
						}
						this.loading = false;
					});
			},
			changeRoom(value) {
				this.form.diRoomId = value
//				this.form.diRoomId = this.optionRoom.filter(v=> v.orgr_id==value)[0].orgr_name
				console.log(this.optionRoom)
				this.roomName = this.optionRoom.filter(v=> v.orgr_id == value)[0].orgr_name+'房间'				
				let data = {
					orgb_room_id: value
				};
				axios
					.post("/org/OrgBed/queryOrgBedByRoom", qs.stringify(data))
					.then(res => {
						this.loading = false;
						if(res.data.code == "200") {
							this.optionBed = res.data.data;
							this.form.se_bed_id = "";
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
			changeBed(value) {
			this.form.diBedId = value
			this.bedName = this.optionBed.filter(v=> v.orgb_id == value)[0].orgb_name.charAt(0)+'号床'
            this.form.diInstall=this.form.diBuildingIdName+ this.roomName + this.bedName
           
			},
			changepic() {
//				alert("changepic");
				
				this.havePic = 1;
				let that = this;
				var reads = new FileReader();
				var f = document.getElementById("file").files[0];
				reads.readAsDataURL(f);
				reads.onload = function(e) {
					that.form.diImg = this.result;
					document.querySelector(".img10").src = that.form.diImg;
					that.zanshiHead = 1;
				};
				// this.imgShow = 1;
				this.showDash = 0;
				this.userPic = f;
			},
				dataURLtoBlob(dataurl) {
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = new ArrayBuffer(bstr.length),
					u8arr = new Uint8Array(n);
				for(var i = 0; i < bstr.length; i++) {
					u8arr[i] = bstr.charCodeAt(i);
				}
				return new Blob([n], {
					type: mime
				});
			},
			changepic2() {
				this.havePic2 = 1;
				let that = this;
				var reads = new FileReader();
				var f = document.getElementById("file2").files[0];
				reads.readAsDataURL(f);
				reads.onload = function(e) {
					that.form.diCertificate = this.result;
					document.querySelector(".img11").src = that.form.diCertificate;
					that.zanshiHead2 = 1;
				};
				// this.imgShow = 1;
				this.showDash = 0;
				this.userPic2 = f;
			},
			dataURLtoBlob2(dataurl) {
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = new ArrayBuffer(bstr.length),
					u8arr = new Uint8Array(n);
				for(var i = 0; i < bstr.length; i++) {
					u8arr[i] = bstr.charCodeAt(i);
				}
				return new Blob([n], {
					type: mime
				});
			},
			sendData() {
			
			 let diId = this.$route.query.di_id;
			 
			 let sign = this.$route.query.sign;
				if(
					this.form["diTime"] === "" ||
					this.form["diTime"] === null ||
					!this.form["diTime"]
				) {
					this.$message.error("请选择安装时间");
					this.loading = false;
					return;
				}
				
				if(sign != 'edit'){
					if(
					this.form["zbtime"] === "" ||
					this.form["zbtime"] === null ||
					!this.form["zbtime"]

				) {
					this.$message.error("请选择质保时间");
					this.loading = false;
					return;
				}
				}
				
				if(
					this.form['diInstall'] === "" ||
					this.form['diInstall'] === null ||
					!this.form['diInstall']
				) {
					this.$message.error("请输入安装位置");
					this.loading = false;
					return;
				}

				this.loading = true;
				var params = new FormData();
				if(this.form.diImg && this.form.diImg != "") {
					if(this.form.diImg.indexOf("base64") > 0) {
						this.userPic = this.dataURLtoBlob(this.form.diImg);
						console.log(this.userPic)
						params.append("diImg", this.userPic);
					};
				};
				if(this.form.diCertificate && this.form.diCertificate != "") {
					if(this.form.diCertificate.indexOf("base64") > 0) {
						this.userPic2 = this.dataURLtoBlob2(this.form.diCertificate);
						console.log(this.userPic)
						params.append("diCertificate", this.userPic2);
					};
				};
			    this.form.diId = diId
				for(var key in this.form) {
					params.append(key, this.form[key]);
				}
				let that = this;
				if(sign=='edit'){
					this.$ajax({
						method: "post",
						url: "/fire/Info/adddevice",
						data: params,
						async: true,
						cache: false,
						contentType: false,
						processData: false,
						dataType: "json"
					})
					.then(function(response) {
						if(response.data.code == 200) {
							that.$message({
								message: "提交成功",
								type: "success"
							});				
						that.$store.commit("setFacilitiesData", response.data.data);
						that.$store.commit("setFacilitiesTotal", response.data.total);
						that.$router.push("/fire/facilitiesManager");
						} else if(response.data.code == "401") {
							that.$message({
								message: response.data.message,
								type: "warning"
							});
							that.$router.push("/login");
						} else {
							that.$message.error({
								message: response.data.message
							});
						}
						that.loading = false;
					})
					.catch(function(error) {
						that.$message.error(error);
						that.loading = false;
					});
				}else{
					this.$ajax({
						method: "post",
						url: "/fire/Info/adddevice",
						data: params,
						async: true,
						cache: false,
						contentType: false,
						processData: false,
						dataType: "json"
					})
					.then(function(response) {
						if(response.data.code == 200) {
							that.$message({
								message: "提交成功",
								type: "success"
							});				
						that.$store.commit("setFacilitiesData", response.data.data);
						that.$store.commit("setFacilitiesTotal", response.data.total);
						that.$router.push("/fire/facilitiesManager");
						} else if(response.data.code == "401") {
							that.$message({
								message: response.data.message,
								type: "warning"
							});
							that.$router.push("/login");
						} else {
							that.$message.error({
								message: response.data.message
							});
						}
						that.loading = false;
					})
					.catch(function(error) {
						that.$message.error(error);
						that.loading = false;
					});
				}
				
			},
		},

	};
</script>

<style scoped>
	.addImg {
		width: 138px;
		height: 34px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		border: 1px solid rgba(211, 212, 214, 1);
		font-size: 14px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 36px;
		text-align: center;
		margin-top: 14px;
		margin-left: 5px;
		cursor: pointer;
	}
	
	.addEquipment {
		width: 95px;
		height: 36px;
		background: #6CBC6C;
		color: white;
	}
	
	.addEquipment .btniconfont {
		color: white;
		font-size: 12px;
	}
	
	.addIcon i {
		font-size: 20px;
		cursor: pointer;
		margin-right: 10px;
	}
	
	.el-radio-group {
		margin-left: -60px;
	}
	.filepath{
		/*background: red;*/
		top: 178px;
		left: 20px;
		width: 120px;
		height: 40px;
		}
		.filepath2{
		/*background: red;*/
		position: absolute;
		opacity: 0;
		top: 421px;
		left: 20px;
		width: 120px;
		height: 40px;
		}
</style>