<template>
  <div class="org_b">
    <el-row :gutter="0">
      <el-col :span="24">
        <el-form ref="dataForm" :model="dataForm" :rules='rules'>
          <div class="selfProcess">
            <div style="padding-left:50px">
              <h2 class="titProcess">1、新建内设医疗机构</h2>
              <el-row style="margin-top: 30px;">
                <el-form-item label="奖励标准" prop="medicalAmount">
                  <el-col :span="4">
                    <el-input placeholder="请输入奖励标准" v-model.trim="dataForm.medicalAmount" v-if="sign!='see'"></el-input>
                    <span v-else>{{dataForm.medicalAmount}}元</span>
                  </el-col>
                  <el-col :span="2" v-if="sign!='see'">
                    <b>&nbsp;&nbsp;&nbsp;元</b>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="补贴方式">
                  <el-col :span="4">
                    <!-- <el-select v-if="sign!='see'" v-model="dataForm.soNewType" placeholder="请选择补贴方式" @click.native="selectTool(290)">
                      <el-option v-for="(item,index) in option" :key="item.sutl_name" :label="item.sutl_name" :value="item.sutl_name"></el-option>
                    </el-select> -->
                    <span>{{dataForm.medicalSubsidy | bttypeFilter}}</span>
                  </el-col>
                </el-form-item>
              </el-row>
              <h2 class="titProcess" style="margin-top: 30px;">2、招用持证人员奖</h2>
              <el-row style="margin-top: 30px;">
                <el-form-item label="最低工资标准" prop="hireLowest">
                  <el-col :span="4">
                    <el-input placeholder="请输入最低工资标准" v-if="sign!='see'" v-model.trim="dataForm.hireLowest"></el-input>
                    <span v-else>{{dataForm.hireLowest}}元</span>
                  </el-col>
                  <el-col :span="2" v-if="sign!='see'">
                    <b>&nbsp;&nbsp;&nbsp;元/月</b>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="补贴方式">
                  <el-col :span="4">
                    <!-- <el-select v-if="sign!='see'" placeholder="请选择补贴方式" @click.native="selectTool(290)" v-model="dataForm.soHireType">
                      <el-option v-for="item in option" :key="item.sutl_name" :label="item.sutl_name" :value="item.sutl_name"></el-option>
                    </el-select> -->
                    <span>{{dataForm.hireSubsidy | bttypeFilter}}</span>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row class="company">
                <!--<el-form-item label="">-->
                <table class="dataFormTable" style="width: 50%;">
                  <thead>
                    <td>人员分类</td>
                    <td>证书等级</td>
                    <td>补贴系数</td>
                    <td>补贴金额</td>
                  </thead>
                  <tr>
                    <td rowspan="3">养老护理员</td>
                    <td>初级</td>
                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="22">
                          <el-form-item label="" prop="hireJunior" class="form_item" v-if="sign!='see'">
                            <el-input-number v-model="dataForm.hireJunior" placeholder="补贴系数" :precision="2" :step="1" :min="0"></el-input-number>
                          </el-form-item>
                          <span v-else>{{dataForm.hireJunior}}%</span>
                          <span style="line-height: 40px;" v-if="sign!='see'">%</span>
                        </el-col>
                      </el-row>
                    </td>
                    <td>系数*最低工资*月份</td>
                  </tr>
                  <tr>
                    <td>中级</td>
                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="22">
                          <el-form-item label="" prop="hireMiddle" class="form_item" v-if="sign!='see'">
                            <el-input-number v-model="dataForm.hireMiddle" placeholder="补贴系数" :precision="2" :step="1" :min="0"></el-input-number>
                          </el-form-item>
                          <span v-else>{{dataForm.hireMiddle}}%</span>
                          <span style="line-height: 40px;" v-if="sign!='see'">%</span>
                        </el-col>
                      </el-row>
                    </td>
                    <td>系数*最低工资*月份</td>
                  </tr>
                  <tr>
                    <td>高级</td>
                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="22">
                          <el-form-item label="" prop="hireHigh" class="form_item" v-if="sign!='see'">
                            <el-input-number v-model="dataForm.hireHigh" placeholder="补贴系数" :precision="2" :step="1" :min="0"></el-input-number>
                          </el-form-item>
                          <span v-else>{{dataForm.hireHigh}}%</span>
                          <span style="line-height: 40px;" v-if="sign!='see'">%</span>
                        </el-col>
                      </el-row>
                    </td>
                    <td>系数*最低工资*月份</td>
                  </tr>
                  <tr>
                    <td colspan="2">专技人员</td>

                    <td>
                      <el-row type="flex" justify="center">
                        <el-col :span="22">
                          <el-form-item label="" prop="hireMaster" class="form_item" v-if="sign!='see'">
                            <el-input-number v-model="dataForm.hireMaster" placeholder="补贴系数" :precision="2" :step="1" :min="0"></el-input-number>
                          </el-form-item>
                          <!--<el-input v-if="sign!='see'" placeholder="补贴系数" v-model="dataForm.hireMaster"></el-input>-->
                          <span v-else>{{dataForm.hireMaster}}%</span>
                          <span style="line-height: 40px;" v-if="sign!='see'">%</span>
                        </el-col>
                      </el-row>
                    </td>
                    <td>系数*最低工资*月份</td>
                  </tr>
                </table>
                <!--</el-form-item>-->
              </el-row>
              <h2 class="titProcess" style="margin-top: 30px;">3、新增连锁养老机构</h2>
              <el-row style="margin-top: 30px;">
                <el-form-item label="补贴金额" prop="brandAmount">
                  <el-col :span="4">
                    <el-input v-if="sign!='see'" v-model.trim="dataForm.brandAmount" placeholder="请输入补贴金额"></el-input>
                    <span v-else>{{dataForm.brandAmount}}元</span>
                  </el-col>
                  <el-col :span="2" v-if="sign!='see'">
                    <b>&nbsp;&nbsp;&nbsp;元/所</b>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="补贴方式">
                  <el-col :span="4">
                    <!-- <el-select v-if="sign!='see'" placeholder="请选择补贴方式" @click.native="selectTool(290)" v-model="dataForm.soAddType">
                      <el-option v-for="item in option" :key="item.sutl_name" :label="item.sutl_name" :value="item.sutl_name"></el-option>
                    </el-select> -->
                    <span>{{dataForm.brandSubsidy | bttypeFilter}}</span>
                  </el-col>
                </el-form-item>
              </el-row>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <!-- <el-row class="ybBanner" style="margin-top:100px;">
      <span>技术支持：有伴（上海）智能科技有限公司</span>
    </el-row> -->
    <div class="tijiao" id="addTijiao" v-if="sign!='sh'">
      <el-row :gutter="20" v-if="sign != 'see'">
        <!-- <el-col :span="3" style> -->
        <el-button type="primary" style="width:" @click="handleData('add')">新建机构补贴标准</el-button>
        <!-- <el-button type="info" plain disabled v-if="companySave==1">新建完成</el-button> -->
        <!-- </el-col> -->
        <!-- <el-col :span="2" style> -->
        <el-button type plain @click="closeCancel()">取消</el-button>
        <!-- </el-col> -->
      </el-row>
      <el-row :gutter="0" v-else>
        <el-button type plain @click="closeCancel()">关闭</el-button>
      </el-row>
    </div>
    <div class="tijiao" id="addTijiao" v-else>
      <el-row :gutter="20">
        <el-button type="primary" @click="handleData('edit')">编辑机构补贴标准</el-button>
        <el-button type plain @click="handleData('check')">审核</el-button>
        <el-button type plain @click="closeCancel()">取消</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: ["oid", "sign", "enterDate"],
  data() {
    return {
      option: [],
      /*虚拟数据*/
      dataForm: {
        brandSubsidy: 0, //新增连锁养老机构补贴方式：0一次性，1按月
        medicalSubsidy: 0, //新建内设医疗机构补贴方式：0一次性，1按月
        hireSubsidy: 1, //招用持证人员补贴方式：0一次性，1按月
      },
      rules: {
        medicalAmount: [{ required: true, message: "不能为空" }],
        hireLowest: [{ required: true, message: "不能为空" }],
        hireJunior: [{ required: true, message: "不能为空" }],
        hireMiddle: [{ required: true, message: "不能为空" }],
        hireHigh: [{ required: true, message: "不能为空" }],
        hireMaster: [{ required: true, message: "不能为空" }],
        brandAmount: [{ required: true, message: "不能为空" }],
      },
    };
  },
  created() {
    if (this.sign != "add") {
      this.seeById();
    }
  },
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
            if (
              isNaN(this.dataForm.brandAmount) ||
              isNaN(this.dataForm.medicalAmount) ||
              isNaN(this.dataForm.hireLowest)
            ) {
              this.$message.warning("金额只能为数字");
            } else if (
              Number(this.dataForm.brandAmount) < 0 ||
              Number(this.dataForm.medicalAmount) < 0 ||
              Number(this.dataForm.hireLowest) < 0
            ) {
              this.$message.warning("金额不能小于0");
            } else {
              const api =
                type == "add" ? "/subsidyOrg/add" : "/subsidyOrg/edit";
              this.dataForm.startDate = this.$moment(this.enterDate[0])
                .startOf("month")
                .format("YYYY-MM-DD");
              this.dataForm.endDate = this.$moment(this.enterDate[1])
                .endOf("month")
                .format("YYYY-MM-DD");
              if (type == "check") {
                this.dataForm.status = 1;
              }
              axios
                .fetch("oaServer", api, this.dataForm, "json")
                .then((res) => {
                  this.$message.success("操作成功");
                  if (type != "edit") {
                    this.$router.go(-1);
                  }
                });
            }
          } else {
            this.$message.warning("请完善表单内容");
          }
        });
      }
    },
    editData() {},
    closeCancel() {
      this.$router.push("/subsidy/subsidysetUpList");
      //   this.$store.commit("setShowParent", 0);
    },
    shData() {},
    /*查看*/
    seeById() {
      axios
        .fetch("oaServer", "/subsidyOrg/all", {
          id: this.oid,
        })
        .then((res) => {
          console.log(res);
          this.dataForm = Object.assign({}, this.dataForm, res.data[0]);
        });
    },
  },
  filters: {
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

<style lang="less" scoped>
.org_b {
  background-color: #fff;
  padding: 12px;
  .dataFormTable {
    /deep/ .el-input {
      .el-input__inner {
        height: 40px;
      }
    }
  }
  /deep/ .el-form-item__error {
    display: none;
  }
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
  .form_item {
    display: inline-block;
  }
  #addTijiao {
    .el-row {
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>