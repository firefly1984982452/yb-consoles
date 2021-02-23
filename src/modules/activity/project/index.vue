<template>
  <div class="content">
    <el-page-header @back="goBack" content="">
    </el-page-header>
    <div class="box">
      <div class="header">
        <h2>{{project.name}}</h2>
        <span class="sub-title">
          {{project.content}}
        </span>
      </div>
      <div class="detail">
        <el-tabs tab-position="left" style="min-height:500px;" v-model="activeName">
          <el-tab-pane label="参与记录" name="tab1">
            <session :project="project" v-if="project.id && activeName=='tab1' "></session>
          </el-tab-pane>
          <el-tab-pane label="统计排行" name="tab2">
            <sum :projectId="project.id" v-if="project.id && activeName=='tab2'"></sum>
          </el-tab-pane>
          <el-tab-pane label="活动说明" name="tab3">
            <description :project="project" v-if="project.id"></description>
          </el-tab-pane>
          <el-tab-pane label="活动配置" name="tab4">
            <config :projectId="project.id" v-if="project.id && activeName=='tab4'"></config>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import config from "./config";
import session from "./session";
import sum from "./sum";
import description from "./description";

export default {
  name: "activity",
  data() {
    return {
      id: null,
      activeName: "tab1",
      project: {},
      types: [
        {
          id: 1,
          name: "开心锻炼",
        },
        {
          id: 2,
          name: "书画琴乐",
        },
        {
          id: 3,
          name: "快乐棋牌",
        },
      ],
    };
  },
  watch: {
    $route: "init",
  },
  components: { config, session, sum, description },
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.id = this.$route.query.id;
      axios
        .fetch("activityServer", "/api/project/" + this.id, null, null, "get")
        .then((res) => {
          this.project = res.data;
        });
    },
    goBack() {
      this.$router.push({
        path: "/activity/" + this.project.type,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.header h2 {
  display: inline-block;
}

.header .sub-title {
  margin-right: 10px;
  font-size: 12px;
  color: #a6b2bd;
}
.detail p {
  font-size: 14px;
  color: #76838f;
  line-height: 22px;
  margin: 0px 30px;
  padding: 10px;
  background-color: #f5f5f5;
}
.header {
  box-sizing: border-box;
  border-bottom: 1px solid #dddddd;
  background-color: #fff;
  padding: 10px 20px;
  margin: 10px 0;
}
.projects {
  margin-left: 20px;
  margin-top: 20px;
}
.projects .box-card {
  width: 30%;
  display: inline-block;
  margin: 8px;
}
.projects .item {
  font-size: 14px;
  color: #76838f;
  line-height: 20px;
}
/deep/ .el-tabs__nav-scroll {
  height: 400px;
}
</style>
