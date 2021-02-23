<template>
    <div class="page">
        <el-table
            class="ub-table"
            :data="projectLife"
            border>
            <el-table-column prop="deptName" label="服务内容">
                <template slot="header">
                    <el-tooltip content="蓝色内容表示护理员在执行该内容时需要手动提交记录" placement="top">
                    <span>
                        服务内容
                        <i class="el-icon-info"></i>
                    </span>
                    </el-tooltip>
                </template>
                <template slot-scope="scope">
                    <span :class="{'blueRemark':scope.row.schedulable}">{{scope.row.itemTitle}}</span>
                </template>
            </el-table-column>
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
    </div>
</template>

<script>
var that;
export default {
    props:{
        id:'',
        roomId:''
    },
    watch:{
        id(){
            this.getDetail();
        }
    },
    data(){
        return {
            value:0,
            optionsPlanType:[],
            optionsWeek:[],
            projectLife:[],
        }
    },
    mounted(){
        console.log(this.$constant)
        this.optionsWeek = this.$constant.optionsWeek;
        this.optionsPlanType = this.$constant.optionsPlanType;
        if (this.id !== '') {
            this.getDetail();
        }
    },
    methods:{
        getDetail(){
            let param = {
                itemId:this.id,
                type:3,
                roomId:this.roomId
            } 
            axios.fetch("careServer", "/elderService/nursingProject/elder",param).then(res => {
                if(res.code ==200){
                    if(res.data.length > 0 && res.total == 1) {
                        this.total = res.total;
                        this.projectLife = res.data[0].careBuildingSchedules.map(val => {
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
                    } else {
                        this.$message.error('该长者没有数据，请返回！')
                    }
                }
            })
        },
        handleChange(i){
            this.currentPage=i;
            this.getData();
        },
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
.el-table{
    width: 80%;
    text-align: center;
    margin: 0 auto;
}
.blueRemark {
    color: rgb(0, 119, 255);
}
</style>