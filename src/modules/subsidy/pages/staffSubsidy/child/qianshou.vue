<template>
  <div>
    <el-row class="warp" v-loading="loading" style="background: #f8f8f8;">
      <el-col style="background:#fff;border-radius:4px;padding-top:15px">
        <el-row>
          <table id='dataFormTable' class="dataFormTable" style="transform: translateX(-50%);position: relative;left:50%">
            <thead>
              <tr>
                <td>序号</td>
                <td>姓名</td>
                <td>性别</td>
                <td>手机号</td>
                <td>身份证号</td>
                <td>银行卡号</td>
                <td>银行卡开户行</td>
                <td>金额</td>
                <td>签收人</td>
              </tr>
            </thead>
            <tr v-for="(item,index) in form" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.employeeName}}</td>
              <td>{{item.gender}}</td>
              <td>{{item.mobilePhone}}</td>
              <td>{{item.cardNo}}</td>
              <td>{{item.salaryBankNo}}</td>
              <td>{{item.salaryBankName}}</td>
              <td>{{item.amount}}</td>
              <td>{{item.signer}}</td>
            </tr>
            <tr>
              <td colspan="7">小计</td>
              <td>{{totolData.amount}}</td>
              <td></td>
            </tr>
          </table>
        </el-row>
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
      loading: false,
      totolData: {
        amount: 0,
      },
    };
  },
  computed: {},
  created() {
    this.initTableData();
  },
  methods: {
    initTableData() {
      axios
        .fetch("oaServer", "/subsidyEmployeeDetail/signFor", {
          itemId: this.oid,
        })
        .then((res) => {
          console.log(res);
          if (res.data && res.data.length > 0) {
            this.form = res.data;
            res.data.forEach((item) => {
              this.totolData.amount += item.amount;
            });
          }
        });
    },
    toExcel() {
      let tableObj = document.getElementById("dataFormTable");
      tableToExcel(tableObj, "签收表.xlsx");
    },
  },
  filters: {},
};
</script>

<style>
.dataFormTable {
  width: 100%;
  border-radius: 2px;
}
.dataFormTable td {
  color: #666;
  padding: 12px 0;
  font-size: 14px;
  text-align: center;
  border: 1px solid #dcdfe6;
}
.dataFormTable thead td {
  background: #f3f3f3;
  font-size: 15px;
  color: #333;
  font-weight: 600;
  border-radius: 1px;
}
</style>	