<template>
  <el-row class="picture" v-bind="$attrs">
    <el-col
      class="upload_image"
      :span="span"
      v-for="(url, index) in imageUrls"
      :key="url"
    >
      <el-image
        v-if="value && accept !== 'video/mp4'"
        class="picture-show"
        fit="cover"
        :src="url"
        :preview-src-list="imageUrls"
      ></el-image>
      <video
        style="width:148px;height:148px"
        type="video/mp4"
        controls="controls"
        v-if="value && accept === 'video/mp4'"
        :src="imageUrls.join(',')"
      ></video>
      <i v-if="showDelete" class="el-icon-error" @click="deleteImg(index)"></i>
    </el-col>
    <el-col :span="span">
      <ub-upload
        v-if="show"
        :accept="accept"
        :size="size"
        @success="uploadSuccess"
      >
        <i class="el-icon-plus picture-upload-icon"></i>
      </ub-upload>
    </el-col>
  </el-row>
</template>

<script>
import ubUpload from "@/components/upload";

export default {
  name: "ubPictures",
  components: { ubUpload },
  props: {
    showDelete: {
      type: Boolean,
      default: false
    },
    value: String,
    accept: {
      type: String,
      default: "image/jpg,image/jpeg,image/png"
    },
    span: {
      type: Number,
      default: 4
    },
    size: {
      type: Number,
      default: null
    },
    limit: Number // 最大允许上传个数
  },
  data() {
    return {
      imageUrls: [],
      show: true // 超出上传个数限制就隐藏上传
    };
  },
  watch: {
    value(val) {
      this.imageUrls = val ? val.split(",") : [];
    },
    imageUrls() {
      if (this.imageUrls.length === this.limit) {
        this.show = false;
      } else {
        this.show = true;
      }
    }
  },
  created() {
    console.log(this.size);
  },
  methods: {
    uploadSuccess(url, file) {
      this.imageUrls.push(url);
      this.$emit("input", this.imageUrls.join(","));
      this.$emit("success", url, file);
    },
    deleteImg(index) {
      this.imageUrls.splice(index, 1);
      this.$emit("input", this.imageUrls.join(","));
      this.$emit("deleteImg", index);
    }
  }
};
</script>

<style lang="less" scoped>
.picture {
  .upload_image {
    position: relative;
    .el-icon-error {
      position: absolute;
    }
  }
  .picture-show {
    width: 148px;
    height: 148px;
    overflow: hidden;
    border: solid 1px #bfccda;
  }

  /deep/ .el-upload {
    border: 1px dashed #bfccda;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #fafdff;
  }
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
  .picture-upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
}
</style>
