<template>
  <div class="booking-detail">
    <el-row class="backTitle">
      <el-col :span="1" class="backBtns">
        <el-button @click="backList()" class="back-btn">
          <span>返回</span>
        </el-button>
      </el-col>
      <!--<el-col :span="10" class="title">
        <span>待入住详情</span>
      </el-col>-->
      <el-col :span="11" class="handlebtn">
        <el-button class="cancleBtn" v-if="status == 0" plain @click="cancelLive()"><i class="iconfont iconjichutubiao-quxiaoyuding"></i>取消预订</el-button>
        <el-button v-if="status == 1 || status == 0" class=" readyLiveBtn" plain @click="ruzhu()"><i class="iconfont iconzuocedaohangtubiao-shujubaobiao-chuangweishuju"></i>转入住</el-button>
        <el-button class="editBtn" v-if="status == 0 || status == 1" @click="edit()"><i class="iconfont iconjichutubiao-bianji1"></i>编辑</el-button>
      </el-col>
    </el-row>
    <!-- 已经入住 -->
    <el-card v-if="status == 2" class="box-card status">
      <el-row :gutter="10">
        <el-col :span="3">
          <img src="//image.youbankeji.com/web/dahuaAdmin/successLive.png" alt>
        </el-col>
        <el-col :span="21">
          <div>
            <b>此预订信息已经办理入住</b>
          </div>
          <div>
            <span>办理入住时间 :</span>
            <b>{{oldManForm.updateTime}}</b>
          </div>
          <div>
            <span>办理操作人员 :</span>
            <b>{{oldManForm.creatorName}}</b>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 已经取消 -->
    <el-card v-if="status == -1" class="box-card status">
      <el-row :gutter="10">
        <el-col :span="3">
          <img src="//image.youbankeji.com/web/dahuaAdmin/cancelSuccess.png" alt>
        </el-col>
        <el-col :span="21">
          <div>
            <b>此预定信息已取消</b>
          </div>
          <div>
            <span>取消时间：</span>
            <b>{{oldManForm.updateTime}}</b>
          </div>
          <div>
            <span>取消原因说明：</span>
            <b>--</b>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <span class="tableTitle">老人的基本信息</span>
      <table class="tableCss">
        <tr>
          <td width="10%">姓名</td>
          <td class="fontStyle">{{oldManForm.elderName | nothingFilter}}</td>
          <td>性别</td>
          <td class="fontStyle">{{oldManForm.gender | nothingFilter}}</td>
          <td>出生日期</td>
          <td class="fontStyle">{{oldManForm.birthDay | nothingFilter}}</td>
          <td>健康状况</td>
          <td class="fontStyle">{{oldManForm.health | nothingFilter}}</td>
        </tr>
        <tr>
          <td>身份证号</td>
          <td class="fontStyle" colspan="3">{{oldManForm.cardNo | nothingFilter}}</td>
          <td>户籍地址</td>
          <td class="fontStyle" style="text-align: left" colspan="5" v-if="oldManForm.registerProvince!=''">{{oldManForm.registerProvince}}{{oldManForm.registerCity | cityFilter}}{{oldManForm.registerDistrict}}{{oldManForm.registerStreet}}{{oldManForm.registerAddress}}</td>
          <td class="fontStyle" colspan="5" v-else></td>
        </tr>
        <tr>
          <td>现居住地</td>
          <td class="fontStyle" colspan="7">
            {{oldManForm.residenceProvince}}{{oldManForm.residenceCity | cityFilter}}{{oldManForm.residenceDistrict}}{{oldManForm.residenceStreet}}{{oldManForm.residenceAddress}}
          </td>
        </tr>
        <!-- <tr>
          <td>主要病情</td>
          <td class="fontStyle" style="text-align: left" colspan="9">{{illForm.eh_condition | nothingFilter}}</td>
        </tr>
        <tr>
          <td>现有病例介绍</td>
          <td style="text-align: left" colspan="9">
            <span class="illBox fontStyle" v-if="illForm.eh_medical_now==''">无</span>
            <span class="illBox fontStyle" v-if="illForm.eh_medical_now!=''&&item!=''" v-for="item in form.eh_medical_now" :key="index">{{item}}</span>
          </td>
        </tr> -->
      </table>
      <span class="tableTitle">家属信息</span>
      <table class="tableCss">
        <tr>
          <td width="10%">姓名</td>
          <td class="fontStyle">{{familyForm.relationName | nothingFilter}}</td>
          <td>身份证号</td>
          <td width="20%" class="fontStyle">{{familyForm.cardNo | nothingFilter}}</td>
          <td>与老人的关系</td>
          <td class="fontStyle">{{familyForm.relationType | nothingFilter}}</td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td class="fontStyle">{{familyForm.mobilePhone | nothingFilter}}</td>
          <td>户籍地址</td>
          <td :colspan="3" class="fontStyle">{{familyForm.registerProvince}}{{familyForm.registerCity|cityFilter}}{{familyForm.registerDistrict}}{{familyForm.registerStreet}}{{familyForm.registerAddress}}</td>

        </tr>
        <tr>
          <td>紧急联系电话</td>
          <td class="fontStyle">{{familyForm.emergencyPhone | nothingFilter}}</td>
          <td>现居住地</td>
          <td :colspan="3" class="fontStyle">{{familyForm.residenceProvince}}{{familyForm.residenceCity|cityFilter}}{{familyForm.residenceDistrict}}{{familyForm.residenceStreet}}{{familyForm.residenceAddress}}</td>
        </tr>
      </table>
      <span class="tableTitle">订房信息</span>
      <table class="tableCss">
        <tr>
          <td>房间号</td>
          <td class="fontStyle">{{roomForm.roomName| nothingFilter}}</td>
          <td>床位号</td>
          <td class="fontStyle">{{roomForm.bedName | nothingFilter}}号床</td>
          <td>预付订金(元)</td>
          <td class="fontStyle">{{roomForm.bookAmount | nurseFilter}}</td>
          <td>业务办理人</td>
          <td class="fontStyle">{{roomForm.creatorName | nothingFilter}}</td>
        </tr>
        <tr>
          <td>预计入住日期</td>
          <td class="fontStyle" colspan="3">{{roomForm.bookDate | nothingFilter}}</td>
          <td>院方护理等级</td>
          <td class="fontStyle" colspan="3">{{roomForm.nursingLevel | nurseFilter }}</td>
          <!-- <td>预计入住日期</td>
          <td class="fontStyle" colspan="3">{{roomForm.srsv_checkin_date | nothingFilter}}</td> -->
        </tr>
        <!-- <tr>
          <td>备注信息</td>
          <td class="fontStyle" style="text-align: left" colspan="7">{{roomForm.srsv_remark | nothingFilter}}</td>
        </tr> -->
      </table>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      form: {},
      status: "",
      bookId: "",
      loading: false,
      /*家属*/
      familyForm: {},
      /*老人*/
      oldManForm: {},
      /*订房*/
      roomForm: {},
      elderName: "",
      elderId: ""
    };
  },
  computed: {},
  created() {
    this.bookId = this.$route.query.bookId;
    this.elderId = this.$route.query.elderId;
    this.elderName = this.$route.query.elderName;
    this.status = this.$route.query.status;
    this.getBookInfo(this.bookId);
  },
  filters: {
    nurseFilter: function(value) {
      if (value) {
        return value;
      }
    }
  },
  methods: {
    // 获取预定的老人及家属信息
    getBookInfo(id) {
      axios
        .fetch("elderServer", "/bookElder/get/bookInfo", { bookId: id })
        .then(res => {
          console.log(res);
          this.familyForm = res.data.bookRelation;
          this.oldManForm = res.data.bookElder;
          this.roomForm = res.data.bookBed ? res.data.bookBed : {};
        });
    },
    backList() {
      this.$router.back(-1);
    },
    closeCancel() {
      this.$store.commit("setShowParent", 0);
      this.$router.push("/live");
    },
    ruzhu() {
      let sign;
      if (this.elderId == 0) {
        window.localStorage.removeItem("blueNav");
        window.localStorage.removeItem("grayNav");
        window.localStorage.removeItem("elderId");
        window.localStorage.removeItem("elderName");
        window.localStorage.removeItem("nursingLevel");
        window.localStorage.removeItem("checkinDate");
        window.localStorage.removeItem("notEdit");
        window.localStorage.removeItem("hasRuZhuHeTong");
        sign = "add";
      } else {
        sign = "repair";
      }
      this.$router.push({
        path: "/elder/checkInEdit",
        query: {
          bookId: this.bookId,
          sign,
          elderId: this.elderId,
          elderName: this.elderName
        }
      });
    },
    edit() {
      this.$router.push({
        path: "addBookingRoom",
        query: { bookId: this.bookId, sign: "repair" }
      });
    },
    /*取消预定*/
    cancelLive() {
      this.$confirm("是否需要取消该预约?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const param = {
          bookId: this.bookId
        };
        axios.fetch("elderServer", "/bookElder/cancel", param).then(res => {
          if (res.code == 200) {
            this.$router.go(-1);
            this.$message({
              type: "success",
              message: "取消成功!"
            });
          }
        });
      });
    },
    filters: {
      cityFilter: val => {
        if (val == "市辖区") {
          val = "";
        }
        return val;
      }
    }
  }
};
</script>
<style scoped lang="less">
.booking-detail .warp {
  margin-top: 0px;
}
.booking-detail {
  .backTitle {
    background-color: #fff;
    line-height: 57px;
    padding-left: 20px;
    .handlebtn {
      margin-right: 15px;
      float: right;
      height: 57px;
      padding-top: 9px;
      .el-button {
        float: right;
        color: white;
      }
      .readyLiveBtn {
        background: rgba(244, 155, 49, 1);
        border: 1px solid rgba(244, 155, 49, 1);
      }
      // .readyLiveBtn:hover {
      //   background: rgba(244, 155, 49, 1);
      //   color: white;
      //   border: 1px solid rgba(244, 155, 49, 1);
      // }
      .cancleBtn {
        background: rgba(243, 105, 105, 1);
        border: 1px solid rgba(243, 105, 105, 1);
        margin-left: 10px;
      }
      // .cancleBtn:hover {
      //   background: rgba(243, 105, 105, 1);
      //   color: white;
      //   border: 1px solid rgba(243, 105, 105, 1);
      // }
      .editBtn {
        background: rgb(35, 104, 211);
      }
    }
  }
  .status {
    margin-bottom: 10px;
    height: 150px;
    box-sizing: border-box;
    /deep/ .el-card__body {
      padding: 30px 0;
      .el-row {
        .el-col:nth-child(1) {
          text-align: center;
        }
        .el-col:nth-child(2) {
          > div {
            font-size: 14px;
            margin-bottom: 10px;
          }
        }
      }
    }
    img {
      width: 60px;
      height: 60px;
    }
  }
  .iconfont {
    margin-right: 5px;
    margin-top: 2px;
    display: inline-block;
    color: white;
  }
  .fontStyle {
    font-weight: bold;
  }
  .tableCss {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .tableCss tr td {
    font-size: 14px;
    padding: 14px 10px;
    border: 1px solid #ebeef5;
    min-width: 80px;
    text-align: left;
  }
  .tableCss tr td:nth-child(2n + 1) {
    background: #fbfbfc;
    color: #666;
  }
  .tableTitle {
    width: 72px;
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC;
    font-weight: bolder;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
  }
  .illBox {
    width: 124px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(220, 223, 230, 1);
    padding: 7px 19px;
    margin-right: 10px;
  }
  #liveList .el-pagination {
    float: right;
    position: relative;
    margin: 2rem auto;
    left: -50%;
    transform: translateX(50%);
  }
  #liveList .el-pagination__editor.el-input {
    width: 50px;
  }
}
</style>

