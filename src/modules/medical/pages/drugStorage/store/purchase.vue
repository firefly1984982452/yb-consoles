<template>
  <div>
    <el-form ref="searchData" :model="searchData" class="search" :inline="true">
      <el-form-item label="采购单号">
        <el-input v-model="searchData.search_LIKES_orderNo" placeholder="请输入" clearable style="width:120px" @change="search"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchData.search_EQI_status" placeholder="全部" clearable style="width:120px" @change="search">
          <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker @change="search" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateRange1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search()" style="min-width:80px">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset()" style="min-width:80px">重置</el-button>
    </el-form>

    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="24" class="right">
          <el-button @click="add" type="primary" icon="el-icon-plus" class="addEquipment">新增采购单</el-button>
        </el-col>
      </el-row>

      <el-table ref="multipleTable" :data="listData" border class="ub-table" :row-class-name="tableRowClassName">
        <el-table-column label="采购单号" min-width="140" prop="orderNo"></el-table-column>
        <el-table-column label="供应商" min-width="140" prop="vendorName" align="left"></el-table-column>
        <el-table-column label="数量" min-width="100" align="left">
          <template slot-scope="scope">{{scope.row.kind}}种，共{{scope.row.quantity}}个</template>
        </el-table-column>
        <el-table-column label="总金额(元)" min-width="100" prop="total"></el-table-column>
        <el-table-column label="申请时间" min-width="130" prop="purchaseDate">
          <template slot-scope="scope">{{scope.row.purchaseDate.substring(0,16)}}</template>
        </el-table-column>
        <el-table-column label="申请人" min-width="80" prop="purchaser"></el-table-column>
        <el-table-column label="执行时间" min-width="130">
          <template slot-scope="scope" v-if="scope.row.storeDate">{{scope.row.storeDate.substring(0,16)}}</template>
        </el-table-column>
        <el-table-column label="执行人" min-width="80">
          <template slot-scope="scope">{{scope.row.storer}}</template>
        </el-table-column>
        <el-table-column label="状态" min-width="60" :formatter="statusFormatter" prop="status" class-name="status"></el-table-column>
        <el-table-column label="操作" min-width="120" class-name="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="审核" placement="top-end" v-if="scope.row.status==0">
              <el-button size="mini" class="lookta" @click="check(scope.row)"><i class="iconfont iconcaozuotubiao-shenhe"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end" v-if="scope.row.status==0">
              <el-button size="mini" class="lookta" @click="edit(scope.row)"><i class="iconfont iconcaozuotubiao-bianji-xuanfu"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="作废" placement="top-end" v-if="scope.row.status<3 && scope.row.status>=0">
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

  </div>
</template>
<script>
export default {
  data() {
    return {
      dateRange1: [],
      status: [
        {
          name: "待审核",
          id: 0,
        },
        {
          name: "待执行",
          id: 1,
        },
        {
          name: "已执行",
          id: 3,
        },
        {
          name: "已作废",
          id: -1,
        },
      ],
      cgid: "",
      searchData: {
        pageIndex: 1,
        pageSize: 10,
      },
      form: {},
      dialogInvalidFormVisible: false,
      id: null,
      loading: false,
      listData: [],
      totalPage: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    detail(data) {
      this.$router.push({
        path: "/medical/drugStorage/store/purchaseDetail",
        query: {
          status: data.status,
          id: data.id,
          state: 1,
        },
      });
    },
    edit(value) {
      this.$router.push({
        path: "/medical/drugStorage/store/editPurchase",
        query: {
          status: value.status,
          id: value.id,
        },
      });
    },
    check(value) {
      this.$router.push({
        path: "/medical/drugStorage/store/purchaseDetail",
        query: {
          status: value.status,
          id: value.id,
          state: 0,
        },
      });
    },
    invalid(data) {
      this.dialogInvalidFormVisible = true;
      this.form = { id: data.id, no: data.orderNo };
    },
    doInvalid() {
      axios
        .fetch(
          "medicalServer",
          "/api/purchase-order/check/" + this.form.id + "?status=-1",
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
    add() {
      this.$router.push({
        path: "/medical/drugStorage/store/editPurchase",
      });
    },
    fetchData() {
      if (this.dateRange1) {
        this.searchData.search_GED_purchaseDate = this.dateRange1[0];
        this.searchData.search_LED_purchaseDate = this.dateRange1[1];
      } else {
        this.searchData.search_GED_purchaseDate = "";
        this.searchData.search_LED_purchaseDate = "";
      }
      axios
        .fetch(
          "medicalServer",
          "/api/purchase-order/page",
          this.searchData,
          null,
          "get"
        )
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
    tableRowClassName({ row }) {
      let className = "";
      if (row.status == 0) {
        className += " entry-submit";
      } else if (row.status == -1) {
        className += " entry-invalid";
      } else if (row.status == 1) {
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