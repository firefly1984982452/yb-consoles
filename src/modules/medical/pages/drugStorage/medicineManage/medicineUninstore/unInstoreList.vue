<template>
  <div id="huangCss">
    <div class="topContent">
      <el-row align="middle">
        <el-form ref="searchForm" :model="searchForm">
          <el-col :xl="4" :lg="4">
            <el-form-item label="处方单号" label-width="70px">
              <el-input v-model="searchForm.orderNo" placeholder="请输入处方单号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="4">
            <el-form-item label="老人姓名" label-width="70px">
              <el-input v-model="searchForm.elderName" placeholder="请输入老人姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="7">
            <el-form-item label="创建时间" label-width="70px">
              <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchForm.storeStartDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="4">
            <el-form-item label="状态" label-width="70px">
              <el-select v-model="searchForm.status" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in systemOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="4" :lg="4" class="searchBtns" style="margin-left: 1.5%">
            <el-button style="background: #2368D3;color: #FFFFFF;" icon="el-icon-search" @click="dataInit(1)">查询
            </el-button>
            <el-button icon="el-icon-refresh-right" @click="resizeData()">重置
            </el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="minContent">
      <el-row>
        <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="top:20px" :cell-style="{padding: '5px 0'}">
          <el-table-column label="处方单号">
            <template slot-scope="scope">{{scope.row.orderNo | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="药品清单">
            <template slot-scope="scope">{{scope.row.orderDescription | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="老人姓名">
            <template slot-scope="scope">{{scope.row.elderName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="房间床位">
            <template slot-scope="scope">{{scope.row.roomName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span @click="seeAll(scope.row)">
                <span style>{{scope.row.createTime | nothingFilter}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="医生姓名">
            <template slot-scope="scope">{{scope.row.doctorName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="出库时间">
            <template slot-scope="scope">{{scope.row.handleTime | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="出库人">
            <template slot-scope="scope">{{scope.row.handlerName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">{{scope.row.status | medFilter}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                <el-button size="mini" class="lookta" @click="see(scope.row)">
                  <i class="iconfont iconcaozuotubiao-chakan"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="出库" placement="top-end">
                <el-button v-if="scope.row.status!=1" size="mini" class="lookta" @click="exchange(scope.row)">
                  <i class="iconfont iconmengban"></i>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage3" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage"></el-pagination>
      </el-row>
      <el-dialog title="出库" :visible.sync="dialogFormVisible" width="60%" center>
        <el-row class="warp" v-loading="loading" id>
          <el-col style="margin-top:20px;">
            <div style="height:47vh">
              <el-table ref="multipleTable" tooltip-effect="dark" :data="inStoreMedicineData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border style="width:95%;position:relative;left:2%;" :cell-style="{padding: '5px 0'}">
                <el-table-column label="药品统编" width="160">
                  <template slot-scope="scope">{{scope.row.medicineNo | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="商品名" min-width="100">
                  <template slot-scope="scope">{{scope.row.medicineName | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="通用名称" min-width="100">
                  <template slot-scope="scope">{{scope.row.commonName | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="规格" min-width="160">
                  <template slot-scope="scope">{{scope.row.medicineStandard | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="用药单位" min-width="160">
                  <template slot-scope="scope">{{scope.row.useUnit | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="用药数量" min-width="140">
                  <template slot-scope="scope">
                    <el-form ref="scope.row" :model="scope.row" style="height:40px">
                      <el-form-item label>
                        <!--<el-input @input="changePrice1(scope.row)" v-model="scope.row.itemCount" placeholder="用药数量" clearable></el-input>-->
                        <el-input v-model="scope.row.itemCount" placeholder="用药数量" clearable></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination @current-change="handleCurrentChange1" :current-page="currentPage" :page-size="5" layout="total, prev, pager, next, jumper" :total="totalNum"></el-pagination>
          </el-col>
        </el-row>
        <el-row style="text-align:center;margin:10px 0px 5px 0;" :gutter="10" type="flex" justify="center">
          <el-col :xl="3" :lg="4">
            <el-button @click="sure()">确认</el-button>
          </el-col>
          <el-col :xl="3" :lg="4">
            <el-button @click="dialogFormVisible=false">关闭</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      chukuNo: "",
      searchForm: {
        orderNo: "",
        elderName: "",
        status: "",
        storeStartDate: "",
      },
      systemOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: 0,
          label: "待出库",
        },
        {
          value: 1,
          label: "已出库",
        },
      ],
      dialogFormVisible: false,
      inStoreMedicineData: [],
      orderId: "",
      currentPage: 1,
      pageSize: 5,
      totalNum: 0,
      tableData: [],
      totalPage: "",
      currentPage3: "",
    };
  },
  created() {
    this.dataInit(1);
  },
  methods: {
    dataInit(num) {
      let data = {
        orderNo: this.searchForm.orderNo,
        elderName: this.searchForm.elderName,
        status: this.searchForm.status,
        storeStartDate: this.searchForm.storeStartDate,
        pageIndex: num,
        pageSize: 10,
      };
      axios
        .fetch("medicalServer", "/medicalElderOrder/all", data)
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.tableData = res.data;
            this.totalPage = res.total;
            this.currentPage3 = 1;
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning",
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    exchange(value) {
      //				console.log(value);
      this.chukuNo = value.orderNo;
      //				return;

      this.dialogFormVisible = true;
      this.orderId = value.orderId;
      this.inStoredata = {
        id: value.orderId,
      };
      axios
        .fetch(
          "medicalServer",
          "/medicalElderOrderDetail/order",
          this.inStoredata
        )
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            //							console.log(res.data);
            this.inStoreMedicineData = res.data;
            this.totalNum = res.total;
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning",
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    see(val) {
      this.$router.push({
        path: "/medical/drugStorage/unInstoreDetail",
        query: {
          id: val.orderId,
          outNo: val.orderNo,
          eldName: val.elderName,
          handleName: val.handleName,
          doctor: val.doctorName,
          ctime: val.createTime,
          handleTime: val.handleTime,
          state: val.status,
        },
      });
    },
    handleCurrentChange1(val) {
      this.currentPage = val;
    },
    sure() {
      //				console.log(this.inStoreMedicineData);
      //				return
      //				debugger
      for (var i = 0; i < this.inStoreMedicineData.length; i++) {
        if (
          this.inStoreMedicineData[i].itemCount == null ||
          this.inStoreMedicineData[i].itemCount == ""
        ) {
          this.$message.error("请输入第" + [i + 1] + "行的入库数量");
          return;
        }
        this.inStoreMedicineData[i]["storeAgeCount"] = this.inStoreMedicineData[
          i
        ]["itemCount"];
        this.inStoreMedicineData[i]["orderNo"] = this.chukuNo;
      }
      let data = {
        orderId: this.orderId,
        medicineAndStorageVos: this.inStoreMedicineData,
      };
      axios
        .fetch("medicalServer", "/medicalInventory/outStorage", data, "json")
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.$message({
              message: "出库成功",
              type: "success",
            });
            this.tableData = res.data;
            this.totalPage = res.total;
            this.currentPage3 = 1;
            this.dialogFormVisible = false;
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning",
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /*刷新*/
    resizeData() {
      this.loading = true;
      this.searchForm.orderNo = "";
      this.searchForm.elderName = "";
      this.searchForm.status = "";
      this.searchForm.storeStartDate = "";
      this.dataInit(1);
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.dataInit(val);
    },
  },
  filters: {
    medFilter(val) {
      return ["待出库", "已出库"][val];
    },
  },
};
</script>
<style scoped>
#huangCss {
  width: 100%;
  /* border: 1px solid red; */
  height: 90.2vh;
  /* position: relative; */
}

#huangCss .topContent {
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
}

#huangCss .minContent {
  /* border: 1px solid red; */
  /*height: 78vh;*/
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  position: relative;
}

#huangCss .el-button i {
  /* font-size: 12px; */
  margin-right: 5px;
}

#huangCss .jishu {
  text-align: center;
  padding: 16px 0 0 0;
  font-size: 12px;
  font-weight: 300;
  color: rgba(165, 165, 165, 1);
}

#huangCss .el-pagination {
  margin-top: 14px;
}
</style>