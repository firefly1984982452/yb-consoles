<template>
  <div>
    <el-form ref="searchData" :inline="true" class="search" :model="searchData">
      <el-form-item label="药品类型" label-width="70px">
        <el-select v-model="searchData.search_EQS_type" placeholder="全部" clearable @change="search">
          <el-option v-for="(item,index) in types" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存属性" label-width="70px">
        <el-select v-model="searchData.search_EQI_source" placeholder="全部" clearable @change="search">
          <el-option v-for="(item,index) in sources" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药品分类" label-width="70px">
        <el-select v-model="searchData.search_EQS_category" placeholder="全部" clearable @change="search">
          <el-option v-for="(item,index) in categories" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药品信息" label-width="70px">
        <el-input v-model="searchData.name" placeholder="名称/条码/编码/助记码" clearable @change="search" style="width:200px"></el-input>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
    </el-form>

    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="16" class="left">
          <el-button type="primary" @click="addData()"><i style="font-size: 12px" class="iconfont iconjichutubiao-tianjia-huise"></i> 新增药品</el-button>
          <el-button @click="upload" style="background: #F49B31;color: #FFFFFF;"><i style="font-size: 12px" class="iconfont iconjichutubiao-daoru"></i> 导入</el-button>
          <input type="file" ref="uploader" id="file" @change="importData" style="display:none">
          <el-link type="info" href="/static/药品库模板1.0.xlsx">导入模板下载</el-link>
        </el-col>
        <el-col :span="8" class="right">
          <el-button @click="configCategory"><i style="font-size: 12px" class="iconfont iconjichutubiao-daoru"></i> 管理药品分类</el-button>
          <el-button type="text" icon="el-icon-document-remove" @click.stop="$router.push('/medical/drugStorage/medicine/invalid')">回收站</el-button>
        </el-col>
      </el-row>
      <el-table :data="listData" border class="ub-table">
        <el-table-column label="药品名称/条码" min-width="140" align="left">
          <template slot-scope="scope">
            {{scope.row.fullName}}<br>
            {{scope.row.barCode}}
          </template>
        </el-table-column>
        <el-table-column label="药品类型" min-width="60" prop="type" align="left"></el-table-column>
        <el-table-column label="规格" min-width="150" prop="standard" align="left"></el-table-column>
        <el-table-column label="采购单价" min-width="60" prop="purchasePrice" align="right"></el-table-column>
        <el-table-column label="售价" min-width="60" prop="sellingPrice" align="right"></el-table-column>
        <el-table-column label="院内药" min-width="50" prop="source" :formatter="sourceFormatter" align="right"></el-table-column>
        <el-table-column label="安全库存" min-width="60" prop="minStocks"></el-table-column>
        <el-table-column label="分类" min-width="60" prop="category"></el-table-column>
        <el-table-column label="存放库位" min-width="70" prop="location" align="left"></el-table-column>
        <el-table-column label="操作" min-width="60" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button size="mini" class="lookta" @click="edit(scope.row)"><i class="iconfont iconcaozuotubiao-bianji"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
              <el-popconfirm confirmButtonText='确定' @onConfirm="invalidData(scope.row.id)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此药品？">
                <el-button style="margin-left:8px;" size="mini" slot="reference" icon="iconfont iconcaozuotubiao-shanchu-xuanfu danger"></el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog title="药品详情" :visible.sync="editFormVisible" v-if="editFormVisible" :destroy-on-close="true" :close-on-click-modal="false" width="1200px">
      <addMedicine ref="editForm" :id="id" @saved="editFormVisible=false;fetchData()"></addMedicine>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="editFormVisible=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="药品分类" :visible.sync="dialogCategoryListVisible" v-if="dialogCategoryListVisible" :destroy-on-close="true" :close-on-click-modal="false" width="1000px">
      <el-row type="flex" class="pannel" style="margin-bottom:16px;">
        <el-col :span="24" class="right">
          <el-button type="primary" @click="addCategory()"><i style="font-size: 12px" class="iconfont iconjichutubiao-tianjia-huise"></i> 新增分类</el-button>
        </el-col>
      </el-row>
      <el-table :data="categoryList" border class="ub-table">
        <el-table-column label="分类名称" min-width="120" prop="name"></el-table-column>
        <el-table-column label="" min-width="120" prop="排序" align="center">
          <template slot-scope="scope">
            <el-link @click="upLayer(scope.$index,scope.row)">上移</el-link>
            <el-link @click="downLayer(scope.$index,scope.row)">下移 </el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <i @click="editCategory(scope.row)" class="iconfont iconcaozuotubiao-bianji"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="top" content="删除">
              <el-popconfirm confirmButtonText='确定' @onConfirm="deleteCategory(scope.row.id)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此分类？">
                <i slot="reference" class="el-icon-delete-solid danger" style="font-size:18px;margin-left:8px" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="新增/编辑药品分类" :visible.sync="dialogEditCategoryVisible" v-if="dialogEditCategoryVisible" :destroy-on-close="true" :close-on-click-modal="false" width="500px" append-to-body>
      <el-form :model="form" :label-position="left" :rules="rules" status-icon ref="categoryForm" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input clearable v-model.trim="form.name" placeholder="4字以内" maxlength="4" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="saveCategory()">确 定</el-button>
        <el-button @click="dialogEditCategoryVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import addMedicine from "./addMedicine";

export default {
  data() {
    return {
      loading: false,
      searchData: {
        medicineCategory: "",
        medicineNo: "",
        pageSize: 10,
        pageIndex: 1,
        medicineName: "",
      },
      listData: [],
      dataCount: 1,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      editFormVisible: false,
      dialogCategoryListVisible: false,
      dialogEditCategoryVisible: false,
      deleteData: {},
      text: "",
      id: null,
      types: ["西药", "中成药", "中草药"],
      sources: [
        { id: 1, name: "院内" },
        { id: 2, name: "院外" },
      ],
      categories: [],
      categoryList: [],
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  components: { addMedicine },
  created() {
    this.getCategories();
    this.fetchData();
  },
  methods: {
    getCategories() {
      axios
        .fetch("medicalServer", "/api/medicine/categories", null, null, "get")
        .then((res) => {
          this.categories = res.data;
        });
    },
    upload() {
      $("#file").val("");
      this.$refs.uploader.click();
    },
    importData() {
      var f = document.getElementById("file").files[0];
      let that = this;
      var params = new FormData();
      params.append("file", f);
      that.loading = true;
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/upload?t=" + new Date().valueOf(),
          params,
          null,
          "post"
        )
        .then((res) => {
          that.$message.success("上传成功" + res.data + "条药品数据");
          that.fetchData();
        });
    },
    addData() {
      this.id = null;
      this.editFormVisible = true;
    },
    search() {
      this.changePage(1);
    },
    reset() {
      this.searchData = { pageIndex: 1, pageSize: 10 };
      this.dateRange = [];
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    fetchData() {
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/page",
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          this.listData = res.data;
          this.dataCount = res.total;
        });
    },
    edit(val) {
      this.id = val.id;
      this.editFormVisible = true;
    },
    submitForm() {
      this.$refs.editForm.submitForm();
    },
    configCategory() {
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/category-list",
          null,
          null,
          "get"
        )
        .then((res) => {
          this.categoryList = res.data;
          this.dialogCategoryListVisible = true;
        });
    },
    addCategory() {
      this.form = {};
      this.dialogEditCategoryVisible = true;
    },
    editCategory(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.dialogEditCategoryVisible = true;
    },
    saveCategory() {
      this.$refs.categoryForm.validate((valid) => {
        if (!valid) {
          return true;
        } else {
          axios
            .fetch(
              "medicalServer",
              "/api/medicine/save-category",
              this.form,
              "json"
            )
            .then((res) => {
              this.$message.success("保存成功");
              this.dialogEditCategoryVisible = false;
              this.configCategory();
              this.getCategories();
            });
        }
      });
    },
    upLayer(index, row) {
      var that = this;
      if (index == 0) {
        that.$message({
          message: "处于顶端，不能继续上移",
          type: "warning",
        });
      } else {
        let upData = that.categoryList[index - 1];
        that.categoryList.splice(index - 1, 1);
        that.categoryList.splice(index, 0, upData);
        this.saveCategorySort();
      }
    },
    downLayer(index, row) {
      var that = this;
      if (index + 1 === that.categoryList.length) {
        that.$message({
          message: "处于底端，不能继续下移",
          type: "warning",
        });
      } else {
        let downData = that.categoryList[index + 1];
        that.categoryList.splice(index + 1, 1);
        that.categoryList.splice(index, 0, downData);
        this.saveCategorySort();
      }
    },
    deleteCategory(id) {
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/delete-category/" + id,
          null,
          null,
          "delete"
        )
        .then((res) => {
          this.$message.success("操作成功");
          this.configCategory();
          this.getCategories();
        });
    },
    saveCategorySort() {
      let ids = this.categoryList.map((item) => {
        return item.id;
      });
      axios
        .fetch("medicalServer", "/api/medicine/save-category-sort", ids, "json")
        .then((res) => {
          this.$message.success("保存成功");
          this.getCategories();
        });
    },
    sourceFormatter(row, column, value) {
      if (value == 1) {
        return "是";
      } else {
        return "否";
      }
    },
    invalidData(id) {
      axios
        .fetch("medicalServer", "/api/medicine/" + id, null, "json", "delete")
        .then((res) => {
          this.$message.success("操作成功");
          this.fetchData();
        });
    },
  },
};
</script>
<style scoped>
/deep/ .search .el-input {
  width: 120px;
}
</style>