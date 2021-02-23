<template>
  <div class="staff_b">
    <el-row :gutter="0">
      <el-col :span="24">
        <el-form label-width="" ref="dataForm" :model="dataForm" :rules="rules">
          <div class="selfProcess">
            <el-row :gutter="20">
              <el-col :span="8" class="span8">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <s class="redBa"></s><span>养老服务就业补贴</span>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item label="补贴对象">
                        <b>{{ dataForm.jobTarget }}</b>
                      </el-form-item>
                    </el-col>
                    <el-row>
                      <el-form-item label="补贴方式">
                        <b>{{ dataForm.jobSubsidy | bttypeFilter }}</b>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <table class="dataFormTable">
                        <thead>
                          <td>学历</td>
                          <td>标准补贴</td>
                        </thead>
                        <tr>
                          <td>中等职业技术学校</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="jobMiddle">
                                  <el-input v-if="sign!='see'" v-model.number="dataForm.jobMiddle" placeholder="请输入补贴"></el-input>
                                  <span v-else>{{dataForm.jobMiddle}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                        <tr>
                          <td>高等院校全日制毕业</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="jobSenior">
                                  <el-input v-if="sign!='see'" v-model.number="dataForm.jobSenior" placeholder="请输入补贴"></el-input>
                                  <span v-else>{{dataForm.jobSenior}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                      </table>
                    </el-row>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :span="8" class="span8">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <s class="orgBa"></s><span>养老服务岗位补贴</span>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item label="补贴对象">
                        <b>{{ dataForm.postTarget }}</b>
                      </el-form-item>
                    </el-col>
                    <el-row>
                      <el-form-item label="补贴方式" prop="functionType">
                        <b>{{ dataForm.postSubsidy | bttypeFilter }}</b>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <table class="dataFormTable">
                        <thead>
                          <td>工作时长</td>
                          <td>补贴标准</td>
                        </thead>
                        <tr>
                          <td>五年</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="postFifth">
                                  <el-input v-if="sign!='see'" placeholder="请输入补贴" v-model.number="dataForm.postFifth"></el-input>
                                  <span v-else>{{dataForm.postFifth}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                        <tr>
                          <td>十年</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="postTenth">
                                  <el-input v-if="sign!='see'" placeholder="请输入补贴" v-model.number="dataForm.postTenth"></el-input>
                                  <span v-else>{{dataForm.postTenth}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                      </table>
                    </el-row>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :span="8" class="span8">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <s class="blueBa" style="background: #2AC2F9;"></s><span>养老护理员绩效奖励</span>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item label="补贴对象">
                        <b>{{ dataForm.postTarget }}</b>
                      </el-form-item>
                    </el-col>
                    <el-row>
                      <el-form-item label="补贴方式" prop="functionType">
                        <b>{{ dataForm.gradeSubsidy | bttypeFilter }}</b>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <table class="dataFormTable">
                        <thead>
                          <td>机构上年度考核结果</td>
                          <td>补贴标准</td>
                        </thead>
                        <tr>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="gradeResult">
                                  <el-input v-model="dataForm.gradeResult" placeholder="请输入考核结果" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.gradeResult}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="gradeAmount">
                                  <el-input v-model.number="dataForm.gradeAmount" placeholder="请输入补贴" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.gradeAmount}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                      </table>
                    </el-row>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :span="8" class="span8">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <s class="qinBa"></s><span>养老服务人员职业技能补贴</span>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item label="补贴对象">
                        <b>{{ dataForm.skillTarget }}</b>
                      </el-form-item>
                    </el-col>
                    <el-row>
                      <el-form-item label="补贴方式" prop="sepySkillType">
                        <b>{{ dataForm.skillSubsidy | bttypeFilter }}</b>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <table class="dataFormTable">
                        <thead>
                          <td>证书等级</td>
                          <td>补贴标准</td>
                        </thead>
                        <tr>
                          <td>初级</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="skillJunior">
                                  <el-input placeholder="请输入补贴" v-model.number="dataForm.skillJunior" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.skillJunior}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                        <tr>
                          <td>中级</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="skillMiddle">
                                  <el-input placeholder="请输入补贴" v-model.number="dataForm.skillMiddle" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.skillMiddle}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                        <tr>
                          <td>高级</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="skillSenior">
                                  <el-input placeholder="请输入补贴" v-model.number="dataForm.skillSenior" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.skillSenior}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                        <tr>
                          <td>技师</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="skillMaster">
                                  <el-input placeholder="请输入补贴" v-model.number="dataForm.skillMaster" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.skillMaster}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                      </table>
                    </el-row>
                  </el-row>
                </el-card>
              </el-col>
              <el-col :span="8" class="span8">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <s class="ppBa"></s><span>养老服务专业技术人员津贴</span>
                  </div>
                  <el-row>
                    <el-col>
                      <el-form-item label="补贴对象">
                        <b>{{ dataForm.techTarget }}</b>
                      </el-form-item>
                    </el-col>
                    <el-row>
                      <el-form-item label="补贴方式" prop="sepyTechType">
                        <el-col :span="10">
                          <b>按月</b>
                        </el-col>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <table class="dataFormTable">
                        <thead>
                          <td>证书等级</td>
                          <td>标准补贴</td>
                        </thead>
                        <tr>
                          <td>初级</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="techJunior">
                                  <el-input placeholder="请输入补贴" v-model.number="dataForm.techJunior" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.techJunior}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                        <tr>
                          <td>中级</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="techMiddle">
                                  <el-input placeholder="请输入补贴" v-model.number="dataForm.techMiddle" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.techMiddle}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                        <tr>
                          <td>高级</td>
                          <td>
                            <el-row type="flex" class="row-bg" justify="center">
                              <el-col :span="20">
                                <el-form-item prop="techSenior">
                                  <el-input placeholder="请输入补贴" v-model.number="dataForm.techSenior" v-if="sign!='see'"></el-input>
                                  <span v-else>{{dataForm.techSenior}}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </td>
                        </tr>
                      </table>
                    </el-row>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <div class="tijiao" id="addTijiao" v-if="sign!='sh'">
      <el-row :gutter="20" v-if="sign != 'see'">
        <!-- <el-col :span="3" style> -->
        <el-button type="primary" @click="handleData('add')">新建员工补贴标准</el-button>
        <!-- </el-col> -->
        <!-- <el-col :span="2" style> -->
        <el-button type plain @click="closeCancel()">取消</el-button>
        <!-- </el-col> -->
      </el-row>
      <el-row :gutter="0" v-else>
        <el-col :span="2" style>
          <el-button type plain @click="closeCancel()">关闭</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="tijiao" id="addTijiao" v-else>
      <el-row :gutter="20">
        <!-- <el-col :span="3" style> -->
        <el-button type="primary" @click="handleData('edit')">编辑员工补贴标准</el-button>
        <!-- </el-col> -->
        <!-- <el-col :span="2" style> -->
        <el-button type plain @click="handleData('check')">审核</el-button>
        <el-button type plain @click="closeCancel()">取消</el-button>
        <!-- </el-col> -->
      </el-row>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";
export default {
  props: ["oid", "sign", "enterDate"],
  data() {
    return {
      itemId: "",
      form: {},
      option: [],
      /*虚拟数据*/
      dataForm: {
        // jobMiddle: "",
        jobSubsidy: 0, //就业补贴方式：0一次性，1按月
        jobTarget: "持证养老机构从业者", //就业补贴对象，默认为养老机构从业者
        gradeSubsidy: 1, //绩效补贴方式：0一次性，1按月
        gradeTarget: "持证养老护理员", //绩效补贴对象，默认为持证养老护理员
        postSubsidy: 0, //岗位补贴方式：0一次性，1按月
        postTarget: "持证养老机构养老护理员", //岗位补贴对象，默认为持证养老护理员
        skillTarget: "持证养老机构养老护理员", //技能补贴对象，默认为持证养老护理员
        skillSubsidy: 1, //技能补贴方式：0一次性，1按月
        techTarget: "持证养老机构从业者（医生、护士、医技等）", //专技补贴对象，默认为持证养老专技人员
      },
      rules: {
        gradeAmount: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        gradeResult: [{ required: true, message: "不能为空" }],
        jobMiddle: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        jobSenior: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        postFifth: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        postTenth: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        skillJunior: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        skillMaster: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        skillMiddle: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        skillSenior: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        techJunior: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        techMiddle: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
        techSenior: [
          { required: true, message: "不能为空" },
          { type: "number", message: "只能输入数字", trigger: "blur" },
        ],
      },
      loading: false,
    };
  },
  created() {
    this.itemId = this.$route.query.id ? Number(this.$route.query.id) : null;
    if (this.sign != "add") {
      this.seeById();
    }
  },
  mounted() {},
  methods: {
    /*新增&&编辑&&审核*/
    handleData(type) {
      if (!this.enterDate[0] || !this.enterDate[1]) {
        this.$message.warning("请选择有效期!");
      } else if (
        this.$moment(this.enterDate[0]).valueOf() >
        this.$moment(this.enterDate[1]).valueOf()
      ) {
        this.$message.warning("开始时间不能超过结束时间");
        return false;
      } else {
        this.$refs.dataForm.validate((valid) => {
          console.log(valid);
          if (valid) {
            const api =
              type == "add" ? "/subsidyEmployee/add" : "/subsidyEmployee/edit";
            this.dataForm.startDate = this.$moment(this.enterDate[0])
              .startOf("month")
              .format("YYYY-MM-DD");
            this.dataForm.endDate = this.$moment(this.enterDate[1])
              .endOf("month")
              .format("YYYY-MM-DD");
            if (type == "check") {
              this.dataForm.status = 1;
            }
            axios.fetch("oaServer", api, this.dataForm, "json").then((res) => {
              this.$message.success("操作成功");
              if (type != "edit") {
                this.$router.go(-1);
              }
            });
          } else {
            this.$message.warning("请完善表单内容");
          }
        });
      }
    },
    closeCancel() {
      this.$router.push("/subsidy/subsidysetUpList");
    },
    /*查看*/
    seeById() {
      axios
        .fetch("oaServer", "/subsidyEmployee/all", {
          id: this.itemId,
        })
        .then((res) => {
          console.log(res);
          this.dataForm = res.data[0];
        });
    },
  },
  filters: {
    arrayFilter: (val) => {
      if (val) {
        val = val.join(",");
      }
      return val;
    },
    bttypeFilter: (val) => {
      if (val === 0) {
        val = "一次性";
      } else if (val == 1) {
        val = "按月";
      } else if (val == 2) {
        val = "按天";
      }
      return val;
    },
  },
};
</script>

<style>
.selfProcess .el-checkbox__label {
  width: auto;
}
.dataFormTable {
  width: 95%;
  border-radius: 2px;
}
.dataFormTable td {
  color: #666;
  padding: 5px 0;
  font-size: 14px;
  text-align: center;
  border: 1px solid #dcdfe6;
}
.dataFormTable thead td {
  background: #f3f3f3;
  font-size: 15px;
  color: #909399;
  font-weight: 600;
  border-radius: 1px;
}
.span8 {
  margin-top: 20px;
  height: 600px;
}
.span8 .el-card {
  height: 100%;
}
</style>

<style lang="less" scoped>
.staff_b {
  background-color: #fff;
  padding: 12px;
  // /deep/ .el-form-item__error {
  //   display: none;
  // }
  // /deep/ .el-form-item {
  //   margin-bottom: 0px;
  // }
}
#addTijiao {
  margin-top: 22px;
  .el-row {
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>