<template>
    <div class="page">
        <el-form :inline="true" class="search" >
            <el-form-item label="房间号">
                <el-select filterable v-model="search.roomName" placeholder="请选择房间号">
                    <el-option :label="item.roomName" :value="item.roomName" v-for="item in roomList" :key="item.roomId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="护理区域">
                <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
            </el-form-item>
            <el-form-item label="护理内容">
                <el-select filterable v-model="search.serviceID" clearable placeholder="请选择">
                    <el-option v-for="(item,index) in nursingCategoryList" :key="index" :label="item.itemTitle" :value="item.serviceId"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>    
            <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>      
        </el-form>
        <div class="content">
            <el-row type="flex" class="pannel">
                <el-col class="right">
                    <el-button  type="success" @click="add" icon="el-icon-plus">添加</el-button>
                </el-col>
            </el-row>
            <el-table
                class="ub-table"
                :data="tableData"
                border>
                <el-table-column prop="areaName" label="区域"></el-table-column>
                <el-table-column prop="roomName" label="房间"></el-table-column>
                <el-table-column prop="itemTitle" label="护理内容"></el-table-column>
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
                                type="number"
                                class="el-input__inner"
                                oninput="value=value.replace(/[^0-9]/g,'')"
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
                        <el-tooltip class="item" v-if="scope.row.isUpdate" effect="dark" content="编辑" placement="top-end">
                            <i @click="update(scope.$index)" class="iconfont iconcaozuotubiao-bianji"></i>
                        </el-tooltip>
                        <el-tooltip v-if="scope.row.isUpdate" class="item" effect="dark" content="取消" placement="top-end">
                                <i @click="handleCancel(scope.row)" class="iconfont iconcaozuotubiao-quxiao"></i>
                            </el-tooltip>
                        <div v-else>
                            <el-tooltip class="item" effect="dark" content="保存" placement="top-end">
                                <i @click="save(scope.$index)" class="iconfont iconcaozuotubiao-baocun"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="取消" placement="top-end">
                                <i @click="cancel(scope.$index)" class="iconfont iconcaozuotubiao-quxiao"></i>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <addRoomPlan ref="addPlan" refresh @refresh="getData" />
    </div>
</template>

<script>
var that;
import addRoomPlan from "../child/addRoomPlan";
export default {
    components:{
        addRoomPlan
    },
    data(){
        return {
            setArea:'',
            value:0,
            search:{
                serviceID:'',
                roomName:'',
                area:''
            },
            optionsPlanType:[],
            optionsWeek:[],
            pageSize:10,
            currentPage:1,
            total:0,
            tableData: [],
            nursingCategoryList:[],
            roomList:[],
        }
    },
    mounted(){
        this.optionsWeek = this.$constant.optionsWeek;
        this.optionsPlanType = this.$constant.optionsPlanType;
        this.getData();
        this.getCategoryList();
        this.getRoomList();
    },
    methods:{
        getArea(val){
            this.search.area = val.value;
            this.setArea = val.text;
        },
        // 获取所有房间列表
        getRoomList() {
            axios.fetch("oaServer", "/org/room/list", {type: null,pageSize:1000}).then(res => {
                this.roomList = res.data;
            });
        },
        // 获取护理项目
        getCategoryList() {
            axios.fetch("careServer", "/nursingService/get/byTargetType", {targetType: 1,schedulable:true}).then(res => {
                this.nursingCategoryList = res.data;
            });
        },
        getData(){
            let param = {
                pageIndex:this.currentPage,
                pageSize:this.pageSize,
                roomName:this.search.roomName,
                areaId:this.search.area,
                serviceId:this.search.serviceID
            } 
            axios.fetch("careServer", "/careBuildingSchedule/nursingProject/room",param).then(res => {
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
        handleCancel(data){
            const param = {
                id:data.id,
                enabled:0
            }
            axios.fetch("careServer", "/careBuildingSchedule/nursingProject/save",[param],'json').then(res=>{
                if(res.code == 200 ){
                    this.$message.success('取消成功');
                    this.getData();
                }
            })
        },
        // 保存单个
        save(index){
            let fre = Number(this.tableData[index].frequency);
            console.log(this.tableData[index],fre,!fre);
            if (Number.isNaN(fre)) {
                this.$message.closeAll();
                return this.$message.error('次数请输入数字！');
            }
            if (!fre) {
                this.$message.closeAll();
                return this.$message.error('次数不能为0或空！');
            }
            switch (this.tableData[index].timeType) {
                // 0无，3每天，4每周，5每月
                case 0:
                    break;
                case 3:
                    this.tableData[index].taskInterval = parseInt(this.tableData[index].taskIntervalText*60);
                    this.tableData[index].taskDuration = parseInt(this.tableData[index].taskDurationText*60);
                    if(this.tableData[index].taskInterval>24*60){
                        this.$message.closeAll();
                        return this.$message.error('任务间隔不得超过24小时')
                    } 
                    if(this.tableData[index].taskInterval<= (0.01*60)){
                        this.$message.closeAll();
                        return this.$message.error('任务间隔不得小于1分钟')
                    }
                    if(this.tableData[index].taskDuration>24*60){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得超过24小时')
                    }
                    if(this.tableData[index].taskDuration <= (0.01*60)){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得小于1分钟')
                    }
                    if(this.tableData[index].startTimeText>=this.tableData[index].endTimeText){
                        this.$message.closeAll();
                        return this.$message.error('开始时间不能大于或等于结束时间')
                    }
                    this.tableData[index].timeStart = this.tableData[index].startTimeText.replace(':','');
                    this.tableData[index].timeEnd = this.tableData[index].endTimeText.replace(':','');
                    break;
                case 4:
                    this.tableData[index].taskInterval = parseInt(this.tableData[index].taskIntervalText*60*24);
                    this.tableData[index].taskDuration = parseInt(this.tableData[index].taskDurationText*60);
                    if(this.tableData[index].taskInterval>7*60*24){
                        this.$message.closeAll();
                        return this.$message.error('任务间隔不得超过7天')
                    }
                    if(this.tableData[index].taskDuration>24*7*60){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得超过24*7小时')
                    }
                    if(this.tableData[index].taskDuration <= (0.01*7*60)){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得小于1分钟')
                    }
                    let timeStart = this.tableData[index].startTimeText;
                    let timeEnd = this.tableData[index].endTimeText;
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
                    this.tableData[index].timeStart = start == 7 ? 0 : start;
                    this.tableData[index].timeEnd = end == 7 ? 0 : end;
                    break;
                case 5:
                    this.tableData[index].taskInterval = parseInt(this.tableData[index].taskIntervalText*60*24);
                    this.tableData[index].taskDuration = parseInt(this.tableData[index].taskDurationText*60);
                    if(this.tableData[index].startTimeText<1){
                        this.$message.closeAll();
                        return this.$message.error('开始时间不能小于1号')
                    }
                    if(this.tableData[index].startTimeText>=this.tableData[index].endTimeText){
                        this.$message.closeAll();
                        return this.$message.error('开始时间不能大于或等于结束时间')
                    }
                    if(this.tableData[index].startTimeText>31*60*24){
                        this.$message.closeAll();
                        return this.$message.error('结束时间不能超过每月月末')
                    }
                    if(this.tableData[index].taskInterval>31*60*24){
                        this.$message.closeAll();
                        return this.$message.error('任务间隔不得超过31天')
                    }
                    if(this.tableData[index].taskDuration>31*7*60*24){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得超过31*7小时')
                    }
                    if(this.tableData[index].taskDuration <= (0.01*7*60)){
                        this.$message.closeAll();
                        return this.$message.error('任务时长不得小于1分钟')
                    }
                    this.tableData[index].timeStart = this.tableData[index].startTimeText;
                    this.tableData[index].timeEnd = this.tableData[index].endTimeText;
                    break;
            
                default:
                    break;
            }
            this.tableData[index].serviceId = this.search.serviceID;
            let arr = [];
            arr.push(this.tableData[index]);
            axios.fetch("careServer", "/careBuildingSchedule/nursingProject/save",arr,'json').then(res => {
                if(res.code ==200){
                    this.$message.success('修改成功！');
                    this.tableData[index].isUpdate = true;
                    this.$forceUpdate();
                }
            })
        },
        // 改变计划类型
        changeType(index){
            switch (this.tableData[index].timeType) {
                // 0无，3每天，4每周，5每月
                case 0:
                    
                    break;
                case 3:
                    this.tableData[index].startTimeText = '00:00';
                    this.tableData[index].endTimeText = '00:00';
                    break;
                case 4:
                case 5:
                    this.tableData[index].startTimeText = 0;
                    this.tableData[index].endTimeText = 0;
                    break;
            
                default:
                    break;
            }
        },
        cancel(index){
            this.tableData[index].isUpdate = true;
            this.getData();
        },
        update(index){
            this.tableData[index].isUpdate = false;
        },
        add(){
            this.$refs.addPlan.dialogTableVisible = true;
            this.$refs.addPlan.serviceID = '';
            this.$refs.addPlan.area = '';
            this.$refs.addPlan.tableData = [];
        },
        reset(){
            if (this.$refs.areaCom !== undefined) {
                this.$refs.areaCom.resetArea();
                this.setArea = '';
            }
            this.currentPage = 1;
            this.search = {
                id:'',
                area:'',
                serviceID:''
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
            console.log(index)
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
.table{
    width: 90%;
    text-align: center;
    margin: 0 auto;
}
.footer{
    margin: 10px auto;
}
</style>