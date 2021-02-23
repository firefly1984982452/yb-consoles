<template>
    <div>
        <el-form :inline="true" class="search" >
            <el-form-item label="护理区域">
                <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
            </el-form-item>
            <el-form-item label="长者姓名">
                <ub-elder v-model="search.id" @change="item => search.elderName = item.elderName" clearable></ub-elder>
            </el-form-item>
            <el-form-item label="房间床位">
                <el-input v-model="search.roomName" placeholder="请输入房间号" clearable></el-input>
            </el-form-item>
            <el-form-item label="护理内容">
                <el-select filterable v-model="search.serviceID" clearable placeholder="请选择">
                    <el-option v-for="(item,index) in nursingCategoryList" :key="index" :label="item.itemTitle" :value="item.itemTitle"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>    
            <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>
            <div @click="show3 = !show3" class="right">
            <span
                class="btniconfont iconfont iconjichutubiao-shaixuan"
                :class="show3 ? 'yellow' : 'block'"
            >
                <span :class="show3 ? 'yellow' : 'block'" style="margin-left:8px;">高级筛选</span>
                <i
                :class="[
                    show3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
                    show3 ? 'yellow' : 'block'
                ]"
                ></i>
            </span>
        </div>
        <el-collapse-transition>
        <div v-show="show3" style="margin-top: 10px;">
            <el-form-item label="任务状态">
                <el-select v-model="search.status" clearable placeholder="请选择">
                    <el-option v-for="(item,index) in statusList" :key="index" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="执行分类">
                <el-select v-model="search.targetType" clearable placeholder="请选择">
                    <el-option v-for="(item,index) in targetTypeList" :key="index" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </div>
      </el-collapse-transition>      
        </el-form>
        <div class="content">
            <el-row type="flex" class="pannel">
                <el-col class="right">
                    <el-button type="success" @click="add" icon="el-icon-plus">添加任务</el-button>
                    <el-button v-permission="'uban.care.generatetask'" @click="dialogTaskVisible = true" icon="el-icon-finished">生成任务</el-button>
                </el-col>
            </el-row>
              <el-table
                class="ub-table"
                :data="data"
                row-key="id"
                border>
                <el-table-column prop="areaName" label="区域"></el-table-column>
                <el-table-column label="房间床位">
                    <template slot-scope="scope">
                        <span v-if="scope.row.targetType == 1">{{scope.row.room}}</span>
                        <span v-else>{{scope.row.roomName}} - {{scope.row.bedName}}</span>
                    </template>
                    
                </el-table-column>
                <el-table-column prop="elderName" label="长者"></el-table-column>
                <el-table-column prop="itemTitle" label="护理内容"></el-table-column>
                <el-table-column prop="roomName" label="开始时间~结束时间" width="550">
                    <template slot-scope="scope">
                        <span>{{scope.row.scheduleStart}} - {{scope.row.scheduleEnd}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="标准数">
                    <template slot-scope="scope">
                        <span>{{scope.row.scheduleType | filterTimeType}}{{scope.row.scheduleCount}}次</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="itemCount" label="应做数"></el-table-column>
                <el-table-column prop="area" label="实做数">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1" :class="scope.row.doneCount > scope.row.itemCount ? 'text-blue' : (scope.row.remark == null ? '' : 'text-red')">{{scope.row.doneCount}}</span>
                        <span v-else >{{scope.row.doneCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="任务状态">
                    <template slot-scope="scope">
                        <span :class="scope.row.doneCount > scope.row.itemCount ? 'text-blue' : (scope.row.remark == null ? '' : 'text-red')">{{scope.row.status | filterStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注说明">
                    <template slot-scope="scope">
                        <span :class="scope.row.doneCount > scope.row.itemCount ? 'text-blue' : (scope.row.remark == null ? '' : 'text-red')">{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                            <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
                        </el-tooltip>
                        <el-tooltip  style="margin:0 0 0 10px" effect="dark" content="作废" placement="top-end">
                            <i @click="del(scope.$index)" class="iconfont iconcaozuotubiao-quxiao"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!-- 添加护理任务 -->
        <el-dialog center title="添加护理任务" :visible.sync="dialogNewVisible" width="30%">
            <add-duty ref="duty" @refresh="fresh" @close="dialogNewVisible = false" />
        </el-dialog>
        <el-dialog center title="生成护理任务" :visible.sync="dialogTaskVisible" width="20%">
          <el-date-picker type="date" v-model="taskDate" :picker-options="dateOptions" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
          <el-button type="primary" @click="generateTasks">确定</el-button>
        </el-dialog>
    </div>
</template>

<script>
var that;
import ubEmployee from "@/components/employee";
import ubElder from "@/components/elder";
import addDuty from './child/addDuty'
export default {
    components: { ubEmployee,ubElder,addDuty },
    data(){
        return {
            show3:false,
            setArea:'',
            search:{
                area:'',
                id:'',
                elderName:'',
                pro:'',
                status:'',
                targetType:''
            },
            statusList:[{
                text:'未完成',
                value:0
            },{
                text:'已完成',
                value:1
            }],
            targetTypeList:[{
                text:'按长者',
                value:0
            },{
                text:'按房间',
                value:1
            }],
            optionsPlanType:[],
            pageSize:10,
            currentPage:1,
            total:0,
            data:[],
            dialogNewVisible: false,
            nursingCategoryList:[],
            dialogTaskVisible: false,
            taskDate: null,
            dateOptions: {
                disabledDate: (time) => {
                    return this.$moment(time).format('YYYY-MM-DD') < this.$moment().format('YYYY-MM-DD');
                },
            }
        }
    },
    mounted(){
        this.optionsPlanType = this.$constant.optionsPlanType;
        this.getdata();
        this.getCategoryList();
    },
    methods:{
        getArea(val){
            this.search.area = val.value;
            this.setArea = val.text;
        },
        // 获取护理项目
        getCategoryList() {
            axios.fetch("careServer", "/nursingService/get/byTargetType", {targetType: null,schedulable:true}).then(res => {
                this.nursingCategoryList = res.data;
            });
        },
        fresh(){
            this.dialogNewVisible = false;
            this.getdata();
        },
        del(index){
            this.$confirm('此操作将永久作废该任务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.fetch("careServer", "/careTask/delete", {
                    id: this.data[index].id
                }).then(res => {
                    if(res.code == 200){
                        this.$message.success('作废成功！');
                        this.getdata();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消作废'
                });          
            });
        },
        getdata(){
            let param = {
                pageIndex:this.currentPage,
                pageSize:this.pageSize,
                elderName:this.search.elderName,
                roomName:this.search.roomName,
                areaId:this.search.area,
                itemTitle:this.search.serviceID,
                targetType:this.search.targetType,
                status:this.search.status
            } 
            axios.fetch("careServer", "/careTask/list",param).then(res => {
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
                path: "/care/duty/DutyDetail",
                query: {
                    id: val.id,
                    serviceId: val.serviceId
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
                id:'',
                elderName:'',
                serviceID:'',
                status:'',
                targetType:''
            };
            this.currentPage = 1;
            this.getdata()
        },
        add () {
            this.dialogNewVisible = true;
            if (this.$refs["duty"] !== undefined) {
                this.$refs["duty"].resetData();
            }
        },
        generateTasks() {
          if(!this.taskDate) {
            this.$message.error('请选择要生成任务的日期');
            return;
          }
          axios.fetch("careServer", "/careTask/generateTasks", { date: this.taskDate }).then(res => {
            this.$message.success('提交成功，后台正在生成任务，请稍后刷新页面查看');
            this.dialogTaskVisible = false;
          })
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
        filterStatus:val => {
            return ['未完成','已完成'][val]
        }
    }
}
</script>

<style lang="less" scoped>
.right {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    float: right;
}
.yellow {
  color: rgb(242, 129, 79);
}
.block {
  color: #222222;
}
.text-red{
    color:#f00;
}
.text-blue{
    color:#62c2f2
}
</style>