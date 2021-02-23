<template>
  <div class="page">
    <h2 class="title">委托发放医疗药品约定</h2>
    <table cellspacing="0" cellpadding="0" class="table table8">
      <tr>
        <td width="15%">护理区域</td>
        <td width="35%">
          {{ elderData.baseInfo.area }}-{{ elderData.baseInfo.roomName }}
        </td>
        <td width="15%">床号</td>
        <td width="35%">{{ elderData.baseInfo.bedName }}</td>
      </tr>
      <tr>
        <td>老人姓名</td>
        <td>{{ elderData.baseInfo.elderName }}</td>
        <td>护理等级</td>
        <td>{{ elderData.baseInfo.nursingLevel | levelFilter }}</td>
      </tr>
      <tr class="qianming">
        <td>委托事项</td>
        <td colspan="3">
          <span v-if="elderData.baseInfo.agreeMedicine">我委托院方:<br /><br />&nbsp;&nbsp;对({{
            elderData.baseInfo.elderName
          }})老人外出就医所配的药物按医嘱发放。</span>
          <span v-else>无</span>
          <p v-if="elderData.baseInfo.guarantorSign" class="name">
            委托方（签名）：<img
              style="width:80px;height:40px;"
              :src="elderData.baseInfo.guarantorSign"
            />&nbsp;&nbsp;日期：
            <span v-if="elderData.baseInfo.checkinDate">{{
              elderData.baseInfo.checkinDate | dateFormat
            }}</span
            ><span v-else> 年 月 日</span>
          </p>
          <p v-else class="name">
            委托方（签名）： __________________&nbsp;&nbsp;日期：
            <span v-if="elderData.baseInfo.checkinDate">{{
              elderData.baseInfo.checkinDate | dateFormat
            }}</span
            ><span v-else> 年 月 日</span>
          </p>
        </td>
      </tr>
      <tr class="qianming">
        <td>接受事项</td>
        <td colspan="3">
          <span v-if="elderData.baseInfo.agreeMedicine">我接受委托方院方:<br /><br />&nbsp;&nbsp;为({{
            elderData.baseInfo.elderName
          }})老人外出就医所配的药物按医嘱发放。</span>
          <span v-else>无</span>
          <p v-if="elderData.baseInfo.operatorSign" class="name">
            接收方（签名）：
            <img
              style="width:80px;height:40px;"
              :src="elderData.baseInfo.operatorSign"
            />&nbsp;&nbsp;日期：
            <span v-if="elderData.baseInfo.checkinDate">{{
              elderData.baseInfo.checkinDate | dateFormat
            }}</span
            ><span v-else> 年 月 日</span>
          </p>
          <p v-else class="name">
            接收方（签名）： __________________&nbsp;&nbsp;日期：
            <span v-if="elderData.baseInfo.checkinDate">{{
              elderData.baseInfo.checkinDate | dateFormat
            }}</span
            ><span v-else> 年 月 日</span>
          </p>
        </td>
      </tr>
      <tr>
        <td>备注</td>
        <td colspan="3">
          1.委托发放的药物非老人就医所配不予接收发放。<br />2.接受药物时应核查老人就医病例并按医嘱发放。<br />3.药物的交换必须台账记录，手续完备，用药后结算清楚。
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    elderData: {
      type: Object,
      default() {
        return {
          elderId: "",
          baseInfo: {}, //基础信息和入住管理的数据
          familyData: {}, //家属信息
          healthInfo: {} //健康状况
        };
      }
    }
  },
  data() {
    return {};
  },
  created() {
    console.log(this.elderData);
    this.assembleData();
  },
  methods: {
    //处理数据
    assembleData() {}
  },
  filters: {
    dateFormat: date => {
      if (date) {
        date =
          date.split("-")[0] +
          "年" +
          date.split("-")[1] +
          "月" +
          date.split("-")[2] +
          "日";
      } else {
        date = "";
      }
      return date;
    },
    //院方护理等级
    levelFilter: val => {
      if (val == 0) {
        val = "无护理";
      } else if (val == 1) {
        val = "护理一级";
      } else if (val == 2) {
        val = "护理二级";
      } else if (val == 3) {
        val = "护理三级";
      } else if (val == 4) {
        val = "护理四级";
      } else if (val == 5) {
        val = "护理五级";
      } else if (val == 6) {
        val = "护理六级";
      }
      return val;
    }
  }
};
</script>
<style lang="less" scoped>
.table8 {
  p {
    text-align: right;
    padding-right: 20px;
    &.name {
      // padding-right: 30%;
      margin: 50px 0 0;
    }
  }
}
table {
  tr {
    &.qianming {
      height: 250px;
    }
  }
}
</style>
