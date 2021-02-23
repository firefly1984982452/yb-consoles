<template>
  <div>
    <div>
      <el-row type="flex" class="pannel">
        <el-col :span="12" class="left">
          <el-radio-group v-model="page">
            <el-radio-button label="病程录"></el-radio-button>
            <el-radio-button label="入院记录"></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :sapn="12" class="right">
          <el-button type="primary" @click="add" icon="el-icon-plus" v-if="page=='病程录'">新增病程录</el-button>
          <el-button type="primary" @click="editDocument" icon="el-icon-edit-outline" v-if="page=='入院记录' && canEditDocument ">编辑</el-button>
          <el-button type="primary" @click="printDocument" icon="el-icon-printer" v-if="page=='入院记录' && viewUrl ">打印</el-button>
        </el-col>
      </el-row>
      <div v-show="page=='病程录'">
        <el-table :data=" listData" border class="ub-table" ref="recordTable">
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column prop="createTime" label="记录日期" min-width="100">
            <template slot-scope="scope">
              {{scope.row.createTime}}
              <el-tag v-if="scope.row.type==2">首次</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="doctorName" label="记录医生" align="center" min-width="30"></el-table-column>
          <el-table-column label="操作" align="left" min-width="60">
            <template slot-scope="scope">
              <el-button @click="printRecord(scope.row)" icon="iconfont iconcaozuotubiao-dayin" size="mini" :class="{'printed':scope.row.printTime}"></el-button>
              <el-button @click="view(scope.row)" icon="iconfont iconcaozuotubiao-chakan" size="mini"></el-button>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="!scope.row.printTime">
                <el-button @click="edit(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" placement="top" content="删除" v-if="!scope.row.printTime && scope.row.type!=2">
                <el-popconfirm confirmButtonText="确定" @onConfirm="deleteData(scope.row)" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="确认删除此记录？">
                  <i slot="reference" class="el-icon-delete-solid danger" style="font-size:18px;margin-left:8px" />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 10px;">
          <el-col :span="4">
            <el-checkbox true-label="1" false-label="0" v-model="selectAllRecord" @change.native.stop="selectAll" style="margin-left:12px;margin-right:16px;"></el-checkbox>
            <el-button size="small" @click="printRecords" icon="el-icon-printer">批量打印</el-button>
          </el-col>
          <el-col :span="20">
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
          </el-col>
        </el-row>
      </div>
      <div v-show="page=='入院记录'" style="margin:0 auto;text-align:center">
        <iframe id="printIframe" style="display:none"></iframe>
        <iframe name="pdfDocument" :src="viewUrl" allowtransparency="true" allow="fullscreen" style="min-height:800px;overflow:auto;width:920px;height:100%;" frameborder="0" border="0" v-if="viewUrl"></iframe>
        <span v-else>没有生成健康档案！</span>
      </div>
    </div>

    <el-dialog title="病程录" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :close-on-click-modal="false" width="800px">
      <el-row class="record-header">
        <el-col :span="6">
          <span>姓名</span>
          <span>{{elder.name}}</span>
        </el-col>
        <el-col :span="6">
          <span>性别</span>
          <span>{{elder.gender}}</span>
        </el-col>
        <el-col :span="6">
          <span>年龄</span>
          <span>{{elder.age}}</span>
        </el-col>
        <el-col :span="6">
          <span>入院日期</span>
          <span>{{elder.checkinDate}}</span>
        </el-col>
      </el-row>

      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
        <el-row v-if="form.type==1">
          <el-col :span="8">
            <el-form-item label="一般情况">
              <el-select v-model="form.basic" placeholder="请选择" filterable>
                <el-option v-for="item in options.basic" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="T">
              <el-input v-model="form.temperature" clearable oninput="value=value.replace(/(\d*\.\d).*/g,'$1')" placeholder="体温"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="P">
              <el-input v-model="form.pulseRate" clearable oninput="value=value.replace(/[^\d]/g,'')" placeholder="脉搏"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.type==1">
          <el-col :span="8">
            <el-form-item label="R">
              <el-input v-model="form.respirationRate" clearable oninput="value=value.replace(/[^\d]/g,'')" placeholder="呼吸率"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="BP">
              <el-input v-model.trim="form.pressureHign" placeholder="高压" oninput="value=value.replace(/[^\d]/g,'')">
                <template slot="append">/</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" label-width="0">
              <el-input v-model.trim="form.pressureLow" placeholder="低压" oninput="value=value.replace(/[^\d]/g,'')">
                <template slot="append">mmHg</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.type==1">
          <el-col :span="8">
            <el-form-item label="胃纳">
              <el-select v-model="form.appetite" placeholder="请选择" filterable>
                <el-option v-for="item in options.appetite" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="睡眠">
              <el-select v-model="form.sleep" placeholder="请选择" filterable>
                <el-option v-for="item in options.sleep" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="两便">
              <el-select v-model="form.defecation" placeholder="请选择" filterable>
                <el-option v-for="item in options.defecation" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.type==1">
          <el-col :span="8">
            <el-form-item label="心律">
              <el-select v-model="form.heartRhythm" placeholder="请选择" filterable>
                <el-option v-for="item in options.heartRhythm" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="两肺">
              <el-select v-model="form.lungs" placeholder="请选择" filterable>
                <el-option v-for="item in options.lungs" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="腹部">
              <el-select v-model="form.abdomen" placeholder="请选择" filterable>
                <el-option v-for="item in options.abdomen" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="right" style="margin-bottom:8px;">
            <el-select v-model="template" placeholder="请选择模板" filterable value-key="id" @change="templateChanged">
              <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-form-item label="其它描述" prop="detail" v-if="form.type==1">
          <el-input type="textarea" rows="3" v-model.trim="form.detail" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="病程录" prop="content" v-if="form.type==2">
          <el-input type="textarea" rows="10" v-model.trim="form.content" maxlength="500" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog center :visible.sync="printVisible" v-if="printVisible" :close-on-click-modal="false" width="206mm" append-to-body>
      <printRecord :elder="elder" :document="document" :records="records" :tenantName="tenantName" @close="printVisible=false;fetchData()"></printRecord>
    </el-dialog>

    <el-dialog title="病程录详情" :visible.sync="viewVisible" v-if="viewVisible" :close-on-click-modal="false" width="600px" append-to-body>
      <el-form :model="form" label-width="100px" class="static-item">
        <el-form-item label="病程录内容" prop="content">
          {{form.content}}
        </el-form-item>
        <el-form-item label="记录日期" prop="content">
          {{form.createTime}}
        </el-form-item>
        <el-form-item label="记录医生" prop="content">
          {{form.doctorName}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="right">
        <el-button @click="viewVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";
import settings from "@/settings";
import printRecord from "./printRecord.vue";
import pdf from "vue-pdf";

export default {
  data() {
    let that = this;
    return {
      page: "病程录",
      dialogFormVisible: false,
      printVisible: false,
      viewVisible: false,
      templateList: [],
      template: {},
      listData: [],
      dataCount: 0,
      viewUrl: null,
      options: {},
      document: {},
      records: [],
      tenantName: "",
      selectAllRecord: 0,
      form: {},
      rules: {
        content: [
          {
            required: true,
            message: "请输入病程录",
            trigger: ["blur", "change"],
          },
        ],
      },
      searchData: {
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  props: ["elder", "document"],
  computed: {
    canEditDocument: function () {
      let user = axios.getCurrentUser();
      return this.document.doctorId == user.userId && !this.document.printTime;
    },
  },
  watch: {
    elder: "init",
    document: "getViewUrl",
  },
  mounted() {},
  components: { printRecord },
  created() {
    axios
      .fetch("medicalServer", "/api/template/list/21/0", null, null, "get")
      .then((res) => {
        this.templateList = res.data;
      });
    axios
      .fetch("medicalServer", "/api/base/tenant-name", null, null, "get")
      .then((res) => {
        this.tenantName = res.data;
      });
    axios
      .fetch(
        "medicalServer",
        "/api/health-document-app/options",
        null,
        null,
        "get"
      )
      .then((res) => {
        this.options = res.data;
      });
    this.init();
  },
  methods: {
    init() {
      this.searchData.search_EQI_elderId = this.elder.id;
      this.fetchData();
      this.getViewUrl();
    },
    getViewUrl() {
      this.viewUrl = null;
      if (this.document.id) {
        let user = axios.getCurrentUser();

        if (this.document.uuid) {
          this.viewUrl =
            settings.servers["medicalServer"] +
            "/api/health-document/view/" +
            this.document.uuid +
            "?authToken=" +
            user.id +
            "#toolbar=0&view=FitH,top";
        }
      }
    },
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
          "/api/health-record/page",
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          that.listData = res.data;
          that.dataCount = res.total;
        });
    },
    add() {
      this.form = { content: "", type: 1 };
      this.template = {};
      this.dialogFormVisible = true;
    },
    edit(data) {
      if (data.type == 1) {
        axios
          .fetch(
            "medicalServer",
            "/api/health-document-app/record/" + data.id,
            null,
            null,
            "get"
          )
          .then((res) => {
            debugger;
            this.form = res.data;
            this.form.type = data.type;
            this.dialogFormVisible = true;
          });
      } else {
        this.form = JSON.parse(JSON.stringify(data));
        this.dialogFormVisible = true;
      }
    },
    view(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.viewVisible = true;
    },
    submitForm() {
      let that = this;
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          return true;
        } else {
          let created = !this.form.id;
          if (this.form.type == 1) {
            axios
              .fetch(
                "medicalServer",
                "/api/health-document-app/record/" + this.elder.id,
                this.form,
                "json"
              )
              .then((res) => {
                var msg = "";
                if (!created) {
                  msg = "修改成功";
                } else {
                  msg = "添加成功";
                }
                this.$message.success(msg);
                this.fetchData();
                this.dialogFormVisible = false;
              });
          } else {
            axios
              .fetch("medicalServer", "/api/health-record", this.form, "json")
              .then((res) => {
                var msg = "";
                if (!created) {
                  msg = "修改成功";
                } else {
                  msg = "添加成功";
                }
                this.$message.success(msg);
                this.fetchData();
                this.dialogFormVisible = false;
              });
          }
        }
      });
    },
    deleteData(data) {
      axios
        .fetch(
          "medicalServer",
          "/api/health-record/" + data.id,
          null,
          null,
          "delete"
        )
        .then((res) => {
          this.$message.success("删除成功！");
          this.fetchData();
        });
    },
    templateChanged(item) {
      this.form.detail = item.content;
    },
    editDocument() {
      this.$router.push({
        path: "/medical/health/document/edit",
        query: {
          elderId: this.elder.id,
          id: this.id,
        },
      });
    },
    printDocument() {
      // window.frames.pdfDocument.print();
      let iframeSr = this.viewUrl + "&t=" + new Date().valueOf();
      let that = this;
      $.ajax({
        url: iframeSr,
        xhrFields: { responseType: "arraybuffer" },
        type: "GET",
        success: function (response) {
          //保存打印时间
          if (!that.document.printTime) {
            axios
              .fetch(
                "medicalServer",
                "/api/health-document/print/" + that.document.id,
                null,
                null,
                "get"
              )
              .then((res) => {
                that.document.printTime = 1;
                that.$forceUpdate();
              });
          }
          var blob = new Blob([response], { type: "application/pdf" });
          window.URL.createObjectURL(blob);
          $("#printIframe").attr("src", window.URL.createObjectURL(blob));
          setTimeout(() => {
            $("#printIframe")[0].contentWindow.print();
            window.URL.revokeObjectURL(blob);
          }, 100);
        },
      });
    },
    printRecord(data) {
      this.records = [];
      this.records.push(data);
      this.printVisible = true;
    },
    printRecords() {
      this.records = [];
      this.records.push(...this.$refs.recordTable.selection.reverse());
      if (this.records.length == 0) {
        this.$message.error("请至少选择一条病程录");
      } else {
        this.printVisible = true;
      }
    },
    selectAll() {
      this.$refs.recordTable.clearSelection();
      if (this.selectAllRecord == 0) {
      } else {
        this.$refs.recordTable.toggleAllSelection();
      }
    },
  },
};
</script>
<style type="text/css" media="print">
* {
  -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
  color-adjust: exact !important; /*Firefox*/
}
<style scoped > .name {
  display: inline-block;
  vertical-align: top;
}
.name p {
  margin: 0px;
  padding: 0px;
  height: 18px;
}
.record-header {
  padding: 0px 20px 20px 20px;
}
.record-header .el-col :nth-child(1) {
  margin-right: 8px;
}
.record-header .el-col :nth-child(2) {
  font-weight: 700;
}
.printed {
  color: rgb(199, 199, 199);
}
.record {
  width: 100%;
}
.static-item .el-form-item,
.static-item .el-form-item--mini.el-form-item,
.static-item .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>