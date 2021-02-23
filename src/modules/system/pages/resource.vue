<template>
  <div>
    <div class="content">
      <el-table :data="dataList" row-key="resourceId" :tree-props="{children:'children',hasChildren:'hasChildren'}" border stripe class="ub-table">
        <el-table-column label="名称" class-name="left">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i> {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="resourceId" label="资源ID" width="100px" class-name="left"></el-table-column>
        <el-table-column prop="viewable" label="是否可见" width="80px" :formatter="booleanFormat"></el-table-column>
        <el-table-column prop="enabled" label="是否有效" width="80px" :formatter="booleanFormat"></el-table-column>
        <el-table-column prop="dispIndex" label="显示顺序" width="80px" class-name="right"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180px"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="editItem(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加子资源" placement="top">
              <el-button @click="childItem(scope.row)" icon="el-icon-document-add" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button @click="removeItem(scope.row)" icon="el-icon-delete-solid" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="editTitle" :visible.sync="editVisible" width="600px" center :close-on-click-modal="false" top="10vh" modal="true">
        <el-form :model="currentItem" :label-position="left" status-icon ref="itemForm" label-width="80px">
          <el-form-item label="上级资源" prop="parentId" :show-message="false" required>
            <el-cascader :options="dataList" placeholder="（无上级或请选择）" v-model="currentItem.parentId" :props="{ checkStrictly: true, emitPath: false, value: 'resourceId', label: 'title' }"></el-cascader>
          </el-form-item>
          <el-form-item label="上级ID" prop="parentId" :show-message="false" required>
            <el-input readonly v-model="currentItem.parentId" type="text" placeholder="上级资源ID"></el-input>
          </el-form-item>
          <el-form-item label="资源ID" prop="resourceId" :show-message="false" required>
            <el-input :readonly="!currentItem.create" clearable v-model="currentItem.resourceId" type="number" min="1" max="2147483647" placeholder="资源ID"></el-input>
          </el-form-item>
          <el-form-item label="资源名称" prop="title" :show-message="false" required>
            <el-input clearable v-model.trim="currentItem.title" maxlength="20" show-word-limit type="text" placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源编码" prop="resourceNo" :show-message="false" required>
            <el-input clearable v-model.trim="currentItem.resourceNo" maxlength="50" show-word-limit type="text" placeholder="资源编码"></el-input>
          </el-form-item>
          <el-form-item label="资源描述" prop="description" :show-message="false">
            <el-input clearable v-model.trim="currentItem.description" maxlength="50" show-word-limit autosize type="textarea" placeholder="资源描述"></el-input>
          </el-form-item>
          <el-form-item label="链接地址" prop="url" :show-message="false">
            <el-input clearable v-model.trim="currentItem.url" maxlength="255" show-word-limit autosize type="textarea" placeholder="链接地址"></el-input>
          </el-form-item>
          <el-form-item label="资源图标" prop="icon" :show-message="false">
            <el-input clearable v-model.trim="currentItem.icon" maxlength="255" show-word-limit type="text" placeholder="资源图标">
              <template #prepend>
                <i :class="currentItem.icon"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="资源分组" prop="resourceGroup" :show-message="false">
            <el-input clearable v-model.trim="currentItem.resourceGroup" maxlength="50" show-word-limit type="text" placeholder="资源分组"></el-input>
          </el-form-item>
          <el-form-item label="显示顺序" prop="dispIndex" :show-message="false" required>
            <el-input-number v-model="currentItem.dispIndex" label="显示顺序"></el-input-number>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否可见" prop="viewable" :show-message="false" required>
                <el-switch v-model="currentItem.viewable"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否有效" prop="enabled" :show-message="false" required>
                <el-switch v-model="currentItem.enabled"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="editForm()">确 定</el-button>
          <el-button @click="editVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  components: { },
  data() {
    return {
      dataList: [],
      currentItem: {},
      resources: [],
      editVisible: false,
      editTitle: '',
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    booleanFormat(row, column, value, index) {
      return value ? '是' : '否';
    },
    fetchData() {
      axios.fetch("userServer", "/permission/getResources", {}).then((res) => {
        let list = this.resources = res.data;
        let resultList = [];
        let resources = this.makeDictionary(list);
        this.makeTree(resultList, list, resources);
        this.dataList = resultList;
      });
    },
    editItem(item) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = _.clone(item);
      this.editTitle = item.resourceId > 0 ? "编辑资源信息" : "新增资源"; 
    },
    childItem(parent) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = {
        create: true,
        parent,
        parentId: parent.resourceId,
        dispIndex: 0,
        viewable: true, enabled: true };
      this.editTitle = "添加子资源";
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = _.clone(that.currentItem);
        let resourceId = item.resourceId;
        if(!/(^[1-9]\d*$)/.test(resourceId)) {
          that.$message.error("资源ID只允许正整数");
          return;
        }
        if(parseInt(resourceId) > 2147483647) {
          that.$message.error("资源ID的数值太大");
          return;          
        }
        let parent = item.parent;
        if(parent && parent.children) {
          let sameItem = parent.children.find(it => {
            if(it.title == item.title && it.resourceId != item.resourceId) {
              return true;
            }
            return false;
          });
          if(sameItem) {
            that.$message.error("同级别资源里已有相同的资源名称");
            return;
          }
        }
        item.parent = undefined;
        item.children = undefined;
        item.createTime = undefined;
        item.updateTime = undefined;
        axios.fetch("userServer", item.create ? "/permission/createResource" : "/permission/updateResource", item).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      if(!item.parent || item.parentId == 0) {
          this.$message.error("这是顶级资源，不允许删除");
          return;
      }
      let that = this;
      this.$confirm("确认删除吗？").then(() => {
        axios.fetch("userServer", "/permission/removeResource", { resourceId: item.resourceId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
    makeDictionary(list) {
      let dictionary = {};
      list.forEach(item => {
        dictionary[item.resourceId] = item;
      });
      return dictionary;
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
  },
};
</script>

<style lang="less" scoped>
/deep/td.left {
  text-align: left;
}
/deep/td.right {
  text-align: right;
}
/deep/.el-cascader {
  display: inherit;
}
</style>