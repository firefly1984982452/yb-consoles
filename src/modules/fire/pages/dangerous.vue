<template>
    <div class="app-container">
        <el-form :model="searchData" label-width="70px" inline="true" class="search">
            <el-form-item label="告警时间">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchData.dates" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
            <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
        </el-form>
        <div class="content">
            <el-table :data="listData" border class="ub-table">
                <el-table-column label="序号" width="60" type="index" :index="indexAdd"></el-table-column>
                <el-table-column label="时间" min-width="150">
                    <template slot-scope="scope">{{scope.row.alarmTime  | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="类别" min-width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.category==0">火灾报警</span>
                        <span v-if="scope.row.category==2">消防灭火</span>
                        <span v-if="scope.row.category==3">应急疏散</span>
                        <span v-if="scope.row.category==4">智能健康</span>
                    </template>
                </el-table-column>
                <el-table-column label="地点" min-width="110">
                    <template slot-scope="scope">{{scope.row.floorName}}楼-{{scope.row.installPosition  | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="设备" min-width="110">
                    <template slot-scope="scope">{{scope.row.equipmentName  | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="上报类型" min-width="110">
                    <template slot-scope="scope">
                        <span v-if="scope.row.alarmType==101" style="color:#EB6969">火警</span>
                        <span v-if="scope.row.alarmType==102" style="color:#F6812B">故障</span>
                        <span v-if="scope.row.alarmType==103" style="color:#F6812B">告警</span>
                        <span v-if="scope.row.alarmType==104" style="color:#2FC07A">告警解除</span>
                    </template>
                </el-table-column>
                <el-table-column label="上报问题描述" min-width="100">
                    <template slot-scope="scope">{{scope.row.gaojinleibie | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="现场回报" min-width="100">
                    <template slot-scope="scope">{{scope.row.handleInfo  | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="处理方式" min-width="100">
                    <template slot-scope="scope">
                        <p>现场:{{scope.row.handleWay  | nothingFilter}}</p>
                        <p>设备:{{scope.row.handleDevice   | nothingFilter}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="处理状态" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.handleStatus ==0" style="color:#F6812B">未处理</span>
                        <span v-if="scope.row.handleStatus ==1" style="color:#2FC07A">已处理</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="80">
                    <template slot-scope="scope">
                        <!-- ||scope.row.alarmType==103 -->
                        <el-tooltip v-if="(scope.row.alarmType==101)&&scope.row.handleStatus ==0" class="item" effect="dark" content="误报处理" placement="top-end">
                            <el-button size="mini" class="lookta" @click="falseReport(scope.row)"><i class="iconfont iconcaozuotubiao-wubao-zhengchang"></i></el-button>
                        </el-tooltip>
                        <!-- ||scope.row.alarmType==103 -->
                        <el-tooltip v-if="(scope.row.alarmType==101)&&scope.row.handleStatus ==0" class="item" effect="dark" content="告警处理" placement="top-end">
                            <el-button size="mini" class="lookta" @click="dangerousReport(scope.row)"><i class="iconfont iconcaozuotubiao-baojing-zhengchang"></i></el-button>
                        </el-tooltip>
                        <el-tooltip v-if="scope.row.alarmType==102&&scope.row.handleStatus ==0" class="item" effect="dark" content="复位" placement="top-end">
                            <el-button size="mini" class="lookta" @click="fuWei(scope.row)"><i class="iconfont iconcaozuotubiao-fuwei-zhengchang"></i></el-button>
                        </el-tooltip>
                        <el-tooltip v-if="scope.row.alarmType==102&&scope.row.handleStatus ==0" class="item" effect="dark" content="报修" placement="top-end">
                            <el-button size="mini" class="lookta" @click="baoXiu(scope.row)"><i class="iconfont icontubiao-caozuotubiao-baoxiu"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>

        <el-dialog title="误报处理" :visible.sync="dialogFormVisible" width="23%">
            <el-row>
                <el-col style="margin-top:20px;">
                    <p class="falseTitle">误报原因</p>
                    <el-radio-group v-model="dicForm.alarmMistake" @change="changeFalse()" style="width: 100%;">
                        <el-radio :class="index==3?'checkFalseLast':'checkFalse'" v-for="(item,index) in fasleArr" :label="item" :key="index">{{item}}</el-radio>
                    </el-radio-group>
                </el-col>
                <el-col style="margin-top:10px;" v-if="dicForm.alarmMistake=='其它'">
                    <el-input class="textarea" style="width: 94%;" type="textarea" placeholder="请输入误报原因" v-model="dicForm.mistakeInfo" clearable></el-input>
                </el-col>
                <el-col style="margin-top:20px;">
                    <p class="falseTitle">现场回报</p>
                    <el-input class="textarea" style="width: 94%;margin-top:10px" type="textarea" placeholder="请输入现场回报情况" v-model="dicForm.handleInfo" clearable></el-input>
                </el-col>
                <el-col style="margin-top:20px;">
                    <p class="falseTitle">设备处置方式</p>
                    <el-radio-group v-model="dicForm.handleDevice" @change="changeFalse()" style="width: 92%;text-align:left;margin-top:10px;">
                        <el-radio v-for="(item,index) in fasleMethods" :label="item" :key="index">{{item}}</el-radio>
                    </el-radio-group>
                </el-col>
                <el-col style="margin-top:20px;">
                    <el-row style="text-align:center;margin:20px 0px 20px 0;" :gutter="10" type="flex" justify="center">
                        <el-col class :xl="5" :lg="6">
                            <el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}" @click="saveDict()">提交</el-button>
                        </el-col>
                        <el-col class :xl="5" :lg="6">
                            <el-button @click="dialogFormVisible=false">取消</el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog :title="title1" :visible.sync="dialogFormVisible1" width="23%">
            <el-row>
                <el-col style="margin-top:20px;">
                    <p class="falseTitle">现场回报</p>
                    <el-input class="textarea" style="width: 94%;margin-top:10px" type="textarea" placeholder="请输入现场回报情况" v-model="dicForm2.handleInfo" clearable></el-input>
                </el-col>
                <el-col style="margin-top:20px;">
                    <p class="falseTitle">现场处置方式</p>
                    <el-radio-group v-model="dicForm2.handleWay" @change="changeFalse()" style="width: 92%;text-align:left;margin-top:10px;">
                        <el-radio v-for="(item,index) in fasleMethods2" :label="item" :key="index">{{item}}</el-radio>
                    </el-radio-group>
                </el-col>
                <el-col style="margin-top:20px;">
                    <p class="falseTitle">设备处置方式</p>
                    <el-radio-group v-model="dicForm2.handleDevice" @change="changeFalse()" style="width: 92%;text-align:left;margin-top:10px;">
                        <el-radio v-for="(item,index) in fasleMethods" :label="item" :key="index">{{item}}</el-radio>
                    </el-radio-group>
                </el-col>
                <span slot="footer">
                    <el-button type="primary" @click="saveDict2()">提交</el-button>
                    <el-button @click="dialogFormVisible=false">取消</el-button>
                </span>
            </el-row>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogFormVisible2" width="30%" center>
            <p style="text-align:center">{{text}}</p>
            <span slot="footer">
                <el-button type="primary" @click="sure()">确认</el-button>
                <el-button @click="dialogFormVisible2=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";

export default {
    data() {
        return {
            // btnArr: ['全部告警', '已处理', '未处理'],
            // isactive: '0',
            listData: [],
            dataCount: 0,
            form: {},
            show3: false,
            dialogFormVisible: false,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            isButtonShow: false,
            text: "",
            title1: "报警",
            fasleArr: ["设备故障", "设备检测", "操作不当", "其它"],
            fasleMethods: ["复位", "报修"],
            fasleMethods2: ["自行灭火", "拨打119"],
            checkedFalse: "",
            daId: "",
            di_manufactor: "",
            activeName2: "first",
            loading: true,
            option: [],
            searchData: {
                dates: "",
                pageIndex: 1,
                pageSize: 10
            },
            dicForm: {},
            dicForm2: {},
            alarmId: "",
            deviceId: "",
            lastLink: "",
            handleDevice: "",
            data2: {},
            currentPage3: 1
        };
    },
    computed: {},
    created() {
        this.fetchData();
    },
    methods: {
        addFacilities() {
            this.$router.push({
                path: "/fire/addFacilities"
            });
        },
        falseReport(value) {
            this.alarmId = value.alarmId;
            this.deviceId = value.deviceId;
            this.checkedFalse = "";
            this.dialogFormVisible = true;
        },
        saveDict() {
            let data = {
                alarmMistake: this.dicForm.alarmMistake,
                mistakeInfo: this.dicForm.mistakeInfo,
                handleInfo: this.dicForm.handleInfo,
                handleDevice: this.dicForm.handleDevice,
                alarmId: this.alarmId,
                deviceId: this.deviceId
            };
            axios.fetch("fireServer", "/alarm/editAlarm", data).then(res => {
                if (res.data) {
                    this.$message.success("操作成功！");
                    this.dialogFormVisible = false;
                    this.fetchData();
                }
            });
        },
        dangerousReport(value) {
            this.alarmId = value.alarmId;
            this.deviceId = value.deviceId;
            this.dialogFormVisible1 = true;
        },
        saveDict2() {
            let data = {
                handleWay: this.dicForm2.handleWay,
                handleInfo: this.dicForm2.handleInfo,
                handleDevice: this.dicForm2.handleDevice,
                alarmId: this.alarmId,
                deviceId: this.deviceId
            };
            axios.fetch("fireServer", "/alarm/editAlarm", data).then(res => {
                if (res.data) {
                    this.$message.success("操作成功！");
                    this.dialogFormVisible1 = false;
                    this.fetchData();
                }
            });
        },
        search() {
            this.changePage(1);
        },
        reset() {
            this.searchData = {};
            this.changePage(1);
        },
        changePage(value) {
            this.searchData.pageIndex = value;
            this.fetchData();
        },
        fetchData() {
            axios
                .fetch(
                    "fireServer",
                    "/alarm/getAlarmListPager",
                    this.searchData
                )
                .then(res => {
                    this.listData = res.data.list;
                    this.dataCount = res.data.count;
                });
        },

        indexAdd(index) {
            return (this.currentPage3 - 1) * 10 + (index + 1);
        },
        fuWei(value) {
            this.isButtonShow = false;
            this.dialogFormVisible2 = true;
            this.text =
                "确定要将" + "【" + value.equipmentName + "】" + "复位吗？";
            this.alarmId = value.alarmId;
            this.deviceId = value.deviceId;
        },
        sure() {
            if (this.isButtonShow == false) {
                this.data2 = {
                    handleDevice: "复位",
                    alarmId: this.alarmId,
                    deviceId: this.deviceId
                };
            } else {
                this.data2 = {
                    handleDevice: "报修",
                    alarmId: this.alarmId,
                    deviceId: this.deviceId
                };
            }

            axios
                .fetch("fireServer", "/alarm/editAlarm", this.data2)
                .then(res => {
                    if (res.data) {
                        this.$message.success("操作成功！");
                        this.dialogFormVisible2 = false;
                        this.fetchData();
                    }
                });
        },
        baoXiu(value) {
            this.isButtonShow = true;
            this.dialogFormVisible2 = true;
            this.text =
                "确定要将" + "【" + value.equipmentName + "】" + "报修吗？";
        }
    }
};
</script>
<style scoped>
.addBtn {
    margin: 0 0 0 10px;
    float: left;
}

.checkBtn {
    width: 95px;
    height: 36px;
    border: none;
    margin-left: 16px;
    margin-top: 10px;
}

.searchBtnsStyle {
    width: 95px;
    height: 36px;
    background: #4687e1;
    border: 1px solid #4687e1;
    border-radius: 4px;
    color: white;
    margin-left: 16px;
    margin-top: 10px;
}

.addEquipment {
    width: 95px;
    height: 36px;
    background: #6cbc6c;
    color: white;
    float: right;
    margin-right: 1%;
    margin-top: 10px;
}

.addEquipment .btniconfont {
    color: white;
    font-size: 12px;
}

.btniconfontTabel {
    font-size: 14px;
}

.checkFalse {
    width: 23%;
    text-align: left;
    height: 40px;
    /* border-bottom: 1px solid #EEEEEE; */
    line-height: 40px;
    margin-right: 0%;
}

.checkFalseLast {
    width: 23%;
    text-align: left;
    height: 40px;
    border-bottom: none;
    line-height: 40px;
    margin-right: 0%;
}

.checkFalse:nth-last-child {
    border-bottom: none;
}
/*.el-pagination{
		position: absolute;
		bottom: 14px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		margin: 10px 0;
	}*/
.falseTitle {
    width: 92%;
    text-align: left;
    margin: 0 auto;
    font-size: 14px;
    font-weight: bolder;
}
</style>