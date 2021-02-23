<template>
  <div class="content">
    <el-row gutter="20px">
      <el-col :span="4">
        <elderInfo :elder="elder"></elderInfo>
      </el-col>
      <el-col :span="20" style="padding-left:10px;height:100%;border-left:1px solid #F2F2F2;min-height:550px;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="tab1">
            <el-alert title type="error" :closable="false" v-if="form.id==null || form.status ==0">
              <template slot="title">
                该长者健康档案尚未建立，请及时完善记录
                <el-button type="primary" @click="addDocument" style="margin-left:16px">开始创建</el-button>
              </template>
            </el-alert>
            <el-form label-width="120px" size="mini" class="static-item">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="民族">
                    <span>{{elder.nation}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="籍贯">
                    <span>{{elder.birthPlace}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="出生日期">
                    <span>{{elder.birthDay}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="婚姻状况">
                    <span>{{elder.marriage}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="身份证号">
                    <span>{{elder.cardNo}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="住址">
                    <span>{{elder.residenceAddress}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="职业">
                    <span>{{form.job}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="医保情况">
                    <span>{{form.insurance}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="工作单位">
                    <span>{{form.companyName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="供史人">
                    <span>{{form.displayInfoProvider}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="可靠程度">
                    <span>{{form.infoConfidence}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人">
                    <span>{{elder.contact}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话">
                    <span>{{elder.telephone}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="form.id">
                <el-col :span="20">
                  <el-form-item label="过敏药物">
                    <el-input v-model="form.allergicMedicine" clearable placeholder="请输入过敏药物" maxlength="50" show-word-limit :disabled="!editable">
                      <el-button slot="append" icon="iconfont iconsave-fill edit" @click="updateAllergic" v-if="editable==true"></el-button>
                      <el-button slot="append" icon="el-icon-edit edit" @click="editable=true" v-else></el-button>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="医嘱信息" name="tab2" :disabled="!form.id">
            <elderAdvice :elder="elder" v-if="activeName=='tab2'"></elderAdvice>
          </el-tab-pane>
          <el-tab-pane label="病史记录" name="tab3" :disabled="!form.id">
            <record :elder="elder" :document="form" v-if="activeName=='tab3'"></record>
          </el-tab-pane>
          <el-tab-pane label="查房记录" name="tab4" :disabled="true"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import elderInfo from "./elderInfo";
import record from "./record";
import elderAdvice from "./elderAdvice";

export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      editable: false,
      examForm: { docs: [] },
      dialogExamVidible: false,
      exams: [],
      activeName: "tab1",
      elderId: null,
      elder: {},
      rules: {
        examOrg: [
          {
            required: true,
            message: "请输入体检单位",
            trigger: ["blur", "change"],
          },
        ],
        examDate: [
          {
            required: true,
            message: "请选择体检日期",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  watch: { $route: "init" },
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.elderId = this.$route.query.elderId;
      this.activeName = "tab1";
      this.form = {};
      axios
        .fetch("medicalServer", "/api/elder/" + this.elderId, null, null, "get")
        .then((res) => {
          this.elder = res.data;
          this.elder.avatar = this.elder.name.substr(0, 1);
        });

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
            this.form = res.data;
          }
        });
    },
    addDocument() {
      this.$router.push({
        path: "/medical/health/document/edit",
        query: {
          elderId: this.elderId,
          id: this.form.id,
        },
      });
    },
    updateAllergic() {
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/allergic/" + this.form.id,
          "allergicMedicine=" + this.form.allergicMedicine,
          null
        )
        .then((res) => {
          this.$message.success("保存成功");
          this.editable = false;
        });
    },
  },
  components: { elderInfo, record, elderAdvice },
};
</script>
<style scoped>
/deep/ .view .view-item {
  margin-bottom: 0px;
}
.tip {
  padding: 8px;
  border-left: 5px solid #409eff;
  margin: 8px 0;
  background-color: rgba(250, 250, 250, 1);
  display: flex;
}
.tip h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0px;
}
.exam-item {
  padding: 0px;
  margin: 0px;
  margin-top: 6px;
  display: flex;
  vertical-align: top;
  cursor: pointer;
}
.exam-delete {
  color: red;
  margin: 6px 0px 0px 8px;
}
.exam-icon {
  color: rgba(63, 152, 255, 1);
  font-size: 2em;
  margin: 0;
  padding: 0;
}
/deep/ .el-card__body {
  padding: 6px;
}
/deep/ .iconsave-fill {
  font-size: 20px;
}
/deep/ i.edit {
  margin-left: 10px;
}
.static-item .el-form-item,
.static-item .el-form-item--mini.el-form-item,
.static-item .el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
</style>