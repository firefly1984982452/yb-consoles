<template>
  <el-tabs v-model="activeName" class="content" @tab-click="handleClick" style="padding:20px">
    <el-tab-pane label="入院记录模板" name="tab2">
      <el-form :model="form99" :rules="rules" ref="ruleForm" label-width="80px" class="edit-form">
        <el-form-item label="模板内容" prop="content">
          <el-input type="textarea" rows="20" v-model.trim="form99.content" maxlength="40000" show-word-limit autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="footer left">
        <el-button type="primary" @click="submitForm(99)">确 定</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="首次病程录模板" name="tab3" lazy="true">
      <el-form :model="form88" :rules="rules" ref="ruleForm" label-width="80px" class="edit-form">
        <el-form-item label="模板内容" prop="content">
          <el-input type="textarea" rows="20" v-model.trim="form88.content" maxlength="30000" show-word-limit autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="footer left">
        <el-button type="primary" @click="submitForm(88)">确 定</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { axios } from "youban-utils";

import qs from "qs";

export default {
  data() {
    return {
      activeName: "tab2",
      form88: { type: 88 },
      form99: { type: 99 },
    };
  },
  components: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      axios
        .fetch(
          "medicalServer",
          "/api/health-document/template",
          null,
          null,
          "get"
        )
        .then((res) => {
          let resData = res.data;
          for (var i in resData) {
            if (resData[i].type == 88) {
              this.form88 = resData[i];
            } else if (resData[i].type == 99) {
              this.form99 = resData[i];
            }
          }
        });
    },
    submitForm(type) {
      let data = null;
      if (type == 88) {
        data = this.form88;
      } else if (type == 99) {
        data = this.form99;
      }
      axios
        .fetch("medicalServer", "/api/health-document/template", data, "json")
        .then((res) => {
          this.$message.success("保存成功");
          data.id = res.data;
        });
    },
    handleClick(tab, event) {},
  },
};
</script>