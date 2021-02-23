<!--通知公告-->
<template>
  <div>
    <el-form :inline="true" class="search" >
      <el-form-item label="消息类型">
        <el-select v-model="bulletinType" clearable placeholder="请选择">
          <el-option v-for="item in categoryOptions" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="roomType" clearable placeholder="请选择">
          <el-option label="待提交" value="0"></el-option>
          <el-option label="已提交" value="1"></el-option>
          <el-option label="已作废" value="-1"></el-option>
        </el-select>
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
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table" @selection-change="handleSelectionChange">
        <el-table-column label="类型"  width="100">
            <template slot-scope="scope"><span>{{scope.row.bulletinType | notice }}</span></template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="330" align="left"></el-table-column>
        <el-table-column  label="时间" width="400" align="left">
            <template slot-scope="scope" align="left"><span>{{(scope.row.beginTime).substr(0,16)}}-{{(scope.row.endTime).substr(0,16)}}</span></template>
        </el-table-column>
        <el-table-column label="地点" width="200" align="left">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.location" placement="top-start">
              <div class="one-line">{{scope.row.location}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="participants" label="参与人" align="left" width="200">
          <template slot-scope="scope" ><span>{{ scope.row.participants | participantsFilter}}</span></template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180">
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" align="center" ></el-table-column>
        <el-table-column prop="status" label="状态" width="140">
          <template slot-scope="scope" ><span>{{ scope.row.status | status }}</span></template>
        </el-table-column>
				<el-table-column label="操作" width="140">
					<template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
              <el-button
                size="mini"
                @click="see(scope.row)"
                icon="iconfont iconcaozuotubiao-chakan"
              ></el-button>
            </el-tooltip>
						<el-tooltip class="item" v-if="scope.row.status==0" effect="dark" content="编辑" placement="top-end">
							<el-button size="mini" @click="repair(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!-- 单个新增弹出框 -->
    <el-dialog :title="addInfo.bulletinId?'编辑':'添加'" :visible.sync="dialogAddVisible" center @close="closeFun" width="30%">
      <el-form :rules="rules" label-width="100px" :model="addInfo" ref="addInfo">
        <el-form-item  label="类型" prop="bulletinType">
          <!-- 会议 -->
          <el-select v-model="addInfo.bulletinType" placeholder="请选择">
            <el-option v-for="item in categoryOptions" :label="item.label" :value="Number(item.value)" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题" prop="title">
          <el-input type="text" v-model.trim="addInfo.title" placeholder="请输入主题" clearable></el-input>                
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" v-model.trim="addInfo.description" maxlength="200" placeholder="请输入详细说明" clearable></el-input>                
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker 
            v-model="addInfo.date" 
            type="datetimerange" 
            value-format="yyyy-MM-dd HH:mm:ss" 
            format="yyyy-MM-dd HH:mm:ss" 
            range-separator="至" 
            start-placeholder="开始日期" 
            end-placeholder="结束日期" >
            </el-date-picker> 
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input type="textarea" v-model.trim="addInfo.location" maxlength="200" placeholder="请输入地点" clearable></el-input>                
        </el-form-item>
        <el-form-item label="参与人" prop="participants">
            <el-tag
              :key="tag"
              v-for="tag in addInfo.participants"
              closable
              ref="saveTagInput"
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <ub-employee v-model="elderchooseId" @change="change" v-if="inputVisible"></ub-employee>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加人员</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="addInfo.bulletinId" @click="submitAddOne(addInfo.status)">保 存</el-button>
        <el-button type="primary" v-if="!addInfo.bulletinId" @click="submitAddOne(0)">保 存</el-button>
        <el-button type="warning" v-if="addInfo.status==0||!addInfo.bulletinId" @click="submitAddOne(1)">提 交</el-button>
        <el-button v-if="addInfo.status==0"  @click="deleteOne">作 废</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="dialogEditVisible" center  width="30%">
      <el-form  label-width="100px" >
        <el-form-item  label="类型">
          {{addInfo.bulletinType | notice }}
        </el-form-item>
        <el-form-item label="主题">
          {{addInfo.title}}
        </el-form-item>
        <el-form-item label="说明">
          {{addInfo.description}}
        </el-form-item>
        <el-form-item label="时间" prop="date">
          {{addInfo.beginTime}} 至 {{addInfo.endTime}}
        </el-form-item>
        <el-form-item label="地点" prop="location">
          {{addInfo.location}}
        </el-form-item>
        <el-form-item label="参与人" prop="participants">
            <el-tag
              :key="tag"
              v-for="tag in addInfo.participants"
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <!-- <ub-employee v-if="inputVisible"></ub-employee> -->
            <!-- <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加人员</el-button> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <!-- <el-button type="primary" @click="submitEditDate">提 交</el-button> -->
        <el-button v-if="addInfo.status==0"  @click="deleteOne">作 废</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var that;
import ubEmployee from "@/components/employee";
export default {
  components: {
    ubEmployee,
  },
  data(){
    return {
      elderchooseId:'',
      searchDate:[

      ],
      bulletinType:'',
      dialogAddVisible: false,
      dialogEditVisible: false,
      editInfo:{
        participants:''
      },
      addInfo:{
        title:'',
        description:'',
        date:[],
        location:'',
        participants: [],
        participantsId: [],
        bulletinType:1,
      },
      rules: {
        bulletinType:[
        { required: true, message: '请输入类型',trigger: "change"}
        ],
        title:[ 
        { required: true, message: '请输入主题',trigger: "change"}
        ],
        date:[
        { required: true, message: '请选择时间',trigger: "change"}
        ],
        location:[ 
        { required: true, message: '请输入地点',trigger: "change"}
        ],
        participants:[ 
        { required: true, message: '请至少选择一个开会人',trigger: "change"}
        ]
      },
      levels:[],
      data:[],

      elderName:'',
      roomType:'',
      pageSize:10,
      pageIndex:1,
      currentPage:1,
      total:0,
      allElderOption:[],
      allElderData: [],
      multipleSelection: [],
      inputVisible: false,
      inputValue: '',
      categoryOptions:[]
    }
  },
  beforeCreate () {
    that = this;
  },
  created(){
    this.getLists();
    this.getOptionData();
  },
  methods:{
    // 获取通知公告数据字典
    getOptionData() {
      axios
        .fetch("commonServer", "/dict/getItemViewsByParentNo", {
          parentNos: '行政办公通知类型'
        })
        .then(res => {
          this.categoryOptions = res.data.map(item=>{
            let obj = {};
            obj.value = item.itemValue;
            obj.label = item.title;
            return obj;
          })
        });
    },
    closeFun() {
      this.$refs['addInfo'].resetFields();
    },
    change(item){
      if(this.addInfo.participantsId.indexOf(item.employeeId) == -1) {
        this.addInfo.participants.push(item.employeeName);
        this.addInfo.participantsId.push(item.employeeId);
        this.elderchooseId = '';
        this.inputVisible = false;
      } else {
        this.elderchooseId = '';
        this.$message.error('该人员已存在，请勿重复添加！');
      }
    },
      async getLists(){
        const param = {
          pageIndex:this.pageIndex,
          pageSize:this.pageSize,
          bulletinType: this.bulletinType,
          status: this.roomType
        };
        const res = await axios.fetch('oaServer','/oaBulletin/all',param);
        console.log(res);
        if(res.code ==200){
          this.total = res.total;
          this.data = res.data
        }     
      },
      handleClose(tag) {
        this.addInfo.participants.splice(this.addInfo.participants.indexOf(tag), 1);
        this.addInfo.participantsId.splice(this.addInfo.participantsId.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        /* this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        }); */
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          console.log(this.addInfo)
          this.addInfo.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
    changeUser (){
      console.log('ee')
    },
    cancelEdit(){
      this.dialogEditVisible = false
    },
    addMulit () {
      this.chioseYear = '';
      this.chioseMonth = '';
      this.dialogFormVisible = true;
    },
    addOneCon () {
      this.restForm();
      this.dialogAddVisible = true;
    },
    restForm(){
      this.addInfo = {
        title:'',
        description:'',
        date:[],
        location:'',
        participants: [],
        participantsId: [],
        bulletinType:1
      }
      this.inputVisible = false;
    },
    handleChange(i){
      this.pageIndex=i;
      this.getLists();
    },
    // 新增&&提交
    submitAddOne (status){
      this.$refs['addInfo'].validate(async (valid) => {
          if (valid) {
            const param ={
              bulletinId:this.addInfo.bulletinId?this.addInfo.bulletinId:null,
              title:this.addInfo.title,
              location:this.addInfo.location,
              description:this.addInfo.description,
              participants:this.addInfo.participants.join(),
              participantsId:this.addInfo.participantsId instanceof Array ? this.addInfo.participantsId.join():this.addInfo.participantsId,
              beginTime:this.addInfo.date[0],
              endTime:this.addInfo.date[1],
              bulletinType: this.addInfo.bulletinType,
              status: status
            }
             if(!this.addInfo.bulletinId){
               const res = await axios.fetch('oaServer','/oaBulletin/add',param,'json');
               if(res.code == 200){
                  this.dialogAddVisible = false;
                  this.$message.success('添加成功');
                  this.restForm();
                  this.getLists();
                }
              }else {
               const res = await axios.fetch('oaServer','/oaBulletin/edit',param,'json');
               if(res.code == 200){
                  this.dialogAddVisible = false;
                  if(status==0){
                    this.$message.success('修改成功');
                  } else {
                    this.$message.success('提交成功');
                  }
                  this.restForm();
                  this.getLists();
                }
              }
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
     
    },
    // 删除
    async deleteOne(){
      let param = {
          bulletinId :this.addInfo.bulletinId,
          status: -1
        }
      const res = await axios.fetch('oaServer','/oaBulletin/edit',param,'json');
      if(res.code==200){
        this.$message.success('作废成功!');
        this.dialogAddVisible = false;
        this.dialogEditVisible = false;
        this.restForm();
        this.getLists();
      }
      console.log(res,'======作废');
      
    },
    // 确认更改编辑数据
    submitEditDate (){
      console.log(this.chioseYear,this.chioseMonth)
      axios.fetch('elderServer', "/elderSubsidyInsurance/update",{
        subsidyId: this.editInfo.subsidyId,
        elderId: this.editInfo.elderId,
        elderName:this.editInfo.elderName,
        intervalStart: this.editInfo.intervalTime[0],
        intervalEnd: this.editInfo.intervalTime[1],
        intervalDays: this.editInfo.intervalDays,
        subsidyPrice: this.editInfo.subsidyPrice,
        subsidyAmount: this.editInfo.subsidyAmount,
        cashAmount: this.editInfo.cashAmount,
        insuranceAmount: this.editInfo.insuranceAmount
      }).then(res => {
        if(res.code ==200){
          this.$message.success('成功')
          this.total = res.total;
          this.data = res.data;
          this.dialogEditVisible = false;
        }     
      })
    },
    // 编辑时改变时间监听
    changeEditTime (){
      console.log(this.editInfo)
      axios.fetch('elderServer', "/elderSubsidyInsurance/get/amount",{
        intervalStart: this.editInfo.intervalTime[0],
        intervalEnd: this.editInfo.intervalTime[1],
      }).then(res => {
        if(res.code ==200){
          this.editInfo.intervalDays = res.data.intervalDays;
          this.editInfo.subsidyAmount = res.data.subsidyAmount;
          this.editInfo.cashAmount = res.data.cashAmount;
          this.editInfo.insuranceAmount = res.data.insuranceAmount;
        }
      })
    },
    handleSelectionChange (val){
      this.multipleSelection = val;
    },
    // 添加一个数据时选择了一个用户
    handleSelectUser (item){
      console.log(item,this.allElderData);
      for(var i in this.allElderData) {
        if (this.allElderData[i].elderId == item.elderId){
          this.addInfo.elderId = this.allElderData[i].elderId;
          this.addInfo.elderName = this.allElderData[i].elderName;
        }
      }
    },
    // 详情
    see(val){
      console.log(val)
      this.addInfo = val;
      this.addInfo.participants = this.addInfo.participants instanceof Array?this.addInfo.participants:this.addInfo.participants.split(',');
      this.addInfo.participantsId = this.addInfo.participantsId instanceof Array?this.addInfo.participantsId:this.addInfo.participantsId.split(',').map(Number);
      this.addInfo.date = [val.beginTime, val.endTime];
      this.dialogEditVisible = true;
    },
    // 编辑
    repair(val){
      // console.log(val)
      this.dialogAddVisible = true;
      this.$nextTick(()=>{
        this.addInfo = Object.assign({},this.addInfo,val);
        this.addInfo.bulletinType = Number(this.addInfo.bulletinType);
        this.addInfo.date = [this.addInfo.beginTime,this.addInfo.endTime];
        this.addInfo.participants = this.addInfo.participants instanceof Array?this.addInfo.participants:this.addInfo.participants.split(',');
        this.addInfo.participantsId = this.addInfo.participantsId instanceof Array?this.addInfo.participantsId:this.addInfo.participantsId.split(',').map(Number);
        console.log(this.addInfo);
      })
    },
    querydata(){
      this.pageIndex = 1;
      this.currentPage = 0;
      this.getLists()
    },
    reset(){
      this.roomType = '',
      this.bulletinType = '',
      this.pageIndex = 1;
      this.currentPage = 0;
      this.getLists()
    }
  },
  filters:{
    filterLevel: val => {
      return ['未评级', '护理一级', '护理二级', '护理三级', '护理四级', '护理五级', '护理六级', '外地', '不满60岁', '享受居家养老'][val]
    },
    status:i=>i==0?'待提交':i==1?'已提交':'已作废',
    notice:(val)=>{
      const res = that.categoryOptions.filter(item=>{
        return Number(item.value) === Number(val);
      })
      if(res.length > 0){
        return res[0].label;
      }
    },
    participantsFilter:i=>{
      if(i instanceof Array){
        return i.join()
      } else {
        return i
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .one-line{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
/deep/ table{
  thead{
    tr:nth-child(2){
      display: none;
    }
  }
}
/deep/.el-form-item{
  margin-bottom: 20px;
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
        color: #333;;
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
          width:180px;
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