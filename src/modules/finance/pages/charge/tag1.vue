<template>
    <div>
        <p class="tag tag1">保证金</p>
        <el-table :data="d1" border :header-cell-style="{background:'#F3F3F5'}">
        <el-table-column prop="title" label="收费项" align="center"></el-table-column>
        <el-table-column prop="feeAmount" :label="'收费标准(元/次)'" align="center"></el-table-column>
        <el-table-column prop="evidence" label="凭证" align="center"></el-table-column>
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
        <!-- <el-table-column label="操作" align="center">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
        </el-table-column> -->
        </el-table>

        <p class="tag tag2">托管费</p>
        <el-table :data="d2" border :header-cell-style="{background:'#F3F3F5'}">
        <el-table-column prop="itemType" label="收费项" align="center"></el-table-column>
        <el-table-column label="收费标准"  align="center">
            <el-table-column align="center" label="">
                <template slot-scope="scope">
                {{scope.row.feeAmount+'元/月'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="" >
                <template slot-scope="scope">
                {{scope.row.feeAmountDay+'元/天'}}
                </template>
            </el-table-column>
        </el-table-column>          
        <el-table-column prop="evidence" label="凭证" align="center"></el-table-column>
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
        <!-- <el-table-column label="操作" align="center">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
        </el-table-column> -->
        </el-table>

        <p class="tag tag3">护理费</p>
        <el-table :data="d3" border :header-cell-style="{background:'#F3F3F5'}">
        <el-table-column prop="itemType" label="收费项" align="center"></el-table-column>
        <el-table-column label="收费标准"  align="center">
            <el-table-column align="center" label="" >
                <template slot-scope="scope">
                {{scope.row.feeAmount+'元/月'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="">
                <template slot-scope="scope">
                {{scope.row.feeAmountDay+'元/天'}}
                </template>
            </el-table-column>
        </el-table-column>           
        <el-table-column prop="evidence" label="凭证" align="center"></el-table-column>
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
        <!-- <el-table-column label="操作" align="center">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
        </el-table-column> -->
        </el-table>

        <p class="tag tag4">膳食费</p>
        <el-table :data="d4" border :header-cell-style="{background:'#F3F3F5'}">
        <el-table-column prop="itemType" label="收费项" align="center"></el-table-column>
        <el-table-column label="收费标准" align="center">
          <template slot-scope="scope">
            {{scope.row.feeAmountDay+scope.row.feeAmountRemark}}
          </template>        
        </el-table-column>
        <el-table-column prop="evidence" label="凭证" align="center"></el-table-column>
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
        <!-- <el-table-column label="操作" align="center">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
        </el-table-column> -->
        </el-table>

        <p class="tag tag5">订金</p>
        <el-table :data="d5" border :header-cell-style="{background:'#F3F3F5'}">
        <el-table-column prop="itemType" label="收费项" align="center"></el-table-column>
        <el-table-column prop="feeAmountDay" label="收费标准" align="center">
          <!-- <template slot-scope="scope">
            {{scope.row.feeAmountDay+scope.row.feeAmountRemark}}
          </template>    -->
          <span>按实</span>
        </el-table-column>
        <el-table-column prop="evidence" label="凭证" align="center"></el-table-column>
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
        <!-- <el-table-column label="操作" align="center">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
        </el-table-column> -->
        </el-table>
    </div>
</template>
<script>
  export default{
    data(){
      return {       
        d1:[],d2:[],d3:[],d4:[],d5:[]
      }
    },
    created(){
      axios.fetch('financeServer', "/accountStandard/all",).then(res => {
        if(res.code == 200){
          let data  = res.data;
          for(let i = 0; i < data.length; i++){
            switch(data[i].title){
              case "保证金": this.d1.push(data[i]); break;
              case "托管费": this.d2.push(data[i]); break;
              case "护理费": this.d3.push(data[i]); break;
              case "膳食费": this.d4.push(data[i]); break;
              case "订金":   this.d5.push(data[i]); break;
            }
          }
        }
      })
    }
  }
</script>
<style lang="less" scoped>
.table {
  tr:nth-child(2) {
	display: none;
}
} 

.tag{
  line-height: 18px;
  margin:20px auto 15px;
  &::before{
    display: inline-block;
    vertical-align: top;
    content:'';
    width: 8px;
    margin-right: 5px;
    height: 16px;    
  }
}
.tag1{&::before{background: #4A58F3;}}
.tag2{
  &::before{background: #F26161;}
}
.tag3{&::before{background: #FEB200;}}
.tag4{&::before{background: #0E9E6D;}}
.tag5{&::before{background: #6425F5;}}


/deep/ table{
  thead{
    tr:nth-child(2){
      display: none;
    }

  }
}
/deep/ .iconfont iconcaozuotubiao-bianji{color:#222;}
</style>