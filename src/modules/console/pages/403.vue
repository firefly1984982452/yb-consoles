<template>
  <ul>
    <li class='welcome'>
      <i class="el-icon-remove warning"></i><br>
      <span>403</span>
    </li>
    <li class="item">
      <p>&nbsp;</p>
      <p>抱歉，您无权限访问！！！</p>
      <p><el-link @click="gotoLast()">点击这里返回上一页</el-link></p>
      <p><el-link @click="gotoIndex()">点击这里返回工作台</el-link></p>
      <p><el-link @click="logout()">切换账号请点击这里退出</el-link></p>
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
import types from '@/store/types'

export default {
  methods: {
    logout() {
      let that = this;
      axios.fetch("userServer", "/user/logout", { }).then(res => {
        if (res.code == 200) {
          that.$message({
            message: "登出成功",
            type: "success"
          });
          that.$router.push({ name: 'Login' });
        }
      })
    },
    gotoIndex() {
      this.$router.push('/desktop');
    },
    gotoLast() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.warning {
  font-size: 100px;
  color: #F56C6C;
}
</style>