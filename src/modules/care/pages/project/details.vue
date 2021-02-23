<template>
  <div class="details content">
    <!-- 明细--搜索区域 -->
    <el-form :inline="true" class="search">
      <el-form-item label="一级分类">
        <el-select v-model="searchForm.categoryType" placeholder="请选择" clearable>
          <el-option :label="item.title" :value="item.itemValue" v-for="item in categoryList" :key="item.itemId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物品名称">
        <el-input v-model="searchForm.goodsTitle" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
      <el-button type="success" style="float:right;" icon="el-icon-plus" @click="add">添加</el-button>
    </el-form>
    <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
      <el-table-column label="一级分类" prop="categoryType" min-width="80"></el-table-column>
      <el-table-column label="二级分类" prop="categoryTitle" min-width="80"></el-table-column>
      <el-table-column label="类型" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.goodsType | filterGoodsType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="物品名称" min-width="70" prop="goodsTitle"></el-table-column>
      <el-table-column label="单价(元)" min-width="70" prop="price"></el-table-column>
      <el-table-column label="单位" min-width="70" prop="priceUnit"></el-table-column>
      <el-table-column label="结算方式" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.accountType | filterAccountType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应模式" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.goodsFrom | filterGoodsFrom}}</span>
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
      <el-table-column label="状态" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.status | filterStatus}}</span>
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

    <!-- 添加 -->
    <el-dialog :title="title" :visible.sync="dialogEditVisible" center width="40%">
      <el-form :model="addInfo" :rules="rules" ref="addInfo" label-width="80px">
        <el-row>
          <el-col span="20">
            <el-form-item label="物品名称" prop="goodsTitle">
              <el-input v-model="addInfo.goodsTitle" placeholder="请输入物品名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="单位" prop="priceUnit">
              <el-select v-model="addInfo.priceUnit" placeholder="请选择单位">
                <el-option :label="item.title" :value="item.itemValue" v-for="item in unitList" :key="item.itemId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="单价" prop="price">
              <el-input style="width:50%" v-model="addInfo.price" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入单价"></el-input> 元
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="类型" prop="goodsType">
              <el-select v-model="addInfo.goodsType" placeholder="请选择类型">
                <el-option :label="item.title" :value="item.itemValue" v-for="item in goodsTypeList" :key="item.itemId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select style="width:45%" v-model="addInfo.categoryType" @change="getCategroryList('add')" placeholder="请选择分类">
                <el-option :label="item.title" :value="item.itemValue" v-for="item in categoryList" :key="item.itemId"></el-option>
              </el-select>
              <el-select prop="categoryId" style="width:45%" v-model="addInfo.categoryId" placeholder="请选择分类">
                <el-option :label="item.categoryTitle" :value="item.id" v-for="item in categoryList2" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="结算方式" prop="accountType">
              <el-select v-model="addInfo.accountType" placeholder="请选择结算方式">
                <el-option :label="item.title" :value="item.itemValue" v-for="item in accountTypeList" :key="item.itemId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="供应来源" prop="goodsFrom">
              <el-select v-model="addInfo.goodsFrom" placeholder="请选择供应来源">
                <el-option :label="item.title" :value="item.itemValue" v-for="item in goodsFromList" :key="item.itemId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="8">
            <el-form-item label="凭证" prop="evidence">
              <el-select v-model="addInfo.evidence" placeholder="请选择凭证">
                <el-option :label="item.title" :value="item.itemValue" v-for="item in evidenceList" :key="item.itemId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="resetForm">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
var that;
export default {
  name: "Details",
  data() {
    return {
      addInfo: {
        categoryType:null,
        goodsTitle: "",
        priceUnit: "",
        price: '',
        goodsType: "",
        categoryId1: "",
        categoryId: "",
        accountType: "",
        goodsFrom: "",
        evidence: ""
      },
      rules: {
        goodsTitle: [
          { required: true, message: "请输入物品名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        priceUnit: [
          { required: true, message: "请选择单位", trigger: "change" }
        ],
        // price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        goodsType: [
          { required: true, message: "请选择物品类型", trigger: "change" }
        ],
        categoryId: [
          { required: true, message: "请选择所属类目", trigger: "change" }
        ],
        accountType: [
          { required: true, message: "请选择结算方式", trigger: "change" }
        ],
        goodsFrom: [
          { required: true, message: "请选择物品来源", trigger: "change" }
        ],
        evidence: [{ required: true, message: "请选择凭证", trigger: "change" }]
      },
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      dialogEditVisible: false,
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      unitList: [], // 护理物品单位
      goodsTypeList: [], // 护理物品类型
      categoryList: [], // 收费项目
      accountTypeList: [], // 护理物品结算方式
      goodsFromList: [], // 护理物品来源
      categoryList2: [], // 收费项目的2级分类
      evidenceList: [] // 凭证
    };
  },
  components: {},
  created() {},
  mounted() {
    this.getOptionData();
  },
  methods: {
    // 从字典获取列表
    async getOptionData() {
      let arr = [
        "收费项目",
        "护理物品单位",
        "护理物品类型",
        "护理物品结算方式",
        "护理物品来源",
        "物品消费凭证"
      ];
      await axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: arr.join(",")
        })
        .then(res => {
          let data = res.data;
          this.unitList = data.filter(item => item.itemGroup == "护理物品单位");
          this.goodsTypeList = data.filter(
            item => item.itemGroup == "护理物品类型"
          );
          this.categoryList = data.filter(
            item => item.itemGroup == "收费项目" && item.parentNo == "消费项"
          );
          this.accountTypeList = data.filter(
            item => item.itemGroup == "护理物品结算方式"
          );
          this.goodsFromList = data.filter(
            item => item.itemGroup == "护理物品来源"
          );
          this.evidenceList = data.filter(
            item => item.itemGroup == "物品消费凭证"
          );
          this.initTableData();
        });
    },
    // 一级分类改变后立马获取二级分类
    async getCategroryList(type) {
      if(type == 'add'){
        this.addInfo.categoryId = '';
      } else {
        this.addInfo.categoryId = this.addInfo.categoryId;
      }
      await axios
        .fetch("careServer", "/careCategory/all", {
          categoryType: this.addInfo.categoryType
        })
        .then(res => {
          if (res.code == 200) {
            this.categoryList2 = res.data;
          }
        });
    },
    // 添加分类
    submitForm() {
      console.log(this.addInfo.price)
      var url = this.title == "物品添加" ? "/careGoods/add" : "/careGoods/edit";
      if (this.title == "物品添加") {
        delete this.addInfo.id;
      }
      this.$refs["addInfo"].validate(valid => {
        if (valid) {
          this.addInfo.price = !this.addInfo.price ? 0 : this.addInfo.price;
          axios.fetch("careServer", url, this.addInfo, "json").then(res => {
            if (res.code == 200) {
              this.$message.success("操作成功");
              this.addInfo.categoryType = null;
              if(this.addInfo.id){
                this.dialogEditVisible = false;
              }
              this.$nextTick(()=>{
                this.$refs["addInfo"].resetFields();
              })
              this.initTableData(this.searchForm);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击添加按钮
    add() {
      if (this.$refs["addInfo"] !== undefined) {
        this.$refs["addInfo"].resetFields();
      }
      this.addInfo.categoryType = null;
      this.title = "物品添加";
      this.dialogEditVisible = true;
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
            .fetch("careServer", "/careGoods/edit", param, "json")
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
    edit(item) {
      console.log(item);
      this.dialogEditVisible = true;
      this.title = "物品编辑";
      axios.fetch("careServer", "/careGoods/all", { id: item.id }).then(res => {
        if (res.code == 200) {
          this.addInfo = res.data[0];
          this.getCategroryList('edit');
          this.addInfo.goodsType = "" + this.addInfo.goodsType;
          this.addInfo.goodsFrom = "" + this.addInfo.goodsFrom;
          this.addInfo.accountType = "" + this.addInfo.accountType;
        }
      });
    },
    val(item) {
      console.log(item);
    },
    resetForm() {
      this.$refs["addInfo"].resetFields();
      this.dialogEditVisible = false;
    },
    initTableData(param) {
      axios.fetch("careServer", "/careGoods/all", this.searchForm).then(res => {
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
    // 排序函数
    async sortFn(param) {
      const res = await axios.fetch(
        "careServer",
        "/careGoods/despIndex",
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
            .fetch("careServer", "/careGoods/all", {
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
            .fetch("careServer", "/careGoods/all", {
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
    
  },
  beforeCreate() {
    that = this;
  },
  filters: {
    filterGoodsType(val) {
      let index = that.goodsTypeList.findIndex(item => item.itemValue == val);
      return that.goodsTypeList[index].itemNo;
    },
    filterAccountType(val) {
      let index = that.accountTypeList.findIndex(item => item.itemValue == val);
      return that.accountTypeList[index]?that.accountTypeList[index].itemNo:'';
    },
    filterGoodsFrom(val) {
      let index = that.goodsFromList.findIndex(item => item.itemValue == val);
      return that.goodsFromList[index].itemNo;
    },
    filterStatus(val) {
      return ["无效", "", "有效"][val + 1];
    }
  }
};
</script>

<style lang="less" scoped>
</style>
