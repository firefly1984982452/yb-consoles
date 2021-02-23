<template>
  <div class="content">
    <el-row gutter="20px">
      <el-col :span="4" style="border-right:1px solid #F2F2F2;min-height:500px;">
        <elderInfo :elder="elder"></elderInfo>
      </el-col>
      <el-col :span="20" style="padding-left:30px;height:100%">
        <div style="width:80%;margin:0 auto;">
          <el-steps :active="activeStatus" finish-status="success">
            <el-step title="基本信息" description="完善长者基本信息"></el-step>
            <el-step title="入院病史" description="完善长者入院前的病史记录"></el-step>
            <el-step title="诊断与计划" description="完善初步诊断与后续诊疗计划"></el-step>
          </el-steps>
        </div>
        <el-form label-width="120px" style="margin-top:20px" ref="ruleForm" :rules="rules" :model="form">
          <el-row>
            <el-form-item label="职业" prop="job">
              <el-radio-group v-model.trim="form.job">
                <el-radio v-for="(item,index) in jobs" :label="item" :key="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="工作单位">
                <el-input v-model=" form.companyName" clearable placeholder="请输入工作单位" maxlength="50" show-word-limit>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="医保情况" prop="insurance">
              <el-radio-group v-model.trim="form.insurance">
                <el-radio v-for="(item,index) in insurances" :label="item" :key="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="供史人" prop="infoProvider">
                <el-select v-model.trim="form.first" placeholder="选择第一供史人" clearable @change="updateProvider">
                  <el-option v-for="item in providers" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label label-width="8px">
                <el-select v-model.trim="form.second" placeholder="选择第二供史人" clearable @change="updateProvider">
                  <el-option v-for="item in providers" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label label-width="0">
                <el-input clearable v-model.trim="form.others" placeholder="输入其它供史人" maxlength="8" show-word-limit @change="updateProvider"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="可靠程度" prop="infoConfidence">
              <el-radio-group v-model.trim="form.infoConfidence">
                <el-radio v-for="(item,index) in confidences" :label="item" :key="index">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="过敏药物">
                <el-input v-model="form.allergicMedicine" clearable placeholder="请输入过敏药物" maxlength="50" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="住院号" prop="documentNo">
                <el-input clearable v-model.trim="form.documentNo" placeholder="如长者健康档案编号（住院号）与入院编号不一致，可在此填写" maxlength="16" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="footer center">
          <el-button @click="backToDetail">取 消</el-button>
          <el-button type="primary" @click="submitForm()">下一步</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import elderInfo from "./elderInfo";
export default {
  data() {
    return {
      activeStatus: 0,
      form: {},
      elderId: null,
      elder: {},
      id: null,
      jobs: ["退休", "无"],
      insurances: ["有医保", "无医保"],
      confidences: ["可靠", "欠可靠"],
      providers: [
        "本人",
        "妻子",
        "丈夫",
        "儿子",
        "女儿",
        "姐姐",
        "哥哥",
        "妹妹",
        "弟弟",
        "家属",
      ],
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
      this.elderId = this.$route.query.elderId;
      axios
        .fetch("medicalServer", "/api/elder/" + this.elderId, null, null, "get")
        .then((res) => {
          this.elder = res.data;
          this.elder.avatar = this.elder.name.substr(0, 1);
        });

      this.form = {};
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/elder/" + this.elderId,
          null,
          null,
          "get"
        )
        .then((res) => {
          if (res.data) {
            let form = res.data;
            let arr = form.infoProvider.split("、");
            form.first = arr[0];
            form.second = arr[1];
            form.others = arr[2];
            this.form = form;
          }
        });
    },
    updateProvider() {
      let infoProvider = "";
      if (this.form.first) {
        infoProvider += this.form.first;
      }
      infoProvider += "、";
      if (this.form.second) {
        infoProvider += this.form.second;
      }
      infoProvider += "、";
      if (this.form.others) {
        infoProvider += this.form.others;
      }
      infoProvider += "、";
      if (infoProvider.length == 3) {
        infoProvider = null;
      }
      this.form.infoProvider = infoProvider;
    },
    submitForm() {
      this.updateProvider();
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return true;
        } else {
          this.form.elderId = this.elderId;
          axios
            .fetch("medicalServer", "/api/health-document", this.form, "json")
            .then((res) => {
              this.$message.success("保存成功");
              this.id = res.data;
              this.$router.push({
                path: "/medical/health/document/data",
                query: {
                  elderId: this.elderId,
                  id: this.id,
                },
              });
            });
        }
      });
    },
    backToDetail() {
      this.$router.push({
        path: "/medical/health/document/detail",
        query: {
          elderId: this.elderId,
          id: this.id,
        },
      });
    },
  },
  components: { elderInfo },
};
</script>