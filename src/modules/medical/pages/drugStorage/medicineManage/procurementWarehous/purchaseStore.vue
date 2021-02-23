<template>
  <div class="app-container" id="liveCrList">
    <el-row class="warp" v-loading="loading" id="staffTableStyle">
      <el-col class="searchTop">
        <el-form ref="searchData" :model="searchData" label-width="70px" :inline="true">
          <el-form-item label="采购单号">
            <el-input v-model="searchData.search_LIKES_orderNo" placeholder="请输入" clearable style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchData.search_EQI_status" placeholder="请选择" clearable style="width:120px">
              <el-option v-for="item in option3" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采购时间">
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateRange1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateRange2" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search()" style="min-width:80px">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset()" style="min-width:80px">重置</el-button>
        </el-form>
      </el-col>
      <el-col class="searchTop" style="padding-right:10px">
        <el-button @click="add" type="primary" icon="el-icon-plus" class="addEquipment">新增采购单</el-button>
        <el-col style="background: rgb(255, 255, 255);border-radius: 4px;padding-top: 15px;">
          <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="width:100%;" :cell-style="{padding: '5px 0'}">
            <el-table-column label="采购单号" min-width="140" prop="orderNo"></el-table-column>
            <el-table-column label="供应商" min-width="140" prop="vendorName"></el-table-column>
            <el-table-column label="采购金额(元)" min-width="100" prop="total"></el-table-column>
            <el-table-column label="采购人" min-width="80" prop="purchaser"></el-table-column>
            <el-table-column label="采购时间" min-width="160" prop="purchaseDate"></el-table-column>
            <el-table-column label="入库人" min-width="80">
              <template slot-scope="scope">{{scope.row.storer || '-'}}</template>
            </el-table-column>
            <el-table-column label="入库时间" min-width="160">
              <template slot-scope="scope">{{scope.row.storeDate || '-'}}</template>
            </el-table-column>
            <el-table-column label="状态" min-width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">待审核</span>
                <span v-if="scope.row.status==1">待入库</span>
                <span v-if="scope.row.status==3">已入库</span>
                <span v-if="scope.row.status==-1">已作废</span>
                <span v-if="scope.row.status==-2">审核不通过</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                  <el-button size="mini" class="lookta" @click="detail(scope.row)"><i class="iconfont iconcaozuotubiao-chakan"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                  <el-button size="mini" class="lookta" @click="edit(scope.row)" v-show="scope.row.status==0"><i class="iconfont iconcaozuotubiao-bianji-xuanfu"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="审核" placement="top-end">
                  <el-button size="mini" class="lookta" @click="check(scope.row)" v-show="scope.row.status==0"><i class="iconfont iconcaozuotubiao-shenhe"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="作废" placement="top-end">
                  <el-button size="mini" class="lookta" @click="waste(scope.row)" v-show="scope.row.status==0"><i class="iconfont iconcaozuotubiao-quxiao"></i></el-button>
                </el-tooltip>
                <!-- <el-tooltip class="item" effect="dark" content="入库" placement="top-end">
                                    <el-button size="mini" class="lookta" @click="inStore(scope.row)" v-show="scope.row.status==1"><i class="iconfont iconmengban"></i></el-button>
                                </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="changePage" :current-page="currentPage3" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
          </el-pagination>
        </el-col>
      </el-col>
    </el-row>
    <!-- <el-dialog title="入库" :visible.sync="dialogFormVisible" width="25%" center>
        <el-row class="warp" v-loading="loading" id>
          <el-col style="margin-top:20px;">
           
              <el-row :gutter="20">
               <p style="text-align:center">是否入库</p>
              </el-row>
              <el-row
                style="text-align:center;margin:20px 0px 20px 0;"
                :gutter="10"
                type="flex"
                justify="center"
              >
                <el-col class :xl="5" :lg="6">
                  <el-button
                    v-bind:style="{'background':firstZhuTi,'color':'#fff'}"
                    @click="sure()"
                  >确认</el-button>
                </el-col>
                <el-col class :xl="5" :lg="6">
                  <el-button @click="dialogFormVisible=false">关闭</el-button>
                </el-col>
              </el-row>
          </el-col>
        </el-row>
      </el-dialog> -->
    <el-dialog title="作废" :visible.sync="dialogFormVisible1" width="25%" center>
      <el-row class="warp" v-loading="loading" id>
        <el-col>
          <el-row :gutter="20">
            <p style="text-align:center;font-size:16px">是否作废此条订单</p>
          </el-row>
          <el-row style="text-align:center;margin:30px 0px 10px 0;" :gutter="10" type="flex" justify="center">
            <el-col :span="12">
              <el-button @click="dialogFormVisible1=false">取消</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="danger" @click="sureWaste()">确认</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="入库" :visible.sync="dialogFormVisible" width="800px" center>
      <el-row>
        <el-col>
          <div style="width: 95% !important;left: 50% !important;transform: translateX(-50%);position: relative;">
            <span style="font-size: 15px;font-weight: 600;">采购单号:{{cgid}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row class="warp">
        <el-col style="margin-top:20px;">
          <div style="height:47vh">
            <el-table ref="multipleTable" tooltip-effect="dark" max-height="300" :data="inStoreMedicineData" border style="width:100%;margin-bottom: 20px;" :cell-style="{padding: '5px 0'}">
              <el-table-column label="药品统编" prop="no" min-width="140"></el-table-column>
              <el-table-column label="商品名" prop="name" min-width="100"></el-table-column>
              <el-table-column label="通用名称" prop="commonName" min-width="80"></el-table-column>
              <el-table-column label="规格" prop="standard" min-width="130"></el-table-column>
              <el-table-column label="包装单位" prop="packageUnit" min-width="70"></el-table-column>
              <el-table-column label="入库数量" prop="quantity" min-width="70"></el-table-column>
              <el-table-column label="存放库位" prop="location" min-width="70"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row style="text-align:center;margin:10px 0px 5px 0;" :gutter="10" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="sure()">确认</el-button>
        </el-col>
        <el-col :span="6">
          <el-button @click="dialogFormVisible=false">关闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateRange1: [],
      dateRange2: [],
      option3: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "待审核",
          value: 0,
        },
        {
          label: "待入库",
          value: 1,
        },
        {
          label: "已入库",
          value: 3,
        },
        {
          label: "已作废",
          value: -1,
        },
        {
          label: "审核不通过",
          value: -2,
        },
      ],
      cgid: "",
      searchData: {
        pageIndex: 1,
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      inStoredata: {},
      id: null,
      loading: false,
      inStoreMedicineData: [],
      totalNum: "",
      orderId: "",
      currentPage: 1,
      pageSize: 5,
      tableData: [],
      totalPage: "",
      currentPage3: "",
    };
  },
  created() {
    this.currentPage3 = 1;
    this.fetchData();
  },
  methods: {
    detail(value) {
      this.$router.push({
        //核心语句
        path: "/medical/drugStorage/purchaseDetail", //跳转的路径
        query: {
          //路由传参时push和query搭配使用 ，作用时传递参数
          status: value.status,
          id: value.id,
          state: 1,
        },
      });
    },
    edit(value) {
      this.$router.push({
        path: "/medical/drugStorage/addPurchaseDan",
        query: {
          status: value.status,
          id: value.id,
          sign: "edit",
        },
      });
    },
    check(value) {
      this.$router.push({
        path: "/medical/drugStorage/purchaseDetail",
        query: {
          status: value.status,
          id: value.id,
          state: 0,
        },
      });
    },
    waste(value) {
      this.dialogFormVisible1 = true;
      this.id = value.id;
    },
    sureWaste() {
      axios
        .fetch(
          "medicalServer",
          "/api/purchase-order/check/" + this.id + "?status=-1",
          null,
          null,
          "get"
        )
        .then((res) => {
          this.$message({
            message: "作废成功",
            type: "success",
          });
          this.dialogFormVisible1 = false;
          this.fetchData();
        });
    },
    inStore(value) {
      this.dialogFormVisible = true;
      this.orderId = value.id;
      this.cgid = value.orderNo;
      axios
        .fetch(
          "medicalServer",
          "/api/purchase-order/" + value.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.inStoreMedicineData = [];
          let resData = res.data;
          for (var i in resData.items) {
            this.inStoreMedicineData.push({
              ...resData.items[i].medicine,
              quantity: resData.items[i].quantity,
              unitPrice: resData.items[i].unitPrice,
              itemAmount: resData.items[i].amount,
            });
          }
          this.totalNum = this.inStoreMedicineData.length;
        });
    },
    sure() {
      axios
        .fetch(
          "medicalServer",
          "/api/purchase-order/store/" + this.orderId,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.$message({
            message: "入库成功",
            type: "success",
          });
          this.fetchData();
          this.dialogFormVisible = false;
        });
    },
    add() {
      this.$router.push({
        path: "/medical/drugStorage/addPurchaseDan",
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
      if (this.dateRange2) {
        this.searchData.search_GED_storeDate = this.dateRange2[0];
        this.searchData.search_LED_storeDate = this.dateRange2[1];
      } else {
        this.searchData.search_GED_storeDate = "";
        this.searchData.search_LED_storeDate = "";
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
          this.tableData = res.data;
          this.totalPage = res.total;
          this.currentPage3 = 1;
        });
    },
    search() {
      this.fetchData();
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
  },
};
</script>
<style scoped>
.addBtn {
  margin: 0 0 0 10px;
  float: left;
}

.checkBtn {
  width: 95px;
  height: 36px;
  border: none;
  margin-left: 16px;
  margin-top: 10px;
}

.searchBtnsStyle {
  width: 95px;
  height: 36px;
  background: #4687e1;
  border: 1px solid #4687e1;
  border-radius: 4px;
  color: white;
  margin-left: 16px;
  margin-top: 10px;
}

.addEquipment {
  float: right;
}

.addEquipment .iconfont {
  color: white;
  font-size: 12px;
}
</style>