<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="searchData.search_LIKES_name" clearable placeholder="姓名" @change="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="content">
      <el-table :data="listData" border class="ub-table">
        <el-table-column prop="elderName" label="姓名" align="center" min-width="80"></el-table-column>
        <el-table-column prop="bedName" label="房间床位" align="center" min-width="80"></el-table-column>
        <el-table-column prop="availablePoint" sortable label="可用积分" min-width="80"></el-table-column>
        <el-table-column prop="totalPoint" sortable label="累计积分" min-width="80"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="积分明细" placement="top">
              <el-button @click="details(scope.row)" icon="iconfont iconcaozuotubiao-chakan" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="edit(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog title="积分明细" :visible.sync="dialogDetailVisible" v-if="dialogDetailVisible" :close-on-click-modal="false" append-to-body width="800px">
      <el-table :data="listData2" border class="ub-table" ref="elderTable" style="min-height:400px;">
        <el-table-column prop="createTime" label="时间" align="center" min-width="100"></el-table-column>
        <el-table-column prop="changedPoint" label="积分变化值" align="center" min-width="50"></el-table-column>
        <el-table-column prop="reason" label="原因" min-width="40"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
      </el-table>
      <el-pagination @current-change="changePage2" :total="dataCount2" :current-page="searchData2.pageIndex" :page-size="searchData2.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      <span slot="footer">
        <el-button @click="dialogDetailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="调整积分" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="500px" :destroy-on-close="true" append-to-body>
      <el-form label-width="100px" ref="ruleForm" :rules="rules" :model="form">
        <el-form-item label="调整方式" prop="type">
          <el-radio-group v-model="form.type" @change="typeChanged">
            <el-radio-button v-for="item in types" :label="item.id" :key="item.id">{{item.name}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数额" prop="value">
          <el-input-number v-model.trim="form.value" :min="1" :max="999999"></el-input-number>
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-select v-model="form.reason" clearable placeholder="请选择">
            <el-option v-for="item in reasons" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input type="textarea" v-model="form.remark" style="width:100%" :rows="4" :maxlength=50 show-word-limit="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </span>
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
      dialogDetailVisible: false,
      listData: [],
      dataCount: 0,
      listData2: [],
      dataCount2: 0,
      form: {},
      elderId: null,
      searchData: {
        pageSize: 10,
        pageIndex: 1,
      },
      searchData2: {
        pageSize: 10,
        pageIndex: 1,
      },
      types: [
        { id: 1, name: "扣减" },
        { id: 2, name: "增加" },
      ],
      addOptioins: ["活动奖励", "其他"],
      reduceOptioins: ["兑换奖品", "其他"],
      reasons: [],
      rules: {
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: ["blur", "change"],
          },
        ],
        value: [
          {
            required: true,
            message: "请输入数额",
            trigger: ["blur", "change"],
          },
        ],
        reason: [
          {
            required: true,
            message: "请选择调整原因",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {},
  mounted() {},
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
          "/api/point/page",
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          that.listData = res.data;
          that.dataCount = res.total;
        });
    },

    edit(data) {
      this.form = { elderId: data.elderId, type: 1, reason: "" };
      this.dialogFormVisible = true;
      this.typeChanged();
    },
    typeChanged() {
      if (this.form.type == 1) {
        this.reasons = this.reduceOptioins;
      } else {
        this.reasons = this.addOptioins;
      }
      this.form.reason = "";
    },
    details(data) {
      this.elderId = data.elderId;
      this.changePage2(1);
      this.dialogDetailVisible = true;
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
      let that = this;
      axios
        .fetch(
          "activityServer",
          "/api/point/details/" + this.elderId,
          this.searchData2,
          null,
          "get"
        )
        .then((res) => {
          that.listData2 = res.data;
          that.dataCount2 = res.total;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return true;
        } else {
          if (this.form.type == 1) {
            this.form.changedPoint = -this.form.value;
          } else {
            this.form.changedPoint = this.form.value;
          }
          axios
            .fetch("activityServer", "/api/point/change", this.form, "json")
            .then((res) => {
              this.$message.success("操作成功");
              this.dialogFormVisible = false;
              this.fetchData();
            });
        }
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
.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td {
  background-color: #ffffff;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ffffff;
}

.view-container .search .el-button {
  width: 30px;
  min-width: 30px;
}
</style>