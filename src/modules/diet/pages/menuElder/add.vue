<template>
  <div>
    <el-dialog center title="新增预订" :visible.sync="dialogNewVisible" :before-close="closePage" width="70%">
      <div class="buttons" style="text-align:center;">
        <div class="content">
          <div class="search-box">

            <el-row type="flex" class="pannel">
              <el-col :span="6">
                <span>长者姓名</span>
                <ub-elder :status="[0,100]" v-model="elderId" @change="getWeekMenuDetail" clearable></ub-elder>
              </el-col>

              <el-col :span="12">
                <span>快捷选择</span>
                <el-button :type="currentWeek == '0' ? 'primary' : ''" @click="changeWeek('0')">下一月（{{
              dietPeriodTypeList[0].status | filterStatus
            }}）<br /><br />{{ dietPeriodTypeList[0].title }}</el-button>
                <el-button :type="currentWeek == '1' ? 'primary' : ''" @click="changeWeek('1')">本月 (供应中)<br /><br />{{
              dietPeriodTypeList[1].title
            }}</el-button>
                <el-button :type="currentWeek == '2' ? 'primary' : ''" @click="changeWeek('2')">上一月<br /><br />
                  {{ dietPeriodTypeList[2].title }}</el-button>
                <el-button :type="currentWeek == '3' ? 'primary' : ''" @click="changeWeek('3')">上上一月<br /><br />
                  {{ dietPeriodTypeList[3].title }}</el-button>
              </el-col>
              <el-col :span="6">
                <div class="block">
                  <span class="demonstration">更多&nbsp;&nbsp;</span>
                  <el-date-picker :class="Number(currentWeek) > 3 ? 'week-picker' : ''" v-model="moreWeek" @change="changeMoreWeek" :picker-options="{ firstDayOfWeek: 1 }" type="month" format="yyyy-MM" value-format="yyyy-MM-01"
                    placeholder="选择月">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>
            <div class="null" v-if="chefData.length === 0">暂无数据</div>
            <table v-else class="ub-table el-table table" border cellspacing="0" cellpadding="0" v-for="(item,index) in chefData" :key="index">
              <thead>
                <tr>
                  <th v-for="(val, i) in item.dietMenuEightVoList" :key="i" class="is-leaf">
                    {{ val.weekName }}（{{val.periodDateText}}）
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-for="(val, scopeIndex) in item.dietMenuEightVoList" :key="scopeIndex">
                    <div v-if="val.isGrey">-</div>
                    <div v-else v-for="(w,point) in val.dietMenuNineVoList" :key="point">
                      <div class="name">
                        <el-tooltip class="item" effect="dark" :content="w.foodTitle+'（'+w.salePrice+'元/例）'" placement="top-start">
                          <el-checkbox @change="changePrice(w)" :disabled="w.isAccounted" v-model="w.isDraw">{{w.foodTitle}}（
                            <span style="color: #f00;">{{w.salePrice}}</span>元/例）
                          </el-checkbox>
                        </el-tooltip>
                      </div>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
        <div class="price-box">合计：<span class="price">{{summerPrice}} </span>元</div>
        <el-button type="primary" @click="submitApply" v-if="elderId">保存</el-button>
        <el-button @click="closePage">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ubElder from "@/components/elder";
export default {
  components: { ubElder },
  data() {
    return {
      currentWeek: "", // 当前按钮在第几月
      moreWeek: '',
      elderId: '',
      dietPeriodTypeList: [{ title: '' }, { title: '' }, { title: '' }, { title: '' }], // 所有月期列表
      chefData: [],
      dialogNewVisible: false,
    }
  },
  mounted() {
  },
  computed: {
    summerPrice() {
      let total = 0;
      let arr1 = [];
      let arr2 = [];
      this.chefData.forEach(item => {
        arr1.push(...item.dietMenuEightVoList);
      })
      arr1.forEach(item => {
        arr2.push(...item.dietMenuNineVoList);
      })
      arr2.forEach(item => {
        if (item.isDraw) {
          total += item.salePrice;
        }
      })
      return total.toFixed(2);
    }
  },
  methods: {
    init() {
      this.elderId = '';
      this.chefData = [];
      this.getDietPeriodList();
      this.dialogNewVisible = true;

    },
    changePrice(val) {
      console.log(val);
    },
    // 获取所有周期列表
    getDietPeriodList() {
      axios.fetch("dietServer", "/dietPeriod/query", { type: 0, periodType: 1 }).then(res => {
        if (res.code == 200) {
          this.dietPeriodTypeList = res.data;

          let length = this.dietPeriodTypeList.length;
          let lastMonty = this.$moment().add('month', -1).format('YYYY-MM') + '-01';
          let lastMontyText = this.$moment().add('month', -1).format('YYYY年MM月');
          let lastLastMonty = this.$moment().add('month', -2).format('YYYY-MM') + '-01';
          let lastLastMontyText = this.$moment().add('month', -2).format('YYYY年MM月');
          switch (length) {
            // 差2个

            case 2:
              this.dietPeriodTypeList = this.dietPeriodTypeList
                .concat({ title: lastMontyText, id: null, startDate: lastMonty })
                .concat({ title: lastLastMontyText, id: null, startDate: lastLastMonty });
              break;
            // 差1个
            case 3:
              // 上上周
              this.dietPeriodTypeList = this.dietPeriodTypeList
                .concat({ title: lastLastMontyText, id: null, startDate: lastLastMonty });
              break;

            default:
              break;
          }
          this.changeWeek("1");
        }
      });
    },
    // 点击月切换
    changeWeek(val) {
      this.moreWeek = "";
      if (this.dietPeriodTypeList[Number(val)].id === null) {
        return this.$message.error('此月并未配置菜谱！');
      }
      if (this.dietPeriodTypeList[Number(val)]) {
        this.$nextTick(() => {
          this.$set(this, "currentWeek", val);
          if (this.elderId !== '') {
            this.getWeekMenuDetail();
          }
        });
      }
    },
    // 点击日历中的月切换
    changeMoreWeek() {
      if (this.moreWeek == "" || this.moreWeek == null) {
        this.currentWeek = "0";
        this.getWeekMenuDetail(
          this.dietPeriodTypeList[Number(this.currentWeek)].id
        );
      } else {
        let index = this.dietPeriodTypeList.findIndex(
          val =>
            val.startDate.substr(0, 10) == this.moreWeek
        );
        this.currentWeek = index;
        if (index !== -1) {
          if (index < 4) {
            let text = "";
            switch (index) {
              case 0:
                text = "下一月";
                break;
              case 1:
                text = "本月";
                break;
              case 2:
                text = "上一月";
                break;
              case 3:
                text = "上上一月";
                break;
              default:
                break;
            }
            this.$message.success("您当前选择的是：" + text);
            this.changeWeek(index + "");
          } else {
            this.getWeekMenuDetail(this.dietPeriodTypeList[index].id);
          }
        } else {
          this.$message.error("未配置此项！");
        }
      }
    },
    // 获取某月的详细菜谱
    getWeekMenuDetail() {
      if (!this.dietPeriodTypeList[Number(this.currentWeek)].status) {
        this.chefData = [];
        return this.$message.error('当前选中月的菜谱未发布！');
      }
      if (this.elderId === '') {
        this.chefData = [];
        return;
      }
      let param = {
        periodId: this.dietPeriodTypeList[Number(this.currentWeek)].id,
        elderId: this.elderId
      }
      axios
        .fetch("dietServer", "/dietMenu/get/dishReserve", param)
        .then(res => {
          if (res.code == 200) {
            this.chefData = res.data.map(val => {
              val.dietMenuEightVoList = !val.dietMenuEightVoList ? [] : val.dietMenuEightVoList.map(
                (v, index) => {
                  v.periodDateText = v.periodDate.substr(5);
                  v.dietMenuNineVoList = !v.dietMenuNineVoList ? [] : v.dietMenuNineVoList;
                  return v;
                }
              );
              return val;
            });
          }
        })
    },
    submitApply() {
      axios.fetch("dietServer", "/dietElder/submit/dishReserve", this.chefData, "json").then(res => {
        if (res.code == 200) {
          this.closePage();
        }
      });
    },

    closePage() {
      this.elderId = '';
      this.chefData = [];
      this.dialogNewVisible = false;
      this.$emit('close')
    },
  },
  filters: {
    filterStatus: val => {
      return ["未发布", "已发布"][val];
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-table {
  table-layout: fixed;
  border: none;
  tr {
    height: 55px;
    border: none;
  }
}
.name {
  /deep/.el-checkbox {
    display: flex;
    width: 90%;
    margin: 0 auto;
    /deep/ .el-checkbox__label {
      width: 90%;
      display: block;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.null {
  line-height: 300px;
  color: #999;
  font-size: 16px;
}
.price-box {
  text-align: left;
  .price {
    color: #f00;
    font-size: 25px;
  }
}
</style>