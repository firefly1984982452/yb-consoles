<template>
  <div class="table-componet">
    <el-table ref="table" :data="tableData" :border="boder" style="width: 100%" @selection-change="handleSelectionChange" @select="handleOneSelect">
      <!-- <el-table-column v-if="selection" type="selection" width="50">
      </el-table-column> -->
      <el-table-column v-if="index" :type="index" label="序号" width="120" align="center">
      </el-table-column>
      <!-- 普通数据列 -->
      <template v-for="(v, i) in tableHeader">
        <el-table-column align="center" v-if="!v.type" :key="`v.label${i}`" :prop="v.prop" :label="v.label" :width="v.width" :formatter="v.format">
        </el-table-column>
        <!-- 数据小于0标红列 -->
        <el-table-column v-else-if="v.type == 'markRed'" :key="`v.label${i}`" :label="v.label" :width="v.width" align="center">
          <template slot-scope="scope" :formatter="v.format">
            <span :class="Number(scope.row[v.prop]) < 0 ? 'markRed' : ''">
              {{ scope.row[v.prop] }}
            </span>
          </template>
        </el-table-column>
        <!-- 数据需要换行的列 -->
        <el-table-column v-else-if="v.type == 'wrap'" :key="`v.label${i}`" :label="v.label" :width="v.width" align="center">
          <template slot-scope="scope" :formatter="v.format">
            <p style="text-align:left;padding-left:10px;">
              {{ scope.row[v.prop].split("，")[0] }}
            </p>
            <p style="text-align:left;padding-left:10px;">
              {{ scope.row[v.prop].split("，")[1] }}
            </p>
          </template>
        </el-table-column>
        <!-- 数据有图标的列 -->
        <el-table-column v-else-if="v.type == 'icon'" :key="`v.label${i}`" :label="v.label" :width="v.width" align="center">
          <template slot-scope="scope" :formatter="v.format">
            <span class="tableRedTip" v-if="scope.row.startDiet">餐</span>
            <span v-if="scope.row.startDate">
              {{ scope.row.startDate.split(" ")[0] }}
            </span>
            至
            <span v-if="scope.row.endDate">
              {{ scope.row.endDate.split(" ")[0] }}
            </span>
            <span class="tableRedTip" v-if="v.type == 'icon' && scope.row.endDiet">餐</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- <div class="pagination" v-if="selection">
      <span>
        <el-checkbox :indeterminate="isIndeterminate" style="margin-right:0;" v-model="isAllPage" border @change="allCheckEvent">全选所有页</el-checkbox>
        <el-checkbox v-model="isCurrentAll" :indeterminate="isIndeterminate2" border>全选当前页</el-checkbox>
      </span>
      <el-pagination layout="prev, pager, next" :total="totalPage" :current-page.sync="currentPage" @current-change="handlePageChange">
      </el-pagination>
    </div> -->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Table",
  props: {
    // 是否需要序号
    index: {
      type: String,
      default: "",
    },
    // 是否需要多选
    selection: {
      type: Boolean,
      default: false,
    },
    boder: {
      type: Boolean,
      default: true,
    },
    // 表头
    tableHeader: {
      type: Array,
      default: [],
    },
    // 表格数据
    tableData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  methods: {
    // 选择变化事件
    handleSelectionChange(val) {},
    // 单个选择事件
    handleOneSelect(value, row) {},
  },
  components: {},
};
</script>

<style lang="less" scoped>
.table-componet {
  min-height: 250px;
}
.markRed {
  color: red !important;
}

/deep/ th.gutter {
  display: table-cell !important;
}
/deep/ .el-table__body tr,
/deep/.el-table__body td {
  padding: 0;
  height: 42px;
  line-height: 42px;
  .tableRedTip {
    color: #eb6969;
    border: 1px solid #eb6969;
    font-size: 12px;
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 2px;
  }
}
/deep/ .el-table__body-wrapper {
  max-height: 420px !important;
  overflow: auto;
}
// 滚动条的宽度
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 0px; //横向滚动条高度
}
// 滚动条的滑块
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 6px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
</style>
