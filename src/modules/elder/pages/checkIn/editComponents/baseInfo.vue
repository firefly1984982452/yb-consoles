<template>
  <div>
    <el-form :model="form" :show-message="false" ref="theForm" label-width="80px" class="examCard">
        <el-card class="box-card">  
          <div slot="header" class="clearfix">
            <s class="redBa"></s>
            <span>老人的基本信息</span>
          </div>
          <div id="familyData" style="margin-top:0px;">
            <el-row :gutter="0">
              <el-col :xl="3" :lg="4" style="z-index:1;">
                <ub-avatar category="elder" :valueId="elderId" v-model="form.elderPhoto"></ub-avatar>
              </el-col>
              <el-col :xl="21" :lg="20">
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="姓名" prop="elderName" required>
                      <el-input v-model.trim="form.elderName" clearable placeholder="请输入姓名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="性别" prop="gender" required>
                      <ub-dictionary group="性别" clearable v-model="form.gender"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="民族" prop="nation" required>
                      <ub-dictionary group="民族" clearable v-model="form.nation"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="出生日期" prop="birthDay" required>
                      <el-date-picker v-model="form.birthDay" type="date" placeholder="请选择" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="籍贯" prop="birthPlace" required>
                      <ub-address v-model="form.birthPlace" dataType="province" category="birthPlace" clearable></ub-address>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="身份证号" prop="cardNo" required>
                      <el-input v-model.trim="form.cardNo" clearable placeholder="请输入身份证号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="婚姻状况" prop="marriage" required>
                      <ub-dictionary group="婚姻状况" clearable v-model="form.marriage"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="政治面貌" prop="polity">
                      <ub-dictionary group="政治面貌" clearable v-model="form.polity"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 第四行 -->
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="学历" prop="educational" required>
                      <ub-dictionary group="学历" clearable v-model="form.educational"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="老人类别" prop="elderProperty" required>
                      <ub-dictionary group="老人类别" clearable v-model="form.elderProperty"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                   <el-col :xl="5" :lg="7">
                    <el-form-item label="医保类型">
                      <ub-dictionary group="医保类型" clearable v-model="form.insuranceType"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                   <el-col :xl="5" :lg="7">
                    <el-form-item label="社保卡号">
                      <el-input v-model.trim.number="form.insuranceNo" oninput="value=value.replace(/[^0-9A-Za-z.]/g,'')" clearable placeholder="请输入社保卡号"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="住宅电话">
                      <el-input v-model="form.homePhone" oninput="value=value.replace(/[^0-9.\-]/g,'')" clearable placeholder="请输入住宅电话"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="移动电话">
                      <el-input v-model="form.mobilePhone" oninput="value=value.replace(/[^0-9.]/g,'')" clearable placeholder="请输入移动电话"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--第六行-->
                <!--第八行-->
                <el-row :gutter="10">
                  <el-row :gutter="10">
                    <el-form-item label="户籍地址" prop="registerStreet" required label-width="85px" style="margin-bottom:0;">
                      <el-row :gutter="10">
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <ub-address v-model="form.registerProvince" dataType="province" category="register" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <ub-address v-model="form.registerCity" dataType="city" category="register" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <ub-address v-model="form.registerDistrict" dataType="district" category="register" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <ub-address v-model="form.registerStreet" dataType="street" category="register" clearable></ub-address>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="" prop="registerRoom" label-width="85px">
                      <el-row :gutter="10" id="adressProv">
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model.trim="form.registerRoad" placeholder="请输入内容"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>路</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model.trim="form.registerAlley" placeholder="请输入内容"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>弄</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model.trim="form.registerNumber" placeholder="请输入内容"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>号</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model.trim="form.registerRoom" placeholder="请输入内容"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>室</span>
                          </el-col>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-row>
                  <el-row :gutter="10">
                    <el-form-item label="详细地址" label-width="90px" prop="registerAddress" required>
                      <el-input v-model.trim="form.registerAddress" placeholder="请输入详细户籍地址" style="width:63.9%;" clearable></el-input>
                    </el-form-item>
                  </el-row>
                </el-row>
                <!--第九行-->
                <el-row :gutter="10">
                  <el-row>
                    <el-form-item label="现居住地" label-width="80px" prop="residenceStreet" required style="margin-bottom:0;">
                      <el-row :gutter="10">
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <ub-address v-model="form.residenceProvince" dataType="province" category="residence" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <ub-address v-model="form.residenceCity" dataType="city" category="residence" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <ub-address v-model="form.residenceDistrict" dataType="district" category="residence" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <ub-address v-model="form.residenceStreet" dataType="street" category="residence" clearable></ub-address>
                        </el-col>
                        <el-col :xl="2" :lg="3">
                          <el-button type="success" plain :style="{'background':firstZhuTi}" @click="synAddress()">
                            <i class="iconfont iconjichutubiao-tonghujidizhi" style="margin-right: 5px;display: inline-block;"></i>同户籍地址
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="" label-width="80px" prop="residenceRoom">
                      <el-row :gutter="10" id="adressProv">
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model.trim="form.residenceRoad" placeholder="请输入内容" @input="change($event)"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>路</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model.trim="form.residenceAlley" placeholder="请输入内容" @input="change($event)"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>弄</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model.trim="form.residenceNumber" placeholder="请输入内容" @input="change($event)"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>号</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model.trim="form.residenceRoom" placeholder="请输入内容" @input="change($event)"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>室</span>
                          </el-col>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-row>
                  <el-row :gutter="10">
                    <el-form-item label="详细地址" label-width="90px" prop="residenceAddress" required>
                      <el-input v-model.trim="form.residenceAddress" placeholder="请输入详细居住地址" style="width:63.7%;" @input="change($event)" clearable></el-input>
                    </el-form-item>
                  </el-row>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card" style="margin:20px 0 60px;">
          <div slot="header" class="clearfix">
            <s class="redBa"></s>
            <span>老人的证件信息</span>
            <span style="color: #999;font-size: 14px;font-weight: lighter;">请确保照片的内容完整并清晰可见，图片大小小于5M</span>
          </div>
          <div id="idCard" style="margin-top:0px;">
            <el-row>
              <el-col :span="3">
                <ub-photo category="sfzf" description="老人身份证正面照" v-model="form.photoCardFront"></ub-photo>
              </el-col>
              <el-col :span="3" style="margin-left: 10px;">
                <ub-photo category="sfzb" description="老人身份证反面照" v-model="form.photoCardBack"></ub-photo>
              </el-col>
              <el-col :span="3" style="margin-left: 10px;">
                <ub-photo category="hksy" description="户口簿首页" v-model="form.photoResidenceHome"></ub-photo>
              </el-col>
              <el-col :span="3" style="margin-left: 10px;">
                <ub-photo category="hkbry" description="户口簿本人页" v-model="form.photoResidenceSelf"></ub-photo>
              </el-col>
            </el-row>
          </div>
        </el-card>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import ubAddress from '@/components/address';
import ubDictionary from '@/components/dictionary';
import ubPhoto from '@/components/photo';
import ubAvatar from '@/components/avatar';

export default {
  name:"BaseInfo",
  props: ["elderId"],
  components: { ubAddress, ubDictionary, ubPhoto, ubAvatar },
  data() {
    return {
      sign: "",
      initStatus: false,//是否处于编辑初始化
      form: {
          registerRoom: "",
          residenceRoom: "",
          elderName: "",
          elderPhoto: "",
          gender: null,
          nation: null,
          birthDay: "",
          age: 0,
          birthPlace: null,
          cardNo: '',
          marriage: null,
          polity: null,
          educational: null,
          registerType: null,
          elderProperty: null,
          homePhone: "",
          mobilePhone: "",
          insuranceType: null,
          insuranceNo: "",
          registerPlace: "",
          registerProvince: null,
          registerCity: null,
          registerDistrict: null,
          registerStreet: null,
          registerRoad: "",
          registerAlley: "",
          registerNumber: "",
          registerAddress: "",
          residencePlace: null,
          residenceProvince: null,
          residenceCity: null,
          residenceDistrict: null,
          residenceStreet: null,
          residenceRoad: "",
          residenceAlley: "",
          residenceNumber: "",
          residenceAddress: "",
          elderRemark: null,
          photoCardFront: null,
          photoCardBack: null,
          photoResidenceHome: null,
          photoResidenceSelf: null,
          registerCommittee: null,
          residenceCommittee: null,
      },
      option: [],
      showDash: 1
    };
  },
  created() {
    ubDictionary.init(this);
    console.log(this.elderId);
    
    this.sign = this.$route.query.sign;
    const elderId = this.$route.query.elderId;
    console.log(elderId);
    const bookId = this.$route.query.bookId?this.$route.query.bookId :'';
    if(this.elderId){
       this.infoInit(this.elderId);
    }else if(elderId){
       this.infoInit(elderId);
    }
    // 从预定过来的
    if(bookId && elderId==0){
      this.getBookInfo(bookId);// 获取预定的老人及家属信
      this.form.bookId = bookId;
    }
  },
  methods: {
    // 获取预定的老人及家属信息
    getBookInfo(id){
      axios.fetch('elderServer','/bookElder/get/bookInfo',{bookId:id}).then(res=>{
        this.form =Object.assign({},this.form,res.data.bookElder);
        delete this.form.elderId;
      })
    },
    infoInit(elderId) {
      let data = {
        elderId: elderId
      };
      axios
      .fetch('elderServer', "/elderInfo/all", data)
      .then(res => {
        this.initStatus=true;
        let resData = res.data[0];
        this.form = resData;
        this.form.residencePlace = parseInt(resData.residencePlace);
      })
    },
    change(e) {
      this.$forceUpdate();
    },
    synAddress() {
      this.form.residenceProvince = this.form.registerProvince;
      this.form.residenceCity = this.form.registerCity;
      this.form.residenceDistrict = this.form.registerDistrict;
      this.form.residenceStreet = this.form.registerStreet;
      this.form.residenceRoad = this.form.registerRoad;
      this.form.residenceAlley = this.form.registerAlley;
      this.form.residenceNumber = this.form.registerNumber;
      this.form.residenceRoom = this.form.registerRoom;
      this.form.residenceAddress = this.form.registerAddress;
    },
    childAction() {
      this.$refs["theForm"].validate(valid => {
        // console.log(this.form.residencePlace)
        if(!valid) {
          this.$message.error('请填写完整表单');
          return;
        }else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.cardNo)) {
          this.$message.error("身份证不合法"); return;
        }
  
        axios
        .fetch('elderServer', "/elderInfo/submit", this.form, 'json')
        .then(res => {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.$emit(
              "baseinfo",
              "baseInfo",
              "familyInfo",
              res.data.elderId,
              this.form.elderName
            );
        })
      })
    }
  },
};
</script>

<style scoped>
.redBa {
    display: inline-block;
    width: 4px;
    height: 20px;
    border-radius: 3px;
    position: relative;
    top: 4px;
    margin-right: 10px;
    background: #F36969;
}
.box-card >>> .el-card__header {
    /* background: #fbfbfc;
    color: #333;
    line-height: 25px;
    font-weight: 700;
    padding: 15px 0 15px 20px; */
}
.examCard .el-form-item {
  margin-right: 25px;
}
.el-card__header >>> span{
    background: #fbfbfc;
    color: #333;
    line-height: 40px;
    font-weight: 700;
}
#img3, #img4, #img5 {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: .4rem;
    top: 0;
    left: 0;
}
.filepath {
    width: 100%;
    height: 40px;
    opacity: 0;
    position: absolute;
    z-index: 1;
    border: 1px solid #3E6FA8;
    border-radius: 4px;
    color: #3E6FA8;
    top: 0;
    left: 0;
    background: red;
    cursor: pointer;
}
#imgSpan, #imgSpan4, #imgSpan5, #idCardSpan, #idCardConnect {
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 40px;
    top: 230px !important;
    left: 50%;
    border: 1px solid #3E6FA8;
    border-radius: 4px;
    color: #3E6FA8;
    line-height: 40px;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
}
.baseInfo_content{
    background: #fbfbfc;
    color: #333;
    line-height: 40px;
    font-weight: 700;
    margin-bottom: 30px;
    border-bottom: 1px solid #EBEEF5;
}
#prompt3, #prompt4, #prompt2 {
    width: 100%;
    height: 180px;
    text-align: center;
    position: relative;
}
.el-image {
    position: relative;
    bottom: 180px;
}
#imgSpan {
  top: 220px !important;
}
#idCardSpan {
  top: 260px !important;
}
#imgPreview {
  width: 66% !important;
  height: 200px !important;
}
.spanImgText {
  padding: 8px 12px;
  font-size: 14px;
  font-family: PingFangSC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
  border: 1px solid #d3d4d6;
  border-radius: 4px;
}
.moreXinxi .jj {
  width: 14px;
  display: inline-block;
  transition: all 0.3s linear;
}
.moreXinxi .jjs {
  width: 14px;
  display: inline-block;
  transform: rotate(180deg);
  transition: all 0.3s linear;
}
.moreXinxi .jj img,
.moreXinxi .jjs img {
  width: 100%;
}
#idCard img{
   width: 180px;
   height: 114px;
}
.el-select,.el-date-editor {
  width: 100%;
}
#prompt5 {
  text-align: center;
  margin-top: 20px;
}
</style>