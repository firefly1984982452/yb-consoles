<template>
    <div>
        <div class="content">
            <el-row type="flex" class="pannel">
                <el-col :span="20" class="left">
                    <el-button :type="1==isActive?'primary':''" @click="isActive=1;$router.push('/oa/schedule/time')">班次设置</el-button>
                    <el-button :type="2==isActive?'primary':''" @click="isActive=2">排班模板</el-button>
                </el-col>
                <el-col :span="4" class="right">
                    <el-button type="success" @click="add('添加模板')" icon="el-icon-plus">添加模板</el-button>
                </el-col>
            </el-row>
            <el-table :data="listData" border class="ub-table">
                <el-table-column label="部门" min-width="60">
                    <template slot-scope="scope">
                        <span @click="see(scope.row)">{{scope.row.deptName | nothingFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="岗位" min-width="60">
                    <template slot-scope="scope">
                        <span @click="see(scope.row)">{{scope.row.jobName | nothingFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="适用人员" min-width="250">
                    <template slot-scope="scope">
                        <span @click="see(scope.row)">{{scope.row.employees | arrFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="50">
                    <template slot-scope="scope">
                        <span @click="see(scope.row)">{{scope.row.status | statusFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" sortable min-width="100%">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                            <el-button size="mini" @click="see(scope.row)"><i class="iconfont iconcaozuotubiao-chakan"></i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                            <el-button size="mini" @click="edit(scope.row,'编辑楼区')"><i class="iconfont  iconcaozuotubiao-bianji"></i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="启用" placement="top-end" v-if="scope.row.status == 0">
                            <el-button size="mini" @click="start(scope.row)"><i class="iconfont iconcaozuotubiao-qiyong-zhengchang"></i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="停用" placement="top-end" v-if="scope.row.status == 1">
                            <el-button size="mini" @click="blockUp(scope.row)"><i class="iconfont iconcaozuotubiao-tingyong-xuanfu"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>

        <el-dialog title="班次情况" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" width="1000px">
            <el-row>
                <el-col :span="24">
                    <div style="font-size:14px;color:#666666;margin:0 0 10px 30px;" v-if="shiftData2.length>0">第一周</div>
                    <table border="1" cellpadding="0" width="100%" style="border:1px solid #DCDFE6" v-if="shiftData1.length>0">
                        <tr>
                            <td v-for="(item,index) in shiftDays1" :key="index" style="text-align:center;">{{item}}</td>
                        </tr>
                        <tr>
                            <td v-for="(item,index) in shiftData1" :key="index" style="text-align:center;width:13%;">
                                <span class="time-name" v-if="item.timeId!=0">
                                    <span class="time-name-hint" :style="{background: item.hint}" v-if="item.hint!=''"></span>
                                    {{item.classes}}
                                </span>
                                <p class="time-style" :style="{visibility:item.classes==''?'hidden':'visible'}" v-if="item.timeId!=0">{{item.time}}</p>
                                <p v-if="item.timeId===0" class="rest-style">
                                    <span></span>休息
                                </p>
                            </td>
                        </tr>
                    </table>
                    <div style="font-size:14px;color:#666666;margin:20px 0 10px 30px;" v-if="shiftData2.length>0">第二周</div>
                    <table border="1" cellpadding="0" width="100%" style="border:1px solid #DCDFE6" v-if="shiftData2.length>0">
                        <tr>
                            <td v-for="(item,index) in shiftDays2" :key="index" style="text-align:center;">{{item}}</td>
                        </tr>
                        <tr>
                            <td v-for="(item,index) in shiftData2" :key="index" style="text-align:center;width:13%;">

                                <span class="time-name" v-if="item.timeId!=0">
                                    <span class="time-name-hint" :style="{background: item.hint}" v-if="item.hint!=''"></span>
                                    {{item.classes}}
                                </span>

                                <p class="time-style" :style="{visibility:item.classes==''?'hidden':'visible'}" v-if="item.timeId!=0">{{item.time}}</p>
                                <p v-if="item.timeId===0" class="rest-style">
                                    <span></span>休息
                                </p>
                            </td>
                        </tr>
                    </table>
                    <div style="font-size:14px;color:#666666;margin:20px 0 10px 30px;" v-if="shiftData3.length>0">第三周</div>
                    <table border="1" cellpadding="0" width="100%" style="border:1px solid #DCDFE6" v-if="shiftData3.length>0">
                        <tr>
                            <td v-for="(item,index) in shiftDays3" :key="index" style="text-align:center;">{{item}}</td>
                        </tr>
                        <tr>
                            <td v-for="(item,index) in shiftData3" :key="index" style="text-align:center;width:13%;">
                                <span class="time-name" v-if="item.timeId!=0">
                                    <span class="time-name-hint" :style="{background: item.hint}" v-if="item.hint!=''"></span>
                                    {{item.classes}}
                                </span>
                                <p class="time-style" :style="{visibility:item.classes==''?'hidden':'visible'}" v-if="item.timeId!=0">{{item.time}}</p>
                                <p v-if="item.timeId===0" class="rest-style">
                                    <span></span>休息
                                </p>
                            </td>
                        </tr>
                    </table>
                    <div style="text-align: center;margin: 30px;">
                        <el-button style="width:8em;" @click="closeWin">关闭</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>

        <el-dialog title="班次情况" :visible.sync="dialogShiftVisible" :close-on-click-modal="false" width="1000px">
            <el-row>
                <div>
                    <div style="font-size:14px;color:#666666;margin:0 0 10px 30px;" v-if="shiftData2.length>0">第一周</div>
                    <table border="1" cellpadding="0" width="100%" class="viewTable" v-if="shiftData1.length>0">
                        <tr>
                            <td v-for="(item,index) in shiftDays1" :key="index" style="text-align:center;">{{item}}</td>
                        </tr>
                        <tr>
                            <td v-for="(item,index) in shiftData1" :key="index" style="text-align:center;width:13%;">
                                <span class="time-name" v-if="item.timeId!=0">
                                    <span class="time-name-hint" :style="{background: item.hint}" v-if="item.hint!=''"></span>
                                    {{item.classes}}
                                </span>
                                <p class="time-style" :style="{visibility:item.classes==''?'hidden':'visible'}" v-if="item.timeId!=0">{{item.time}}</p>
                                <p v-if="item.timeId===0" class="rest-style">
                                    <span></span>休息
                                </p>
                            </td>
                        </tr>
                    </table>
                    <div style="font-size:14px;color:#666666;margin:20px 0 10px 30px;" v-if="shiftData2.length>0">第二周</div>
                    <table border="1" cellpadding="0" width="100%" class="viewTable" v-if="shiftData2.length>0">
                        <tr>
                            <td v-for="(item,index) in shiftDays2" :key="index" style="text-align:center;">{{item}}</td>
                        </tr>
                        <tr>
                            <td v-for="(item,index) in shiftData2" :key="index" style="text-align:center;width:13%;">
                                <span class="time-name" v-if="item.timeId!=0">
                                    <span class="time-name-hint" :style="{background: item.hint}" v-if="item.hint!=''"></span>
                                    {{item.classes}}
                                </span>
                                <p class="time-style" :style="{visibility:item.classes==''?'hidden':'visible'}" v-if="item.timeId!=0">{{item.time}}</p>
                                <p v-if="item.timeId===0" class="rest-style">
                                    <span></span>休息
                                </p>
                            </td>
                        </tr>
                    </table>
                    <div style="font-size:14px;color:#666666;margin:20px 0 10px 30px;" v-if="shiftData3.length>0">第三周</div>
                    <table border="1" cellpadding="0" width="100%" class="viewTable" v-if="shiftData3.length>0">
                        <tr>
                            <td v-for="(item,index) in shiftDays3" :key="index" style="text-align:center;">{{item}}</td>
                        </tr>
                        <tr>
                            <td v-for="(item,index) in shiftData3" :key="index" style="text-align:center;width:13%;">
                                <span class="time-name" v-if="item.timeId!=0">
                                    <span class="time-name-hint" :style="{background: item.hint}" v-if="item.hint!=''"></span>
                                    {{item.classes}}
                                </span>
                                <p class="time-style" :style="{visibility:item.classes==''?'hidden':'visible'}" v-if="item.timeId!=0">{{item.time}}</p>
                                <p v-if="item.timeId===0" class="rest-style">
                                    <span></span>休息
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="text-align: center;margin: 30px;">
                    <el-button style="width:8em;" @click="dialogShiftVisible=false">关闭</el-button>
                </div>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";

export default {
    data() {
        return {
            loading: false,
            dialogShiftVisible: false,
            dialogEditFormVisible: false,
            isActive: 2,
            listData: [],
            dataCount: 0,
            sign: "",
            dialogFormTitle: "",
            timeId: "",
            status: "",
            endDays: false,
            postOption: [],
            deptList: [],
            dialogAddVisible: false,
            dateRange: ["06:00", "15:00"],
            departRowSpans: [],
            jobs: [],
            searchData: {
                pageSize: 10,
                pageIndex: 1
            },
            specificEmployees: [
                {
                    label: "员工",
                    deptId: "",
                    deptName: "",
                    jobId: "",
                    jobName: ""
                }
            ],
            form: {
                deptId: "",
                deptName: "",
                jobId: "",
                jobName: "",
                startDate: "",
                durationDays: "",
                status: 1
            },
            shiftDays1: [
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
                "星期日"
            ],
            shiftData1: [],
            shiftDays2: [
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
                "星期日"
            ],
            shiftData2: [],
            shiftDays3: [
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
                "星期日"
            ],
            shiftData3: []
        };
    },
    computed: {},
    created() {
        this.fetchData();
    },
    methods: {
        search() {
            this.changePage(1);
        },
        changePage(value) {
            this.searchData.pageIndex = value;
            this.fetchData();
        },
        fetchData() {
            let that = this;
            axios
                .fetch(
                    "attendanceServer",
                    "/work/workschedule/queryPager",
                    this.searchData
                )
                .then(res => {
                    this.loading = false;
                    that.listData = res.data;
                    that.dataCount = res.total;
                });
        },
        add() {
            this.sign = "add";
            this.$router.push({
                path: "/oa/schedule/time/template/edit",
                query: {
                    sign: "add"
                }
            });
        },
        edit(data) {
            this.$router.push({
                path: "/oa/schedule/time/template/edit",
                query: {
                    sign: "edit",
                    id: data.scheduleId
                }
            });
        },
        see(data) {
            let seeData = {
                scheduleId: data.scheduleId
            };
            axios
                .fetch(
                    "attendanceServer",
                    "/work/workschedule/queryById",
                    seeData
                )
                .then(res => {
                    this.schedule = res.data.schedule;
                    this.details = res.data.details;
                    this.seeHandle();
                });
            this.dialogShiftVisible = true;
        },
        seeHandle() {
            let EndDate = this.getEndDate();
            let startDate = this.schedule.startDate.split(" ")[0];
            this.dateRange = [startDate, EndDate];
            this.getAllDate(this.dateRange);

            for (let i = 0; i < this.details.length; i++) {
                let index = this.details[i].workIndex + this.startWeek - 1;
                this.shiftData[index].timeId = this.details[i].timeId;
                this.shiftData[index].hint = this.details[i].hint;
                this.shiftData[index].classes = this.details[i].timeName;
                let time = "";
                let endDays = this.details[i].endDays == 1 ? "(次日)" : "";
                time =
                    this.details[i].startTime +
                    "-" +
                    this.details[i].endTime +
                    endDays;
                if (time == "null-null") {
                    time = "";
                }
                this.shiftData[index].time = time;
            }
            //7个封装成一个
            if (this.shiftData.length > 7 && this.shiftData.length <= 14) {
                this.shiftData1 = this.shiftData.slice(0, 7);
                this.shiftData2 = this.shiftData.slice(7, 14);
            } else if (this.shiftData.length > 14) {
                this.shiftData1 = this.shiftData.slice(0, 7);
                this.shiftData2 = this.shiftData.slice(7, 14);
                this.shiftData3 = this.shiftData.slice(14, 21);
            } else {
                this.shiftData1 = this.shiftData;
            }
        },
        getEndDate() {
            let day = this.schedule.durationDays;
            let newTime = Date.parse(this.schedule.startDate);
            let newTimes = newTime + 3600000 * 24 * (day - 1);
            let newDate =
                new Date(newTimes).getFullYear() +
                "-" +
                (new Date(newTimes).getMonth() + 1) +
                "-" +
                new Date(newTimes).getDate();

            return newDate;
        },
        getAllDate(dateRange) {
            //起始置空
            this.shiftDays = [];
            this.shiftData = [];
            this.shiftData1 = [];
            this.shiftData2 = [];
            this.shiftData3 = [];

            //根据时间范围拿到所有日期
            let begin = this.dateRange[0];
            let end = this.dateRange[1];
            Date.prototype.format = function() {
                var s = "";
                var mouth =
                    this.getMonth() + 1 >= 10
                        ? this.getMonth() + 1
                        : "0" + (this.getMonth() + 1);
                var day =
                    this.getDate() >= 10
                        ? this.getDate()
                        : "0" + this.getDate();
                s += this.getFullYear() + "-";
                s += mouth + "-";
                s += day;
                return s;
            };
            var arr = [];
            var ab = begin.split("-");
            var ae = end.split("-");
            var db = new Date();
            db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
            var de = new Date();
            de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
            var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
            var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
            for (var k = unixDb; k <= unixDe; ) {
                k = k + 24 * 60 * 60 * 1000;
                arr.push(new Date(parseInt(k)).format());
            }

            //根据所有日期组装成对应的对象数组
            let weekArray = new Array(
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六"
            );
            arr.map((item, index) => {
                let week = weekArray[new Date(item).getDay()];
                let shiftOne = {
                    timeId: 0,
                    hint: "",
                    classes: "",
                    time: "",
                    clickSchedule: "点击排班"
                };
                this.shiftDays.push(week);
                this.shiftData.push(shiftOne);
            });

            let startWeek = "";
            let endWeek = "";
            switch (this.shiftDays[0]) {
                case "星期一":
                    startWeek = 0;
                    break;
                case "星期二":
                    startWeek = 1;
                    break;
                case "星期三":
                    startWeek = 2;
                    break;
                case "星期四":
                    startWeek = 3;
                    break;
                case "星期五":
                    startWeek = 4;
                    break;
                case "星期六":
                    startWeek = 5;
                    break;
                case "星期日":
                    startWeek = 6;
                    break;
            }
            switch (this.shiftDays[this.shiftDays.length - 1]) {
                case "星期一":
                    endWeek = 6;
                    break;
                case "星期二":
                    endWeek = 5;
                    break;
                case "星期三":
                    endWeek = 4;
                    break;
                case "星期四":
                    endWeek = 3;
                    break;
                case "星期五":
                    endWeek = 2;
                    break;
                case "星期六":
                    endWeek = 1;
                    break;
                case "星期日":
                    endWeek = 0;
                    break;
            }

            for (let i = 0; i < startWeek; i++) {
                let shiftOne = {
                    timeId: "",
                    hint: "",
                    classes: "",
                    time: "",
                    clickSchedule: "点击排班"
                };
                this.shiftData.unshift(shiftOne);
            }
            for (let i = 0; i < endWeek; i++) {
                let shiftOne = {
                    timeId: "",
                    hint: "",
                    classes: "",
                    time: "",
                    clickSchedule: "点击排班"
                };
                this.shiftData.push(shiftOne);
            }
            this.startWeek = startWeek;
        },
        start(data) {
            this.$confirm("确定启用该排班模板吗？", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "blue-confirm"
                //		          center: true
            })
                .then(() => {
                    let startData = {
                        scheduleId: data.scheduleId,
                        status: 1
                    };
                    axios
                        .fetch(
                            "attendanceServer",
                            "/work/workschedule/setStatus",
                            startData
                        )
                        .then(res => {
                            this.$message({
                                type: "success",
                                message: "启用成功!"
                            });
                            this.fetchData();
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消启用"
                    });
                });
        },
        blockUp(data) {
            this.$confirm("确定停用该排班模板吗？", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "red-confirm"
                //		          center: true
            })
                .then(() => {
                    let blockUpData = {
                        scheduleId: data.scheduleId,
                        status: 0
                    };
                    axios
                        .fetch(
                            "attendanceServer",
                            "/work/workschedule/setStatus",
                            blockUpData
                        )
                        .then(res => {
                            this.$message({
                                type: "success",
                                message: "停用成功!"
                            });
                            this.fetchData();
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消停用"
                    });
                });
        }
    },
    filters: {
        endDaysFilter(value) {
            if (value == 0) {
                return "";
            } else if (value == 1) {
                return "(次日)";
            }
            return "";
        },
        statusFilter(value) {
            if (value == 0) {
                return "停用";
            } else if (value == 1) {
                return "启用";
            }
            return "";
        }
    }
};
</script>
<style scoped>
#userList .el-pagination {
    margin-top: 20px;
    float: right;
    position: relative;
    right: 130px;
}

#userList .el-pagination__editor.el-input {
    width: 50px;
}

#staffTableStyle {
    background: transparent;
    width: 95%;
    transform: translateX(-50%);
    position: relative;
    left: 50%;
}
.checkBtn {
    color: #fff;
    border-color: #fff;
    background-color: #4687e1;
}
.searchBtn {
    color: #333;
    border: none;
    background-color: #fff;
}
.ifVisible {
    visibility: hidden;
}
.colorItem {
    display: inline-block;
    position: relative;
    border-radius: 4px;
    height: 30px;
    width: 30px;
    margin: 10px 10px 0 0;
    cursor: pointer;
}
.haventChecked {
    width: 30%;
}
.haventChecked img {
    position: relative;
    top: -7px;
    left: 1px;
    width: 150%;
}
.time-name-style {
    display: inline-block;
    margin-right: 5px;
    position: relative;
    top: 2px;
    width: 6px;
    height: 12px;
}
</style>

<style>
.time-quantum .el-input,
.time-quantum .el-input__inner {
    width: 380px !important;
}
.time-quantum .el-checkbox__label {
    padding-left: 0;
}
#form .shift-name .el-input,
#form .shift-name .el-input__inner {
    width: 180px;
}
#form .selectTwo .el-input,
#form .selectTwo .el-input__inner {
    width: 180px;
}
.el-message-box__message {
    margin-bottom: 30px;
}
.haventChecked {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20%;
    cursor: pointer;
}

.time-name {
    display: inline-block;
    text-align: left;
}
.time-name-hint {
    display: inline-block;
    margin-right: 5px;
    position: relative;
    top: 2px;
    width: 10px;
    height: 14px;
}
.time-style {
    font-size: 12px;
    font-weight: 400;
    color: #999;
}
.rest-style {
    font-size: 16px;
    color: #009fd7;
}
.rest-style span {
    display: inline-block;
    height: 10px;
    width: 10px;
    margin-right: 5px;
    border-radius: 50%;
    background: #009fd7;
}
.viewTable {
    border: 1px solid #dcdfe6;
}
.viewTable td {
    padding: 10px 0;
}
.viewTable tr:first-child {
    background: #f3f3f3;
    color: #555555;
    font-size: 16px;
    font-weight: 600;
}
.viewTable td p {
    text-align: center;
}
.viewTable td p:first-child {
    margin-bottom: 5px;
}
</style>