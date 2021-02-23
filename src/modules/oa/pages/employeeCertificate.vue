<template>
  <div>
    <EmployeeHeader></EmployeeHeader>
    <div class="content" style="padding:0px">
      <el-card class="box-card">
        <el-row type="flex" class="block">
          <el-col>
            <s class="qingseBa"></s>
            <span>{{employee.employeeName}}</span>
            <span class="care-code" v-show="info.insuranceCode">医护类人员医保码：{{info.insuranceCode}}</span>
          </el-col>
          <el-col :span="4" class="right">
            <el-button type="success" @click="add()" v-if="sign!='view'" icon="el-icon-plus">添加证书</el-button>
            <el-button type="primary" @click="setCode()" v-if="sign!='view'" icon="el-icon-s-tools">设置医保码</el-button>
          </el-col>
        </el-row>
        <el-table :data="listData" border :header-cell-style="{background:'#F3F3F5'}">
          <el-table-column prop="certificateName" label="证书名称" align="center"></el-table-column>
          <el-table-column prop="level" label="持证等级" :formatter="levelFormatter" align="center" min-width="30%"></el-table-column>
          <el-table-column prop="certificateNo" label="证书编号" align="center"></el-table-column>
          <el-table-column prop="obtainDate" label="持证日期" align="center" min-width="50%"></el-table-column>
          <el-table-column prop="certificateType" label="证书分类" :formatter="cerfificateTypeFormatter" align=" center" min-width="50%"></el-table-column>
          <el-table-column label="操作" align="center" min-width="20%" style="font-size: 20px;" v-if="sign!='view'">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <div style="font-size:20px">
                  <el-button @click="deleteIt(scope.row)" size="mini"><i class="el-icon-delete-solid" style="font-size:20px"></i></el-button>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 添加证书 -->
      <el-dialog title="添加证书" :show-close="false" :visible="formVisible" modal="true" width="400px" center top="20vh" v-if="sign!='view'">
        <el-form :model="form" :label-position="left" status-icon :rules="rules" ref="ruleForm" label-width="120px" size="mini">
          <el-form-item label="证书名称" prop="certificateName">
            <el-input v-model="form.certificateName" clearable placeholder="请输入证书名称"></el-input>
          </el-form-item>
          <el-form-item label="持证等级" prop="level">
            <el-select v-model="form.level" placeholder="请选择">
              <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证书编号" prop="certificateNo">
            <el-input v-model="form.certificateNo" clearable placeholder="请输入证书编号"></el-input>
          </el-form-item>
          <el-form-item label="持证日期" prop="obtainDate">
            <el-date-picker v-model="form.obtainDate" value-format="yyyy-MM-dd" type="date" placeholder="请输入持证日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label=" 证书分类" prop="certificateType">
            <el-select v-model="form.certificateType" placeholder="请选择">
              <el-option v-for="item in certificateTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button @click="formVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 录入医护类人员医保码 -->
      <el-dialog title="录入医护类人员医保码" :show-close="false" :visible="formCodeVisible" modal="true" width="400px" center top="20vh" v-if="sign!='view'">
        <div class="info">
          <p>请正确录入医生，护士以及护工的医保编码ID</p>
          <b>注意：不是个人社保卡号</b>
        </div>
        <el-form :model="formCode" :label-position="left" status-icon :rules="codeRules" ref="ruleCodeForm" label-width="120px" size="mini">
          <el-form-item label="医保码ID">
            <el-input v-model="formCode.insuranceCode" clearable placeholder="请输入医保码ID"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="submitCodeForm('ruleCodeForm')">生 成</el-button>
          <el-button @click="formCodeVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import { OssUrlPic, OssUrlNoPic } from "@/utils/utils.js";
import EmployeeHeader from "./employeeHeader";

export default {
  data() {
    return {
      contractTypes: [
        { value: "1", label: "劳务合同" },
        { value: "0", label: "劳动合同" }
      ],
      workTypes: [
        { value: "1", label: "全职" },
        { value: "0", label: "兼职" }
      ],
      levels: [
        { value: "0", label: "初级" },
        { value: "1", label: "中级" },
        { value: "2", label: "高级" }
      ],
      certificateTypes: [
        { value: "1", label: "护理员证" },
        { value: "2", label: "医生护士医技证" },
        { value: "3", label: "技工证" },
        { value: "0", label: "其它" }
      ],
      org: {},
      listData: [],
      formVisible: false,
      formCodeVisible: false,
      employeeId: null,
      employee: {},
      currentTab: "certificate",
      isReadOnly: false,
      ossUrl: OssUrlPic,
      show: false,
      sign: "view",
      option: [],
      contract: {},
      contracts: [],
      loading: false,
      selectDeptIds: [],
      form: {},
      formCode: {
        employeeId: '',
        insuranceCode: ''
      },
      info: {
        insuranceCode: ''
      },
      rules: {
        certificateName: [
          {
            required: true,
            message: "请输入证书名称",
            trigger: ["blur", "change"]
          }
        ],
        level: [
          {
            required: true,
            message: "请输入持证等级",
            trigger: ["blur", "change"]
          }
        ],
        certificateNo: [
          {
            required: true,
            message: "请输入证书编号",
            trigger: ["blur", "change"]
          }
        ],
        obtainDate: [
          {
            required: true,
            message: "请输入持证日期",
            trigger: ["blur", "change"]
          }
        ],
        certificateType: [
          {
            required: true,
            message: "请输入证书分类",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {
    this.employeeId = this.$route.query.employeeId;
    this.form.employeeId = this.employeeId;
    this.formCode.employeeId = this.employeeId;
    this.sign = this.$route.query.sign;
    let data = { employeeId: this.employeeId };

    axios.fetch("oaServer", "/employee/get", data).then(res => {
      this.employee = res.data;
    });
    this.init();
    this.getCode();
  },
  computed: {},
  components: {
    EmployeeHeader
  },
  mounted() { },
  methods: {
    getCode() {
      axios.fetch("elderServer", "/elderInsuranceInfo/insuranceCode", { employeeId: this.employeeId }).then(res => {
        this.formCode.insuranceCode = res.data ? res.data : '';
        this.info.insuranceCode = res.data ? res.data : '';
      });

    },
    levelFormatter(row, column, value, index) {
      let objects = this.levels;
      for (let key of Object.keys(objects)) {
        if (key == value) {
          return objects[key].label;
        }
      }
    },
    cerfificateTypeFormatter(row, column, value, index) {
      let objects = this.certificateTypes;
      for (let key of Object.keys(objects)) {
        console.log(key);
        if (Number(key) + 1 == value) {
          return objects[key].label;
        }
      }
    },
    init() {
      let data = { employeeId: this.employeeId };
      axios
        .fetch("oaServer", "/employee/certificate/get", data)
        .then(res => {
          this.listData = res.data;
        });
    },
    selectTool(cid) {
      let data = {
        parentNos: cid
      };
      axios
        .fetch("commonServer", "/dict/getItemViewsByParentNo", data)
        .then(res => {
          this.option = res.data;
        });
    },

    submitForm(formName) {
      let that = this;
      var params = new FormData();
      let relArray = [];
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return true;
        } else {
          let data = qs.stringify(this.form);
          axios
            .fetch("oaServer", "/employee/certificate/update", data)
            .then(res => {
              that.$message({
                message: "添加成功",
                type: "success"
              });
              this.init();
              this.formVisible = false;
            });
        }
      });
    },
    submitCodeForm(formName) {
      let data = qs.stringify(this.formCode);
      if (!(/^\w{0,12}$/.test(this.formCode.insuranceCode))) {
        return this.$message.error('医保ID请输入12位以内正确字母和数字!')
      }
      console.log(data, this.formCode)
      axios
        .fetch("oaServer", "/employee/insuranceCode", this.formCode, 'json')
        .then(res => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getCode();
          this.formCodeVisible = false;
        });
    },
    add() {
      let theForm = this.$refs["ruleForm"];
      if (theForm) {
        theForm.resetFields();
      }
      this.dateRange = [];
      this.formVisible = true;
    },
    setCode() {
      this.formCodeVisible = true;

    },
    deleteIt(data) {
      this.$confirm(
        "确认删除 【" + data.certificateName + "】 吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: ""
        }
      ).then(() => {
        let param = { certificateId: data.certificateId };
        axios
          .fetch("oaServer", "/employee/certificate/delete", param)
          .then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.init();
            this.formVisible = false;
          });
      });
    }
  },
  filters: {
    booleanText: val => {
      if (val == 1) {
        return "是";
      } else {
        return "否";
      }
    },
    dateFilter: val => {
      if (val) {
        val =
          parseInt(val.substr(0, 4)) +
          1 +
          "年" +
          val.substr(5, 2) +
          "月" +
          val.substr(8, 2) +
          "日";
      } else {
        val = "";
      }
      return val;
    },
    workTypeFilter: val => {
      if (val == 1) {
        return "全职";
      } else {
        return "兼职";
      }
    },
    contractTypeFilter: val => {
      if (val == 1) {
        return "劳务合同";
      } else {
        return "劳动合同";
      }
    }
  }
};
</script>
<style scoped>
@import url("../../../assets/styles/media.css");

.qingseBa {
  display: inline-block;
  width: 4px;
  height: 20px;
  border-radius: 3px;
  position: relative;
  top: 4px;
  margin-right: 10px;
}
.qingseBa {
  background: #2fc07a;
}
.care-code {
  background-color: #387ad8;
  color: #fff;
  padding: 4px;
  border-radius: 2px;
}
.block {
  margin-bottom: 15px;
  padding: 0 0 10px 0;
  border-bottom: 1px solid darkgrey;
}
.info {
  background-color: #eff2f3;
  padding: 10px;
  margin: 0 0 20px 0;
}
</style>