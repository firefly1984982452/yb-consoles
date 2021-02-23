<template>
  <div>
    <div>
      <el-row type="flex" class="pannel">
        <el-col :sapn="24" class="right">
          <el-button type="primary" @click="add" icon="el-icon-plus">新增场次</el-button>
        </el-col>
      </el-row>
      <el-table :data="listData" border class="ub-table">
        <el-table-column prop="activityDate" label="日期" min-width="80" align="left"></el-table-column>
        <el-table-column prop="name" label="场次" align="center" min-width="80"></el-table-column>
        <el-table-column prop="headCount" label="参与人数" align="center" min-width="40"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="60" :formatter="statusFormatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="参与人员" placement="top">
              <el-button @click="users(scope.row)" icon="iconfont iconcaozuotubiao-chakan" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="scope.row.status==1">
              <el-button @click="edit(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="top" content="删除" v-if="scope.row.status==1 && scope.row.headCount==0">
              <el-popconfirm confirmButtonText="确定" @onConfirm="deleteData(scope.row)" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="确认删除此记录？">
                <i slot="reference" class="el-icon-delete-solid danger" style="font-size:18px;margin-left:8px" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog title="活动场次" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :close-on-click-modal="false" width="500px">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px" style="min-hei">
        <el-row>
          <el-col :span="24">
            <el-form-item label="日期" prop="activityDate">
              <el-date-picker v-model="form.activityDate" type="date" placeholder="选择活动日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="场次名称" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入场次名称" maxlength="16" show-word-limit></el-input>
              <div class="options">
                <el-button type="info" @click="selectOption($event)" size="small">上午</el-button>
                <el-button type="info" @click="selectOption($event)" size="small">下午</el-button>
                <el-button type="info" @click="selectOption($event)" size="small">晚间</el-button>
              </div>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="参与人员" :visible.sync="dialogUserVisible" v-if="dialogUserVisible" :close-on-click-modal="false" width="1000px">
      <user :project="project" :session="form" @saved="fetchData" @finished="fetchData();dialogUserVisible=false;"></user>
    </el-dialog>

  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";
import user from "./user";

export default {
  props: {
    project: {
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
      dialogUserVisible: false,
      optionTitle: "",
      listData: [],
      dataCount: 0,
      form: {},
      todo: {},
      optionParent: {},
      dateRange: [],
      searchData: {
        pageSize: 10,
        pageIndex: 1,
      },
      status: [
        { id: 1, name: "进行中" },
        { id: 5, name: "已结束" },
      ],
      rules: {
        name: [
          {
            required: true,
            message: "请输入场次名称",
            trigger: ["blur", "change"],
          },
        ],
        activityDate: [
          {
            required: true,
            message: "请输入日期",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {},
  mounted() {},
  components: { user },
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
          "/api/project/session/page/" + this.project.id,
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          that.listData = res.data;
          that.dataCount = res.total;
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
    deleteData(data) {
      axios
        .fetch(
          "activityServer",
          "/api/project/session/" + data.id,
          null,
          null,
          "delete"
        )
        .then((res) => {
          this.$message.success("删除成功！");
          this.fetchData();
        });
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
  },
};
</script>
<style scoped>
.name {
  display: inline-block;
  vertical-align: top;
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
</style>