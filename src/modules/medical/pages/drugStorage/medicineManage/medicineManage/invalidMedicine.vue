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
        <el-col :span="24" class="right">
          <el-button type="text" icon="el-icon-back" @click.stop="$router.push('/medical/drugStorage/medicine')">药品管理</el-button>
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
            <el-popconfirm confirmButtonText='确定' @onConfirm="validData(scope.row.id)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认移回此药品？">
              <el-button slot="reference" style="font-size:14px" plain type="text" size="mini">移回</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>
<script>
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
      categories: [],
      types: ["西药", "中成药", "中草药"],
      sources: [
        { id: 1, name: "院内" },
        { id: 2, name: "院外" },
      ],
    };
  },
  components: {},
  created() {
    this.fetchData();
    this.getCategories();
  },
  methods: {
    getCategories() {
      axios
        .fetch("medicalServer", "/api/medicine/categories", null, null, "get")
        .then((res) => {
          this.categories = res.data;
        });
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
          "/api/medicine/invalid/page",
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          this.listData = res.data;
          this.dataCount = res.total;
        });
    },
    sourceFormatter(row, column, value) {
      if (value == 1) {
        return "是";
      } else {
        return "否";
      }
    },
    validData(id) {
      axios
        .fetch("medicalServer", "/api/medicine/valid/" + id, null, null, "get")
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