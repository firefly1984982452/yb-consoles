<template>
    <div>
        <el-form :inline="true" class="search" >
            <el-form-item label="长者姓名">
                <ub-elder v-model="search.id" @change="item => search.elderName = item.elderName" clearable></ub-elder>
            </el-form-item>
            <el-form-item label="护理区域">
                <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
            </el-form-item>
            <el-form-item label="护理等级">
                <el-select v-model="search.nursingLevel" clearable placeholder="请选择">
                    <el-option v-for="(item,index) in levels" :key="index" :label="item.title" :value="item.itemValue"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleChange(1)">查询</el-button>    
            <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>      
        </el-form>
        <div class="content">
              <el-table
                class="ub-table"
                :data="data"
                row-key="id"
                border>
                <el-table-column prop="area" label="区域"></el-table-column>
                <el-table-column prop="elderName" label="长者"></el-table-column>
                <el-table-column label="房间床位">
                    <template slot-scope="scope">
                        <span>{{scope.row.roomName}} - {{scope.row.bedName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="nursingLevel" label="护理等级">
                    <template slot-scope="scope">
                        <span>护理{{scope.row.nursingLevel | filterLevel}}级</span>
                    </template>
                </el-table-column>
                <el-table-column prop="levelCount" label="护理内容数">
                    <template slot-scope="scope">
                        <span>{{scope.row.levelCount}}项</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="serviceCount" label="计划确认数">
                    <template slot-scope="scope">
                        <span>{{scope.row.serviceCount}}项</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="计划确认状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | filterStatus}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                            <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>

<script>
import ubElder from "@/components/elder";
export default {
    components: { ubElder,},
    data(){
        return {
            setArea:'',
            dialogAddVisible: false,
            search:{
                id:'',
                elderName:'',
                nursingLevel:'',
                areaId:'',
                status:''
            },
            pageSize:10,
            currentPage:1,
            total:0,
            data:[],
            levels:[],
            statusList:[{
                value: '0',
                label: '待确认'
            },{
                value: '100',
                label: '已确认'
            }]
        }
    },
    mounted(){
        this.getdata();
        this.getLevel();
    },
    methods:{
        getArea(val){
            this.search.areaId = val.value;
            this.setArea = val.text;
        },
        getLevel(){
            axios.fetch('commonServer', "/dict/getItemViewsByGroup",{groups:'院方护理等级'}).then(res => {
            if(res.code ==200)
                this.levels = res.data      
            })
        },
        getdata(){
            let param = {
                pageIndex:this.currentPage,
                pageSize:this.pageSize,
                elderName:this.search.elderName,
                areaId:this.search.areaId,
                status:this.search.status,
                nursingLevel: this.search.nursingLevel
            } 
            axios.fetch("careServer", "/elderService/nursingProject/elder",param).then(res => {
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
          let routerUrl = this.$router.resolve({
              path: "/care/plan/PlanElderDetail",
              query: {
                  id: val.itemId
              }
          });
          window.open(routerUrl.href, '_blank');
        },
        // 重置
        reset () {
            if (this.$refs.areaCom !== undefined) {
                this.$refs.areaCom.resetArea();
                this.setArea = '';
            }
            this.search = {
                id:'',
                employeeName:'',
                deptId:'',
                jobId:'',
                nursingLevel:''
            };
            this.currentPage = 1;
            this.getdata()
        },
    },
    filters:{
        filterLevel: val => {
            return ['','一','二','三','四','五','六'][val]
        },
        filterStatus: val => {
            switch (val) {
                case 0:
                    return '待确认';
                    break;
                case 100:
                    return '已确认';
                    break;
            
                default:
                    break;
            }
        }
    }
}
</script>

<style lang="less" scoped>
</style>