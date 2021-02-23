<template>
	<div>
		<el-card class="box-card">  
      <div slot="header" class="clearfix">
        <el-button class="back-btn" @click="back()">返回</el-button>
        <span class="detail_title">请假单详情</span>
      </div>
      <div>
        <el-form :model="form" label-width="80px">
          <div>
            <el-form-item label="请假单号">{{form.leaveNo}}</el-form-item>
            <el-form-item label="长者姓名">
              {{form.elderName}} {{form.buildingName}}-{{form.roomName}}-{{form.bedName}}
            </el-form-item>
            <el-form-item label="请假事由">{{form.reason}}</el-form-item>
            <el-form-item label="请假日期">
              {{form.startDate}}<span v-if="form.startDiet===1">({{form.startDiet | dietFilter}})</span><span v-if="form.returnTime">至</span>
              {{form.returnTime}}<span v-if="form.endDiet===1">({{form.endDiet | dietFilter}})</span>            
            </el-form-item>
            <el-form-item label="请假说明">{{form.remark}}</el-form-item>
          </div>
          <div>
            <el-form-item label="状态">{{form.status | statusFilter}}</el-form-item>
            <el-form-item label="创建人">{{form.handlerName}} {{form.createTime}}</el-form-item>
            <el-form-item label="审核人">{{form.handlerName}} {{form.handleTime}}</el-form-item>
            <!-- <el-form-item label="审核说明">{{form.handleResult}}</el-form-item> -->
            <el-form-item label="回院状态">{{form.leaveStatus | leaveStatus}}</el-form-item>
            <el-form-item label="回院备注">{{form.returnRemark}}</el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>
	</div>
</template>
<script>
	import axios from "axios";
	export default {
		data() {
			return {   
        leaveId: "",
        form: {}
      };
		},
		created() {
      this.leaveId = this.$route.query.leaveId;
      this.initData();
		},
		methods: {
      initData(){
        let data = {
          leaveId: this.leaveId
        };
        axios
        .fetch('elderServer', "/elderLeave/get", data)
        .then(res => {
          this.form = res.data;
          this.form.startTime = this.form.startDate?this.form.startDate.split(' ')[1]:'';
          this.form.endTime = this.form.endDate? this.form.endDate.split(' ')[1]:'';
          this.form.startDate = this.form.startDate?this.form.startDate.split(' ')[0]:'';
          this.form.endDate = this.form.endDate?this.form.endDate.split(' ')[0]:'';
        })
      },
      back(){
        this.$router.go(-1);
      }
		},
		filters:{
      statusFilter: val => {
        if(val == 0) {
            val = "待审核";
        } else if(val == 1) {
            val = "已审核";
        } else if(val == -1) {
            val = "已作废";
        }
        return val;
      },
      dietFilter: val => {
        if(val == 1) {
            val = "餐";
        } else {
            val = "";
        } 
        return val;
      },
      
    leaveStatus(val) {
      switch (val) {
        case 0:
          return "未外出";
          break;
        case 1:
          return "已外出";
          break;
        case 2:
          return "已回院";
          break;

        default:
          return "";
          break;
      }
    }
		}
	};
</script>
<style lang="less" scoped>
/deep/ .el-card__header {
  background: #FBFBFC;
  padding: 13px 0 16px 20px;
  .el-button {
    width: 5em;
  }
  .detail_title {
    font-size: 18px;
    color: #333333;
    font-weight: bold;
  }
}
/deep/ .el-card__body .el-form {
  display: flex;
  justify-content: flex-start;
  div {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  div:first-child {
    width: 450px;
  }
}
</style>
