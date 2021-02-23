<template>
  <div>
    <EmployeeHeader></EmployeeHeader>
    <div class="content mycontent">
      <el-row class="block">
        <el-col>
          <s class="bar"></s>
          <span>证件信息</span>
          <span class="tips">请确保照片的内容完整并清晰可见，图片大小小于5M</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="picture-container" :span="4" v-for="item in listData" :key="item.attachmentId">
          <el-image class="picture-show" fit="cover" :src="item.url" :preview-src-list="imageUrls"></el-image>
          <div class="picture-show-title">{{ item.title }}</div>
        </el-col>
        <el-col :span="4">
          <ub-upload class="picture-upload" @success="uploadSuccess">
            <i class="el-icon-plus picture-upload-icon"></i>
          </ub-upload>
          <div class="picture-upload-title">添加证件</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import EmployeeHeader from "./employeeHeader";
import ubUpload from "@/components/upload";
import ubImage from "@/components/image";

export default {
  components: { EmployeeHeader, ubUpload, ubImage },
  data() {
    return {
      listData: [],
      imageUrls: [],
      employeeId: null
    };
  },
  created() {
    this.employeeId = this.$route.query.employeeId;
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.fetch("oaServer", "/employee/attachment/get", { employeeId: this.employeeId }).then(res => {
        this.listData = res.data;
        res.data.forEach(element => {
          this.imageUrls.push(element.url);
        });
      });
    },
    uploadSuccess(url, file) {
      this.$prompt("请输入证件描述，比如身份证：", {
        inputPlaceholder: "证件描述",
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputValue: file.name,
        inputValidator: function (val) {
          return val !== null;
        }
      }).then(({ value }) => {
        let data = { employeeId: this.employeeId, title: value, url: url };
        axios.fetch("oaServer", "/employee/attachment/create", data).then(res => {
          this.listData.push(data);
          this.imageUrls.push(url);
          this.$message.success("添加成功");
        });
      });
    }
  }
};
</script>

<style scoped>
.mycontent {
 padding: 20px;
}
.block {
  margin-bottom: 15px;
  padding: 0 0 10px 0;
  border-bottom: 1px solid darkgrey;
}
.bar {
  display: inline-block;
  width: 4px;
  height: 20px;
  border-radius: 3px;
  position: relative;
  top: 4px;
  margin-right: 10px;
  background: #F36969;
}
.tips {
  color:#999;
  font-size:14px;
  font-weight:lighter;
}
.picture-container {
  text-align: center;
  padding-bottom: 15px;
}
.picture-show {
  width: 240px;
  height: 151px;
  overflow: hidden;
  border: solid 1px #BFCCDA;
}
.picture-show-title {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  text-align: center;
  font-weight:500;
}
.picture-upload {
  text-align: center;
}
.picture-upload >>> .el-upload {
  border: 1px dashed #BFCCDA;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: #FAFDFF;
}
.picture-upload >>> .el-upload:hover {
  border-color: #409EFF;
}
.picture-upload-icon {
  font-size: 28px;
  color: #8c939d;
  width: 240px;
  height: 151px;
  line-height: 151px;
  text-align: center;
}
.picture-upload-title {
  font-size: 14px;
  color: #999999;
  margin-top: 10px;
  text-align: center;
}
</style>