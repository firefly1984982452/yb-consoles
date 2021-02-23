<template>
  <div>
    <el-form :inline="true" class="search">
      <el-form-item label="菜名">
        <el-input v-model="search.title"></el-input>
      </el-form-item>
      <el-form-item label="种类">
        <el-select v-model="search.categoryId" placeholder="请选择">
          <el-option v-for="item in dietCategoryTypeList" :key="item.id" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="right">
          <el-button type="success" @click="add" icon="el-icon-plus">添加</el-button>
        </el-col>
      </el-row>
      <el-table class="ub-table" :data="data" row-key="id" border>
        <el-table-column prop="title" label="菜名"></el-table-column>
        <el-table-column label="种类" prop="categoryTitle"></el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">
            <div v-if="scope.row.categoryTitle === '小锅菜'"><span style="color:#f00">{{scope.row.salePrice}}</span>元/例</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top-end">
              <el-button size="mini" @click="del(scope.row)" icon="el-icon-delete-solid"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!-- 新增/编辑菜品 -->
    <el-dialog center title="新增/编辑菜品" :visible.sync="dialogNewVisible" :before-close="closePage" width="25%">
      <el-form :rules="rules" label-width="90px" :model="addInfo" ref='addInfo'>
        <el-form-item label="菜名">
          <el-input style="width:200px" v-model.trim="addInfo.title" maxlength="20" placeholder="20字以内，如：小炒肉" />
        </el-form-item>
        <el-form-item label="种类">
          <el-select v-model="addInfo.categoryId" placeholder="请选择">
            <el-option v-for="item in dietCategoryTypeList" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价" v-show="addInfo.categoryId === tempId">
          <el-input style="width:120px" v-model="addInfo.salePrice" placeholder="请输入金额" />元/例
        </el-form-item>
        <div class="buttons" style="text-align:center;">
          <el-button type="primary" @click="submitApply">保存</el-button>
          <el-button @click="closePage">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: {
        categoryId: '',
        title: ''
      },
      addInfo: {
        title: '',
        categoryId: '',
        salePrice: ''
      },
      pageSize: 10,
      currentPage: 1,
      total: 0,
      data: [],
      dialogNewVisible: false,
      dietCategoryTypeList: [],
      tempId: '',
    }
  },
  mounted() {
    this.getdata();
    this.getDietCategoryTypeList();
  },
  methods: {
    // 获取所有菜种类列表
    getDietCategoryTypeList() {
      axios.fetch("dietServer", "/dietCategory/query", { type: 0 }).then(res => {
        if (res.code == 200) {
          this.dietCategoryTypeList = res.data;
          var arr = this.dietCategoryTypeList.filter(val => val.title === '小锅菜');
          this.tempId = '';
          console.log(arr)
          if (arr) {
            this.tempId = arr[0].id;
          } else {
            console.log('没有配置过小锅菜！');
          }
        }
      })
    },
    closePage() {
      this.addInfo = {
        title: '',
        categoryId: '',
        salePrice: ''
      };
      this.dialogNewVisible = false;
    },
    fresh() {
      this.dialogNewVisible = false;
      this.getdata();
    },
    getdata() {
      let param = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        categoryId: this.search.categoryId,
        title: this.search.title,
      }
      axios.fetch("dietServer", "/dietFood/query", param).then(res => {
        if (res.code == 200) {
          this.total = res.total;
          this.data = res.data;
        }
      })
    },
    handleChange(i) {
      this.currentPage = i;
      this.getdata();
    },
    // 编辑
    detail(val) {
      this.dialogNewVisible = true;
      this.addInfo = JSON.parse(JSON.stringify(val));
    },
    // 编辑或添加
    submitApply() {
      console.log(this.addInfo.salePrice)
      if (this.addInfo.title.length === 0) return this.$message.error('菜名不能为空！');
      if (this.addInfo.categoryId == '' || this.addInfo.categoryId == 'undefined') return this.$message.error('种类不能为空！');
      if (this.tempId === this.addInfo.categoryId && this.addInfo.salePrice === '') {
        return this.$message.error('价格不能为空！');
      }
      if (Number(this.addInfo.salePrice) < 0) {
        return this.$message.error('价格不能小于0！')
      }
      if (this.addInfo.categoryId === this.tempId && Number.isNaN(Number(this.addInfo.salePrice))) return this.$message.error('请输入有效单价！');
      let { id, categoryId, title, iconUrl, salePrice } = this.addInfo;
      let param = {
        id, categoryId, title, iconUrl, salePrice
      }
      if (this.addInfo.categoryId !== this.tempId) {
        delete param.salePrice
      }
      axios.fetch("dietServer", "/dietFood/submit", param).then(res => {
        if (res.code == 200) {
          this.getdata();
          this.dialogNewVisible = false;
          this.$message({
            type: "success",
            message: "成功!"
          });
        }
      });
    },
    // 删除
    del(val) {
      this.$confirm("是否删除该菜?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios.fetch("dietServer", "/dietFood/invalid", {
          id: val.id
        }).then(res => {
          if (res.code == 200) {
            this.getdata();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    // 重置
    reset() {
      this.search = {
        title: '',
        categoryId: ''
      };
      this.currentPage = 1;
      this.getdata()
    },
    add() {
      this.dialogNewVisible = true;
      this.addInfo = {
        title: '',
        categoryId: '',
        salePrice: ''
      }
    },
  }
}
</script>

<style lang="less" scoped>
.text-red {
  color: #f00;
}
.text-blue {
  color: #62c2f2;
}
</style>