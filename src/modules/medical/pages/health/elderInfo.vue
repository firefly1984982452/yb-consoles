<template>
  <el-form label-width="80px" size="mini" class="static-item">
    <el-row style="margin-bottom: 8px;">
      <el-select
        v-model.trim="selectElderId"
        filterable
        remote
        clearable
        @clear="elders=[]"
        reserve-keyword
        @change="selectElder"
        placeholder="姓名或入院编号"
        :remote-method="queryElder"
      >
        <el-option v-for="item in elders" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-row>
    <el-row class="center" style="margin-left:8px;">
      <el-avatar v-if="elder.photo" :src="elder.photo" :size="60"></el-avatar>
      <el-avatar v-else :size="60" style="font-size: 22px;">{{elder.avatar}}</el-avatar>
      <div class="name">
        <p class="elder">{{elder.name}}</p>
        <p>{{elder.gender}} {{elder.age}}周岁</p>
      </div>
    </el-row>
    <el-row style="margin-top:16px;">
      <el-form-item label="房间床位">
        <span>{{elder.roomName}}-{{elder.bedName}}</span>
      </el-form-item>
      <el-form-item label="护理等级">
        <span>{{elder.nursingLevelName}}</span>
      </el-form-item>
      <el-form-item label="入院日期">
        <span>{{elder.checkinDate}}</span>
      </el-form-item>
      <el-form-item label="入院编号">
        <span>{{elder.checkinNo}}</span>
      </el-form-item>
      <el-form-item label="住院号">
        <span>{{elder.documentNo}}</span>
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
export default {
  name: "elderInfo",
  props: {
    elder: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      elders: [],
      selectElderId: null
    };
  },

  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    queryElder(key) {
      if (key != "") {
        axios
          .fetch(
            "medicalServer",
            "/api/elder/query?searchKey=" + key,
            null,
            null,
            "get"
          )
          .then(res => {
            this.elders = res.data;
          });
      }
    },
    selectElder() {
      if (this.selectElderId) {
        this.$router.push({
          path: "/medical/health/document/detail",
          query: {
            elderId: this.selectElderId
          }
        });
      }
    }
  },
  components: {}
};
</script>
<style scoped>
.static-item .el-form-item,
.static-item .el-form-item--mini.el-form-item,
.static-item .el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
.name {
  display: inline-block;
  vertical-align: top;
  margin-left: 8px;
}
.name p {
  margin: 0px;
  padding: 0px;
  height: 20px;
  font-size: 14px;
  margin-top: 6px;
}
.name .elder {
  font-weight: 700;
  font-size: 16px;
}
</style>