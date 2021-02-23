<template>
  <div class="app-container createOuts" id="createOut">
    <el-row :gutter="0" style="margin-bottom: 2rem;">
      <!--//:rules="rules"-->
      <el-form :model="form" label-width="120px" :rules="rules">
        <el-col :span="24" style="width: 93.7%;margin-left: 3%;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="1" class="backBtns">
                  <el-button @click="backList()">返回</el-button>
                </el-col>
                <el-col :xl="5" :lg="6">
                  <span>添加设备</span>
                </el-col>
              </el-row>
            </div>
            <div id="familyData">
              <el-row :gutter="20">
                <el-col :xl="2" :lg="4" style="margin: 10px 0 0 10px;">
                  <el-row :gutter="20">
                    <img src="../../assets/equipment.png" />
                    <img id="img3" class="img10 picTop" src alt v-show="zanshiHead==1" />
                  </el-row>
                  <el-row :gutter="20">
                    <p class="addImg">上传照片</p>
                  </el-row>
                  <input
                    type="file"
                    id="file"
                    class="filepath"
                    @change="changepic(this)"
                    accept="image/jpg, image/jpeg, image/png, image/PNG"
                  />
                </el-col>
                <el-col :xl="18" :lg="20">
                  <el-row :gutter="20">
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="设备编号" prop="diNumber">
                        <span style="font-weight: bolder;">{{form.diNumber}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="设备类别" prop="diCategoryId">
                        <el-select v-model="form.diCategoryId" placeholder="请选择">
                          <el-option
                            v-for="item in option1"
                            :key="item.sfd_id"
                            :label="item.sfd_name"
                            :value="item.sfd_id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="4" :lg="6">
                      <el-button @click="addEquipment" class="addEquipment">
                        <i class="btniconfont iconjichutubiao-tianjia-huise"></i>添加类别
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="设备类型" prop="diTypeId">
                        <el-select v-model="form.diTypeId" placeholder="请选择">
                          <el-option
                            v-for="item in option2"
                            :key="item.sfd_id"
                            :label="item.sfd_name"
                            :value="item.sfd_id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="4" :lg="6">
                      <el-button @click="addFacilities" class="addEquipment">
                        <i class="btniconfont iconjichutubiao-tianjia-huise"></i>添加类型
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xl="8" :lg="10">
                      <el-form-item label="设备名称" prop="diName">
                        <el-input v-model="form.diName" placeholder="请输入" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="设备型号" prop="diModel">
                        <el-input v-model="form.diModel" placeholder="请输入" clearable></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xl="8" :lg="10">
                      <el-form-item label="设备厂家" prop="diManufactor">
                        <el-input v-model="form.diManufactor" placeholder="请输入" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="安装时间" prop="diTime ">
                        <el-date-picker
                          v-model="form.diTime "
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xl="8" :lg="10">
                      <el-form-item label="厂家电话" prop="diPhone">
                        <el-input v-model="form.diPhone" placeholder="请输入" clearable></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :xl="5" :lg="7">
                      <el-form-item label="安装位置" prop="diBuildingId">
                        <el-cascader v-model="form.diBuildingIdName"
                          clearable
                          placeholder="请选择"
                          @change="handleBuildingChange"
                          :options="options"
                          change-on-select
                        ></el-cascader>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="3" :lg="5">
                      <el-select v-model="form.diRoomId" placeholder="请选择" @change="changeRoom">
                        <el-option
                          v-for="item in optionRoom"
                          :key="item.orgr_id "
                          :label="item.orgr_name"
                          :value="item.orgr_id "
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :xl="3" :lg="5">
                      <el-select v-model="form.diBedId" placeholder="请选择" @change="changeBed">
                        <el-option
                          v-for="item in optionBed"
                          :key="item.orgb_id"
                          :label="item.orgb_name"
                          :value="item.orgb_id"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :xl="5" :lg="7">
                      <el-input v-model="form.diInstall" placeholder="请输入" clearable></el-input>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="设备通道数" prop="diChannelNum">
                        <el-input v-model="form.diChannelNum" placeholder="请输入" clearable></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :xl="6" :lg="8">
                      <el-form-item label="设备节点" prop="diNodeNum">
                        <el-input v-model="form.diNodeNum" placeholder="请输入" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xl="4" :lg="6">
                      <el-button class="addEquipment" @click="isShow = !isShow">
                        <i class="btniconfont iconjichutubiao-tianjia-huise"></i>添加绑定
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row style="margin-left: 120px;">
                    <el-col class :xl="2" :lg="2" style="width: 100px;">
                      <el-button
                        v-bind:style="{'background':firstZhuTi,'color':'#fff'}"
                        @click="sendData()"
                      >保存</el-button>
                    </el-col>
                    <el-col class :xl="2" :lg="2" style="width: 100px;">
                      <el-button>关闭</el-button>
                    </el-col>
                  </el-row>
                  <el-collapse-transition>
                    <div v-show="isShow" style="margin-top: 10px;">
                      <el-row :gutter="20">
                        <el-col :xl="6" :lg="7">
                          <h3 style="margin-left: 15%;margin-bottom: 20px;">绑定设备</h3>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20" v-for="(item,index) in bindingArr" :key="index">
                        <el-col :xl="6" :lg="7">
                          <el-form-item label="设备编号" prop="ef_name">
                            <el-input v-model="item.sl_reason" placeholder="请输入" clearable></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xl="6" :lg="7">
                          <el-form-item label="通道号" prop="ef_name">
                            <el-input v-model="item.sl_reason" placeholder="请输入" clearable></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xl="6" :lg="7">
                          <el-form-item label="功能节点" prop="ef_name">
                            <el-input v-model="item.sl_reason" placeholder="请输入" clearable></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :xl="5" :lg="3" style="line-height: 40px;">
                          <span class="addIcon">
                            <i
                              @click="pushBindin"
                              class="iconfont iconcaozuotubiao-tianjia-zhengchang"
                            ></i>
                          </span>
                          <span class="addIcon">
                            <i
                              @click="removeBindin(index)"
                              class="iconfont iconcaozuotubiao-shanchuhang-zhengchang"
                            ></i>
                          </span>
                        </el-col>
                      </el-row>
                    </div>
                  </el-collapse-transition>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-form>
    </el-row>
    <el-row class="ybBanner">
      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="23%">
        <el-row class="warp" v-loading="loading" id>
          <el-col style="margin-top:20px;">
            <el-form label-width="120px" ref="dictForm" :model="dictForm" :rules="rules">
              <el-row :gutter="20">
                <el-col :span="20">
                  <el-form-item label="系统类别" prop="sfdName">
                    <el-input v-model="dictForm.sfdName" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="20">
                  <el-form-item label="权重：" prop="sfdWeight">
                    <el-slider style="margin-left: 5px;" v-model="dictForm.sfdWeight" show-input></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="描述：" prop="sfdDesc">
                    <el-input type="textarea" v-model="dictForm.sfdDesc" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
              
              </el-row>
              <el-row
                style="text-align:center;margin:20px 0px 50px 0;"
                :gutter="10"
                type="flex"
                justify="center"
              >
                <el-col class :xl="5" :lg="6">
                  <el-button
                    v-bind:style="{'background':firstZhuTi,'color':'#fff'}"
                    @click="saveDict()"
                  >保存</el-button>
                </el-col>
                <el-col class :xl="5" :lg="6">
                  <el-button @click="dialogFormVisible=false">关闭</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog :title="title1" :visible.sync="dialogFormVisible1" width="23%">
        <el-row class="warp" v-loading="loading" id>
          <el-col style="margin-top:20px;">
            <el-form label-width="120px" ref="dictForm" :model="dictForm2" :rules="rules">
              <el-row :gutter="20">
                <!--<el-col :span="20">
									<el-form-item label="系统类别" prop="sfdName">
										<el-select v-model="form.sl_reason" placeholder="请选择">
											<el-input v-model="form.sl_reason" placeholder="请输入" clearable></el-input>
										</el-select>
									</el-form-item>
                </el-col>-->
                <el-col :span="20">
                  <el-form-item label="设备类型" prop="sfdName">
                    <el-input v-model="dictForm2.sfdName" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="权重：" prop="sfdWeight">
                    <el-slider style="margin-left: 5px;" v-model="dictForm2.sfdWeight" show-input></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="描述：" prop="sfdDesc">
                    <el-input type="textarea" v-model="dictForm2.sfdDesc" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
                <!--<el-col :span="20">
									<el-form-item label="是否有效" prop="sfdWeight">
										<el-radio-group v-model="form.sfdWeight">
											<el-radio :label="1">有效</el-radio>
											<el-radio :label="0">无效</el-radio>
										</el-radio-group>
									</el-form-item>
                </el-col>-->
              </el-row>
              <el-row
                style="text-align:center;margin:20px 0px 50px 0;"
                :gutter="10"
                type="flex"
                justify="center"
              >
                <el-col class :xl="5" :lg="6">
                  <el-button
                    v-bind:style="{'background':firstZhuTi,'color':'#fff'}"
                    @click="saveDict2()"
                  >保存</el-button>
                </el-col>
                <el-col class :xl="5" :lg="6">
                  <el-button @click="dialogFormVisible1=false">关闭</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-dialog>
      <span>技术支持：有伴（上海）智能科技有限公司</span>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import { OssUrlPic, OssUrlNoPic } from "@/common/js/utils.js";
import moment from "moment";
export default {
  data() {
    return {
      isShow: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      loading: false,
      option1: [], //设备类别
      option2: [], //设备类型
      options: [], //楼层
      optionRoom: [], //房间
      optionBed: [], //床位
      roomName: "",
      bedName: "",
      zanshiHead: "",
      havePic: 0,
      userPic: "",
      dictForm: {
        sfdWeight: "",
        sfdName: "",
        sfdDesc: ""
      },
      dictForm2: {
        sfdWeight: "",
        sfdName: "",
        sfdDesc: ""
      },
      title: "添加设备类别",
      title1: "添加设备类型",
      option4: [],
      bindingArr: [
        {
          sl_reason: "",
          sl_reason: "",
          sl_reason: ""
        }
      ],
      ossUrl: OssUrlPic,
      ossNoUrl: OssUrlNoPic,
      userId: "",
      sign: "",
      st: "222",
      itemData: [],
      option: [],
      form: {
        zbtime: "1",
        diId: "0",
        diType: "1",
        diNumber:
          "Fire-" +
          moment()
            .utc()
            .format("YYYYMDhhmmss")
      },
      rules: {
        diCategoryId: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        diTypeId: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        diName: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        diModel: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        diTime: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ],
        diBuildingId: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  computed: {
    firstZhuTi: {
      get() {
        return this.$store.getters.firstColors;
      },
      set() {}
    }
  },
  created() {
    this.Equipment();
    this.Facitilies();
  },
  mounted() {
    let that = this;
    axios
      .post("org/OrgBuilding/queryOrgBuilding")
      .then(res => {
        this.loading = false;
        if (res.data.code == "200") {
          let opt = [];
          let building = res.data.data;
          building.forEach(function(item) {
            let subOpt = {};
            subOpt.value = item.orgbu_id;
            subOpt.label = item.orgbu_name;
            let floor = parseInt(item.orgbu_floor);
            if (typeof floor == "number") {
              let children = [];
              for (let i = 0; i < floor; i++) {
                let sub = {};
                sub.value = i + 1;
                sub.label = i + 1 + "层";
                children.push(sub);
              }
              subOpt.children = children;
            }
            opt.push(subOpt);
          });
          that.options = opt;
        } else if (res.data.code == "401") {
          this.$message({
            message: res.data.message,
            type: "warning"
          });
          this.$router.push("/login");
        }
      })
      .catch(err => {
        this.loading = false;
      });
  },
  methods: {
    backList() {
      this.$router.back(-1);
    },
    pushBindin() {
      this.bindingArr.push({
        sl_reason: "",
        sl_reason: "",
        sl_reason: ""
      });
    },
    removeBindin(index) {
      this.bindingArr.splice(index, 1);
      if (this.bindingArr == "") {
        this.isShow = false;
        this.bindingArr = [
          {
            sl_reason: "",
            sl_reason: "",
            sl_reason: ""
          }
        ];
      }
    },
    handleBuildingChange(value) {
      console.log(value);
      let that = this;
      let data = {
        orgr_building_id: value[0],
        orgr_floor: value[1]
      };
      this.form.diBuildingId = value[0];
      for (var o = 0; o < this.options.length; o++) {
        if (value[0] == this.options[o].value) {
          this.form.diBuildingIdName = this.options[o].label;
        }
      }
      this.loading = true;
      axios
        .post("/org/OrgRoom/queryOrgRoomWithFloor", qs.stringify(data))
        .then(res => {
          if (res.data.code == "200") {
            that.optionRoom = res.data.data;
          } else if (res.data.code == "401") {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
          this.loading = false;
        });
    },
    changeRoom(value) {
      this.roomName =
        this.optionRoom.filter(v => v.orgr_id == value)[0].orgr_name + "房间";
      let data = {
        orgb_room_id: value
      };
      axios
        .post("/org/OrgBed/queryOrgBedByRoom", qs.stringify(data))
        .then(res => {
          this.loading = false;
          if (res.data.code == "200") {
            this.optionBed = res.data.data;
            this.form.se_bed_id = "";
          } else if (res.data.code == "401") {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    changeBed(value) {
      this.bedName =
        this.optionBed.filter(v => v.orgb_id == value)[0].orgb_name.charAt(0) +
        "号床";
      this.form.diInstall =
        this.form.diBuildingIdName + this.roomName + this.bedName;
      console.log(a);
    },
    changepic() {
      //				alert("changepic");

      this.havePic = 1;
      let that = this;
      var reads = new FileReader();
      var f = document.getElementById("file").files[0];
      reads.readAsDataURL(f);
      reads.onload = function(e) {
        that.form.diImg = this.result;
        document.querySelector(".img10").src = that.form.diImg;

        that.zanshiHead = 1;
      };
      // this.imgShow = 1;
      this.showDash = 0;
      this.userPic = f;
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = new ArrayBuffer(bstr.length),
        u8arr = new Uint8Array(n);
      //			    while (n--) {
      //			        u8arr[n] = bstr.charCodeAt(n);
      //			    }
      for (var i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      return new Blob([n], {
        type: mime
      });
    },

    sendData() {
      if (
        this.form["diTypeId"] === "" ||
        this.form["diTypeId"] === null ||
        !this.form["diTypeId"]
      ) {
        this.$message.error("请选择设备类别");
        this.loading = false;
        return;
      }
      if (
        this.form["diCategoryId"] === "" ||
        this.form["diCategoryId"] === null ||
        !this.form["diCategoryId"]
      ) {
        this.$message.error("请选择设备类型");
        this.loading = false;
        return;
      }
      if (
        this.form["diTime"] === "" ||
        this.form["diTime"] === null ||
        !this.form["diTime"]
      ) {
        this.$message.error("请选择安装时间");
        this.loading = false;
        return;
      }
      if (
        this.form.diName === "" ||
        this.form.diName === null ||
        !this.form.diName
      ) {
        this.$message.error("请输入名称");
        this.loading = false;
        return;
      }

      this.loading = true;
      var params = new FormData();

      if (this.form.diImg && this.form.diImg != "") {
        if (this.form.diImg.indexOf("base64") > 0) {
          this.userPic = this.dataURLtoBlob(this.form.diImg);
          console.log(this.userPic);
          params.append("diImg", this.userPic);
        }
      }
      for (var key in this.form) {
        params.append(key, this.form[key]);
      }

      let that = this;
      this.$ajax({
        method: "post",
        url: "/fire/Info/adddevice",
        data: params,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json"
      })
        .then(function(response) {
          if (response.data.code == 200) {
            that.$message({
              message: "提交成功",
              type: "success"
            });
            that.$store.commit("setEquipmentData", response.data.data);
            that.$store.commit("setEquipmentTotal", response.data.total);
            that.$router.push("/fire/FireEquipment");
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
    },
    addEquipment() {
      this.dialogFormVisible = true;
      this.dictForm.sfdDesc = "";
      this.dictForm.sfdWeight = "";
      this.dictForm.sfdName = "";
    },
    saveDict() {
      let data = {
        sfdDesc: this.dictForm.sfdDesc,
        sfdWeight: this.dictForm.sfdWeight,
        sfdName: this.dictForm.sfdName,
        sfdPid: 582,
        sfdId: 0
      };
      axios
        .post("/fire/Info/adddictionaries", qs.stringify(data))
        .then(res => {
          this.loading = false;
          if (res.data.code == "200") {
            debugger;
            this.Equipment();
            this.dialogFormVisible = false;
          } else if (res.data.code == "401") {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    addFacilities() {
      this.dialogFormVisible1 = true;
      this.dictForm2.sfdDesc = "";
      this.dictForm2.sfdWeight = "";
      this.dictForm2.sfdName = "";
    },
    saveDict2() {
      let data = {
        sfdDesc: this.dictForm2.sfdDesc,
        sfdWeight: this.dictForm2.sfdWeight,
        sfdName: this.dictForm2.sfdName,
        sfdPid: 581,
        sfdId: 0
      };
      axios
        .post("/fire/Info/adddictionaries", qs.stringify(data))
        .then(res => {
          this.loading = false;
          if (res.data.code == "200") {
            this.Facitilies();
            this.dialogFormVisible1 = false;
          } else if (res.data.code == "401") {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    Facitilies() {
      axios.post("/fire/Info/querySysFireDictByshebeileixin").then(res => {
        this.loading = false;
        if (res.data.code == 200) {
          this.option2 = res.data.data;
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
    Equipment() {
      axios.post("/fire/Info/querySysFireDictByshebeileibie").then(res => {
        this.loading = false;
        if (res.data.code == 200) {
          this.option1 = res.data.data;
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
    }
  }
};
</script>

<style scoped="">
.addImg {
  width: 138px;
  height: 34px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(211, 212, 214, 1);
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  text-align: center;
  margin-top: 14px;
  margin-left: 5px;
  cursor: pointer;
}

.addEquipment {
  width: 95px;
  height: 36px;
  background: #6cbc6c;
  color: white;
}

.addEquipment .btniconfont {
  color: white;
  font-size: 12px;
}

.addIcon i {
  font-size: 20px;
  cursor: pointer;
  margin-right: 10px;
}

.el-radio-group {
  margin-left: -60px;
}

.filepath {
  background: red;
  top: 178px;
  left: 20px;
  width: 120px;
  height: 40px;
}
</style>