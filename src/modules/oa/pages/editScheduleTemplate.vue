<template>
    <div>
        <div class="content">
            <el-row>
                <el-col>
                    <el-form label-width="6em" v-model="form">
                        <el-row :gutter="20">
                            <el-col style="width:458px;">
                                <el-form-item label="日期" prop="dateRange">
                                    <el-date-picker v-model="dateRange" :picker-options="pickerOptions" type="daterange" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getAllDate" :disabled="sign=='edit'"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col style="width:470px;">
                                <el-row>
                                    <el-form-item label="部门岗位" class="selectTwo">
                                        <el-col :span="12">
                                            <el-select v-model="form.deptId" placeholder="请选择" @change="chooseDepart" :disabled="sign=='edit'" clearable>
                                                <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value" :disabled="sign=='edit'"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-select v-model="form.jobId" placeholder="请选择" @change="chooseJob" :disabled="sign=='edit'" clearable>
                                                <el-option v-for="item in jobList" :key="item.jobId" :label="item.jobName" :value="item.jobId"></el-option>
                                            </el-select>
                                        </el-col>
                                    </el-form-item>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-if="shiftTypes.length>0 || shiftDays.length>0">
                            <el-col class="table-medial" style="width:100%;">
                                <el-row>
                                    <el-form-item label="班次" class="selectTwo" v-if="shiftTypes.length>0 && sign=='add'">
                                        <el-radio-group v-model="shift" :disabled="sign=='edit'">
                                            <el-radio v-for="item in shiftTypes" :label="item.name" :key="item.timeId">{{item.name}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <table cellspacing="0" border="1" style="width:90%;margin:0 0 1.5em 5.5em;border:1px solid #DCDFE6" v-if="shiftDays.length>0">
                                        <tr>
                                            <td v-for="(item,index1) in shiftDays" :key="index1">
                                                <p>{{item.day}}</p>
                                                <p>{{item.week}}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-for="(item,index2) in shiftData" :key="index2">
                                                <div :style="{marginTop:(item.classes!=''&&item.classes!=null&&sign=='edit')?15+'px':0}">
                                                    <p style="text-align:right;margin-bottom:0;" v-if="item.classes!=''&&item.classes!=null&&sign!='edit'"><i @click="resetOne(index2)" style="font-size: 12px;margin-left:10px;color:#999999;cursor:pointer;" class="iconfont iconjichutubiao-yuanxingguanbianniu"></i></p>
                                                    <p class="shift-tag-td" v-if="item.classes!=''&&item.classes!=null">
                                                        <span :style="{background:item.hint}"></span>
                                                        {{item.classes}}
                                                    </p>
                                                    <p class="time-style" v-if="item.time!=''">{{item.time}}</p>
                                                    <p class="click-form-style" style="margin:25px 0;" v-if="item.classes==''||item.classes==null" @click="clickform(index2)">{{item.clickform}}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col>
                                <el-form-item label="适用人员">
                                    <el-row :gutter="0">
                                        <el-col :xl="3" :lg="4" style="width: 8em">
                                            <el-button class="addIllBtn" @click="addPerson()"><i id="addIll" class="iconfont iconjichutubiao-tianjia-huise"></i>添加人员</el-button>
                                        </el-col>
                                        <el-col :xl="3" :lg="4" style="width: 8em;">
                                            <el-button class="clearIllBtn" type @click="clearAll" v-if="employees.length>0"><i id="clearIll" class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i>清空全部</el-button>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="0" style="margin-top:10px;">
                                        <span class="ill" v-for="(item,index) in employees" :key="item.employeeId" :v-if="item != ''">{{item.employeeName}}<i @click="clearOne(index)" style="font-size:12px;margin-left:10px;color:#999999;cursor:pointer;" class="iconfont iconjichutubiao-yuanxingguanbianniu"></i></span>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin:20px 0px 50px 0;" :gutter="0">
                            <el-form-item label="">
                                <el-col style="width:7em;margin-right:20px;">
                                    <el-button v-bind:style="{'background':firstZhuTi,'color':'#fff'}" type="primary" @click="saveTemp()">保存</el-button>
                                </el-col>
                                <el-col style="width:7em;">
                                    <el-button @click="back()">取消</el-button>
                                </el-col>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>

        <el-dialog title="选择适用人员" :visible.sync="addDialog" width="580px" center id="personDialog">
            <div style="text-align:center;font-size:14px;color:#999999;margin-bottom:20px;">{{form.deptName}} | {{form.jobName}}</div>
            <el-form label-width="">
                <el-form-item label="">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" v-if="allEmployees.length>0">全选</el-checkbox>
                    <el-checkbox-group v-model="employeesInterim" @change="handleCheckedChange">
                        <!-- <el-checkbox v-for="employee in allEmployees" :label="employee.employeeName" :key="employee.employeeId" :disabled="employee.isAttended==1?true:false">{{employee.employeeName}}</el-checkbox> -->
                        <el-checkbox v-for="employee in allEmployees" :label="employee.employeeName" :key="employee.employeeId">{{employee.employeeName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="">
                    <div style="text-align:center;">
                        <el-button type="primary" @click="savePeople" style="width:8em;background-color:#3F51B5;border-color:#3F51B5;">确定</el-button>
                        <el-button @click="closePerson" style="width:8em;">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
Array.prototype.remove = function(b) {
    var a = this.indexOf(b);
    if (a >= 0) {
        this.splice(a, 1);
        return true;
    }
    return false;
};
export default {
    data() {
        return {
            loading: true,
            value: "",
            shift: "",
            sign: "",
            dateRange: [],
            checkAll: false,
            addDialog: false,
            isIndeterminate: false,
            deptList: [],
            jobList: [],
            jobs: [],
            shiftDays: [],
            shiftData: [],
            details: [],
            employeesInterim: [],
            allEmployeeInterim: [],
            employees: [],
            allEmployees: [],
            form: {
                deptId: "",
                deptName: "",
                jobId: "",
                jobName: "",
                startDate: "",
                durationDays: "",
                status: 1
            },
            shiftTypes: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                }
            }
        };
    },
    created() {
        this.sign = this.$route.query.sign;
        axios.fetch("oaServer", "/org/dept/list", {}).then(res => {
            this.deptList = res.data.map(v => {
                return {
                    label: v.deptName,
                    value: v.deptId
                };
            });
        });
        axios.fetch("oaServer", "/org/job/list", {}).then(res => {
            this.jobs = res.data;
            this.jobList = res.data;
        });
        this.init();
    },
    mounted() {},
    watch: {
        checkAll(newValue, oldValue) {
            if(newValue){
                this.employeesInterim=[];
                this.allEmployees.forEach(item=>{
                    this.employeesInterim.push(item.employeeName)
                })
            }
        }
    },
    computed: {},
    methods: {
        init() {
            if (this.sign == "edit") {
                let data = { scheduleId: this.$route.query.id };
                axios
                    .fetch(
                        "attendanceServer",
                        "/work/workschedule/queryById",
                        data
                    )
                    .then(res => {
                        this.form = res.data.schedule;
                        this.details = res.data.details;
                        this.employees = res.data.employees;
                        //处理时间
                        let EndDate = this.getEndDate();
                        let startDate = this.form.startDate.split(" ")[0];
                        this.dateRange = [startDate, EndDate];
                        this.getAllDate(this.dateRange);

                        this.details.map((item, index) => {
                            this.shiftData[item.workIndex - 1].timeId =
                                item.timeId;
                            this.shiftData[item.workIndex - 1].hint = item.hint;
                            this.shiftData[item.workIndex - 1].classes =
                                item.timeName;
                            let time = "";
                            time = item.startTime + "-" + item.endTime;
                            if (time == "null-null") {
                                time = "";
                            }
                            this.shiftData[item.workIndex - 1].time = time;
                        });
                        //this.chooseDepart(this.form.deptId);
                        //this.chooseJob(this.form.jobId);
                        this.initByJobId();
                    });
            }
        },
        chooseDepart(deptId) {
            this.shiftTypes = [];
            if (this.dateRange.length > 0) {
                this.getAllDate();
            }

            for (let i = 0; i < this.deptList.length; i++) {
                if (this.deptList[i].value == deptId) {
                    this.form.deptId = this.deptList[i].value;
                    this.form.deptName = this.deptList[i].label;
                }
            }
            this.jobList = this.jobs.filter(item => {
                return item.deptId == deptId;
            });
            this.form.jobId = "";
            this.employees = [];
        },
        chooseJob() {
            let jobId = this.form.jobId;
            this.shiftTypes = [];
            if (this.dateRange.length > 0) {
                this.getAllDate();
            }
            if (jobId != null) {
                this.form.jobName = this.jobList.filter(
                    v => v.jobId == this.form.jobId
                )[0].jobName;
                this.initByJobId();
            }
            this.employees = [];
        },
        clickform(index) {
            if (this.shift != "") {
                this.shiftData[index].classes = this.shift.split("(")[0];
                this.shiftData[index].time = this.shift
                    .split("(")[1]
                    .split(")")[0];
            }
            for (let i = 0; i < this.shiftTypes.length; i++) {
                if (this.shiftTypes[i].name == this.shift) {
                    this.shiftData[index].timeId = this.shiftTypes[i].timeId;
                    this.shiftData[index].hint = this.shiftTypes[i].hint;
                }
            }
        },
        savePeople() {
            if (this.sing == "add") {
                this.employees = [];
            }
            this.allEmployees.map((items, indexs) => {
                this.employeesInterim.map((item, index) => {
                    if (items.employeeName == item) {
                        let employee = {
                            employeeId: items.employeeId,
                            employeeName: items.employeeName
                        };
                        var have = false;
                        for (var i in this.employees) {
                            if (
                                this.employees[i].employeeId ==
                                employee.employeeId
                            ) {
                                have = true;
                                break;
                            }
                        }
                        if (!have) {
                            this.employees.push(employee);
                        }
                    }
                });
            });

            this.addDialog = false;
        },
        clearAll() {
            this.employees = [];
            this.employeesInterim = [];
        },
        // addPerson() {
        //     this.cancelHandle = [].concat(this.employeesInterim);
        //     if (
        //         this.allEmployeeInterim.length === this.employeesInterim.length
        //     ) {
        //         this.checkAll = true;
        //     } else if (
        //         this.allEmployeeInterim.length > this.employeesInterim.length &&
        //         this.employeesInterim.length > 0
        //     ) {
        //         this.isIndeterminate = true;
        //     } else if (this.employeesInterim.length == 0) {
        //         this.checkAll = false;
        //     }
        //     let employeesInterim = [];
        //     if (this.sign != "edit") {
        //         this.employees.map((item, index) => {
        //             employeesInterim.push(item.employeeName);
        //         });
        //         this.employeesInterim = employeesInterim;
        //     }
        //     this.addDialog = true;
        // },
        addPerson(){
            // employeesInterim ->选中的人员姓名数组
            this.employeesInterim = [];
            // employees -> 将页面中适用人员的数组回显到弹框中
            if( this.employees.length > 0 ){
                this.employees.forEach( item => {
                    this.employeesInterim.push(item.employeeName)
                })
            }
            const selectedLength = this.employeesInterim.length; // 选中人员的数组长度
            const totalLength = this.allEmployees.length; // 所有人员的数组长度
            if( totalLength > 0 ){
                if( selectedLength > 0 ){
                    if( totalLength > selectedLength ){
                        this.isIndeterminate = true;
                        this.checkAll = false;
                    } else if( totalLength === selectedLength ){
                        this.isIndeterminate = false;
                        this.checkAll = true;
                    }
                } else {
                    this.isIndeterminate = false;
                    this.checkAll = false;
                }
            }
            this.addDialog = true;
            
        },
        closePerson() {
            this.addDialog = false;
            this.employeesInterim = [].concat(this.cancelHandle);
            if (this.employeesInterim.length == 0) {
                this.isIndeterminate = false;
            }
        },
        clearOne(index) {
            // debugger;
            let employeeName = this.employees[index].employeeName;
            this.employees.splice(index, 1);
            this.employeesInterim.remove(employeeName);
        },
        resetOne(index) {
            let shiftOne = {
                timeId: 0,
                hint: "",
                classes: "",
                time: "",
                clickform: "点击排班"
            };
            for (let key in shiftOne) {
                this.shiftData[index][key] = shiftOne[key];
            }
        },
        handleCheckAllChange(val) {
            this.cancelHandle = [].concat(this.employeesInterim);
            this.employeesInterim = val ? this.allEmployeeInterim : [];
            this.isIndeterminate = false;
        },
        handleCheckedChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.allEmployees.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.allEmployees.length;
        },
        initByJobId() {
            let data = {
                jobId: this.form.jobId
            };
            //岗位查询班次
            axios
                .fetch("attendanceServer", "/work/worktime/queryByJob", data)
                .then(res => {
                    this.shiftTypes = [];
                    res.data.map((item, index) => {
                        let endDays = item.endDays == 1 ? "(次日)" : "";
                        let shiftType = {
                            hint: item.hint,
                            name:
                                item.timeName +
                                "(" +
                                item.startTime +
                                "-" +
                                item.endTime +
                                endDays +
                                ")",
                            timeId: item.timeId
                        };
                        this.shiftTypes.push(shiftType);
                    });
                });
            //岗位查询人员
            axios
                .fetch("attendanceServer", "/org/job/queryEmployeeByJob", data)
                .then(res => {
                    this.allEmployees = res.data;
                    this.getAllEmployeeInterim();
                });
        },
        getAllEmployeeInterim() {
            //所有的人员
            let allEmployeeInterim = [];
            this.allEmployees.map((item, index) => {
                if (item.isAttended === 0) {
                    allEmployeeInterim.push(item.employeeName);
                }
            });
            this.allEmployeeInterim = [].concat(allEmployeeInterim);
        },
        assembleData() {
            this.form.startDate = this.dateRange[0] + " 00:00:00";
            this.form.durationDays = this.DateDiff(
                this.dateRange[0].split(" ")[0],
                this.dateRange[1].split(" ")[0]
            );
            let indexTag = 1;
            this.shiftData.map((item, index) => {
                let detail = {
                    workIndex: indexTag++,
                    timeId: item.timeId
                };
                this.details.push(detail);
            });
        },
        saveTemp() {
            // debugger;
            if (this.sign == "add") {
                if (this.dateRange.length < 1 || this.dateRange == undefined) {
                    this.$message.error("请选择日期");
                    return;
                } else {
                    let begin = this.dateRange[0];
                    let end = this.dateRange[1];
                    let duration = this.DateDiff(begin, end);
                    if (duration > 14) {
                        this.$message.error("模板周期不能超过14天");
                        return;
                    }
                }

                let message = "";
                this.shiftData.map((item, index) => {
                    if (item.classes != "") {
                        message = "正常";
                    }
                });
                if (message != "正常") {
                    this.$message.error("请进行点击排班");
                    return;
                }
                if (this.form.deptId == "" || this.form.deptId == undefined) {
                    this.$message.error("请选择部门");
                    return;
                } else if (
                    this.form.jobId == "" ||
                    this.form.jobId == undefined
                ) {
                    this.$message.error("请选择岗位");
                    return;
                } else if (this.employees.length < 1) {
                    this.$message.error("请添加适用人员");
                    return;
                }
                this.assembleData();
                let data = {
                    schedule: this.form,
                    details: this.details,
                    employees: this.employees
                };
                axios
                    .fetch(
                        "attendanceServer",
                        "/work/workschedule/insert",
                        data,
                        "json"
                    )
                    .then(res => {
                        this.$message({
                            message: "保存成功",
                            type: "success"
                        });
                        this.$router.push("/oa/schedule/time/template");
                    });
            } else if (this.sign == "edit") {
                if (this.employees.length < 1) {
                    this.$message.error("请添加适用人员");
                    return;
                }
                let editData = [];
                this.employees.map((item, index) => {
                    let employee = {
                        scheduleId: this.form.scheduleId,
                        employeeId: item.employeeId,
                        employeeName: item.employeeName
                    };
                    editData.push(employee);
                });
                axios
                    .fetch(
                        "attendanceServer",
                        "/work/workschedule/update",
                        editData,
                        "json"
                    )
                    .then(res => {
                        this.$message({
                            message: "保存成功",
                            type: "success"
                        });
                        this.$router.push("/oa/schedule/time/template");
                    });
            }
        },
        getEndDate() {
            let day = this.form.durationDays;
            let newTime = Date.parse(this.form.startDate);
            let newTimes = newTime + 3600000 * 24 * (day - 1);
            let newDate =
                new Date(newTimes).getFullYear() +
                "-" +
                (new Date(newTimes).getMonth() + 1) +
                "-" +
                new Date(newTimes).getDate();

            return newDate;
        },
        DateDiff(startDate, endDate) {
            let aDate, oDate1, oDate2, iDays;
            aDate = startDate.split("-");
            oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
            aDate = endDate.split("-");
            oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
            iDays =
                parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) + 1;
            return iDays;
        },
        getAllDate() {
            //起始置空
            this.shiftDays = [];
            this.shiftData = [];
            this.shift = "";

            if (this.dateRange != null) {
                let begin = this.dateRange[0];
                let end = this.dateRange[1];
                let duration = this.DateDiff(begin, end);
                if (duration > 14) {
                    this.$message.error("模板周期不能超过14天");
                    return;
                }
                //根据时间范围拿到所有日期
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
                    let weekOne = {
                        day: item,
                        week: week
                    };
                    let shiftOne = {
                        timeId: 0,
                        hint: "",
                        classes: "",
                        time: "",
                        clickform: "点击排班"
                    };
                    this.shiftDays.push(weekOne);
                    this.shiftData.push(shiftOne);
                });
            }
        },
        back() {
            this.$router.push("/oa/schedule/time/template");
        }
    }
};
</script>
<style scoped>
.roomFloorList {
    width: 95% !important;
    padding-top: 0 !important;
}
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
}
.shift-tag-td span {
    width: 6px;
    height: 12px;
    display: inline-block;
    margin-right: 5px;
}
.shift-tag-td {
    font-size: 15px;
    font-weight: bold;
}
.time-style {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
}
table tr:first-child {
    background: #f8f8f8;
    color: #333333;
    font-size: 16px;
    font-weight: 400;
}
table tr:nth-child(2) p {
    margin-bottom: 10px;
}
table tr:first-child td {
    padding: 8px 0;
}
table td p {
    text-align: center;
}
.click-form-style {
    color: #999999;
    font-size: 14px;
}
/deep/ .el-dialog__header {
    padding-bottom: 0;
}
/deep/ .el-dialog__body {
    padding-top: 0;
    max-height: 450px;
    overflow: scroll;
}
</style>
<style>
.ill {
    margin-right: 20px;
}
#addTemp .selectTwo .el-input,
#addTemp .selectTwo .el-input__inner {
    width: 170px;
}
#personDialog .el-checkbox {
    width: 20%;
    margin-right: 0;
}
</style>