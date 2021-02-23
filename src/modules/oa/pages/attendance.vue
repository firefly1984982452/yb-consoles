<template>
    <div>
        <el-form ref="searchData" :model="searchData" label-width="45px" :inline="true" class="search">
            <el-form-item label="部门">
                <el-select clearable v-model="searchData.deptId" placeholder="请选择">
                    <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="searchData.employeeName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="日期">
                <el-date-picker v-model="dateRange" type="daterange" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" clearable></el-date-picker>
            </el-form-item>
            <el-button type="primary" @click="fetchData()" icon="el-icon-search">查询</el-button>
            <el-button @click="reset()" icon="el-icon-refresh-right">重置</el-button>
        </el-form>
        <div class="content">
            <el-table :data="listData" border class="ub-table">
                <el-table-column label="部门" prop="deptName" min-width="60"></el-table-column>
                <!-- <el-table-column label="工号" prop="employeeId" min-width="60"></el-table-column> -->
                <el-table-column label="姓名" prop="employeeName" min-width="50"></el-table-column>
                <el-table-column label="日期" min-width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.workDate | timeDateFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="上班时间" prop="startTime" min-width="150"></el-table-column>
                <el-table-column label="上班打卡" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.onTime}}</span>
                        <span class="reissue-tag-style" v-if="scope.row.startAdded == 1">补卡</span>
                        <span class="late-leave-style" v-if="scope.row.lateMinute">迟到</span>
                    </template>
                </el-table-column>
                <el-table-column label="下班时间" prop="endTime" min-width="150"></el-table-column>
                <el-table-column label="下班打卡" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.offTime}}</span>
                        <span class="reissue-tag-style" v-if="scope.row.endAdded == 1">补卡</span>
                        <span class="late-leave-style" v-if="scope.row.leaveMinute">早退</span>
                    </template>
                </el-table-column>
                <el-table-column label="工作小时" prop="workHours" min-width="100"></el-table-column>
                <el-table-column label="备注" prop="remark" min-width="100"></el-table-column>
                <el-table-column label="操作" min-width="80">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="reissueACard(scope.row)">补卡</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>

        <el-dialog title="补卡" :visible.sync="dialogReissueVisible" width="500px">
            <el-row>
                <el-col>
                    <el-form label-width="9em" :model="reissueCard">
                        <el-row :gutter="20">
                            <el-col :span="20">
                                <el-form-item label="补卡班次">
                                    <el-radio-group v-model="cardShift">
                                        <el-radio v-for="(p,index) in point1" :label="p" :key="index">{{p}}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-if="cardShift=='上班'">
                            <el-col :span="16">
                                <el-form-item label="应出勤时间">
                                    {{startTime}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-if="cardShift=='下班'">
                            <el-col :span="16">
                                <el-form-item label="应出勤时间">
                                    {{endTime}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <!--{{reissueRealTime}}-->
                                <el-form-item label="实际打卡时间" v-if="cardShift=='上班'">
                                    <el-time-picker v-model="reissueRealTime" value-format="HH:mm:ss" placeholder="请选择打卡时间"></el-time-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <!--{{reissueRealTime}}-->
                                <el-form-item label="实际打卡时间" v-if="cardShift=='下班'">
                                    <el-time-picker v-model="reissueRealTimeEnd" value-format="HH:mm:ss" placeholder="请选择打卡时间"></el-time-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="16">
                                <el-form-item label="备注">
                                    <el-input type="textarea" v-model="form.remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0">
                            <el-form-item label="">
                                <el-col class :span="7">
                                    <el-button type="primary" @click="submitForm()">确定</el-button>
                                </el-col>
                                <el-col class :span="7">
                                    <el-button @click="dialogReissueVisible = false">取消</el-button>
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
            listData: [],
            dataCount: 0,
            startDataTime: "",
            endDataTime: "",
            loading: true,
            cardShift: "",
            expectedTimeStart: "",
            expectedTimeEnd: "",
            reissueRealTime: "",
            startTime: "",
            endTime: "",
            dateRange: [],
            deptList: [],
            dialogReissueVisible: false,
            point1: ["上班", "下班"],
            reissueRealTimeEnd: "",
            searchData: {
                pageIndex: 1,
                pageSize: 10,
                deptId: "",
                deptName: "",
                employeeName: "",
                timeId: "",
                startWorkDate: "",
                endWorkDate: ""
            },
            form: {
                attendanceId: "",
                startAdded: "",
                endAdded: "",
                onTime: "",
                offTime: "",
                remark: ""
            }
        };
    },
    computed: {},
    created() {
        axios.fetch("oaServer", "/org/dept/list", {}).then(res => {
            this.deptList = res.data;
        });
        this.fetchData();
    },
    methods: {
        reissueACard(data) {
            var start = "";
            var end = "";
            this.cardShift = "上班";
            this.form = { remark: "" };
            this.form.attendanceId = data.attendanceId;
            this.form.remark = data.remark;
            this.startTime = data.startTime;
            this.endTime = data.endTime;
            if (data.startTime) {
                start = data.startTime.substr(0, 11);
                this.reissueRealTime = data.startTime.substr(11, 8);
                this.startDataTime = start;
            }
            this.expectedTimeStart = data.startTime;
            if (data.endTime) {
                end = data.endTime.substr(0, 11);
                this.reissueRealTimeEnd = data.endTime.substr(11, 8);
                this.endDataTime = end;
            }
            this.expectedTimeStart = data.endTime;
            this.dialogReissueVisible = true;
        },
        search() {
            this.changePage(1);
        },
        changePage(value) {
            this.searchData.pageIndex = value;
            this.fetchData();
        },
        fetchData() {
            if (this.dateRange.length > 0) {
                this.searchData.startWorkDate = this.dateRange[0];
                this.searchData.endWorkDate = this.dateRange[1];
            }
            axios
                .fetch(
                    "attendanceServer",
                    "/work/workattendance/queryRecord",
                    this.searchData
                )
                .then(res => {
                    this.listData = res.data;
                    this.dataCount = res.total;
                });
        },
        reset() {
            this.loading = true;
            this.searchData.deptId = "";
            this.searchData.deptName = "";
            this.searchData.employeeName = "";
            this.searchData.timeId = "";
            this.searchData.startWorkDate = "";
            this.searchData.endWorkDate = "";
            this.dateRange = [];
            this.fetchData();
        },
        submitForm() {
            if (
                this.cardShift == "上班" &&
                this.startDataTime + this.reissueRealTime > this.endTime
            ) {
                this.$message.error("实际上班时间应早于下班时间!");
                return;
            } else if (
                this.cardShift == "下班" &&
                this.endDataTime + this.reissueRealTimeEnd < this.startTime
            ) {
                this.$message.error("实际下班时间应晚于上班时间!");
                return;
            }
            if (this.cardShift == "上班") {
                this.form.startAdded = 1;
                this.form.onTime = this.startDataTime + this.reissueRealTime;
            } else if (this.cardShift == "下班") {
                this.form.endAdded = 1;
                this.form.offTime = this.endDataTime + this.reissueRealTimeEnd;
            }
            axios
                .fetch(
                    "attendanceServer",
                    "/work/workattendance/addCheck",
                    this.form
                )
                .then(res => {
                    this.$message({
                        message: "补卡成功",
                        type: "success"
                    });
                    this.fetchData();
                    this.dialogReissueVisible = false;
                });
        }
    },
    filters: {
        timeDateFilter: val => {
            val = val.substr(0, 11);
            return val;
        }
    }
};
</script>

<style scoped>
.reissue-tag-style {
  color: blue;
}
.late-leave-style {
  color: red;
}
</style>