<template>
  <div class="health-file">
    <!-- 搜索区域 -->
    <el-form ref="searchForm" :inline="true" class="search" :model="searchForm" label-width="75px">
      <el-form-item label="老人姓名">
        <el-input v-model="searchForm.elderName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="记录日期">
        <el-date-picker v-model="searchForm.recordDate[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"
          placeholder="开始日期" clearable></el-date-picker>
        <el-date-picker v-model="searchForm.recordDate[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"
          placeholder="结束日期" clearable></el-date-picker>
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-table :data="tableData" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column prop="ebAdmissionNumber" label="编号" min-width="50" align="center">
          <!-- <template slot-scope="scope" prop="sq_creator_id">
							<span>ZX{{scope.row.sq_creator_id}}</span>
						</template> -->
        </el-table-column>
        <el-table-column prop="elderName" label="姓名" min-width="60" align="center"></el-table-column>
        <el-table-column prop="ebGender" label="性别" min-width="60" align="center"></el-table-column>
        <el-table-column prop="ebNation" label="民族" min-width="50" align="center"></el-table-column>
        <el-table-column prop="ebAge" label="年龄" min-width="80" align="center"></el-table-column>
        <el-table-column prop="ebMarriage" label="婚姻状况" min-width="80" align="center"></el-table-column>
        <el-table-column prop="ebBirthplace" label="籍贯" min-width="100" align="center"></el-table-column>
        <el-table-column prop="elderJob" label="职业" min-width="90" align="center"></el-table-column>
        <el-table-column prop="infoConfidence" label="可靠程度" min-width="90" align="center"></el-table-column>
        <el-table-column prop="contractType" label="房间床位" min-width="90" align="center"></el-table-column>
        <el-table-column prop="seEnterDate" label="入住日期" min-width="90" align="center"></el-table-column>
        <el-table-column prop="seEnterDate" label="记录日期" min-width="90" align="center"></el-table-column>
        <el-table-column label="操作" min-width="100%">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button icon="iconfont iconcaozuotubiao-chakan" @click="checkDetial(scope.row)" size="mini">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10"
        layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/javascript">
import { axios } from "youban-utils";
export default {
  // 健康档案
  name: "HealthFile",
  data() {
    return {
      //查询条件数据
      searchForm: {
        elderName: "",
        recordDate: [],
        pageIndex: 1,
        pageSize: 10,
      },
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
    };
  },
  components: {},
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    async initData() {
      const res = await axios.fetch(
        "medicalServer",
        "/elderDocument/queryElderDocumentSelectivePager",
        this.searchForm
      );
      this.tableData = res.data;
      this.totalPage = res.total;
    },
    // 搜索
    searchInfo() {
      console.log(this.searchForm);
      this.initData();
    },
    // 重置
    reset() {
      this.searchForm = {
        elderName: "",
        recordDate: [],
        pageIndex: 1,
        pageSize: 10,
      };
    },

    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.initData();
    },
    // 查看详情
    checkDetial(data) {
      this.$router.push({
        path: "health-file-detail",
        query: { documentId: data.documentId },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  min-width: 1030px;
}
</style>
