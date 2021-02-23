<template>
  <div class="taskSetDialog">
    <el-dialog title="添加计划" :visible.sync="dialogTableVisible" center>
      <div class="title">
        <div class="left">
          <span>护理内容：
                <el-select v-model="serviceID" @change="changeArea" clearable placeholder="请选择">
                    <el-option v-for="(item,index) in nursingCategoryList" :key="index" :label="item.itemTitle" :value="item.serviceId"></el-option>
                </el-select>
          </span>
          <span>护理区域：
                <el-select v-model="area" @change="changeArea" clearable placeholder="请选择">
                    <el-option v-for="(item,index) in areas" :key="index" :label="item.text" :value="item.value"></el-option>
                </el-select>
          </span>
        </div>  
      </div>
      <b class="title">房间数：{{tableData.length}}间</b>
      <el-table 
        v-show="area"
        :data="tableData" 
        :cell-style="cellStyle" 
        max-height="350"
        border 
        :header-cell-style="{ background: '#F3F3F5' }" 
        class="ub-table">
        <el-table-column property="roomName" label="房间" width="80" align="center"></el-table-column>
        <el-table-column label="配置" width="60" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isUpdate" @change="update(scope.$index)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="计划类型" align="center">
          <template slot-scope="scope">
              <span v-if="!scope.row.isUpdate">{{scope.row.timeType | filterTimeType}}</span>
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
        <el-table-column prop="deptId" label="开始时间">
            <template slot-scope="scope">
                <span v-if="scope.row.timeType == 0">-</span>
                <span v-else>
                    <span v-if="!scope.row.isUpdate">{{scope.row.startTimeText}}</span>
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
                    <span v-if="!scope.row.isUpdate">{{scope.row.endTimeText}}</span>
                    <div v-else>
                        <el-time-picker
                            v-if="scope.row.timeType == 3"
                            style="width:100px"
                            value-format="HH:mm"
                            format="HH:mm"
                            @input="endTimeChange(scope.$index)"
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
                    <span v-if="!scope.row.isUpdate">{{scope.row.taskIntervalText}}</span>
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
        </el-table-column>
        <el-table-column prop="deptId" label="任务时长">
            <template slot-scope="scope">
                <span v-if="scope.row.timeType == 0">-</span>
                <span v-else>
                    <span v-if="!scope.row.isUpdate">{{scope.row.taskDurationText}}</span>
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
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
var that;
import ubElder from "@/components/elder";
export default {
  components: { ubElder,},
  name: "TaskSetDialog",
  props: {
    currentItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
        test:'00:00',
      serviceID:'',
      area:'',
      type: "",
      dialogTableVisible: false,
      options: [
        {
          value: "0",
          label: "长者"
        },
        {
          value: "1",
          label: "房间"
        }
      ],
      value:0,
      optionsPlanType:[{
          value: 0,
          label: '无'
      },{
          value: 3,
          label: '每天'
      },{
          value: 4,
          label: '每周'
      },{
          value: 5,
          label: '每月'
      }],
      optionsWeek:[{
          value: 0,
          label: '周日'
      },{
          value: 1,
          label: '周一'
      },{
          value: 2,
          label: '周二'
      },{
          value: 3,
          label: '周三'
      },{
          value: 4,
          label: '周四'
      },{
          value: 5,
          label: '周五'
      },{
          value: 6,
          label: '周六'
      }],
      tableData: [],
      areas:[],
      nursingCategoryList:[],
    };
  },
  mounted(){
    this.getEaras();
    this.getCategoryList();
  },
  methods: {
    // 获取护理项目
    getCategoryList() {
        axios.fetch("careServer", "/nursingService/get/byTargetType", {targetType: 1,schedulable:true}).then(res => {
            this.nursingCategoryList = res.data;
        });
    },
    // 获取全部区域
    getEaras() {
        axios.fetch("oaServer", "/org/area/list", {groups: "楼宇区域"}).then(res => {
            if (res.data.length > 0) {
                res.data.forEach(item => {
                    const obj = {};
                    obj.text = item.areaName;
                    obj.value = item.areaId;
                    this.areas.push(obj);
                });
            }
        });
    },
    changeArea(){
        if(this.serviceID == '') {
            return this.$message.error('请先选择护理内容！');
        }
        axios.fetch("careServer", "/careBuildingSchedule/area/room", {areaId: this.area,serviceId:this.serviceID}).then(res => {
          if(res.code ==200){
              this.tableData = res.data.map(val => {
                  val.isUpdate = false;
                  val.timeType = 0;
                  val.startTimeText='';
                  val.taskIntervalText='';
                  val.endTimeText='';
                  return val;
              })
          }
        });
    },
    // 保存单个
    save(index){
        console.log(this.tableData[index])
        switch (this.tableData[index].timeType) {
            // 0无，3每天，4每周，5每月
            case 0:
                break;
            case 3:
                this.tableData[index].taskInterval = 60;
                this.tableData[index].taskDuration = 60;
                // this.tableData[index].taskInterval = parseInt(this.tableData[index].taskIntervalText*60);
                // this.tableData[index].taskDuration = parseInt(this.tableData[index].taskDurationText*60);
                // if(this.tableData[index].taskInterval>24*60){
                //     this.$message.closeAll();
                //     return this.$message.error('任务间隔不得超过24小时')
                // }
                // if(this.tableData[index].taskInterval<= (0.01*60)){
                //     this.$message.closeAll();
                //     return this.$message.error('任务间隔不得小于1分钟')
                // }
                // if(this.tableData[index].taskDuration>24*60){
                //     this.$message.closeAll();
                //     return this.$message.error('任务时长不得超过24小时')
                // }
                // if(this.tableData[index].taskDuration <= (0.01*60)){
                //     this.$message.closeAll();
                //     return this.$message.error('任务时长不得小于1分钟')
                // }
                if(this.tableData[index].startTimeText>=this.tableData[index].endTimeText){
                    this.$message.closeAll();
                    return this.$message.error('开始时间不能大于或等于结束时间')
                }
                this.tableData[index].timeStart = this.tableData[index].startTimeText.replace(':','');
                this.tableData[index].timeEnd = this.tableData[index].endTimeText.replace(':','');
                break;
            case 4:
                this.tableData[index].taskInterval = 60*24;
                this.tableData[index].taskDuration = 60;
                // this.tableData[index].taskInterval = parseInt(this.tableData[index].taskIntervalText*60*24);
                // this.tableData[index].taskDuration = parseInt(this.tableData[index].taskDurationText*60);
                // if(this.tableData[index].taskInterval>7*60*24){
                //     this.$message.closeAll();
                //     return this.$message.error('任务间隔不得超过7天')
                // }
                // if(this.tableData[index].taskDuration>24*7*60){
                //     this.$message.closeAll();
                //     return this.$message.error('任务时长不得超过24*7小时')
                // }
                // if(this.tableData[index].taskDuration <= (0.01*7*60)){
                //     this.$message.closeAll();
                //     return this.$message.error('任务时长不得小于1分钟')
                // }
                let timeStart = this.tableData[index].startTimeText;
                let timeEnd = this.tableData[index].endTimeText;
                let start = timeStart;
                let end = timeEnd;
                console.log(start,end)
                if(typeof timeStart == 'string') {
                    let startIndex = this.optionsWeek.findIndex(item => item.label == timeStart);
                    start = this.optionsWeek[startIndex].value;
                }
                if (typeof timeEnd == 'string') {
                    let endIndex = this.optionsWeek.findIndex(item => item.label == timeEnd);
                    end = this.optionsWeek[endIndex].value;
                }
                start = start == 0 ? 7 : start;
                end = end == 0 ? 7 : end;
                if(start>end){
                    return this.$message.error('开始时间不能大于结束时间')
                }
                this.tableData[index].timeStart = start == 7 ? 0 : start;
                this.tableData[index].timeEnd = end == 7 ? 0 : end;
                break;
            case 5:
                this.tableData[index].taskInterval = 60*24;
                this.tableData[index].taskDuration = 60;
                // this.tableData[index].taskInterval = parseInt(this.tableData[index].taskIntervalText*60*24);
                // this.tableData[index].taskDuration = parseInt(this.tableData[index].taskDurationText*60);
                // if(this.tableData[index].startTimeText<1){
                //     this.$message.closeAll();
                //     return this.$message.error('开始时间不能小于1号')
                // }
                // if(this.tableData[index].startTimeText>=this.tableData[index].endTimeText){
                //     this.$message.closeAll();
                //     return this.$message.error('开始时间不能大于或等于结束时间')
                // }
                // if(this.tableData[index].startTimeText>31*60*24){
                //     this.$message.closeAll();
                //     return this.$message.error('结束时间不能超过每月月末')
                // }
                // if(this.tableData[index].taskInterval>31*60*24){
                //     this.$message.closeAll();
                //     return this.$message.error('任务间隔不得超过31天')
                // }
                // if(this.tableData[index].taskDuration>31*7*60*24){
                //     this.$message.closeAll();
                //     return this.$message.error('任务时长不得超过31*7小时')
                // }
                // if(this.tableData[index].taskDuration <= (0.01*7*60)){
                //     this.$message.closeAll();
                //     return this.$message.error('任务时长不得小于1分钟')
                // }
                this.tableData[index].timeStart = this.tableData[index].startTimeText;
                this.tableData[index].timeEnd = this.tableData[index].endTimeText;
                break;
        
            default:
                break;
        }
        this.tableData[index].serviceId = this.serviceID;
        let arr = [];
        arr.push(this.tableData[index]);
        axios.fetch("careServer", "/careBuildingSchedule/nursingProject/save",arr,'json').then(res => {
            if(res.code ==200){
                this.$message.closeAll();
                this.$message.success('添加成功！');
                this.tableData[index].isUpdate = false;
                this.dialogTableVisible = false;
                this.$emit('refresh','');
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
                this.tableData[index].endTimeText = '23:59';
                break;
            case 4:
                this.tableData[index].startTimeText = 1;
                this.tableData[index].endTimeText = 0;
                break;
            case 5:
                this.tableData[index].startTimeText = 1;
                let end = this.$moment().endOf('month').format("DD");
                this.tableData[index].endTimeText = end;
                break;
        
            default:
                break;
        }
    },
    // 编辑时先获取模板
    update(index){
        console.log(this.tableData[index].isUpdate)
        if(this.tableData[index].isUpdate == true) {
            let param = {
                targetType: 1,
                targetValue:this.area,
                serviceId:this.serviceID
            }
            axios.fetch("careServer", "/nursingSchedule/get/byTargetValue",param).then(res => {
                if(res.code ==200){
                    this.tableData[index].isUpdate = true;
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
                        // 任务时长
                        var taskDuration = val.taskDuration/60;

                        val.taskDurationText = Number.isInteger(taskDuration) ? taskDuration : taskDuration.toFixed(2);

                        val.taskIntervalText = 1;
                        val.taskDurationText = 1;
                        this.tableData[index].timeType = val.timeType;
                        this.tableData[index].frequency = val.frequency;
                        this.tableData[index].timeStart = val.timeStart;
                        this.tableData[index].timeEnd = val.timeEnd;
                        this.tableData[index].startTimeText = val.startTimeText;
                        this.tableData[index].endTimeText = val.endTimeText;
                        this.tableData[index].taskInterval = val.taskInterval;
                        this.tableData[index].taskDuration = val.taskDuration;
                        this.tableData[index].taskIntervalText = val.taskIntervalText;
                        this.tableData[index].taskDurationText = val.taskDurationText;

                    } else {
                        this.$message.warning('该项没有模板，请自行配置。')
                    }
                }
            })
        }
    },
    cancel(){
        this.dialogTableVisible = false;
        this.$emit('refresh','');
    },
    // 批量保存
    submitForm(){
        let has  = this.tableData.some(val => {
            return val.isUpdate
        })
        if(has) {
            this.tableData.map((val,index) => {
                if(val.isUpdate){
                    val.isUpdate = false;
                    this.save(index);
                }
            })
        } else {
            console.log(this.serviceID,this.area)
            if(this.serviceID == ''){
                return this.$message.warning('当前没有选择护理内容！');
            } else if(this.area == '') {
                return this.$message.warning('当前没有选择护理区域！');
            } else {
                this.$message.warning('当前没有选择房间！');
            }
        }
    },
    endTimeChange(index){
        console.log(this.tableData[index].endTimeText)
        this.tableData[index].endTimeText = this.tableData[index].endTimeText;
        this.$forceUpdate();
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
.title {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    span + span {
      margin-left: 16px;
    }
  }
  .right {
    display: flex;
    align-items: center;
  }
}
/deep/ .el-table__body-wrapper {
  tr {
    height: 60px;
  }
  td {
    .cell {
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-input {
        flex: 1;
      }
      .unit {
        width: 50px;
        padding: 0 5px;
      }
    }
  }
}
</style>
