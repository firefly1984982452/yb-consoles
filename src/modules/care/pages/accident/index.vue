<!--老人事故-->
<template>
  <div>
    <el-form :inline="true" class="search" >
      <el-form-item label="长者姓名">
        <ub-elder v-model="elderId" @change='item => elderName = item.elderName' clearable></ub-elder>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="roomType" clearable placeholder="请选择">
          <el-option :label="item.name" :value="item.val" v-for="item in statusList" :key="item.val"></el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="发生日期" label-width="5em">
        <el-date-picker  type="datetimerange" v-model="searchDate" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="querydata">查询</el-button>    
      <el-button  icon="el-icon-refresh-right" @click="reset">重置</el-button>      
    </el-form>
    <div class="content">
			<el-row type="flex" class="pannel">
				<el-col class="right">
					<el-button type="success" icon="el-icon-plus" @click="addOneCon">添加</el-button>       
				</el-col>
			</el-row>
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column prop="accidentNo" label="事故编号" align="center"></el-table-column>
        <el-table-column  label="发生日期" >
            <template slot-scope="scope"><span>{{(scope.row.accidentTime).substr(0,10)}}</span></template>
        </el-table-column>
        <el-table-column label="事故类型" align="center" >
          <template slot-scope="scope">{{scope.row.accidentName}}</template>
        </el-table-column>
        <el-table-column prop="elderName" label="长者姓名" align="center"></el-table-column>
        <el-table-column prop="employeeName" label="责任人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" ></el-table-column>
        <el-table-column prop="creatorName" label="创建人" align="center" ></el-table-column>
        <el-table-column label="状态" align="center" >
          <template slot-scope="scope">{{scope.row.status|filterStatus}}</template>
        </el-table-column>
				<el-table-column label="操作" width="80%">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="提交" placement="top-end"  v-if="scope.row.status == 0">
							<i @click="repair(scope.row)" class="icon-status iconfont-3"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="处理" placement="top-end"  v-if="scope.row.status == 1">
							<i @click="repair(scope.row)" class="icon-status iconfont-2"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="处罚和审批" placement="top-end"  v-if="scope.row.status == 10 || scope.row.status == 20">
							<i @click="repair(scope.row)" class="icon-status iconfont-1"></i>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="详情" placement="top-end"  v-if="scope.row.status == 100">
							<i @click="repair(scope.row)" class="icon-status iconfont-4"></i>
						</el-tooltip>
					</template>
				</el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" :currentPage="currentPage" @current-change="handleChange" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!-- 单个新增弹出框 -->
    <el-dialog title="添加" :visible.sync="dialogAddVisible" center  width="25%">
      <el-form label-width="100px" :model="addInfo" :rules="rules" ref="addInfo">
        <el-form-item label="事故类型" prop="accidentName">
          <el-select v-model="addInfo.accidentName" clearable placeholder="请选择">
            <el-option :label="item.itemValue" :value="item.itemValue" v-for="item in typeList" :key="item.itemId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发生日期" prop="intervalTime">
          <el-date-picker 
              v-model="addInfo.intervalTime"
              type="date"
              placeholder="请选择发生日期"
              value-format="yyyy-MM-dd"
              clearable>
              </el-date-picker>
        </el-form-item>
        <el-form-item label="长者姓名" prop="elderId">
          <ub-elder v-if="isShow" v-model="addInfo.elderId" :status="[100]" @change="item => addInfo.elderName = item.elderName" clearable></ub-elder>
        </el-form-item>
        <el-form-item label="护理员" prop="employeeId">
          <ub-employee v-if="isShow" v-model="addInfo.employeeId" deptName="护理部" @change="item => addInfo.employeeName = item.employeeName" clearable></ub-employee>
        </el-form-item>
        <el-form-item label="事故原因" prop="accidentDescription">
          <el-input type="textarea" v-model.trim="addInfo.accidentDescription" maxlength="200" placeholder="请输入事故原因"  clearable></el-input>                
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddOne(0)">保 存</el-button>
        <!-- <el-button type="warning" @click="submitAddOne(1)">提 交</el-button> -->
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :title="detailTitle" :visible.sync="dialogEditVisible" center  width="40%">
      <div class="info">
        <div class="title">
          <p>事故类型：<span>{{editInfo.accidentName}}</span></p>
          <p>长者姓名：<span>{{editInfo.elderName}}</span></p>
          <p>发生日期：<span>{{editInfo.accidentTime}}</span></p>
          <p>护理员：<span>{{editInfo.employeeName}}</span></p>
        </div>
        <div class="content">
          <!-- 事故原因 -->
          <div>
            <div class="box input" v-if="editInfo.status == 0">
              <div class="top">
                <p>事故原因</p>
                <span>{{editInfo.creatorName}}&nbsp;&nbsp;{{editInfo.createTime}}</span>
              </div>
              <div class="bottom">
                <el-input type="textarea" v-model.trim="editInfo.accidentDescription" maxlength="200" placeholder="请输入事故原因"  clearable></el-input>
              </div>
            </div>
            <div class="box" v-else>
              <div class="top">
                <p>事故原因</p>
                <span>{{editInfo.creatorName}}&nbsp;&nbsp;{{editInfo.createTime}}</span>
              </div>
              <div class="bottom">{{editInfo.accidentDescription}}</div>
            </div>
          </div>
          <!-- 处理方案 -->
          <div v-if="editInfo.status > 0">
            <div class="box input" v-if="editInfo.status == 1">
              <div class="top">
                <p>处理方案</p>
              </div>
              <div class="bottom">
                <el-input type="textarea" v-model.trim="editInfo.handleResult" maxlength="200" placeholder="请输入处理方案"  clearable></el-input>
              </div>
            </div>
            <div class="box" v-else>
              <div class="top">
                <p>处理方案</p>
                <span>{{editInfo.handleName}}&nbsp;&nbsp;{{editInfo.handleTime}}</span>
              </div>
              <div class="bottom">{{editInfo.handleAdvice}}</div>
            </div>
          </div>
          <!-- 处罚方案 -->
          <div v-if="editInfo.status > 1">
            <div class="box input" v-if="editInfo.status == 10">
              <div class="top">
                <p>处罚方案</p>
              </div>
              <div class="bottom">
                <el-input type="textarea" v-model.trim="editInfo.handleResult" maxlength="200" placeholder="请输入处罚方案"  clearable></el-input>
              </div>
            </div>
            <div class="box" v-else>
              <div class="top">
                <p>处罚方案</p>
                <span>{{editInfo.punishName}}&nbsp;&nbsp;{{editInfo.punishTime}}</span>
              </div>
              <div class="bottom">{{editInfo.punishAdvice}}</div>
          </div>
          <!-- 审批建议 -->
          <div v-if="editInfo.status > 10">
            <div class="box input" v-if="editInfo.status == 20">
              <div class="top">
                <p>审批建议</p>
              </div>
              <div class="bottom">
                <el-input type="textarea" v-model.trim="editInfo.handleResult" maxlength="200" placeholder="请输入审批建议"  clearable></el-input>
              </div>
            </div>
            <div class="box" v-else>
              <div class="top">
                <p>审批建议</p>
                <span>{{editInfo.leaderName}}&nbsp;&nbsp;{{editInfo.leaderTime}}</span>
              </div>
              <div class="bottom">{{editInfo.leaderAdvice}}</div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" v-show="editInfo.status !== 100">
        <!-- <el-button @click="cancelEdit">取 消</el-button> -->
        <el-button type="primary" v-if="editInfo.status == 20" @click="submitEditDate">审核通过</el-button>
        <el-button type="primary" v-else @click="submitEditDate">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ubElder from "@/components/elder";
import ubEmployee from "@/components/employee";
export default {
  components: { ubElder,ubEmployee },
  data(){
    return {
      elderId:'',
      detailTitle: '详情',
      isShow: false,
      isShowSearch: true,
      searchDate:[],
      typeList: [],
      statusList: [ //0待提交，1已提交，10已处理，20已处罚，100完成
        {
          name: '待提交',
          val:0
        },{
          name: '待处理',
          val:1
        },{
          name: '待处罚',
          val:10
        },{
          name: '待审批',
          val:20
        },{
          name: '已审核',
          val:100
        }
      ],
      dialogAddVisible: false,
      dialogEditVisible: false,
      editInfo:{},
      addInfo:{
        elderId: '',
        elderName:'',
        accidentName:'',
        intervalTime:'',
        accidentDescription: '',
        employeeName: '',
        employeeId: ''
      },
      rules: {
        accidentName: [
          { required: true, message: '请选择事故类型', trigger: 'change' }
        ],
        intervalTime: [
          { type: 'string', required: true, message: '请选择发生日期', trigger: 'change' }
        ],
        elderId: [
          { required: true, message: '请选择长者', trigger: 'change' }
        ],
        employeeId: [
          { required: true, message: '请选择护理员', trigger: 'change' }
        ],
        accidentDescription: [
          { required: true, message: '请输入事故原因', trigger: 'blur' },
        ],
      },
      levels:[],
      data:[],

      elderName:'',
      roomType:'',
      pageSize:10,
      currentPage:1,
      total:0,
      allElderOption:[],
      allElderData: [],
      multipleSelection: []
    }
  },
  created(){
    this.getdata();    
  },
  methods:{
    cancelEdit(){
      this.editInfo = {}
      this.dialogEditVisible = false
    },
    addMulit () {
      this.chioseYear = '';
      this.chioseMonth = '';
      this.dialogFormVisible = true
    },
    addOneCon () {
      this.getType();
      this.addInfo = {};
      this.isShow = true;

    if (this.$refs["addInfo"] !== undefined) {
      this.$refs["addInfo"].resetFields();
    }
      this.dialogAddVisible = true;
    },
    getdata(){
      this.isShowReview = this.roomType == 1 ? false : true;
      axios.fetch('elderServer', "/elderAccident/query",{
        pageIndex:this.currentPage,
        pageSize:this.pageSize,
        status:this.roomType,
        elderName:this.elderName,
        startTime: this.searchDate[0],
        endTime: this.searchDate[1],
      }).then(res => {
        if(res.code ==200){
          this.total = res.total;
          this.data = res.data
        }     
      })
    },
    handleChange(i){
      this.currentPage=i;
      this.getdata();
    },
    // 确认新增一个数据
    submitAddOne (index){
      console.log(this.addInfo)
      // if(this.addInfo.accidentName == undefined || this.addInfo.accidentName == '') return this.$message.error('请选择事故类型');
      // if(this.addInfo.intervalTime == undefined || this.addInfo.intervalTime == '') return this.$message.error('请选择发生日期');
      // if(this.addInfo.elderId == undefined || this.addInfo.elderId == '') return this.$message.error('请选择长者');
      // if(this.addInfo.employeeId == undefined || this.addInfo.employeeId == '') return this.$message.error('请选择护理员');
      // if(this.addInfo.accidentDescription == undefined || this.addInfo.accidentDescription == '') return this.$message.error('请输入事故原因');
      this.$refs['addInfo'].validate((valid) => {
          if (valid) {
            axios.fetch('elderServer', "/elderAccident/update",{
              elderId: this.addInfo.elderId,
              elderName:this.addInfo.elderName,
              accidentName: this.addInfo.accidentName,
              accidentTime: this.addInfo.intervalTime + ' 00:00:00',
              accidentDescription: this.addInfo.accidentDescription,
              employeeId: this.addInfo.employeeId,
              employeeName: this.addInfo.employeeName
            }).then(res => {
              if(res.code ==200){
                if (index == 1) {
                  axios.fetch('elderServer', "/elderAccident/handle",{
                    accidentId: res.data.accidentId,
                    status: res.data.status,
                    handleResult:''
                  }).then(r => {
                    if(r.code ==200){
                      this.$message.success('成功')
                      this.isShow = false;
                      this.dialogAddVisible = false;
                      this.getdata();
                    }     
                  })
                } else {
                  this.$message.success('成功')
                  this.dialogAddVisible = false;
                  this.isShow = false;
                  this.getdata();
                }
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    getType(){
      let data = {
          parentNos: '老人事故类型'
      }
      axios
      .fetch('commonServer', "/dict/getItemViewsByParentNo", data)
      .then(res => {
        this.typeList = res.data
      })
    },
    // 确认更改编辑数据
    submitEditDate (){
      if(this.editInfo.status == 0){
        if(this.editInfo.accidentDescription == undefined || this.editInfo.accidentDescription == '') return this.$message.error('请输入内容');
        this.editInfo.handleResult = this.editInfo.accidentDescription;
      }
      if(this.editInfo.handleResult == undefined || this.editInfo.handleResult == '') return this.$message.error('请输入内容');
      axios.fetch('elderServer', "/elderAccident/handle",{
        accidentId: this.editInfo.accidentId,
        status: this.editInfo.status,
        handleResult:this.editInfo.handleResult
      }).then(res => {
        if(res.code ==200){
          this.$message.success('成功')
          this.dialogEditVisible = false;
          this.getdata();
        }
      })
    },
    querydata(){
      this.currentPage = 1;
      this.getdata()
    },
    // 编辑
    repair(val){
      axios.fetch('elderServer', "/elderAccident/get",{
        accidentId: val.accidentId,
      }).then(res => {
        if(res.code ==200){
          this.editInfo = res.data;
          this.editInfo.accidentTime = (this.editInfo.accidentTime).substr(0,10);
          this.dialogEditVisible = true;
          switch (this.editInfo.status) {
            case 0:
              this.detailTitle = '提交';
              break;
            case 1:
            case 10:
              this.detailTitle = '处理';
              break;
            case 20:
              this.detailTitle = '审批';
              break;
            case 100:
              this.detailTitle = '详情';
              break;
          
            default:
              this.detailTitle = '详情';
              break;
          }
        }     
      })
    },
    reset(){
      this.elderName = this.roomType = this.elderId = '';
      this.searchDate = [];
      this.currentPage = 1;
      this.getdata();
    }
  },
  filters:{
    filterStatus: val => {
      let arr = [ //0待提交，1已提交，10已处理，20已处罚，100完成
        {
          name: '待提交',
          val:0
        },{
          name: '待处理',
          val:1
        },{
          name: '待处罚',
          val:10
        },{
          name: '待审批',
          val:20
        },{
          name: '已审核',
          val:100
        }
      ];
      let index = arr.findIndex(value => value.val == val)
      return arr[index].name
    }
  }
}
</script>

<style lang="less" scoped>
.el-table .cell {
  display: flex;
  justify-content: center;
}
.icon-status {
  width: 19px;
  height: 19px;
  display: inline-block;
}
.iconfont-1{
  background: url('../../../../assets/images/icon-status-1.png') no-repeat;
  background-size: 100%;
}
.iconfont-2{
  background: url('../../../../assets/images/icon-status-2.png') no-repeat;
  background-size: 100%;
}
.iconfont-3{
  background: url('../../../../assets/images/icon-status-3.png') no-repeat;
  background-size: 100%;
}
.iconfont-4{
  background: url('../../../../assets/images/icon-status-4.png') no-repeat;
  background-size: 100%;
}
/deep/ table{
  thead{
    tr:nth-child(2){
      display: none;
    }
  }
}
.info{
  display: flex;
  flex-direction: column;
  .title{
    display: flex;
    p{
      color: #666;
      margin: 0 20px 0 0;
      span{
        color: #333!important;
        font-weight: bold;
      }
    }
  }
  .content{
    width: 100%;
    padding: 0;
    .box{
      display: flex;
      flex-direction: column;
      margin: 30px 0 0 0;
      .top{
        display: flex;
        border-bottom: 1px solid #EEEEEE;
        justify-content: space-between;
        height:24px;
        padding: 0 0 12px 0;
        p{
          width:70px;
          height:24px;
          font-size:16px;
          font-weight:600;
          color:rgba(34,34,34,1);
          line-height:24px;
        }
        span{
          width:auto;
          height:24px;
          font-size:14px;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:24px;
        }
      }
      .bottom{
        margin: 12px 0 0 0;
      }
    }
    .input {
      .top{
        border: none;
        padding: 0;
      }
    }
  }
}
</style>