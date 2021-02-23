<template>
    <el-row style="padding:20px;">
		<el-form ref="form" :model="form" label-width="8em" :rules="rules">
			<el-col :span="9">
				<div id="oldManDetail">
					<el-row :gutter="0">
						<el-form-item label="既往病史介绍" :rules="rules">
							<el-row :gutter="0" v-if="notEdit==false">
								<el-col :xl="3" :lg="4" style="width: 8em">
									<el-button class="addIllBtn" @click="notEdit==false?addPrevent('histrory'):''"><i id="addIll" class="iconfont iconjichutubiao-tianjia-huise"></i>添加</el-button>
								</el-col>
								<el-col :xl="3" :lg="4" style="width: 8em;">
									<el-button class="clearIllBtn" type @click="notEdit==false?clearAllIll('over'):''" v-if="medicalHistory.length>0"><i id="clearIll" class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i>清空全部</el-button>
								</el-col>
							</el-row>
							<el-row :gutter="0">
								<span class="ill" v-for="(item,index) in medicalHistory" :key="index" v-if="item!=''">{{item}}<i @click="notEdit==false?clearOne(index):''" style="font-size: 12px;margin-left: 10px;cursor: pointer;" class="el-icon-error"></i></span>
							  <span v-if="medicalHistory.length===0&&notEdit===true">无</span>
                            </el-row>	
						</el-form-item>
					</el-row>
					<el-row :gutter="0">
						<el-form-item label="现有病史介绍">
							<el-row :gutter="0" v-if="notEdit==false">
								<el-col :xl="3" :lg="4" style="width: 8em;">
									<el-button class="addIllBtn" @click="notEdit==false?addPrevent('now'):''"><i id="addIll" class="iconfont iconjichutubiao-tianjia-huise"></i>添加</el-button>
								</el-col>
								<el-col :xl="3" :lg="4" style="width: 8em;">
									<el-button class="clearIllBtn" type @click="notEdit==false?clearAllIll('now'):''" v-if="medicalCurrent.length>0"><i id="clearIll" class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i>清空全部</el-button>
								</el-col>
							</el-row>
							<el-row :gutter="0">
								<span class="ill" v-for="(item,index) in medicalCurrent" :key="index" v-if="item!=''">{{item}}<i @click="notEdit==false?clearOne1(index):''" style="font-size: 12px;margin-left: 10px;cursor: pointer" class="el-icon-error"></i></span>
							  <span v-if="medicalCurrent.length===0&&notEdit===true">无</span>
                            </el-row>
						</el-form-item>
					</el-row>
					<el-row :gutter="0">
						<el-form-item label="其他疾病">
							<el-input type="textarea" placeholder="请输入" plain v-model="form.medicalOther" maxlength="50" show-word-limit :disabled="notEdit==true"></el-input>
						</el-form-item>
					</el-row>
					<el-row :gutter="0">
						<el-form-item label="禁忌药品">
							<el-input type="textarea" plain v-model="form.medicalAvoid" placeholder="请输入禁忌药品" maxlength="50" show-word-limit :disabled="notEdit==true"></el-input>
						</el-form-item>
					</el-row> 
					<el-row :gutter="0">
						<el-form-item label="体检报告结论" prop="reportResult">
							<el-input type="textarea" plain v-model="form.reportResult" placeholder="请输入" maxlength="50" show-word-limit :disabled="notEdit==true"></el-input>
						</el-form-item>
					</el-row>
					<el-row :gutter="0">
						<el-form-item label="饮食禁忌">
							<el-row :gutter="0">
								<el-col :xl="4" :lg="4">
									<el-checkbox v-model="hasTaboo" label="无禁忌" @change="handleChangeCheckNo" :disabled="notEdit==true || showHasTaboo"></el-checkbox>
								</el-col>
							</el-row>
							<el-checkbox-group v-model="yinshi" size="mini" :disabled="notEdit==true || hasTaboo" @change="handleChangeCheck">
								<el-row :gutter="0">
									<el-col :xl="4" :lg="4">
										<el-checkbox label="流质"></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="半流质"></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="软食" disable></el-checkbox>
									</el-col>
								</el-row>
								<el-row :gutter="0">
									<el-col :xl="4" :lg="4">
										<el-checkbox label="低盐"></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="低糖"></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="普食" disable></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="糖尿病饮食" disable></el-checkbox>
									</el-col>
								</el-row>
								<el-row :gutter="0">
									<el-col :xl="4" :lg="4">
										<el-checkbox label="忌糖"></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="忌盐"></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="忌海鲜" disable></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="忌酸" disable></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="忌辣" disable></el-checkbox>
									</el-col>
									<el-col :xl="4" :lg="4">
										<el-checkbox label="忌油" disable></el-checkbox>
									</el-col>
								</el-row>
							</el-checkbox-group>
						</el-form-item>
					</el-row>
				</div>
			</el-col>
			<el-col :span="13">
				<el-row :gutter="0" class="plPic">
					<el-col :span="24" style="position:relative;left:10px;">
						<el-row :gutter="20">
							<el-col :span="24">
								<el-form-item label="体检报告" label-width="70px" style='margin-left: 30px'>
									<el-row :gutter="0" class="label-resize">
										<br>
										<b>● 胸透</b>
										<span>仅支持jpg、png格式，且不超过5M</span>
                                        <ub-pictures :span="6" v-model="form.reportChest" :value="form.reportChest" description="老人胸透"></ub-pictures>
									</el-row>
									<el-row :gutter="0" class="label-resize">
										<b>● 肝功能/血糖</b>
										<span>仅支持jpg、png格式，且不超过5M</span>
                                        <ub-pictures :span="6" v-model="form.reportLiver" description="老人肝功能/血糖"></ub-pictures>
									</el-row>
									<el-row :gutter="0" class="label-resize">
										<b>● 心电图</b>
										<span>仅支持jpg、png格式，且不超过5M</span>
                                        <ub-pictures :span="6" v-model="form.reportHeart" description="老人心电图"></ub-pictures>
									</el-row>
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-col>
		</el-form>
		<!--过往病例-->
		<el-dialog title="请选择既往病史" :visible.sync="centerPrevent" :modal-append-to-body='false' width="1000px" center id="illSelect">
			<el-checkbox-group v-model="medicalHistory">
				<el-checkbox v-for="(city,index) in illOption" :label="city.value" :key="index">{{city.value}}</el-checkbox>
			</el-checkbox-group>
			<el-row :gutter="30" justify="center" type="flex">
				<el-col :xl="5" :lg="7">
					<el-button @click="centerPrevent = false">关闭</el-button>
				</el-col>
			</el-row>
		</el-dialog>
		<!--现有病例-->
		<el-dialog title="请选择现有病史" :visible.sync="centerNow" :modal-append-to-body='false' width="1000px" center id="illSelect">
			<el-checkbox-group class="groupTop" v-model="medicalCurrent">
				<el-checkbox v-for="(city,index) in illOption" :label="city.value" :key="index">{{city.value}}</el-checkbox>
			</el-checkbox-group>
			<el-row :gutter="30" justify="center" type="flex">
				<el-col :xl="5" :lg="7">
					<el-button @click="centerNow = false">关闭</el-button>
				</el-col>
			</el-row>
		</el-dialog>
    </el-row>
</template>

<script>
	import axios from "axios";
  import ubPictures from '@/components/pictures';

	export default {
    components: { ubPictures },
		props: ["elderId","notEdit"],
		data() {
			return {
				yinshi: [],
                dialogImageUrl: "",
				dialogVisible: false,
				centerPrevent: false,
				centerNow: false,
				sign: '',
				xtpic: [],
				ggnpic: [],
				heartpic: [],
                fileList: [],
				fileList1: [],
                fileList2: [],
				illOption: [],
				medicalCurrent: [],
				medicalHistory: [],
				form: {
					reportResult: '合格'
				},
				rules: {
					reportResult: [{
					required: true,
					message: "",
					trigger: "blur,change"
					}],
					medicalOther: [{
					required: true,
					message: "",
					trigger: "blur,change"
					}],
					medicalReport: [{
					required: true,
					message: "",
					trigger: "blur,change"
					}],
				},
				hasTaboo: true, // 是否无禁忌
				showHasTaboo: false // 是否显示“无禁忌”那一项，false表示显示
			}
		},
		created() {
			this.sign = this.$route.query.sign;
			this.infoInit();
		},
		methods:{
			infoInit(){
            let data = {
					elderId: this.elderId
				};
				axios.fetch('elderServer', '/elderMedical/all', data).then(res => {
					let resData = res.data;
					if(resData) {
						if(resData.reportResult==='' || resData.reportResult===undefined){
							resData.reportResult = '合格';
						}
						this.form = resData;
						if(!resData.medicalCurrent ||resData.medicalCurrent == "") {
							this.medicalCurrent = [];
						} else {
							resData.medicalCurrent = resData.medicalCurrent.split(",");
							this.medicalCurrent = resData.medicalCurrent;
						}
						if(!resData.medicalHistory ||resData.medicalHistory == "") {
							this.medicalHistory = [];
						} else {
							resData.medicalHistory = resData.medicalHistory.split(",");
							this.medicalHistory = resData.medicalHistory;
						}
						if(!resData.dietAvoid ||resData.dietAvoid == "") {
							this.yinshi = [];
						} else {
							resData.dietAvoid = resData.dietAvoid.split(",");
							this.yinshi = resData.dietAvoid;
							this.hasTaboo = this.yinshi.indexOf('无禁忌') > -1 ? true : false
							this.showHasTaboo = this.yinshi.indexOf('无禁忌') > -1 ? false : true
						}
						let reportChest = resData.reportChest ? resData.reportChest.split(",") : [];
						let reportHeart = resData.reportHeart ? resData.reportHeart.split(",") : [];
						let reportLiver = resData.reportLiver ? resData.reportLiver.split(",") : [];
						if(resData.reportChest&&resData.reportHeart&&resData.reportLiver) {
							for(let i = 0; i < reportChest.length; i++) {
								this.fileList.push({url: this.ossPic + reportChest[i]});
								this.xtpic.push(this.fileList[i]["url"]);
							}
							for(let i = 0; i < reportHeart.length; i++) {
								this.fileList2.push({url: this.ossPic + reportHeart[i]});
								this.heartpic.push(this.fileList2[i]["url"]);
							}
							for(let i = 0; i < reportLiver.length; i++) {
								this.fileList1.push({url: this.ossPic + reportLiver[i]});
								this.ggnpic.push(this.fileList1[i]["url"]);
							}
						}
					}
					// this.$forceUpdate();
				});
			},
            /*添加过往病例*/
			addPrevent(str) {
				this.illOption = [];
				if(str == "now") {
					this.centerNow = true;
				} else {
					this.centerPrevent = true;
				}
				let data = {
					parentNos: "病史"
				}
				axios
				.fetch('commonServer', "/dict/getItemViewsByParentNo", data)
				.then(res => {
					let option = res.data.map(item=>{
						return {
							label: item.itemId,
							value: item.title
						}
					});
					this.illOption = option;
				})
			},
			// 饮食禁忌如果选择无禁忌
			handleChangeCheckNo(val) {
				console.log(val)
				this.hasTaboo = val ? true : false
				this.showHasTaboo = val ? false : true
				this.yinshi = val ? ['无禁忌'] : []
				console.log(this.yinshi)
			},
			// 饮食禁忌如果选择其它
			handleChangeCheck(val) {
				this.hasTaboo = val.length > 0 ? false : true
				this.showHasTaboo = val.length > 0 ? true : false
				this.yinshi = val.length > 0 ? val : ['无禁忌']
				console.log(this.yinshi)
			},
      		addNow() {
				this.centerNow = true;
			},
            clearOne(index) {
				this.medicalHistory.splice(index, 1);
			},
			clearOne1(index) {
				this.medicalCurrent.splice(index, 1);
			},
			/*清空病例*/
			clearAllIll(str) {
				if(str === "over") {
					this.form.medicalHistory = [];
					this.medicalHistory = [];
				} else if(str === "now") {
					this.form.medicalCurrent = [];
					this.medicalCurrent = [];
				}
			},
			/*图片上传*/
			handleRemove(file, fileList) {
			},
			handlePictureCardPreview(file, fileList) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			/*胸透*/
			handleRemoveXt(file, fileList) {
				let dele = "";
				if(file.response) {
					dele = file.response.url;
				} else {
					dele = file.url;
				}
				for(var i = 0; i < this.xtpic.length; i++) {
					if(this.xtpic[i] == dele) {
						this.xtpic.splice(i, 1);
					}
				}

				let data = {
					url: dele
				};
				this.loading = true;
				axios.post("/sev/SerEnter/deleteFile", qs.stringify(data)).then(res => {
					this.loading = false;
					if(res.data.code == 200) {} else if(res.data.code == "401") {
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
			handleAvatarSuccessXt(res, file, fileList) {
						this.xtpic.push(res.url);
			},
            /*肝功能*/
			handleRemoveGgn(file, fileList) {
				let dele = "";
				if(file.response) {
					dele = file.response.url;
				} else {
					dele = file.url;
				}
				for(var i = 0; i < this.ggnpic.length; i++) {
					if(this.ggnpic[i] == dele) {
						this.ggnpic.splice(i, 1);
					}
				}

				let data = {
					url: dele
				};
				this.loading = true;
				axios.post("/sev/SerEnter/deleteFile", qs.stringify(data)).then(res => {
					this.loading = false;
					if(res.data.code == 200) {

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
			handleAvatarSuccessGgn(res, file, fileList) {
				this.ggnpic.push(res.url);
      },
            /*心电图*/
			handleRemoveHeart(file, fileList) {
				let dele = "";
				if(file.response) {
					dele = file.response.url;
				} else {
					dele = file.url;
				}
				for(var i = 0; i < this.heartpic.length; i++) {
					if(this.heartpic[i] == dele) {
						this.heartpic.splice(i, 1);
					}
				}

				let data = {
					url: dele
				};
				this.loading = true;
				axios.post("/sev/SerEnter/deleteFile", qs.stringify(data)).then(res => {
					this.loading = false;
					if(res.data.code == 200) {} else if(res.data.code == "401") {
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
      handleAvatarSuccessHeart(res, file, fileList) {
				this.heartpic.push(res.url);
      },
      childAction(){
				if(this.form["reportResult"] === "" || this.form["reportResult"] === undefined) {
					this.$message.error("请输入体检结论");return;
				}
				var params = new FormData();
				let relArray = [];
				this.form.medicalCurrent = this.medicalCurrent;
				this.form.medicalHistory = this.medicalHistory;
				for(var key in this.form) {
					params.append(key, this.form[key]);
				}
				for(let i=0; i<this.xtpic.length; i++){
					if(this.xtpic[i].includes('http')){
            this.xtpic[i] = this.xtpic[i].split('com/')[1];
					}
				}
				for(let i=0; i<this.ggnpic.length; i++){
					if(this.ggnpic[i].includes('http')){
            this.ggnpic[i] = this.ggnpic[i].split('com/')[1];
					}
				}
				for(let i=0; i<this.heartpic.length; i++){
					if(this.heartpic[i].includes('http')){
            this.heartpic[i] = this.heartpic[i].split('com/')[1];
					}
				}
				params.append("reportChest", this.xtpic);
				params.append("reportLiver", this.ggnpic);
				params.append("reportHeart", this.heartpic);
				params.append("dietAvoid", this.yinshi);
				let data = {
					elderId: this.elderId,
                    medicalHistory: this.medicalHistory.toString(),
					medicalCurrent: this.medicalCurrent.toString(),
					medicalOther: this.form.medicalOther,
					medicalAvoid: this.form.medicalAvoid,
					dietAvoid: this.yinshi.toString(),
					reportResult: this.form.reportResult,
					// reportChest: this.xtpic.toString(),
					// reportLiver: this.ggnpic.toString(),
					// reportHeart: this.heartpic.toString()
					reportChest: this.form.reportChest,
					reportLiver: this.form.reportLiver,
					reportHeart: this.form.reportHeart
				}
				console.log(data,params)
				axios
				.fetch('elderServer', "/elderMedical/submit", data, 'json')
				.then(res => {
					this.$message({
						message: "提交成功",
						type: "success"
					});
					this.$emit(
						"healthCondition",
						"healthCondition",
						"functionalEvaluation"
					);
				})
			},
      }		
    }
</script>

<style scoped>
    .addIllBtn {
		width: 90px;
		height: 32px;
		background: rgba(108, 188, 108, 1);
		border-radius: 4px;
		font-size: 14px;
		text-align: center;
		line-height: 5px;
		color: white;
	}
	.clearIllBtn {
		width: 7em;
		height: 32px;
		border-radius: 4px;
		font-size: 14px;
		text-align: center;
		line-height: 5px;
		color: #333333!important;
		/*padding: 2px 4px;*/
	}
	.illHistroy .el-form-item__content span, .ill {
		display: inline-block;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		padding: 0px 14px;
		margin-right: 5px;
		line-height: 30px;
		font-size: 13px;
	}
	#addIll {
		font-size: 12px;
		padding: 0 4px;
		color: white;
		font-weight: 200;
	}
	#clearIll {
		font-size: 12px;
		padding: 0 4px;
		font-weight: 200;
		color: #333333;
	}
	.plPic b {
		font-weight: 500;
	}
	.plPic span {
		font-size: 12px;
		margin-left: 10px;
		color: #666;
	}
	.plPic >>> .upload-img span {
		font-size: 16px;
		color: #fff;
	}
	.upload-img-dialog >>> .el-dialog {
		margin-top: 0!important;
		 width: auto;
	}
	.upload-img-dialog >>> .el-dialog .el-dialog__body img{
		width: auto;
		height: 95vh;
	}
	.label-resize{
		position: relative;
		left: -63px;
		margin-bottom: 15px;
	}
	.el-textarea >>> .el-input__count {
		line-height: 20px;
	}
	#illSelect >>> .el-checkbox {
		margin-bottom: 20px;
        margin-left: 5px;
		width: 11em;
	}
</style>