<!--有侧边菜单的布局（大部分页面均以此页面为母版）-->
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
        <div class="view-container">
          <!-- <router-view /> -->
          <keep-alive>
              <router-view v-if="$route.meta.keepAlive">
              </router-view>
          </keep-alive>
          
          <router-view v-if="!$route.meta.keepAlive">
              <router-view /> 
          </router-view>
          <div class="footer">技术支持 有伴（上海）智能科技有限公司</div>
        </div>
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
@import url('../assets/styles/page.less');
</style>