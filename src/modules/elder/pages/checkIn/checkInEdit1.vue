<template>
  <!-- 入住添加和编辑 -->
  <div class="check-in">
    <el-row class="top cssNav">
      <el-col :span="20">
        <ul>
          <li @click="blueNav.includes('BaseInfo') ? selectType('BaseInfo') : ''" v-bind:class="{
            'first-orange': isActive == 'BaseInfo',
            'first-blue':
              isActive != 'BaseInfo' && blueNav.includes('BaseInfo'),
            'first-gray': isActive != 'BaseInfo' && grayNav.includes('BaseInfo')
          }">
            <span>长者资料</span>
          </li>
          <li @click="
            blueNav.includes('FamilyInfo') ? selectType('FamilyInfo') : ''
          " v-bind:class="{
            'middle-orange': isActive == 'FamilyInfo',
            'middle-blue':
              isActive != 'FamilyInfo' && blueNav.includes('FamilyInfo'),
            'middle-gray':
              isActive != 'FamilyInfo' && grayNav.includes('FamilyInfo')
          }">
            <span class>家属信息</span>
          </li>
          <li @click="blueNav.includes('CareFor') ? selectType('CareFor') : ''" v-bind:class="{
            'middle-orange':
              isActive == 'CareFor',
            'middle-blue': isActive != 'CareFor' && blueNav.includes('CareFor'),
            'middle-gray': isActive != 'CareFor' && grayNav.includes('CareFor')
          }">
            <span class>等级评估</span>
          </li>
          <li @click="blueNav.includes('CheckInfo') ? selectType('CheckInfo') : ''" v-bind:class="{
            'middle-orange':
              isActive == 'CheckInfo' &&
              (blueNav.includes('CheckInfo') || grayNav.includes('CheckInfo')),
            'middle-blue':
              isActive != 'CheckInfo' && blueNav.includes('CheckInfo'),
            'middle-gray':
              isActive != 'CheckInfo' && grayNav.includes('CheckInfo')
          }">
            <span class>入住信息</span>
          </li>
          <li @click="
            blueNav.includes('FirstServer') ? selectType('FirstServer') : ''
          " v-bind:class="{
            'middle-orange':
              isActive == 'FirstServer' &&
              (blueNav.includes('FirstServer') ||
                grayNav.includes('FirstServer')),
            'middle-blue':
              isActive != 'FirstServer' && blueNav.includes('FirstServer'),
            'middle-gray':
              isActive != 'FirstServer' && grayNav.includes('FirstServer')
          }">
            <span class>照料服务</span>
          </li>
          <li @click="
            blueNav.includes('SpecialProtect')
              ? selectType('SpecialProtect')
              : ''
          " v-bind:class="{
            'middle-orange':
              isActive == 'SpecialProtect' &&
              (blueNav.includes('SpecialProtect') ||
                grayNav.includes('SpecialProtect')),
            'middle-blue':
              isActive != 'SpecialProtect' &&
              blueNav.includes('SpecialProtect'),
            'middle-gray':
              isActive != 'SpecialProtect' && grayNav.includes('SpecialProtect')
          }">
            <span class>特殊防护</span>
          </li>
          <li @click="
            blueNav.includes('ContractAppoint')
              ? selectType('ContractAppoint')
              : ''
          " v-bind:class="{
            'last-orange':
              isActive == 'ContractAppoint',
            'last-blue':
              isActive != 'ContractAppoint' &&
              blueNav.includes('ContractAppoint'),
            'last-gray':
              isActive != 'ContractAppoint' &&
              grayNav.includes('ContractAppoint')
          }">
            <span class>合同约定</span>
          </li>
        </ul>
      </el-col>
      <el-col :span="4" class="elderName">
        <span v-if="elderName">长者姓名：{{ elderName }}</span>
        <span v-else>长者姓名{{ elderName }}</span>
      </el-col>
    </el-row>
    <div class="main-container">
      <component v-bind:is="isActive" @controlNavClick="controlNavClick" @getCheckInDate="getCheckInDate" @changeNotEditStatus="changeNotEditStatus" :hasRuZhuHeTong="hasRuZhuHeTong" :elderId="elderId ? elderId : ''" :elderName="elderName ? elderName : ''" :nursingLevel="nursingLevel ? nursingLevel : ''" :checkinDate="checkinDate ? checkinDate : ''" :notEdit="notEdit"></component>
    </div>
  </div>
</template>

<script type="text/javascript">
import BaseInfo from "@/modules/elder/pages/checkIn/editComponents/baseInfo-xyw";
import FamilyInfo from "@/modules/elder/pages/checkIn/editComponents/familyInfo-xyw";
import CareFor from "@/modules/elder/pages/checkIn/editComponents/careFor-xyw";
import CheckInfo from "@/modules/elder/pages/checkIn/editComponents/checkInfo-xyw";
import FirstServer from "@/modules/elder/pages/checkIn/editComponents/firstServer-xyw";
import SpecialProtect from "@/modules/elder/pages/checkIn/editComponents/specialProtect-xyw";
import ContractAppoint from "@/modules/elder/pages/checkIn/editComponents/contractAppoint-xyw";
export default {
  name: "CheckIn",
  components: {
    BaseInfo,
    FamilyInfo,
    CareFor,
    CheckInfo,
    FirstServer,
    SpecialProtect,
    ContractAppoint
  },
  data() {
    return {
      elderId: "",
      elderName: "",
      nursingLevel: "", // 照护等级
      checkinDate: "", //入住日期
      hasRuZhuHeTong: false, //是否保存过入院合同
      blueNav: ["BaseInfo"],
      grayNav: [
        "FamilyInfo",
        "CareFor",
        "CheckInfo",
        "FirstServer",
        "SpecialProtect",
        "ContractAppoint"
      ],
      isActive: "BaseInfo"
    };
  },
  created() {
    const sign = this.$route.query.sign;
    const bookId = this.$route.query.bookId;
    const elderId = Number(this.$route.query.elderId);
    // 入住登记添加和首次转入住没有老人id的情况
    if (sign == "add" && !elderId) {
      // 添加
      this.blueNav = window.localStorage.getItem("blueNav")
        ? JSON.parse(window.localStorage.getItem("blueNav"))
        : this.blueNav;
      this.grayNav = window.localStorage.getItem("grayNav")
        ? JSON.parse(window.localStorage.getItem("grayNav"))
        : this.grayNav;
      this.elderId = window.localStorage.getItem("elderId")
        ? Number(window.localStorage.getItem("elderId"))
        : this.elderId;
      this.elderName = window.localStorage.getItem("elderName")
        ? JSON.parse(window.localStorage.getItem("elderName"))
        : this.elderName;
      this.nursingLevel = window.localStorage.getItem("nursingLevel")
        ? JSON.parse(window.localStorage.getItem("nursingLevel"))
        : this.nursingLevel;
      this.checkinDate = window.localStorage.getItem("checkinDate")
        ? JSON.parse(window.localStorage.getItem("checkinDate"))
        : this.checkinDate;
      this.notEdit = window.localStorage.getItem("notEdit")
        ? JSON.parse(window.localStorage.getItem("notEdit"))
        : this.notEdit;
    }
    if (sign == "repair") {
      this.elderId = Number(this.$route.query.elderId);
      this.elderName = this.$route.query.elderName;
      this.nursingLevel = this.$route.query.nursingLevel;
      // 编辑
      this.initTabStyle();
    }
    // console.log(this.blueNav);
    // console.log(this.grayNav);
  },
  methods: {
    selectType(type) {
      this.isActive = type;
    },
    changeNotEditStatus(data){
        this.notEdit = data;
    },
    initTabStyle() {
      let data = {
        elderId: this.elderId
      };
      axios.fetch("elderServer", "/elderInfo/isBright", data).then(res => {
        let repairStatusArr = res.data;
        for (let i in repairStatusArr) {
          if (repairStatusArr[i] === 1) {
            this.blueNav.push(i.charAt(0).toUpperCase() + i.slice(1));
            this.grayNavRemove(i.charAt(0).toUpperCase() + i.slice(1));
          }
        }
      });
      axios
        .fetch("elderServer", "/elder/elderById", {
          elderId: this.elderId
        })
        .then(res => {
          if (res.data.length > 0) {
            this.hasRuZhuHeTong = true;
            res.data.forEach(element => {
              if (element.contractType == 0) {
                this.notEdit = element.status == 1 ? true : false;
              }
            });
          }
        });
    },
    getCheckInDate(checkinDate) {
      this.checkinDate = checkinDate;
    },
    grayNavRemove(value) {
      let index = this.grayNav.indexOf(value);
      if (index > -1) {
        this.grayNav.splice(index, 1);
      }
    },
    controlNavClick(next, elderId, elderName, nursingLevel, checkinDate) {
      if (!this.blueNav.includes(next)) {
        if (elderId && elderName) {
          this.elderId = elderId;
          this.elderName = elderName;
          window.localStorage.setItem("elderId", JSON.stringify(this.elderId)); //对象转字符串
          window.localStorage.setItem(
            "elderName",
            JSON.stringify(this.elderName)
          ); //对象转字符串
        }
        this.blueNav.push(next);
        this.grayNav.splice(this.grayNav.indexOf(next), 1);
        window.localStorage.setItem("blueNav", JSON.stringify(this.blueNav)); //对象转字符串
        window.localStorage.setItem("grayNav", JSON.stringify(this.grayNav)); //对象转字符串
      }
      this.isActive = next;
      if (nursingLevel) {
        this.nursingLevel = nursingLevel;
      }
      if (checkinDate) {
        this.checkinDate = checkinDate;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cssNav {
  background: #fff;
  padding: 11px 15px !important;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  position: relative;
  box-sizing: border-box;
  height: 64px;
  z-index: 1;
  li {
    margin-left: -14px;
    float: left;
    padding: 0 15px;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
  }
  li:nth-child(1) {
    margin: 0;
  }
  .first-orange {
    background-image: url(../../../../assets/images/currentFinishedFirst.png);
    background-repeat: no-repeat;
    background-size: 105px 43px;
    padding-right: 30px;
  }
  .first-blue {
    background-image: url(../../../../assets/images/finishedFirst.png);
    background-repeat: no-repeat;
    background-size: 105px 43px;
    padding-right: 30px;
  }
  .first-gray {
    background-image: url(../../../../assets/images/unfinishedFirst.png);
    background-repeat: no-repeat;
    background-size: 105px 43px;
    padding-right: 30px;
  }
  .middle-orange {
    background-image: url(../../../../assets/images/currentFinished.png);
    background-repeat: no-repeat;
    background-size: 120px 43px;
    padding: 0 30px;
  }
  .middle-blue {
    background-image: url(../../../../assets/images/finished.png);
    background-repeat: no-repeat;
    background-size: 120px 43px;
    padding: 0 30px;
  }
  .middle-gray {
    background-image: url(../../../../assets/images/unfinished.png);
    background-repeat: no-repeat;
    background-size: 120px 43px;
    padding: 0 30px;
  }
  .last-orange {
    background-image: url(../../../../assets/images/currentFinishedLast.png);
    background-repeat: no-repeat;
    background-size: 105px 43px;
    padding-left: 30px;
  }
  .last-blue {
    background-image: url(../../../../assets/images/finishedLast.png);
    background-repeat: no-repeat;
    background-size: 105px 43px;
    padding-left: 30px;
  }
  .last-gray {
    background-image: url(../../../../assets/images/unfinishedLast.png);
    background-repeat: no-repeat;
    background-size: 105px 43px;
    padding-left: 30px;
  }
  .elderName {
    span {
      float: right;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }
}
</style>
