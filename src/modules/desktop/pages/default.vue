<template>
  <div class="desktop">
		<img src="//image.youbankeji.com/static/console/desktop.png" />
    <div class="support">技术支持：有伴（上海）智能科技有限公司</div>
	</div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
.desktop {
  width: 100%;
  height: 100%;
  background: #1287FE;
  overflow: hidden;

  img {
    width: 100%;
    object-fit: cover;
  }
  
  .support {
    position: absolute;
    width: 100%;
    bottom: 35px;
    color: #fff;
    font-size: 20px;
    text-align: center;
  }
}
</style>