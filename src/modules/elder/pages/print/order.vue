<template>
  <div class="page">
    <h2 class="title">购物清单</h2>
    <p v-if="date[0] && date[1]">登记时间：{{ date[0] | filterTime}} ~ {{ date[1] | filterTime}}</p>
    <p v-else>登记时间：</p>
    <table cellspacing="0" cellpadding="0" class="table">
      <thead style="display: table-header-group; font-weight: bold;">
        <tr>
          <td style="text-align:center" width="15%">序号</td>
          <td style="text-align:center">长者</td>
          <td>物品明细</td>
          <td style="text-align:center">金额</td>
        </tr>
      </thead>
      <tbody style>
        <tr v-if="arr1.length > 0" v-for="(item,i) in arr1" :key="i">
          <td style="text-align:center" v-if="item">{{ item.xuhao }}</td>
          <td style="text-align:center" v-if="item">{{ item.elderName }}</td>
          <td v-if="item">{{item.goodsTitle}} {{item.quantity}}{{item.priceUnit}}</td>
          <td style="text-align:center" v-if="item"><span v-if="item.amount">{{item.amount}}元</span></td>
        </tr>
      </tbody>
      <tfoot style="display: table-footer-group; font-weight: bold">
        <tr>
        </tr>
      </tfoot>
    </table>
    <table cellspacing="0" cellpadding="0" class="table">
      <thead style="display: table-header-group; font-weight: bold;">
        <tr>
          <td style="text-align:center" width="15%">序号</td>
          <td style="text-align:center">长者</td>
          <td>物品明细</td>
          <td style="text-align:center">金额</td>
        </tr>
      </thead>
      <tbody style>
        <tr v-if="arr2.length > 0" v-for="(item,i) in arr2" :key="i">
          <td style="text-align:center" >{{ item.xuhao }}</td>
          <td style="text-align:center" v-if="item">{{ item.elderName }}</td>
          <td v-if="item">{{item.goodsTitle}} {{item.quantity}}{{item.priceUnit}}</td>
          <td style="text-align:center" v-if="item"><span v-if="item.amount">{{item.amount}}元</span></td>
        </tr>
      </tbody>
      <tfoot style="display: table-footer-group; font-weight: bold">
        <tr>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      date: ["", ""],
      serarchForm: {},
      tableData: [],
      arr1: [],
      arr2: []
    };
  },
  mounted() {
    this.serarchForm = JSON.parse(this.$route.query.data);
    this.date[0] = this.serarchForm.startTime ? this.serarchForm.startTime: "";
    this.date[1] =this.serarchForm.endTime ? this.serarchForm.endTime: "";
    this.getPrintData(this.serarchForm);
  },
  methods: {
    getPrintData(param) {
      axios.fetch("careServer", "/careOrderDetail/print", param).then(res => {
        if (res.code == 200) {
          if (res.data.buyVos.length > 0) {
            res.data.buyVos.forEach((item, i) => {
              const shang = i < 39 ? Math.ceil((i + 1) / 20):Math.ceil((i -39) / 23);
              item.xuhao = i + 1;
              if (shang % 2 == 0) {
                this.arr2.push(item);
              } else {
                this.arr1.push(item);
              }
            });
            const total = res.data.buyVos.length;
            const pages =
              this.arr1.length > 20
                ? Math.ceil((this.arr1.length - 20) / 23) + 1
                : 1;
            // 左边需要补充的条数
            const leftLest = (pages - 1) * 23 + 20 - this.arr1.length;
            for (let index = 0; index < leftLest; index++) {
              let xuhao = this.arr1[this.arr1.length - 1].xuhao;
              xuhao++;
              this.arr1.push({
                xuhao,
                elderName: "",
                goodsTitle: "",
                quantity: "",
                priceUnit: "",
                amount: ""
              });
            }
            // 右边需要补充的条数
            const max = Math.max(this.arr1[this.arr1.length - 1].xuhao, total);
            const rightLest = (pages - 1) * 46 + 40 - max;
            // 右边开始的序号 即数组1最后一项的序号
            let xuhao2 = max;
            for (let index = 0; index < rightLest; index++) {
              xuhao2++;
              this.arr2.push({
                xuhao: xuhao2,
                elderName: "",
                goodsTitle: "",
                quantity: "",
                priceUnit: "",
                amount: ""
              });
            }
          }
        }
      });
    }
  },
  filters: {
    filterTime(val) {
      if (val) {
        var time = new Date(val);
        var m = time.getMonth() + 1;
        var d = time.getDate();
        if (m < 10) m = "0" + m;
        if (d < 10) d = "0" + d;
        return m + "/" + d;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  overflow: auto;
  padding-bottom: 20px;
}
.title {
  padding: 25px 0;
}
h3 {
  font-weight: normal;
  line-height: 40px;
}
p {
  // text-indent: 2em;
  line-height: 40px;
}
.table {
  width: 50%;
  float: left;
}
table + table {
  margin-left: -1px;
}
.table11 {
  margin-top: 20px;
  width: 100%;
  tr {
    height: 40px;
    td {
      padding-left: 2em;
    }
  }
}
</style>
