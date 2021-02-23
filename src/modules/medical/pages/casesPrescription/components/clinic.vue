<template>
  <div class="add_clinic">
    <el-form :model="form" ref="form" label-width="80px" :rules="rules" :show-message="false">
      <el-form-item v-if="showAdd" label="选择模板">
        <el-select v-model="templatValue" filterable placeholder="请选择" value-key="id" @change="handleChange"
          @clear="handleClear" clearable>
          <el-option v-for="item in templates" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主诉">
        <el-input v-if="showAdd" maxlength="100" show-word-limit v-model.trim="form.present">
        </el-input>
        <span v-else>{{form.present}}</span>
      </el-form-item>
      <el-form-item label="现病史">
        <el-input v-if="showAdd" v-model.trim="form.history"></el-input>
        <span v-else>{{form.history}}</span>
      </el-form-item>
      <el-form-item label="既往史">
        <el-input v-if="showAdd" v-model.trim="form.previous"></el-input>
        <span v-else>{{form.previous}}</span>
      </el-form-item>
      <el-form-item label="体检情况">
        <div class="condition" v-if="showAdd">
          <el-form-item label="T">
            <el-input placeholder="体温" v-model="form.temperature">
              <template slot="append">℃</template>
            </el-input>
          </el-form-item>
          <el-form-item label="P">
            <el-input placeholder="脉搏" v-model.number="form.pulseRate">
              <template slot="append">次/分</template>
            </el-input>
          </el-form-item>
          <el-form-item label="R">
            <el-input v-if="showAdd" placeholder="呼吸频率" v-model.number="form.respirationRate">
              <template slot="append">次/分</template>
            </el-input>
          </el-form-item>
          <el-form-item label="BP">
            <el-input v-if="showAdd" placeholder="高压" v-model.number="form.pressureHign">
            </el-input>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <el-input v-if="showAdd" placeholder="低压" v-model.number="form.pressureLow">
              <template slot="append">mmHg</template>
            </el-input>
          </el-form-item>
        </div>
        <el-input v-if="showAdd" type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remark">
        </el-input>
        <div class="condition" v-else>
          <span v-if="form.temperature"><b>T</b> {{form.temperature}}℃，</span>
          <span v-if="form.pulseRate"><b>P</b> {{form.pulseRate}}次/分，</span>
          <span v-if="form.respirationRate"><b>R</b> {{form.respirationRate}}次/分，</span>
          <span v-if="form.pulseRate"><b>BP</b> {{form.pressureHign}}/{{form.pressureLow}}mmHg，</span>
          <span v-if="form.remark">{{form.remark}}</span>
        </div>
      </el-form-item>
      <el-form-item label="辅助检查">
        <el-input v-if="showAdd" type="textarea" :rows="2" placeholder="请输入内容" v-model.trim="form.examination">
        </el-input>
        <span v-else>{{form.examination}}</span>
      </el-form-item>
      <el-form-item label="临床诊断" prop="diagnosis">
        <illness v-if="showAdd" ref="firstIllness" @changeIllness="getDiagnosis"  />
        <!-- <el-input type="textarea" rows="5" placeholder="" maxlength="250" show-word-limit v-model.trim="form.diagnosis"></el-input> -->
        <span v-else>{{form.diagnosis}}</span>
      </el-form-item>
      <el-form-item label="处理意见">
        <el-input v-if="showAdd" type="textarea" placeholder="" maxlength="250" show-word-limit :rows="2"
          v-model.trim="form.advise">
        </el-input>
        <span v-else>{{form.advise}}</span>
      </el-form-item>
      <el-form-item v-if="advice.status!=-1" style="text-align:center">
        <!-- <el-button @click="medicineVisile = true">显示</el-button> -->
        <el-button v-if="!showAdd&&!form.printClinicTime&&advice.source === 2&&advice.status < 2" @click="handleEdit">修改</el-button>
        <!-- <el-button v-if="sign ==='add'&&id" @click="sign='edit'">取消</el-button> -->
        <el-button v-if="!showAdd&&id" type="primary" @click="printVisible = true">打印病历</el-button>
        <el-button v-if="!form.printClinicTime&&showAdd" type="primary" @click="onSubmit">保存病历</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="printVisible" v-if="printVisible" :close-on-click-modal="false" append-to-body
      show-close=false>
      <printClinic :advice="advice" :tenantName="tenantName" @forbidEdit="forbidEdit" @handleClose="handleClose">
      </printClinic>
    </el-dialog>
    <!-- <el-dialog :visible.sync="medicineVisile" v-if="medicineVisile" :close-on-click-modal="false" append-to-body show-close=false>
      <medicine></medicine>
    </el-dialog> -->
  </div>
</template>

<script type="text/javascript">
import printClinic from "../printClinic";
import medicine from "./medicine";
import illness from "./illness";
export default {
  props: {
    dynamicTags: {
      type: Array,
      default: []
    },
    activeName: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: null,
    },
    advice: {
      type: Object,
      default: {},
    },
  },
  name: "AddClinic",
  data() {
    return {
      sign: "add",
      form: {
        diagnosis: "", // 诊断 必填值
        present: "", //主诉
        history: "", //现病史
        previous: "", //既往史
        respirationRate: "", //呼吸率（次/分钟）
        pulseRate: "", //脉搏（次/分钟）
        temperature: "", //体温（°C）
        pressureHign: "", //血压（高）（mmHg）
        pressureLow: "", //血压（低）（mmHg）
        examination: "", //辅助检查
        remark: "", //体检说明
        advise: "", //治疗建议
      },
      rules: {},
      templates: [],
      templatValue: {},
      printVisible: false,
      tenantName: "",
      elderId: "",
      // advice: {}, //病历处方详情
      printTime: "",
      copy: true,
      showAdd: true,
      // medicineVisile:false
    };
  },
  components: { printClinic, medicine, illness },
  watch: {
    "form.diagnosis"(newValue, oldValue) {
      console.log(newValue)
      this.$emit("diagnosisChange", newValue ? newValue.split(",") : []);
    },
    activeName(newValue) {
      this.initFormData();
    },
  },
  created() {
    // 查询模板
    this.queryTemplates();
    // 初始化表格数据
    this.initFormData();
    this.tenantName = this.$route.query.tenantName;
    this.elderId = this.$route.query.elderId;
    this.showAdd =
      (this.sign == "add" || this.sign == "copy") && !this.form.printClinicTime;
    console.log(this.showAdd);
  },
  methods: {
    initFormData() {
      console.log(this.id, "===id",this.dynamicTags);
      this.form.diagnosis = this.dynamicTags.toString();
      this.$nextTick(() => {
        this.$refs.firstIllness.dynamicTags = this.form.diagnosis.split(
          ","
        );
      });
      this.sign = this.$route.query.sign;
      if (this.id) {
        this.queryDetail(this.id);
        // if (this.sign == "add") {
        //   this.sign = "edit";
        // }
        this.showAdd = false;
        // this.$message.warning("修改");
      } else {
        if (this.$route.query.id) {
          this.queryDetail(this.$route.query.id);
          this.$nextTick(() => {
            this.$refs.firstIllness.dynamicTags = this.form.diagnosis.split(
              ","
            );
            this.$refs.firstIllness.setData();
          });
        }
      }
    },
    // updateIllness() {
    //   if (this.sign === "add" || this.sign === "copy") {
    //     this.$refs.firstIllness.setData();
    //   }
    // },
    getDiagnosis(val) {
      console.log(val)
      this.form.diagnosis = val.join(",");
      this.$emit('getDiagnosis', val);
    },
    // 查询诊断病历模板
    queryTemplates() {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/record-templates",
          null,
          null,
          "get"
        )
        .then((res) => {
          this.templates = res.data.map((item) => {
            let obj = {};
            obj.label = item.name;
            obj.value = item;
            return obj;
          });
          this.templatValue = localStorage.getItem("templatValue")
            ? JSON.parse(localStorage.getItem("templatValue"))
            : {};
        });
    },
    // 选择模板
    handleChange(data) {
      // this.form = Object.assign({}, this.form, data);
      this.form.present = data.content;
      this.form.history = data.history;
      this.form.temperature = data.temperature;
      this.form.pulseRate = data.pulseRate;
      this.form.respirationRate = data.respirationRate;
      this.form.pressureHign = data.pressureHign;
      this.form.pressureLow = data.pressureLow;
      this.form.examination = data.examination;
      this.form.advise = data.advise;
      this.form.remark = data.remark;
      this.form.diagnosis = data.diagnosis;
      this.$nextTick(() => {
        this.$refs.firstIllness.dynamicTags = this.form.diagnosis
          ? this.form.diagnosis.split(",")
          : [];
      });
      // if (this.sign == "add") {
      //   delete this.form.id;
      // }
      if (this.id) {
        this.form.id = this.id;
      }
      // this.form.present = this.form.content;
    },
    handleClear() {
      this.form = {};
      this.$nextTick(() => {
        this.$refs.firstIllness.dynamicTags = [];
      });
    },
    // 复制时需要删除id
    deleteId(data) {
      delete data.id;
      delete data.adviceNo;
      delete data.adviceId;
      delete data.createTime;
      delete data.doctorId;
      delete data.createTime;
      delete data.doctorName;
      if (data.adviceGroups.length > 0) {
        data.adviceGroups.forEach((item) => {
          delete item.id;
          delete item.adviceId;
          delete item.createTime;
          delete item.doctorId;
          delete item.createTime;
          delete item.doctorName;
        });
      }
    },
    // 查询病历处方详情
    queryDetail(id) {
      axios
        .fetch("medicalServer", "/api/advice/detail/" + id, null, null, "get")
        .then((res) => {
          this.form = Object.assign(this.form, res.data);
        });
    },
    // 提交
    onSubmit() {
      if (!this.form.diagnosis) {
        return this.$message.error("临床诊断必填！");
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          // alert("submit!");
          this.form.source = 2;
          this.form.status = 1;
          // 复制过来的需要删除id
          // sign = copy  并且没有生成id的情况下是复制添加的请求
          if (this.sign === "copy" && !this.id) {
            this.deleteId(this.form);
          }

          const param = {
            source: 2,
            diagnosis: this.form.diagnosis,
            adviceGroups: this.form.adviceGroups ? this.form.adviceGroups : [],
          };
          if (param.adviceGroups.length > 0) {
            param.adviceGroups.forEach((item) => {
              // delete item.id
              if (item.items && item.items.length > 0) {
                item.items.forEach((i) => {
                  delete i.id;
                });
              }
            });
          }
          console.log(this.form, "vvvvvv");
          axios
            .fetch(
              "medicalServer",
              "/api/advice/main/" + this.elderId,
              this.form,
              "json"
            )
            .then((res) => {
              if (param.adviceGroups.length > 0) {
                param.id = res.data;
                axios
                  .fetch(
                    "medicalServer",
                    "/api/advice/" + this.elderId,
                    param,
                    "json"
                  )
                  .then((result) => {
                    this.$emit("saveIdToLocal", res.data);
                    this.sign = "edit";
                    this.showAdd = false;
                  });
              } else {
                console.log('bbbbbbbbbbbbbbbbbbbbb');
                this.$emit("saveIdToLocal", res.data);
                this.sign = "edit";
                this.showAdd = false;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose() {
      this.printVisible = false;
    },
    handleEdit() {
      this.sign = "add";
      this.showAdd = true;
      this.$nextTick(() => {
        this.$refs.firstIllness.dynamicTags = this.form.diagnosis.split(",");
      });
    },
    forbidEdit() {
      this.form.printClinicTime = true;
    },
  },
};
</script>

<style lang="less" scoped>
.add_clinic {
  height: 100%;
  background-color: #fff;
  .el-form {
    width: 70%;
    height: 100%;
    padding: 15px;
    /deep/ .el-form-item {
      .el-form-item__label {
        font-weight: 600;
        color: #000000;
      }
      .condition {
        display: flex;
        margin-bottom: 8px;
        .el-form-item {
          flex: 1;
          .el-form-item__label {
            width: 50px !important;
            text-align: center;
            padding: 0;
          }
          .el-form-item__content {
            margin-left: 50px !important;
            .el-input {
              display: flex;
              .el-input__inner {
                width: 80px;
              }
              .el-input-group__append {
                flex: 1;
                height: 35px;
                text-align: center;
                box-sizing: border-box;
                line-height: 35px;
                padding: 0;
                min-width: 50px;
                max-width: 75px;
              }
            }
          }
        }
        /deep/ .el-form-item:last-child {
          .el-form-item__content {
            display: flex;
          }
        }
      }
    }
  }
}
</style>
