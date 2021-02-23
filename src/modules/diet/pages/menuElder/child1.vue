<template>
  <div>
    <el-form :inline="true" v-show="moreQuery" class="search">
      <el-form-item :label="item.name" v-for="item in allMenuList" :key="item.id">
        <el-select v-model="item.choose" multiple collapse-tags filterable placeholder="请选择">
          <el-option v-for="item in item.list" :key="item.id" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :inline="true" v-show="moreQuery" class="search">
      <el-form-item label="类别">
        <el-button :type="currentMenuType == '' ? 'primary' : ''" @click="changeMenuType('')">全部</el-button>
        <el-button :type="currentMenuType == item.title ? 'primary' : ''" v-for="item in menuType" :key="item.id" @click="changeMenuType(item.title)">{{item.title}}</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="search">
      <el-form-item label="区域">
        <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
      </el-form-item>
      <el-form-item label="房间号或姓名">
        <ub-elder v-model="elderId" @change='item => search.elderName = item.elderName' clearable></ub-elder>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="14">
          <span>快捷选择</span>
          <el-button :type="currentWeek == '0' ? 'primary' : ''" @click="changeWeek('0')">下一周（{{dietPeriodTypeList[0].status | filterStatus}}）<br /><br />{{weekOptionsList[0].MondayText}} ~ {{weekOptionsList[0].SundayText}}</el-button>
          <el-button :type="currentWeek == '1' ? 'primary' : ''" @click="changeWeek('1')">本周 (供应中)<br /><br />{{weekOptionsList[1].MondayText}} ~ {{weekOptionsList[1].SundayText}}</el-button>
          <el-button :type="currentWeek == '2' ? 'primary' : ''" @click="changeWeek('2')">上一周<br /><br />{{weekOptionsList[2].MondayText}} ~ {{weekOptionsList[2].SundayText}}</el-button>
          <el-button :type="currentWeek == '3' ? 'primary' : ''" @click="changeWeek('3')">上上一周<br /><br />{{weekOptionsList[3].MondayText}} ~ {{weekOptionsList[3].SundayText}}</el-button>
        </el-col>
        <el-col>
          <div class="block">
            <span class="demonstration">更多&nbsp;&nbsp;</span>
            <el-date-picker :class="Number(currentWeek) > 3 ?'week-picker' : ''" v-model="moreWeek" @change="changeMoreWeek" :picker-options="{'firstDayOfWeek': 1}" type="week" format="yyyy年 第 WW 周" value-format="yyyy-MM-dd"
              placeholder="选择周">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="1">
          <el-button icon="iconfont iconjichutubiao-shaixuan" @click="moreQuery = !moreQuery"></el-button>
        </el-col>
      </el-row>
      <el-table class="ub-table" :data="data" row-key="id" :span-method="arraySpanMethod" border>
        <el-table-column prop="elderName" label="姓名"></el-table-column>
        <el-table-column prop="title" label="类别"></el-table-column>
        <el-table-column :label="week.text+'（'+week.value+')'" v-for="(week,point) in currentWeekData" :key="point">
          <template slot-scope="scope">
            <div class="menu-content">
              <div class="tag-list-text">
                <div class="tag" :key="tag" v-for="tag in data[scope.$index].dietInfoVos[point].dietFoodVos">
                  <span class="name">{{tag.title}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </div>
</template>

<script>
import { weDateFormat } from "@/utils/utils.js";
import ubElder from "@/components/elder";
export default {
  data() {
    return {
      moreQuery: false, // 更多筛选
      elderId: '',
      currentMenuType: '', // 当前按钮在哪个类别
      currentWeek: '1', // 当前按钮在第几周
      moreWeek: '',
      setArea: '',
      search: {
        area: '',
        elderName: ''
      },
      addInfo: {
        title: '',
        start: ''
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dietPeriodTypeList: [{}], // 所有周期列表
      weekOptionsList: [{
        MondayText: '', SundayText: ''
      }, {
        MondayText: '', SundayText: ''
      }, {
        MondayText: '', SundayText: ''
      }, {
        MondayText: '', SundayText: ''
      },], // 4周的列表
      data: [],
      menuType: [],
      menuCookType: [],
      allMenuList: [],
      currentWeekData: {}, // 当前周周一到周日的信息
    }
  },
  components: { ubElder },
  mounted() {
    this.init();
    this.getAllMenuList();
    this.getDietPeriodList();
  },
  methods: {
    getArea(val) {
      this.search.area = val.value;
      this.setArea = val.text;
    },
    changeMenuType(val) {
      console.log(val);
      this.currentMenuType = val;
      this.search.title = val;
      this.currentPage = 1;
      this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id)
    },
    // 合并最后一行
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 5) {
        if (columnIndex === 2) {
          // return [2,7]
        }
      }
    },
    // 点击周切换
    changeWeek(val) {
      this.moreWeek = '';
      if (this.dietPeriodTypeList[Number(val)]) {
        this.currentWeek = val;
        this.currentPage = 1;
        this.getdata(this.dietPeriodTypeList[Number(val)].id);
        this.getWeekDataOption();
      } else {
        return this.$message.error('该时间段还未配置过菜谱！');
      }
    },
    getWeekDataOption() {
      let data = this.weekOptionsList[Number(this.currentWeek)];
      this.currentWeekData = [{
        text: '周一',
        value: data.MondayText
      }, {
        text: '周二',
        value: data.TuesdayText
      }, {
        text: '周三',
        value: data.WednesdayText
      }, {
        text: '周四',
        value: data.ThursdayText
      }, {
        text: '周五',
        value: data.FridayText
      }, {
        text: '周六',
        value: data.SaturdayText
      }, {
        text: '周日',
        value: data.SundayText
      },]
    },

    // 点击日历中的周切换
    changeMoreWeek() {
      if (this.moreWeek == '' || this.moreWeek == null) {
        this.currentWeek = '0';
        this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id);
        this.getWeekDataOption();
      } else {
        let index = this.dietPeriodTypeList.findIndex(val => val.startDate.substr(0, 10) == weDateFormat(this.moreWeek).lastMonday);
        this.currentWeek = index;
        if (index !== -1) {
          if (index < 4) {
            let text = '';
            switch (index) {
              case 0:
                text = '下一周'
                break;
              case 1:
                text = '本周'
                break;
              case 2:
                text = '上一周'
                break;
              case 3:
                text = '上上一周'
                break;
              default:
                break;
            }
            this.$message.success('您当前选择的是：' + text);
            this.changeWeek(index + '');
          } else {
            this.currentPage = 1;
            this.getdata(this.dietPeriodTypeList[index].id);
            this.getWeekDataOption();
          }
        } else {
          return this.$message.error('该时间段还未配置过菜谱！');
        }
      }
    },

    // 获取所有周期列表
    getDietPeriodList() {
      axios.fetch("dietServer", "/dietPeriod/query", { type: 0, periodType: 0 }).then(res => {
        if (res.code == 200) {
          this.dietPeriodTypeList = res.data;
          this.weekOptionsList = this.dietPeriodTypeList.map(val => {
            return weDateFormat(val.startDate)
          })
          let length = this.dietPeriodTypeList.length;
          switch (length) {
            // 差2个
            case 2:
              // 上周
              let lastWeek = this.$moment().subtract('days', 7).format('YYYY-MM-DD');
              // 上上周
              let lateLastWeek = this.$moment().subtract('days', 14).format('YYYY-MM-DD');

              this.weekOptionsList = this.weekOptionsList.concat(weDateFormat(lastWeek)).concat(weDateFormat(lateLastWeek));
              break;
            // 差1个
            case 3:
              // 上上周
              let lateLastWeek1 = this.$moment().subtract('days', 14).format('YYYY-MM-DD');

              this.weekOptionsList = this.weekOptionsList.concat(weDateFormat(lateLastWeek1));

              break;

            default:
              break;
          }
          this.weekOptionsList.map(val => {
            val.MondayText = val.lastMonday.substr(5, 5);
            val.TuesdayText = val.lastTuesday.substr(5, 5);
            val.WednesdayText = val.lastWednesday.substr(5, 5);
            val.ThursdayText = val.lastThursday.substr(5, 5);
            val.FridayText = val.lastFriday.substr(5, 5);
            val.SaturdayText = val.lastSaturday.substr(5, 5);
            val.SundayText = val.lastSunday.substr(5, 5);
            return val;
          });
          this.changeWeek('0');
        }
      })
    },

    // 获取所有菜谱列表
    getAllMenuList() {
      let param = {
        pageIndex: 1,
        pageSize: 1000,
      }
      axios.fetch("dietServer", "/dietFood/query", param).then(res => {
        if (res.code == 200) {
          this.allMenuList = [];
          let detailInfo = res.data.sort((a, b) => a.categoryId - b.categoryId)
          let list = JSON.parse(JSON.stringify(detailInfo));
          this.currentItem = {
            name: list[0].categoryTitle,
            id: list[0].categoryId,
            list: []
          }

          list.forEach(val => {
            if (val.categoryId == this.currentItem.id) {
              this.currentItem.list.push(val);
            } else {
              this.allMenuList.push(this.currentItem);
              this.currentItem = {
                name: val.categoryTitle,
                id: val.categoryId,
                list: [val]
              }
            }
          });
          this.allMenuList.push(this.currentItem);
          console.log(this.allMenuList)
        }
      })

    },
    init() {
      // 总共有哪些早中晚类别
      let typeNet = new Promise((resolve, reject) => {
        axios.fetch("dietServer", "/dietCategory/query", { type: 1, forType: 10 }).then(res => {
          if (res.code == 200) {
            resolve(res.data);
          }
        })
      })
      // 总共有哪些晕素类别
      let typeNet1 = new Promise((resolve, reject) => {
        axios.fetch("dietServer", "/dietCategory/query", { type: 0 }).then(res => {
          if (res.code == 200) {
            resolve(res.data);
          }
        })
      })
      Promise.all([typeNet, typeNet1]).then(val => {
        console.log(val);
        this.menuType = val[0];
        this.menuCookType = val[1];
      });
    },
    getdata(id) {
      let arr = this.allMenuList.map(val => {
        return val.choose;
      })
      arr = arr.flat().join(',');
      let param = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        periodId: id,
        areaId: this.search.area,
        elderName: this.search.elderName,
        title: this.search.title,
        foodIds: arr
      }
      axios.fetch("dietServer", "/dietElder/all", param).then(res => {
        if (res.code == 200) {
          this.total = res.total;
          this.data = res.data;
        }
      })
    },
    handleChange(i) {
      this.currentPage = i;
      this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id);
    },
    // 重置
    reset() {
      if (this.$refs.areaCom !== undefined) {
        this.$refs.areaCom.resetArea();
        this.setArea = '';
      }
      this.search = {
        area: '',
        elderName: ''
      };
      this.elderId = '';
      this.currentMenuType = '';
      this.currentWeek = '0';
      this.moreWeek = '';
      this.getWeekDataOption();
      this.currentPage = 1;
      this.allMenuList = this.allMenuList.map(val => {
        val.choose = [];
        return val;
      })
      this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id)
    },
  },
  filters: {
    filterStatus: val => {
      return ['未发布', '已发布'][val];
    }
  }
}
</script>

<style lang="less" scoped>
.week-picker {
  border: 1px solid #449efb;
}
.view-container .el-button {
  min-width: auto;
  padding: 5px !important;
}
/deep/ .el-table .cell,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding: 0 !important;
}
.buttons {
  text-align: center;
  margin: 20px 0 10px 0;
}
.illDialog {
  i {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    width: 20px;
    height: 20px;
  }
  z-index: 10;
  background-color: #fff;
  padding: 10px;
  position: absolute;
  border: 1px solid #cccccc;
  border-radius: 5px;
}
.text-red {
  color: #f00;
}
.text-blue {
  color: #62c2f2;
}
.menu-content {
  height: auto;
  min-height: 26px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
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
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    .el-tag {
      margin: 0 5px 5px 0;
    }
  }
  .button-box {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>