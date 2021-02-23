<template>
  <el-form label-width="80px" size="mini" class="static-item">
    <el-card class="box-card" style="margin:16px;">
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名">
            <span>{{elder.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别">
            <span>{{elder.gender}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年龄">
            <span>{{elder.age}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="房间床位">
            <span>{{elder.roomName}}-{{elder.bedName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入院编号">
            <span>{{elder.checkinNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="护理等级">
            <span>{{elder.nursingLevelName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="advice.diagnosis">
        <el-col :span="24">
          <el-form-item label="诊断">
            <span>{{advice.diagnosis}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col :span="24">
        <el-form-item label="医嘱期效">
          <span>{{periodName()}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.period==2">
      <el-col :span="24">
        <el-form-item label="医嘱时间">
          <span>{{form.startTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="24">
        <el-form-item label="开始时间">
          <span>{{form.startTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="医嘱内容">
          <span>{{adviceItem.name}}<span v-if="adviceItem.standard">（{{adviceItem.standard}}）</span> </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="单次剂量">
          <span>{{adviceItem.useCount}}{{adviceItem.useUnit}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="给药途径">
          <span>{{form.way}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="频率">
          <span>{{form.rate}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="给药时间">
          <span>{{form.useTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="嘱托备注">
          <span>{{form.useRemark}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="总量">
          <span v-if="adviceItem.quantity!=0">{{adviceItem.quantity}}{{adviceItem.unit}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.period==2">
      <el-col :span="24">
        <el-form-item label="用药天数">
          <span>{{form.day||"--"}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div v-if="form.period==1">
      <el-row>
        <el-col :span="24">
          <el-form-item label="停止时间">
            <span style="color:rgb(255, 68, 68);" v-if="form.endTime">{{form.endTime}}</span><span v-else>--</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </div>
    <div v-if="form.period==2 && form.status== 5">
      <el-row>
        <el-col :span="24">
          <el-form-item label="执行时间">
            <span v-if="form.invalidConfirmTime">{{form.invalidConfirmTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="执行人">
            <span v-if="form.invalidConfirmer">{{form.invalidConfirmer}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="执行备注">
            <span v-if="form.invalidRemark">{{form.invalidRemark}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </div>
    <el-row>
      <el-col :span="24">
        <el-form-item label="开嘱医生">
          <span>{{form.doctorName}}，{{form.createTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.status >=2">
      <el-col :span="24">
        <el-form-item label="校对护士">
          <span v-if="form.confirmer">{{form.confirmer}}，{{form.confirmTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.status==5">
      <el-col :span="24">
        <el-form-item label="停嘱医生">
          <span v-if="form.invalider">{{form.invalider}}，{{form.invalidLaunchTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.status==5">
      <el-col :span="24">
        <el-form-item label="确认停止">
          <span v-if="form.invalidConfirmer">{{form.invalidConfirmer}}，{{form.invalidConfirmTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.status==10">
      <el-col :span="24">
        <el-form-item label="作废医生">
          <span v-if="form.invalider">{{form.invalider}}，{{form.invalidLaunchTime}}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
export default {
  name: "viewAdvice",
  props: {
    advice: {
      type: Object,
      default() {
        return {};
      },
    },
    adviceItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      elder: {},
      form: {},
      periods: {
        "1": "长嘱",
        "2": "临嘱",
      },
    };
  },

  computed: {},
  watch: {},
  mounted() {},
  created() {
    if (this.advice) {
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/group/" + this.adviceItem.groupId,
          null,
          null,
          "get"
        )
        .then((res) => {
          this.elder = res.data.elder;
          this.form = res.data.adviceGroup;
        });
    }
  },
  methods: {
    periodName() {
      return this.periods[this.form.period];
    },
  },
  components: {},
};
</script>
<style scoped>
.static-item .el-form-item,
.static-item .el-form-item--mini.el-form-item,
.static-item .el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
.static-item .el-form-item__content span {
  font-weight: 700;
}
/deep/ .el-divider--horizontal {
  background: 0 0;
  border-top: 1px dashed #d4d4d4;
}
</style>