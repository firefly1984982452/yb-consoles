<template>
    <el-card class="box-card" style="margin-bottom:100px;">
        <el-row style="padding-top: 30px;">
            <el-col :xl="20" :lg="18">
                <div id="oldManDetail" class="ziliqk ryNew" style="padding-top: 0;">
                    <el-form label-width="125px" :rules="rules">
                        <el-row :gutter="0">
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xl="6" :lg="7" style="width:23.2%;">
                                <el-form-item label="入院编号" prop="checkinNo">
                                    <el-input v-model="form.checkinNo" clearable placeholder="请输入入院编号" :disabled="notEdit==true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xl="6" :lg="7" style="width:23.2%;">
                                <el-form-item label="入院日期" prop="checkinDate">
                                    <el-date-picker v-model="form.checkinDate" type="date" placeholder="请选择" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" :disabled="notEdit==true"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-form-item label="床位" prop="bedId">
                                <el-col :xl="4" :lg="5">
                                    <el-select v-model="form.buildingId" clearable placeholder="请选择楼宇" @change="changeBuilding" :disabled="notEdit==true">
                                        <el-option v-for="(item,index) in buildingOption" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xl="4" :lg="5">
                                    <el-select v-model="form.floor" clearable placeholder="请选择楼层" @change="changeFloor" :disabled="notEdit==true">
                                        <el-option v-for="(item,index) in floorOption" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xl="4" :lg="5">
                                    <el-select v-model="form.roomId" clearable placeholder="请选择房间" @change="changeRoom" :disabled="notEdit==true">
                                        <el-option v-for="(item,index) in roomOption" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :xl="4" :lg="5">
                                    <el-select v-model="form.bedId" clearable placeholder="请选择床位" @change="changeBed" :disabled="notEdit==true">
                                        <el-option v-for="(item,index) in bedOption" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :xl="6" :lg="7" style="width:23.2%;">
                                <el-form-item label="院方护理等级" prop="nursingLevel">
                                    <el-select v-model="dict['院方护理等级'].items.item0" placeholder="请选择院方护理等级" @change="dictUtils.onchange($event, 0, dict['院方护理等级'])" value-key="itemValue" clearable :disabled="notEdit==true">
                                        <el-option v-for="item in dict['院方护理等级'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xl="6" :lg="7" style="width:23.2%;">
                                <el-form-item label="长护险评估等级" prop="insuranceLevel">
                                    <el-select v-model="dict['长护险评估等级'].items.item0" placeholder="请选择长护险等级" @change="dictUtils.onchange($event, 0, dict['长护险评估等级'])" value-key="itemValue" clearable :disabled="notEdit==true">
                                        <el-option v-for="item in dict['长护险评估等级'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :xl="6" :lg="7" style="width:30%;">
                                <el-form-item label="长护险评估有效期" label-width="130px">
                                   <!-- <el-date-picker v-model="insuranceDateRange" type="daterange" 
                                   value-format="yyyy-MM-dd" 
                                   format="yyyy年MM月dd日" 
                                   range-separator="至" 
                                   start-placeholder="开始日期" 
                                   end-placeholder="结束日期" 
                                   :disabled="notEdit==true || dict['长护险评估等级'].values.value0 == 0 || dict['长护险评估等级'].values.value0 == null">
                                   </el-date-picker>  -->
                                    <el-date-picker v-model="insuranceDateRange[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable :disabled="notEdit==true || dict['长护险评估等级'].values.value0 == 0 || dict['长护险评估等级'].values.value0 == null"></el-date-picker>
                                    <el-date-picker v-model="insuranceDateRange[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable :disabled="notEdit==true || dict['长护险评估等级'].values.value0 == 0 || dict['长护险评估等级'].values.value0 == null"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0">
                            <el-form-item label="申请原因" prop="checkinRemark">
                                <el-col :xl="10" :lg="15">
                                <el-input maxlength="50" show-word-limit type="textarea" v-model="form.checkinRemark" style="min-width: 100%;" class="eltextare" placeholder="请输入申请入住原因" clearable :disabled="notEdit==true"></el-input>
                                </el-col>
                            </el-form-item>
                            </el-row>
                        <el-row :gutter="10" v-if="notEdit==true">
                            <el-form-item label="外出约定" prop="agreeOut">
                                <span>老人能自主决定离院外出,在外出期间如发生意外或突发事件,由我们家属和老人负全部责任。</span>
                                <div>
                                    <el-radio-group v-model="form.agreeOut" style="margin-top:5px;">
                                        <el-radio v-for="item in agree" :label="item.label" :key="item.label" :disabled="notEdit==true">{{item.value}}</el-radio>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-row>
                        <el-row :gutter="10" v-if="notEdit==true">
                            <el-form-item label="委托发药" prop="agreeMedicine">
                                <span>委托院方为({{form.elderName}})老人外出就医所配的药物按医嘱发放。</span>
                                <div>
                                    <el-radio-group v-model="form.agreeMedicine" style="margin-top:5px;" :disabled="notEdit==true">
                                        <el-radio v-for="item in agree" :label="item.label" :key="item.label">{{item.value}}</el-radio>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
	import axios from "axios";
    import { dictUtils } from 'youban-utils'
	export default {
    props: ["elderId","notEdit"],
		data() {
			return {
               insuranceDateRange: [],
               loading: '',
               sign: '',
               form: {
                    elderId:"",
                    checkinNo: "",
                    checkinDate: "",
                    buildingId: "",
                    buildingName: "",
                    roomId: "",
                    roomName: "",
                    bedId: "",
                    bedName: "",
                    nursingLevel: "",
                    insuranceLevel: "",
                    checkinRemark: "",
                    startTime:"",
                    endTime:"",
               },
               elderLevel: [],
               elderLevelYf: [],
               buildingOption: [],
               floorOption: [], 
               roomOption: [],
               bedOption: [],
               yinshi: [],
               agree: [{
                   label: 1,
				   value: '同意'
			    },{
				   label: 0,
				   value: '不同意'
                }],
                level: ["1","2","3","4","5","6"],
                dict: {
                    '院方护理等级': {
                        values: {
                            value0: null
                        },
                        items: {
                            item0: null
                        }
                    },
                    '长护险评估等级': {
                        values: {
                            value0: null
                        },
                        items: {
                            item0: null
                        }
                    }
                },
                rules: {   
			      checkinNo:[ 
					{ required: true, message: '',trigger: "blur,change"}
				  ],
				  checkinDate:[
					{ required: true, message: '',trigger: "blur,change"}
                  ],
                  bedId:[ 
					{ required: true, message: '',trigger: "blur,change"}
				  ],
				  nursingLevel:[
					{ required: true, message: '',trigger: "blur,change"}
                  ],
                  insuranceLevel:[ 
					{ required: true, message: '',trigger: "blur,change"}
                  ],
                  agreeOut:[
					{ required: true, message: '',trigger: "blur,change"}
                  ],
                  agreeMedicine:[ 
					{ required: true, message: '',trigger: "blur,change"}
				  ]
                }
            }
        },
        created(){
            this.dictUtils = new dictUtils(this.dict);
            this.form.elderId = this.elderId;
            this.initBuilding();
            this.infoInit();
        },
		methods:{ 
            infoInit(){
                let data = {
					elderId: this.elderId
                }; 
                let that = this;
                axios
				.fetch('elderServer', "/elderInfo/all", data)
				.then(res => {
                    let resData = res.data[0];
					that.form = resData;
                    that.dict['院方护理等级'].values.value0 = resData.nursingLevel;
                    that.dict['长护险评估等级'].values.value0 = resData.insuranceLevel?resData.insuranceLevel:0;
                    that.dictUtils.setValues(that.dict);
                    that.insuranceDateRange = that.form.startTime?[that.form.startTime,that.form.endTime]:[];
                    if(that.form.bedId){
                        that.sign = "init";
                        that.changeBuilding(resData.buildingId);
                    }
				})
            },
            toRuZhuInit(){
                let srsv_id = this.$route.query.srsv_id;
                this.$store.commit("setStaffDataCreate", this.form); 
                let data = {
                    srsv_id: srsv_id
                };
                let that = this;
                axios
                    .post("sev/Reservation/loadReservation", qs.stringify(data))
                    .then(res => {
                        this.loading = false;
                        this.blockImg = 0;
                        if(res.data.code == "200") {
                            let srsv_floor_id = '';
                            if(res.data.data.srsv_room_name){
                                srsv_floor_id = parseInt(res.data.data.srsv_room_name.split('')[0]);
                            }
                            that.form = {
                                se_id: this.form.se_id,
                                se_jinji_yinshi: res.data.data.srsv_jinji_yinshi,
                                se_agree_out: res.data.data.srsv_agree_out,
                                se_agree_medicine: res.data.data.srsv_agree_medicine,
                                se_building_name: res.data.data.srsv_building_name,
                                se_building_id: res.data.data.srsv_building_id,
                                se_floor_id: srsv_floor_id,
                                se_floor_name: '',
                                se_room_id: res.data.data.srsv_room_id,
                                se_room_name: res.data.data.srsv_room_name,
                                se_bed_id: res.data.data.srsv_bed_id,
                                se_bed_name: res.data.data.srsv_bed_name,
                                se_nursing_level: res.data.data.srsv_nursing_level,
                                se_changhu_level: res.data.data.srsv_changhu_level?res.data.data.srsv_changhu_level:''
                            }
                            this.initSign = 1;
                            if(res.data.data.srsv_jinji_yinshi){
                                that.yinshi = [].concat(res.data.data.srsv_jinji_yinshi.split(','));
                            }
                            that.changebuilding(res.data.data.srsv_building_id);
                            that.dict['院方护理等级'].values.value0 = res.data.data.srsv_nursing_level;
                            that.dict['长护险评估等级'].values.value0 = res.data.data.srsv_changhu_level;
                            that.dictUtils.setValues(this.dict);
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
            initBuilding(){
                axios
				.fetch('oaServer', "/org/building/list")
				.then(res => {
					this.buildingOption = res.data.map(item=>{
                        return {
                            value: item.buildingId,
                            label: item.buildingName,
                            floors: item.floors,
                        }
                    })
				})
			},
            changeBuilding(value) {
                if(this.sign!="init"){  
                    this.floorOption = [];
                    this.roomOption = [];
                    this.bedOption = [];
                    this.form.floor = "";
                    this.form.roomId = "";
                    this.form.roomName = "";
                    this.form.roomType = "";
                    this.form.bedId = "";
                    this.form.bedName = "";
                    if(value=="")return;
                }
                this.buildingOption.map(item=>{
                    if(item.value === value){
                        this.form.buildingName = item.label;
                    }
                })
                for(let i=0; i <this.buildingOption.length; i++){
                    if(this.buildingOption[i].value == value){
                        if(typeof this.buildingOption[i].floors == "number") {
                            for(let j = 0; j < this.buildingOption[i].floors; j++) {
                                let sub = {};
                                sub.value = j + 1;
                                sub.label = j + 1 + "层";
                                this.floorOption.push(sub);
                            }
                        }
                    }
                }
                if(this.form.bedId!=""&&this.form.bedId!=undefined){
                    this.changeFloor(this.form.floor);
                }
            },
            changeFloor(value) {
                if(this.sign!="init"){
                    this.roomOption = [];
                    this.bedOption = [];
                    this.form.roomId = "";
                    this.form.roomName = "";
                    this.form.roomType = "";
                    this.form.bedId = "";
                    this.form.bedName = "";
                    if(value=="")return;
                }
				let data = {
					buildingId: this.form.buildingId,
					floor: value,
                    pageSize: 1000
                };
                axios
				.fetch('oaServer', "/org/room/list", data)
				.then(res => {
					this.roomOption = res.data.map(item=>{
                        return {
                            label: item.roomName,
                            value: item.roomId,
                            roomType: item.roomType
                        }
                    });
                    if(this.form.bedId!=""&&this.form.bedId!=undefined){
                        this.changeRoom(this.form.roomId);
                    }
				})
			},
	        changeRoom(value){
                if(this.sign!="init"){
                    this.bedOption = [];
                    this.form.bedId = "";
                    this.form.bedName = "";
                    this.sign = "";
                    if(value=="")return;
                }
                this.roomOption.map(item=>{
                    if(item.value === value){
                        this.form.roomName = item.label;
                        this.form.roomType = item.roomType;
                    }
                })
				let data = {
					roomId: this.form.roomId
                };
                axios
				.fetch('oaServer', "/org/bed/list", data)
				.then(res => {
					this.bedOption = res.data.map(item=>{
                        let bedName = "";
                        switch(item.status){
                            case 0:
                            bedName = item.bedName + "(未知)";
                            break;
                            case 1:
                            bedName = item.bedName + "(空闲)";
                            break;
                            case 2:
                            bedName = item.bedName + "(预定)";
                            break;
                            case 3:
                            bedName = item.bedName + "(入住)";
                            break;
                            case 4:
                            bedName = item.bedName + "(占有)";
                            break;
                        }
                        return {
                            label: bedName,
                            value: item.bedId
                        }
                    });
                    if(this.form.bedId!=""&&this.form.bedId!=undefined){
                        this.changeBed(this.form.bedId);
                    }
				})
	        },
	        changeBed(value){
                this.sign = "";
                this.bedOption.map(item=>{
                    if(item.value === value){
                        this.form.bedName = item.label;
                    }
                })
            },
            childAction(){
                if(this.form.checkinNo === '' || this.form.checkinNo === null || this.form.checkinNo === undefined){
                    this.$message.error('请输入入院编号');return;
                }else if(this.form.checkinDate === '' || this.form.checkinDate === null || this.form.checkinDate === undefined){
                    this.$message.error('请选择入院日期');return;
                }else if(this.form.buildingId === '' || this.form.buildingId === null || this.form.buildingId === undefined){
                    this.$message.error('请选择楼宇名称');return;
                }else if(this.form.floor === '' || this.form.floor === null || this.form.floor === undefined){
                    this.$message.error('请选择楼层');return;
                }else if(this.form.roomId === '' || this.form.roomId === null || this.form.roomId === undefined){
                    this.$message.error('请选择房间号');return;
                }else if(this.form.bedId === '' || this.form.bedId === null || this.form.bedId === undefined){
                    this.$message.error('请选择床位号');return;
                }else if(this.dict['院方护理等级'].values.value0 === '' || this.dict['院方护理等级'].values.value0 === null || this.dict['院方护理等级'].values.value0 === undefined){
                    this.$message.error('请选择院方护理等级');return;
                }else if(this.dict['长护险评估等级'].values.value0 === '' || this.dict['长护险评估等级'].values.value0 === null || this.dict['长护险评估等级'].values.value0 === undefined){
                    this.$message.error('请选择长护险评估等级');return;
                }else if(this.level.includes(this.dict['长护险评估等级'].values.value0)&&(this.insuranceDateRange===null || this.insuranceDateRange.length===0)){
                    this.$message.error('请选择长护险评估有效期');return;
                }
                this.form.nursingLevel = this.dict['院方护理等级'].values.value0;
                this.form.nursingLevelName = this.dict['院方护理等级'].lists.list0.filter(item=>{return this.dict['院方护理等级'].values.value0==item.itemValue})[0].title;
                this.form.insuranceLevel = this.dict['长护险评估等级'].values.value0;
                this.form.insuranceLevelName = this.dict['长护险评估等级'].lists.list0.filter(item=>{return this.dict['长护险评估等级'].values.value0==item.itemValue})[0].title;
                if(this.insuranceDateRange!=null&&this.insuranceDateRange.length>0){
                   this.form.startTime = this.insuranceDateRange[0]; 
                   this.form.endTime = this.insuranceDateRange[1]; 
                }
                this.form.bedName = this.form.bedName.split('(')[0];
                axios
				.fetch('elderServer', "/elderCheckin/submit", this.form, 'json')
				.then(res => {
					this.$message({
                        message: "保存成功",
                        type: "success"
                    });
                    this.$emit(
                        "CheckInfo",
                        "checkInfo",
                        "firstServer",
                        this.form.nursingLevel,
                        this.form.checkinDate
                    );
				})
			}
        }	
    }
</script>

<style scoped>
   
</style>