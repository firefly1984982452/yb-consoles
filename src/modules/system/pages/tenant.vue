<template>
  <div>
    <div class="content">
      <el-row>
        <el-col :span="12">
          <el-select v-model="currentTenantId" @change="tenantChange" placeholder="请选择机构">
            <el-option v-for="item in tenants" :key="item.tenantId" :value="item.tenantId" :label="item.tenantName"></el-option>
          </el-select>
          <el-input v-if="currentTenantId" class="input" placeholder="输入关键字进行过滤" clearable v-model="filterText"></el-input>          
        </el-col>
        <el-col :span="12" class="right">
          <el-button v-if="currentTenantId" @click="saveItems">保存</el-button>
        </el-col>
      </el-row>
      <el-tree ref="theTree" :data="list" node-key="id" :check-strictly="checkStrictly"
        :default-checked-keys="checkedList" :default-expanded-keys="checkedList" :filter-node-method="filterNode"
        :props="props" show-checkbox>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :class="getItemClass(data, node)">{{ node.label }}[{{ node.key }}]</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  data() {
    return {
      currentTenantId: null,
      tenants: [],
      resources: [],
      relations: [],
      list: [],
      checkedList: [],
      checkedList0: [],
      filterText: '',
      checkStrictly: true,
      props: {
        label: 'title',
        children: 'children'
      },
    }
  },
  watch: {
    filterText(val) {
      this.$refs['theTree'].filter(val);
    }
  },
  created() {
    this.currentTenantId = this.$route.query.tenantId;
    axios.fetch("userServer", "/permission/getTenants", {}).then(res => {
      this.tenants = res.data;
    });
  },
  mounted() {
    axios.fetch("userServer", "/permission/getResources", {}).then(res => {
      this.resources = res.data;
      this.fetchData();
    });
  },
  methods: {
    fetchData() {
      if(!this.currentTenantId) {
        return;
      }
      this.checkStrictly = true;
      axios.fetch('userServer', '/permission/getResourcesByTenant', { tenantId: this.currentTenantId }).then(res => {
        this.relations = res.data;
        this.handleResource();
      });
    },
    handleResource() {
      let resources = {};
      let list = this.relations;
      let checkedList0 = [];
      let checkedList = [];
      list.forEach(item => {
        resources[item.resourceId] = item;
        checkedList.push(item.id);
        checkedList0.push(item.id);
      });
      let resultList = [];
      this.makeTree(resultList, list, resources);

      let unPermissions = [];
      list = this.resources;
      list.forEach(item => {
        item.id = undefined;
        item.parent = undefined;
        item.children = undefined;
        if(!resources[item.resourceId]) {
          item.id = -item.resourceId;
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
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    getItemClass(data, node) {
      let className = '';
      if((node.checked || node.indeterminate) && data.id < 0 || !(node.checked || node.indeterminate) && data.id > 0) {
        className = 'alert';
      }
      return className;
    },
    tenantChange(tenantId) {
      this.currentTenantId = tenantId;
      this.fetchData();
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
        this.$message("资源项无变化！");
        return;
      }
      let that = this;
      this.$confirm(`请确认本次操作：增加资源 ${ createList.length } 项，删除 ${ deleteList.length } 项。`).then(() => {
        axios.fetch("userServer", "/permission/batchTenants", { tenantId: that.currentTenantId, relations: list.join(',') }).then(res => {
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
            tree.setChecked(item.id, true);
          }
        });
      });
    },
  },
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
</style>