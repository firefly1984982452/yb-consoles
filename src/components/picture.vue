<template>
  <ub-upload class="picture" v-bind="$attrs" @success="uploadSuccess" :accept="accept" @beforeUpload="beforeUpload">
    <el-image v-if="value&&accept!=='video/mp4'" class="picture-show" fit="cover" :src="value"></el-image>
    <video style="width:148px;height:148px" v-if="value&&accept==='video/mp4'" :src="value"></video>
    <i v-if="!value" class="el-icon-plus picture-upload-icon"></i>
  </ub-upload>
</template>

<script>
import ubUpload from "@/components/upload";

export default {
  name: "ubPicture",
  components: { ubUpload },
  props: {
    value: String,
    accept: {
      type: String,
      default: "image/jpg,image/jpeg,image/png",
    },
  },
  methods: {
    uploadSuccess(url,file) {
      this.$emit('input', url);
      // console.log(file,'====file');
      this.$emit('success',file)
    }
  },
}
</script>

<style lang="less" scoped>
.picture {
  .picture-show {
    width: 148px;
    height: 148px;
    overflow: hidden;
    border: solid 1px #BFCCDA;
  }

  /deep/ .el-upload {
    border: 1px dashed #BFCCDA;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: #FAFDFF;
  }
  /deep/ .el-upload:hover {
    border-color: #409EFF;
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