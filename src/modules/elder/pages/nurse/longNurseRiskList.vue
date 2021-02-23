<template>
  <!-- 某位老人的长护险评估列表 -->
  <div class="long-page">
    <div v-show="!checkout" class="title">
      <el-button class="back" size="mini" @click="back">返回</el-button><strong>长护险评估列表</strong>
    </div>
    <div class="contractRecord" :class="assessList === true ? 'content' : ''" style="">
      <div class="block" v-if="tableData.length > 0">

        <!-- 老人身份信息 -->
        <div class="record_title" v-if="elderData.elderName">
          <el-avatar v-if="elderInfo.photo" :src="elderInfo.photo"></el-avatar>
          <el-avatar v-else>{{ elderData.elderName[0]}}</el-avatar>
          <div class="name">
            <p>{{elderData.elderName}}</p>
            <p>{{elderInfo.cardNo}}</p>
          </div>
          <span style="color:#bbb">入院日期
            <c style="color:#000">{{ elderData.checkinDate }}</c>
            &emsp;&emsp;最新评估等级
            <c style="color:#000">{{ elderData.insuranceLevel | typeFilter }}</c>
          </span>
        </div>

        <!-- 护理人员绑定 -->
        <el-card class="box-card" style="margin: 0 0 20px 0;">
          <div slot="header" class="clearfix">
            <span>护理人员绑定</span>
            <span class="annotation" v-show="isCare">
              <el-icon class="el-icon-info"></el-icon>请预先在市长护险管理系统以及员工档案中维护好护士或护工信息，再进行绑定
            </span>
          </div>
          <div class="text item">
            <!-- 显示信息状态 -->
            <el-form v-if="!careUpdate">
              <el-row gutter="24">
                <el-col :span="5">
                  <el-form-item label="绑定护士">{{employeeData.nurseName}}</el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="医保ID">{{employeeData.nurseInsuranceCode}}</el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="绑定护理员">{{employeeData.carerName}}</el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="医保ID">{{employeeData.carerInsuranceCode}}</el-form-item>
                </el-col>
                <el-col :span="6" style="text-align: right;padding:0 33px 0 0">
                  <el-button type="primary" icon="el-icon-edit" @click="careUpdate = true">修改绑定关系</el-button>
                </el-col>
              </el-row>
            </el-form>
            <!-- 修改状态 -->
            <el-form v-else>
              <el-row gutter="24">
                <el-col :span="5">
                  <el-form-item label="绑定护士">
                    <ub-employee style="width: 120px" v-model="employeeData.nurseId" clearable @change="item => changeNurse(item)"></ub-employee>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="医保ID">{{employeeData.nurseInsuranceCode}}</el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="绑定护理员">
                    <ub-employee style="width: 120px" v-model="employeeData.carerId" clearable @change="item => changeCare(item)"></ub-employee>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="医保ID">{{employeeData.carerInsuranceCode}}</el-form-item>
                </el-col>
                <el-col :span="6" style="text-align: right;padding:0 33px 0 0">
                  <el-button type="success" icon="el-icon-check" @click="saveCare">保存绑定关系</el-button>
                </el-col>
              </el-row>
            </el-form>

          </div>
        </el-card>

        <!-- 等级评估信息 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>等级评估信息</span>
            <span class="annotation" v-show="isCare">
              <el-icon class="el-icon-info"></el-icon>已对接长护险长护险系统，请严格按照实际评估结果设置
            </span>
          </div>
          <div class="text item">
            <el-button @click="news" :type="tableData[0].insuranceLevel === 0 ? 'info' : 'success'" icon="el-icon-plus">新评估</el-button>

            <!-- 头部 -->
            <div class="header-box">
              <el-row :gutter="24">
                <el-col :span="4">
                  长护险等级
                </el-col>
                <el-col :span="10">
                  有效周期
                </el-col>
                <el-col :span="4">
                  修改日期
                </el-col>
                <el-col :span="6">
                  操作
                </el-col>
              </el-row>
            </div>

            <!-- 内容遍历 -->
            <div v-for="(item, index) in tableData" :key="index">
              <el-card class="line-long" :class="[item.isCurrent ? 'current' : '',item.endDate<today ? 'old' : '']">
                <span v-if="item.isCurrent == true" class="current-span">当前</span>
                <span v-if="item.endDate<today" class="current-span">过期</span>
                <el-row :gutter="24">
                  <el-col :span="4">
                    {{ item.insuranceLevel | typeFilter }}
                  </el-col>
                  <el-col :span="10">
                    {{ item.startDate }} 至 {{ item.endDate }}
                  </el-col>
                  <el-col :span="4">
                    {{ item.createTime.substr(0,10) }}
                  </el-col>
                  <el-col :span="6" style="text-align:right">
                    <span v-show="index == 0">
                      <el-button v-if="item.insuranceLevel !== 0" icon="el-icon-edit" @click="doEdit">修改</el-button>
                      <el-button v-else icon="el-icon-plus" @click="doEdit">评估</el-button>
                    </span>
                    <el-button type="primary" @click="optionShow(item)" v-show="(item.insuranceLevel < 7 && item.insuranceLevel > 1) && item.endDate >= today">护理项目</el-button>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </div>
        </el-card>
      </div>

      <div v-else class="noData">
        <img src="@/assets/images/unData.png" />
        <p>暂无数据</p>
      </div>
    </div>

    <!-- 更新 -->
    <el-dialog title="修改长护险等级评估" center :visible.sync="dialogEditVisible" id="editDialog" width="550px">
      <el-form label-width="6em" :model="editForm" style="padding:0 10px;" :rules="rules" ref="editForm">
        <el-row>
          <el-col :span="9">
            <el-form-item label="姓名">{{editForm.name}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入院日期">{{editForm.admiDate}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="等级" prop="levelOption">
            <el-radio-group v-model="editForm.levelOption">
              <el-radio class="grade" v-for="item in levelOptions" :key="item.value" :label="item.value" :disabled="sign=='see'&&item.value!=editForm.levelOption">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-show="editForm.levelOption !== 0">
          <el-form-item label="有效期" prop="indate">
            <el-date-picker v-model="editForm.indate[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable :disabled="sign=='see'"></el-date-picker>
            <div>至</div>
            <el-date-picker v-model="editForm.indate[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable :disabled="sign=='see'"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row :gutter="0" class="dialog_btn_group">
          <el-form-item label="" style="text-align:center;">
            <el-col class :span="7">
              <el-button type="primary" @click="saveEdit()">确定</el-button>
            </el-col>
            <el-col class :span="7" style="margin-left: 20px;">
              <el-button @click="dialogEditVisible = false">取消</el-button>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 新评估 -->
    <el-dialog title="新增长护险等级评估" center :visible.sync="dialogNewVisible" id="newDialog" width="550px">
      <el-form label-width="6em" style="padding:0 10px;" :model="newForm" :rules="rules" ref="newForm">
        <el-row>
          <el-col :span="9">
            <el-form-item label="姓名">{{newForm.name}}</el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="有效期">{{newForm.indate}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="等级">{{newForm.levelOption}}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新等级" prop="newGrade">
            <el-radio-group v-model="newForm.newGrade">
              <el-radio class="grade" v-for="item in levelOptions" :key="item.value" :label="item.value" size="small">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-show="newForm.newGrade !== 0">
          <el-form-item label="新有效期" prop="newIndate">
            <el-date-picker v-model="newForm.newIndate[0]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
            <div>至</div>
            <el-date-picker v-model="newForm.newIndate[1]" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row :gutter="0" class="dialog_btn_group">
          <el-form-item label="">
            <el-col class :span="7">
              <el-button type="primary" @click="saveNew()">确定</el-button>
            </el-col>
            <el-col class :span="7" style="margin-left: 20px;">
              <el-button @click="dialogNewVisible = false">取消</el-button>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 长护险护理项目详情 -->
    <el-dialog :title="'长护险护理项目【' + dialogTitle + '】'" center :visible.sync="dialogOptionVisible" id="optionDialog" width="550px">
      <div class="el-checkbox-box">
        <el-checkbox-group v-model="checkList" v-if="dialogSee">
          <el-checkbox disabled="true" :label="item.title" v-for="(item,index) in checkboxList" :key="index"></el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="checkList" v-else>
          <el-checkbox :label="item.title" v-for="(item,index) in checkboxList" :key="index"></el-checkbox>
        </el-checkbox-group>
        <div class="button-box">
          <el-button v-if="dialogSee" type="primary" @click="dialogSee = false">修改</el-button>
          <div v-else>
            <el-button type="primary" @click="saveCareOption()">确认</el-button>
            <el-button type="primary" @click="dialogOptionVisible = false">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var that;
import tenant from "@/components/_tenant";
import axios from "axios";
import ubEmployee from "@/components/employee";
export default {
  components: { ubEmployee },
  props: ["elderId"],
  data() {
    return {
      dialogSee: true,
      elderInfo: {
        cardNo: '',
        photo: ''
      },
      isCare: true, // 是否对接了医保
      today: '',
      careUpdate: false,
      employeeData: {
        nurseId: '',
        carerId: '',
        nurseName: '',
        carerName: '',
        nurseInsuranceCode: '',
        carerInsuranceCode: ''
      },
      elderData: {
        elderName: "",
        checkinDate: "",
      },
      insuranceLevel: "", //当前最新的长护险等级
      tableData: [],
      checkout: false, // 是否是从旁那个离院查看过来的
      assessList: false, //是否从评估列表跳转过来的
      levelOptions: [],
      level: [1, 2, 3, 4, 5, 6],
      levelText: [
        "未评级",
        "护理一级",
        "护理二级",
        "护理三级",
        "护理四级",
        "护理五级",
        "护理六级",
        "外地",
        "不满60岁",
        "享受居家养老"
      ],
      dialogEditVisible: false,
      dialogNewVisible: false,
      dialogOptionVisible: false,
      dialogTitle: '',
      editForm: {
        name: "",
        admiDate: "",
        levelOption: "",
        indate: "",
        elderId: "",
        changeId: "",
        lastLevel: "",
        lastLevelName: "",
        currentLevelName: ""
      },
      newForm: {
        name: "",
        indate: "",
        levelOption: "",
        newGrade: "",
        newIndate: [],
        elderId: "",
        lastLevelName: "",
        currentLevelName: ""
      },
      checkList: [],
      checkboxList: [{ title: '' }],
      currentClickInfo: {}, // 当前点击的护理等级的信息
    };
  },
  async created() {
    // 是否开通医保
    let data = await tenant.fetchCurrentTenant();
    let setting = tenant.getTenantSetting('medical_agent', data);
    this.isCare = setting != null ? true : false;

    this.init();
    this.dataInit();
    this.initLevelOption("长护险评估等级");
    this.getCareInfo();
    this.getItemViewsByParentNo();
  },
  methods: {

    init() {

      this.today = this.$moment().format('YYYY-MM-DD');
      this.assessList = this.$route.query.assessList;
      this.checkout = this.$route.query.type == "checkout" ? true : false;
      if (this.$route.query.assessList) {
        this.elderId = this.$route.query.elderId;
        this.elderInfo.cardNo = this.$route.query.cardNo;
        this.elderInfo.photo = this.$route.query.photo;
      }
    },

    // 获取所有长护险护理项目
    getItemViewsByParentNo() {
      axios.fetch("commonServer", "/dict/getItemViewsByParentNo", { parentNos: '长护险护理项目' }).then(res => {
        this.checkboxList = res.data;
      });
    },

    // 获取当前老人信息
    dataInit() {
      let data = {
        elderId: this.elderId
      };
      axios
        .fetch("elderServer", "/elderChange/elderInsurance", data)
        .then(res => {
          this.tableData = res.data;
          this.elderData = this.tableData[0];
          this.insuranceLevel = this.tableData[0].insuranceLevel; //当前最新的长护险等级
        });
    },

    // 护理人员绑定情况查看
    getCareInfo() {
      axios.fetch("elderServer", "/elderInsuranceInfo/info", { elderId: this.elderId }).then(res => {
        this.employeeData = res.data;
      })
    },

    //初始化护理等级
    initLevelOption(parentNos) {
      let data = {
        parentNos: parentNos
      };
      let that = this;
      axios
        .fetch("commonServer", "/dict/getItemViewsByParentNo", data)
        .then(res => {
          that.levelOptions = res.data.map(item => {
            return {
              label: item.title,
              value: parseInt(item.itemValue)
            };
          });
        });
    },

    back() {
      this.$router.back();
    },

    // 修改护理人员信息
    saveCare() {
      let param = {
        elderId: this.elderId,//老人id
        nurseId: this.employeeData.nurseId,//护士id
        carerId: this.employeeData.carerId//护工id
      }
      if (!this.employeeData.nurseId) {
        return this.$message.error('护士人员必填！');
      }
      if (!this.employeeData.carerId) {
        return this.$message.error('护工人员必填！');
      }
      if (!this.employeeData.nurseInsuranceCode && this.isCare) {
        return this.$message.error('护士人员没有医保ID，无法绑定关系！')
      }
      if (!this.employeeData.carerInsuranceCode && this.isCare) {
        return this.$message.error('护工人员没有医保ID，无法绑定关系！')
      }
      axios.fetch("elderServer", "/elderInsuranceInfo/bind", param, 'json').then(res => {
        if (res.code == 200) {
          this.getCareInfo();
          this.careUpdate = false;
        }
      });
    },

    // 保存修改的单项护理项目
    saveCareOption() {
      let newArr = this.checkList.map(val => {
        let arr = this.checkboxList.filter(v => v.title === val);
        return {
          itemNo: arr[0].itemNo,
          itemTitle: arr[0].title
        }
      })
      console.log(newArr)
      let param = {
        level: this.currentClickInfo.insuranceLevel,
        changeId: this.currentClickInfo.changeId,
        elderId: this.elderId,
        elderInsuranceItems: newArr
      }
      axios.fetch("elderServer", "/elderInsuranceItem/changeBingInsuranceTitle", param, 'json').then(res => {
        if (res.code == 200) {
          this.dialogOptionVisible = false;
        }
      });
    },

    // 查看当前护理等级有哪些护理项目
    optionShow(val) {
      this.currentClickInfo = val;
      axios.fetch("elderServer", "/elderInsuranceItem/elder/insuranceTitle", { changeId: val.changeId }).then(res => {
        if (res.code == 200) {
          this.checkList = res.data.map(val => val.itemTitle);
          this.dialogSee = true;
        }
      });
      this.dialogTitle = this.levelText[val.insuranceLevel];
      this.dialogOptionVisible = true;
    },

    // 查询护士的医保ID
    changeNurse(val) {
      if (val) {
        this.getCode(val.employeeId).then(data => {
          this.employeeData.nurseInsuranceCode = data;
        });
      } else {
        this.employeeData.nurseInsuranceCode = '';
      }
    },

    // 查询护工的医保ID
    changeCare(val) {
      if (val) {
        this.getCode(val.employeeId).then(data => {
          this.employeeData.carerInsuranceCode = data;
        });
      } else {
        this.employeeData.carerInsuranceCode = '';
      }
    },

    // 获取医保ID的代码
    getCode(id) {
      return new Promise((resolve, reject) => {
        axios.fetch("elderServer", "/elderInsuranceInfo/insuranceCode", { employeeId: id }).then(res => {
          if (!res.data && this.isCare) {
            this.$message.error('该人员没有医保ID！')
          }
          resolve(res.data);
        });
      })
    },

    //修改护理等级的内容
    doEdit() {
      let data = this.elderData;
      this.sign = "edit";
      let editForm = {
        name: data.elderName,
        admiDate: data.checkinDate,
        levelOption: data.insuranceLevel,
        elderId: data.elderId,
        changeId: data.changeId,
        lastLevel: data.insuranceLevel,
      };
      editForm.indate = data.startDate ? [data.startDate, data.endDate] : [];
      editForm.lastLevelName = this.levelOptions.filter(item => { return data.insuranceLevel == item.value; })[0].label;
      editForm.currentLevelName = this.levelOptions.filter(item => { return data.insuranceLevel == item.value; })[0].label;
      this.dialogEditVisible = true;
      this.editForm = editForm;
    },

    // 保存修改的内容
    saveEdit() {
      if (this.editForm.levelOption === 8 && this.tableData[0].age > 60) {
        return this.$message.error('该老人已满60周岁！');
      }

      if (this.editForm.levelOption === 0) {
        this.editForm.indate = [null, null];
      } else if (this.editForm.levelOption >= 7 && (!this.editForm.indate[0] || !this.editForm.indate[1])) {
        let today = this.editForm.indate[0] ? this.editForm.indate[0] : this.$moment().format('YYYY-MM-DD');
        let end = this.editForm.indate[1] ? this.editForm.indate[1] : '2099-12-31'
        this.editForm.indate = [today, end];
      }

      if (this.editForm.levelOption === '' || this.editForm.levelOption === null || this.editForm.levelOption === undefined) {
        return this.$message.error('请选择等级');;
      }
      if (this.level.includes(this.editForm.levelOption) && (!this.editForm.indate[0] || !this.editForm.indate[1])) {
        return this.$message.error('请选择有效期');
      }
      if (this.$moment(this.editForm.indate[0]).valueOf() > this.$moment(this.editForm.indate[1]).valueOf()) {
        return this.$message.error('开始时间不能超过结束时间');
      }
      this.editForm.currentLevelName = this.levelOptions.filter(item => {
        return this.editForm.levelOption == item.value;
      })[0].label;
      let saveData = {
        elderId: this.editForm.elderId,
        changeId: this.editForm.changeId,
        insuranceLevel: this.editForm.levelOption,
        insuranceLevelName: this.editForm.currentLevelName,
        insuranceStartDate: this.editForm.indate ? this.editForm.indate[0] : "",
        insuranceEndDate: this.editForm.indate ? this.editForm.indate[1] : ""
      };
      this.save(saveData, "editForm");
    },

    //新评估
    news() {
      if (this.tableData[0].insuranceLevel === 0) {
        return this.$message.error('请直接修改当前的未评级条目！')
      }
      let data = this.elderData;
      let theForm = this.$refs["newForm"];
      if (theForm) {
        theForm.resetFields();
      }
      this.newForm = {
        name: "",
        indate: "",
        levelOption: "",
        newGrade: "",
        newIndate: [],
        elderId: "",
        lastLevelName: "",
        currentLevelName: ""
      };
      this.newForm.name = data.elderName;
      this.newForm.levelOption = this.levelOptions.filter(item => {
        return data.insuranceLevel == item.value;
      })[0].label;
      this.newForm.indate = data.startDate
        ? data.startDate.split(" ")[0] +
        "至" +
        data.endDate.split(" ")[0]
        : "";
      this.newForm.elderId = data.elderId;
      this.newForm.lastLevel = data.insuranceLevel;
      this.dialogNewVisible = true;
      this.sign = "edit";
    },

    // 保存新评估
    saveNew() {
      if (this.newForm.newGrade === 8 && this.tableData[0].age > 60) {
        return this.$message.error('该老人已满60周岁！');
      }
      if (this.newForm.newGrade === 0) {
        this.newForm.newIndate = [null, null];
      } else if (this.newForm.newGrade >= 7 && (!this.newForm.newIndate[0] || !this.newForm.newIndate[1])) {
        let today = this.newForm.newIndate[0] ? this.newForm.newIndate[0] : this.$moment().format('YYYY-MM-DD');
        let end = this.newForm.newIndate[1] ? this.newForm.newIndate[1] : '2099-12-31'
        this.newForm.newIndate = [today, end];
      }

      if (this.newForm.newGrade === '' || this.newForm.newGrade === null || this.newForm.newGrade === undefined) {
        return this.$message.error('请选择新等级');
      }
      if (this.level.includes(this.newForm.newGrade) && (!this.newForm.newIndate[0] || !this.newForm.newIndate[1])) {
        return this.$message.error('请选择有效期');
      }
      if (this.$moment(this.newForm.newIndate[0]).valueOf() > this.$moment(this.newForm.newIndate[1]).valueOf()) {
        return this.$message.error('开始时间不能超过结束时间');
      }
      this.newForm.currentLevelName = this.levelOptions.filter(item => { return this.newForm.newGrade == item.value; })[0].label;
      let saveData = {
        elderId: this.newForm.elderId,
        insuranceLevel: this.newForm.newGrade,
        insuranceLevelName: this.newForm.currentLevelName,
        insuranceStartDate: this.newForm.newIndate ? this.newForm.newIndate[0] : "",
        insuranceEndDate: this.newForm.newIndate ? this.newForm.newIndate[1] : ""
      };
      this.save(saveData, "newForm");
    },

    //保存接口
    save(saveData, formName) {
      var resetFn = () => {
        if (formName == "newForm") {
          this.dialogNewVisible = false;
        } else {
          this.dialogEditVisible = false;
        }

      }
      axios
        .fetch("elderServer", "/elderChange/submit/insurance", saveData, "json", 'POST', true)
        .then(data => {
          if (data.code == 200) {
            this.$message.success('保存成功');
            this.dataInit();
            resetFn();
          }
        }).catch(data => {
          console.log(data)
          if (data.code == 403) {
            resetFn();
            this.$confirm('所选等级默认护理项目暂未配置?', '保存失败', {
              confirmButtonText: '去配置',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

              let routerUrl = this.$router.resolve({
                path: "/elder/LongNurseRiskSet"
              });
              window.open(routerUrl.href, '_blank');

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          } else {
            this.$message.error(data.message)
          }
        })

    }
  },
  beforeCreate() {
    that = this;
  },
  filters: {
    typeFilter: val => {
      return that.levelText[val];
    }
  }
};
</script>

<style lang="less" scoped>
.long-page {
  .title {
    height: 37px;
    border-bottom: 1px solid rgba(221, 221, 221, 1);
    padding: 10px 0 10px 20px;
    background-color: #fff;
    .back {
      width: 60px;
      height: 34px;
      padding: 0;
      min-width: 0;
      margin: 0 20px 0 0;
    }
  }
  .contractRecord {
    padding: 20px;
    background-color: #fff;
    .el-form-item {
      margin-bottom: 0;
    }
    .block {
      width: 70%;

      .record_title {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        .name {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 0 10px;
        }
      }
      .box-card {
        .annotation {
          float: right;
          padding: 0 13px 0 0;
          color: #ff5b21;
          font-size: 13px;
        }

        .header-box {
          background-color: #eff2f3;
          line-height: 50px;
          margin: 20px 0;
          text-align: center;
          padding: 0 20px;
        }
        .update-hide {
          width: 95px;
          height: 16px;
          display: inline-block;
        }

        .line-long {
          margin: 0 0 20px 0;
          text-align: center;
          line-height: 36px;
        }

        .current {
          border-color: #2e81f1;
          position: relative;
          .current-span {
            position: absolute;
            top: 5px;
            left: -16px;
            background-color: #2e81f1;
            color: #fff;
            font-size: 13px;
            width: 65px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            transform: rotate(-45deg);
          }
        }
        .old {
          color: #bbb;
          border-color: #bbb;
          position: relative;
          .current-span {
            position: absolute;
            top: 5px;
            left: -16px;
            background-color: #bbb;
            color: #fff;
            font-size: 13px;
            width: 65px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            transform: rotate(-45deg);
          }
        }
      }
    }
    .noData {
      height: 75vh;
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        color: #999;
        font-size: 14px;
        text-align: center;
      }
    }
  }

  .el-checkbox-box {
    width: 450px;
    margin: 0 auto;
    .el-checkbox-group {
      height: 400px;
      overflow-y: auto;
      .el-checkbox {
        display: block;
        line-height: 30px;
      }
    }
    .button-box {
      text-align: center;
      margin: 20px;
    }
  }
}
@media screen and (max-width: 1300px) {
  .long-page {
    .contractRecord {
      .block {
        width: 100%;
      }
    }
  }
}

/deep/ .el-form-item__label {
  font-weight: bold;
}
/deep/ .el-form-item__content,
/deep/ .el-form-item__label {
  line-height: 30px;
}
/deep/ .el-radio {
  margin-bottom: 10px;
}
</style>

