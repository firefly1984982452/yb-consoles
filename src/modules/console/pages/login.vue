<template>
  <div>
    <ul>
      <li class='welcome'>
        <img :src="iconUrl">
        <span>{{ title }}</span>
      </li>
    </ul>
    <el-tabs class="ub-tabs" v-if="!logined" type="card" value="user" :stretch="true">
      <el-tab-pane name="user">
        <span slot="label"><i class="el-icon-lock"></i> 账号登录</span>
        <ul>
          <li class="item">
            <p>登录名</p>
            <el-input type="text" clearable autofocus placeholder="请输入您的登录名" v-model="loginName" @keyup.enter.native="login"></el-input>
          </li>
          <li class="item">
            <p>密码</p>
            <el-input type="password" clearable show-password placeholder="请输入您的登录密码" v-model="password" @keyup.enter.native="login"></el-input>
          </li>
          <li>
            <el-button type="success" icon="el-icon-lock" plain @click="login">立即登录</el-button>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane name="mobile">
        <span slot="label"><i class="el-icon-mobile-phone"></i> 短信登录</span>
        <ul>
          <li class="validation">
            <p>手机号码</p>
            <el-input class="element" type="text" maxlength="11" clearable autofocus placeholder="请输入您的手机号码" v-model="phoneNumber" @keyup.enter.native="smsLogin"></el-input>
          </li>
          <li class="validation">
            <p>验证码</p>
            <el-input class="element" type="text" clearable placeholder="请输入短信验证码" v-model="validationCode" @keyup.enter.native="smsLogin">
              <el-button plain slot="append" @click="sendValidation">{{ countDownTitle }}</el-button>
            </el-input>
          </li>
          <li>
            <el-button type="success" icon="el-icon-mobile-phone" plain @click="smsLogin">立即登录</el-button>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <ul v-if="!logined && wechatVisible">
      <li>
        <el-button plain @click="showWechat">微信扫码登录</el-button>
      </li>
    </ul>
    <ul v-else>
      <li class="item" v-if="logined">
        <p>&nbsp;</p>
        <p>您已作为 <b>{{ displayName }}</b> 登录了！</p>
        <p>
          <el-link @click="gotoDesktop">点击这里返回控制台首页</el-link>
        </p>
        <p>
          <el-link @click="logout">切换账号请点击这里退出</el-link>
        </p>
      </li>
    </ul>
    <ub-wechat ref="wechat" @loginSuccess="wechatSuccess"></ub-wechat>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import md5 from "md5";
import { mapGetters } from "vuex";
import store from "@/store";
import types from "@/store/types";
import utils from "@/utils";
import _menu from "@/components/_menu";
import ubWechat from "@/components/wechat-login";
import tenant from "@/components/_tenant";

const phoneChecker = /^1[3456789]\d{9}$/;

export default {
  components: { ubWechat },
  computed: {
    ...mapGetters({
      getCurrentUser: types.GetCurrentUser,
    }),
  },
  data() {
    return {
      logined: false,
      displayName: null,
      loginName: null,
      password: null,
      phoneNumber: null,
      validationCode: null,
      countDownNumber0: 0,
      countDownNumber: 0,
      countDownTitle: "获取验证码",
      title: "有伴云",
      tenantId: null,
      iconUrl: "https://image.youbankeji.com/static/tenant/logo_youban.png",
      wechatVisible: false,
    };
  },
  created() {
    this.onlogin();
  },
  methods: {
    fetchTenant() {
      tenant.fetchCurrentTenant().then(data => {
        this.initTenant(data);
      });
    },
    initTenant(data) {
      if (!data) {
        return;
      }
      this.title = data.tenantName;
      this.tenantId = data.tenantId;
      this.iconUrl = tenant.getTenantSettingValue(
        "logo_image",
        data,
        this.iconUrl
      );
      if (tenant.getTenantSettingValue("login_wechat", data)) {
        this.wechatVisible = true;
      }
      tenant.updateFavicon(data);
    },
    sendValidation() {
      if (this.countDownNumber < this.countDownNumber0) {
        this.$message.error("重发验证码还未到时间");
        return;
      }
      if (!this.phoneNumber) {
        this.$message.error("请输入手机号码");
        return;
      }
      if (!phoneChecker.test(this.phoneNumber)) {
        this.$message.error("手机号码有误，请重新输入");
        return;
      }
      axios
        .fetch("userServer", "/user/sms/validationCode", {
          appNo: "console",
          phoneNumber: this.phoneNumber,
          tenantId: this.tenantId
        })
        .then((res) => {
          this.$message.success("发送成功，请注意查收");
          this.countDownNumber0 = res.data;
          this.countDownNumber = this.countDownNumber0 - 1;
          this.countDown();
        });
    },
    countDown() {
      setTimeout(() => {
        this.countDownTitle = "" + this.countDownNumber-- + " 秒后重发";
        if (this.countDownNumber > 0) {
          this.countDown();
        } else {
          this.countDownNumber = 0;
          this.countDownNumber0 = 0;
          this.countDownTitle = "重发验证码";
        }
      }, 1000);
    },
    smsLogin() {
      if (!this.phoneNumber) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!phoneChecker.test(this.phoneNumber)) {
        this.$message.error("手机号码有误，请重新输入");
        return;
      }
      if (!this.validationCode) {
        this.$message.error("请输入短信验证码");
        return;
      }
      axios
        .fetch("userServer", "/user/login/validationCode", {
          appNo: "console",
          phoneNumber: this.phoneNumber,
          validationCode: this.validationCode,
          tenantId: this.tenantId
        })
        .then((res) => {
          this.$message.success("登录成功");
          this.loginSuccess(res.data);
        });
    },
    showWechat() {
      this.$refs["wechat"].showQrCode(this.tenantId);
    },
    wechatSuccess(user) {
      this.loginSuccess(user);
    },
    onlogin(user) {
      if (!user) {
        user = this.getCurrentUser;
      }
      if (user && user.userId > 0) {
        this.logined = true;
        this.displayName = user.displayName;
      } else {
        this.logined = false;
        this.displayName = null;
      }
      this.fetchTenant();
    },
    login() {
      if (!this.loginName) {
        this.$message.error("请输入登录名");
        return;
      }
      if (!this.password) {
        this.$message.error("请输入密码");
        return;
      }
      // 密码处理
      let password = this.password;
      let ticket = utils.dateFormat(new Date(), "yyyyMMddhhmmss");
      password = md5(password) + ticket;
      password = md5(password) + ticket;
      let that = this;
      axios
        .fetch("userServer", "/user/login", {
          appNo: "console",
          loginName: this.loginName,
          password,
          tenantId: this.tenantId
        })
        .then((res) => {
          if (res.code == 200) {
            that.$message.success("登录成功");
            that.password = null;
            that.loginSuccess(res.data);
          }
        });
    },
    async loginSuccess(user) {
      await axios.fetchCurrentUser();
      this.onlogin(user);
      // this.gotoDesktop();
      let redirect = this.$route.query.redirect;
      if (redirect) {
        window.location.replace(redirect);
      } else {
        this.gotoDesktop();
      }
    },
    logout() {
      let that = this;
      axios.fetch("userServer", "/user/logout", {}).then((res) => {
        if (res.code == 200) {
          that.$message.success("登出成功");
          store.commit(types.SetCurrentUser, {
            user: {}, // 空对象为了保存其他信息，比如租户信息
          });
          that.onlogin();
        }
      });
    },
    gotoDesktop() {
      _menu.gotoDesktop(this, true);
    },
  },
};
</script>

<style lang="less">
.ub-console {
  .ub-tabs {
    .el-tabs__nav {
      border-radius: inherit;
      border: inherit;
    }
    .el-tabs__item {
      border-top: 1px solid transparent;
      font-size: 16px;
      &.is-active {
        border-top: 1px solid #e4e7ed;
      }
    }
  }
  .validation {
    p {
      width: 65%;
      text-align: left;
      font-size: 16px;
      color: #333;
      left: 17%;
      position: relative;
      margin-bottom: 10px;
      margin-top: 5px;
    }
    .element {
      width: 65%;
      height: 55px;
      border-radius: 4px;
      font-size: 16px;
      .el-input-group__append {
        background-color: inherit;
        color: inherit;
        border: inherit;
        border-radius: inherit;
        padding: inherit;
        width: 1%;
        button {
          width: 120px;
          height: inherit;
          border-radius: inherit;
          margin: inherit;
          border: 1px solid #dcdfe6;
          &:active {
            border: 1px solid #409eff;
          }
          &:hover {
            border: 1px solid #409eff;
          }
        }
      }
    }
  }
}
</style>