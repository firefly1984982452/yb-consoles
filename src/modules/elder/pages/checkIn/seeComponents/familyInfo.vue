<template>
  <!-- 查看家属信息 -->
  <el-form label-width="110px" class="family-info">
    <el-col :span="24" v-for="(item,index) in form" :key="index" style="margin-bottom:30px">
      <el-card class="box-card" style="margin-bottom:20px;">
        <div slot="header" class="clearfix">
          <s class="blueBa"></s>
          <span>家属{{form.length-index}}</span>
        </div>
        <el-row :gutter="20">
            <el-col :span="3" class="cardCenter" style="margin:0;width:160px;">
                <img src="//image.youbankeji.com/web/dahuaAdmin/Group 4@2x.png" class="cardId"
                  v-if="item.relationPhoto == '' || !item.relationPhoto" style="height:172px!important;width:129px!important;"/>
                <img v-else :src="item.relationPhoto" alt class="cardId" style="height:172px!important;width:129px!important;" />
                <!-- <ub-avatar category="elder" v-model="item.relationPhoto"></ub-avatar> -->
          </el-col>
            <el-col :span="20">
            <table class="elderBaseTable">
              <tr>
                <td class="blackTd">姓名</td> 
                <td>{{item.relationName | nothingFilter}}</td> 
                <td class="blackTd">性别</td>
                <td>{{item.gender | nothingFilter}}</td>
                <td class="blackTd">出生日期</td>
                <td>{{item.birthDay | nothingFilter}}</td>
                <td class="blackTd">民族</td>
                <td>{{item.nation | nothingFilter}}</td>
                <td class="blackTd">与老人关系</td> 
                <td>{{item.relationType | nothingFilter}}</td>
              </tr>
              <tr>
                <td class="blackTd">身份证号</td>
                <td colspan="3">{{item.cardNo | nothingFilter}}</td>
                <td class="blackTd">移动电话</td>
                <td>{{item.mobilePhone | nothingFilter}}</td>
                <td class="blackTd">是否为监护人</td>
                <td>{{item.guarder}}</td>
                <td class="blackTd"></td>
                <td></td>
              </tr>
              <tr>
                <td class="blackTd">户籍地址</td>
                <td colspan="9" style="text-align: left;">
                  <span>{{item.registerProvince}}{{item.registerCity}}{{item.registerDistrict}}{{item.registerAddress}}</span>
                </td>
              </tr>
              <tr>
                <td class="blackTd">居住地址</td>
                <td colspan="9" style="text-align: left;">
                  <span>{{item.residenceProvince}}{{item.residenceCity}}{{item.residenceDistrict}}{{item.residenceAddress}}</span>
                </td>
              </tr>
            </table>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <s class="redBa"></s>
          <span>家属{{form.length-index}}的证件信息</span>
        </div>
        <div id="idCard" style="margin-top:30px;">
          <el-row>
            <el-col :span="3">
              <el-row :gutter="0">
                <el-col :span="20" class="cardCenter centerCss" v-if="!item.photoCardFront || item.photoCardFront==''">
                  <img src="//image.youbankeji.com/web/dahuaAdmin/Group 10@2x.png" alt class="cardId_card"/>
                </el-col>
                <el-col :span="20" class="cardCenter centerCss" v-else>
                  <img :src="item.photoCardFront" alt class="cardId_card" style="width:180px;height:114px;"/>
                  <div class="bglarge" @click="lgPic(item.photoCardFront)"></div>
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
                <el-col :span="20" class="cardCenter centerCss" v-if="!item.photoCardBack || item.photoCardBack==''">
                  <img src="//image.youbankeji.com/web/dahuaAdmin/Group 13@2x.png" alt class="cardId_card"/>
                </el-col>
                <el-col :span="20" class="cardCenter centerCss" v-else>
                  <img :src="item.photoCardBack" alt class="cardId_card" style="width:180px;height:114px;"/>
                  <div class="bglarge" @click="lgPic(item.photoCardBack)"></div>
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
                <el-col :span="20" class="cardCenter centerCss" v-if="!item.photoResidenceHome || item.photoResidenceHome==''">
                  <img src="//image.youbankeji.com/web/dahuaAdmin/hukoubenshouye.png" alt class="cardId_card"/>
                </el-col>
                <el-col :span="20" class="cardCenter centerCss" v-else>
                  <img :src="item.photoResidenceHome" alt class="cardId_card" style="width:180px;height:114px;"/>
                  <div class="bglarge" @click="lgPic(item.photoResidenceHome)"></div>
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
                <el-col :span="20" class="cardCenter centerCss" v-if="!item.photoResidenceSelf || item.photoResidenceSelf==''">
                  <img src="//image.youbankeji.com/web/dahuaAdmin/hukoubengerenye.png" alt class="cardId_card"/>
                </el-col>
                <el-col :span="20" class="cardCenter centerCss" v-else>
                  <img :src="item.photoResidenceSelf" alt class="cardId_card" style="width:180px;height:114px;"/>
                  <div class="bglarge" @click="lgPic(item.photoResidenceSelf)"></div>
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
// import ubAvatar from '@/components/avatar';
export default {
  components: {
    // ubAvatar
  },
  props: ["elderId"],
  data() {
    return {
      option: [],
      provinceArrary: [], //省
      cityArrary: [], //市
      areaArrary: [], //区
      form: [
        {
          relationName: "",
          relationPhoto: "",
          relationType: "",
          elderId: "",
          mobilePhone: "",
          emergencyPhone: "",
          gender: "",
          nation: "",
          birthDay: "",
          cardNo: "",
          guarder: "",
          registerProvince: "",
          registerCity: "",
          registerDistrict: "",
          registerStreet: "",
          registerCommittee: "",
          registerAddress: "",
          residenceProvince: "",
          residenceCity: "",
          residenceDistrict: "",
          residenceStreet: "",
          residenceCommittee: "",
          residenceAddress: "",
        }
      ],
    };
  },
  created() {
    this.baseinfo();
  },
  methods: {
    baseinfo() {
      let data = {
        elderId: this.elderId
      };
      axios
      .fetch('elderServer', "/elderRelation/all", data)
      .then(res => {
          let resData = res.data;
          if(resData.length>0){
              this.form = resData;
              // for(let i=0; i<this.form.length; i++){
              //   //种类 对应的id index
              //   this.selectOption("性别",this.form[i].gender,i);
              //   this.selectOption("民族",this.form[i].nation,i);
              //   this.selectOption("与老人的关系",this.form[i].relationType,i);

              //   //类别 parentNo 区域等级 selfNo form[index] 
              //   this.changeArea('户籍地址',0,1,this.form[i].registerProvince,i);
              //   this.changeArea('户籍地址',this.form[i].registerProvince,2,this.form[i].registerCity,i);
              //   this.changeArea('户籍地址',this.form[i].registerCity,3,this.form[i].registerDistrict,i);
              //   this.changeArea('居住地址',0,1,this.form[i].residenceProvince,i);
              //   this.changeArea('居住地址',this.form[i].residenceProvince,2,this.form[i].residenceCity,i);
              //   this.changeArea('居住地址',this.form[i].residenceCity,3,this.form[i].residenceDistrict,i);
              // }
          }
      })
    },
    changeArea(category,parentNo,level,district,index){
        let data = {
					 parentNo: parentNo
        };
        axios
				.fetch('commonServer', "/dict/getDistrictByParentNo", data)
				.then(res => {
					 this.assembleArea(category,level,res.data,district,index);
				})
    },
    assembleArea(category,level,data,district,index){
        let districtNo = data.filter(item=>{return item.districtNo == district})[0].title;
        if(category==="户籍地址"){
            if(level==1){
                this.form[index].registerProvince = districtNo;
            }else if(level==2){
                this.form[index].registerCity = districtNo;
            }else if(level==3){
                this.form[index].registerDistrict = districtNo;
            }else if(level==4){
                this.form[index].registerStreet = districtNo;
            }
        }else if(category==="居住地址"){
            if(level==1){
                this.form[index].residenceProvince = districtNo;
            }else if(level==2){
                this.form[index].residenceCity = districtNo;
            }else if(level==3){
                this.form[index].residenceDistrict = districtNo;
            }else if(level==4){
                this.form[index].residenceStreet = districtNo;
            }
        }
    },
    //初始化下拉框数据
    selectOption(parentNos,itemId,index) {
      let data = {
          parentNos: parentNos
      }
      axios
      .fetch('commonServer', "/dict/getItemViewsByParentNo", data)
      .then(res => {
            let itemValue =  res.data.filter(item=>{return item.itemId==itemId})[0].title;
            if(parentNos==="性别"){
                this.form[index].gender = itemValue;
            }else if(parentNos==="民族"){
                this.form[index].nation = itemValue;
            }else if(parentNos==="与老人的关系"){
                this.form[index].relationType = itemValue;
            }
      })
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
.familyInfo-card >>> .el-card__body {
  min-height: 500px;
}
.family-info >>> .el-card__body{
  padding: 20px;
}
/* .box-card >>> .el-card__header {
    background: #fbfbfc;
    color: #333;
    line-height: 25px;
    font-weight: 700;
    padding: 15px 0 16px 20px;
} */
.elderBaseTable .blackTd {
    background: #fbfbfc;
    color: #666;
}

/* .blueBa{
    background: #3E6FA8;
    display: inline-block;
    width: 4px;
    height: 20px;
    border-radius: 3px;
    position: relative;
    top: 4px;
    margin-right: 10px;
} */
.elderBaseTable td {
    color: #333;
    font-size: 14px;
    padding: 14px 10px;
    border: 1px solid #EBEEF5;
    min-width: 80px;
    text-align: center;
}
</style>