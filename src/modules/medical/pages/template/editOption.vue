<template>
  <div>
    <div class="content">
      <el-table :data="listData" border class="ub-table" highlight-current-row="true" @row-dblclick="editRow">
        <el-table-column prop="name" label="描述内容" min-width="250">
          <template slot-scope="scope">
            <el-input size="small" v-model.trim="scope.row.name" v-if="!scope.row.disabled" placeholder="请输入内容" maxlength="30" show-word-limit></el-input>
            <span v-if="scope.row.disabled">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortId" label="排序" min-width="50">
          <template slot-scope="scope">
            <input class="el-input__inner" size="small" v-model.trim="scope.row.sortId" v-if="!scope.row.disabled" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="从大到小排列，可以为小数" max="99999.99">
            <span v-if="scope.row.disabled">{{scope.row.sortId}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="defaultOption" label="默认选项" min-width="40" v-if="parent.type>=21 && parent.type<=41">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.defaultOption" :checked="scope.row.defaultOption" @change="saveDefaultOption(scope.row)" true-label="1" false-label="0" :disabled="(!canSelectNew && scope.row.defaultOption==0)|| !scope.row.id">&nbsp;</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="40" class-name="operation">
          <template slot="header" slot-scope="scope">
            <el-button size="mini" @click="add(scope.$index)" icon="el-icon-plus"></el-button>
          </template>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="保存" placement="top" v-if="!scope.row.disabled">
              <el-button @click="submitForm(scope.row)" icon="iconfont iconsave-fill" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="top" content="删除" v-if="scope.row.id">
              <el-popconfirm confirmButtonText='确定' @onConfirm="deleteData(scope.row)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此类型？">
                <i slot="reference" class="el-icon-delete-solid danger" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";
export default {
  data() {
    let that = this;
    return {
      dialogFormVisible: false,
      dialogOptionsVisible: false,
      loading: true,
      optionTitle: "",
      listData: [],
      dataCount: 0,
      canSelectNew: true,
      form: {},
      sign: "",
      rules: {
        name: [
          {
            required: true,
            message: "请输入描述类别",
            trigger: ["blur", "change"],
          },
        ],
        sortId: [
          {
            required: true,
            message: "请输入排序",
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
  props: {
    value: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  watch: {
    $route: "fetchData",
  },
  computed: {
    parent: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  mounted() {},
  created() {
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
      axios
        .fetch(
          "medicalServer",
          "/api/category/list/" + this.parent.type + "/" + this.parent.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          let resData = res.data;
          let selected = 0;
          for (var i in resData) {
            resData[i].disabled = true;
            if (resData[i].defaultOption == 1) {
              selected++;
            }
          }
          let canSelectNew = true;
          //单选框只能选择一个
          if (this.parent.inputType == 1 && selected > 0) {
            canSelectNew = false;
          }
          this.canSelectNew = canSelectNew;
          this.listData = resData;
          this.dataCount = res.total;
        });
    },

    edit(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.dialogFormVisible = true;
    },
    add() {
      this.listData.push({ name: "", sortId: 0, disabled: false });
    },
    submitForm(data) {
      let that = this;
      data.parentId = this.parent.id;
      if (data.name && data.sortId != undefined) {
        let created = data.id == undefined ? true : false;
        axios
          .fetch(
            "medicalServer",
            "/api/category/" + this.parent.type,
            data,
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
            data.id = res.data;
            data.disabled = true;
          });
      } else {
        this.$message.error("描述内容和排序不能为空");
      }
    },
    deleteData(data) {
      axios
        .fetch(
          "medicalServer",
          "/api/category/" + this.parent.type + "/" + data.id,
          null,
          null,
          "delete"
        )
        .then((res) => {
          this.$message.success("删除成功！");
          this.fetchData();
        });
    },
    editRow(row, column, event) {
      row.disabled = false;
    },
    saveDefaultOption(data) {
      axios
        .fetch(
          "medicalServer",
          "/api/category/default-option/" + data.id + "/" + data.defaultOption,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.$message.success("保存成功！");
          this.listData = [];
          this.dataCount = 0;
          this.fetchData();
        });
    },
  },
};
</script>
<style scoped>
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
/deep/ .iconsave-fill {
  font-size: 20px;
}
</style>