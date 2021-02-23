<template>
  <div class="users">
    <el-tooltip class="item" effect="dark" :content="displayName" placement="bottom">
      <el-button>
        <i class="iconfont iconbiaotilan-tubiao-touxiang"></i>
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
      <el-button @click="logout()">
        <i class="iconfont iconbiaotilan-tubiao-tuichu logout"></i>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
import { axios } from 'youban-utils';
import store from "@/store";
import types from '@/store/types';

export default {
  name: 'main-user',
  data() {
    return {
      displayName: "个人信息"
    }
  },
  created() {
    let currentUser = axios.getCurrentUser();
    if(currentUser && currentUser.displayName) {
      this.displayName = currentUser.displayName;
    }
  },
  methods: {
    logout() {
      //TODO 与login.vue优化
      let that = this;
      this.$confirm('确认要退出系统吗?', '', { type: 'warning' }).then(() => {
        axios.fetch("userServer", "/user/logout").then(res => {
          if (res.code == 200) {
            that.$message({
              message: "退出成功",
              type: "success"
            });
            store.commit(types.SetCurrentUser, {
              user:  { } // 空对象为了保存其他信息，比如租户信息
            });
            that.$router.push({
              name: 'PassportLogin',
              query: { redirect: window.location.href }
            });
          }
        })
      }).catch(() => {});
    }
  }
}
</script>

<style lang="less" scoped>
.users {
  button {
    padding: 6px;
    background-color: transparent;
    color: #fff;
    border: none;

    i {
      font-size: 24px;
    }
  }
  button:hover {
    color: #038CDB;
  }
  .logout {
    font-size: 22px;
  }
}
</style>