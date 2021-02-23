<template>
  <div>
    <el-row type="flex">
      <!--菜单按钮-->
      <el-col :span="1" class="home">
        <el-button @click="showMenu" plain :class="menuVisible ? 'menuopen' : 'menuclose'">
          <!-- <i v-if="$route.path == '/desktop/leader'" class="iconfont icondahualogo3 logo"></i>
          <i v-else class="iconfont iconbiaotilan-tubiao-gongnengqiehuantubiao-caise"></i> -->
          <i :class="iconfont"></i>
        </el-button>
      </el-col>
      <!--导航面包屑-->
      <el-col :span="22" class="breadcrumb">
        <span v-if="$route.meta && $route.meta.title">{{ title }} &gt; {{ $route.meta.title }}</span>
        <span v-else>{{ title }}</span>
      </el-col>
      <!--个人信息-->
      <el-col :span="1" class="user">
        <main-user></main-user>
      </el-col>
    </el-row>
    <!--主菜单-->
    <main-menu :menuVisible="menuVisible" @clickMenu="clickMenu"></main-menu>
  </div>
</template>

<script>
import MainMenu from '@/components/menu.vue';
import MainUser from '@/components/user';
import tenant from '@/components/_tenant';

export default {
  name: 'main-header',
  components: { MainMenu, MainUser },
  data() {
    return {
      title: '有伴云',
      iconfont: 'iconfont iconbiaotilan-tubiao-gongnengqiehuantubiao-caise',
      menuVisible: false
    }
  },
  created() {
    this.initTenant();
  },
  methods: {
    showMenu() {
      this.menuVisible = !this.menuVisible;
    },
    clickMenu(visible) {
      this.menuVisible = visible;
    },
    initTenant() {
      tenant.fetchCurrentTenant().then(t => {
        this.title = t.tenantName; // 租户名称
        this.iconfont = tenant.getTenantSettingValue('logo_iconfont', t, this.iconfont);
        tenant.updateFavicon(t);
      });
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100px;

  i {
    font-size: 1.4rem;
  }
  button {
    height: 60px;
    width: 100px;
    border-radius: 0;
    border: 1px solid #30409F;
    background-color: #30409F;
    color: #fff;
  }
  .menuclose {
    color: #fff;
    background-color: #30409F;
    border: 1px solid #30409F;
  }
  button.menuclose:hover {
    color: #038CDB;
  }
  .menuopen {
    color: #000;
    border: 1px solid #fff;
    background-color: #fff;
  }
  .menuopen:hover {
    color: #038CDB;
  }
  .logo {
    font-size: 2.5rem;
  }
}
.breadcrumb {
  padding-top: 17px;
  padding-left: 20px;
  font-size: 20px!important;
}
.user {
  padding-top: 12px;
  width: 150px;
  text-align: right;
  padding-right: 20px;
}
</style>