<template>
  <div class="app-container">
    <div class="filter-container">

      <div class="content">
        <el-row type="flex" class="pannel">
          <el-col :span="12">
            <div class="header">
              <h2>活动展示</h2>
            </div>
          </el-col>
          <el-col :span="12" class="right">
            <el-button type="primary" icon="el-icon-plus" @click="add()">添加</el-button>
          </el-col>
        </el-row>
        <el-table :data="listData" border class="ub-table">
          <el-table-column prop="title" label="标题" min-width="400" align="left"></el-table-column>
          <el-table-column prop="createUser" label="记录人" min-width="50"></el-table-column>
          <el-table-column prop="createTime" label="时间" min-width="80"></el-table-column>
          <el-table-column label="操作" min-width="50" class-name="operation">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="详情" placement=" top">
                <el-button @click="view(scope.row)" icon="iconfont iconcaozuotubiao-chakan" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button @click="edit(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" placement="top" content="删除">
                <el-popconfirm confirmButtonText='确定' @onConfirm="deleteData(scope.row)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此数据？">
                  <i slot="reference" class="el-icon-delete-solid danger" style="font-size:18px;margin-left:8px" />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>

      <el-dialog title="活动展示" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :close-on-click-modal="false" width="90%" :destroy-on-close="true">
        <el-form label-width="100px" :model="form" :rules="rules" ref="ruleForm" validate-on-rule-change="false">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="form.title" clearable placeholder="请输入标题" maxlength="36" show-word-limit></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="信息内容" prop="content">
                <textarea id="editor" ref="editor" rows="80" cols="80"></textarea>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="活动展示" :close-on-click-modal="false" :visible.sync="dialogViewFormVisible" v-if="dialogViewFormVisible" width="1020px" :destroy-on-close="true" class="notice-dialog">
        <showPreview v-model="id" ref="viewForm"></showPreview>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogViewFormVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import qs from "qs";
import { mapGetters } from "vuex";
import settings from "@/settings";
import showPreview from "./showPreview";
import axios from "axios";

export default {
  data() {
    let that = this;
    return {
      loading: false,
      dialogFormVisible: false,
      dialogViewFormVisible: false,
      listData: [],
      dataCount: 0,
      form: { content: "" },
      viewForm: {},
      id: null,
      searchData: {
        pageSize: 10,
        pageIndex: 1,
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: ["blur", "change"],
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: ["blur", "change"],
          },
        ],
        scopeToList: [
          {
            required: true,
            message: "请选择看板",
            trigger: ["blur", "change"],
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  components: { showPreview },
  computed: {
    ...mapGetters(["tenant", "user"]),
  },
  watch: {},
  filters: {},
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.fetchData();
    },
    search() {
      this.changePage(1);
    },
    reset() {
      this.searchData = {};
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
          "activityServer",
          "/api/project/show/page",
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          that.listData = res.data;
          that.dataCount = res.total;
        });
    },
    edit(data) {
      this.form = { content: "" };
      this.dialogFormVisible = true;
      axios
        .fetch(
          "activityServer",
          "/api/project/show/" + data.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.form = res.data;
          this.initCKEditor();
        });
    },
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return true;
        } else {
          axios
            .fetch("activityServer", "/api/project/show", this.form, "json")
            .then((res) => {
              this.$message.success("保存成功");
              this.fetchData();
              this.dialogFormVisible = false;
            });
        }
      });
    },
    add() {
      this.form = { content: "" };
      this.dialogFormVisible = true;
      this.initCKEditor();
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
    },
    view(data) {
      this.id = data.id;
      this.dialogViewFormVisible = true;
    },

    deleteData(data) {
      axios
        .fetch(
          "activityServer",
          "/api/project/show/" + data.id,
          null,
          null,
          "delete"
        )
        .then((res) => {
          this.$message.success("删除成功！");
          this.fetchData();
        });
    },
    initCKEditor() {
      let that = this;
      this.$nextTick(() => {
        let config = {};
        config.toolbar = [
          { name: "document", items: ["Source"] },
          {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "PasteText", "-", "Undo", "Redo"],
          },
          {
            name: "editing",
            items: ["Find", "Replace", "-", "SelectAll"],
          },
          {
            name: "basicstyles",
            items: [
              "Bold",
              "Italic",
              "Underline",
              "Strike",
              "Subscript",
              "Superscript",
              "-",
              "CopyFormatting",
              "RemoveFormat",
            ],
          },
          {
            name: "paragraph",
            items: [
              "NumberedList",
              "BulletedList",
              "-",
              "Outdent",
              "Indent",
              "-",
              "Blockquote",
              "CreateDiv",
              "-",
              "JustifyLeft",
              "JustifyCenter",
              "JustifyRight",
              "JustifyBlock",
              "-",
              "BidiLtr",
              "BidiRtl",
              "Language",
            ],
          },
          { name: "links", items: ["Link", "Unlink", "Anchor"] },
          {
            name: "insert",
            items: [
              "Image",
              "Video",
              "Table",
              "HorizontalRule",
              "Smiley",
              "SpecialChar",
              "PageBreak",
            ],
          },
          {
            name: "styles",
            items: ["Styles", "Format", "Font", "FontSize"],
          },
          { name: "colors", items: ["TextColor", "BGColor"] },
          { name: "tools", items: ["Maximize", "ShowBlocks"] },
        ];
        config.filebrowserImageUploadUrl = "http://wwww.baidu.com";
        config.allowedContent = true;
        config.extraPlugins = "video";
        config.language = "zh-cn";
        config.height = 800;
        CKEDITOR.plugins.addExternal(
          "video",
          "https://image.youbankeji.com/static/libs/ckeditor/4.15.0/plugins/video/plugin.js"
        );
        var editor = CKEDITOR.replace("editor", config);
        let token = axios.getCurrentUser().id;
        let uploadUrl = settings.servers["activityServer"] + "/api/doc/upload";
        that.uploadedUrl = "";
        editor.on("fileUploadRequest", async function (evt) {
          evt.stop();
          // 直接上传到阿里云
          let fileLoader = evt.data.fileLoader;
          let file = fileLoader.file;
          let res = await axios.fetch("commonServer", "/upload/getOssPolicy", {
            from: "web",
            description: "开心养老",
            fileName: file.name,
            mimeType: file.type,
            size: file.size,
          });
          let uploadPolicy = res.data;
          that.uploadedUrl = uploadPolicy.resourceUrl;
          let policy = uploadPolicy.policy;
          policy.success_action_status = "200";
          policy.file = file;
          let xhr = fileLoader.xhr;
          xhr.open("POST", uploadPolicy.uploadUrl, true);
          let formData = new FormData();
          Object.keys(policy).forEach((key) => {
            formData.append(key, policy[key]);
          });
          xhr.send(formData);
          /* var fileLoader = evt.data.fileLoader,
            formData = new FormData(),
            xhr = fileLoader.xhr;
          xhr.withCredentials = true;
          xhr.open("POST", uploadUrl, true);
          xhr.setRequestHeader("authToken", token);
          formData.append("file", fileLoader.file, fileLoader.fileName);
          xhr.send(formData);
          evt.stop(); */
        });
        editor.on("fileUploadResponse", function (evt) {
          evt.stop();
          let data = evt.data;
          let xhr = data.fileLoader.xhr;
          if (xhr.status != 200) {
            data.message = "上传失败";
            evt.cancel();
          } else {
            data.url = that.uploadedUrl;
          }
          /* evt.stop();
          var data = evt.data,
            xhr = data.fileLoader.xhr;
          var res = JSON.parse(xhr.responseText);
          if (res.code != 200) {
            data.message = res.msg;
            evt.cancel();
          } else {
            data.url =
              settings.servers["activityServer"] +
              "/api/doc/view/" +
              res.data.id;
          } */
        });
        editor.setData(that.form.content);
        editor.on("change", function (event) {
          that.form.content = this.getData();
        });
      });
    },
  },
};
</script>
<style scoped>
.article-content img {
  border: 0;
  display: inherit;
}
.header h2 {
  display: inline-block;
  margin-left: 8px;
  font-size: 18px;
}
</style>