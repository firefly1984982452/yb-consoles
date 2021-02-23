<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData">
      <el-form-item label="账号类别">
        <el-select clearable v-model="searchData.category">
          <el-option v-for="(value,key) in accountCategories" :key="key" :value="key" :label="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登录名">
        <el-input clearable v-model="searchData.loginName" placeholder="请输入登录名"></el-input>
      </el-form-item>
      <el-form-item label="所属用户">
        <el-select filterable default-first-option v-model="searchData.userId">
          <el-option v-for="item in users" :key="item.userId" :value="item.userId" :label="item.displayName"></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col></el-col>
        <el-col class="right">
          <el-button type="success" icon="el-icon-plus" @click="editItem({category:'10',enabled:true,create:true},true)">新增账号</el-button>
        </el-col>
      </el-row>
      <el-table class="ub-table" :data="listData" stripe border>
        <el-table-column prop="category" label="账号类别" :formatter="accountCategory"></el-table-column>
        <el-table-column prop="loginName" label="登录名"></el-table-column>
        <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="displayName" label="所属用户"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="enabled" label="是否有效" :formatter="status"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="editItem(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
            <!-- <el-tooltip class="item" effect="dark" content="复制" placement="top">
              <el-button @click="copyItem(scope.row)" icon="el-icon-document-copy" size="mini"></el-button>
            </el-tooltip> -->
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
        <el-form-item label="账号类别" prop="category" :show-message="false" required>
          <el-select :disabled="!currentItem.create" v-model="currentItem.category">
            <el-option v-for="(value,key) in accountCategories" :key="key" :value="key" :label="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName" :show-message="false" required>
          <el-input :readonly="!currentItem.create" clearable v-model.trim="currentItem.loginName" maxlength="50" show-word-limit autosize type="textarea" placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item label="相关密码" prop="password" :show-message="false">
          <el-input :readonly="!currentItem.create || currentItem.category == 0 || currentItem.category == 10" clearable v-model.trim="currentItem.password" maxlength="50" show-word-limit autosize type="textarea" placeholder="相关密码"></el-input>
        </el-form-item>
        <el-form-item label="所属用户" prop="userId" :show-message="false" required>
          <el-select filterable default-first-option v-model="currentItem.userId">
            <el-option v-for="item in users" :key="item.userId" :value="item.userId" :label="item.displayName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description" :show-message="false">
          <el-input clearable autosize v-model.trim="currentItem.description" maxlength="2048" show-word-limit type="textarea" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :show-message="false">
          <el-input clearable autosize v-model.trim="currentItem.remark" maxlength="50" show-word-limit type="textarea" placeholder="备注"></el-input>
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
  </div>
</template>

<script>
import _ from "lodash";
import { axios } from "youban-utils";
import utilsTable from "@/utils/table";
import ubEmployee from "@/components/employee"

const phoneChecker = /^1[3456789]\d{9}$/;
const accountCategories = {
  0: '手机登录',
  10: '密码登录',
  100: '微信登录',
  // 200: '人脸登录',
  300: '设备登录'
};

export default {
  components: { ubEmployee },
  data() {
    return {
      listData: [],
      dataCount: 0,
      currentItem: {},
      editVisible: false,
      editTitle: '',
      searchData: {
        category: '',
        loginName: '',
        userId: '',
        enabled: '',
        pageSize: 10,
        pageIndex: 1
      },
      accountCategories: accountCategories,
      users: [],
    };
  },
  created() {
    axios.fetch("userServer", "/permission/getAdminUsers", {}).then(res => {
      this.users = res.data;
    });
    let userId = parseInt(this.$route.query.userId);
    if(userId) {
      this.searchData.userId = userId;
    }
    this.fetchData();
  },
  methods: {
    ...utilsTable,
    accountCategory(row, column, value, index) {
      return accountCategories[value];
    },
    search() {
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    reset() {
      this.searchData.category = '';
      this.searchData.loginName = '';
      this.searchData.userId = '';
      this.searchData.enabled = '';
      this.changePage(1);
    },
    fetchData() {
      let that = this;
      axios.fetch("userServer", "/permission/queryAdminAccounts", this.searchData).then(res => {
        that.listData = res.data;
        that.dataCount = res.total;
      });
    },
    editItem(item, dontClone) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      if(dontClone) {
        this.currentItem = item;
      } else {
        this.currentItem = _.clone(item);
      }
      this.currentItem.category = this.currentItem.category.toString();
      this.editTitle = item.create ? "新增账号" : "编辑账号信息";
    },
    copyItem(item) {
      this.currentItem = _.clone(item);
      item.create = true;
      this.editItem(item, true);
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        if(item.category == 0) { // 手机登录
          if(!phoneChecker.test(item.loginName)){ 
            this.$message.error("手机号码有误，请重新输入");
            return;
          }
        } else if(item.category == 100 || item.category == 300) {
            if(!item.password) {
              this.$message.error("请填写相关密码");
              return;
            }
        }
        axios.fetch("userServer", item.create ? "/permission/createAccount" : "/permission/updateAccount", item).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("请确认是否删除此登录账号？").then(() => {
        axios.fetch("userServer", "/permission/removeAccount", { category: item.category, loginName: item.loginName }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-select {
  display: inherit;
}
</style>