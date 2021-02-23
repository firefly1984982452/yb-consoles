<template>
  <!-- 预定房间list -->
  <div class="booking-room">
    <!-- 搜索区域 -->
    <el-form ref="searchForm" :inline="true" class="search" :model="searchForm" label-width="75px">
      <el-form-item label="老人姓名">
        <el-input v-model="searchForm.elderName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="房间号">
        <el-input v-model="searchForm.roomName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="预计入住日期" label-width="100px">
        <el-date-picker v-model="searchForm.startTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
        <el-date-picker v-model="searchForm.endTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-col style="background:#fff;border-radius:4px;line-height:44px;">
        <el-row class="button-grounp row-bg" :gutter="0" type="flex">
          <el-col :span="2">
            <el-button class="navBtn" type="text" @click="selectLive('all','')" :class="{'active':colorBtn.all==1}">
              <span class="btn-font-size">全部&nbsp;<span v-if="colorBtn.all==1">({{totalPage}})</span></span>
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button class="navBtn" type="text" @click="selectLive('dai',0)" :class="{'active':colorBtn.dai==1}">
              <span class="btn-font-size">待入住&nbsp;<span v-if="colorBtn.dai==1">({{totalPage}})</span></span>
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button class="navBtn" type="text" @click="selectLive('ban',1)" :class="{'active':colorBtn.ban==1}">
              <span class="btn-font-size">办理中&nbsp;<span v-if="colorBtn.ban==1">({{totalPage}})</span></span>
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button class="navBtn" type="text" @click="selectLive('haved',2)" :class="{'active':colorBtn.haved==1}">
              <span class="btn-font-size">已入住&nbsp;<span v-if="colorBtn.haved==1">({{totalPage}})</span></span>
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button class="navBtn" type="text" @click="selectLive('cancel',-1)" :class="{'active':colorBtn.cancel==1}">
              <span class="btn-font-size">已取消&nbsp;<span v-if="colorBtn.cancel==1">({{totalPage}})</span></span>
            </el-button>
          </el-col>
          <el-col :span="24" id="btn-grounp">
            <el-row :gutter="0" class='clearfix' type="flex" justify="end">
              <el-col :xl="3" :lg="4">
                <el-button class="addBtn" style="margin:0 0 18px 0;float: right;width: 100px" @click="addLive()"><i class="el-icon-plus"></i>添加预订</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-table :data="tableData" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column prop="bookNo" label="编号" width="150"></el-table-column>
        <el-table-column prop="elderName" label="老人姓名" min-width="70">
          <template slot-scope="scope">{{scope.row.elderName | nothingFilter}}</template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" min-width="50">
          <template slot-scope="scope">{{scope.row.gender | nothingFilter}}</template>
        </el-table-column>
        <el-table-column prop="health" label="健康状况" min-width="80">
          <template slot-scope="scope">{{scope.row.health | nothingFilter}}</template>
        </el-table-column>
        <el-table-column label="房间床位" min-width="60">
          <template slot-scope="scope">{{scope.row.roomName}}-{{scope.row.bedName}}</template>
        </el-table-column>
        <el-table-column prop="bookDate" label="预计入住日期" min-width="100">
          <template slot-scope="scope">{{scope.row.bookDate | nothingFilter}}</template>
        </el-table-column>
        <el-table-column prop="creatorName" label="接待人" min-width="80"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="60">
          <template slot-scope="scope">{{scope.row.status | statusFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100%">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
              <i @click="see(scope.row)" class="iconfont iconcaozuotubiao-chakan"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <i @click="repair(scope.row)" v-show="scope.row.status == 1 || scope.row.status == 0" class="iconfont iconcaozuotubiao-bianji" style="margin-left:10px;"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="转入住" placement="top-end">
              <i @click="ruzhuIn(scope.row)" v-show="scope.row.status == 1 || scope.row.status == 0" class="iconfont iconcaozuotubiao-zhuanruzhu" style="margin-left:10px;"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消" placement="top-end">
              <i @click="cancelLive(scope.row)" v-show="scope.row.status == 0 " class="iconfont iconcaozuotubiao-quxiao" style="margin-left:10px;"></i>
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
  name: "BookingRoom",
  data() {
    return {
      //查询条件数据
      searchForm: {
        elderName: "",
        roomName: "",
        startTime: "", //计划入住开始日期
        endTime: "", //计划入住结束日期
        status: "",
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      //头部按钮色变和选择
      colorBtn: { all: 1, dai: 0, ban: 0, haved: 0, cancel: 0 }
    };
  },
  components: {},
  created() {
    this.initData(this.searchForm);
  },
  filters: {
    statusFilter: function(value) {
      switch (value) {
        case 0:
          return "待入住";
          break;
        case 1:
          return "办理中";
          break;
        case 2:
          return "已入住";
          break;
        case -1:
          return "已取消";
          break;

        default:
          break;
      }
    }
  },
  methods: {
    async initData(data) {
      const res = await axios.fetch("elderServer", "/bookElder/query", data);
      if (res.code == 200) {
        this.totalPage = res.total;
        this.tableData = res.data;
      }
    },
    /**搜索 */
    searchInfo() {
      if (this.searchForm.startTime && !this.searchForm.endTime) {
        this.$message.warning("请选择结束时间");
        return false;
      }
      if (!this.searchForm.startTime && this.searchForm.endTime) {
        this.$message.warning("请选择开始时间");
        return false;
      }
      if (this.searchForm.startTime && this.searchForm.endTime) {
        if (
          this.$moment(this.searchForm.startTime).valueOf() >
          this.$moment(this.searchForm.endTime).valueOf()
        ) {
          this.$message.warning("开始时间不能超过结束时间");
          return false;
        }
      }
      this.initData(this.searchForm);
    },
    /**  */
    reset() {
      this.searchForm.elderName = "";
      this.searchForm.roomName = "";
      this.searchForm.startTime = "";
      this.searchForm.endTime = "";
      this.searchForm.pageIndex = this.currentPage = 1;
      this.searchForm.pageSize = 10;
      this.initData(this.searchForm);
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.initData(this.searchForm);
    },
    // 状态切换
    selectLive(type, status) {
      this.searchForm.pageIndex = 1;
      this.totalPage = "";
      for (var key in this.colorBtn) {
        if (type == key) {
          this.colorBtn[key] = 1;
        } else {
          this.colorBtn[key] = 0;
        }
      }
      this.searchForm.status = status;
      this.initData(this.searchForm);
    },
    // 查看
    see(data) {
      console.log(data);
      this.$router.push({
        path: "/elder/bookingRoom/bookingRoomDetail",
        query: {
          bookId: data.bookId,
          status: data.status,
          elderId: data.elderId,
          elderName: data.elderName
        }
      });
    },
    // 编辑
    repair(data) {
      console.log(data);
      this.$router.push({
        path: "/elder/bookingRoom/addBookingRoom",
        query: { bookId: data.bookId, sign: "repair" }
      });
    },
    // 转入住
    ruzhuIn(data) {
      let sign;
      if (data.elderId == 0) {
        window.localStorage.removeItem("blueNav");
        window.localStorage.removeItem("grayNav");
        window.localStorage.removeItem("elderId");
        window.localStorage.removeItem("elderName");
        window.localStorage.removeItem("nursingLevel");
        window.localStorage.removeItem("checkinDate");
        window.localStorage.removeItem("notEdit");
        window.localStorage.removeItem("hasRuZhuHeTong");
        sign = "add";
      } else {
        sign = "repair";
      }
      this.$router.push({
        path: "/elder/checkInEdit",
        query: {
          bookId: data.bookId,
          sign,
          elderId: data.elderId,
          elderName: data.elderName
        }
      });
    },
    // 取消入住
    cancelLive(data) {
      this.$confirm("是否需要取消该预约?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "取消成功!"
        });
        const param = {
          bookId: data.bookId
        };
        axios.fetch("elderServer", "/bookElder/cancel", param).then(res => {
          if (res.code == 200) {
            this.initData(this.searchForm);
          }
        });
      });
    },
    // 添加预定
    addLive() {
      this.$router.push("bookingRoom/addBookingRoom");
    }
  }
};
</script>

<style lang="less" scoped>
.booking-room {
  height: 100%;
  .navBtn {
    width: 90% !important;
  }
  .btn-font-size {
    font-size: 14px;
    font-weight: 500;
  }
  .button-grounp button.active {
    background: #4687e1 !important;
    color: #fff !important;
    border: 1px solid #4687e1 !important;
  }
  .addBtn {
    background: #6cbc6c;
    color: #fff;
  }
}
</style>
