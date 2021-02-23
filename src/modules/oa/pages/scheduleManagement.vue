<template>
  <div>
    <el-form :model="searchData" class="search" :inline="true">
      <el-row>
        <el-col :span="24">
          <el-form-item label="姓名" label-width="40px">
            <el-input v-model="searchData.employeeName" placeholder="全部" style="width:100px"></el-input>
          </el-form-item>
          <el-form-item label="排班" label-width="40px">
            <el-select clearable v-model="searchData.deptId" placeholder="部门" @change="chooseDepart(searchData.deptId)">
              <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" label-width="0">
            <el-select clearable v-model="searchData.jobId" placeholder="岗位" @change="chooseJob(searchData.jobId)">
              <el-option v-for="item in jobList" :key="item.jobId" :label="item.jobName" :value="item.jobId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" label-width="0">
            <el-select clearable v-model="searchData.timeId" placeholder="班次">
              <el-option v-for="item in timeOption" :key="item.timeId" :label="item.timeName" :value="item.timeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" label-width="0">
            <el-date-picker v-model="searchData.dateRange" style="width:330px" :picker-options="pickerOptions" type="daterange" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-button @click="search" type="primary" icon="el-icon-search" style="padding: 4px;">查询</el-button>
          <el-button @click="reset" icon="el-icon-refresh-right" style="padding: 4px;">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="right">
          <el-button class="addBtn" style="background: #F36969;" @click="askForLeave()"><i class="iconfont iconjichutubiao-qingjia"></i>请假</el-button>
          <el-button class="addBtn" style="background: #F49B31;" @click="changeShift()"><i class="iconfont iconjichutubiao-huanban"></i>换班</el-button>
        </el-col>
      </el-row>
      <div v-if="shiftListData1.length>0">
        <table cellspacing="0" border="1" class="ub-table">
          <tr>
            <td style="width:10%">
              <p>员工</p>
            </td>
            <td v-for="(item,index) in shiftDays" :key="index" :style="{width:colWidth}">
              <p>{{item.day}}</p>
              <p>{{item.week}}</p>
            </td>
          </tr>
          <tr v-for="(item,indeX) in shiftListData1" :key="indeX">
            <td>
              <p style="font-size:15px;font-weight:bold;">{{item.employeeName}}</p>
              <p class="time-style">{{item.deptName}} | {{item.jobName}}</p>
            </td>
            <td v-for="(value,index) in item.timeContent" :key="index">
              <el-popover v-if="value.attendanceId" placement="right" width="241">
                <div class="popover-content" v-if="visable">
                  <div class="popover-header">
                    <p @click="closeDiv()"><span>{{item.employeeName}}</span><span style="float:right;">X</span></p>
                    <p><span>{{value.workDate}}</span></p>
                  </div>
                  <div class="popover-body">
                    <el-radio-group v-model="shiftType">
                      <el-radio v-for="(p,index) in shiftTypes" :label="p.timeName" :key="index" :disabled="(p.timeName.includes(value.timeName)&&value.status!=1&&value.status!=3&&(value.status!=2&&value.timeId!=0))||(p.status==3&&value.status==3)||(p.status==3&&value.status==2&&value.timeId==0)">{{p.timeName}}</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="popover-footer">
                    <el-button type="warning" @click="adjust(value.attendanceId)">调整</el-button>
                  </div>
                </div>
                <div slot="reference" @click='showDiv(item.jobId,value.timeId,value.timeName,value.startTime,value.endTime,value.endDays,value.status,value.attendanceId)'>
                  <p class="shift-tag-td" v-if="value.status!=1&&(value.status!=3&&(value.status!=2||value.timeId!=0))">
                    <span :style="{background:value.hint}"></span>
                    {{value.timeName}}
                  </p>
                  <p class="time-style" v-if="value.status!=1&&(value.status!=3&&(value.status!=2||value.timeId!=0))">{{value.startTime}}<span v-if="value.startTime!=''&&value.endTime!=''">-</span>{{value.endTime}}{{value.endDays | endDaysFilter}}</p>
                  <p v-if="value.status==1" class="askLeave-style">
                    <span></span>请假
                  </p>
                  <p v-if="value.status==3||(value.status==2&&value.timeId==0)" class="rest-style">
                    <span></span>休息
                  </p>
                </div>
              </el-popover>
              <div style="width:100%;height:40px;font-size:14px;line-height:40px;color:#999999" @click="noneSchedule" v-else>
                当日无排班
              </div>
            </td>
          </tr>
        </table>
        <el-pagination @current-change="handleCurrentChange" :total="shiftListData.length" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
      <div v-else style="text-align:center;font-size:14px;color: #606266;padding:10px">
        没有数据!
      </div>
    </div>

    <el-dialog title="请假" :visible.sync="dialogLeaveVisible" :close-on-click-modal="false" width="500px">
      <el-row>
        <el-col style="margin-top:20px;">
          <el-form label-width="7em" :model="leaveForm">
            <el-row :gutter="10">
              <el-form-item label="员工" class="selectTwo">
                <el-col :span="11">
                  <el-select v-model="leaveForm.deptId" placeholder="请选择部门" cleable @change="chooseDialog(leaveForm.deptId,'leave')">
                    <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="11">
                  <el-autocomplete class="inline-input" v-model="leaveForm.employeeName" cleable :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'leave')})" placeholder="请输入员工" @select="((item)=>{handleSelect(item,'leave')})"></el-autocomplete>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-col>
                <el-form-item label="工号">
                  {{leaveForm.employeeId}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="日期">
                  <el-date-picker v-model="leaveDateRange" type="daterange" cleable format="yyyy年MM月dd日" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="16">
                <el-form-item label="替班人员">
                  <el-radio-group v-model="relayStatus">
                    <el-radio v-for="(status,index) in relayStatuses" :label="status" :key="index">{{status}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="relayStatus=='有'">
              <el-form-item label="员工" class="selectTwo">
                <el-col :span="11">
                  <el-select v-model="leaveForm.replaceDeptId" placeholder="请选择部门" cleable @change="chooseDialog(leaveForm.replaceDeptId,'leaveReplace')">
                    <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="11">
                  <el-autocomplete class="inline-input" v-model="leaveForm.replaceName" cleable :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'leaveReplace')})" placeholder="请输入员工" @select="((item)=>{handleSelect(item,'leaveReplace')})"></el-autocomplete>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20" v-if="relayStatus=='有'">
              <el-col :span="8">
                <el-form-item label="工号">
                  {{leaveForm.replaceId}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="text-align:center;margin: 0px 0px 20px;" :gutter="0">
              <el-form-item label="">
                <el-col class :span="7">
                  <el-button type="primary" @click="saveLeave()">确定</el-button>
                </el-col>
                <el-col class :span="7" style="margin-left: 10px;">
                  <el-button @click="closeLeaveWin()">取消</el-button>
                </el-col>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="换班" :visible.sync="dialogChangeVisible" :close-on-click-modal="false" width="800px">
      <el-row>
        <el-col>
          <el-form label-width="4em" class="change-shift" :label-position="right">
            <el-row :gutter="20">
              <el-col :span="12">
                <h4>换班人</h4>
                <el-row :gutter="8">
                  <el-form-item label="员工">
                    <el-col :span="12">
                      <el-select v-model="changeForm.deptId" placeholder="请选择部门" @change="chooseDialog(changeForm.deptId,'change')">
                        <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="12">
                      <el-autocomplete class="inline-input" v-model="changeForm.employeeName" cleable :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'change')})" placeholder="请输入员工" @select="((item)=>{handleSelect(item,'change')})"></el-autocomplete>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row :gutter="8">
                  <el-col :span="24">
                    <el-form-item label="日期">
                      <el-date-picker v-model="changeForm.changeDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="changeDate(changeForm.changeDate,'change')"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="8">
                  <el-col :span="24">
                    <el-form-item label="班次">
                      <span>{{changeForm.changeTime}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <h4>被换班人</h4>
                <el-row :gutter="8">
                  <el-form-item label="员工">
                    <el-col :span="12">
                      <el-select v-model="changeForm.replaceDeptId" placeholder="请选择部门" @change="chooseDialog(changeForm.replaceDeptId,'changeReplace')">
                        <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="12">
                      <el-autocomplete class="inline-input" v-model="changeForm.replaceName" cleable :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,'changeReplace')})" placeholder="请输入员工" @select="((item)=>{handleSelect(item,'changeReplace')})"></el-autocomplete>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row :gutter="8">
                  <el-col :span="24">
                    <el-form-item label="日期">
                      <el-date-picker v-model="changeForm.replaceDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="请选择日期" @change="changeDate(changeForm.replaceDate, 'changeReplace')"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="8">
                  <el-col :span="24">
                    <el-form-item label="班次">
                      <span>{{changeForm.replaceTime}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="text-align:center;margin: 30px 0px 20px;" :gutter="0">
              <el-button type="primary" @click="saveChange()">确定换班</el-button>
              <el-button @click="closeChangeWin()">取消</el-button>
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
      endTimeend: "",
      currentPage: 1,
      pageSize: 10,
      shiftListData: [],
      shiftListData1: [],
      loading: true,
      visable: false,
      dialogLeaveVisible: false,
      dialogChangeVisible: false,
      leaveDateRange: [],
      changeDateRange: [],
      deptList: [],
      jobs: [],
      jobList: [],
      timeOption: [],
      staffOption: [],
      leaveStaff: [],
      leaveReplaceStaff: [],
      changeStaff: [],
      changeReplaceStaff: [],
      relayStatus: "",
      relayStatuses: ["有", "无"],
      popoverVisible: false,
      shiftTypes: [],
      shiftType: "",
      days: [],
      people: [],
      shiftDays: [],
      colWidth: "",
      shiftListData: [],
      searchData: {
        pageIndex: 1,
        pageSize: 100000,
        deptName: "",
        deptId: "",
        jobId: "",
        jobName: "",
        timeId: "",
        timeName: "",
        employeeId: "",
        employeeName: "",
        startWorkDate: "",
        endWorkDate: "",
        dateRange: [],
      },
      leaveForm: {
        deptId: "",
        deptName: "",
        employeeId: "",
        employeeName: "",
        replaceDeptId: "",
        replaceDeptName: "",
        replaceId: "",
        replaceName: "",
        startWorkDate: "",
        endWorkDate: "",
      },
      changeForm: {
        deptId: "",
        deptName: "",
        employeeId: "",
        employeeName: "",
        replaceDeptId: "",
        replaceDeptName: "",
        replaceId: "",
        replaceName: "",
        changeDate: "",
        replaceDate: "",
        changeTime: "",
        replaceTime: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 24 * 60 * 60 * 1000 * 27;
        },
      },
    };
  },
  computed: {},
  created() {
    let date = new Date();
    this.searchData.startWorkDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.searchData.endWorkDate = this.getEndDate();
    this.searchData.dateRange = [
      this.searchData.startWorkDate,
      this.searchData.endWorkDate,
    ];
    axios.fetch("oaServer", "/org/dept/list", {}).then((res) => {
      this.deptList = res.data.map((v) => {
        return {
          label: v.deptName,
          value: v.deptId,
        };
      });
    });
    axios.fetch("oaServer", "/org/job/list", {}).then((res) => {
      this.jobs = res.data;
    });
    this.fetchData();
  },
  methods: {
    showDiv(jobId, timeId, timeName, startTime, endTime, endDays, status,attendanceId) {
      if(attendanceId){
        let data = {
          jobId: jobId,
        };
        let that = this;
        axios
          .fetch("attendanceServer", "/work/worktime/queryByJob", data)
          .then((res) => {
            that.shiftTypes = [];
            res.data.map((item, index) => {
              let endDays = item.endDays == 1 ? "(次日)" : "";
              let timeName =
                item.timeName +
                "(" +
                item.startTime +
                "-" +
                item.endTime +
                endDays +
                ")";
              let time = {
                timeName: timeName,
                timeId: item.timeId,
                status: item.status,
              };
              that.shiftTypes.push(time);
            });
            that.shiftTypes.push({
              timeName: "休息",
              timeId: "",
              status: 3,
            });
          });
        endDays = endDays == 1 ? "(次日)" : "";
        let timeNameChecked = "";
        if (status != 1 && status != 3 && (status != 2 || timeId != 0)) {
          timeNameChecked =
            timeName + "(" + startTime + "-" + endTime + endDays + ")";
        } else if (status == 1) {
          timeNameChecked = "请假";
        } else if (status == 3 || (status == 2 && timeId == 0)) {
          timeNameChecked = "休息";
        }
        this.shiftType = timeNameChecked;
        this.visable = true;
      } else {
        this.$message.warning('当日未排班!');
      }
    },
    closeDiv() {
      $(".el-popover").hide();
      this.visable = false;
    },
    closePopover() {
      this.popoverVisible = false;
    },
    askForLeave() {
      this.leaveForm.deptId = "";
      this.leaveForm.deptName = "";
      this.leaveForm.employeeId = "";
      this.leaveForm.employeeName = "";
      this.leaveForm.replaceDeptId = "";
      this.leaveForm.replaceDeptName = "";
      this.leaveForm.replaceId = "";
      this.leaveForm.replaceName = "";
      this.leaveForm.startWorkDate = "";
      this.leaveForm.endWorkDate = "";
      this.relayStatus = "无";
      this.leaveDateRange = [];

      this.dialogLeaveVisible = true;
    },
    changeShift() {
      this.changeForm.deptId = "";
      this.changeForm.deptName = "";
      this.changeForm.employeeId = "";
      this.changeForm.employeeName = "";
      this.changeForm.replaceDeptId = "";
      this.changeForm.replaceDeptName = "";
      this.changeForm.replaceId = "";
      this.changeForm.replaceName = "";
      this.changeForm.changeDate = "";
      this.changeForm.replaceDate = "";
      this.changeForm.changeTime = "";
      this.changeForm.replaceTime = "";
      this.dialogChangeVisible = true;
    },
    search() {
      this.changePage(1);
    },
    changePage(value) {
      this.pageIndex = value;
      this.fetchData();
    },
    fetchData() {
      axios
        .fetch(
          "attendanceServer",
          "/work/workattendance/queryPager",
          this.searchData
        )
        .then((res) => {
          this.listData = res.data;
          this.dataCount = res.total;
          this.assembleRenderData();
        });
    },

    chooseDepart(deptId) {
      this.searchData.jobId = "";
      this.searchData.timeId = "";
      this.jobList = this.jobs.filter((item) => {
        return item.deptId == deptId;
      });
    },
    chooseJob(jobId, index) {
      this.searchData.timeId = "";
      let data = {
        jobId: this.searchData.jobId,
      };
      axios
        .fetch("attendanceServer", "/work/worktime/queryByJob", data)
        .then((res) => {
          this.timeOption = res.data;
        });
    },

    chooseDialog(deptId, sign) {
      this.leaveStaff = [];
      this.leaveReplaceStaff = [];
      this.changeStaff = [];
      this.changeReplaceStaff = [];
       if (sign == "leave") {
         this.leaveForm.employeeName = '';
       }
       if (sign == "leaveReplace") {
          this.leaveForm.replaceName = '';
       }
      if (sign == "change") {
        this.changeForm.employeeName = '';
       }
       if (sign == "changeReplace") {
        this.changeForm.replaceName = '';
       }
      let data = {
        deptId: deptId,
      };
      axios
        .fetch(
          "attendanceServer",
          "/work/workattendance/queryEmployeeByDepartment",
          data
        )
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            let staff = {
              employeeId: res.data[i].employeeId,
              value: res.data[i].employeeName,
            };
            if (sign == "leave") {
              this.leaveStaff.push(staff);
            } else if (sign == "leaveReplace") {
              this.leaveReplaceStaff.push(staff);
            } else if (sign == "change") {
              this.changeStaff.push(staff);
            } else if (sign == "changeReplace") {
              this.changeReplaceStaff.push(staff);
            }
          }
        });
    },
    searchInfo() {
      if (this.searchData.dateRange == null) {
        this.$message.error("请选择时间范围");
        return;
      }
      this.searchData.startWorkDate = this.searchData.dateRange[0];
      this.searchData.endWorkDate = this.searchData.dateRange[1];
      let duration = this.DateDiff(
        this.searchData.startWorkDate,
        this.searchData.endWorkDate
      );
      if (duration > 14) {
        this.$message.error("只可以选择14天");
        return;
      }
      this.fetchData();
    },
    reset() {
      this.loading = true;
      this.searchData.deptId = "";
      this.searchData.deptName = "";
      this.searchData.jobId = "";
      this.searchData.jobName = "";
      this.searchData.timeId = "";
      this.searchData.timeName = "";
      this.searchData.employeeId = "";
      this.searchData.employeeName = "";
      this.searchData.startWorkDate = "";
      this.searchData.endWorkDate = "";
      this.searchData.dateRange = [];
      this.currentPage = 1;

      let date = new Date();
      this.searchData.startWorkDate =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      this.searchData.endWorkDate = this.getEndDate();
      this.searchData.dateRange = [
        this.searchData.startWorkDate,
        this.searchData.endWorkDate,
      ];
      this.fetchData();
    },
    saveLeave() {
      if (this.leaveForm.deptId == "" || this.leaveForm.deptId == undefined) {
        this.$message.error("请选择部门");
        return;
      } else if (
        this.leaveForm.employeeName == "" ||
        this.leaveForm.employeeName == undefined
      ) {
        this.$message.error("请选择人员");
        return;
      } else if (this.leaveDateRange.length < 1) {
        this.$message.error("请选择日期");
        return;
      } else if (
        this.leaveForm.replaceDeptId == "" &&
        this.relayStatus == "有"
      ) {
        this.$message.error("请选择替换部门");
        return;
      } else if (this.leaveForm.replaceName == "" && this.relayStatus == "有") {
        this.$message.error("请选择替换人员");
        return;
      }
      if (this.relayStatus == "无") {
        this.leaveForm.replaceId = "";
      }
      this.leaveForm.startWorkDate = this.leaveDateRange[0];
      this.leaveForm.endWorkDate = this.leaveDateRange[1];
      let data = {
        employeeId: this.leaveForm.employeeId,
        replaceId: this.leaveForm.replaceId,
        startWorkDate: this.leaveForm.startWorkDate,
        endWorkDate: this.leaveForm.endWorkDate,
      };
      axios
        .fetch("attendanceServer", "/work/workattendance/leave", data)
        .then((res) => {
          this.$message({
            message: "请假成功",
            type: "success",
          });
          this.fetchData();
          this.dialogLeaveVisible = false;
        });
    },
    saveChange() {
      //		    	console.log(this.endTimeend)
      if (this.endTimeend.offTime === null && this.endTimeend.onTime) {
        this.$message.error("该员工已打上班卡，无法进行换班");
        return;
      }
      if (this.changeForm.deptId == "" || this.changeForm.deptId == undefined) {
        this.$message.error("请选择部门");
        return;
      } else if (
        this.changeForm.employeeName == "" ||
        this.changeForm.employeeName == undefined
      ) {
        this.$message.error("请选择人员");
        return;
      } else if (
        this.changeForm.changeDate == "" ||
        this.changeForm.changeDate == undefined
      ) {
        this.$message.error("请选择日期");
        return;
      } else if (
        this.changeForm.replaceDeptId == "" ||
        this.changeForm.replaceDeptId == undefined
      ) {
        this.$message.error("请选择被换班人部门");
        return;
      } else if (
        this.changeForm.replaceName == "" ||
        this.changeForm.replaceName == undefined
      ) {
        this.$message.error("请选择被换班人员");
        return;
      } else if (
        this.changeForm.replaceDate == "" ||
        this.changeForm.replaceDate == undefined
      ) {
        this.$message.error("请选择被换班人日期");
        return;
      }

      let data = {
        employeeId: this.changeForm.employeeId,
        replaceId: this.changeForm.replaceId,
        date: this.changeForm.changeDate,
        replaceDate: this.changeForm.replaceDate,
      };
      axios
        .fetch("attendanceServer", "/work/workattendance/change", data)
        .then((res) => {
          this.$message({
            message: "换班成功",
            type: "success",
          });
          this.fetchData();
          this.dialogChangeVisible = false;
        });
    },
    adjust(attendanceId) {
      let timeId = "";
      for (let i = 0; i < this.shiftTypes.length; i++) {
        if (this.shiftTypes[i].timeName == this.shiftType) {
          timeId = this.shiftTypes[i].timeId;
        }
      }
      if (timeId != null || timeId != undefined) {
        let data = {
          attendanceId: attendanceId,
          timeId: timeId,
        };
        axios
          .fetch("attendanceServer", "/work/workattendance/resetWorkTime", data)
          .then((res) => {
            this.$message({
              message: "换班成功",
              type: "success",
            });
            this.fetchData();
            this.visable = false;
            $(".el-popover").hide();
          });
      } else {
        this.$message.error("请选择班次");
      }
    },
    closeLeaveWin() {
      this.dialogLeaveVisible = false;
    },
    closeChangeWin() {
      this.dialogChangeVisible = false;
    },
    assembleRenderData() {
      this.getAllDate();
      this.assemblePerson();
      this.assembleTime();
      this.assembleRationalTime();
    },
    assemblePerson() {
      this.shiftListData = [];
      this.shiftListData1 = [];
      //人员数组去重排序
      let obj = {};
      this.listData.map((item, index) => {
        let person = {
          employeeId: item.attendanceView.employeeId,
          employeeName: item.attendanceView.employeeName,
          deptName: item.attendanceView.deptName,
          jobId: item.attendanceView.jobId,
          jobName: item.attendanceView.jobName,
          timeContent: [],
          jiangArr: [],
          zhangArr: [],
        };
        this.shiftListData.push(person);
      });
      this.shiftListData = this.shiftListData.reduce((item, next) => {
        obj[next.employeeId]
          ? ""
          : (obj[next.employeeId] = true && item.push(next));
        return item;
      }, []);
    },
    assembleTime() {
      //导入14天的空模板
      for (let i = 0; i < this.shiftListData.length; i++) {
        let timeContent = {};
        for (let j = 0; j < this.shiftDays.length; j++) {
          timeContent = {
            attendanceId: "",
            status: "",
            workDate: "",
            timeId: "",
            timeName: "",
            hint: "",
            startTime: "",
            endTime: "",
            endDays: "",
          };
          this.shiftListData[i].timeContent.push(timeContent);
        }
      }
    },
    assembleRationalTime() {
      //进行时间的逐一匹配
      for (var i = 0; i < this.listData.length; i++) {
        let ldata = this.listData[i];
        let attendance = ldata["attendanceView"];
        let time = ldata["timeContent"];
        for (var j = 0; j < this.shiftListData.length; j++) {
          let sdata = this.shiftListData[j];
          if (attendance["employeeId"] == sdata["employeeId"]) {
            sdata["jiangArr"].push(attendance["workDate"]);
            let timeContent = {};
            if (time != null) {
              timeContent = {
                attendanceId: attendance.attendanceId,
                status: attendance.status,
                workDate: attendance.workDate.split(" ")[0],
                timeId: attendance.timeId,
                timeName: time.timeName,
                hint: time.hint,
                startTime: time.startTime,
                endTime: time.endTime,
                endDays: time.endDays,
              };
            } else if (time == null) {
              timeContent = {
                attendanceId: attendance.attendanceId,
                status: attendance.status,
                workDate: attendance.workDate.split(" ")[0],
                timeId: attendance.timeId,
                timeName: "",
                hint: "",
                startTime: "",
                endTime: "",
                endDays: "",
              };
            }
            sdata["zhangArr"].push(timeContent);
          }
        }
      }
      // console.log(this.shiftListData,'===this.shiftListData');
      for (var i = 0; i < this.shiftListData.length; i++) {
        for (var j = 0; j < this.shiftListData[i]["jiangArr"].length; j++) {
          this.shiftListData[i]["jiangArr"][j] = this.shiftListData[i][
            "jiangArr"
          ][j].substr(0, 10);
        }
      }
      for (var i = 0; i < this.shiftListData.length; i++) {
        for (var j = 0; j < this.shiftListData[i]["jiangArr"].length; j++) {
          for (var k = 0; k < this.shiftDays.length; k++) {
            if (
              this.shiftDays[k]["day"] == this.shiftListData[i]["jiangArr"][j]
            ) {
              this.shiftListData[i]["timeContent"][k] = this.shiftListData[i][
                "zhangArr"
              ][j];
              this.shiftListData[i]["zhangArr"][j] = this.shiftDays[k]["day"];
            }
          }
        }
      }
      if (this.shiftListData.length < 10) {
        this.currentPage = 1;
        this.shiftListData1 = this.shiftListData;
      } else {
        // this.currentPage = this.shiftListData.length /10;
        if (this.shiftListData.length > 10) {
          this.shiftListData1 = this.shiftListData.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
        }
      }
      // console.log(this.shiftListData1,'======');
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.shiftListData1 = this.shiftListData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    querySearch(queryString, cb, sign) {
      let staffOption = [];
      if (sign == "leave") {
        staffOption = this.leaveStaff;
      } else if (sign == "leaveReplace") {
        staffOption = this.leaveReplaceStaff;
      } else if (sign == "change") {
        staffOption = this.changeStaff;
      } else if (sign == "changeReplace") {
        staffOption = this.changeReplaceStaff;
      }
      let results = queryString
        ? staffOption.filter(this.createFilter(queryString))
        : staffOption;

      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (staffOption) => {
        return (
          staffOption.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(staff, sign) {
      let staffOption = [];
      if (sign == "leave") {
        staffOption = this.leaveStaff;
      } else if (sign == "leaveReplace") {
        staffOption = this.leaveReplaceStaff;
      } else if (sign == "change") {
        staffOption = this.changeStaff;
      } else if (sign == "changeReplace") {
        staffOption = this.changeReplaceStaff;
      }
      staffOption.map((item, index) => {
        if (item.value == staff.value) {
          if (sign == "leave") {
            this.leaveForm.employeeId = item.employeeId;
          } else if (sign == "leaveReplace") {
            this.leaveForm.replaceId = item.employeeId;
          } else if (sign == "change") {
            this.changeForm.employeeId = item.employeeId;
            this.shiftTime(
              this.changeForm.employeeId,
              this.changeForm.changeDate,
              sign
            );
          } else if (sign == "changeReplace") {
            this.changeForm.replaceId = item.employeeId;
            this.shiftTime(
              this.changeForm.replaceId,
              this.changeForm.replaceDate,
              sign
            );
          }
        }
      });
    },
    changeDate(changeDate, sign) {
      if (sign == "change") {
        this.changeForm.changeDate = changeDate;
        this.shiftTime(
          this.changeForm.employeeId,
          this.changeForm.changeDate,
          sign
        );
      } else if (sign == "changeReplace") {
        this.changeForm.replaceDate = changeDate;
        this.shiftTime(
          this.changeForm.replaceId,
          this.changeForm.replaceDate,
          sign
        );
      }
    },
    shiftTime(changeId, changeDate, sign) {
      if (changeId == "" || changeDate == "") return;
      //进行换班班次时间查询
      let data = {
        employeeId: changeId,
        workDate: changeDate,
      };
      axios
        .fetch("attendanceServer", "/work/workattendance/queryByEmployee", data)
        .then((res) => {
          let resData = res.data;
          if (resData) {
            let startTime = "";
            let endTime = "";
            let endDays = "";
            let time = "";
            let that = this;

            if (sign == "change") {
              that.endTimeend = resData.attendanceView;
            }
            if (
              resData.timeContent != null &&
              resData.attendanceView.status == 1
            ) {
              time = "请假";
            } else if (resData.timeContent != null) {
              startTime = resData.timeContent.startTime;
              endTime = resData.timeContent.endTime;
              endDays = resData.timeContent.endDays == 1 ? "(次日)" : "";
              time = startTime + "-" + endTime + endDays;
            } else if (resData.attendanceView.status == 3) {
              time = "休息";
            }
            if (sign == "change") {
              this.changeForm.changeTime = time;
            } else if (sign == "changeReplace") {
              this.changeForm.replaceTime = time;
            }
          }
        });
    },
    DateDiff(startDate, endDate) {
      let aDate, oDate1, oDate2, iDays;
      aDate = startDate.split("-");
      oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
      aDate = endDate.split("-");
      oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) + 1;
      return iDays;
    },
    getEndDate() {
      let day = 14;
      let newTime = Date.parse(
        this.searchData.startWorkDate.replace(/-/g, "/")
      );
      let newTimes = newTime + 3600000 * 24 * (day - 1);
      let newDate =
        new Date(newTimes).getFullYear() +
        "-" +
        (new Date(newTimes).getMonth() + 1) +
        "-" +
        new Date(newTimes).getDate();
      return newDate;
    },
    noneSchedule(){
      this.$message.warning('当日无排班!');
    },
    getAllDate() {
      //起始置空
      this.shiftDays = [];
      let begin = this.searchData.dateRange[0];
      let end = this.searchData.dateRange[1];
      //根据时间范围拿到所有日期
      Date.prototype.format = function () {
        var s = "";
        var mouth =
          this.getMonth() + 1 >= 10
            ? this.getMonth() + 1
            : "0" + (this.getMonth() + 1);
        var day = this.getDate() >= 10 ? this.getDate() : "0" + this.getDate();
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
          week: week,
        };
        this.shiftDays.push(weekOne);
      });
      if (this.shiftDays.length > 0) {
        this.colWidth = 90 / this.shiftDays.length + "%";
      }
    },
  },
  filters: {
    endDaysFilter: (val) => {
      if (val == 0) {
        val = "";
      } else if (val == 1) {
        val = "(次日)";
      }
      return val;
    },
  },
};
</script>
<style scoped>
.shift-tag div {
  margin-right: 20px;
  font-size: 14px;
  color: #666666;
}
.shift-tag div span:first-child {
  width: 6px;
  height: 12px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  margin-bottom: 2px;
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
table td {
  padding: 7px 0;
}
table td p {
  text-align: center;
}
table td p:first-child {
  margin-bottom: 5px;
}
.popover-header {
  padding: 12px;
  height: 30px;
  color: #fff;
  background: #3f51b5;
}
.popover-body {
  margin: 20px 20px 0;
}
.popover-body .el-radio {
  display: block;
  margin-bottom: 20px;
}
.popover-footer {
  height: 50px;
  text-align: center;
}
.popover-footer .el-button {
  background: #f49b31;
  width: 100px;
}
.change-shift h4 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
  color: #222222;
  font-weight: bold;
}
.askLeave-style,
.rest-style {
  font-size: 16px;
}
.askLeave-style span,
.rest-style span {
  display: inline-block;
  height: 10px;
  width: 10px;
  margin-right: 5px;
  border-radius: 50%;
}
.askLeave-style {
  color: #f36969;
}
.rest-style {
  color: #009fd7;
}
.askLeave-style span {
  background: #f36969;
}
.rest-style span {
  background: #009fd7;
}
table tr td {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
}
table tr:first-child,
table td:first-child {
  background-color: #f8f8f8;
}
.addBtn {
  font-size: 14px;
  color: #fff;
}
.addBtn .iconfont {
  margin-right: 4px;
}
.view-container .el-input__inner {
  height: 35px;
  line-height: 35px;
  padding: 0px 10px;
}
/deep/ .search .el-select .el-input {
  width: 120px;
}
</style>