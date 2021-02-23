<template>
  <div class="content">
    <el-row type="flex" class="pannel">
      <el-col></el-col>
      <el-col class="right">
        <el-button type="success" icon="el-icon-plus" @click="editItem({enabled:true})">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table class="ub-table" :data="listData" stripe border>
      <el-table-column prop="roleId" label="角色ID" width="100"></el-table-column>
      <el-table-column prop="title" label="角色名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="enabled" label="是否有效" :formatter="status"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="editItem(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
          </el-tooltip>
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
        <el-form-item label="角色名称" prop="title" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.title" maxlength="10" show-word-limit type="text" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description" :show-message="false">
          <el-input clearable autosize v-model.trim="currentItem.description" maxlength="255" show-word-limit type="textarea" placeholder="描述"></el-input>
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

export default {
  data() {
    return {
      listData: [],
      currentItem: {},
      editVisible: false,
      editTitle: '',
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...utilsTable,
    fetchData() {
      let that = this;
      axios.fetch("userServer", "/permission/getRoles", {}).then(res => {
        that.listData = res.data;
      });
    },
    editItem(item) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = _.clone(item);
      this.editTitle = item.roleId ? "编辑角色信息" : "新增角色"; 
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        // 判断名称是否有相同
        let sameItem = that.listData.find(it => {
          if(it.title == item.title && it.roleId != item.roleId) {
            return true;
          }
          return false;
        });
        if(sameItem) {
          that.$message.error("角色名称已存在");
          return;
        }
        axios.fetch("userServer", item.roleId ? "/permission/updateRole" : "/permission/createRole", item).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("请确认是否删除此角色，一旦删除，相关的授权信息也将一并删除，且无法恢复！！！").then(() => {
        axios.fetch("userServer", "/permission/removeRole", { roleId: item.roleId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    grantItem(item) {
      this.$router.push({ path: 'relation', query: { roleId: item.roleId } });
    },
  },
};
</script>