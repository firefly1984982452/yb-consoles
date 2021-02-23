<template>
    <div>
        <el-form :inline="true" class="search" >
            <el-button size="mini" class="back" @click="back">返回</el-button>
        </el-form>
        <el-form>
            <div class="content">
                <el-row type="flex" class="pannel">
                    <el-col class="left">
                        <s class="redBa"></s>
                        <span>{{detailInfo.areaName}}交班报告</span>
                        <span>{{detailInfo.reportDate}}</span>
                        <el-button>{{detailInfo.workTimeName}}</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <div class="report">
                        <div class="left">
                            <div class="sum">
                                <div>
                                    <p>{{detailInfo.itemCount}}</p>
                                    <p>总人数</p>
                                </div>
                                <div>
                                     <p>{{detailInfo.doneCount}}</p>
                                    <p>实有人数</p>
                                </div>
                            </div>
                            <ul class="info">
                                <li v-for="item in detailInfo.patrolReportDetails" :key="item.id">
                                    <span>{{item.tagCount}}</span>
                                    <b>{{item.tagName}}</b>
                                </li>
                            </ul>
                        </div>
                        <div class="right">
                            <div class="info">交班班长：<span>{{detailInfo.leaderName}}</span><span>{{detailInfo.createTime}}</span></div>
                            <div class="info">交班人员：<span v-for="(item,index) in detailInfo.currentCarersList" :key="index">{{item}}</span></div>
                            <div class="info">接班人员：<span v-for="(item,index) in detailInfo.nextCarersList" :key="index">{{item}}</span></div>
                        </div>
                    </div>
                </el-row>
                <el-table
                    class="ub-table"
                    :data="detailInfo.patrolItemVos"
                    row-key="id"
                    border>
                    <el-table-column prop="elderName" label="长者">
                        <template slot-scope="scope">
                            <span>{{scope.row.elderName}}</span>
                             <p v-if="scope.row.isNew">(新入)</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="房间床位">
                        <template slot-scope="scope">
                            <span>{{scope.row.roomName}} - {{scope.row.bedName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="巡视记录"></el-table-column>
                    <el-table-column prop="operatorName" label="记录人"></el-table-column>
                    <el-table-column prop="operateTime" width="180" label="记录时间"></el-table-column>
                </el-table>
            </div>
        </el-form>
    </div>
</template>
<script type="text/javascript">
export default {
    name: "",
    data() {
        return {
            detailInfo:{
                checkinDate:''
            },
            scheduleDateList:[],
            detailID:'',
            pageSize:10,
            currentPage:1,
            total:0,
        };
    },
    mounted(){
        this.id = this.$route.query.id;
        this.getDetail();
    },
    methods: {
        // 获取当天所有日程
        getScheduleDate(){
            axios.fetch('medicalServer', "/api/ward/schedule/same-day/" +this.scheduleDate,{},'form','get').then(res => {
                if(res.code ==200){
                this.scheduleDateList = res.data
                }     
            })
        },
        getDetail(){
            axios.fetch("careServer", "/carePatrolReport/all", {id: this.id,isMyReport: false,}).then(res => {
                this.detailInfo = res.data[0];
                this.detailInfo.nextCarersList = this.detailInfo.nextCarers.split(',');
                this.detailInfo.currentCarersList = this.detailInfo.currentCarers.split(',');
            });
        },
        back () {
            this.$router.back()
        },
    }
};
</script>

<style lang="less" scoped>
.report{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 150px;
    margin: 0 0 20px 0;
    .left{
        width: 65%;
        display: flex;

        // flex-direction: row;
        // justify-content: space-around;
        border: 1px solid #999;
        .sum {
            flex: 1;
            display: flex;
            padding: 15px 0;
            >div {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                p:nth-child(1){
                    font-size: 32px;
                    font-weight: bold;
                }
                p:nth-child(2){
                    color:#666;
                }
            }
            div:nth-child(2){
            border-right: 1px solid #999;
            }
        }
        .info{
            flex: 3;
            display: flex;
            flex-wrap: wrap;
            li {
                box-sizing: border-box;
                display: flex;
                width: 25%;
                flex: 1;
                flex: none;
                height: 50%;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                // padding: 10px;
                 span{
                    font-size: 32px;
                    font-weight: bold;
                }
                b{
                    color:#666;
                }
            }
        }
    }
    .right{
        width: 33%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border: 1px solid #999;
        text-align: left;
        padding: 0 0 0 20px;
        box-sizing: border-box;
        .info{
            span{
                margin: 0 10px 0 0;
            }
        }
    }
}
</style>
