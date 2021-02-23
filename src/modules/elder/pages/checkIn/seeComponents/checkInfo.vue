<template>
  <el-card class="box-card">
    <el-row style="padding:20px;">
      <el-col :xl="20" :lg="18">
        <table class="elderBaseTable" style="margin-bottom:0;">
          <tr>
            <td class="blackTd">入院编号</td>
            <td style="padding:14px 60px;font-weight:500;">{{roomLevelData.checkinNo }}</td>
            <td class="blackTd">入院日期</td>
            <td style="padding:14px 60px;font-weight:500;">{{roomLevelData.checkinDate }}</td>
          </tr>
          <tr>
            <td class="blackTd">床位号</td>
            <td colspan="3" style="font-weight:500;">{{bedName}}</td>
          </tr>
          <tr>
            <td class="blackTd">院方护理等级</td>
            <td style="padding:14px 60px;font-weight:500;">{{roomLevelData.nursingLevel | gradeFilter}}</td>
            <td class="blackTd">末次长护险评估等级</td>
            <td style="padding:14px 60px;font-weight:500;">{{roomLevelData.insuranceLevel | gradeFilter}}</td>
          </tr>
          <tr>
            <td class="blackTd">末次长护险评估有效期</td>
            <td colspan="3" style="font-weight:500;">{{insuranceDateRange}}</td>
          </tr>
          <tr>
            <td class="blackTd">申请原因</td>
            <td colspan="3" style="font-weight:500;">{{roomLevelData.checkinRemark}}</td>
          </tr>
          <tr>
            <td class="blackTd">外出约定</td>
            <td style="padding:14px 60px;font-weight:500;">{{roomLevelData.agreeOut | agreeFilter}}</td>
            <td class="blackTd">委托发药</td>
            <td style="padding:14px 60px;font-weight:500;">{{roomLevelData.agreeMedicine | agreeFilter}}</td>
          </tr>
        </table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import axios from "axios";
export default {
  props: ["elderId"],
  data() {
    return {
      bedName: '',
      insuranceDateRange: "",
      roomLevelData: {}
    }
  },
  created() {
    this.initInfo();
  },
  methods: {
    initInfo() {
      let data = {
        elderId: this.elderId
      };
      axios
        .fetch('elderServer', "/elderInfo/allCheckout", data)
        .then(res => {
          let resData = res.data[0];
          this.roomLevelData = {
            checkinNo: resData.checkinNo,
            checkinDate: resData.checkinDate,
            buildingName: resData.buildingName,
            floor: resData.floor,
            roomName: resData.roomName,
            bedName: resData.bedName,
            nursingLevel: resData.nursingLevel,
            insuranceLevel: resData.insuranceLevel,
            checkinRemark: resData.checkinRemark,
            agreeOut: resData.agreeOut,
            agreeMedicine: resData.agreeMedicine,
          }
          this.bedName = '';
          if (this.roomLevelData.buildingName != null && this.roomLevelData.buildingName != "") {
            this.bedName = this.roomLevelData.buildingName + '_' + this.roomLevelData.floor + '层_'
              + this.roomLevelData.roomName + '_' + this.roomLevelData.bedName;
          }
          if (resData.insuranceLevel) {
            this.insuranceDateRange = resData.insuranceStart ?
              (this.dateFormat(resData.insuranceStart) + " 至 " + this.dateFormat(resData.insuranceEnd)) : "";
          } else {
            this.insuranceDateRange = '-'
          }
        })
    },
    //将yyyy-MM-dd格式的时间转化成yyyy年MM月dd日
    dateFormat(date) {
      return date.split('-')[0] + '年' + date.split('-')[1] + '月' + date.split('-')[2] + '日';
    },
  },
  filters: {
    gradeFilter: val => {
      return ['未评级', '护理一级', '护理二级', '护理三级', '护理四级', '护理五级', '护理六级', '外地', '不满60岁', '享受居家养老'][val]
    },
    agreeFilter: val => {
      if (val === 0) {
        val = "不同意";
      } else if (val === 1) {
        val = "同意";
      }
      return val;
    }
  }
}
</script>

<style scoped>
.rectangleStyle span {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0px 14px;
  margin-right: 5px;
  line-height: 30px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
.elderBaseTable .blackTd {
  background: #fbfbfc;
  color: #666;
}
.elderBaseTable td {
  color: #333;
  font-size: 14px;
  padding: 14px 10px;
  border: 1px solid #ebeef5;
  min-width: 80px;
  text-align: center;
}
</style>