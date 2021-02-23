<template>
  <div>
    <div id="printArea" ref="printArea" style="height:500px;width:100%;overflow:auto;">
      <table style="width:calc(100% - 1px);" :style="{'margin-top':marinTop}">
        <colgroup>
          <col name="el-table_2_column_1" width="60">
          <col name="el-table_2_column_2" width="300">
          <col name="el-table_2_column_3" width="45">
          <col name="el-table_2_column_4" width="60">
          <col name="el-table_2_column_5" width="45">
          <col name="el-table_2_column_5" width="70">
        </colgroup>
        <thead id="printHeader" v-if="printType!=0">
          <tr>
            <th colspan="7">
              <div style="float:right;margin-bottom:-32px;font-weight:normal;">
                第_____页
              </div>
              <div>
                <el-row>
                  <el-col :span="24" style="text-align:center;font-size:20px;font-weight:300;">
                    <span>{{tenantName}}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style="text-align:center;font-size:28px;font-weight:600;margin-bottom:15px;letter-spacing: 6px;">
                    <h2>{{periodName}}医嘱单</h2>
                  </el-col>
                </el-row>
                <el-row style="text-align:left">
                  <el-col :span="4" offset="2">姓名：{{elderPrint.name}}</el-col>
                  <el-col :span="5">区域：{{elderPrint.areaName}}</el-col>
                  <el-col :span="6">房间床位：{{elderPrint.fullBedName}}</el-col>
                  <el-col :span="7">入院号：{{elderPrint.checkinNo}}</el-col>
                </el-row>
              </div>
            </th>
          <tr class="el-table__header">
            <th>
              <div class="cell">日期时间</div>
            </th>
            <th>
              <div class="cell">{{nameTitle()}}</div>
            </th>
            <th>
              <div class="cell">医生签名</div>
            </th>
            <th>
              <div class="cell">执行时间</div>
            </th>
            <th>
              <div class="cell">护士签名</div>
            </th>
            <th>
              <div class="cell">备注</div>
            </th>
          </tr>
        </thead>
        <tbody class="el-table">
          <template v-for="(group,index) in records">
            <tr class="content-line" v-for="(item,itemIndex) in group.children" :class="{'first-line':index==0 && itemIndex ==0 }">
              <td>
                <span class="usage date" v-if="item.sortId ==1">
                  {{group.startTime}}
                </span>
              </td>
              <td>
                <span class="usage">
                  <span v-if="group.itemCount>1">
                    <span v-if="item.sortId ==1">┏</span>
                    <span v-else-if="item.sortId==group.itemCount">┗</span>
                    <span v-else>┃</span>
                  </span>
                  <span v-else>
                    &nbsp;
                  </span>
                  {{item.name}} {{item.useCount}}{{item.useUnit}}</span>
                <span class="usage usage-line" v-if="item.sortId ==1">{{usage(group)}}</span>
                <span class="usage usage-line" v-else>&nbsp;</span>
              </td>
              <td>
                <div class="cell">&nbsp;</div>
              </td>
              <td>
                <span class="usage date" v-if="item.sortId ==1">
                  {{group.stopTime}}
                </span>
              </td>
              <td>
                <div class="cell">&nbsp;</div>
              </td>
              <td>
                <div class="cell">&nbsp;</div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <el-row style="margin:16px 8px 8px 8px;">
      <el-col :span="14">
        <el-button @click="close()">关 闭</el-button>
      </el-col>
      <el-col :span="10" class="right">
        <div v-if="printType==0" style="display:inline">从第 <input class="el-input__inner" v-model.trim="printFrom" oninput="value=value.replace(/[^0-9]/g,'')" @change="changeLine" style="width:50px" :max="maxLine" min="1" /> 行开始打印</div>
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
import utils from "../utils";
Vue.use(Print);

export default {
  data() {
    return {
      printFrom: 1,
      elderPrint: {},
      maxLine: 24,
    };
  },
  props: [
    "elder",
    "records",
    "printVisible",
    "tenantName",
    "periodName",
    "printType", //0:表格内容；1：空模板；2：长者模板
  ],
  computed: {},
  watch: {
    elder: "init",
    records: "init",
    printType: "init",
  },
  mounted() {
    $("#printStyle").remove();
  },
  components: {},
  created() {
    this.init();
  },
  methods: {
    ...utils,
    marinTop: function () {
      if (this.printType == 0) {
        return 36 * this.printFrom + 154 + "px";
      } else {
        return "0px";
      }
    },
    close() {
      this.$emit("close");
    },
    changeLine() {
      this.$forceUpdate();
    },
    init() {
      if (this.printType == 1) {
        this.elderPrint = {};
      } else {
        this.elderPrint = this.elder;
        this.elderPrint.fullBedName =
          this.elder.roomName + "-" + this.elder.bedName;
      }
      if (this.printType == 0 || this.printType == 4) {
        for (var i in this.records) {
          this.records[i].children = [];
          this.records[i].children.push(this.records[i].main);
          if (this.records[i].itemCount > 1) {
            this.records[i].children.push(...this.records[i].items);
          }
          let usage = "";
          if (this.records[i].way) {
            usage += this.records[i].way + "　";
          }
          if (this.records[i].rate) {
            usage += this.records[i].rate;
          }
          this.records[i].usage = usage;
        }
      } else {
        for (var i = 0; i < this.maxLine; i++) {
          this.records[i] = { children: [{}] };
        }
      }
    },
    nameTitle() {
      return this.periodName + "医嘱";
    },
    doPrint() {
      $("#printStyle").remove();
      if (this.printType == 0) {
        $("html").append(
          "<style id='printStyle'>@page :first{margin-top:" +
            this.marinTop() +
            "!important;} @page{margin-top:195px!important;} @media print{ .el-table td { border: 1px solid #FFFFFF !important;}}</style>"
        );
      }
      let data = [];
      for (var i in this.records) {
        if (!this.records[i].printTime && this.records[i].id) {
          data.push(this.records[i].id);
        }
      }
      //保存打印时间
      if (data && data.length > 0) {
        axios
          .fetch(
            "medicalServer",
            "/api/admin/advice/print-groups",
            data,
            "json"
          )
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
.header .el-col :nth-child(1) {
  margin-right: 8px;
}
.header .el-col :nth-child(2) {
  font-weight: 700;
}
#printHeader,
#print-content {
  line-height: 35px;
  padding-left: 10px;
  padding-right: 10px;
}
.record div {
  display: inline-block;
  width: 100%;
  page-break-after: avoid;
  page-break-before: avoid;
}

.dialog-footer {
  width: 100%;
  padding: 16px;
  bottom: 0px;
  display: block;
  z-index: 100;
}

#printBlankLines {
  visibility: hidden;
}

@media print {
  * {
    -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
    color-adjust: exact !important; /*Firefox*/
    color: #000000;
  }
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
  @page {
    size: 210mm 297mm;
    margin: 30px 30px 66px 30px;
  }
}
@media screen {
  thead {
  }
  tfoot {
  }
}
#printArea {
  color: #000000 !important;
}

/deep/ .el-table__expanded-cell {
  padding: 0px;
}

/deep/ .has-data .el-table__header-wrapper {
  display: none;
}

/deep/ .el-table td {
  border: 1px solid #000000;
  color: #000000;
}
/deep/ .el-table__header th {
  border-top: 1px solid #000000;
  border-left: 1px solid #000000;
  border-right: 1px solid #000000;
  color: #000000;
}

/deep/ .el-table .cell,
.el-table__header .cell {
  height: 35px;
  line-height: 35px;
  vertical-align: middle;
  color: #000000;
  page-break-after: always;
  font-size: 12px;
  overflow: hidden;
  padding: 0px 2px;
}

/deep/ .el-table .date {
  width: 100%;
}
/deep/ .el-table td {
  padding: 0px;
}
/deep/.el-table th {
  padding: 0px;
}
/deep/ .el-table__empty-block {
  display: none;
}
/deep/ table {
  border-collapse: collapse;
}
/deep/ .blank-lines td {
  border: none;
  height: 35px;
  line-height: 35px;
}
/deep/ .el-table--border::after,
.el-table--group::after,
.el-table::before {
  content: "";
  position: absolute;
  background-color: #fff;
  z-index: 1;
}
.printed {
  color: rgb(199, 199, 199);
}
/deep/ .usage {
  width: 48%;
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  overflow: hidden;
  padding: 0px 2px;
  max-height: 35px;
  line-height: 17px;
  page-break-after: always;
}
</style>
