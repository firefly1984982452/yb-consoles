<template>
  <div>
    <div id="print-area" ref="printArea" style="min-height:400px;">
      <table style="width:100%;">
        <thead>
          <tr>
            <td>
              <div id="print-header" class='header'>
                <el-row>
                  <el-col :span="24" style="text-align:center;font-size:20px;font-weight:300; margin-bottom:16px">
                    <span>{{tenantName}}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style="text-align:center;font-size:28px;font-weight:600;margin-bottom:16px;letter-spacing: 6px;">
                    <h2>{{periodName}}医嘱单</h2>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">姓名：{{elder.name}}</el-col>
                  <el-col :span="6">区域：{{elder.areaName}}</el-col>
                  <el-col :span="6">房间床位：{{elder.roomName}}-{{elder.bedName}}</el-col>
                  <el-col :span="6">住院号：{{elder.checkinNo}}</el-col>
                </el-row>
                <div style="margin:0px;overflow:hidden;width:calc(100% + 48px);float:left;">
                  <el-table :data="noData" ref="adviceTable" border class="ub-table" style="margin-left:-48px;" border default-expand-all="true" :row-class-name="tableRowClassName" @expand-change="expandSelect">
                    <el-table-column type="expand" width="0">
                      <template slot-scope="props">
                        <el-table :data="props.row.items" style="width: calc(100% - 47px);margin-left:47px;" :row-class-name="tableRowClassName(props)" v-if="props.row.itemCount>1">
                          <el-table-column prop="" label="开始时间" min-width="100"></el-table-column>
                          <el-table-column prop="" label="医生签名" min-width="70"></el-table-column>
                          <el-table-column prop="" label="护士签名" min-width="70"></el-table-column>
                          <el-table-column prop="name" :label="nameTitle()" min-width="150">
                            <template slot-scope="scope">
                              {{scope.row.name}}</br>{{scope.row.standard}}
                            </template>
                          </el-table-column>
                          <el-table-column prop="endTime" label="停止时间" min-width="100"></el-table-column>
                          <el-table-column prop="" label="医生签名" min-width="70"></el-table-column>
                          <el-table-column prop="" label="护士签名" min-width="70"></el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column prop="startTime" label="开始时间" min-width="100"></el-table-column>
                    <el-table-column prop="" label="医生签名" min-width="70"></el-table-column>
                    <el-table-column prop="" label="护士签名" min-width="70"></el-table-column>
                    <el-table-column prop="name" :label="nameTitle()" min-width="150">
                      <template slot-scope="scope">
                        {{scope.row.main.name}}</br>{{scope.row.main.standard}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="endTime" label="停止时间" min-width="100"></el-table-column>
                    <el-table-column prop="" label="医生签名" min-width="70"></el-table-column>
                    <el-table-column prop="" label="护士签名" min-width="70"></el-table-column>
                  </el-table>
                </div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div id="print-content" ref="printContent" :style="{'margin-top':contentMarinTop,'margin-bottom':contentMarinTop}">
                <div id="print-blank-lines" :style="{'margin-top':marinTop}"></div>
                <div style="margin:0px;overflow:hidden;width:calc(100% + 48px);float:left;min-height:400px;margin-top:-2px;">
                  <el-table :data="records" ref="adviceTable" border class="ub-table has-data" style="margin-left:-48px;" border default-expand-all="true" :row-class-name="tableRowClassName" @expand-change="expandSelect">
                    <el-table-column type="expand" width="0">
                      <template slot-scope="props">
                        <el-table :data="props.row.items" style="width: calc(100% - 47px);margin-left:47px;" :row-class-name="tableRowClassName(props)" v-if="props.row.itemCount>1">
                          <el-table-column prop="" label="开始时间" min-width="100"></el-table-column>
                          <el-table-column prop="" label="医生签名" min-width="70"></el-table-column>
                          <el-table-column prop="" label="护士签名" min-width="70"></el-table-column>
                          <el-table-column prop="name" :label="nameTitle()" min-width="150">
                            <template slot-scope="scope">
                              {{scope.row.name}}</br>{{scope.row.standard}}
                            </template>
                          </el-table-column>
                          <el-table-column prop="endTime" label="停止时间" min-width="100"></el-table-column>
                          <el-table-column prop="" label="医生签名" min-width="70"></el-table-column>
                          <el-table-column prop="" label="护士签名" min-width="70"></el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column prop="startTime" label="开始时间" min-width="100"></el-table-column>
                    <el-table-column prop="" label="医生签名" min-width="70"></el-table-column>
                    <el-table-column prop="" label="护士签名" min-width="70"></el-table-column>
                    <el-table-column prop="name" :label="nameTitle()" min-width="150">
                      <template slot-scope="scope">
                        {{scope.row.main.name}}</br>{{scope.row.main.standard}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="endTime" label="停止时间" min-width="100"></el-table-column>
                    <el-table-column prop="" label="医生签名" min-width="70"></el-table-column>
                    <el-table-column prop="" label="护士签名" min-width="70"></el-table-column>
                  </el-table>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-row style="margin:16px 8px 8px 8px;">
      <el-col :span="14">
        <el-button @click="close()">关 闭</el-button>
      </el-col>
      <el-col :span="10" class="right">
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
    return { printFrom: 1, lineCount: 0, noData: [] };
  },
  props: ["elder", "records", "printVisible", "tenantName", "periodName"],
  computed: {
    marinTop: function () {
      return 35 * this.lineCount + "px";
    },
    contentMarinTop: function () {
      if (this.printFrom > 1) {
        return 35 * 2 + "px";
      } else {
        return "0px";
      }
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
    expandSelect(row, expandedRows) {
      this.$refs.adviceTable.toggleRowExpansion(row, true);
    },
    tableRowClassName({ row }) {
      let className = "";
      if (row.status == 10) {
        className += " invalid";
      } else if (row.status == 2) {
        className += " running";
      } else if (row.status == 5) {
        className += " stopped";
      } else {
        className += " commit";
      }
      if (row.itemCount == 1) {
        className += " single";
      }
      return className;
    },
    getRowKeys(row) {
      return row.id;
    },
    init() {},
    nameTitle() {
      return this.periodName + "医嘱";
    },
    changeLine() {
      if (!this.printFrom) {
        this.printFrom = 1;
      }
      this.lineCount = 2;
      if (this.printFrom > 1) {
        this.lineCount += this.printFrom - 1;
        this.$forceUpdate();
      }
    },
    doPrint() {
      if (!this.printFrom) {
        this.printFrom = 1;
      }
      if (this.printFrom > 1) {
        $("html").append(
          "<style id='aaaa'>@page :first {margin-top: -105px;margin-bottom:0px} body{margin-bottom:70px}</style>"
        );
      } else {
        $("#aaaa").remove();
      }
      let data = this.records.map((item) => {
        if (!item.printTime) {
          return item.id;
        }
      });
      //保存打印时间
      axios
        .fetch("medicalServer", "/api/health-record/print", data, "json")
        .then((res) => {});
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
    color: #000000;
  }
}
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
/deep/ .blank-line {
  display: inline-block;
  height: 35px;
  line-height: 35px;
  width: 100%;
}

@page {
  size: 210mm 297mm;
  margin: 0px 35px 0px 35px;
}

/* @media screen {
  #print-blank-lines {
    display: none;
  }
} */

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
  #print-header {
    margin-top: 70px;
  }
}
@media screen {
  thead {
  }
  tfoot {
  }
}

@page {
  @bottom-left-corner {
    content: "&nbsp;&nbsp;&nbsp;&nbsp;";
  }
  @bottom-left {
    content: "&nbsp;&nbsp;&nbsp;&nbsp;";
  }
  @bottom-center {
    content: "&nbsp;&nbsp;&nbsp;&nbsp;";
  }
  @bottom-right-corner {
    content: "&nbsp;&nbsp;&nbsp;&nbsp;";
  }
  @bottom-right {
    content: "&nbsp;&nbsp;&nbsp;&nbsp;";
  }
}

figcaption:before {
  content: " ";
}

/deep/ .el-table__expanded-cell {
  padding: 0px;
}

/deep/ .has-data .el-table__header-wrapper {
  display: none;
}

/deep/ .el-table__expanded-cell table {
  border-left: 1px solid #080808;
}

/deep/ .el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid #080808;
}
/deep/ .el-table td {
  border-bottom: 1px solid #080808;
  border-top: 1px solid #080808;
}

/deep/ .el-table .expanded td {
  border-bottom: none;
}
/deep/ .el-table__expanded-cell .el-table__body tr:first-child td {
  border-top: none;
}

/deep/ .el-table__expanded-cell,
.el-table__expanded-cell .el-table__body tr:last-child td {
  border-bottom: none;
}

/deep/ .el-table__expanded-cell .el-table td {
  border-bottom: none;
  border-top: 1px solid #080808;
}

/deep/ .el-table--border::after,
.el-table--group::after,
.el-table::before {
  content: "";
  position: absolute;
  background-color: #080808;
  z-index: 1;
}

/deep/ .el-table th.is-leaf {
  border-top: 1px solid #080808;
  border-right: 1px solid #080808;
}
/deep/ .el-table .cell {
  line-height: 20px;
  height: 40px;
  color: #080808;
  page-break-after: always;
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
</style>
