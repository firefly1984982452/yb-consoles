<template>
    <div class="page">
        <el-table
            class="ub-table"
            :data="projectLife"
            show-summary
            :summary-method="getSummaries"
            :span-method="cellMerge"
            border>
            <el-table-column label="服务分类">
                <template slot-scope="scope">
                    <span>{{scope.row.categoryType | filterCategoryType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="category" label="服务内容分类"></el-table-column>
            <el-table-column prop="itemTitle" label="服务内容">
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
            <el-table-column label="是否确认">
                <template slot-scope="scope">
                    {{scope.row.status | filterStatus}}
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="计划类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.isUpdate">{{scope.row.timeType | filterTimeType}}</span>
                    <el-select v-else style="width:100px" @change="changeType(scope.$index)" size="mini" v-model="scope.row.timeType" placeholder="请选择">
                        <el-option
                            v-for="item in optionsPlanType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="次数">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span v-if="scope.row.isUpdate">{{scope.row.frequency}}</span>
                        <input 
                            v-else
                            style="width:100px" 
                            class="el-input__inner" 
                            type="number" 
                            v-model="scope.row.frequency" 
                            placeholder="请输入内容" />次
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="开始时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span v-if="scope.row.isUpdate">{{scope.row.startTimeText}}<span v-show="scope.row.timeType == 5">号</span></span>
                        <div v-else>
                            <el-time-picker
                                v-if="scope.row.timeType == 3"
                                style="width:100px"
                                value-format="HH:mm"
                                format="HH:mm"
                                v-model="scope.row.startTimeText"
                                placeholder="时间">
                            </el-time-picker>
                            <el-select v-if="scope.row.timeType == 4" style="width:100px" size="mini" v-model="scope.row.startTimeText" placeholder="请选择">
                                <el-option
                                    v-for="item in optionsWeek"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div v-if="scope.row.timeType == 5">
                                <input 
                                    style="width:100px" 
                                    class="el-input__inner" 
                                    type="number" 
                                    min="1" 
                                    max="31"
                                    v-model="scope.row.startTimeText" 
                                    placeholder="请输入内容" />号
                            </div>
                        </div>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="deptId" label="结束时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span v-if="scope.row.isUpdate">{{scope.row.endTimeText}}<span v-show="scope.row.timeType == 5">号</span></span>
                        <div v-else>
                            <el-time-picker
                                v-if="scope.row.timeType == 3"
                                style="width:100px"
                                value-format="HH:mm"
                                format="HH:mm"
                                v-model="scope.row.endTimeText"
                                placeholder="时间">
                            </el-time-picker>
                            <el-select v-if="scope.row.timeType == 4" style="width:100px" size="mini" v-model="scope.row.endTimeText" placeholder="请选择">
                                <el-option
                                    v-for="item in optionsWeek"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div v-if="scope.row.timeType == 5">
                                <input 
                                    style="width:100px" 
                                    class="el-input__inner" 
                                    type="number" 
                                    min="1" 
                                    max="31"
                                    v-model="scope.row.endTimeText" 
                                    placeholder="请输入内容" />号
                            </div>
                        </div>
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="deptId" label="任务间隔">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span v-if="scope.row.isUpdate">{{scope.row.taskIntervalText}}</span>
                        <input 
                            v-else
                            style="width:100px" 
                            class="el-input__inner" 
                            type="number" 
                            v-model="scope.row.taskIntervalText" 
                            placeholder="请输入内容" />
                            <span v-if="scope.row.timeType > 3">天</span>
                            <span v-else>小时</span>
                    </span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column prop="deptId" label="任务时长">
                <template slot-scope="scope">
                    <span v-if="scope.row.timeType == 0">-</span>
                    <span v-else>
                        <span v-if="scope.row.isUpdate">{{scope.row.taskDurationText}}</span>
                        <input 
                            v-else
                            style="width:100px" 
                            class="el-input__inner" 
                            type="number" 
                            v-model="scope.row.taskDurationText" 
                            placeholder="请输入内容" />小时
                    </span>
                </template>
            </el-table-column> -->
            <el-table-column prop="deptId" label="操作">
                <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.isUpdate" effect="dark" content="编辑" placement="top-end">
                        <i @click="update(scope.$index)" class="iconfont iconcaozuotubiao-bianji"></i>
                    </el-tooltip>
                    <div v-else>
                        <el-tooltip effect="dark" content="保存" placement="top-end">
                            <i @click="save(scope.$index)" class="iconfont iconcaozuotubiao-baocun"></i>
                        </el-tooltip>
                        <el-tooltip  style="margin:0 0 0 10px" effect="dark" content="取消" placement="top-end">
                            <i @click="cancel(scope.$index)" class="iconfont iconcaozuotubiao-quxiao"></i>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px;float:right;">
            <el-button @click="updateAll">批量编辑</el-button>
        </div>
        <div class="footer">
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="resetForm">取消</el-button>
        </div>
    </div>
</template>

<script>
var that;
export default {
    props:{
        id:''
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
            nursingLevel:0,
        }
    },
    mounted(){
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
                type:2
            } 
            axios.fetch("careServer", "/elderService/nursingProject/elder",param).then(res => {
                if(res.code ==200){
                    if(res.data.length > 0 && res.total == 1) {
                        this.nursingLevel = res.data[0].nursingLevel;
                        this.projectLife = res.data[0].elderServiceItems.map(val => {
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
                        this.getSpanArr();
                    } else {
                        this.$message.error('该长者没有数据，请返回！')
                    }
                }
            })
        },
        updateAll(){
            this.projectLife.forEach((val,index) => {
                this.update(index);
            });
        },
        // 编辑时先获取模板
        update(index){
            this.loading = true;
            if (this.projectLife[index].timeType == 0) {
                let param = {
                    targetType: 0,
                    targetValue:this.nursingLevel,
                    serviceId:this.projectLife[index].serviceId
                }
                axios.fetch("careServer", "/nursingSchedule/get/byTargetValue",param).then(res => {
                    if(res.code ==200){
                        this.projectLife[index].isUpdate = false;
                        if(res.data.length > 0) {
                            let val = res.data[0];
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
                            console.log(val,'=====val');
                            
                            // 任务时长
                            var taskDuration = val.taskDuration/60;
                            val.taskDurationText = Number.isInteger(taskDuration) ? taskDuration : taskDuration.toFixed(2);
                            this.projectLife[index].timeType = val.timeType;
                            this.projectLife[index].frequency = val.frequency;
                            this.projectLife[index].timeStart = val.timeStart;
                            this.projectLife[index].timeEnd = val.timeEnd;
                            this.projectLife[index].startTimeText = val.startTimeText;
                            this.projectLife[index].endTimeText = val.endTimeText;
                            this.projectLife[index].taskInterval = val.taskInterval;
                            this.projectLife[index].taskDuration = val.taskDuration;
                            this.projectLife[index].taskIntervalText = val.taskIntervalText;
                            this.projectLife[index].taskDurationText = val.taskDurationText;

                        } else {
                            this.$message.closeAll();
                            this.$message.warning('该项没有模板，请自行配置。')
                        }
                    }
                })
            } else {
                console.log(this.projectLife[index])
                this.projectLife[index].isUpdate = false;
            }
        },
        // 保存单个
        save(index) {
            let list = [];
            if(this.saveItem(index, list) === true) {
                this.saveItems(list,'one');
            }
        },
        saveItems(list,type) {
            if(!list || list.length <= 0) {
                return;
            }
            axios.fetch("careServer", "/elderService/saveItemPlan", list,'json').then(res => {
                if(res.code ==200){
                    this.$message.success('修改成功！');
                    list.forEach(item => item.isUpdate = true);
                    // if(type == 'all') {
                        this.getDetail();
                    // }
                }
            })
        },
        saveItem(index, list){
            console.log(this.projectLife[index])
            switch (this.projectLife[index].timeType) {
                // 0无，3每天，4每周，5每月
                case 0:
                    break;
                case 3:
                    if(this.projectLife[index].frequency == 0){
                        this.$message.closeAll();
                        return this.$message.error('次数不能为0！')
                    }
                    if (this.projectLife[index].frequency == '') {
                        this.$message.closeAll();
                        return this.$message.error('次数不能为空！')
                    }
                    this.projectLife[index].taskInterval = parseInt(this.projectLife[index].taskIntervalText*60);
                    this.projectLife[index].taskDuration = parseInt(this.projectLife[index].taskDurationText*60);
                    if(this.projectLife[index].taskInterval>24*60){
                        this.$message.closeAll();
                        return this.$message.error('任务间隔不得超过24小时')
                    }
                    if(this.projectLife[index].taskInterval<= (0.01*60)){
                        this.$message.closeAll();
                        return this.$message.error('任务间隔不得小于1分钟')
                    }
                    if(this.projectLife[index].taskDuration>24*60){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得超过24小时')
                    }
                    if(this.projectLife[index].taskDuration <= (0.01*60)){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得小于1分钟')
                    }
                    if(this.projectLife[index].startTimeText>=this.projectLife[index].endTimeText){
                        this.$message.closeAll();
                        return this.$message.error('开始时间不能大于或等于结束时间')
                    }
                    this.projectLife[index].timeStart = this.projectLife[index].startTimeText.replace(':','');
                    this.projectLife[index].timeEnd = this.projectLife[index].endTimeText.replace(':','');
                    break;
                case 4:
                    if(this.projectLife[index].frequency == 0){
                        this.$message.closeAll();
                        return this.$message.error('次数不能为0！')
                    }
                    if (this.projectLife[index].frequency == '') {
                        this.$message.closeAll();
                        return this.$message.error('次数不能为空！')
                    }
                    this.projectLife[index].taskInterval = parseInt(this.projectLife[index].taskIntervalText*60*24);
                    this.projectLife[index].taskDuration = parseInt(this.projectLife[index].taskDurationText*60);
                    if(this.projectLife[index].taskInterval>7*60*24){
                        this.$message.closeAll();
                        return this.$message.error('任务间隔不得超过7天')
                    }
                    if(this.projectLife[index].taskDuration>24*7*60){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得超过24*7小时')
                    }
                    if(this.projectLife[index].taskDuration <= (0.01*7*60)){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得小于1分钟')
                    }
                    let timeStart = this.projectLife[index].startTimeText;
                    let timeEnd = this.projectLife[index].endTimeText;
                    let start = timeStart;
                    let end = timeEnd;

                    if(typeof timeStart == 'string') {
                        let startIndex = this.optionsWeek.findIndex(item => item.label == timeStart);
                        start = this.optionsWeek[startIndex].value;
                    }
                    if (typeof timeEnd == 'string') {
                        let endIndex = this.optionsWeek.findIndex(item => item.label == timeEnd);
                        end = this.optionsWeek[endIndex].value;
                    }
                    // start = start == 0 ? 7 : start;
                    // end = end == 0 ? 7 : end;
                    if(start>end){
                        this.$message.closeAll();
                        return this.$message.error('开始时间不能大于结束时间')
                    }
                    this.projectLife[index].timeStart = start == 7 ? 0 : start;
                    this.projectLife[index].timeEnd = end == 7 ? 0 : end;
                    break;
                case 5:
                    if(this.projectLife[index].frequency == 0){
                        this.$message.closeAll();
                        return this.$message.error('次数不能为0！')
                    }
                    if (this.projectLife[index].frequency == '') {
                        this.$message.closeAll();
                        return this.$message.error('次数不能为空！')
                    }
                    this.projectLife[index].taskInterval = parseInt(this.projectLife[index].taskIntervalText*60*24);
                    this.projectLife[index].taskDuration = parseInt(this.projectLife[index].taskDurationText*60);
                    if(this.projectLife[index].startTimeText<1){
                        this.$message.closeAll();
                        return this.$message.error('开始时间不能小于1号')
                    }
                    if(this.projectLife[index].startTimeText>=this.projectLife[index].endTimeText){
                        this.$message.closeAll();
                        return this.$message.error('开始时间不能大于或等于结束时间')
                    }
                    if(this.projectLife[index].startTimeText>31*60*24){
                        this.$message.closeAll();
                        return this.$message.error('结束时间不能超过每月月末')
                    }
                    if(this.projectLife[index].taskInterval>31*60*24){
                        this.$message.closeAll();
                        return this.$message.error('任务间隔不得超过31天')
                    }
                    if(this.projectLife[index].taskDuration>31*7*60*24){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得超过31*7小时')
                    }
                    if(this.projectLife[index].taskDuration <= (0.01*7*60)){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得小于1分钟')
                    }
                    this.projectLife[index].timeStart = this.projectLife[index].startTimeText;
                    this.projectLife[index].timeEnd = this.projectLife[index].endTimeText;
                    break;
            
                default:
                    break;
            }
            this.projectLife[index].status = 100;
            // let arr = [];
            list.push(this.projectLife[index]);
            return true;
            /*
            axios.fetch("careServer", "/elderService/saveItemPlan",arr,'json').then(res => {
                if(res.code ==200){
                    this.$message.success('修改成功！');
                    this.projectLife[index].isUpdate = true;
                    this.getDetail();
                }
            })*/
        },
        // 改变计划类型
        changeType(index){
            this.projectLife[index].frequency = 1;
            this.projectLife[index].taskIntervalText = 1;
            this.projectLife[index].taskDurationText = 1;
            switch (this.projectLife[index].timeType) {
                // 0无，3每天，4每周，5每月
                case 0:
                    
                    break;
                case 3:
                    this.projectLife[index].startTimeText = '00:00';
                    this.projectLife[index].timeStart = 0;
                    this.projectLife[index].endTimeText = '23:59';
                    this.projectLife[index].timeEnd = 2359;
                    
                    break;
                case 4:
                    this.projectLife[index].startTimeText = 1;
                    this.projectLife[index].timeStart = 1;
                    this.projectLife[index].endTimeText = 0;
                    this.projectLife[index].timeEnd = 0;
                    break;
                case 5:
                    this.projectLife[index].startTimeText = 1;
                    this.projectLife[index].timeStart = 1;
                    let end = this.$moment().endOf('month').format("DD");
                    this.projectLife[index].endTimeText = end;
                    this.projectLife[index].timeEnd = end;
                    break;
            
                default:
                    break;
            }
        },
        cancel(index){
            this.projectLife[index].isUpdate = true;
            this.getDetail();
        },
        // 批量保存
        submitForm(){
            let has  = this.projectLife.some(val => {
                return !val.isUpdate
            })
            if(has) {
                let list = [];
                this.projectLife.map((val,index) => {
                    if(!val.isUpdate){
                        if(this.saveItem(index, list) !== true) {
                            return;
                        }
                    }
                })
                this.saveItems(list,'all');
            } else {
                this.$message.warning('当前没有修改选项，已保存最新项目');
            }
        },
        resetForm(){
            // this.projectLife.map(val => {
            //     if(!val.isUpdate){
            //         val.isUpdate = true;
            //     }
            // })
            // this.getDetail();
            window.opener = null;
            window.close();
        },
        //获取spanArr
        getSpanArr() {　
            let data = this.projectLife;
            this.spanArr = [];
            this.contentSpanArr = [];
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0;
                    this.contentSpanArr.push(1);
                    this.position = 0;
                } else {
                    // 判断当前元素与上一个元素是否相同(第1和第2列)
                    if (data[i].categoryType === data[i - 1].categoryType
                        && data[i].category === data[i-1].category) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
        cellMerge({ row, column, rowIndex, columnIndex }) {
             if (columnIndex === 0 || columnIndex === 1) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index == 0) {
                    sums[index] = '合计项';
                    return;
                }
                if (index == 4) {
                    var leng = data.filter(val => {return val.status == 100}).length
                    sums[index] = leng + ' 项';
                    return;
                }
            });

            return sums;
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
        filterStatus: val => {
            if(val == 0) {
                return '否';
            } else {
                return '是';
            }
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper {
  tr {
    height: 60px;
  }
}
.table{
    width: 90%;
    text-align: center;
    margin: 0 auto;
}
.footer{
    margin: 10px auto;
}
.blueRemark {
    color: rgb(0, 119, 255);
}
</style>