<template>
  <div class="elder-care-list">
    <!-- 搜索区域 -->
    <!-- <el-form ref="searchForm" :inline="true" class="search" :model="searchForm" label-width="75px">
      <el-form-item label="老人姓名">
        <el-input v-model="searchForm.elderName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="医嘱类型">
        <el-select v-model="searchForm.itemType" placeholder="请输入" clearable>
          <el-option label="护理" :value='1'></el-option>
          <el-option label="饮食" :value='2'></el-option>
          <el-option label="药品" :value='3'></el-option>
          <el-option label="诊疗" :value='4'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下嘱医生">
        <el-select v-model="searchForm.doctorId" filterable placeholder="请选择">
          <el-option v-for="item in doctors" :key="item.epbId" :label="item.epbName" :value="item.epbId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form> -->
    <div class="elder-care-main content">
      <el-button size="mini" :class="{ active:adviceType === 1 }" type='text' @click="handleTab('入院评估')">入院评估</el-button>
      <el-button size="mini" disabled :class="{ active:adviceType === 2 }" type='text' @click="handleTab('照护评估')">照护评估</el-button>
      <p style="line-height:56px;color:rgba(0,0,0,.4);">完成全部入院手续后，入院评估数据不可再修改</p>
      <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column label="姓名/身份证" min-width="80">
          <template slot-scope="scope">
            <div>{{scope.row.elderName | itemTypeFilter}}</div>
            <div>{{scope.row.cardNo | itemTypeFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column label="性别" min-width="70" prop="gender">
          <template slot-scope="scope">
            <span>{{scope.row.gender }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" min-width="70" prop="age"></el-table-column>
        <el-table-column label="登记时间" min-width="70" prop="createTime"></el-table-column>
        <el-table-column label="健康评估" min-width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.isMedical&&scope.row.agreeStatus==1">
              <i class="iconfont iconjichutubiao-yiwancheng" style="color:#5eb300;"></i>
              <div>{{ scope.row.medicalCreateTime }}</div>
            </span>
            <span v-if="scope.row.isMedical&&scope.row.agreeStatus==0">
              <i class="iconfont iconjichutubiao-weitongguo" style="color:red;"></i>
              <div>{{ scope.row.medicalCreateTime }}</div>
            </span>
            <span v-if="!scope.row.isMedical">
              <!-- <i class="iconfont iconjichutubiao-dengdaizhong" style="color:grey;"></i> -->
              <div style="color:#ED7268">待评估</div>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="首次照护评估" min-width="70" prop="firstEv">
          <template slot-scope="scope">
            <span v-if="!scope.row.estimateId">
              <i class="iconfont iconjichutubiao-dengdaizhong" style="color:grey;"></i>
              <!-- <div style="color:#ED7268">待评估</div> -->
            </span>
            <span v-if="scope.row.isMedical&&scope.row.isDoctorRemark">
              <i class="iconfont iconjichutubiao-yiwancheng" style="color:#5eb300;"></i>
              <div>{{ scope.row.doctorRemarkTime }}</div>
            </span>
            <span v-if="scope.row.isMedical&&scope.row.estimateId&&!scope.row.isDoctorRemark">
              <div style="color:#ED7268">待评估</div>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" v-if="scope.row.status != 200" effect="dark" content="编辑" placement="top-end">
              <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconcaozuotubiao-bianji"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "AdviceMng",
  data() {
    return {
      adviceType: 1, // 默认入院评估
      //查询条件数据
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [
        {
          elderName: "李大爷",
          cardNo: "310106194805162428",
          gender: 1,
          age: 78,
          healthEv: 1,
          chinkInDate: "2020-05-22 16:52:33",
          firstEv: 1
        }
      ],
      tabView: "liveEvalue" // 默认入院评估
    };
  },
  created() {
    this.initData();
  },
  filters: {},
  methods: {
    handleTab(tab) {
      tab == "入院评估" ? (this.adviceType = 1) : (this.adviceType = 2);
      this.initData();
    },
    // 初始化数据
    async initData() {
      const res = await axios.fetch(
        "elderServer",
        "/elderMedical/info",
        this.searchForm
      );
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data;
        this.totalPage = res.total;
      }
    },
    // 编辑
    edit(data) {
      this.$router.push({
        path: "elderCareList/addEvaluation",
        query: {
          elderId: data.elderId,
          elderName: data.elderName,
          cardNo: data.cardNo,
          age: data.age,
          gender: data.gender,
          createTime: data.createTime,
          estimateId: data.estimateId,
          isMedical: data.isMedical,
          isDoctorRemark: data.isDoctorRemark
        }
      });
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.initData();
    },
    // 搜索
    searchInfo() {
      console.log(this.searchForm);
      this.searchForm.pageIndex = 1;
      this.currentPage = 1;
      this.initData();
    },
    // 重置
    reset() {
      this.searchForm.itemType = "";
      this.searchForm.elderName = "";
      this.searchForm.doctorId = "";
      this.initData();
    }
  }
};
</script>

<style lang="less" scoped>
.elder-care {
  &-list {
    display: flex;
    flex-direction: column;
    .search {
      min-width: 1100px;
    }
  }
  &-main {
    // flex: 1;
    padding: 20px 15px 20px 15px;
    background-color: #fff;
    .el-button--text {
      border-radius: 5px;
      color: #333333ff;
      font-weight: 500;
      font-size: 16px;
      width: 120px;
      height: 36px;
      margin-bottom: 20px;
    }
    .el-button--text.active {
      background-color: #4687e1ff;
      color: #fff;
    }
    .el-pagination {
      text-align: center;
      padding: 20px 0px;
    }
    .red {
      color: #eb6969ff;
    }
    .blue {
      color: #0078d4ff;
    }
  }
}
</style>
