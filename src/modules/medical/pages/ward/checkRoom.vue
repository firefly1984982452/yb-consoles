<template>
  <div>
    <el-form :inline="true" class="search" >
      <el-form-item label="查房日期">
        <el-date-picker  type="daterange" v-model="searchDate" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="querydata">查询</el-button>    
      <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>      
    </el-form>
    <div class="content">
			<el-row type="flex" class="pannel">
				<el-col class="right">
					<el-button class="button-purple" @click="rules" style="background-color:#2368D3;">
            <i class="iconfont iconjichutubiao-chafangguize" style="width:15px;height:15px;display:inline-block;"></i>
            查房规则
            </el-button>
				</el-col>
			</el-row>
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column prop="scheduleDate" label="查房日期" align="center"></el-table-column>
        <el-table-column label="查房班次" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}} <i style="color:#AAAAAA;font-style:normal;font-size:14px">{{scope.row.startTime}} - {{scope.row.endTime}}</i></span>
          </template>
        </el-table-column>
        <el-table-column prop="checkedCount" label="实查人数" align="center"></el-table-column>
        <el-table-column prop="scheduleCount" label="应查人数" align="center"></el-table-column>
        <el-table-column prop="abnormalCount" label="异常记录" align="center"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
							<el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      pageSize:10,
      pageIndex:1,
      currentPage:1,
      total:0,
      data:[],
      searchDate:[]
    }
  },
  created(){
    this.getdata();
  },
  methods:{
    getdata(){
      axios.fetch('medicalServer', "/api/ward/schedule/page",{
        beginDate:this.searchDate[0],
        endDate:this.searchDate[1],
        pageIndex:this.pageIndex,
        pageSize:this.pageSize,
      },'form','get').then(res => {
        if(res.code ==200){
          this.total = res.total;
          this.data = res.data
        }     
      })
    },
    handleChange(i){
      this.pageIndex=i;
      this.getdata();
    },
    // 编辑
    detail(val){
      console.log(val)
      this.$router.push({
        path:'/medical/checkRoomDetail',
        query: {
          id: val.id,
          scheduleDate: val.scheduleDate,
          checkedCount: val.checkedCount,
          scheduleCount: val.scheduleCount,
          abnormalCount: val.abnormalCount
        }
      })
    },
    rules () {
      this.$router.push({path:'/medical/checkRoomRules'});
      // var routerUrl = this.$router.resolve({path:'/medical/checkRoomRules'})
      // window.open(routerUrl.href,'_blank');
    },
    querydata(){
      this.pageIndex = 1;
      this.currentPage = 1;
      this.getdata()
    },
    reset(){
      this.searchDate = [];
      this.querydata();
    }
  }
}
</script>

<style lang="less" scoped>
</style>