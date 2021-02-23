<template>
  <div id="huangCss">
    <el-button @click="backList()" style="margin:0 0 10px;">返回</el-button>
    <div class="topContent">
      <el-row align="middle">
        <el-form ref="searchForm" :model="searchForm" :rules="rules">
          <el-row>
            <el-col :xl="6" :lg="8">
              <el-form-item label="供应商名称" label-width="120px" prop="partnerName">
                <el-input type="textarea" v-model="searchForm.partnerName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="4" :lg="6">
              <el-form-item label="联系人" label-width="120px" prop="contactName">
                <el-input v-model="searchForm.contactName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="4" :lg="6">
              <el-form-item label="联系电话" label-width="120px" prop="contactPhone">
                <el-input v-model="searchForm.contactPhone" maxlength="11" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="6" :lg="8">
              <el-form-item label="联系地址" label-width="120px" prop="contactAddress">
                <el-input type="textarea" v-model="searchForm.contactAddress" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="6" offset="2">
            <el-button type="primary" @click="saveData()">保存</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchForm: { partnerId: 0 },
      supplierOptions: [
        { value: 1, label: "供应商" },
        // { value: 2, label: "生产商" }
      ],
      rules: {
        orderNo: [
          {
            required: true,
            message: "",
            trigger: "blur,change",
          },
        ],
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    backList() {
      this.$router.back(-1);
    },
    cancel() {
      this.$router.back(-1);
    },
    saveData() {
      if (
        this.searchForm["partnerName"] === "" ||
        this.searchForm["partnerName"] === null ||
        !this.searchForm["partnerName"]
      ) {
        this.$message.error("请输入供应商名称");
        this.loading = false;
        return;
      }
      if (
        this.searchForm["contactName"] === "" ||
        this.searchForm["contactName"] === null ||
        !this.searchForm["contactName"]
      ) {
        this.$message.error("请输入联系人");
        this.loading = false;
        return;
      }

      if (Number.isNaN(Number(this.searchForm.contactPhone))) {
        return this.$message.error("联系电话只能输入数字！");
      }
      if (
        this.searchForm["contactPhone"] === "" ||
        this.searchForm["contactPhone"] === null ||
        !this.searchForm["contactPhone"]
      ) {
        this.$message.error("请输入联系电话");
        this.loading = false;
        return;
      }
      if (
        this.searchForm["contactAddress"] === "" ||
        this.searchForm["contactAddress"] === null ||
        !this.searchForm["contactAddress"]
      ) {
        this.$message.error("请输入联系地址");
        this.loading = false;
        return;
      }
      this.searchForm["partnerType"] = 1;
      axios
        .fetch("medicalServer", "/api/partner", this.searchForm, "json")
        .then((res) => {
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.$router.push("/medical/drugStorage/supplierList");
        });
    },
  },
};
</script>
<style scoped>
#huangCss .topContent {
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 15px 2% 10px 5px;
}
#huangCss .jishu {
  text-align: center;
  padding: 16px 0 0 0;
  font-size: 12px;
  font-weight: 300;
  color: rgba(165, 165, 165, 1);
}
</style>