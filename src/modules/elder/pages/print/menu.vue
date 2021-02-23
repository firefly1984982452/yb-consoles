<template>
  <div class="checkout-catalog page">
    <!-- 如果是带条件的单个页面打印 -->
    <div v-if="type == 1">
      <h2 class="title">{{data[0].periodDate}}～{{data[6].periodDate}}菜单汇总明细（{{oneTitle}}）</h2>
      <table border cellspacing="0" cellpadding="0" class="table">
        <thead style="text-align:center;padding:0;height:50px">
          <td style="width:90px;">日期</td>
          <td v-for="(item,index) in data[0].summaryTwoVoList" :key="index">
            {{item.categoryTitle}}
          </td>
        </thead>
        <tbody>
          <tr v-for="(item,index) in data" :key="index">
            <td style="text-align:center;">
              {{currentWeekData[index].text}}({{currentWeekData[index].value}})
              <br />共：{{item.count}}份
            </td>
            <td v-for="w in item.summaryTwoVoList" :key="w" style="min-width:40px">
              <div class="tag-list-text">
                <div class="tag" :key="tag" v-for="tag in w.summaryOneVoList">
                  <span class="name">{{tag.foodTitle}}</span>
                  <span class="vlaue">：{{tag.count}}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 无条件，打印所有页面 -->
    <div v-else>
      <!-- 第一个默认汇总页 -->
      <div class="page">
        <h2 class="title">{{data[0].periodDate}}～{{data[6].periodDate}}菜单汇总明细</h2>
        <table border cellspacing="0" cellpadding="0" class="table">
          <thead style="text-align:center;padding:0;height:50px">
            <td style="width:90px;">日期</td>
            <td v-for="(item,index) in data[0].summaryTwoVoList" :key="index">
              {{item.categoryTitle}}
            </td>
          </thead>
          <tbody>
            <tr v-for="(item,index) in data" :key="index">
              <td style="text-align:center;">
                {{currentWeekData[index].text}}({{currentWeekData[index].value}})
                <br />共：{{item.count}}份
              </td>
              <td v-for="w in item.summaryTwoVoList" :key="w" style="min-width:40px">
                <div class="tag-list-text">
                  <div class="tag" :key="tag" v-for="tag in w.summaryOneVoList">
                    <span class="name">{{tag.foodTitle}}</span>
                    <span class="vlaue">：{{tag.count}}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 遍历所有区域 -->
      <div class="page" v-for="(items,index) in listMenu" :key="index">
        <h2 class="title">{{items.list[0].periodDate}}～{{items.list[6].periodDate}}菜单汇总（{{items.text}}）</h2>
        <table border cellspacing="0" cellpadding="0" class="table">
          <thead style="text-align:center;padding:0;height:50px">
            <td style="width:90px;">日期</td>
            <td v-for="(item,index) in items.list[0].summaryTwoVoList" :key="index">
              {{item.categoryTitle}}
            </td>
          </thead>
          <tbody>
            <tr v-for="(item,index) in items.list" :key="index">
              <td style="text-align:center;">
                {{currentWeekData[index].text}}({{currentWeekData[index].value}})
                <br />共：{{item.count}}份
              </td>
              <td v-for="w in item.summaryTwoVoList" :key="w" style="min-width:40px">
                <div class="tag-list-text">
                  <div class="tag" :key="tag" v-for="tag in w.summaryOneVoList">
                    <span class="name">{{tag.foodTitle}}</span>
                    <span class="vlaue">：{{tag.count}}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "CheckoutCatalog",
  data() {
    return {
      data: [
        { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
        { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
        { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
        { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
        { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
        { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
        { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
      ],

      currentWeekData: [{
        text: '周一',
        value: ''
      }], // 当前周周一到周日的信息
      oneTitle: '',
      listMenu: [{
        list: [
          { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
          { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
          { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
          { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
          { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
          { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
          { summaryTwoVoList: [{ summaryOneVoList: [{}] }] },
        ]
      }],
      type: 2 // 1是有条件的单个菜单，2是无条件的所有区域的菜单
    };
  },
  mounted() {
    let param = JSON.parse(this.$route.query.param);
    this.getdata(param).then(data => {
      this.data = data;
    });
    if (param.areaId) {
      this.oneTitle = param.areaName;
      this.type = 1;
    } else {
      this.listMenu = JSON.parse(window.localStorage.getItem('allArea'));
      this.type = 2;
      let plist = [];
      this.listMenu.forEach(val => {
        param.areaId = val.value;
        let a = this.getdata(param).then(data => {
          val.list = data;
        });
        plist.push(a);
      })
      Promise.all(plist).then(val => {
        this.$forceUpdate();
      })
    }
    this.currentWeekData = JSON.parse(this.$route.query.currentWeekData);
  },
  methods: {
    getdata(param) {
      return new Promise((resolve, reject) => {
        axios.fetch("dietServer", "/dietElder/summary", param).then(res => {
          if (res.code == 200) {
            this.total = res.total;
            let data = res.data.map(val => {
              val.summaryTwoVoList = val.summaryTwoVoList == null ? [] : val.summaryTwoVoList;
              val.summaryTwoVoList = val.summaryTwoVoList.map(v => {
                v.summaryOneVoList = v.summaryOneVoList == null ? [] : v.summaryOneVoList;
                return v;
              })
              return val;
            });
            resolve(data);
          }
        })
      })
    },
  }
};
</script>

<style lang="less" scoped>
.print-container .title {
  padding: 0 !important;
  font-size: 24px;
}
* {
  font-size: 15px;
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

.tag-list-text {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  .tag {
    min-width: 50%;
    width: auto;
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


<style scoped>
@media print {
}
</style>

