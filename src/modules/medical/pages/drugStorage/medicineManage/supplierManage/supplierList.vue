<template>
  <div>
    <el-form ref="searchData" :inline="true" class="search" :model="searchData">
      <el-form-item label="供应商名称" label-width="100px">
        <el-input v-model="searchData.search_LIKES_partnerName" placeholder="请输入供应商名称" clearable @change="search"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
      <el-button type @click="reset()" icon="el-icon-refresh-right">重置</el-button>
    </el-form>

    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col :span="24" class="right">
          <el-button type="primary" icon="el-icon-plus" @click="add()">新增供应商</el-button>
        </el-col>
      </el-row>
      <el-table ref="multipleTable" :data="listData" border class="ub-table">
        <el-table-column label="供应商ID" prop="id" min-width="40" align="left"></el-table-column>
        <el-table-column label="供应商名称" prop="partnerName" min-width="100" align="left"></el-table-column>
        <el-table-column label="联系人" prop="contactName" min-width="50" align="left"></el-table-column>
        <el-table-column label="联系电话" prop="contactPhone" min-width="60" align="left"></el-table-column>
        <el-table-column label="供应商类型" min-width="30">
          <template slot-scope="scope">
            <span v-if="scope.row.partnerType==1">供应商</span>
            <span v-if="scope.row.partnerType==2">生产商</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="30">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">启用</span>
            <span v-if="scope.row.status==0">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button size="mini" class="lookta" @click="edit(scope.row)">
                <i class="iconfont iconcaozuotubiao-bianji"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status==1" class="item" effect="dark" content="禁用" placement="top-end">
              <el-button size="mini" class="lookta" @click="changeStatus(scope.row)">
                <i class="iconfont iconcaozuotubiao-tingyong-xuanfu"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status==0" class="item" effect="dark" content="启用" placement="top-end">
              <el-button size="mini" class="lookta" @click="changeStatus(scope.row)">
                <i class="iconfont iconcaozuotubiao-qiyong-zhengchang"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="changePage" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="dataCount"></el-pagination>
    </div>

    <el-dialog title="新增/编辑供应商" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false" width="600px">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" prop="partnerName">
              <el-input v-model="form.partnerName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型" prop="partnerType">
              <el-radio-group v-model="form.partnerType">
                <el-radio v-for="item in suppliers" :key="item.id" :label="item.id">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="form.contactName" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" maxlength="11" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="联系地址" prop="contactAddress">
              <el-input v-model="form.contactAddress" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogNoticeVisible" v-if="dialogNoticeVisible" width="500px">
      <el-row>
        <el-col :span="24">
          <p style="text-align:center">{{notice}}</p>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNoticeVisible = false">取 消</el-button>
        <el-button type="primary" @click="doChangeStatus()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      searchData: {
        pageSize: 10,
        pageIndex: 1,
      },
      dialogFormVisible: false,
      dialogNoticeVisible: false,
      suppliers: [
        {
          id: 1,
          name: "供应商",
        },
        {
          id: 2,
          name: "生产商",
        },
      ],
      listData: [],
      dataCount: "",
      form: {},
      id: null,
      status: null,
      notice: null,
      rules: {
        partnerName: [
          {
            required: true,
            message: "请输入名称",
            trigger: ["blur", "change"],
          },
        ],
        partnerType: [
          {
            required: true,
            message: "请选择类型",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    changePage(num) {
      this.searchData.pageIndex = num;
      this.fetchData();
    },
    fetchData() {
      axios
        .fetch("medicalServer", "/api/partner/page", this.searchData)
        .then((res) => {
          this.listData = res.data;
          this.dataCount = res.total;
        });
    },
    search() {
      this.changePage(1);
    },
    reset() {
      this.searchData = { pageSize: 10, pageIndex: 1 };
      this.fetchData();
    },
    edit(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.dialogFormVisible = true;
    },
    add() {
      this.form = { partnerType: 1 };
      this.dialogFormVisible = true;
    },
    changeStatus(data) {
      this.id = data.id;
      this.dialogNoticeVisible = true;
      if (data.status === 0) {
        this.status = 1;
        this.notice = "确定要将" + "【" + data.partnerName + "】" + "启用吗？";
      } else {
        this.status = 0;
        this.notice = "确定要将" + "【" + data.partnerName + "】" + "禁用吗？";
      }
    },
    doChangeStatus() {
      axios
        .fetch(
          "medicalServer",
          "/api/partner/" + this.id + "/" + this.status,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.fetchData();
          this.dialogNoticeVisible = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return true;
        } else {
          axios
            .fetch("medicalServer", "/api/partner", this.form, "json")
            .then((res) => {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.fetchData();
              this.dialogFormVisible = false;
            });
        }
      });
    },
  },
};
</script>