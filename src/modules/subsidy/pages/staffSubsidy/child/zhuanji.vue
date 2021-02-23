<template>
  <div>
    <el-row class="warp" style="background: #f8f8f8;">
      <el-col style="background:#fff;border-radius:4px;">
        <p class="title">
          <span v-if="alls">补贴人次:{{ count }}</span>
          <span v-else>补贴人数:{{ count }}</span>
          <span>补贴金额:{{ amount }}元</span>
        </p>
        <el-table ref="sub_table1" tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
          <el-table-column prop="cp_type" label="序号" width="50" type="index"></el-table-column>
          <el-table-column prop="employeeName" label="姓名"></el-table-column>
          <el-table-column prop="gender" label="性别"></el-table-column>
          <el-table-column prop="cardNo" label="身份证号" min-width="150"></el-table-column>
          <el-table-column prop="registerPlace" label="户籍类型"></el-table-column>
          <el-table-column prop="joinDate" label="入职日期" min-width="150">
            <template slot-scope="scope">{{scope.row.joinDate | dateFilter}}</template>
          </el-table-column>
          <el-table-column v-if="$route.query.all" prop="startDate" label="月份">
            <template slot-scope="scope">{{ $moment(scope.row.startDate).format('YYYY-MM') }}</template>
          </el-table-column>
          <el-table-column prop="dimissionDate" label="离职日期" min-width="150">
            <template slot-scope="scope">{{scope.row.dimissionDate | dateFilter}}</template>
          </el-table-column>
          <el-table-column prop="certificateLevel" label="持证类别" min-width="100">
            <template slot-scope="scope">{{scope.row.certificateLevel | certificateLevel}}</template>
          </el-table-column>
          <el-table-column prop="obtainDate" label="持证日期" min-width="150"></el-table-column>
          <el-table-column prop="certificateNo" label="证书编号" min-width="150"></el-table-column>
          <el-table-column prop="certificateType" label="人员类别">
             <template slot-scope="scope">{{scope.row.certificateType | certificateType}}</template>
          </el-table-column>
          <el-table-column prop="subsidyAmount" label="补贴标准"></el-table-column>
          <!-- <el-table-column prop="subsidyPercent" label="补贴月数"></el-table-column> -->
          <el-table-column prop="currentAmount" label="补贴金额"></el-table-column>
        </el-table>
        <!--<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="10" layout="prev, pager, next, jumper" :total="totalPage"></el-pagination>-->
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { dataToExcel } from "@/components/excel";
export default {
  props: ["oid", "sign", "alls", "subsidyType"],
  data() {
    return {
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      amount: "",
      count: "",
    };
  },
  watch: {
    subsidyType(newValue, oldValue) {
      this.initTableData(1);
      this.queryCount();
    },
  },
  computed: {},
  created() {
    this.queryCount();
    this.initTableData(1);
  },
  methods: {
    initTableData(val) {
      let param = {
        id: this.oid,
        subsidyType: this.subsidyType,
        pageSize: this.pageSize,
        pageIndex: val,
      };
      axios
        .fetch("oaServer", "/subsidyEmployeeItem/detail", param)
        .then((res) => {
          console.log(res);
          if (res.data && res.data.length > 0) {
            this.totalPage = res.total;
            this.tableData = res.data;
          } else {
            this.tableData = [];
            this.totalPage = 0;
          }
        });
    },
    //
    queryCount() {
      axios
        .fetch("oaServer", "/subsidyEmployeeItem/num", {
          id: this.oid,
          subsidyType: this.subsidyType,
        })
        .then((res) => {
          if (res.data) {
            this.count = res.data.count;
            this.amount = res.data.amount;
          }
        });
    },
    handleCurrentChange(val) {
      this.initTableData(val);
    },
    toExcel() {
      let param = {
        id: this.oid,
        subsidyType: this.subsidyType,
        isPager: false,
      };
      axios
        .fetch("oaServer", "/subsidyEmployeeItem/detail", param)
        .then((res) => {
          const list = res.data.map((item, index) => {
            item.cp_type = index + 1;
            return item;
          });
          this.exportToExcel(list);
          this.$message.success(`导出成功，共计 ${res.data.length} 条记录`);
        });
    },
    exportToExcel(list) {
      let title = "";
      switch (this.subsidyType) {
        case 1:
          title = "就业补贴.xlsx";
          break;
        case 2:
          title = "岗位补贴.xlsx";
          break;
        case 3:
          title = "绩效奖励.xlsx";
          break;
        case 4:
          title = "职业技能补贴.xlsx";
          break;
        case 5:
          title = "专技人员补贴.xlsx";
          break;

        default:
          break;
      }
      let colums = this.$route.query.all
        ? {
            cp_type: "序号",
            employeeName: "姓名",
            gender: "性别",
            cardNo: "身份证号",
            registerPlace: "户籍类型",
            startDate: {
              title: "月份",
              format: (val) => {
                return val ? this.$moment(val).format("YYYY-MM") : "";
              },
            },
            joinDate: {
              title: "入职日期",
              format: (val) => {
                return val ? val.split(" ")[0] : "";
              },
            },
            dimissionDate: {
              title: "离职日期",
              format: (val) => {
                return val ? val.split(" ")[0] : "";
              },
            },
            certificateType: {
              title: "持证类别",
              format: (val) => {
                switch (val) {
                  case 1:
                    return "护理员证";
                    break;
                  case 2:
                    return "医生护士医技证";
                    break;
                  case 3:
                    return "技工证";
                    break;
                  case 4:
                    return "其他";
                    break;
                  default:
                    break;
                }
              },
            },
            obtainDate: "持证日期",
            certificateNo: "证书编号",
            certificateLevel: {
              title: "人员类别",
              format: (val) => {
                switch (val) {
                  case 0:
                    return "初级";
                    break;
                  case 1:
                    return "中级";
                    break;
                  case 2:
                    return "高级";
                    break;

                  default:
                    return "";
                    break;
                }
              },
            },
            subsidyAmount: "补贴标准",
            currentAmount: "补贴金额",
          }
        : {
            cp_type: "序号",
            employeeName: "姓名",
            gender: "性别",
            cardNo: "身份证号",
            registerPlace: "户籍类型",
            joinDate: {
              title: "入职日期",
              format: (val) => {
                return val ? val.split(" ")[0] : "";
              },
            },
            dimissionDate: {
              title: "离职日期",
              format: (val) => {
                return val ? val.split(" ")[0] : "";
              },
            },
            certificateType: {
              title: "持证类别",
              format: (val) => {
                switch (val) {
                  case 1:
                    return "护理员证";
                    break;
                  case 2:
                    return "医生护士医技证";
                    break;
                  case 3:
                    return "技工证";
                    break;
                  case 4:
                    return "其他";
                    break;
                  default:
                    break;
                }
              },
            },
            obtainDate: "持证日期",
            certificateNo: "证书编号",
            certificateLevel: {
              title: "人员类别",
              format: (val) => {
                switch (val) {
                  case 0:
                    return "初级";
                    break;
                  case 1:
                    return "中级";
                    break;
                  case 2:
                    return "高级";
                    break;

                  default:
                    return "";
                    break;
                }
              },
            },
            subsidyAmount: "补贴标准",
            currentAmount: "补贴金额",
          };
      dataToExcel(list, colums, title);
    },
  },
  filters: {
    //证书分类：1护理员证；2医生护士医技证；3技工证；0其他
    certificateType(val) {
      switch (val) {
        case 1:
          return "护理员证";
          break;
        case 2:
          return "医生护士医技证";
          break;
        case 3:
          return "技工证";
          break;
        case 4:
          return "其他";
          break;
        default:
          break;
      }
    },
    // 证书等级：0初级，1中级，2高级
    certificateLevel(val) {
      switch (val) {
        case 0:
          return "初级";
          break;
        case 1:
          return "中级";
          break;
        case 2:
          return "高级";
          break;

        default:
          return "";
          break;
      }
    },
    dateFilter(val) {
      return val ? val.split(" ")[0] : "";
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-table th.gutter {
  display: table-cell !important;
}
.title {
  font-size: 12px;
  line-height: 44px;
  color: rgba(0, 0, 0, 0.4);
  span + span {
    margin-left: 12px;
  }
}
.el-pagination {
  text-align: center;
  padding: 12px 0;
}
</style>