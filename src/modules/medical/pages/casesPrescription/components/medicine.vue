<template>
  <div class="medicine">
    <div class="header">
      <div v-if="!iscur" class="search">
        <el-select v-model="category" placeholder="请选择" @change="search">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="名称/条码/编码/助记码" v-model="searchKey" class="input-with-select" @input="search" clearable
          @clear="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <div v-else class="search">
        <el-input placeholder="名称/条码/编码/助记码" v-model="searchKey2" class="input-with-select" @input="search2" clearable
          @clear="search2">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <ul class="type">
        <li v-for="(tab,index) in tabs" :key="index" :class="{'cur':iscur===index}" @click="iscur = index">
          {{ tab.name }}
          <span v-if="tab.count!=null||tab.count!=undefined">
            ({{tab.count}})
          </span>
        </li>
      </ul>
    </div>
    <div class="content">
      <el-table tooltip-effect="dark" ref="multipleTable" :data="iscur?elderMedicine:medicineData"
        :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table"
        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" @select="handleOneSelect"
        @select-all="selectAll" :row-key="getRowKeys">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true" :selectable="selectable">
        </el-table-column>
        <el-table-column label="药品名称" align="center" prop="name">
          <template slot-scope="scope">
            {{scope.row.fullName}}<br>
            {{scope.row.barCode}}
          </template>
        </el-table-column>
        <el-table-column prop="standard" label="规格" min-width="130" align="center">
          <!-- <template slot-scope="scope">{{ scope.row.roomName }}-{{ scope.row.bedName }}</template> -->
          <template slot-scope="scope">{{ scope.row.standard }}</template>
        </el-table-column>
        <el-table-column prop="packageUnit" width="70" label="包装单位" align="center">
          <template slot-scope="scope">
            <!-- {{ scope.row.nursingLevel | levelFilter }} -->
            {{ scope.row.packageUnit }}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价(元)" align="center">
        </el-table-column>
        <el-table-column prop="availableCount" label="可用库存" align="center">
        </el-table-column>
        <el-table-column prop="vendorName" label="厂家" align="center">
        </el-table-column>
      </el-table>
      <!-- [<ul>
        <li style="float:left;" v-for="(item,index) in selectedData" :key="index">{{item.exId}}；</li>
      </ul>]
      <div>
        {{ tableExistData }}
      </div> -->
      <el-pagination v-if="!iscur" style="text-align:center;" layout="prev, pager, next" :total="totalPage"
        :current-page.sync="currentPage" @current-change="handlePageChange">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:15px">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Medicine",
  props: {
    // 表格中已经选择过的药品id数组
    tableExistData: {
      type: Array,
      default: [],
    },
    // 弹框显示字段
    medicineVisile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: [
        {
          value: "",
          label: "全部分类",
        },
      ],
      category: "", // 药品查询种类
      searchKey: "",
      searchKey2: null, // 长者药箱的查询字段
      tabs: [
        {
          name: "药品库",
        },
        {
          name: "长者药箱",
          count: 0,
        },
      ],
      iscur: 0,
      medicineData: [], // 药品库
      elderMedicine: [], // 长者药箱
      pageIndex: 1,
      totalPage: null,
      currentPage: 1,
      selectedData: [], // 药品库&&长者药库中被选中的值
      maxLength: 5, // 允许选择的最多条数
      overFive: false, // 超过5条数据
      elderId: "",
    };
  },
  watch: {
    // 药库和长者药库切换时需要实时请求
    iscur(newValue, oldValue) {
      if (!newValue) {
        this.initTableData();
      }
    },
  },
  components: {},
  created() {
    this.elderId = Number(this.$route.query.elderId);
    this.initTableData(); // 查询药库药品
    this.getCategoryList(); // 获取药品种类
    this.getElderMedicine(this.elderId); // 查询长者药库药品
  },
  methods: {
    // 药库查询事件 初始化页面为第一页
    search() {
      this.pageIndex = 1;
      this.currentPage = 1;
      this.initTableData();
    },
    // 长者药箱查询事件
    search2() {
      this.getElderMedicine(this.elderId);
    },
    // 表格中已经选择过的药品 在药库中禁止勾选
    selectable(row, rowIndex) {
      // console.log(row,'======row');
      let arr = [];
      this.tableExistData.forEach((item) => {
        arr.push(Number(item.split("-")[0]));
      });
      // console.log(arr);
      if (arr.indexOf(row.id) !== -1) {
        return false;
      } else {
        return true;
      }
    },
    // 查询药库药品
    initTableData() {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/medicine/page",
          {
            pageSize: 10,
            pageIndex: this.pageIndex,
            category: this.category,
            searchKey: this.searchKey,
          },
          null,
          "get"
        )
        .then((res) => {
          this.medicineData = res.data.map((val) => {
            val.source = 1;
            val.exId = `${val.id}-${val.source}`;
            return val;
          });
          // console.log(this.medicineData, "=====");
          this.totalPage = res.total;
          // 表格中已经选择过的药品 需要勾选上
          this.medicineData.forEach((row) => {
            if (this.tableExistData.indexOf(row.exId) !== -1) {
              // console.log(row.exId,'====row.exId');
              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          });
        });
    },
    // 查询长者药箱
    getElderMedicine(elderId) {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/kit-medicine/" + elderId,
          {
            searchKey: this.searchKey2,
          },
          null,
          "get"
        )
        .then((res) => {
          this.elderMedicine = res.data.map((val) => {
            val.source = 2;
            val.exId = `${val.id}-${val.source}`;
            return val;
          });
          this.tabs[1].count = res.total;
          // 表格中已经选择过的药品 需要勾选上
          this.elderMedicine.forEach((row) => {
            if (this.tableExistData.indexOf(row.exId) !== -1) {
              // console.log(row.exId,'====row.exId');
              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          });
        });
    },
    // 获取药品分类
    getCategoryList() {
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/category-list",
          null,
          null,
          "get"
        )
        .then((res) => {
          let arr = res.data.map((item) => {
            let obj = {};
            obj.label = item.name;
            obj.value = item.name;
            return obj;
          });
          this.options.push(...arr);
        });
    },
    handlePageChange(val) {
      this.currentPage = val;
      this.pageIndex = val;
      this.initTableData();
    },
    // 单个选中操作
    handleOneSelect(val, row) {
      // console.log(this.overFive, "====");
      // 如果当此选中的数据超过五条 需要把当前勾选的数据取消勾选
      if (this.overFive) {
        this.$nextTick(() => {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        });
      } else {
        // 如果在药库中选择的药品在长者药箱中存在
        // 给医生提示
        if (row.source === 1) {
          let res = this.elderMedicine.filter((item) => item.id === row.id);
          let res1 = this.selectedData.filter((item) => item.id === row.id);
          if (res.length > 0 && res1.length === 0) {
            this.$message.success("长者药库中存在相同药品，建议优先选择!");
          }
        }
      }
    },

    // 选中值的变化
    handleSelectionChange(val) {
      val = val.sort(function (a, b) {
        return a.id - b.id;
      });
      val = this.deleteRepetition(val);
      // console.log(val, "====val");
      this.selectedData = val;
      const length = this.maxLength + this.tableExistData.length;
      this.overFive = val.length < length ? false : true;
      if (val.length > length) {
        this.$message.warning(`最多选择${this.maxLength}条数据!`);
        this.selectedData.splice(this.maxLength);
      }
      console.log(this.selectedData);
    },
    deleteRepetition(arr) {
      // 去重条件是ID
      let data = [];
      for (var i = 0; i < arr.length; i++) {
        if (data.findIndex((ele) => ele.exId == arr[i].exId) == -1) {
          data.push(arr[i]);
        }
      }
      // console.log(data, "====");
      return data;
    },

    handleClose() {
      this.$emit("handleClose");
    },
    // 全选
    selectAll(rows) {},
    getRowKeys(row) {
      return row.exId;
    },
    handleSubmit() {
      let count = 0;
      let param = [];
      if (this.tableExistData.length > 0) {
        this.selectedData.forEach((item) => {
          if (this.tableExistData.indexOf(item.exId) === -1) {
            param.push(item);
          }
        });
      } else {
        param = this.selectedData;
      }
      // console.log(param);
      if (param.length > 0) {
        this.$emit("getMedicine", param);
        this.handleClose();
      } else {
        this.$message.warning("请选择药品后再提交!");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.medicine {
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: space-between;
    .search {
      display: flex;
      flex: 1;
      .el-input {
        margin-left: 15px;
        width: 300px;
      }
    }
    .type {
      // width: 150px;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #eee;
      padding: 0;
      margin: 0;
      margin-right: 20px;
      border-radius: 8px;
      li {
        min-width: 60px;
        text-align: center;
        box-sizing: border-box;
        height: 44px;
        background-color: #fff;
        line-height: 34px;
        padding: 5px;
        cursor: pointer;
        color: #ccc;
      }
      li:nth-child(1) {
        border-radius: 8px 0 0 8px;
      }
      li:nth-child(2) {
        border-radius: 0 8px 8px 0;
      }
      li.cur {
        background-color: #3e8ef7;
        color: #fff;
      }
    }
  }
  .content {
    flex: 1;
    /deep/ .el-table__header-wrapper .el-checkbox {
      //找到表头那一行，然后把里面的复选框隐藏掉
      display: none;
    }
  }
}
</style>
