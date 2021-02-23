<template>
  <div>
    <el-form label-width="100px" ref="ruleForm" :rules="rules" :model="form">
      <el-row>
        <el-col :span="24">
          <el-form-item label="奖励设置">
            <el-checkbox v-model="partake" :class="{'disabled':!partake}">每参与1场活动，奖励
              <el-input-number :controls="false" v-model="form.partakePoint" :step="1" step-strictly :disabled="!partake" :min="0" :max="999999" style="width:100px"></el-input-number>
              个积分
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="" prop="">
            <el-checkbox v-model="achive" :class="{'disabled': !achive}">每成功
              <el-input-number :controls="false" v-model="form.achiveScore" :disabled="!achive" :step="1" step-strictly :min="0" :max="999999" style="width:100px"></el-input-number>
              次，奖励
              <el-input-number :controls="false" v-model="form.achivePoint" :disabled="!achive" :step="1" step-strictly :min="0" :max="999999" style="width:100px"></el-input-number>
              个积分
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer left">
      <el-button type="primary" @click="submitForm()">保 存</el-button>
    </div>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";

export default {
  props: {
    projectId: {
      type: Number,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      form: {},
      partake: false,
      achive: false,
      id: null,
      rules: {
        job: [
          {
            required: true,
            message: "请选择职业",
            trigger: ["blur", "change"],
          },
        ],
        insurance: [
          {
            required: true,
            message: "请选择医保情况",
            trigger: ["blur", "change"],
          },
        ],
        infoProvider: [
          {
            required: true,
            message: "请选择供史人",
            trigger: ["blur", "change"],
          },
        ],
        infoConfidence: [
          {
            required: true,
            message: "请选择可靠程度",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  watch: {},
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      axios
        .fetch(
          "activityServer",
          "/api/project/config/" + this.projectId,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.form = res.data;
          if (this.form == null) {
            this.form = { projectId: this.projectId };
          } else {
            if (this.form.partakePoint) {
              this.partake = true;
            } else {
              this.partake = false;
            }
            if (this.form.achiveScore) {
              this.achive = true;
            } else {
              this.achive = false;
            }
          }
        });
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return true;
        } else {
          if (!this.partake) {
            this.form.partakePoint = 0;
          } else if (this.form.partakePoint == 0) {
            this.$message.error("参与积分不能小于1");
            return true;
          }
          if (!this.achive) {
            this.form.achiveScore = 0;
            this.form.achivePoint = 0;
          } else if (this.form.achiveScore == 0) {
            this.$message.error("成功次数不能小于1");
            return true;
          } else if (this.form.achivePoint == 0) {
            this.$message.error("奖励积分不能小于1");
            return true;
          }
          axios
            .fetch("activityServer", "/api/project/config", this.form, "json")
            .then((res) => {
              this.$message.success("保存成功");
              this.form.id = res.data;
            });
        }
      });
    },
  },
  components: {},
};
</script>
<style scoped>
.disabled,
/deep/ .disabled .el-input__inner {
  color: #dddddd;
}
</style>