<template>
  <div>
    <el-row :gutter="0">
      <el-col :span="24">
        <div class="selfProcess">
          <el-table ref="multipleTable" id="table0" tooltip-effect="dark" :data="formMain" border>
            <el-table-column prop="type" label="类目" min-width="80"></el-table-column>
            <el-table-column prop="num" label="奖补金额" min-width="80"></el-table-column>
          </el-table>
          <h2>内设医疗机构奖</h2>
          <el-table ref="multipleTable" id="table1" tooltip-effect="dark" :data="subInstitutionPrize" border>
            <el-table-column prop="orgType" label="内设医疗机构类型" min-width="80"></el-table-column>
            <el-table-column prop="medicalLicense" label="医疗机构执业许可证号" min-width="80"></el-table-column>
            <el-table-column prop="medicalAmount" label="奖补标准" min-width="150"></el-table-column>
            <el-table-column prop="medicalAmount" label="奖补金额（元）" min-width="100">
            </el-table-column>
          </el-table>
          <h2>招用持证人员奖</h2>
          <el-table ref="multipleTable" id="table2" tooltip-effect="dark" :data="subHoldPrize" :span-method="objectSpanMethod" border>
            <el-table-column prop="name" label="持证人员分布" min-width="120">
              <el-table-column prop="type" label="持证人员类型" min-width="40">
              </el-table-column>
              <el-table-column prop="level" label="持证人员等级" min-width="40">
              </el-table-column>
              <el-table-column prop="count" label="当前等级人数" min-width="40">
              </el-table-column>
            </el-table-column>
            <el-table-column prop="amount" label="奖补标准" min-width="80"></el-table-column>
            <el-table-column prop="total" label="奖补金额（元）" min-width="150">
            </el-table-column>
          </el-table>
          <h2>品牌连锁经营</h2>
          <el-table ref="multipleTable" id="table3" tooltip-effect="dark" :data="subChaIn" border>
            <el-table-column prop="brandCount" label="新增加养老机构数" min-width="80"></el-table-column>
            <el-table-column prop="brandAmount" label="奖补标准" min-width="80"></el-table-column>
            <el-table-column prop="brandAmount" label="奖补金额（元）" min-width="150"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tablesToExcel } from "@/components/excel";
export default {
  props: ["oid", "sign"],
  data() {
    return {
      subPrizeType: [],
      subInstitutionPrize: [],
      subHoldPrize: [
        {
          level: "初级",
          type: "护理员",
          count: "",
          amount: "",
          total: "",
        },
        {
          level: "中级",
          type: "护理员",
          count: "",
          amount: "",
          total: "",
        },
        {
          level: "高级",
          type: "护理员",
          count: "",
          amount: "",
          total: "",
        },
      ],
      subChaIn: [],
      formMain: [
        { type: "内设医疗机构奖", num: 0 },
        { type: "招用持证人员奖", num: 0 },
        // { type: "品牌连锁经营", num: 0 },
        { type: "合计", num: 0 },
      ],
    };
  },
  computed: {},
  created() {
    this.dataInit();
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    /*初始化数据*/
    dataInit() {
      axios
        .fetch("oaServer", "/subsidyOrgItem/all", {
          id: this.oid,
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            this.subInstitutionPrize = res.data;
            this.subChaIn = res.data;
            this.formMain[0].num = res.data[0].medicalAmount;
            this.formMain[1].num = res.data[0].careAmount;
            this.formMain[2].num =
              res.data[0].medicalAmount + res.data[0].careAmount;
            this.subHoldPrize[0].count = res.data[0].careJuniorCount;
            this.subHoldPrize[0].amount = res.data[0].juniorLowest;
            this.subHoldPrize[0].total =
              res.data[0].juniorLowest * res.data[0].careJuniorCount;
            this.subHoldPrize[1].count = res.data[0].careMiddleCount;
            this.subHoldPrize[1].amount = res.data[0].middleLowest;
            this.subHoldPrize[1].total =
              res.data[0].middleLowest * res.data[0].careMiddleCount;
            this.subHoldPrize[2].count = res.data[0].careSeniorCount;
            this.subHoldPrize[2].amount = res.data[0].highLowest;
            this.subHoldPrize[2].total =
              res.data[0].highLowest * res.data[0].careSeniorCount;
          }
        });
    },
    toExcel() {
      let tableObj0 = document.getElementById("table0");
      let tableObj1 = document.getElementById("table1");
      let tableObj2 = document.getElementById("table2");
      let tableObj3 = document.getElementById("table3");
      tableObj0.title = '汇总';
      tableObj1.title = '内设医疗机构奖';
      tableObj2.title = '招用持证人员奖';
      tableObj3.title = '品牌连锁经营';
      tablesToExcel(
        [tableObj0, tableObj1, tableObj2, tableObj3],
        "汇总表.xlsx"
      );
      // tableToExcel(tableObj0, "汇总表1.xlsx");
      // tableToExcel(tableObj1, "汇总表2.xlsx");
      // tableToExcel(tableObj2, "汇总表3.xlsx");
      // tableToExcel(tableObj2, "汇总表4.xlsx");
    },
  },
  filters: {
    //		0作废 1待审核 2已审核 3待申请 4已申请 5待签收 6已签收
    spstcsTypeFilter: (val) => {
      if (val == 1) {
        val = "护理员";
      } else if (val == 2) {
        val = "技工";
      }
      //			0作废 1待审核 2已审核/待提交 3已提交/待签收 4已签收
      return val;
    },
  },
};
</script>

<style lang="less" scoped>
.selfProcess {
  padding: 0 25px;
  h2 {
    line-height: 56px;
  }
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
  }
}
</style>