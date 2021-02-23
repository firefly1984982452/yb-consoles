<template>
  <!-- 长期医嘱 -->
  <div class="long-advice">
    <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
      <el-table-column label="遗嘱编号" min-width="50">
        <template slot-scope="scope" prop="sq_creator_id">
          <span @click="see(scope.row)">YZ{{scope.row.sq_creator_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="遗嘱内容" min-width="70" prop="sq_creator">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.sq_creator | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单次剂量" min-width="70" prop="sq_create_time">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.sq_create_time | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="频次" min-width="70" prop="sq_source">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.sq_source | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用法" min-width="70" prop="hygiene">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.hygiene | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="遗嘱类型" min-width="70" prop="science">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.science | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="70" prop="equipment">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.equipment | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reception" label="结束时间" min-width="70">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.reception | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feestandard" label="老人姓名" min-width="70">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.feestandard  | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feestandard" label="房间床位" min-width="70">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.feestandard  | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feestandard" label="下嘱医生" min-width="70">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.feestandard  | nothingFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feestandard" label="状态" min-width="70">
        <template slot-scope="scope">
          <span @click="see(scope.row)">{{scope.row.feestandard  | nothingFilter}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "LongAdvice",
  data() {
    return {
      currentPage:1,
      totalPage:0,
      // 表格数据
      tableData: []
    };
  },
  components: {},
  methods: {
    // 初始化数据
    async initData() {
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.dataInit(val);
    }
  }
};
</script>

<style lang="less" scoped>
.el-pagination {
    text-align: center;
    padding: 20px 0px;
}
</style>
