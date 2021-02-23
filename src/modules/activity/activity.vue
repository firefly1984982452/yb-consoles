<template>
  <div class="content">
    <div class="box">
      <div class="header">
        <h2>{{currentType.name}}</h2>
        <span class="sub-title">
          开心养老，丰富老年精神生活，改善身心健康
        </span>
      </div>
      <div class="detail">
        <p>
          开心是一种开启心灵的文化，从理论上诠释了传统文化中的精髓，并将这些理念加以提纯，创立了一系列取材方便、简单易行、老少皆宜的开心体育锻炼法，以提高人们的内在心力，以此来增强人们的耐心和承受力，化解人们心中的烦恼与抱怨，从而实现个人身心灵的积极改良。
        </p>
      </div>
      <div class="projects">
        <h3>活动项目</h3>
        <el-row :gutter="20" class="project-list">
          <el-col :span="8" v-for="item in projects" :key="item.id">
            <div @click="toProject(item.id)" class="project">
              <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>{{item.name}}</span>
                </div>
                <div class="item">
                  <el-row>
                    <el-col :span="8">
                      <el-image style="width:100px; height:100px" :src="item.logo" fit="cover"></el-image>
                    </el-col>
                    <el-col :span="16">
                      {{item.content}}
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "activity",
  data() {
    return {
      currentType: {},
      projects: [],
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
  components: {},
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      let path = this.$router.currentRoute.path;
      let type = path.substring(10);
      for (var i = 0; i < this.types.length; i++) {
        if (this.types[i].id == type) {
          this.currentType = this.types[i];
          break;
        }
      }
      axios
        .fetch("activityServer", "/api/project/list/" + type, null, null, "get")
        .then((res) => {
          this.projects = res.data;
        });
    },
    toProject(val) {
      this.$router.push({
        path: "/activity/1/project",
        query: {
          id: val,
        },
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
  margin: 0px 20px;
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
  padding: 20px;
}
.project {
  cursor: pointer;
}
.project:hover .item {
  color: #000000;
}

.project-list {
  margin-top: 10px;
}
</style>
