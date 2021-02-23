<template>
    <el-card class="box-card" style="padding-top:20px;">
        <el-form label-width="80px" :rules="rules" :model="form" style="margin:20px;">
            <div slot="header" class="clearfix">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <s class="greenBa"></s>
                        <span>老人的首次服务项目</span>
                    </el-col>
                </el-row>
            </div>
            <div class="firstServerTable">
                <table>
                    <thead>
                        <th>服务项目</th>
                        <th>服务内容</th>
                        <th style="width:28%;">合计</th>
                    </thead>
                    <tr>
                        <td>进食</td>
                        <td>
                            <el-checkbox-group v-model="efsEat" :disabled="notEdit==true">
                                <el-row style="margin-bottom: 0px;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 喂食</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 饮水</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 食物却碎或搅拌</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsEatSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>修饰洗浴</td>
                        <td>
                            <el-checkbox-group v-model="efsBathing" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 漱口</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 刷牙</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 洗脸</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="D">D 洗手</el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom: 10px;">
                                    <el-col :span="6">
                                        <el-checkbox label="E">E 义齿清洁</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="F">F 口腔清洁</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="G">G 梳头</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="H">H 洗脚</el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom: 10px;">
                                    <el-col :span="6">
                                        <el-checkbox label="I">I 清洗会阴部</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="J">J 剃须</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="K">K 修剪脚趾头</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="L">L 洗头</el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom: 10px;">
                                    <el-col :span="6">
                                        <el-checkbox label="M">M 理发</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="N">N 洗浴</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsBathingSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>穿（脱）衣</td>
                        <td>
                            <el-checkbox-group v-model="efsDressing" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 部分帮忙穿脱</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 完全帮忙穿脱</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 部分帮忙更换</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="D">D 完全帮忙更换</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsDressingSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>如厕排泄</td>
                        <td>
                            <el-checkbox-group v-model="efsTobathroom" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 提醒</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 扶助如厕</el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom: 10px;">
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 协助使用便器</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="D">D 更换尿布</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="E">E 清洁皮肤</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsTobathroomSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>移动</td>
                        <td>
                            <el-checkbox-group v-model="efsMove" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 协助站立</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 协助行走</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 协助上下楼</el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-bottom: 10px;">
                                    <el-col :span="6">
                                        <el-checkbox label="D">D 协助使用助步器</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="E">E 协助使用轮椅</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsMoveSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>压疮护理</td>
                        <td>
                            <el-checkbox-group v-model="efsNursing" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 定时翻身</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 清洁皮肤</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsNursingSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>物品整理</td>
                        <td>
                            <el-checkbox-group v-model="efsArrangement" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 部分帮助整理床单位</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 完全帮助整理床单位</el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 部分帮助整理衣物</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="D">D 完全帮助整理衣物</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsArrangementSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>用药</td>
                        <td>
                            <el-checkbox-group v-model="efsMedication" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 保管药物</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 发放药物</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 帮助药物</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsMedicationSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>膳食</td>
                        <td>
                            <el-checkbox-group v-model="efsDiet" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 一日三餐</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 特殊饮食</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 送餐</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsDietSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>洗涤</td>
                        <td>
                            <el-checkbox-group v-model="efsWash" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A">A 衣物清洗</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B">B 被褥清洗</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="C">C 尿布清洗</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsWashSort}}]</span>项服务
                        </td>
                    </tr>
                    <tr>
                        <td>其他</td>
                        <td>
                            <el-checkbox-group v-model="efsOther" :disabled="notEdit==true">
                                <el-row style="margin: 10px 0;">
                                    <el-col :span="6">
                                        <el-checkbox label="A" key="A">A 物品清洁消毒</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="B" key="B">B 预防保健</el-checkbox>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-checkbox label="C" key="C">C 社交娱乐</el-checkbox>
                                    </el-col>
                                </el-row>
                            </el-checkbox-group>
                        </td>
                        <td>
                            提供<span class="serviceType">[{{efsOtherSort}}]</span>项服务
                        </td>
                    </tr>
                </table>
                <div style="width:40%;color:#666666;">
                    <el-form-item label="约定服务" label-width="80px">
                        <el-input type="textarea" plain v-model="efsContractService" placeholder="请输入约定服务" :disabled="notEdit==true"></el-input>
                    </el-form-item>
                </div>
                <div style="width:20%;color:#666666;display:none;">
                    <el-form-item label="评估时间" label-width="80px" prop="efsEstimateTime">
                        <el-date-picker v-model="efsEstimateTime" type="date" placeholder="选择日期时间" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" default-time="12:00:00" :disabled="notEdit==true"></el-date-picker>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </el-card>
</template>

<script>
	import axios from "axios";
	export default {
        props: ["elderId","notEdit"],
		data() {
			return {
                sign: '',
                form: {},
                nursingIds: [],
                efsEat: [],
				efsBathing: [],
				efsDressing: [],
				efsTobathroom: [],
				efsMove: [],
				efsNursing: [],
				efsArrangement: [],
				efsMedication: [],
				efsDiet: [],
				efsWash: [],
				efsOther: [],
				efsEstimateTime: "",
                efsContractService: "",
                //itemTitle
                itemTitles: ["进食","修饰洗浴","穿（脱）衣","如厕排泄","移动",
                "压疮护理","物品整理", "用药","膳食","洗涤","其他","约定服务","评估时间"],
				efsId: '',
                rules: {
                    efsEstimateTime: [{
						required: true,
						message: "",
						trigger: "blur,change"
					}]
                },

			}
        },
        created(){
            this.sign = "add";
            this.infoInit();
            this.efsEstimateTime = this.getCurrentDate();
        },
		methods:{
            //获取当前日期
            getCurrentDate(){
                let nowDate = new Date();
                let y = nowDate.getFullYear(); 
                let m = (nowDate.getMonth()+1)<10?"0"+(nowDate.getMonth()+1):(nowDate.getMonth()+1);//获取当前月份的日期，不足10补0
                let d = nowDate.getDate()<10?"0"+nowDate.getDate():nowDate.getDate();//获取当前几号，不足10补0
                return y+"-"+m+"-"+d;   
            },
            infoInit(){
                let data = {
				    elderId: this.elderId
                };
                axios
				.fetch('elderServer', "/elderNursing/all", data)
				.then(res => {
					if(res.data) {
                        this.initAssemble(res.data);
                        if(this.efsEstimateTime){
                            this.sign = "edit";
                        }
                    }
				})
            },
            //组装初始化的数据
            initAssemble(data){
               //itemName和remark
               let itemNames= [this.efsEat,this.efsBathing,this.efsDressing,this.efsTobathroom,this.efsMove,this.efsNursing,
               this.efsArrangement,this.efsMedication,this.efsDiet,this.efsWash,this.efsOther,this.efsContractService,this.efsEstimateTime];
               for(let i=0; i<this.itemTitles.length; i++){
                   for(let j=0; j<data.length; j++){
                        if(data[i].itemType==="首次服务项目"){
                            this.nursingIds[i] = data[i].nursingId;
                            if(this.itemTitles[i]===data[i].itemTitle&&(this.itemTitles[i]==="约定服务"||this.itemTitles[i]==="评估时间")){
                                    itemNames[i] = data[i].itemName;
                            }else if(this.itemTitles[i]===data[i].itemTitle){
                                    itemNames[i] = data[i].itemName?data[i].itemName.split(","):[];
                            }
                        }
                   }
               }
               this.efsEat = itemNames[0];
               this.efsBathing = itemNames[1];
               this.efsDressing = itemNames[2];
               this.efsTobathroom = itemNames[3];
               this.efsMove = itemNames[4];
               this.efsNursing = itemNames[5];
               this.efsArrangement = itemNames[6];
               this.efsMedication = itemNames[7];
               this.efsDiet = itemNames[8];
               this.efsWash = itemNames[9];
               this.efsOther = itemNames[10];
               this.efsContractService = itemNames[11];
               this.efsEstimateTime = itemNames[12];
            },
            //组装需要保存的数据
            saveAssemble(){
                let firstForm = [];
                //itemName和remark
                let itemNames= [this.efsEat,this.efsBathing,this.efsDressing,this.efsTobathroom,this.efsMove,this.efsNursing,
                this.efsArrangement,this.efsMedication,this.efsDiet,this.efsWash,this.efsOther,this.efsContractService,this.efsEstimateTime];
                for(let i=0; i<this.itemTitles.length; i++){
                    // debugger
                    let itemName = (typeof itemNames[i])=="object"?itemNames[i].join(","):itemNames[i];
                    let item = {
                        elderId: this.elderId,
                        itemType: "首次服务项目",
                        itemTitle: this.itemTitles[i],
                        itemName: itemName,
                        itemValue: "",
                        remark: itemName,
                    }
                    if(this.sign === "edit") item.nursingId=this.nursingIds[i];
                    firstForm.push(item);
                }
                return firstForm;
            },
			childAction(){
                if(this.efsEstimateTime === "" || this.efsEstimateTime === undefined) {
                    this.$message.error("请输入评估时间");return;
                }
                let firstForm = this.saveAssemble();
				axios
				.fetch('elderServer', "/elderNursing/submit", firstForm, 'json')
				.then(res => {
					this.efsId = res.data.efsId;
                    this.$message({
                        message: "保存成功",
                        type: "success"
                    });
                    this.$emit(
                        "firstServer",
                        "firstServer",
                        "specialProtect"
                    );
				})
            },	
        },
        computed: {
            //排序
			efsEatSort: {
				get() {
					return this.efsEat.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsBathingSort: {
				get() {
					return this.efsBathing.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsDressingSort: {
				get() {
					return this.efsDressing.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsTobathroomSort: {
				get() {
					return this.efsTobathroom.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsMoveSort: {
				get() {
					return this.efsMove.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsNursingSort: {
				get() {
					return this.efsNursing.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsArrangementSort: {
				get() {
					return this.efsArrangement.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsMedicationSort: {
				get() {
					return this.efsMedication.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsDietSort: {
				get() {
					return this.efsDiet.sort().toString().replace(/,/g,'、');
				},
				set() {}
            },
			efsWashSort: {
				get() {
					return this.efsWash.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
			efsOtherSort: {
				get() {
					return this.efsOther.sort().toString().replace(/,/g,'、');
				},
				set() {}
			},
        }
			
    }
</script>

<style scoped>
    .firstServerTable table {
        width: 100%;
        margin-bottom: 30px;
    }
    .firstServerTable table thead th, .firstServerTable table tr td {
        background: #f3f3f3;
        border: 1px solid #dcdfe6;
        height: 50px;
        text-align: center;
    }
    .firstServerTable >>> table tr td {
        background: #fff;
    }
    .el-checkbox, .el-checkbox__input {
        display: inline-block;
        position: relative;
        word-wrap: break-word !important;
    }
    .firstServerTable >>> .el-checkbox__label {
        width: 120px;
        text-align: left;
    }
   .serviceType{
       color: #333333;
       font-weight: bold;
       padding: 0 5px;
   }
   table tr td >>> .el-checkbox{
       color: #666666;
   }
   table tr td{
       font-size: 14px;
       color: #666666;
   }
   table tr td:first-child{
       font-size: 16px;
   }
</style>