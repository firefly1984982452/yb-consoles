<template>
  <el-upload v-bind="$attrs" :limit="limit" :action="uploadPolicy.uploadUrl" :show-file-list="showFileList" :accept="accept"
    :before-upload="beforeUpload" :on-exceed="handleExceed" :file-list="fileList" :on-success="uploadSuccess" :on-error="uploadFailed" :data="uploadPolicy.policy">
    <slot></slot>
  </el-upload>
</template>

<script>
import axios from "axios";

export default {
  name: "ubUpload",
  props: {
    value: String,
    limit: Number,// 最大允许上传个数
    description: String,
    showFileList: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/jpg,image/jpeg,image/png'
    },
    // 文件上传限制的大小
    size: {
      type: Number,
      default: null
    },
  },
  created () {
    console.log(this.$attrs);
  },
  data() {
    return {
      uploadPolicy: {},
      fileList:[]
    }
  },
  methods: {
    beforeUpload(file) {
      // console.log(file.type,this.accept);
      // console.log(this.accept.includes(file.type));
        if(!this.accept.includes(file.type)){
          let message = this.accept === 'video/mp4' 
              ? "请上传正确的格式,视频只支持mp4格式!"
              : "请上传正确的格式,图片只支持jpg,jpeg,png格式";
          this.$message.error(message);
          return false;
        } 
        if(this.size && file.size / 1024 / 1024 > this.size){
          this.$message.error(`上传图片大小不能超过${this.size}MB!`);
          return false;
        }
        return new Promise((resolve, reject) => {
          axios.fetch("commonServer", "/upload/getOssPolicy", { from: "web", description: this.description,  fileName: file.name, mimeType: file.type, size: file.size }).then(res => {
            this.uploadPolicy = res.data;
            this.uploadPolicy.policy.success_action_status = "200";
            resolve();
          });
        });
    },
    uploadSuccess(response, file, fileList) {
      // console.log(file);
      this.$emit('input', this.uploadPolicy.resourceUrl);
      this.$emit('success', this.uploadPolicy.resourceUrl, file);
    },
    uploadFailed(err, file, fileList) {
      this.$message.error(err);
    },
    // 文件超出个数限制时的钩子
    handleExceed(){
      this.$message.error('图片数量超出限制!')
    }
  }
}
</script>