<template>
  <!-- 菜谱发布-菜 -->
  <div class="checkout-catalog page">
    <h2 class="title">{{ nursingHomeName }}周菜谱</h2>
    <div>
      <div class="date">
        日期：{{ chefData[0].dietMenuFiveVoList[0].periodDate }}～{{
          chefData[0].dietMenuFiveVoList[6].periodDate
        }}
      </div>
      <table border cellspacing="0" cellpadding="0" class="table">
        <thead style="text-align:center;padding:0;font-size:20px">
          <td style="width:80px;height:50px">日期</td>
          <td v-for="(item, index) in chefData" :key="index">
            {{ item.categoryTitle }}
          </td>
        </thead>
        <tbody>
          <tr v-for="(item, index) in chefData[0].dietMenuFiveVoList" :key="index">
            <td style="text-align:center;">
              <span>周{{item.weekText}}</span>
              <br />
              ({{ item.periodDate.substr(5,5) }})
            </td>
            <td v-for="(w, point) in chefData" :key="point" style="min-width:200px;padding:5px;">
              <!-- {{index}}-{{point}} -->
              <div class="tag-list-text">
                <div class="tag" :key="tag" v-for="tag in chefData[point].dietMenuFiveVoList[index].dietMenuVoList">
                  <span class="name">{{ tag.foodTitle }}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bottom">
        <div>
          伙委会成员签字：
        </div>
        <div>
          食堂主管签字：
        </div>
      </div>
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
      nursingHomeName: ""
    };
  },
  mounted() {
    tenant.fetchCurrentTenant().then(t => {
      this.nursingHomeName = t.tenantName; // 租户名称
    });
    this.id = JSON.parse(this.$route.query.id);
    this.getWeekMenuDetail(this.id);
  },
  methods: {
    // 获取某周的详细菜谱
    getWeekMenuDetail(id) {
      axios
        .fetch("dietServer", "/dietMenu/query", { periodId: id })
        .then(res => {
          if (res.code == 200) {
            this.chefData = res.data.map(val => {
              val.dietMenuFiveVoList = val.dietMenuFiveVoList.map(
                (v, index) => {
                  v.weekText = ["一", "二", "三", "四", "五", "六", "日"][
                    index
                  ];
                  v.dietMenuVoList = !v.dietMenuVoList ? [] : v.dietMenuVoList;
                  v.dietMenuVoListText = !v.dietMenuVoList
                    ? []
                    : v.dietMenuVoList.map(t => t.foodTitle);
                  v.confirmBtn = true;
                  return v;
                }
              );
              return val;
            });
            this.chefData.length = 3;
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
.date {
  text-align: center;
  margin: 10px 0 20px 0;
}
.bottom {
  display: flex;
  justify-content: space-between;
  margin: 20px 0 0 10px;
  > div {
    width: 250px;
  }
}
.tag-list-text {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .tag {
    min-width: 50%;
    width: auto;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    display: flex;
    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

<style type="text/css">
@media print {
  .noprint {
    display: none;
  }
}
</style>

