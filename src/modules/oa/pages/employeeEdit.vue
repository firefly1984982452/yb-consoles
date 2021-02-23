<template>
  <div>
    <EmployeeHeader></EmployeeHeader>
    <div class="content nopadding">
      <el-row>
        <el-col :span="4">
          <ub-avatar class="ub-photo" category="employee" :valueId="employeeId" v-model="form.employeePhoto"></ub-avatar>
        </el-col>
        <el-col :span="20" class="form">
          <el-form label-width="140px" :show-message="false" :model="form" ref="ruleForm">
            <el-row :gutter="10">
              <el-col :span="7">
                <el-form-item label="姓名" prop="employeeName" required>
                  <el-input v-model="form.employeeName" clearable placeholder="请输入员工姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="性别" prop="gender" required>
                  <ub-dictionary group="性别" v-model="form.gender" clearable></ub-dictionary>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="出生日期" prop="birthDay" required>
                  <el-date-picker v-model="form.birthDay" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="7">
                <el-form-item label="籍贯" prop="birthPlace" required>
                  <ub-address v-model="form.birthPlace" dataType="province" category="birthPlace" clearable></ub-address>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="身份证号" prop="cardNo" required>
                  <el-input v-model="form.cardNo" placeholder="请输入身份证号" maxlength="18" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="民族" prop="nation" required>
                  <ub-dictionary group="民族" v-model="form.nation" clearable></ub-dictionary>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="7">
                <el-form-item label="学历" prop="educational" required>
                  <ub-dictionary group="学历" v-model="form.educational" clearable></ub-dictionary>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="手机号" prop="mobilePhone" required>
                  <el-input v-model.number="form.mobilePhone" oninput="value=value.replace(/[^0-9.]/g,'')" clearable placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="婚姻状况" prop="marriage" required>
                  <ub-dictionary group="婚姻状况" v-model="form.marriage" clearable></ub-dictionary>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="部门" prop="selectDeptIds" required>
                  <el-cascader expand-trigger="click" ref="selectDeptIds" placeholder="请选择" :options="departTree"
                    v-model="form.selectDeptIds" filterable change-on-select @change="handleChange"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="岗位" prop="jobId" required>
                  <el-select v-model="form.jobId" clearable placeholder="请选择" @change="handleChangeJob">
                    <el-option v-for="item in deptJobList" :key="item.jobId" :label="item.jobName"
                      :value="item.jobId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="入职日期" prop="joinDate" required>
                  <el-date-picker v-model="form.joinDate" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="紧急联系人" prop="emergencyName">
                  <el-input v-model="form.emergencyName" clearable placeholder="请输入联系人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="紧急联系电话" prop="emergencyPhone">
                  <el-input v-model="form.emergencyPhone" clearable placeholder="请输入联系人电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="政治面貌" prop="polity">
                  <ub-dictionary group="政治面貌" v-model="form.polity" clearable></ub-dictionary>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-form-item label="户籍类型" prop="registerPlace">
                <ub-dictionary-radio v-model="form.registerPlace" group="户籍类型"></ub-dictionary-radio>
              </el-form-item>
            </el-row>
            <el-row :gutter="0">
              <el-row>
                <el-col :span="6" style="margin-right: 10px;">
                  <el-form-item label="户籍地址" prop="registerProvince">
                    <ub-address v-model="form.registerProvince" dataType="province" category="register" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="5" style="margin-right: 10px;">
                  <el-form-item label="" prop="registerCity" label-width="0px">
                    <ub-address v-model="form.registerCity" dataType="city" category="register" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="5" style="margin-right: 10px;">
                  <el-form-item label="" prop="registerDistrict" label-width="0px">
                    <ub-address v-model="form.registerDistrict" dataType="district" category="register" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="" prop="registerStreet" label-width="0px">
                    <ub-address v-model="form.registerStreet" dataType="street" category="register" clearable></ub-address>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <el-form-item label="" prop="registerRoad">
                    <el-input v-model="form.registerRoad" placeholder="请输入内容">
                      <template slot="append">路</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="" prop="registerAlley" label-width="0px">
                    <el-input v-model="form.registerAlley" placeholder="请输入内容">
                      <template slot="append">弄</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="" prop="registerNumber" label-width="0px">
                    <el-input v-model="form.registerNumber" placeholder="请输入内容">
                      <template slot="append">号</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="" prop="registerRoom" label-width="0px">
                    <el-input v-model="form.registerRoom" placeholder="请输入内容">
                      <template slot="append">室</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span='14'>
                  <el-form-item label="" prop="registerAddress">
                    <el-input v-model="form.registerAddress" clearable placeholder="请输具体地址"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
            <el-row>
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item label="现居住地" prop="residenceProvince">
                    <ub-address v-model="form.residenceProvince" dataType="province" category="residence" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="" prop="residenceCity" label-width="0px">
                    <ub-address v-model="form.residenceCity" dataType="city" category="residence" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="" prop="residenceDistrict" label-width="0px">
                    <ub-address v-model="form.residenceDistrict" dataType="district" category="residence" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" prop="residenceStreet" label-width="0px">
                    <ub-address v-model="form.residenceStreet" dataType="street" category="residence" clearable></ub-address>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-row>
                  <el-col :span="9">
                    <el-form-item label="" prop="residenceRoad">
                      <el-input v-model="form.residenceRoad" placeholder="请输入内容">
                        <template slot="append">路</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="" prop="residenceAlley" label-width="0px">
                      <el-input v-model="form.residenceAlley" placeholder="请输入内容">
                        <template slot="append">弄</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="" prop="residenceNumber" label-width="0px">
                      <el-input v-model="form.residenceNumber" placeholder="请输入内容">
                        <template slot="append">号</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="" prop="residenceRoom" label-width="0px">
                      <el-input v-model="form.residenceRoom" placeholder="请输入内容">
                        <template slot="append">室</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :span='14'>
                    <el-form-item label="" prop="residenceAddress">
                      <el-input v-model="form.residenceAddress" clearable placeholder="请输具体地址"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="7">
                <el-form-item label="工资银行卡号">
                  <el-input v-model="form.salaryBankNo" clearable placeholder="请输入工资银行卡号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="工资卡开户行">
                  <el-input v-model="form.salaryBankName" clearable placeholder="请输入工资卡开户行"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="7">
                <el-form-item label="补贴卡号">
                  <el-input v-model="form.subsidyBankNo" clearable placeholder="请输入补贴卡号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="补贴卡开户行">
                  <el-input v-model="form.subsidyBankName" clearable placeholder="请输入补贴卡开户行"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="center" :gutter="0">
              <el-form-item label="">
                <el-col :span="3">
                  <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                </el-col>
                <el-col :span="3">
                  <el-button @click="back()">关闭</el-button>
                </el-col>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";
import { makeElementTree } from "@/utils/tree.js";
import EmployeeHeader from "./employeeHeader";
import ubAddress from "@/components/address";
import ubDictionary from "@/components/dictionary";
import ubDictionaryRadio from "@/components/dictradio";
import ubAvatar from "@/components/avatar";

export default {
  components: { EmployeeHeader, ubAddress, ubDictionary, ubDictionaryRadio, ubAvatar },
  data() {
    return {
      employeeId: null,
      currentTab: "base",
      departTree: [],
      option: [],
      deptJobList: [],
      form: {
        selectDeptIds: []
      }
    };
  },
  created() {
    ubDictionary.init(this);
    this.employeeId = this.$route.query.employeeId;
  },
  computed: {},
  mounted() {
    this.sign = this.$route.query.sign;
    if (this.employeeId) {
      let data = {
        employeeId: this.employeeId
      };
      axios.fetch("oaServer", "/employee/get", data).then(res => {
        this.form = res.data;
        this.form.selectDeptIds = [];
        this.initDept();
        this.initJobList();
      });
    } else {
      this.initDept();
      this.initJobList();
    }
  },
  methods: {
    initJobList() {
      axios.fetch("oaServer", "/org/job/list").then(res => {
        this.jobList = res.data;
        if (this.form.deptId) {
          this.handleChange([this.form.deptId],'init');
        }
      });
    },
    initDept() {
      let that = this;
      axios.fetch("oaServer", "/org/dept/list").then(res => {
        that.departTree = makeElementTree({
          pid: 0,
          list: res.data,
          pidFiled: "parentId",
          labelFiled: "deptName",
          valueFiled: "deptId"
        });
        //部门回显，双向绑定
        that.form.selectDeptIds = that.deptIdChange(
          that.form.deptId,
          that.departTree
        );
      });
    },
    deptIdChange(key, treeData) {
      let arr = []; // 在递归时操作的数组
      let returnArr = []; // 存放结果的数组
      let depth = 0; // 定义全局层级
      // 定义递归函数
      function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
          depth = depthN; // 将执行的层级赋值 到 全局层级
          arr[depthN] = childrenData[j].value;
          if (childrenData[j].value == key) {
            returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
            break;
          } else {
            if (childrenData[j].children) {
              depth++;
              childrenEach(childrenData[j].children, depth);
            }
          }
        }
        return returnArr;
      }
      return childrenEach(treeData, depth);
    },
    clearForm() {
      this.form.employeeName = "";
      this.form.gender = "";
      this.form.cardNo = "";
    },
    toJson(str) {
      return eval("(" + str + ")");
    },
    handleChange(value,type) {
      if (value instanceof Array) {
        this.form.deptId = value[value.length - 1];
        this.findLabel(this.departTree,this.form.deptId);
        this.form.jobId = type == 'init' ? this.form.jobId : '';
        this.deptJobList = this.jobList.filter(
          item => item.deptId == this.form.deptId
        );
      }
    },
    findLabel(dataArr,id){
      dataArr.forEach(item=>{
        if( item.value === id ){
          this.form.deptName = item.label;
          return;
        } else {
          if( item.children && item.children.length > 0){
            this.findLabel(item.children,id)
          }
        }
      })
    },
    handleChangeJob(jobId){
      this.$set(this.form,'jobId',this.form.jobId);
      // this.$set(this.form,'jobName',this.form.jobId);
      var obj = {}
      obj = this.deptJobList.find(function(item){
        return item.jobId === jobId
      })
      //obj 就是被选中的那个对象，也就能拿到label值了。
      this.$set(this.form,'jobName',obj.jobName);
      this.$forceUpdate();
    },
    submitForm(formName) {
      let that = this;
      this.form.residencePlace = "";
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return true;
        } else {
          let data = qs.stringify(this.form);
          let created = !this.form.employeeId;
          axios
            .fetch("oaServer", "/employee/update", data)
            .then(res => {
              var msg = "";
              if (this.sign === "edit") {
                msg = "修改成功";
              } else {
                msg = "添加成功";
              }
              that.$message({
                message: msg,
                type: "success"
              });
              var resData = res.data;
              if (created && resData && resData.employeeId) {
                this.$router.replace({
                  path: "/oa/employee/contract?currentTab=contract&sign=edit&employeeId=" +
                    resData.employeeId
                });
              }
            });
        }
      });
    },
    back() {
      this.$router.go(-1);
    }
  },
  filters: {}
};
</script>

<style lang="less" scoped>
.form {
  margin-top:20px;

  /deep/ .el-form-item {
    margin-bottom: 15px;
  }
}

.ub-photo {
  margin-top: 20px;
}

/deep/ .el-input-group__append,
.el-input-group__prepend {
  background-color: #ffffff;
  color: #606266;
  border: none;
}
</style>
