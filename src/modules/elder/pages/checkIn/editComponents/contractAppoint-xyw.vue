<template>
  <div>

    <el-card class="box-card contractAppoint" v-if="!hasRuZhuHeTong">
      <el-form :model="form" label-width="95px" :rules="rules">
        <h4>服务期限</h4>
        <el-row>
          <el-form-item label="服务时间" prop="serviceInterval" style="display:inline-block;">
            <!-- <el-input type="number" v-model="form.serviceInterval" style="width:100px;" maxlength="5" @change="serviceDate"></el-input>
            <span style="margin:0 .4rem;">年</span> -->
          <!-- </el-form-item> -->
          <!-- <el-form-item label="" label-width="0" style="display:inline-block;"> -->
            <el-date-picker v-model="serverDate[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker>
            <el-date-picker v-model="serverDate[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="试住期" prop="" style="display:inline-block;">
            <!-- <el-input type="number" v-model="form.probationInterval" style="width:100px;" maxlength="5" @change="tryLiveTime"></el-input>
            <span style="margin:0 .4rem;">天</span>
          </el-form-item> -->
          <!-- <el-form-item label="" label-width="0" style="display:inline-block;"> -->
            <el-date-picker v-model="tryLiveDate[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" :clearable="false"></el-date-picker>
            <el-date-picker v-model="tryLiveDate[1]" type="date" format="yyyy年MM月dd日" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="结束日期" :clearable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="共" prop="probationInterval" style="display:inline-block;">
            <el-input type="number" disabled v-model="form.probationInterval" style="width:100px;" maxlength="5" @change="tryLiveTime"></el-input>
            <span style="margin:0 .4rem;">天</span>
          </el-form-item>
        </el-row>
        <h4>入住费用</h4>
        <el-row>
          <el-col :span="3" class="width18" style="width:14%;">
            <el-form-item label="服务费" prop="serviceFee">
              <el-input disabled v-model="form.serviceFee" style="width:100px;" maxlength="8"></el-input><span class="margin-left-word">元/月</span>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="width18" style="width:13%;">
            <el-form-item label="托管费" label-width="70px" prop="bedFee">
              <el-input v-model="form.bedFee" style="width:100px;" maxlength="8" @input="serviceFee"></el-input><span class="margin-left-word">元/月</span>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="width18" style="width:13%;">
            <el-form-item label="护理费" label-width="70px" prop="careFee">
              <el-input v-model="form.careFee" style="width:100px;" maxlength="8" @input="serviceFee"></el-input><span class="margin-left-word">元/月)</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="width18" style="width:14%;">
            <el-form-item label="膳食费" prop="dietFee">
              <el-input v-model="form.dietFee" style="width:100px;" maxlength="8"></el-input><span class="margin-left-word">元/天</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="其他费用" style="display:inline-block;">
            <el-input v-model="form.otherFeeRemark" placeholder="请输入费用名称" style="width:200px;margin-right:10px;"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="0" prop="otherFee" style="display:inline-block;padding-right:10px;">
            <el-input v-model="form.otherFee" oninput="value=value.replace(/[^0-9.]/g,'')" style="width:100px;" maxlength="8"></el-input><span class="margin-left-word">元/月</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="3" class="width18" style="width:14%;">
            <el-form-item label="入住保证金" prop="depositFee">
              <el-input v-model="form.depositFee" style="width:100px;" maxlength="8"></el-input><span class="margin-left-word">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <h4>约定</h4>
        <el-row>
          <el-form-item label="外出约定" prop="agreeOut">
            <span>是否同意外出</span>
            <div>
              <el-radio-group v-model="form.agreeOut" style="margin-top:5px;">
                <el-radio v-for="(item,index) in agreeOutList" :label="item.label" :key="index">{{item.value}}</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="委托发药" prop="agreeMedicine">
            <span>委托院方为({{elderName}})老人外出就医配药物按医嘱发放。</span>
            <div>
              <el-radio-group v-model="form.agreeMedicine" style="margin-top:5px;">
                <el-radio v-for="(item,index) in agree" :label="item.label" :key="index">{{item.value}}</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="紧急联系人约定" label-width="110px">
            <el-input type="textarea" v-model="form.emergencyContact" placeholder="请输入紧急联系人约定" style="width:700px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="其它约定" label-width="110px">
            <el-input type="textarea" v-model="form.otherRemark" placeholder="请输入其它约定" style="width:700px;"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row class="handleBtn">
        <el-button type="success" plain @click="save()">保存</el-button>
        <el-button  @click="$router.go(-1)">取消</el-button>
      </el-row>
    </el-card>
    <ContractRecord :elderId="elderId" @changeNotEdit="changeNotEdit" v-if="hasRuZhuHeTong"></ContractRecord>
  </div>

</template>

<script>
import axios from "axios";
import moment from "moment";
import ContractRecord from "@/modules/elder/pages/checkIn/editComponents/contractRecord-xyw";
export default {
  props: ["elderId", "elderName", "checkinDate", "hasRuZhuHeTong"],
  components: {
    ContractRecord
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
      sign: "",
      serverDate: [],
      tryLiveDate: [],
      agreeOutList: [
        {
          label: 1,
          value: "同意 （家属及老人承担外出期间发生意外或突发事件的全部责任）"
        },
        {
          label: 0,
          value: "不同意（老人不能自主决定离院外出）"
        }
      ],
      agree: [
        {
          label: 1,
          value: "同意"
        },
        {
          label: 0,
          value: "不同意"
        }
      ],
      form: {
        elderId: "",
        contractType: 0,
        parentId: 0,
        templateId: 0, //这个什么情况
        serviceInterval: "1",
        serviceStartDate: "",
        serviceEndDate: "",
        probationInterval: "30",
        probationStartDate: "",
        probationEndDate: "",
        serviceFee: "",
        bedFee: "",
        careFee: "",
        dietFee: "",
        otherFee: 0,
        otherFeeRemark: "",
        depositFee: 10000,
        agreeOut: 1,
        agreeMedicine: 1,
        emergencyContact: "",
        otherRemark: "",
        guarantor: "",
        guarantorContact: "",
        signDate: ""
      },
      rules: {
        serviceInterval: [
          { required: true, message: "", trigger: "blur,change" },
          { validator: validatePass, message: "", trigger: "blur" }
        ],
        probationInterval: [
          { required: true, message: "", trigger: "blur,change" },
          { validator: validatePass, message: "", trigger: "blur" }
        ],
        serviceFee: [
          { required: true, message: "", trigger: "blur,change" },
          { validator: validatePass, message: "", trigger: "blur" }
        ],
        bedFee: [
          { required: true, message: "", trigger: "blur,change" },
          { validator: validatePass, message: "", trigger: "blur" }
        ],
        careFee: [
          { required: true, message: "", trigger: "blur,change" },
          { validator: validatePass, message: "", trigger: "blur" }
        ],
        dietFee: [
          { required: true, message: "", trigger: "blur,change" },
          { validator: validatePass, message: "", trigger: "blur" }
        ],
        otherFee: [{ validator: validatePass, message: "", trigger: "blur" }],
        depositFee: [
          { required: true, message: "", trigger: "blur,change" },
          { validator: validatePass, message: "", trigger: "blur" }
        ],
        agreeOut: [{ required: true, message: "", trigger: "blur,change" }],
        agreeMedicine: [{ required: true, message: "", trigger: "blur,change" }]
      }
    };
  },
  computed: {
  },
  created() {
    this.sign = this.$route.query.sign;
    this.hasRuZhuHeTong = JSON.parse(window.localStorage.getItem("hasRuZhuHeTong"))
      ? JSON.parse(window.localStorage.getItem("hasRuZhuHeTong"))
      : this.hasRuZhuHeTong;
    this.form.elderId = this.elderId;
    this.serviceDate(1);
    this.tryLiveTime(30);
    this.getBaseFee();
  },
  watch: {
    tryLiveDate(newValue, oldValue) {
      console.log(newValue);
      if(newValue[0]){
        this.pickerOptions = {
          disabledDate(time) {
            // 设置可选择的日期为今天之后的一个月内
            // console.log(time.getTime() < moment(newValue[0]));
            return time.getTime() <= moment(newValue[0]);
          }
        }
      } else {
        this.pickerOptions = {
          disabledDate(time) {
            // 设置可选择的日期为今天之后的一个月内
            // console.log(time.getTime() < moment(newValue[0]));
            return false;
          }
        }
      }
      if(newValue[0]&&newValue[1]){
        this.form.probationInterval = this.$moment(newValue[1]).diff(this.$moment(newValue[0]), "day") + 1;
      } else {
        this.form.probationInterval = '';
      }
    }
  },
  methods: {
    changeNotEdit(data) {
      this.$emit("changeNotEditStatus", data);
    },
    //获取基础项费用
    getBaseFee() {
      let data = {
        elderId: this.form.elderId
      };
      axios.fetch("elderServer", "/elder/amount", data).then(res => {
        let resData = res.data;
        this.form.bedFee = resData.filter(item => {
          return item.category === "基础项" && item.title === "托管费";
        })[0].feeAmount;
        this.form.careFee = resData.filter(item => {
          return item.category === "基础项" && item.title === "护理费";
        })[0].feeAmount;
        this.form.dietFee = resData.filter(item => {
          return item.category === "基础项" && item.title === "膳食费";
        })[0].feeAmountDay;
        this.form.depositFee = resData.filter(item => {
          return item.category === "基础项" && item.title === "保证金";
        })[0].feeAmount;
        this.form.serviceFee =
          parseFloat(this.form.bedFee) + parseFloat(this.form.careFee);
      });
    },
    initServiceDate(month) {
      this.form.serviceStartDate = this.checkinDate;
      this.form.serviceEndDate = this.computeYmd(
        this.form.serviceStartDate,
        month
      );
      this.serverDate = [this.form.serviceStartDate, this.form.serviceEndDate];
    },
    initTryLiveTime(day) {
      this.form.probationStartDate = this.checkinDate;
      let startDate = this.checkinDate;
      this.form.probationEndDate = this.GetDateStr(startDate, day);
      this.tryLiveDate = [
        this.form.probationStartDate,
        this.form.probationEndDate
      ];
    },
    computeYmd(val, n) {
      //根据时间和月份算出几月以后的日期
      let str = val.split("-");
      let d = new Date(str[0], str[1], str[2]);
      d.setMonth(d.getMonth() - 1 + n);
      let yy1 = d.getFullYear();
      let mm1 = d.getMonth() + 1;
      let dd1 = d.getDate() - 1;
      if (dd1 == "00") {
        mm1 = parseInt(mm1) - 1;
        let new_date = new Date(yy1, mm1, 1);
        dd1 = new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate();
      }
      if (mm1 < 10) {
        mm1 = "0" + mm1;
      }
      if (dd1 < 10) {
        dd1 = "0" + dd1;
      }
      return yy1 + "-" + mm1 + "-" + dd1;
    },
    GetDateStr(dd, AddDayCount) {
      dd = new Date(dd);
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m =
        dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + "-" + m + "-" + d;
    },
    serviceDate(year) {
      let reg = /^[0-9]*[1-9][0-9]*$/;
      if (reg.test(year) === true) {
        let month = 12 * Number(year);
        this.initServiceDate(month);
      }
    },
    tryLiveTime(day) {
      let reg = /^[0-9]*[1-9][0-9]*$/;
      if (reg.test(day) === true) {
        day = Number(day) - 1;
        this.initTryLiveTime(day);
      }
    },
    serviceFee() {
      let bedFee = Number(this.form.bedFee);
      let careFee = Number(this.form.careFee);
      if (this.form.bedFee == "") {
        this.form.serviceFee = careFee;
      } else if (this.form.careFee == "") {
        this.form.serviceFee = bedFee;
      } else {
        this.form.serviceFee = bedFee + careFee;
      }
      //解决js浮点计算
      this.form.serviceFee = Math.round(this.form.serviceFee * 100) / 100;
    },
    save() {
      if (
        this.form.serviceInterval === "" ||
        this.form.serviceInterval === undefined
      ) {
        this.$message.error("请输入服务时间");
        return;
      } else if (
        this.serverDate.length === 0 ||
        this.serverDate === undefined
      ) {
        this.$message.error("请输入服务时间范围");
        return;
      } else if (
        this.form.probationInterval === "" ||
        this.form.probationInterval === undefined
      ) {
        this.$message.error("请输入试住期");
        return;
      } else if (
        this.tryLiveDate.length === 0 ||
        this.tryLiveDate === undefined
      ) {
        this.$message.error("请输入试住期范围");
        return;
      } else if (
        this.form.serviceFee === "" ||
        this.form.serviceFee === undefined
      ) {
        this.$message.error("请输入服务费");
        return;
      } else if (this.form.bedFee === "" || this.form.bedFee === undefined) {
        this.$message.error("请输入床位费");
        return;
      } else if (this.form.careFee === "" || this.form.careFee === undefined) {
        this.$message.error("请输入护理费");
        return;
      } else if (this.form.dietFee === "" || this.form.dietFee === undefined) {
        this.$message.error("请输入膳食费");
        return;
      } else if (
        this.form.depositFee === "" ||
        this.form.depositFee === undefined
      ) {
        this.$message.error("请输入入住保证金");
        return;
      } else if (
        this.form.agreeOut === "" ||
        this.form.agreeOut === undefined
      ) {
        this.$message.error("请输入外出约定意见");
        return;
      } else if (
        this.form.agreeMedicine === "" ||
        this.form.agreeMedicine === undefined
      ) {
        this.$message.error("请输入委托发药意见");
        return;
      }
      if (this.form.otherFee === "") {
        this.form.otherFee = 0;
      } else {
        this.form.otherFee = this.form.otherFee;
      }
      let nowDate = new Date();
      let m =
        nowDate.getMonth() + 1 < 10
          ? "0" + (nowDate.getMonth() + 1)
          : nowDate.getMonth() + 1;
      let d =
        nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      nowDate = nowDate.getFullYear() + "-" + m + "-" + d;
      this.form.signDate = nowDate;
      this.form.serviceStartDate = this.serverDate[0];
      this.form.serviceEndDate = this.serverDate[1];
      this.form.probationStartDate = this.tryLiveDate[0];
      this.form.probationEndDate = this.tryLiveDate[1];
      this.form.elderId = this.elderId;
      this.form.status = 0;
      axios
        .fetch("elderServer", "/elder/insert", this.form, "json")
        // .fetch('http://192.168.3.209:8087', "/elder/insert", this.form, 'json')
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.hasRuZhuHeTong = true;
          window.localStorage.setItem("hasRuZhuHeTong", this.hasRuZhuHeTong);
        });
    }
  }
};
</script>

<style scoped>
.contractAppoint {
  margin-bottom: 50px;
}
.contractAppoint >>> .el-card__body {
  padding: 20px !important;
}
.contractAppoint >>> .el-radio-group {
  display: block;
  margin-top: 22px;
}
.contractAppoint >>> .el-form-item.is-success .el-input__inner {
  border-color: #dcdfe6;
}
h4 {
  margin-bottom: 20px;
}
.margin-left-word {
  margin-left: 0.4rem;
}
.handleBtn {
  text-align: center;
}
</style>