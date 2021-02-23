<template>
  <el-dialog title="新增/编辑护理内容" :visible.sync="dialogFormVisible" width="700px" center>
    <div class="title">
      <p>护理内容分类：{{ currentItem.title }}</p>
      <!-- <el-button v-show="sign=='add'?true:false" type="text" icon="el-icon-plus" circle @click="add"></el-button> -->
      <!-- <i class="el-icon-circle-plus"></i> -->
      <i v-show="sign=='add'?true:false" @click="add" style="font-size:20px;cursor:pointer" class="el-icon-circle-plus"></i>
    </div>
    <table class="table" border="1">
      <thead class="header">
        <tr>
          <td width="50%">内容名称</td>
          <td>执行分类</td>
          <td>是否执行</td>
          <td v-show="sign=='add'?true:false" width="10%">操作</td>
        </tr>
      </thead>
      <tbody class="body">
        <tr v-for="(item,i) in data">
          <td>
            <el-input class="td" v-model.trim="item.itemTitle" maxlength="10" show-word-limit></el-input>
          </td>
          <td>
            <el-select size="mini" v-model="item.targetType" :disabled="sign=='edit'" style="width:100px" placeholder="请选择">
              <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-switch v-model="item.schedulable" active-color="#13ce66">
            </el-switch>
          </td>
          <td v-show="sign=='add'?true:false">
            <i slot="reference" class="el-icon-delete-solid danger" @click="deleteItem(i)" />
          </td>
        </tr>
      </tbody>
    </table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  name: "AddPlanDialog",
  props: {
    currentItem: {
      type: Object,
      default: {}
    },
    sign: {
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      lastType: "",
      dialogFormVisible: false,
      data: [
        {
          itemTitle: "",
          schedulable: true,
          targetType: 0
        }
      ],
      options: [
        {
          value: 0,
          label: "按长者"
        },
        {
          value: 1,
          label: "按房间"
        }
      ]
    };
  },
  methods: {
    // 添加项目保存事件
    handleSave() {
      let valid = true;
      if (this.data.length > 0) {
        this.data.forEach((item, index) => {
          item.categoryId = this.currentItem.id;
          item.category = this.currentItem.title;
          if (!item.itemTitle) {
            valid = false;
            // const tds = document.getElementsByClassName("td");
            // tds[index].style.border = "1px solid red";
          }
        });
        if (valid) {
          if (
            this.lastType !== this.data[0].targetType &&
            this.sign == "edit"
          ) {
            this.$confirm(
              "执行分类发生变化,会清空等级配置任务,是否继续?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                axios
                  .fetch(
                    "careServer",
                    "/nursingService/submit",
                    this.data,
                    "json"
                  )
                  .then(res => {
                    if (res.code == 200) {
                      this.dialogFormVisible = false;
                      this.$message.success("操作成功");
                      this.$emit("getNursingService");
                    }
                  });
              })
              .catch(() => {
                console.log("取消修改");
              });
          } else {
            axios
              .fetch("careServer", "/nursingService/submit", this.data, "json")
              .then(res => {
                if (res.code == 200) {
                  this.dialogFormVisible = false;
                  this.$message.success("操作成功");
                  this.$emit("getNursingService");
                }
              });
          }
        } else {
          this.$message.warning("内容名称不能为空");
          return;
        }
      } else {
        this.$message.warning("请添加护理内容");
      }
    },
    add() {
      this.data.push({
        itemTitle: "",
        schedulable: true,
        targetType: 0
      });
    },
    deleteItem(i) {
      this.data.splice(i, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  .el-button {
    min-width: 0px;
  }
  padding-right: 22px;
}
.table {
  width: 100%;
  border: 1px #f8f8f8;
  .header {
    line-height: 44px;
    background-color: #f8f8f8;
    text-align: center;
  }
  .body {
    text-align: center;
    td {
      padding: 8px;
    }
  }
}
</style>
