<template>
  <div class="content">
    <el-row type="flex" class="pannel">
      <el-col>
        <el-button type="primary">部门</el-button>
        <el-button @click="$router.push('job')">岗位</el-button>
      </el-col>
      <el-col class="right">
        <el-button type="success" icon="el-icon-plus" @click="editItem({status:1, syncStatus:1,deptNo: ''})">添加部门</el-button>
        <el-button class="button-purple" icon="el-icon-document-copy">同步数据</el-button>
      </el-col>
    </el-row>
    <el-table class="ub-table" :data="listData" stripe border>
      <el-table-column prop="deptId" label="部门ID" width="100"></el-table-column>
      <el-table-column prop="parentName" label="上级部门"></el-table-column>
      <el-table-column prop="deptName" label="部门名称"></el-table-column>
      <el-table-column prop="deptNo" label="部门类型">
        <template slot-scope="scope">
          <span>{{scope.row.deptNo | filterDeptNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" :formatter="status"></el-table-column>
      <el-table-column prop="syncStatus" label="是否同步" :formatter="syncStatus"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="editItem(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="removeItem(scope.row)" icon="el-icon-delete-solid" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="editTitle" :visible.sync="editVisible" width="500px" center top="20vh" modal="true">
      <el-form :model="currentItem" :label-position="left" status-icon ref="itemForm" label-width="80px">
        <el-form-item label="部门名称" prop="deptName" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.deptName" maxlength="10" show-word-limit type="text" placeholder="部门名称"></el-input>
        </el-form-item>
        <el-form-item label="部门类型" :show-message="false">
          <el-select v-model="currentItem.deptNo" placeholder="请选择岗位类型">
            <el-option v-for="item in deptNoData" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId" :show-message="false" required>
          <el-select v-model="currentItem.parentId" placeholder="请选择上级部门">
            <el-option v-for="item in listData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
            <el-option label="（无）" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否有效" prop="status" :show-message="false" required>
              <el-switch v-model="currentItem.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否同步" prop="syncStatus" :show-message="false" required>
              <el-switch v-model="currentItem.syncStatus" :active-value="1" :inactive-value="0"></el-switch>
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
</template>

<script>
var that;
import _ from "lodash";
import { axios } from "youban-utils";
import utilsTable from "@/utils/table";

export default {
  data() {
    return {
      listData: [],
      currentItem:  {
        deptNo:'',
      },
      editVisible: false,
      editTitle: '',
      deptNoData: [{
        name: '（无）',
        value: ''
      },{
        name: '管理部',
        value: 'management'
      },{
        name: '总务部',
        value: 'administration'
      },{
        name: '财务部',
        value: 'finance'
      },{
        name: '业务部',
        value: 'operation'
      },{
        name: '护理部',
        value: 'care'
      },{
        name: '医务部',
        value: 'medical'
      }],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...utilsTable,
    fetchData: function () {
      let that = this;
      axios.fetch("oaServer", "/org/dept/list", {}).then(res => {
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
      this.editTitle = item.deptId ? "编辑部门信息" : "新增部门";
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        // 计算层级
        if(item.parentId === 0) {
          item.level = 1
        } else {
          let parent = that.listData.find(x => x.deptId == item.parentId);
          if(!parent) {
            that.$message.error("未找到上级部门！");
            return;
          }
          item.level = parent.level + 1;
        }
        axios.fetch("oaServer", "/org/dept/submit", that.currentItem).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("确认删除吗？").then(() => {
        axios.fetch("oaServer", "/org/dept/delete", { deptId: item.deptId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
  },
  beforeCreate(){
      that = this;
  },
  filters:{
      filterDeptNo:val=>{
          let index = that.deptNoData.findIndex(item => item.value == val);
          if (index !== -1 ) {
            return that.deptNoData[index].name;
          } else {
            return '';
          }
      },
  }
};
</script>