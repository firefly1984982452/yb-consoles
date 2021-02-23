<template>
  <!-- 长者菜单-小锅菜 -->
  <div class="checkout-catalog page">
    <h2 class="title">{{ nursingHomeName }}{{month}}小锅菜订购清单</h2>
    <div class="box">
      <el-table :data="data" row-key="id" center :span-method="cellMerge" border>
        <el-table-column prop="areaName" width="90" label="护理区域"></el-table-column>
        <el-table-column width="90" label="房间床位">
          <template slot-scope="scope">
            {{scope.row.roomName}}-{{scope.row.bedName}}
          </template>
        </el-table-column>
        <el-table-column prop="elderName" width="90" label="长者姓名"></el-table-column>
        <el-table-column prop="periodDate" width="120" label="日期"></el-table-column>
        <el-table-column prop="weekDayText" width="90" label="星期"></el-table-column>
        <el-table-column prop="title" width="100" label="菜单"></el-table-column>
        <el-table-column prop="foodAmount" width="110" label="价格"></el-table-column>
        <el-table-column prop="summerAmount" width="110" label="总计金额"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/javascript">
import tenant from "@/components/_tenant";
export default {
  name: "CheckoutCatalog",
  data() {
    return {
      data: [
      ], // 每周厨师列表
      id: "",
      search: {},
      allMenuList: [],
      nursingHomeName: "",
      month: '',
    };
  },
  mounted() {
    tenant.fetchCurrentTenant().then(t => {
      this.nursingHomeName = t.tenantName; // 租户名称
    });
    this.id = JSON.parse(this.$route.query.id);
    this.search = JSON.parse(this.$route.query.search);
    let arr = this.$route.query.allMenuList;
    this.month = this.$route.query.month;

    console.log(this.$route.query)
    this.getWeekMenuDetail(this.id, arr);
  },
  methods: {
    //获取spanArr
    getSpanArr() {
      let data = this.data;
      this.spanArr = [];
      this.contentSpanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
          data[0].summerAmount = data[0].foodAmount;
          this.contentSpanArr.push(1);
          this.position = 0;
        } else {
          // 判断当前元素与上一个元素是否相同(第1和第2列)
          if (data[i].elderId === data[i - 1].elderId) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
            data[i].summerAmount = data[i - 1].summerAmount + data[i].foodAmount;
            data[this.pos].summerAmount = Number(data[i].summerAmount).toFixed(2);
          } else {
            this.spanArr.push(1);
            this.pos = i;
            data[this.pos].summerAmount = data[i].foodAmount;
          }
        }
      }
      console.log(data);
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 7) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    // 获取某周的详细菜谱
    getWeekMenuDetail(id, arr) {
      let periodDate = !this.search.periodDate ? this.search.periodDate : this.$moment(this.search.periodDate).format('yyyy-MM-DD');

      let param = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        periodId: id,
        periodDate: periodDate,
        areaId: this.search.area,
        elderName: this.search.elderName,
        foodIds: arr,
        isPager: false
      };
      axios
        .fetch("dietServer", "/dietElder/cookingPot", param)
        .then(res => {
          if (res.code == 200) {
            this.total = res.total;
            this.data = res.data.map(val => {
              val.weekDayText = '星期' + [' ', '一', '二', '三', '四', '五', '六', '日'][val.weekDay];
              val.summerAmount = 0;
              return val;
            });
            this.getSpanArr();
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.print-container .title {
  padding: 0 !important;
  // font-size: 24px;
}
/deep/ .el-table {
  color: #000;
  border-color: #000;
  word-break: break-all;
  thead {
    color: #000;
  }
  tr {
    page-break-inside: avoid;
  }
  td,
  th.is-leaf {
    border-bottom-color: #000;
  }
  th,
  td {
    border-right-color: #000;
    text-align: center;
  }
}
/deep/ .el-table--border {
  border-right: solid 1px;
  border-bottom: solid 1px;
}
/* 表格不出现横向滚动条 */
/deep/ .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden !important;
}

.box {
  width: 800px;
  margin: 0 auto 100px auto;
}
</style>

<style scoped>
@media print {
  tr {
    page-break-inside: avoid !important;
  }
}
</style>


