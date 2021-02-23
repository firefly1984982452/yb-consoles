<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData" label-width="80">
      <el-form-item label="医嘱时间" v-if="period==2">
        <el-date-picker @change="search" v-model="dateRange" style="width:250px" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="开始时间" v-else>
        <el-date-picker @change="search" v-model="dateRange" style="width:250px" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="长者信息">
        <el-input v-model.trim="searchData.search_LIKES_name" placeholder="姓名/入院编号" @change="search" clearable style="width:250px;">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="left" :span="6">
          <el-button-group>
            <el-button type="primary" :class="{'inactive':period==1}" @click.native.stop="period=2;status=[];search()">临时医嘱</el-button>
            <el-button type="primary" :class="{'inactive':period==2}" @click.native.stop="period=1;status=[];search()">长期医嘱</el-button>
          </el-button-group>
        </el-col>
        <el-col class="right" :span="18">
          <div style="padding: 10px 10px;">
            <el-checkbox-group v-model="status" @change="search">
              <el-checkbox :label="1">待校对</el-checkbox>
              <el-checkbox :label="2">已校对</el-checkbox>
              <el-checkbox :label="5" v-if="period==2">执行完</el-checkbox>
              <el-checkbox :label="5" v-if="period==1">已停止</el-checkbox>
              <el-checkbox :label="10">已作废</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <div style="width:calc(100% + 50px);overflow:hidden">
        <el-table :data="listData" border ref="adviceTable" style="margin-left:-48px" class="ub-table" default-expand-all="true" :row-class-name="tableRowClassName" @expand-change="expandSelect">
          <el-table-column type="expand" width="0">
            <template slot-scope="props">
              <el-table :data="props.row.items" style="width: calc(100% - 47px);margin-left:47px;" class="two-list" :row-class-name="tableRowClassName(props)" v-if="props.row.itemCount>1">
                <el-table-column label="" width="360" key="20">
                </el-table-column>
                <el-table-column label="组" width="50" key="21">
                  <template slot-scope="scope">
                    <span v-if="scope.row.sortId==props.row.itemCount">┗</span><span v-else>┃</span>
                  </template>
                </el-table-column>
                <el-table-column label="内容" min-width="250" key="22" align="left">
                  <template slot-scope="scope">
                    {{scope.row.name}}</br>{{scope.row.standard}}
                  </template>
                </el-table-column>
                <el-table-column label="单次剂量" width="100" key="23">
                  <template slot-scope="scope">
                    {{scope.row.useCount}}{{scope.row.useUnit}}
                  </template>
                </el-table-column>
                <el-table-column label="用法/频次" min-width="100" align="left" key="24">
                </el-table-column>
                <el-table-column label="天数" width="80" v-if="period==2" key="25"></el-table-column>
                <el-table-column label="总量" width="100" align="left" v-if="period==2" key="26">
                  <template slot-scope="scope" v-if="scope.row.quantity!=0">
                    {{scope.row.quantity}}{{scope.row.unit}}
                  </template>
                </el-table-column>
                <el-table-column label="开嘱医生" width="80" prop="doctorName" key="28"></el-table-column>
                <el-table-column label="停止时间" width="180" v-if="period==1" key="27"></el-table-column>
                <el-table-column label="操作" align="right" key="29" class-name="right" min-width="100">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看" placement="top">
                      <el-button size="mini" @click="view(scope.row)" icon="iconfont iconcaozuotubiao-chakan"></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="房间床位" align="left" width="80" key="1">
            <template slot-scope="scope">
              {{scope.row.roomName}}-{{scope.row.bedName}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="长者" width="80" key="2"></el-table-column>
          <el-table-column prop="startTime" label="医嘱时间" width="200" v-if="period==2" key="3">
            <template slot-scope="scope">
              <i class="iconfont icongantanhao-sanjiaokuang danger" v-if="scope.row.urgent==1 && period==2"></i>
              {{scope.row.startTime}}
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="200" v-if="period==1" key="4"></el-table-column>
          <el-table-column label="组" width="50" key="5">
            <template slot-scope="scope">
              <span v-if="scope.row.itemCount>1">┏</span>
            </template>
          </el-table-column>
          <el-table-column label="内容" min-width="250" key="6" align="left">
            <template slot-scope="scope">
              {{scope.row.main.name}}</br>{{scope.row.main.standard}}
            </template>
          </el-table-column>
          <el-table-column label="单次剂量" width="100" key="7">
            <template slot-scope="scope">
              {{scope.row.main.useCount}}{{scope.row.main.useUnit}}
            </template>
          </el-table-column>
          <el-table-column label="用法/频次" min-width="100" align="left" key="8">
            <template slot-scope="scope">
              {{usage(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column label="天数" width="80" prop="day" v-if="period==2" key="9"></el-table-column>
          <el-table-column label="总量" width="100" align="left" v-if="period==2" key="10">
            <template slot-scope="scope" v-if="scope.row.main.quantity!=0">
              {{scope.row.main.quantity}}{{scope.row.main.unit}}
            </template>
          </el-table-column>
          <el-table-column label="开嘱医生" width="80" prop="doctorName" key="11"></el-table-column>
          <el-table-column prop="endTime" label="停止时间" width="180" v-if="period==1" key="12" class-name="endTime"></el-table-column>
          <el-table-column label="操作" key="13" class-name="right" min-width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="停止" placement="top" v-if="userId == scope.row.doctorId && scope.row.status==2 && period==1">
                <el-button @click="stop(scope.row)" icon="iconfont iconcaozuotubiao-zantinggefu danger" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" placement="top" content="作废" v-if="userId == scope.row.doctorId && ((scope.row.status<5 && scope.row.period==2) || (scope.row.status<2 && scope.row.period==1))">
                <el-button icon="el-icon-error danger" size="mini" @click="invalidData(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <el-button size="mini" @click="view(scope.row.main)" icon="iconfont iconcaozuotubiao-chakan"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-drawer title="医嘱信息" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :with-header="true" tabindex="99" size="600px">
      <viewAdvice :advice="advice" :adviceItem="adviceItem"></viewAdvice>
    </el-drawer>

    <el-dialog title="作废医嘱" :close-on-click-modal="false" :visible.sync="invalidVisible" v-if="invalidVisible" width="500px" :destroy-on-close="true">
      <el-form :model="invalidForm" ref="invalidForm" label-width="100px">
        <p class="title">确认作废此条医嘱吗？</p>
        <p class="subtitle">{{invalidSubTitle}}</p>
        <el-form-item label="备注" prop="invalidRemark" style="width:80%">
          <el-input type="textarea" v-model="invalidForm.invalidRemark" maxlength="30" clearable show-word-limit="true" :rows="4" placeholder="请填写备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="invalidVisible=false">取 消</el-button>
        <el-button type="primary" @click="invalidSubmit()">作 废</el-button>
      </div>
    </el-dialog>

    <el-dialog title="停止长期医嘱" :close-on-click-modal="false" :visible.sync="stopVisible" v-if="stopVisible" width="500px" :destroy-on-close="true">
      <el-form :model="invalidForm" ref="invalidForm" :rules="rules" label-width="100px">
        <el-row>
          <div v-if="invalidSubTitle" class="stop-notice">{{invalidSubTitle}}</div>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="停止时间" prop="endTime">
              <el-date-picker v-model="invalidForm.endTime" type="datetime" placeholder="选择停止时间" :disabled="invalidForm.now==1" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="" label-width="0">
              <el-checkbox v-model="invalidForm.now" @change="setNow" style="color:rgb(255, 68, 68);" label="立即停止" true-label="1" false-label="0"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="停嘱内容" prop="invalidRemark">
          <div class="stop-content">
            <div class="items">
              <div v-for="item in adviceItems" :key="item.id">
                <span class="standard">{{item.name}}</span> <span class="use"> {{item.useCount}}{{item.useUnit}}</span>
              </div>
            </div>
            <div class=" rate">
              {{group.rate}}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="invalidRemark">
          <el-input type="textarea" v-model="invalidForm.invalidRemark" maxlength="30" clearable show-word-limit="true" :rows="4" placeholder="请填写备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="stopVisible=false">取 消</el-button>
        <el-button type="primary" @click="stopSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";
import viewAdvice from "./viewAdvice";
import utils from "../utils";

export default {
  data() {
    let that = this;
    return {
      dialogFormVisible: false,
      invalidVisible: false,
      stopVisible: false,
      listData: [],
      period: 2,
      dataCount: 0,
      form: {},
      userId: null,
      id: null,
      advice: {},
      adviceItem: {},
      adviceItems: [],
      group: {},
      rules: {
        endTime: [
          {
            required: true,
            message: "请选择停止时间",
            trigger: ["blur", "change"],
          },
        ],
      },
      invalidSubTitle: "",
      invalidForm: {},
      status: [],
      dateRange: [],
      searchData: {
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  components: { viewAdvice },
  mounted() {},
  created() {
    this.userId = axios.getCurrentUser().userId;
    this.fetchData();
  },
  methods: {
    ...utils,
    expandSelect(row, expandedRows) {
      this.$refs.adviceTable.toggleRowExpansion(row, true);
    },
    tableRowClassName({ row }) {
      let className = "";
      if (row.status == 10) {
        className += " invalid";
      } else if (row.status == 2) {
        className += " running";
      } else if (row.status == 5) {
        className += " stopped";
      } else {
        className += " commit";
      }
      if (row.itemCount == 1) {
        className += " single";
      }
      return className;
    },
    search() {
      this.changePage(1);
    },
    reset() {
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    fetchData() {
      let that = this;
      if (this.dateRange) {
        this.searchData.search_GED_startTime = this.dateRange[0];
        this.searchData.search_LED_startTime = this.dateRange[1];
      } else {
        this.searchData.search_GED_startTime = "";
        this.searchData.search_LED_startTime = "";
      }
      if (this.status.length > 0) {
        let str = "";
        for (var i in this.status) {
          str += this.status[i] + ",";
        }
        this.searchData.search_ICI_status = str;
      } else {
        this.searchData.search_ICI_status = "";
      }
      this.searchData.search_EQI_period = this.period;
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/page",
          this.searchData,
          "form",
          "get"
        )
        .then((res) => {
          that.listData = res.data;
          that.dataCount = res.total;
        });
    },
    edit(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.dialogFormVisible = true;
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },

    view(item) {
      this.adviceItem = item;
      this.id = item.groupId;
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/" + item.adviceId,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.advice = res.data;
        });
      this.dialogFormVisible = true;
    },
    stop(data) {
      this.invalidForm = {};
      this.id = data.id;
      this.adviceItems = [];
      if (data.itemCount > 1) {
        this.invalidSubTitle =
          "此医嘱包含多种同组药物，系统同步停止本组所有药物医嘱；如需部分停药，请停嘱后重开继续用药的医嘱。";
      } else {
        this.invalidSubTitle = "";
      }
      this.adviceItems.push(data.main);
      if (data.itemCount > 1) {
        for (var i in data.items) {
          this.adviceItems.push(data.items[i]);
        }
      }
      this.group = data;
      this.stopVisible = true;
    },
    invalidData(data) {
      this.invalidForm = {};
      this.id = data.id;
      if (data.itemCount > 1) {
        this.invalidSubTitle =
          "此医嘱包含多种同组药物，系统同步作废本组所有药物医嘱。";
      } else {
        this.invalidSubTitle = "";
      }
      this.invalidVisible = true;
    },
    invalidSubmit() {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/invalid/" +
            this.id +
            "?invalidRemark=" +
            this.invalidForm.invalidRemark,
          null,
          null,
          "delete"
        )
        .then((res) => {
          this.$message.success("操作成功！");
          this.fetchData();
          this.invalidVisible = false;
        });
    },
    doStopSubmit() {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/stop/" + this.id,
          this.invalidForm,
          "json"
        )
        .then((res) => {
          this.$message.success("操作成功！");
          this.fetchData();
          this.stopVisible = false;
        });
    },
    stopSubmit() {
      if (this.invalidForm.now == 1) {
        this.doStopSubmit();
      } else {
        this.$refs["invalidForm"].validate((valid) => {
          if (!valid) {
            return true;
          } else {
            this.doStopSubmit();
          }
        });
      }
    },
  },
};
</script>
<style scoped>
.el-input >>> .el-input-group__append,
.el-input >>> .el-input-group__prepend {
  padding-left: 8px;
  padding-right: 8px;
  min-width: 35px;
}

/deep/ .el-table__expanded-cell {
  padding: 0px;
}
/deep/ .el-table__expanded-cell .el-table__header-wrapper {
  display: none;
}

/deep/ .el-table__expanded-cell table {
  border-left: 1px solid #dcdfe6;
}
/deep/ .invalid {
  text-decoration: line-through;
  color: #ff4444;
}
/deep/ .invalid .cell {
  color: #a6b2bd;
}
/deep/ .stopped .cell {
  color: #a6b2bd;
}

/deep/ .running .cell {
  color: #3d8ef8;
}

/deep/ .commit .endTime .cell,
/deep/ .running .endTime .cell {
  color: #ff4444;
}

/deep/ .commit .cell {
  color: #37474f;
}
.el-button-group .inactive {
  background: #fff;
  color: #516072;
}

/deep/ .el-drawer__header {
  border-bottom: 1px solid #dddddd;
  padding-bottom: 8px;
  margin-bottom: 0px;
}
/deep/ :focus {
  outline: 0;
}
.title {
  text-align: center;
  font-weight: 700;
}
.subtitle {
  width: 90%;
  text-align: center;
  margin: 8px 0px 8px 0px;
}
/deep/ .single .el-table__expand-icon {
  display: none;
}
/deep/ .single + tr {
  display: none;
}
/deep/ .el-table__body-wrapper .right {
  text-align: right;
}
.items {
  width: 245px;
  float: left;
  border-right: 1px solid rgba(204, 204, 204, 1);
}
.items .standard {
  width: 180px;
  display: inline-block;
}
.rate {
  margin-left: 16px;
  width: 80px;
  float: left;
}
.stop-content {
  float: left;
  padding: 8px;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(204, 204, 204, 1);
  border-radius: 4px;
}
.stop-notice {
  color: rgb(255, 153, 0);
  font-weight: 700px;
}
/deep/ .el-drawer {
  overflow: auto;
}
</style>