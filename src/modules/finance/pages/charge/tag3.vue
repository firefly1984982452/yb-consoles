<template>
  <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}">
    <el-table-column prop="itemType" label="收费项" align="center"></el-table-column>
    <el-table-column  label="收费标准" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.feeAmount=='-1'">按实</span>
        <span v-else>{{scope.row.feeAmount + scope.row.feeAmountRemark}}</span>
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
</template>
<script>
  export default{
    data(){
      return {
        data:[]
      }
    },
    created(){
      axios.fetch('financeServer', "/accountStandard/all",{category:'消费项'}).then(res => {
        if(res.code == 200){
          this.data = res.data;
        }
      })
    }
  }
</script>
<style lang="less" scoped>

</style>