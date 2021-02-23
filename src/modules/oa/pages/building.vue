<template>
  <div class="content">
    <el-row type="flex" class="pannel">
      <el-col>
        <el-button type="primary">楼宇</el-button>
        <el-button @click="$router.push('building/area')">区域</el-button>
      </el-col>
      <el-col class="right">
        <el-button type="success" icon="el-icon-plus" @click="editItem({})">添加楼宇</el-button>
      </el-col>
    </el-row>
    <el-table :data="listData" border class="ub-table">
      <el-table-column prop="buildingId" label="楼宇ID" width="100"></el-table-column>
      <el-table-column prop="buildingName" label="楼宇名称"></el-table-column>
      <el-table-column prop="floors" label="楼层数"></el-table-column>
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
        <el-form-item label="楼宇名称" prop="buildingName" :show-message="false" required>
          <el-input clearable v-model.trim="currentItem.buildingName" maxlength="10" show-word-limit type="text" placeholder="楼宇名称"></el-input>
        </el-form-item>
        <el-form-item label="楼层数" prop="floors" :show-message="false" required>
          <el-input-number v-model="currentItem.floors" :min="1" :max="100" label="楼层数"></el-input-number>
        </el-form-item>
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
    fetchData: function () {
      let that = this;
      axios.fetch("oaServer", "/org/building/list", {}).then((res) => {
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
      this.editTitle = item.buildingId ? "编辑楼宇信息" : "新增楼宇"; 
    },
    editForm() {
      let that = this;
      this.$refs["itemForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let item = that.currentItem;
        axios.fetch("oaServer", "/org/building/submit", item).then(res => {
          this.editVisible = false;
          that.$message.success("操作成功");
          that.fetchData();
        });
      });
    },
    removeItem(item) {
      let that = this;
      this.$confirm("确认删除吗？").then(() => {
        axios.fetch("oaServer", "/org/building/delete", { buildingId: item.buildingId }).then(res => {
          that.$message.success("删除成功");
          that.fetchData();
        });
      }).catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-input__inner {
    height: 40px;
}
</style>