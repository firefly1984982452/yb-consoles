<template>
  <div>
    <el-form ref="searchData" :model="searchData" class="search" :inline="true">
      <el-form-item label="状态">
        <el-select @change="search" v-model="searchData.search_EQI_status" placeholder="全部" clearable style="width:120px">
          <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select @change="search" v-model="searchData.search_EQI_subType" placeholder="请选择" clearable :disabled="purchaseId!=null">
          <el-option v-for="item in filterLogTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker @change="search" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateRange1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <span slot="label">{{typeName}}单号 </span>
        <el-input @change="search" v-model="searchData.search_LIKES_no" placeholder="请输入单号" clearable style="width:120px"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search()" style="min-width:80px">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset()" style="min-width:80px">重置</el-button>
    </el-form>

    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="24" class="right">
          <el-button @click="selectPurchase" type="info" v-if="type==1">从采购单入库</el-button>
          <el-button @click="add" type="primary" icon="el-icon-plus">新增{{typeName}}单</el-button>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="listData" border class="ub-table" :row-class-name="tableRowClassName">
        <el-table-column :label="preappendTypeName('单号')" min-width="130" prop="no"></el-table-column>
        <el-table-column label="类型" min-width="80" prop="subType" :formatter="subTypeFormatter"></el-table-column>
        <el-table-column v-if="type==1" label="供应商" min-width="140" prop="vendorName" align="left"></el-table-column>
        <el-table-column :label="preappendTypeName('数量')" min-width="130" align="left">
          <template slot-scope="scope">{{scope.row.kind}}种，共{{scope.row.quantity}}个</template>
        </el-table-column>
        <el-table-column :label="preappendTypeName('金额(元)')" min-width="100" prop="total"></el-table-column>
        <el-table-column label="创建时间" min-width="130" prop="createTime">
          <template slot-scope="scope">{{scope.row.createTime.substring(0,16)}}</template>
        </el-table-column>
        <el-table-column label="经办人" min-width="80" prop="creator"></el-table-column>
        <el-table-column label="来源" min-width="40" prop="source" :formatter="sourceFormatter"></el-table-column>
        <el-table-column label="状态" min-width="60" :formatter="statusFormatter" prop="status" class-name="status"></el-table-column>
        <el-table-column label="操作" min-width="120" class-name="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="审核" placement="top-end" v-if="scope.row.status==1">
              <el-button size="mini" class="lookta" @click="check(scope.row)"><i class="iconfont iconcaozuotubiao-shenhe"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end" v-if="scope.row.status==1">
              <el-button size="mini" class="lookta" @click="edit(scope.row)"><i class="iconfont iconcaozuotubiao-bianji-xuanfu"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="作废" placement="top-end" v-if="scope.row.status==1">
              <el-button size="mini" class="lookta" @click="invalid(scope.row)"><i class="iconfont iconcaozuotubiao-quxiao"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
              <el-button size="mini" class="lookta" @click="detail(scope.row)"><i class="iconfont iconcaozuotubiao-chakan"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>

    <el-dialog title="作废确认" :visible.sync="dialogInvalidFormVisible" v-if="dialogInvalidFormVisible" :close-on-click-modal="false" :show-close=false width="500px">
      <el-form :model="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="单据编号">
              {{form.no}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="作废备注">
              <el-input v-model="form.invalidRemark" clearable type="textarea" rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogInvalidFormVisible=false">取消</el-button>
        <el-button type="danger" @click="doInvalid()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择采购单" :visible.sync="dialogSelectPurchaseVisible" v-if="dialogSelectPurchaseVisible" :close-on-click-modal="false" :destroy-on-close="true" width="1000px">
      <el-row class="warp">
        <el-col style="margin-top:20px;">
          提示：仅展示已审核且未执行的采购单
        </el-col>
      </el-row>
      <el-table ref="multipleTable" max-height="300" :data="purchaseOrders" border class="ub-table">
        <el-table-column label="采购单号" min-width="140" prop="orderNo"></el-table-column>
        <el-table-column label="供应商" min-width="160" prop="vendorName" align="left"></el-table-column>
        <el-table-column label="数量" min-width="110" align="left">
          <template slot-scope="scope">{{scope.row.kind}}种，共{{scope.row.quantity}}个</template>
        </el-table-column>
        <el-table-column label="总金额(元)" min-width="90" prop="total"></el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="purchaseDate">
          <template slot-scope="scope">{{scope.row.purchaseDate.substring(0,16)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-link type="primary" @click="doSelectPurchase(scope.row.id)">去入库</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button @click="dialogSelectPurchaseVisible=false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogSelectPurchaseVisible: false,
      dateRange1: [],
      status: [
        {
          name: "待审核",
          id: 1,
        },
        {
          name: "已审核",
          id: 5,
        },
        {
          name: "已作废",
          id: 0,
        },
      ],
      sources: [
        { id: 1, name: "人工" },
        { id: 2, name: "系统" },
      ],
      cgid: "",
      searchData: {
        pageIndex: 1,
        pageSize: 10,
      },
      dialogFormVisible: false,
      dialogInvalidFormVisible: false,
      id: null,
      purchaseOrders: [],
      totalNum: "",
      id: "",
      currentPage: 1,
      pageSize: 5,
      listData: [],
      totalPage: "",
      type: null,
      form: {},
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
      typeName: "",
    };
  },
  created() {
    if (this.$route.query.type) {
      this.type = this.$route.query.type;
    } else {
      this.type = 1;
    }
    this.typeName = this.type == 1 ? "入库" : "出库";
    this.filterLogTypes = this.logTypes.filter((item) => {
      return item.type == this.type;
    });
    this.fetchData();
  },
  methods: {
    preappendTypeName(label) {
      return this.typeName + label;
    },
    detail(data) {
      this.$router.push({
        path: "/medical/drugStorage/store/storeDetail",
        query: {
          id: data.id,
          type: this.type,
          flag: "view",
        },
      });
    },
    edit(data) {
      this.$router.push({
        path: "/medical/drugStorage/store/editStore",
        query: {
          id: data.id,
          type: this.type,
        },
      });
    },
    check(value) {
      this.$router.push({
        path: "/medical/drugStorage/store/storeDetail",
        query: {
          id: value.id,
          type: this.type,
          flag: "check",
        },
      });
    },
    invalid(data) {
      this.dialogInvalidFormVisible = true;
      this.form = { id: data.id, no: data.no };
    },
    doInvalid() {
      axios
        .fetch(
          "medicalServer",
          "/api/store/check/" + this.form.id + "?status=0",
          this.form,
          null,
          "get"
        )
        .then((res) => {
          this.$message.success("作废成功");
          this.dialogInvalidFormVisible = false;
          this.fetchData();
        });
    },
    selectPurchase() {
      this.dialogSelectPurchaseVisible = true;
      let data = {
        search_EQI_status: 1,
      };
      axios
        .fetch("medicalServer", "/api/purchase-order/page", data, null, "get")
        .then((res) => {
          this.purchaseOrders = res.data;
        });
    },
    doSelectPurchase(id) {
      this.$router.push({
        path: "/medical/drugStorage/store/editStore",
        query: {
          type: this.type,
          purchaseId: id,
        },
      });
    },
    add() {
      this.$router.push({
        path: "/medical/drugStorage/store/editStore",
        query: {
          type: this.type,
        },
      });
    },
    fetchData() {
      if (this.dateRange1) {
        this.searchData.search_GED_createTime = this.dateRange1[0];
        this.searchData.search_LED_createTime = this.dateRange1[1];
      } else {
        this.searchData.search_GED_createTime = "";
        this.searchData.search_LED_createTime = "";
      }
      this.searchData.search_EQI_type = this.type;
      axios
        .fetch("medicalServer", "/api/store/page", this.searchData, null, "get")
        .then((res) => {
          this.listData = res.data;
          this.totalPage = res.total;
        });
    },
    search() {
      this.changePage(1);
    },
    reset() {
      this.searchData = { pageIndex: 1, pageSize: 10 };
      this.dateRange1 = [];
      this.dateRange2 = [];
      this.fetchData();
    },
    changePage(val) {
      this.searchData.pageIndex = val;
      this.fetchData();
    },
    statusFormatter(row, column, value, index) {
      let objects = this.status;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == value) {
          return objects[key].name;
        }
      }
    },
    sourceFormatter(row, column, value, index) {
      let objects = this.sources;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == value) {
          return objects[key].name;
        }
      }
    },
    subTypeFormatter(row, column, value, index) {
      let objects = this.logTypes;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == value) {
          return objects[key].name;
        }
      }
    },
    tableRowClassName({ row }) {
      let className = "";
      if (row.status == 1) {
        className += " entry-submit";
      } else if (row.status == 0) {
        className += " entry-invalid";
      } else if (row.status == 5) {
        className += "entry-audit";
      }
      return className;
    },
  },
};
</script>
<style scoped>
/deep/ .search .el-input {
  width: 120px;
}
/deep/ .entry-invalid .status .cell {
  color: #a6b2bd;
}
/deep/ .entry-submit .status .cell {
  color: #ff9900;
}
/deep/ .entry-audit .status .cell {
  color: #526069;
}
/deep/ .right .cell {
  text-align: right;
}
</style>