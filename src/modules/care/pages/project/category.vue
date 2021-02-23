<template>
  <div class="category content">
    <!-- 明细--搜索区域 -->
    <el-form :inline="true" class="search">
      <el-form-item label="一级分类">
        <el-select v-model="searchForm.categoryType" placeholder="请选择" clearable>
          <el-option :label="item.title" :value="item.itemValue" v-for="item in categoryList" :key="item.itemId"></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
      <!-- <el-button style="float:right;background-color:#5b8ff9ff;color:#fff;" @click="add">添加</el-button> -->
      <el-button type="success" style="float:right;" icon="el-icon-plus" @click="add">添加</el-button>
    </el-form>
    <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
      <el-table-column label="一级分类" prop="categoryType" min-width="80"></el-table-column>
      <el-table-column label="二级分类" prop="categoryTitle" min-width="80"></el-table-column>
      <el-table-column label="同步终端" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.viewLeader">
            护理班长端
          </span>
          <span v-if="scope.row.viewLeader&&scope.row.viewCarer">/</span>
          <span v-if="scope.row.viewCarer">
            护理员端
          </span>
        </template>
      </el-table-column>
      <el-table-column label="登记方式" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.dataNumber">
            数量
          </span>
          <span v-if="scope.row.dataPeriod">
            消费周期
          </span>
          <span v-if="scope.row.dataAmount">
            金额
          </span>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="70" prop="count">
        <template slot-scope="scope">
          <span style="cursor:pointer;" @click="down(scope.row, scope.$index)">
            <i class="el-icon-bottom"></i>
          </span>
          <span style="cursor:pointer;color:#409EFF;" @click="up(scope.row, scope.$index)">
            <i class="el-icon-top"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="70" prop="status">
        <template slot-scope="scope">
          <span>
            {{ scope.row.status  | filterStatus}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button size="mini" @click="edit(scope.row)"><i class="iconfont iconcaozuotubiao-bianji"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="作废" placement="top-end">
            <el-button size="mini" @click="drag(scope.row)"><i class="iconfont iconcaozuotubiao-zuofei"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>

    <!-- 添加分类 -->
    <el-dialog :title="title" :visible.sync="centerDialogVisible" width="50%" center>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-position="right">
        <el-row :gutter="4">
          <el-col :span="8">
            <el-form-item label="一级分类" prop="categoryType" :label-width="formLabelWidth">
              <el-select value-key="item.categoryType" v-model="addForm.categoryType" placeholder="请选择一级分类">
                <el-option :label="item.title" :value="item.itemValue" v-for="item in categoryList" :key="item.itemId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="二级分类" prop="categoryTitle" :label-width="formLabelWidth">
              <el-input v-model.trim="addForm.categoryTitle" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="同步终端" :label-width="formLabelWidth">
          <el-checkbox v-model="addForm.viewLeader">护理班长端</el-checkbox>
          <el-checkbox v-model="addForm.viewCarer">护理员端</el-checkbox>
        </el-form-item>
        <el-form-item label="登记方式" :label-width="formLabelWidth">
          <el-row>
            <el-radio v-model="radio" label="1">数量</el-radio>
            <!-- <el-checkbox v-model="addForm.dataNumber" @change="countChange">数量</el-checkbox> -->
          </el-row>
          <el-row :gutter="100">
            <el-col :span="4">
              <el-radio v-model="radio" label="2">消费周期</el-radio>
              <!-- <el-checkbox v-model="dataPeriodFlag" @change="periodChange">消费周期</el-checkbox> -->
            </el-col>
            <el-col :span="20">
              <el-select v-model="addForm.dataPeriod" placeholder="请选择" :disabled="radio !== '2'">
                <el-option v-for="item in optionsDate" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>

          </el-row>
          <el-row>
            <el-radio v-model="radio" label="2">金额</el-radio>
            <!-- <el-checkbox v-model="addForm.dataAmount" @change="amountChange">金额</el-checkbox> -->
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Category",
  data() {
    return {
      radio: "1",
      dataPeriodFlag: "",
      optionsDate: [
        { label: "无默认", value: 1 },
        { label: "默认当天", value: 2 },
        { label: "默认上月", value: 3 },
        { label: "默认当月", value: 4 }
      ],
      title: "添加分类",
      centerDialogVisible: false,
      formLabelWidth: "80px",
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      addForm: {
        dataPeriod: null
      },
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      rules: {
        categoryTitle: [
          { required: true, message: "请输入分类名称", trigger: "change" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        categoryType: [
          { required: true, message: "请选择一级分类", trigger: "change" }
        ]
      },
      categoryList: [] // 收费项目
    };
  },
  components: {},
  created() {
    this.initTableData(this.searchForm);
    this.getOptionData();
  },
  filters: {
    viewFilter: function(value) {
      return value;
    },
    filterStatus(val) {
      return ["无效", "", "有效"][val + 1];
    }
  },
  methods: {
    // 从字典获取列表
    getOptionData() {
      let arr = ["收费项目"];
      axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: arr.join(",")
        })
        .then(res => {
          let data = res.data;
          this.categoryList = data.filter(
            item => item.itemGroup == "收费项目" && item.parentNo == "消费项"
          );
        });
    },
    initTableData(param) {
      axios.fetch("careServer", "/careCategory/all", param).then(res => {
        if (res.code == 200) {
          this.tableData = res.data;
          this.totalPage = res.total;
        }
      });
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
        pageSize: 10
      };
      this.initTableData(this.searchForm);
    },
    edit(data) {
      this.title = "编辑分类";
      this.addForm = Object.assign({}, this.addForm, data);
      this.radio = this.addForm.dataNumber ? "1" : "2";
      // this.dataPeriodFlag = this.addForm.dataPeriod == 0 ? false : true;
      this.addForm.dataPeriod =
        this.addForm.dataPeriod == 0 ? null : this.addForm.dataPeriod;
      this.centerDialogVisible = true;
    },
    // 作废
    drag(data) {
      this.$confirm("是否确认作废该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {};
          param = Object.assign({}, param, data);
          param.status = -1;
          axios
            .fetch("careServer", "/careCategory/edit", param, "json")
            .then(res => {
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
            message: "已取消作废"
          });
        });
    },
    // 点击添加按钮
    add() {
      if (this.$refs["addForm"] !== undefined) {
        this.$refs["addForm"].resetFields();
      }
      this.addForm = {
        viewLeader: false,
        viewCarer: false
      };
      this.radio = "1";
      console.log(this.addForm);
      this.title = "添加分类";
      this.centerDialogVisible = true;
    },
    // 添加/编辑保存
    save() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let data = {
            category: "消费项",
            categoryType: this.addForm.categoryType,
            categoryTitle: this.addForm.categoryTitle,
            dataNumber: this.radio == "1" ? true : false,
            dataAmount: this.radio == "2" ? true : false,
            dataPeriod:
              this.radio == "2" ? Number(+this.addForm.dataPeriod) : 0,
            viewLeader: this.addForm.viewLeader,
            viewCarer: this.addForm.viewCarer
          };
          if (
            this.radio == 2 &&
            (this.addForm.dataPeriod == null || this.addForm.dataPeriod == "")
          ) {
            this.$message.warning("请选择周期时间");
          } else {
            if (!this.addForm.id) {
              // 保存
              axios
                .fetch("careServer", "/careCategory/add", data, "json")
                .then(res => {
                  if (res.code == 200) {
                    this.$message.success("操作成功");
                    this.addForm = {};
                    this.centerDialogVisible = false;
                    this.initTableData(this.searchForm);
                  }
                });
            } else {
              data.id = this.addForm.id;
              // 修改
              axios
                .fetch("careServer", "/careCategory/edit", data, "json")
                .then(res => {
                  if (res.code == 200) {
                    this.$message.success(res.data);
                    this.addForm = {};
                    this.centerDialogVisible = false;
                    this.initTableData(this.searchForm);
                  }
                });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消保存
    cancel() {
      this.addForm = {};
      this.radio = null;
      this.centerDialogVisible = false;
    },
    // 排序函数
    async sortFn(param) {
      const res = await axios.fetch(
        "careServer",
        "/careCategory/despIndex",
        param
      );
      if (res.code == 200) {
        this.$message.success("操作成功");
      this.initTableData(this.searchForm);
      }
    },
    // 向下排序
    /**
     * 找不到下一条的情况有两种
     * 1 currentPage < totalPage时 说明是当前页的最后一条 需要查找下一页的第一条
     * 2 currentPage = totalPage时 说明是全部数据的最后一条
     */
    down(data, index) {
      const nextIndex = index + 1;
      const nextData = this.tableData[nextIndex];
      const totalPage = Math.ceil(this.totalPage / this.searchForm.pageSize);

      // if (this.currentPage == totalPage) {
      if (nextData) {
        const param = {
          oneId: data.id,
          oneDispIndex: data.dispIndex,
          twoId: nextData.id,
          twoDispIndex: nextData.dispIndex,
        };
              this.sortFn(param);
      } else {
        // 找不到下一条数据时
        if (this.currentPage == totalPage) {
          // currentPage = totalPage时
          // 说明是最后一条
          this.$message.warning("已经是最后一条数据");
        } else {
          // 需要去找下一页的第一条
          axios 
            .fetch("careServer", "/careCategory/all", {
              pageIndex: this.searchForm.pageIndex + 1,
              pageSize: this.searchForm.pageSize,
            })
            .then((res) => {
              const param = {
                oneId: data.id,
                oneDispIndex: data.dispIndex,
                twoId: res.data[0].id,
                twoDispIndex: res.data[0].dispIndex,
              };
              this.sortFn(param);
            });
        }
      }
      // }
    },
    // 向上排序
    up(data, index) {
      console.log(data)
      // 总页数
      const totalPage = Math.ceil(this.totalPage / this.searchForm.pageSize);
      const lastData = this.tableData[index - 1];
      if (!lastData) {
        // 没有找到上一条的情况
        if (this.currentPage == 1) {
          this.$message.warning("已经是第一条数据");
        } else {
          // 需要去找上一页的最后
          axios
            .fetch("careServer", "/careCategory/all", {
              pageIndex: this.searchForm.pageIndex - 1,
              pageSize: this.searchForm.pageSize,
            })
            .then((res) => {
              const param = {
                oneId: data.id,
                oneDispIndex: data.dispIndex,
                twoId: res.data[this.searchForm.pageSize - 1].id,
                twoDispIndex: res.data[this.searchForm.pageSize - 1].dispIndex,
              };
              this.sortFn(param);
            });
        }
      } else {
        const param = {
          oneId: data.id,
          oneDispIndex: data.dispIndex,
          twoId: lastData.id,
          twoDispIndex: lastData.dispIndex,
        };
              this.sortFn(param);
      }
    },
    
    // 数量 checkbox变化
    countChange(val) {
      console.log(val);
    },
    // 周期 checkbox变化
    periodChange(val) {
      console.log(val);
    },
    // 金额 checkbox变化
    amountChange(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
