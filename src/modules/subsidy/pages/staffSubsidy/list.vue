<template>
  <div class="staff_subsidy">
    <el-row class="warp">
      <el-form ref="searchForm" class="search" :model="searchForm" label-width="60px">
        <el-row type="flex" class="row-bg" :gutter="0">
          <el-col :xl="4" :lg="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择" clearable>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="7" :lg="8">
            <el-form-item label="统计时效" label-width="5em">
              <el-date-picker v-model="searchForm.startDate" type="month" format="yyyy年MM月" value-format="yyyy-MM" placeholder="开始月份" clearable></el-date-picker>
              <el-date-picker v-model="searchForm.endDate" type="month" format="yyyy年MM月" value-format="yyyy-MM" placeholder="结束月份" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="searchBtns">
            <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
            </el-button>
            <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="content">
        <el-row class="btn-grounp-table" :gutter="0" type="flex" style="background:#fff;border-radius:4px;margin-bottom:12px">
          <el-col :span="24" id="btn-grounp">
            <el-row :gutter="0" class="clearfix" type="flex" justify="end">
              <el-col :span="20">
                <!--<span>总分值：{{totalScore}} 分</span>-->
              </el-col>
              <el-col :xl="2" :lg="3">
                <el-button class="addBtn" style="margin: 0;" @click="flashData()">
                  <i class="btn iconfont iconzuocedaohangtubiao-zhihuixiaofang-xitongzidianguanli"></i>生成补贴数据
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-table tooltip-effect="dark" :data="tableData" :summary-method="getSummaries" show-summary :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
          <el-table-column label="序号" width="60">
            <template slot-scope="scope">{{(scope.$index + 1) | indexsFilter}}</template>
          </el-table-column>
          <el-table-column label="月份" min-width="80">
            <template slot-scope="scope">{{scope.row.startDate | timeSliceFilter}}</template>
          </el-table-column>
          <el-table-column label="按100%标准发放">
            <el-table-column prop="countFull" label="人数" min-width="80">
              <template slot-scope="scope">{{scope.row.countFull}}</template>
            </el-table-column>
            <el-table-column prop="amountFull" label="总金额" min-width="80">
              <template slot-scope="scope">¥{{scope.row.amountFull}}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="按50%标准发放">
            <el-table-column prop="countHalf" label="人数" min-width="80">
              <template slot-scope="scope">{{scope.row.countHalf}}</template>
            </el-table-column>
            <el-table-column prop="amountHalf" label="总金额" min-width="80">
              <template slot-scope="scope">¥{{scope.row.amountHalf}}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="合计">
            <el-table-column label="人数" prop="peopleNumSum" min-width="80">
              <template slot-scope="scope">{{scope.row.peopleNumSum}}</template>
            </el-table-column>
            <el-table-column label="总金额" prop="amountNumSum" min-width="80">
              <template slot-scope="scope">¥{{scope.row.amountNumSum}}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="createTime" label="生成时间" min-width="140">
            <template slot-scope="scope">{{ scope.row.createTime | nothingFilter }}</template>
          </el-table-column>
          <!--<el-table-column prop="sesCreator" label="操作人" min-width="140">
            <template slot-scope="scope">{{ scope.row.sesCreator | nothingFilter }}</template>
          </el-table-column>-->
          <el-table-column prop="status" label="状态" min-width="60">
            <template slot-scope="scope">{{scope.row.status | statusFilter}}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="100%">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-end" v-if="scope.row.status == 3 || scope.row.status == -1">
                <el-button size="mini" class="lookta" @click="see(scope.row)">
                  <i class="btn iconfont iconcaozuotubiao-chakan"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="签收确认" placement="top-end" v-if="scope.row.status == 2">
                <el-button size="mini" class="lookta" @click="qs(scope.row)">
                  <i class="btn iconfont iconcaozuotubiao-qianshouqueren-xuanfu"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核" placement="top-end" v-if="scope.row.status == 0">
                <el-button size="mini" class="lookta" @click="sh(scope.row)">
                  <i class="btn iconfont iconcaozuotubiao-shenhe"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="提交申请" placement="top-end" v-if="scope.row.status == 1">
                <el-button size="mini" class="lookta" @click="tjsh(scope.row)">
                  <i class="btn iconfont iconcaozuotubiao-tijiaoshenqing-xuanfu"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-end" v-if="scope.row.status == 0">
                <el-button size="mini" class="lookta" @click="del(scope.row)">
                  <i class="btn iconfont iconcaozuotubiao-shanchu-xuanfu"></i>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="btn-grounp-table" :gutter="0" type="flex">
          <el-col :span="24" id="btn-grounp">
            <el-row :gutter="0" class="clearfix">
              <el-col :span="22">
                <span style="color: transparent;">1</span>
                <!--<span>总分值：{{totalScore}} 分</span>-->
              </el-col>
              <el-col v-if="tableData.length > 0" :span="2">
                <el-button class="addBtn" style="background: rgb(246, 129, 43);width: 100%;position: relative;top: -42px;right:20px;" @click="seeAllData()">
                  累计查看
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-row>
    <el-dialog :visible.sync="dialogFormVisible" @close="closeDialog" width="25%" height="200">
      <el-row class="warp userList" id="userLists">
        <el-col style="margin-top:20px;">
          <el-form label-width="120px" :rules="rules" ref="dialogForm" :model="dialogForm">
            <el-form-item label="请选择日期" prop="date">
              <el-date-picker v-model="dialogForm.date" value-format="yyyy-MM" type="month" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-row style="text-align:center;margin: 20px 0px 20px;" :gutter="0">
              <el-form-item label="">
                <el-col class :span="7">
                  <el-button type="primary" plain @click="monthSend(selectMonth)">确定</el-button>
                </el-col>
                <el-col class :span="7" style="margin-left: 10px;">
                  <el-button @click="closeDialog">关闭</el-button>
                </el-col>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      todayYear: "",
      statusOptions: [
        {
          value: 0,
          label: "待审核",
        },
        {
          value: 1,
          label: "待提交",
        },
        {
          value: 2,
          label: "待签收",
        },
        {
          value: 3,
          label: "已签收",
        },
      ],
      searchForm: {
        status: "",
        startDate: "",
        endDate: "",
      },
      tableData: [],
      dialogFormVisible: false,
      dialogForm: {
        date: "",
      },
      rules: {
        date: [{ required: true, message: "日期不能为空", trigger: "change" }],
      },
      option: [
        {
          value: "01",
          label: "1月",
        },
        {
          value: "02",
          label: "2月",
        },
        {
          value: "03",
          label: "3月",
        },
        {
          value: "04",
          label: "4月",
        },
        {
          value: "05",
          label: "5月",
        },
        {
          value: "06",
          label: "6月",
        },
        {
          value: "07",
          label: "7月",
        },
        {
          value: "08",
          label: "8月",
        },
        {
          value: "09",
          label: "9月",
        },
        {
          value: "10",
          label: "10月",
        },
        {
          value: "11",
          label: "11月",
        },
        {
          value: "12",
          label: "12月",
        },
      ],
      sign: "",
      tempStartDate: "",
      tempEndDate: "",
    };
  },
  created() {
    this.initData(this.searchForm);
  },
  methods: {
    // 生成
    monthSend(m) {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          axios
            .fetch("oaServer", "/subsidyEmployeeItem/report", {
              date: this.dialogForm.date,
            })
            .then((res) => {
              this.dialogFormVisible = false;
              this.initData();
            });
        }
      });
    },
    seeAllData() {
      if (this.tableData.length > 0) {
        var arr = [];
        //debugger;
        for (var i = 0; i < this.tableData.length; i++) {
          arr.push(this.tableData[i].id);
        }
        arr = arr.join(",");
        console.log(arr);
        this.$router.push({
          path: "subsidyList/subsidyDetail",
          query: {
            id: arr,
            sign: "see",
            all: 1,
            startDate: this.tempStartDate,
            endDate: this.tempEndDate,
          },
        });
      } else {
        this.$message.warning("暂无数据可查看的数据");
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // console.log(column);
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        // console.log(values);
        // console.log(column.property);
        if (
          index != 1 &&
          index != 8 &&
          index != 9 &&
          index != 10 &&
          index != 11
        ) {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = "N/A";
          }
        }
      });
      return sums;
    },
    // 搜索事件
    searchInfo() {
      if (this.searchForm.startDate && !this.searchForm.endDate) {
        this.$message.warning("请选择结束时间");
        return false;
      }
      if (!this.searchForm.startDate && this.searchForm.endDate) {
        this.$message.warning("请选择开始时间");
        return false;
      }
      if (this.searchForm.startDate && this.searchForm.endDate) {
        if (
          this.$moment(this.searchForm.startDate).valueOf() >
          this.$moment(this.searchForm.endDate).valueOf()
        ) {
          this.$message.warning("开始时间不能超过结束时间");
          return false;
        }
      }
      if (this.searchForm.startDate) {
        this.searchForm.startDate = this.$moment(this.searchForm.startDate)
          .startOf("month")
          .format("YYYY-MM-DD");
      }
      if (this.searchForm.endDate) {
        this.searchForm.endDate = this.$moment(this.searchForm.endDate)
          .endOf("month")
          .format("YYYY-MM-DD");
      }
      this.initData(this.searchForm);
    },
    /**  */
    reset() {
      this.searchForm.status = "";
      this.searchForm.startDate = null;
      this.searchForm.endDate = null;
      // this.$refs.searchForm.resetFields();
      this.initData(this.searchForm);
    },
    initData(data) {
      axios.fetch("oaServer", "/subsidyEmployeeItem/all", data).then((res) => {
        console.log(res);
        if (res.data && res.data.length > 0) {
          this.tableData = res.data.map((item) => {
            item.peopleNumSum = item.countHalf + item.countFull;
            item.amountNumSum = item.amountHalf + item.amountFull;
            return item;
          });
        } else {
          this.tableData = [];
        }
        this.tempStartDate = this.searchForm.startDate;
        this.tempEndDate = this.searchForm.endDate;
      });
    },
    see(data) {
      this.$router.push({
        path: "subsidyList/subsidyDetail",
        query: {
          id: data.id,
          sign: "see",
        },
      });
    },
    sh(data) {
      this.$router.push({
        path: "subsidyList/subsidyDetail",
        query: {
          id: data.id,
          sign: "sh",
        },
      });
    },
    qs(data) {
      this.$router.push({
        path: "subsidyList/subsidyDetail",
        query: {
          id: data.id,
          sign: "qs",
        },
      });
    },
    tjsh(data) {
      this.$router.push({
        path: "subsidyList/subsidyDetail",
        query: {
          id: data.id,
          sign: "tjsh",
        },
      });
    },
    del(data) {
      let param = {
        id: data.id,
        status: -1,
      };
      this.$confirm("是否确认删除该补贴明细?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .fetch("oaServer", "/subsidyEmployeeItem/edit", param, "json")
            .then((res) => {
              this.$message.success(res.data);
              this.initData(this.searchForm);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addUser() {
      this.$router.push({
        path: "subsidyList/subsidyDetail",
      });
    },
    flashData() {
      // this.dialogForm.date = "";
      this.dialogFormVisible = true;
    },
    closeDialog() {
      this.$refs.dialogForm.resetFields();
      this.dialogFormVisible = false;
    },
  },
  filters: {
    indexsFilter: (val) => {
      if (val < 10) {
        val = "0" + val;
      } else {
        return val;
      }
      return val;
    },
    timeSliceFilter: (val) => {
      // return val.substr(0, 7);
      return val.substr(0, 4) + "年" + val.substr(5, 2) + "月";
    },
    statusFilter: (val) => {
      if (val === 0) {
        val = "待审核";
      } else if (val == 1) {
        val = "待提交";
      } else if (val == 2) {
        val = "待签收";
      } else if (val == 3) {
        val = "已签收";
      } else if (val == -1) {
        val = "已作废";
      }
      //状态：0待审核，1待提交，2待签收，3已签收，-1已作废
      return val;
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-table th.gutter {
  display: table-cell !important;
}
.staff_subsidy {
  .addBtn {
    background: #6cbc6c;
    color: #fff;
    background: rgb(63, 81, 181);
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    i {
      margin-right: 5px;
    }
  }
}
</style>