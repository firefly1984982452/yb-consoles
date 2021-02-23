<template>
    <div>
        <div class="detail">
            <div class="title"><el-button size="mini" @click="back">返回</el-button><strong>账单</strong></div>
        </div>
        <div class="content">
            <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}">
                <el-table-column prop="elderName" label="姓名" align="center"></el-table-column>
                <el-table-column label="来源单据类型" align="center">
                  <template slot-scope="scope">
                    {{scope.row.category|laiyuan}}
                  </template>
                </el-table-column>
                <el-table-column prop="changeId" label="来源单据编号" align="center"></el-table-column>
                <el-table-column prop="title" :label="type == 0 ? '托管费标准' : '护理费标准'" align="center">
                  <template slot-scope="scope">{{scope.row.currentFee+'元/月'}}</template>
                </el-table-column>
                <el-table-column prop="currentStart" label="开始时间" align="center"></el-table-column>
                <el-table-column prop="currentEnd" label="结束时间" align="center"></el-table-column>
                <el-table-column prop="remark" label="说明" align="center"></el-table-column>
                <el-table-column prop="creator" label="创建人" align="center"></el-table-column>
                 <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            data:[],
            type:''
        }
    },
    created(){
        this.type = this.$route.params.type;
        axios.fetch('elderServer', "/elderChange/elder",{elderId:this.$route.params.id}).then(res=>{
            if(res.code==200)
            this.data = res.data.filter(val => { return val.category == this.type});
        })
    },
    methods:{
        back(){
            this.$router.back()
        }
    },
    filters:{
      laiyuan(i){ 
        return i== 0  ? '床位变更': i==1 ?'床位调换' : '照护等级'
      }
    }
}
</script>
<style lang="less" scoped>
    .detail{
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 10px;
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
        }
    }

</style>