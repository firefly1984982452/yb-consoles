<template>
  <el-form :model="form" label-width="110px" class="examCard">
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <s class="redBa"></s>
          <span>老人基本信息</span>
        </div>
        <div id="familyData" style="margin-top:30px;">
          <el-row :gutter="20">
            <el-col :span="2" class="cardCenter" style="margin:0;width:160px;">
              <!-- <ub-image :src="form.elderPhoto"></ub-image> -->
                  <img src="//image.youbankeji.com/web/dahuaAdmin/Group 4@2x.png" class="cardId" 
                  v-if="form.elderPhoto == '' || !form.elderPhoto" style="height:172px!important;width:129px!important;"/>
                  <img :src="form.elderPhoto" alt class="cardId" v-else
                  style="height:172px!important;width:129px!important;"/>
            </el-col>
            <el-col :span="20" class>
              <table class="elderBaseTable"> 
                <tr>
                  <td class="blackTd">姓名</td>
                  <td>{{form.elderName | nothingFilter}}</td>
                  <td class="blackTd">性别</td>
                  <td>{{form.gender | nothingFilter}}</td>
                  <td class="blackTd">年龄</td>
                  <td>{{form.age | nothingFilter}}</td>
                  <td class="blackTd">出生日期</td>
                  <td>{{form.birthDay | nothingFilter}}</td>
                </tr>
                <tr>
                  <td class="blackTd">籍贯</td>
                  <td>{{form.birthPlace | nothingFilter}}</td>
                  <td class="blackTd">民族</td>
                  <td>{{form.nation | nothingFilter}}</td>
                  <td class="blackTd">身份证号</td>
                  <td colspan="3">{{form.cardNo | nothingFilter}}</td>
                </tr>
                <tr>
                  <td class="blackTd">学历</td>
                  <td>{{form.educational | nothingFilter}}</td>
                  <td class="blackTd">婚姻状况</td>
                  <td>{{form.marriage | nothingFilter}}</td>
                  <td class="blackTd">政治面貌</td>
                  <td colspan="3">{{form.polity | nothingFilter}}</td>
                </tr>
                <tr>
                  <td class="blackTd">户籍类型</td>
                  <td>{{form.registerType | nothingFilter}}</td>
                  <td class="blackTd">老人类别</td>
                  <td>{{form.elderProperty | nothingFilter}}</td>
                  <td class="blackTd">现居住地址类型</td>
                  <td colspan="3">{{form.residencePlace}}</td>
                </tr>
                <tr>
                  <td class="blackTd">住宅电话</td>
                  <td>{{form.homePhone | nothingFilter}}</td>
                  <td class="blackTd">移动电话</td>
                  <td>{{form.mobilePhone | nothingFilter}}</td>
                  <td class="blackTd">医保类型</td>
                  <td>{{form.insuranceType | nothingFilter}}</td>
                  <td class="blackTd">社保卡号</td>
                  <td>{{form.insuranceNo | nothingFilter}}</td>
                </tr>
                <tr>
                  <td class="blackTd">户籍地址</td>
                  <td colspan="3" style="text-align: left;">
                    <!-- <span>{{form.registerProvince}}{{form.registerCity}}{{form.registerDistrict|sxqFilter}}{{form.registerStreet}}{{form.registerAddress}}</span> -->
                    <span>{{form.registerAddress}}</span>
                  </td>
                  <td class="blackTd">现居住地址</td>
                  <td colspan="3" style="text-align: left;">
                    <!-- <span>{{form.residenceProvince}}{{form.residenceCity}}{{form.residenceDistrict|sxqFilter}}{{form.residenceStreet}}{{form.residenceAddress}}</span> -->
                    <span>{{form.residenceAddress}}</span>
                  </td>
                </tr>
              </table>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:10px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <s class="redBa"></s>
          <span>老人的证件信息</span>
        </div>
        <div id="idCard" style="margin-top:30px;">
          <el-row>
            <el-col :span="3">
              <el-row :gutter="0">
                <el-col :span="20" class="cardCenter centerCss" v-if="!form.photoCardFront || form.photoCardFront==''">
                  <img src="//image.youbankeji.com/web/dahuaAdmin/Group 10@2x.png" alt class="cardId_card"/>
                </el-col>
                <el-col :span="20" class="cardCenter centerCss" v-else>
                  <img :src="form.photoCardFront" alt class="cardId_card" style="width:180px;height:114px;"/>
                  <div class="bglarge" @click="lgPic(form.photoCardFront)"></div>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span="20" class="cardCenter centerCss">
                  <span style="width:170px">身份证正面</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3" style="margin-left: 10px;">
              <el-row :gutter="0">
                <el-col :span="20" class="cardCenter centerCss" v-if="!form.photoCardBack || form.photoCardBack==''">
                  <img src="//image.youbankeji.com/web/dahuaAdmin/Group 13@2x.png" alt class="cardId_card"/>
                </el-col>
                <el-col :span="20" class="cardCenter centerCss" v-else>
                  <img :src="form.photoCardBack" alt class="cardId_card" style="width:180px;height:114px;"/>
                  <div class="bglarge" @click="lgPic(form.photoCardBack)"></div>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span="20" class="cardCenter centerCss">
                  <span style="width:170px">身份证反面</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3" style="margin-left: 10px;">
              <el-row :gutter="0">
                <el-col :span="20" class="cardCenter centerCss" v-if="!form.photoResidenceHome || form.photoResidenceHome==''">
                  <img src="//image.youbankeji.com/web/dahuaAdmin/hukoubenshouye.png" alt class="cardId_card"/>
                </el-col>
                <el-col :span="20" class="cardCenter centerCss" v-else>
                  <img :src="form.photoResidenceHome" alt class="cardId_card" style="width:180px;height:114px;"/>
                  <div class="bglarge" @click="lgPic(form.photoResidenceHome)"></div>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span="20" class="cardCenter centerCss">
                  <span style="width:170px">户口簿首页</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3" style="margin-left: 10px;">
              <el-row :gutter="0">
                <el-col :span="20" class="cardCenter centerCss" v-if="!form.photoResidenceSelf || form.photoResidenceSelf==''">
                  <img src="//image.youbankeji.com/web/dahuaAdmin/hukoubengerenye.png" alt class="cardId_card"/>
                </el-col>
                <el-col :span="20" class="cardCenter centerCss" v-else>
                  <img :src="form.photoResidenceSelf" alt class="cardId_card" style="width:180px;height:114px;"/>
                  <div class="bglarge" @click="lgPic(form.photoResidenceSelf)"></div>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-col :span="24" class="cardCenter centerCss">
                  <span style="width:170px">户口簿本人页</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-form>
</template>

<script>
import axios from "axios";
import ubImage from '@/components/image';

export default {
  components: { ubImage },
  props: ["elderId"],
  data() {
    return {
      form: {},
      timeform: ""
    };
  },
  created() {
	  this.baseinfo()
  },
  methods: {
    baseinfo() {
      let data = {
        elderId: this.elderId
      };
      axios.fetch('elderServer', '/elderInfo/allCheckout', data).then(res => {
          this.form = res.data[0];   
      });
    },
  }
};
</script>

<style scoped>
.el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
/* .box-card >>> .el-card__header {
    background: #fbfbfc;
    color: #333;
    line-height: 25px;
    font-weight: 700;
    padding: 16px 0 16px 20px;
} */
.centerCss {
    position: relative;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    text-align: center;
    color: #666;
    font-size: 14px;
    margin-bottom: 20px;
}
.cardCenter {
    text-align: center;
    /* display: flex; */
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin: 14px 0;
}
.cardId_card {
    width: 180px;
}
.redBa{
    background: #F36969;
    display: inline-block;
    width: 4px;
    height: 20px;
    border-radius: 3px;
    position: relative;
    top: 4px;
    margin-right: 10px;
}
.elderBaseTable .blackTd {
    background: #fbfbfc;
    color: #666;
}
.elderBaseTable td {
    color: #333;
    font-size: 14px;
    padding: 14px 10px;
    border: 1px solid #EBEEF5;
    min-width: 80px;
    text-align: center;
}
</style>