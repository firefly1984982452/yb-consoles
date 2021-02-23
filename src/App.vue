<template>
  <div id="app" v-loading="$store.state.fxdata.isLoading">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
@import url('./assets/styles/base.css');
@import url('./assets/styles/layout.less');
@import url('./assets/styles/color.less');
</style>
