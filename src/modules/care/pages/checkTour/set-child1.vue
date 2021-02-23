<template>
    <div>
        <el-row type="flex" class="pannel">
            <el-col class="left">
                <s class="redBa"></s>
                <span>查房时段设置</span>
                <span class="gray">修改后次日生效</span>
            </el-col>
            <el-col class="right">
                <el-button type="success" @click="add" icon="el-icon-plus">添加</el-button>
            </el-col>
        </el-row>
        <el-table
            class="ub-table"
            :data="list"
            row-key="id"
            border>
            <el-table-column prop="areaName" label="区域"></el-table-column>
            <el-table-column label="查房时段">
                <template slot-scope="scope">
                    <span>{{scope.row.timeStart | filterTime}} - {{scope.row.timeEnd | filterTime}} 每隔{{scope.row.intervals}}小时一次</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top-end">
                        <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top-end">
                        <el-button size="mini" @click="del(scope.row)" icon="el-icon-delete-solid"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog center title="查房时段设置" :visible.sync="dialogTaskVisible" width="40%">
            <el-form :rules="rules" label-width="90px" :model="addInfo" ref='addInfo'>
                <el-form-item label="护理区域" prop="targetType">
                    <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
                </el-form-item>
                <el-form-item :label="index == 0 ? '班次时间段' : ''" v-for="(item,index) in detailInfo.list" :key="index">
                    <el-select 
                        style="width:20%" 
                        v-model="addInfo.start" 
                        clearable 
                        placeholder="请选择" 
                        @change="changeTime"
                        value-key="value">
                        <el-option v-for="(item,index) in timeList" :key="index" :label="item.name" :value="item"></el-option>
                    </el-select>
                    至
                    <el-select 
                        style="width:20%" 
                        v-model="addInfo.end" 
                        clearable 
                        placeholder="请选择"
                        value-key="value">
                        <el-option v-for="(item,index) in timeListEnd" :key="index" :label="item.name" :value="item"></el-option>
                    </el-select>
                    每间隔<input style="width:18%" type="number" v-model="addInfo.intervals" placeholder="请输入次数" oninput="value=value.replace(/[^\d]/g,'')" class="el-input__inner"/>小时查房一次
                    <el-tooltip content="删除" v-show="index !== 0" placement="top-end">
                        <i size="mini" @click="delItem(index)" class="el-icon-error danger"></i>
                    </el-tooltip>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button @click="addTime" type="success" style="width:200px">添加</el-button>
                </el-form-item> -->
                <div class="buttons" style="text-align:center;">
                    <el-button type="primary" @click="submitApply">保存</el-button>
                    <el-button @click="closePage">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
var that;
export default {
    name: "",
    data() {
        return {
            detailInfo:{
                checkinDate:'',
                list:[{
                    time1:''
                }]
            },
            scheduleDateList:[],
            detailID:'',
            dialogTaskVisible: false,
            addInfo:{
                areaId:'',
                areaName:'',
                start:'',
                end:'',
                intervals:''
            },
            areas:[],
            list:[],
            timeList:[],
            timeListEnd:[],
            setArea:''
        };
    },
    mounted(){
        this.timeList = this.$constant.timeList.slice(0,24);
        this.getDetail();
    },
    methods: {
        getArea(val){
            this.addInfo.areaId = val.value;
            this.addInfo.areaName = val.text;
            let area = {text:val.text,value:val.value}
            this.setArea = area;
        },
        // 获取当天所有日程
        getScheduleDate(){
            axios.fetch('medicalServer', "/api/ward/schedule/same-day/" +this.scheduleDate,{},'form','get').then(res => {
                if(res.code ==200){
                this.scheduleDateList = res.data
                }     
            })
        },
        // 添加、修改保存
        async submitApply(){
            var {areaId,areaName,id} = this.addInfo;
            if(areaId == undefined) {
                return this.$message.error('请选择护理区域！');
            }
            if (this.addInfo.start == '') {
                return this.$message.error('请选择开始时间！');
            }
            if (this.addInfo.end == '') {
                return this.$message.error('请选择结束时间！');
            }
            if (this.addInfo.intervals == '') {
                return this.$message.error('请输入间隔时间！');
            }
            if (this.addInfo.intervals == 0) {
                return this.$message.error('间隔时间不能为0！');
            }
            var param = {
                id,
                areaId,
                areaName,
                timeName:this.addInfo.start.name + '-' + this.addInfo.end.name,
                timeStart:this.addInfo.start.value,
                timeEnd:this.addInfo.end.value,
                intervals:this.addInfo.intervals,
            }
            let url = param.id ? '/carePatrolTime/edit' : "/carePatrolTime/add";
            await axios.fetch("careServer", url, param,'json').then(res => {
                if(res.code == 200){
                    this.$message.success(res.data);
                    this.closePage();
                }
            });
        },
        // 获取列表
        getDetail(){
            axios.fetch("careServer", "/carePatrolTime/all", {
                pageIndex:this.currentPage,
                pageSize:this.pageSize,}).then(res => {
                    this.list = res.data;
            });
        },
        // 添加
        add(){
            if (this.$refs.areaCom !== undefined) {
                this.$refs.areaCom.resetArea();
                let area = {text:'',value:''}
                this.setArea = area;
            }
            this.addInfo = {
                areaId:'',
                areaName:'',
                start:'',
                end:'',
                intervals:''
            }
            this.dialogTaskVisible = true
        },
        // 详情修改
        detail(val){
            this.dialogTaskVisible = true;
            let {areaId,areaName,intervals,id} = val;
            this.addInfo = {
                id,
                areaId,
                areaName,
                start: this.$constant.timeList[val.timeStart],
                end: this.$constant.timeList[val.timeEnd],
                intervals
            };
            let area = {text:val.areaName,value:val.areaId}
            this.setArea = area;
            this.changeTime();
        },
        // 删除整条模板
        del(val){
            this.$confirm("是否删除该查房时段?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                axios.fetch("careServer", "/carePatrolTime/edit", {
                    id: val.id,
                    enabled: false
                },'json').then(res => {
                    if (res.code == 200) {
                        this.getDetail();
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        },
        delItem(index){
            this.detailInfo.list.splice(index,1);
        },
        changeTime(){
            var index = this.addInfo.start.value;
            this.timeListEnd = this.$constant.timeList.slice(index+1,index+25);
        },
        addTime(){
            this.detailInfo.list.push({time:''});
        },
        closePage(){
            this.dialogTaskVisible = false;
            this.getDetail();
        }
    },
    beforeCreate(){
        that = this;
    },
    filters:{
        filterTime(val){
            let index = that.$constant.timeList.findIndex(item => item.value == val);
            if (index !== -1) {
                return that.$constant.timeList[index].name;
            }
        }
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

.list-info-right{
  font-size: 14px;
  margin: 0 0 0 30px;
  color: #666666;;
  font-weight: 600;
}
.list-info-right i{
  font-style: normal;
  color: #333333;;
}
.gray{
    color: #999;
    font-size: 14px;
}
</style>
