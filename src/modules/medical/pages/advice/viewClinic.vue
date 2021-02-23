<template>
  <el-form label-width="80px" size="mini" class="static-item" style="margin:16px;">
    <el-card class="box-card">
      <el-row>
        <el-col :span="5">
          <el-form-item label="姓名">
            <span>{{elder.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="性别">
            <span>{{elder.gender}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="年龄">
            <span>{{elder.age}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="就诊日期">
            <span>{{advice.createTime.substring(0,10)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="入院编号">
            <span>{{elder.checkinNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="房间床位">
            <span>{{elder.roomName}}-{{elder.bedName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <div class="clinic">
      <el-row v-if="advice.present">
        <el-col :span="24">
          <el-form-item label="主诉">
            <span>{{advice.present}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="advice.history">
        <el-col :span="24">
          <el-form-item label="现病史">
            <span>{{advice.history}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="advice.previous">
        <el-col :span="24">
          <el-form-item label="既往史">
            <span>{{advice.previous}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="advice.temperature || advice.remark">
        <el-col :span="24">
          <el-form-item label="体检">
            <span>T{{advice.temperature}}℃ P {{advice.pulseRate}}次/分 R {{advice.respirationRate}}次/分 BP {{advice.pressureHign}}/{{advice.pressureLow}}mmHg</span>
            <p>{{advice.remark}}</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="advice.examination">
        <el-col :span="24">
          <el-form-item label="辅助检查">
            <span>{{advice.examination}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="advice.diagnosis">
        <el-col :span="24">
          <el-form-item label="临床诊断">
            <span>{{advice.diagnosis}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="advice.advise">
        <el-col :span="24">
          <el-form-item label="处理意见">
            <span>{{advice.advise}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="5" offset="19">
        <el-form-item label="诊断医师" style="background:#F8F8F8">
          <span>{{advice.doctorName}}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
export default {
  name: "viewClinic",
  props: {
    advice: {
      type: Object,
      default() {
        return {};
      }
    },
    elder: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      elder: {},
      adviceGroups: {},
      expands: [],
      periods: {
        "1": "长嘱",
        "2": "临嘱"
      }
    };
  },

  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {},
  components: {}
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

.el-input >>> .el-input-group__append,
.el-input >>> .el-input-group__prepend {
  padding-left: 8px;
  padding-right: 8px;
  min-width: 35px;
}

/deep/ .el-table__expand-icon,
.el-table__expand-column >>> .cell {
  /* display: none; */
}
/deep/ .el-table__expanded-cell {
  padding: 0px;
}
/deep/ .el-table__expanded-cell .el-table__header-wrapper {
  display: none;
}

/deep/ .el-table__expanded-cell table {
  border-left: 1px solid #dcdfe6;
}
/deep/ .invalid {
  text-decoration: line-through;
  color: red;
}
/deep/ .single .el-table__expand-icon {
  display: none;
}
/deep/ .single + tr {
  display: none;
}
.clinic {
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>