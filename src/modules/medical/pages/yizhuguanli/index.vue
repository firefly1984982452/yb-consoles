<template>
  <div class="yizhugaunli">
    <!-- 搜索区域 -->
    <el-form ref="searchForm" :inline="true" class="search" :model="searchForm" label-width="75px">
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
    </el-form>
    <div class="yizhugaunli-main">
      <el-button size="mini" :class="{ active:searchForm.adviceType === 2 }" type='text' @click="handleTab('长期医嘱')">长期医嘱</el-button>
      <el-button size="mini" :class="{ active:searchForm.adviceType === 1 }" type='text' @click="handleTab('短期医嘱')">短期医嘱</el-button>
      <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column label="医嘱编号" min-width="80" prop="itemNo">
          <!-- <template slot-scope="scope" prop="itemNo">
            <span>YZ{{scope.row.sq_creator_id}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="医嘱内容" min-width="70" prop="itemContent">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.sq_creator | nothingFilter}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="单次剂量" min-width="70" prop="useCount">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.sq_create_time | nothingFilter}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="频次" min-width="70" prop="itemInterval">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.sq_source | nothingFilter}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="用法" min-width="70" prop="useWay">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.hygiene | nothingFilter}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="医嘱类型" min-width="70" prop="itemType">
          <template slot-scope="scope">
            <span>{{scope.row.itemType | itemTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" min-width="120" prop="startTime">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.equipment | nothingFilter}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" min-width="120">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.reception | nothingFilter}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="elderName" label="老人姓名" min-width="70">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.feestandard  | nothingFilter}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="feestandard" label="房间床位" min-width="70">
          <template slot-scope="scope">
            <span>{{scope.row.feestandard  | nothingFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="doctorName" label="下嘱医生" min-width="70">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.feestandard  | nothingFilter}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="70">
          <template slot-scope="scope">
            <span :class="{ blue: scope.row.status== 1,red: scope.row.status== 0 }">{{ scope.row.status  | statusFilter }}</span>
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
      //查询条件数据
      searchForm: {
        elderName: "",
        adviceType: 2,
        itemType: "", //医嘱项目分类：1护理，2饮食，3药品，4诊疗
        doctorId: "",
        pageIndex: 1,
        pageSize: 10
      },

      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      doctors: [], // 医生数据
      tabView: "LongAdvice"
    };
  },
  created() {
    this.getDoctors();
    this.initData();
  },
  filters: {
    itemTypeFilter: val => {
      switch (val) {
        case 1:
          return "护理";
          break;
        case 2:
          return "饮食";
          break;
        case 3:
          return "药品";
          break;
        case 4:
          return "诊疗";
          break;

        default:
          break;
      }
    },
    // 状态过滤
    statusFilter: function(value) {
      switch (value) {
        case 0:
          return "未开始";
          break;
        case 1:
          return "进行中";
          break;
        case 2:
          return "已停止";
          break;

        default:
          break;
      }
    }
  },
  methods: {
    handleTab(tab) {
      tab == "长期医嘱"
        ? (this.searchForm.adviceType = 2)
        : (this.searchForm.adviceType = 1);
      this.initData();
    },
    // 初始化数据
    async initData() {
      const res = await axios.fetch(
        "medicalServer",
        "/doctorAdvice/item",
        this.searchForm
      );
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.data;
        this.totalPage = res.total;
      }
    },
    // 查询所有医生
    async getDoctors() {
      const res = await axios.fetch("medicalServer", "/server/doctor");
      if (res.code == 200) {
        this.doctors = res.data;
      }
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
        this.searchForm.itemType ='';
        this.searchForm.elderName ='';
        this.searchForm.doctorId ='';
        this.initData();
    }
  }
};
</script>

<style lang="less" scoped>
.yizhugaunli {
  display: flex;
  flex-direction: column;
  .search {
    min-width: 1100px;
  }
  &-main {
    // flex: 1;
    padding: 20px 15px 20px 15px;
    background-color: #fff;
    .el-button {
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
