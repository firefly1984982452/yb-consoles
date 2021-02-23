<template>
  <div class="app-container" id="liveCrList">
    <el-row>
      <el-form ref="searchData" :model="searchData" label-width="70px">
        <el-col :xl="4" :lg="5" style="margin-top: 20px;margin-left: 10px;">
          <el-form-item label="分类名称">
            <el-select v-model="searchData.type" placeholder="请选择" clearable>
              <el-option v-for="item in typeOptons" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" style="margin-top: 20px;margin-left: 10px;">
          <el-form-item label="巡查时间">
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchData.dateFrameArr" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="5" style="margin-top: 20px;margin-left: 10px;">
          <el-form-item label="巡查情况">
            <el-select v-model="searchData.patrolStatus" placeholder="请选择" clearable>
              <el-option v-for="item in patrolStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="4" :lg="5" style="margin-top: 20px;">
          <el-form-item label="状态">
            <el-select v-model="searchData.status" placeholder="请选择" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="2" class="searchBtns" style="margin-left: 1.5%;margin-top: 20px;">
        <el-button style="background: #2368D3;color: #FFFFFF;" type="" @click="searchdData()"><i style="font-size:12px" class="iconfont iconjichutubiao-chaxun"></i>查询</el-button>
      </el-col>
      <el-col :span="2" class="searchBtns" style="margin-left: 0.5%;margin-top: 20px;">
        <el-button type="" @click="resizeData()"><i style="font-size:12px" class="iconfont iconjichutubiao-zhongzhi"></i>重置</el-button>
      </el-col>
      <el-col style="background: rgb(255, 255, 255);border-radius: 4px;">
        <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" @row-click="selectRow" border style="width:95%;position:relative;left:2%;" :cell-style="{padding: '5px 0'}">
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column label="编号" width="60" type="index">
          </el-table-column>
          <el-table-column label="任务名称" min-width="100">
            <template slot-scope="scope">{{scope.row.patrolSchedule.scheduleName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="分类" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.patrolSchedule.scheduleType==1">设备巡查</span>
              <span v-if="scope.row.patrolSchedule.scheduleType==2">楼层巡查</span>
            </template>
          </el-table-column>
          <el-table-column label="巡查日期" min-width="140">
            <template slot-scope="scope">{{scope.row.patrolDate}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="开始时间" min-width="100">
            <template slot-scope="scope">{{scope.row.startTime}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="结束时间" min-width="100">
            <template slot-scope="scope">{{scope.row.endTime}}</template>
          </el-table-column>
          <el-table-column label="任务点位" min-width="90">
            <template slot-scope="scope">{{scope.row.positionCount}}</template>
          </el-table-column>

          <el-table-column label="未巡查点位" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.uncheckCount!=0" style="color:#F6812B">{{scope.row.uncheckCount}}</span>
              <span v-if="scope.row.uncheckCount==0" style="color:#666666">{{scope.row.uncheckCount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="异常点位" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.abnormalCount!=0" style="color:#EB6969">{{scope.row.abnormalCount}}</span>
              <span v-if="scope.row.abnormalCount==0" style="color:#666666">{{scope.row.abnormalCount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="完成比例" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.perFinsh != 0">{{scope.row.perFinsh}}%</span>
              <span v-if="scope.row.perFinsh == 0">{{scope.row.perFinsh}}</span>
            </template>
          </el-table-column>
          <el-table-column label="巡查情况" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.patrolStatus==0" style="color:#666666">未开始</span>
              <span v-if="scope.row.patrolStatus==1" style="color:#2FC07A">正常</span>
              <span v-if="scope.row.patrolStatus==2" style="color:#F6812B">异常</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0" style="color:#666666">未开始</span>
              <span v-if="scope.row.status==1" style="color:#0078D4">进行中</span>
              <span v-if="scope.row.status==2" style="color:#2FC07A">已完成</span>
              <span v-if="scope.row.status==3" style="color:#8A30C6">已核查</span>
              <span v-if="scope.row.status==4" style="color:#EB6969">已过期</span>
            </template>
          </el-table-column>
          <el-table-column label="巡查人">
            <template slot-scope="scope">{{scope.row.handlerName}}</template>
          </el-table-column>
          <el-table-column label="核查人" min-width="70">
            <template slot-scope="scope">{{scope.row.checkerName}}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="核查时间" min-width="160">
            <template slot-scope="scope">{{scope.row.checkTime}}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                <el-button size="mini" class="lookta" @click="seeDetail(scope.row)"><i class="iconfont iconcaozuotubiao-chakan"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核" placement="top-end">
                <el-button v-if="scope.row.status != 3&&scope.row.status != 4" size="mini" class="lookta" @click="shenHe(scope.row)"><i class="iconfont iconcaozuotubiao-shenhe"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 10px;margin-left:27px;">
          <el-col :span="4">
            <el-button size="small" @click="exportTask" icon="el-icon-download">导出巡查结果</el-button>
          </el-col>
          <el-col :span="20">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchData.pageIndex" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog title="核查巡查任务" :visible.sync="dialogFormVisible" width="500px">
      <el-row class="warp" v-loading="loading" id="">
        <p class="titleHeCha">确定核查通过吗？</p>
        <div class="itemContentBox">
          <p class="pItem"><span>巡查日期</span><span style="font-weight:bolder">&nbsp;&nbsp;{{dataShenhe.patrolDate}}</span></p>
          <p class="pItem"><span>任务名称</span><span style="font-weight:bolder">&nbsp;&nbsp;{{patrolSchedule.scheduleName}}</span></p>
          <p class="pItem" style="width:95%"><span>任务完成比例</span><span style="font-weight:bolder">&nbsp;&nbsp;{{dataShenhe.perFinsh}}</span></p>
          <p class="pItem"><span>任务点位</span><span style="font-weight:bolder">&nbsp;&nbsp;{{dataShenhe.positionCount}}</span></p>
          <p class="pItem" style="width:89%"><span>未巡查点位</span><span style="font-weight:bolder;color:#F6812B">&nbsp;&nbsp;{{dataShenhe.uncheckCount}}</span></p>
          <p class="pItem"><span>异常点位</span><span style="font-weight:bolder;color:#EB6969">&nbsp;&nbsp;{{dataShenhe.abnormalCount}}</span></p>
        </div>
        <el-col style="margin-top:20px;">
          <el-row style="text-align:center;margin:20px 0px 20px 0;" :gutter="10" type="flex" justify="center">
            <el-col class :xl="5" :lg="6">
              <el-button style="background:#3F51B5;color:#fff" @click="saveDict()">确定</el-button>
            </el-col>
            <el-col class :xl="5" :lg="6">
              <el-button @click="dialogFormVisible=false">取消</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import settings from "@/settings";

export default {
  data() {
    return {
      visible: false,
      btnArr: ["巡查计划", "巡查任务"],
      routerArr: ["/fire/xunCha/xunChaPlan", "/fire/xunCha/xunChaWork"],
      isactive: "1",
      showFalse: false,
      show3: false,
      dialogFormVisible: false,
      dictForm: [],
      title: "核查巡查任务",
      activeName2: "first",
      typeOptons: [
        { label: "设备巡查", value: 1 },
        { label: "楼层巡查", value: 2 },
      ],
      statusOptions: [
        { label: "未开始", value: 0 },
        { label: "进行中", value: 1 },
        { label: "已完成", value: 2 },
        { label: "已核查", value: 3 },
        { label: "已过期", value: 4 },
      ],
      patrolStatusOptions: [
        { label: "未开始", value: 0 },
        { label: "正常", value: 1 },
        { label: "异常", value: 2 },
      ],
      loading: true,
      searchData: {
        pageIndex: 1,
        pageSize: 10,
        dateFrameArr: "",
      },
      dataShenhe: {},
      patrolSchedule: {},
      totalPage: 0,
      tableData: [],
    };
  },
  mounted() {
    this.allData();
  },
  methods: {
    seeDetail(value) {
      this.$router.push({
        path: "/fire/xunCha/xunChaWorkDetail",
        query: {
          taskId: value.taskId,
          scheduleType: value.patrolSchedule.scheduleType,
          status: value.status,
        },
      });
    },
    allData() {
      let dateFrame =
        this.searchData.dateFrameArr == "" ||
        this.searchData.dateFrameArr == null
          ? ""
          : this.searchData.dateFrameArr.toString();
      this.searchData = {
        type: this.searchData.type,
        dateFrameArr: this.searchData.dateFrameArr,
        dateFrame: dateFrame,
        status: this.searchData.status,
        patrolStatus: this.searchData.patrolStatus,
        pageSize: 10,
        pageIndex: this.searchData.pageIndex,
      };
      axios
        .fetch("fireServer", "/patrol/task/get/pager", this.searchData)
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.tableData = res.data;
            this.totalPage = res.total;
            this.$forceUpdate();
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning",
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    handleCurrentChange(value) {
      this.searchData.pageIndex = value;
      this.allData();
    },
    searchdData() {
      this.searchData.pageIndex = 1;
      this.allData();
    },
    resizeData() {
      this.searchData.type = "";
      this.searchData.dateFrame = "";
      this.searchData.dateFrameArr = "";
      this.searchData.status = "";
      this.searchData.patrolStatus = "";
      this.searchData.pageIndex = 1;
      this.allData();
    },
    shenHe(value) {
      this.dialogFormVisible = true;
      this.dataShenhe = value;
      this.patrolSchedule = value.patrolSchedule;
      console.log(this.dataShenhe);
    },
    saveDict() {
      let data = {
        taskId: this.dataShenhe.taskId,
        status: 3,
        checkName: this.dataShenhe.checkName,
      };
      axios
        .fetch("fireServer", "/patrol/task/examine/task", data)
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.tableData = res.data;
            this.totalPage = res.total;
            this.dialogFormVisible = false;
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning",
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    selectRow(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    exportTask() {
      const select = this.$refs.multipleTable.selection;
      if (select.length == 0) {
        this.$message.error("请选择任务!");
        return false;
      } else {
        let data = select.map((item) => item.taskId);
        let taskIds = "";
        for (var i = 0; i < select.length; i++) {
          taskIds += select[i].taskId + ",";
        }
        let user = axios.getCurrentUser();

        let url =
          settings.servers["fireServer"] +
          "/patrol/task/download?taskIds=" +
          taskIds;
        var req = new XMLHttpRequest();
        req.open("get", url, true);
        req.responseType = "blob";
        req.setRequestHeader("authToken", user.id);
        req.onload = function (event) {
          var blob = req.response;
          // var fileName = req.getResponseHeader("fileName"); //if you have the fileName header available
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "消防巡更记录表.xlsx";
          link.click();
        };
        req.send();
      }
    },
  },
};
</script>

<style scoped>
.addEquipment {
  width: 95px;
  height: 36px;
  background: #6cbc6c;
  color: white;
  float: right;
  margin-right: 1%;
  margin-top: 20px;
}

.addEquipment .iconfont {
  color: white;
  font-size: 12px !important;
}

.box-card .item {
  margin-bottom: 0px;
}

.dialogText {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
}

/deep/.el-checkbox__label {
  width: 0px;
}

.checkBtn {
  width: 95px;
  height: 36px;
  border: none;
  margin-bottom: 5px;
}

.searchBtnsStyle {
  width: 95px;
  height: 36px;
  background: #4687e1;
  border: 1px solid #4687e1;
  border-radius: 4px;
  color: white;
  margin-bottom: 5px;
}
/*.el-pagination{
		position: absolute;
		bottom: 14px;
		left: 50%;
		-webkit-transform: translateX(-50%);
		text-align: center;
		margin: 10px 0;
	}*/
.titleHeCha {
  width: 442px;
  height: 22px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  margin: 0 auto;
}
.itemContentBox {
  padding: 20px 0;
  width: 480px;
  height: 180px;
  background: rgba(248, 248, 248, 1);
  margin: 20px auto;
}
.pItem {
  width: 400px;
  line-height: 20px;
  margin: 0 auto;
  margin-top: 10px;
}
.pItem:nth-child(1) {
  margin-top: 0;
}
</style>