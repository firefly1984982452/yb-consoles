<template>
  <div class="app-container" id="newSelf">
    <el-form label-width="100px">
      <el-row :gutter="0">
        <el-card class="box-card" style="margin-bottom: 10px;">
          <el-col :span="24">
            <div class="selfProcess" style="border: none;">
              <el-row>
                <el-col v-if="sign == 'see'||sign == 'sh'">
                  <el-form-item label="补贴类型 ">
                    <span v-if="type=='员工补贴'">员工补贴</span>
                    <span v-if="type=='机构补贴'">机构补贴</span>
                    <!--<span v-if="type=='长护险补贴'">长护险补贴</span>-->
                  </el-form-item>
                </el-col>
                <el-col v-else>
                  <el-form-item label="补贴类型 ">
                    <el-radio v-model="type" label="员工补贴">员工补贴</el-radio>
                    <el-radio v-model="type" label="机构补贴">机构补贴</el-radio>
                    <!--<el-radio v-model="type" label="长护险补贴">长护险补贴</el-radio>-->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :xl="8" :lg="10">
                  <el-form-item label="统计时效">
                    <!-- <el-date-picker v-if="sign!='see'" @change="getSTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="enterDate"></el-date-picker> -->
                    <!-- <el-date-picker v-model="enterDate" v-if="sign!='see'" type="daterange" range-separator="至" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" @change="getSTime">
                    </el-date-picker> -->
                    <el-date-picker v-if="sign!='see'" v-model="enterDate[0]" type="month" format="yyyy年MM月" value-format="yyyy-MM" placeholder="开始月份" clearable></el-date-picker>
                    <span v-if="sign!='see'">-</span>
                    <el-date-picker v-if="sign!='see'" v-model="enterDate[1]" type="month" format="yyyy年MM月" value-format="yyyy-MM" placeholder="结束月份" clearable></el-date-picker>
                    <span v-else>{{dateCreated}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-card>
      </el-row>
      <StaffBtie :oid="tbId" :sign="sign" :enterDate="enterDate" v-if="type=='员工补贴'"></StaffBtie>
      <CompanyBtie :oid="tbId" :sign="sign" :enterDate="enterDate" v-if="type=='机构补贴'"></CompanyBtie>
      <!-- <LongBtie :oid="tbId" :sign="sign" :enterDate="enterDate" v-if="type=='长护险补贴'"></LongBtie> -->
    </el-form>
  </div>
</template>
<script>
import CompanyBtie from "./detailChild/companyBtie";
import LongBtie from "./detailChild/longBtie";
import StaffBtie from "./detailChild/staffBtie";
export default {
  data() {
    return {
      type: "",
      enterDate: ['',''],
      tbId: "",
      sign: "",
      dateCreated: "",
    };
  },
  components: {
    CompanyBtie,
    LongBtie,
    StaffBtie,
  },
  mounted() {},
  created() {
    this.tbId = this.$route.query.id;
    this.sign = this.$route.query.sign;
    this.type = this.$route.query.type;
    this.dateCreated = this.$route.query.time;
    this.enterDate = this.$route.query.time
      ? this.$route.query.time.split("~")
      : [null,null];
    if (!this.type && this.sign == "add") {
      if (this.$route.query.tag === "org") {
        this.type = "机构补贴";
      } else if (this.$route.query.tag === "employee") {
        this.type = "员工补贴";
      }
    }
  },
  methods: {
    closeCancel() {
      this.$router.push("/subsidy/subsidysetUpList");
    },
    getSTime(val) {
      this.enterDate = val;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-input__inner {
  height: 40px;
}
</style>