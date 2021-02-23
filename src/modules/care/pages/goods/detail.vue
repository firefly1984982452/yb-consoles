<template>
  <div class="details content">
    <!-- 明细--搜索区域 -->
    <el-form :inline="true" class="search" label-width="70px">
      <el-row>
        <el-form-item label="护理区域">
          <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
        </el-form-item>
        <el-form-item label="长者姓名">
          <!-- <el-input v-model="searchForm.elderName" placeholder="请输入" clearable></el-input> -->
          <ub-elder v-model="elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
        </el-form-item>
        <el-form-item label="物品名称">
          <el-input v-model="searchForm.goodsTitle" style="width:150px" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="发放时间">
          <el-date-picker style="width:300px" v-model="startDate" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请输入" clearable>
            <el-option :label="item.label" :value='item.value' v-for="item in statusList" :key="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
        </el-button>
        <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
        <span @click="show = !show" class="btniconfont iconfont iconjichutubiao-shaixuan right" :class="show ? 'yellow' : 'block'">
          <span :class="show ? 'yellow' : 'block'" style="margin-left:8px;">高级筛选</span>
          <i :class="[
                show ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
                show ? 'yellow' : 'block'
              ]"></i>
        </span>
      </el-row>
      <el-row>
        <!-- <el-collapse-transition> -->
        <div v-show="show" style="margin-top: 10px;">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请输入" clearable>
              <el-option :label="item.label" :value='item.value' v-for="item in statusList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否结算">
            <el-select v-model="searchForm.isAccounted" placeholder="请输入" clearable>
              <el-option :label="item.label" :value='item.value' v-for="item in isAccounts" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- </el-collapse-transition> -->
      </el-row>

    </el-form>
    <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
      <el-table-column label="护理区域" prop="area"></el-table-column>
      <el-table-column label="长者姓名" prop="elderName"></el-table-column>
      <el-table-column label="房间床位" prop="roomName">
        <template slot-scope="scope">
          <span>{{ scope.row.roomName }}-{{ scope.row.bedName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物品名称" prop="goodsTitle"></el-table-column>
      <el-table-column label="金额(元)" prop="amount"></el-table-column>
      <el-table-column label="数量" prop="quantity"></el-table-column>
      <el-table-column label="登记人" prop="creatorName"></el-table-column>
      <el-table-column label="登记时间" width="200" prop="createTime"></el-table-column>
      <el-table-column label="发放人" prop="buyerName"></el-table-column>
      <el-table-column label="发放时间" width="200" prop="buyTime"></el-table-column>
      <el-table-column label="是否结算" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.isAccounted | isAccountedTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status | filterStatus}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
import ubElder from "@/components/elder";
export default {
  name: "Details",
  data() {
    return {
      setArea:'',
      show: false,
      elderId: "",
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
      },
      startDate: ["", ""],
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      statusList: [
        {
          label: "待发放",
          value: "0",
        },
        {
          label: "已发放",
          value: "1",
        },
      ],
      isAccounts:[
        {
          value:true,
          label:'已结算'
        },
        {
          value:false,
          label:'未结算'
        }
      ]
    };
  },
  components: { ubElder },
  created() {
    this.initTableData();
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
      axios.fetch("careServer", "/careOrderDetail/item", param).then((res) => {
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
    searchInfo() {
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
        pageSize: 10,
      };
      this.initTableData(this.searchForm);
    },
  },
  filters: {
    filterStatus(val) {
      // 0待购买/待发放，1已购买/已发放，-1已作废
      let arr = ["已作废", "待发放", "已发放"];
      return arr[Number(val) + 1];
    },
    isAccountedTypeFilter(value) {
      return value ? "已结算" : "未结算";
    },
  },
};
</script>

<style lang="less" scoped>
.right {
  float: right;
  height: 40px;
  line-height: 40px;
}
.yellow {
  color: rgb(242, 129, 79);
}
.block {
  color: #222222;
}
</style>
