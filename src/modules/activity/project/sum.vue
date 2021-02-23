<template>
  <div>
    <div>
      <el-form :inline="true" class="search" :model="searchData" label-width="80">
        <el-row>
          <el-col :span="24">
            <el-form-item label="" label-width="0">
              <el-date-picker v-model="searchData.dateRange" @change="search" style="width:260px" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model.trim="searchData.searchKey" placeholder="姓名" @change="search" clearable style="width:250px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="listData" border @sort-change="sort" class="user-table" ref="elderTable" v-if="sessions && sessions.length>0" style="width: 100%" max-height="800">
        <el-table-column prop="elderName" fixed label="姓名" align="center" width="80" class-name="name">
          <template slot-scope="scope">
            <span>{{scope.row.elderName}}</span>
            <span>{{scope.row.bedName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sessionCount" fixed sortable label="参与场次" align="center" width="80"></el-table-column>
        <el-table-column prop="totalScore" fixed sortable label="累计结果" align="center" width="80"></el-table-column>
        <el-table-column prop="highestScore" fixed sortable label="单场最高" align="center" width="80"></el-table-column>
        <el-table-column :label="labelName(item)" align="center" width="80" v-for="(item,index) in sessions" :key="index" :render-header="renderheader">
          <template slot-scope="scope">
            <span v-if="scope.row.scores[index]>=0">{{scope.row.scores[index]}}</span><span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";

export default {
  props: {
    projectId: {
      type: Number,
      default() {
        return null;
      },
    },
  },
  data() {
    let that = this;
    return {
      listData: [],
      dataCount: 0,
      sessions: [],
      elderScores: [],
      searchData: {
        dateRange: [],
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  computed: {},
  mounted() {},
  components: {},
  created() {
    let end = this.getDay(0);
    let begin = this.getDay(-31);
    this.searchData.dateRange = [begin, end];
    this.fetchData();
  },
  methods: {
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    search() {
      this.changePage(1);
    },
    sort(val) {
      if (val.order == "ascending") {
        this.searchData.sort = val.prop;
      } else if (val.order == "descending") {
        this.searchData.sort = "-" + val.prop;
      } else {
        this.searchData.sort = "";
      }
      this.fetchData();
    },
    fetchData() {
      let data = {};
      if (this.searchData.dateRange) {
        this.searchData.beginDate = this.searchData.dateRange[0];
        this.searchData.endDate = this.searchData.dateRange[1];
      } else {
        this.$message.error("请选择时间范围");
        return false;
      }
      let that = this;
      axios
        .fetch(
          "activityServer",
          "/api/project/session/summary/" + this.projectId,
          this.searchData,
          "json"
        )
        .then((res) => {
          let resData = res.data;
          that.sessions = resData.sessions;
          that.dataCount = resData.total;
          that.listData = resData.elderScores;
        });
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return true;
        } else {
          if (!this.partake) {
            this.form.partakePoint = 0;
          }
          if (!this.achive) {
            this.form.achiveScore = 0;
            this.form.achivePoint = 0;
          }
          axios
            .fetch("activityServer", "/api/project/session", this.form, "json")
            .then((res) => {
              this.$message.success("保存成功");
              this.fetchData();
              this.dialogFormVisible = false;
            });
        }
      });
    },
    edit(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.form.headCount = null;
      this.dialogFormVisible = true;
    },
    add() {
      this.form = { projectId: this.project.id, name: "" };
      this.dialogFormVisible = true;
    },
    users(data) {
      this.form = data;
      this.dialogUserVisible = true;
    },
    selectOption($event) {
      this.form.name = $event.target.innerText;
    },
    statusFormatter(row, column, value, index) {
      let objects = this.status;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == value) {
          return objects[key].name;
        }
      }
    },
    labelName(item) {
      return item.activityDate.substring(5) + "/(" + item.name + ")";
    },
    getDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds); //注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    renderheader(h, { column, $index }) {
      return h("span", {}, [
        h("span", {}, column.label.split("/")[0]),
        h("br"),
        h("span", {}, column.label.split("/")[1]),
      ]);
    },
  },
};
</script>
<style scoped>
.name {
  margin: 0px;
  padding: 0px;
}
.name .cell {
  text-align: left;
}
.name span {
  height: 16px;
  display: inline-block;
  text-align: left;
}

.options .el-button--small {
  padding: 6px 2px;
  min-width: 50px;
  background: #f2f4f5;
  color: #818d99;
}
</style>