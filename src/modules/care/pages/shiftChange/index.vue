<template>
    <div>
        <el-form :inline="true" class="search" >
            <el-form-item label="日期">
                <el-date-picker v-model="search.startTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
                <el-date-picker v-model="search.endTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="区域">
                <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
            </el-form-item>
            <!-- <el-form-item label="班次">
                <el-select v-model="search.workTimeId" clearable placeholder="请选择">
                    <el-option :label="item.timeName" :key="item.timeId" v-for="item in workTimeList" :value="item.timeId"></el-option>
                </el-select>
            </el-form-item> -->
            <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>    
            <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>      
            <el-button style="float:right" icon="el-icon-s-tools" @click="shiftSet">交班设置</el-button>      
        </el-form>
        <div class="content">
              <el-table
                class="ub-table"
                :data="data"
                row-key="id"
                border>
                <el-table-column prop="areaName" label="区域"></el-table-column>
                <el-table-column label="日期">
                    <template slot-scope="scope">
                        <span>{{scope.row.reportDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="workTimeName" label="班次"></el-table-column>
                <el-table-column prop="leaderName" label="交班班长"></el-table-column>
                <el-table-column prop="num" label="记录数量"></el-table-column>
                <el-table-column label="交班时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime.substr(0,16)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                            <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="打印" placement="top-end">
                            <el-button size="mini" @click="print(scope.row)" icon="iconfont iconcaozuotubiao-dayin"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!-- 添加护理任务 -->
        <el-dialog center title="添加护理任务" :visible.sync="dialogNewVisible" width="30%">
            <!-- <add-duty ref="duty" @refresh="fresh" @close="dialogNewVisible = false" /> -->
        </el-dialog>
    </div>
</template>

<script>
import printMethods from '@/utils/print';
export default {
    data(){
        return {
            setArea:'',
            search:{
                area:'',
                startTime:'',
                endTime:'',
                workTimeId:''
            },
            pageSize:10,
            currentPage:1,
            total:0,
            data:[],
            areas:[],
            dialogNewVisible: false,
            workTimeList:[],
        }
    },
    mounted(){
        this.getdata();
    },
    // watch: {
    //     setArea: {
    //         handler(val,old){
    //             this.search.workTimeId = '';
    //             this.getWorkTime(this.search.area);
    //         },
    //         deep:true
    //     }
    // },
    methods:{
        ...printMethods,
        getWorkTime(areaId){
            if(areaId){

                axios.fetch("careServer", "/carePatrolReport/workTime", {areaId}).then(res => {
                    this.workTimeList = res.data;
                });
            }  else {
                 this.workTimeList
                }
        },
        getArea(val){
            this.search.area = val.value;
            this.setArea = val.text;
        },
        fresh(){
            this.dialogNewVisible = false;
            this.getdata();
        },
        getdata(){
            var beginDate = this.search.startTime || '';
            var endDate = this.search.endTime || '';
            var d1 = new Date(beginDate.replace(/\-/g, "/"));
            var d2 = new Date(endDate.replace(/\-/g, "/"));
            if (beginDate != "" && endDate != "" && d1 > d2) {
                this.$message.error("开始时间不能大于结束时间");
                this.$forceUpdate();
                return;
            }
            let param = {
                isMyReport: false,
                pageIndex:this.currentPage,
                pageSize:this.pageSize,
                areaId:this.search.area,
                startTime:this.search.startTime,
                endTime:this.search.endTime,
                workTimeId:this.search.workTimeId
            } 
            axios.fetch("careServer", "/carePatrolReport/all",param).then(res => {
                if(res.code ==200){
                    this.total = res.total;
                    this.data = res.data;
                }     
            })
        },
        handleChange(i){
            this.currentPage=i;
            this.getdata();
        },
        // 编辑
        detail(val){
            this.$router.push({
                path: "/care/shiftChange/detail",
                query: {
                    id: val.id
                }
            })
        },
        // 重置
        reset () {
            if (this.$refs.areaCom !== undefined) {
                this.$refs.areaCom.resetArea();
                this.setArea = '';
            }
            this.workTimeList = [];
            this.search = {
                area:'',
                startTime:'',
                endTime:'',
                workTimeId:''
            };
            this.currentPage = 1;
            this.getdata()
        },
        // 交班设置
        shiftSet(){
            this.$router.push({
                path:'shiftChange/shiftSet'
            })
        },
        print(data){
            this.openPrint({
                path:'/print/elder/shiftReport',
                query: {
                   id:data.id
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.text-red{
    color:#f00;
}
.text-blue{
    color:#62c2f2
}
</style>