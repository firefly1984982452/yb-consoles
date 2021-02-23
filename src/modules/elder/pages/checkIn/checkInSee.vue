<template>
  <div class="app-container" id="examineLive">
      <el-form :inline="true" class="search cssNav" label-width="110px">
          <el-row :gutter="20" style="margin-left:0">
            <el-col :span="2" class="backBtns" style="width:6em;padding-left:0;padding-right:0;margin-right:20px;">
              <el-button @click="backList()" class="back-btn">返回</el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="selectType('baseInfo')"
                :class="{'active':isActive=='baseInfo','noactive':isActive!='baseInfo'}">
                <span class>长者资料</span>
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="selectType('familyInfo')"
                :class="{'active':isActive=='familyInfo','noactive':isActive!='familyInfo'}">
                <span class>家属信息</span>
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button
                @click="selectType('careFor')"
                :class="{'active':isActive=='careFor','noactive':isActive!='careFor'}">
                <span class>等级评估</span>
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="selectType('checkInfo')"
                :class="{'active':isActive=='checkInfo','noactive':isActive!='checkInfo'}">
                <span class>入住信息</span>
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="selectType('firstServer')"
                :class="{'active':isActive=='firstServer','noactive':isActive!='firstServer'}">
                <span class>照料服务</span>
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button @click="selectType('specialProtect')"
                :class="{'active':isActive=='specialProtect','noactive':isActive!='specialProtect'}">
                <span class>特殊防护</span>
              </el-button>
            </el-col>
            <el-col :span="2" :md="2" :sm="6">
              <el-button @click="selectType('contractAppoint')"
                :class="{'active':isActive=='contractAppoint','noactive':isActive!='contractAppoint'}">
                <span class>合同约定</span>
              </el-button>
            </el-col>
            <el-col :span="2" :md="2" :sm="6" v-if="type == 'checkout'">
              <el-button @click="selectType('longNurse')"
                :class="{'active':isActive=='longNurse','noactive':isActive!='longNurse'}">
                <span class>长护险评估</span>
              </el-button>
            </el-col>
            <el-col :span="2" :md="2" :sm="6" v-if="type == 'checkout'">
              <el-button @click="selectType('toConfirmed')"
                :class="{'active':isActive=='toConfirmed','noactive':isActive!='toConfirmed'}">
                <span class>离院信息</span>
              </el-button>
            </el-col>
          </el-row>
      </el-form>
      <div>
          <BaseInfo ref="BaseInfo" v-if="isActive === 'baseInfo'" :elderId="elderId"></BaseInfo>
          <FamilyInfo ref="FamilyInfo" v-if="isActive === 'familyInfo'" :elderId="elderId"></FamilyInfo>
          <CareFor ref="CareFor" v-if="isActive === 'careFor'" :elderId="elderId"></CareFor>
          <CheckInfo ref="CheckInfo" v-if="isActive === 'checkInfo'" :elderId="elderId"></CheckInfo>
          <FirstServer ref="FirstServer" v-if="isActive === 'firstServer'" :elderId="elderId" :nursingLevel='nursingLevel'></FirstServer>
          <SpecialProtect ref="SpecialProtect" v-if="isActive === 'specialProtect'" :elderId="elderId"></SpecialProtect>
          <ContractRecord ref='ContractAppoint' v-if="isActive==='contractAppoint'" :elderId="elderId"></ContractRecord>
          <LongNurseRisk ref='LongNurseRisk' v-if="isActive==='longNurse'" :elderId="elderId"></LongNurseRisk>
          <ToConfirmed ref='ToConfirmed' v-if="isActive==='toConfirmed'" :elderId="elderId"></ToConfirmed>
      </div>
  </div>
</template>
<script>
import axios from "axios";
import BaseInfo from "@/modules/elder/pages/checkIn/seeComponents/baseInfo";
import FamilyInfo from "@/modules/elder/pages/checkIn/seeComponents/familyInfo";
import CareFor from "@/modules/elder/pages/checkIn/seeComponents/careFor";
import CheckInfo from "@/modules/elder/pages/checkIn/seeComponents/checkInfo";
import FirstServer from "@/modules/elder/pages/checkIn/seeComponents/firstServer";
import SpecialProtect from "@/modules/elder/pages/checkIn/seeComponents/specialProtect";
import ContractRecord from '@/modules/elder/pages/checkIn/editComponents/contractRecord';
import ToConfirmed from '@/modules/elder/pages/elderCheckout/toConfirmed';
import LongNurseRisk from '@/modules/elder/pages/nurse/longNurseRiskList';
export default {
  components: {
    BaseInfo,
    FamilyInfo,
    CareFor,
    CheckInfo,
    FirstServer,
    SpecialProtect,
    ContractRecord,
    ToConfirmed,
    LongNurseRisk
  },
  data() {
    return {
      isActive: "baseInfo",
      type:'checkin'// 默认是入院查看
    };
  },
  created() {
    this.elderId = this.$route.query.elderId;
    this.nursingLevel =  this.$route.query.nursingLevel;
    this.type = this.$route.query.type ? this.$route.query.type : 'checkin';
  },
  methods: {
    backList() {
      this.$router.go(-1);
    },
    selectType(type) {
      this.isActive = type;
    }
  },
  filters: {}
};
</script>
<style scoped>
.cssNav {
  min-width: 900px;
}
.cssNav .el-col {
    padding: 0!important;
    margin: 0 5px;
}
.active {
    background: #4687E1;
    color: #fff;
    border: 1px solid #4687E1;
}
.noactive {
    background: #fff;
    color: #333;
    border: none;
}
.testStyle {
  color: #333;
  font-weight: bolder;
}
.familyInfoBtn {
  border-radius: 4px;
  border: 1px solid rgba(211, 212, 214, 1);
  color: #333;
}
.familyInfoBtn:hover {
  border: 1px solid rgba(211, 212, 214, 1);
  color: #333;
}
.elderBaseTable tr td:nth-child(even) {
  font-weight: bolder;
}
.ziliLevel {
  margin-bottom: 30px;
}
.ziliLevel tr:first-child td {
  font-weight: bolder;
  background: #f3f3f3;
  color: #666;
  font-size: 16px;
}
.ziliLevel td {
  color: #333;
  font-size: 14px;
  padding: 13px 59px;
  border: 1px solid #ebeef5;
  min-width: 80px;
  text-align: center;
}
.ziliLevel tr td:nth-child(odd) {
  font-size: 16px;
  color: #555555;
}
.tabelTitleStyle {
  color: #666666;
  font-size: 16px;
  font-weight: bolder;
  background: #f3f3f3;
}
.trStyle {
  background: #f3f3f3;
}

/*照护等级评估*/
.care-assess .table-card {
  background: #fff;
  padding-bottom: 20px;
}
.care-assess .table-card .el-button {
  width: 110px;
  height: 36px;
  margin-right: 20px;
  font-size: 16px;
}
.checkBtn {
  color: #fff;
  border-color: #fff;
  background-color: #4687e1;
}
.searchBtn {
  color: #333;
  background-color: #fff;
}
</style>
