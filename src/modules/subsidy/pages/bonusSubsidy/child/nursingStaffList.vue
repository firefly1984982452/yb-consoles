<template>
  <div>
    <el-row class="warp" style="background: #f8f8f8;" show-summary>
      <el-col style="background:#fff;border-radius:4px;padding-top:15px">
        <el-table ref="multipleTable" id="dataFormTable" :summary-method="getSummaries" show-summary tooltip-effect="dark" :data="form" border style="width:95%;position:relative;left:2%;">
          <el-table-column label="序号" width="60" type="index"></el-table-column>
          <el-table-column prop="employeeName" label="姓名" min-width="50"></el-table-column>
          <el-table-column prop="cardNo" label="身份证号" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.cardNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="certificateNo" label="证书编号" min-width="100"></el-table-column>
          <el-table-column prop="certificateLevel" label="等级" min-width="50">
            <template slot-scope="scope">
              <span>{{ scope.row.certificateLevel | levelFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="月份" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.startDate">{{$moment(scope.row.startDate).format('YYYY-MM')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="subsidyAmount" label="补贴金额" min-width="100"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tableToExcel } from "@/components/excel";
export default {
  props: ["oid", "sign"],
  data() {
    return {
      form: [],
    };
  },
  computed: {},
  created() {
    this.jixiaoForm();
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "小计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (columns[index]["label"] == "补贴金额") {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += " 元";
          } else {
            sums[index] = "N/A";
          }
        }
      });
      return sums;
    },
    jixiaoForm() {
      axios
        .fetch("oaServer", "/subsidyOrgItem/care/detail", {
          id: this.oid,
          isCare: 0,
        })
        .then((res) => {
          console.log(res);
          if (res.data && res.data.length > 0) {
            this.form = res.data;
          }
        });
    },
    toExcel() {
      let tableObj = document.getElementById("dataFormTable");
      tableToExcel(tableObj, "护理员明细表.xlsx");
    },
  },
  filters: {
    levelFilter(key) {
      const value = Number(key);
      switch (value) {
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
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table {
  width: 80% !important;
  margin-bottom: 15px;
  th,
  td {
    font-size: 14px;
    text-align: center;
  }
  th {
    color: #606266;
    background-color: #f3f3f3 !important;
  }
  th.gutter {
    display: table-cell !important;
  }
}
</style>