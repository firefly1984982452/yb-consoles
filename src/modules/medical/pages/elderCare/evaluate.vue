<template>
  <div class="evaluate">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <s class="blueBa"></s>
        <span>长者信息</span>
      </div>
      <el-row :gutter="0">
        <el-form>
          <el-col :xs="8" :sm="3" :md="3" :lg="3" :xl="2">
            <el-form-item label="姓名">
              <span>{{ elderName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="2" :md="2" :lg="2" :xl="2">
            <el-form-item label="性别">
              <span>{{ gender }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="2" :md="3" :lg="2" :xl="2">
            <el-form-item label="年龄">
              <span>{{ age }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4">
            <el-form-item label="身份证号">
              <span>{{ cardNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="5" :xl="3">
            <el-form-item label="登记时间">
              <span>{{ createTime }}</span>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
    </el-card>
    <div class="tab">
      <el-row class="header">
        <el-button v-for="(item, i) in tabs" :key="i" :disabled="item.disabled" :class="{ cur: iscur == i }" @click="(iscur = i), tabChange(item.name)">
          <span>{{ item.text }}</span>
        </el-button>
      </el-row>
      <div class="content">
        <component v-bind:is="tabView" :estimateId="estimateId"></component>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Health from "./health-new";
import First from "./first";
export default {
  name: "Evaluate",
  data() {
    return {
      iscur: 0,
      tabView: "Health",
      tabs: [
        {
          text: "健康评估",
          name: "Health",
          icon: "el-icon-arrow-down",
          disabled: false
        },
        {
          text: "首次照护评估",
          name: "First",
          icon: "el-icon-arrow-down",
          disabled: false
        }
      ],
      /** 老人信息 */
      elderId: "",
      elderName: "",
      gender: "",
      cardNo: "",
      age: "",
      createTime: "",
      isMedical: "",
      estimateId: "" // 照护评估id
    };
  },
  components: { Health, First },
  created() {
    this.elderId = this.$route.query.elderId;
    this.elderName = this.$route.query.elderName;
    this.gender = this.$route.query.gender;
    this.cardNo = this.$route.query.cardNo;
    this.age = this.$route.query.age;
    this.createTime = this.$route.query.createTime;
    this.estimateId = this.$route.query.estimateId;
    this.isMedical = this.$route.query.isMedical;
    if (this.isMedical && this.estimateId) {
      this.tabView = "First";
      this.iscur = 1;
    }
    // 不存在评估id的话 需要业务那边完成首次评估后医生才可以操作
    this.tabs[1].disabled = this.estimateId ? false : true;
  },
  methods: {
    tabChange: function(tab) {
      this.tabView = tab;
    }
    // 子组件中触发切换的tag的方法
    // switchView(param){
    //   this.tabView = param;
    // }
  }
};
</script>

<style lang="less" scoped>
.evaluate {
  display: flex;
  flex-direction: column;
  .box-card {
    height: 150px;
  }
  .tab {
    background-color: #fff;
    margin-top: 16px;
    flex: 1;
    .header {
      border-bottom: 1px solid #dddddd;
      padding: 10px 20px;
      /deep/ .el-button {
        i {
          color: #409eff;
          // color: #fff;
          font-weight: 700;
        }
      }
      /deep/ .el-button.cur {
        background-color: #5b8ff9ff;
        color: rgba(255, 255, 255, 1);
        i {
          // color: #409eff;
          color: #fff;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
