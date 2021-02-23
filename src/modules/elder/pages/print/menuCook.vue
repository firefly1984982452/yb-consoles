<template>
  <!-- 菜谱发布-小锅菜 -->
  <div class="checkout-catalog page" style="margin-bottom: 80px;">
    <h2 class="title">{{ nursingHomeName }}{{dietPeriodTypeList[0].title}}小锅菜菜谱</h2>
    <div>
      <table class="ub-table table" border cellspacing="0" cellpadding="0" v-for="(item,index) in chefData" :key="index">
        <tr style="text-align:center;padding:0;font-size:16px">
          <td v-for="(val, i) in item.dietMenuEightVoList" :key="i">
            {{ val.weekName }}（{{val.periodDateText}}）
          </td>
        </tr>
        <tr>
          <td v-for="(val, i) in item.dietMenuEightVoList" :key="i">
            <div class="tag" v-for="(w,point) in val.dietMenuNineVoList" :key="point">
              <div class="name">{{w.foodTitle}}<span v-if="w.salePrice !== undefined">（<span class="price">{{w.salePrice}}</span>元/例）</span></div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script type="text/javascript">
import tenant from "@/components/_tenant";
export default {
  name: "CheckoutCatalog",
  data() {
    return {
      chefData: [
        { dietMenuFiveVoList: [{ periodDate: "", dietMenuVoList: [] }] }
      ], // 每周厨师列表
      id: "",
      nursingHomeName: "",
      dietPeriodTypeList: [{ title: '' }]
    };
  },
  mounted() {
    tenant.fetchCurrentTenant().then(t => {
      this.nursingHomeName = t.tenantName; // 租户名称
    });
    this.id = JSON.parse(this.$route.query.id);
    this.getWeekMenuDetail(this.id);
    this.getDietPeriodList();
  },
  methods: {
    // 获取所有月期列表
    getDietPeriodList() {
      axios.fetch("dietServer", "/dietPeriod/query", { type: 0, periodType: 1 }).then(res => {
        if (res.code == 200) {
          this.dietPeriodTypeList = res.data.filter(val => val.id === this.id);
        }
      });
    },
    // 获取某周的详细菜谱
    getWeekMenuDetail(id) {
      axios
        .fetch("dietServer", "/dietMenu/query/smallPotDish", { periodId: id })
        .then(res => {
          if (res.code == 200) {
            this.chefData = res.data.map(val => {
              val.dietMenuEightVoList = !val.dietMenuEightVoList ? [] : val.dietMenuEightVoList.map(
                (v, index) => {
                  v.periodDateText = v.periodDate.substr(5);
                  v.dietMenuNineVoList = !v.dietMenuNineVoList ? [{ foodTitle: '' }] : v.dietMenuNineVoList;
                  return v;
                }
              );
              return val;
            });
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

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  z-index: 0 !important;
}
.print-container .table thead td {
  padding: 0 !important;
  margin: 0 !important;
}
.print-container .table td,
.print-container .table th {
  padding: 0px;
}
.page {
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
table {
  table-layout: fixed;
  font-size: 14px;
}
.tag {
  width: 100%;
  flex-wrap: wrap;
  white-space: nowrap;
  text-align: right;
  display: flex;
  .name {
    width: 100%;
    white-space: pre-wrap;
    text-align: left;
    .price {
      color: #f00;
    }
  }
}
</style>

<style scoped>
@media print {
  .price {
    color: #f00;
  }
}
</style>


