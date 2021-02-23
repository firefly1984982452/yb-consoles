<template>
  <div>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="14">
          <span>快捷选择</span>
          <el-button :type="currentWeek == '0' ? 'primary' : ''" @click="changeWeek('0')">下一周<br /><br />{{ weekOptionsList[0].MondayText }} ~
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
          " v-for="(week, point) in chefData[0].dietCookOneVoList" :key="point">
          <template slot-scope="scope">
            <div class="menu-content">
              <div v-if="
                  !chefData[scope.$index].dietCookOneVoList[point].confirmBtn
                " class="tag-list">
                <el-tag :key="tag" v-for="tag in chefData[scope.$index].dietCookOneVoList[point]
                    .dietCookList" closable :disable-transitions="false" @close="handleClose(tag, scope.$index, point)">
                  <span class="name">{{ tag.cookName }}</span>
                </el-tag>
                <ub-employee style="width: 40%" ref="employee" v-show="
                    chefData[scope.$index].dietCookOneVoList[point].dietCookList
                      .length < 2
                  " v-model="employeeData" @change="
                    item =>
                      changeMenu(
                        item,
                        chefData[scope.$index].dietCookOneVoList[point]
                          .dietCookList,
                        scope.$index,
                        point
                      )
                  " clearable></ub-employee>
              </div>
              <div v-else class="tag-list-text">
                <div class="tag" :key="tag" v-for="tag in chefData[scope.$index].dietCookOneVoList[point]
                    .dietCookList">
                  <span class="name">{{ tag.cookName }}</span>
                </div>
              </div>
              <div slot="reference" class="button-box" v-if="currentWeek == '0'">
                <div class="add" v-if="
                    chefData[scope.$index].dietCookOneVoList[point].dietCookList
                      .length == 0
                  ">
                  <el-button v-if="
                      chefData[scope.$index].dietCookOneVoList[point].confirmBtn
                    " icon="el-icon-plus" @click="
                      editCurrentMenu(
                        chefData[scope.$index].dietCookOneVoList[point],
                        scope.$index,
                        point
                      )
                    " circle></el-button>
                </div>
                <el-button v-else-if="
                    chefData[scope.$index].dietCookOneVoList[point].dietCookList
                      .length <= 2
                  " @click="
                    editCurrentMenu(
                      chefData[scope.$index].dietCookOneVoList[point],
                      scope.$index,
                      point
                    )
                  " type="primary" icon="el-icon-edit" circle></el-button>
              </div>
              <div class="button-box">
                <el-button type="success" v-show="
                    !chefData[scope.$index].dietCookOneVoList[point]
                      .confirmBtn &&
                      chefData[scope.$index].dietCookOneVoList[point]
                        .dietCookList.length < 3
                  " icon="el-icon-check" @click="confirmCurrentMenu(scope.$index, point)" circle></el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="buttons" v-show="currentWeek == '0'">
        <el-button type="primary" style="padding: 16px 46px!important;" @click="save"><i class="iconfont iconcaozuotubiao-baocun"></i>&nbsp;&nbsp;保&nbsp;&nbsp;存</el-button>
      </div>
      <div class="buttons" v-show="currentWeek !== '0'">
        <el-button type="primary" style="padding: 16px 26px!important;" @click="copyMenu"><i class="iconfont iconzuocedaohangtubiao-zhihuiyihu-yizhuguanli"></i>&nbsp;&nbsp;厨师名单复制到下一周</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { weDateFormat } from "@/utils/utils.js";
import ubEmployee from "@/components/employee";
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
      chefData: [{ dietCookOneVoList: [{ periodDate: "", dietCookList: [] }] }] // 每周厨师列表
    };
  },
  mounted() {
    this.getDietPeriodList("0");
  },
  methods: {
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
      this.$confirm("之前保存的下一周厨师名单将被覆盖，请确认。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .fetch("dietServer", "/dietCook/copy/toNextWeek", {
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
      this.chefData[index].dietCookOneVoList[i].confirmBtn = true;
    },

    // 编辑某天的某个菜谱
    editCurrentMenu(val, index, i) {
      this.chefData[index].dietCookOneVoList[i].confirmBtn = false;
      this.$forceUpdate();
    },
    // 删除小标签菜谱
    handleClose(val, index, i) {
      let i1 = this.chefData[index].dietCookOneVoList[i].dietCookList.findIndex(
        item => item == val.cookName
      );
      this.chefData[index].dietCookOneVoList[i].dietCookList.splice(i1, 1);
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
        .fetch("dietServer", "/dietCook/get/byPeriodId", { periodId: id })
        .then(res => {
          if (res.code == 200) {
            this.chefData = res.data.map(val => {
              val.dietCookOneVoList = val.dietCookOneVoList.map((v, index) => {
                v.weekText = ["一", "二", "三", "四", "五", "六", "日"][index];
                v.dietCookList = !v.dietCookList ? [] : v.dietCookList;
                v.confirmBtn = true;
                return v;
              });
              return val;
            });
          }
        });
    },
    // 选择单个厨师后的点击事件
    changeMenu(item, val, index, i) {
      let list = this.chefData[index].dietCookOneVoList[i].dietCookList;
      list ? list : (list = []);
      if (list.findIndex(val => val.employeeId === item.itemValue) === -1) {
        let tempData = {
          periodDate: this.chefData[index].dietCookOneVoList[i].periodDate,
          periodId: this.chefData[index].dietCookOneVoList[i].periodId,
          employeeId: item.itemValue,
          cookName: item.itemName,
          categoryId: this.chefData[index].categoryId
        };
        list.push(tempData);
      } else {
        let menuIndex = list.findIndex(val => val.cookName == item.itemName);
        list.splice(menuIndex, 1);
      }
      this.$nextTick(() => {
        this.employeeData = "";
      });
    },
    // 保存菜谱
    save() {
      axios
        .fetch("dietServer", "/dietCook/submit", this.chefData, "json")
        .then(res => {
          if (res.code == 200) {
            this.changeWeek("0");
          }
        });
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
