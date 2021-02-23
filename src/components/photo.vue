<template>
  <div class="photo" v-bind="$attrs">
    <ub-image class="image" fit="cover" :src="value" :defaultSrc="defaultSrc"></ub-image>
    <ub-upload :description="photoDescription" v-model="value" @success="uploadSuccess">
      <el-button class="button">{{ buttonTitle }}</el-button>
    </ub-upload>
  </div>
</template>

<script>
import ubUpload from "@/components/upload";
import ubImage from "@/components/image";
import defaultImages from "./_photo";

export default {
  name: "ubPhoto",
  components: { ubUpload, ubImage },
  props: {
    value: String,
    description: String,
    title: String,
    defaultImage: String,
    category: String
  },
  data() {
    return {
      buttonTitle: "上传照片",
      photoDescription: null,
      defaultSrc: defaultImages.defaultSrc
    }
  },
  created() {
    let info = defaultImages[this.category];
    if(info) {
      this.buttonTitle = info.title;
      this.photoDescription = info.description;
      this.defaultSrc = info.image;
    }
    if(this.title) {
      this.buttonTitle = this.title;
    }
    if(this.description) {
      this.photoDescription = this.description;
    }
    if(this.defaultImage) {
      this.defaultSrc = this.defaultImage;
    }
  },
  methods: {
    uploadSuccess(url) {
      this.$emit('input', url);
    }
  }
}
</script>

<style lang="less" scoped>
.photo {
  text-align: center;

  .image {
    width: 180px !important;
    height: 120px;
  }
  .button {
    width: 180px !important;
    margin-top: 20px;
  }
}
</style>