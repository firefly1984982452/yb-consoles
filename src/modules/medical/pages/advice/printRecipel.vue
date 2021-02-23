<template>
  <div>
    <div id="printArea" ref="printArea" style="min-height:500px;width:100%;overflow:auto;font-size:14px;">
      <div id=" print-header" class='header static-item' style="width:100%;">
        <el-row style="line-height:26px">
          <el-col :span="22">
            No.{{advice.adviceNo}}
          </el-col>
          <el-col :span="2" style="text-align:right;padding-right:16px;">
            <span class="circle">{{advice.category.substring(0,1)}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;font-size:24px;margin-bottom:16px">
            <h1>{{tenantName}}处方笺</h1>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            姓名：{{elder.name}}
          </el-col>
          <el-col :span="3">
            性别：{{elder.gender}}
          </el-col>
          <el-col :span="4">
            年龄：{{elder.age}}
          </el-col>
          <el-col :span="6">
            入院号：{{elder.checkinNo}}
          </el-col>
          <el-col :span="5">
            床位：{{elder.roomName}}-{{elder.bedName}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            科别：
          </el-col>
          <el-col :span="6">
            费别：{{advice.feeType}}
          </el-col>
          <el-col :span="7">
            医保号：{{elder.insuranceNo}}
          </el-col>
          <el-col :span="6">
            日期：{{advice.createTime.substring(0,10)}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            诊断：{{advice.diagnosis}}
          </el-col>
        </el-row>
        <div style="border-top:1px solid #000;padding-top:16px;margin-top:10px;">
          <i class="iconfont iconchufang1" style="font-size: 26px;font-weight: 700;"></i>
          <table style="border:none;">
            <tbody>
              <template v-for="(group,index) in adviceGroups">
                <template v-for="(item,itemIndex) in group.items">
                  <tr class="content-line">
                    <td style="width:18px;"><span style="font-size:12px" class="circle" v-if="itemIndex ==0">{{index + 1}}</span> </td>
                    <td style="width:364px;padding-right:48px;font-size:14px;">
                      {{item.name}}　{{item.standard}} <span class="kit-medicine" v-if="item.source==2">[自备/外配]</span>
                    </td>
                    <td style="width:106px;font-size:14px;">
                      <span v-if="group.items.length>1">{{item.useCount}}{{item.useUnit}}</span>
                    </td>
                    <td style="width:70px;text-align:right;font-size:14px;">
                      x {{item.quantity}}{{item.unit}}
                    </td>
                  </tr>
                  <tr v-if="group.items.length>=1 && itemIndex == group.items.length-1" class="group-line">
                    <td></td>
                    <td colspan="4" style="padding-left:32px;font-size:14px;">Sig：<span v-if="group.items.length==1">{{item.useCount}}{{item.useUnit}}　</span>{{usage(group,"　")}}
                      <span v-if="group.day">×{{group.day}}天</span>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        <el-row class="blank">
          <span> ------------　以下空白　------------ </span>
        </el-row>
        <div id="printFooter" style="position:absolute;bottom:0mm;width:100%;border-top:1px solid #000;margin:4px 0px;">
          <el-row>
            <el-col :span="9">
              审核/调配：
            </el-col>
            <el-col :span="9">
              核对/发药：
            </el-col>
            <el-col :span="6">
              医生：
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              金额：
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-row style="margin:16px;text-align:center;">
      <el-button v-if="showClose" @click="close()">关 闭</el-button>
      <el-button type="primary" icon="iconfont iconcaozuotubiao-dayin-xuanfu" @click="doPrint()">&nbsp;&nbsp;打印处方</el-button>
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
      lineCount: 0,
      adviceGroups: [],
      periods: {
        1: "长嘱",
        2: "临嘱",
      },
    };
  },
  // props: ["elder", "advice", "tenantName"],
  props: {
    elder: {
      type: Object,
      default: {},
    },
    advice: {
      type: Object,
      default: {},
    },
    tenantName: {
      type: String,
      default: "",
    },
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  watch: {
    elder: "init",
    advice: "init",
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
    close() {
      this.$emit("close");
    },
    init() {
      let that = this;
      if (this.advice) {
        axios
          .fetch(
            "medicalServer",
            "/api/admin/advice/groups/" + this.advice.id,
            null,
            null,
            "get"
          )
          .then((res) => {
            let resData = res.data;
            let groups = [];
            for (var i in resData) {
              if (!resData[i].items) {
                resData[i].items = [];
              }
              resData[i].items.unshift(resData[i].main);
              if (resData[i].status != 10) {
                groups.push(resData[i]);
              }
            }
            that.adviceGroups = groups;
            for (var i in that.adviceGroups) {
              if (!that.adviceGroups[i].items) {
                that.adviceGroups[i].items = [];
              }
            }
            console.log(that.adviceGroups, "=====");
          });
      }
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
      //保存打印时间
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/print/" + this.advice.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.$emit("printed");
        });
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
  #printFooter {
    visibility: visible !important;
  }
}
#printArea {
  color: #000000;
}
#print-header,
#print-content {
  line-height: 35px;
}

/deep/ @page {
  size: 148mm 210mm;
  margin: 0mm !important;
}

.static-item .el-form-item,
.static-item .el-form-item--mini.el-form-item,
.static-item .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

table td {
  padding: 6px 4px;
  min-width: 0;
  vertical-align: top;
  line-height: 16px;
}
table .group {
  vertical-align: middle;
  text-align: center;
  padding: 0px;
}
table .group span {
  display: inline;
}
/deep/ table .cell {
  line-height: 25px;
  vertical-align: top;
  color: #080808;
  font-size: 14px;
  text-overflow: ellipsis;
  padding-right: 0;
}
/deep/ .cell span {
  display: inline;
}
#printFooter {
  visibility: hidden;
}
/deep/ .group-line td {
  padding-bottom: 20px;
}
/deep/ .group-line + tr td {
  padding-top: 8px;
}
.circle {
  border-width: 1px;
  border-style: solid;
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-color: rgba(82, 96, 105, 1);
  border-radius: 50%;
}

.blank {
  margin: 12px 100px 0px 100px;
  text-align: center;
}
/deep/ .kit-medicine {
  padding-left: 16px;
}
</style>
