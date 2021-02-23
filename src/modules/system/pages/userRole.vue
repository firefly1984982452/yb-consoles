<template>
  <div class="content">
    <el-row type="flex" class="pannel">
      <el-col></el-col>
      <el-col class="right">
        <el-button type="success" icon="el-icon-plus" @click="editItem({userType:'2',userId:'',enabled:true})">添加关系</el-button>
      </el-col>
    </el-row>
    <el-table class="ub-table" :data="listData" stripe border>
      <el-table-column prop="userType" label="关系类型" :formatter="userType"></el-table-column>
      <el-table-column prop="userId" label="所属ID"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="title" label="所属角色"></el-table-column>
      <el-table-column prop="enabled" label="是否有效" :formatter="status"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="授权" placement="top">
            <el-button @click="grantItem(scope.row)" icon="el-icon-set-up" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="removeItem(scope.row)" icon="el-icon-delete-solid" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="editTitle" :visible.sync="editVisible" width="500px" center top="20vh" modal="true">
      <el-form :model="currentItem" :label-position="left" status-icon ref="itemForm" label-width="80px">
        <el-form-item label="关系类型" prop="userType" :show-message="false" required>
          <el-select v-model="currentItem.userType" @change="userTypeChange">
            <el-option v-for="(value,key) in userTypes" :key="key" :value="key" :label="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentItem.userType == 0" label="用户" prop="userId" :show-message="false" required>
          <el-select filterable default-first-option v-model="currentItem.userId" @change="userChange">
            <el-option v-for="item in users" :key="item.userId" :value="item.userId" :label="item.displayName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentItem.userType == 1" label="员工" prop="userId" :show-message="false" required>
          <ub-employee clearable v-model="currentItem.userId" @change="employeeChange"></ub-employee>
        </el-form-item>
        <el-form-item v-if="currentItem.userType == 2" label="岗位" prop="userId" :show-message="false" required>
          <el-select filterable default-first-option v-model="currentItem.userId" @change="jobChange">
            <el-option v-for="item in jobs" :key="item.jobId" :value="item.jobId" :label="item.jobName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentItem.userType == 3" label="部门" prop="userId" :show-message="false" required>
          <el-select filterable default-first-option v-model="currentItem.userId" @change="deptChange">
            <el-option v-for="item in depts" :key="item.deptId" :value="item.deptId" :label="item.deptName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleId" :show-message="false" required>
          <el-select filterable default-first-option v-model="currentItem.roleId">
            <el-option v-for="item in roles" :key="item.roleId" :value="item.roleId" :label="item.title"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :show-message="false">
          <el-input readonly clearable v-model.trim="currentItem.remark" maxlength="255" show-word-limit type="text" placeholder="描述"></el-input>
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

const userTypes = {
  0: '用户',
  1: '员工',
  2: '岗位',
  3: '部门',
};

export default {
  components: { ubEmployee },
  data() {
    return {
      roles: [],
      jobs: [],
      depts: [],
      users: [],
      listData: [],
      currentItem: {},
      editVisible: false,
      editTitle: '新增角色关系',
      userTypes: userTypes,
    };
  },
  created() {
    axios.fetch("userServer", "/permission/getRoles", {}).then(res => {
      this.roles = res.data;
    });
    axios.fetch("oaServer", "/org/job/list", {}).then((res) => {
      this.jobs = res.data;
    });
    axios.fetch("oaServer", "/org/dept/list", {}).then(res => {
      this.depts = res.data;
    });
    axios.fetch("userServer", "/permission/getAdminUsers", {}).then(res => {
      this.users = res.data;
    });
    this.fetchData();
  },
  methods: {
    ...utilsTable,
    fetchData() {
      let that = this;
      axios.fetch("userServer", "/permission/getUserRoles", {}).then(res => {
        that.listData = res.data;
      });
    },
    editItem(item) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = item;
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        let sameItem = that.listData.find(it => {
          if(it.userType == item.userType && it.userId == item.userId && it.roleId == item.roleId) {
            return true;
          }
          return false;
        });
        if(sameItem) {
          that.$message.error("已存在相同的关系");
          return;
        }
        axios.fetch("userServer", "/permission/createUserRole", item).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("请确认是否删除？").then(() => {
        axios.fetch("userServer", "/permission/removeUserRole", { userType: item.userType, userId: item.userId, roleId: item.roleId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    grantItem(item) {
      this.$router.push({ path: 'relation', query: { roleId: item.roleId } });
    },
    userType(row, column, value, index) {
      return userTypes[value];
    },
    userTypeChange(value) {
      this.currentItem.userId = undefined;
      this.currentItem.remark = undefined;
    },
    jobChange(value) {
      let job = this.jobs.find(item => item.jobId == value);
      if(job) {
        this.currentItem.remark = job.jobName;
      }
    },
    employeeChange(item) {
      if(item) {
        this.currentItem.remark = item.employeeName;
      }
    },
    deptChange(value) {
      let dept = this.jobs.find(item => item.deptId == value);
      if(dept) {
        this.currentItem.remark = dept.deptName;
      }
    },
    userChange(value) {
      let user = this.users.find(item => item.userId == value);
      if(user) {
        this.currentItem.remark = user.displayName;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-select {
  display: inherit;
}
</style>