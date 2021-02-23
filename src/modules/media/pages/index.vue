<template>
  <div class="media">
    <!-- 搜索区域 -->
    <el-form :inline="true" class="search">
      <el-form-item label="专辑分类">
        <el-select v-model="searchForm.category" clearable placeholder="请选择">
          <el-option v-for="item in categoryOptions" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专辑标题">
        <el-input v-model="searchForm.title" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="大屏展示">
        <el-select v-model="searchForm.dispEnabled" clearable placeholder="请选择">
          <el-option v-for="item in displayOptions" :label="item.label" :value="item.value" :key="item.value">
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
        <el-button type="success" style="float:right;margin-bottom:12px;" @click="add">新增专辑</el-button>
      </el-row>
      <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border
        :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column label="ID" prop="id" min-width="80"></el-table-column>
        <el-table-column label="专辑分类" min-width="70" prop="category">
          <template slot-scope="scope">
            {{ scope.row.category | categoryFilter }}
          </template>
        </el-table-column>
        <el-table-column label="专辑标题" min-width="70" prop="title"></el-table-column>
        <el-table-column label="大屏展示" min-width="70" prop="dispEnabled">
          <template slot-scope="scope">
            {{ scope.row.dispEnabled | displayFilter }}
          </template>
        </el-table-column>
        <el-table-column label="显示顺序" min-width="50" prop="dispIndex"></el-table-column>
        <el-table-column label="是否有效" min-width="70" prop="enabled">
          <template slot-scope="scope">
            {{ scope.row.enabled | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" min-width="70" prop="updateTime">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button @click="edit(scope.row)" size="mini" icon="iconfont iconcaozuotubiao-bianji"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="内容" placement="top-end">
              <el-button v-if="scope.row.enabled" @click="content(scope.row)" size="mini" icon="iconfont iconcaozuotubiao-chakan"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
              <el-button v-if="scope.row.enabled" @click="drag(scope.row)" size="mini"
                icon="iconfont iconcaozuotubiao-shanchu-xuanfu">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10"
        layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 添加/编辑专辑 -->
    <el-dialog title="添加/编辑专辑" :visible.sync="centerDialogVisible" width="50%" center>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-position="right" label-width="85px"
        style="width:70%">
        <el-row>
          <el-form-item label="专辑分类" prop="category">
            <el-select :disabled="addForm.id" clearable v-model="addForm.category" placeholder="请选择">
              <el-option v-for="item in categoryOptions" :label="item.label" :value="item.value" :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="专辑标题" prop="title">
            <el-col>
              <el-input maxlength="10" clearable show-word-limit v-model="addForm.title" placeholder="请输入"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="描述" prop="description">
            <el-col>
              <el-input type="textarea" clearable maxlength="50" show-word-limit v-model="addForm.description" placeholder="请输入">
              </el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="封面图片" prop="iconUrl">
            <ub-picture v-model="addForm.iconUrl" description="封面图片"></ub-picture>
            <i v-if="addForm.iconUrl" class="el-icon-error" @click="deleteImg"></i>
            <el-input readonly ref="iconUrlInput" @dblclick.native="changeReadOnly('iconUrlInput')" maxlength="255" clearable show-word-limit v-model="addForm.iconUrl" placeholder="请输入或上传"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="大屏展示" prop="dispEnabled">
              <el-select v-model="addForm.dispEnabled" placeholder="请选择">
                <el-option v-for="item in displayOptions" :label="item.label" :value="item.value" :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有效" prop="enabled">
              <el-select v-model="addForm.enabled" placeholder="请选择">
                <el-option v-for="item in isOptions" :label="item.label" :value="item.value" :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="显示顺序" prop="dispIndex">
            <el-input v-model.number="addForm.dispIndex" clearable placeholder="请输入"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
var that;
import ubPicture from "@/components/picture";
export default {
  name: "Media",
  components: { ubPicture },
  data() {
    return {
      categoryOptions: [
        {
          value: 0,
          label: "开心养老",
        },
        {
          value: -1,
          label: "监控列表",
        },
      ],
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
      displayOptions: [
        {
          value: true,
          label: "展示",
        },
        {
          value: false,
          label: "不展示",
        },
      ],
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
        enabled: "",
        dispEnabled: "",
        category: "",
        title: "",
      },
      addForm: {
        category: "",
        title: "",
        description: "",
        iconUrl: "",
        dispEnabled: "",
        enabled: "",
        dispIndex: "",
      },
      rules: {
        category: [
          { required: true, message: "请选择专辑分类", trigger: "change" },
        ],
        title: [{ required: true, message: "请输入专辑标题", trigger: "change" }],
        dispEnabled: [{ required: true, message: "请选择", trigger: "change" }],
        enabled: [{ required: true, message: "请选择", trigger: "change" }],
        dispIndex: [
          { required: true, message: "请输入显示顺序", trigger: "change" },
          { type: "number", message: "必须为数字值" },
        ],
      },
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      tableData: [],
      centerDialogVisible: false,
    };
  },
  beforeCreate () {
    that = this;
  },
  filters: {
    statusFilter: (value) => {
      return value ? "是" : "否";
    },
    categoryFilter: (value) => {
      return that.categoryOptions.filter(item=>Number(value) === Number(item.value))[0].label;
    },
    displayFilter: (value) => {
      return value ? "展示" : "不展示";
    },
  },
  created() {
    this.getOptionData();
    this.initTableData(this.searchForm);
  },
  methods: {
    // 从字典获取<长者请假事由>
    getOptionData() {
      axios
        .fetch("commonServer", "/dict/getItemViewsByParentNo", {
          parentNos: '媒体资源专辑分类'
        })
        .then(res => {
          this.categoryOptions = res.data.map(item=>{
            let obj = {};
            obj.value = Number(item.itemValue);
            obj.label = item.title;
            return obj;
          })
        });
    },
    initTableData(param) {
      axios.fetch("mediaServer", "/mediaAlbum/getAlbums", param).then((res) => {
        this.tableData = res.data;
        this.totalPage = res.total;
      });
    },
    // 点击添加按钮

    add() {
      if (this.$refs["addForm"] !== undefined) {
        this.$refs["addForm"].resetFields();
      }
      this.restAddFormData();
      this.centerDialogVisible = true;
    },
    // 添加/编辑保存
    save() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if (!this.addForm.id) {
            // 保存
            axios
              .fetch("mediaServer", "/mediaAlbum/add", this.addForm, "json")
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
              .fetch("mediaServer", "/mediaAlbum/edit", this.addForm, "json")
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success(res.data);
                  this.cancel();
                  this.initTableData(this.searchForm);
                }
              });
          }
        }
      });
    },
    edit(data) {
      this.centerDialogVisible = true;
      this.$nextTick(()=>{
        this.addForm = Object.assign({}, this.addForm, data);
        this.addForm.category = Number(this.addForm.category);
      })
      // console.log(this.addForm);
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
            .fetch("mediaServer", "/mediaAlbum/edit", param, "json")
            .then((res) => {
              if (res.code == 200) {
                this.$message.success(res.data);
                //  this.centerDialogVisible = false;
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
      this.restAddFormData();
      this.centerDialogVisible = false;
    },
    restAddFormData(){
      this.addForm = {
        category: "",
        title: "",
        description: "",
        iconUrl: "",
        dispEnabled: true,
        enabled: true,
        dispIndex: 0,
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
    content(data) {
      this.$router.push({
        path: "/media/content",
        query: {
          albumId: data.id,
        },
      });
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
    deleteImg() {
      this.addForm.iconUrl = "";
    },
    changeReadOnly(vn) {
      this.$refs[vn].readonly = false;
    },
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
</style>
