<template>
  <div>
    <el-row :gutter="0">
      <el-col :span="24">
        <el-form label-width="80px">
          <div class="selfProcess">
            <div style="position: relative;">
              <el-row>
                <el-form-item label="补贴方式">
                  <el-col :span="4">
                    <el-select v-if="sign!='see'" v-model="dataForm.siType" placeholder="请选择补贴方式" @click.native="selectTool(290)">
                      <el-option v-for="(item,index) in option" :key="item.sutl_name" :label="item.sutl_name" :value="item.sutl_name"></el-option>
                    </el-select>
                    <span v-else>{{dataForm.siType | bttypeFilter}}</span>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row style="margin-top: 30px;position: relative;left: 20px;">
                <!--<el-form-item label="">-->
                <table class="dataFormTable" style="width:40%;">
                  <thead>
                    <td>长护险等级</td>
                    <td>补贴标准</td>
                  </thead>
                  <tr>
                    <td>一级</td>
                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="14">
                          <el-input placeholder="补贴系数" v-if="sign!='see'" v-model="dataForm.siLevel1"></el-input>
                          <span v-else>{{dataForm.siLevel1}}</span>
                        </el-col>
                        <el-col :span="3" v-if="sign!='see'" style="line-height: 40px;">
                          <span style="position: relative;">元 / 天</span>
                        </el-col>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td>二级</td>
                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="14">
                          <el-input placeholder="补贴系数" v-if="sign!='see'" v-model="dataForm.siLevel2"></el-input>
                          <span v-else>{{dataForm.siLevel1}}</span>
                        </el-col>
                        <el-col :span="3" v-if="sign!='see'" style="line-height: 40px;">
                          <span style="position: relative;">元 / 天</span>
                        </el-col>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td>三级</td>
                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="14">
                          <el-input placeholder="补贴系数" v-if="sign!='see'" v-model="dataForm.siLevel3"></el-input>
                          <span v-else>{{dataForm.siLevel3}}</span>
                        </el-col>
                        <el-col :span="3" v-if="sign!='see'" style="line-height: 40px;">
                          <span style="position: relative;">元 / 天</span>
                        </el-col>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td>四级</td>
                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="14">
                          <el-input placeholder="补贴系数" v-if="sign!='see'" v-model="dataForm.siLevel4"></el-input>
                          <span v-else>{{dataForm.siLevel4}}</span>
                        </el-col>
                        <el-col :span="3" v-if="sign!='see'" style="line-height: 40px;">
                          <span style="position: relative;">元 / 天</span>
                        </el-col>
                      </el-row>
                    </td>
                  </tr>
                  <tr>
                    <td>五级</td>
                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="14">
                          <el-input placeholder="补贴系数" v-if="sign!='see'" v-model="dataForm.siLevel5"></el-input>
                          <span v-else>{{dataForm.siLevel5}}</span>
                        </el-col>
                        <el-col :span="3" v-if="sign!='see'" style="line-height: 40px;">
                          <span style="position: relative;">元 / 天</span>
                        </el-col>
                      </el-row>
                    </td>
                  </tr>
                </table>
                <!--</el-form-item>-->
              </el-row>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <div class="tijiao" id="addTijiao" v-if="sign!='sh'">
      <el-row :gutter="20" v-if="sign != 'see'">
        <el-col :span="3" style>
          <el-button type="success" plain v-bind:style="{'background':firstZhuTi}" @click="sendData()" v-if="longSave==0">新建长护险补贴标准</el-button>
          <el-button type="info" plain disabled v-if="longSave==1">新建完成</el-button>
        </el-col>
        <el-col :span="3" style>
          <el-button type plain @click="closeCancel()">取消</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="0" v-else>
        <el-col :span="3" style>
          <el-button type plain @click="closeCancel()">关闭</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="tijiao" id="addTijiao" v-else>
      <el-row :gutter="20">
        <el-col :span="3" style>
          <el-button type="success" v-bind:style="{'background':firstZhuTi}" plain @click="editData()">编辑长护险补贴标准</el-button>
        </el-col>
        <el-col :span="3" style>
          <el-button type plain @click="shData()">审核</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
// import qs from "qs";
export default {
  props: ["oid", "sign", "enterDate"],
  data() {
    return {
      option: [],
      /*虚拟数据*/
      dataForm: {
        enterDate: "",
      },
      loading: false,
    };
  },
  created() {
    if (this.sign != "add") {
      this.seeById();
    }
  },
  methods: {
    /*下拉*/
    selectTool(cid) {
      let data = {
        sutl_id: cid,
      };
      axios
        .post("/system/sysutil/getSysUtilsByid", qs.stringify(data))
        .then((res) => {
          this.loading = false;
          if (res.data.code == 200) {
            this.option = res.data.data;
          } else if (res.data.code == "401") {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    /*新增*/
    sendData() {
      //			debugger
      this.dataForm.enterDate = this.enterDate;
      if (this.dataForm.siType == "一次性") {
        this.dataForm.siType = 0;
      } else if (this.dataForm.siType == "按月") {
        this.dataForm.siType = 1;
      } else if (this.dataForm.siType == "按天") {
        this.dataForm.siType = 2;
      }
      axios
        .post("/subsidy/type/addSubInsurance", qs.stringify(this.dataForm))
        .then((res) => {
          this.loading = false;
          if (res.data.code == 200) {
            this.$message({ message: "操作成功", type: "success" });
            var colorBtn = { all: 0, dai: 0, haved: 1 };
          } else if (res.data.code == "401") {
            this.$message({ message: res.data.message, type: "warning" });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
          if (this.dataForm.siType === 0) {
            this.dataForm.siType = "一次性";
          } else if (this.dataForm.siType == 1) {
            this.dataForm.siType = "按月";
          } else if (this.dataForm.siType == 2) {
            this.dataForm.siType = "按天";
          }
        });
    },
    editData() {
      this.dataForm.enterDate = this.enterDate;
      if (this.dataForm.siType == "一次性") {
        this.dataForm.siType = 0;
      } else if (this.dataForm.siType == "按月") {
        this.dataForm.siType = 1;
      } else if (this.dataForm.siType == "按天") {
        this.dataForm.siType = 2;
      }
      axios
        .post("/subsidy/type/updateSubInsurance", qs.stringify(this.dataForm))
        .then((res) => {
          this.loading = false;
          if (res.data.code == 200) {
            this.$message({ message: "操作成功", type: "success" });
            var colorBtn = { all: 0, dai: 0, haved: 1 };
            // this.$store.commit("setSubSetUpData", res.data.data);
            // this.$store.commit("setSubSetUpPage", 1);
            // this.$store.commit("setSubSetUpTotal", res.data.total);
            // this.$store.commit("setColorBtn", colorBtn);
          } else if (res.data.code == "401") {
            this.$message({ message: res.data.message, type: "warning" });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
          if (this.dataForm.siType === 0) {
            this.dataForm.siType = "一次性";
          } else if (this.dataForm.siType == 1) {
            this.dataForm.siType = "按月";
          } else if (this.dataForm.siType == 2) {
            this.dataForm.siType = "按天";
          }
        });
    },
    closeCancel() {
      this.$router.push("/subsidy/subsidysetUpList");
      this.$store.commit("setShowParent", 0);
    },
    seeById() {
      let data = {
        siId: this.oid,
      };
      axios
        .post("/subsidy/type/querySubInsuranceById", qs.stringify(data))
        .then((res) => {
          this.loading = false;
          if (res.data.code == 200) {
            this.dataForm = res.data.data;
            if (this.dataForm.siType === 0) {
              this.dataForm.siType = "一次性";
            } else if (this.dataForm.siType == 1) {
              this.dataForm.siType = "按月";
            } else if (this.dataForm.siType == 2) {
              this.dataForm.siType = "按天";
            }
            console.log(this.dataForm);
          } else if (res.data.code == "401") {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    shData() {
      let data = {
        siId: this.oid,
        status: 1,
      };
      axios
        .post("/subsidy/type/checkSubInsurance", qs.stringify(data))
        .then((res) => {
          this.loading = false;
          if (res.data.code == "200") {
            this.$message({ message: "审核成功", type: "success" });
            // this.$store.commit("setSubSetUpPage", 1);
            // this.$store.commit("setSubSetUpData", res.data.data);
            // this.$store.commit("setSubSetUpTotal", res.data.total);
          } else if (res.data.code == "401") {
            this.$message({
              message: res.data.message,
              type: "warning",
            });
            this.loading = false;
            this.$router.push("/login");
          } else {
            this.loading = false;
            this.$message.error(res.data.message);
          }
        });
    },
  },
  filters: {
    bttypeFilter: (val) => {
      if (val === 0) {
        val = "一次性";
      } else if (val == 1) {
        val = "按月";
      } else if (val == 2) {
        val = "按天";
      }
      return val;
    },
  },
};
</script>
<style>
.selfProcess .el-checkbox__label {
  width: auto;
}
.dataFormTable {
  width: 80%;
  border-radius: 2px;
}
.dataFormTable td {
  color: #666;
  padding: 12px 0;
  font-size: 14px;
  text-align: center;
  border: 1px solid #dcdfe6;
}
.dataFormTable thead td {
  background: #f3f3f3;
  font-size: 15px;
  color: #333;
  border-radius: 1px;
}
.span8 {
  margin-top: 20px;
  height: 580px;
}
.span8 .el-card {
  height: 100%;
}
</style>