<template>
  <div>
    <el-form :inline="true" class="search" :model="searchData">
      <el-form-item label="建档日期">
        <el-date-picker @change="search" v-model="dateRange" :picker-options="pickerOptions" style="width:250px" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label label-width="10">
        <el-input v-model="searchData.search_LIKES_name" clearable placeholder="姓名/入院编号" @change="search"></el-input>
      </el-form-item>
      <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="12" class="left summary">
          <span>入住长者</span>
          <span class="count">{{dataCount}}</span>
          <span>待建档</span>
          <span class="count todo">{{todo}}</span>
        </el-col>
      </el-row>
      <el-table :data="listData" border class="ub-table">
        <el-table-column prop="name" label="姓名/身份证" min-width="150" align="left">
          <template slot-scope="scope">
            <el-avatar v-if="scope.row.photo" :src="scope.row.photo"></el-avatar>
            <el-avatar v-else>{{ scope.row.name[0]}}</el-avatar>
            <div class="name">
              <p>{{scope.row.name}}</p>
              <p>{{scope.row.cardNo}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center" min-width="30"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center" min-width="30"></el-table-column>
        <el-table-column prop="checkinNo" label="入院编号" min-width="60"></el-table-column>
        <el-table-column prop="checkinDate" label="入院日期" min-width="60"></el-table-column>
        <el-table-column prop="bedName" label="房间床位" min-width="60">
          <template slot-scope="scope">{{scope.row.roomName}}-{{scope.row.bedName}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="建档时间" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status!=1" style="color: #FF4444;">待完善</span>
            <span v-if="scope.row.status==1">{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="doctorName" label="建档医生" min-width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">{{scope.row.doctorName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="edit(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";

export default {
  data() {
    let that = this;
    return {
      dialogFormVisible: false,
      dialogOptionsVisible: false,
      optionTitle: "",
      listData: [],
      dataCount: 0,
      form: {},
      todo: {},
      optionParent: {},
      dateRange: [],
      searchData: {
        search_LIKES_name: "",
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  computed: {},
  mounted() {},
  components: {},
  created() {
    this.fetchData();
  },
  methods: {
    search() {
      this.changePage(1);
    },
    reset() {
      this.searchData.search_LIKES_name = "";
      this.dateRange = [];
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    fetchData() {
      if (this.dateRange) {
        this.searchData.search_GED_createTime = this.dateRange[0];
        this.searchData.search_LED_createTime = this.dateRange[1];
      } else {
        this.searchData.search_GED_createTime = "";
        this.searchData.search_LED_createTime = "";
      }
      let that = this;
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/page",
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          that.listData = res.data;
          that.todo = res.msg;
          that.dataCount = res.total;
        });
    },

    edit(data) {
      this.$router.push({
        path: "/medical/health/document/detail",
        query: {
          elderId: data.elderId,
          id: data.id,
        },
      });
    },
  },
};
</script>
<style scoped>
.name {
  display: inline-block;
  vertical-align: top;
}
.name p {
  margin: 0px;
  padding: 0px;
  height: 18px;
}
.summary span {
  margin-left: 16px;
}
.summary .count {
  font-weight: 700;
}
.summary .todo {
  color: #ff4444;
}
</style>