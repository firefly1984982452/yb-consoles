<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData" label-width="80">
      <el-row>
        <el-col :span="22">
          <el-form-item label="开方日期">
            <el-date-picker @change="search" v-model="dateRange" style="width:250px" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="发药状态">
            <el-select @change="search" v-model="searchData.status" clearable filterable placeholder="全部">
              <el-option label="未发药" value="2"></el-option>
              <el-option label="已发药" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="长者信息">
            <el-input v-model.trim="searchData.search_LIKES_name" placeholder="姓名/入院编号" clearable @change="search" style="width:250px">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
      </el-row>
      <el-table :data="listData" border class="ub-table">
        <el-table-column prop="adviceNo" label="处方编号" width="100"></el-table-column>
        <el-table-column prop="elderName" label="长者" min-width="100"></el-table-column>
        <el-table-column label="房间床位" align="left" min-width="80">
          <template slot-scope="scope">
            {{scope.row.bedName}}
          </template>
        </el-table-column>
        <el-table-column prop="checkinNo" label="入院编号" min-width="100"></el-table-column>
        <el-table-column prop="feeType" label="医保情况" width="80"></el-table-column>
        <el-table-column prop="medicineCount" label="药物种数" width="80">
          <template slot-scope="scope">
            {{scope.row.medicineCount + scope.row.kitMedicineCount}}
          </template>
        </el-table-column>
        <el-table-column label="发药状态" width="80" align="left">
          <template slot-scope="scope">
            {{statusName(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="处方日期" min-width="150"></el-table-column>
        <el-table-column label="开方医生" min-width="80" prop="doctorName"></el-table-column>
        <el-table-column label="操作" width="80" align="right">
          <template slot-scope="scope">
            <el-button @click="printRecord(scope.row)" icon="iconfont iconcaozuotubiao-dayin" size="mini" :class="{'printed':scope.row.printTime}"></el-button>
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button size="mini" @click="view(scope.row)" icon="iconfont iconcaozuotubiao-chakan"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-drawer title="处方详情" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :with-header="true" tabindex="99" size="800px">
      <viewRecipel :advice="advice" :elder="elder"></viewRecipel>
    </el-drawer>

    <el-dialog :visible.sync="printVisible" v-if="printVisible" :close-on-click-modal="false" width="146mm" append-to-body show-close=false>
      <printRecipel :advice="advice" :tenantName="tenantName" :elder="elder" @close="printVisible=false;fetchData()"></printRecipel>
    </el-dialog>

  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";
import viewRecipel from "./viewRecipel";
import printRecipel from "./printRecipel";

export default {
  data() {
    let that = this;
    return {
      dialogFormVisible: false,
      invalidVisible: false,
      stopVisible: false,
      printVisible: false,
      listData: [],
      period: 2,
      dataCount: 0,
      tenantName: "",
      form: {},
      elder: {},
      advice: {},
      rules: {},
      status: { 2: "未发药", 3: "已发药", 5: "已发药", 10: "已发药" },
      dateRange: [],
      searchData: {
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  components: { viewRecipel, printRecipel },
  mounted() {},
  created() {
    axios
      .fetch("medicalServer", "/api/base/tenant-name", null, null, "get")
      .then((res) => {
        this.tenantName = res.data;
      });
    this.fetchData();
  },
  methods: {
    search() {
      this.changePage(1);
    },
    reset() {
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    fetchData() {
      let that = this;
      if (this.dateRange) {
        this.searchData.search_GED_createTime = this.dateRange[0];
        this.searchData.search_LED_createTime = this.dateRange[1];
      } else {
        this.searchData.search_GED_createTime = "";
        this.searchData.search_LED_createTime = "";
      }
      this.searchData.search_GTI_medicineCount = "0";
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/recipel",
          this.searchData,
          "form",
          "get"
        )
        .then((res) => {
          that.listData = res.data;
          that.dataCount = res.total;
        });
    },

    view(item) {
      axios
        .fetch("medicalServer", "/api/elder/" + item.elderId, null, null, "get")
        .then((res) => {
          this.elder = res.data;
        });
      this.advice = item;
      this.dialogFormVisible = true;
    },
    stop(data) {
      this.invalidForm = {};
      this.id = data.id;
      this.adviceItems = [];
      this.adviceItems.push(data.main);
      if (data.itemCount > 1) {
        for (var i in data.items) {
          this.adviceItems.push(data.items[i]);
        }
      }
      this.group = data;
      this.stopVisible = true;
    },
    invalidData(data, itemCount) {
      this.invalidForm = {};
      this.id = data.id;
      if (itemCount > 1) {
        this.invalidSubTitle =
          "此医嘱包含多种同组药物，系统同步作废本组所有药物医嘱。";
      }
      this.invalidVisible = true;
    },
    invalidSubmit() {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/invalid/" +
            this.id +
            "?invalidRemark=" +
            this.invalidForm.invalidRemark,
          null,
          null,
          "delete"
        )
        .then((res) => {
          this.$message.success("操作成功！");
          this.fetchData();
          this.invalidVisible = false;
        });
    },
    stopSubmit() {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/stop/" + this.id,
          this.invalidForm,
          "json"
        )
        .then((res) => {
          this.$message.success("操作成功！");
          this.fetchData();
          this.stopVisible = false;
        });
    },
    statusName(val) {
      return this.status[val];
    },
    printRecord(item) {
      axios
        .fetch("medicalServer", "/api/elder/" + item.elderId, null, null, "get")
        .then((res) => {
          this.elder = res.data;
        });
      this.advice = item;
      this.printVisible = true;
    },
  },
};
</script>
<style scoped>
.el-input >>> .el-input-group__append,
.el-input >>> .el-input-group__prepend {
  padding-left: 8px;
  padding-right: 8px;
  min-width: 35px;
}

/deep/ .el-drawer__header {
  border-bottom: 1px solid #dddddd;
  padding-bottom: 8px;
  margin-bottom: 0px;
}
/deep/ :focus {
  outline: 0;
}
.title {
  text-align: center;
  font-weight: 700;
}
.subtitle {
  width: 90%;
  text-align: center;
  margin: 8px 0px 8px 0px;
}
/deep/ .el-drawer {
  overflow: auto;
}
.printed {
  color: rgb(199, 199, 199);
}
</style>