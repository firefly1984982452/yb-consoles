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
        <el-row class="menus" gutter="50">
          <el-col :span="12">
            <el-card class="card-left">
              <div slot="header" class="clearfix">
                <span>初步诊断</span>
              </div>
              <el-card class="box-card" v-for="(item,index) in diagnosis.items" :key="item.n">
                <div slot="header" class>
                  <span>{{item.n}}</span>
                  <el-button style="float: right;margin-top: -10px; margin-right: 5px;color:grey;min-width: 10px;padding: 4px;" icon="el-icon-close" circle @click="deleteDiagnosis(index)"></el-button>
                </div>
                {{item.r}}
              </el-card>
              <div class="footer right">
                <el-button type="primary" icon="el-icon-plus" @click="addDiagnosis()">新增</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="card-right">
              <div slot="header" class="clearfix">
                <span>诊疗计划与建议</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="smartAdvise" v-if="advise.items.length==0">智能匹配</el-button>
              </div>
              <el-card class="box-card" v-for="(item, index) in advise.items" :key="item.n">
                <div slot="header" class>
                  <span>{{item.n}}</span>
                  <el-button style="float: right;margin-top: -10px; margin-right: 5px;color:grey;min-width: 10px;padding: 4px;" icon="el-icon-close" circle @click="deleteAdvise(index)"></el-button>
                </div>
                {{item.r}}
              </el-card>
              <div class="footer right">
                <el-button type="primary" icon="el-icon-plus" @click="addAdvise()">新增</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="footer center">
          <el-button @click="back">上一步</el-button>
          <el-button type="primary" @click="submitForm()">完 成</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="初步诊断" :close-on-click-modal="false" :visible.sync="dialogDiagnosisVidible" v-if="dialogDiagnosisVidible" width="600px" :destroy-on-close="true" :append-to-body="true">
      <el-form label-width="120px" :model="diagnosisForm" ref="diagnosisForm" :rules="rules" validate-on-rule-change="false" style="min-height:400px" @submit.native.prevent>
        <el-row>
          <el-col :span="24">
            <el-form-item label="疾病诊断" prop="name">
              <el-select v-model="diagnosisForm.name" allow-create value-key="id" :filter-method="doFilter" filterable placeholder="请选择" style="width:70%" @change="nameChanged">
                <el-option v-for="item in diagnosisList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
              <el-select v-if="secondList && secondList.length>0" v-model="diagnosisForm.name2" allow-create value-key="id" filterable placeholder="" style="width:20%">
                <el-option v-for="item in secondList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
              <el-input type="textarea" rows="8" clearable v-model.trim="diagnosisForm.remark" placeholder maxlength="250" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDiagnosisVidible = false">取 消</el-button>
        <el-button type="primary" @click="saveDiagnosis()">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="诊疗计划与建议" :close-on-click-modal="false" :visible.sync="dialogAdviseVidible" v-if="dialogAdviseVidible" width="600px" :destroy-on-close="true" :append-to-body="true">
      <el-form label-width="140px" :model="adviseForm" :rules="rules" ref="adviseForm" validate-on-rule-change="false" style="min-height:400px" @submit.native.prevent>
        <el-row>
          <el-col :span="24">
            <el-form-item label="诊疗计划与建议" prop="item">
              <el-select v-model="adviseForm.item" value-key="id" filterable placeholder="请选择" @change="adviseChanged">
                <el-option v-for="item in adviseList" :key="item.id" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remark">
              <el-input type="textarea" rows="8" clearable v-model.trim="adviseForm.remark" placeholder maxlength="250" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdviseVidible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdvise()">保 存</el-button>
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
      activeStatus: 2,
      diagnosises: [],
      dialogDiagnosisVidible: false,
      diagnosisList: [],
      diagnosisCopy: [],
      adviseList: [],
      dialogAdviseVidible: false,
      advise: { type: 11, items: [] },
      diagnosis: { type: 10, items: [] },
      diagnosisProps: {
        value: "id",
        label: "name",
        children: "options",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      secondList: [],
      rules: {
        item: [
          {
            required: true,
            type: "object",
            message: "请选择诊疗计划与建议",
            trigger: ["blur", "change"],
          },
        ],
        name: [
          {
            required: true,
            message: "请选择疾病诊断",
            trigger: ["blur", "change"],
          },
        ],
      },
      dialogFormVisible: false,
      form: {},
      diagnosisForm: {},
      adviseForm: { item: {}, remark: "" },
      elderId: null,
      elder: {},
      id: null,
    };
  },

  watch: {},
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    nameChanged(name) {
      this.secondList = [];
      for (var i = 0; i < this.diagnosisCopy.length; i++) {
        if (this.diagnosisCopy[i].name == name) {
          this.secondList = this.diagnosisCopy[i].options;
          break;
        }
      }
    },
    init() {
      this.elderId = this.$route.query.elderId;
      this.id = this.$route.query.id;
      axios
        .fetch("medicalServer", "/api/elder/" + this.elderId, null, null, "get")
        .then((res) => {
          this.elder = res.data;
          this.elder.avatar = this.elder.name.substr(0, 1);
        });
      axios
        .fetch("medicalServer", "/api/template/diagnosis", null, null, "get")
        .then((res) => {
          this.diagnosisList = res.data;
          this.diagnosisCopy = JSON.parse(JSON.stringify(res.data));
        });
      axios
        .fetch("medicalServer", "/api/template/advise", null, null, "get")
        .then((res) => {
          this.adviseList = res.data;
        });
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/diagnosis/" + this.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          let resData = res.data;
          for (var i in resData) {
            if (resData[i].type == 10) {
              this.diagnosis = resData[i];
            } else if (resData[i].type == 11) {
              this.advise = resData[i];
            }
          }
        });
    },
    doFilter(keyword) {
      this.diagnosisList = [];
      for (var i = 0; i < this.diagnosisCopy.length; i++) {
        var item = this.diagnosisCopy[i];
        if (
          item.name.indexOf(keyword) != -1 ||
          (item.pinyin && item.pinyin.indexOf(keyword) != -1)
        ) {
          this.diagnosisList.push(item);
        }
      }
      return false;
    },
    submitForm() {
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/finish/" + this.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          if (res.data) {
            this.$message.success("保存成功");
            this.$router.push({
              path: "/medical/health/document/detail",
              query: {
                elderId: this.elderId,
                id: this.id,
              },
            });
          } else {
            this.$message.error("请先完善入院病史");
          }
        });
    },
    back() {
      this.$router.push({
        path: "/medical/health/document/data",
        query: {
          elderId: this.elderId,
          id: this.id,
        },
      });
    },
    addDiagnosis() {
      this.diagnosisForm = {};
      this.diagnosisList = this.diagnosisCopy;
      this.dialogDiagnosisVidible = true;
    },
    deleteDiagnosis(index) {
      this.diagnosis.items.splice(index, 1);
      this.doSaveDiaglosis();
    },
    saveDiagnosis() {
      this.$refs.diagnosisForm.validate((valid) => {
        if (!valid) {
          return true;
        } else {
          let name = this.diagnosisForm.name;
          if (this.diagnosisForm.name2) {
            name += ":" + this.diagnosisForm.name2;
          }
          this.diagnosis.items.push({
            n: name,
            r: this.diagnosisForm.remark,
          });
          this.dialogDiagnosisVidible = false;
          this.doSaveDiaglosis();
          this.secondList = [];
        }
      });
    },
    doSaveDiaglosis() {
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/diagnosis/" + this.id,
          this.diagnosis,
          "json"
        )
        .then((res) => {
          this.$message.success("保存成功");
          this.init();
        });
    },
    addAdvise() {
      this.adviseForm = { remark: "" };
      this.dialogAdviseVidible = true;
    },
    deleteAdvise(index) {
      this.advise.items.splice(index, 1);
      this.doSaveAdvise();
    },
    saveAdvise() {
      this.$refs.adviseForm.validate((valid) => {
        if (!valid) {
          return true;
        } else {
          this.advise.items.push({
            n: this.adviseForm.item.name,
            r: this.adviseForm.remark,
          });
          this.dialogAdviseVidible = false;
          this.doSaveAdvise();
        }
      });
    },
    doSaveAdvise() {
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/diagnosis/" + this.id,
          this.advise,
          "json"
        )
        .then((res) => {
          this.$message.success("保存成功");
          this.init();
        });
    },
    adviseChanged(item) {
      this.adviseForm.remark = item.remark;
    },
    smartAdvise() {
      let diag = this.diagnosis.items;
      debugger;
      if (diag.length > 0) {
        let names = [];
        for (var i in diag) {
          names.push(diag[i].n.split(":")[0]);
        }
        var count = 0;
        for (var i in this.adviseList) {
          let temp = this.adviseList[i];
          if (this.contains(names, temp.content)) {
            this.advise.items.push({
              n: temp.name,
              r: temp.remark,
            });
            count++;
          }
        }
        if (count == 0) {
          this.$message.error("未匹配到合适的数据");
        } else {
          this.doSaveAdvise();
        }
      } else {
        this.$message.error("请先完善诊断数据");
      }
    },
    contains(names, content) {
      content = "," + content + ",";
      for (var i in names) {
        if (content.indexOf("," + names[i] + ",") != -1) {
          return true;
        }
      }
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
  margin-top: 20px;
  display: flex;
  justify-content: center;
  min-height: 400px;
  /* align-items: center; */
}
/deep/ .card-left .el-card__header {
  background-color: rgb(142, 194, 255);
}

/deep/ .card-right .el-card__header {
  background-color: rgb(42, 215, 179);
}
.menus .el-card {
  min-height: 350px;
}
/deep/ .box-card .el-card__header {
  background-color: rgb(241, 244, 245);
  border-bottom: none;
  padding: 16px 0 0 20px;
}
/deep/ .el-card .box-card {
  min-height: 50px;
  background-color: rgb(241, 244, 245);
  margin-bottom: 16px;
  font-size: 14px;
}

/deep/ .box-card .el-card__body {
  color: #76838f;
  font-size: 13px;
  padding: 4px 20px 4px 20px;
}
.diagnosis {
  width: 100%;
}
.el-cascader-panel .el-cascader-node,
.el-cascader-node,
.diagnosis .el-cascader-node {
  height: 60px !important;
  line-height: 20px;
}
.diagnosis .el-cascader-menu__list li {
  height: 60px !important;
  line-height: 20px;
}
/deep/ .diagnosis .el-cascader-node__label {
  height: 60px;
}
.option {
  font-weight: 700;
}
.option,
.pinyin {
  display: block;
  height: 20px;
  margin-bottom: 8px;
}
</style>
<style>
.diagnosis .el-cascader-node {
  height: 60px;
  line-height: 20px;
}

.diagnosis .el-cascader-node .el-radio {
  vertical-align: top;
  height: 50px;
}

.diagnosis .el-cascader-node__label {
  border-bottom: 1px dashed #eeeeee;
}
</style>