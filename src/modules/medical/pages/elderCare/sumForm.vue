<template>
  <div class="sum-form">
    <el-form style="width:720px" ref="form" :model="form" label-width="110px" :rules="rules">
      <p v-if="form.formType === 0">长者出院小结</p>
      <p v-else>长者死亡小结</p>
      <el-form-item :label="form.formType === 0 ? '出院日期' : '死亡日期'">
        <el-date-picker v-if="sign === 'add'" :clearable="false" v-model="form.checkoutDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
        </el-date-picker>
        <b v-else>{{ form.checkoutDate }}</b>
      </el-form-item>
      <el-form-item label="入院诊断">
        <div v-if="form.checkinMedical">
          <b v-for="(item, index) in form.checkinMedical.split(',')" :key="index">
            {{ index + 1 }}、{{ item }}
          </b>
        </div>
        <b v-else>无</b>
      </el-form-item>
      <el-form-item label="入院情况">
        <el-input v-if="sign === 'add'" maxlength="250" show-word-limit type="textarea" :rows="5" v-model.trim="form.checkinDescription" placeholder="请输入入院情况"></el-input>
        <b v-else>{{ form.checkinDescription }}</b>
      </el-form-item>
      <el-form-item label="在院治疗情况">
        <el-input v-if="sign === 'add'" type="textarea" maxlength="250" show-word-limit v-model.trim="form.medicalDescription" :rows="5" placeholder="请输入在院病程经过与治疗情况说明"></el-input>
        <b v-else>{{ form.medicalDescription }}</b>
      </el-form-item>
      <el-form-item :label="form.formType === 0 ? '出院情况' : '抢救经过'">
        <el-input v-if="sign === 'add'" type="textarea" maxlength="250" show-word-limit :rows="5" v-model.trim="form.checkoutDescription" placeholder="请输入出院情况"></el-input>
        <b v-else>{{ form.checkoutDescription }}</b>
      </el-form-item>
      <el-form-item :label="form.formType === 0 ? '出院诊断' : '死亡诊断'">
        <el-tag type="info" :key="tag" v-for="tag in medicalCurrent" :closable="sign === 'add'" :disable-transitions="false" @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-select v-if="sign === 'add'" v-model="medicalCurrent" multiple filterable allow-create default-first-option placeholder="请选择病史" :collapse-tags="true">
          <el-option v-for="(item, i) in illOption" :key="i" :label="item.label" :value="item.label">
            <span style="float: left">{{ item.label }}</span>
            <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="form.formType === 0 ? '出院医嘱' : '死亡原因'">
        <el-input v-if="sign === 'add'" type="textarea" :rows="5" maxlength="250" show-word-limit v-model.trim="form.checkoutAdvice" :placeholder="
            form.formType === 0 ? '请输入出院医嘱' : '请输入死亡原因'
          "></el-input>
        <b v-else>{{ form.checkoutAdvice }}</b>
      </el-form-item>
      <el-form-item v-if="sign === 'add'">
        <el-button type="primary" @click="submitForm()">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
      <el-form-item v-else style="text-align:center">
        <el-button @click="handleCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import illness from "@/modules/medical/pages/casesPrescription/components/illness";
export default {
  name: "SumForm",
  components: {
    illness
  },
  data () {
    return {
      form: {
        checkinDescription: "",
        checkinMedical: "",
        checkoutAdvice: "",
        checkoutDate: "",
        checkoutDescription: "",
        checkoutMedical: "",
        formType: "",
        medicalDescription: ""
      },
      medicalCurrent: [],
      rules: [],
      illOption: [],
      sign: "",
      elderId: "",
      formStatus: ""
      // canEdit: true
    };
  },
  created () {
    this.sign = this.$route.query.sign;
    this.formStatus = this.$route.query.formStatus;
    this.elderId = this.$route.query.elderId;
    // const status = this.$route.query.status;
    // const formStatus = this.$route.query.formStatus;
    // this.getMedicalHistory();
    this.initData(this.elderId);
  },
  methods: {
    /*添加过往病历*/
    getMedicalHistory (str) {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/exams",
          { searchKey: this.searchName },
          null,
          "get"
        )
        .then(res => {
          this.illOption = res.data.map(val => {
            return {
              label: val.name,
              value: val.pinyin
            };
          });
          let zd;
          console.log(this.form);
          if (this.formStatus === 0) {
            zd = this.form.checkoutMedical
              ? this.form.checkoutMedical
              : "" + this.form.checkinMedical
                ? this.form.checkinMedical
                : "";
          } else {
            zd = this.form.checkoutMedical;
          }
          this.medicalCurrent = zd ? zd.split(",") : [];
        });
    },
    // 根据老人ID获取离院小结
    initData (elderId) {
      axios
        .fetch("elderServer", "/elderCheckoutForm/get/byElderId", {
          elderId
        })
        .then(res => {
          console.log(res);
          this.form = Object.assign({}, this.form, res.data);
          this.getMedicalHistory();
        });
    },
    submitForm () {
      if (!this.form.checkoutDate) {
        let message =
          this.form.formType === 0 ? "请填写出院日期" : "请填写死亡日期";
        this.$message.warning(message);
        return false;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.checkoutMedical = this.medicalCurrent.join(",");
          console.log(this.form);
          axios
            .fetch("elderServer", "/elderCheckoutForm/submit", this.form)
            .then(res => {
              this.$message.success("保存成功");
              this.$emit("changeActiveName", "离院交接");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel () {
      this.$router.go(-1);
    },
    handleClose (tag) {
      this.medicalCurrent.splice(this.medicalCurrent.indexOf(tag), 1);
    }
  }
};
</script>

<style lang="less" scoped>
.sum-form {
  width: 70%;
  display: flex;
  justify-content: center;
  p {
    text-align: center;
    line-height: 88px;
    font-size: 24px;
    font-weight: 600;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
