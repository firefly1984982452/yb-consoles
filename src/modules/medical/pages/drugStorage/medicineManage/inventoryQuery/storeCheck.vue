<template>
  <div>
    <el-form ref="searchData" :model="searchData" :inline="true" class="search" label-width="70px">
      <el-form-item label="药品类型" label-width="70px">
        <el-select v-model="searchData.type" placeholder="全部" clearable @change="search">
          <el-option v-for="(item,index) in types" :key="index.id" :label="item.name" :value="item.id"></el-option>
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
          <el-button type="primary" class="addEquipment" @click="exportExcelData()"><i class="iconfont iconjichutubiao-daoru"></i>导出Excel</el-button>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="listData" border class="ub-table" :row-class-name="tableRowClassName">
        <el-table-column label="药品名称/条码" min-width="140" align="left">
          <template slot-scope="scope">
            {{scope.row.fullName}}<br>
            {{scope.row.barCode}}
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="standard" min-width="160" align="left"></el-table-column>
        <el-table-column label="包装单位" prop="packageUnit" min-width="50"></el-table-column>
        <el-table-column label="内含数量" prop="unitCount" min-width="50">
          <template slot-scope="scope">
            {{scope.row.unitCount}}{{scope.row.useUnit}}
          </template>
        </el-table-column>
        <el-table-column label="库位" min-width="60" prop="location" align="left"></el-table-column>
        <el-table-column label="可用库存" prop="availableCount" min-width="50" align="left" class-name="stock"></el-table-column>
        <el-table-column label="采购在途" prop="purchasingCount" min-width="50" align="left"></el-table-column>
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" effect="dark" content="库存盘点" placement="top-end">
              <el-button size="mini" class="lookta" @click="edit(scope.row)"><i class="iconfont iconcaozuotubiao-bianji"></i></el-button>
            </el-tooltip> -->
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button size="mini" @click="showLog(scope.row)" icon="iconfont iconcaozuotubiao-chakan"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog class="log-dialog" :title="logTitle" :visible.sync="logDialogFormVisible" v-if="logDialogFormVisible" width="1000px">
      <el-form ref="searchData" :model="logSearchData" :inline="true" class="search2" label-width="0">
        <el-row>
          <el-form-item label="" label-width="0">
            <el-date-picker @change="logSearch" v-model="dateRange" style="width:380px" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="" label-width="0">
            <el-select v-model="logSearchData.search_EQI_type" placeholder="全部" clearable @change="logSearch();bigTypeChanged()">
              <el-option v-for="(item,index) in bigLogTypes" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" label-width="0">
            <el-select v-model="logSearchData.search_EQI_subType" placeholder="全部类型" clearable @change="logSearch">
              <el-option v-for="(item,index) in filterLogTypes" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="logSearch()">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="resetLogSearch()">重置</el-button>
        </el-row>
      </el-form>

      <el-table ref="multipleTable" max-height="400" :data="logListData" border class="ub-table">
        <el-table-column label="时间" width="180" prop="auditTime"></el-table-column>
        <el-table-column label="类型" width="100" prop="subType" :formatter="logTypeFormatter"></el-table-column>
        <el-table-column label="数量变化" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">+{{scope.row.quantity}}</span>
            <span v-else>-{{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库单价(元）" min-width="40" prop="unitPrice" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">{{scope.row.unitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="出库单价(元）" min-width="40" prop="unitPrice" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.type==2">{{scope.row.unitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="100" prop="creator"></el-table-column>
      </el-table>
      <div class="right">
        <el-pagination @current-change="logChangePage" :total="logDataCount" :current-page="logSearchData.pageIndex" :page-size="logSearchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logDialogFormVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="快速调整库存（快速盘库）" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="400px">
      <el-form label-width="120px" ref="form" :model="form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="当前实际库存" prop="quantity" required>
              <input class="el-input__inner" v-model.trim="form.quantity" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入当前实际库存" clearable />
            </el-form-item>
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" clearable maxlength="30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col class :span="7">
            <el-button type="primary" @click="submitForm()">确认</el-button>
          </el-col>
          <el-col class :span="7">
            <el-button @click="dialogFormVisible=false">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    </el-row>
  </div>
</template>
<script>
import settings from "@/settings";
import qs from "qs";

export default {
  data() {
    return {
      logDialogFormVisible: false,
      dialogFormVisible: false,
      form: {},
      types: [
        { id: 1, name: "西药/中成药" },
        { id: 3, name: "中草药" },
      ],
      categories: [],
      medicineId: "",
      loading: false,
      searchData: {
        type: 1,
        search_EQS_category: "",
        pageSize: 10,
        pageIndex: 1,
      },
      logSearchData: {
        medicineId: "",
        pageSize: 10,
        pageIndex: 1,
      },
      listData: [],
      dataCount: "",
      logListData: [],
      dateRange: [],
      logDataCount: "",
      logTitle: "",
      bigLogTypes: [
        { id: 1, name: "入库流水" },
        { id: 2, name: "出库流水" },
      ],
      logTypes: [
        { id: 1, name: "采购入库", type: 1 },
        { id: 2, name: "销售退货", type: 1 },
        { id: 3, name: "期初入库", type: 1 },
        { id: 4, name: "盘盈入库", type: 1 },
        { id: 9, name: "其它入库", type: 1 },
        { id: 11, name: "处方出库", type: 2 },
        { id: 12, name: "报损出库", type: 2 },
        { id: 13, name: "采购退货", type: 2 },
        { id: 14, name: "盘亏出库", type: 2 },
        { id: 19, name: "其它出库", type: 2 },
      ],
      filterLogTypes: [],
    };
  },
  computed: {},
  created() {
    this.filterLogTypes = this.logTypes;
    this.init();
    this.fetchData();
  },
  methods: {
    init() {
      axios
        .fetch("medicalServer", "/api/medicine/categories", null, null, "get")
        .then((res) => {
          this.categories = res.data;
        });
    },
    bigTypeChanged() {
      let bigType = this.logSearchData.search_EQI_type;
      if (bigType) {
        this.filterLogTypes = this.logTypes.filter((item) => {
          return item.type == bigType;
        });
      } else {
        this.filterLogTypes = this.logTypes;
      }
    },
    showLog(data) {
      this.logTitle = "库存流水 - " + data.fullName;
      this.logDialogFormVisible = true;
      this.medicineId = data.id;
      this.resetLogSearch();
    },
    search() {
      this.changePage(1);
    },
    reset() {
      this.searchData = { pageIndex: 1, pageSize: 10 };
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    resetLogSearch() {
      this.dateRange = [];
      this.logSearchData = { pageIndex: 1, pageSize: 10 };
      this.filterLogTypes = this.logTypes;
      this.logChangePage(1);
    },
    logSearch() {
      this.logChangePage(1);
    },
    logChangePage(value) {
      this.logSearchData.pageIndex = value;
      this.fetchLogData();
    },
    fetchLogData() {
      let values = this.dateRange;
      if (values) {
        this.logSearchData.search_GET_auditTime = values[0];
        this.logSearchData.search_LET_auditTime = values[1];
      } else {
        this.logSearchData.search_GET_auditTime = null;
        this.logSearchData.search_LET_auditTime = null;
      }
      axios
        .fetch(
          "medicalServer",
          "/api/store/logs/" + this.medicineId,
          this.logSearchData,
          null,
          "get"
        )
        .then((res) => {
          this.logListData = res.data;
          this.logDataCount = res.total;
        });
    },
    fetchData() {
      this.searchData.search_EQI_source = 1;
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
    //导出数据
    exportExcelData() {
      const param = {
        search_LIKES_no: this.searchData.medicineNo,
        search_LIKES_name: this.searchData.medicineName,
      };
      param.search_EQI_source = 1;
      var temp = document.createElement("form");
      let user = axios.getCurrentUser();
      window.location.href =
        settings.servers.medicalServer +
        "/api/medicine/export?authToken=" +
        user.id +
        "&" +
        qs.stringify(param);
      this.$message.success("导出成功");
    },
    edit(data) {
      this.form = {};
      this.medicineId = data.id;
      this.dialogFormVisible = true;
    },
    tableRowClassName({ row }) {
      if (row.availableCount < row.minStocks) {
        return "stock-warning";
      } else {
        return "";
      }
    },
    submitForm() {
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/inventory-check/" + this.medicineId,
          this.form,
          null,
          "get"
        )
        .then((res) => {
          this.$message.success("操作成功");
          this.dialogFormVisible = false;
          this.fetchData();
        });
    },
    logTypeFormatter(row, column, value, index) {
      let objects = this.logTypes;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == value) {
          return objects[key].name;
        }
      }
    },
  },
};
</script>
<style scoped>
/deep/ .search .el-input {
  width: 140px;
}
/deep/ .search2 .el-input {
  width: 120px;
}
/deep/ .stock-warning .stock .cell {
  color: #ff9c2b;
}
/deep/ .log-dialog .el-dialog__body {
  min-height: 480px;
}
</style>