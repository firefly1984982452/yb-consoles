<template>
  <!-- 编辑合同的弹框 -->
  <div class="contract-edit-dialog">
    <el-dialog title="修改合同" width="70%" :visible.sync="dialogFormVisible" center>
      <el-form :model="form" label-width="95px" :rules="rules">
        <h4>服务期限</h4>
        <el-row>
          <el-form-item label="服务时间" prop="serviceInterval" style="display:inline-block;">
            <!-- <el-input type="number" disabled v-model="form.serviceInterval" style="width:100px;" maxlength="5"></el-input> -->
            <!-- <span style="margin:0 .4rem;">年</span> -->
            <!-- </el-form-item> -->
            <!-- <el-form-item label="" label-width="0" style="display:inline-block;"> -->
            <!-- <el-date-picker v-model="form.serviceStartDate" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期"  @change="serviceDateChange"></el-date-picker> -->
            <el-date-picker v-model="form.serviceStartDate" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker>
            <el-date-picker v-model="form.serviceEndDate" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="试住期" prop="probationInterval" style="display:inline-block;">
            <el-input type="number" v-model="form.probationInterval" style="width:100px;" maxlength="5" @change="tryLiveTimeChange"></el-input>
            <span style="margin:0 .4rem;">天</span>
          </el-form-item>
            
          <el-form-item label="" label-width="30" style="display:inline-block;">
            <el-date-picker v-model="form.probationStartDate" type="date" :picker-options="pickerOptions" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" :clearable="false" @change="tryLiveDateChange"></el-date-picker>
            <el-date-picker v-model="form.probationEndDate" type="date" disabled format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-row>
        <h4>入住费用</h4>
        <el-row>
          <el-col :span="6">
            <el-row>
              <el-col :span="18">
                <el-form-item label="服务费" prop="serviceFee">
                  <el-input disabled v-model="form.serviceFee" maxlength="8"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="height:35px;line-height:35px;">
                <span>元/月</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="18">
                <el-form-item label="(托管费" label-width="70px" prop="bedFee">
                  <el-input v-model="form.bedFee" maxlength="8" @input="serviceFee()">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="height:35px;line-height:35px;">
                <span>元/月</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row>
              <el-col :span="18">
                <el-form-item label="护理费" label-width="70px" prop="careFee">
                  <el-input v-model="form.careFee" maxlength="8" @input="serviceFee()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="height:35px;line-height:35px;">
                <span>元/月)</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row>
              <el-col :span="18">
                <el-form-item label="膳食费" prop="dietFee">
                  <el-input v-model="form.dietFee" maxlength="8">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="height:35px;line-height:35px;">
                <span>元/天</span>
              </el-col>
            </el-row>
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
          <el-col :span="4">
            <el-form-item label="入住保证金" prop="depositFee">
              <el-input v-model="form.depositFee" style="width:100px;" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <span style="height:35px;line-height:35px;">元</span>
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
            <el-input type="textarea" v-model="form.emergencyContact" placeholder="请输入紧急联系人约定"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="其它约定" label-width="110px">
            <el-input type="textarea" v-model="form.otherRemark" placeholder="请输入其它约定"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "ContractEditDialog",
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
      dialogFormVisible: false,
      elderName: "",
      //   serverDate: [],
      //   tryLiveDate: [],
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
        probationInterval: "",
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
      }, //合同数据
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
    pickerOptions() {
      return {
        // disabledDate:(time) => {
        //     return time.getTime() > moment(this.form.probationEndDate);
        //   }
      }
    }
  },
  methods: {
    serviceDateChange(val) {
      this.form.serviceEndDate = moment(val)
        .add(1, "y")
        .subtract(1, "days")
        .format("YYYY-MM-DD");
    },
    tryLiveDateChange(val) {
      console.log(this.form.probationInterval);

      this.form.probationEndDate = moment(val)
        .add(this.form.probationInterval - 1, "days")
        .format("YYYY-MM-DD");
        // console.log(val);
        // this.form.probationInterval = moment(this.form.probationEndDate).diff(this.$moment(this.form.probationStartDate), "day");
    },
    tryLiveTimeChange(val) {
      this.form.probationEndDate = moment(this.form.probationStartDate)
        .add(val - 1, "days")
        .format("YYYY-MM-DD");
    },
    serviceFee() {
      let bedFee = Number(this.form.bedFee);
      let careFee = Number(this.form.careFee);
      this.form.serviceFee = bedFee + careFee;
      //解决js浮点计算
      this.form.serviceFee = Math.round(this.form.serviceFee * 100) / 100;
    },
    confirmEdit() {
      if (!this.form.serviceStartDate || !this.form.serviceEndDate) {
        this.$message.error("请输入服务时间");
        return;
      } else if (
        this.$moment(this.form.serviceStartDate).valueOf() >
        this.$moment(this.form.serviceEndDate).valueOf()
      ) {
        this.$message.error("服务开始时间不能大于结束时间");
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
      } else {
        let nowDate = new Date();
        let m =
          nowDate.getMonth() + 1 < 10
            ? "0" + (nowDate.getMonth() + 1)
            : nowDate.getMonth() + 1;
        let d =
          nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        nowDate = nowDate.getFullYear() + "-" + m + "-" + d;
        this.form.signDate = nowDate;
        axios
          .fetch("elderServer", "/elder/edit", this.form, "json")
          .then(res => {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.dialogFormVisible = false;
            this.$emit("dataInit");
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  height: 500px;
  overflow: auto;
}
</style>
