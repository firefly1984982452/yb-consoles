<template>
  <div>
    <div id="printArea" ref="printArea">
      <table style="width: 100%;">
        <thead id="printHeader">
          <tr>
            <td>
              <div style="float:right;margin-right:16px;margin-bottom:-32px;font-weight:normal;">
                第_____页
              </div>
              <div>
                <el-row>
                  <el-col :span="24" style="text-align:center;font-size:20px;font-weight:300;">
                    <span>{{tenantName}}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style="text-align:center;font-size:28px;font-weight:600;margin-bottom:8px;letter-spacing: 6px;">
                    <h2>病程记录</h2>
                  </el-col>
                </el-row>
              </div>
              <div class="header">
                <el-row>
                  <el-col :span="6">姓名：{{elder.name}}</el-col>
                  <el-col :span="6">区域：{{elder.areaName}}</el-col>
                  <el-col :span="6">房间床位：{{elder.roomName}}-{{elder.bedName}}</el-col>
                  <el-col :span="6">入院号：{{elder.checkinNo}}</el-col>
                </el-row>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div id="printContent" ref="printContent">
                <div id="print-blank-lines" :style="{'margin-top':marinTop}"></div>
                <div v-for="(item,index) in records" :key="index" class="record">
                  <div>
                    <div class="date">{{item.createTime.substr(0,4)}}年{{item.createTime.substr(5,2)}}月{{item.createTime.substr(8,2)}}日</div>
                  </div>
                  <div>
                    <div class="item">{{item.content}}</div>
                  </div>
                  <div>
                    <div class="doctor">医生：<span class="sign">&nbsp;</span></div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-row style="margin:8px;">
      <el-col :span="14">
        <el-button @click="close()">关 闭</el-button>
      </el-col>
      <el-col :span="10" class="right">
        从第 <input class="el-input__inner" v-model.trim="printFrom" oninput="value=value.replace(/[^0-9]/g,'')" @change="changeLine" style="width:50px" max="33" min="1" /> 行开始打印
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
  props: ["elder", "records", "tenantName"],
  computed: {
    marinTop: function () {
      if (this.printFrom > 1) {
        return 36 * this.lineCount + 115 + "px";
      } else {
        return "0px";
      }
    },
  },
  watch: {
    elder: "init",
    records: "init",
  },
  mounted() {
    $("#printStyle").remove();
  },
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
      this.lineCount = 0;
      if (this.printFrom > 1) {
        this.lineCount = 4;
        this.lineCount += this.printFrom - 1;
      }
      $("#printStyle").remove();
      if (this.printFrom > 1) {
        $("html").append(
          "<style id='printStyle'>@page :first {margin-top: -185px;margin-bottom:0px} #printHeader {visibility: hidden !important;}@media print { #printHeader { visibility: visible !important;} </style>"
        );
      }
      this.$forceUpdate();
    },
    doPrint() {
      let data = [];
      for (var i in this.records) {
        if (!this.records[i].printTime) {
          data.push(this.records[i].id);
        }
      }
      //保存打印时间
      if (data && data.length > 0) {
        axios
          .fetch("medicalServer", "/api/health-record/print", data, "json")
          .then((res) => {});
      }
      this.$nextTick(() => {
        this.$print(this.$refs.printArea);
      });
    },
  },
};
</script>
<style scoped>
@media print {
  * {
    -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
    color-adjust: exact !important; /*Firefox*/
  }
}
#printArea {
  height: 500px;
  overflow: auto;
  width: 100%;
  color: #000000;
}

.header .el-col :nth-child(1) {
  margin-right: 8px;
}
.header .el-col :nth-child(2) {
  font-weight: 700;
}
.header {
  font-weight: 700;
}

.header,
#printContent {
  line-height: 35px;
  padding-left: 10px;
  padding-right: 10px;
}
.record div {
  display: inline-block;
  width: 100%;
}

#printContent .date,
#printContent .item,
#printContent .doctor {
  background-image: url("../../../../assets/images/under-line.png");
  background-size: 136px 35px;
  line-height: 35px;
}

#printContent .item {
  text-indent: 2em;
}
#printContent .doctor {
  text-align: right;
}
#printContent .sign {
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
  size: 210mm 297mm;
  margin: 35px;
}

@media print {
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
  body {
    margin: 70px 0px 0px 0px;
  }
}
</style>
