<template>
  <div>
    <el-dialog title="绑定微信" :visible.sync="visible" @opened="dialogOpened" width="400px" center top="20vh" modal="true">
        <div class="qrcode">
          <div id="wechat_qrcode"></div>
          <div class="qrcode-tips" v-if="resultCode == 400" @click="dialogOpened">
            <i class="el-icon-warning qrcode-error"></i>
          </div>
          <div class="qrcode-tips" v-if="resultCode == 404" @click="dialogOpened">
            <i class="el-icon-refresh qrcode-warning"></i>
            <b>已过期</b>
          </div>
          <div class="qrcode-tips" v-if="resultCode == 200" @click="visible = false">
            <i class="el-icon-success qrcode-success"></i>
            <b>绑定成功</b>
          </div>
          <div class="qrcode-tips" v-if="qrCodeLoading">
            <i class="el-icon-loading"></i>
          </div>
        </div>
        <span slot="footer">
          <span class="qrcode-error" v-if="message">{{ message }}</span>
          <span v-else>请【{{ employeeName }}】打开微信扫码（5分钟内有效）</span>
          <div v-if="isBinded" class="space"></div>
          <el-link v-if="isBinded" @click="unbind" type="primary">此账号已绑定微信，点击这里解除绑定</el-link>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";

export default {
  data() {
    return {
      visible: false,
      resultCode: null,
      employeeId: null,
      employeeName: null,
      qrCodeLoading: false,
      qrCodeInstance: null,
      token: null,
      message: null,
      isBinded: false,
      openId: null,
    }
  },
  methods: {
    showQrCode(employeeId, employeeName) {
      this.employeeId = employeeId;
      this.employeeName = employeeName;
      this.resultCode = 202;
      this.visible = true;
    },
    dialogOpened() {
      this.qrCodeLoading = true;
      axios.fetch('userServer', '/wechat/getBindingUrl', { appNo: "console", employeeId: this.employeeId }).then(res => {
        let data = res.data;
        let url = data.url;
        if(!this.qrCodeInstance) {
          this.qrCodeInstance = new QRCode("wechat_qrcode", {
            width: 150,
            height: 150,
            text: url, // 二维码内容
            colorDark: "#000", //前景色
            colorLight: "#fff", //背景色
            correctLevel: QRCode.CorrectLevel.L //容错等级
          });
        } else {
          this.qrCodeInstance.clear();
          this.qrCodeInstance.makeCode(url);
        }
        this.token = data.token;
        this.message = null;
        this.isBinded = data.binded;
        this.openId = data.openId;
        this.qrCodeLoading = false;
        setTimeout(this.handleResult, 1000);
      });
    },
    handleResult() {
      axios.fetch('userServer', '/wechat/result', { token: this.token }, "form", "POST", false, {
        202: res => { // 等待扫码
          this.resultCode = 202;
          if(this.visible) {
            setTimeout(this.handleResult, 1000);
          }
        },
        404: res => { // 令牌已过期
          this.resultCode = 404;
        },
        400: res => { // 错误
          this.resultCode = 400;
          this.message = res.message;
        }
      }).then(res => { // 绑定成功
        this.resultCode = 200;
      });
    },
    unbind() {
      let that = this;
      this.$confirm("确认要解除绑定吗？").then(() => {
        axios.fetch('userServer', '/wechat/unbind', { openId: that.openId }).then(res => {
          that.isBinded = false;
          that.openId = null;
          that.$message({
            message: '解绑成功',
            type: 'success'
          });
        });
      }).catch(() => {});
    },
  }
}
</script>

<style lang="less" scoped>
.qrcode {
  text-align: center;
  height: 150px;
  padding: 0px 100px 0px 100px;
  #wechat_qrcode {
    width: 150px;
    height: 150px;
    position: absolute;
  }
  .qrcode-tips {
    width: 150px;
    height: 150px;    
    position: absolute;
    background-color: #ffffffee;
    text-align: center;
    padding-top: 35px;
    cursor: pointer;
    i { font-size: 80px; display: block; }
  }
}
.qrcode-warning {
  color: #E6A23C;
}
.qrcode-success {
  color: #67C23A;
}
.qrcode-error {
  color: #F56C6C;
}
.space {
  height: 10px;
}
</style>