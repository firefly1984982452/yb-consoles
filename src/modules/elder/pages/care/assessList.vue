<template>
    <!-- 照护评估老人列表 -->
    <div>
        <el-form ref="searchForm" :inline="true" class="search" :model="searchForm" label-width="70px">
            <el-form-item label="老人姓名">
                <!-- <el-input v-model="searchForm.elderName" placeholder="请输入" clearable size="mini" style="width:100px"></el-input> -->
                <ub-elder v-model="searchForm.elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
            </el-form-item>
            <el-form-item label="评估类别">
                <el-select clearable v-model="searchForm.estimateType" placeholder="请选择" size="mini">
                    <el-option v-for="item in categoryOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="到期时间">
                <el-select clearable v-model="searchForm.day" placeholder="请选择" size="mini">
                    <el-option v-for="item in dayOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="评估时间">
                <el-date-picker v-model="searchForm.startDate[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
                <el-date-picker v-model="searchForm.startDate[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
            </el-form-item>
            <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询</el-button>
            <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
        </el-form>
        <div class="content">
            <el-row type="flex" class="pannel">
                <el-col class="right">
                    <el-button type="success" icon="el-icon-plus" @click="addAssess()">新增</el-button>
                </el-col>
            </el-row>
            <el-table :data="listData" border class="ub-table">
                <el-table-column prop="estimateNo" label="评估编号" min-width="70"></el-table-column>
                <el-table-column prop="checkinNo" label="入院编号" min-width="60"></el-table-column>
                <el-table-column prop="elderName" label="老人姓名" min-width="50"></el-table-column>
                <el-table-column prop="estimateType" label="评估类别" min-width="80">
                    <template slot-scope="scope">
                        <!-- <span @click="see(scope.row)">{{scope.row.estimateType | typeFilter}}</span> -->
                        <span>{{scope.row.estimateType | typeFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="estimateCount" label="评估次数" min-width="50"></el-table-column>
                <el-table-column prop="startDate" label="评估时间" min-width="120">
                    <template slot-scope="scope">
                        <!-- <span @click="see(scope.row)">{{scope.row.startDate | dateTimeFilter}}至{{scope.row.endDate | dateTimeFilter}}</span> -->
                        <span>{{scope.row.startDate | dateTimeFilter}}至{{scope.row.endDate | dateTimeFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="levelName" label="照护等级" min-width="80"></el-table-column>
                <el-table-column label="评估人员" min-width="100">
                    <template slot-scope="scope">
                        <!-- <span @click="see(scope.row)"> -->
                        <span>
                            <span v-if="scope.row.doctorName !== null">{{scope.row.doctorName | nothingFilter}}</span>
                            <span v-else>{{scope.row.creator | nothingFilter}}</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看" placement="top">
                            <el-button icon="iconfont iconcaozuotubiao-chakan" @click="see(scope.row)" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="scope.row.isAdd===true">
                            <el-button @click="repair(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="打印" placement="top">
                            <el-button @click="print(scope.row)" icon="iconfont iconcaozuotubiao-dayin" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="新评估" placement="top" v-if="scope.row.isAdd===true">
                            <el-button @click="continueAssess(scope.row)" icon="iconfont iconcaozuotubiao-pinggu-xuanfu" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { axios } from "youban-utils";
import printMethods from '@/utils/print';
import ubElder from "@/components/elder";
export default {
    data() {
        return {
            searchForm: {
                estimateType: "",
                day: "",
                elderName: "",
                startDate: [],
                pageIndex: 1,
                pageSize: 10
            },
            categoryOption: [
                {
                    value: 0,
                    label: "首次评估"
                },
                {
                    value: 1,
                    label: "复核评估"
                },
                {
                    value: 2,
                    label: "持续评估"
                }
            ],
            dayOption: [
                {
                    value: "15",
                    label: "15天以内"
                },
                {
                    value: "30",
                    label: "30天以内"
                }
            ],
            listData: [],
            totalPage: 0,
            currentPage: 1,
            sign: "",
            userId: "",
            option: [],
            //编辑后滞空
            haveEdited: 0,
            repairParams: {}
        };
    },
    components: {
        ubElder
    },
    computed: {},
    created() {
    },
    methods: {
        ...printMethods,
        cellStyle({ row, column, rowIndex, columnIndex }) {
            return "padding: 5px 0";
        },
        dataInit() {
            let data = this.searchForm;
            axios.fetch("elderServer", "/elderEstimate/elderMaxData", data).then(res => {
                this.listData = res.data;
                this.totalPage = res.total;
                // this.currentPage = 1;
            });
        },
        searchInfo() {
            if(this.searchForm.startDate[0] && !this.searchForm.startDate[1]){
                this.$message.warning('请选择结束时间');
                return false;
            } else if(!this.searchForm.startDate[0] && this.searchForm.startDate[1]){
                this.$message.warning('请选择开始时间');
                return false;
            } else if(this.searchForm.startDate[0] && this.searchForm.startDate[1]){
                if(this.$moment(this.searchForm.startDate[0]).valueOf()>this.$moment(this.searchForm.startDate[1]).valueOf()) {
                    this.$message.warning('开始时间不能超过结束时间');
                    return false;
                } else {
                this.searchForm.pageIndex = 1;
                this.currentPage = 1;
                this.dataInit();
                }
            }else {
                this.searchForm.pageIndex = 1;
                this.currentPage = 1;
                this.dataInit();
            }
        },
        /*刷新*/
        reset() {
            this.loading = true;
            this.searchForm.elderName = "";
            this.searchForm.elderId = "";
            this.searchForm.estimateType = "";
            this.searchForm.day = "";
            this.searchForm.startDate = [];
            this.searchForm.pageIndex = 1;
            this.currentPage = 1;
            this.dataInit();
        },
        /*查询第几页数据*/
        handleCurrentChange(val) {
            this.searchForm.pageIndex = val;
            this.dataInit();
        },
        see(data) { 
            // let routeData = this.$router.resolve({
            //     path: "/elder/seeAssess",
            //     query: {
            //         assessList: true,
            //         elderId: data.elderId
            //     }
            // });
            // window.open(routeData.href, '_blank');
            this.$router.push({
                path: "/elder/seeAssess",
                query: {
                    assessList: true,
                    elderId: data.elderId
                }
            });
        },
        repair(data) {
            this.repairParams = {
                buildingName: "",
                roomName: "",
                estimateType: data.estimateType,
                levelName: data.levelName,
                elderId: data.elderId,
                elderName: data.elderName,
                startDate: data.startDate,
                endDate: data.endDate,
                createTime: data.createTime,
                version: data.version
            };
            this.$router.push({
                path: "/elder/care/assessEdit",
                query: {
                    sign: "repair",
                    estimateId: data.estimateId,
                    repairParams: JSON.stringify(this.repairParams)
                }
            });
        },
        print(data) {
            this.openPrint({
                path: "/print/elder/care",
                query: {
                    estimateId: data.estimateId
                }
            });
        },
        continueAssess(data) {
            this.repairParams = {
                estimateType: 2,
                elderId: data.elderId,
                elderName: data.elderName,
                endDate: data.endDate
            };
            this.$router.push({
                path: "/elder/care/assessEdit",
                query: {
                    sign: "add",
                    repairParams: JSON.stringify(this.repairParams)
                }
            });
        },
        addAssess() {
            this.$router.push({
                path: "/elder/care/assessEdit",
                query: {
                    sign: "add"
                }
            });
        }
    },
    filters: {
        typeFilter: val => {
            if (val === 0) {
                return "首次评估";
            } else if (val === 1) {
                return "复核评估";
            } else if (val === 2) {
                return "持续评估";
            } else {
                return "--";
            }
        },
        dateTimeFilter: val => {
            if (val) {
                return val.split(" ")[0];
            } else {
                return "--";
            }
        }
    },
    beforeRouteEnter(to,from,next){
        console.log(from.name)
        if(from.name == '评估列表详情' || from.name == '照护评估编辑'){
            to.meta.isBack = true;
        }
        next();
    },
    activated(){
      if(!this.$route.meta.isBack){
        this.$nextTick(()=>{
          let expireTime =this.$route.query.expireTime;
          if(expireTime) {
            this.searchForm.day = "" + expireTime;
          } else {
            this.searchForm.day = "";
          }
          this.searchForm.elderName = "";
          this.searchForm.elderId = "";
          this.searchForm.estimateType = "";
          this.searchForm.startDate = [];
          this.searchForm.pageIndex = 1;
          this.currentPage = 1;
          this.dataInit();
        })
      }
      this.$route.meta.isBack = false;
    },
    watch: {
        $route(to, from) {
            this.dataInit();
        }
    }
};
</script>
<style scoped>
#userList .el-pagination {
    margin-top: 20px;
    float: right;
    position: relative;
    right: 130px;
}

#userList .el-pagination__editor.el-input {
    width: 50px;
}

#staffTableStyle {
    background: transparent;
    width: 95%;
    transform: translateX(-50%);
    position: relative;
    left: 50%;
}
.daoruNetBtn {
    background: #8641ff;
    color: #fff;
    border-color: #8641ff;
}
.daoruNetBtn:hover {
    background: #8641ff;
}
.daoruBtn:hover {
    background: #f49b31;
    color: white;
    border: 1px solid #f49b31;
}
</style>