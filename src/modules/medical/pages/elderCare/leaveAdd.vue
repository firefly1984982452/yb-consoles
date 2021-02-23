<template>
  <div class="leave-add">
    <div class="elder-info">
      <div class="base-info">
        <el-avatar shape="circle " :size="78" :fit="fit" :src="elderPhoto?elderPhoto:gender=='男'?require('@/assets/images/yeye.png'):require('@/assets/images/nainai.png')"></el-avatar>
        <div class="name">
          <p><b>{{ elderName }}</b></p>
          <p>
            <span>{{ gender }}</span>&nbsp;&nbsp;
            <span>{{ age }}周岁</span>
          </p>
        </div>
      </div>
      <div class="other-info">
        <el-form style="padding-left:15px">
          <el-form-item label="房间床位">
            {{ roomName }}-{{ bedName }}
          </el-form-item>
          <el-form-item label="护理等级">
            {{ nursingLevel | levelFilter }}
          </el-form-item>
          <el-form-item label="入院日期">
            {{ checkinDate }}
          </el-form-item>
          <el-form-item label="入院编号">
            {{ checkinNo }}
          </el-form-item>
          <el-form-item label="离院原因">
            {{ checkoutRemark }}
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="content">
      <el-tab-pane label="离院小结" name="离院小结">
        <SumForm @changeActiveName="changeActiveName" />
      </el-tab-pane>
      <el-tab-pane label="离院交接" name="离院交接">
        <ShiftForm @changeActiveName="changeActiveName"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import SumForm from "./sumForm";
import ShiftForm from "./shiftForm";
export default {
  name: "LeaveAdd",
  components: { SumForm, ShiftForm },
  data () {
    return {
      activeName: "离院小结",
      elderName:'',
      gender:'',
      age:'',
      roomName:'',
      bedName:'',
      nursingLevel:'',
      checkinDate:'',
      checkinNo:'',
      checkoutRemark:'',
      elderPhoto:'',
      formStatus:'',
      flowStatus:'',
    };
  },
  created () {
    this.elderId = this.$route.query.elderId;
    this.elderName = this.$route.query.elderName;
    this.gender = this.$route.query.gender;
    this.age = this.$route.query.age;
    this.roomName = this.$route.query.roomName;
    this.bedName = this.$route.query.bedName;
    this.nursingLevel = this.$route.query.nursingLevel;
    this.checkinDate = this.$route.query.checkinDate;
    this.checkinNo = this.$route.query.checkinNo;
    this.checkoutRemark = this.$route.query.checkoutRemark;
    this.elderPhoto = this.$route.query.elderPhoto;
    this.formStatus = this.$route.query.formStatus;
    this.flowStatus = this.$route.query.flowStatus;
    this.sign = this.$route.query.sign;
    if(this.sign ==='add'){
      if(!this.formStatus || (this.formStatus === 1 && this.flowStatus === 1)){
        this.activeName = '离院小结';
      } else {
        this.activeName = '离院交接';
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    },
    changeActiveName(activeName){
      this.activeName = activeName;
    }
  },
  
  filters: {
    levelFilter: (val) => {
      if (val == 0) {
        val = "无护理";
      } else if (val == 1) {
        val = "护理一级";
      } else if (val == 2) {
        val = "护理二级";
      } else if (val == 3) {
        val = "护理三级";
      } else if (val == 4) {
        val = "护理四级";
      } else if (val == 5) {
        val = "护理五级";
      } else if (val == 6) {
        val = "护理六级";
      }
      return val;
    },
  },
};
</script>

<style lang="less" scoped>
.leave-add {
  display: flex;
  .elder-info {
    box-sizing: border-box;
    width: 215px;
    margin-right: 15px;
    padding: 20px 15px;
    border-radius: 5px;
    background-color: #fff;
    .base-info {
      display: flex;
      .name {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 15px;
        p {
          padding: 5px 0;
        }
      }
    }
    .other-info {
      margin-top: 25px;
    }
  }
  .content {
    flex: 1;
  }
}
</style>
