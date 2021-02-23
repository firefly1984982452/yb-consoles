<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="12">
          <el-select v-model="currentRoleId" @change="roleChange" placeholder="请选择角色">
            <el-option v-for="item in roles" :key="item.roleId" :value="item.roleId" :label="item.title"></el-option>
          </el-select>
          <el-input v-if="currentRoleId" class="input" placeholder="输入关键字进行过滤" clearable v-model="filterText"></el-input>          
        </el-col>
        <el-col :span="12" class="right">
          <el-button v-if="currentRoleId" @click="saveItems">保存</el-button>
        </el-col>
      </el-row>
      <el-tree ref="theTree" :data="list" node-key="relationId" :check-strictly="checkStrictly"
        :default-checked-keys="checkedList" :default-expanded-keys="checkedList" :filter-node-method="filterNode"
        :props="props" show-checkbox>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :class="getItemClass(data, node)">{{ node.label }}[{{ node.key }}]<span v-if="data.permissionValue">-【{{ data.permissionValue }}-{{ data.remark }}】</span></span>
          <span>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click.stop="editItem(data)" v-if="data.relationId > 0" class="button" size="mini" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加" placement="top">
              <el-button @click.stop="addItem(data)" class="button" size="mini" icon="el-icon-plus"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button @click.stop="removeItem(data)" v-if="data.relationId > 0" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog :title="editTitle" :visible.sync="editVisible" width="500px" center top="20vh" modal="true">
      <el-form :model="currentItem" :label-position="left" status-icon ref="itemForm" label-width="80px">
        <el-form-item label="权限名称" prop="title" :show-message="false" required>
          <el-input readonly v-model.trim="currentItem.title" maxlength="10" show-word-limit type="text" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="权限值" prop="permissionValue" :show-message="false" :required="permissionValues && permissionValues.length" v-if="permissionValues && permissionValues.length">
          <el-select class="select" v-model="currentItem.permissionValue" placeholder="请选择">
            <el-option v-for="item in permissionValues" :key="item.id" :value="item.permissionValue" :label="item.permissionValue + '-' + item.valueTitle"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="权限值" prop="permissionValue" :show-message="false">
          <el-input clearable v-model.trim="currentItem.permissionValue" maxlength="255" show-word-limit autosize type="textarea" placeholder="权限值"></el-input>
        </el-form-item>
        <el-form-item label="值描述" prop="remark" :show-message="false">
          <el-input clearable v-model.trim="currentItem.remark" maxlength="255" show-word-limit autosize type="textarea" placeholder="权限值描述"></el-input>
        </el-form-item> -->
        <el-form-item label="优先级" prop="priority" :show-message="false" required>
          <el-input-number v-model="currentItem.priority" label="优先级"></el-input-number>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否授权" prop="granted" :show-message="false" required>
              <el-switch v-model="currentItem.granted" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="editForm">确 定</el-button>
        <el-button @click="editVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  data() {
    return {
      list: [],
      resources: [],
      relations: [],
      checkedList: [],
      checkedList0: [],
      checkStrictly: true,
      props: {
        label: 'title',
        children: 'children'
      },
      roles: [],
      currentRoleId: null,
      filterText: '',
      currentItem: {},
      editVisible: false,
      editTitle: '',
      permissionValues: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs['theTree'].filter(val);
    }
  },
  created() {
    let roleId = parseInt(this.$route.query.roleId);
    if(roleId) {
      this.currentRoleId = roleId;
    }
    axios.fetch("userServer", "/permission/getRoles", {}).then(res => {
      this.roles = res.data;
    });
  },
  mounted() {
    axios.fetch("userServer", "/permission/getTenantResources", {}).then(res => {
      this.resources = res.data;
      this.fetchData();
    });
  },
  methods: {
    getItemClass(data, node) {
      let className = '';
      if(data.granted === false) {
        className = 'delete';
      }
      if((node.checked || node.indeterminate) && data.relationId < 0 || !(node.checked || node.indeterminate) && data.relationId > 0) {
        className += ' alert';
      }
      return className;
    },
    addItem(item) {
      let newItem = _.clone(item);
      newItem.relationId = 0;
      newItem.granted = true;
      newItem.priority = 0;
      this.editItem(newItem, true);
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
      this.fetchPermissionValues(item.resourceId);
      this.editTitle = item.relationId > 0 ? "编辑授权信息" : "新增授权"; 
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = _.clone(that.currentItem);
        item.parent = undefined;
        item.children = undefined;
        item.roleId = this.currentRoleId;
        if(item.permissionValue) {
          let itemValue = this.permissionValues.find(it => it.permissionValue == item.permissionValue);
          if(itemValue) {
            item.remark = itemValue.valueTitle;
          }
        }
        axios.fetch("userServer", item.relationId > 0 ? "/permission/updateRelation" : "/permission/createRelation", item).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("请确认是否删除？").then(() => {
        axios.fetch("userServer", "/permission/removeRelation", { relationId: item.relationId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    roleChange(roleId) {
      this.currentRoleId = roleId;
      this.fetchData();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    saveItems() {
      let tree = this.$refs['theTree'];
      let checkedKeys = tree.getCheckedKeys();
      let halfCheckedKeys = tree.getHalfCheckedKeys();
      let checkedList = _.union(checkedKeys, halfCheckedKeys);
      let checkedList0 = this.checkedList0;
      let deleteList = _.difference(checkedList0, checkedList);
      let createList = [];
      checkedList.forEach(value => {
        if(value < 0) {
          createList.push(value);
        }
      });
      let list = _.union(createList, deleteList);
      if(list.length <= 0) {
        this.$message("无权限项变化！");
        return;
      }
      let that = this;
      this.$confirm(`请确认本次操作：增加权限 ${ createList.length } 项，删除 ${ deleteList.length } 项。`).then(() => {
        axios.fetch("userServer", "/permission/batchRelations", { roleId: that.currentRoleId, relations: list.join(',') }).then(res => {
          that.$message.success("操作成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    setLeafNodeChecked() {
      this.checkStrictly = false;
      this.$nextTick(() => {
        let list = this.relations;
        let tree = this.$refs['theTree'];
        list.forEach(item => {
          if(!item.children || item.children.length <= 0) {
            tree.setChecked(item.relationId, true);
          }
        });
      });
    },
    fetchData() {
      if(!this.currentRoleId) {
        return;
      }
      this.checkStrictly = true;
      axios.fetch('userServer', '/permission/getRelationsByRole', { roleId: this.currentRoleId }).then(res => {
        this.relations = res.data;
        this.handleResource();
      });
    },
    fetchPermissionValues(resourceId) {
      axios.fetch('userServer', '/permission/getPermissionValues', { resourceId }).then(res => {
        this.permissionValues = res.data;
      });
    },
    handleResource() {
      let resources = {};
      let list = this.relations;
      let checkedList0 = [];
      let checkedList = [];
      list.forEach(item => {
        resources[item.resourceId] = item;
        checkedList.push(item.relationId);
        checkedList0.push(item.relationId);
      });
      let resultList = [];
      this.makeTree(resultList, list, resources);

      let unPermissions = [];
      list = this.resources;
      list.forEach(item => {
        item.relationId = undefined;
        item.parent = undefined;
        item.children = undefined;
        if(!resources[item.resourceId]) {
          item.relationId = -item.resourceId;
          resources[item.resourceId] = item;
          unPermissions.push(item);
        }
      });

      this.makeTree(resultList, unPermissions, resources);
      this.list = resultList;
      this.checkedList = checkedList;
      this.checkedList0 = checkedList0;
      this.$nextTick(() => {
        this.setLeafNodeChecked();
      });
    },
    makeTree(resultList, list, resources) {
      list.forEach(item => {
        let pushed = false;
        if(item.parentId) {
          let parent = resources[item.parentId];
          if(parent) {
            item.parent = parent;
            if(!parent.children) {
              parent.children = [];
            }
            parent.children.push(item);
            pushed = true;
          }
        }
        if(!pushed) {
          resultList.push(item);
        }
      });
      return resultList;
    },
  }
}
</script>

<style lang="less" scoped>
.input {
  width: inherit;
}
.right {
  text-align: right;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.button {
  font-size: 14px !important;
}
.delete {
  text-decoration:line-through;
}
.alert {
  color: red;
}
.select {
  display: inherit !important;
}
</style>