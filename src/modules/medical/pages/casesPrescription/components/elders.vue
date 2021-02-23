<template>
  <div class="elders">
    <el-form class="serach" :inline="true">
      <el-form-item>
        <el-select v-model="areaId" placeholder="请选择" @change="search">
          <el-option v-for="item in arears" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- <Area ref="areaCom" @currentArea="getArea" :area="setArea" @change="search"/> -->
      </el-form-item>
      <el-form-item>
        <el-input placeholder="姓名/入院编号" @input="search" @clear="search" clearable v-model="searchKey"
          class="input-with-select" @keypress.native.enter="search">
          <el-button class="btn" slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="elder_table">
      <el-table ref="table" highlight-current-row :data="tableData" @row-click="rowClick">
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center">
        </el-table-column>
        <el-table-column prop="bedName" label="床位" align="center">
          <template slot-scope="scope">
            {{ scope.row.roomName }}-{{ scope.row.bedName }}
          </template>
        </el-table-column>
        <el-table-column prop="checkinNo" label="入院编号" align="center">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="pagination" small background :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize"
      layout="prev, pager, next" :total="totalPage">
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
import axios from "axios";
export default {
  name: "Elders",
  data() {
    return {
      arears: [
        {
          id: "",
          name: "全部区域",
        },
      ],
      // setArea: "",
      areaId: "",
      pageIndex: 1,
      pageSize: 10,
      searchKey: "",
      currentPage:1,
      tableData: [],
      totalPage: "",
    };
  },
  components: {},
  created() {
    this.queryElders();
    this.queryAreas();
  },
  methods: {
    // getArea(val) {
    //   this.areaId = val.value;
    //   this.setArea = val.text;
    // },
    search() {
      console.log("====");
      this.pageIndex = 1;
      this.currentPage = 1;
      this.queryElders();
    },
    // 查询老人
    queryElders() {
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/elders",
          {
            areaId: this.areaId,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            searchKey: this.searchKey,
          },
          null,
          "get"
        )
        .then((res) => {
          console.log(res);
          this.tableData = res.data;
          this.totalPage = res.total;
        });
    },
    // 查询区域
    queryAreas() {
      axios
        .fetch("medicalServer", "/api/base/areas", {}, null, "get")
        .then((res) => {
          console.log(res);
          this.arears.push(...res.data);
        });
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.queryElders();
    },
    /** rowClick 当某一行被点击时会触发该事件*/
    rowClick(row, column, event) {
      this.$emit("selectPeople", row);
    },
  },
};
</script>

<style lang="less" scoped>
.elders {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .serach {
    display: flex;
    height: 64px;
    .btn.el-button {
      padding: 10px 10px;
      min-width: 40px;
    }
  }
  .elder_table {
    width: calc(100% - 10px);
    flex: 1;
    /* 用来设置当前页面element全局table 选中某行时的背景色*/
    /deep/ .el-table__body tr.current-row > td {
      background-color: #e7f6f5 !important;
    }
  }
  .pagination.el-pagination {
    height: 50px;
    padding: 0;
  }
}
</style>
