<template>
  <el-dialog title="重置密码" :visible.sync="passwordVisible" width="400px" center top="20vh" modal="true">
    <el-form :model="passwordData" :label-position="left" status-icon :rules="passwordRules" ref="passwordForm" label-width="80px" size="mini">
      <el-form-item label="显示名">
        <b>{{ passwordData.displayName }}</b>
      </el-form-item>
      <el-form-item label="输入密码" prop="password" required>
        <el-input show-password clearable v-model="passwordData.password" type="password" placeholder="请输入密码"></el-input>
        <div class="text-tips">（6位及以上，含字母、数字、特殊字符至少2种）</div>
        <div slot="error" class="error-tips" slot-scope="scope">{{ scope.error }}</div>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" required>
        <el-input show-password clearable v-model="passwordData.confirmPassword" type="password" placeholder="请确认密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="passwordForm()">确 定</el-button>
      <el-button @click="passwordVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from "axios";

let that;
export default {
  data() {
    return {
      passwordVisible: false,
      passwordData: {
        employeeId: null,
        userId: null,
        displayName: null,
        password: null,
        confirmPassword: null
      },
      passwordRules: {
        password: [
          {
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error("请输入密码"));
              } else {
                const passwordRule = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,}$/;
                if (!passwordRule.test(value)) {
                  callback(new Error("密码长度或格式不正确"));
                } else {
                  callback();
                }
              }
            }
          }
        ],
        confirmPassword: [
          {
            validator(rule, value, callback) {
              if (!value) {
                callback(new Error("请确认密码"));
              } else if (value !== that.passwordData.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    }
  },
  created() {
    that = this;
  },
  methods: {
    show(item) {
      let theForm = this.$refs["passwordForm"];
      if (theForm) {
          theForm.resetFields();
      }
      this.passwordVisible = true;
      this.passwordData.employeeId = item.employeeId;
      this.passwordData.userId = item.userId;
      this.passwordData.displayName = item.displayName;
      this.passwordData.password = "";
      this.passwordForm.confirmPassword = "";
    },
    passwordForm() {
      this.$refs["passwordForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        let path;
        let data;
        if(this.passwordData.userId) {
          path = "/permission/resetPassword";
          data = {
            userId: this.passwordData.userId,
            password: this.passwordData.password
          };
        } else {
          path = "/user/password/employee";
          data = {
            employeeId: this.passwordData.employeeId,
            password: this.passwordData.password
          };
        }
        axios.fetch("userServer", path, data).then(res => {
          this.passwordVisible = false;
          this.$message.success("操作成功");
        });
      });
    },
  }
}
</script>

<style lang="less" scoped>
.error-tips {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
}
</style>