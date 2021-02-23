<template>
    <div class="ass">
        <el-form label-width="5em">
            <el-card class="box-card">
                <el-row>
                    <el-col :span="10">

                <el-form-item label="选择老人" class="choose-old-man">
                    <!-- <el-col :xl="3" :lg="5"> -->
                        <el-cascader v-model="buildingName" :props="{ checkStrictly: false }" :class="{'not-allowed':sign=='repair'}" clearable placeholder="楼层" @change="changeBuilding" :options="optionsBuilding" change-on-select :disabled='(sign=="repair"||continues==true||isActive==1)?true:false'></el-cascader>
                    <!-- </el-col> -->
                    <!-- <el-col :xl="3" :lg="5"> -->
                        <el-select v-model="room.id" clearable placeholder="房间" filterable @change="changeRoom(room.id)" no-match-text=" " :disabled='(sign=="repair"||continues==true||isActive==1)?true:false'>
                            <el-option v-for="(item,index) in optionRoom" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    <!-- </el-col> -->
                    <!-- <el-col :xl="3" :lg="5"> -->
                        <el-select v-model="oldMan.id" clearable placeholder="具体老人" filterable @change="changeOldMan(oldMan.id)" no-match-text=" " :disabled='(sign=="repair"||continues==true||isActive==1)?true:false'>
                            <el-option v-for="(item,index) in optionOldMan" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    <!-- </el-col> -->
                </el-form-item>
                    </el-col>
                    <el-col :span="7">

                <el-form-item label="评估类别" prop="">
                    <el-radio-group v-model="ec_classes">
                        <el-radio v-for="(p,index) in point" :label="index" :key="index" :disabled='(sign=="repair"&&index!=ec_classes)||(isActive==1&&index!=ec_classes)||(sign=="add"&&isFirst==0&&p=="首次评估")?true:false' @change = 'typeChange'>{{p}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                    </el-col>
                    <el-col :span="7">

                <el-form-item label="评估时间" prop="">
                    <el-col :span="11">
                        <el-date-picker v-model="assessDateRange[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable :disabled='sign=="repair"'></el-date-picker>
                    </el-col>
                    <el-col :span="1" style="text-align:center;">-</el-col>
                    <el-col :span="11">
                        <el-date-picker v-model="assessDateRange[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable :disabled='sign=="repair"'></el-date-picker>
                    </el-col>
                </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <div class="table-card">
                <el-row style="padding:10px 0 10px 20px;border-bottom: 1px solid #ddd;background: #FBFBFC;">
                    <el-button v-for="(item,index) in tabs" style="width: 8em;" :disabled="sign==='add'&&index!==0" :type="index==isActive?'primary':''" @click="aaa(index)" :key="index">{{item}}</el-button>
                </el-row>
                <div style="padding:20px;">
                    <assessProject ref='AssessProject' v-if="sign !== 'add' && isActive == 0 && show && !isNew" :sign="sign"></assessProject>
                    <AssessProjectNew ref='AssessProject' v-if="sign ==='add' || (isActive == 0 && show && isNew)" :sign="sign"></AssessProjectNew>
                    <assessReport ref='AssessReport' v-if="isActive == 1 && !isNew"></assessReport>
                    <AssessReportNew ref='AssessReport' v-if="isActive == 1 && isNew"></AssessReportNew>
                    <assessOld ref='AssessOld' v-if="isActive == 2"></assessOld>
                </div>
                <div class="footer">
                    <el-row>
                        <!-- <div class="button-save">
                            <el-col :span="3"> -->
                                <el-button type="primary" @click="save()">保存</el-button>
                            <!-- </el-col>
                        </div> -->
                        
                        <!-- <el-col :span="3"> -->
                            <el-button type @click="cancel()">取消</el-button>
                        <!-- </el-col> -->
                    </el-row>
                </div>
            </div>
        </el-form>
    </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import AssessProject from "./assessProject";
import AssessProjectNew from "./assessProjectNew";
import AssessReport from "./assessReport";
import AssessReportNew from "./assessReportNew";
import AssessOld from "./assessOld";
export default {
    components: { AssessProject, AssessReport, AssessOld ,AssessProjectNew,AssessReportNew },
    data() {
        return {
            show: true,
            sign: "",
            continues: false,
            buildingName: [],
            assessDateRange: [],
            optionsBuilding: [],
            optionRoom: [],
            optionOldMan: [],
            ec_classes: 0,
            isFirst: 1,
            contentTitleData: {},
            building: {
                id: "",
                name: ""
            },
            room: {
                id: "",
                name: ""
            },
            oldMan: {
                id: "",
                name: "",
                baseNumber: ""
            },
            tabs: ["评估项目", "评估报告", "养老服务建议"],
            isActive: 0,
            point: ["首次评估", "复核评估", "持续评估"],
            evId: 0,
            repairParams: {},
            isNew: false
        };
    },
    computed: {},
    created() {
        this.sign = this.$route.query.sign;
        this.initBuilding();
        if (this.sign == "repair") {
            this.repairParams = JSON.parse(this.$route.query.repairParams);                 //获取传递过来的值
            this.initRepair(this.repairParams);                                     
        } else if (this.sign == "add"&&this.$route.query.repairParams != undefined) {
            this.repairParams = JSON.parse(this.$route.query.repairParams);
            this.initContinue(this.repairParams);
        }
        this.isNew = this.repairParams.version !== null ? true : false;
        console.log(this.repairParams);
        console.log(this.isNew);
    },
    methods: {
        //初始化持续评估数据
        initContinue(repairParams) {
            this.continues = true;
            this.oldMan.name = repairParams.elderName;
            this.oldMan.id = repairParams.elderId;
            if(this.$moment(repairParams.endDate).valueOf()<this.$moment().valueOf()){
                this.ec_classes = 2; //持续评估
                let startDate = this.afterOneDate(repairParams.endDate.split(" ")[0]);
                this.assessDateRange = [startDate,this.computeOneLater(startDate)]; //评估时间
            } else {
                this.ec_classes = 1; //复合评估
                this.assessDateRange = [this.$moment().format('YYYY-MM-DD'),this.computeOneLater(this.$moment().format('YYYY-MM-DD'))]; //评估时间
            }
            // let startDate = this.afterOneDate(repairParams.endDate.split(" ")[0]);
            // this.assessDateRange = [startDate,this.computeOneLater(startDate)]; //评估时间
            this.initBuildingRoom(); //初始化楼宇房间数据
        },
        typeChange(val){
            console.log(val);
            const repairParams = JSON.parse(this.$route.query.repairParams);
            if(val == 2){
                let startDate = this.afterOneDate(repairParams.endDate.split(" ")[0]);
                this.assessDateRange = [startDate,this.computeOneLater(startDate)]; //评估时间
            } else if(val == 1) {
            // let startDate = this.afterOneDate(this.$moment().format('YYYY-MM-DD'));
                this.assessDateRange = [this.$moment().format('YYYY-MM-DD'),this.computeOneLater(this.$moment().format('YYYY-MM-DD'))]; //评估时间
            }
        },
        //初始化编辑数据
        initRepair(repairParams) {
            this.oldMan.name = repairParams.elderName;
            this.oldMan.id = repairParams.elderId;
            this.ec_classes = repairParams.estimateType; //评估类别
            this.assessDateRange = [
                repairParams.startDate.split(" ")[0],
                repairParams.endDate.split(" ")[0]
            ]; //评估时间
            this.initBuildingRoom(); //初始化楼宇房间数据
        },
        //根据时间算出一年后的日期
        computeOneLater(val) {
            var d2 = new Date(val);
            d2.setFullYear(d2.getFullYear() + 1);
            d2.setDate(d2.getDate() - 1);
            return d2
                .toLocaleString()
                .split(" ")[0]
                .replace(/\//g, "-");
        },
        //在原有的时间上往后推一天
        afterOneDate(val){
            let startDate = new Date(val);
            startDate.setDate(startDate.getDate() + 1);
            let month=(startDate.getMonth()+1)<10?"0"+(startDate.getMonth()+1):(startDate.getMonth()+1);
            let day=startDate.getDate()<10?"0"+startDate.getDate():startDate.getDate();
            startDate = startDate.getFullYear()+'-'+month+'-'+day;
            return startDate;
        },
        initBuildingRoom() {
            let that = this;
            let data = {
                elderId: this.oldMan.id
            };
            axios.fetch("elderServer", "/elderInfo/all", data).then(res => {
                let resData = res.data[0];
                that.building = {
                    id: resData.buildingId,
                    name: resData.buildingName
                };
                that.room = {
                    id: resData.roomId,
                    name: resData.roomName
                };
                that.buildingName = [that.building.id, resData.floor];
                that.changeBuilding(that.buildingName);
            });
        },
        initBuilding() {
            let that = this;
            axios.fetch("oaServer", "/org/building/list").then(res => {
                let opt = [];
                let building = res.data;
                building.forEach(item => {
                    let subOpt = {};
                    subOpt.value = item.buildingId;
                    subOpt.label = item.buildingName;
                    let floor = parseInt(item.floors);
                    if (typeof floor == "number") {
                        let children = [];
                        for (let i = 0; i < floor; i++) {
                            let sub = {};
                            sub.value = i + 1;
                            sub.label = i + 1 + "层";
                            children.push(sub);
                        }
                        subOpt.children = children;
                    }
                    opt.push(subOpt);
                });
                that.optionsBuilding = opt;
            });
        },
        changeBuilding(value) {
            if (this.sign === "add" && JSON.stringify(this.repairParams) === '{}') {
                this.optionRoom = [];
                this.optionOldMan = [];
                this.room.id = "";
                this.room.name = "";
                this.oldMan.id = "";
                this.oldMan.name = ""; 
                if(value.length===0) return;
            }
            let data = {
                buildingId: value[0],
                floor: value[1],
                pageSize: 1000
            };
            this.building.id = value[0];
            for (var o = 0; o < this.optionsBuilding.length; o++) {
                if (value[0] == this.optionsBuilding[o].value) {
                    this.building.name = this.optionsBuilding[o].label;
                }
            }
            axios.fetch("oaServer", "/org/room/list", data).then(res => {
                this.optionRoom = res.data.map(item => {
                    return {
                        label: item.roomName,
                        value: item.roomId
                    };
                });
                if (this.room.id) {
                    this.changeRoom(this.room.id);
                }
            });
        },
        changeRoom(id) {
            if (this.sign === "add" && JSON.stringify(this.repairParams) === '{}') {
                this.optionOldMan = [];
                this.oldMan.id = "";
                this.oldMan.name = "";
                if(id=="") return;
            }
            for (var o = 0; o < this.optionRoom.length; o++) {
                if (id == this.optionRoom[o].value) {
                    this.room.name = this.optionRoom[o].label;
                }
            }
            let data = {
                roomId: this.room.id
            };
            axios.fetch("elderServer", "/elderInfo/all", data).then(res => {
                this.optionOldMan = res.data.map(item => {   
                    return {
                        label: item.elderName,
                        value: item.elderId
                    };
                });
                if (this.oldMan.id) {
                    this.changeOldMan(this.oldMan.id);
                }
            });
        },
        changeOldMan(id) {
            for (var i = 0; i < this.optionOldMan.length; i++) {
                if (id == this.optionOldMan[i].value) {
                    this.oldMan.name = this.optionOldMan[i].label;
                    //是否有过首次评估
                    let data = {
                        elderId: this.oldMan.id
                    };
                    axios
                        .fetch("elderServer", "/elderEstimate/first", data)
                        .then(res => {
                            this.isFirst = res.data;
                        });
                }
            }
        },
        aaa(index) {
            this.isActive = index;
        },
        save() {
            this.contentTitleData = {
                buildingName: this.buildingName,
                roomName: this.room.name,
                estimateType: this.ec_classes,
                levelName: this.repairParams.levelName,
                elderId: this.oldMan.id,
                elderName: this.oldMan.name,
                startDate: this.assessDateRange[0],
                endDate: this.assessDateRange[1]
            };
            if (this.isActive === 0) {
                this.$refs.AssessProject.$emit("hello", this.contentTitleData);
            } else if (this.isActive === 1) {
                this.$refs.AssessReport.$emit("hello", this.contentTitleData);
            } else if (this.isActive === 2) {
                this.$refs.AssessOld.$emit("hello", this.contentTitleData);
            }
        },
        cancel() {
            this.$router.push("/elder/care/assessList");
        }
    }
};
</script>

<style scoped>
/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
}
/deep/ .el-col-3 {
    width: 7%;
}
.ass .el-card {
    margin-bottom: 10px;
}
.ass .el-button {
    width: 8em;
}
.ass .choose-old-man .el-col {
    margin: 0 10px;
}
.ass .table-card {
    background: #fff;
    padding-bottom: 20px;
}
.ass .table-card .el-button {
    width: 110px;
    height: 36px;
    margin-right: 10px;
    font-size: 16px;
}
.footer {
    position: relative;
}
.footer .el-row {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform:translate(-50%,-50%);
	transform: translate(-50%,-50%);
	width: 230px;
	display: flex;
	justify-content: space-between;
}
.footer .el-row .el-button {
    width: 100px;
    height: 36px;
}
.footer .el-row .el-button:nth-child(2){
    margin-right:0;
}
</style>