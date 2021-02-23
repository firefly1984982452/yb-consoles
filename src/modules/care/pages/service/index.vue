<template>
  <div class="service">
    <!-- 明细--搜索区域 -->
    <el-form :inline="true" class="search" label-width="70px">
      <el-row>
        <el-form-item label="护理区域">
          <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
        </el-form-item>
        <el-form-item label="长者姓名">
          <ub-elder v-model="elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
        </el-form-item>
        <el-form-item label="服务名称">
          <el-input v-model="searchForm.goodsTitle" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="登记时间">
          <el-date-picker style="width:300px" v-model="startDate" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.isAccounted" placeholder="请输入" clearable>
            <el-option :label="item.label" :value='item.value' v-for="item in statusList" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
        </el-button>
        <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
      </el-row>
      <el-row>
      </el-row>

    </el-form>
    <!-- <SearchArea @searchInfo="searchInfo" :searchShowItems="searchShowItems"></SearchArea> -->
    <div class="content">
      <el-table :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column label="护理区域" prop="area"></el-table-column>
        <el-table-column label="长者姓名" prop="elderName"></el-table-column>
        <el-table-column label="房间床位" prop="roomName">
          <template slot-scope="scope">
            <span>{{ scope.row.roomName }}-{{ scope.row.bedName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务名称" prop="goodsTitle"></el-table-column>
        <el-table-column label="金额(元)" prop="amount"></el-table-column>
        <!-- <el-table-column label="数量" prop="quantity"></el-table-column> -->
        <el-table-column label="登记人" prop="creatorName"></el-table-column>
        <el-table-column label="登记时间" width="200" prop="createTime"></el-table-column>
        <!-- <el-table-column label="发放人" prop="buyerName"></el-table-column> -->
        <el-table-column label="服务时间" width="200">
          <template slot-scope="scope">
            <span>{{ $moment(scope.row.startTime).format('YYYY/MM/DD') }}</span><span v-if="scope.row.endTime">~{{ $moment(scope.row.endTime).format('YYYY/MM/DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{Number(scope.row.isAccounted) | statusFilter }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/javascript">
import ubElder from "@/components/elder";
export default {
  name: "Service",
  data() {
    return {
      setArea:'',
      elderId: "",
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      searchShowItems: [
        {
          type: "dictionary",
          code: "area",
          label: "护理区域",
          dictionary: "楼宇区域"
        },
        {
          type: "elder",
          code: "elderName",
          label: "长者姓名"
        },
        {
          type: "input",
          code: "goodsTitle",
          label: "服务名称"
        },
        {
          type: "coulpeDate",
          code: ["startTime", "endTime"],
          label: "登记时间"
        }
      ],
      startDate: ["", ""],
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      statusList: [
        {
          label: "待结算",
          value: false
        },
        {
          label: "已结算",
          value: true
        }
      ]
    };
  },
  components: { ubElder },
  created() {
    this.initTableData(this.searchForm);
  },
  filters: {
    statusFilter: function(value) {
      switch (value) {
        case 0:
          return "待结算";
          break;
        case 1:
          return "已结算";
          break;
        case -1:
          return "已作废";
          break;

        default:
          break;
      }
    }
  },
  methods: {
    getArea(val){
      this.searchForm.area = val.text;
      this.setArea = val.text;
    },
    initTableData(param) {
      if (this.startDate[0]) {
        param.startTime = this.startDate[0];
      }
      if (this.startDate[1]) {
        param.endTime = this.startDate[1];
      }
      axios
        .fetch("careServer", "/careOrderDetail/resideService", param)
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
            this.totalPage = res.total;
          }
        });
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.initTableData(this.searchForm);
    },
    // 查询
    searchInfo(data) {
      console.log(data);
      this.currentPage = this.searchForm.pageIndex = 1;
      this.initTableData(this.searchForm);
    },
    // 重置
    reset() {
      if (this.$refs.areaCom !== undefined) {
          this.$refs.areaCom.resetArea();
          this.setArea = '';
      }
      this.elderId = "";
      this.currentPage = 1;
      this.startDate = ["", ""];
      this.searchForm = {
        pageIndex: 1,
        pageSize: 10
      };
      this.initTableData(this.searchForm);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
