<!--机构管理-->
<template>
  <div>
    <el-form :show-message="false" :model="form" ref="theForm" label-width="120px">
      <div class="content nopadding my-content">
        <div class="content-title">
          <div class="bar bar1"></div>
          <p>基本信息</p>
        </div>
        <div class="org-body">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="机构名称" prop="tenantName" required>
                    <el-input readonly placeholder="请输入机构名称" clearable v-model="form.tenantName" class="org-readonly"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" >
                  <el-form-item label="企业征信代码" prop="creditCode" required>
                    <el-input clearable placeholder="请输入企业征信代码" v-model="form.creditCode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <el-form-item label="地址" prop="addressProvince" required>
                    <ub-address v-model="form.addressProvince" dataType="province" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="" prop="addressCity" required label-width="4px">
                    <ub-address v-model="form.addressCity" dataType="city" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="" prop="addressDistrict" required label-width="4px">
                    <ub-address v-model="form.addressDistrict" dataType="district" clearable></ub-address>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="" prop="addressStreet" required label-width="4px">
                    <ub-address v-model="form.addressStreet" dataType="street" clearable></ub-address>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label=" " prop="addressDetail" required>
                    <el-input clearable placeholder="请输入详细地址" v-model.trim="form.addressDetail"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="法定代表人" prop="legalName" required>
                    <el-input clearable placeholder="请输入法定代表人" v-model="form.legalName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="legalContact" required>
                    <el-input clearable placeholder="请输入联系电话" v-model.number="form.legalContact"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="院长" prop="leaderName" required>
                    <el-input clearable placeholder="请输入院长姓名" v-model="form.leaderName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="院长电话" prop="leaderContact" required>
                    <el-input clearable placeholder="请输入院长电话" v-model.number="form.leaderContact"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="开户银行" prop="bankName" required>
                    <el-input clearable placeholder="请输入开户银行名称" v-model="form.bankName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="银行账号" prop="bankAccount" required>
                    <el-input clearable placeholder="请输入银行账号" v-model="form.bankAccount"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="开办日期" prop="openDate" required>
                    <el-date-picker v-model="form.openDate" type="date" placeholder="请选择开办日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="占地面积" prop="areaFloor" required>
                    <el-input clearable placeholder="请输入占地面积" v-model.number="form.areaFloor"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <span class="sub">m<sup>2</sup></span>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="建筑面积" label-width="80px" prop="areaBuilding" required>
                    <el-input clearable placeholder="请输入建筑面积" v-model.number="form.areaBuilding"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <span class="sub">m<sup>2</sup></span>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="绿化面积" label-width="80px" prop="areaGreen" required>
                    <el-input clearable placeholder="请输入绿化面积" v-model.number="form.areaGreen"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <span class="sub">m<sup>2</sup></span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="邮编" prop="addressZip" required>
                    <el-input clearable placeholder="请输入邮编" v-model.number="form.addressZip" maxlength="6" minlength="6"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="房屋权属证明" prop="propertyRight" required>
                    <ub-dictionary group="房屋权属证明" level="1" clearable v-model="form.propertyRight"></ub-dictionary>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="" label-width="4px" prop="propertyCategory" :required="!propertyCategoryEmpty">
                    <ub-dictionary group="房屋权属证明" level="2" :empty.sync="propertyCategoryEmpty" hiddenEmpty clearable v-model="form.propertyCategory"></ub-dictionary>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="证照情况" prop="licenseType" required>
                    <ub-dictionary group="机构证照情况" level="1" clearable v-model="form.licenseType"></ub-dictionary>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="" label-width="4px" prop="licenseInfo" :required="!licenseInfoEmpty">
                    <ub-dictionary group="机构证照情况" level="2" :empty.sync="licenseInfoEmpty" hiddenEmpty clearable v-model="form.licenseInfo"></ub-dictionary>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="长护险定点" prop="longInsurance" required>
                    <ub-dictionary group="长护险定点" clearable v-model="form.longInsurance"></ub-dictionary>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="content nopadding my-content">
        <div class="content-title">
          <div class="bar bar2"></div>
          <p>床位信息</p>
        </div>
        <div class="org-body">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label="核定床位数" prop="bedsApproved" required label-width="130px">
                <el-input
                  clearable
                  placeholder="请输入核定床位数"
                  v-model.number="form.bedsApproved"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="普通床位数" prop="bedsNormal" label-width="130px">
                <el-input
                  clearable
                  placeholder="请输入普通床位数"
                  v-model.number="form.bedsNormal"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="护理型床位数" prop="bedsCare" label-width="130px">
                <el-input
                  clearable
                  placeholder="请输入护理型床位数"
                  v-model.number="form.bedsCare"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="护理院床位数" prop="bedsNurse" label-width="130px">
                <el-input
                  clearable
                  placeholder="请输入护理院床位数"
                  v-model.number="form.bedsNurse"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label="保基本床位数" prop="bedsBase" label-width="130px">
                <el-input
                  clearable
                  placeholder="请输入保基本床位数"
                  v-model.number="form.bedsBase"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="认知症照护单元数" prop="unitsRecognize" label-width="130px">
                <el-input
                  clearable
                  placeholder="请输入认知症照护单元数"
                  v-model.number="form.unitsRecognize"></el-input>
              </el-form-item>              
            </el-col>
            <el-col :span="6">
              <el-form-item label="认知症照护床位数" prop="bedsRecognize" label-width="130px">
                <el-input
                  clearable
                  placeholder="请输入认知症照护床位数"
                  v-model.number="form.bedsRecognize"></el-input>
              </el-form-item>              
            </el-col>
            <el-col :span="6">
              <el-form-item label="实事完成床位数" prop="bedsReal" label-width="130px">
                <el-input
                  clearable
                  placeholder="请输入实事完成床位数"
                  v-model.number="form.bedsReal"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="content nopadding my-content">
        <div class="content-title">
          <div class="bar bar3"></div>
          <p>医疗机构</p>
        </div>
        <div class="org-body">
          <el-row>
            <el-col :span="6">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="类型" prop="orgType" required>
                    <ub-dictionary group="医疗机构类型" level="1" clearable v-model="form.orgType"></ub-dictionary>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="4px" prop="orgCategory" :required="!orgCategoryEmpty">
                    <ub-dictionary group="医疗机构类型" level="2" :empty.sync="orgCategoryEmpty" hiddenEmpty clearable v-model="form.orgCategory"></ub-dictionary>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-form-item label="纳入医保联网" prop="medicalOnline" required label-width="130px">
                <ub-dictionary group="纳入医保联网" clearable v-model="form.medicalOnline"></ub-dictionary>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="许可证编号" prop="medicalLicense" label-width="130px">
                <el-input clearable placeholder="请输入许可证编号" v-model="form.medicalLicense"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="content nopadding my-content">
        <div class="content-title">
          <div class="bar bar4"></div>
          <p>主办运营</p>
        </div>
        <div class="org-body">
          <el-row>
            <el-col :span="4">
              <el-form-item label="法人性质" prop="legalProperty" required label-width="80px">
                <ub-dictionary group="法人性质" clearable v-model="form.legalProperty"></ub-dictionary>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="运营方式" prop="operationType" required label-width="80px">
                <ub-dictionary group="机构运营方式" clearable v-model="form.operationType"></ub-dictionary>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="机构投资建设方" prop="investmentType" required label-width="130px">
                    <ub-dictionary group="机构投资建设方" level="1" clearable v-model="form.investmentType"></ub-dictionary>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="4px" prop="investmentBuilder" :required="!investmentBuilderEmpty">
                    <ub-dictionary group="机构投资建设方" level="2" :empty.sync="investmentBuilderEmpty" hiddenEmpty clearable v-model="form.investmentBuilder"></ub-dictionary>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4">
              <el-form-item label="运营方" prop="operationCategory" required label-width="80px">
                <ub-dictionary group="机构运营方" clearable v-model="form.operationCategory"></ub-dictionary>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="运营状态" prop="operationStatus" required label-width="80px">
                <ub-dictionary group="机构运营状态" clearable v-model="form.operationStatus"></ub-dictionary>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>

    <div class="buttons">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button >取消</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ubDictionary from '@/components/dictionary';
import ubAddress from '@/components/address';

export default {
  components: { ubDictionary, ubAddress },
  data() {
    return {
      form: { },
      investmentBuilderEmpty: false,
      orgCategoryEmpty: false,
      licenseInfoEmpty: false,
      propertyCategoryEmpty: false,
    }
  },
  created() {
    ubDictionary.init(this);
    axios.fetch('oaServer', '/org/get').then(res => {
      this.form = res.data;
    });
  },
  methods: {
    save() {
      this.$refs["theForm"].validate(valid => {
        if(!valid) {
          this.$message.error('请填写完整表单');
          return;
        }
        this.$confirm('确认要保存吗?').then(() => {
          this.form.createTime = undefined;
          this.form.updateTime = undefined;
          axios.fetch('oaServer', '/org/update', this.form).then(res => {
            this.$message.success('保存成功');
          });
        }).catch(() => {});
      });
    }
  }
}
</script>

<style lang="less" scoped>
.my-content {
  margin-bottom: 10px;

  .bar1 {
    background-color: #0078d4;
  }
  .bar2 {
    background-color: #f36969;
  }
  .bar3 {
    background-color: #3f51b5;
  }
  .bar4 {
    background-color: #6cbc6c;
  }
}
.org-body {
  margin-top: 10px;
  padding: 10px;

  .sub {
    line-height: 26px;
    margin-left: 4px;
    color: #666666;
  }
}
.buttons {
  padding: 20px;
  background-color: #fff;
  text-align: center;
}
</style>

<style lang="less">
.org-readonly {
  input {
    background-color: #f4f7fa;
  }
}
.org-body {
  .el-form-item {
    margin-bottom: 15px;
  }
}
</style>