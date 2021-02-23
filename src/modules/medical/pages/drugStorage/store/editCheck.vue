<template>
  <div>
    <el-form ref="ruleForm" :model="form" class="search" :rules="rules" :inline="true">
      <el-form-item>
        <span slot="label">{{typeName}}备注</span>
        <el-input v-model="form.remark" placeholder="20字以内" clearable style="width:400px" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item style="float: right;color:#FF6600;">
        <i class="el-icon-warning"></i> 提示：盘库单完成审核之前请勿进行出入库操作（含处方审核出库），以免影响实际盘库结果
      </el-form-item>
    </el-form>

    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="12" class="left">
          <span>{{typeName}}清单</span>
        </el-col>
        <el-col :span="12" class="right" v-if="purchaseId==null">
          <el-button type="primary" @click="addMedicine" icon="el-icon-plus">从药品库中选择</el-button>
          <el-button type="primary" @click="addByType" icon="el-icon-plus">全部药品</el-button>
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
        <el-table-column label="帐面数量" prop="quantity" min-width="50"></el-table-column>
        <el-table-column label="盘点数量">
          <template slot-scope=" scope">
            <el-input-number :controls="false" @change="changeQuantity(scope.$index,scope.row)" v-model="scope.row.realQuantity" :min="0" :max="999999" style="width:100px"></el-input-number>
          </template>
        </el-table-column>
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
          <span style=" font-weight: bolder;padding:15px 10px">共{{listData.length}}种药品，合计盘点数量{{quantity}}件</span>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button type="primary" @click="saveOrder()">提交</el-button>
        <el-button @click="back()">取消</el-button>
      </div>
    </div>

    <el-dialog title="选择药品" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="1000px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="searchData" :model="searchData" class="search" label-width="0" :inline="true">
        <el-form-item label="" label-width="0">
          <el-select v-model="searchData.search_EQS_type" placeholder="全部类型" clearable @change="search">
            <el-option v-for="(item,index) in types2" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0">
          <el-select v-model="searchData.search_EQS_category" placeholder="全部分类" clearable @change="search">
            <el-option v-for="(item,index) in categories" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0">
          <el-input v-model="searchData.name" placeholder="名称/条码/编码/助记码" clearable @change="search" style="width:200px"></el-input>
        </el-form-item>
        <el-button @click="search" type="primary"><i style="font-size: 12px;margin-right: 5px;" class="iconfont iconjichutubiao-chaxun"></i>查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
      </el-form>
      <div style="min-height:450px;">
        <el-table ref="medicineTable" max-height="400" :data="listData2" border class="ub-table" @selection-change="handleSelectionChange" :row-key="getRowKeys">
          <el-table-column type="selection" width="40" :reserve-selection="true" :selectable="selectable"></el-table-column>
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

    <el-dialog title="选择要加载的药品类型" :visible.sync="dialogAddByTypeVisible" v-if="dialogAddByTypeVisible" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="searchData" class="search" label-width="0" :inline="true">
        <el-form-item label="" label-width="0">
          <el-checkbox-group v-model="selectTypes">
            <el-checkbox v-for="(item,index) in types2" :label="item" :key="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="primary" @click="doAddByType()">确 定</el-button>
        <el-button @click="dialogAddByTypeVisible=false">关 闭</el-button>
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
      dialogAddByTypeVisible: false,
      listData: [],
      isShow: false,
      quantity: 0,
      types: [
        { id: 1, name: "西药/中成药" },
        { id: 3, name: "中草药" },
      ],
      types2: ["西药", "中成药"],
      form: {
        selectTypes: [
          {
            required: true,
            message: "请选择",
            trigger: ["blur", "change"],
          },
        ],
      },
      searchData: {
        pageIndex: 1,
        pageSize: 10,
      },
      rules: {},
      medicine: [],
      loading: false,
      sign: "",
      id: "",
      status: "",
      checkedData: [],
      totalNum: 0,
      dataCount: 0,
      listData2: [],
      dataCount2: "",
      currentPage3: "",
      categories: [],
      type: null,
      typeName: "",
      selectTypes: [],
      purchaseId: null,
    };
  },
  created() {
    this.status = this.$route.query.status;
    this.id = this.$route.query.id;
    this.typeName = "盘点";
    if (this.id) {
      this.init();
    }
    this.getCategories();
  },

  methods: {
    preappendTypeName(label) {
      return this.typeName + label;
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
      this.searchData = {
        pageIndex: 1,
        pageSize: 10,
      };
      this.searchMedicine();
    },
    getRowKeys(row) {
      return row.id;
    },
    selectable(row, rowIndex) {
      let find = false;
      for (var i = 0; i < this.listData.length; i++) {
        if (this.listData[i].medicineId == row.id) {
          find = true;
          break;
        }
      }
      return !find;
    },
    searchMedicine() {
      this.searchData.search_EQI_source = 1;
      this.searchData.type = 1;
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
          for (var i = 0; i < that.listData2.length; i++) {
            let row = that.listData2[i];
            let find = false;
            // 已添加列表
            for (var j = 0; j < that.listData.length; j++) {
              if (row.id == that.listData[j].medicineId) {
                find = true;
                break;
              }
            }
            if (find) {
              this.$refs.medicineTable.toggleRowSelection(row);
            }
          }
        });
    },
    changePage(val) {
      this.searchData.pageIndex = val;
      this.searchMedicine();
    },
    search() {
      this.changePage(1);
    },
    reset() {
      this.checkedData = [];
      this.searchData = { pageSize: 10, pageIndex: 1 };
      this.searchMedicine();
    },
    changeQuantity(index, data) {
      try {
        let realQuantity = this.listData.map((v) => v.realQuantity);
        this.quantity = eval(realQuantity.join("+"));
      } catch (e) {
        console.log(e);
      }
    },
    saveOrder() {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          return true;
        } else {
          let list = this.listData;
          if (list.length == 0) {
            this.$message.error("请选择药品");
            return;
          }
          for (var i = 0; i < list.length; i++) {
            if (list[i]["realQuantity"] === undefined) {
              this.$message.error("请输入第" + [i + 1] + "行药品的盘点数量");
              return;
            }
          }
          this.medicine = list.map((v) => {
            return {
              medicineId: v.medicineId,
              quantity: v.quantity,
              realQuantity: v.realQuantity,
            };
          });
          let data = this.form;
          data.items = this.medicine;
          axios
            .fetch("medicalServer", "/api/check", data, "json")
            .then((res) => {
              this.$message.success("操作成功");
              this.back();
            });
        }
      });
    },
    back() {
      this.$router.push({
        path: "/medical/drugStorage/store/checkList",
      });
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
        temp.quantity = temp.availableCount;
        temp.realQuantity = 1;
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
      this.changeQuantity();
    },
    deleteMedicine(value) {
      this.listData = this.listData.filter((v) => v.id != value.id);
      this.checkedData = this.checkedData.filter((v) => v.id != value.id);
      this.totalNum = this.listData.length;
      if (this.listData.length < 1) {
        this.quantity = 0;
      } else {
        let realQuantity = this.listData.map((v) => v.realQuantity);
        this.quantity = eval(realQuantity.join("+"));
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    init() {
      axios
        .fetch("medicalServer", "/api/check/" + this.id, null, null, "get")
        .then((res) => {
          this.isShow = true;
          let resData = res.data;
          this.listData = resData.items;
          this.form = resData;
          if (resData.purchaseId) {
            this.purchaseId = resData.purchaseId;
          }
          this.totalNum = resData.kind;
          this.quantity = resData.quantity;
        });
    },
    addByType() {
      this.selectTypes = [];
      this.dialogAddByTypeVisible = true;
    },
    doAddByType() {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          return true;
        } else {
          let data = {
            pageIndex: 1,
            search_EQI_source: 1,
            pageSize: 1000,
          };
          for (var i = 0; i < this.selectTypes.length; i++) {
            data.search_EQS_type = this.selectTypes[i];
            axios
              .fetch("medicalServer", "/api/medicine/page", data, null, "get")
              .then((res) => {
                this.checkedData = res.data;
                this.doAddMedicine();
                this.dialogAddByTypeVisible = false;
              });
          }
        }
      });
    },
  },
};
</script>
<style scoped>
/deep/ .search .el-input {
  width: 140px;
}
/deep/ .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
/deep/ .search .vendor .el-input {
  width: 200px;
}
/deep/ .footer {
  padding: 0px;
}
/deep/ .el-table__header-wrapper .el-checkbox {
  display: none;
}
</style>