<template>
  <div>
    <el-form :inline="true" class="search" ref="searchForm" :model="searchForm">
        <el-form-item label="长者姓名" label-width="5em">
            <!-- <el-input v-model="searchForm.elderName" placeholder="请输入长者姓名" clearable></el-input> -->
          <ub-elder v-model="searchForm.elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
        </el-form-item>
        <el-button type="primary" @click="searchInfo()" icon="el-icon-search" style="background-color:#2368D3;">查询</el-button>
        <el-button @click="reset()" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
        <el-row type="flex" class="pannel">
            <el-col class="right">
                <el-button class="button-purple" @click="applyLeave" icon="iconfont iconmokuaitubiao-jiu-churuyuanguanli">离院撤床</el-button>          
            </el-col>
        </el-row>
        <el-table :data="tableData" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
            <el-table-column prop="checkoutNo" label="离院单号" align="center"></el-table-column>
            <el-table-column prop="elderName" label="长者姓名" align="center"></el-table-column>
            <el-table-column prop="cardNo" label="身份证号" align="center"></el-table-column>
            <el-table-column prop="checkoutRemark" label="离院原因" align="center"></el-table-column>
            <el-table-column prop="checkoutDate" label="离院时间" align="center"></el-table-column>
            <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
            <el-table-column prop="statusRemark" label="状态" align="center">
                <!-- <template slot-scope="scope">{{scope.row.status | statusFilter}}</template> -->
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                        <el-button size="mini" @click="see(scope.row)" icon="iconfont iconcaozuotubiao-chakan"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="办理" placement="top-end" v-if="scope.row.status!=200">
                        <el-button size="mini" @click="edit(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="打印" placement="top-end" v-if="scope.row.status===200">
                        <el-button size="mini" @click="print(scope.row)" icon="iconfont iconcaozuotubiao-dayin"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
		</el-pagination>
    </div>
    <div class="dialog">
        <el-dialog center title="离院申请" :visible.sync="dialogLeaveVisible" id="changeDialog" width="600px">
			<el-form :rules="rules" label-width="100px">
				<el-form-item label="长者姓名" prop="buildingFloor">
                    <el-row>
                        <el-col :span="11" style="margin-right:5px;">
                            <el-cascader v-model="buildingFloor" :props="{ checkStrictly: false }" clearable placeholder="楼宇" @change="changeBuilding" :options="buildingOption" change-on-select></el-cascader>
                        </el-col>
                        <el-col :span="6" style="margin-right:5px;">
                            <el-select v-model="roomId" placeholder="房间" @change="changeRoom" clearable>
                                <el-option v-for="item in roomOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5">	 						
                            <el-select @change="selectUser" v-model="leaveApply.elderId" placeholder="姓名" clearable no-data-text="暂无老人">
                                <el-option v-for="(item,index) in elderOption" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>	
                </el-form-item>
                <el-form-item label="离院原因" prop="checkoutRemark">
                    <el-radio-group v-model="leaveApply.checkoutRemark">
                        <el-radio v-for="(item,index) in leaveReasons" :key="index" :label="item">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>  
                <el-form-item label="离院时间" prop="checkoutDate">
                    <el-date-picker  :picker-options="pickerOptions" v-model="leaveApply.checkoutDate" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="请选择离院时间" clearable></el-date-picker>
                    <el-checkbox v-model="leaveApply.isDraw">立即释放床位</el-checkbox>
                </el-form-item>
                <el-form-item label="说明">
                   <el-input type="textarea" :maxlength="255" :rows="4" v-model="leaveApply.remark" clearable></el-input>     
                   <span class="sinfo">({{leaveApply.remark.length}}/255)</span>           
                </el-form-item>  
				<div class="buttons" style="text-align:center;">
					<el-button type="primary" @click="confirm()">确定</el-button>
					<el-button @click="cancel()">取消</el-button>
				</div>
			</el-form>
		</el-dialog>
    </div>
  </div>
</template>

<script>
import { axios } from 'youban-utils';
import utilsTable from '@/utils/table';
import ubElder from "@/components/elder";

import printMethods from '@/utils/print';
export default {
    components: {
        ubElder
    },
  data() {
    return {
      roomId: '', 
      leaveApply: {remark:'',isDraw: true,},
      buildingFloor: [],  
      buildingOption: [],
      roomOption: [],
      elderOption: [],
      currentPage: 1,
      totalPage: 0,
      tableData: [],
      dialogLeaveVisible: false,
      searchForm: {
        elderName: '',
        pageIndex: 1,
        pageSize: 10
      },
      leaveReasons: ["自动出院","本院死亡","外院死亡","其它"],
      rules: {   
        buildingFloor:[ 
        { required: true, message: '',trigger: "blur,change"}
        ],
        checkoutRemark:[
        { required: true, message: '',trigger: "blur,change"}
        ],
        checkoutDate:[ 
        { required: true, message: '',trigger: "blur,change"}
        ]
      },
      pickerOptions:{
        // disabledDate(time){
        //   return time.getTime() < Date.now() - 8.64e7
        // }
      }
    }
  },
  created() {
    this.fetchData();
    this.initBuilding();
  },
  methods: {
    ...utilsTable,
    ...printMethods,
    selectUser(val){
        console.log(val)
        axios.fetch('elderServer', '/elderCheckout/get/elderLeave', {elderId:val}).then(res => {
            if(res.data !== null && res.total == 0) {
                this.$message.error(res.data);
                this.dialogLeaveVisible = false;
            }else if(res.total > 0){
                this.netCheck(val)
            }
        });
    },
    netCheck (val) {
        this.$confirm('该用户有请假单未审核，是否进入审核页面?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$store.state.noCheckUserID = val;
            this.$router.push({
                path: "/elder/leave"
            });
        }).catch(() => {});
    },
    fetchData() {
      let that = this;
      axios.fetch('elderServer', '/elderCheckout/query', this.searchForm).then(res => {
        that.tableData = res.data;
        this.totalPage = res.total;
		// this.currentPage = 1;
      });
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.fetchData();
    },
    //楼宇 楼层 房间 床位控件
    initBuilding(){
        let that = this;
        axios
        .fetch('oaServer', "/org/building/list")
        .then(res => {
            let opt = [];
            let building = res.data;
            building.forEach(item=> {
                let subOpt = {};
                subOpt.value = item.buildingId;
                subOpt.label = item.buildingName;
                let floor = parseInt(item.floors);
                if(typeof floor == "number") {
                    let children = [];
                    for(let i = 0; i < floor; i++) {
                        let sub = {};
                        sub.value = i + 1;
                        sub.label = i + 1 + "层";
                        children.push(sub);
                    }
                    subOpt.children = children;
                }
                opt.push(subOpt);
            });
            that.buildingOption = opt;
        });
    },
    changeBuilding(value) {
        this.roomId="";
        this.leaveApply.elderId="";
        this.roomOption=[];
        this.elderOption=[];
        if(value.length==0) return;
        let data = {
            buildingId: value[0],
            floor: value[1],
            pageSize: 1000
        };
        axios
        .fetch('oaServer', "/org/room/list", data)
        .then(res => {
            this.roomOption = res.data.map(item=>{
                return {
                    label: item.roomName,
                    value: item.roomId
                }
            });
        });
    },
    changeRoom(id){
        this.leaveApply.elderId="";
        this.elderOption=[];
        if(id=="") return;
        let data = {
            roomId: id,
            status: 100
        };
        axios
        .fetch('elderServer', "/elderCheckout/get/elderInfo", data)
        .then(res => {
            this.elderOption = res.data.map(item=>{
                return {
                    label: item.elderName,
                    value: item.elderId
                }
            })
        })
    },
    applyLeave(){     
        this.leaveApply = {
            checkoutRemark: '自动出院',
            elderId: "",
            remark:'',
            isDraw: true,
        };
        this.buildingFloor = [];
        this.roomId = "";
        this.roomOption = [];
        this.elderOption = [];
        this.dialogLeaveVisible = true;
    },
    confirm(){ 
        if(this.leaveApply.elderId === '' || this.leaveApply.elderId === null || this.leaveApply.elderId === undefined){
            this.$message.error('请选择长者姓名');return;
        }else if(this.leaveApply.checkoutRemark === '' || this.leaveApply.checkoutRemark === null || this.leaveApply.checkoutRemark === undefined){
            this.$message.error('请选择离院原因');return;
        }else if(this.leaveApply.checkoutDate === '' || this.leaveApply.checkoutDate === null || this.leaveApply.checkoutDate === undefined){
            this.$message.error('请选择离院时间');return;
        }
        this.leaveApply.isDraw = Number(this.leaveApply.isDraw)
        axios
        .fetch('elderServer', "/elderCheckout/update", this.leaveApply)
        .then(res => {
            this.$message({
                message: "保存成功",
                type: "success"
            });
            this.dialogLeaveVisible = false;
            this.fetchData();
        })
    },
    cancel(){
       this.dialogLeaveVisible = false;
    },
    //编辑
    edit(data){
        this.$router.push({
            path: "/elder/checoutDeal",
            query: {
                elderId: data.elderId
            }
        });
    },
    //查看
    see(data){
        this.$router.push({
            path: "/elder/toConfirmed",
            query: {
                elderId: data.elderId,
                type:'checkout'
            }
        });
    },
    //打印
    print(data){
        this.$router.push( {
            path: 'checkoutPrintForm',
            query: {
                elderId: data.elderId
            }
        });
    },
    //查询
    searchInfo(){
       this.searchForm.pageIndex = 1;
       this.currentPage = 1;
       this.fetchData();
    },
    //重置
    reset(){
        this.searchForm = {
            elderId:'',
            elderName: '',
            pageIndex: 1,
            pageSize: 10
        };
        this.currentPage = 1;
        this.fetchData();
    }
  },
 /*  watch:{
    $route(to,from){
        console.log(from);
        this.dataInit(); 
    }
  }, */
  filters:{
     statusFilter: val => {
        if(val == 0) {
            val = "待护理部确认";
        } else if(val == 10) {
            val = "待医务部确认";
        } else if(val == 20) {
            val = "待总务部确认";
        } else if(val == 30) {
            val = "待财务部确认";
        } else if(val == 40) {
            val = "待业务部办理";
        } else if(val == 200) {
            val = "已离院";
        } else if(val == 50) {
            val = "待院长审核";
        }
        return val;
     }
  }
}
</script>

<style lang="less" scoped>
.sinfo{
  margin-left: 10px;
  color: #aaa;
}
</style>