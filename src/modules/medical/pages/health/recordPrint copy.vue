<template>
  <div class="print-container">
    <div id="print-area" class="page" ref="printArea" style="min-height:400px;">
      <div id="print-header" class='header'>
        <el-row>
          <el-col :span="6">姓名：{{elder.name}}</el-col>
          <el-col :span="6">区域：{{elder.areaName}}</el-col>
          <el-col :span="6">房间床位：{{elder.roomName}}-{{elder.bedName}}</el-col>
          <el-col :span="6">住院号：{{elder.checkinNo}}</el-col>
        </el-row>
      </div>
      <div id="print-content" ref="printContent">
        <div id="print-blank-lines" :style="{'margin-top':marinTop}"></div>
        <div v-for="(item,index) in records" :key="index" class="record">
          <div>
            <div class="date">{{item.createTime}}</div>
          </div>
          <div>
            <div class="item">{{item.content}}</div>
          </div>
          <div>
            <div class="doctor">医生：<span class="sign">&nbsp;</span></div>
          </div>
        </div>
      </div>
    </div>
    <el-row style="margin:16px 8px 8px 8px;">
      <el-col :span="4">
        <el-button @click="close()">关 闭</el-button>
      </el-col>
      <el-col :span="20" class="right">
        从纸张第 <input class="el-input__inner" v-model.trim="printFrom" oninput="value=value.replace(/[^0-9]/g,'')" @change="changeLine" style="width:50px" max="33" min="1" /> 行开始打印
        <el-button type="primary" @click="doPrint()">打 印</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";
import settings from "@/settings";
import Print from "@/utils/printjs";
Vue.use(Print);
export default {
  data() {
    return { printFrom: 1, lineCount: 0 };
  },
  props: ["elder", "document", "records", "printVisible"],
  computed: {
    marinTop: function () {
      return 35 * this.lineCount + "px";
    },
  },
  watch: {
    elder: "init",
    records: "init",
  },
  mounted() {},
  components: {},
  created() {
    this.init();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    init() {},
    changeLine() {
      if (!this.printFrom) {
        this.printFrom = 1;
      }
      if (this.printFrom == 1) {
        this.lineCount = 2;
      } else {
        this.lineCount = 3;
      }
      if (this.printFrom > 1) {
        this.lineCount += this.printFrom - 1;
        this.$forceUpdate();
      }
    },
    doPrint() {
      if (!this.printFrom) {
        this.printFrom = 1;
      }
      let id = "print-area";
      if (this.printFrom > 1) {
        id = "print-content";
      }
      this.$nextTick(() => {
        if (this.printFrom > 1) {
          this.$print(this.$refs.printContent);
        } else {
          this.$print(this.$refs.printArea);
        }
      });
    },
    submitForm() {
      let that = this;
      this.form.elderId = this.elder.id;
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          return true;
        } else {
          let created = !this.form.id;
          axios
            .fetch("medicalServer", "/api/health-record", this.form, "json")
            .then((res) => {
              var msg = "";
              if (!created) {
                msg = "修改成功";
              } else {
                msg = "添加成功";
              }
              this.$message.success(msg);
              this.fetchData();
              this.dialogFormVisible = false;
            });
        }
      });
    },
  },
};
</script>
<style type="text/css" media="print" scoped>
@media print {
  * {
    -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
    color-adjust: exact !important; /*Firefox*/
  }
  #print-header {
    padding-top: 70px;
  }
  #print-blank-lines {
    display: inline;
  }
}
</style>
<style scoped>
print-container {
  padding: 0px 8px;
}
.name {
  display: inline-block;
  vertical-align: top;
}
.name p {
  margin: 0px;
  padding: 0px;
  height: 18px;
}
/* .header {
  padding: 20px;
} */
.header .el-col :nth-child(1) {
  margin-right: 8px;
}
.header .el-col :nth-child(2) {
  font-weight: 700;
}
#print-header,
#print-content {
  line-height: 35px;
  padding-left: 10px;
  padding-right: 10px;
}
.record div {
  display: inline-block;
  width: 100%;
}

#print-content .date,
#print-content .item,
#print-content .doctor {
  /* border-bottom: 1px solid #606266; */
  /* text-decoration: underline; */
  /* height: 35px; */
  background-image: url("../../../../assets/images/under-line.jpg");
  background-size: 136px 35px;
  line-height: 35px;
}

#print-content .item {
  text-indent: 2em;
}
#print-content .doctor {
  text-align: right;
}
#print-content .sign {
  width: 120px;
  display: inline-block;
}

.dialog-footer {
  width: 100%;
  padding: 16px;
  bottom: 0px;
  display: block;
  z-index: 100;
}
/deep/ .blank-line {
  display: inline-block;
  height: 35px;
  line-height: 35px;
  width: 100%;
}

@page {
  size: auto;
  margin: 0px 70px;
}

@media screen {
  #print-blank-lines {
    display: none;
  }
}
.header {
  position: running(header);
}

@page {
  @top-center {
    content: element(header);
  }
}
@media print {
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
}
@media screen {
  thead {
    display: none;
  }
  tfoot {
    display: none;
  }
}
</style>