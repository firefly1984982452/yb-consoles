<template>
  <div class="leave-page">
    <el-form :inline="true" class="search" >
      <el-form-item label="长者姓名">
        <el-input v-model="elderName" clearable placeholder="请输入长者姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="countStatus" clearable placeholder="请选择">
          <!-- <el-option label="不记账" value="0"></el-option> -->
          <el-option label="待审核" value="1"></el-option>
          <el-option label="已审核" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="filterSearch" style="background-color:#2368D3;">查询</el-button>    
      <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>    
    </el-form>    
    <div class="content">
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column prop="leaveNo" label="请假账单" align="center" width="150"></el-table-column>
        <el-table-column prop="elderName" label="长者姓名" align="center" ></el-table-column>
        <el-table-column label="请假时间" align="center"  width="260">
          <template slot-scope="scope"><p v-html="leaveDate(scope.row)" class="leavetime"><i>12</i></p></template>          
        </el-table-column>
        <el-table-column label="记账周期" align="center" width="260">
          <template slot-scope="scope">{{scope.row|countDate}}</template>
        </el-table-column>
        <el-table-column label="计费项" align="center">
          <template slot-scope="scope"><span v-html="count(scope.row.countDescription)"></span></template>
        </el-table-column>
        <el-table-column prop="countTime" label="审核时间" align="center"  width="200"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.countStatus|status}}</template>   
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="审核账单" placement="top" v-if="scope.row.countStatus==1">
              <el-button icon="el-icon-s-check" size="mini" @click="LeaveCheck(scope.row.leaveId)"></el-button>
            </el-tooltip>
          </template>   
        </el-table-column>
      </el-table>  
    <el-pagination  @current-change="handleCurrentChange" :current-page.sync="currentPage" :total="total" :page-size="pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog title="记账审核" :visible.sync="dialogVisible" width="680px" class="checked">
      <p class="info">长者姓名<strong>{{checkDialog.elderName}}</strong> 请假周期 <strong>{{dialogTitle}}</strong></p>
      <el-form class="checkForm" label-width="90px">
        <!-- <el-form-item label="加餐费">
          <el-date-picker @change="changespace" value-format="yyyy-MM-dd" size="mini" v-model="checkDialog.extraMealDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-input v-model="checkDialog.extraMealFee"></el-input>
          <span>元({{checkDialog.extraMealFeeDays|fildates}}天)</span>
        </el-form-item> -->
        <el-form-item label="膳食费">
          <el-date-picker :clearable="false" @change="changespace" value-format="yyyy-MM-dd" size="mini" v-model="checkDialog.mealFeeDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <!-- <el-date-picker v-model="checkDialog.mealFeeDate[0]" @change="changespace" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" :clearable="false"></el-date-picker>
            <el-date-picker v-model="checkDialog.mealFeeDate[1]" @change="changespace" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" :clearable="false"></el-date-picker> -->
          <el-input v-model="checkDialog.mealFee"></el-input>
          <span>元({{checkDialog.mealFeeDays|fildates}}天)</span>
        </el-form-item>
        <el-form-item label="护理费">
          <el-date-picker :clearable="false" @change="changespace" value-format="yyyy-MM-dd" size="mini" v-model="checkDialog.nurseFeeDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				<!-- <el-date-picker v-model="searchForm.startDate[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
				<el-date-picker v-model="searchForm.startDate[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker> -->
          <el-input v-model="checkDialog.nurseFee"></el-input>
          <span>元({{checkDialog.nurseFeeDays|fildates}}天)</span>
        </el-form-item>
        <el-form-item label="审核说明">
          <el-input maxlength="255" show-word-limit size="mini" type="textarea" v-model="checkDialog.desc" :rows="4" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmcheck">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>        
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { axios } from 'youban-utils';
export default {
  data(){
    return {
      elderName:'',
      countStatus:'',
      pageIndex:1,
      pageSize:10,
      data:[],
      total:0,
      dialogVisible:false,
      checkDialog:{
        elderName:'',
        countStart:'',
        countEnd:'',
        startDiet:0,
        endDiet:0,
        elderId:null,
        leaveId:null,
        extraMealDate:[],extraMealFee:'',extraMealFeeDays:'',     
        mealFeeDate:[],mealFee:'',mealFeeDays:'',                 
        nurseFeeDate:[],nurseFee:'',nurseFeeDays:'',
        desc:'',
        startDate:'',
        endDate:''
      }
    }
  },
  computed:{
    dialogTitle(){
      let _this = this.checkDialog;
      let str = _this.startDate;
      if(_this.startDiet) str+='(餐)'
      str+=' - ';
      str+=_this.endDate;
      if(_this.endDiet) str+='(餐)'
      return str;
    }
  },
  created(){
    this.getData();
  },
  methods:{
    reset(){
      this.elderName = this.countStatus = '';
      this.pageIndex = 1;
      this.currentPage = 0;
      this.filterSearch();
    },
    handleCurrentChange(val){
      this.pageIndex = val;
      this.getData();
    },
    getData(){
      axios.fetch('elderServer','/elderCount/query',{elderName:this.elderName,countStatus:this.countStatus,pageIndex:this.pageIndex,pageSize:this.pageSize}).then(res=>{        
        if(res.code == 200){
          this.data = res.data;
          this.total = res.total
        }
      })
    },
    filterSearch(){
      this.pageIndex = 1;
      this.currentPage = 0;
      this.getData();
    },
    leaveDate(row){
      // let t = row.startDate + ' 至 ' + row.endDate;
      let t;
      if(row.endDate){
        t = row.startDate + ' 至 ' + row.endDate;
        if(row.endDiet)   t=t+'<i class="r">餐</i>';
      } else {
        t = row.startDate
      }
      if(row.startDiet)   t = '<i class="l">餐</i>'+t;
      return t ;
    },
    count:row => row.split('，').join('<br/>'),
    changespace(){
      let [extraMealFeeStart,extraMealFeeEnd] = this.checkDialog.extraMealDate;
      let [mealFeeStart,mealFeeEnd] = this.checkDialog.mealFeeDate;
      let [nurseFeeStart,nurseFeeEnd] = this.checkDialog.nurseFeeDate;
      axios.fetch('elderServer','/elderCount/check/getAmount',{elderId:this.checkDialog.elderId,extraMealFeeStart,extraMealFeeEnd,mealFeeStart,mealFeeEnd,nurseFeeStart,nurseFeeEnd}).then(res=>{
        if(res.code==200){
          this.checkDialog.extraMealFee = res.data.extraMealFee ? res.data.extraMealFee : 0
          this.checkDialog.extraMealFeeDays = res.data.extraMealFeeDays ? res.data.extraMealFeeDays : 0
          this.checkDialog.mealFee = res.data.mealFee ? res.data.mealFee : 0
          this.checkDialog.mealFeeDays = res.data.mealFeeDays ? res.data.mealFeeDays : 0
          this.checkDialog.nurseFee = res.data.nurseFee ? res.data.nurseFee : 0
          this.checkDialog.nurseFeeDays = res.data.nurseFeeDays ? res.data.nurseFeeDays : 0
        }
      })
    },
    LeaveCheck(leaveId){
      axios.fetch('elderServer','/elderCount/check/get',{leaveId:leaveId}).then(res=>{
        if(res.code==200){
          this.checkDialog.leaveId = leaveId;
          this.checkDialog.elderId = res.data.elderId;
          this.checkDialog.elderName = res.data.elderName
          this.checkDialog.countStart = res.data.countStart
          this.checkDialog.countEnd = res.data.countEnd
          this.checkDialog.startDiet = res.data.startDiet
          this.checkDialog.endDiet = res.data.endDiet
          this.checkDialog.startDate = res.data.startDate
          this.checkDialog.endDate = res.data.endDate

          let _client = this.checkDialog,_server = res.data.elderCountDetailVo;
          _client.extraMealDate = [_server.extraMealFeeStart ? _server.extraMealFeeStart : '',_server.extraMealFeeEnd ? _server.extraMealFeeEnd : '',]
          _client.extraMealFee = _server.extraMealFee ? _server.extraMealFee : 0
          _client.extraMealFeeDays = _server.extraMealFeeDays ? _server.extraMealFeeDays : 0
          _client.mealFeeDate = [_server.mealFeeStart ? _server.mealFeeStart : '',_server.mealFeeEnd ? _server.mealFeeEnd : '',]
          _client.mealFee = _server.mealFee ? _server.mealFee : 0
          _client.mealFeeDays = _server.mealFeeDays ? _server.mealFeeDays : 0
          _client.nurseFeeDate = [_server.nurseFeeStart ? _server.nurseFeeStart : '',_server.nurseFeeEnd ? _server.nurseFeeEnd : '',]
          _client.nurseFee = _server.nurseFee ? _server.nurseFee : 0
          _client.nurseFeeDays = _server.nurseFeeDays ? _server.nurseFeeDays : 0

          this.dialogVisible=true;
        }
      })          
    },
    confirmcheck(){
      console.log(this.checkDialog)
      let params = {
        elderId: this.checkDialog.elderId,
        leaveId: this.checkDialog.leaveId,
        countRemark: this.checkDialog.desc,
        extraMealFeeStart: this.checkDialog.extraMealDate[0],
        extraMealFeeEnd: this.checkDialog.extraMealDate[1],
        extraMealFeeDays: this.checkDialog.extraMealFeeDays,
        extraMealFee: this.checkDialog.extraMealFee,
        mealFeeStart: this.checkDialog.mealFeeDate[0],
        mealFeeEnd: this.checkDialog.mealFeeDate[1],
        mealFeeDays: this.checkDialog.mealFeeDays,
        mealFee: this.checkDialog.mealFee,
        nurseFeeStart: this.checkDialog.nurseFeeDate[0],
        nurseFeeEnd: this.checkDialog.nurseFeeDate[1],
        nurseFeeDays: this.checkDialog.nurseFeeDays,
        nurseFee: this.checkDialog.nurseFee
      }
      
      axios.fetch('elderServer','/elderCount/check',params).then(res=>{
        if(res.code==200){
          this.$message({message: '审核成功',type: 'success'});
          this.dialogVisible = false;
          this.checkDialog.desc = '';
          this.getData();
        }
      })
    }
  },
  filters:{
    countDate:row => row.countStart + ' 至 ' + row.countEnd + ' (' + row.countDays + ')天',
    fildates:i=>i== null ? 0 : i,
    status:status => status == 0 ? '不记账' : status == 1 ? '待审核' : '已审核'
  }
}
</script>

<style lang="less" scoped>
.leave-page /deep/.el-input--mini{
  width: 425px;;
}
.leavetime {
  /deep/ i{
    font-style: normal;
    display: inline-block;
    color: #EB6969;  
    line-height: 18px;
    border:1px solid #EB6969;
    padding:1px 2px;
    font-size: 12px;
  }
  /deep/ i.l{
    margin-right: 5px;
  }
  /deep/ i.r{
    margin-left: 5px;
  }
}
.checked{
  /deep/ .el-dialog__header{
    color: #333;
    font-size: 25px;
    text-align: center;
  }
  /deep/ .el-dialog__footer{
    text-align: center;
  }
  /deep/ .el-dialog__body{
    padding:15px 20px;
  }
  .info{
    color: #666;
    padding-left: 25px;
    strong{
      margin:0 20px 0 8px;
    }
    margin-bottom: 15px;
  }
  .checkForm{ 
    /deep/ .el-dialog__header{
      text-align: center;
    }
    .el-input{
      display: inline-block;
      vertical-align: top;
      width: 70px;
      margin-top: 1px;;
    }
    /deep/ .el-textarea__inner{
      width: 425px;
    }
  }
}
</style>