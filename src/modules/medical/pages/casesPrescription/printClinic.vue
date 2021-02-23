<template>
  <div>
    <div class="main_content" id="mainContent" ref="mainContent">
      <div class="title">
        <p>{{$moment(advice.createTime).format("YYYY年MM月DD日")}}</p>
        <p>{{tenantName}}</p>
      </div>
      <div class="content">
        <p v-if="advice.present">
          <b>主诉：</b>{{advice.present}}
        </p>
        <p v-if="advice.history">
          <b>现病史：</b>{{advice.history}}
        </p>
        <p v-if="advice.previous">
          <b>既往史：</b>{{advice.previous}}
        </p>
        <p>
          <b
            v-if="advice.temperature || advice.pulseRate || advice.respirationRate ||(advice.pressureLow&&advice.pressureHign)">体检：</b>
          <span v-if="advice.temperature">T {{advice.temperature}}℃</span>
          <span v-if="advice.pulseRate">P {{advice.pulseRate}}次/分</span>
          <span v-if="advice.respirationRate">R {{advice.respirationRate}}次/分 </span>
          <span v-if="advice.pressureLow&&advice.pressureHign">BP
            {{advice.pressureLow}}/{{advice.pressureHign}}mmHg</span>
        </p>
        <p v-if="advice.examination">
          <b>辅助检查：</b>{{advice.examination}}
        </p>
        <p v-if="advice.diagnosis">
          <b>诊断：</b>{{advice.diagnosis}}
        </p>
        <p v-if="advice.advise">
          <b>处理：</b>{{advice.advise}}
        </p>
        <div v-for="(group,index) in adviceGroups" :key="index">
          <template v-if="group.items.length > 0">
            <el-row class="row_medical" v-for="(item,itemIndex) in group.items" :key="itemIndex">
              <span v-if="itemIndex === 0" style="font-size:12px">{{index + 1}}</span>
              <span class="circle_1" v-else></span>
              <span>{{item.name}}&nbsp;&nbsp;
                {{item.standard}}&nbsp;&nbsp;
                共{{item.quantity}}{{item.unit}}&nbsp;&nbsp;
                <em v-if="group.items.length > 1">
                  {{item.useCount}}{{item.useUnit}}&nbsp;&nbsp;
                </em>
                <em v-if="itemIndex === group.items.length -1">
                  <br>
                  Sig：
                  <span v-if="group.items.length === 1">{{item.useCount}}{{item.useUnit}}&nbsp;&nbsp;</span>
                  {{usage(group,"　")}}<span v-if="group.day">×{{group.day}}天</span>
                </em>
              </span>
            </el-row>
          </template>
        </div>
        <div style="text-align:right;margin-top:50px">
          医师签名：<span>{{advice.doctorName}}</span>
        </div>
      </div>
    </div>
    <el-row class="print_btm" style="margin:16px;text-align:center;">
      <el-button v-if="showClose" @click="close()">关 闭</el-button>
      <el-button icon="iconfont iconcaozuotubiao-dayin-xuanfu" type="primary" @click="doPrint()">&nbsp;&nbsp;打印病历
      </el-button>
    </el-row>
  </div>
</template>

<script type="text/javascript">
import Print from "@/utils/printjs";
import axios from "axios";
import utils from "../utils";
Vue.use(Print);
export default {
  // 病历打印
  name: "CasePrint",
  props: {
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
  created() {
    console.log(this.advice);
    this.init();
  },
  data() {
    return {
      adviceGroups: [],
    };
  },
  components: {},
  methods: {
    ...utils,
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
            that.adviceGroups = res.data;
            for (var i in that.adviceGroups) {
              if (!that.adviceGroups[i].items) {
                that.adviceGroups[i].items = [];
              }
              that.adviceGroups[i].items.unshift(that.adviceGroups[i].main);
            }
          });
      }
    },
    doPrint() {
      //保存打印时间
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/print/" + this.advice.id,
          { type: 2 },
          null,
          "get"
        )
        .then((res) => {
          this.$emit("forbidEdit");
          this.$emit("printed");
        });
      this.$nextTick(() => {
        this.$print(this.$refs.mainContent);
      });
    },
    close() {
      this.$emit("handleClose");
    },
  },
};
</script>

<style lang="less" scoped>
#mainContent {
  color: #000000;
  display: flex;
  min-height: 500px;
  .title {
    // width: 150px;
    margin-right: 10px;

    p {
      line-height: 32px;
    }
  }
  .content {
    flex: 1;
    p {
      line-height: 32px;
    }
  }
  .row_medical {
    margin-top: 5px;
    display: flex;
    // align-items: center;
    > span {
      // line-height: 26px;
    }
    span + span {
      margin-left: 5px;
    }
    span:nth-child(1) {
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      // padding: 2px 4px;
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 18px;
      text-align: center;
      border-color: rgba(82, 96, 105, 1);
      border-radius: 50%;
    }
    span.circle_1 {
      border: none;
    }
  }
}
</style>
