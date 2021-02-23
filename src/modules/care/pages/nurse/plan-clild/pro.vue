<template>
    <div class="page">
        <el-form :inline="true" class="search" >
            <el-form-item label="长者姓名">
                <ub-elder v-model="search.id" @change="item => search.elderName = item.elderName" clearable></ub-elder>
            </el-form-item>
            <el-form-item label="护理区域">
                <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
            </el-form-item>
            <el-form-item label="护理内容">
                <el-select filterable v-model="search.serviceId" clearable placeholder="请选择">
                    <el-option v-for="(item,index) in nursingCategoryList" :key="index" :label="item.itemTitle" :value="item.serviceId"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>    
            <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>      
        </el-form>
        <div class="content">
        <el-table
            class="ub-table"
            :data="tableData"
            border>
            <el-table-column prop="area" label="区域"></el-table-column>
            <el-table-column prop="elderName" label="护理对象"></el-table-column>
            <el-table-column prop="itemTitle" label="护理内容"></el-table-column>
            <el-table-column prop="deptId" label="计划类型">
                <template slot-scope="scope">
                    <span>{{scope.row.timeType | filterTimeType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="次数">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span>{{scope.row.frequency}}</span>次
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="开始时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span>{{scope.row.startTimeText}}</span> 
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="结束时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span>{{scope.row.endTimeText}}</span>
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="deptId" label="任务间隔">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span>{{scope.row.taskIntervalText}}</span>
                        <span v-if="scope.row.timeType > 3">天</span>
                        <span v-else>小时</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="任务时长">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span>{{scope.row.taskDurationText}}</span>小时
                    </span>
                </template>
            </el-table-column> -->
        </el-table>
        <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>

<script>
var that;
import ubElder from "@/components/elder";
export default {
    components: { ubElder,},
    data(){
        return {
            setArea:'',
            value:0,
            search:{
                id:'',
                elderName:'',
                areaId:'',
                serviceId:''
            },
            optionsPlanType:[],
            optionsWeek:[],
            pageSize:10,
            currentPage:1,
            total:0,
            tableData:[],
            nursingCategoryList:[],
        }
    },
    mounted(){
        this.optionsWeek = this.$constant.optionsWeek;
        this.optionsPlanType = this.$constant.optionsPlanType;
        this.getData();
        this.getCategoryList();
    },
    methods:{
        getArea(val){
            this.search.areaId = val.value;
            this.setArea = val.text;
        },
        // 获取护理项目
        getCategoryList() {
            axios.fetch("careServer", "/nursingService/get/byTargetType", {targetType: 0,schedulable:true}).then(res => {
                this.nursingCategoryList = res.data;
            });
        },
        getData(){
            let param = {
                pageIndex:this.currentPage,
                pageSize:this.pageSize,
                elderName:this.search.elderName,
                areaId:this.search.areaId,
                serviceId:this.search.serviceId
            } 
            axios.fetch("careServer", "/elderService/item/elder",param).then(res => {
                if(res.code ==200){
                    this.total = res.total;
                    this.tableData = res.data.map(val => {
                        val.isUpdate = true;
                        switch (val.timeType) {
                            // 0无，3每天，4每周，5每月
                            case 0:
                                val.taskIntervalText = 0;
                                val.startTimeText = val.timeStart;
                                val.endTimeText = val.timeEnd;
                                break;
                            case 3:
                                let numberStart = 4 - val.timeStart.toString().length;
                                let numberEnd = 4 - val.timeEnd.toString().length;
                                // 补位
                                val.timeStart = '0'.repeat(numberStart) + val.timeStart;
                                val.timeEnd = '0'.repeat(numberEnd) + val.timeEnd;
                                val.startTimeText = val.timeStart == 0 ? '00:00' : (val.timeStart.toString().slice(0,2)+':'+val.timeStart.toString().slice(2));
                                val.endTimeText = val.timeEnd == 0 ? '00:00' : (val.timeEnd.toString().slice(0,2)+':'+val.timeEnd.toString().slice(2));
                                // 任务间隔
                                var taskInterval = val.taskInterval/60;
                                val.taskIntervalText = Number.isInteger(taskInterval) ? taskInterval : taskInterval.toFixed(2);
                                break;
                            case 4:
                                val.startTimeText = this.optionsWeek[val.timeStart].label;
                                val.endTimeText = this.optionsWeek[val.timeEnd].label;
                                // 任务间隔
                                var taskInterval = val.taskInterval/60/24;
                                val.taskIntervalText = Number.isInteger(taskInterval) ? taskInterval : taskInterval.toFixed(2);
                                break;
                            case 5:
                                val.startTimeText = val.timeStart;
                                val.endTimeText = val.timeEnd;
                                // 任务间隔
                                var taskInterval = val.taskInterval/60/24;
                                val.taskIntervalText = Number.isInteger(taskInterval) ? taskInterval : taskInterval.toFixed(2);
                                break;
                        
                            default:
                                break;
                        }
                        // 任务时长
                        var taskDuration = val.taskDuration/60;
                        val.taskDurationText = Number.isInteger(taskDuration) ? taskDuration : taskDuration.toFixed(2);
                        return val;
                    })
                }
            })
        },
        handleChange(i){
            this.currentPage=i;
            this.getData();
        },
        reset(){
            if (this.$refs.areaCom !== undefined) {
                this.$refs.areaCom.resetArea();
                this.setArea = '';
            }
            this.currentPage = 1;
            this.search = {
                id:'',
                elderName:'',
                areaId:'',
                serviceId:''
            };
            this.getData();
        }
    },
    beforeCreate(){
        that = this;
    },
    filters:{
        filterTimeType:val=>{
            let index = that.optionsPlanType.findIndex(item => item.value == val);
            return that.optionsPlanType[index].label;
        },
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper {
  tr {
    height: 60px;
  }
}
.el-table{
    width: 90%;
    text-align: center;
    margin: 0 auto;
}
.footer{
    margin: 10px auto;
}
</style>