<template>
  <el-image v-bind="$attrs" :src="showSrc" v-show="showSrc" :preview-src-list="previewSrcList">
    <div slot="placeholder">加载中</div>
  </el-image>
</template>

<script>
export default {
  name: "ubImage",
  props: {
    src: String,
    defaultSrc: {
      type: String,
      default: '//image.youbankeji.com/static/console/elder_photo.png'
    },
    imageStyle: String // 阿里云图片处理样式名称
  },
  computed: {
    previewSrcList() {
      return [this.imageSrc]
    },
    imageSrc() {
      return this.src ? this.src : this.defaultSrc;
    },
    showSrc() {
      if(!this.src) {
        return this.defaultSrc;
      }
      return this.imageStyle ? `${this.src}!${this.imageStyle}` : this.src;
    }
  }
}
</script>