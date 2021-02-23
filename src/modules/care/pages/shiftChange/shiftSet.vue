<template>
  <!-- 交班设置界面 -->
  <div class="shift_set">
    <div class="header">
      <el-button class="back-btn" @click="$router.go(-1)">
        返回
      </el-button>
    </div>
    <div class="content">
      <div class="top">
        <span>交班设置</span>
        <el-button type="primary" @click="add">新增</el-button>
      </div>
      <p style="line-height:32px;backgroundColor:#F2F6FC;color:#909399;font-size:14px;padding:0 10px;margin-top:10px;">
        提示：如查房计划与交班时间点配置不一致，在生成交班报告时，仅统计查房任务结束时间包含在交班时段内的记录；例如：查房规则为5点起每3小时一次，即 5:00~8:00，8:00~11:00，11:00~14:00……，交班班次时段为【A班次】6:00~12:00，【B班次】12:00~18:00，对【A班次】交班时，系统仅会将 5:00~8:00，8:00~11:00 这两个查房任务内的记录生成到本次交班报告。11:00~14:00这个时段内的记录将记录到【B班次】中。
      </p>
      <el-table :data="tableData" :span-method="cellMerge" border style="width: 100%; margin-top: 20px" class="ub-table">
        <el-table-column prop="areaName" label="区域"></el-table-column>
        <el-table-column label="班次时间段" prop="timeName">
          <template slot-scope="scope">
            {{scope.row.timeName}} {{scope.row.timeStart | filterTime}} - {{scope.row.timeEnd | filterTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button size="mini" @click="handle(scope.row,'edit')" icon="iconfont iconcaozuotubiao-bianji"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
              <el-button size="mini" @click="handle(scope.row,'delete')" icon="iconfont iconcaozuotubiao-shanchu-xuanfu"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog center title="交班设置新增/编辑" :visible.sync="dialogTaskVisible" width="40%" @close="closePage">
      <el-form :inline="true" :rules="rules" label-width="90px" :model="addInfo" ref='addInfo'>
        <el-form-item label="护理区域">
          <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
        </el-form-item>
        <el-form-item label="班次设置">
          <el-form-item label-width="70px" label="班名" prop="timeName">
            <el-input v-model.trim="addInfo.timeName" placeholder="如日班、夜班" maxlength="5" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label-width="90px" label="时间段">
            <el-form-item prop="timeStart">
              <el-select v-model="addInfo.timeStart" clearable placeholder="请选择" @change="changeTime" value-key="value">
                <el-option v-for="(item,index) in timeList" :key="index" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
            至&nbsp;&nbsp;
            <el-form-item prop="timeEnd">
              <el-select v-model="addInfo.timeEnd" clearable placeholder="请选择" value-key="value">
                <el-option v-for="(item,index) in timeListEnd" :key="index" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </el-form-item>
        <div class="buttons" style="text-align:center;">
          <el-button type="primary" @click="submitApply">保存</el-button>
          <el-button @click="closePage">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
var that;
export default {
  name: "ShiftSet",
  data() {
    return {
      tableData: [],
      spanArr: [],
      contentSpanArr: [],
      pos: "",
      addInfo: {
        areaId: "",
        areaName: "",
        timeStart: "",
        timeEnd: "",
        timeName: "",
      },
      setArea: "",
      dialogTaskVisible: false,
      detailInfo: {},
      rules: {
        timeName: [
          {
            required: true,
            trigger: "blur",
            message: "请填写班名",
          },
        ],
        timeStart: [
          {
            required: true,
            trigger: "change",
            message: "请选择开始时间",
          },
        ],
        timeEnd: [
          {
            required: true,
            trigger: "change",
            message: "请选择结束时间",
          },
        ],
      },
    };
  },
  components: {},
  watch: {
    dialogTaskVisible() {
      if (this.$refs["addInfo"] != undefined) {
        this.$refs["addInfo"].clearValidate();
      }
    },
  },
  created() {
    this.getTableData();
    this.timeList = this.$constant.timeList.slice(0, 24);
  },
  methods: {
    getTableData() {
      axios.fetch("careServer", "/carePatrolWork/all").then((res) => {
        this.tableData = res.data;
        this.getSpanArr();
      });
    },
    //获取spanArr
    getSpanArr() {
      let data = this.tableData;
      this.spanArr = [];
      this.contentSpanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
          this.contentSpanArr.push(1);
          this.position = 0;
        } else {
          // 判断当前元素与上一个元素是否相同(第1和第2列)
          if (data[i].areaId === data[i - 1].areaId) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
      console.log(this.spanArr);
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    handle(data, type) {
      // console.log(data);
      // console.log(type);
      let param = {};
      if (type == "edit") {
        this.dialogTaskVisible = true;
        let { areaId, areaName, id } = data;
        this.addInfo = {
          id,
          areaId,
          areaName,
          timeName: data.timeName,
          timeStart: this.$constant.timeList[data.timeStart],
          timeEnd: this.$constant.timeList[data.timeEnd],
        };
        let area = { text: data.areaName, value: data.areaId };
        this.setArea = area;
        this.changeTime();
      } else if (type == "delete") {
        param = {
          enabled: false,
          id: data.id,
        };
        this.$confirm("是否需要删除该班次?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            axios
              .fetch("careServer", "/carePatrolWork/edit", param, "json")
              .then((res) => {
                this.getTableData();
                this.$message({
                  type: "success",
                  message: "删除成功",
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    getArea(val) {
      this.addInfo.areaId = val.value;
      this.addInfo.areaName = val.text;
      let area = { text: val.text, value: val.value };
      this.setArea = area;
    },
    changeTime() {
      var index = this.addInfo.timeStart.value;
      this.timeListEnd = this.$constant.timeList.slice(index + 1, index + 25);
    },
    submitApply() {
      var { areaId, areaName, id } = this.addInfo;
      if (!areaId) {
        return this.$message.error("请选择护理区域！");
      }
      this.$refs.addInfo.validate((valid) => {
        if (valid) {
          const param = {
            id: this.addInfo.id,
            areaId: this.addInfo.areaId,
            areaName: this.addInfo.areaName,
            timeName: this.addInfo.timeName,
            timeEnd: this.addInfo.timeEnd.value,
            timeStart: this.addInfo.timeStart.value,
          };
          console.log(param);
          const api = this.addInfo.id
            ? "/carePatrolWork/edit"
            : "/carePatrolWork/add";
          const message = this.addInfo.id ? "修改成功" : "添加成功";
          axios.fetch("careServer", api, param, "json").then((res) => {
            this.closePage();
            this.dialogTaskVisible = false;
            this.getTableData();
            this.$message({
              type: "success",
              message: message,
            });
          });
        } else {
        }
      });
    },
    closePage() {
      this.dialogTaskVisible = false;
      this.resetForm();
    },
    // 添加
    add() {
      this.resetForm();
      this.dialogTaskVisible = true;
    },
    resetForm() {
      if (this.$refs.areaCom !== undefined) {
        this.$refs.areaCom.resetArea();
        let area = { text: "", value: "" };
        this.setArea = area;
      }
      this.addInfo = {
        areaId: "",
        areaName: "",
        timeStart: "",
        timeEnd: "",
        timeNanme: "",
      };
    },
  },
  beforeCreate() {
    that = this;
  },
  filters: {
    filterTime(val) {
      let index = that.$constant.timeList.findIndex(
        (item) => item.value == val
      );
      if (index !== -1) {
        return that.$constant.timeList[index].name;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.shift_set {
  //   padding: 10px;
  display: flex;
  flex-direction: column;
  .header {
    height: 56px;
    padding-left: 15px;
    background-color: #fff;
    display: flex;
    align-items: center;
  }
  .content {
    margin-top: 20px;
    flex: 1;
    background-color: #fff;
    padding: 15px;
    .top {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .el-form-item {
    display: flex;
    /deep/ .el-form-item__content {
      display: flex;
    }
  }
  /deep/ .el-dialog {
    top: 40% !important;
  }
}
</style>
