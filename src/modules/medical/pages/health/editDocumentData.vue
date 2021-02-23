<template>
  <div class="content">
    <el-row gutter="20px">
      <el-col :span="4" style="border-right:1px solid #F2F2F2;">
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
        <el-row class="menus" :gutter="40">
          <el-col :span="8">
            <div class="item">
              <i class="iconfont iconjichutubiao-zhihuiyihu-jiankangdangan-bingshiqingkuang"></i>
              <div class="name">
                <p>病史情况</p>
                <p>
                  <el-button type="primary" @click="editData(2)" v-if="dataIds[0]==0">去完善</el-button>
                  <el-button type="success" icon="el-icon-check" @click="editData(2)" v-else>已完善</el-button>
                </p>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <i class="iconfont iconjichutubiao-zhihuiyihu-jiankangdangan-tigejiancha"></i>
              <div class="name">
                <p>体格检查</p>
                <p>
                  <el-button type="primary" @click="editData(3)" v-if="dataIds[1]==0">去完善</el-button>
                  <el-button type="success" icon="el-icon-check" @click="editData(3)" v-else>已完善</el-button>
                </p>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="item">
              <i class="iconfont iconjichutubiao-zhihuiyihu-jiankangdangan-shiyanshijiqixiejiancha"></i>
              <div class="name">
                <p>实验室及器械检查</p>
                <p>
                  <el-button type="primary" @click="editData(4)" v-if="dataIds[2]==0">去完善</el-button>
                  <el-button type="success" icon="el-icon-check" @click="editData(4)" v-else>已完善</el-button>
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="8" :span="8">
            <div class="item" style="border:none;text-align:center">
              <div style="transform: rotate(90deg);display:inline-block;">
                <i class="iconfont iconu224" style="font-size:36px;color:rgb(160 156 156);"></i>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="8" :span="8">
            <div class="item">
              <i class="iconfont iconruyuanxiaojie"></i>
              <div class="name">
                <p>入院小结</p>
                <p>
                  <el-button disabled v-if="dataIds[1]==0 || dataIds[2]==0 || dataIds[3]==0">请先完善病史体检项目</el-button>
                  <el-button type="success" @click="editSummary()" v-else>编辑完善</el-button>
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="footer center">
          <el-button @click="back">上一步</el-button>
          <el-button type="primary" @click="nextStep()">下一步</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="体格检查" :close-on-click-modal="false" :visible.sync="dialogFromVisible3" v-if="dialogFromVisible3" width="1200px" :destroy-on-close="true" :append-to-body="true">
      <el-form label-position="top" :model="formData" inline="true" ref="ruleForm" validate-on-rule-change="false" class="templateForm">
        <el-row gutter="8">
          <el-col :span="4">
            <div class="categories">
              <div v-for="tag in templates" :key="tag.id" class="category" :class="{active:tagId ==tag.id}" @click="tagChanged(tag.id,tag.c[0].id)">
                <span>{{tag.k}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div v-for="tag in templates" :key="tag.id">
              <div class="categories" v-if="tagId == tag.id">
                <div v-for="category in tag.c" :key="category.id" class="category" :class="{active:categoryId ==category.id}" @click="categoryId=category.id">
                  <span>{{category.k}}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <div v-for="tag in templates" :key="tag.id">
              <div v-if="tagId ==tag.id">
                <div v-for="category in tag.c" :key="category.id">
                  <div class="templates" v-if="categoryId==category.id">
                    <div v-for="template in category.c" :key="template.id">
                      <el-form-item :label="template.k" v-if="template.inputType==6">
                        <el-input clearable v-model.trim="template.v[0]" placeholder maxlength="40" show-word-limit></el-input>
                        <span class="unit" v-if="template.u">{{template.u}}</span>
                      </el-form-item>
                      <el-form-item :label="template.k" v-if="template.inputType==7">
                        <el-input type="textarea" rows="6" clearable v-model.trim="template.v[0]" placeholder maxlength="250" show-word-limit></el-input>
                        <span class="unit" v-if="template.u">{{template.u}}</span>
                      </el-form-item>
                      <el-form-item :label="template.k" v-if="template.inputType==1">
                        <el-select v-model.trim="template.v[0]" filterable default-first-option>
                          <el-option v-for="item in template.options" :key="item.k" :label="concatLableName(item.k,template.u)" :value="item.k"></el-option>
                        </el-select>
                        <span class="unit" v-if="template.u">{{template.u}}</span>
                      </el-form-item>
                      <el-form-item :label="template.k" v-if="template.inputType==2">
                        <el-select v-model.trim="template.v" multiple filterable default-first-option>
                          <el-option v-for="item in template.options" :key="item.k" :label="concatLableName(item.k,template.u)" :value="item.k"></el-option>
                        </el-select>
                        <span class="unit" v-if="template.u">{{template.u}}</span>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="submitForm()">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="titleName" :close-on-click-modal="false" :visible.sync="dialogFromVisible" v-if="dialogFromVisible" width="1100px" :destroy-on-close="true" :append-to-body="true">
      <el-form label-position="top" :model="formData" ref="ruleForm" validate-on-rule-change="false" class="templateForm">
        <el-row gutter="8">
          <el-col :span="7">
            <div class="categories">
              <div v-for="category in templates" :key="category.id" class="category" :class="{active:categoryId ==category.id}" @click="categoryId=category.id">
                <span>{{category.k}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="17">
            <div v-for="category in templates" :key="category.id">
              <div class="templates" v-if="categoryId==category.id">
                <div v-for="template in category.c" :key="template.id">
                  <el-form-item :label="template.k" v-if="template.inputType==6">
                    <el-input clearable v-model.trim="template.v[0]" placeholder maxlength="40" show-word-limit></el-input>
                    <span class="unit" v-if="template.u">{{template.u}}</span>
                  </el-form-item>
                  <el-form-item :label="template.k" v-if="template.inputType==7">
                    <el-input type="textarea" rows="6" clearable v-model.trim="template.v[0]" placeholder maxlength="250" show-word-limit></el-input>
                    <span class="unit" v-if="template.u">{{template.u}}</span>
                  </el-form-item>
                  <el-form-item :label="template.k" v-if="template.inputType==1">
                    <el-select v-model.trim="template.v[0]" filterable default-first-option>
                      <el-option v-for="item in template.options" :key="item.k" :label="concatLableName(item.k,template.u)" :value="item.k"></el-option>
                    </el-select>
                    <span class="unit" v-if="template.u">{{template.u}}</span>
                  </el-form-item>
                  <el-form-item :label="template.k" v-if="template.inputType==2">
                    <el-select v-model.trim="template.v" multiple filterable default-first-option>
                      <el-option v-for="item in template.options" :key="item.k" :label="concatLableName(item.k,template.u)" :value="item.k"></el-option>
                    </el-select>
                    <span class="unit" v-if="template.u">{{template.u}}</span>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="submitForm()">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="小结" :close-on-click-modal="false" :visible.sync="dialogSummaryVisible" v-if="dialogSummaryVisible" width="800px" :destroy-on-close="true" :append-to-body="true">
      <el-form :model="summaryForm" ref="summaryForm" :rules="rules">
        <el-row>
          <el-col :span="24">
            <span>对象：{{elder.name}}，{{elder.gender}}，{{elder.age}}岁，</span>
            <el-form-item label="" label-width="0" prop="admissionDate" style="display: inline-block;">
              <el-date-picker v-model.trim="summaryForm.admissionDate" type="date" placeholder="选择入院日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:200px">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span>因　</span>
            <el-form-item label="" label-width="0" prop="admissionReason" style="display: inline-block;">
              <el-input v-model.trim="summaryForm.admissionReason" clearable placeholder="请输入原因" maxlength="50" show-word-limit style="width: 600px;"></el-input>
            </el-form-item>
            <span>　入院</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="" label-width="0" prop="admissionSummary">
              <el-input type="textarea" rows="10" v-model.trim="summaryForm.admissionSummary" clearable placeholder="请输入小结" maxlength="500" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="3">
            <el-button type="success" @click="autoFill">自动生成小结</el-button>
          </el-col>
          <el-col :span="21">
            <el-button @click="dialogSummaryVisible=false">取 消</el-button>
            <el-button type="primary" @click="submitSummary()">保 存</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import elderInfo from "./elderInfo";
export default {
  data() {
    return {
      activeStatus: 1,
      tagId: null,
      categoryId: null,
      dialogFromVisible: false,
      dialogFromVisible3: false,
      dialogSummaryVisible: false,
      templates: {},
      type: null,
      form: {},
      formData: {},
      summaryForm: { admissionSummary: "", admissionReason: "" },
      elderId: null,
      elder: {},
      id: null,
      titleName: "",
      dataIds: [0, 0, 0],
      admissionDate: null,
      rules: {
        admissionDate: [
          {
            required: true,
            message: "请选择入院日期",
            trigger: ["blur", "change"],
          },
        ],
        admissionReason: [
          {
            required: true,
            message: "请填写原因",
            trigger: ["blur", "change"],
          },
        ],
        admissionSummary: [
          {
            required: true,
            message: "请填写小结",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    hasData2() {
      return this.dataIds[0] == 0;
    },
    hasData3() {
      return this.dataIds[1] == 0;
    },
    hasData4() {
      return this.dataIds[2] == 0;
    },
  },
  watch: {},
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.elderId = this.$route.query.elderId;
      this.id = this.$route.query.id;
      let that = this;
      axios
        .fetch("medicalServer", "/api/elder/" + this.elderId, null, null, "get")
        .then((res) => {
          this.elder = res.data;
          this.elder.avatar = this.elder.name.substr(0, 1);
        });
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/form-data/" + this.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          let resData = res.data;
          for (var i in resData) {
            this.$set(that.dataIds, resData[i].type - 2, resData[i].id);
          }
        });
      this.getSummary();
    },
    submitForm() {
      let data = {
        documentId: this.id,
        type: this.type,
        id: this.dataIds[this.type - 2],
        data: this.templates,
      };
      axios
        .fetch("medicalServer", "/api/health-document/data", data, "json")
        .then((res) => {
          this.$message.success("保存成功");
          this.dataIds[this.type - 2] = res.data;
          this.dialogFromVisible = false;
          this.dialogFromVisible3 = false;
        });
    },
    submitSummary() {
      this.$refs.summaryForm.validate((valid) => {
        if (!valid) {
          return true;
        } else {
          axios
            .fetch(
              "medicalServer",
              "/api/health-document/save-summary/" + this.id,
              this.summaryForm,
              "json"
            )
            .then((res) => {
              this.$message.success("保存成功");
              this.getSummary();
              this.dialogSummaryVisible = false;
            });
        }
      });
    },
    editData(type) {
      this.type = type;
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/form/" + this.id + "/" + type,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.templates = res.data;
          if (type == 3) {
            this.dialogFromVisible3 = true;
            this.tagId = this.templates[0].id;
            this.categoryId = this.templates[0].c[0].id;
          } else {
            if (this.templates.length > 0) {
              this.categoryId = this.templates[0].id;
            }
            if (type == 2) {
              this.titleName = "病史情况";
            } else if (type == 4) {
              this.titleName = "实验室及器械检查";
            }
            this.dialogFromVisible = true;
          }
        });
    },
    getSummary() {
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/" + this.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          let summaryForm = res.data;
          this.admissionDate = summaryForm.admissionDate;
          if (!summaryForm.admissionDate) {
            summaryForm.admissionDate = this.elder.checkinDate;
          }
          if (!summaryForm.admissionReason) {
            summaryForm.admissionReason = this.elder.checkinRemark || "";
          }
          if (!summaryForm.admissionSummary) {
            summaryForm.admissionSummary = "";
          }
          this.summaryForm = summaryForm;
        });
    },
    editSummary() {
      this.getSummary();
      this.dialogSummaryVisible = true;
    },
    autoFill() {
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/summary/" + this.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.summaryForm.admissionSummary = res.data;
          this.$forceUpdate();
        });
    },
    cancelEdit() {
      this.dialogFromVisible = false;
      this.dialogFromVisible3 = false;
    },
    back() {
      this.$router.push({
        path: "/medical/health/document/edit",
        query: {
          elderId: this.elderId,
          id: this.id,
        },
      });
    },
    tagChanged(tagId, categoryId) {
      this.tagId = tagId;
      this.categoryId = categoryId;
    },
    nextStep() {
      if (
        this.dataIds[0] == 0 ||
        this.dataIds[1] == 0 ||
        this.dataIds[2] == 0
      ) {
        this.$message.error("请先完善入院病史");
      } else if (!this.admissionDate) {
        this.$message.error("请先完善入院小结");
      } else {
        this.$router.push({
          path: "/medical/health/document/diagnosis",
          query: {
            elderId: this.elderId,
            id: this.id,
          },
        });
      }
    },
    concatLableName(k, u) {
      return k;
    },
  },
  components: { elderInfo },
};
</script>
<style scoped>
.content {
  width: 100%;
  height: 350px;
}
.menus {
  width: 100%;
  height: 100%;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item {
  width: 240px;
  height: 124px;
  line-height: 124px;
  border: 1px solid #f1f3fe;
  text-align: left;
  vertical-align: middle;
  border-radius: 8px;
  cursor: pointer;
  padding-left: 16px;
  display: inline-block;
}
.item:focus,
.item:hover {
  border: 1px solid #d0d4ee;
}

.item i {
  font-size: 66px;
  vertical-align: middle;
  color: #38abff;
}
.item p {
  margin: 0px;
  padding: 0px;
  height: 18px;
}

.footer {
  margin-top: 20px;
}
.name {
  display: inline-block;
  vertical-align: top;
  line-height: 84px;
}
.name p {
  margin: 0px;
  padding: 2px;
  height: 25px;
}
.template-category {
  vertical-align: top;
  float: left;
  width: 200px;
}
.template-category span {
  width: 180px;
}
.templates {
  border: 1px solid #eeeeee;
  overflow: auto;
  height: 420px;
  padding: 8px;
}
.categories {
  height: 420px;
  border: 1px solid #eeeeee;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
}
.category {
  background-color: rgba(241, 244, 245, 1);
  margin: 4px 4px 4px 0px;
  padding: 6px;
  border-radius: 4px;
}
.active {
  background-color: rgba(142, 194, 255, 1);
}
.templateForm {
  min-height: 400px;
}

/deep/ .templateForm .el-form-item__label {
  font-weight: 700;
  padding: 0;
}
/deep/ .templateForm .el-form-item {
  margin-bottom: 0;
  width: 100%;
}
/deep/ .templateForm .el-select,
.templateForm .el-input,
.templateForm .el-textarea {
  width: 90%;
}
.unit {
  margin-left: 8px;
}
/deep/ .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
/deep/ .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>