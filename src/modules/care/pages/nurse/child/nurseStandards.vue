<template>
  <div class="nurse-standards">
    <el-dialog title="新增/编辑护理指标" :visible.sync="dialogTableVisible" center>
      <div class="title">
        <div class="left">
          <span>护理内容：<b>{{currentItem.itemTitle}}</b></span>
        </div>
        <div class="right">
          <span>
            <i @click="add" style="font-size:20px;cursor:pointer;" class="el-icon-circle-plus"></i>
          </span>
        </div>
      </div>
      <el-form :rules="model.rules" :model="model" ref="form">
        <el-table :data="model.tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }"
          class="ub-table">
          <!-- <draggable class="" element="ul" :list="tableData" :options="{group:'title', animation:150}" :no-transition-on-drag="true">
          <transition-group type="transition"> -->
          <el-table-column label="名称">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.name"></el-input> -->
              <el-form-item :prop="'tableData.' + scope.$index + '.title'" :rules='model.rules.title'>
                <el-input v-model.trim="scope.row.title" maxlength="10" show-word-limit></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.inputType'" :rules='model.rules.inputType'>
                <el-select size="mini" v-model="scope.row.inputType" placeholder="请选择" style="width:200px">
                  <el-option v-for="item in optionsPlanType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="选项值">
            <template slot-scope="scope">
              <!-- <el-form-item :prop="'tableData.' + scope.$index + '.inputText'" :rules='model.rules.inputText'>
                <el-input v-model="scope.row.inputText"></el-input>
              </el-form-item> -->
              <div v-if="scope.row.inputType == 1||scope.row.inputType == 2||scope.row.inputType == 3">

                <el-tag :key="tag" v-for="tag in scope.row.dynamicTags" type='info' closable
                  :disable-transitions="false" @close="handleClose(tag,scope.$index)">
                  {{tag}}
                </el-tag>
                <el-input class="input-new-tag" placeholder="输入选项值,回车确认" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" :ref="'saveTagInput'+scope.$index" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.$index)" @blur="handleInputConfirm(scope.$index)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row,scope.$index)">+
                </el-button>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="调整排序" width="80">
            <!-- <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.dispIndex'" :rules='model.rules.dispIndex'>
                <el-input v-model="scope.row.dispIndex" type="number"></el-input>
              </el-form-item>
            </template> -->
            <template slot-scope="scope">
              <span style="cursor:pointer;" @click="down(scope.row, scope.$index)">
                <i class="el-icon-bottom"></i>
              </span>
              <span style="cursor:pointer;color:#409EFF;" @click="up(scope.row, scope.$index)">
                <i class="el-icon-top"></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                <el-button size="mini" @click="deleteItem(scope.$index, model.tableData)"><i
                    class="el-icon-delete-solid danger" /></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import draggable from "vuedraggable";
export default {
  name: "NurseStandards",
  data() {
    return {
      currentItem: {},
      dialogTableVisible: false,
      optionsPlanType: [
        {
          value: 1,
          label: "单选",
        },
        {
          value: 2,
          label: "多选",
        },
        {
          value: 3,
          label: "文本",
        },
        {
          value: 4,
          label: "时间",
        },
        {
          value: 5,
          label: "整数",
        },
      ],
      model: {
        rules: {
          title: [{ required: true, message: "", trigger: "blur" }],
          inputType: [
            { required: true, message: "请选择类型", trigger: "change" },
          ],
          inputText: [
            { required: true, message: "请输入选项值", trigger: "blur" },
          ],
          dispIndex: [
            { required: true, message: "请输入排序值", trigger: "blur" },
          ],
        },
        tableData: [
          {
            name: "",
            inputType: "",
            inputText: "",
            dispIndex: 0,
            dynamicTags: [],
            inputVisible: false,
            inputValue: "",
          },
        ],
      },
    };
  },
  components: {},
  watch: {
    dialogTableVisible: function (val, oldVla) {
      if (val) {
        this.$refs["form"].clearValidate();
      }
    },
  },
  methods: {
    add() {
      this.model.tableData.push({
        name: "",
        inputType: "",
        inputText: "",
        dispIndex: this.model.tableData.length,
        dynamicTags: [],
        inputVisible: false,
        inputValue: "",
      });
      console.log(this.model.tableData);
    },
    deleteItem(index, rows) {
      this.model.tableData.forEach((item,itemInex)=>{
        if(itemInex > index){
          item.dispIndex -= 1;
        }
      })
      if (rows[index].id) {
        // console.log("有id");
        axios
          .fetch("careServer", "/nursingOption/delete", {
            id: rows[index].id,
          })
          .then((res) => {
            rows.splice(index, 1);
            this.$message.success("操作成功");
          });
      } else {
        rows.splice(index, 1);
      }

      console.log(this.model.tableData);
    },
    clearValidate() {
      this.$refs["form"].clearValidate();
    },
    handleSave() {
      this.$refs["form"].validate((valid, model) => {
        // console.log(valid);
        // console.log(model);
        if (valid) {
          let flag = true;
          const param = [];
          this.model.tableData.forEach((item) => {
            const obj = {};
            obj.serviceId = this.currentItem.serviceId;
            obj.id = item.id ? item.id : null;
            obj.title = item.title;
            obj.inputType = item.inputType;
            obj.dispIndex = item.dispIndex;
            if (
              item.inputType == 1 ||
              item.inputType == 2 ||
              item.inputType == 3
            ) {
              if (item.dynamicTags.length == 0) {
                flag = false;
              }
              obj.inputText = item.dynamicTags.join(",");
            } else {
              obj.inputText = "";
            }
            param.push(obj);
          });
          if (flag) {
            // console.log(param);
            axios
              .fetch("careServer", "/nursingOption/submit", param, "json")
              .then((res) => {
                if (res.code == 200) {
                  this.$message.success("操作成功");
                  this.handleCancel();
                }
              });
          } else {
            this.$message.warning("请添加选项值");
          }
        } else {
          // this.clearValidate();
          this.$message.warning("请完善护理指标内容");
        }
      });
    },
    handleClose(tag, index) {
      this.model.tableData[index].dynamicTags.splice(
        this.model.tableData[index].dynamicTags.indexOf(tag),
        1
      );
    },

    showInput(data, index) {
      // console.log(data, index);
      // console.log(this.tableData);
      // setTimeout(() => {
      //   this.$set(this, "model.tableData[index].inputVisible", true);
      //   this.$forceUpdate();
      // }, 0);
      this.model.tableData[index].inputVisible = true;
      this.$nextTick((_) => {
        this.$refs[`saveTagInput${index}`].$refs.input.focus();
      });
    },

    handleInputConfirm(index) {
      let inputValue = this.model.tableData[index].inputValue;
      if (inputValue) {
        if (
          this.model.tableData[index].dynamicTags.indexOf(inputValue) === -1
        ) {
          this.model.tableData[index].inputVisible = false;
          this.model.tableData[index].inputValue = "";
          this.model.tableData[index].dynamicTags.push(inputValue);
        } else {
          this.$message.warning("该选项值已存在,请勿重复添加");
        }
      }
    },
    handleCancel() {
      this.dialogTableVisible = false;
      this.model.tableData = [
        {
          name: "",
          inputType: "",
          inputText: "",
          dispIndex: "",
          dynamicTags: [],
          inputVisible: false,
          inputValue: "",
        },
      ];
    },
    down(data, index) {
      if (this.model.tableData.length - 1 > index) {
        let temp = [];
        let current = this.model.tableData[index];
        let next = this.model.tableData[index + 1];
        next.dispIndex = index;
        current.dispIndex = index + 1;
        temp = next;
        this.$set(this.model.tableData,index,temp);
        this.$set(this.model.tableData,index + 1,current);
        console.log(this.model.tableData);
      } else {
        this.$message.warning("已经是最后一条");
      }
    },
    up(data, index) {
      if ( index !== 0 ) {
        let temp = [];
        let current = this.model.tableData[index];
        let last = this.model.tableData[index - 1];
        last.dispIndex = index;
        current.dispIndex = index - 1;
        temp = last;
        // this.model.tableData[index] = temp;
        // this.model.tableData[index -1] = current;
        this.$set(this.model.tableData,index,temp);
        this.$set(this.model.tableData,index -1,current);
        console.log(this.model.tableData);
      } else {
        this.$message.warning("已经是第一条");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    span + span {
      margin-left: 16px;
    }
  }
  .right {
    padding-right: 30px;
  }
}
/deep/ .el-table__body-wrapper {
  overflow-y: auto;
  max-height: 450px;
  tr {
    height: 60px;
  }
  td {
    .cell {
      min-height: 60px;
      overflow: auto;
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      .el-form-item__error {
        display: none;
      }
      .el-form-item {
        margin: 0;
      }
      .el-input {
        flex: 1;
      }
      .el-tag + .el-tag {
        margin-left: 2px;
      }
      .el-button {
        min-width: 0;
      }
      .el-select {
        width: 100%;
      }
      .unit {
        width: 50px;
        padding: 0 5px;
      }
    }
  }
}
</style>
