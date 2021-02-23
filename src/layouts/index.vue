<!--有侧边菜单的布局-->
<template>
  <el-container class="ub-container">
    <el-header class="head">
      <main-header></main-header>
    </el-header>
    <el-container>
      <!--侧边菜单-->
      <el-aside width="100px" class="aside">
        <main-left></main-left>
      </el-aside>
      <!--主内容区-->
      <el-main class="main withmenu">
        <router-view />
        <div class="footer">技术支持 有伴（上海）智能科技有限公司</div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MainHeader from '@/components/header';
import MainLeft from '@/components/left';

export default {
  components: { MainHeader, MainLeft }
}
</script>

<style lang="less">
</style>