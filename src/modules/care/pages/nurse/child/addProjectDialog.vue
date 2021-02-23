<template>
  <el-dialog title="新增/编辑护理内容分类" :visible.sync="dialogFormVisible" width="400px">
    <el-form :model="form" ref="form" :rules="rules" :label-position="'left'">
      <el-form-item label="护理名称" :label-width="formLabelWidth" prop='title'>
        <el-input :maxlength="10" show-word-limit v-model.trim="form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="护理图片" :label-width="formLabelWidth">
        <ub-picture v-model="form.imageUrl" description="护理项目"></ub-picture>
        <i v-if="form.imageUrl" class="el-icon-error" @click="deleteImg"></i>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSaveCate">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import ubPicture from "@/components/picture";
export default {
  name: "AddProjectDialog",
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        title: "",
        imageUrl: ""
      },
      rules: {
        title: [{ required: true, message: "请输入名称" }]
      },
      formLabelWidth: "80px"
    };
  },
  components: { ubPicture },
  watch: {
    dialogFormVisible: function(val, oldVla) {
      if (this.$refs["form"] != undefined) {
        this.$refs["form"].clearValidate();
      }
    }
  },

  methods: {
    clearValidate() {
      this.$refs["form"].clearValidate();
    },
    // 添加项目保存事件
    handleSaveCate() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const param = {
            id: this.form.id,
            type: this.type,
            title: this.form.title,
            imageUrl: this.form.imageUrl
          };
          axios
            .fetch("careServer", "/nursingCategory/submit", param)
            .then(res => {
              if (res.code == 200) {
                this.$emit("getNursingCategory");
                this.$message.success("操作成功");
                this.handleCancel();
              }
            });
        }
      });
    },
    handleCancel() {
      this.form = {
        title: "",
        imageUrl: ""
      };
      this.dialogFormVisible = false;
    },
    deleteImg(){
      this.form.imageUrl = '';
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-icon-error {
  position: absolute;
  top: 0;
  left: 148px;
  font-size: 20px;
  transform: translate(-50%,-50%);
  cursor: pointer;
}
</style>
