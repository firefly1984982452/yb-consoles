<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData">
      <el-form-item label="用户名">
        <el-input clearable v-model="searchData.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="显示名">
        <el-input clearable v-model="searchData.displayName" placeholder="请输入显示名"></el-input>
      </el-form-item>
      <el-form-item label="所属员工">
        <ub-employee clearable v-model="searchData.employeeId" placeholder="请选择员工"></ub-employee>
      </el-form-item>
      <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col></el-col>
        <el-col class="right">
          <el-button type="success" icon="el-icon-plus" @click="editItem({enabled:true,employeeId:''})">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table class="ub-table" :data="listData" stripe border>
        <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="真实姓名"></el-table-column>
        <el-table-column prop="displayName" label="显示名"></el-table-column>
        <el-table-column prop="employeeId" label="所属员工ID"></el-table-column>
        <el-table-column prop="enabled" label="是否有效" :formatter="status"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="editItem(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="账号" placement="top">
              <el-button @click="accountItem(scope.row)" icon="el-icon-s-operation" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="密码" placement="top">
              <el-button v-permission="'uban.oa.employee.password'" @click="showPassword(scope.row)" icon="iconfont iconcaozuotubiao-zhongzhimima" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button @click="removeItem(scope.row)" icon="el-icon-delete-solid" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog :title="editTitle" :visible.sync="editVisible" width="500px" center top="20vh" modal="true">
      <el-form :model="currentItem" :label-position="left" status-icon ref="itemForm" label-width="80px">
        <el-form-item label="用户名" prop="userName" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.userName" maxlength="20" show-word-limit type="text" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.realName" maxlength="20" show-word-limit type="text" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="显示名" prop="displayName" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.displayName" maxlength="20" show-word-limit type="text" placeholder="显示名"></el-input>
        </el-form-item>
        <el-form-item label="所属员工" prop="employeeId" :show-message="false">
          <ub-employee clearable v-model="currentItem.employeeId" @change="employeeChange"></ub-employee>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有效" prop="enabled" :show-message="false" required>
              <el-switch v-model="currentItem.enabled" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="editForm()">确 定</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <ub-password ref="thePassword"></ub-password>
  </div>
</template>

<script>
import _ from "lodash";
import { axios } from "youban-utils";
import utilsTable from "@/utils/table";
import ubEmployee from "@/components/employee"
import ubPassword from "@/components/password"

export default {
  components: { ubEmployee, ubPassword },
  data() {
    return {
      listData: [],
      dataCount: 0,
      currentItem: {},
      editVisible: false,
      editTitle: '',
      searchData: {
        userName: '',
        displayName: '',
        employeeId: '',
        pageSize: 10,
        pageIndex: 1
      }
    };
  },
  created() {
    let employeeId = parseInt(this.$route.query.employeeId);
    if(employeeId) {
      this.searchData.employeeId = employeeId;
    }
    this.fetchData();
  },
  methods: {
    ...utilsTable,
    showPassword(item) {
      this.$refs['thePassword'].show(item);
    },
    search() {
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    reset() {
      this.searchData.userName = '';
      this.searchData.displayName = '';
      this.searchData.employeeId = '';
      this.changePage(1);
    },
    fetchData() {
      let that = this;
      axios.fetch("userServer", "/permission/queryAdminUsers", this.searchData).then(res => {
        that.listData = res.data;
        that.dataCount = res.total;
      });
    },
    editItem(item) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = _.clone(item);
      this.editTitle = item.userId ? "编辑用户信息" : "新增用户";
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        axios.fetch("userServer", item.userId ? "/permission/updateUser" : "/permission/createUser", item).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("请确认是否删除此用户，一旦删除，相关的用户账号信息也将一并删除，且无法恢复！！！").then(() => {
        axios.fetch("userServer", "/permission/removeUser", { userId: item.userId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    accountItem(item) {
      this.$router.push({ path: 'account', query: { userId: item.userId } });
    },
    employeeChange(item) {
      if(item) {
        this.currentItem.realName = item.employeeName;
        this.currentItem.displayName = item.employeeName;
      }
    },
  },
};
</script>