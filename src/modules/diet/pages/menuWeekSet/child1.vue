<template>
  <div>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="14">
          <span>快捷选择</span>
          <el-button :type="currentWeek == '0' ? 'primary' : ''" @click="changeWeek('0')">下一周（{{
              dietPeriodTypeList[0].status | filterStatus
            }}）<br /><br />{{ weekOptionsList[0].MondayText }} ~
            {{ weekOptionsList[0].SundayText }}</el-button>
          <el-button :type="currentWeek == '1' ? 'primary' : ''" @click="changeWeek('1')">本周 (供应中)<br /><br />{{ weekOptionsList[1].MondayText }} ~
            {{ weekOptionsList[1].SundayText }}</el-button>
          <el-button :type="currentWeek == '2' ? 'primary' : ''" @click="changeWeek('2')">上一周<br /><br />{{ weekOptionsList[2].MondayText }} ~
            {{ weekOptionsList[2].SundayText }}</el-button>
          <el-button :type="currentWeek == '3' ? 'primary' : ''" @click="changeWeek('3')">上上一周<br /><br />{{ weekOptionsList[3].MondayText }} ~
            {{ weekOptionsList[3].SundayText }}</el-button>
        </el-col>
        <el-col>
          <div class="block">
            <span class="demonstration">更多&nbsp;&nbsp;</span>
            <el-date-picker :class="Number(currentWeek) > 3 ? 'week-picker' : ''" v-model="moreWeek" @change="changeMoreWeek" :picker-options="{ firstDayOfWeek: 1 }" type="week" format="yyyy年 第 WW 周" value-format="yyyy-MM-dd"
              placeholder="选择周">
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-table class="ub-table" :data="chefData" border>
        <el-table-column prop="categoryTitle" width="100" label="类别"></el-table-column>
        <el-table-column :label="
            '周' + week.weekText + '（' + week.periodDate.substr(5, 5) + ')'
          " v-for="(week, point) in chefData[0].dietMenuFiveVoList" :key="point">
          <template slot-scope="scope">
            <div class="menu-content">
              <!-- 编辑和显示状态下的所有菜列表 -->
              <div v-if="
                  !chefData[scope.$index].dietMenuFiveVoList[point].confirmBtn
                " class="tag-list">
                <el-tag :key="tag" v-for="tag in chefData[scope.$index].dietMenuFiveVoList[point]
                    .dietMenuVoListText" closable :disable-transitions="false" @close="handleClose(tag, scope.$index, point)">
                  <span class="name">{{ tag }}</span>
                </el-tag>
              </div>
              <div v-else class="tag-list-text">
                <div class="tag" :key="tag" v-for="tag in chefData[scope.$index].dietMenuFiveVoList[point]
                    .dietMenuVoList">
                  <span class="name">{{ tag.foodTitle }}</span>
                </div>
              </div>

              <!-- 弹出框所有菜 -->
              <el-popover placement="bottom" width="700" :ref="`popover-${scope.$index}-${point}`" trigger="click">
                <!-- 菜 -->
                <el-row :gutter="5" class="illDialog">
                  <i class="el-icon-close" @click="closeDialog(scope.$index, point)"></i>
                  <el-checkbox-group v-model="
                      chefData[scope.$index].dietMenuFiveVoList[point]
                        .dietMenuVoListText
                    " :value-key="id">
                    <div v-for="item in allMenuList" :key="item.id" class="dialog-menu">
                      <div class="title">{{ item.name }}：</div>
                      <div class="value">
                        <el-checkbox @change="
                            changeMenu(
                              ill,
                              chefData[scope.$index].dietMenuFiveVoList[point]
                                .dietMenuVoList,
                              scope.$index,
                              point
                            )
                          " v-for="ill in item.list" :key="ill.id" :label="ill.title"></el-checkbox>
                      </div>
                    </div>
                  </el-checkbox-group>
                </el-row>

                <!-- 按钮 -->
                <div slot="reference" class="button-box" v-show="currentWeek == '0'">
                  <div class="add" v-if="
                      chefData[scope.$index].dietMenuFiveVoList[point]
                        .dietMenuVoList.length == 0
                    ">
                    <el-button icon="el-icon-plus" @click="
                        editCurrentMenu(
                          chefData[scope.$index].dietMenuFiveVoList[point],
                          scope.$index,
                          point
                        )
                      " circle></el-button>
                  </div>
                  <el-button v-else-if="
                      chefData[scope.$index].dietMenuFiveVoList[point]
                        .dietMenuVoList.length > 0
                    " @click="
                      editCurrentMenu(
                        chefData[scope.$index].dietMenuFiveVoList[point],
                        scope.$index,
                        point
                      )
                    " type="primary" icon="el-icon-edit" circle></el-button>
                </div>
              </el-popover>
              <div class="button-box">
                <el-button type="success" v-show="
                    !chefData[scope.$index].dietMenuFiveVoList[point]
                      .confirmBtn &&
                      chefData[scope.$index].dietMenuFiveVoList[point]
                        .dietMenuVoListText.length !== 0
                  " icon="el-icon-check" @click="confirmCurrentMenu(scope.$index, point)" circle></el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="buttons" v-show="currentWeek == '0'">
        <el-button type="warning" style="padding: 16px 46px!important;" @click="print()"><i class="iconfont iconcaozuotubiao-dayin"></i>&nbsp;&nbsp;打&nbsp;&nbsp;印</el-button>
        <el-button type="primary" style="padding: 16px 46px!important;" @click="save('save')"><i class="iconfont iconcaozuotubiao-baocun"></i>&nbsp;&nbsp;保&nbsp;&nbsp;存</el-button>
        <el-button type="success" style="padding: 16px 46px!important;" v-show="dietPeriodTypeList[0].status == 0" @click="confirmRelease"><i class="iconfont iconcaozuotubiao-pinggu"></i>&nbsp;&nbsp;确认发布</el-button>
      </div>
      <div class="buttons" v-show="currentWeek !== '0'">
        <el-button type="warning" style="padding: 16px 46px!important;" @click="print()"><i class="iconfont iconcaozuotubiao-dayin"></i>&nbsp;&nbsp;打&nbsp;&nbsp;印</el-button>
        <el-button type="primary" style="padding: 16px 26px!important;" @click="copyMenu"><i class="iconfont iconzuocedaohangtubiao-zhihuiyihu-yizhuguanli"></i>&nbsp;&nbsp;菜谱复制到下一周</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { weDateFormat } from "@/utils/utils.js";
import ubEmployee from "@/components/employee";
import printMethods from "@/utils/print";
export default {
  components: { ubEmployee },
  data() {
    return {
      employeeData: "",
      currentWeek: "", // 当前按钮在第几周
      moreWeek: "",
      dietPeriodTypeList: [{}], // 所有周期列表
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
      ], // 4周的列表
      allMenuList: [], // 所有菜的列表,
      currentItem: {},
      chefData: [
        { dietMenuFiveVoList: [{ periodDate: "", dietMenuVoList: [], dietMenuVoListText: [] }] }
      ] // 每周厨师列表
    };
  },
  mounted() {
    this.getDietPeriodList("0");
    this.getAllMenuList();
  },
  methods: {
    closeDialog(index, i) {
      let name = 'popover-' + index + '-' + i;
      this.$refs[name][0].doClose();
    },
    ...printMethods, //引入打印方法
    //打印
    print() {
      this.openPrint({
        path: "/print/elder/menuWeek",
        query: {
          id: this.dietPeriodTypeList[Number(this.currentWeek)].id
        }
      });
    },
    // 获取所有菜谱列表
    getAllMenuList() {
      let param = {
        pageIndex: 1,
        pageSize: 1000,
        forType: 10
      };
      axios.fetch("dietServer", "/dietFood/query", param).then(res => {
        if (res.code == 200) {
          this.allMenuList = [];
          let detailInfo = res.data.sort((a, b) => a.categoryId - b.categoryId);
          let list = JSON.parse(JSON.stringify(detailInfo));
          this.currentItem = {
            name: list[0].categoryTitle,
            id: list[0].categoryId,
            list: []
          };

          list.forEach(val => {
            if (val.categoryId == this.currentItem.id) {
              this.currentItem.list.push(val);
            } else {
              this.allMenuList.push(this.currentItem);
              this.currentItem = {
                name: val.categoryTitle,
                id: val.categoryId,
                list: [val]
              };
            }
          });
          this.allMenuList.push(this.currentItem);
        }
      });
    },
    // 点击周切换
    changeWeek(val) {
      this.moreWeek = "";
      if (this.dietPeriodTypeList[Number(val)]) {
        this.$nextTick(() => {
          this.$set(this, "currentWeek", val);
          this.$forceUpdate();
          this.getWeekMenuDetail(this.dietPeriodTypeList[Number(val)].id);
        });
      }
    },

    // 点击日历中的周切换
    changeMoreWeek() {
      if (this.moreWeek == "" || this.moreWeek == null) {
        this.currentWeek = "0";
        this.getWeekMenuDetail(
          this.dietPeriodTypeList[Number(this.currentWeek)].id
        );
      } else {
        let index = this.dietPeriodTypeList.findIndex(
          val =>
            val.startDate.substr(0, 10) ==
            weDateFormat(this.moreWeek).lastMonday
        );
        this.currentWeek = index;
        if (index !== -1) {
          if (index < 4) {
            let text = "";
            switch (index) {
              case 0:
                text = "下一周";
                break;
              case 1:
                text = "本周";
                break;
              case 2:
                text = "上一周";
                break;
              case 3:
                text = "上上一周";
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

    // 复制厨师
    copyMenu() {
      this.$confirm("之前保存的下一周菜谱将被覆盖，请确认。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .fetch("dietServer", "/dietMenu/copy/toNextWeek", {
            periodId: this.dietPeriodTypeList[Number(this.currentWeek)].id
          })
          .then(res => {
            if (res.code == 200) {
              this.$message.success("复制成功");
              this.changeWeek("0");
            }
          });
      });
    },

    // 确认某天的某个菜谱
    confirmCurrentMenu(index, i) {
      this.chefData[index].dietMenuFiveVoList[i].confirmBtn = true;
    },

    // 编辑某天的某个菜谱
    editCurrentMenu(val, index, i) {
      this.$nextTick(() => {
        this.chefData[index].dietMenuFiveVoList[i].confirmBtn = false;
        this.$forceUpdate();
      })
    },
    // 删除小标签菜谱
    handleClose(val, index, i) {
      let i1 = this.chefData[index].dietMenuFiveVoList[
        i
      ].dietMenuVoList.findIndex(item => item.foodTitle == val);
      console.log(
        this.chefData[index].dietMenuFiveVoList[i].dietMenuVoList,
        i1,
        val
      );
      this.chefData[index].dietMenuFiveVoList[i].dietMenuVoList.splice(i1, 1);
      this.chefData[index].dietMenuFiveVoList[i].dietMenuVoListText.splice(
        i1,
        1
      );
    },

    // 获取所有周期列表
    getDietPeriodList(indexNumber) {
      axios.fetch("dietServer", "/dietPeriod/query", { type: 0, periodType: 0 }).then(res => {
        if (res.code == 200) {
          this.dietPeriodTypeList = res.data;
          this.weekOptionsList = this.dietPeriodTypeList.map(val => {
            return weDateFormat(val.startDate);
          });
          let length = this.dietPeriodTypeList.length;
          switch (length) {
            // 差2个
            case 2:
              // 上周
              let lastWeek = this.$moment()
                .subtract("days", 7)
                .format("YYYY-MM-DD");
              // 上上周
              let lateLastWeek = this.$moment()
                .subtract("days", 14)
                .format("YYYY-MM-DD");

              this.weekOptionsList = this.weekOptionsList
                .concat(weDateFormat(lastWeek))
                .concat(weDateFormat(lateLastWeek));
              break;
            // 差1个
            case 3:
              // 上上周
              let lateLastWeek1 = this.$moment()
                .subtract("days", 14)
                .format("YYYY-MM-DD");

              this.weekOptionsList = this.weekOptionsList.concat(
                weDateFormat(lateLastWeek1)
              );

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
          this.changeWeek(indexNumber);
        }
      });
    },

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
          }
        });
    },
    // 选择单个菜品后的点击事件
    changeMenu(item, val, index, i) {
      let list = this.chefData[index].dietMenuFiveVoList[i].dietMenuVoList;
      list ? list : (list = []);
      let menuIndex = list.findIndex(val => val.foodTitle == item.title);
      if (menuIndex === -1) {
        let tempData = {
          periodDate: this.chefData[index].dietMenuFiveVoList[i].periodDate,
          periodId: this.chefData[index].dietMenuFiveVoList[i].periodId,
          foodId: item.id,
          foodTitle: item.title,
          categoryId: this.chefData[index].categoryId
        };
        this.chefData[index].dietMenuFiveVoList[i].dietMenuVoList.push(
          tempData
        );
      } else {
        this.chefData[index].dietMenuFiveVoList[i].dietMenuVoList.splice(
          menuIndex,
          1
        );
      }
    },
    // 保存菜谱
    save(type) {
      let url = type === "release" ? "/dietMenu/issue" : "/dietMenu/submit";

      axios.fetch("dietServer", url, this.chefData, "json").then(res => {
        if (res.code == 200) {
          if (type == "release") {
            this.getDietPeriodList("0");
          } else {
            if (type === "saveRelease") {
              this.save("release");
            } else {
              this.changeWeek("0");
            }
          }
        }
      });
    },
    // 确认发布
    confirmRelease() {
      this.$confirm("请确认是否正式发布？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(this.data);
        let hasUnSave = this.chefData
          .map(val => {
            let has = val.dietMenuFiveVoList.some(v => v.confirmBtn === false);
            return has;
          })
          .some(v => v); // 是否有未保存的数据
        console.log(hasUnSave);
        if (hasUnSave) {
          this.save("saveRelease");
        } else {
          this.save("release");
        }
      });
    }
  },
  filters: {
    filterStatus: val => {
      return ["未发布", "已发布"][val];
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
  .dialog-menu {
    display: flex;
    margin: 0 0 10px 0;
    .title {
      width: 70px;
      font-size: 16px;
      font-weight: bold;
    }
    .value {
      width: 600px;
      display: flex;
      flex-wrap: wrap;
    }
  }
}
.text-red {
  color: #f00;
}
.text-blue {
  color: #62c2f2;
}
.menu-content {
  width: 100%;
  height: auto;
  min-height: 26px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-items: center;
  .tag-list-text {
    width: 100%;
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
        text-align: center;
      }
    }
  }
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 0 40px;
    .el-tag {
      margin: 0 5px 5px 0;
    }
  }
  .button-box {
    position: absolute;
    bottom: 0;
    right: 0;
    .add {
      margin-right: 100px;
    }
  }
}
.pannel {
  align-items: center;
  .el-col-14 {
    display: flex;
    align-items: center;
  }
}
/deep/ .el-table {
  tr {
    height: 80px;
  }
}
</style>
