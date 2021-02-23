<template>
  <div class="content">
    <el-row type="flex" class="pannel">
      <el-col>
        <el-button @click="$router.push('department')">部门</el-button>
        <el-button type="primary">岗位</el-button>
      </el-col>
      <el-col class="right">
        <el-button type="success" icon="el-icon-plus" @click="editItem({status:1,syncStatus:1,jobNo: ''})">添加岗位</el-button>
        <!-- <el-button class="button-purple" icon="el-icon-document-copy">同步数据</el-button> -->
      </el-col>
    </el-row>
    <el-table :data="listData" border stripe class="ub-table">
      <el-table-column prop="jobId" label="岗位ID" width="100"></el-table-column>
      <el-table-column prop="jobName" label="岗位名称"></el-table-column>
      <el-table-column prop="jobNo" label="岗位类型">
        <template slot-scope="scope">
          <span>{{scope.row.jobNo | filterJobNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门"></el-table-column>
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
        <el-form-item label="岗位名称" prop="jobName" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.jobName" maxlength="10" show-word-limit type="text" placeholder="岗位名称"></el-input>
        </el-form-item>
        <el-form-item label="岗位类型" :show-message="false">
          <el-select v-model="currentItem.jobNo" placeholder="请选择岗位类型">
            <el-option v-for="item in jobNoData" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId" :show-message="false" required>
          <el-select v-model="currentItem.deptId" placeholder="请选择所属部门" @change="changeDept">
            <el-option v-for="item in deptData" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
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
      jobNoData: [{
        name: '（无）',
        value: ''
      },{
        name: '董事长',
        value: 'ceo'
      },{
        name: '院长',
        value: 'leader'
      },{
        name: '副院长',
        value: 'vice_leader'
      },{
        name: '总经理',
        value: 'manager'
      },{
        name: '科长',
        value: 'admin_leader'
      },{
        name: '业务主管',
        value: 'operator_leader'
      },{
        name: '业务员',
        value: 'operator'
      },{
        name: '会计',
        value: 'accountant'
      },{
        name: '出纳',
        value: 'cashier'
      },{
        name: '医护主管',
        value: 'doctor_leader'
      },{
        name: '临床医生',
        value: 'doctor'
      },{
        name: '护士',
        value: 'nurse'
      },{
        name: '护理班长',
        value: 'carer_leader'
      },{
        name: '养老护理员',
        value: 'carer'
      }],
      listData: [],
      currentItem: {
        jobNo:'carer_leader',
      },
      editVisible: false,
      editTitle: '',
      deptData: [],
    };
  },
  created() {
    this.fetchData();
    this.fetchDeptData();
  },
  methods: {
    ...utilsTable,
    fetchData: function () {
      let that = this;
      axios.fetch("oaServer", "/org/job/list", {}).then((res) => {
        that.listData = res.data;
      });
    },
    changeDept(){
      if (this.editTitle =="编辑岗位信息") {
       if(this.currentItem.deptId !== this.currentItem.deptIdCopy) {
         this.currentItem.jobName = '';
       }
      }
    },
    fetchDeptData: function () {
      let that = this;
      axios.fetch("oaServer", "/org/dept/list", {}).then(res => {
        that.deptData = res.data;
      });
    },
    editItem(item) {
      this.editVisible = true;
      let form = this.$refs["itemForm"];
      if(form) {
        form.resetFields();
      }
      this.currentItem = _.clone(item);
      this.currentItem.deptIdCopy = JSON.stringify(this.currentItem.deptId);
      this.editTitle = item.deptId ? "编辑岗位信息" : "新增岗位"; 
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        // 部门名称
        let dept = that.deptData.find(x => x.deptId == item.deptId);
        if(!dept) {
          that.$message.error("未找到所属部门！");
          return;
        }
        item.deptName = dept.deptName;
        axios.fetch("oaServer", "/org/job/submit", that.currentItem).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("确认删除吗？").then(() => {
        axios.fetch("oaServer", "/org/job/delete", { jobId: item.jobId }).then(res => {
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
      filterJobNo:val=>{
          let index = that.jobNoData.findIndex(item => item.value == val);
          if (index !== -1 ) {
            return that.jobNoData[index].name;
          } else {
            return '';
          }
      },
  }
};
</script>