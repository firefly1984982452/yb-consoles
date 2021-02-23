<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px" class="search" :inline="true">
      <el-form-item label="供应商" prop="vendorId">
        <el-select v-model="form.vendorId" placeholder="请选择" clearable>
          <el-option v-for="item in partners" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款方式" prop="payMethod">
        <el-select v-model="form.payMethod" placeholder="请选择" clearable>
          <el-option v-for="item in payMethods" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="20字以内" clearable style="width:400px" maxlength="20" show-word-limit></el-input>
      </el-form-item>
    </el-form>

    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="12" class="left">
          <span>药品清单</span>
        </el-col>
        <el-col :span="12" class="right">
          <el-button type="primary" @click="addMedicine" icon="el-icon-plus">从药品库中选择</el-button>
        </el-col>
      </el-row>
      <el-table tooltip-effect="dark" :data="listData" border class="ub-table" :row-key="getRowKey">
        <el-table-column label="药品名称/条码" min-width="150" align="left">
          <template slot-scope="scope">
            {{scope.row.name}}<br>
            {{scope.row.barCode}}
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="standard" min-width="150" align="left"></el-table-column>
        <el-table-column label="包装单位" prop="unit" min-width="50"></el-table-column>
        <el-table-column label="采购量">
          <template slot-scope="scope">
            <el-input-number :controls="false" @change="changeQuantity(scope.$index,scope.row)" v-model="scope.row.quantity" :min="1" :max="999999" style="width:100px"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="采购单价(元)">
          <template slot-scope="scope">
            <el-input-number :controls="false" @change="changeQuantity(scope.$index,scope.row)" v-model="scope.row.unitPrice" :min="0" :max="999999" style="width:100px"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="采购小计" width="100" align="right" prop="amount"></el-table-column>
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
              <el-button size="mini" class="lookta" @click="deleteMedicine(scope.row)"><i class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="pannel">
        <el-col :span="24" class="left">
          <span style=" font-weight: bolder;padding:15px 10px">共{{listData.length}}种药品，合计金额{{totalAmount}}元</span>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button type="primary" @click="saveOrder()">提交</el-button>
        <el-button @click="cancel()">取消</el-button>
      </div>
    </div>

    <el-dialog title="选择药品" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="1000px" :close-on-click-modal="false">
      <el-form ref="searchData" :model="searchData" class="search" :inline="true">
        <el-form-item label="" label-width="0">
          <el-select v-model="searchData.type" placeholder="全部类型" clearable @change="searchMedicine">
            <el-option v-for="(item,index) in types" :key="index.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0">
          <el-select v-model="searchData.search_EQS_category" placeholder="全部分类" clearable @change="searchMedicine">
            <el-option v-for="(item,index) in categories" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0">
          <el-input v-model="searchData.name" placeholder="名称/条码/编码/助记码" clearable @change="searchMedicine" style="width:190px"></el-input>
        </el-form-item>
        <el-button @click="searchMedicine" type="primary"><i style="font-size: 12px;margin-right: 5px;" class="iconfont iconjichutubiao-chaxun"></i>查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
      </el-form>
      <div style="min-height:450px;">
        <el-table ref="medicineTable" max-height="400" :data="listData2" border class="ub-table" @selection-change="handleSelectionChange" :row-key="getRowKeys">
          <el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
          <el-table-column label="药品名称/条码" align="left" min-width="150">
            <template slot-scope="scope">
              {{scope.row.fullName}}<br>
              {{scope.row.barCode}}
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="standard" min-width="150" align="left"></el-table-column>
          <el-table-column label="包装单位" prop="packageUnit" min-width="50"></el-table-column>
          <el-table-column label="可用库存" prop="availableCount" min-width="50"></el-table-column>
        </el-table>
        <el-pagination @current-change="changePage" :total="dataCount2" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
      <div class="footer">
        <el-button type="primary" @click="doAddMedicine()">确 定</el-button>
        <el-button @click="dialogFormVisible=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      checkedFalse: "",
      totalPrice: 0,
      partners: [],
      listData: [],
      isShow: false,
      totalAmount: "0.00",
      payMethods: ["货到付款", "预付货款", "其它"],
      types: [
        { id: 1, name: "西药/中成药" },
        { id: 3, name: "中草药" },
      ],
      form: {
        payMethod: "货到付款",
        vendorName: "",
      },
      rules: {
        vendorId: [
          {
            required: true,
            message: "请选择供应商",
            trigger: ["blur", "change"],
          },
        ],
      },
      searchData: {
        type: 1,
        pageIndex: 1,
        pageSize: 10,
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
      listData2: [],
      dataCount2: "",
      currentPage3: "",
      categories: [],
    };
  },
  created() {
    this.status = this.$route.query.status;
    this.id = this.$route.query.id;
    if (this.id) {
      this.init();
    }
    this.getPartners();
    this.getCategories();
  },

  methods: {
    getRowKeys(row) {
      return row.id;
    },
    getCategories() {
      axios
        .fetch("medicalServer", "/api/medicine/categories", null, null, "get")
        .then((res) => {
          this.categories = res.data;
        });
    },
    addMedicine() {
      this.checkedData = [];
      this.dialogFormVisible = true;
      this.changePage(1);
    },
    searchMedicine() {
      this.searchData.search_EQI_source = 1;
      let that = this;
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/page",
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          that.listData2 = res.data;
          that.dataCount2 = res.total;
          that.$nextTick(() => {
            for (var i = 0; i < that.listData2.length; i++) {
              let row = that.listData2[i];
              let find = false;
              // //临时选择项
              // for (var j = 0; j < that.checkedData.length; j++) {
              //   if (row.id == that.checkedData[j].id) {
              //     find = true;
              //     break;
              //   }
              // }
              // if (!find) {
              // 已添加列表
              for (var j = 0; j < that.listData.length; j++) {
                if (row.id == that.listData[j].medicineId) {
                  find = true;
                  break;
                }
              }
              // }
              if (find) {
                this.$refs.medicineTable.toggleRowSelection(row);
              }
            }
          });
        });
    },
    changePage(val) {
      this.searchData.pageIndex = val;
      this.searchMedicine();
    },
    reset() {
      this.checkedData = [];
      this.searchData = { pageSize: 10, pageIndex: 1, type: 1 };
      this.searchMedicine();
    },
    changeQuantity(index, data) {
      if (data.quantity && data.unitPrice) {
        data.amount = (data.quantity * data.unitPrice).toFixed(2);
        this.$set(this.listData, index, data);
        this.$forceUpdate();
        try {
          if (data.amount != "" && data.amount) {
            let priceArr = this.listData.map((v) => v.amount);
            let priceArr2 = priceArr.filter((v) => v != undefined);
            this.totalAmount = eval(priceArr2.join("+")).toFixed(2);
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        data.amount = "0";
      }
    },
    saveOrder() {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          return true;
        } else {
          for (var i = 0; i < this.listData.length; i++) {
            if (
              this.listData[i]["quantity"] == undefined ||
              this.listData[i]["quantity"] == ""
            ) {
              this.$message.error("请输入第" + [i + 1] + "行药品的采购数量");
              return;
            }
          }
          this.medicine = this.listData.map((v) => {
            return {
              medicineId: v.medicineId,
              quantity: v.quantity,
              unitPrice: v.unitPrice,
            };
          });
          let data = {
            id: this.id,
            remark: this.form.remark,
            vendorId: this.form.vendorId,
            vendorName: this.partners.filter(
              (v) => v.value == this.form.vendorId
            )[0].label,
            payMethod: this.form.payMethod,
            items: this.medicine,
          };
          axios
            .fetch("medicalServer", "/api/purchase-order", data, "json")
            .then((res) => {
              this.$message.success("操作成功");
              this.$router.push({
                path:
                  "/medical/drugStorage/store/storeInMain?activeName=second",
              });
            });
        }
      });
    },
    cancel() {
      this.$router.push({
        path: "/medical/drugStorage/store/storeInMain?activeName=second",
      });
    },
    getPartners() {
      axios
        .fetch("medicalServer", "/api/partner/providers", null, null, "get")
        .then((res) => {
          this.partners = res.data.map((v) => {
            return {
              label: v.partnerName,
              value: v.id,
            };
          });
        });
    },
    selectAllChange(val) {
      //取消全选
      if (val.length == 0) {
        for (var i = 0; i < this.listData2.length; i++) {
          let medicineId = this.listData2[i].id;
          for (var j = 0; j < this.checkedData.length; j++) {
            if (medicineId == this.checkedData[j].id) {
              this.checkedData.splice(j, 1);
            }
          }
        }
      }
    },
    handleSelectionChange(val) {
      this.checkedData = val;
    },
    doAddMedicine() {
      this.dialogFormVisible = false;
      this.isShow = true;
      for (var i in this.checkedData) {
        let temp = this.checkedData[i];
        temp.unitPrice = temp.purchasePrice;
        temp.name = temp.fullName;
        temp.unit = temp.packageUnit;
        temp.medicineId = temp.id;
        temp.amount = 0;
        let find = false;
        for (var j in this.listData) {
          let m = this.listData[j];
          if (m.medicineId == temp.medicineId) {
            find = true;
            break;
          }
        }
        if (!find) {
          this.listData.push(temp);
        }
      }
      this.totalNum = this.listData.length;
    },
    deleteMedicine(value) {
      this.listData = this.listData.filter((v) => v.id != value.id);
      this.checkedData = this.checkedData.filter((v) => v.id != value.id);
      this.totalNum = this.listData.length;
      if (this.listData.length < 1) {
        this.totalAmount = "0.00"; //数据删除完时总金额为0
      } else {
        let priceArr = this.listData.map((v) => v.amount);
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
          this.listData = resData.items;
          this.form = resData;
          this.totalNum = resData.items.length;
          this.totalAmount = resData.total;
        });
    },
  },
};
</script>

<style scoped>
/deep/ .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
/deep/ .search .el-input {
  width: 140px;
}
/deep/ .footer {
  padding: 0px;
}
</style>