<template>
  <div>
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
            <el-date-picker :class="Number(currentWeek) > 3 ? 'week-picker' : ''" v-model="moreWeek" @change="changeMoreWeek" :picker-options="{ firstDayOfWeek: 1 }" type="month" format="yyyy-MM" value-format="yyyy-MM-01" placeholder="选择月">
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <table class="ub-table el-table table" border cellspacing="0" cellpadding="0" v-for="(item,index) in chefData" :key="index">
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
              <div v-else class="menu-content">
                <!-- 编辑和显示状态下的所有菜列表 -->
                <div v-if="!val.confirmBtn" class="tag-list">
                  <el-tag v-for="(w,point) in val.dietMenuNineVoListText" :key="point" closable :disable-transitions="false" @close="handleClose(w, scopeIndex, index)">
                    {{w}}
                  </el-tag>
                </div>
                <div v-else class="tag" v-for="(w,point) in val.dietMenuNineVoList" :key="point">
                  <div class="name">{{w.foodTitle}}（<span class="price">{{w.salePrice}}</span>元/例）</div>
                </div>

                <!-- 弹出框所有菜 -->
                <el-popover placement="bottom" width="700" :ref="`popover-${scopeIndex}-${index}`" trigger="click">
                  <!-- 菜 -->
                  <el-row :gutter="5" class="illDialog">
                    <i class="el-icon-close" @click="closeDialog(scopeIndex, index)"></i>
                    <el-checkbox-group v-model="
                      val.dietMenuNineVoListText
                    " :value-key="id">
                      <div class="dialog-menu">
                        <div class="box">
                          <div class="title">小锅菜：</div>
                          <div class="value">
                            <!-- {{allMenuList}} -->
                            <el-checkbox @change="
                            changeMenu(
                              item,
                              val.dietMenuNineVoListText,
                              scopeIndex,
                              index
                            )
                          " v-for="item in allMenuList" :key="item.id" :label="item.title+'（'+item.salePrice+'元/例）'"></el-checkbox>
                          </div>

                        </div>
                      </div>
                    </el-checkbox-group>
                  </el-row>

                  <!-- 按钮 -->
                  <div slot="reference" class="button-box" v-show="currentWeek == '0'">
                    <div class="add" v-if="
                      val
                        .dietMenuNineVoList.length == 0
                    ">
                      <el-button icon="el-icon-plus" @click="
                        editCurrentMenu(
                          val,
                          scopeIndex,
                          index
                        )
                      " circle></el-button>
                    </div>
                    <el-button v-else-if="
                      val
                        .dietMenuNineVoList.length > 0
                    " @click="
                      editCurrentMenu(
                        val,
                        scopeIndex,
                        index
                      )
                    " type="primary" icon="el-icon-edit" circle></el-button>
                  </div>
                </el-popover>
                <div class="button-box">
                  <el-button type="success" v-show="
                    !val
                      .confirmBtn &&
                      val
                        .dietMenuNineVoList.length !== 0
                  " icon="el-icon-check" @click="confirmCurrentMenu(scopeIndex, index)" circle></el-button>
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>

      <div class="buttons" v-show="currentWeek == '0'">
        <el-button type="warning" style="padding: 16px 46px!important;" @click="print()"><i class="iconfont iconcaozuotubiao-dayin"></i>&nbsp;&nbsp;打&nbsp;&nbsp;印</el-button>
        <el-button type="primary" style="padding: 16px 46px!important;" @click="save('save')"><i class="iconfont iconcaozuotubiao-baocun"></i>&nbsp;&nbsp;保&nbsp;&nbsp;存</el-button>
        <el-button type="success" style="padding: 16px 46px!important;" v-show="dietPeriodTypeList[0].status == 0" @click="confirmRelease"><i class="iconfont iconcaozuotubiao-pinggu"></i>&nbsp;&nbsp;确认发布</el-button>
      </div>
      <div class="buttons" v-show="currentWeek !== '0'">
        <el-button type="warning" style="padding: 16px 46px!important;" @click="print()"><i class="iconfont iconcaozuotubiao-dayin"></i>&nbsp;&nbsp;打&nbsp;&nbsp;印</el-button>
        <!-- <el-button type="primary" style="padding: 16px 26px!important;" @click="copyMenu"><i class="iconfont iconzuocedaohangtubiao-zhihuiyihu-yizhuguanli"></i>&nbsp;&nbsp;菜谱复制到下一月</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import ubEmployee from "@/components/employee";
import printMethods from "@/utils/print";
export default {
  components: { ubEmployee },
  data() {
    return {
      employeeData: "",
      currentWeek: "", // 当前按钮在第几月
      moreWeek: "",
      dietPeriodTypeList: [{ title: '' }, { title: '' }, { title: '' }, { title: '' }], // 所有月期列表
      allMenuList: [{ id: '', title: '', salePrice: 0 }], // 所有菜的列表,
      currentItem: {},
      chefData: [
        { dietMenuEightVoList: [{ periodDate: "", dietMenuNineVoList: [], dietMenuNineVoListText: [] }] }
      ] // 每月厨师列表
    };
  },
  created() {
    this.getAllMenuList();
  },
  mounted() {
    this.getDietPeriodList("0");
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
        path: "/print/elder/menuCook",
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
        forType: 12
      };
      axios.fetch("dietServer", "/dietFood/query", param).then(res => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.allMenuList = res.data;
            this.$set(this, 'allMenuList', this.allMenuList);
            this.$forceUpdate();
          });
        }
      });
    },
    // 点击月切换
    changeWeek(val) {
      this.moreWeek = "";
      if (this.dietPeriodTypeList[Number(val)].id === null) {
        return this.$message.error('此月并未配置小锅菜！');
      }
      if (this.dietPeriodTypeList[Number(val)]) {
        this.$nextTick(() => {
          this.$set(this, "currentWeek", val);
          this.$forceUpdate();
          this.getWeekMenuDetail(this.dietPeriodTypeList[Number(val)].id);
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
        console.log(index, this.moreWeek)
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

    // 复制厨师
    copyMenu() {
      this.$confirm("之前保存的下一月菜谱将被覆盖，请确认。", "提示", {
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
    confirmCurrentMenu(i, index) {
      this.chefData[index].dietMenuEightVoList[i].confirmBtn = true;
    },

    // 编辑某天的某个菜谱
    editCurrentMenu(val, i, index) {
      this.$nextTick(() => {
        this.chefData[index].dietMenuEightVoList[i].confirmBtn = false;
        this.$forceUpdate();
      })
    },
    // 删除小标签菜谱
    handleClose(val, i, index) {
      let i1 = this.chefData[index].dietMenuEightVoList[
        i
      ].dietMenuNineVoList.findIndex(item => val.includes(item.foodTitle));
      this.chefData[index].dietMenuEightVoList[i].dietMenuNineVoList.splice(i1, 1);
      this.chefData[index].dietMenuEightVoList[i].dietMenuNineVoListText.splice(i1, 1);
    },

    // 获取所有月期列表
    getDietPeriodList(indexNumber) {
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
          this.changeWeek(indexNumber);
        }
      });
    },

    // 获取某月的详细菜谱
    getWeekMenuDetail(id) {
      axios
        .fetch("dietServer", "/dietMenu/query/smallPotDish", { periodId: id })
        .then(res => {
          if (res.code == 200) {
            this.chefData = res.data.map(val => {
              val.dietMenuEightVoList = !val.dietMenuEightVoList ? [] : val.dietMenuEightVoList.map(
                (v, index) => {
                  v.periodDateText = v.periodDate.substr(5);
                  v.dietMenuNineVoList = !v.dietMenuNineVoList ? [] : v.dietMenuNineVoList;
                  v.dietMenuNineVoListText = !v.dietMenuNineVoList
                    ? []
                    : v.dietMenuNineVoList.map(t => t.foodTitle + '（' + t.salePrice + '元/例）');
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
    changeMenu(item, val, i, index) {
      let list = this.chefData[index].dietMenuEightVoList[i].dietMenuNineVoList;
      list ? list : (list = []);
      let menuIndex = list.findIndex(val => val.foodTitle == item.title);
      console.log(list, item, menuIndex)
      if (menuIndex === -1) {
        let tempData = {
          periodDate: this.chefData[index].dietMenuEightVoList[i].periodDate,
          periodId: this.chefData[index].dietMenuEightVoList[i].periodId,
          foodId: item.id,
          foodTitle: item.title,
          categoryId: this.chefData[index].categoryId,
          salePrice: item.salePrice
        };
        console.log(tempData)
        list.push(tempData);
      } else {
        list.splice(menuIndex, 1);
      }
    },
    // 保存菜谱
    save(type) {
      let url = type === "release" ? "/dietMenu/issue/smallPotDish" : "/dietMenu/submit/smallPotDish";

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
            let has = val.dietMenuEightVoList.some(v => v.confirmBtn === false);
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
/deep/ .el-table {
  table-layout: fixed;
  border: none;
  tr {
    height: 55px;
    border: none;
  }
}
/deep/ .el-checkbox-group {
  font-size: 14px !important;
}
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
  .tag {
    width: 85%;
    display: block;
    margin: 0 0 0 10px;
    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      display: block;
      .price {
        color: #f00;
      }
    }
  }
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 0 20px;
    .el-tag {
      margin: 0 5px 5px 0;
    }
  }
  .button-box {
    position: absolute;
    bottom: 0;
    right: 0;
    .add {
      margin-right: 120px;
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
</style>
