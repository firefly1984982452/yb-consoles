<template>
  <div class="health">
    <el-tag
      :key="tag"
      v-for="tag in dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>

    <el-select
      @change="changeDynamic"
      @keyup.enter.native="chooseOneVaue"
      v-model="dynamicTags"
      filterable
      :allow-create="isAllowCreate"
      :filter-method="filterMethod"
      remote
      multiple
      collapse-tags
      multiple-limit="5"
      size="small"
      ref="saveTagInput"
      style="margin-left: 10px;width:400px"
      placeholder="输入名称或助记码，按回车添加"
    >
      <el-option
        v-for="item in illOption"
        :key="item.value"
        :label="item.label"
        :value="item.label"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{
          item.value
        }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVisible: false,
      illOption: [], // 后台获取的所有值
      dynamicTags: [],
      searchName: "",
      isAllowCreate: false
    };
  },
  props: {
    dynamicTags: {
      type: Array,
      default: []
    }
  },
  created() {
    this.dynamicTags = [];
    // 刷新页面、新进入页面
    localStorage.removeItem("dynamicTags");
    this.getMedicalHistory();
  },
  methods: {
    /*添加过往病历*/
    getMedicalHistory(str) {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/exams",
          { searchKey: this.searchName },
          null,
          "get"
        )
        .then(res => {
          this.illOption = res.data.map(val => {
            return {
              label: val.name,
              value: val.pinyin
            };
          });
          this.isAllowCreate = this.illOption.length === 0 ? true : false;
        });
    },
    // 数据改变时
    changeDynamic() {
      console.log(this.dynamicTags)
      localStorage.setItem("dynamicTags", this.dynamicTags.join(","));
      this.$emit("changeIllness", this.dynamicTags);
    },
    // 删除单个TAG
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.$emit("changeIllness", this.dynamicTags);
    },
    // 更新数据
    setData() {
      let dynamicTags = localStorage.getItem("dynamicTags");
      console.log(dynamicTags);
      this.dynamicTags = dynamicTags ? dynamicTags : [];
      this.$emit("changeIllness", this.dynamicTags);
    },
    filterMethod(val) {
      console.log(val);
      this.searchName = val;
      this.getMedicalHistory();
    },
    chooseOneVaue() {
      console.log(this.illOption, this.searchName);
      if(this.searchName !== '') {
        if (this.dynamicTags.length === 5) {
          this.searchName = "";
          return this.$message.error("最多添加5个！");
        }
        let data = "";
        if (this.illOption.length > 0 ){
            data = this.illOption[0].label;
        }else if(this.searchName.length !== 0) {
          data = this.searchName;
        }
        if (this.dynamicTags.indexOf(data) === -1) {
          this.dynamicTags.push(data);
          this.searchName = "";
          this.$emit("changeIllness", this.dynamicTags);
        } else {
          this.$message.error(data + "已添加，请输入其它病！");
        }
      }
    }
  },
  beforeDestroy(){
    this.dynamicTags = [];
  }
};
</script>
<style scoped>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  content: "";
}
</style>
<style lang="less" scoped>
.health {
  .el-tag {
    border: 1px solid rgba(0, 0, 0, 0.4);
    color: black;
    background-color: #fff;
    /deep/ .el-icon-close {
      color: #fff;
      background-color: black;
      transform: scale(0.6);
      border: 1px solid black;
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .illDialog {
    width: 600px;
    height: auto;
    margin: unset !important;
    i {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      text-align: center;
      width: 20px;
      height: 20px;
    }
    z-index: 10;
    background-color: #fff;
    padding: 10px;
    position: absolute;
    border: 1px solid #cccccc;
    border-radius: 5px;
    .el-checkbox {
      display: block;
      line-height: 30px;
    }
  }
}
</style>
