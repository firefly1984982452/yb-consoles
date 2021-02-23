<template>
  <div class="search">
    <el-row type="flex">
      <el-col :span=" 24">
        <el-col>
          <el-row type="flex" class="row-bg button-grounp">
            <el-col :span="24">
              <el-row :gutter="40" style="margin-left:0" type="flex" justify>
                <el-col :span="2">
                  <el-button @click="back()" size="mini">
                    <span>返回</span>
                  </el-button>
                </el-col>
                <el-col :span="2" v-if="sign=='edit'">
                  <el-button type="text" @click="employeeTo('edit')" class="noactive" v-bind:class="{'active':currentTab=='edit'}">
                    <span>基本信息</span>
                  </el-button>
                </el-col>
                <el-col :span="2" v-else>
                  <el-button type="text" @click="sign=='add'?null:employeeTo('viewDetail')" class="noactive" v-bind:class="{'active':currentTab=='viewDetail'}">
                    <span>基本信息</span>
                  </el-button>
                </el-col>
                <el-col :span="2">
                  <el-button type="text" @click="employeeTo('contract')" :disabled="employeeId==null" class="noactive" v-bind:class="{'active':currentTab=='contract'}">
                    <span>合同</span>
                  </el-button>
                </el-col>
                <el-col :span="2">
                  <el-button type="text" @click="employeeTo('certificate')" :disabled="employeeId==null" class="noactive" v-bind:class="{'active':currentTab=='certificate'}">
                    <span>证书与编码</span>
                  </el-button>
                </el-col>
                <el-col :span="2">
                  <el-button type="text" @click="employeeTo('attachment')" :disabled="employeeId==null" class="noactive" v-bind:class="{'active':currentTab=='attachment'}">
                    <span>附件</span>
                  </el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return { currentTab: "edit", employeeId: null, sign: "view", sign: '' };
  },

  created() {
    this.sign = this.$route.query.sign;
    console.log(this.sign);
    this.init();
  },
  watch: {
    $route: "init"
  },
  methods: {
    init() {
      this.currentTab = this.$route.query.currentTab;
      this.employeeId = this.$route.query.employeeId;
      this.sign = this.$route.query.sign;
    },
    employeeTo(mod) {
      let path =
        "/oa/employee/" +
        mod +
        "?sign=" +
        this.sign +
        "&currentTab=" +
        mod;
      this.$router.push({
        path: path,
        query: { employeeId: this.employeeId }
      });
    },
    back() {
      this.$router.push("/oa/employee");
    }
  }
};
</script>
<style scoped>
.button-grounp button.active {
  background: #4687e1 !important;
  color: #fff !important;
  border: 1px solid #4687e1 !important;
}
</style>