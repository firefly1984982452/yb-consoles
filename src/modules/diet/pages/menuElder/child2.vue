<template>
  <div>
    <el-form :inline="true" class="search">
      <el-form-item label="区域">
        <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
      </el-form-item>
      <el-form-item label="房间号或姓名">
        <ub-elder v-model="elderId" @change="item => (search.elderName = item.elderName)" clearable></ub-elder>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="search.periodDate" @change="changeDate" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="小锅菜">
        <el-select v-model="search.menu" multiple collapse-tags filterable placeholder="请选择">
          <el-option v-for="item in allMenuList" :key="item.id" :label="item.title" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="14">
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
        <el-col>
          <div class="block">
            <span class="demonstration">更多&nbsp;&nbsp;</span>
            <el-date-picker :class="Number(currentWeek) > 3 ? 'week-picker' : ''" v-model="moreWeek" @change="changeMoreWeek" :picker-options="{ firstDayOfWeek: 1 }" type="month" value-format="yyyy-MM-dd" placeholder="选择月份">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-plus" @click="showAdd" style="padding: 10px 16px!important;">添加</el-button>
        </el-col>
      </el-row>
      <el-table class="ub-table" :data="data" row-key="id" :span-method="cellMerge" border>
        <el-table-column prop="areaName" label="护理区域"></el-table-column>
        <el-table-column label="房间床位">
          <template slot-scope="scope">
            {{scope.row.roomName}}-{{scope.row.bedName}}
          </template>
        </el-table-column>
        <el-table-column prop="elderName" label="长者姓名"></el-table-column>
        <el-table-column prop="periodDate" label="日期"></el-table-column>
        <el-table-column prop="weekDayText" label="星期"></el-table-column>
        <el-table-column prop="title" label="菜单"></el-table-column>
        <el-table-column prop="foodAmount" label="价格"></el-table-column>
        <el-table-column prop="summerAmount" label="小计金额"></el-table-column>
        <el-table-column prop="createTime" label="预订时间" width="200"></el-table-column>
        <el-table-column label="来源">
          <template slot-scope="scope">
            {{scope.row.creatorType | filterCreatorType}}
          </template>
        </el-table-column>
        <el-table-column label="是否结算">
          <template slot-scope="scope">
            {{scope.row.isAccounted | filterAccounted}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="删除" placement="top-end" v-show="!scope.row.isAccounted">
              <el-button size="mini" @click="del(scope.row)" icon="el-icon-delete-solid"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <div class="buttons">
        <el-button type="primary" style="padding: 16px 46px!important;" @click="print">打印</el-button>
      </div>
    </div>
    <!-- 新增预订 -->
    <add ref="addChild" @close="closeDialog" />
  </div>
</template>

<script>
import add from './add';
import ubElder from "@/components/elder";
import printMethods from "@/utils/print";
export default {
  data() {
    return {
      elderId: "",
      currentWeek: "1", // 当前按钮在第几月
      moreWeek: "",
      setArea: "",
      search: {
        area: "",
        elderName: "",
        periodDate: "",
        menu: ''
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dietPeriodTypeList: [{ title: '' }, { title: '' }, { title: '' }, { title: '' }], // 所有月期列表
      weekOptionsList: [
        {
          MondayText: "",
          SundayText: ""
        },
        {
          MondayText: "",
          SundayText: ""
        },
        {
          MondayText: "",
          SundayText: ""
        },
        {
          MondayText: "",
          SundayText: ""
        }
      ], // 4月的列表
      data: [],
      menuCookType: [],
      allMenuList: [],
    };
  },
  components: { ubElder, add },
  mounted() {
    this.init();
    // this.getAllMenuList();
    this.getDietPeriodList();
    setTimeout(() => {
      this.getElderFood(null);
    }, 300);
  },
  methods: {
    closeDialog() {
      this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id);
    },
    showAdd() {
      this.$refs.addChild.init();
    },
    getArea(val) {
      this.search.area = val.value;
      this.setArea = val.text;
    },
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
    ...printMethods, //引入打印方法
    //打印
    print(data) {
      let arr = this.search.menu.length > 0 ? this.search.menu.join(",") : '';
      this.openPrint({
        path: "/print/elder/menuElder",
        query: {
          id: this.dietPeriodTypeList[Number(this.currentWeek)].id,
          search: JSON.stringify(this.search),
          allMenuList: arr,
          month: this.dietPeriodTypeList[this.currentWeek].title
        }
      });
    },
    changeDate() {
      this.search.menu = '';
      this.currentPage = 1;
      let periodDate = !this.search.periodDate ? this.search.periodDate : this.$moment(this.search.periodDate).format('yyyy-MM-DD');
      console.log(periodDate)
      if (periodDate === null) {
        this.getElderFood(periodDate);
        this.reset();
      } else {

        let lastDate = this.dietPeriodTypeList[Number(this.currentWeek)];

        let chooseMonth = this.$moment(periodDate).format('yyyy-MM');
        let lastMonth = this.$moment(lastDate.startDate).format('yyyy-MM');

        this.moreWeek = this.$moment(periodDate).format('yyyy-MM-01');
        this.changeMoreWeek('date');
        this.getElderFood(periodDate);
      }
    },
    // 小锅菜
    getElderFood(periodDate) {
      let param = {
        periodId: this.dietPeriodTypeList[Number(this.currentWeek)].id,
        date: periodDate
      }
      if (periodDate === null) {
        delete param.date;
      }
      console.log(param)
      axios.fetch("dietServer", "/dietMenu/get/foodByDate", param).then(res => {
        this.allMenuList = res.data.map(val => {
          let item = {
            id: val.foodId,
            title: val.foodTitle
          };
          return item;
        });
        console.log(this.allMenuList, res.data)
      });

    },
    // 点击月切换
    changeWeek(val) {
      this.moreWeek = "";
      if (this.dietPeriodTypeList[Number(val)].id === null) {
        return this.$message.error("该时间段还未配置过小锅菜！");
      } else if (this.dietPeriodTypeList[Number(val)]) {
        this.$nextTick(() => {
          this.currentWeek = val;
          this.currentPage = 1;
          this.getElderFood(null);
          this.getdata(this.dietPeriodTypeList[Number(val)].id);
        });
      }
    },

    // 点击日历中的月切换
    changeMoreWeek(type = 'init') {
      console.log(type)
      console.log(this.moreWeek)
      if (this.moreWeek == "" || this.moreWeek == null) {
        this.currentWeek = "1";
        this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id);
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
            this.currentPage = 1;
            this.getdata(this.dietPeriodTypeList[index].id);
          }
        } else {
          this.changeWeek('0');
          if (type === 'date') {
            this.search.periodDate = '';
          } else {
            return this.$message.error("该时间段还未配置过小锅菜，已为您切换到下一月！");
          }
        }
      }
    },

    // 获取所有月期列表
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
              // 上上月
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

    // 获取所有菜谱列表
    getAllMenuList() {
      let param = {
        pageIndex: 1,
        pageSize: 1000,
        forType: 12
      };
      axios.fetch("dietServer", "/dietFood/query", param).then(res => {
        if (res.code == 200) {
          this.allMenuList = res.data;
        }
      });
    },
    init() {
      // 总共有哪些晕素类别
      let typeNet1 = new Promise((resolve, reject) => {
        axios
          .fetch("dietServer", "/dietCategory/query", { type: 0 })
          .then(res => {
            if (res.code == 200) {
              resolve(res.data);
            }
          });
      });
      Promise.all([typeNet1]).then(val => {
        this.menuCookType = val[0];
      });
    },
    getdata(id) {
      let periodDate = !this.search.periodDate ? this.search.periodDate : this.$moment(this.search.periodDate).format('yyyy-MM-DD');
      let arr = this.search.menu.length > 0 ? this.search.menu.join(",") : '';
      let param = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        periodId: id,
        periodDate: periodDate,
        areaId: this.search.area,
        elderName: this.search.elderName,
        foodIds: arr,
        isPager: true
      };
      axios.fetch("dietServer", "/dietElder/cookingPot", param).then(res => {
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
    },
    handleChange(i) {
      this.currentPage = i;
      this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id);
    },
    // 重置
    reset() {
      if (this.$refs.areaCom !== undefined) {
        this.$refs.areaCom.resetArea();
        this.setArea = "";
      }
      this.search = {
        area: "",
        elderName: "",
        periodDate: '',
        menu: ''
      };
      this.elderId = "";
      this.currentWeek = "1";
      this.moreWeek = "";
      this.currentPage = 1;
      this.allMenuList = this.allMenuList.map(val => {
        val.choose = [];
        return val;
      });
      this.getElderFood(null);
      this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id);
    },
    del(item) {
      this.$confirm("是否删除该项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios.fetch("dietServer", "/dietElder/invalid/smallPotDish", {
          id: item.id
        }).then(res => {
          if (res.code == 200) {
            this.getdata(this.dietPeriodTypeList[Number(this.currentWeek)].id);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    }
  },
  filters: {
    filterStatus: val => {
      return ["未发布", "已发布"][val];
    },
    filterAccounted: val => {
      return ['否', '是'][Number(val)];
    },
    filterCreatorType: val => {
      return ['系统', '家属端'][Number(val)];
    }
  }
};
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
