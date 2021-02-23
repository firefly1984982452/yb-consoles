<template>
  <div class="SubsidysetUpList">
    <el-form :inline="true" class="search">
      <el-col :xl="4" :lg="5">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option :label="item.label" :value="item.value" v-for="item in statusList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xl="7" :lg="8">
        <el-form-item label="统计时效" label-width="5em">
          <el-date-picker v-model="searchForm.startDate" type="month" format="yyyy年MM月" value-format="yyyy-MM" placeholder="开始月份" clearable></el-date-picker>
          <el-date-picker v-model="searchForm.endDate" type="month" format="yyyy年MM月" value-format="yyyy-MM" placeholder="结束月份" clearable></el-date-picker>
        </el-form-item>
      </el-col>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row style="background:#fff;border-radius:4px;line-height:64px;height:64px" :gutter="0" type="flex">
        <el-col :span="2">
          <el-button class="navBtn" type="text" @click="selectLive('staff', 0)" :class="{ active: colorBtn.staff == 1 }">
            <span class="btn-font-size">员工补贴&nbsp;<span v-if="colorBtn.staff == 1">({{ totalPage }})</span></span>
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="navBtn" type="text" @click="selectLive('org', 1)" :class="{ active: colorBtn.org == 1 }">
            <span class="btn-font-size">机构补贴&nbsp;<span v-if="colorBtn.org == 1">({{ totalPage }})</span></span>
          </el-button>
        </el-col>
        <el-col :span="20" id="btn-grounp">
          <el-row :gutter="0" class="clearfix" type="flex" justify="end">
            <el-button class="addBtn" style="margin-top: 10px;" @click="addSettings()"><i class="btn iconfont iconjichutubiao-tianjia-huise"></i>新建标准</el-button>
          </el-row>
        </el-col>
      </el-row>
      <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column label="序号" width="60" type="index"></el-table-column>
        <el-table-column label="补贴类型" prop="remark"></el-table-column>
        <el-table-column label="统计时效">
          <template slot-scope="scope">{{ $moment(scope.row.startDate).format("YYYY/MM/DD") }} -
            {{ $moment(scope.row.endDate).format("YYYY/MM/DD") }}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{
            scope.row.status | statusFilter
          }}</template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100%">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top-end" v-if="scope.row.status != 0">
              <el-button size="mini" class="lookta" @click="see(scope.row)"><i class="btn iconfont iconcaozuotubiao-chakan"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="审核" placement="top-end" v-if="scope.row.status == 0">
              <el-button size="mini" class="lookta" @click="sh(scope.row)"><i class="btn iconfont iconcaozuotubiao-shenhe"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end" v-if="scope.row.status == 0">
              <el-button size="mini" class="lookta" @click="del(scope.row)"><i class="btn iconfont iconcaozuotubiao-shanchu-xuanfu"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "SubsidysetUpList",
  data() {
    return {
      searchForm: {
        status: "",
        startDate: null,
        endDate: null,
        pageIndex: 1,
        pageSize: 10,
      },
      totalPage: 0,
      currentPage: 1,
      statusList: [
        {
          label: "待审核",
          value: 0,
        },
        {
          label: "已审核",
          value: 1,
        },
      ],
      tableData: [],
      //头部按钮色变和选择
      colorBtn: { staff: 1, org: 0 },
    };
  },
  components: {},
  // watch: {
  //   colorBtn: {
  //     handler(newName) {
  //       console.log(newName);
  //       this.initData();
  //     },
  //     deep: true,
  //   },
  // },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.query.type == "机构补贴" || from.query.tag == "org") {
        vm.colorBtn.org = 1;
        vm.colorBtn.staff = 0;
      } else {
        vm.colorBtn.org = 0;
        vm.colorBtn.staff = 1;
      }
      vm.initData(vm.searchForm);
    });
  },
  methods: {
    // 获取表格数据
    initData(data) {
      const api =
        this.colorBtn.staff === 1 ? "/subsidyEmployee/all" : "/subsidyOrg/all";
      //   const type = this.colorBtn.staff === 1 ? "员工补贴" : "机构补贴";
      axios.fetch("oaServer", api, data).then((res) => {
        console.log(res);
        if (res.data) {
          this.tableData = res.data;
          this.totalPage = res.total;
        }
      });
    },
    // 状态切换
    selectLive(type, status) {
      for (var key in this.colorBtn) {
        if (type == key) {
          this.colorBtn[key] = 1;
        } else {
          this.colorBtn[key] = 0;
        }
      }
      if (this.type !== type) {
        this.searchForm.pageIndex = 1;
        this.searchForm.status = "";
        this.totalPage = "";
        this.type = type;
        this.initData(this.searchForm);
      } else {
        console.log("不用重复请求");
      }
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
    // 添加按钮事件
    addSettings() {
      const tag = this.colorBtn.staff === 1 ? "employee" : "org";
      this.$router.push({
        path: "subsidysetUpList/subsidysetUpDetail",
        query: { sign: "add", tag },
      });
    },
    // 查看详情
    see(data) {
      const query = {
        id: data.id,
        sign: "see",
        type: data.remark,
        time: `${data.startDate}~${data.endDate}`,
      };
      this.$router.push({
        path: "subsidysetUpList/subsidysetUpDetail",
        query: query,
      });
    },
    // 审核
    sh(data) {
      const query = {
        id: data.id,
        sign: "sh",
        type: data.remark,
        time: `${data.startDate}~${data.endDate}`,
      };
      this.$router.push({
        path: "subsidysetUpList/subsidysetUpDetail",
        query: query,
      });
    },
    // 删除
    del(data) {
      this.$confirm("是否删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const api =
            data.remark == "员工补贴"
              ? "/subsidyEmployee/edit"
              : "/subsidyOrg/edit";
          axios
            .fetch(
              "oaServer",
              api,
              {
                id: data.id,
                status: -1,
              },
              "json"
            )
            .then((res) => {
              this.initData(this.searchForm);
              this.$message({
                type: "success",
                message: "操作成功!",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  filters: {
    statusFilter: (val) => {
      return val === 0 ? "待审核" : val === 1 ? "已审核" : "";
    },
  },
};
</script>

<style lang="less" scoped>
.navBtn {
  width: 90% !important;
}
.btn-font-size {
  font-size: 14px;
  font-weight: 500;
}
button.active {
  background: #4687e1 !important;
  color: #fff !important;
  border: 1px solid #4687e1 !important;
}
.addBtn {
  background: #6cbc6c;
  color: #fff;
  padding: 10px 10px;
  min-width: 95px;
  width: 100px;
  i {
    font-size: 12px;
    margin-right: 5px;
  }
}
</style>
