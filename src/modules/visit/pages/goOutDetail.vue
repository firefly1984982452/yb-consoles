<template>
  <div class="app-container" id="userList">
    <el-row class="warp userList" v-loading="loading"  id="tableList" style="padding-top: 0px;background:#ECF0F4;border: none;">
	    <!--日期条件查询   -->
      <el-row class="backTitle" style="margin-bottom: 0;">
      <el-col :span="2" class="backBtns">
        <el-button @click="backList()">
          <span>返回</span>
        </el-button>
      </el-col>
      <el-col :span="20" class="title">
        <span>记录进出详情</span>
      </el-col>
    </el-row>
      <!-- 2 -->
      <el-col style="background: #fff;border: 1px solid rgb(220, 223, 230);border-radius: 4px;padding-top: 10px;margin-top: 10px;">
        <el-table
          :data="tableData"
          :cell-style="cellStyle"
          style="width:95%;position:relative;left:2%;"
          border>
          <el-table-column prop="id" label="序号" min-width="30">
            <template slot-scope="scope">{{scope.row.id | nothingFilter}}</template>
          </el-table-column>
          <el-table-column prop="visitorName" label="姓名" min-width="30">
          	<template slot-scope="scope">{{scope.row.visitorName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="外出时间" min-width="30">
          	<template slot-scope="scope">{{scope.row.createTime | nothingFilter}}</template>
          </el-table-column>
          <el-table-column prop="updateTime" label="回院时间" min-width="30">
          	<template slot-scope="scope">{{scope.row.updateTime | nothingFilter}}</template>
          </el-table-column>   
          <el-table-column prop="deviceName" label="外出设备" min-width="30">
          	<template slot-scope="scope">{{scope.row.deviceName | nothingFilter}}</template>
          </el-table-column> 
          <el-table-column prop="vIn" label="回院设备" min-width="30">
          	<template>-</template>
          </el-table-column> 
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage3"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="totalPage">
	    </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
    	loading:false,
        searchForm: {
    	    name:'',
          time:'',
        },
        tableData:[],
        currentPage3:1,
        totalPage: 0

    };
  },
  computed: {
  },
  mounted() {
    this.getDetail();
  },
  methods:{
    getDetail(){
      let data = {
        visitorId:this.$route.query.visitorId,
        pageIndex:this.currentPage3,
        pageSize:10
      }
      axios.fetch('visitServer', "/visitor/get/personageVisitRecord",data).then(res => {
        this.loading = false;
        if (res.code == "200") {
          this.tableData = res.data;
          this.totalPage = res.total;
        } else if (res.code == "401") {
          this.$message({ message: res.message, type: "warning" });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => {
        this.loading = false;
      });
    },
    backList() {
      this.$router.back(-1);
    },
  	/*查询第几页数据*/
		handleCurrentChange(val){
      this.currentPage3 = val;
      this.getDetail();
		},
  },
};
</script>
<style scoped>
#userList .el-pagination {
  margin-top: 20px;
  float: right;
  position: relative;
  right: 130px;
}
#userList .el-pagination__editor.el-input {
  width: 50px;
}
</style>

