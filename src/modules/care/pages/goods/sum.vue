<template>
  <div class="sum content">
    <!-- 汇总--搜索区域 -->
    <el-form :inline="true" class="search">
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请输入">
          <el-option :label="item.label" :value='item.value' v-for="item in statusList" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="护理区域">
        <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
      <el-button type="success" v-if="show" style="float:right;" @click="fafang">批量发放</el-button>

    </el-form>
    <el-table tooltip-effect="dark" @selection-change="handleSelectionChange" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="护理区域" prop="area" min-width="80"></el-table-column>
      <el-table-column label="物品名称" min-width="70" prop="goodsTitle"></el-table-column>
      <el-table-column label="金额(元)" min-width="70" prop="amount"></el-table-column>
      <el-table-column label="数量" min-width="70" prop="quantity"></el-table-column>
      <el-table-column label="状态" min-width="70" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status | statusFilter }}
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="success">发放</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Sum",
  data() {
    return {
      setArea:'',
      searchForm: {
        status: "0",
        pageIndex: 1,
        pageSize: 10
      },
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      multipleSelection: [],
      // 表格数据
      tableData: [],
      show: true,
      statusList: [
        {
          label: "待发放",
          value: "0"
        },
        {
          label: "已发放",
          value: "1"
        }
      ]
    };
  },
  created() {
    this.initTableData(this.searchForm);
  },
  filters: {
    statusFilter: function(value) {
      switch (value) {
        case 0:
          return "待发放";
          break;
        case 1:
          return "已发放";
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
    edit(item) {
      this.$confirm("是否确定发放该物品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = [
            {
              area: item.area,
              goodsTitle: item.goodsTitle
            }
          ];
          this.grantNet(param);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发放"
          });
        });
    },
    grantNet(param) {
      axios
        .fetch("careServer", "/careOrderDetail/grant", param, "json")
        .then(res => {
          if (res.code == 200) {
            this.$message.success(res.data);
            this.initTableData(this.searchForm);
          }
        });
    },
    initTableData(param) {
      axios.fetch("careServer", "/careOrderDetail/group", param).then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
          this.totalPage = res.total;
        }
      });
    },
    // 多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.initTableData(this.searchForm);
    },
    // 查询
    searchInfo() {
      this.currentPage = this.searchForm.pageIndex = 1;
      this.show = this.searchForm.status == 0 ? true : false;
      this.initTableData(this.searchForm);
    },
    // 重置
    reset() {
      if (this.$refs.areaCom !== undefined) {
          this.$refs.areaCom.resetArea();
          this.setArea = '';
      }
      this.show = true;
      this.currentPage = 1;
      this.searchForm = {
        status: "0",
        pageIndex: 1,
        pageSize: 10
      };
      this.initTableData(this.searchForm);
    },
    // 发放事件
    fafang() {
      console.log(this.multipleSelection);
      if (this.multipleSelection.length > 0) {
        this.$confirm("是否确定批量发放物品？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let arr = [];
            for (var i in this.multipleSelection) {
              let param = {
                area: this.multipleSelection[i].area,
                goodsTitle: this.multipleSelection[i].goodsTitle
              };
              arr.push(param);
            }
            console.log(arr);
            this.grantNet(arr);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消发放"
            });
          });
      } else {
        this.$message.warning("请选择数据");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
