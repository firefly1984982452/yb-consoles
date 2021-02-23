<template>
  <div>
    <el-form :model="form" label-width="80px" class="examCard" :rules="rules">
        <el-card class="box-card">  
          <div slot="header" class="clearfix">
            <s class="redBa"></s>
            <span>老人的基本信息</span>
          </div>
          <div id="familyData" style="margin-top:0px;">
            <el-row :gutter="0">
              <el-col :xl="3" :lg="4" style="z-index:1;">
                <div id="imgPreview" :class="{'showDashed':showDash==1 ,'hideDashed':showDash == 0}" style="position:relative;left: 20%;top:0px">
                  <div id="prompt3">
                    <span id="imgSpan" style="width: 95%;font-size:14px;border: 1px solid #D3D4D6;color: #333;font-weight: bolder">
                      上传照片
                      <input type="file" id="file" class="filepath" @change="changepic('file','img3','elderPhoto')" accept="image/jpg, image/jpeg, image/png, image/PNG"/>
                    </span>
                  </div>
                  <el-image id="img3" :src="ossPic+form.elderPhoto" v-if="form.elderPhoto"></el-image>
                  <el-image id="img3" src="//image.youbankeji.com/web/dahuaAdmin/Group%204%402x.png" 
                  :preview-src-list="['//image.youbankeji.com/web/dahuaAdmin/Group%204%402x.png']" v-if="(!form.elderPhoto||form.elderPhoto=='')"></el-image>
                </div>
              </el-col>
              <el-col :xl="21" :lg="20">
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="姓名" prop="eb_name">
                      <el-input v-model="form.elderName" clearable placeholder="请输入姓名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="性别" prop="eb_gender">
                      <el-select v-model="dict['性别'].items.item0" placeholder="请选择" @change="dictUtils.onchange($event, 0, dict['性别'])" @click.native="change($event)" value-key="itemValue" clearable>
                        <el-option v-for="item in dict['性别'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="民族" prop="eb_nation">
                      <el-select v-model="dict['民族'].items.item0" placeholder="请选择" @change="dictUtils.onchange($event, 0, dict['民族'])" @click.native="change($event)" value-key="itemValue" clearable>
                        <el-option v-for="item in dict['民族'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="出生日期" prop="eb_birth">
                      <el-date-picker v-model="form.birthDay" type="date" placeholder="请选择" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="籍贯" prop="eb_birthplace">
                      <el-select v-model="form.birthPlace" placeholder="请选择" clearable>
                        <el-option v-for="item in birthPlaceArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="身份证号" prop="eb_id_card">
                      <el-input v-model="form.cardNo" clearable placeholder="请输入身份证号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="婚姻状况" prop="eb_marriage">
                      <el-select v-model="dict['婚姻状况'].items.item0" @click.native="change($event)" placeholder="请选择" @change="dictUtils.onchange($event, 0,dict['婚姻状况'])" value-key="itemValue" clearable>
                        <el-option v-for="item in dict['婚姻状况'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="政治面貌" prop>
                      <el-select v-model="dict['政治面貌'].items.item0" placeholder="请选择" @change="dictUtils.onchange($event, 0, dict['政治面貌'])" @click.native="change($event)" value-key="itemValue" clearable>
                        <el-option v-for="item in dict['政治面貌'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 第四行 -->
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="学历" prop="eb_educational_level">
                      <el-select v-model="dict['学历'].items.item0" @click.native="change($event)" placeholder="请选择" @change="dictUtils.onchange($event, 0, dict['学历'])" value-key="itemValue" clearable>
                        <el-option v-for="item in dict['学历'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="老人类别" prop="eb_category">
                      <el-select v-model="dict['老人类别'].items.item0" @click.native="change($event)" placeholder="请选择" @change="dictUtils.onchange($event, 0, dict['老人类别'])" value-key="itemValue" clearable>
                        <el-option v-for="item in dict['老人类别'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                   <el-col :xl="5" :lg="7">
                    <el-form-item label="医保类型">
                      <el-select v-model="dict['医保类型'].items.item0" placeholder="请选择" @change="dictUtils.onchange($event, 0, dict['医保类型'])" @click.native="change($event)" value-key="itemValue" clearable>
                        <el-option v-for="item in dict['医保类型'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                   <el-col :xl="5" :lg="7">
                    <el-form-item label="社保卡号">
                      <el-input v-model="form.insuranceNo" clearable placeholder="请输入社保卡号"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="住宅电话">
                      <el-input v-model="form.homePhone" clearable placeholder="请输入住宅电话"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="5" :lg="7">
                    <el-form-item label="移动电话">
                      <el-input v-model="form.mobilePhone" clearable placeholder="请输入移动电话"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--第六行-->
                <el-row :gutter="10">
                  <el-col :xl="5" :lg="7">
                   <el-form-item label="户籍类型" prop="eb_huji_type">
                      <el-select v-model="dict['户籍类型'].items.item0" placeholder="请选择" @change="dictUtils.onchange($event, 0,dict['户籍类型'])" value-key="itemValue" clearable>
                        <el-option v-for="item in dict['户籍类型'].lists.list0" :key="item.itemValue" :label="item.title" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--第八行-->
                <el-row :gutter="10">
                  <el-row :gutter="10">
                    <el-form-item label="户籍地址" prop="ead_province" label-width="85px">
                      <el-row :gutter="10">
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <!-- <el-select v-model="form.registerProvince" clearable placeholder="请选择(必选)" filterable @change="changeArea('户籍地址',form.registerProvince,2)" no-match-text=" " prop="ead_province">
                            <el-option v-for="item in provinceArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select> -->
                          <ub-address v-model="form.registerProvince" dataType="province" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <!-- <el-select v-model="form.registerCity" clearable placeholder="请选择(必选)" filterable @change="changeArea('户籍地址',form.registerCity,3)" no-match-text=" ">
                            <el-option v-for="item in cityArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select> -->
                          <ub-address v-model="form.registerCity" dataType="city" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <!-- <el-select v-model="form.registerDistrict" clearable placeholder="请选择(必选)" filterable @change="changeArea('户籍地址',form.registerDistrict,4)" no-match-text=" ">
                            <el-option v-for="item in areaArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select> -->
                          <ub-address v-model="form.registerDistrict" dataType="district" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <!-- <el-select v-model="form.registerStreet" clearable placeholder="请选择(必选)" filterable no-match-text=" ">
                            <el-option v-for="item in streetArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select> -->
                          <ub-address v-model="form.registerStreet" dataType="street" clearable></ub-address>
                        </el-col>
                      </el-row>
                      <el-row :gutter="10" id="adressProv">
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model="form.registerRoad" placeholder="请输入内容"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>路</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model="form.registerAlley" placeholder="请输入内容"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>弄</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model="form.registerNumber" placeholder="请输入内容"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>号</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model="form.registerRoom" placeholder="请输入内容"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>室</span>
                          </el-col>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-row>
                  <el-row :gutter="10">
                    <el-form-item label="详细地址" label-width="90px" prop="ead_address">
                      <el-input v-model="form.registerAddress" placeholder="请输入详细户籍地址" style="width:63.9%;" clearable></el-input>
                    </el-form-item>
                  </el-row>
                </el-row>
                <!--第九行-->
                <el-row :gutter="10">
                  <el-row :gutter="10">
                    <el-form-item label="现居住类型" label-width="95px" prop="type2">
                      <el-row :gutter="10">
                        <el-col :span="6">
                          <el-radio-group v-model="form.residencePlace">
                            <el-radio :label="1">本市</el-radio>
                            <el-radio :label="2">外省市</el-radio>
                          </el-radio-group>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="现居住地" label-width="80px" prop="ead_jprovince">
                      <el-row :gutter="10">
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <!-- <el-select v-model="form.residenceProvince" placeholder="请选择" @change="changeArea('现居住地',form.residenceProvince,2)" clearable>
                            <el-option v-for="item in provinceFamilyArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select> -->
                          <ub-address v-model="form.residenceProvince" dataType="province" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <!-- <el-select v-model="form.residenceCity" placeholder="请选择" @change="changeArea('现居住地',form.residenceCity,3)" clearable>
                            <el-option v-for="item in cityFamilyArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select> -->
                          <ub-address v-model="form.residenceCity" dataType="city" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <!-- <el-select v-model="form.residenceDistrict" clearable placeholder="请选择" @change="changeArea('现居住地',form.residenceDistrict,4)">
                            <el-option v-for="item in areaFamilyArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select> -->
                          <ub-address v-model="form.residenceDistrict" dataType="district" clearable></ub-address>
                        </el-col>
                        <el-col :xl="4" :lg="6" style="margin-bottom: 18px;">
                          <!-- <el-select v-model="form.residenceStreet" clearable placeholder="请选择">
                            <el-option v-for="item in streetFamilyArrary" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select> -->
                          <ub-address v-model="form.residenceStreet" dataType="street" clearable></ub-address>
                        </el-col>
                        <el-col :xl="2" :lg="3">
                          <el-button type="success" plain :style="{'background':firstZhuTi}" @click="synAddress()">
                            <i class="iconfont iconjichutubiao-tonghujidizhi" style="margin-right: 5px;display: inline-block;"></i>同户籍地址
                          </el-button>
                        </el-col>
                      </el-row>
                      <el-row :gutter="10" id="adressProv">
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model="form.residenceRoad" placeholder="请输入内容" @input="change($event)"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>路</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model="form.residenceAlley" placeholder="请输入内容" @input="change($event)"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>弄</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model="form.residenceNumber" placeholder="请输入内容" @input="change($event)"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>号</span>
                          </el-col>
                        </el-col>
                        <el-col :xl="4" :lg="6">
                          <el-col :span="21">
                            <el-input v-model="form.residenceRoom" placeholder="请输入内容" @input="change($event)"></el-input>
                          </el-col>
                          <el-col :span="3">
                            <span>室</span>
                          </el-col>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-row>
                  <el-row :gutter="10">
                    <el-form-item label="详细地址" label-width="90px" prop="ead_jaddress">
                      <el-input v-model="form.residenceAddress" placeholder="请输入详细居住地址" style="width:63.7%;" @input="change($event)" clearable></el-input>
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
                <el-row :gutter="0">
                  <el-col :span="20" class="cardCenter centerCss" >
                    <img id="frontCard" src="//image.youbankeji.com/web/dahuaAdmin/Group 10@2x.png" alt class="cardId_card" v-if="!form.photoCardFront || form.photoCardFront==''"/>
                    <img id="frontCard" :src="ossPic+form.photoCardFront" alt class="cardId_card" v-else/>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :span="20" class="cardCenter centerCss">
                    <div id="prompt5">
                      <span class="spanImgText">
                        上传身份证正面照片
                        <input type="file" id="frontCardFile" class="filepath" @change="changepic('frontCardFile','frontCard','photoCardFront')" accept="image/jpg, image/jpeg, image/png, image/PNG"/>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="3" style="margin-left: 10px;">
                <el-row :gutter="0">
                  <el-col :span="20" class="cardCenter centerCss">
                    <img id="reverseCard" src="//image.youbankeji.com/web/dahuaAdmin/Group 13@2x.png" alt class="cardId_card" v-if="!form.photoCardBack || form.photoCardBack==''||form.photoCardBack==undefined"/>
                    <img id="reverseCard" :src="ossPic+form.photoCardBack" alt class="cardId_card" v-else/>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :span="20" class="cardCenter centerCss">
                    <div id="prompt5">
                      <span class="spanImgText">
                        上传身份证反面照片
                        <input type="file" id="reverseCardFile" class="filepath" @change="changepic('reverseCardFile','reverseCard','photoCardBack')" accept="image/jpg, image/jpeg, image/png, image/PNG"/>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="3" style="margin-left: 10px;">
                <el-row :gutter="0">
                  <el-col :span="20" class="cardCenter centerCss">
                    <img id="homePage" src="//image.youbankeji.com/web/dahuaAdmin/hukoubenshouye.png" alt class="cardId_card" v-if="!form.photoResidenceHome || form.photoResidenceHome==''"/>
                    <img id="homePage" :src="ossPic+form.photoResidenceHome" alt class="cardId_card" v-else/>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :span="20" class="cardCenter centerCss">
                    <div id="prompt5">
                      <span class="spanImgText">
                        上传户口簿首页
                        <input type="file" id="homePagefile" class="filepath" @change="changepic('homePagefile','homePage','photoResidenceHome')" accept="image/jpg, image/jpeg, image/png, image/PNG"/>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="3" style="margin-left: 10px;">
                <el-row :gutter="0">
                  <el-col :span="20" class="cardCenter centerCss" >
                    <img id="selfPage" src="//image.youbankeji.com/web/dahuaAdmin/hukoubengerenye.png" alt class="cardId_card" v-if="!form.photoResidenceSelf || form.photoResidenceSelf==''"/>
                    <img id="selfPage" :src="ossPic+form.photoResidenceSelf" alt class="cardId_card" v-else/>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :span="24" class="cardCenter centerCss">
                    <div id="prompt5">
                      <span class="spanImgText">
                        上传户口簿本人页
                        <input type="file" id="selfPageFile" class="filepath" @change="changepic('selfPageFile','selfPage','photoResidenceSelf')" accept="image/jpg, image/jpeg, image/png, image/PNG"/>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import { dictUtils } from 'youban-utils';
import ubAddress from '@/components/address';

export default {
  props: ["elderId"],
  components: { ubAddress },
  data() {
    return {
      sign: "",
      initStatus: false,//是否处于编辑初始化
      form: {
          registerRoom: "",
          residenceRoom: "",
          elderName: "",
          elderPhoto: "",
          gender: "",
          nation: "",
          birthDay: "",
          age: 0,
          birthPlace: "",
          cardNo: "",
          marriage: "",
          polity: "",
          educational: "",
          registerType: "",
          elderProperty: "",
          homePhone: "",
          mobilePhone: "",
          insuranceType: "",
          insuranceNo: "",
          registerPlace: "",
          registerProvince: "",
          registerCity: "",
          registerDistrict: "",
          registerStreet: "",
          registerRoad: "",
          registerAlley: "",
          registerNumber: "",
          registerAddress: "",
          residencePlace: "",
          residenceProvince: "",
          residenceCity: "",
          residenceDistrict: "",
          residenceStreet: "",
          residenceRoad: "",
          residenceAlley: "",
          residenceNumber: "",
          residenceAddress: "",
          elderRemark: "",
          photoCardFront: "",
          photoCardBack: "",
          photoResidenceHome: "",
          photoResidenceSelf: "",
          registerCommittee: "",
          residenceCommittee: "",
      },
      option: [],
      showDash: 1,
      birthPlaceArrary: [], //籍贯
      provinceArrary: [], //省
      cityArrary: [], //市
      areaArrary: [], //区
      streetArrary: [], //街道
      provinceFamilyArrary: [], //省
      cityFamilyArrary: [], //市
      areaFamilyArrary: [], //区
      streetFamilyArrary: [], //街道
      dict: {
        性别: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        民族: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        婚姻状况: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        政治面貌: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        学历: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        户籍类型: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        老人类别: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        医保类型: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        }
      },
      rules: {
        eb_name: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_nation: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_birthplace: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_educational_level: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        type1: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        type2: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ead_province: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ead_jprovince: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_marriage: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_birth: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_id_card: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_category: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_gender: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_huji_type: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_admission_number: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],

        eb_political_status: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        efsEstimateTime: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_name: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_mobile_phone: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_type: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_nation: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_gender: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_id_card: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_type: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_is_agent: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ef_province: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ead_address: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        ead_jaddress: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        eb_yuan_date: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  created() {
    this.dictUtils = new dictUtils(this.dict);
    this.changeArea('籍贯',0,1);
    this.sign = this.$route.query.sign;
    if(this.elderId){
       this.infoInit();
    }
  },
  methods: {
    infoInit() {
      let data = {
        elderId: this.elderId
      };
      axios
      .fetch('elderServer', "/elderInfo/all", data)
      .then(res => {
        this.initStatus=true;
        let resData = res.data[0];
        this.form = resData;
        this.form.residencePlace = parseInt(resData.residencePlace);
        this.dict["性别"].values.value0 = resData.gender;
        this.dict["民族"].values.value0 = resData.nation;
        this.dict["婚姻状况"].values.value0 = resData.marriage;
        this.dict["政治面貌"].values.value0 = resData.polity;
        this.dict["学历"].values.value0 = resData.educational;
        this.dict["户籍类型"].values.value0 = resData.registerType;
        this.dict["老人类别"].values.value0 = resData.elderProperty;
        this.dict["医保类型"].values.value0 = resData.insuranceType;
        this.dictUtils.setValues(this.dict);

        this.changeArea('户籍地址',this.form.registerProvince,2);
        this.changeArea('户籍地址',this.form.registerCity,3);
        this.changeArea('户籍地址',this.form.registerDistrict,4);
        this.changeArea('现居住地',this.form.residenceProvince,2);
        this.changeArea('现居住地',this.form.residenceCity,3);
        this.changeArea('现居住地',this.form.residenceDistrict,4);
      })
    },
    changeArea(category,parentNo,level){
        let data = {
					 parentNo: parentNo
        };
        axios
				.fetch('commonServer', "/dict/getDistrictByParentNo", data)
				.then(res => {
          this.assembleArea(category,level,res.data);
          if(this.initStatus==true&&level==4&&category=="现居住地")
          this.initStatus=false;
				})
    },
    assembleArea(category,level,data){
        let Arrays = data.map(item=>{
            return {
              value: item.districtNo,
              label: item.title
            }
        });
        if(category==="籍贯"){
            this.birthPlaceArrary = Arrays;
            this.provinceArrary = Arrays;
            this.provinceFamilyArrary = Arrays;
        }else if(category==="户籍地址"){
            if(level==2){
              if(this.initStatus===false){
                this.cityArrary=[];
                this.areaArrary=[];
                this.streetArrary=[];
                this.form.registerCity="";
                this.form.registerDistrict="";
                this.form.registerStreet="";
              }
              this.cityArrary = Arrays;
            }else if(level==3){
              if(this.initStatus===false){
                this.areaArrary=[];
                this.streetArrary=[];
                this.form.registerDistrict="";
                this.form.registerStreet="";
              }
              this.areaArrary = Arrays;
            }else if(level==4){
              if(this.initStatus===false){
                this.streetArrary=[];
                this.form.registerStreet="";
              }
              this.streetArrary = Arrays;
            }
        }else if(category==="现居住地"){
            if(level==2){
              if(this.initStatus===false){
                this.cityFamilyArrary=[];
                this.areaFamilyArrary=[];
                this.streetFamilyArrary=[];
                this.form.residenceCity="";
                this.form.residenceDistrict="";
                this.form.residenceStreet="";
              }
              this.cityFamilyArrary = Arrays;
            }else if(level==3){
              if(this.initStatus===false){
                this.areaFamilyArrary=[];
                this.streetFamilyArrary=[];
                this.form.residenceDistrict="";
                this.form.residenceStreet="";
              }
              this.areaFamilyArrary = Arrays;
            }else if(level==4){
              if(this.initStatus===false){
                this.streetFamilyArrary=[];
                this.form.residenceStreet="";
              }
              this.streetFamilyArrary = Arrays;
            }
        }
    },
    toRuZhuInit(){
      this.sign = this.$route.query.sign;
      let srsv_id = this.$route.query.srsv_id;
      this.$store.commit("setStaffDataCreate", this.form);
			
				let data = {
					srsv_id: srsv_id
				};
				axios
					.post("sev/Reservation/loadReservation", qs.stringify(data))
					.then(res => {
						this.loading = false;
						this.blockImg = 0;
						if(res.data.code == "200") {
							this.form = res.data.data;
              this.$store.commit("setStaffDataCreate", this.form);
              if (res.data.data.epo_hprovince == "上海市") {
                this.form.type1 = 1;
              } else {
                this.form.type1 = 2;
              }
              if (res.data.data.epo_jprovince == "上海市") {
                this.form.type2 = 1;
              } else {
                this.form.type2 = 2;
              }
              this.dict["性别"].values.value0 = res.data.data.eb_gender;
              this.dict["民族"].values.value0 = res.data.data.eb_nation;
              this.dict["婚姻状况"].values.value0 = res.data.data.eb_marriage;
              this.dict["政治面貌"].values.value0 = res.data.data.eb_political_status;
              this.dict["学历"].values.value0 = res.data.data.eb_educational_level;
              this.dict["户籍类型"].values.value0 = res.data.data.eb_huji_type;
              this.dict["老人类别"].values.value0 = res.data.data.eb_category;
              this.dict["医保类型"].values.value0 = res.data.data.eb_ss_type;
              this.dictUtils.setValues(this.dict);
						} else if(res.data.code == "401") {
							this.$message({
								message: res.data.message,
								type: "warning"
							});
							this.$router.push("/login");
						} else {
							this.$message.error(res.data.message);
						}
					});
    },
    change(e) {
      this.$forceUpdate();
    },
    dataURLtoBlob(dataurl) {
      if (dataurl) {
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = new ArrayBuffer(bstr.length),
          u8arr = new Uint8Array(n);
        for (var i = 0; i < bstr.length; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        return new Blob([n], {
          type: mime
        });
      }
    },
    // 上传图片
    changepic(fileId,divId,field) {
        let that = this;
        var reads = new FileReader();
        var f = document.getElementById(fileId).files[0];
        reads.readAsDataURL(f);
        reads.onload = function(e) {
        let result = this.result;
        var params = new FormData();
        params.append("file", that.dataURLtoBlob(result));
        axios
				.fetch('mediaServer', "/common/upload", params,"json","post")
				.then(res => {
            switch(field){
              case 'elderPhoto':
                that.form.elderPhoto = res.url;
                break;
              case 'photoCardFront':
                that.form.photoCardFront = res.url;
                break;
              case 'photoCardBack':
                that.form.photoCardBack = res.url;
                break;
              case 'photoResidenceHome':
                that.form.photoResidenceHome = res.url;
                break;
              case 'photoResidenceSelf':
                that.form.photoResidenceSelf = res.url;
                break;
            }
            document.getElementById(divId).src = that.ossPic + res.url;
				})
            // that.$ajax({
            //     method: "post",
            //     url: server['uploadServer'] + "/common/upload",
            //     data: params,
            //     async: true,
            //     cache: false,
            //     contentType: false,
            //     processData: false,
            //     dataType: "json"
            // })
            // .then(function(response) {
            //     if (response.data.code == 200) {
            //       switch(field){
            //         case 'elderPhoto':
            //           that.form.elderPhoto = response.data.url;
            //           break;
            //         case 'photoCardFront':
            //           that.form.photoCardFront = response.data.url;
            //           break;
            //         case 'photoCardBack':
            //           that.form.photoCardBack = response.data.url;
            //           break;
            //         case 'photoResidenceHome':
            //           that.form.photoResidenceHome = response.data.url;
            //           break;
            //         case 'photoResidenceSelf':
            //           that.form.photoResidenceSelf = response.data.url;
            //           break;
            //       }
            //       document.getElementById(divId).src = that.ossPic + response.data.url;

            //     } else if (response.data.code == "401") {
            //       that.$message({
            //         message: response.data.message,
            //         type: "warning"
            //       });
            //     } else {
            //       that.$message.error({
            //         message: response.data.message
            //       });
            //     }
            //   })
            //   .catch(function(error) {
            //     that.$message.error(error);
            //     that.loading = false;
            //   });
            };
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
      this.changeArea('现居住地',this.form.residenceProvince,2);
      this.changeArea('现居住地',this.form.residenceCity,3);
      this.changeArea('现居住地',this.form.residenceDistrict,4);
    },
    childAction() {
      this.form.gender = this.dict["性别"].values.value0;
      this.form.nation = this.dict["民族"].values.value0;
      this.form.marriage = this.dict["婚姻状况"].values.value0;
      this.form.polity = this.dict["政治面貌"].values.value0;
      this.form.educational = this.dict["学历"].values.value0;
      this.form.registerType = this.dict["户籍类型"].values.value0;
      this.form.elderProperty = this.dict["老人类别"].values.value0;
      this.form.insuranceType = this.dict["医保类型"].values.value0;
      if (this.form.elderName == "" || this.form.elderName == undefined) {
        this.$message.error("请输入姓名");return;
      }else if (this.form.gender == "" || this.form.gender == undefined) {
        this.$message.error("请选择性别");return;
      }else if (this.form.nation == "" || this.form.nation == undefined) {
        this.$message.error("请选择民族");return;
      }else if (this.form.birthDay == "" || this.form.birthDay == undefined) {
        this.$message.error("请输入出生年月");return;
      }else if (this.form.birthPlace == "" || this.form.birthPlace == undefined) {
        this.$message.error("请选择籍贯");return;
      }else if (this.form.cardNo == "" || this.form.cardNo == undefined) {
        this.$message.error("请输入身份证号");return;
      }else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.cardNo)) {
          this.$message.error("身份证不合法"); return;
      }else if (this.form.marriage == "" || this.form.marriage == undefined) {
        this.$message.error("请选择婚姻状况");return;
      }else if (this.form.educational == "" || this.form.educational == undefined) {
        this.$message.error("请选择学历");return;
      }else if (this.form.elderProperty == "" || this.form.elderProperty == undefined) {
        this.$message.error("请选择老人类别");return;
        debugger
      }else if (this.form.registerType == "" || this.form.registerType == undefined) {
        this.$message.error("请输入户籍类型");return;
      }else if (this.form.registerProvince == "" || this.form.registerProvince == undefined) {
        this.$message.error("请输入户籍地址");return;
      }else if (this.form.registerCity == "" || this.form.registerCity == undefined) {
        this.$message.error("请输入户籍地址");return;
      }else if (this.form.registerDistrict == "" || this.form.registerDistrict == undefined) {
        this.$message.error("请输入户籍地址");return;
      }else if ((this.form.registerStreet == "" || this.form.registerStreet == undefined) && this.form.registerStreet != "市辖区") {
        this.$message.error("请输入户籍地址");return;
      }else if (this.form.registerAddress == "" || this.form.registerAddress == undefined) {
        this.$message.error("请输入户籍详细地址");return;
      }else if (this.form.residencePlace == "" || this.form.residencePlace == undefined) {
        this.$message.error("请输入现居住类型");return;
      }else if (this.form.residenceProvince == "" || this.form.residenceProvince == undefined) {
        this.$message.error("请输入现居住地");return;
      }else if (this.form.residenceCity == "" || this.form.residenceCity == undefined) {
        this.$message.error("请输入现居住地");return;
      }else if (this.form.residenceDistrict == "" || this.form.residenceDistrict == undefined) {
        this.$message.error("请输入现居住地"); return;
      }else if (this.form.residenceStreet == "" || this.form.residenceStreet == undefined || (!this.form.residenceStreet && this.form.residenceStreet != "市辖区")) {
        this.$message.error("请输入现居住地");return;
      }else if (this.form.residenceAddress == "" || this.form.residenceAddress == undefined) {
        this.$message.error("请输入现居住详细地址");return;
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
    background: #fbfbfc;
    color: #333;
    line-height: 40px;
    font-weight: 700;
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