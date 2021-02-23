<template>
    <div>
        <el-form :rules="rules" label-width="80px" :model="addInfo" ref='addInfo'>
            <el-form-item label="护理内容" prop="targetType">
                <el-select filterable @change="changeTargetType" v-model="addInfo.targetType" value-key="serviceId" placeholder="请选择护理内容" clearable>
                    <el-option v-for="(item,index) in nursingCategoryList" :key="index" :label="item.itemTitle" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="addInfo.targetType.targetType == 0">
                <label slot="label"><i style="color: #f00;">*</i>&nbsp;长者姓名</label>
                <ub-elder :status="[100]" v-model="addInfo.targetValue"  @change='changeElder'></ub-elder>
            </el-form-item>
            <el-form-item v-if="addInfo.targetType.targetType == 1">
                <label slot="label"><i style="color: #f00;">*</i>&nbsp;房间号</label>
                <el-select filterable v-model="addInfo.roomInfo" @change="changeRoom" value-key="roomId" placeholder="请选择房间号">
                    <el-option :label="item.roomName" :value="item" v-for="item in roomList" :key="item.roomId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务类型" prop="scheduleType">
                <el-select @change="changeType" v-model="addInfo.scheduleType" placeholder="请选择">
                    <el-option
                        v-for="item in optionsPlanType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="执行时间" prop="date1">
                <el-col :span="11">
                    <el-date-picker
                        v-if="addInfo.scheduleType == 3"
                        type="datetime"
                        style="width:200px"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        @input="startTimeChange"
                        v-model="addInfo.startTimeText"
                        default-time="00:00:00"
                        placeholder="时间">
                    </el-date-picker>
                    <el-date-picker
                        v-if="addInfo.scheduleType == 4"
                        type="date"
                        :picker-options="{'firstDayOfWeek': 1}"
                        style="width:200px"
                        @input="startTimeChange"
                        v-model="addInfo.startTimeText"
                        placeholder="选择日期">
                    </el-date-picker>
                    <el-date-picker
                        v-if="addInfo.scheduleType == 5"
                        type="daterange"
                        :picker-options="{'firstDayOfWeek': 1}"
                        style="width:300px"
                        @input="startTimeChange"
                        v-model="addInfo.startTimeText"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="1" v-if="addInfo.scheduleType !== 5">至</el-col>
                
                <el-col :span="11">
                    <el-date-picker
                        v-if="addInfo.scheduleType == 3"
                        style="width:200px"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        @input="endTimeChange"
                        default-time="23:59:00"
                        v-model="addInfo.endTimeText"
                        placeholder="时间">
                    </el-date-picker>
                    <el-date-picker
                        v-if="addInfo.scheduleType == 4"
                        type="date"
                        @input="endTimeChange"
                        :picker-options="{'firstDayOfWeek': 1}"
                        style="width:200px"
                        v-model="addInfo.endTimeText"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="任务次数">
                <input style="width:50%" type="number" v-model="addInfo.scheduleCount" placeholder="请输入任务次数" oninput="value=value.replace(/[^0-9]/g,'')" class="el-input__inner"/> 次
            </el-form-item>
            <el-form-item label="任务间隔">
                <input style="width:50%" type="number" v-model="addInfo.taskInterval" placeholder="请输入任务间隔" oninput="value=value.replace(/[^\d.]/g,'')" class="el-input__inner"/>
                <span v-if="addInfo.scheduleType > 3">天</span>
                <span v-else>小时</span>
            </el-form-item>
            <el-form-item label="任务时长">
                <input style="width:50%" type="number" v-model="addInfo.taskDuration" placeholder="请输入任务时长" oninput="value=value.replace(/[^\d.]/g,'')" class="el-input__inner"/> 小时
            </el-form-item>
            <div class="buttons" style="text-align:center;">
                <el-button type="primary" @click="submitApply">保存</el-button>
                <el-button @click="closePage">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script type="text/javascript">
var that;
import ubElder from "@/components/elder";
export default {
    components: { ubElder,},
    props: {
    },
    data() {
        return {
            addInfo:{
                serviceId:'',
                targetType:'',
                elderId:'',
                type:'',
                roomInfo:'',
                startTimeText:'',
                endTimeText:'',
                scheduleType:'',
                scheduleCount:'1',
                taskInterval:'1',
                taskDuration:'1',
                desc:'',
            },
            optionsPlanType:[],
            optionsWeek:[],
            rules:{
                targetType: [
                    { required: true, message: '请选择护理内容', trigger: 'change' }
                ],
                scheduleType: [
                    { required: true, message: '请选择任务类型', trigger: 'change' }
                ],
                scheduleCount: [
                    { required: true, message: '请填写任务次数', trigger: 'blur' }
                ],
                taskInterval: [
                    { required: true, message: '请填写任务间隔', trigger: 'blur' }
                ],
                taskDuration: [
                    { required: true, message: '请填写任务时长', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            },
            nursingCategoryList:[],
            roomList:[],
        };
    },
    mounted(){
        this.optionsWeek = this.$constant.optionsWeek;
        this.optionsPlanType = JSON.parse(JSON.stringify(this.$constant.optionsPlanType));

        let index = this.optionsPlanType.findIndex(item => item.label == '无');
        if(index !== -1){
            this.optionsPlanType.splice(index, 1);
        }
        this.getCategoryList();
        this.getRoomList();
    },
    methods: {
        // 获取所有房间列表
        getRoomList() {
            axios.fetch("oaServer", "/org/room/list", {type: null,pageSize:1000}).then(res => {
                this.roomList = res.data;
            });
        },
        // 获取护理项目
        getCategoryList() {
            axios.fetch("careServer", "/nursingService/get/byTargetType", {targetType: null,schedulable:true}).then(res => {
                this.nursingCategoryList = res.data;
            });
        },
        changeTargetType(){
            this.addInfo.roomInfo = '';
            this.addInfo.targetValue = '';
            this.addInfo.targetName = '';
        },
        changeElder(val){
            this.addInfo.targetName = val.elderName;
            console.log(val);
            console.log(this.addInfo.targetValue)
            this.getModel(0);
        },
        changeRoom(){
            this.getModel(1);
            this.$set(this.addInfo,'roomInfo', this.addInfo.roomInfo);
            this.$forceUpdate();
        },
        startTimeChange(){
            this.$set(this,'addInfo.startTimeText', this.addInfo.startTimeText);
            this.$forceUpdate();
        },
        endTimeChange(){
            this.$set(this,'addInfo.endTimeText', this.addInfo.endTimeText);
            this.$forceUpdate();
        },
        getModel(type){
            let param = {
                serviceId : this.addInfo.targetType.serviceId
            }
            if (this.addInfo.targetType.targetType == 1){
                // 按房间
                if(this.addInfo.roomInfo == undefined || this.addInfo.roomInfo == '') {
                    return this.$message.error('请先选择房间号！');
                }
                this.addInfo.targetValue = this.addInfo.roomInfo.roomId;
                this.addInfo.targetName = this.addInfo.roomInfo.roomName;
                param.roomId = this.addInfo.roomInfo.roomId;
            } else if (this.addInfo.targetType.targetType == 0){
                if(this.addInfo.targetValue == undefined || this.addInfo.targetValue == '') {
                    return this.$message.error('请先选择长者！');
                }
                param.elderId = this.addInfo.targetValue;
            }
            axios.fetch("careServer", "/elderService/roomAndElderItem",param).then(res => {
                if(res.code ==200){
                    if(res.data !== null) {
                        this.$forceUpdate();
                        this.changeType();
                        var val = res.data;
                        let today = this.$moment().format('YYYY-MM-DD ');
                        switch (val.timeType) {
                            // 0无，3每天，4每周，5每月
                            case 0:
                            case 3:

                                let numberStart = 4 - val.timeStart.toString().length;
                                let numberEnd = 4 - val.timeEnd.toString().length;
                                // 补位
                                val.timeStart = '0'.repeat(numberStart) + val.timeStart;
                                val.timeEnd = '0'.repeat(numberEnd) + val.timeEnd;
                                this.addInfo.startTimeText = val.timeStart == 0 ? '00:00' : (val.timeStart.toString().slice(0,2)+':'+val.timeStart.toString().slice(2));
                                this.addInfo.endTimeText = val.timeEnd == 0 ? '00:00' : (val.timeEnd.toString().slice(0,2)+':'+val.timeEnd.toString().slice(2));

                                this.addInfo.startTimeText = today + this.addInfo.startTimeText;
                                this.addInfo.endTimeText = today + this.addInfo.endTimeText;

                                // 任务间隔
                                var taskInterval = val.taskInterval/60;
                                this.addInfo.taskInterval = Number.isInteger(taskInterval) ? taskInterval : taskInterval.toFixed(2);
                                break;
                            case 4:
                                let weekOfday = parseInt(this.$moment().format('d')) // 计算今天是这周第几天
                                let start = '';
                                let end = '';
                                if (val.timeStart <= 7) {
                                    start = this.$moment().subtract(weekOfday-val.timeStart, 'days').format('YYYY-MM-DD');
                                } else {
                                    start = this.$moment().subtract(7 - weekOfday, 'days').format('YYYY-MM-DD');
                                }
                                if (val.timeEnd <= 7) {
                                    end = this.$moment().subtract(weekOfday-val.timeEnd, 'days').format('YYYY-MM-DD');
                                } else {
                                    end = this.$moment().subtract(7 - weekOfday, 'days').format('YYYY-MM-DD');
                                }
                                this.addInfo.startTimeText = start;
                                this.addInfo.endTimeText = end;
                                // 任务间隔
                                var taskInterval = val.taskInterval/60/24;
                                this.addInfo.taskInterval = Number.isInteger(taskInterval) ? taskInterval : taskInterval.toFixed(2);
                                break;
                            case 5:
                                this.addInfo.startTimeText = [];
                                val.timeStart = val.timeStart > 10 ? val.timeStart : '0' + val.timeStart;
                                val.timeEnd = val.timeEnd > 10 ? val.timeEnd : '0' + val.timeEnd;
                                this.addInfo.startTimeText[0] = String(val.timeStart).padStart(10,today);
                                this.addInfo.startTimeText[1] = String(val.timeEnd).padStart(10,today);
                                console.log(val.timeStart, this.addInfo.startTimeText);
                                // 任务间隔
                                var taskInterval = val.taskInterval/60/24;
                                this.addInfo.taskInterval = Number.isInteger(taskInterval) ? taskInterval : taskInterval.toFixed(2);
                                break;
                            default:
                                break;
                        }
                        // 任务类型
                        this.$set(this.addInfo,'scheduleType',res.data.timeType);
                        this.addInfo.scheduleType = this.addInfo.scheduleType == 0 ? '' : this.addInfo.scheduleType;
                        // 任务时长
                        var taskDuration = val.taskDuration/60;
                        this.addInfo.taskDuration = Number.isInteger(taskDuration) ? taskDuration : taskDuration.toFixed(2);

                        // 任务次数
                        this.addInfo.scheduleCount = val.frequency;

                        this.addInfo.taskInterval = 1;
                        this.addInfo.taskDuration = 1;
                        this.addInfo.scheduleCount = this.addInfo.scheduleCount <= 0 ? 1 : this.addInfo.scheduleCount;
                    } else {
                        this.$message.warning('该项没有服务内容，请自行配置。');
                        this.$set(this.addInfo,'scheduleType','');
                        this.$forceUpdate();
                        this.changeType();
                        this.addInfo.taskInterval = '1';
                        this.addInfo.taskDuration = '1';
                        this.addInfo.scheduleCount = '1';
                    }
                }
            })
        },
        // 改变计划类型
        changeType(){
            console.log(this.addInfo.scheduleType)
            switch (this.addInfo.scheduleType) {
                // 0无，3每天，4每周，5每月
                case 0:
                case 3:
                    let date = this.$moment().format('YYYY-MM-DD');
                    this.addInfo.startTimeText = date + ' 00:00';
                    this.addInfo.endTimeText = date + ' 23:59'
                    break;
                case 4:
                    let weekOfday = this.$moment().format('E');//计算今天是这周第几天
                    let last_monday = this.$moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD');//周一日期
                    let last_sunday = this.$moment().add(7-weekOfday, 'days').format('YYYY-MM-DD');//周日日期
                    this.addInfo.startTimeText = last_monday;
                    this.addInfo.endTimeText = last_sunday;
                    break;
                case 5:
                    let start = this.$moment().startOf('month').format("YYYY-MM-DD");
                    let end = this.$moment().endOf('month').format("YYYY-MM-DD");
                    this.addInfo.startTimeText = [start,end];
                    break;
            
                default:
                    break;
            }
        },
        // 初始化数据
        resetData(){
            if (this.$refs["addInfo"] !== undefined) {
                this.$refs["addInfo"].resetFields();
                this.addInfo = {
                    serviceId:'',
                    targetType:'',
                    elderId:'',
                    type:'',
                    scheduleCount:'1',
                    taskInterval:'1',
                    taskDuration:'1'
                }
            }
        },
        // 关闭页面
        closePage(){
            this.resetData();
            this.$emit('close','')
        },
        submitApply(){
            if (this.addInfo.targetType.targetType == 1){
                // 按房间
                if(this.addInfo.roomInfo == undefined || this.addInfo.roomInfo == '') {
                    return this.$message.error('请先选择房间号！');
                }
                this.addInfo.targetValue = this.addInfo.roomInfo.roomId;
                this.addInfo.targetName = this.addInfo.roomInfo.roomName;
            } else if (this.addInfo.targetType.targetType == 0){
                console.log(this.addInfo.targetValue)
                if(this.addInfo.targetValue == undefined || this.addInfo.targetValue == '') {
                    return this.$message.error('请先选择长者！');
                }
            }
            if(this.addInfo.scheduleCount == '' || this.addInfo.scheduleCount == 0){
                return this.$message.error('次数不能为0或空！');
            }
            if(this.addInfo.taskInterval == ''){
                return this.$message.error('请输入正确的任务间隔！');
            }
            if(this.addInfo.taskDuration == ''){
                return this.$message.error('请输入正确的任务时长！');
            }
            this.$refs['addInfo'].validate((valid) => {
                if (valid) {
                    switch (this.addInfo.scheduleType) {
                        // 0无，3每天，4每周，5每月
                        case 0:
                            break;
                        case 3:
                            // 日期是否选对
                            const timeStart = this.$moment(this.addInfo.startTimeText,'YYYY-MM-DD HH:mm');
                            const timeEnd = this.$moment(this.addInfo.endTimeText,'YYYY-MM-DD HH:mm');
                            const timeReduce = timeEnd.diff(timeStart,'minute');
                            const h = Math.floor(timeReduce/60);
                            if(h>24){
                                return this.$message.error('请选择同一天的时间！');
                            }
                            this.addInfo.timeStart = this.addInfo.startTimeText+':00';
                            this.addInfo.timeEnd = this.addInfo.endTimeText+':59';
                            // 次数是否正确
                            this.addInfo.taskInterval = parseInt(this.addInfo.taskInterval*60);
                            this.addInfo.taskDuration = parseInt(this.addInfo.taskDuration*60);
                            if(this.addInfo.taskInterval>24*60){
                                this.addInfo.taskInterval = 1;
                                return this.$message.error('任务间隔不得超过24小时')
                            }
                            if(this.addInfo.taskInterval<= (0.01*60)){
                                this.addInfo.taskInterval = 1;
                                return this.$message.error('任务间隔不得小于1分钟')
                            }
                            if(this.addInfo.taskDuration>24*60){
                                this.addInfo.taskDuration = 1;
                                return this.$message.error('任务时长不得超过24小时')
                            }
                            if(this.addInfo.taskDuration <= (0.01*60)){
                                this.addInfo.taskDuration = 1;
                                return this.$message.error('任务时长不得小于1分钟')
                            }
                            break;
                        case 4:
                            // 日期是否选对
                            var weekOfday = this.$moment(this.addInfo.startTimeText,'YYYY-MM-DD').format('E');//计算指定日期是这周第几天
                            var last_monday = this.$moment(this.addInfo.startTimeText).subtract(weekOfday-1, 'days').format('YYYY-MM-DD');//周一日期
                            var last_sunday = this.$moment(this.addInfo.startTimeText).add(7-weekOfday, 'days').format('YYYY-MM-DD');//周日日期
                            var start = this.$moment(this.addInfo.startTimeText).format("YYYY-MM-DD");
                            var end = this.$moment(this.addInfo.endTimeText).format("YYYY-MM-DD");
                            if(this.$moment(last_sunday).isBefore(end)){
                                return this.$message.error('请选择同一周的日期');
                            }
                            this.addInfo.timeStart = start + ' 00:00:00';
                            this.addInfo.timeEnd = end + ' 23:59:59';
                            // 次数是否正确
                            this.addInfo.taskInterval = parseInt(this.addInfo.taskInterval*60*24);
                            this.addInfo.taskDuration = parseInt(this.addInfo.taskDuration*60);
                            if(this.addInfo.taskInterval>7*60*24){
                                this.addInfo.taskInterval = 1;
                                return this.$message.error('任务间隔不得超过7天')
                            }
                            if(this.addInfo.taskDuration>24*7*60){
                                this.addInfo.taskDuration = 1;
                                return this.$message.error('任务时长不得超过24*7小时')
                            }
                            if(this.addInfo.taskDuration <= (0.01*7*60)){
                                this.addInfo.taskDuration = 1;
                                return this.$message.error('任务时长不得小于1分钟')
                            }
                            break;
                        case 5:
                            // 日期是否选对
                            let start = this.$moment(this.addInfo.startTimeText[0]).startOf('month').format("YYYY-MM-DD");
                            let end = this.$moment(this.addInfo.startTimeText[0]).endOf('month').format("YYYY-MM-DD");
                            var end2 = this.$moment(this.addInfo.startTimeText[1]).format("YYYY-MM-DD");
                            if(this.$moment(end).isBefore(end2)){
                                return this.$message.error('请选择同一月的日期');
                            }
                            this.addInfo.timeStart = start + ' 00:00:00';
                            this.addInfo.timeEnd = end + ' 23:59:59';
                            // 次数是否正确
                            this.addInfo.taskInterval = parseInt(this.addInfo.taskInterval*60*24);
                            this.addInfo.taskDuration = parseInt(this.addInfo.taskDuration*60);
                            if(this.addInfo.taskInterval>31*60*24){
                                this.addInfo.taskInterval = 1;
                                return this.$message.error('任务间隔不得超过31天')
                            }
                            if(this.addInfo.taskDuration>31*7*60*24){
                                this.addInfo.taskDuration = 1;
                                return this.$message.error('任务时长不得超过31*7小时')
                            }
                            if(this.addInfo.taskDuration <= (0.01*7*60)){
                                this.addInfo.taskDuration = 1;
                                return this.$message.error('任务时长不得小于1分钟')
                            }
                            break;
                    
                        default:
                            break;
                    }
                    let param = {
                        serviceId : this.addInfo.targetType.serviceId,
                        targetType : this.addInfo.targetType.targetType,
                        targetValue : this.addInfo.targetValue,
                        targetName : this.addInfo.targetName,
                        scheduleStart: this.addInfo.timeStart,
                        scheduleEnd: this.addInfo.timeEnd,
                        scheduleType: this.addInfo.scheduleType,
                        scheduleCount: this.addInfo.scheduleCount,
                        taskInterval: this.addInfo.taskInterval,
                        taskDuration: this.addInfo.taskDuration,
                    }
                    axios.fetch("careServer", "/careTask/add",param,'json').then(res => {
                        console.log(res);
                        if(res.code ==200){
                            this.$message.success('添加成功！');
                            this.$emit('refresh','');
                        } else {
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                this.addInfo.taskInterval = 1;
                this.addInfo.taskDuration = 1;
            });
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
};
</script>

<style lang="less" scoped>
</style>
