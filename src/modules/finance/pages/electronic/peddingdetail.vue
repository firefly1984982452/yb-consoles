<template>
  <div style="height:89%">
      <div class="info">
        <div v-if="detail.status == 0" class="title">待审核账单</div>
        <div v-else-if="detail.status == 1" class="title">待收款账单</div>
        <div v-else class="title">已收款账单</div>
        <el-form label-width="70px" label-position="right">
              <el-row style="width:900px">
                <el-col :span="4">
                  <el-form-item label="姓名">{{detail.elderName}}</el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="楼宇房间">{{detail.buildingName}} - {{detail.roomName}} - {{detail.bedName}}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="账单编号">{{detail.billNo}}</el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="账单类型">{{detail.billType|billType}}</el-form-item>
                </el-col>
              </el-row>
              <el-row style="width:900px">
                <el-col :span="4">
                  <el-form-item label="费用">{{detail.feeAmount}}元</el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="长护险"><span style="color:#EB6969;">{{detail.deductAmount}}元</span></el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="应收"><span><span style="color:#F6812B;">{{detail.receivableAmount}}</span>&nbsp;元&nbsp;&nbsp;(&nbsp;发票：{{detail.invoiceAmount}}元&nbsp;&nbsp;&nbsp;&nbsp;收据：{{detail.receiptAmount}}元&nbsp;&nbsp;&nbsp;&nbsp;代收代付：{{ detail.buyAmount | countFilter}}元&nbsp;)</span></el-form-item>
                </el-col>
              </el-row>
              <el-row style="width:900px">
                <el-col :span="20">
                  <el-form-item label="说明"><el-input :rows="4"  :maxlength="255" placeholder="请输入内容"  type="textarea"  v-model="desc" show-word-limit></el-input></el-form-item>
                </el-col>
              </el-row>
        </el-form>
      </div>
      <div class="info">
        <div class="title">账单明细 <el-button v-if="detail.status != 3" type="success" size="mini" @click="adddetail" icon="el-icon-plus">新增</el-button></div>
        <div class="cont1">
          <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}">
            <el-table-column prop="title" label="收费项目" align="center"></el-table-column>
            <!-- <el-table-column prop="shoufei" label="收费标准" align="center"></el-table-column> -->
            <el-table-column label="消费周期" align="center" width="350">
              <template slot-scope="scope">
                <span v-if="scope.row.intervalStart">{{ scope.row.intervalStart }}</span>
                <span v-if="scope.row.intervalStart&&scope.row.intervalEnd">-</span>
                <span v-if="scope.row.intervalEnd">{{ scope.row.intervalEnd }}</span>          
              </template>
            </el-table-column>
            <el-table-column label="应收金额(元)" align="center">
              <template slot-scope="scope">
                <span v-if="detail.billType == 3 && scope.row.amount < 0" style="color:#f00;">{{scope.row.amount}}</span>
                <span v-else>{{scope.row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="创建人" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"  ></el-table-column>
            <el-table-column prop="remark" label="说明" align="center"></el-table-column>            
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.removeable" icon="iconfont iconcaozuotubiao-shanchu-xuanfu" size="mini" @click="del(scope.row.itemId)"></el-button>
              </template>
            </el-table-column> 
          </el-table>
        </div>
      </div>
      <div class="bom">
        <div class="bom-btn">
          <el-button v-show="detail.status == 0 && permissionCheck" type="primary" @click='edit' style="background-color:#2368D3;">审核通过</el-button>
          <el-button v-show="detail.status == 1 && permissionPay" type="primary" @click='Receive' style="background-color:#2368D3;">收款</el-button>
          <el-button @click="back">关闭</el-button>
        </div>
      </div>
      <el-dialog title="添加记账明细" :visible.sync="dialogVisible" width="550px" class="checked" center="true"> 
        <el-form class="checkForm" label-width="90px">
          <el-form-item label="收费项目">
            <el-select  placeholder="请选择基础项"  size="mini" v-model="category" style="width:173px" @change="selectcate">
              <!-- <el-option label="基础项" value="基础项"></el-option>
              <el-option label="分摊项" value="分摊项"></el-option>
              <el-option label="消费项" value="消费项"></el-option>
              <el-option label="自带物品" value="自带物品"></el-option>
              <el-option label="补贴项" value="补贴项"></el-option> -->
              <el-option v-for="(item,index) in categoryList"  :label="item" :value="item" :key="index"></el-option>
            </el-select>
            <el-select  placeholder="请选择收费项目" value-key="title" size="mini" style="width:173px" v-model="shoufei" >
              <el-option v-for="item in shoufeilist" :key="item" :label="item.title" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消费周期">
            <el-date-picker v-model="interval[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
            <el-date-picker v-model="interval[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="应收金额">
            <el-input  placeholder="请输入应收金额" style="width:350px" v-model="amount" @input="inputChange"></el-input>&nbsp;&nbsp;元
          </el-form-item>
          <el-form-item label="说明">
            <el-input  placeholder="请输入备注" show-word-limit :maxlength="255" type="textarea" v-model="remark" rows="3" style="width:350px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addaccount">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>  
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { axios, permission } from "youban-utils";
import qs from 'qs'

export default {
  data(){
    return {
      billId:'',
      data:[],
      dialogVisible:false,
      detail:{},
      category:'',
      shoufei:'',
      shoufeilist:[],
      categoryList:[],
      interval:[],
      amount:'',
      remark:'',
      desc:'',
      permissionCheck: false, // 月度账单审核
      permissionPay: false, // 月度账单收款
    }
  },
  created(){
    this.permissionCheck = permission.hasPermission('uban.finance.bill.check');
    this.permissionPay = permission.hasPermission('uban.finance.bill.pay');
    this.billId = this.$route.params.id;
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
  filters:{
    billType:i=>i==1?'预定房间':i==2?'入院缴费':i==3?'月度结算':'离院结算 ',
    countFilter:val=>val?val:0
  },
  methods:{
    inputChange(e){
      if((this.category == '消费项' || this.category == '自带物品') && (e.split('.')[1] && e.split('.')[1].length >= 1)) {
        var b = parseFloat(e).toFixed(2);
        this.amount = b.substring(0,b.toString().length - 1);
      }
    },
    adddetail(){
      this.category = this.shoufei = this.amount = this.remark = '';
      this.interval=[];
      this.dialogVisible=true;
    },
    getdata(){
      axios.fetch('financeServer', "/accountBill/items",[this.billId],'json').then(res => {
        if(res.code ==200){
          this.detail = res.data[0];
          this.data = res.data[0].accountItemList
        }
      })
    },
    back(){
      window.localStorage.setItem('msg',true);
      window.opener=null;
      window.close();
    },
    selectcate(){
      axios.fetch('financeServer','/accountStandard/all',{category:this.category}).then(res=>{        
        if(res.code==200) {          
          let data = res.data,result= [],temp = [];      
          for(let i=0;i<data.length;i++){           
            if(temp.indexOf(data[i].title)==-1){              
              result.push(data[i]);
              temp.push(data[i].title);
            }
          }
          this.shoufeilist = result;
          this.shoufei = ''
          this.amount = ''
        }
      })
    },
    addaccount(){
      let [intervalStart,intervalEnd] = this.interval      
      let info = {
        billId :+this.billId,       //当前账单的ID
        category:this.category,
        title:this.shoufei.title,
        standardId:this.shoufei.standardId,
        evidence:this.shoufei.evidence,
        intervalStart,
        intervalEnd,
        amount:this.amount,
        remark:this.remark,
        elderId:this.detail.elderId
      }
      if( this.category && this.shoufei.title && this.shoufei.evidence && intervalStart && intervalEnd && this.amount !== ''){
        axios.fetch('financeServer','/accountItem/submit',info,'json').then(res=>{        
          if(res.code==200) {
            this.$message({message: '新增成功',type: 'success'});
            this.getdata();
            this.dialogVisible = false;
          }
        })
      } else {
        this.$message.warning('请将信息填写完整！')
        return false;
      }
    },
    edit(){
      // 如果是离院结算（4）就不检查是否还有未结清帐单
      if(this.detail.billType !== 4) {
        this.netEdit();
      } else {
        let params = {
          elderId: this.detail.elderId,
          status: 0
        }
        axios.fetch('financeServer','/accountBill/get/noCheck',params).then(res=>{        
          if(res.code==200) {
            if (res.total>0){
              this.$message.error('账款未结清，请联系财务确认！')
            } else {
              this.$confirm('确认通过审核?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.netEdit();
                }).catch(() => {});
            }
          }
        })
      }
    },
    netEdit(){
      let info = {
        billId:+this.billId,
        status:1,
        remark:this.desc,
        elderId:this.detail.elderId,
        billType:this.detail.billType
      }
      axios.fetch('financeServer','/accountBill/edit',info,'json').then(res=>{        
        if(res.code==200) {
          this.$message({message: '审核通过',type: 'success'});
          this.back();
        }
      })
    },
    del(id){
      this.$confirm('是否要删除该账单明细?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        let info = {billId:this.$route.params.id,itemId:id,status:-1}
        axios.fetch('financeServer','/accountItem/submit',info,'json').then(res=>{        
          if(res.code==200) {
            this.$message({message: '删除成功',type: 'success'});
            this.getdata();
          }
        })
      }).catch(() => {});
    },
    Receive(){
      // 如果是离院结算（4）就不检查是否还有未结清帐单
      if(this.detail.billType !== 4) {
        this.netCheck();
      } else {
        let params = {
          elderId: this.detail.elderId,
          status: 1
        }
        axios.fetch('financeServer','/accountBill/get/noCheck',params).then(res=>{        
          if(res.code==200) {
            if (res.total>0){
              this.$message.error('该用户有未收款的帐单！')
            } else {
              this.netCheck();
            }
          }
        })
      }
    },
    netCheck () {
      this.$confirm('确认收款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.fetch('financeServer','/accountBill/edit',{
            billId:+this.detail.billId,
            status:3,
            totalAmount:this.detail.receivableAmount,
            elderId:this.detail.elderId,
            billType:this.detail.billType
            },'json').then(res=>{        
            if(res.code==200) {
              this.$message({message: '收款成功',type: 'success'});
              // this.resolvedialogVisible = false;
              // this.getdata();
              this.back();
            }
          })
        }).catch(() => {});
    }
  },
}
</script>
<style lang="less" scoped>
/deep/.el-form-item{
  margin-bottom: 10px;
}
.info{
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 20px;
    div{
      &.title{
        background:rgba(251,251,252,1);
        height: 25px;
        border-bottom:1px solid rgba(221,221,221,1);
        padding:16px 30px 16px 20px;
        .el-button{
          float: right;
        }
        &::before{
          display: inline-block;
          vertical-align: top;
          content:'';
          width: 6px;
          margin-right: 15px;
          height: 25px;    
          background: #0078D4;
          border-radius:3px;
        }
      }
      &.cont1{
        padding:20px;
        p{
          margin-top: 10px;
          color: rgba(102,102,102,1);
          span{
            margin:0 15px 0 5px;
            font-weight: bold;
            &.s1{
              color: #EB6969;
            }
          }
          i{
            color: #F6812B;
            font-style: normal;
          }
        }
        div{
          margin-top: 20px;
          vertical-align: top;
          .el-textarea{
            display: inline-block;
            margin-top: 0;
            vertical-align: top;
            margin-left: 10px;
            line-height: 20px;
            width:500px;
          }
        }
        .el-button{
          min-width: auto;
          width: auto;
          border: none;
          padding: 0;
          font-size: 1.2rem;
        }
      }
      &.cont2{
        padding:20px;
      }
    }
}


.bom{
  background-color: #fff;
  padding:10px 0;
  // text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-left: -9px;
  .bom-btn {
    display: flex;
    justify-content: space-between;
    // display: inline-block;
    width: 230px;
    margin: 0 auto;
    transform: translateX(-50px);
    
  }
}
</style>