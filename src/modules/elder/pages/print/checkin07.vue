<template>
  <div class="page page7">
    <h2 class="title">老人外出约定</h2>
    <table cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td>姓名</td>
        <td>{{elderData.baseInfo.elderName}}</td>
        <td>性别</td>
        <td>{{elderData.baseInfo.gender}}</td>
        <td>出生年月</td>
        <td colspan="3">{{elderData.baseInfo.birthDay | dateFormat}}</td>
      </tr>
      <tr>
        <td width="13%">入住时间</td>
        <td width="19%">{{elderData.baseInfo.checkinDate | dateFormat}}</td>
        <td width="8%">室号</td>
        <td width="10%">{{elderData.baseInfo.roomName}}</td>
        <td width="13%">床号</td>
        <td width="11%">{{elderData.baseInfo.bedName}}</td>
        <td width="13%">护理等级</td>
        <td width="13%">{{elderData.baseInfo.nursingLevel | levelFilter}}</td>
      </tr>
      <tr>
        <td rowspan="2">约定事项</td>
        <td colspan="7" class="cont">我同意:<br /><br />&nbsp;&nbsp;({{elderData.baseInfo.elderName}})老人能自主决定离院外出,在外出期间如发生意外或突发事件,<br />由我们家属和老人负全部责任。
        <p v-if="elderData.baseInfo.guarantorSign&&elderData.baseInfo.agreeOut==1" class="name">签名：<img style="width:80px;height:40px;" :src="elderData.baseInfo.guarantorSign"></p>
        <p v-else class="name">签名： ____________<img style="width:80px;height:40px;visibility:hidden" /></p>
        <p>日期： <span v-if="elderData.baseInfo.checkinDate">{{elderData.baseInfo.checkinDate | dateFormat}}</span><span v-else> 年 月 日</span></p>
        </td>
      </tr>
      <tr>
        <td colspan="7">我不同意:<br /><br />&nbsp;&nbsp;({{elderData.baseInfo.elderName}})老人能自主决定离院外出。
        <p v-if="elderData.baseInfo.guarantorSign&&elderData.baseInfo.agreeOut==0" class="name">签名： <img style="width:80px;height:40px;" :src="elderData.baseInfo.guarantorSign"></p>
        <p v-else class="name">签名： ____________<img style="width:80px;height:40px;visibility:hidden" /></p>
        <p>日期： <span v-if="elderData.baseInfo.checkinDate">{{elderData.baseInfo.checkinDate | dateFormat}}</span><span v-else> 年 月 日</span></p>
        </td>
      </tr>
      <tr>
        <td>备注</td>
        <td colspan="7">1.外出约定者是护理等级为一级以上的老人。<br />2.护理等级为一级以下的老人外出无须约定，可自主决定离院外出。<br />3.护理等级为一级以上老人签约须由其监护人签署</td>
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
.page7 {
  /deep/ td {
    padding: 10px 4px;
  }
  p {
    min-width: 200px;
    text-align: left;
    padding-left: 70%;
  }
}
</style>