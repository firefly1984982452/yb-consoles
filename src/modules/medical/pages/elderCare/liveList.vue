<template>
  <div class="live-table">
    <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
      <el-table-column label="姓名/身份证" min-width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.elderName | itemTypeFilter }}</div>
          <div>{{ scope.row.cardNo | itemTypeFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="70" prop="gender">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" min-width="70" prop="age"></el-table-column>
      <el-table-column label="入院编号" min-width="70" prop="checkinNo"></el-table-column>
      <el-table-column label="登记时间" min-width="70" prop="createTime"></el-table-column>
      <el-table-column label="健康评估" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.isMedical && scope.row.agreeStatus == 1">
            <el-tooltip v-if="scope.row.creatorName" class="item" effect="dark" :content="scope.row.creatorName" placement="top">
              <el-button size="mini">
                <i class="iconfont iconjichutubiao-yiwancheng" style="color:#5eb300;"></i>
              </el-button>
            </el-tooltip>
            <i v-else class="iconfont iconjichutubiao-yiwancheng" style="color:#5eb300;"></i>
            <div>{{ scope.row.medicalCreateTime }}</div>
          </span>
          <span v-if="scope.row.isMedical && scope.row.agreeStatus == 0">
            <el-tooltip v-if="scope.row.creatorName" class="item" effect="dark" :content="scope.row.creatorName" placement="top">
              <el-button size="mini">
                <i class="iconfont iconjichutubiao-weitongguo" style="color: red"></i>
              </el-button>
            </el-tooltip>
            <i v-else class="iconfont iconjichutubiao-weitongguo" style="color: red"></i>
            <div>{{ scope.row.medicalCreateTime }}</div>
          </span>
          <span v-if="!scope.row.isMedical">
            <!-- <i class="iconfont iconjichutubiao-dengdaizhong" style="color:grey;"></i> -->
            <div style="color: #ed7268">待评估</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="首次照护评估" min-width="70" prop="firstEv">
        <template slot-scope="scope">
          <span v-if="!scope.row.estimateId">
            <i class="iconfont iconjichutubiao-dengdaizhong" style="color: grey"></i>
            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.doctorRemarkName" placement="top">
              <el-button size="mini">
                <i class="iconfont iconjichutubiao-dengdaizhong" style="color: grey"></i>
              </el-button>
            </el-tooltip> -->
            <!-- <div style="color:#ED7268">待评估</div> -->
          </span>
          <span v-if="scope.row.isMedical && scope.row.isDoctorRemark">
            <el-tooltip v-if="scope.row.doctorRemarkName" class="item" effect="dark" :content="scope.row.doctorRemarkName" placement="top">
              <el-button size="mini">
                <i class="iconfont iconjichutubiao-yiwancheng" style="color:#5eb300;"></i>
              </el-button>
            </el-tooltip>
            <i v-else class="iconfont iconjichutubiao-yiwancheng" style="color:#5eb300;"></i>
            <div>{{ scope.row.doctorRemarkTime }}</div>
          </span>
          <span v-if="
              scope.row.isMedical &&
              scope.row.estimateId &&
              !scope.row.isDoctorRemark
            ">
            <div style="color: #ed7268">待评估</div>
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
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data () {
    return {
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: []
    };
  },
  created () {
    // this.initData();
  },
  methods: {
    // // 初始化数据
    // async initData() {
    //   const res = await axios.fetch(
    //     "elderServer",
    //     "/elderMedical/info",
    //     this.searchForm
    //   );
    //   console.log(res);
    //   if (res.code == 200) {
    //     this.tableData = res.data;
    //     this.totalPage = res.total;
    //   }
    // },
    // 编辑
    edit (data) {
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
          isDoctorRemark: data.isDoctorRemark,
          version: data.version
        }
      });
    },
    /*查询第几页数据*/
    handleCurrentChange (val) {
      // this.searchForm.pageIndex = val;
      this.$emit('liveChildInit', val)
      // this.initData();
    },
    // 搜索
    searchInfo () {
      console.log(this.searchForm);
      this.searchForm.pageIndex = 1;
      this.currentPage = 1;
      this.initData();
    }
  }
};
</script>

<style lang="less" scoped></style>
