<template>
	<div>
		<el-form v-if="type != 'checkout'" :inline="true" class="search" ref="searchForm" :model="searchForm">
			<el-button @click="back()" class="back-btn">返回</el-button>
			<span>离院办理</span>
		</el-form>
		<div class="content">
			<h4 class="title-header">
                <span></span>
                <span>办理进度</span>
            </h4>
            <div class="progress">
                <el-row class="progress_baseInfo">
                    <el-col :span="16">
                        <div>
                            <span>姓名</span>
                            <span>{{elderCheckoutView.elderName}}</span>
                        </div>
                        <div>
                            <span>身份证号</span>
                            <span>{{elderCheckoutView.cardNo}}</span>
                        </div>
                        <div>
                            <span>离院原因</span>
                            <span>{{elderCheckoutView.checkoutRemark}}</span>
                        </div>
                        <div>
                            <span>离院时间</span>
                            <span>{{elderCheckoutView.checkoutDate}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <img src="../../../../assets/images/tickSign.png"/>
                            <span>已完成</span>
                        </div><div>
                            <img src="../../../../assets/images/yellowCircleSign.png"/>
                            <span>进行中</span>
                        </div><div>
                            <img src="../../../../assets/images/grayCircleSign.png"/>
                            <span>未开始</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="progress_content">
                    <el-steps align-center>
                        <el-step v-for="(item,index) in elderFlows" :key="index" :title="item.statusDescripton" icon :status="item.status" :description="item.remark"> 
                            <template slot="icon">
                                 <div style="margin-right: 0px;">
                                     <p>{{item.handlerName}}</p>
                                     <p style="margin-top:10px;">{{item.handleTime}}</p>
                                 </div>
                                 <img v-if="item.status0===0 && !item.isCurrent" src="../../../../assets/images/grayCircle.png" style="width:20px;">
                                 <img v-if="item.status0===0 && item.isCurrent && (item.currentStatus === 40 || item.currentStatus === 60)" src="../../../../assets/images/yellowCircle.png" style="width:30px;">
                                 <img v-else-if="item.status0===0 && item.isCurrent" src="../../../../assets/images/click.png" @click="confirmClick(item)" style="width:30px;">
                                 <!-- <img v-if="(item.currentStatus==40||item.currentStatus==60)&&item.status==='process'" src="../../../../assets/images/yellowCircle.png" style="width:30px;">
                                 <img v-if="(item.currentStatus!=40&&item.currentStatus!=60)&&item.status==='process'" src="../../../../assets/images/click.png" @click="item.currentStatus==50?confirmBusiness():progressDialog(item.statusDescripton)" style="width:30px;">  -->
                                 <img v-if="item.status0===1" src="../../../../assets/images/tick.png" style="width:25px;">
                            </template>
                        </el-step>
                    </el-steps>
                </el-row>
            </div>
		</div>
        <!-- 变更确认 -->
		<el-dialog center title="离院办理" :visible.sync="dialogLeaveVisible" id="leaveDialog" width="400px">
			<el-form label-width="100px">    
                <el-form-item label="护理部">
                    <el-select v-model="nurseConfirmData.nurseId" placeholder="请选择" @change="changeSelect(nurseConfirmData.nurseId,'护理部')" clearable :disabled="initNurse===true">
                        <el-option v-for="item in nurseDepart" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="医务部">
                    <el-select v-model="nurseConfirmData.medicalId" placeholder="请选择" @change="changeSelect(nurseConfirmData.medicalId,'医务部')" clearable :disabled="initMedical===true">
                        <el-option v-for="item in medicalDepart" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="总务部">
                    <el-select v-model="nurseConfirmData.generalId" placeholder="请选择" @change="changeSelect(nurseConfirmData.generalId,'总务部')" clearable :disabled="initGeneral===true">
                        <el-option v-for="item in generalDepart" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
				<div class="buttons" style="text-align: center;">
					<el-button type="primary" @click="confirm()">确定</el-button>
					<el-button @click="cancel()">取消</el-button>
				</div>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
	import axios from "axios";
	import qs from "qs";
	import printMethods from '@/utils/print';
	export default {
		data() {
			return {
                elderId: '',
                elderCheckoutView: {},
                elderFlows: [],
                nurseDepart: [], //护理部员工  
                medicalDepart: [], //医务部员工
                generalDepart: [], //总务部员工
                andOperator: false,//护理,医务,总务是否都已经操作了
                finance: false,//财务是否已经操作了
                dialogLeaveVisible: false,
                initNurse: false,
                initMedical: false,
                initGeneral: false,
                nurseConfirmData: {
                    checkoutDate: '',
                    nurseId: '',
                    nurseName: '',
                    medicalId: '',
                    medicalName: '',
                    generalId: '',
                    generalName: ''
                },
                type:'',
                progress:''
            };
		},
		created() {
            this.elderId = this.$route.query.elderId;
            this.type = this.$route.query.type;
            this.getDepartment();
            this.dataInit(); 
		},
		methods: {
			...printMethods,
            //初始化页面的数据
            dataInit(){
                let data = {
                    elderId: this.elderId
                }
				axios
				.fetch('elderServer', "/elderCheckout/handle/get", data)
				.then(res => {
                    let resData = res.data;
                    this.elderCheckoutView = resData.elderCheckoutView;
                    this.elderFlows = resData.elderFlows;
                    this.initData(this.elderFlows);
                    /* this.andOperate(this.elderFlows);
                    this.initStaff(); */
				})
            },
            initData(flows) {
              flows.map(item => {
                let status = item.status
                item.status0 = status
                if(status === 0) {
                  if(item.isCurrent) {
                    item.status = 'process'
                  } else {
                    item.status = 'wait'
                  }
                } else {
                  item.status = 'finish'
                }
              });
            },
            //初始化弹出框的数据
            initStaff(){
                this.elderFlows.map(item=>{
                    let initStatus = item.handlerId===0?false:true;
                    let handlerId = item.handlerId===0?'':item.handlerId;
                    let handlerName = item.handlerId===0?'':item.handlerName;
                    if(item.currentStatus===10){
                        this.initNurse = initStatus;
                        this.nurseConfirmData.nurseId = handlerId;
                        this.nurseConfirmData.nurseName = handlerName;
                    }else if(item.currentStatus===20){
                        this.initMedical = initStatus;
                        this.nurseConfirmData.medicalId = handlerId;
                        this.nurseConfirmData.medicalName = handlerName;
                    }else if(item.currentStatus===30){
                        this.initGeneral = initStatus;
                        this.nurseConfirmData.generalId = handlerId;
                        this.nurseConfirmData.generalName = handlerName;
                    }
                })
            },
            //验证某些操作前面的操作是否已经完成
            andOperate(data){
                let count = 0; //护理,医务,总务是否都已经操作了
                data.map(item=>{
                    item.status0 = item.status;
                   if((item.currentStatus===10||item.currentStatus===20||item.currentStatus===30)&&item.status===1){
                      count++;
                   }else if(item.currentStatus===40&&item.status===1){
                      this.finance = true;
                   }
                })
                if(count===3) this.andOperator=true;
                this.nodeHandle(data);
            },
            //对节点状态进行处理
            nodeHandle(data){
                data.map(item=>{
                    //申请
                    if(item.currentStatus===0){
                        item.status = 'finish';
                    //护理,医务,总务
                    }else if((item.currentStatus===10||item.currentStatus===20||item.currentStatus===30)&&item.status===0){
                        item.status = 'process';
                    }else if((item.currentStatus===10||item.currentStatus===20||item.currentStatus===30)&&item.status===1){
                        item.status = 'finish';
                    //财务
                    }else if(item.currentStatus===40&&this.andOperator==false&&item.status===0){
                        item.status = 'wait';
                    }else if(item.currentStatus===40&&this.andOperator==true&&item.status===0){
                        item.status = 'process';
                    }else if(item.currentStatus===40&&this.andOperator==true&&item.status===1){
                        item.status = 'finish';
                    //业务部
                    }else if(item.currentStatus===50&&this.finance==false&&item.status===0){
                        item.status = 'wait';
                    }else if(item.currentStatus===50&&this.finance==true&&item.status===0){
                        item.status = 'process';
                    } else if(item.currentStatus===50&&this.finance==true&&item.status===1){
                        item.status = 'finish';
                    //完成
                    }else if(item.currentStatus==60&&item.isCurrent==false&&item.status===0){
                        item.status = 'wait';
                    } else if(item.currentStatus==60&&item.isCurrent==true&&item.status===0){
                        item.status = 'process';
                    } else if(item.currentStatus==60&&item.status==1){
                        item.status = 'finish';
                    //完成
                    }else if(item.currentStatus===200&&item.isCurrent==false&&item.status===0){
                        item.status = 'wait';
                    }else if(item.currentStatus===200&&item.status===1){
                        item.status = 'finish';
                    }
                })
            },
            //获取弹出框的部门id
            getDepartment(){
                let that = this;
				axios
				.fetch('oaServer', "/org/dept/list")
				.then(res => {
                    let resData = res.data;
                    resData.map(item=>{
                        if(item.deptName==="护理部"||item.deptName==="医务部"||item.deptName==="总务部")
                        that.getStaff(item.deptId,item.deptName);
                    })
				})
            },
            //获取弹出框的部门下面的员工
            getStaff(deptId,deptName){
                let data = {
                    deptId: deptId
                }
				axios
				.fetch('oaServer', "/employee/query", data)
				.then(res => {
                    let resData = res.data;
                    let options = resData.map(item=>{
                        return {
                           label: item.employeeName,
                           value: item.employeeId
                        }
                    })
                    if(deptName==="护理部"){
                        this.nurseDepart = options;
                    }else if(deptName==="医务部"){
                        this.medicalDepart = options;
                    }else if(deptName==="总务部"){
                        this.generalDepart = options;
                    }
				})
            },
            changeSelect(id,category){
                if(category==='护理部'){
                    this.nurseConfirmData.nurseName = id?this.nurseDepart.filter(item=>{return item.value===id})[0].label:'';
                }else if(category==='医务部'){
                    this.nurseConfirmData.medicalName = id?this.medicalDepart.filter(item=>{return item.value===id})[0].label:'';
                }else if(category==='总务部'){
                    this.nurseConfirmData.generalName = id?this.generalDepart.filter(item=>{return item.value===id})[0].label:'';
                }
            },
            //确认保存
            confirm(){
                if(this.progress ==='护理部'&&!this.nurseConfirmData.nurseId){
                    this.$message.error('请选择护理部人员');return;
                }
                if(this.progress ==='医务部'&&!this.nurseConfirmData.medicalId){
                    this.$message.error('请选择医务部人员');return;
                }
                if(this.progress ==='总务部'&&!this.nurseConfirmData.generalId){
                    this.$message.error('请选择总务部人员');return;
                }
                // if((this.nurseConfirmData.nurseId === '' || this.nurseConfirmData.nurseId === null || this.nurseConfirmData.nurseId === undefined)
                // &&(this.nurseConfirmData.medicalId === '' || this.nurseConfirmData.medicalId === null || this.nurseConfirmData.medicalId === undefined)
                // &&(this.nurseConfirmData.generalId === '' || this.nurseConfirmData.generalId === null || this.nurseConfirmData.generalId === undefined)){
                //     this.$message.error('请至少选择一个');return;
                // }
                this.nurseConfirmData.elderId = this.elderId;
                this.nurseConfirmData.checkoutDate = this.elderCheckoutView.checkoutDate;
				axios
				.fetch('elderServer', "/elderCheckout/nurse/check", this.nurseConfirmData)
				.then(res => {
                    this.$message({
						message: "保存成功",
						type: "success"
                    });
                    this.dialogLeaveVisible = false;
                    this.dataInit();
				})
            },
            //关闭弹出框
            cancel(){
                this.dialogLeaveVisible = false;
            },
            //点击弹出操作人
            progressDialog(val){
                this.progress = val;
                this.dialogLeaveVisible = true;
            },
            // 操作确认
            confirmClick(item) {
              console.log(item);
              if(item.statusDescripton !== '医务部'){
                this.$confirm('请确认离院手续已办理完成', '离院办理', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    this.doConfirm(item);
                }).catch(() => {
                });
              } else {
                const h = this.$createElement;
                this.$msgbox({
                  title: '离院办理',
                  center: true,
                  message: h('p', { style: 'text-align: left' }, [
                    h('span', { style: 'color: red' }, '请确认医务部离院手续已经全部办理完成，如有需要，请处理完相关业务后再进行确认；确认后，系统将自动按以下规则终结未完成的业务'),
                    h('p',null, '1、作废未执行的临时医嘱以及未校对的长期医嘱'),
                    h('p',null, '2、停止未确认停止的长期医嘱'),
                    h('p',null, '3、作废未审核以及未出库的处方单'),
                    h('p',null, '4、提交未结算的处方费用单'),
                    h('p',null, '5、清空长者药箱'),
                    h('p',null, '6、提交离院小结记录'),
                  ],
                  ),
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(action => {
                  this.doConfirm(item);
                });
              }
            },
            doConfirm(item) {
              if(item.currentStatus === 50) { // 业务部需要弹出打印
                this.confirmBus()
              } else {
                axios.fetch('elderServer', '/elderCheckout/nurse/check', { elderId: this.elderId, currentStatus: item.currentStatus, checkoutDate: this.elderCheckoutView.checkoutDate }).then(res => {
                    this.$message({
						          message: "操作成功",
						          type: "success"
                    });
                    this.dialogLeaveVisible = false;
                    this.dataInit();
                })
              }
            },
            //业务部确认
            confirmBusiness(){
                this.$confirm('请确认离院手续已办理完成', '离院办理', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() => {
                    this.confirmBus();
                }).catch(() => {
                });
            },
            confirmBus(){
                let data = {
                   elderId: this.elderId
                };
                axios
				.fetch('elderServer', "/elderCheckout/business/check", data)
				.then(res => {
                    this.$message({
						message: "业务部已经确认",
						type: "success"
                    });
                    this.$router.push({
                        path: "/elder/checkoutPrintForm",
                        query: {
                            elderId: data.elderId
                        }
                    });
                    this.dialogLeaveVisible = false;
                    this.dataInit();
				})
            },
            //返回列表
			back(){
                this.$router.go(-1);
				// this.$router.push({
				// 	path: "/elder/checkout"
				// });
			}
		},
		filters:{
		}
	};
</script>
<style lang="less" scoped>
.view-container {
    padding: 20px;
    .search {
        .el-button {
            width: 5em;
            margin-right: 20px;  
        }
        span {
            color: #333333;
            font-size: 18px;
            font-weight: bold;
        }
    }
    .content {
        padding: 0px;
        h4 {
            // padding: 16px 0 16px 20px;
            display: flex;
            align-items: center;
            // border-bottom: 1px solid #DDDDDD;
            // background: #fbfbfc;
            // color: #333;
            // line-height: 25px;
            // font-weight: 700;
            span:nth-child(1) {
                margin-right: 15px;
                background-color: #F49B31;
                width: 6px;
                height: 25px;
                border-radius: 3px;
            }
            span:nth-child(2) {
                color: #333333;
                font-size: 18px;
                font-weight: bold;
            }
        }
        .progress {
            padding: 20px;
            .progress_baseInfo {
                .el-col-16 {
                    div {
                        display: inline-block;
                        font-size: 14px;
                        margin-right: 30px;
                        span:nth-child(1) {
                            margin-right: 10px;
                            color: #666666;
                        }
                        span:nth-child(2) {
                            color: #333333;
                        }
                    }
                }
                .el-col-8 {
                    display: flex;
                    justify-content: flex-end;
                    div {
                        display: flex;
                        align-items: center;
                        height: 30px;
                        color: #333333;
                        margin-right: 35px;
                        img {
                            margin-right: 10px;
                            position: relative;
                            top: 3px;
                        }
                    }
                    div:last-child {
                        margin-right: 0;
                        img {
                            top: 0;
                        }
                    }
                }
            }
            .progress_content {
                background: #F6F7FA;
                margin-top: 20px;
                padding: 120px 0 30px;
                /deep/ .el-steps {
                    .el-step {
                        .el-step__head {
                            .el-step__icon {
                                width: auto;
                                background-color: #F6F7FA;
                                border: none;
                                div {
                                    position: absolute;
                                    bottom: 40px;
                                    color: #666666;
                                }
                            }
                        }
                        .el-step__main{
                            >div {
                                width: 50%;
                                margin-left: 25%;
                            }
                            .el-step__title.is-finish{
                                color: #3F51B5;
                                font-weight: bold;
                            }
                            .el-step__title.is-process{
                                color: #F49B31;
                            }
                            .el-step__title.is-wait{
                                color: #333333;
                                font-weight: bold;
                            }
                            .el-step__description{
                                padding: 0;
                            }
                            .el-step__description.is-finish,
                            .el-step__description.is-process,
                            .el-step__description.is-wait{
                                color: #666666;
                                margin-top: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
     
}
</style>
