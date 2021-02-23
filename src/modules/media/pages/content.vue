<template>
  <div class="media">
    <!-- 搜索区域 -->
    <el-form :inline="true" class="search">
      <el-form-item label="所属专辑" prop="albumId">
        <el-select v-model="searchForm.albumId" clearable placeholder="请选择">
          <el-option v-for="item in categoryOptions" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容类型">
        <el-select v-model="searchForm.contentType" clearable placeholder="请选择">
          <el-option v-for="item in contentOptions" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有效">
        <el-select v-model="searchForm.enabled" clearable placeholder="请选择">
          <el-option v-for="item in isOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-row style="line-height:56px;">
        <el-button type="success" style="float:right;margin-bottom:12px;" @click="add">单个新增</el-button>
        <el-button type="primary" style="margin-right:12px;float:right;margin-bottom:12px;" @click="addAll">批量上传图片
        </el-button>
      </el-row>
      <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column label="ID" prop="id" min-width="20"></el-table-column>
        <el-table-column label="所属专辑" min-width="50" prop="albumId">
          <template slot-scope="scope">
            {{ scope.row.albumId | categoryFilter }}
          </template>
        </el-table-column>
        <el-table-column label="类型" min-width="20" prop="contentType">
          <template slot-scope="scope">
            {{ scope.row.contentType | contentTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="缩略图" min-width="30" prop="iconUrl">
          <template slot-scope="scope">
            <img style="width:48px;height:48px;" :src="scope.row.iconUrl" alt="" srcset="" />
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="100" prop="description"></el-table-column>
        <el-table-column label="是否有效" min-width="20" prop="enabled">
          <template slot-scope="scope">
            {{ scope.row.enabled | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="显示顺序" min-width="20" prop="dispIndex"></el-table-column>
        <el-table-column label="修改时间" min-width="40" prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button @click="edit(scope.row)" size="mini" icon="iconfont iconcaozuotubiao-bianji"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
              <el-button v-if="scope.row.enabled" @click="drag(scope.row)" size="mini" icon="iconfont iconcaozuotubiao-shanchu-xuanfu">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 添加/编辑专辑 -->
    <el-dialog title="添加/编辑内容" :visible.sync="centerDialogVisible" width="60%" center>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-position="right" label-width="120px" style="width:85%">
        <el-row>
          <el-form-item label="所属专辑" prop="albumId">
            <el-select clearable v-model="addForm.albumId" placeholder="请选择" @change="handleChange">
              <el-option v-for="item in albumOption" :label="item.label" :value="item.value" :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="描述" prop="description">
            <el-col>
              <el-input clearable maxlength="50" show-word-limit v-model="addForm.description" placeholder="请输入">
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item label="是否有效" prop="enabled">
                <el-select clearable v-model="addForm.enabled" placeholder="请选择">
                  <el-option v-for="item in isOptions" :label="item.label" :value="item.value" :key="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="内容时长(秒)" prop="contentTime">
                <el-input clearable v-model.number="addForm.contentTime" placeholder="请输入"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="展示时长(秒)" prop="displayTime">
                <el-input clearable v-model.number="addForm.displayTime" placeholder="请输入"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="显示顺序" prop="dispIndex">
                <el-input clearable v-model.number="addForm.dispIndex" placeholder="请输入"></el-input>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-form-item label="缩略图" prop="iconUrl">
                <ub-picture v-model="addForm.iconUrl" :height="160" :width="320"></ub-picture>
                <el-input clearable :maxlength="255" show-word-limit v-model.number="addForm.iconUrl" readonly ref="iconUrlInput" @dblclick.native="changeReadOnly('iconUrlInput')" placeholder="请输入或上传"></el-input>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <table style="width: 100%;margin: 0px;padding: 0px;border: none;border-spacing: 0px;">
          <tr>
            <td style="width:100%">
              <el-form-item label="内容类型" prop="contentType">
                <el-radio-group v-model="addForm.contentType">
                  <el-radio-button :disabled="item.disabled" v-for="(item, index) in templateOption" :key="index" :label="item.value">
                    {{ item.label }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
        </table>

        <el-row>
          <el-col :span="24">
            <!-- <el-form-item label="" prop="video" v-if="addForm.contentType==1">
              <el-input type="textarea" v-model="addForm.video" style="width:100%"
                placeholder="填写视频网站（如爱奇艺、优酷等）的视频通用分享代码" :rows="5" :maxlength=500 show-word-limit="true"></el-input>
            </el-form-item> -->
            <el-form-item label="资源内容" prop="mediaContent">
              <!-- <ub-picture v-model="addForm.mediaContent" accept=".mp4"></ub-picture> -->
              <template>
                <!-- <div v-for="(item,index) in contentOptions" :key="index"> -->
                <div v-if="addForm.contentType === 'video'">
                  <ubPictures :limit="1" :showDelete="true" @success="successLoad" v-model="contentObj[addForm.contentType]" :accept="'video/mp4'">
                  </ubPictures>
                  <el-input v-model="contentObj[addForm.contentType]" readonly ref="videoInput" @dblclick.native="changeReadOnly('videoInput')" :maxlength="1024" show-word-limit placeholder="请输入或上传"></el-input>
                </div>
                <div v-else-if="addForm.contentType === 'image'">
                  <ubPictures :limit="1" :showDelete="true" @success="successLoad" ref="picture" :span="6" v-model="contentObj[addForm.contentType]">
                  </ubPictures>
                  <el-input v-model="contentObj[addForm.contentType]" readonly ref="imageInput" @dblclick.native="changeReadOnly('imageInput')" :maxlength="1024" show-word-limit placeholder="请输入或上传"></el-input>
                </div>
                <el-input type="textarea" v-else-if="addForm.contentType === 'camera'" v-model="contentObj[addForm.contentType]" style="width:100%"
                  placeholder="请填写" :rows="5" :maxlength="1024" show-word-limit="true">
                </el-input>
                <textarea v-model="contentObj[addForm.contentType]" v-show="addForm.contentType === 'html'" id="editor" ref="editor" rows="5" cols="80"></textarea>
                <!-- </div> -->
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 批量上传 -->
    <el-dialog title="批量上传图片" :visible.sync="visible" width="60%" center>
      <el-form label-position="right" label-width="120px" style="width:85%">
        <el-form-item label="所属专辑">
          <el-select clearable v-model="albumId" placeholder="请选择">
            <el-option v-for="item in albumOptions" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <ubPictures @deleteImg="deleteImg" :limit="30" :showDelete="true" v-model="imageUrls" @success="successLoad" :span="6" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAll">保 存</el-button>
        <el-button @click="cancelAll">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import ubPicture from "@/components/picture";
import ubPictures from "@/components/pictures";
import settings from "@/settings";
var that;
export default {
  name: "Media",
  components: { ubPicture, ubPictures },
  data() {
    return {
      visible: false,
      categoryOptions: [],
      isOptions: [
        {
          value: true,
          label: "是",
        },
        {
          value: false,
          label: "否",
        },
      ],
      contentOptions: [
        {
          value: "link",
          label: "网页",
          category: [0,10],
          disabled: true,
        },
        {
          value: "html",
          label: "内容",
          category: [0,10],
          disabled: false,
        },
        {
          value: "image",
          label: "图片",
          category: [0,10],
          disabled: false,
        },
        {
          value: "audio",
          label: "音乐",
          category: [0,10],
          disabled: true,
        },
        {
          value: "video",
          label: "视频",
          category: [0,10],
          disabled: false,
        },
        {
          value: "camera",
          label: "摄像头",
          category: [-1],
          disabled: false,
        },
      ],
      contentObj: {
        link: "",
        html: "",
        image: "",
        audio: "",
        video: "",
        camera: "",
      },
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
        contentType: "",
        albumId: "",
        enabled: "",
      },
      addForm: {
        albumId: "",
        description: "",
        iconUrl: "",
        contentType: "image",
        contentLength: "",
        contentTime: 0,
        mediaContent: "",
        displayTime: 3,
        enabled: true,
        dispIndex: 0,
      },
      rules: {
        albumId: [
          { required: true, message: "请选择所属专辑", trigger: "change" },
        ],
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        contentType: [
          { required: true, message: "请选择内容类型", trigger: "change" },
        ],
        enabled: [{ required: true, message: "请选择", trigger: "change" }],
        // mediaContent: [{ required: true, message: "不能为空", trigger: "change" }],
        iconUrl: [
          { required: true, message: "请选择缩略图", trigger: "change" },
        ],
        contentLength: [
          { required: true, message: "请输入内容大小", trigger: "change" },
        ],
        contentTime: [
          { required: true, message: "请输入内容时长", trigger: "change" },
        ],
        displayTime: [
          { required: true, message: "请输入展示时长", trigger: "change" },
        ],
        dispIndex: [
          { required: true, message: "请输入显示顺序", trigger: "change" },
          { type: "number", message: "必须为数字值" },
        ],
      },
      addAllForm: [],
      albumId: "",
      imageUrls: "",
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      tableData: [],
      centerDialogVisible: false,
      templateOption: [],
      albumOption: [],
      albumOptions: [],
    };
  },
  watch: {
    "addForm.albumId"(newValue, oldValue) {
      const newCategoryObj = this.categoryOptions.filter(
        (item) => item.value === newValue
      )[0];
      const oldCategoryObj = this.categoryOptions.filter(
        (item) => item.value === oldValue
      )[0];
      const newCategory = newCategoryObj ? newCategoryObj.category : null;
      const oldCategory = oldCategoryObj ? oldCategoryObj.category : null;
      if (!this.addForm.id) {
        if (!oldValue && newCategory == -1) {
          this.addForm.contentType = "camera";
        }
        if (!oldValue && newCategory == 0) {
          this.addForm.contentType = "image";
        }
        if (newCategory !== oldCategory) {
          if (newCategory === -1) {
            this.addForm.contentType = "camera";
          } else {
            this.addForm.contentType = "image";
          }
        }
      }
    },
    "addForm.contentType"(newValue, oldValue) {
      console.log(this.addForm.mediaContent);
      if (newValue === 'html') {
        this.initCKEditor();
      } else {
        if (CKEDITOR.instances&&CKEDITOR.instances.editor) {
          CKEDITOR.instances.editor.destroy();
        }
      }
    },
    albumId(value) {
      this.addAllForm.forEach((item) => {
        item.albumId = value;
      });
    },
  },
  beforeCreate() {
    that = this;
  },
  filters: {
    statusFilter: (value) => {
      return value ? "是" : "否";
    },
    categoryFilter: (value) => {
      // return value === 0 ? "开心养老" : "监控列表";
      return that.categoryOptions.filter((v) => v.value === value)[0]
        ? that.categoryOptions.filter((v) => v.value === value)[0].label
        : "";
    },
    displayFilter: (value) => {
      return value ? "展示" : "不展示";
    },
    contentTypeFilter: (value) => {
      return that.contentOptions.filter((v) => v.value === value)[0].label;
    },
  },
  created() {
    this.searchForm.albumId = this.$route.query.albumId
      ? Number(this.$route.query.albumId)
      : "";
    this.initTableData(this.searchForm);
    this.$nextTick(() => {
      this.getAlbums();
    });
  },
  methods: {
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
            description: "资源内容",
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
        });
        editor.setData(that.contentObj.html);
        editor.on("change", function (event) {
          console.log(this.getData());
          that.contentObj.html = this.getData();
        });
      });
    },
    // 所属专辑值发生变化
    handleChange(value) {
      const category = this.categoryOptions.filter(
        (item) => item.value === value
      )[0].category;
      this.templateOption = this.contentOptions.filter(
        (item) => item.category.indexOf(category) !== -1
      );
    },
    // 获取相册专辑列表
    getAlbums() {
      axios.fetch("mediaServer", "/mediaAlbum/all").then((res) => {
        this.albumOption = this.categoryOptions = res.data.map((item) => {
          let obj = {};
          obj.value = Number(item.id);
          obj.label = item.title;
          obj.category = item.category;
          return obj;
        });
        this.albumOption.forEach(item => {
          if (item.category >= 0) {
            this.albumOptions.push(item);
          }
        });
      });
    },
    //
    initTableData(param) {
      axios
        .fetch("mediaServer", "/mediaResource/getResources", param)
        .then((res) => {
          this.tableData = res.data;
          this.totalPage = res.total;
        });
    },
    // 批量上传
    addAll() {
      this.$nextTick(() => {
        this.addAllForm = [];
        this.imageUrls = "";
        this.visible = true;
      });
    },
    // 点击添加按钮
    add() {
      if (this.$refs["addForm"] !== undefined) {
        this.$refs["addForm"].resetFields();
      }
      this.albumOption = this.categoryOptions;
      this.templateOption = [];
      this.resetAddFormData();
      this.centerDialogVisible = true;
    },
    // 添加/编辑保存
    save() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          this.addForm.mediaContent = this.contentObj[this.addForm.contentType];
          console.log(this.addForm.mediaContent);
          if (this.addForm.mediaContent) {
            if (!this.addForm.id) {
              // 保存
              axios
                .fetch(
                  "mediaServer",
                  "/mediaResource/add",
                  [this.addForm],
                  "json"
                )
                .then((res) => {
                  if (res.code == 200) {
                    this.$message.success("操作成功");
                    this.cancel();
                    this.initTableData(this.searchForm);
                  }
                });
            } else {
              // data.id = this.addForm.id;
              // 修改
              axios
                .fetch(
                  "mediaServer",
                  "/mediaResource/edit",
                  [this.addForm],
                  "json"
                )
                .then((res) => {
                  if (res.code == 200) {
                    this.$message.success(res.data);
                    this.cancel();
                    this.initTableData(this.searchForm);
                  }
                });
            }
          } else {
            this.$message.warning("资源内容不能为空");
          }
        }
      });
    },
    edit(data) {
      this.$nextTick(() => {
        this.addForm = Object.assign({}, this.addForm, data);
        const category = this.categoryOptions.filter(
          (item) => item.value === this.addForm.albumId
        )[0].category;
        this.templateOption = this.contentOptions.filter(
          (item) => item.category.indexOf(category) !== -1
        );
        this.albumOption = this.categoryOptions.filter(
          (item) => item.category === category
        );
        this.contentObj[this.addForm.contentType] = this.addForm.mediaContent;
      });
      this.centerDialogVisible = true;
    },
    // 作废
    drag(data) {
      this.$confirm("是否确认删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let param = {};
          param = Object.assign({}, param, data);
          param.enabled = false;
          axios
            .fetch("mediaServer", "/mediaResource/edit", [param], "json")
            .then((res) => {
              if (res.code == 200) {
                this.$message.success(res.data);
                this.initTableData(this.searchForm);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废",
          });
        });
    },
    // 取消保存
    cancel() {
      this.resetAddFormData();
      this.centerDialogVisible = false;
    },
    // 重置添加表单的数据
    resetAddFormData() {
      this.addForm = {
        albumId: "",
        description: "",
        iconUrl: "",
        contentType: "",
        contentLength: "",
        contentTime: 0,
        mediaContent: "",
        displayTime: 3,
        enabled: true,
        dispIndex: 0,
      };
      this.contentObj = {
        link: "",
        html: "",
        image: "",
        audio: "",
        video: "",
        camera: "",
      };
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.initTableData(this.searchForm);
    },
    // 查询
    searchInfo() {
      this.currentPage = this.searchForm.pageIndex = 1;
      this.initTableData(this.searchForm);
    },
    // 重置
    reset() {
      this.currentPage = 1;
      this.searchForm = {
        pageIndex: 1,
        pageSize: 10,
      };
      this.initTableData(this.searchForm);
    },
    successLoad(url, data) {
      // console.log(data, "===data");
      if (this.visible) {
        this.addAllForm.push({
          albumId: this.albumId,
          description: "",
          iconUrl: url,
          contentType: "image",
          contentLength: Number.parseInt(data.size / 1024),
          contentTime: 0,
          mediaContent: url,
          displayTime: 3,
          enabled: 1,
        });
      } else {
        this.addForm.contentLength = Number.parseInt(data.size / 1024);
      }
    },
    saveAll() {
      // console.log(this.addAllForm);
      if (!this.albumId) {
        this.$message.warning("请选择所属专辑");
        return false;
      } else if (!this.imageUrls) {
        this.$message.warning("请上传图片");
        return false;
      } else {
        axios
          .fetch("mediaServer", "/mediaResource/add", this.addAllForm, "json")
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(res.data);
              this.visible = false;
              this.imageUrls = "";
              this.albumId = "";
              this.addAllForm = [];
              this.initTableData(this.searchForm);
            }
          });
      }
    },
    cancelAll() {
      this.albumId = "";
      this.addAllForm = [];
      this.visible = false;
    },
    // 批量上传时 删除图片
    deleteImg(index) {
      this.addAllForm.splice(index, 1);
    },
    changeReadOnly(vn) {
      this.$refs[vn].readonly = false;
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-icon-error {
  position: absolute;
  top: 0;
  left: 148px;
  font-size: 20px;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
/deep/.el-form {
  .cke_contents  {
    height: 150px!important;
  }
}
</style>
