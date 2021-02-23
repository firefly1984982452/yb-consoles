<template>
  <div>
      <div class="desc">
        <div class="title"><el-button size="mini" @click="back">返回</el-button><strong>账单</strong></div>
        <div class="cont">
          <ul>
            <li><span>姓名</span><strong>{{detail.elderName}}</strong></li>
            <li><span>楼宇房间</span><strong>{{detail.buildingName +' ' + detail.roomName}}</strong></li>
            <li><span>审核人</span><strong>{{detail.auditorName}}</strong></li>
            <li class="r"><span>审核时间</span><strong>{{detail.auditTime}}</strong></li>

            <li><span>账单编号</span><strong>{{detail.billNo}}</strong></li>
            <li><span>收款方式</span><strong>{{detail.payMethod}}</strong></li>
            <li><span>收款人</span><strong>{{detail.payeeName}}</strong></li>
            <li class="r"><span>收款时间</span><strong>{{detail.payTime}}</strong></li>

            <li><span>费用</span><strong>{{detail.feeAmount}}元</strong></li>
            <li><span>长护险</span><strong>{{detail.deductAmount}}元</strong></li>
            <li><span>应收</span><strong>{{detail.receivableAmount}}元</strong></li>
            <li class="r"><span>实收</span>
            <strong style="width:80%;!important">{{detail.totalAmount}}元 （&nbsp;发票{{detail.invoiceAmount}}元&nbsp;&nbsp;&nbsp;收据{{detail.receiptAmount}}元&nbsp;&nbsp;&nbsp;代收代付{{ detail.buyAmount | amouontFilter}}元&nbsp;）</strong>
            </li>

            <li class="bom"><span>说明</span><strong>{{detail.remark}}</strong></li>
          </ul>
        </div>

      </div>
      
      <div class="info">
        <div class="title">账单明细</div>
        <div class="cont1">
          <el-table :data="detail.accountItemList" border :header-cell-style="{background:'#F3F3F5'}">
            <el-table-column prop="title" label="收费项目" align="center"></el-table-column>
            <!-- <el-table-column prop="shoufeif" label="收费标准" align="center"></el-table-column> -->
            <el-table-column label="消费周期" align="center" width="300">
              <template slot-scope="scope">
                <span v-if="scope.row.intervalStart">{{ scope.row.intervalStart }}</span>
                <span v-if="scope.row.intervalStart&&scope.row.intervalEnd">-</span>
                <span v-if="scope.row.intervalEnd">{{ scope.row.intervalEnd }}</span>             
              </template>
            </el-table-column>
            <el-table-column label="金额(元)" align="center">
              <template slot-scope="scope">
                <span v-if="detail.billType == 3 && scope.row.amount < 0" style="color:#f00;">{{scope.row.amount}}</span>
                <span v-else>{{scope.row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="明细来源" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"  ></el-table-column>
            <el-table-column prop="remark" label="说明" align="center"></el-table-column>            
            <!-- <el-table-column prop="desc1" label="系统备注" align="center"></el-table-column>           -->
          </el-table>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      data:[],
      detail:{}
    }
  },
  methods:{
    back(){
      window.localStorage.setItem('msg',true);
      window.opener=null;
      window.close();
    }
  },
  created(){
    axios.fetch('financeServer', "/accountBill/items",this.$route.params.id.split(','),'json').then(res => {
      if(res.code ==200){
        console.log(res)
        this.detail = res.data[0];
      }
    })
  },
  filters: {
    amouontFilter: function(value) {
      return value?value:0;
    }
  }

}
</script>
<style lang="less" scoped>
.desc{
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 20px;
    div{ 
      &.title{
        height: 37px;
        border-bottom:1px solid rgba(221,221,221,1);        
        padding:10px 0 10px 20px;
        .el-button{
          width: 60px;
          height: 34px;
          padding:0;
          min-width: 0;
        }
        strong{
          margin-left: 10px;
        }
      }  
      &.cont{
        padding:20px;
        ul{          
          border:1px solid #EBEEF5;          
          li{
            display: block;
            width: 20%;
            float: left;
            box-sizing: border-box;
            border-right:  1px solid #EBEEF5;
            border-bottom: 1px solid #EBEEF5;
            display: flex;
            align-items: center;
            // height: 48px;
            line-height: 48px;
            &.r{
              width: 40%;
              span{
                width: 20%;
              }    
            }
            &.bom{
              width: 100%;
              border-bottom: none;
              span{
                width:8%;           
              }
              strong{
                padding-left: 20px;
                
                text-align: left;
              }
            }
            span{
              width: 40%;
              display: inline-block;
              text-align: center;
              background: rgba(248,248,248,1);
              height: 48px;
              vertical-align: top;
            }
            strong{
              width: 60%;
              text-align: center;
              display: inline-block;
              vertical-align: top;
              color: #333;
              font-weight:550;
            }
           
          }
          &::after{
            display: block;
            content:'';
            clear: both;

          }
        }
      }
    }


}
.info{
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 20px;
    div{
      &.title{
        background:rgba(251,251,252,1);
        height: 21px;
        border-bottom:1px solid rgba(221,221,221,1);        
        padding:18px 0 18px 20px;
        &::before{
          display: inline-block;
          vertical-align: top;
          content:'';
          width: 8px;
          margin-right: 5px;
          height: 21px;    
          background: #0078D4;
        }
      }
      &.cont1{
        padding:20px;
      }
    }
}


</style>