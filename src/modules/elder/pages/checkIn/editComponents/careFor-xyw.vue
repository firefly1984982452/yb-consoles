<template>
  <el-card class="box-card">
    <el-row style="padding:10px 0 10px 20px;border-bottom: 1px solid #ddd;background: #FBFBFC;">
      <el-button @click="selectType('healthCondition')" :class="{'checkBtn':isActive=='healthCondition','searchBtn':isActive!='healthCondition'}">健康评估</el-button>
      <!-- <el-button @click="selectType('functionalEvaluation')" :class="{'checkBtn':isActive=='functionalEvaluation','searchBtn':isActive!='functionalEvaluation'}">功能评估</el-button> -->
      <el-button @click="selectType('careAssess')" :class="{'checkBtn':isActive=='careAssess','searchBtn':isActive!='careAssess'}">照护评估</el-button>
    </el-row>
    <el-row>
      <HealthCondition ref='HealthCondition' v-if="isActive==='healthCondition'" @healthCondition='contractAppoint' :elderId="elderId" :notEdit="notEdit"></HealthCondition>
      <FunctionalEvaluation @nextStep="nextStep" ref="FunctionalEvaluation" v-if="isActive === 'functionalEvaluation'" @functionalEvaluation='contractAppoint' :elderId="elderId" :notEdit="notEdit"></FunctionalEvaluation>
      <CareAssess ref="CareAssess" v-if="isActive==='careAssess'&&careForArr.indexOf('careAssess')===-1" @careAssess='contractAppoint' @initTabStyle="initTabStyle" :elderId="elderId" :elderName="elderName" :notEdit="notEdit"></CareAssess>
      <SeeAssess ref="SeeAssess" v-if="isActive==='careAssess'&&careForArr.includes('careAssess')" :elderId="elderId" :elderName="elderName" :notEdit="notEdit"></SeeAssess>
    </el-row>
    <el-row class="handleBtn" v-if="isActive==='careAssess'&&careForArr.includes('careAssess')&&!notEdit">
      <el-button type="success" plain @click="save()">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </el-row>
  </el-card>
</template>

<script>
import axios from "axios";
import HealthCondition from "@/modules/elder/pages/checkIn/seeComponents/healthCondition";
import FunctionalEvaluation from "@/modules/elder/pages/checkIn/editComponents/functionalEvaluation-xyw";
import CareAssess from "@/modules/elder/pages/checkIn/editComponents/careAssess-xyw";
import SeeAssess from "@/modules/elder/pages/checkIn/seeComponents/careAssess";

export default {
  name: "CareFor",
  components: { HealthCondition, FunctionalEvaluation, CareAssess, SeeAssess },
  props: ["elderId", "elderName", "notEdit"],
  data() {
    return {
      isActive: "careAssess",
      sign: "",
      careForArr: []
    };
  },
  created() {
    this.sign = this.$route.query.sign;
    this.initTabStyle();
  },
  methods: {
    initTabStyle() {
      let data = {
        elderId: this.elderId
      };
      axios.fetch("elderServer", "/elderInfo/isBright", data).then(res => {
        let repairStatusArr = res.data;
        for (let i in repairStatusArr) {
          if (repairStatusArr[i] === 1) {
            this.careForArr.push(i);
          }
        }
        // console.log(this.careForArr,'=====================xyw');
      });
    },
    contractAppoint(value, data2) {
      this.isActive = data2;
      if (this.careForArr.indexOf(value) === -1) {
        this.careForArr.push(value);
      }
      if (
        this.careForArr.includes("careAssess") &&
        this.careForArr.length === 2
      ) {
        this.$emit("careFor", "careFor", "checkInfo");
      } else if (
        this.careForArr.indexOf("careAssess") === -1 &&
        this.careForArr.length === 3
      ) {
        this.$emit("careFor", "careFor", "checkInfo");
      } else if (this.sign === "ruzhu" && this.careForArr.length === 1) {
        this.$emit("careFor", "careFor", "checkInfo");
      }
    },
    selectType(type) {
      this.isActive = type;
    },
    nextStep(next) {
      this.isActive = next;
    },
    save() {
      this.$emit("controlNavClick", "CheckInfo");
    }
  }
};
</script>

<style scoped>
.box-card >>> .el-card__header {
  background: #fbfbfc;
  color: #333;
  line-height: 25px;
  font-weight: 700;
  padding: 11px 0 11px 20px;
}
.checkBtn {
  width: 8em;
  color: #fff;
  background-color: #4687e1;
}
.searchBtn {
  width: 8em;
  background-color: #fbfbfc;
  border-color: #fbfbfc;
}
.el-card >>> .el-card__body {
  padding: 0 !important;
}
.handleBtn {
  padding: 10px 0;
  text-align: center;
}
</style>