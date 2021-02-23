<template>
  <div>
    <el-form :inline="true" class="search" ref="searchForm" :model="searchForm">
      <!-- <el-form-item label="长者房间" prop="bedId">
        <el-select v-model="searchForm.buildingId" clearable placeholder="楼宇" @change="changeBuilding">
            <el-option v-for="(item,index) in buildingOption" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="searchForm.floor" clearable placeholder="楼层" @change="changeFloor">
            <el-option v-for="(item,index) in floorOption" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="searchForm.roomId" clearable placeholder="房间" @change="changeRoom">
            <el-option v-for="(item,index) in roomOption" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="老人姓名">
        <ub-elder v-model="searchForm.elderId" clearable></ub-elder>
      </el-form-item>
      <el-form-item label="审核状态" label-width="5em">
        <el-select v-model="searchForm.status" clearable placeholder="审核状态">
          <el-option v-for="(item,index) in statusOption" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回院状态" label-width="5em">
        <el-select v-model="searchForm.leaveStatus" clearable placeholder="回院状态">
          <el-option v-for="(item,index) in returnStatusOption" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="searchInfo()" icon="el-icon-search" style="background-color:#2368D3;">查询</el-button>
      <el-button @click="reset()" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="right">
          <el-button class="button-green" @click="newLeaves" icon="el-icon-plus">新建请假单</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column prop="leaveNo" label="请假单号" align="center" width="150"></el-table-column>
        <el-table-column prop="elderName" label="长者姓名" align="center" width="90"></el-table-column>
        <el-table-column prop="cardNo" label="房间床位" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bedName!=''">{{scope.row.buildingName}}-{{scope.row.roomName}}-{{scope.row.bedName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="checkoutRemark" label="请假开始时间" align="center" width="270">
          <template slot-scope="scope">
            <span v-if="scope.row.startDate">
              <span class="tableRedTip" v-if="scope.row.startDiet===1">餐</span>
              {{$moment(scope.row.startDate).format('YYYY-MM-DD HH:mm:ss')}}
              <!-- {{scope.row.startDate}}至{{scope.row.endDate}} -->
              <!-- <span class="tableRedTip" v-if="scope.row.endDiet===1">餐</span> -->
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="外出事由" align="center"></el-table-column>
        <el-table-column prop="leaveTime" label="外出时间" width="200" align="center"></el-table-column>
        <el-table-column prop="returnTime" label="回院时间" width="200" align="center"></el-table-column>
        <el-table-column prop="leaveStatus" label="回院状态" align="center">
          <template slot-scope="scope">{{scope.row.leaveStatus | leaveStatus}}</template>
        </el-table-column>
        <el-table-column prop="handlerName" label="审核人" align="center"></el-table-column>
        <!-- <el-table-column prop="handleTime" label="审核时间" align="center" width="200"></el-table-column> -->
        <el-table-column prop="status" label="审核状态" align="center">
          <template slot-scope="scope">{{scope.row.status | statusFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="审核" placement="top-end" v-if="scope.row.status===0">
              <el-button size="mini" @click="check(scope.row)" icon="iconfont iconcaozuotubiao-shenhe"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看" placement="top-end" v-if="scope.row.status===1||scope.row.status===-1">
              <el-button size="mini" @click="see(scope.row)" icon="iconfont iconcaozuotubiao-chakan"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="作废" placement="top-end">
              <el-button size="mini" class="lookta" @click="del(scope.row)" v-if="scope.row.status == 1&&scope.row.leaveStatus == 0">
                <i class="btn iconfont iconcaozuotubiao-shanchu-xuanfu"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 弹出框 -->
    <div class="dialog">
      <!-- 新建请假单 -->
      <el-dialog center title="新建请假单" :visible.sync="dialogNewVisible" id="newDialog" width="450px">
        <el-form :rules="rules" label-width="80px">
          <el-form-item label="长者姓名" prop="elderId">
            <!-- <el-autocomplete class="inline-input" v-model="elderName" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" clearable></el-autocomplete> -->
            <ub-elder :status="[0,100]" v-model="newLeave.elderId"></ub-elder>
          </el-form-item>
          <el-form-item label="请假时间" prop="checkoutRemark">
            <el-date-picker v-model="newLeave.startDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" clearable></el-date-picker>
            <el-checkbox v-model="newLeave.startDiet" class="margin_left10">用餐</el-checkbox>
          </el-form-item>
          <!-- <el-form-item label="" prop="checkoutDate">
            <el-date-picker v-model="newLeave.endDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="结束时间" clearable></el-date-picker>
            <el-checkbox v-model="newLeave.endDiet" class="margin_left10">用餐</el-checkbox>
          </el-form-item> -->
          <el-form-item label="请假事由" prop="checkoutDate">
            <el-select v-model="newLeave.reason" placeholder="请假事由" clearable>
              <el-option v-for="(item,index) in reasonOption" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明">
            <el-input type="textarea" v-model="newLeave.remark" maxlength="200" show-word-limit clearable></el-input>
          </el-form-item>
          <div class="buttons" style="text-align:center;">
            <el-button type="primary" @click="submitApply()">提交申请</el-button>
            <el-button @click="applyCancel()">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 请假审批 -->
      <el-dialog center title="请假单审核" :visible.sync="dialogCheckVisible" id="checkDialog" width="470px">
        <el-form :rules="rules" label-width="80px">
          <div style="background:#F8F8F8">
            <el-form-item label="请假单号">{{checkLeave.leaveNo}}</el-form-item>
            <el-form-item label="创建人">{{checkLeave.creatorName}} {{checkLeave.createTime}}</el-form-item>
            <el-form-item label="长者姓名">
              {{checkLeave.elderName}} {{checkLeave.buildingName}}-{{checkLeave.roomName}}-{{checkLeave.bedName}}
            </el-form-item>
            <el-form-item label="请假日期">
              {{checkLeave.startDate}}<span v-if="checkLeave.startDiet===1">({{checkLeave.startDiet | dietFilter}})</span> {{checkLeave.startTime}}至
              {{checkLeave.endDate}}<span v-if="checkLeave.endDiet===1">({{checkLeave.endDiet | dietFilter}})</span> {{checkLeave.endTime}}
            </el-form-item>
            <el-form-item label="请假事由">{{checkLeave.reason}}</el-form-item>
            <el-form-item label="请假说明">{{checkLeave.remark}}</el-form-item>
          </div>
          <el-form-item label="审核说明" prop="handleResult" style="margin:15px 0 30px;">
            <el-input type="textarea" v-model="checkLeave.handleResult" maxlength="200" show-word-limit clearable></el-input>
          </el-form-item>
          <div class="buttons" style="text-align:center;">
            <el-button type="primary" @click="checkIdea(1)">审核通过</el-button>
            <el-button @click="checkIdea(-1)">审核不通过</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import utilsTable from "@/utils/table";
import ubElder from "@/components/elder";

export default {
  components: { ubElder },
  data() {
    return {
      elderName: "",
      roomId: "",
      loading: false,
      buildingOption: [],
      floorOption: [],
      roomOption: [],
      elderOption: [],
      allElderOption: [],
      currentPage: 1,
      totalPage: 0,
      tableData: [],
      dialogNewVisible: false,
      dialogCheckVisible: false,
      searchForm: {
        buildingId: "",
        floor: "",
        roomId: "",
        elderId: "",
        status: "",
        leaveStatus: "",
        pageIndex: 1,
        pageSize: 10,
      },
      newLeave: {
        startDiet: 0,
        endDiet: 0,
        remark: "",
      },
      checkLeave: {
        handleResult: "无",
      },
      statusOption: [
        {
          label: "待审核",
          value: 0,
        },
        {
          label: "已审核",
          value: 1,
        },
        {
          label: "已作废",
          value: -1,
        },
      ],
      returnStatusOption: [
        {
          label: "未外出",
          value: 0,
        },
        {
          label: "已外出",
          value: 1,
        },
        {
          label: "已回院",
          value: 2,
        },
      ],
      reasonOption: [],
      rules: {
        buildingFloor: [
          { required: true, message: "", trigger: "blur,change" },
        ],
        checkoutRemark: [
          { required: true, message: "", trigger: "blur,change" },
        ],
        checkoutDate: [{ required: true, message: "", trigger: "blur,change" }],
        handleResult: [
          { required: false, message: "", trigger: "blur,change" },
        ],
      },
    };
  },
  created() {
    let noCheckUserID = this.$store.state.noCheckUserID;
    if (noCheckUserID !== "") {
      this.searchForm.elderId = noCheckUserID;
    }
    this.initBuilding();
    this.getOptionData();
  },
  methods: {
    ...utilsTable,
    // 从字典获取<长者请假事由>
    getOptionData() {
      axios
        .fetch("commonServer", "/dict/getItemViewsByParentNo", {
          parentNos: '长者请假事由'
        })
        .then(res => {
          this.reasonOption = res.data.map(item=>{
            return item.itemValue;
          })
        });
    },
    fetchData() {
      let that = this;
      axios
        .fetch("elderServer", "/elderLeave/query", this.searchForm)
        .then((res) => {
          this.tableData = res.data;
          this.totalPage = res.total;
          // this.currentPage = 1;
          for (let i = 0; i < that.tableData.length; i++) {
            that.tableData[i].startTime = that.tableData[i].startDate.split(
              " "
            )[1];
            that.tableData[i].endTime = that.tableData[i].endDate?that.tableData[i].endDate.split(" ")[1]:'';
            that.tableData[i].startDate = that.tableData[i].startDate?that.tableData[i].startDate.split(
              " "
            )[0]:'';
            that.tableData[i].endDate = that.tableData[i].endDate ? that.tableData[i].endDate.split(" ")[0] : '';
          }
        });
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.fetchData();
    },
    //楼宇 楼层 房间 床位控件
    initBuilding() {
      axios.fetch("oaServer", "/org/building/list").then((res) => {
        this.buildingOption = res.data.map((item) => {
          return {
            value: item.buildingId,
            label: item.buildingName,
            floors: item.floors,
          };
        });
      });
    },
    changeBuilding(value) {
      this.floorOption = [];
      this.roomOption = [];
      this.elderOption = [];
      this.searchForm.floor = "";
      this.searchForm.roomId = "";
      this.searchForm.elderId = "";
      if (value == "") return;
      for (let i = 0; i < this.buildingOption.length; i++) {
        if (this.buildingOption[i].value == value) {
          if (typeof this.buildingOption[i].floors == "number") {
            for (let j = 0; j < this.buildingOption[i].floors; j++) {
              let sub = {};
              sub.value = j + 1;
              sub.label = j + 1 + "层";
              this.floorOption.push(sub);
            }
          }
        }
      }
    },
    changeFloor(value) {
      this.roomOption = [];
      this.elderOption = [];
      this.searchForm.roomId = "";
      this.searchForm.elderId = "";
      if (value == "") return;
      let data = {
        buildingId: this.searchForm.buildingId,
        floor: value,
        pageSize: 1000,
      };
      axios.fetch("oaServer", "/org/room/list", data).then((res) => {
        this.roomOption = res.data.map((item) => {
          return {
            label: item.roomName,
            value: item.roomId,
          };
        });
      });
    },
    changeRoom(id) {
      this.elderOption = [];
      this.searchForm.elderId = "";
      if (id == "") return;
      let data = {
        roomId: id,
        status: 100,
      };
      axios.fetch("elderServer", "/elderInfo/all", data).then((res) => {
        this.elderOption = res.data.map((item) => {
          return {
            label: item.elderName,
            value: item.elderId,
          };
        });
      });
    },
    //联想输入法的相关函数
    querySearch(queryString, cb) {
      console.log(queryString);
      this.allElderOption = [];
      if (queryString.length !== 0) {
        let data = {
          status: 100,
          elderName: queryString,
        };
        axios.fetch("elderServer", "/elderInfo/all", data).then((res) => {
          if (res.data.length == 0) {
            return this.$message.error("搜索不到用户");
          }
          for (let i = 0; i < res.data.length; i++) {
            let elderOptionItem = {
              value: res.data[i].elderName + " " + res.data[i].roomName,
              elderId: res.data[i].elderId,
            };
            this.allElderOption.push(elderOptionItem);
          }
        });
        // var results = queryString ? allElderOption.filter(this.createFilter(queryString)) : allElderOption;
      }
      // 调用 callback 返回建议列表的数据
      cb(this.allElderOption);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      this.newLeave.elderId = item.elderId;
    },
    submitApply() {
      if (
        this.newLeave.elderId === "" ||
        this.newLeave.elderId === null ||
        this.newLeave.elderId === undefined
      ) {
        this.$message.error("请选择长者姓名");
        return;
      } else if (
        this.newLeave.startDate === "" ||
        this.newLeave.startDate === null ||
        this.newLeave.startDate === undefined
      ) {
        this.$message.error("请选择请假开始日期");
        return;
      } else if (
        this.newLeave.reason === "" ||
        this.newLeave.reason === null ||
        this.newLeave.reason === undefined
      ) {
        this.$message.error("请选择请假事由");
        return;
      }

      this.newLeave.startDiet = this.newLeave.startDiet === true ? 1 : 0;
      // this.newLeave.endDiet = this.newLeave.endDiet === true ? 1 : 0;

      axios
        .fetch("elderServer", "/elderLeave/get/intersection", {
          elderId: this.newLeave.elderId,
          startDate: this.newLeave.startDate,
          // endDate: this.newLeave.endDate,
        })
        .then((res) => {
          if (res.code == 200) {
            axios
              .fetch("elderServer", "/elderLeave/update", this.newLeave)
              .then((res) => {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.dialogNewVisible = false;
                this.fetchData();
              });
          }
        });
    },
    applyCancel() {
      this.dialogNewVisible = false;
    },
    //请假单审核
    applyLeave() {
      this.dialogLeaveVisible = true;
    },
    checkIdea(status) {
      // if(this.checkLeave.handleResult === '' || this.checkLeave.handleResult === null || this.checkLeave.handleResult === undefined){
      //   this.$message.error('请输入审核说明');return;
      // }
      let data = {
        leaveId: this.checkLeave.leaveId,
        elderId: this.checkLeave.elderId,
        startDate: this.checkLeave.startDate + " " + this.checkLeave.startTime,
        // endDate: this.checkLeave.endDate + " " + this.checkLeave.endTime,
        startDiet: this.checkLeave.startDiet,
        // endDiet: this.checkLeave.endDiet,
        handleResult: this.checkLeave.handleResult,
        status: status,
      };
      axios.fetch("elderServer", "/elderLeave/check", data).then((res) => {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.dialogCheckVisible = false;
        this.fetchData();
      });
    },
    cancel() {
      this.dialogCheckVisible = false;
    },
    //新建请假单
    newLeaves() {
      this.newLeave = {
        startDiet: 0,
        // endDiet: 0,
        remark: "",
      };
      this.elderName = "";
      this.dialogNewVisible = true;
    },
    //审核
    check(data) {
      this.checkLeave = data;
      this.checkLeave.handleResult = "无";
      this.dialogCheckVisible = true;
    },
    //查看
    see(data) {
      this.$router.push({
        path: "/elder/checkSee",
        query: {
          leaveId: data.leaveId,
        },
      });
    },
    //查询
    searchInfo() {
      this.searchForm.pageIndex = 1;
      this.currentPage = 1;
      this.fetchData();
    },
    //重置
    reset() {
      (this.searchForm = {
        buildingId: "",
        floor: "",
        roomId: "",
        elderId: "",
        status: "",
        pageIndex: 1,
        pageSize: 10,
      }),
        (this.currentPage = 1);
      this.floorOption = [];
      this.roomOption = [];
      this.elderOption = [];
      this.fetchData();
    },
    del(data) {
      let param = {
        leaveId: data.leaveId,
      };
      this.$confirm("是否确认作废?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .fetch("elderServer", "/elderLeave/invalid", param)
            .then((res) => {
              this.$message.success(res.data);
              this.fetchData();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废",
          });
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "请假查看") {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack) {
      this.reset();
    } else {
      this.fetchData();
    }
    this.$route.meta.isBack = false;
  },
  filters: {
    statusFilter: (val) => {
      if (val == 0) {
        val = "待审核";
      } else if (val == 1) {
        val = "已审核";
      } else if (val == -1) {
        val = "已作废";
      }
      return val;
    },
    dietFilter: (val) => {
      if (val == 1) {
        val = "餐";
      } else {
        val = "";
      }
      return val;
    },
    leaveStatus(val) {
      switch (val) {
        case 0:
          return "未外出";
          break;
        case 1:
          return "已外出";
          break;
        case 2:
          return "已回院";
          break;

        default:
          return "";
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-form-item__label {
  color: #666;
}
/deep/.el-form-item__content {
  color: #333;
}
.tableRedTip {
  color: #eb6969;
  border: 1px solid #eb6969;
  font-size: 12px;
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  border-radius: 2px;
}
.margin_left10 {
  margin-left: 10px;
}
.button-green {
  color: #fff;
  background: #6cbc6c;
}
/deep/ #newDialog .el-input {
  width: 220px;
}
/deep/ #newDialog .el-textarea {
  width: 280px;
}
/deep/ #checkDialog {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-dialog__body {
    padding: 25px 10px;
  }
}
/deep/ .el-input__count {
  line-height: 20px;
}
</style>