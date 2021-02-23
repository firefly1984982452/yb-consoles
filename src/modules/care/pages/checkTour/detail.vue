<template>
    <div>
        <el-form :inline="true" class="search" >
            <el-button size="mini" class="back" @click="back">返回</el-button>   
        </el-form>
        <el-form>
            <div class="content">
                <el-row type="flex" class="pannel">
                    <el-col class="left" :span="6">
                        <s class="redBa"></s>
                        <span style="margin: 0 10px 0 0;">{{detail.areaName}}查房记录</span>
                        <span>{{detail.scheduleStart.substr(0,10)}}</span>
                    </el-col>
                    <el-col class="left" :span="6">
                        <span>时间段</span>
                        <el-select  v-model="timeId" @change="querydata">
                            <el-option 
                                :label="item.scheduleStart.substr(10,6)+' - '+item.scheduleEnd.substr(10,6)" 
                                :key="item.id" 
                                v-for="item in workTimeList" 
                                :value="item.id">
                                {{item.scheduleStart.substr(10,6)}} - {{item.scheduleEnd.substr(10,6)}}
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col class="right">
                        <span class="list-info-right">已查 <i>{{detail.status1}}</i>人</span>
                        <el-popover
                            placement="left"
                            width="400"
                            trigger="hover">
                            <el-table :data="gridData" max-height="250" v-loading="gridDataLoading">
                                <el-table-column property="roomName" width="100" label="房间号"></el-table-column>
                                <el-table-column property="name" label="长者">
                                    <template slot-scope="scope">
                                        <span 
                                            style="margin: 0 10px 0 0"
                                            v-for="(item,index) in scope.row.elderNames" 
                                            :key="index">{{item}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <span slot="reference" class="list-info-right" @mouseover="detailUnCheck">
                                未查 <i style="color:#EB6969">{{detail.status0}}</i>人
                            </span>
                        </el-popover>
                    </el-col>
                </el-row>
                <el-table
                    class="ub-table"
                    :data="detailInfo"
                    row-key="id"
                    border>
                    <el-table-column prop="elderName" label="长者"></el-table-column>
                    <el-table-column label="房间床位">
                        <template slot-scope="scope">
                            <span>{{scope.row.roomName}} - {{scope.row.bedName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-for="item in scope.row.tagsList" :key="item" style="margin: 0 10px 0 0;">{{item}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="巡视记录"></el-table-column>
                    <el-table-column prop="operatorName" label="记录人"></el-table-column>
                    <el-table-column prop="operateTime" width="180" label="记录时间"></el-table-column>
                </el-table>
                <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
            </div>
        </el-form>
    </div>
</template>
<script type="text/javascript">
export default {
    name: "",
    data() {
        return {
            detailInfo:[],
            detail:{
                scheduleStart:''
            },
            scheduleDateList:[],
            timeId:'',
            currentTimeID:'',
            pageSize:10,
            currentPage:1,
            total:0,
            param:{},
            workTimeList:[],
            gridData:[],
            gridDataLoading: false,
            flag: false, // 节流函数标志
        };
    },
    mounted(){
        this.param = JSON.parse(this.$route.query.val);
        this.timeId = this.param.id;
        this.currentTimeID = this.param.timeId;
        this.getDetail();
        this.getWorkTime();
    },
    methods: {
        querydata(){
            this.param.id = this.timeId;
            let index = this.workTimeList.map(val => val.id).indexOf(this.timeId);
            this.param.scheduleStart = this.workTimeList[index].scheduleStart;
            this.getDetail();
        },
        // 获取班次列表
        getWorkTime(){
            let param = {
                scheduleStart:this.param.scheduleStart,
                areaId:this.param.areaId,
                timeId: this.currentTimeID,
            }
            axios.fetch("careServer", "/carePatrolItem/list", param).then(res => {
                this.workTimeList = res.data.carePatrolTasks;
                this.detail.areaName = res.data.areaName;
                this.detail.scheduleStart = res.data.scheduleStart;
            });
        },
        async getDetail(){
            var param = {
                pageIndex:this.currentPage,
                pageSize:this.pageSize,
                taskId: this.param.id,
                areaId:this.param.areaId,
                scheduleStart:this.param.scheduleStart,
            }
            await axios.fetch('careServer', '/carePatrolItem/num',param).then(res => {
                this.detail.status0 = res.data.noQueryNum;
                this.detail.status1 = res.data.queryNum;
            })
            await axios.fetch("careServer", "/carePatrolItem/task", param).then(res => {
                this.detailInfo = res.data.map(val => {
                    val.tagsList = val.tags ? val.tags.split(',') : ['--'];
                    val.description = val.description ? val.description : '无异常';
                    return val;
                });
                this.total = res.total;
            });
        },
        back () {
            this.$router.back()
        },
        handleChange(i){
            this.currentPage=i;
            this.getDetail();
        },
        // 未巡视详情
        detailUnCheck(){
            // 用mouseover代替hover，添加节流事件
            if (this.flag) {return}
            this.flag = false;
            setTimeout(() => {
                this.gridDataLoading = true;
                let param = {
                    taskId:this.param.id
                }
                axios.fetch("careServer", "/carePatrolItem/elder", param).then(res => {
                    this.gridDataLoading = false;
                    this.gridData = res.data;
                    this.flag = true;
                });
            },200)
        },
        reset(){
            this.timeId = '';
            this.querydata();
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
</style>
