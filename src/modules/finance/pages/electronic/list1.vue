<template>
  <div>

    <el-form :inline="true" class="search" label-width="70px">
      <el-form-item label="楼层房间">
        <el-select placeholder="请选择楼宇" clearable v-model="buildSelect" size="mini" @change="changeBuild">
            <el-option :label="item.buildingName" :key="item.buildingName" v-for="item in buildingOption" :value="item.buildingId">{{item.buildingName}}</el-option>        
        </el-select>
        <el-select style="margin:0 0 0 20px" placeholder="请选择楼层" clearable v-model="fllorSelect" size="mini" @change="changefloor">
          <el-option v-for="(item,index) in floorsOption" :label="(item+1)+'层'" :value="(item+1)" :key="index" >{{(item+1)+'层'}}</el-option>
        </el-select>
        <el-select style="margin:0 0 0 20px" placeholder="请选择房号" clearable size="mini" v-model="roomSelect">          
          <el-option :value="item.roomId" v-for="item in roomsOption" :label="item.roomName" :key="item.roomId">{{item.roomName}}</el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="老人姓名">
          <ub-elder v-model="elderId" @change='item => elderName = item.elderName' clearable></ub-elder>
        </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker  type="daterange" v-model="startDate" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>      
      <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>    
      <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>    
      <span 
        class="iconfont iconjichutubiao-shaixuan" 
        :class="senior ? 'yellow' : 'block'"
        @click="senior=!senior">
        <span :class="senior ? 'yellow' : 'block'" style="margin-left:8px;">高级筛选</span>
        <i
          :class="[
            senior ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
            senior ? 'yellow' : 'block'
          ]"></i>
      </span>
      <div v-if="senior" style="margin-top:20px;">
        <el-form-item label="项目类别">
          <el-select placeholder="请选择项目类别"  clearable size="mini" v-model="category" @change="selectcate">
            <el-option v-for="(item,index) in categoryList"  :label="item" :value="item" :key="index"></el-option>
          </el-select>
          <el-select style="margin:0 0 0 20px" placeholder="请输入类别明细"  value-key="title"  clearable size="mini" v-model="titleselect">
            <el-option v-for="item in titlelist" :label="item.title" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="creatorName" placeholder="请输入创建人姓名"></el-input>
        </el-form-item>
      </div>
    </el-form>   

    <div class="content">
      <ul class="title">
        <li @click="topage1" >已出账单</li>
        <li class="cur">未出账单({{totalAmount}}元)</li>
        <el-button type="success" @click="dialogVisible=true">添加明细</el-button>
      </ul>
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}">
        <!-- <el-table-column prop="billId" label="流水编号" align="center"></el-table-column> -->
        <el-table-column prop="elderName" label="老人姓名" align="center"></el-table-column>

        <el-table-column label="房间床位" align="center">
          <template slot-scope="scope">
            {{scope.row.roomName +'-' + scope.row.bedName }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="项目类别" align="center" ></el-table-column>
        <el-table-column prop="title" label="收费项目" align="center" ></el-table-column>
        <el-table-column label="消费周期" align="center" width="250">  
          <template slot-scope="scope">
            <span v-if="scope.row.title=='保证金'">{{scope.row.intervalStart}}</span>
            <span v-else>{{scope.row.intervalStart + ' - ' + scope.row.intervalEnd}}</span>            
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额（元）" align="right" ></el-table-column>            
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
        <el-table-column prop="creatorName" label="创建人" align="center" ></el-table-column>        
        <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="作废" placement="top" v-if="permissionItemRemove && scope.row.status == 0 && scope.row.removeable">
              <el-button icon="iconfont iconcaozuotubiao-shanchu-xuanfu" size="mini" @click="tag2Del(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" :current-page="pageIndex" @current-change="handleChange" :pager-count="11" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog title="添加未出账单明细" :visible.sync="dialogVisible" width="530px" @open="disalogInit"  center="true">
      <el-form label-width="90px">
        <el-form-item label="老人姓名">
          <!-- <el-select v-model="elderId" filterable value-key placeholder="请选择">
            <el-option v-for="item in elderData" :key="item.elderId" :label="item.value" :value="item.elderId"></el-option>
          </el-select> -->
          <ub-elder v-model="elderId"></ub-elder>
        </el-form-item>
        <el-form-item label="收费项目">
          <el-select  placeholder="请选择基础项" v-model="category1" size="mini" style="width:173px" @change="selectcate1">
              <!-- <el-option label="基础项" value="基础项"></el-option>
              <el-option label="分摊项" value="分摊项"></el-option>
              <el-option label="消费项" value="消费项"></el-option>
              <el-option label="自带物品" value="自带物品"></el-option>
              <el-option label="补贴项" value="补贴项"></el-option> -->
            <el-option v-for="(item,index) in categoryList"  :label="item" :value="item" :key="index"></el-option>
          </el-select>
          <el-select  placeholder="请选择收费项目" value-key="title" size="mini" style="width:173px" v-model="shoufei" @change="selectcate2">
            <el-option v-for="(item,index) in shoufeilist"  :label="item.title" :value="item" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <div style="margin: -20px 0 0 100px;">
          <!-- <span>{{shoufei.remark}}</span> -->
          <span>{{ cate2Remark }}</span>&nbsp;
        </div>
        <el-form-item label="消费周期">
          <el-date-picker size="mini" value-format="yyyy-MM-dd" v-model="interval" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <i v-if="isLock" class="el-icon-lock" style="color:#1ba5f6" @click="lockDate"></i>
          <i v-else class="el-icon-unlock" style="color:#666" @click="lockDate"></i>
        </el-form-item>
        <el-form-item label="应收金额">
          <el-input  placeholder="请输入应收金额" v-model="amount" style="width:350px"></el-input>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="说明">
          <el-input  placeholder="请输入备注" show-word-limit :maxlength="255" v-model="remark" type="textarea" rows="5" style="width:350px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="医药费" v-show="shoufei.title=='医药费'">
          <el-radio v-model="medicalFee" label="院内药">院内药</el-radio>
          <el-radio v-model="medicalFee" label="院外药">院外药</el-radio>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addaccount">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>        
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { permission } from "youban-utils";
import ubElder from "@/components/elder";

export default {
  components: { ubElder },
  data(){
    return {
      show3: false,
      elderId:'',
      medicalFee: '', // 医药费
      senior:false,   //是否显示高级搜索
      data:[],
      dialogVisible:false,
      total:0,
      pageIndex:1,
      pageSize:8,
      isLock: false, //是否锁定日期

      buildSelect:'',
      buildingOption:[],

      fllorSelect:'',
      floorsOption:[],

      roomSelect:'',
      roomsOption:[],
      elderName:'',
      startDate:[],

 
      category:'',
      titleselect:'',
      titlelist:[],

      elderId:'',
      elderData:[],
      creatorName: '',
      category1:'',
      shoufei:'',
      categoryList:[],
      cate2Remark:'',
      shoufeilist:[],
      interval:[],
      amount:'',
      remark:'',

      totalAmount:'',

      permissionItemRemove: false // 是否有删除账单明细的权限
    }
  },
  created(){
    // 当前用户是否有删除账单明细的权限
    this.permissionItemRemove = permission.hasPermission('uban.finance.item.remove')

    /* axios.fetch('elderServer', "/elderInfo/all", {status:100,pageSize:1000}).then(res => {
      if(res.code==200){
        for(let i=0; i<res.data.length; i++){
          let elderDataItem = {
            value: res.data[i].elderName + ' ' + res.data[i].roomName.split('(')[0],
            elderId: res.data[i].elderId
          }
          this.elderData.push(elderDataItem);
        }
      }
    }) */
    axios.fetch('oaServer', "/org/building/list").then(res => {
      if(res.code == 200)
        this.buildingOption = res.data
    })
    axios.fetch("financeServer", "/accountStandard/all").then(res => {
      if (res.code == 200) {
        let tagsArr = [];
        
        this.allData = res.data;
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
          tagsArr.push(item.category);
          });
          // 获取大类名称数组
          this.categoryList = [...new Set(tagsArr)];
        }
      }
    });
    this.getdata();
  },

  methods:{
    // 改变老人或清除当前老人信息
    changePeople(val) {},
    lockDate(){
      this.isLock = !this.isLock;
    },
    addaccount(){
      if(!this.elderId){
        this.$message.error('请选择老人');
        return;
      }
      if(!this.category1 || !this.shoufei){
        this.$message.error('请选择收费项目');
        return;
      }
      if(this.interval.length!=2){
        this.$message.error('请选择消费周期');
        return;
      }
      if(!this.amount){
        this.$message.error('请输入应收金额');
        return;
      }
      // if (this.shoufei.title == '医药费') {
      //   if (this.medicalFee == '') {
      //     return this.$message.error('请选择医药费')
      //   } else {
      //     this.remark = this.medicalFee + ',' + this.remark
      //   }
      // }
      let [intervalStart,intervalEnd] = this.interval
      let info = {
        elderId:this.elderId,
        category:this.category1,
        standardId:this.shoufei.standardId,
        evidence:this.shoufei.evidence,
        title:this.shoufei.title,
        intervalStart,
        intervalEnd,
        amount:this.amount,
        remark:this.remark
      }
      axios.fetch('financeServer','/accountItem/submit',info,'json').then(res=>{        
        if(res.code==200) {
          this.$message({message: '新增成功',type: 'success'});
          this.getdata();
          this.elderId = '';
          // this.category1 = '';
          // this.shoufei = '';
          this.interval = this.isLock ? this.interval : [];
          this.amount = '';
          this.remark = '';
          // this.dialogVisible = false;
        }
      })
    },
    handleChange(i){
      this.pageIndex = i;
      this.getdata();
    },
    topage1(){
      this.$router.push('/finance/electronic');
    },
    reset(){
      this.buildSelect = this.fllorSelect = this.roomSelect = this.elderName = this.category = this.titleselect = this.elderId = this.creatorName = '';
      this.startDate = []
      this.search()
    },
    changetag(i){
      this.getdata();
    },
    changeBuild(){
      this.fllorSelect = [];
      this.roomSelect = ''
      this.roomsOption = []
      this.floorsOption = []
      if(this.buildSelect=='') return;
      
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
      axios.fetch('oaServer', "/org/room/list", {buildingId:this.buildSelect,floor:this.fllorSelect}).then(res => {
        if(res.code == 200){          
          this.roomsOption = res.data
        }          
			})
    },
    search(){   
      this.pageIndex=1;
      this.getdata();
    },
    getdata(){     
      let info = {
        elderName:this.elderName,
        startDate:this.startDate,
        pageIndex:this.pageIndex,
        pageSize:this.pageSize,
        category:this.category,
        title:this.titleselect.title,
        buildingId:this.buildSelect,
        floor:this.fllorSelect,
        roomId:this.roomSelect,
        creatorName: this.creatorName
      }
      axios.fetch('financeServer','/accountItem/list',info).then(res=>{        
        if(res.code==200) {
          this.total = res.total
          this.data = res.data                
        }
      })
      axios.fetch('financeServer','/accountBill/itemAmount',info).then(res=>{        
        if(res.code==200) {
          this.totalAmount = res.data.receivableAmount
        }
      })
    },
    tag2Del(row){
      let title = '确认将【'+ row.elderName +' '+ row.title + ' ' + row.amount +'元】作废吗'
      this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.fetch('financeServer','/accountItem/submit',{itemId :row.itemId,status:-1},'json').then(res=>{        
            if(res.code==200) {
              this.$message({message: '作废成功',type: 'success'});
                this.getdata();
              this.dialogVisible = false;
            }
          }).catch(()=>{})
        }).catch(() => {});
    },
    selectcate(){
      this.titleselect=''
      this.titlelist=[];
      
      axios.fetch('financeServer','/accountStandard/all',{category:this.category}).then(res=>{        
        if(res.code==200) {
          let data = res.data,result=[],temp = [];      
          for(let i=0;i<data.length;i++){           
            if(temp.indexOf(data[i].title)==-1){              
              result.push(data[i]);
              temp.push(data[i].title);
            }
          }
          this.titlelist = result;
        }
      })
    },
    selectcate1(){
      axios.fetch('financeServer','/accountStandard/all',{category:this.category1}).then(res=>{        
        if(res.code==200) {
          let data = res.data,result=[],temp = [];  
          for(let i=0;i<data.length;i++){           
            if(temp.indexOf(data[i].title)==-1){              
              result.push(data[i]);
              temp.push(data[i].title);
            }
          }
          this.shoufeilist = result;
          this.shoufei = ''
        }
      })
    },
    selectcate2(item){
      this.cate2Remark = item.remark?item.remark:'';
    },
    disalogInit(){
      this.elderId = this.category1 = this.title1 = this.amount = this.remark  = this.shoufei = this.cate2Remark = ''
      this.interval=[]
      this.isLock = false;
    }

  }
}
</script>
<style lang="less" scoped>
.search{  
  .el-date-editor--date,.el-input,.el-select{
    width: 178px;
  }
  .seniorFibler{
    cursor: pointer;
    margin-left: 12px;
    color: #222;
    span{
      margin:0 2px 0 3px;
    }   
  }
}
.content{
  .title{
    margin-bottom: 10px;
    li{
      display: inline-block;
      cursor: pointer;
      vertical-align: top;
      min-width:140px;
      width: auto;
      height: 36px;      
      text-align: center;
      line-height: 36px;      
       padding:0 4px;
      border-radius: 5px;
      &.cur{
        color: #fff;
        background: #4687E1;
      }
    }
    span{
      float: right;
      color:#222;
      line-height: 36px;
      margin-right: 30px;
      i{
        font-style: normal;
        &.i1{color:#6CBC6C;}
        &.i2{color:#EB6969;}
      }
    }
    .el-button{
      float: right;
      margin-right: 30px;
    }
  }
}
.resolveform {
  /deep/ .el-dialog__body{
    background: rgba(248,248,248,1);
    margin:0 10px 10px;    
    .el-form-item{
      margin-bottom: 0 ;
    }
    .prespace{
      color:#2FC07A;
    }
    .reaspace{
      color: #EB6969;
    }
    
  }
  
}

.yellow {
  color: rgb(242, 129, 79);
}
.block {
  color: #222222;
}
</style>