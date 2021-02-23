<!--登录等全页面的布局-->
<template>
  <div class="ub-console">
    <div class="dialog">
      <router-view />
    </div>
    <div class="copyright">
      <p>技术支持：有伴（上海）智能科技有限公司</p>
      <p>&copy; 2019-2020 沪ICP备19015441号. All Rights Reserved. Uban Shanghai Technology Co. Ltd.</p>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
@import "../assets/styles/console.less";
</style>