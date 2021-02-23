<template>
  <div class="prescription">
    <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table" :row-class-name="tableRowClassName">

      <el-table-column label="就诊号" min-width="50" prop="adviceNo">
        <!-- <template slot-scope="scope">
            <span>{{scope.row.sq_source | nothingFilter}}</span>
          </template> -->
      </el-table-column>
      <el-table-column label="就诊日期" min-width="90" prop="createTime"></el-table-column>
      <el-table-column label="诊断" min-width="90" prop="diagnosis" align="left"></el-table-column>
      <el-table-column label="处理" min-width="90" prop="advise" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.medicineCount + scope.row.kitMedicineCount > 0">
            处方开药{{ scope.row.medicineCount + scope.row.kitMedicineCount }}种
          </span>
          <span v-else>
            其他
          </span>
        </template>
      </el-table-column>
      <el-table-column label="医生" min-width="40" prop="doctorName"></el-table-column>
      <el-table-column label="操作" min-width="70">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="作废" placement="top" v-if="scope.row.source!==1&&scope.row.status>=0&&scope.row.status<3">
            <el-button icon="iconfont iconzuofei" @click="drag(scope.row)" size="mini">
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status !== -1" :class="{'item':true,'printed':scope.row.printTime || scope.row.printClinicTime}" effect="dark" content="打印" placement="top">
            <el-button icon="iconfont iconcaozuotubiao-dayin" @click="print(scope.row)" size="mini">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button icon="iconfont iconcaozuotubiao-chakan" @click="view(scope.row)" size="mini">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <el-button icon="iconfont iconfuzhi" @click="copy(scope.row)" size="mini">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
    <!-- 查看详情 -->
    <el-drawer title="" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :with-header="true" tabindex="99" size="840px">
      <template slot="title">
        <el-tabs v-model="activeName">
          <el-tab-pane label="门诊病历" name="first">
            <viewClinic :advice="advice" :elder="elder"></viewClinic>
          </el-tab-pane>
          <el-tab-pane label="处方信息" name="second">
            <viewRecipel :advice="advice" :elder="elder" :showNo="false"></viewRecipel>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-drawer>
    <!-- 打印弹框 -->
    <!-- <el-dialog title="提示" :visible.sync="printDialogVisile" width="70%"> -->
    <el-dialog title="打印病历与处方" class="print_dialog" :visible.sync="printDialogVisile" v-if="printDialogVisile" :close-on-click-modal="false" width="80%" append-to-body show-close=false>
      <div class="left">
        <printClinic :advice="advice" @printed="printed" :tenantName="tenantName" :elder="elder" :showClose="false"></printClinic>
      </div>
      <div class="dialog_right">
        <printReciple @printed="printed" :showClose="false" :advice="advice" :tenantName="tenantName" :elder="elder" @close="printDialogVisile=false;">
        </printReciple>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import viewClinic from "../advice/viewClinic";
import viewRecipel from "../advice/viewRecipel";
import printReciple from "../advice/printRecipel";
import printClinic from "./printClinic";
export default {
  /* 病历处方 */
  name: "Prescription",
  props: {
    elder: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      dialogFormVisible: false, //控制详情抽屉
      activeName: "first",
      advice: {},
      tenantName: "",
      printDialogVisile: false, // 控制打印的弹框
    };
  },
  components: { viewClinic, viewRecipel, printReciple, printClinic },
  watch: {
    "elder.id"(newValue, oldValue) {
      // console.log(newValue);
      this.pageIndex = 1;
      this.currentPage = 0;
      // this.totalPage = 0;
      this.initData();
    },
  },
  created() {
    axios
      .fetch("medicalServer", "/api/base/tenant-name", null, null, "get")
      .then((res) => {
        this.tenantName = res.data;
      });
    if (this.elder.id) {
      this.initData();
    }
  },
  methods: {
    // 初始化数据
    async initData() {
      console.log(this.elder.name + "===elderId===" + this.elder.id);
      // this.$message.success(this.elder.name + "===" + this.elder.id);
      const res = await axios.fetch(
        "medicalServer",
        // "/api/admin/advice/clinic",
        "/api/admin/advice/recipel",
        {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          search_EQI_elderId: this.elder.id,
        },
        null,
        "get"
      );
      this.tableData = res.data;
      this.totalPage = res.total;
    },
    tableRowClassName({ row }) {
      // console.log(row);
      let className = "";
      if (row.status == -1) {
        className += " invalid";
      } else if (row.status == 2) {
        className += " running";
      } else if (row.status == 5) {
        className += " stopped";
      } else {
        className += " commit";
      }
      return className;
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.initData();
    },
    /* 作废 */
    drag(data) {
      // console.log(data);
      this.$confirm("确认作废此条记录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .fetch(
              "medicalServer",
              "/api/advice/invalid-recipel/" + data.id,
              {},
              null,
              "get"
            )
            .then((res) => {
              this.initData();
              this.$message({
                type: "success",
                message: "作废成功!",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废",
          });
        });
    },
    /* 查询详情 */
    view(item) {
      // axios
      //   .fetch("medicalServer", "/api/elder/" + item.elderId, null, null, "get")
      //   .then((res) => {
      //     this.elder = res.data;
      //   });
      // this.advice = item;
      // this.dialogFormVisible = true;
      this.$router.push({
        path: "/medical/case-detail",
        query: {
          elderId: this.elder.id,
          id: item.id,
          tenantName: this.tenantName,
          sign: "detail",
        },
      });
    },
    /* 复制 */
    copy(item) {
      this.$router.push({
        path: "/medical/case-detail",
        query: {
          elderId: this.elder.id,
          id: item.id,
          tenantName: this.tenantName,
          sign: "copy",
        },
      });
    },
    /* 打印 */
    print(item) {
      this.advice = item;
      this.printDialogVisile = true;
    },
    printed() {
      this.initData();
    },
  },
};
</script>

<style scoped>
/deep/ .invalid {
  text-decoration: line-through;
  color: #ff4444;
}
/deep/ .invalid .cell {
  color: #a6b2bd;
}
/deep/ .stopped .cell {
  color: #a6b2bd;
}

/deep/ .running .cell {
  color: #3d8ef8;
}

/deep/ .commit .endTime .cell,
/deep/ .running .endTime .cell {
  color: #ff4444;
}

/deep/ .commit .cell {
  color: #37474f;
}
</style>
<style lang="less" scoped>
.print_dialog {
  /deep/ .el-dialog__body {
    background-color: #f8f8f8;
    display: flex;
    > div {
      padding: 20px;
      box-sizing: border-box;
    }
    .left {
      flex: 1;
      background-color: #fff;
    }
    .dialog_right {
      width: 50%;
      margin-left: 10px;
      background-color: #fff;
    }
  }
}
.el-button.printed {
  color: #ccc;
}
</style>
