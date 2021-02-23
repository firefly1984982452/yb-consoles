<template>
  <div style="min-height:500px;">
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :sapn="16" class="left">
          {{project.name}} {{session.activityDate}} {{session.name}} <el-tag type="success">{{statusFormatter(null,null,session.status)}}</el-tag>
        </el-col>
        <el-col :sapn="8" class="right" v-if="session.status==1">
          <el-button type="primary" @click="add" icon="el-icon-plus">添加参与人</el-button>
          <el-button @click="finish" icon="el-icon-plus">结束并提交结果</el-button>
        </el-col>
      </el-row>
      <el-table :data="listData" border class="ub-table" @row-dblclick="editRow">
        <el-table-column prop="elderName" label="参与人数" align="center" min-width="100"></el-table-column>
        <el-table-column prop="bedName" label="房间床位" align="center" min-width="100"></el-table-column>
        <el-table-column prop="score" label="完成次数" min-width="150">
          <template slot-scope="scope">
            <el-input-number v-model.trim="scope.row.score" :step="1" step-strictly v-if="!scope.row.disabled" :min="0" :max="999999"></el-input-number>
            <span v-if="scope.row.disabled">{{scope.row.score}}</span>
            <el-tooltip class="item" effect="dark" content="保存" placement="top" v-if="!scope.row.disabled">
              <el-button @click="updateScore(scope.row)" icon="iconfont iconsave-fill" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="top" v-if="scope.row.disabled && session.status == 1">
              <el-button @click="editRow(scope.row)" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="point" label="奖励积分" min-width="100">
          <template slot-scope="scope">
            <span v-if="session.status==5">{{scope.row.point}}</span>
            <span v-else>{{realPoint(scope.row.score)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60" v-if="session.status == 1">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top" content="删除" v-if="session.status==1">
              <el-popconfirm confirmButtonText="确定" @onConfirm="deleteData(scope.row)" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="确认删除此记录？">
                <i slot="reference" class="el-icon-delete-solid danger" style="font-size:18px;margin-left:8px" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog title="选择参与人员" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :close-on-click-modal="false" append-to-body width="700px">
      <div style="min-height:400px;">
        <el-form :inline="true" class="search" :model="searchData2" label-width="80">
          <el-row>
            <el-col :span="24">
              <el-form-item label="">
                <el-select v-model="searchData2.areaName" clearable placeholder="全部区域" style="width:110px" @change="search2">
                  <el-option v-for="item in areas" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-input v-model.trim="searchData2.name" placeholder="老人姓名/入院编号/房间号" @change="search2" clearable style="width:250px;">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="listData2" border class="user-table" ref="elderTable" @row-click="selectRow">
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" min-width="80" align="left">
            <template slot-scope="scope">
              <el-avatar v-if="scope.row.photo" :src="scope.row.photo" size="small"></el-avatar>
              <el-avatar v-else size="small">
                {{ scope.row.name[0]}}</el-avatar>
              <div class="name">
                <p>{{scope.row.name}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="areaName" label="区域" align="center" min-width="80"></el-table-column>
          <el-table-column prop="bedName" label="房间床位" align="center" min-width="80"></el-table-column>
          <el-table-column prop="checkinNo" label="入院编号" min-width="60"></el-table-column>
        </el-table>
        <el-pagination @current-change="changePage2" :total="dataCount2" :current-page="searchData2.pageIndex" :page-size="searchData2.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="addUser()">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :show-close="false" :visible.sync="dialogFinishVisible" width="500px" :destroy-on-close="true" append-to-body>
      <h2 class="notice-title">结束本场活动，提交结果记录</h2>
      <p class="notice-detail">提示：提交后不可再增加或修改记录，请核对确认后提交</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFinishVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitFinish()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";

export default {
  props: {
    project: {
      type: Object,
      default() {
        return null;
      },
    },
    session: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    let that = this;
    return {
      dialogFormVisible: false,
      dialogOptionsVisible: false,
      dialogFinishVisible: false,
      elders: [],
      areas: [],
      users: [],
      listData: [],
      dataCount: 0,
      listData2: [],
      dataCount2: 0,
      form: {},
      config: {},
      searchData: {
        pageSize: 10,
        pageIndex: 1,
      },
      searchData2: {
        areaName: null,
        name: null,
        pageSize: 10,
        pageIndex: 1,
      },
      status: [
        { id: 1, name: "进行中" },
        { id: 5, name: "已结束" },
      ],
    };
  },
  computed: {},
  mounted() {
    axios
      .fetch("activityServer", "/api/common/elders", null, null, "get")
      .then((res) => {
        this.elders = res.data;
      });
    axios
      .fetch("activityServer", "/api/common/areas", null, null, "get")
      .then((res) => {
        this.areas = res.data;
      });
    axios
      .fetch(
        "activityServer",
        "/api/project/config/" + this.project.id,
        null,
        null,
        "get"
      )
      .then((res) => {
        this.config = res.data;
      });
  },
  components: {},
  created() {
    this.fetchData();
  },
  methods: {
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
      axios
        .fetch(
          "activityServer",
          "/api/project/session/page-users/" + this.session.id,
          { pageSize: 2000, pageIndex: 1 },
          null,
          "get"
        )
        .then((res) => {
          let users = res.data;
          for (var i = 0; i < users.length; i++) {
            users[i].disabled = true;
          }
          let search = this.searchData;
          let begin = (search.pageIndex - 1) * search.pageSize;
          let end = search.pageIndex * search.pageSize;
          that.listData = users.slice(begin, end);
          that.dataCount = users.length;
          that.users = users;
        });
    },
    deleteData(data) {
      axios
        .fetch(
          "activityServer",
          "/api/project/session/delete-user/" + data.id,
          null,
          null,
          "delete"
        )
        .then((res) => {
          this.$message.success("删除成功！");
          this.fetchData();
          this.$emit("saved");
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
      this.reset2();
      this.dialogFormVisible = true;
    },
    selectOption($event) {
      this.form.name = $event.target.innerText;
    },
    selectRow(row) {
      this.$refs.elderTable.toggleRowSelection(row);
    },
    statusFormatter(row, column, value, index) {
      let objects = this.status;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == value) {
          return objects[key].name;
        }
      }
    },
    reset2() {
      this.searchData2.areaName = "";
      this.searchData2.name = "";
      this.changePage2(1);
    },
    search2() {
      this.searchData2.pageIndex = 1;
      this.fetchData2();
    },
    changePage2(value) {
      this.searchData2.pageIndex = value;
      this.fetchData2();
    },
    fetchData2() {
      debugger;
      let search = this.searchData2;
      let areaName = search.areaName;
      let name = search.name;
      let listData = this.elders.filter((item) => {
        //搜索过滤
        if (areaName && item.areaName != areaName) {
          return false;
        }
        if (
          name &&
          item.name.indexOf(name) == -1 &&
          item.bedName.indexOf(name) == -1 &&
          item.checkinNo.indexOf(name) == -1
        ) {
          return false;
        }
        //已选择过滤
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].elderId == item.id) {
            return false;
          }
        }
        return true;
      });
      this.dataCount2 = listData.length;
      let begin = (search.pageIndex - 1) * search.pageSize;
      let end = search.pageIndex * search.pageSize;
      this.listData2 = listData.slice(begin, end);
    },
    editRow(row, column, event) {
      if (this.session.status == 1) {
        row.disabled = false;
      }
    },
    addUser() {
      const select = this.$refs.elderTable.selection;
      if (select.length == 0) {
        this.$message.error("请选择长者!");
        return false;
      } else {
        let data = select.map((item) => item.id);
        axios
          .fetch(
            "activityServer",
            "/api/project/session/add-users/" + this.session.id,
            data,
            "json"
          )
          .then((res) => {
            this.$message.success("保存成功");
            this.fetchData();
            this.$emit("saved");
            this.dialogFormVisible = false;
          });
      }
    },
    updateScore(data) {
      if (data.score == undefined) {
        this.$message.error("请输入完成次数");
        return false;
      }

      axios
        .fetch(
          "activityServer",
          "/api/project/session/update-score/" + data.id + "/" + data.score,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.$message.success("保存成功");
          data.disabled = true;
        });
    },
    realPoint(score) {
      if (this.config) {
        let achiveScore = this.config.achiveScore;
        if (achiveScore == 0) {
          achiveScore = 1;
        }
        return (
          this.config.partakePoint +
          Math.floor(score / achiveScore) * this.config.achivePoint
        );
      } else {
        return 0;
      }
    },
    finish() {
      this.dialogFinishVisible = true;
    },
    submitFinish() {
      axios
        .fetch(
          "activityServer",
          "/api/project/session/finish/" + this.session.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.$message.success("操作成功");
          this.session.status = 5;
          this.dialogFinishVisible = false;
          this.$emit("finished");
        });
    },
  },
};
</script>
<style scoped>
.name {
  display: inline-block;
  vertical-align: middle;
  line-height: 0px;
}
.name p {
  margin: 0px;
  padding: 0px;
  height: 18px;
}
.summary span {
  margin-left: 16px;
}
.summary .count {
  font-weight: 700;
}
.summary .todo {
  color: #ff4444;
}
.options .el-button--small {
  padding: 6px 2px;
  min-width: 50px;
  background: #f2f4f5;
  color: #818d99;
}
/deep/ .user-table td,
/deep/ .user-table th {
  padding: 2px 12px 2px 2px;
}
/deep/ .iconsave-fill {
  font-size: 20px;
}
/deep/ .content .el-button--mini .el-icon-edit {
  font-size: 1rem;
}
.notice-title {
  width: 100%;
  text-align: center;
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
  color: #526069;
  line-height: 16px;
}
.notice-detail {
  margin: 30px 10px 0px 10px;
  height: 18px;
  font-size: 16px;
  color: #ff6600;
}
/deep/
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped.current-row
  td,
/deep/ .el-table__body tr.current-row > td {
  background-color: #ffffff;
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ffffff;
}
</style>