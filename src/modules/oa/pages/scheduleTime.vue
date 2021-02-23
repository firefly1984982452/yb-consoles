<template>
    <div>
        <div class="content">
            <el-row type="flex" class="pannel">
                <el-col :span="20" class="left">
                    <el-button :type="1==isActive?'primary':''" @click="isActive=1;$router.push('/oa/schedule/time')">班次设置</el-button>
                    <el-button :type="2==isActive?'primary':''" @click="isActive=2;$router.push('time/template')">排班模板</el-button>
                </el-col>
                <el-col :span="4" class="right">
                    <el-button type="success" @click="add('添加班次')" icon="el-icon-plus">添加班次</el-button>
                </el-col>
            </el-row>
            <el-table :data="listData" border class="ub-table" :span-method="cellMerge">
                <el-table-column label="部门" prop="deptName" min-width="60"></el-table-column>
                <el-table-column label="岗位" prop="jobName" min-width="60"></el-table-column>
                <el-table-column label="班次名称" min-width="100">
                    <template slot-scope="scope" class="shift">
                        <span class="time-name">
                            <span class="time-name-hint" :style="{background: scope.row.hint}" v-if="scope.row.hint!=''"></span>
                            <span @click="see(scope.row)">{{scope.row.timeName | nothingFilter}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="时间段" min-width="80">
                    <template slot-scope="scope">
                        <span @click="see(scope.row)">{{scope.row.startTime | nothingFilter}}----{{scope.row.endTime | nothingFilter}}{{scope.row.endDays | endDaysFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="50" prop="status" :formatter="statusFormatter"></el-table-column>
                <el-table-column label="操作" min-width="50">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                            <el-button size="mini" @click="edit(scope.row)"><i class="iconfont  iconcaozuotubiao-bianji"></i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="启用" placement="top-end" v-if="scope.row.status==0" hide-after="1000">>
                            <el-button size="mini" @click="start(scope.row)"><i class="iconfont iconcaozuotubiao-qiyong-zhengchang"></i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="停用" placement="top-end" v-else hide-after="1000">
                            <el-button size="mini" @click="stop(scope.row)"><i class="iconfont iconcaozuotubiao-tingyong-xuanfu"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>

        <el-dialog :title="dialogFormTitle" :visible.sync="dialogAddVisible" :close-on-click-modal="false" width="600px">
            <el-row class="warp userList">
                <el-col>
                    <el-form label-width="90px" :model="form">
                        <el-row :gutter="20" v-for="(item,index) in specificEmployees" :key="index">
                            <el-col :span="24">
                                <el-form-item :label="item.label" class="selectTwo">
                                    <el-col :span="10" :class="{'ifVisible':(item.deptName=='' && index!=0)}" style="padding-left:0;">
                                        <el-select v-model="item.deptId" placeholder="请选择" clearable @change="chooseDepart">
                                            <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="10" style="padding-left:0;">
                                        <el-select v-model="item.jobId" placeholder="请选择" @change="chooseJob(item.jobId,index)">
                                            <el-option v-for="item in jobList" :key="item.jobId" :label="item.jobName" :value="item.jobId" :disabled="item.disabled"></el-option>
                                        </el-select>
                                    </el-col>
                                    <i class="iconfont iconcaozuotubiao-tianjia-zhengchang" @click="addRow(index)" v-if="sign!='edit'"></i>
                                    <i class="iconfont iconcaozuotubiao-shanchuhang-zhengchang" @click="deleteRow(index)" v-if="index!=0&&sign!='edit'"></i>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" class="shift-name">
                                <el-form-item label="班次名称">
                                    <el-input v-model.trim="form.timeName" placeholder="请输入班次名称" maxlength="8" show-word-limit clearable></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="标签颜色">
                                    <div class="colorItem" v-for="(item,index) in colorArray" :key="index" :style="{'background':item.color}" @click="checkedColor(index)">
                                        <div class="haventChecked">
                                            <img src="//image.youbankeji.com/web/dahuaAdmin/bgchecked.png" alt="" v-if="item.checked == 1">
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24" class="time-quantum">
                                <el-form-item label="时间段">
                                    <el-time-picker is-range v-model="dateRange" format="HH:mm" value-format="HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" clearable editable></el-time-picker>
                                    <el-checkbox v-model="endDays" style="margin-left:10px;">次日</el-checkbox>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0">
                            <el-form-item label="" label-width="12em">
                                <el-col class :span="7">
                                    <el-button type="primary" @click="submitForm()">确定</el-button>
                                </el-col>
                                <el-col class :span="7" style="margin-left: 10px;">
                                    <el-button @click="closeWin()">取消</el-button>
                                </el-col>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </el-col>
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
            isActive: 1,
            listData: [],
            dataCount: 0,
            rowSpans: [],
            sign: "",
            dialogFormTitle: "",
            endDays: false,
            jobList: [],
            jobListIds:[],
            deptList: [],
            dialogAddVisible: false,
            dateRange: ["06:00", "15:00"],
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
                startTime: "",
                timeName: "",
                endTime: "",
                endDays: 0,
                hint: "#F26161",
                jobs: []
            },
            count: 0,
            colorArray: [
                {
                    color: "#F26161",
                    checked: 1
                },
                {
                    color: "#79BB11",
                    checked: 0
                },
                {
                    color: "#4A58F3",
                    checked: 0
                },
                {
                    color: "#FEB200",
                    checked: 0
                },
                {
                    color: "#009FD7",
                    checked: 0
                },
                {
                    color: "#D22472",
                    checked: 0
                },
                {
                    color: "#F86C20",
                    checked: 0
                },
                {
                    color: "#0E9E6D",
                    checked: 0
                },
                {
                    color: "#6425F5",
                    checked: 0
                },
                {
                    color: "#0B288D",
                    checked: 0
                }
            ]
        };
    },
    computed: {},
    created() {
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
        });
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
                    "/work/worktime/queryPager",
                    this.searchData
                )
                .then(res => {
                    let resData = res.data;
                    that.listData = resData;
                    that.dataCount = res.total;
                    //部门列合并
                    let pos = 0;
                    this.rowSpans = [];
                    for (var i = 0; i < resData.length; i++) {
                        if (i === 0) {
                            this.rowSpans.push(1);
                        } else {
                            // 判断当前元素与上一个元素是否相同
                            if (
                                resData[i].deptName == resData[i - 1].deptName
                            ) {
                                this.rowSpans[pos] += 1;
                                this.rowSpans.push(0);
                            } else {
                                this.rowSpans.push(1);
                                pos = i;
                            }
                        }
                    }
                });
        },
        cellMerge({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const _row = this.rowSpans[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        closeWin() {
            this.form = {
                deptId: "",
                deptName: "",
                jobId: "",
                jobName: "",
                startTime: "",
                timeName: "",
                endTime: "",
                endDays: 0,
                hint: "#F26161",
                jobs: []
            };
            this.specificEmployees = [
                {
                    label: "员工",
                    deptId: "",
                    deptName: "",
                    jobId: "",
                    jobName: ""
                }
            ];
            this.dateRange = ["06:00", "15:00"];
            this.dialogAddVisible = false;
        },
        chooseDepart(deptId) {
            for (let i = 0; i < this.deptList.length; i++) {
                if (this.deptList[i].value == deptId) {
                    this.form.deptId = this.deptList[i].value;
                    this.form.deptName = this.deptList[i].label;
                }
            }
            this.jobList = this.jobs.filter(item => {
                item.disabled = false;
                return item.deptId == deptId;
            });
            this.jobListIds = this.jobList.map(item=>item.jobId);
            // console.log(this.jobListIds,'===josbListIds');
            if (this.sign == "add") {
                for (var i = this.specificEmployees.length - 1; i >= 0; i--) {
                    this.specificEmployees[i].jobId = "";
                    this.specificEmployees[i].jobName = "";
                    if (this.specificEmployees[i].deptId != deptId) {
                        this.specificEmployees.splice(i, 1);
                    }
                }
            } else {
                console.log(this.count);
                if( this.count === 0 ){
                    this.count++;
                    console.log('第' + this.count + '次');
                } else {
                     for (var i = this.specificEmployees.length - 1; i >= 0; i--) {
                        this.specificEmployees[i].jobId = "";
                        this.specificEmployees[i].jobName = "";
                        if (this.specificEmployees[i].deptId != deptId) {
                            this.specificEmployees.splice(i, 1);
                        }
                    }
                    this.count++;
                }
            }
        },
        chooseJob(jobId, index) {
            // fix bug PC-467 2020-10-29
            console.log(this.specificEmployees);
            let canSelectIds = []; // 还能被选择的岗位
            let specificEmployeesIds = this.specificEmployees.map(item=>item.jobId);
            this.jobListIds.forEach(item=>{
                if(specificEmployeesIds.indexOf(item) < 0){
                    canSelectIds.push(item);
                } else {
                    // 已经被选择的岗位
                    const index = this.jobListIds.indexOf(item);// 该岗位在所有岗位列表中的index
                    const specificEmployeesIndex = specificEmployeesIds.indexOf(item); // 该岗位在已经选中的岗位列表中的index
                    this.jobList[index].disabled = true;
                    this.specificEmployees[specificEmployeesIndex].jobName = this.jobList[index].jobName;
                }
            })
            canSelectIds.forEach(item=>{
                const index = this.jobListIds.indexOf(item);
                this.jobList[index].disabled = false;
            })
            // console.log(canSelectIds,'====canSelectIds');
            // console.log(this.specificEmployees,'====specificEmployees');
        },
        addRow(index) {
            this.specificEmployees.push({
                label: "",
                deptId: "",
                deptName: "",
                jobId: "",
                jobName: ""
            });
        },
        deleteRow(index) {
            let jobId = this.specificEmployees[index].jobId;
            for (let i = 0; i < this.jobList.length; i++) {
                if (this.jobList[i].jobId == jobId) {
                    this.jobList[i].disabled = false;
                }
            }
            this.specificEmployees.splice(index, 1);
        },
        checkedColor(index) {
            for (var i = 0; i < this.colorArray.length; i++) {
                if (i != index) {
                    this.colorArray[i]["checked"] = 0;
                } else {
                    this.colorArray[i]["checked"] = 1;
                    this.form.hint = this.colorArray[i]["color"];
                }
            }
        },

        add(data) {
            this.sign = "add";
            this.form = {
                deptId: "",
                deptName: "",
                jobId: "",
                jobName: "",
                startTime: "",
                timeName: "",
                endTime: "",
                endDays: 0,
                hint: "#F26161",
                jobs: []
            };
            this.specificEmployees = [
                {
                    label: "员工",
                    deptId: "",
                    deptName: "",
                    jobId: "",
                    jobName: ""
                }
            ];
            for (var i = 0; i < this.colorArray.length; i++) {
                if (i != 0) {
                    this.colorArray[i]["checked"] = 0;
                } else {
                    this.colorArray[i]["checked"] = 1;
                    this.form.hint = this.colorArray[i]["color"];
                }
            }
            this.dateRange = ["06:00", "15:00"];
            this.endDays = false;
            this.jobList = [];
            this.dialogFormTitle = "添加班次";
            this.dialogAddVisible = true;
        },
        assembleData() {
            if (!this.form.jobs) {
                this.form.jobs = [];
            }
            for (let i = 0; i < this.specificEmployees.length; i++) {
                let job = {
                    jobId: this.specificEmployees[i].jobId,
                    jobName: this.specificEmployees[i].jobName
                };
                this.form.jobs.push(job);
            }
            this.form.endDays = this.endDays == true ? 1 : 0;
            this.form.startTime = this.dateRange[0];
            this.form.endTime = this.dateRange[1];
            delete this.form.createTime;
            delete this.form.updateTime;
        },
        submitForm() {
            if (this.form.deptId == "" || this.form.deptId == undefined) {
                this.$message.error("请选择部门");
                return;
            } else if (
                this.specificEmployees[0].jobId == "" ||
                this.specificEmployees[0].jobId == undefined
            ) {
                this.$message.error("请选择岗位");
                return;
            } else if (
                this.form.timeName == "" ||
                this.form.timeName == undefined
            ) {
                this.$message.error("请填写班次名称");
                return;
            }
            this.assembleData();
            if (this.sign == "add") {
                let addData = this.form;
                axios
                    .fetch(
                        "attendanceServer",
                        "/work/worktime/insert",
                        addData,
                        "json"
                    )
                    .then(res => {
                        this.loading = false;
                        this.$message({
                            message: "保存成功",
                            type: "success"
                        });
                        this.fetchData();
                        this.dialogAddVisible = false;
                        this.closeWin();
                    });
            } else if (this.sign == "edit") {
                this.form.jobId = this.specificEmployees[0].jobId;
                this.form.jobName = this.specificEmployees[0].jobName;
                axios
                    .fetch(
                        "attendanceServer",
                        "/work/worktime/update",
                        this.form
                    )
                    .then(res => {
                        this.$message({
                            message: "编辑成功",
                            type: "success"
                        });
                        this.fetchData();
                        this.dialogAddVisible = false;
                        this.closeWin();
                    });
            }
        },
        edit(data) {
            this.sign = "edit";
            this.form = data;
            this.dateRange = [data.startTime, data.endTime];
            this.endDays = data.endDays == 1 ? true : false;
            this.colorArray.map((item, index) => {
                if (item.color == data.hint) {
                    item.checked = 1;
                } else {
                    item.checked = 0;
                }
            });
            this.specificEmployees = [
                {
                    label: "员工",
                    deptId: data.deptId,
                    deptName: data.deptName,
                    jobId: data.jobId,
                    jobName: data.jobName
                }
            ];
            this.dialogFormTitle = "编辑班次";
            this.chooseDepart(this.form.deptId);
            this.dialogAddVisible = true;
        },
        start(data) {
            let form = {
                timeId: data.timeId,
                status: 1
            };
            this.$confirm("确定启用该班次吗？", "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "blue-confirm"
            })
                .then(() => {
                    axios
                        .fetch(
                            "attendanceServer",
                            "/work/worktime/update",
                            form
                        )
                        .then(res => {
                            this.loading = false;
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
        stop(data) {
            let form = {
                timeId: data.timeId,
                status: 0
            };
            this.$confirm("确定停用该班次吗？", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "red-confirm"
            })
                .then(() => {
                    axios
                        .fetch(
                            "attendanceServer",
                            "/work/worktime/update",
                            form
                        )
                        .then(res => {
                            this.loading = false;
                            this.$message({
                                type: "success",
                                message: "停用成功!"
                            });
                            this.fetchData();
                        });
                    this.loading = false;
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消停用"
                    });
                });
        },
        statusFormatter(row, column, value, index) {
            if (value == 0) {
                return "停用";
            } else if (value == 1) {
                return "启用";
            }
            return "";
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
    width: 10em;
    text-align: left;
}
.time-name-hint {
    display: inline-block;
    margin-right: 5px;
    position: relative;
    top: 2px;
    width: 6px;
    height: 14px;
}
</style>