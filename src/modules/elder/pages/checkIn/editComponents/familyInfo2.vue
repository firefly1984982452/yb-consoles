<template>
  <div>
      <el-form label-width="110px" :rules="rules">
          <el-card class="box-card" v-for="(item,index) in form" :key="index" >
            <div slot="header" class="clearfix clearBtns" style="height: 35px">
              <s class="blueBa"></s>
              <span>家属{{form.length-index}}</span>
              <el-button @click="cancelFl(item,index)" class="clearBtn" v-if="form.length>1">
                <i class="iconfont iconcaozuotubiao-shanchu-xuanfu"></i>删除此家属
              </el-button>
              <el-button @click="addFamily()" class="addBtn" style="background:#6cbc6c;margin-top: 0;:hover{background:#6cbc6c}!important">
                <i class="iconfont iconjichutubiao-tianjia-huise"></i>新增家属
              </el-button>
            </div>
            <div id="newfamilyData">
              <el-row :gutter="10">
                <el-col :xl="3" :lg="3" style="z-index:1;">
                  <div id="imgPreview" :class="{'showDashed':showDash==1 ,'hideDashed':showDash == 0}" style="position:relative;left: 20%;top:0px">
                    <div id="prompt3">
                      <span id="imgSpan" style="width: 95%;font-size:14px;border: 1px solid #D3D4D6;color: #333;background: white;font-weight: bolder;">
                        上传照片
                        <input type="file" :id="'file'+(index+1)" class="filepath" @change="changepic('file'+(index+1),'imgPic'+(index+1),index)" accept="image/jpg, image/jpeg, image/png, image/PNG"/>
                      </span>
                    </div>
                    <img id="img3" src="//image.youbankeji.com/web/dahuaAdmin/Group%204%402x.png" v-if="!(form[index].relationPhoto)||(form[index].relationPhoto)==''" style="height:180px!important;"/>
                    <img :id="'imgPic'+(index+1)" :src="ossPic+form[index].relationPhoto" v-else style="width:140px;height:180px!important;position:relative;top:-180px;"/>
                  </div>
                </el-col>
                <el-col :xl="21" :lg="21">
                  <el-row :gutter="10">
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="家属姓名" prop="relationName">
                        <el-input v-model="item.relationName" clearable placeholder="请输入名字"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="移动电话" prop="mobilePhone">
                        <el-input v-model="item.mobilePhone" placeholder="请输入手机号" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="紧急联系电话" prop="emergencyPhone">
                        <el-input v-model="item.emergencyPhone" placeholder="请输入手机号" clearable></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="性别" prop="gender">
                        <el-select v-model="item.gender" placeholder="请选择">
                          <el-option v-for="(items,indexs) in genderOption" :key="indexs" :label="items.label" :value="items.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="民族" prop="nation">
                        <el-select v-model="item.nation" placeholder="请选择" clearable>
                          <el-option v-for="(items,indexs) in nationOption" :key="indexs" :label="items.label" :value="items.value"></el-option>
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
                      <el-form-item label="身份证号" prop="cardNo">
                        <el-input v-model="item.cardNo" clearable maxlength="18" placeholder="请输入身份证"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="与老人的关系" prop="relationType">
                        <el-select v-model="item.relationType" placeholder="请选择">
                          <el-option v-for="(items,indexs) in relationOption" :key="indexs" :label="items.label" :value="items.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="是否为监护人" prop="guarder">
                        <el-select v-model="item.guarder" placeholder="请选择" @change="janhuren(index)">
                          <el-option v-for="(items,indexs) in guarderOption" :key="indexs" :label="items" :value="items"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="0">
                    <el-form-item label="户籍地址" prop="registerAddress">
                      <el-col :xl="4" :lg="4" style="margin-top: 0px;">
                        <el-select v-model="item.registerProvince" clearable placeholder="请选择" @change="changeArea('户籍地址',item.registerProvince,2,index)">
                          <el-option v-for="(items,indexs) in provinceArrary" :key="indexs" :label="items.label" :value="items.value"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                        <el-select v-model="item.registerCity" clearable placeholder="请选择" @change="changeArea('户籍地址',item.registerCity,3,index)">
                          <el-option v-for="(items,indexs) in registerCitys[index]" :key="indexs" :label="items.label" :value="items.value"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                        <el-select v-model="item.registerDistrict" clearable placeholder="请选择">
                          <el-option v-for="(items,indexs) in registerDistricts[index]" :key="indexs" :label="items.label" :value="items.value"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :xl="16" :lg="20" style="margin-top: 15px;">
                        <el-input v-model="item.registerAddress" clearable placeholder="请输入详细地址"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-row>
                  <el-row :gutter="0">
                    <el-form-item label="居住地址" prop="residenceAddress">
                      <el-col :xl="4" :lg="4" style="margin-top: 0px;">
                        <el-select v-model="item.residenceProvince" clearable placeholder="请选择" @change="changeArea('居住地址',item.residenceProvince,2,index)">
                          <el-option v-for="(items,indexs) in provinceArrary" :key="indexs" :label="items.label" :value="items.value"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                        <el-select v-model="item.residenceCity" clearable placeholder="请选择" @change="changeArea('居住地址',item.residenceCity,3,index)">
                          <el-option v-for="(items,indexs) in residenceCitys[index]" :key="indexs" :label="items.label" :value="items.value"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :xl="4" :lg="4" style="margin-top: 0px;margin-left: 10px;">
                        <el-select v-model="item.residenceDistrict" clearable placeholder="请选择">
                          <el-option v-for="(items,indexs) in residenceDistricts[index]" :key="indexs" :label="items.label" :value="items.value"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :xl="16" :lg="20" style="margin-top: 15px;">
                        <el-input v-model="item.residenceAddress" clearable placeholder="请输入详细地址"></el-input>
                      </el-col>
                    </el-form-item>
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
export default {
  props: ["elderId"],
  data() {
    return {
      sign: "",
      initStatus: false,//是否处于编辑初始化
      meterType: 0,
      havePic: 0,
      showDash: 1,
      showDash1: [],
      userPic1: [],
      showDash2: [],
      form: {},
      openLive: "",
      nationOption: [],
      genderOption:[],
      guarderOption:["是","否"],
      relationOption: [],
      provinceArrary: [], //省
      registerCitys: [],
      registerDistricts: [],
      residenceCitys: [],
      residenceDistricts: [],
      rules: {
        relationName: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        mobilePhone: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        gender: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        nation: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        cardNo: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        relationType: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
         guarder: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        registerAddress: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        residenceAddress: [
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
    this.selectOption("性别");
    this.selectOption("民族");
    this.selectOption("与老人的关系");
    this.changeArea('省份',0,1,"");
    this.infoinit();
  },

  methods: {
    infoinit() {
      let that = this;
      let data = {
        elderId	: this.elderId	
      };
      axios
      .fetch('elderServer', "/elderRelation/all", data)
      .then(res => {
          if (res.data.length == 0) {
              that.form = [
                {
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
                  photoCardFront: "",
                  photoCardBack: "",
                  isAgent: true
                }
              ];
            } else {
              this.initStatus=true;
              that.form = res.data;
              for(let i=0; i<this.form.length;i++){
                  this.form[i].gender = parseInt(this.form[i].gender);
                  this.form[i].nation = parseInt(this.form[i].nation);
                  this.form[i].relationType = parseInt(this.form[i].relationType);
                  this.changeArea('户籍地址',this.form[i].registerProvince,2,i);
                  this.changeArea('户籍地址',this.form[i].registerCity,3,i);
                  this.changeArea('居住地址',this.form[i].residenceProvince,2,i);
                  this.changeArea('居住地址',this.form[i].residenceCity,3,i);  
              }
          }
      })
    },
    changeArea(category,parentNo,level,index){
        let data = {
					 parentNo: parentNo
        };
        axios
				.fetch('commonServer', "/dict/getDistrictByParentNo", data)
				.then(res => {
          this.assembleArea(category,level,res.data,index);
          // if(this.initStatus==true&&this.form.length==(index+1)&&level==3&&category=="居住地址")
          // this.initStatus=false;
				})
    },
    assembleArea(category,level,data,index){
        let Arrays = data.map(item=>{
            return {
              value: item.districtNo,
              label: item.title
            }
        });
        if(category==="省份"){
            this.provinceArrary = Arrays;
        }else if(category==="户籍地址"){
            if(level==2){
              if(this.initStatus===false){
                this.registerCitys[index]=[];
                this.registerDistricts[index]=[];
                this.form[index].registerCity="";
                this.form[index].registerDistrict="";
              }
              this.registerCitys[index] = Arrays;
            }else if(level==3){
              if(this.initStatus===false){
                this.registerDistricts[index]=[];
                this.form[index].registerDistrict="";
              }
              this.registerDistricts[index] = Arrays;
            }
        }else if(category==="居住地址"){
            if(level==2){
              if(this.initStatus===false){
                this.residenceCitys[index]=[];
                this.residenceDistricts[index]=[];
                this.form[index].residenceCity="";
                this.form[index].residenceDistrict="";
              }
              this.residenceCitys[index] = Arrays;
            }else if(level==3){
              if(this.initStatus===false){
                this.residenceDistricts[index]=[];
                this.form[index].residenceDistrict="";
              } 
              this.residenceDistricts[index] = Arrays;
            }
        }
        this.$forceUpdate();
    },
    toRuZhuInit(){
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
						if(res.data.code == "200") {
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
    selectOption(parentNos) {
      let data = {
          parentNos: parentNos
      }
      let that = this;
      axios
      .fetch('commonServer', "/dict/getItemViewsByParentNo", data)
      .then(res => {
          let option = res.data.map(item=>{
             return {
                label: item.title,
                value: item.itemId
             }
          });
          if(parentNos==="性别"){
              that.genderOption = option;
              that.$forceUpdate();
          }else if(parentNos==="民族"){
              that.nationOption = option;
          }else if(parentNos==="与老人的关系"){
              that.relationOption = option;
          }
      })
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
    changepic(fileId,divId,index) {
      let that = this;
      this.openLive = index;
      this.havePic = 1;
      var f = document.getElementById(fileId).files[0];
      var reads = new FileReader();
      reads.readAsDataURL(f);
      reads.onload = function(e) {
        that.form[index].relationPhoto = this.result;
        var params = new FormData();
        params.append("file", that.dataURLtoBlob(that.form[index].relationPhoto));
        that
          .$ajax({
            method: "post",
            url: server['uploadServer'] + "/common/upload",
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
              document.getElementById(divId).src = that.form[index].relationPhoto;
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
    /*新增家属*/
    addFamily() {
      this.form.unshift({
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
          photoCardFront: "",
          photoCardBack: "",
          isAgent: true
      });
      this.registerCitys.unshift([]);
      this.registerDistricts.unshift([]);
      this.residenceCitys.unshift([]);
      this.residenceDistricts.unshift([]);
    },
    //只能有一个是监护人
    janhuren(indexs) {
      var sy = indexs;
      var array = [];
      this.form.forEach(function(item, index) {
        if (item.guarder == "是") {
          array.push(index);
        }
      });
      if (array.length > 1) {
        if (array.indexOf(sy) == 0) {
          let content ="当前【家属" +(array[0] + 1) +"】为老人的监护人，确认要将【家属" +(array[1] + 1) +"】设置为监护人吗?";
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
          let content ="当前【家属" +(array[1] + 1) +"】为老人的监护人，确认要将【家属" +(array[0] + 1) +"】设置为监护人吗?";
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
    cancelFl(item, index) {
      let content = "确认删除此家属吗?";
      this.$confirm(content, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "",
        center: true
      })
        .then(() => {
          let that = this;
          that.form.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    childAction() {
      var fouNum = 0;
      for (var i = 0; i < this.form.length; i++) {
        if (this.form[i].relationName == "" || this.form[i].relationName == null || !this.form[i].relationName) {
          this.$message.error("请输入第" + (this.form.length - i) + "个家属姓名");return;
        }else if (this.form[i].mobilePhone == "" || this.form[i].mobilePhone == null || !this.form[i].mobilePhone) {
          this.$message.error("请输入第" + (this.form.length - i) + "个家属联系电话");return;
        }else if (this.form[i].gender === "" || this.form[i].gender === null || !this.form[i].gender) {
          this.$message.error("请输入第" + (this.form.length - i) + "个家属性别");return;
        }else if (this.form[i].nation == "" || this.form[i].nation == null || !this.form[i].nation) {
          this.$message.error("请输入第" + (this.form.length - i) + "个家属民族");return;
        }else if (this.form[i].cardNo == "" || this.form[i].cardNo == null || !this.form[i].cardNo) {
          this.$message.error("请输入第" + (this.form.length - i) + "个家属身份证号码");return;
        }else if (this.form[i].relationType == "" || this.form[i].relationType == null || !this.form[i].relationType) {
          this.$message.error("请第" + (this.form.length - i) + "个家属与老人关系");return;
        }else if (this.form[i].guarder == "" || this.form[i].guarder == null || !this.form[i].guarder) {
          this.$message.error("请选择是否为监护人");return;
        }else if (this.form[i].registerProvince == "" || this.form[i].registerProvince == null || !this.form[i].registerProvince) {
          this.$message.error("请选择第" + (this.form.length - i) + "个家属户籍地址");return;
        }else if (this.form[i].registerCity == "" || this.form[i].registerCity == null || !this.form[i].registerCity) {
          this.$message.error("请选择第" + (this.form.length - i) + "个家属户籍地址");return;
        }else if (this.form[i].registerDistrict == "" || this.form[i].registerDistrict == null || !this.form[i].registerDistrict) {
          this.$message.error("请选择第" + (this.form.length - i) + "个家属户籍地址");return;
        }else if (this.form[i].registerAddress == "" || this.form[i].registerAddress == null || !this.form[i].registerAddress) {
          this.$message.error("请选择第" + (this.form.length - i) + "个家属户籍地址");return;
        }else if (this.form[i].residenceProvince == "" || this.form[i].residenceProvince == null || !this.form[i].residenceProvince) {
          this.$message.error("请选择第" + (this.form.length - i) + "个家属居住地址");return;
        }else if (this.form[i].residenceCity == "" || this.form[i].residenceCity == null || !this.form[i].residenceCity) {
          this.$message.error("请选择第" + (this.form.length - i) + "个家属居住地址");return;
        }else if (this.form[i].residenceDistrict == "" || this.form[i].residenceDistrict == null || !this.form[i].residenceDistrict) {
          this.$message.error("请选择第" + (this.form.length - i) + "个家属居住地址");return;
        }else if (this.form[i].residenceAddress == "" || this.form[i].residenceAddress == null || !this.form[i].residenceAddress) {
          this.$message.error("请选择第" + (this.form.length - i) + "个家属居住地址");return;
        }else if (this.form[i].guarder == "否") {
          fouNum++;
        }
      }
      if (fouNum == this.form.length) {
        this.$message.error("至少一个家属为监护人");
        return;
      }
      this.form.map(item=>{item.elderId=this.elderId;item.isAgent=item.guarder=="是"?true:false;});
      let that = this;
      axios
      .fetch('elderServer', "/elderRelation/submit", this.form, 'json')
      .then(res => {
          that.$message({
            message: "提交成功",
            type: "success"
          });
          that.$emit("familyinfo", "familyInfo", "healthCondition");
      })
    }
  },
};
</script>

<style scoped>
.box-card >>> .el-card__header {
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
#imgPreview {
    width: 66% !important;
    height: 200px !important;
}
#imgPreview, #imgPreview4, #imgPreview5, #imgPreviewDeah {
    border-radius: .4rem;
    text-align: center;
    font-size: 1rem;
    text-align: center;
    margin: 0;
    position: absolute;
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
    background: #3E6FA8;
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

#oldManDetailLive .el-col-lg-7 {
  /*width: 19.16667%;*/
}
.el-select,.el-date-editor {
  width: 100%;
}
</style>