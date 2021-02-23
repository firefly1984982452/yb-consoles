<template>
  <div class="taskSetDialog">
    <el-dialog title="等级任务配置" :visible.sync="dialogTableVisible" center :before-close="handleDiaClose">
      <div class="title">
        <div class="left">
          <span>护理内容：<b>{{currentItem.itemTitle}}</b></span>
          <span>执行分类：<b>{{currentItem.targetType | targetTypeFilter}}</b>
          </span>
          <span>是否执行：<b>{{currentItem.schedulable | schedulableFilter }}</b>
          </span>
        </div>
        <div class="right">
        </div>
      </div>
      <el-form :rules="form.rules" :model="form" ref="form">
        <el-table :data="form.tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
          <el-table-column property="targetName" label="" width="80" align="center"></el-table-column>
          <el-table-column label="配置" width="60" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.available"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.timeType'" :rules='form.rules.timeType'>
                <el-select v-if="scope.row.available" @change="timeTypeChange(scope.row)" size="mini" v-model="scope.row.timeType" placeholder="请选择">
                  <el-option v-for="item in optionsPlanType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="次数" align="center">
            <template v-if="scope.row.available" slot-scope="scope">
              <span v-if="scope.row.timeType == 0">-</span>
              <el-form-item v-else :prop="'tableData.' + scope.$index + '.frequency'" :rules='form.rules.frequency'>
                <el-input v-model="scope.row.frequency" type="number"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" align="center">
            <template slot-scope="scope" v-if="scope.row.available">
              <span v-if="scope.row.timeType == 0">-</span>
              <el-form-item v-else-if="scope.row.timeType == 3" :prop="'tableData.' + scope.$index + '.timeStart1'" :rules='form.rules.timeStart1'>
                <el-time-picker style="width:100px" value-format="HH:mm" format="HH:mm" v-model="scope.row.timeStart1" placeholder="时间">
                </el-time-picker>
              </el-form-item>
              <el-form-item v-if="scope.row.timeType == 4" :prop="'tableData.' + scope.$index + '.timeStart2'" :rules='form.rules.timeStart2'>
                <el-select style="width:100px" size="mini" v-model="scope.row.timeStart2" placeholder="请选择">
                  <el-option v-for="item in optionsWeek" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="scope.row.timeType == 5" :prop="'tableData.' + scope.$index + '.timeStart3'" :rules='form.rules.timeStart3'>
                <el-select style="width:100px" size="mini" v-model="scope.row.timeStart3" placeholder="请选择">
                  <el-option v-for="item in optionsMonth" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center">
            <template v-if="scope.row.available" slot-scope="scope">
              <span v-if="scope.row.timeType == 0">-</span>
              <el-form-item v-else-if="scope.row.timeType == 3" :prop="'tableData.' + scope.$index + '.timeEnd1'" :rules='form.rules.timeEnd1'>
                <el-time-picker style="width:100px" value-format="HH:mm" format="HH:mm" v-model="scope.row.timeEnd1" placeholder="时间">
                </el-time-picker>
              </el-form-item>
              <el-form-item v-else-if="scope.row.timeType == 4" :prop="'tableData.' + scope.$index + '.timeEnd2'" :rules='form.rules.timeEnd2'>
                <el-select style="width:100px" size="mini" v-model="scope.row.timeEnd2" placeholder="请选择">
                  <el-option v-for="item in optionsWeek" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else-if="scope.row.timeType == 5" :prop="'tableData.' + scope.$index + '.timeEnd3'" :rules='form.rules.timeEnd3'>
                <el-select style="width:100px" size="mini" v-model="scope.row.timeEnd3" placeholder="请选择">
                  <el-option v-for="item in optionsMonth" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- <el-table-column label="任务间隔" align="center">
            <template v-if="scope.row.available" slot-scope="scope">
              <span v-if="scope.row.timeType == 0">-</span>
              <el-form-item v-else :prop="'tableData.' + scope.$index + '.taskInterval'" :rules='form.rules.taskInterval'>
                <el-input v-model="scope.row.taskInterval" type="number"></el-input>
              </el-form-item>
              <span v-if="scope.row.timeType ==3 " class="unit">小时</span>
              <span v-if="scope.row.timeType ==4||scope.row.timeType ==5" class="unit">天</span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="任务时长" align="center">
            <template v-if="scope.row.available" slot-scope="scope">
              <span v-if="scope.row.timeType == 0">-</span>
              <el-form-item v-else :prop="'tableData.' + scope.$index + '.taskDuration'" :rules='form.rules.taskDuration'>
                <el-input v-model="scope.row.taskDuration" type="number"></el-input>
              </el-form-item>
              <span class="unit" v-if="scope.row.timeType !== 0">小时</span>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form>
      <p style="color:red;line-height:44px;">
        <i class="el-icon-warning"></i>
        编辑任务模板后，任务计划不自动更新，如需更新现有的任务计划，请保存后点击”同步“按钮。
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDiaClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "TaskSetDialog",
  props: {
    currentItem: {
      type: Object,
      default: {},
    },
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: [
        {
          value: "0",
          label: "长者",
        },
        {
          value: "1",
          label: "房间",
        },
      ],
      optionsWeek: [
        {
          value: 0,
          label: "周日",
        },
        {
          value: 1,
          label: "周一",
        },
        {
          value: 2,
          label: "周二",
        },
        {
          value: 3,
          label: "周三",
        },
        {
          value: 4,
          label: "周四",
        },
        {
          value: 5,
          label: "周五",
        },
        {
          value: 6,
          label: "周六",
        },
      ],
      optionsMonth: [],
      // 类型选择
      optionsPlanType: [
        {
          value: 0,
          label: "无",
        },
        {
          value: 3,
          label: "每天",
        },
        {
          value: 4,
          label: "每周",
        },
        {
          value: 5,
          label: "每月",
        },
      ],
      form: {
        rules: {
          timeType: [{ required: true, message: "" }],
          frequency: [{ required: true, message: "" }],
          timeStart1: [{ required: true, message: "" }],
          timeStart2: [{ required: true, message: "" }],
          timeStart3: [{ required: true, message: "" }],
          timeEnd1: [{ required: true, message: "" }],
          timeEnd2: [{ required: true, message: "" }],
          timeEnd3: [{ required: true, message: "" }],
          taskInterval: [{ required: true, message: "" }],
          taskDuration: [{ required: true, message: "" }],
        },
        tableData: [],
      },
    };
  },
  components: {},
  watch: {
    dialogTableVisible(newValue, oldValue) {
      if (newValue) {
        this.taskSet(this.currentItem);
      }
    },
  },
  filters: {
    targetTypeFilter: function (value) {
      return value == 0 ? "按长者" : "按房间";
    },
    schedulableFilter: (value) => (value ? "是" : "否"),
  },
  created() {
    // this.getEaras();
    // this.getNurse();
    for (let index = 0; index < 31; index++) {
      this.optionsMonth.push({
        value: index + 1,
        label: `${index + 1}号`,
      });
    }
  },
  methods: {
    handleSave() {
      this.$refs["form"].validate((valid, model) => {
        if (valid) {
          if (this.form.tableData.length > 0) {
            const param = [];
            this.form.tableData.forEach((item, index) => {
              const obj = {};
              obj.id = item.id;
              obj.available = item.available;
              obj.taskDuration = Number(item.taskDuration) * 60;
              obj.serviceId = this.currentItem.serviceId;
              obj.frequency = item.frequency ? Number(item.frequency) : null;
              obj.targetName = item.targetName ? item.targetName : null;
              obj.targetValue = item.targetValue ? item.targetValue : null;
              obj.timeType = item.timeType;
              obj.taskInterval = item.taskInterval
                ? Number(item.taskInterval) * 60
                : null;
              if (item.timeType == 3) {
                obj.timeStart = item.timeStart1
                  ? Number(item.timeStart1.split(":").join(""))
                  : null;
                obj.timeEnd = item.timeEnd1
                  ? Number(item.timeEnd1.split(":").join(""))
                  : null;
                obj.taskDuration = item.taskDuration
                  ? Number(item.taskDuration) * 60
                  : null;
              } else if (item.timeType == 4) {
                obj.timeStart = item.timeStart2;
                obj.timeEnd = item.timeEnd2;
                obj.taskInterval = item.taskInterval
                  ? Number(item.taskInterval) * 24 * 60
                  : null;
              } else if (item.timeType == 5) {
                obj.timeStart = item.timeStart3;
                obj.timeEnd = item.timeEnd3;
                obj.taskInterval = item.taskInterval
                  ? Number(item.taskInterval) * 24 * 60
                  : null;
              }
              param.push(obj);
            });

            let valid1 = true;
            let valid2 = true;
            let valid3 = true;
            const arr = param.filter((item) => {
              return item.available === true;
            });
            arr.forEach((item) => {
              if (item.timeType !== 0) {
                switch (item.timeType) {
                  case 3: //每天
                    if (item.timeEnd <= item.timeStart) {
                      valid1 = false;
                    }
                    break;
                  case 4: // 每周
                    let time1 = item.timeStart;
                    let time2 = item.timeEnd;
                    if (time2 < time1) {
                      valid2 = false;
                    }
                    break;
                  case 5: //每月
                    if (item.timeEnd < item.timeStart) {
                      valid2 = false;
                    }
                    break;
                  default:
                    break;
                }
                if (!item.taskInterval || !item.frequency || item.frequency < 0) {
                  valid3 = false;
                }
              }
            });
            if (!valid1) {
              this.$message.warning("结束时间必须大于开始时间");
              return false;
            } else if (!valid2) {
              this.$message.warning("开始时间不能超过结束时间");
              return false;
            } else if (!valid3) {
              this.$message.warning("次数或任务时长不能小于等于0");
              return false;
            } else {
              axios
                .fetch("careServer", "/nursingSchedule/submit", param, "json")
                .then((res) => {
                  if (res.code == 200) {
                    this.$message.success("操作成功");
                    this.$emit("handleDiaClose");
                    this.$emit("refresh");
                  }
                });
            }
          } else {
            this.$message.warning("不能为空");
          }
        } else {
          this.$message.warning("请完善任务配置内容");
        }
      });
    },
    //
    timeTypeChange(data) {
      data.timeStart = null;
      data.timeEnd = null;
      data.frequency = 1;
      data.taskInterval = 1;
    },
    handleDiaClose() {
      this.$emit("handleDiaClose");
    },
    // 获取护理等级
    async getNurse() {
      const res = await axios.fetch(
        "commonServer",
        "/dict/getItemViewsByGroup",
        {
          groups: "院方护理等级",
        }
      );
      const arr = [];
      if (res.data.length > 0) {
        res.data.forEach((item) => {
          const obj = {};
          obj.targetName = item.itemNo;
          obj.targetValue = item.itemValue;
          obj.timeType = 3;
          obj.frequency = 1;
          obj.taskDuration = 1;
          obj.taskInterval = 1;
          obj.available = false;
          arr.push(obj);
        });
      }
      return arr;
    },
    // 获取全部区域
    async getEaras() {
      const res = await axios.fetch("oaServer", "/org/area/list");
      const arr = [];
      if (res.data.length > 0) {
        res.data.forEach((item) => {
          const obj = {};
          obj.targetName = item.areaName;
          obj.targetValue = item.areaId;
          obj.timeType = 3;
          obj.frequency = 1;
          obj.taskDuration = 1;
          obj.taskInterval = 1;
          obj.available = false;
          arr.push(obj);
        });
      }
      return arr;
    },
    // 处理护理任务模块的数据回显
    handleData(data) {
      data.forEach((item) => {
        if (item.available) {
          switch (Number(item.timeType)) {
            // 类型为每天
            case 3:
              let numberStart = 4 - item.timeStart.toString().length;
              let numberEnd = 4 - item.timeEnd.toString().length;
              // 补位
              let timeStart = "0".repeat(numberStart) + item.timeStart;
              let timeEnd = "0".repeat(numberEnd) + item.timeEnd;
              item.timeStart1 =
                timeStart == 0
                  ? "00:00"
                  : timeStart.toString().slice(0, 2) +
                  ":" +
                  timeStart.toString().slice(2);
              item.timeEnd1 =
                timeEnd == 0
                  ? "00:00"
                  : timeEnd.toString().slice(0, 2) +
                  ":" +
                  timeEnd.toString().slice(2);
              item.taskInterval = item.taskInterval / 60;
              item.taskDuration = item.taskDuration / 60;
              break;
            // 类型为每周
            case 4:
              item.timeStart2 = item.timeStart;
              item.timeEnd2 = item.timeEnd;
              item.taskInterval = item.taskInterval / 60 / 24;
              item.taskDuration = item.taskDuration / 60;
              break;
            // 类型为每月
            case 5:
              item.timeStart3 = item.timeStart;
              item.timeEnd3 = item.timeEnd;
              item.taskInterval = item.taskInterval / 60 / 24;
              item.taskDuration = item.taskDuration / 60;
              break;
            default:
              break;
          }
        } else {
          item.timeType = 3;
          item.frequency = 1;
          item.taskDuration = 1;
          item.taskInterval = 1;
          item.available = false;
        }
      });
    },
    // 处理回显数据
    taskSet(data) {
      // 按长者
      if (data.targetType == 0) {
        this.getNurse().then(async (res) => {
          console.log(res);
          const result = await axios.fetch(
            "careServer",
            "/nursingSchedule/query",
            {
              serviceId: data.serviceId,
            }
          );
          if (result.data.length > 0) {
            if (result.data.length === res.length) {
              // console.log('111111111111111');
              this.handleData(result.data);
              this.form.tableData = result.data;
            } else {
              // console.log('22222222222222222');
              res.forEach((item) => {
                result.data.forEach((o) => {
                  if (Number(item.targetValue) === Number(o.targetValue)) {
                    item = Object.assign(item, o);
                  }
                });
              });
              this.handleData(res);
              this.form.tableData = res;
            }
          } else {
            this.form.tableData = res;
          }
        });
      } else {
        // 按房间
        this.getEaras().then(async (res) => {
          console.log(res);
          const result = await axios.fetch(
            "careServer",
            "/nursingSchedule/query",
            {
              serviceId: data.serviceId,
            }
          );
          if (result.data.length > 0) {
            if (result.data.length === res.length) {
              this.handleData(result.data);
              this.form.tableData = result.data;
            } else {
              res.forEach((item) => {
                result.data.forEach((o) => {
                  if (Number(item.targetValue) === Number(o.targetValue)) {
                    item = Object.assign(item, o);
                  }
                });
              });
              this.handleData(res);
              this.form.tableData = res;
            }
          } else {
            this.form.tableData = res;
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    span + span {
      margin-left: 16px;
    }
  }
  .right {
    display: flex;
    align-items: center;
  }
}
/deep/ .el-table__body-wrapper {
  tr {
    height: 60px;
  }
  td {
    .cell {
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-input {
        flex: 1;
      }
      .el-form-item__error {
        display: none;
      }
      .el-form-item {
        margin: 0;
      }
      .unit {
        width: 60px;
        font-size: 12px;
        padding: 0 5px;
      }
    }
  }
}
</style>
