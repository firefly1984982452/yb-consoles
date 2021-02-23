<template>
  <div>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="left" :span="3">
          <el-button type="primary" icon="el-icon-plus" @click="addTemplate()">新增{{category.name}}</el-button>
        </el-col>
        <el-col class="right" :span="4" offset="17">
          <el-input v-model="searchData.search_LIKES_name" clearable :placeholder="templateName()" @change="search">
            <el-button slot="append" icon="el-icon-search" @click="search" style="width:40px"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="listData" border class="ub-table">
        <el-table-column prop="name" :label="templateName()" align="left" min-width="80"></el-table-column>
        <el-table-column prop="content" label="主诉" min-width="150" align="left" v-if="category.type==41"></el-table-column>
        <el-table-column prop="diagnosis" label="诊断" min-width="150" align="left" v-if="category.type==41"></el-table-column>
        <el-table-column prop="pinyin" label="助记码" min-width="40" v-if="category.type==31"></el-table-column>
        <el-table-column prop="price" label="诊疗价格(元)" min-width="40" v-if="category.type==31"></el-table-column>
        <el-table-column prop="subType" label="类型" min-width="40" v-if="category.type==31"></el-table-column>
        <el-table-column prop="unit" label="单位" min-width="40" v-if="category.type==31"></el-table-column>
        <el-table-column prop="content" label="现病史" min-width="350" align="left" v-if="category.type==21"></el-table-column>
        <el-table-column prop="sortId" label="排序" min-width="40"></el-table-column>
        <el-table-column label="操作" min-width="60">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="editTemplate(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="top" content="删除">
              <el-popconfirm confirmButtonText='确定' @onConfirm="deleteTemplate(scope.row)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此类型？">
                <el-button slot="reference" icon="iconfont iconcaozuotubiao-shanchu-xuanfu danger" size="mini"></el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog title="新增/编辑模板" :visible.sync="dialogTemplateFormVisible" v-if="dialogTemplateFormVisible" :close-on-click-modal="false" width="1000px" :append-to-body="true" top="10vh">
      <el-form :model="form" :label-position="left" :rules="rules" ref="ruleForm" label-width="120px" class="edit-form">
        <el-form-item :label="templateName()" prop="name">
          <el-input clearable v-model.trim="form.name" placeholder="16字以内" maxlength="16" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="主诉" prop="content" v-if="category.type==41">
          <el-input type="textarea" rows="3" clearable v-model.trim="form.content" placeholder="" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="现病史" prop="history" v-if="category.type==41">
          <el-input clearable type="textarea" rows="5" v-model.trim="form.history" placeholder="" maxlength="250" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="体检情况" prop="" v-if="category.type==41">
          <el-row gutter="1">
            <el-col :span="5">
              <el-input v-model.trim="form.temperature" placeholder="体温" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="prepend">T</template>
                <template slot="append">℃</template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model.trim="form.pulseRate" placeholder="脉搏" oninput="value=value.replace(/[^\d]/g,'')">
                <template slot="prepend">P</template>
                <template slot="append">次/分</template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model.trim="form.respirationRate" placeholder="呼吸频率" oninput="value=value.replace(/[^\d]/g,'')">
                <template slot="prepend">R</template>
                <template slot="append">次/分</template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model.trim="form.pressureHign" placeholder="高压" oninput="value=value.replace(/[^\d]/g,'')">
                <template slot="prepend">BP</template>
                <template slot="append">/</template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model.trim="form.pressureLow" placeholder="低压" oninput="value=value.replace(/[^\d]/g,'')">
                <template slot="append">mmHg</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="" prop="remark" v-if="category.type==41">
          <el-input clearable type="textarea" rows="2" v-model.trim="form.remark" placeholder="体检描述" maxlength="250" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="诊断" prop="diagnosis" v-if="category.type==41">
          <el-input type="textarea" rows="3" clearable v-model.trim="form.diagnosis" placeholder="" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="处理意见" prop="advise" v-if="category.type==41">
          <el-input clearable type="textarea" rows="5" v-model.trim="form.advise" placeholder="" maxlength="250" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="拼音码" prop="pinyin" v-if="category.type==31">
          <el-input clearable v-model.trim="form.pinyin" placeholder="拼音助记码" maxlength="16" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="诊疗价格" prop="price" v-if="category.type==31">
          <el-input clearable v-model.trim="form.price" placeholder="">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="类型" prop="subType" v-if="category.type==31">
          <el-radio-group v-model.trim="form.subType">
            <el-radio v-for="item in subTypes" :label="item" :key="item">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单位" prop="unit" v-if="category.type==31">
          <el-input clearable v-model.trim="form.unit" placeholder="如：次，件，支等">
          </el-input>
        </el-form-item>
        <el-form-item label="模板内容" prop="content" v-if="category.type==21">
          <el-input type="textarea" rows="10" clearable v-model.trim="form.content" placeholder="" maxlength="1024" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortId">
          <input class="el-input__inner" clearable v-model.trim="form.sortId" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="从大到小排列，可以为小数">
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitTemplateForm()">确 定</el-button>
        <el-button @click="dialogTemplateFormVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="项目参数" :visible.sync="dialogOptionsVisible" :close-on-click-modal="false" width="800px" v-if="dialogOptionsVisible" :destroy-on-close="true">
      <editOption v-model="optionParent"></editOption>
      <span slot="footer" class="right">
        <span>双击行进行修改，点保存按扭完成修改</span>
        <el-button @click="dialogOptionsVisible = false;fetchData();">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { axios } from "youban-utils";
import editOption from "./editOption";
import qs from "qs";

export default {
  data() {
    let that = this;
    return {
      dialogFormVisible: false,
      dialogTemplateFormVisible: false,
      dialogOptionsVisible: false,
      optionTitle: "",
      listData: [],
      dataCount: 0,
      form: {},
      optionParent: {},
      sign: "",
      category: {},
      diagnosisList: [],
      typeNames: {
        "21": "模板",
        "31": "诊疗项目",
        "41": "病历模板",
        "51": "处方模板"
      },
      subTypes: ["检查", "治疗", "材料"],
      rules: {
        name: [
          {
            required: true,
            message: "请输入描述类别",
            trigger: ["blur", "change"]
          }
        ],
        sortId: [
          {
            required: true,
            message: "请输入排序",
            trigger: ["blur", "change"]
          }
        ],
        content: [
          {
            required: true,
            message: "请输入",
            trigger: ["blur", "change"]
          }
        ],
        diagnosis: [
          {
            required: true,
            message: "请输入诊断",
            trigger: ["blur", "change"]
          }
        ],
        history: [
          {
            required: true,
            message: "请输入现病史",
            trigger: ["blur", "change"]
          }
        ],
        subType: [
          {
            required: true,
            message: "请选择类型",
            trigger: ["blur", "change"]
          }
        ]
      },
      searchData: {
        pageSize: 10,
        pageIndex: 1
      }
    };
  },
  components: { editOption },
  mounted() {},
  created() {
    let type = this.$route.query.type;
    this.category.type = type;
    this.category.name = this.typeNames[type];
    this.fetchData();
  },
  methods: {
    search() {
      this.changePage(1);
    },
    reset() {
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    fetchData() {
      let that = this;
      axios
        .fetch(
          "medicalServer",
          "/api/template/page/" + this.category.type + "/0",
          this.searchData,
          "form",
          "get"
        )
        .then(res => {
          that.listData = res.data;
          that.dataCount = res.total;
        });
    },
    edit(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.dialogFormVisible = true;
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    submitForm() {
      let that = this;
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return true;
        } else {
          let data = qs.stringify();
          let created = !this.form.id;
          axios
            .fetch("medicalServer", "/api/category/1", this.form, "json")
            .then(res => {
              var msg = "";
              if (created) {
                msg = "修改成功";
              } else {
                msg = "添加成功";
              }
              this.$message.success(msg);
              this.fetchData();
              this.dialogFormVisible = false;
            });
        }
      });
    },
    deleteData(data) {
      axios
        .fetch(
          "medicalServer",
          "/api/category/1/" + data.id,
          null,
          null,
          "delete"
        )
        .then(res => {
          this.$message.success("删除成功！");
          this.fetchData();
        });
    },
    editTemplate(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.dialogTemplateFormVisible = true;
    },
    addTemplate() {
      this.form = {};
      this.dialogTemplateFormVisible = true;
    },
    submitTemplateForm() {
      let that = this;
      if (this.form.diagnosisIds && this.form.diagnosisIds.length > 0) {
        let temp = ",";
        for (var i in this.form.diagnosisIds) {
          temp += this.form.diagnosisIds[i] + ",";
        }
        this.form.content = temp;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return true;
        } else {
          let created = !this.form.id;
          axios
            .fetch(
              "medicalServer",
              "/api/template/" + this.category.type,
              this.form,
              "json"
            )
            .then(res => {
              var msg = "";
              if (created) {
                msg = "修改成功";
              } else {
                msg = "添加成功";
              }
              this.$message.success(msg);
              this.fetchData();
              this.dialogTemplateFormVisible = false;
            });
        }
      });
    },
    deleteTemplate(data) {
      axios
        .fetch(
          "medicalServer",
          "/api/template/" + this.category.type + "/" + data.id,
          null,
          null,
          "delete"
        )
        .then(res => {
          this.$message.success("删除成功！");
          this.fetchData();
        });
    },
    editOptions(data) {
      data.type = this.category.type;
      this.optionParent = data;
      this.dialogOptionsVisible = true;
    },
    templateName() {
      return this.category.name + "名称";
    }
  }
};
</script>
<style scoped>
.el-input >>> .el-input-group__append,
.el-input >>> .el-input-group__prepend {
  padding: 8px;
}
</style>