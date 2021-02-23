<template>
  <div class="app-container createOuts" id="liveCrList">
    <el-row class="warp" v-loading="loading" id="staffTableStyle">
      <el-col class="searchTop">
        <el-form ref="searchForm" :model="searchForm" label-width="70px">
          <el-row type="flex" class="row-bg" :gutter="0">
            <el-col :xl="4" :lg="5" style="margin-left:10px">
              <el-form-item label="供应商">
                <el-select v-model="searchForm.vendorId" placeholder="请选择" clearable>
                  <el-option v-for="item in optionsPartner" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="5" style="margin-left:20px">
              <el-form-item label="付款方式">
                <el-select v-model="searchForm.payMethod" placeholder="请选择" clearable>
                  <el-option v-for="item in payMethodsOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col class="searchTop tabelStyle" style="padding-right:10px;height:auto;min-height:20vh;">
        <span style=" font-weight: bolder;padding:15px 10px">总金额 : {{totalAmount}}</span>
        <el-button type="primary" @click="checkMedicine" icon="el-icon-plus" class="addEquipment">选择药品</el-button>
        <el-col v-show="isShow" style="background: rgb(255, 255, 255);border-radius: 4px;padding-top: 15px;">
          <el-table tooltip-effect="dark" :data="alreadyMedicineData" border>
            <el-table-column label="药品统编" prop="no"></el-table-column>
            <el-table-column label="通用名称" prop="commonName"></el-table-column>
            <el-table-column label="商品名" prop="name"></el-table-column>
            <el-table-column label="规格" prop="standard"></el-table-column>
            <el-table-column label="包装单位" prop="packageUnit"></el-table-column>
            <el-table-column label="可用库存" prop="availableCount"></el-table-column>
            <el-table-column label="采购数量">
              <template slot-scope="scope">
                <el-form ref="scope.row" :model="scope.row">
                  <el-form-item label="">
                    <el-input @input="changePrice(scope.row)" v-model.number="scope.row.quantity" placeholder="请输入数量" clearable></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="采购价">
              <template slot-scope="scope">
                <span v-if="sign!='edit'">{{scope.row.purchasePrice}}</span>
                <span v-if="sign=='edit'">{{ scope.row.unitPrice || scope.row.purchasePrice}}</span>
              </template>
            </el-table-column>
            <el-table-column label="小计" width="120">
              <template slot-scope="scope"><span>{{scope.row.itemAmount}}</span></template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                  <el-button size="mini" class="lookta" @click="deleteMedicine(scope.row)"><i class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-col>
    </el-row>
    <div class="footer">
      <el-button type="primary" @click="saveOrder()">提交</el-button>
      <el-button @click="cancel()">取消</el-button>
    </div>

    <el-dialog title="选择药品" :visible.sync="dialogFormVisible" width="850px" @close="closeDialog">
      <el-row>
        <el-form ref="searchData" :model="searchData" label-width="70px" :inline="true">
          <el-form-item label="药品统编">
            <el-input @input="insertMedicineNo" v-model="searchData.search_LIKES_no" placeholder="请输入" clearable style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="商品名">
            <el-input @input="insertMedicine" v-model="searchData.search_LIKES_name" placeholder="请输入" clearable style="width:120px"></el-input>
          </el-form-item>
          <el-button @click="searchMedicine" type="primary"><i style="font-size: 12px;margin-right: 5px;" class="iconfont iconjichutubiao-chaxun"></i>查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="resizeData()">重置</el-button>
        </el-form>
      </el-row>

      <el-table ref="multipleTable" tooltip-effect="dark" max-height="300" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="药品统编" prop="no" min-width="130"></el-table-column>
        <el-table-column label="商品名" prop="name" min-width="140"></el-table-column>
        <el-table-column label="通用名称" prop="commonName" min-width="80"></el-table-column>
        <el-table-column label="规格" prop="standard" min-width="120"></el-table-column>
        <el-table-column label="批准文号" prop="approvalNo" min-width="150"></el-table-column>
      </el-table>

      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>

      <el-row style="text-align:center;margin:20px 0px 20px 0;" :gutter="10" type="flex" justify="center">
        <el-col class :xl="3" :lg="4">
          <el-button type="primary" @click="addMedicines()">保存</el-button>
        </el-col>
        <el-col class :xl="3" :lg="4">
          <el-button @click="closeDig">关闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      checkedFalse: "",
      totalPrice: 0,
      optionsPartner: [],
      alreadyMedicineData: [],
      isShow: false,
      totalAmount: "0.00",
      payMethodsOptions: [
        {
          value: "货到付款",
          label: "货到付款",
        },
      ],
      searchForm: {
        payMethod: "货到付款",
        vendorId: "",
      },
      searchData: {
        pageIndex: 1,
        pageSize: 5,
      },
      medicine: [],
      loading: false,
      sign: "",
      id: "",
      status: "",
      checkedData: [],
      totalNum: 0,
      dataCount: 0,
      medicineData: [],
      tableData: [],
      totalPage: "",
      currentPage3: "",
    };
  },
  created() {
    this.status = this.$route.query.status;
    this.id = this.$route.query.id;
    this.sign = this.$route.query.sign;
    if (this.sign == "edit") {
      this.init();
    }
    this.searchPartnerId();
  },

  methods: {
    checkMedicine() {
      this.checkedData = [];
      if (this.searchForm.vendorId == "") {
        this.$message.error("请选择供应商");
        return;
      }
      this.dialogFormVisible = true;
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/supplier/" + this.searchForm.vendorId,
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          this.tableData = res.data;
          this.dataCount = res.total;
        });
    },
    changePage(val) {
      this.searchData.pageIndex = val;
      this.checkMedicine();
    },
    insertMedicine(val) {
      this.checkMedicine();
    },
    insertMedicineNo(val) {
      this.checkMedicine();
    },
    searchMedicine() {
      this.checkMedicine();
    },
    resizeData() {
      this.searchData.search_LIKES_no = "";
      this.searchData.search_LIKES_name = "";
      this.searchData.pageIndex = 1;
      this.currentPage3 = 1;
      this.checkMedicine();
    },
    changePrice(value) {
      if (this.sign == "edit" && value.unitPrice) {
        value.purchasePrice = value.unitPrice;
      }
      if (value.quantity != "" && value.quantity) {
        value.itemAmount = (value.quantity * value.purchasePrice).toFixed(2);
        if (value.itemAmount != "" && value.itemAmount) {
          let priceArr = this.alreadyMedicineData.map((v) => v.itemAmount);
          let priceArr2 = priceArr.filter((v) => v != undefined);
          this.totalAmount = eval(priceArr2.join("+")).toFixed(2);
        }
      } else {
        value.itemAmount = "";
      }
    },
    saveOrder() {
      if (this.searchForm.vendorId == "") {
        this.$message.error("请选择供应商");
        return;
      }
      for (var i = 0; i < this.alreadyMedicineData.length; i++) {
        if (
          this.alreadyMedicineData[i]["quantity"] == undefined ||
          this.alreadyMedicineData[i]["quantity"] == ""
        ) {
          this.$message.error("请输入第" + [i + 1] + "行药品的采购数量");
          return;
        }
      }
      this.medicine = this.alreadyMedicineData.map((v) => {
        return {
          medicineId: v.id,
          quantity: v.quantity,
        };
      });
      var dataAll = {
        id: this.id,
        vendorId: this.searchForm.vendorId,
        vendorName: this.optionsPartner.filter(
          (v) => v.value == this.searchForm.vendorId
        )[0].label,
        payMethod: this.searchForm.payMethod,
        items: this.medicine,
      };
      axios
        .fetch("medicalServer", "/api/purchase-order", dataAll, "json")
        .then((res) => {
          this.$message.success("操作成功");
          this.$router.push({
            path: "/medical/drugStorage/purchaseStore",
          });
        });
    },
    cancel() {
      this.$router.push({ path: "/medical/drugStorage/purchaseStore" });
    },
    searchPartnerId() {
      axios
        .fetch("medicalServer", "/api/partner/providers", null, null, "get")
        .then((res) => {
          this.optionsPartner = res.data.map((v) => {
            return {
              label: v.partnerName,
              value: v.id,
            };
          });
        });
    },
    handleSelectionChange(val) {
      if (this.checkedData.length > 0) {
        this.checkedData = [...val, ...this.checkedData];
      } else {
        this.checkedData = val;
      }
    },
    addMedicines() {
      this.dialogFormVisible = false;
      this.isShow = true;
      for (var i in this.checkedData) {
        let temp = this.checkedData[i];
        let find = false;
        for (var j in this.alreadyMedicineData) {
          let m = this.alreadyMedicineData[j];
          if (m.id == temp.id) {
            find = true;
            break;
          }
        }
        if (!find) {
          this.alreadyMedicineData.push(temp);
        }
      }
      this.totalNum = this.alreadyMedicineData.length;
    },
    closeDig() {
      this.dialogFormVisible = false;
    },
    //弹窗关闭清空搜索条件  //关闭弹窗回调
    closeDialog() {
      this.currentPage3 = 1;
      this.searchData.pageIndex = 1;
      if (
        this.searchData.medicineName != "" ||
        this.searchData.medicineNo != ""
      ) {
        this.searchData.medicineName = "";
        this.searchData.medicineNo = "";
      }
    },
    deleteMedicine(value) {
      this.alreadyMedicineData = this.alreadyMedicineData.filter(
        (v) => v.id != value.id
      );
      this.checkedData = this.checkedData.filter((v) => v.id != value.id);
      this.totalNum = this.alreadyMedicineData.length;
      if (this.alreadyMedicineData.length < 1) {
        this.totalAmount = "0.00"; //数据删除完时总金额为0
      } else {
        let priceArr = this.alreadyMedicineData.map((v) => v.itemAmount);
        this.totalAmount = eval(priceArr.join("+"));
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    init() {
      axios
        .fetch(
          "medicalServer",
          "/api/purchase-order/" + this.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.isShow = true;
          let resData = res.data;
          for (var i in resData.items) {
            this.alreadyMedicineData.push({
              ...resData.items[i].medicine,
              quantity: resData.items[i].quantity,
              unitPrice: resData.items[i].unitPrice,
              itemAmount: resData.items[i].amount,
            });
          }
          this.searchForm.vendorId = resData.vendorId;
          this.totalNum = resData.items.length;
          this.totalAmount = resData.total;
        });
    },
  },
};
</script>

<style scoped>
.addEquipment {
  float: right !important;
}
.tijiao {
  display: flex;
  justify-content: center;
}

.checkFalse {
  width: 100%;
  text-align: left;
  height: 40px;
  border-bottom: 1px solid #eeeeee;
  line-height: 40px;
  margin-right: 0%;
}

.checkFalseLast {
  width: 100%;
  text-align: left;
  height: 40px;
  border-bottom: none;
  line-height: 40px;
  margin-right: 0%;
}

.checkFalse:nth-last-child {
  border-bottom: none;
}
/*.el-pagination{
		position: absolute;
		margin-top: 10px!important;
		bottom: -10px;
		left: 50%;
	    transform: translateX(-50%);
		text-align: center
	}*/
</style>