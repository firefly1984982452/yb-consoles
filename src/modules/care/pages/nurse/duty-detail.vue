<template>
    <div class="ass">
        <el-form label-width="5em">
            <div class="box-card">
                <el-button size="mini" class="back" @click="back">返回</el-button>
                <div class="record_title" v-if="detailInfo.targetType == 1">
                    <!-- 按房间 -->
                    <span>{{detailInfo.areaName}}&nbsp;&nbsp;&nbsp;&nbsp;{{detailInfo.room}}</span> 
                    <span>
                        {{detailInfo.itemTitle}} <c style="color:#111"> {{detailInfo.scheduleType | filterTimeType}}{{detailInfo.scheduleCount}}次  {{detailInfo.scheduleStart}} - {{detailInfo.scheduleEnd}}</c>&nbsp;&nbsp;
                        <c style="color:#111">（<c style="color:#f00">{{detailInfo.doneCount}}</c>/{{detailInfo.itemCount}}）</c>
                    </span>
                </div>
                <div class="record_title" v-else>
                    <span>{{detailInfo.elderName}}&nbsp;&nbsp;&nbsp;&nbsp;{{detailInfo.gender}}</span> 
                    <span>
                        入住时间 <c style="color:#666">{{detailInfo.checkinDate.substr(0,10)}}</c>&nbsp;&nbsp;&nbsp;&nbsp;
                        区域 <c style="color:#666">{{detailInfo.areaName}} {{detailInfo.roomName}}-{{detailInfo.bedName}}</c> 
                        等级 <c style="color:#666"> 护理{{detailInfo.nursingLevel | filterLevel}}级</c>&nbsp;&nbsp;&nbsp;&nbsp;
                        {{detailInfo.itemTitle}} <c style="color:#111"> {{detailInfo.scheduleType | filterTimeType}}{{detailInfo.scheduleCount}}次  {{detailInfo.scheduleStart}} - {{detailInfo.scheduleEnd}}</c>&nbsp;&nbsp;
                        <c style="color:#111">（<c style="color:#f00">{{detailInfo.doneCount}}</c>/{{detailInfo.scheduleCount}}）</c>
                    </span>
                </div>
            </div>
            <div class="content">
                <el-row type="flex" class="pannel">
                    <el-col class="right">
                        <el-button  type="success" @click="addLine" icon="el-icon-plus">添加</el-button>
                    </el-col>
                </el-row>
                <el-table
                    class="ub-table"
                    :data="detailInfo.careTaskDetailVos"
                    row-key="id"
                    border>
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column width="250" :label="detailInfo.itemTitle+'操作时间'">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.isAdd">{{scope.row.operateTime}}</div>
                            <div v-else>
                                <el-date-picker
                                    width="200px"
                                    v-model="scope.row.operateTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss" 
                                    format="yyyy-MM-dd HH:mm:ss" 
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="item in detailInfo.taskDetailList" :key="item.id" :label="item.optionName">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.isAdd">
                                <span v-for="task in scope.row.taskDetailList" :key="task.id" v-show="task.optionName == item.optionName">{{task.optionValue}}</span>
                            </div>
                            <div v-else>
                                <div v-for="(op,index) in optionsTitleList" :key="op.id" v-show="op.title == item.optionName">
                                    <!-- 1单选，2多选，3文本，4时间，5整数 -->
                                    <div v-if="op.inputType == 1">
                                        <el-select v-model="op.optionValue" clearable placeholder="请选择" @change="changeOptionValue(op.inputType,index)">
                                            <el-option v-for="(item,index) in op.inputTextList" :key="index" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </div>
                                    <div v-if="op.inputType == 2">
                                        <el-checkbox-group v-model="op.optionValue" @change="changeOptionValue(op.inputType,index)">
                                            <el-tooltip :content="item" v-for="(item,index) in op.inputTextList" :key="index">
                                                <el-checkbox :key="index" :label="item"></el-checkbox>
                                            </el-tooltip>
                                        </el-checkbox-group>
                                    </div>
                                    <div v-if="op.inputType == 3">
                                        <el-input v-model="op.optionValue" />
                                        <el-tooltip :content="item" v-for="(item,i) in op.inputTextList" :key="i">
                                            <el-tag @click="addTag(item,index)" class="tag">{{item}}</el-tag>
                                        </el-tooltip>
                                    </div>
                                    <div v-if="op.inputType == 4">
                                        <el-date-picker
                                            width="200px"
                                            v-model="op.optionValue"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss" 
                                            format="yyyy-MM-dd HH:mm:ss" 
                                            placeholder="选择日期时间">
                                        </el-date-picker>
                                    </div>
                                    <div v-if="op.inputType == 5">
                                        <input type="number" v-model="op.optionValue" placeholder="请输入整数" oninput="value=value.replace(/[^\d.]/g,'')" class="el-input__inner" /> 
                                    </div>

                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operatorName" label="护理员"></el-table-column>
                    <el-table-column prop="createTime" width="180" label="创建时间"></el-table-column>
                    <el-table-column prop="roomName" width="180" label="附件">
                        <template slot-scope="scope">
                            <div  v-if="!scope.row.isAdd">
                            <ub-image 
                                v-for="item in scope.row.attachmentUrlList"
                                :key="item"
                                class="image" 
                                fit="cover" 
                                :src="item"></ub-image>
                            </div>
                            <ub-avatar v-else category="elder" v-model="scope.row.attachmentUrl"></ub-avatar>
                        </template>
                    </el-table-column>
                    <el-table-column label="说明">
                        <template slot-scope="scope">
                            <div  v-if="!scope.row.isAdd">{{scope.row.remark}}</div>
                            <div v-else>
                                <el-input type="textarea" v-model.trim="scope.row.remark" maxlength="200" placeholder="请输入说明"  clearable></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="roomName" label="状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.enabled | filterStatus}}</span>
                        </template>
                      </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip v-if="!scope.row.isAdd" effect="dark" content="作废" placement="top-end">
                                <i @click="del(scope.$index)" class="iconfont iconcaozuotubiao-quxiao"></i>
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
            </div>
        </el-form>
        <!-- 添加护理任务 -->
        <el-dialog center title="添加护理任务" :visible.sync="dialogNewVisible" width="30%">
            <add-duty-detail :detailInfo="detailInfo" :optionsTitleList="optionsTitleList" ref="duty" @refresh="fresh" @close="closePage" />
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
var that;
import addDutyDetail from './child/addDutyDetail'
import ubEmployee from "@/components/employee";
import ubImage from '@/components/image';
import ubAvatar from '@/components/pictures';
import moment from "moment";
export default {
    name: "NurseProject",
    components:{ubImage,ubAvatar,ubEmployee,addDutyDetail},
    data() {
        return {
            dialogNewVisible: false,
            relationPhoto:'',
            value:'',
            //查询条件数据
            searchForm: {
            pageIndex: 1,
            pageSize: 10
            },
            optionsPlanType:[],
            detailInfo:{
                checkinDate:''
            },
            id:'',
            optionsTitleList:[]
        };
    },
    mounted(){
        this.optionsPlanType = this.$constant.optionsPlanType;
        this.id = this.$route.query.id;
        this.getDetail();
    },
    methods: {
        getDetail(){
            axios.fetch("careServer", "/careTask/list", {id: this.id}).then(res => {
                res.data[0].careTaskDetailVos.map(val => {
                    val.isAdd = false;
                    val.attachmentUrlList = val.attachmentUrl == null ? [] : val.attachmentUrl.split(',');
                    return val;
                });
                this.detailInfo = res.data[0];
            });
        },
        closePage(){
            this.dialogNewVisible = false;
            this.getDetail();
        },
        back () {
            this.$router.back()
        },
        uploadSuccess(url) {
        this.$emit('input', url);
        },
        // 添加一行
        addLine() {
            axios.fetch("careServer", "/nursingOption/get/serviceId", {
                serviceId: this.detailInfo.serviceId
            }).then(res => {
                this.optionsTitleList = res.data.map(val => {
                    val.inputTextList = val.inputText.split(',');
                    switch (val.inputType) {
                        case 1:
                            val.optionValue = '';
                            break;
                        case 2:
                            val.optionValue = [];
                            break;
                        case 3:
                            val.optionValue = '';
                            break;
                        case 4:
                            val.optionValue = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                            break;
                        case 5:
                            val.optionValue = '';
                            break;
                        default:
                            break;
                    }
                    return val;
                })
                this.dialogNewVisible = true;
                this.$nextTick(() => {
                    this.$refs.duty.resetData();
                });
            });
        },
        del(index){
            this.$confirm('此操作将永久作废该任务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.fetch("careServer", "/careTaskItem/delete", {
                    itemId: this.detailInfo.careTaskDetailVos[index].id
                }).then(res => {
                    if(res.code == 200){
                        this.$message.success('作废成功！');
                        this.getDetail();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消作废'
                });          
            });
        },
        cancel(index){
            this.detailInfo.careTaskDetailVos.splice(index,1);
        },
        // 保存
        save(index){
            if(this.detailInfo.careTaskDetailVos[index].operateTime == undefined || this.detailInfo.careTaskDetailVos[index].operateTime == null){
                return this.$message.error('时间必填！')
            }
            let arr = this.optionsTitleList.map(val => {
                return {
                    optionName : val.title,
                    optionValue : val.inputType == 2 ? val.optionValue.join(',') : val.optionValue
                }
            })
            let param = {
                taskId:this.id,
                serviceId: this.$route.query.serviceId,
                operateTime:this.detailInfo.careTaskDetailVos[index].operateTime,
                attachmentUrl:  this.detailInfo.careTaskDetailVos[index].attachmentUrl,
                remark: this.detailInfo.careTaskDetailVos[index].remark,
                taskDetailList: arr
            }
			for (const val of arr) {
				if(val.optionValue === '') {
					return this.$message.error(val.optionName + '不能为空！');
				}
			}
            axios.fetch("careServer", "/careTaskItem/add", param,'json').then(res => {
                if(res.code == 200){
                    this.$message.success('添加成功！');
                    this.detailInfo.careTaskDetailVos[index].isAdd = false;
                    this.getDetail();
                } else {
                    this.$message.error('添加失败！');
                }
            });
            
        },
        changeOptionValue(type,index){
            this.$set(this.optionsTitleList,index,this.optionsTitleList[index]);
        },
        addTag(val,index) {
            this.optionsTitleList[index].optionValue = this.optionsTitleList[index].optionValue+val;
        }
    },
    beforeCreate(){
        that = this;
    },
    filters:{
        filterTimeType:val=>{
            let index = that.optionsPlanType.findIndex(item => item.value == val);
            if (index !== -1) {
                return that.optionsPlanType[index].label;
            }
        },
        filterStatus:val => {
            return ['未完成','已完成'][Number(val)]
        },
        filterLevel: val => {
            return ['','一','二','三','四','五','六'][val]
        },
  }
};
</script>

<style lang="less" scoped>
/deep/ .picture{
    display: flex;
    flex-direction: column;
}
/deep/ .el-checkbox__label{
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
}
.tag{
    cursor: pointer;
    margin: 2px 5px;
}
.tab {
    height: 100%;
}
.box-card{
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;

}
	.record_title {
       margin-left: 20px;
       display: flex;
       align-items: center;
	}
    .record_title span:nth-child(1){
	   margin-right: 10px;
	   font-size: 18px;
	   font-weight: 500;
	   color: #333333;
	}
	.record_title span:nth-child(2){
	   font-size: 14px;
	   color: #999999;
	}
.header {
    box-sizing: border-box;
    border-bottom: 1px solid #dddddd;
    background-color: #fff;
    padding: 10px 20px;
    margin: 10px 0;
    /deep/ .el-button {
    i {
        color: #409eff;
        font-weight: 700;
    }
  }
  /deep/ .el-button.cur {
    background-color: #5b8ff9ff;
    color: rgba(255, 255, 255, 1);
    i {
        color: #fff;
        font-weight: 700;
    }
  }
}
.content{
  margin: 10px 0;
}
</style>
