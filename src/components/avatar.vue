<template>
  <div class="avatar" v-bind="$attrs">
    <ub-image class="image" fit="cover" image-style="avatar" :src="value" :defaultSrc="defaultSrc"></ub-image>
    <ub-upload :description="photoDescription" v-model="value" @success="uploadSuccess">
      <el-button class="upload-button">{{ buttonTitle }}</el-button>
    </ub-upload>
    <el-button v-if="showFace" class="face-button" @click="updateFace">更新人脸信息</el-button>
  </div>
</template>

<script>
import axios from "axios";
import ubUpload from "@/components/upload";
import ubImage from "@/components/image";
import defaultImages from "./_photo";
import { permission } from "youban-utils";

export default {
  name: "ubAvatar",
  components: { ubUpload, ubImage },
  props: {
    value: String,
    description: String,
    title: String,
    defaultImage: String,
    category: String,
    valueId: Number
  },
  data() {
    return {
      buttonTitle: "上传照片",
      photoDescription: null,
      defaultSrc: defaultImages.defaultSrc,
      showFace: false
    }
  },
  created() {
    let facePermission;
    let info = defaultImages[this.category];
    if(info) {
      facePermission = info.facePermission;
      this.faceFrom = info.faceFrom;
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
    if(this.valueId && facePermission && permission.hasPermission(facePermission)) {
      this.showFace = true;
    }
  },
  methods: {
    uploadSuccess(url) {
      this.$emit('input', url);
    },
    updateFace() {
      axios.fetch('userServer', '/user/face/' + this.category, { valueId: this.valueId }).then(res => {
        this.$message.success("更新成功");
      });
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  text-align: center;

  .image {
    width: 150px !important;
    height: 200px;
  }
  .upload-button {
    width: 150px !important;
    margin-top: 20px;
  }
  .face-button {
    width: 150px !important;
    margin-top: 10px;    
  }
}
</style>