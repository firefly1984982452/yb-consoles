<template>
  <div class="yz-desktop">
    <div class="top">
      <div class="left">
        <div
          v-for="(item, i) in tabs"
          :key="i"
          :class="{ cur: iscur == i }"
          @click="tabChange(item.name,i)"
        >
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- <component v-bind:is="tabView"></component> -->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive">
            </router-view>
        </keep-alive>
        
        <router-view v-if="!$route.meta.keepAlive">
            <router-view /> 
        </router-view>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "rules",
  filters: {
  },
  created() {
    let data = window.location.pathname
    switch (data) {
      case "/fire/xunCha/xunChaPlan":
        this.tabView = 'page1';
        this.iscur = 0;
        break;
      case "/fire/xunCha/xunChaWork":
        this.tabView = 'page2';
        this.iscur = 1;
        break;
      default:
        break;
    }
  },
  data() {
    return {
      tabView: "page1",
      iscur: 0,
      tabs: [
        {
          text: "巡更计划",
          name: "page1"
        },
        {
          text: "巡更任务",
          name: "page2"
        },
      ]
    };
  },
  methods: {
    tabChange: function(tab,index) {
        this.iscur = index;
        let url = '/fire/xunCha/';
        switch (tab) {
            case 'page1':
                url += 'xunChaPlan';
                break;
            case 'page2':
                url += 'xunChaWork';
                break;
            default:
                break;
        }
        this.$router.push({path:url})
    }
  }
};
</script>

<style lang="less" scoped>
.yz-desktop {
  position: relative;
  flex:1;
  display: flex;
  flex-direction: column;
  .top {
    position: fixed;
    width: 100%;
    top: 60px;
    z-index: 1;
    padding: 15px 20px 15px 20px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    height: 70px;
    .left {
      display: flex;
      flex: 1;
      div:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
      div {
        box-sizing: border-box;
        cursor: pointer;
        width: 95px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        border-radius: 4px;
        margin-right: 20px;
        position: relative;
        .iconfont {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: inline-block;
          width: 16px;
          line-height: 40px;
        }
        span {
        }
      }
      div.cur {
        background-color: #4687E1;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  .content {
    margin-top: 70px;
    flex: 1;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 12px;
  }
}
</style>
