<template>
  <div>
    <el-row class="warp" v-loading="loading" style="background: #f8f8f8;">
      <el-col style="background:#fff;border-radius:4px;">
        <p class="title">
          <span>补贴人次:{{ count }}</span>
          <span>补贴金额:{{ amount }}元</span>
        </p>
        <el-row>
          <!-- <table class="dataFormTable" id="dataFormTable" style="transform: translateX(-50%);position: relative;left:50%">
            <thead>
              <tr>
                <td colspan="7">项目明细</td>
              </tr>
            </thead>
            <thead>
              <tr>
                <td rowspan="2"><span>序号</span></td>
                <td rowspan="2"><span>项目名称</span></td>
                <td colspan="2">按100%标准发放</td>
                <td colspan="2">按50%标准发放</td>
                <td rowspan="2"><span>金额小计</span></td>
              </tr>
            </thead>
            <thead>
              <tr>
                <td></td>
                <td></td>
                <td>人数</td>
                <td>金额</td>
                <td>人数</td>
                <td>金额</td>
                <td style="border-top:none;"></td>
              </tr>
            </thead>
            <tr v-for="(item,index) in form" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.subsidyType | statusFilter}}</td>
              <td>{{item.countFull}}</td>
              <td>{{item.amountFull}}</td>
              <td>{{item.countHalf}}</td>
              <td>{{item.amountHalf}}</td>
              <td>{{item.amount}}</td>
            </tr>
            <tr>
              <td colspan="2">小计</td>
              <td>{{totalData.countFull}}</td>
              <td>{{totalData.amountFull}}</td>
              <td>{{totalData.countHalf}}</td>
              <td>{{totalData.amountHalf}}</td>
              <td>{{totalData.amount}}</td>
            </tr>
          </table> -->
          <el-table id="dataFormTable" show-summary :data="tableData" tooltip-effect="dark" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
            <el-table-column label="项目明细" align="center">
              <el-table-column type="index" width="80" label="序号" align="center">
              </el-table-column>
              <el-table-column prop="title" label="项目名称" align="center">
              </el-table-column>
              <el-table-column prop="name" label="按100%标准发放" align="center">
                <el-table-column prop="countFull" label="人数" align="center">
                </el-table-column>
                <el-table-column prop="amountFull" label="金额" align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column label="按50%标准发放">
                <el-table-column prop="countHalf" label="人数" align="center">
                </el-table-column>
                <el-table-column prop="amountHalf" label="金额" align="center">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="total" label="金额小计">
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tableToExcel } from "@/components/excel";
export default {
  props: ["oid", "sign", "alls"],
  data() {
    return {
      tableData: [],
      totalData: {
        countFull: 0,
        countHalf: 0,
        amountFull: 0,
        amountHalf: 0,
        amount: 0,
      },
      count: 0,
      amount: 0,
    };
  },
  computed: {},
  created() {
    this.initTableData();
  },
  methods: {
    initTableData() {
      axios
        .fetch("oaServer", "/subsidyEmployeeDetail/applyFor", {
          itemId: this.oid,
        })
        .then((res) => {
          if (res.data.applyForVos && res.data.applyForVos.length > 0) {
            res.data.applyForVos.forEach((item) => {
              if (item.subsidyType == 1) {
                item.title = "就业补贴";
              } else if (item.subsidyType == 2) {
                item.title = "岗位补贴";
              } else if (item.subsidyType == 3) {
                item.title = "绩效奖励";
              } else if (item.subsidyType == 4) {
                item.title = "技能补贴";
              } else if (item.subsidyType == 5) {
                item.title = "专技补贴";
              }
              item.total = item.amountFull + item.amountHalf;
            });
            this.tableData = res.data.applyForVos;
          } else {
            this.tableData = [];
          }
          this.count = res.data.count;
          this.amount = res.data.amount;
        });
    },
    toExcel() {
      let tableObj = document.getElementById("dataFormTable");
      tableToExcel(tableObj, "申请审批表.xlsx");
    },
  },
  filters: {
    statusFilter: (val) => {
      if (val == 0) {
        val = "绩效补贴";
      } else if (val == 1) {
        val = "就业补贴";
      } else if (val == 2) {
        val = "岗位补贴";
      } else if (val == 3) {
        val = "绩效奖励";
      } else if (val == 4) {
        val = "技能补贴";
      } else if (val == 5) {
        val = "专技补贴";
      }
      return val;
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
</style>