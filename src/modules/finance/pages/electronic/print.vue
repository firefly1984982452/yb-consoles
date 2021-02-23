<template>
    <div>
      <div class="page" v-for="(data,i) in datas" :key="i">

        <h2>{{data.data.tenantName}}费用结算明细</h2>
        <table class="first">
            <!-- <tr><td width="16%">姓名:{{data.data.elderName}}</td><td width="18%">结算月:{{data.data.billTitle}}</td><td width="41%">账单周期:{{data.data.periodStart}}至{{data.data.periodEnd}}</td><td width="25%" class="ri">本期消费:{{data.data.feeAmount}}元</td></tr> -->
            <tr><td>姓名:{{data.data.elderName}}</td><td>结算月:{{data.data.billTitle}}</td><td class="ri">本期消费:{{data.data.receivableAmount}}元&nbsp;&nbsp;&nbsp;&nbsp;账单号:{{data.data.billNo}}</td></tr>
            <!-- <tr><td colspan="2">账单号:{{data.billNo}}</td><td colspan="2" class="ri">打印时间:{{currentTIme}}</td></tr> -->
        </table>
        <table class="cen" border=1>
            <tr class="tableheader"><td width="14%">项目类别</td><td width="15%">类别明细</td><td width="32%">费用周期</td><td width="16%">金额(元)</td><td width="23%">说明</td></tr>

            <template v-if="data.d1.length>0">            
              <tr><td :rowspan="data.d1.length">基础项</td><td>{{data.d1[0].title}}</td><td>{{data.d1[0]|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && data.d1[0].amount < 0" style="color: #f00;">{{data.d1[0].amount}}</span>
                <span v-else>{{data.d1[0].amount}}</span>
              </td>
              <td>{{data.d1[0].remark}}</td></tr>
              <tr v-for="(item,index) in data.d1" v-if="index>0"><td>{{item.title}}</td><td>{{item|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && item.amount < 0" style="color: #f00;">{{item.amount}}</span>
                <span v-else>{{item.amount}}</span>
              </td>
              <td>{{item.remark}}</td></tr>
            </template>

            <template v-if="data.d2.length>0">            
              <tr><td :rowspan="data.d2.length">分摊项</td><td>{{data.d2[0].title}}</td><td>{{data.d2[0]|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && data.d2[0].amount < 0" style="color: #f00;">{{data.d2[0].amount}}</span>
                <span v-else>{{data.d2[0].amount}}</span>
              </td>
              <td>{{data.d2[0].remark}}</td></tr>
              <tr v-for="(item,index) in data.d2" v-if="index>0"><td>{{item.title}}</td><td>{{item|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && item.amount < 0" style="color: #f00;">{{item.amount}}</span>
                <span v-else>{{item.amount}}</span>
              </td>
              <td>{{item.remark}}</td></tr>
            </template>

            <template v-if="data.d3.length>0">            
              <tr><td :rowspan="data.d3.length">消费项</td><td>{{data.d3[0].title}}</td><td>{{data.d3[0]|interval}}</td>
                <td>
                <span v-if="data.data.billType == 3 && data.d3[0].amount < 0" style="color: #f00;">{{data.d3[0].amount}}</span>
                <span v-else>{{data.d3[0].amount}}</span>
              </td>
              <td>{{data.d3[0].remark}}</td></tr>
              <tr v-for="(item,index) in data.d3" v-if="index>0"><td>{{item.title}}</td><td>{{item|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && item.amount < 0" style="color: #f00;">{{item.amount}}</span>
                <span v-else>{{item.amount}}</span>
              </td>
              <td>{{item.remark}}</td></tr>
            </template>

             <template v-if="data.d4.length>0">            
              <tr><td :rowspan="data.d4.length">自带物品</td><td>{{data.d4[0].title}}</td><td>{{data.d4[0]|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && data.d4[0].amount < 0" style="color: #f00;">{{data.d4[0].amount}}</span>
                <span v-else>{{data.d4[0].amount}}</span>
              </td>
              <td>{{data.d4[0].remark}}</td></tr>
              <tr v-for="(item,index) in data.d4" v-if="index>0"><td>{{item.title}}</td><td>{{item|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && item.amount < 0" style="color: #f00;">{{item.amount}}</span>
                <span v-else>{{item.amount}}</span>
              </td>
              <td>{{item.remark}}</td></tr>
            </template>

            <template v-if="data.d5.length>0">            
              <tr><td :rowspan="data.d5.length">补贴项</td><td>{{data.d5[0].title}}</td><td>{{data.d5[0]|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && data.d5[0].amount < 0" style="color: #f00;">{{data.d5[0].amount}}</span>
                <span v-else>{{data.d5[0].amount}}</span>
              </td>
              <td>{{data.d5[0].remark}}</td></tr>
              <tr v-for="(item,index) in data.d5" v-if="index>0"><td>{{item.title}}</td><td>{{item|interval}}</td>
              <td>
                <span v-if="data.data.billType == 3 && item.amount < 0" style="color: #f00;">{{item.amount}}</span>
                <span v-else>{{item.amount}}</span>
              </td>
              <td>{{item.remark}}</td></tr>
            </template>
            <tr><td colspan="3">应收合计</td><td class='total'>{{data.data.receivableAmount}}</td><td></td></tr>
        </table>
      </div>
    </div>
</template>
<script>
export default{
  data(){
    return {
      // currentTIme:'',
      datas:[
      ],
    }
  },
  created(){    
    // this.currentTIme = this.getNowFormatDate();
    axios.fetch('financeServer', "/accountBill/items",this.$route.params.id.split(','),'json').then(res => {
      if(res.code ==200){
        if(res.data.length>0){
          res.data.forEach(item=>{
            const obj = {
              data:{},
              d1:[],d2:[],d3:[],d4:[],d5:[]
            }
            obj.data = item;
            let List = item.accountItemList;
            for(let i=0;i<List.length;i++){
              if(List[i].category=='基础项')          obj.d1.push(List[i]);
              else if(List[i].category=='分摊项')     obj.d2.push(List[i]);
              else if(List[i].category=='消费项')     obj.d3.push(List[i]);
              else if(List[i].category=='自带物品')   obj.d4.push(List[i]);
              else if(List[i].category=='补贴项')     obj.d5.push(List[i]);
            }
            this.datas.push(obj)
          })
        }
      }     
    })
  },
  filters:{
    // interval:row => row.title=='保证金' ? row.intervalStart : row.intervalStart + ' - ' + row.intervalEnd
    interval(row){
      if(row.intervalStart&&row.intervalEnd){
        return row.intervalStart+ '-' + row.intervalEnd;
      }
      if(row.intervalStart&&!row.intervalEnd){
        return row.intervalStart;
      }
      if(!row.intervalStart&&row.intervalEnd){
        return row.intervalEnd;
      }
      
    }
  },
  methods:{
    // getNowFormatDate(){
    //   var nowTime=new Date();
	  //   var month=nowTime.getMonth()+1;
    // 	var date=nowTime.getDate();
	  //   var seperator1="-";
	  //   var seperator2=":";
	  //   if(month>=1&&month<=9){
		//     month="0"+month;
	  //   }
	  //   if(date<=9){
		//     date="0"+date;
	  //   }
	  //   var currentDate=nowTime.getFullYear()+seperator1+month+seperator1+date+" "+
	  //   nowTime.getHours()+seperator2+nowTime.getMinutes()+seperator2+nowTime.getSeconds();
    //   return currentDate;
    // }
  }
}

</script>
<style lang="less" scoped>
    h2{
        text-align: center;        
        font-size: 25px;
        margin-bottom: 10px;
    }
    table{
        width:100%;
        margin-top: 10px;        
          // transform: scale(0.8);
        tr{
          font-size: 12px;
            line-height: 25px;
        }
        color: #333;
        .ri{
            text-align: right;
        }
        &.cen{
            text-align: center;
            td {
              transform: scale(0.8);
            }
        }
        td{
            &.total{color: #e00;}
        }
    }
    .first {
      td {
        transform: scale(0.8);
      }
    }
    
</style>