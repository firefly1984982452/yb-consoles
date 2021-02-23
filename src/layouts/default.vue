<!--无侧边菜单的布局-->
<template>
  <el-container class="ub-container">
    <el-header class="head">
      <main-header></main-header>
    </el-header>
    <el-container>
      <!--主内容区-->
      <el-main class="main full-width">
        <router-view />
        <div v-if="!$route.meta.nofooter" class="footer">技术支持 有伴（上海）智能科技有限公司</div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MainHeader from '@/components/header';

export default {
  components: { MainHeader }
}
</script>

<style lang="less">
</style>