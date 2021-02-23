<template>
  <div>
    <el-form :inline="true" class="search">
      <el-form-item label="姓名">
        <ub-employee v-model="search.id" @change="item => search.employeeName = item.employeeName" clearable></ub-employee>
      </el-form-item>
      <el-form-item label="部门">
        <el-select clearable v-model="search.deptId" placeholder="部门" @change="chooseDepart('add',search.deptId)">
          <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select clearable v-model="search.jobId" placeholder="岗位" @change="chooseJob(search.jobId)">
          <el-option v-for="item in jobList" :key="item.jobId" :label="item.jobName" :value="item.jobId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区域">
        <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="right">
          <el-button type="success" @click="add" icon="el-icon-plus">新增</el-button>
        </el-col>
      </el-row>
      <el-table class="ub-table" :data="data" row-key="id" border>
        <el-table-column prop="deptName" label="部门"></el-table-column>
        <el-table-column prop="jobName" label="岗位"></el-table-column>
        <el-table-column prop="employeeName" label="姓名"></el-table-column>
        <el-table-column prop="area" label="负责区域"></el-table-column>
        <!-- <el-table-column prop="roomName" label="负责房间号" width="550"></el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!-- 新增弹出框 -->
    <el-dialog :title="addInfo.title" :visible.sync="dialogAddVisible" center width="35%">
      <div class="dialog">
        <el-form class="people" label-width="100px" :model="addInfo">
          <el-form-item label="人员">
            <el-row :gutter="22">
              <!-- <el-col :span="7">
                                <el-select clearable v-model="addInfo.deptId" placeholder="部门" @change="chooseDepart('add',addInfo.deptId)">
                                    <el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <el-select clearable v-model="addInfo.jobId" placeholder="岗位" @change="chooseJob(addInfo.jobId)">
                                    <el-option v-for="item in jobList" :key="item.jobId" :label="item.jobName" :value="item.jobId"></el-option>
                                </el-select>
                            </el-col> -->
              <el-col :span="6">
                <ub-employee v-model="addInfo.employeeId" @change="changePeople()"></ub-employee>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-form class="room" label-width="100px" :model="addInfo" :rules="rules" ref='addInfo'>
          <el-form-item label="区域" prop="area" v-loading="roomLoading">
            <el-checkbox-group v-model="addInfo.area" :disabled="addInfo.employeeId == ''">
              <el-checkbox v-for="(item,index) in areas" :key="index" :label="item.text" name="area" @change="changeFloor(item,index)"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="line"></div>
        <div class="rooms-list">
          <div class="floor" v-for="(item,index) in roomList" :key="item" v-show="item.isShow">
            <el-row :gutter="25">
              <el-col :span="4" style="padding-right:6px;">
                <div style="text-align:right;">
                  <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.isSelectedAll" @change="handleCheckAllChange(item,index)">{{item.area}}</el-checkbox>
                </div>
              </el-col>
              <el-col :span="19" style="padding-left:6px;">
                <el-checkbox-group v-model="addInfo.roomName" @change="handleCheckedCitiesChange(addInfo.roomName)">
                  <el-checkbox :label="val.roomName" name="type" v-for="val in item.resultRoomsVos" :key="val"></el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddOne">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增/编辑绑定床位 -->
    <bindBed ref="bind_bed" @getdata="getdata" :asign="asign"></bindBed>
  </div>
</template>

<script>
import ubEmployee from "@/components/employee";
import bindBed from "./children/bindBed";
export default {
  components: { ubEmployee, bindBed },
  data() {
    return {
      setArea:'',
      search: {
        id: "",
        employeeName: "",
        deptId: "",
        jobId: "",
      },
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      dialogAddVisible: false,
      addInfo: {
        title: "新增",
        deptId: "",
        jobId: "",
        area: [],
        roomName: "",
      },
      jobList: [],
      jobs: [],
      rules: {
        area: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个区域",
            trigger: "change",
          },
        ],
      },
      areas: [],
      roomList: [],
      roomLoading: false,
      filterAddDept: "",
      filterAddJob: "",
      asign: "add",
    };
  },
  mounted() {
    this.getdata();
    this.getDepList();
  },
  methods: {
    getArea(val){
      this.search.area = val.text;
      this.setArea = val.text;
    },
    chooseDepart(type, deptId) {
      console.log(deptId);
      this.search.jobId = "";
      this.addInfo.jobId = type == "add" ? "" : this.addInfo.jobId;
      this.jobList = this.jobs.filter((item) => {
        return item.deptId == deptId;
      });
      // this.filterAddDept = this.deptList.filter(val => val.value == deptId)[0].label;
      this.$forceUpdate();
    },
    chooseJob(jobId, index) {
      // this.filterAddJob = this.jobList.filter(val => val.jobId == jobId)[0].jobName;
      this.$forceUpdate();
    },
    getDepList() {
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
    },
    getdata() {
      let param = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        deptId: this.search.deptId,
        jobId: this.search.jobId,
        area: this.search.area,
        employeeName: this.search.employeeName,
      };
      axios.fetch("oaServer", "/employee/responsibility", param).then((res) => {
        if (res.code == 200) {
          this.total = res.total;
          this.data = res.data;
        }
      });
    },
    handleCheckAllChange(item, index) {
      console.log(item);
      // 选择了一部分
      if (item.isIndeterminate) {
        this.roomList[index].resultRoomsVos.map((val) => {
          let i = this.addInfo.roomName.indexOf(val.roomName);
          if (i !== -1) {
            this.addInfo.roomName.splice(i, 1);
          }
          this.addInfo.roomName.push(val.roomName);
        });
      } else {
        // 全选或全不选
        this.roomList[index].resultRoomsVos.map((val) => {
          let i = this.addInfo.roomName.indexOf(val.roomName);
          if (i !== -1) {
            this.addInfo.roomName.splice(i, 1);
          } else {
            this.addInfo.roomName.push(val.roomName);
          }
        });
      }
      this.roomList[index].isIndeterminate = false;
    },
    handleCheckedCitiesChange(item) {
      console.log(item);
      this.dealData("choose");
    },
    changeFloor(item, i) {
      console.log(this.addInfo.area, item, i);
      if (this.roomList[i].resultRoomsVos.length < 1) {
        this.$message.warning("该选项没有房间！");
        this.roomList[i].isIndeterminate = false;
        this.roomList[i].isShow = false;
        let index = this.addInfo.area.indexOf(item.text);
        if (index !== -1) {
          this.addInfo.area.splice(index, 1);
        }
      } else {
        let hasOwn = this.addInfo.area.indexOf(item.text);
        console.log(hasOwn);
        if (hasOwn == -1) {
          // 隐藏并删除本来的选项
          this.roomList[i].isShow = false;
          this.roomList[i].resultRoomsVos.map((v) => {
            if (v.isSelected) {
              let index1 = this.addInfo.roomName.indexOf(v.roomName);
              this.addInfo.roomName.splice(index1, 1);
            }
            v.isSelected = false;
          });
        } else {
          this.dealData("change");
        }
        console.log(this.roomList);
      }
      console.log(this.addInfo.area);
    },
    handleChange(i) {
      this.currentPage = i;
      this.getdata();
    },
    changePeople() {
      console.log(this.addInfo.employeeId);
      this.getRoomsName(this.addInfo.employeeId);
    },
    // 编辑
    detail(val) {
      console.log(val);
      // this.addInfo = {
      //     title: '编辑',
      //     deptId: val.deptId,
      //     employeeId:val.employeeId,
      //     jobId:val.jobId,
      //     area:typeof val.area == 'string' ? val.area.split(',') : [],
      //     roomName:typeof val.roomName == 'string' ? val.roomName.split(',') : []
      // };
      // // this.chooseDepart('edit',val.deptId);
      // this.getRoomsName(val.employeeId);
      // this.dialogAddVisible = true;
      this.$refs.bind_bed.visible = true;
      this.asign = "edit";
      this.$refs.bind_bed.form.employeeId = val.employeeId;
      this.$refs.bind_bed.form.checkedAreas = val.area ? val.area.split(',') : [];
      console.log(this.$refs.bind_bed.form.checkedAreas);
    },
    getRoomsName(val) {
      this.roomLoading = true;
      let param = {
        employeeId: val,
      };
      axios.fetch("oaServer", "/employee/roomNames", param).then((res) => {
        if (res.code == 200) {
          this.roomLoading = false;
          this.roomList = res.data;
          this.dealData("init");
        }
      });
    },
    dealData(type) {
      for (var i = 0; i < this.roomList.length; i++) {
        // 如果区域勾选上则显示
        if (this.addInfo.area.includes(this.roomList[i].area)) {
          this.roomList[i].isShow = true;
          this.roomList[i].isIndeterminate = type == "change" ? false : true;
        } else {
          this.roomList[i].isIndeterminate = false;
          this.roomList[i].isShow = false;
        }
        this.roomList[i].resultRoomsVos.map((val) => {
          let i = this.addInfo.roomName.indexOf(val.roomName);
          val.isSelected = i !== -1 ? true : false;
        });
      }
      for (var i = 0; i < this.roomList.length; i++) {
        // 判断是否全选
        let all =
          this.roomList[i].resultRoomsVos.length > 0
            ? this.roomList[i].resultRoomsVos.every((v) => {
                return v.isSelected == true;
              })
            : false;
        // 非全选但有选项
        let has =
          this.roomList[i].resultRoomsVos.length > 0
            ? this.roomList[i].resultRoomsVos.some((v) => {
                return v.isSelected == true;
              })
            : false;
        console.log(all, has);
        this.roomList[i].isSelectedAll = all;
        if (this.roomList[i].resultRoomsVos.length > 0) {
          if (all) {
            this.roomList[i].isIndeterminate = false;
          } else if (has) {
            this.roomList[i].isIndeterminate = true;
          } else {
            this.roomList[i].isIndeterminate = false;
          }
        }
      }
      this.$forceUpdate();
    },
    add() {
      // this.dialogAddVisible = true;
      // this.addInfo = {
      //     title:'新增',
      //     employeeId:'',
      //     deptId: "",
      //     jobId: "",
      //     area:[],
      //     roomName:[]
      // };
      // this.roomList = [];
      // console.log(this.$refs["addInfo"])
      // if (this.$refs["addInfo"] !== undefined) {
      //     this.$refs["addInfo"].resetFields();
      // }
      this.$refs.bind_bed.visible = true;
      this.asign = 'add';
    },
    // 重置
    reset() {
      if (this.$refs.areaCom !== undefined) {
          this.$refs.areaCom.resetArea();
          this.setArea = '';
      }
      this.search = {
        id: "",
        employeeName: "",
        deptId: "",
        jobId: "",
      };
      this.currentPage = 1;
      this.jobList = [];
      this.getdata();
    },
    // 添加和修改
    submitAddOne() {
      console.log(this.addInfo);
      if (this.addInfo.employeeId == "") {
        return this.$message.error("人员不能为空！");
      }
      this.$refs["addInfo"].validate((valid) => {
        if (valid) {
          if (this.addInfo.roomName.length == 0) {
            return this.$message.error("请至少选择一个房间！");
          }
          let param = {
            type: this.addInfo.title == "新增" ? 1 : 2,
            employeeId: this.addInfo.employeeId,
            deptId: this.addInfo.deptId,
            jobId: this.addInfo.jobId,
            area: this.addInfo.area.join(","),
            roomName: this.addInfo.roomName.join(","),
          };
          axios
            .fetch(
              "oaServer",
              "/employee/responsibility/save",
              param,
              "json",
              "post",
              true
            )
            .then((res) => {
              if (res.code == 200) {
                if (res.data !== false) {
                  this.$message.success("成功！");
                  this.$refs["addInfo"].resetFields();
                  this.dialogAddVisible = false;
                  this.getdata();
                } else {
                  this.$message.error("失败");
                }
              }
            })
            .catch((res) => {
              this.$message.error(res.msg);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.people .el-form-item {
  margin-bottom: 15px !important;
}
.room .el-form-item {
  margin-bottom: 0 !important;
}
.dialog {
  .title {
    color: #333;
    font-weight: bold;
    font-size: 16px;
    margin: 0 0 0 20px;
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: #eee;
    margin: 5px 0 20px 0;
  }
  .rooms-list {
    height: 270px;
    overflow-y: scroll;
    overflow-x: hidden;
    .floor {
      margin-bottom: 5px;
      .el-checkbox-group {
        .el-checkbox {
          margin-right: 35px !important;
          margin-bottom: 15px !important;
        }
      }
    }
  }
}
</style>