<template>
  <div class="add-booking">
    <el-row :gutter="0" style="margin-bottom:20px;">
      <!-- 老人信息 -->
      <el-form ref="bookElderForm" :model="bookElderForm" label-width="120px" :rules="bookElderFormRules">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <s class="redBa"></s>
            <span>老人信息</span>
          </div>
          <div id="familyData" style="padding-top:20px;">
            <el-row :gutter="0">
              <el-col :xl="3" :lg="4" style="margin-bottom:20px;">
                <ub-avatar category="elder" v-model="elderPhoto"></ub-avatar>
              </el-col>
              <el-col :xl="21" :lg="20">
                <el-row ::gutter="10">
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="老人姓名" prop="elderName">
                      <el-input v-model="bookElderForm.elderName" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="性别" prop="gender">
                      <ub-dictionary group="性别" clearable v-model="bookElderForm.gender"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="出生日期" prop="birthDay">
                      <el-date-picker v-model="bookElderForm.birthDay" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="身份证号" prop="cardNo">
                      <el-input v-model="bookElderForm.cardNo" clearable maxlength="18" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="健康状况" prop="health">
                      <el-select v-model="bookElderForm.health" placeholder="请选择">
                        <el-option v-for="item in healthOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-form-item label="户籍地址" prop="registerProvince">
                    <el-col :xl="4" :lg="4" style="margin-top: 0px;width: 18.3%;">
                      <ub-address v-model="bookElderForm.registerProvince" dataType="province" category="registerElder" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookElderForm.registerCity" dataType="city" category="registerElder" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookElderForm.registerDistrict" dataType="district" category="registerElder" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookElderForm.registerStreet" dataType="street" category="registerElder" clearable></ub-address>
                    </el-col>
                    <el-col :xl="13" :lg="26" style="margin-top: 15px;width: 57%;">
                      <el-input v-model="bookElderForm.registerAddress" clearable placeholder="请输入详细地址"></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row :gutter="0">
                  <el-form-item label="现居住地" prop="residenceProvince">
                    <el-col :xl="4" :lg="4" style="margin-top: 0px;width: 18.3%;">
                      <ub-address v-model="bookElderForm.residenceProvince" dataType="province" category="residenceElder" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookElderForm.residenceCity" dataType="city" category="residenceElder" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookElderForm.residenceDistrict" dataType="district" category="residenceElder" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookElderForm.residenceStreet" dataType="street" category="residenceElder" clearable></ub-address>
                    </el-col>
                    <el-col :xl="13" :lg="26" style="margin-top: 15px;width: 57%;">
                      <el-input v-model="bookElderForm.residenceAddress" clearable placeholder="请输入详细地址"></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
              </el-col>
            </el-row>

          </div>
        </el-card>
      </el-form>
    </el-row>
    <el-row :gutter="0" style="margin-bottom:20px;">
      <!-- 家属信息 -->
      <el-form ref="bookRelationForm" :model="bookRelationForm" label-width="120px" :rules="bookRelationFormRules">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <s class="blueBa"></s>
            <span>家属信息</span>
          </div>
          <div style="padding-top:20px;">
            <el-row :gutter="0">
              <el-col :xl="3" :lg="4" style="margin-bottom:20px;">
                <ub-avatar category="elder" v-model="relationPhoto"></ub-avatar>
              </el-col>
              <el-col :xl="21" :lg="20">
                <el-row ::gutter="10">
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="家属姓名" prop="relationName">
                      <el-input v-model="bookRelationForm.relationName" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="移动电话" prop="mobilePhone">
                      <el-input v-model="bookRelationForm.mobilePhone" maxlength="11" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="紧急联系电话" prop="emergencyPhone">
                      <el-input v-model="bookRelationForm.emergencyPhone" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="身份证号" prop="cardNo">
                      <el-input v-model="bookRelationForm.cardNo" clearable maxlength="18" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="与老人的关系" prop="relationType">
                      <ub-dictionary group="与老人的关系" clearable v-model="bookRelationForm.relationType"></ub-dictionary>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-form-item label="户籍地址" prop="residenceProvince">
                    <el-col :xl="4" :lg="4" style="margin-top: 0px;width: 18.3%;">
                      <ub-address v-model="bookRelationForm.registerProvince" dataType="province" category="register" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookRelationForm.registerCity" dataType="city" category="register" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookRelationForm.registerDistrict" dataType="district" category="register" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookRelationForm.registerStreet" dataType="street" category="register" clearable></ub-address>
                    </el-col>
                    <el-col :xl="13" :lg="26" style="margin-top: 15px;width: 57%;">
                      <el-input v-model="bookRelationForm.registerAddress" clearable placeholder="请输入详细地址"></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
                <el-row :gutter="0">
                  <el-form-item label="现居住地" prop="residenceProvince">
                    <el-col :xl="4" :lg="4" style="margin-top: 0px;width: 18.3%;">
                      <ub-address v-model="bookRelationForm.residenceProvince" dataType="province" category="residence" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookRelationForm.residenceCity" dataType="city" category="residence" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookRelationForm.residenceDistrict" dataType="district" category="residence" clearable></ub-address>
                    </el-col>
                    <el-col :xl="4" :lg="6" style="margin-top: 0px;margin-left: 10px;width: 18.3%;">
                      <ub-address v-model="bookRelationForm.residenceStreet" dataType="street" category="residence" clearable></ub-address>
                    </el-col>
                    <el-col :xl="13" :lg="26" style="margin-top: 15px;width: 57%;">
                      <el-input v-model="bookRelationForm.residenceAddress" clearable placeholder="请输入详细地址"></el-input>
                    </el-col>
                  </el-form-item>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-form>
    </el-row>

    <!-- 选择房间 -->
    <el-row :gutter="10" style="margin-bottom:60px;margin-left:0;margin-right:0;">
      <el-form :model="bookBedForm" ref="bookBedForm" label-width="120px" :rules="bookBedFormRules">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <s class="greenBa"></s>
            <span>订房信息</span>
          </div>
          <div class="centent">
            <el-row :gutter="10">
              <el-form-item label="房间床位" required>
                <el-col :xl="6" :lg="6">
                  <el-form-item label="" prop="buildingId">
                    <ub-building v-model="bookBedForm.buildingId" @change="item => bookBedForm.buildingName = item ? item.buildingName :''" clearable></ub-building>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="6">
                  <el-form-item label="" prop="floor">
                    <ub-floor v-model="bookBedForm.floor" @change="item => bookBedForm.floorName = item ? item.floorName : ''" clearable></ub-floor>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="6">
                  <el-form-item label="" prop="roomId">
                    <ub-room v-model="bookBedForm.roomId" @change="item => bookBedForm.roomName = item ? item.roomName : ''" clearable></ub-room>
                  </el-form-item>
                </el-col>
                <el-col :xl="6" :lg="6">
                  <el-form-item label="" prop="bedId">
                    <ub-bed v-model="bookBedForm.bedId" @change="item => bookBedForm.bedName = item ? item.bedName : ''" clearable></ub-bed>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item label="预计入住日期" prop="bookDate">
                  <el-date-picker v-model="bookBedForm.bookDate" :picker-options="pickerOptions" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item label="预付订金(元)" prop="bookAmount">
                  <el-input type="number" v-model="bookBedForm.bookAmount" clearable maxlength="18" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item label="院方护理等级" prop="nursingLevel">
                  <ub-dictionary group="院方护理等级" clearable v-model="bookBedForm.nursingLevel"></ub-dictionary>
                </el-form-item>
              </el-col>
              </el-col>
            </el-row>
          </div>
        </el-card>

      </el-form>
    </el-row>
    <div class="ybBanner">
      <span>技术支持：有伴（上海）智能科技有限公司</span>
    </div>
    <div class="tijiao" id="addTijiao">
      <el-row>
        <el-button type="success" @click="submit()">提交
        </el-button>
        <el-button type plain @click="cnacel()">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script type="text/javascript">
import ubAddress from "@/components/address";
import ubAvatar from "@/components/avatar";
import ubDictionary from "@/components/dictionary";
import ubBuilding from "@/components/building";
import ubFloor from "@/components/floor";
import ubRoom from "@/components/room";
import ubBed from "@/components/bed";
import moment from "moment";
export default {
  name: "AddBooking",
  data() {
    return {
      /*老人信息*/
      bookElderForm: {
        elderName: "", //老人姓名
        gender: "", //性别：男、女
        // nation: "", //民族
        cardNo: "", //身份证号
        birthDay: "", //出生日期
        health: "", //身体状况
        registerProvince: "", //户籍省
        registerCity: "", //户籍市
        registerDistrict: "", //户籍市
        registerStreet: "", //户籍街镇，
        registerAddress: "", //户籍详细地址
        residenceProvince: "", //居住地址：省
        residenceCity: "", //居住地址：市
        residenceDistrict: "", //居住地址：区/县
        residenceStreet: "", //居住地址：街镇
        residenceAddress: "" //居住详细地址
        // medicaNow: "" //现有病史
      },
      /**联系人信息 */
      bookRelationForm: {
        relationName: "",
        cardNo: "",
        // guarder: "是",
        mobilePhone: "",
        emergencyPhone: "",
        // ef_birth: "",
        registerProvince: "", //户籍省
        registerCity: "", //户籍市
        registerDistrict: "", //户籍市
        registerStreet: "", //户籍街镇，
        registerAddress: "", //户籍详细地址
        residenceProvince: "", //居住地址：省
        residenceCity: "", //居住地址：市
        residenceDistrict: "", //居住地址：区/县
        residenceStreet: "", //居住地址：街镇
        residenceAddress: "", //居住详细地址
        // nation: "",
        // gender: "",
        relationType: ""
      },
      // 床位信息的表单
      bookBedForm: {
        buildingId: "", //预定建筑楼ID
        nursingLevel: "", //院方护理等级
        bookAmount: null, //预付订金
        buildingName: "", //预定建筑楼名称
        roomId: "", //预定房间ID
        roomName: "", //预定房间名称
        roomType: "",
        floor: "",
        floorName: "",
        bedId: "", //预定床位ID
        bedName: "", //预定床位名称
        nursingLevel: "", //院方护理等级
        bookAmount: "", //预付订金
        bookDate: "" //计划入住日期
      },
      /** 家属信息表单验证 */
      bookRelationFormRules: {
        relationName: [
          {
            required: true,
            message: "请输入家属姓名",
            trigger: "change"
          }
        ],
        mobilePhone: [
          {
            required: true,
            message: "请输入移动电话",
            trigger: "change"
          },
          {
            required: true,
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "移动电话格式不正确",
            trigger: "blur"
          }
        ],
        emergencyPhone: [
          {
            required: false,
            pattern: /^\d{3}-\d{8}$|^\d{4}-\d{7}$|\d$/,
            message: "紧急联系电话格式不正确",
            trigger: "blur"
          }
        ],
        relationType: [
          {
            required: true,
            message: "请选择与老人的关系",
            trigger: "change"
          }
        ]
      },
      /** 老人信息表单验证 */
      bookElderFormRules: {
        elderName: [
          {
            required: true,
            message: "请输入老人姓名",
            trigger: "change"
          }
        ],
        gender: [
          {
            required: true,
            message: "请选择老人性别",
            trigger: "change"
          }
        ],
        birthDay: [
          {
            required: true,
            message: "请填写出生日期",
            trigger: "change"
          }
        ],
        health: [
          {
            required: true,
            message: "请选择健康状况",
            trigger: "change"
          }
        ]
      },
      /** 床位信息表单验证 */
      bookBedFormRules: {
        buildingId: [
          { required: true, message: "请选择楼宇", trigger: "change" }
        ],
        floor: [{ required: true, message: "请选择楼层", trigger: "change" }],
        bedId: [{ required: true, message: "请选择床位", trigger: "change" }],
        roomId: [{ required: true, message: "请选择房间", trigger: "change" }],
        bookDate: [
          { required: true, message: "请选择预计入住日期", trigger: "change" }
        ]
      },
      relationPhoto: "",
      elderPhoto: "",
      healthOption: [
        {
          label: "自理",
          value: "自理"
        },
        {
          label: "半自理",
          value: "半自理"
        },
        {
          label: "全护理",
          value: "全护理"
        },
        {
          label: "半失智",
          value: "半失智"
        },
        {
          label: "失智",
          value: "失智"
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          let _now = moment()
            .subtract(1, "day")
            .valueOf();
          return time.getTime() < _now;
        }
      }
    };
  },
  components: {
    ubAvatar,
    ubAddress,
    ubDictionary,
    ubBuilding,
    ubFloor,
    ubRoom,
    ubBed
  },
  created() {
    ubDictionary.init(this);
    // this.initBuilding();
    const bookId = this.$route.query.bookId ? this.$route.query.bookId : "";
    const sign = this.$route.query.sign ? this.$route.query.sign : "";
    if (bookId && sign == "repair") {
      // 修改进来
      this.getBookInfo(bookId);
    }
  },
  methods: {
    // 获取预定的老人及家属信息
    getBookInfo(id) {
      axios
        .fetch("elderServer", "/bookElder/get/bookInfo", { bookId: id })
        .then(res => {
          console.log(res);
          this.bookRelationForm = res.data.bookRelation
            ? Object.assign({}, this.bookRelationFormm, res.data.bookRelation)
            : {};
          this.bookElderForm = res.data.bookElder
            ? Object.assign({}, this.bookElderForm, res.data.bookElder)
            : {};
          this.bookBedForm = res.data.bookBed
            ? Object.assign({}, this.bookBedForm, res.data.bookBed)
            : {};
          // this.bookBedForm.floor = this.bookBedForm.roomName
          //   ? this.bookBedForm.roomName.slice(0, 1)
          //   : "";
        });
    },
    submit() {
      const valid1 = this.$refs.bookRelationForm.validate();
      const valid2 = this.$refs.bookElderForm.validate();
      const valid3 = this.$refs.bookBedForm.validate();
      Promise.all([valid1, valid2, valid3])
        .then(async result => {
          console.log(result); //['成功了', 'success']
          if (this.bookBedForm.bookAmount) {
            this.bookBedForm.bookAmount = Number(this.bookBedForm.bookAmount);
          } else {
            this.bookBedForm.bookAmount = null;
          }
          if (this.bookBedForm.nursingLevel) {
            this.bookBedForm.nursingLevel = Number(
              this.bookBedForm.nursingLevel
            );
          } else {
            this.bookBedForm.nursingLevel = null;
          }
          const param = {
            bookRelation: this.bookRelationForm,
            bookElder: this.bookElderForm,
            bookBed: this.bookBedForm
          };
          const res = await axios.fetch(
            "elderServer",
            "/bookElder/update/bookInfo",
            param,
            "json"
          );
          let message = "预定成功";
          if (this.$route.query.sign == "repair") {
            message = "修改成功";
          }
          if (res.code == 200) {
            this.$message.success(message);
            this.$router.push("/elder/bookingRoom");
          }
        })
        .catch(error => {
          this.$message.warning("请完善预定信息");
          console.log(error);
        });
    },
    cnacel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.add-booking {
  .box-card {
    display: flex;
    flex-direction: column;
    /deep/ .el-card__body {
      flex: 1;
      overflow: auto;
    }
  }
  .el-select,
  .el-cascader,
  .el-date-editor {
    width: 100%;
  }
  .ybBanner {
    height: 50px;
    line-height: 50px;
    position: relative;
    text-align: center;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.25);
  }
  #addTijiao {
    background: #fff;
    position: fixed;
    width: 100%;
    height: 60px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 1;
    bottom: 0;
    left: 100px;
    line-height: 60px;
    .el-row {
      text-align: center;
      .el-button:nth-child(1) {
        background-color: rgb(63, 81, 181);
        border: 1px solid rgb(63, 81, 181);
      }
      .el-button {
        height: 32px;
        width: 100px;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
