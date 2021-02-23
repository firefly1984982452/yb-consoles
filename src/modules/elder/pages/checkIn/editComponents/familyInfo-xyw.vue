<template>
  <!-- 编辑家属信息 -->
  <div>
    <el-card class="box-card" v-for="(item,index) in form" :key="index" style="margin-bottom:10px;">
      <div slot="header" class="clearfix clearBtns" style="height: 35px">
        <s class="blueBa"></s>
        <span>家属{{form.length-index}}</span>
        <el-button @click="cancelFl(index)" class="clearBtn" v-if="form.length>1" style="background:#6cbc6c;margin-top: 0;:hover{background:#6cbc6c}!important">
          <i class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i>删除
        </el-button>
        <el-button @click="addFamily(item)" class="addBtn" v-show="operateStatus == -1">
          <i class="iconfont iconjichutubiao-tianjia-huise"></i>新增
        </el-button>
        <el-button v-if="operateStatus != index" @click="editFamily(index)" class="addBtn" style="background:#6cbc6c;margin-top: 0;:hover{background:#6cbc6c}!important">
          <i class="iconfont iconcaozuotubiao-bianji"></i>编辑
        </el-button>
        <!-- <el-button v-if="operateStatus == index" @click="cancel" class="addBtn" style="background:#6cbc6c;margin-top: 0;:hover{background:#6cbc6c}!important">
          <i class="iconfont iconcaozuotubiao-bianji"></i>取消
        </el-button> -->
        <!-- <el-button @click="save('saveForm')" class="addBtn" style="background:#6cbc6c;margin-top: 0;:hover{background:#6cbc6c}!important">
          <i class="iconfont iconcaozuotubiao-bianji"></i>保存
        </el-button> -->
      </div>
      <!-- 查看时 -->
      <el-form label-width="110px" disabled v-show="!(operateStatus===index)">
        <div id="newfamilyData">
          <el-row :gutter="10">
            <el-col :xl="3" :lg="3" style="z-index:1;">
              <!-- <div id="imgPreview" :class="{'showDashed':showDash==1 ,'hideDashed':showDash == 0}" style="position:relative;left: 20%;top:0px"> -->
              <!-- <div id="prompt3">
                    <span id="imgSpan" style="width: 95%;font-size:14px;border: 1px solid #D3D4D6;color: #333;background: white;font-weight: bolder;">
                      上传照片
                      <input type="file" :id="'file'+(index+1)" class="filepath" @change="changepic('file'+(index+1),'imgPic'+(index+1),index)" accept="image/jpg, image/jpeg, image/png, image/PNG"/>
                    </span>
                  </div>
                  <img id="img3" src="http://image.youbankeji.com/web/dahuaAdmin/Group%204%402x.png" v-if="!(form[index].relationPhoto)||(form[index].relationPhoto)==''" style="height:180px!important;"/>
                  <img :id="'imgPic'+(index+1)" :src="ossPic+form[index].relationPhoto" v-else style="width:140px;height:180px!important;position:relative;top:-180px;"/>
                </div> -->
              <ub-avatar category="elder" v-model="item.relationPhoto"></ub-avatar>
            </el-col>
            <el-col :xl="21" :lg="21">
              <el-row :gutter="10">
                <el-col :xl="6" :lg="8">
                  <el-form-item label="家属姓名">
                    <el-input v-model="item.relationName" placeholder="请输入名字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="移动电话">
                    <el-input v-model="item.mobilePhone" placeholder="请输入手机号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="紧急联系电话">
                    <el-input v-model="item.emergencyPhone" placeholder="请输入手机号"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xl="6" :lg="8">
                  <el-form-item label="性别">
                    <el-select v-model="item.gender" placeholder="请选择">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="民族">
                    <el-select v-model="item.nation" placeholder="请选择">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="出生日期">
                    <el-date-picker v-model="item.birthDay" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xl="6" :lg="8">
                  <el-form-item label="身份证号">
                    <el-input v-model="item.cardNo" clearable maxlength="18" placeholder="请输入身份证"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="与老人的关系">
                    <el-select v-model="item.relationType" placeholder="请选择">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="是否为监护人">
                    <el-select v-model="item.guarder" placeholder="请选择" @change="janhuren(index)">
                      <el-option v-for="(items,indexs) in guarderOption" :key="indexs" :label="items" :value="items"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-form-item label="户籍地址">
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;">
                    <el-select v-model="item.registerProvince" placeholder="请选择" @change="changeArea('户籍地址',item.registerProvince,2,index)">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                    <el-select v-model="item.registerCity" placeholder="请选择" @change="changeArea('户籍地址',item.registerCity,3,index)">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                    <el-select v-model="item.registerDistrict" placeholder="请选择">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xl="16" :lg="20" style="margin-top: 15px;">
                    <el-input v-model="item.registerAddress" placeholder="请输入详细地址"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row :gutter="0">
                <el-form-item label="居住地址">
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;">
                    <el-select v-model="item.residenceProvince" placeholder="请选择" @change="changeArea('居住地址',item.residenceProvince,2,index)">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                    <el-select v-model="item.residenceCity" placeholder="请选择" @change="changeArea('居住地址',item.residenceCity,3,index)">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                    <el-select v-model="item.residenceDistrict" placeholder="请选择">
                      <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :xl="16" :lg="20" style="margin-top: 15px;">
                    <el-input v-model="item.residenceAddress" placeholder="请输入详细地址"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row :gutter="0">
                <el-form-item label="家属证件信息">
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
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <!-- 编辑时 -->
      <el-form label-width="110px" :model="saveForm" :show-message="false" ref="saveForm" v-show="operateStatus===index">
        <div id="newfamilyData">
          <el-row :gutter="10">
            <el-col :xl="3" :lg="3" style="z-index:1;">
              <!-- <div id="imgPreview" :class="{'showDashed':showDash==1 ,'hideDashed':showDash == 0}" style="position:relative;left: 20%;top:0px">
                  <div id="prompt3">
                    <span id="imgSpan" style="width: 95%;font-size:14px;border: 1px solid #D3D4D6;color: #333;background: white;font-weight: bolder;">
                      上传照片
                      <input type="file" id="file" class="filepath" @change="changepic()" accept="image/jpg, image/jpeg, image/png, image/PNG"/>
                    </span>
                  </div>
                  <img id="img3" src="http://image.youbankeji.com/web/dahuaAdmin/Group%204%402x.png" v-if="!(saveForm.relationPhoto)||(saveForm.relationPhoto)==''" style="height:180px!important;"/>
                  <img id="imgPic" :src="ossPic+saveForm.relationPhoto" v-else style="width:140px;height:180px!important;position:relative;top:-180px;"/>
                </div> -->
              <ub-avatar category="elder" v-model="saveForm.relationPhoto"></ub-avatar>
            </el-col>
            <el-col :xl="21" :lg="21">
              <el-row :gutter="10">
                <el-col :xl="6" :lg="8">
                  <el-form-item label="家属姓名" prop="relationName" required>
                    <el-input v-model="saveForm.relationName" clearable placeholder="请输入名字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="移动电话" prop="mobilePhone" required>
                    <el-input v-model="saveForm.mobilePhone" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入手机号" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="紧急联系电话">
                    <el-input v-model.number="saveForm.emergencyPhone" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入手机号" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xl="6" :lg="8">
                  <el-form-item label="性别" prop="gender" required>
                    <ub-dictionary group="性别" clearable v-model="saveForm.gender"></ub-dictionary>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="民族" prop="nation" required>
                    <ub-dictionary group="民族" clearable v-model="saveForm.nation"></ub-dictionary>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="出生日期">
                    <el-date-picker v-model="saveForm.birthDay" type="date" placeholder="选择日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :xl="6" :lg="8">
                  <el-form-item label="身份证号" prop="cardNo" required>
                    <el-input v-model="saveForm.cardNo" clearable maxlength="18" placeholder="请输入身份证"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="与老人的关系" prop="relationType" required>
                    <ub-dictionary group="与老人的关系" clearable v-model="saveForm.relationType"></ub-dictionary>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="8">
                  <el-form-item label="是否为监护人" prop="guarder" required>
                    <el-select v-model="saveForm.guarder" placeholder="请选择" @change="janhuren()" :disabled="onlyRelation">
                      <el-option v-for="(items,indexs) in guarderOption" :key="indexs" :label="items" :value="items"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="0">
                <el-form-item label="户籍地址" prop="registerDistrict" required>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;">
                    <ub-address v-model="saveForm.registerProvince" dataType="province" category="register" clearable></ub-address>
                    <!-- <el-select v-model="saveForm.registerProvince" placeholder="请选择" @change="changeArea('户籍地址',item.registerCity,3,index)">
                        <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                      </el-select>  -->
                  </el-col>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                    <ub-address v-model="saveForm.registerCity" dataType="city" category="register" clearable></ub-address>
                    <!-- <el-select v-model="saveForm.registerCity" placeholder="请选择" @change="changeArea('户籍地址',item.registerCity,3,index)">
                        <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                      </el-select>  -->
                  </el-col>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                    <ub-address v-model="saveForm.registerDistrict" dataType="district" category="register" clearable></ub-address>
                    <!-- <el-select v-model="saveForm.registerDistrict" placeholder="请选择" @change="changeArea('户籍地址',item.registerCity,3,index)">
                        <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                      </el-select>  -->
                  </el-col>
                  <el-col :xl="16" :lg="20" style="margin-top: 15px;" prop="registerAddress" required>
                    <el-input v-model="saveForm.registerAddress" clearable placeholder="请输入详细地址"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row :gutter="0">
                <el-form-item label="居住地址" prop="residenceDistrict" required>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;">
                    <ub-address v-model="saveForm.residenceProvince" dataType="province" category="residence" clearable></ub-address>
                    <!-- <el-select v-model="saveForm.residenceProvince" placeholder="请选择" @change="changeArea('户籍地址',item.registerProvince,2,index)">
                        <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                      </el-select>     -->
                  </el-col>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                    <ub-address v-model="saveForm.residenceCity" dataType="city" category="residence" @change="changeArea('居住地址',item.residenceCity,3,index)" clearable></ub-address>
                    <!-- <el-select v-model="saveForm.residenceCity" placeholder="请选择" @change="changeArea('户籍地址',item.registerCity,3,index)">
                        <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                      </el-select>  -->
                  </el-col>
                  <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                    <ub-address v-model="saveForm.residenceDistrict" dataType="district" category="residence" clearable></ub-address>
                    <!-- <el-select v-model="saveForm.residenceDistrict" placeholder="请选择" @change="changeArea('户籍地址',item.registerCity,3,index)">
                        <el-option v-for="(items,indexs) in option" :key="indexs" :label="items.label" :value="items.value"></el-option>
                      </el-select>  -->
                  </el-col>
                  <el-col :xl="16" :lg="20" style="margin-top: 15px;" prop="residenceAddress" required>
                    <el-input v-model="saveForm.residenceAddress" clearable placeholder="请输入详细地址"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row :gutter="0">
                <el-form-item label="家属证件信息">
                  <div id="idCard" style="margin-top:0px;">
                    <el-row>
                      <el-col :span="3">
                        <ub-photo category="sfzf" description="老人身份证正面照" v-model="saveForm.photoCardFront"></ub-photo>
                      </el-col>
                      <el-col :span="3" style="margin-left: 10px;">
                        <ub-photo category="sfzb" description="老人身份证反面照" v-model="saveForm.photoCardBack"></ub-photo>
                      </el-col>
                      <el-col :span="3" style="margin-left: 10px;">
                        <ub-photo category="hksy" description="户口簿首页" v-model="saveForm.photoResidenceHome"></ub-photo>
                      </el-col>
                      <el-col :span="3" style="margin-left: 10px;">
                        <ub-photo category="hkbry" description="户口簿本人页" v-model="saveForm.photoResidenceSelf"></ub-photo>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>
              </el-row>
              <div class="buttons" style="text-align:center">
                  <el-button type="success" @click="save('saveForm')">保存</el-button>
                  <el-button @click="cancel">取消</el-button>
                </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import ubAddress from "@/components/address";
import ubDictionary from "@/components/dictionary";
import ubAvatar from "@/components/avatar";
import ubPhoto from '@/components/photo';
export default {
  name: "FamilyInfo",
  components: { ubAddress, ubDictionary, ubAvatar,ubPhoto },
  props: ["elderId",'notEdit'],
  data() {
    return {
      sign: "",
      operateStatus: 0, //当前操作的模块是哪个
      havePic: 0,
      showDash: 1,
      option: [],
      onlyRelation: false, // 是否为唯一监护人（第一次进入或只有一个家属时）
      form: [], //渲染表单
      //保存表单
      saveForm: {
        relationPhoto: "",
        relationId: "",
        relationName: "",
        relationPhoto: "",
        relationType: null,
        elderId: "",
        mobilePhone: "",
        emergencyPhone: "",
        gender: null,
        nation: null,
        birthDay: "",
        cardNo: "",
        guarder: "是",
        registerProvince: null,
        registerCity: null,
        registerDistrict: null,
        registerStreet: "",
        registerCommittee: "",
        registerAddress: "",
        residenceProvince: null,
        residenceCity: null,
        residenceDistrict: null,
        residenceStreet: "",
        residenceCommittee: "",
        residenceAddress: "",
        photoCardFront: "",
        photoCardBack: "",
        isAgent: true
      },
      openLive: "",
      guarderOption: ["是", "否"]
    };
  },
  created() {
    // ubDictionary.init(this);
    this.saveForm.elderId = this.elderId;
    console.log('created')
    this.infoinit();
  },
  watch: {
    form(val) {
      // console.log(val);
    },
    saveForm(val) {
      // console.log(val);
    }
  },

  methods: {
    infoinit() {
      let that = this;
      let data = {
        elderId: this.elderId
      };
      axios.fetch("elderServer", "/elderRelation/all", data).then(res => {
        if (res.data.length == 0) {
          that.form.push({
            relationId: "",
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
            guarder: "是",
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
            photoCardFront: "",
            photoCardBack: "",
            isAgent: true
          });
          this.onlyRelation = '是';
        } else {
          console.log(this.notEdit)
          if (this.notEdit) {
            this.operateStatus = -1;
            // console.log(this.operateStatus,'xyw');
            
            that.form = res.data;
          } else {
            this.operateStatus = 0;
            that.form = res.data;
            this.saveForm = Object.assign(this.saveForm, this.form[0]);
            this.onlyRelation = that.saveForm.guarder === '是' ? true : false;
          }
          // console.log(that.form);
        }
      });
    },
    //转入住
    toRuZhuInit() {
      let srsv_id = this.$route.query.srsv_id;
      let data = {
        srsv_id: srsv_id
      };
      let that = this;
      axios
        .post("sev/Reservation/loadReservation", qs.stringify(data))
        .then(res => {
          this.loading = false;
          this.blockImg = 0;
          if (res.data.code == "200") {
            that.form = [
              {
                ef_name: res.data.data.ef_name,
                ef_id_card: res.data.data.ef_id_card,
                ef_type: res.data.data.ef_type,
                ef_is_agent: res.data.data.ef_is_agent,
                ef_residence_phone: res.data.data.ef_residence_phone,
                ef_province: res.data.data.ef_province,
                ef_city: res.data.data.ef_city,
                ef_district: res.data.data.ef_district,
                ef_address: res.data.data.ef_address,
                ef_mobile_phone: res.data.data.ef_mobile_phone,
                ef_head: res.data.data.ef_head,
                ef_nation: res.data.data.ef_nation,
                ef_gender: res.data.data.ef_gender,
                ef_birth: res.data.data.ef_birth
              }
            ];
            that.form.forEach(function(value, index) {
              let data = {
                province: that.form[index].ef_province,
                city: that.form[index].ef_city,
                area: that.form[index].ef_district
              };
              axios
                .post("sys/area/queryAddress", qs.stringify(data))
                .then(res => {
                  that.loading = false;
                  if (res.data.code == 200) {
                    that.form[index].cityobj = res.data.data.city;
                    that.form[index].areaobj = res.data.data.area;
                    that.$forceUpdate();
                    that.$store.commit("setFamilyData", this.form);
                  } else if (res.data.code == "401") {
                    that.$message({
                      message: res.data.message,
                      type: "warning"
                    });
                    // this.$router.push("/login");
                  } else {
                    that.$message.error(res.data.message);
                  }
                })
                .catch(err => {});
            });
          } else if (res.data.code == "401") {
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
    toJson(str) {
      return eval("(" + str + ")");
    },
    changepic(fileId, divId, index) {
      let that = this;
      this.openLive = index;
      this.havePic = 1;
      var f = document.getElementById(fileId).files[0];
      var reads = new FileReader();
      reads.readAsDataURL(f);
      reads.onload = function(e) {
        that.form[index].relationPhoto = this.result;
        var params = new FormData();
        params.append(
          "file",
          that.dataURLtoBlob(that.form[index].relationPhoto)
        );
        that
          .$ajax({
            method: "post",
            url: server["uploadServer"] + "/common/upload",
            data: params,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json"
          })
          .then(function(response) {
            if (response.data.code == 200) {
              that.form[index].relationPhoto = response.data.url;
              document.getElementById(divId).src =
                that.form[index].relationPhoto;
            } else if (response.data.code == "401") {
              that.$message({
                message: response.data.message,
                type: "warning"
              });
              that.$router.push("/login");
            } else {
              that.$message.error({
                message: response.data.message
              });
            }
            that.loading = false;
          })
          .catch(function(error) {
            that.$message.error(error);
            that.loading = false;
          });

        that.showDash = 0;
        that.$forceUpdate();
      };
    },
    //编辑家属
    editFamily(index) {
      console.log(this.operateStatus, index)
      if(this.operateStatus !== -1) {
        return this.$message.error('请先保存正在编辑中的家属信息！！')
      }
      this.operateStatus = index;
      this.saveForm = Object.assign({},this.saveForm, this.form[index]);
      console.log(this.form);
      // console.log(this.saveForm);

      this.onlyRelation = this.saveForm.guarder === "是" ? true : false;
    },
    /*新增家属*/
    addFamily(val) {
      // 如果没编辑家属，直接点新增
      if (val.relationId) {
        this.addFamilyFun();
      } else {
        // 如果编辑过程中点新增
        this.$refs.saveForm[0].validate(valid => {
          if (valid) {
            this.addFamilyFun();
          } else {
            return this.$message.error("未完成信息");
          }
        });
      }
    },
    addFamilyFun() {
      this.onlyRelation = false;
      this.operateStatus = 0;
      let item = {
        relationId: "",
        relationName: "",
        relationPhoto: "",
        relationType: "",
        elderId: this.elderId,
        mobilePhone: "",
        emergencyPhone: "",
        gender: "",
        nation: "",
        birthDay: "",
        cardNo: "",
        guarder: "否",
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
        photoCardFront: "",
        photoCardBack: "",
        isAgent: true
      };
      this.form.unshift(item);
      this.saveForm = item;
    },
    //只能有一个是监护人
    janhuren() {
      var sy = this.operateStatus;
      var array = [];
      this.form.forEach(function(item, index) {
        if (item.guarder == "是") {
          array.push(index);
        }
      });
      if (array.length > 1) {
        if (array.indexOf(sy) == 0) {
          let content =
            "当前【家属" +
            (array[0] + 1) +
            "】为老人的监护人，确认要将【家属" +
            (array[1] + 1) +
            "】设置为监护人吗?";
          this.$confirm(content, "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "",
            center: true
          })
            .then(() => {
              let num1 = array[0];
              let num2 = array[1];
              this.form[num1].guarder = "是";
              this.form[num2].guarder = "否";
            })
            .catch(() => {
              let num1 = array[0];
              let num2 = array[1];
              this.form[num2].guarder = "是";
              this.form[num1].guarder = "否";
            });
        } else {
          let content =
            "当前【家属" +
            (array[1] + 1) +
            "】为老人的监护人，确认要将【家属" +
            (array[0] + 1) +
            "】设置为监护人吗?";
          this.$confirm(content, "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "",
            center: true
          })
            .then(() => {
              let num1 = array[1];
              let num2 = array[0];
              this.form[num1].guarder = "是";
              this.form[num2].guarder = "否";
            })
            .catch(() => {
              let num1 = array[1];
              let num2 = array[0];
              this.form[num2].guarder = "是";
              this.form[num1].guarder = "否";
            });
        }
      }
    },
    //删除家属
    cancelFl(index) {
      console.log(this.form);
      if(this.form[index].isAgent) {
        return this.$message.error('当前家属为监护人，不允许删除！')
      }
      let content = "确认删除此家属吗?";
      this.$confirm(content, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "",
        center: true
      })
        .then(() => {
          this.deleteFamily(index);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除家属请求
    deleteFamily(index) {
      let that = this;
      // console.log(this.form, index);
      let data = {
        relationId: this.form[index].relationId
      };
      axios.fetch("elderServer", "/elderRelation/delete", data).then(res => {
        this.form.splice(index, 1);
        this.operateStatus = -1;
        that.$message({
          message: "删除成功",
          type: "success"
        });
        // console.log(this.form);
      });
    },
    //保存家属
    save(formName) {
      let that = this;
      console.log(that.$refs[formName][0]);
      that.$refs[formName][0].validate(valid => {
        // console.log(valid);
        if (!valid) {
          this.$message.error("请填写完整表单");
          return;
        }
        axios
          .fetch("elderServer", "/elderRelation/submit", this.saveForm, "json")
          .then(res => {
            that.$message({
              message: "保存成功",
              type: "success"
            });
            this.operateStatus = -1;
            this.$emit('controlNavClick','CareFor');
          });
      });
    },
    //取消保存
    cancel() {
      if(this.form.length > 1 && this.form[this.operateStatus].relationId == ''){
        this.form.splice(this.operateStatus, 1);
      }
      this.operateStatus = -1;
      // this.saveForm = {};
    }
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
.box-card >>> .el-card__header {
  background: #fbfbfc;
  color: #333;
  line-height: 25px;
  font-weight: 700;
  padding: 11px 0 11px 20px;
}
#img3,
#img4,
#img5 {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 0.4rem;
  top: 0;
  left: 0;
}
.filepath {
  width: 100%;
  height: 40px;
  opacity: 0;
  position: absolute;
  z-index: 1;
  border: 1px solid #3e6fa8;
  border-radius: 4px;
  color: #3e6fa8;
  top: 0;
  left: 0;
  background: red;
  cursor: pointer;
}
#imgPreview {
  width: 66% !important;
  height: 200px !important;
}
#imgPreview,
#imgPreview4,
#imgPreview5,
#imgPreviewDeah {
  border-radius: 0.4rem;
  text-align: center;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  position: absolute;
}
#imgSpan,
#imgSpan4,
#imgSpan5,
#idCardSpan,
#idCardConnect {
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 40px;
  top: 230px !important;
  left: 50%;
  border: 1px solid #3e6fa8;
  border-radius: 4px;
  color: #3e6fa8;
  line-height: 40px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
.familyInfo-card >>> .el-card__body {
  min-height: 500px;
}
.clearBtns {
  background: #fbfbfc;
  color: #333;
  line-height: 40px;
  font-weight: 700;
}
.blueBa {
  background: #3e6fa8;
  display: inline-block;
  width: 4px;
  height: 20px;
  border-radius: 3px;
  position: relative;
  top: 4px;
  margin-right: 10px;
}
.clearBtn {
  color: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  padding: 0px 18px;
  float: right;
  cursor: pointer;
  width: auto;
  background: rgba(243, 105, 105, 1);
  font-weight: lighter;
  height: 36px;
  line-height: 36px;
  margin-left: 10px;
}

.clearBtn i {
  font-size: 12px;
  padding: 0 4px;
  color: white;
  font-weight: 200;
}

.addBtn {
  color: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  padding: 0px 18px;
  float: right;
  cursor: pointer;
  width: auto;
  background: rgba(108, 188, 108, 1);
  font-weight: lighter;

  height: 36px;
  line-height: 36px;
}

.addBtn:hover {
  background: rgba(108, 188, 108, 1);
  color: white;
}

.addBtn i {
  font-size: 12px;
  padding: 0 4px;
  color: white;
  font-weight: 200;
}

#imgSpan {
  top: 220px !important;
}

#idCardSpan {
  top: 260px !important;
}
.el-select,
.el-date-editor {
  width: 100%;
}
.handleBtn {
    margin-top: -10px;
    background-color: #fff;
    padding: 10px 0;
    text-align: center;
}
</style>
