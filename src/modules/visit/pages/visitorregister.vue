<template>
  <div class="app-container" id="userList">
    <el-row class="warp userList" v-loading="loading"  id="tableList" style="padding-top: 0px;background: #ECF0F4;border: none;">
	<!--日期条件查询   -->
      <el-col class="searchTop">
        <el-form :inline="true" class="search" ref="searchForm" :model="searchForm" label-width="75px">
          <el-row :gutter="0">
            <el-col :xl="4" :lg="6">
              <el-form-item label="员工姓名">
          			<ub-employee v-model="elderId" @change='item => searchForm.employeeName = item.employeeName' clearable></ub-employee>
              </el-form-item>
            </el-col>
            <el-col :xl="7" :lg="12">
              <el-form-item label="考勤日期" label-width="85px">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
              <el-button
                type
                style="background-color:#2368D3;color:#fff;"
                @click="searchVisitorDate()"
                icon="el-icon-search"
              >查询</el-button>
              <el-button type @click="resizeData()" icon="el-icon-refresh-right">重置</el-button>
          </el-row>
        </el-form>
      </el-col>
      <!-- 2 -->
      <el-col style="background: #fff;border: 1px solid rgb(220, 223, 230);border-radius: 4px;padding-top: 10px">
        <el-row class="btn-grounp-table" :gutter="0" type="flex">
			<el-col :span="24" id="btn-grounp">
				<el-row :gutter="0" class='clearfix' type="flex" justify="end">
					<el-col :span="22" style="padding-top: 10px;padding-left:20px;">
						<span style="font-weight: bolder;letter-spacing: 1.5px">共{{totalPage}}条记录</span>
					</el-col>
					<el-col :xl="2" :lg="2">
						<el-button
                style="background-color:#2368D3;color:#fff;margin:0 0 10px 0" 
                @click="exportExcelData()">
                <i class="iconfont iconjichutubiao-daochubiaoge"></i>导出Excel</el-button>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
        <el-table
          :data="tableData"
          style="width:98%;position:relative;left:1%;"
          :header-cell-style="{background:'#F3F3F5'}" 
          class="ub-table"
          border>
          <el-table-column prop="jobNumber" label="工号" width="200">
            <template slot-scope="scope">{{scope.row.jobNumber || '-'}}</template>
          </el-table-column>
          <el-table-column prop="deptName" label="部门" min-width="30">
          	<template slot-scope="scope">{{scope.row.deptName || '-'}}</template>
          </el-table-column>
          <el-table-column prop="visitorName" label="姓名" min-width="30">
          	<template slot-scope="scope">{{scope.row.visitorName || '-'}}</template>
          </el-table-column>
          <el-table-column prop="dateTime" label="日期" min-width="30">
          	<template slot-scope="scope">{{scope.row.dateTime | '-'}}</template>
          </el-table-column>
          <el-table-column prop="startTime" label="上班时间" min-width="30">
          	<template slot-scope="scope">{{scope.row.startTime || '-'}}</template>
          </el-table-column>
          <el-table-column prop="endTime" label="下班时间" min-width="30">
          	<template slot-scope="scope">{{scope.row.endTime || '-'}}</template>
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
import settings from "@/settings";
import ubEmployee from "@/components/employee";

export default {
  components: { ubEmployee },
  data() {
    return {
    	loading:false,
	    searchForm: {
		    employeeName:'',
        time:[],
        startDate:'',
        endDate:''
      },
      tableData:[],
      currentPage3:1,
      totalPage:0,
      pageSize:10
    };
  },
  mounted() {
  	this.searchVisitorDate();
  },
  methods:{
      //时间条件搜索
    searchVisitorDate(){
      this.loading = true;
      this.searchForm.pageIndex = this.currentPage3;
      this.searchForm.pageSize = this.pageSize;
      this.searchForm.startDate = this.searchForm.time ? this.searchForm.time[0] : '';
      this.searchForm.endDate = this.searchForm.time ? this.searchForm.time[1] : '';
      axios.fetch('visitServer', "/visitor/query/attendance",this.searchForm).then(res => {
          this.loading = false;
          if(res.code == 200) {
            res.data.map(val => {
              val.startTime = val.startTime == '' || val.startTime == null ? '' : val.startTime.substr(11,8);
              val.endTime = val.endTime == '' || val.endTime == null ? '' : val.endTime.substr(11,8);
            });
            this.tableData = res.data;
            this.totalPage = res.total;
          } else if(res.code == "401") {
              this.$message({
                  message: res.message,
                  type: "warning"
              });
              this.$router.push("/login");
          } else {
              this.$message.error(res.message);
          }
      })
      .catch(err => {
          this.loading = false;
      });
    },
    resizeData(){
      this.elderId = "";
      this.searchForm.employeeName = '';
      this.searchForm.time = '';
      this.searchVisitorDate();
    },
  	/*查询第几页数据*/
		handleCurrentChange(val){
      this.currentPage3 = val;
      this.searchVisitorDate();
		},
    //导出员工考勤数据
    exportExcelData(){
      this.searchForm.startDate = this.searchForm.time !== null && this.searchForm.time.length !== 0 ? this.searchForm.time[0] : '';
      this.searchForm.endDate = this.searchForm.time !== null && this.searchForm.time.length !== 0 ? this.searchForm.time[1] : '';
      const param = {
          employeeName: this.searchForm.employeeName,
          startDate: this.searchForm.startDate,
          endDate: this.searchForm.endDate
      };
      var temp = document.createElement("form");
      temp.action =
          settings.servers.visitServer + "/visitor/exportExcel/attendance";
      temp.method = "post";
      temp.style.display = "none";
      for (var x in param) {
          var opt = document.createElement("input");
          opt.name = x;
          opt.value = param[x];
          temp.appendChild(opt);
      }
      document.body.appendChild(temp);
      temp.submit();
      document.body.removeChild(temp);
      this.$message.success("导出成功");
    }
  },
  filters: {
    intervieweeSataus: val => {
      return ['无','老人','员工'][val];
    },
    vrStatus: val => {
      return ['已完成探访','正在探访中'][val];
    },
  }
};
</script>
<style scoped>
#userList .el-pagination {
  margin: 20px auto;
  text-align: center;
}
#userList .el-pagination__editor.el-input {
  width: 50px;
}
</style>

