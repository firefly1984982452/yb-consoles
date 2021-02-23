<template>
  <!-- 某老人的合同列表 -->
  <div>
    <el-card class="box-card contractRecord">
      <p class="record_title" v-if="elderName">
        <span>{{elderName}}</span>
        <span>入住时间 <c style="color:#666">{{checkinDate}}</c> &nbsp;&nbsp;&nbsp;&nbsp;已入住 <c style="color:#666">{{checkDay}}</c> 天{{checkYM}}</span>
      </p>
      <div class="block" v-if="elderName">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in tableData" :key="index" :color="index===0?'#F49B31':''" size="large" placement="top">
            <p>
              <span>{{item.createDate}}</span>
              <span>{{item.createTime}}</span>
              <span v-if="index===0 && item.isCurrent">使用中</span>
            </p>
            <el-card>
              <el-form label-width="70px">
                <el-row :gutter="0">
                  <el-col :lg="18" :xl="18" :md="18" style="width:1100px;">
                    <el-row>
                      <el-col :span="5">
                        <el-form-item label="合同类型">{{item.contractType | typeFilter}}</el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item label="合同编号">{{item.checkinNo}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="有效期">
                          {{item.serviceStartDate}} 至 {{item.serviceEndDate}}
                          <span v-if="item.contractType===0">（试住{{item.probationInterval}}天，{{item.probationStartDate}}～{{item.probationEndDate}}）</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row style="position:relative;">
                      <el-col :span="5">
                        <el-form-item label="托管费">{{item.bedFee}}元/月</el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item label="护理费">{{item.careFee}}元/月</el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-form-item label="膳食费">{{item.dietFee}}元/天</el-form-item>
                      </el-col>
                      <el-col :span="4" v-if="item.contractType===0">
                        <el-form-item label="入住保证金" label-width="85px">{{item.depositFee}}元</el-form-item>
                      </el-col>
                      <el-col :span="4" v-if="item.otherFeeRemark!=null&&item.otherFeeRemark!=''&&item.contractType===0" class="otherFee">
                        <el-form-item label="" label-width="0">{{item.otherFeeRemark}} {{item.otherFee}}元/月</el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="item.contractType===0">
                      <el-col :span="6">
                        <el-form-item label="约定">
                          <span :style="{'color':item.agreeOut===0 ? '#F6812B':'#2FC07A'}">{{item.agreeOut | agreeFilter}}</span>外出&nbsp;
                          <span :style="{'color':item.agreeMedicine===0 ? '#F6812B':'#2FC07A'}">{{item.agreeMedicine | agreeFilter}}</span>委托发药
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" class="long">
                        <el-form-item label="紧急联系人约定" v-if="item.emergencyContact!=null&&item.emergencyContact!=''">{{item.emergencyContact}}</el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-form-item label="其他约定" v-if="item.otherRemark!=null&&item.otherRemark!=''">{{item.otherRemark}}</el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :lg="6" :xl="6" :md="6" class="handleBtn">
                    <el-row :gutter="0">
                      <!-- <el-col :xl="8" :lg="12" :md="8"> -->
                      <el-button v-if="item.status == 0 && sign" class="edit_btn" @click="edit(item)" :style="{'top':item.contractType===0?'37px':'20px'}">编辑</el-button>
                      <!-- </el-col> -->
                      <!-- <el-col :xl="8" :lg="12" :md="8"> -->
                      <el-button v-if="item.status == 0 && sign" class="confirm_btn" @click="confirm(item)" :style="{'top':item.contractType===0?'37px':'20px'}">盖章确认</el-button>
                      <!-- </el-col> -->
                      <!-- <el-col :xl="8" :lg="12" :md="8"> -->
                      <el-button class="detail_btn" @click="print(item)" :style="{'top':item.contractType===0?'37px':'20px'}">查看详情</el-button>
                      <!-- </el-col> -->
                    </el-row>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-if="!elderName" class="noData">
        <div>
          <img src="@/assets/images/unData.png" />
          <p>暂无数据</p>
        </div>
      </div>
    </el-card>
    <contract-edit-dialog @dataInit="dataInit" ref="contractEditDialog"/>
  </div>
</template>

<script>
import axios from "axios";
import printMethods from "@/utils/print";
import ContractEditDialog from './contractEditDialog'
export default {
  props: ["elderId"],
  components: {
    ContractEditDialog
  },
  data() {
    var validatePass = (rule, value, callback) => {
      let reg = /^\d+(\.\d{0,2})?$/;
      if (value != null && value != "" && reg.test(value) === false) {
        callback(new Error("请输入不超过两位小数的数字"));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      elderName: "",
      checkinDate: "",
      checkDay: "",
      checkYM: "",
      tableData: []
    };
  },
  created() {
    this.assessList = this.$route.query.assessList;
    this.sign = this.$route.query.sign?this.$route.query.sign:'';
    if (this.$route.query.assessList) {
      this.elderId = this.$route.query.elderId;
    }
    this.dataInit();
  },
  methods: {
    ...printMethods,
    dataInit() {
      let data = {
        elderId: this.elderId
      };
      axios.fetch("elderServer", "/elder/elderById", data).then(res => {
        if (res.data.length > 0) {
          this.tableData = res.data.reverse();
          this.handleTable();
        } else {
          console.log("0");
          this.$store.state.editContract = true;
        }
      });
    },
    //处理拿到的TableDate数据
    handleTable() {
      //头部的时间处理
      let nowDate = new Date();
      let m =
        nowDate.getMonth() + 1 < 10
          ? "0" + (nowDate.getMonth() + 1)
          : nowDate.getMonth() + 1;
      let d =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate(); //当是个位的时候补0
      nowDate = nowDate.getFullYear() + "-" + m + "-" + d;
      this.checkDay = this.datedifference(
        this.tableData[0].checkinDate,
        this.tableData[0].checkoutDate || nowDate
      );
      this.checkYM = this.datedifYM(this.tableData[0].checkinDate, this.tableData[0].checkoutDate || nowDate);

      this.elderName = this.tableData[0].elderName; //老人姓名
      this.checkinDate = this.tableData[0].checkinDate; //入住时间

      //创建时间
      this.tableData.map(item => {
        item.createDate = item.createTime
          ? this.dateFormat(item.createTime)
          : "";
        item.createTime = item.createTime ? item.createTime.split(" ")[1] : "";
      });
    },
    //计算两个时间相差天数
    datedifference(sDate1, sDate2) {
      //sDate1和sDate2是2006-12-18格式
      var dateSpan, tempDate, iDays;
      sDate1 = Date.parse(sDate1);
      sDate2 = Date.parse(sDate2);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      return iDays + 1;
    },
    //计算两个时间的年月差
    datedifYM(date1, date2) {
      date1 = date1.split("-");
      date2 = date2.split("-");
      date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
      date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
      let M = Math.abs(date1 - date2);
      let YM = "";
      if (M / 12 === 0 && M % 12 != 0) {
        YM = "（" + (M % 12) + "月" + "）";
      } else if (M / 12 != 0 && M % 12 != 0) {
        YM = "（" + parseInt(M / 12) + "年" + (M % 12) + "月" + "）";
      }
      return YM;
    },
    //将yyyy-MM-dd HH:mm:ss格式的时间转化成yyyy年MM月dd日
    dateFormat(date) {
      if (date) {
        date = date.split(" ")[0];
        date =
          date.split("-")[0] +
          "年" +
          date.split("-")[1] +
          "月" +
          date.split("-")[2] +
          "日";
      } else {
        date = "";
      }
      return date;
    },
    //  编辑合同
    edit(data) {
    // this.$emit('contractEdit',data);
				let param = {
					elderId: data.elderId
				};
				axios.fetch("elderServer", "/elder/elderById", param).then(res => {
					if (res.data.length > 0) {
						res.data.forEach(item => {
							if(data.agreementId == item.agreementId){
								console.log(item);
                this.$refs.contractEditDialog.form = Object.assign({},this.$refs.contractEditDialog.form,item);
                // this.$refs.contractEditDialog.serverDate = [item.serviceStartDate,item.serviceEndDate]
				        // this.$refs.contractEditDialog.tryLiveDate = [item.probationStartDate,item.probationEndDate]
				        this.$refs.contractEditDialog.form.elderId = data.elderId;
				        this.$refs.contractEditDialog.elderName = data.elderName;
                this.$refs.contractEditDialog.dialogFormVisible = true;
							}
						});
					}
				});
    
  },
  confirm(data){
  this.$confirm('盖章确认后将无法修改, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const res = await axios.fetch("elderServer", "/elder/elderById", {elderId:this.elderId});
      if(res.code == 200){
        const param = res.data.filter(item=>{
          return data.agreementId == item.agreementId
        })[0];
        param.status = 1;
      axios
					.fetch('elderServer', "/elder/edit", param, 'json')
					.then(res => {
						this.$message({
							message: "确认成功",
							type: "success"
            });
            this.dataInit();
					})
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      });          
    });
  },
    //打印模板跳转
    // print(data){
    // 	location.href='static/docTemplate/extendContract.html'
    // }
    //以前的打印
    print(data) {
      let type = "";
      if (data.contractType === 0) {
        type = "contract";
      } else if (data.contractType === 1) {
        type = "exContract";
      }
      this.openPrint({
        path: "/print/elder/" + type,
        query: {
          agreementId: data.agreementId
        }
      });
      // this.$router.push({
      // 	path: "/print/elder/" + type,
      // 	query: {
      // 		agreementId: data.agreementId
      // 	}
      // })
    }
  },
  filters: {
    typeFilter: val => {
      if (val === 0) {
        return (val = "入院合同");
      } else if (val === 1) {
        return (val = "延长合同");
      }
    },
    agreeFilter: val => {
      if (val === 0) {
        return (val = "不同意");
      } else if (val === 1) {
        return (val = "同意");
      }
    }
  }
};
</script>

<style scoped>
.long /deep/ .el-form-item__label {
  width: 120px !important;
}
.contractRecord {
  padding: 0 15px;
}
.contractRecord >>> .el-form-item {
  margin-bottom: 0;
}
.block >>> .el-card__body {
  padding: 10px 0px 10px 20px !important;
}
.contractRecord >>> .el-form-item__content {
  text-align: left;
}
.record_title {
  margin-bottom: 20px;
}
.record_title span:nth-child(1) {
  margin-right: 10px;
  font-size: 18px;
  font-weight: 500;
  color: #333333;
}
.record_title span:nth-child(2) {
  font-size: 14px;
  color: #999;
}
.contractRecord >>> .el-timeline-item__node--large {
  top: 85px;
}
.contractRecord >>> .el-timeline-item__tail {
  top: 85px;
}
.el-timeline-item__content p {
  margin-bottom: 15px;
}
.el-timeline-item__content p span:nth-child(1) {
  font-size: 16px;
  font-weight: 500;
  color: #666666;
}
.el-timeline-item__content p span:nth-child(2) {
  margin: 0 15px 0 5px;
  font-size: 16px;
  font-weight: 500;
  color: #666666;
}
.el-timeline-item__content p span:nth-child(3) {
  background: #f49b31;
  color: #fff;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
}
.handleBtn {
  min-width: 330px;
  padding-top: 37px;
}
.confirm_btn {
  background: orange;
  color: #fff;
}
.detail_btn {
  background: #6aaee7;
  color: #fff;
}
/* .detail_btn {
        background: #6AAEE7;
		color: #fff;
		font-size: 14px;
		padding: 13px 22px;
		border-radius: 5px;
		position: absolute;
		right: 40px;
        top: 37px;
	} */
.noData {
  height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.noData p {
  color: #999;
  font-size: 14px;
  text-align: center;
}
.otherFee {
  position: absolute;
  right: 50px;
  bottom: 1px;
}
</style>