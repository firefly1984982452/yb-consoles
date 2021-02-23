<template>
  <div class="bonus_list">
    <el-row class="warp">
      <el-form ref="searchForm" :model="searchForm" label-width="70px" class="search">
        <el-row type="flex" class="row-bg" :gutter="0">
          <el-col :xl="4" :lg="5">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="请选择" clearable>
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
            <!-- <el-button v-bind:style="{'background':thirdZhuTi,'color':'#fff'}" type="" @click="searchUser()"><i class="btniconfont iconjichutubiao-chaxun"></i>查询</el-button> -->
            <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
            </el-button>
            <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="content">
        <el-row class="btn-grounp-table" :gutter="0" style="background:#fff;border-radius:4px;margin-bottom:12px" type="flex">
          <el-col :span="24" id="btn-grounp">
            <el-row :gutter="0" class='clearfix' type="flex" justify="end">
              <el-col :xl="22" :lg="21">
                <!--<span>总分值：{{totalScore}} 分</span>-->
              </el-col>
              <el-col :xl="2" :lg="3">
                <el-button class="addBtn" style="margin: 0;" @click="flashData()"><i class="btn iconfont iconzuocedaohangtubiao-zhihuixiaofang-xitongzidianguanli"></i>生成补贴数据</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-table tooltip-effect="dark" ref="table" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
          <el-table-column prop="cp_type" label="序号" width="60" type="index">
            <!--<template slot-scope="scope">{{scope.row.cp_type | nothingFilter}}</template>-->
          </el-table-column>
          <el-table-column prop="cp_number" label="统计时效">
            <template slot-scope="scope">{{scope.row.startDate | timetypleFilter}} - {{scope.row.endDate | timetypleFilter}}</template>
          </el-table-column>
          <el-table-column prop="" label="补贴类型">
            <template slot-scope="scope">以奖代补</template>
          </el-table-column>
          <el-table-column prop="" label="内设医疗机构奖">
            <template slot-scope="scope">{{scope.row.medicalAmount}}</template>
          </el-table-column>
          <el-table-column prop="" label="招用持证人员奖">
            <template slot-scope="scope">{{scope.row.careAmount}}</template>
          </el-table-column>
          <el-table-column prop="brandAmount" label="品牌连锁经营奖">
            <!-- <template slot-scope="scope">--</template> -->
          </el-table-column>
          <el-table-column prop="amount" label="奖励合计">
            <!-- <template slot-scope="scope">{{scope.row.medicalAmount+scope.row.careAmount+scope.row.brandAmount}}</template> -->
          </el-table-column>
          <el-table-column prop="" label="生成时间">
            <template slot-scope="scope">{{scope.row.createTime}}</template>
          </el-table-column>
          <el-table-column prop="cp_status" label="状态">
            <template slot-scope="scope">{{scope.row.status | statusFilter}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                <el-button size="mini" class="lookta" @click="see(scope.row)" v-if="scope.row.status==3||scope.row.status==-1"><i class="btn iconfont iconcaozuotubiao-chakan"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="签收确认" placement="top-end">
                <el-button size="mini" class="lookta" @click="qs(scope.row)" v-if="scope.row.status==2"><i class="btn iconfont iconcaozuotubiao-qianshouqueren-xuanfu"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审核" placement="top-end">
                <el-button size="mini" class="lookta" @click="sh(scope.row)" v-if="scope.row.status==0"><i class="btn iconfont iconcaozuotubiao-shenhe"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="提交申请" placement="top-end">
                <el-button size="mini" class="lookta" @click="tjsh(scope.row)" v-if="scope.row.status==1"><i class="btn iconfont iconcaozuotubiao-tijiaoshenqing-xuanfu"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                <el-button size="mini" class="lookta" @click="del(scope.row)" v-if="scope.row.status==0"><i class="btn iconfont iconcaozuotubiao-shanchu-xuanfu"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </div>
    </el-row>

    <el-dialog :visible.sync="dialogFormVisible" width="25%" height="200" @close="closeDialog">
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
      statusList: [
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
      totalScore: 0,
      searchForm: {
        status: "",
        startDate: null,
        endDate: null,
        pageIndex: 1,
        pageSize: 10,
      },
      totalPage: 0,
      currentPage: 1,
      tableData: [],
      selectMonth: "1月",
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
      dialogFormVisible: false,
      dialogForm: {
        date: "",
      },
      rules: {
        date: [{ required: true, message: "日期不能为空" }],
      },
    };
  },
  created() {
    this.initData(this.searchForm);
  },
  methods: {
    // 查询表格数据
    initData(data) {
      axios.fetch("oaServer", "/subsidyOrgItem/all", data).then((res) => {
        console.log(res);
        if (res.data && res.data.length > 0) {
          this.tableData = res.data;
          this.totalPage = res.total;
        } else {
          this.tableData = [];
          this.totalPage = 0;
        }
      });
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
        this.searchForm.startDate = `${this.searchForm.startDate}-01`;
      }
      if (this.searchForm.endDate) {
        this.searchForm.endDate = this.$moment(this.searchForm.endDate)
          .endOf("month")
          .format("YYYY-MM-DD");
      }
      this.initData(this.searchForm);
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.initData(this.searchForm);
    },
    /**  */
    reset() {
      this.searchForm.status = "";
      this.searchForm.startDate = null;
      this.searchForm.endDate = null;
      this.searchForm.pageIndex = this.currentPage = 1;
      this.searchForm.pageSize = 10;
      this.initData(this.searchForm);
    },
    see(data) {
      this.$router.push({
        path: "bonuSubsidyList/bonuSubsidyDetail",
        query: { id: data.id, sign: "see" },
      });
    },
    qs(data) {
      this.$router.push({
        path: "bonuSubsidyList/bonuSubsidyDetail",
        query: { id: data.id, sign: "qs" },
      });
      s;
    },
    tjsh(data) {
      this.$router.push({
        path: "bonuSubsidyList/bonuSubsidyDetail",
        query: { id: data.id, sign: "tjsh" },
      });
    },
    sh(data) {
      this.$router.push({
        path: "bonuSubsidyList/bonuSubsidyDetail",
        query: { id: data.id, sign: "sh" },
      });
    },
    del(data) {
      let param = {
        id: data.id,
        status: -1,
      };
      this.$confirm("是否确认删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .fetch("oaServer", "/subsidyOrgItem/edit", param, "json")
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
    flashData() {
      this.dialogFormVisible = true;
    },
    // 生成
    monthSend(m) {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          axios
            .fetch("oaServer", "/subsidyOrgItem/report", {
              date: this.dialogForm.date,
            })
            .then((res) => {
              this.dialogFormVisible = false;
              this.initData();
            });
        }
      });
    },
    closeDialog() {
      this.$refs.dialogForm.resetFields();
      this.dialogFormVisible = false;
    },
  },
  filters: {
    //			0作废 1待审核 2已审核 3待申请 4已申请 5待签收 6已签收
    statusFilter: (val) => {
      if (val == -1) {
        val = "已作废";
      } else if (val == 0) {
        val = "待审核";
      } else if (val == 1) {
        val = "待提交";
      } else if (val == 2) {
        val = "待签收";
      } else if (val == 3) {
        val = "已签收";
      }
      //				0作废 1待审核 2已审核/待申请 3已提交/待签收 4已签收
      return val;
    },
    timetypleFilter: (val) => {
      val = val.substr(0, 4) + "/" + val.substr(5, 2) + "/" + val.substr(8, 2);
      //				0作废 1待审核 2已审核/待申请 3已提交/待签收 4已签收
      return val;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-table th.gutter {
  display: table-cell !important;
}
.bonus_list {
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