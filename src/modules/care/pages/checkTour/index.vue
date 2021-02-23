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
            <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>    
            <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>      
        </el-form>
        <div class="content">
            <el-row type="flex" class="pannel">
                <el-col class="right">
                    <el-button type="primary" @click="create">生成查房任务</el-button>
                    <el-button type="success" @click="add" >查房计划</el-button>
                </el-col>
            </el-row>
              <el-table
                class="ub-table"
                :data="data"
                row-key="id"
                border>
                <el-table-column prop="areaName" label="区域"></el-table-column>
                <el-table-column label="日期">
                    <template slot-scope="scope">
                        <span>{{scope.row.scheduleStart.substr(0,10)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="查房时段">
                    <template slot-scope="scope">
                        <span>{{scope.row.scheduleStart.substr(11,5)}} - 
                            {{scope.row.scheduleEndText}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="area" label="实查人数">
                    <template slot-scope="scope">
                        <span v-if="scope.row.doneCount > 0 && scope.row.doneCount !== scope.row.scheduleCount" style="color:#ffbe54;">{{scope.row.doneCount}}</span>
                        <span v-else>{{scope.row.doneCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="scheduleCount" label="应查人数"></el-table-column>
                <el-table-column label="查房记录">
                    <template slot-scope="scope">
                        <span>{{scope.row.itemCount}}条</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                            <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
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
export default {
    data(){
        return {
            setArea:'',
            search:{
                area:'',
                startTime:'',
                endTime:'',
            },
            pageSize:10,
            currentPage:1,
            total:0,
            data:[],
            areas:[],
            dialogNewVisible: false,
        }
    },
    mounted(){
        this.getdata();
    },
    methods:{
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
                pageIndex:this.currentPage,
                pageSize:this.pageSize,
                areaId:this.search.area,
                startTime:this.search.startTime,
                endTime:this.search.endTime
            } 
            axios.fetch("careServer", "/carePatrolTask/all",param).then(res => {
                if(res.code ==200){
                    this.total = res.total;
                    this.data = res.data.map(val => {
                        var start = this.$moment(val.scheduleStart).format("YYYY-MM-DD");
                        var end = this.$moment(val.scheduleEnd).format("YYYY-MM-DD");
                        if(this.$moment(start).isBefore(end)){
                            val.scheduleEndText = '（次日）' + val.scheduleEnd.substr(11,5);
                        } else {
                            val.scheduleEndText = val.scheduleEnd.substr(11,5);
                        }
                        return val;
                    });
                }
            })
        },
        create(){
            axios.fetch("careServer", "/carePatrolTask/generateTasks").then(res => {
                if(res.code ==200){
                    this.$message.success('生成成功！')
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
                path: "/care/checkTour/detail",
                query: {
                    val: JSON.stringify(val)
                }
            })
        },
        // 重置
        reset () {
            if (this.$refs.areaCom !== undefined) {
                this.$refs.areaCom.resetArea();
                this.setArea = '';
            }
            this.search = {
                area:'',
                startTime:'',
                endTime:'',
            };
            this.currentPage = 1;
            this.getdata()
        },
        add () {
            this.$router.push({
                path: "/care/checkTour/set"
            })
        },
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