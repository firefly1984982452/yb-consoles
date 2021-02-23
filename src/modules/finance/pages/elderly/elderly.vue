<template>
  <div>
    <el-form :inline="true" class="search" >
      <el-form-item label="楼层房间">
        <el-select placeholder="请选择楼宇" clearable v-model="buildSelect" size="mini" @change="changeBuild">
            <el-option :label="item.buildingName" :key="item.buildingName" v-for="item in buildingOption" :value="item.buildingId">{{item.buildingName}}</el-option>        
        </el-select>
        <el-select placeholder="请选择楼层" clearable v-model="fllorSelect" size="mini" @change="changefloor">
          <el-option v-for="item in floorsOption" :label="(item+1)+'层'" :value="(item+1)" :key="item" >{{(item+1)+'层'}}</el-option>
        </el-select>
        <el-select placeholder="请选择房号" clearable size="mini" v-model="roomSelect">          
          <el-option :value="item.roomId" v-for="item in roomsOption" :label="item.roomName" :key="item.roomId">{{item.roomName}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="托管费分类">
        <!-- <el-select placeholder="请选择" clearable size="mini" v-model="roomType"> -->
          <ub-dictionary group="房间类型" clearable v-model="roomType"></ub-dictionary>
        <!-- </el-select> -->
      </el-form-item>
      <el-form-item label="护理等级">
        <el-select placeholder="请选择" clearable size="mini" v-model="level">
          <el-option v-for="item in levels" :label="item.itemNo" :value="item.itemValue" :key="item.itemId">{{item.itemNo}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老人姓名">
        <el-input clearable placeholder="请输入老人姓名" v-model="elderName"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="querydata" style="background-color:#2368D3;">查询</el-button>    
      <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>      
    </el-form>
    <div class="content">
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column prop="elderName" label="老人姓名" align="center" ></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.status|status}}</template>
        </el-table-column>
        <el-table-column label="房间床位" align="center">
           <template slot-scope="scope">{{scope.row.roomName + ' - ' + scope.row.bedName}}</template>
        </el-table-column>
        <el-table-column prop="checkinDate" label="入住时间" align="center" ></el-table-column>
        <el-table-column prop="nursingLevel" label="护理等级" align="center" >
          <el-table-column prop="std1" align="center" >
            <template slot-scope="scope">{{scope.row.nursingLevel|level}}</template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="feeStyle" label="收费方式" align="center">
          <template slot-scope="scope">{{scope.row.feeStyle|feeStyle}}</template>
        </el-table-column>
        <el-table-column label="托管费标准"  align="center">
          <el-table-column prop="std1" align="center" >
            <template slot-scope="scope"><span class="todetail" @click="toDetail(scope.row.elderId,0)">{{scope.row.bedFee+'元/月'}}</span></template>
          </el-table-column>
          <!-- <el-table-column align="center" >
            <template slot-scope="scope"><span class="todetail" @click="toDetail(scope.row.elderId)">{{scope.row.bedFeeDay+'元/天'}}</span></template>
          </el-table-column> -->
        </el-table-column>              
        <el-table-column label="护理费标准"  align="center">
          <el-table-column align="center" label="" >
            <template slot-scope="scope"><span class="todetail" @click="toDetail(scope.row.elderId,2)">{{scope.row.nursingFee+'元/月'}}</span></template>
          </el-table-column>
          <!-- <el-table-column align="center" label="">
            <template slot-scope="scope"><span class="todetail" @click="toDetail(scope.row.elderId)">{{scope.row.nursingFeeDay+'元/天'}}</span></template>
          </el-table-column> -->
        </el-table-column>              
        <el-table-column prop="depositAmount" label="保证金金额(元)" align="center"></el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" :current-page.sync="currentPage" @current-change="handleChange" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  
  </div>
</template>

<script>
import ubDictionary from '@/components/dictionary';
export default {
  components: {
    ubDictionary
  },
  data(){
    return {
      buildSelect:'',
      buildingOption:[],

      fllorSelect:'',
      floorsOption:[],

      roomSelect:'',
      roomsOption:[],
      levels:[],
      data:[],

      elderName:'',
      roomType:'',
      level:'',
      pageSize:15,
      pageIndex:1,
      currentPage:1,
      total:0
    }
  },
  created(){
    console.log(12)
    axios.fetch('oaServer', "/org/building/list").then(res => {
      if(res.code == 200)
        this.buildingOption = res.data
    })
    axios.fetch('commonServer', "/dict/getItemViewsByGroup",{groups:'院方护理等级'}).then(res => {
      if(res.code ==200)
        this.levels = res.data
    })
    this.getdata();    
  },
  mounted(){
    console.log(1)
  },
  methods:{
    getdata(){
      axios.fetch('financeServer', "/elderAccount/all",{
        buildingId:this.buildSelect,
        floor:this.fllorSelect,
        roomId:this.roomSelect,
        pageIndex:this.pageIndex,
        pageSize:this.pageSize,
        elderName:this.elderName,
        roomType:this.roomType,
        nursingLevel:this.level,
        elderName:this.elderName
      }).then(res => {
        if(res.code ==200){
          this.total = res.total;
          this.data = res.data
        }     
      })
    },
    toDetail(id,type){
      this.$router.push('/finance/elderly/detail/'+id+'/'+type)
    },
    handleChange(i){
      this.pageIndex=i;
      this.getdata();
    },

    changeBuild(){
      this.fllorSelect=[];
      this.roomSelect=''
      this.roomsOption=[]
      this.floorsOption = []
      if(this.buildSelect=='') return ;
      
      let currentFloor = this.getBuildDetail(),temp=[]
      for(let i = 0;i<currentFloor.floors;i++) temp.push(i)
      this.floorsOption = temp
    },
    getBuildDetail(){
      for(let i=0;i<this.buildingOption.length;i++)
        if(this.buildingOption[i].buildingId==this.buildSelect)
          return this.buildingOption[i]
    },
    changefloor(){
      this.roomsOption=[]
      this.roomSelect=''
      if(this.fllorSelect=='') return;      
      axios.fetch('oaServer', "/org/room/list", {buildingId:this.buildSelect,floor:this.fllorSelect,pageSize: 1000}).then(res => {
        if(res.code == 200)
          this.roomsOption = res.data
			})
    },
    querydata(){
      this.pageIndex = 1;
      this.currentPage = 1;
      this.getdata()
    },
    reset(){
      this.buildSelect = this.roomType = this.fllorSelect = this.roomSelect = this.elderName = this.level = this.ftype = ''
      this.pageIndex = 1;
      this.currentPage = 1;
      this.getdata()
    }
  },
  filters:{
    feeStyle:i=>i==0?"先付后住(当月)":"先住后付(上月)",
    status:val => {
      if (val === 0) {
        val = "办理中";
      } else if (val === 100) {
        val = "已入住";
      }  else if (val === 150) {
        val = "离院中";
      }else if (val === 200) {
        val = "已离院";
      } else {
        val = "办理中";
      }
      return val;
    },
    // status:i=>i==0?'入住中':i==100?'已入住':'离院中',
    level:i=>i==0?'无护理':i==1 ? '护理一级':i==2 ? '护理二级':i==3 ? '护理三级':i==4 ? '护理四级':'护理五级'
  }
}
</script>

<style lang="less" scoped>
/deep/ table{
  thead{
    tr:nth-child(2){
      display: none;
    }
  }
}
.todetail{
  color: blue;
  &:hover{
    cursor: pointer;
    font-weight: bold;
  }
}
</style>