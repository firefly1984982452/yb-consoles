<template>
  <div class="yz-desktop">
    <div class="top">
      <div class="left">
        <div
          v-for="(item, i) in tabs"
          :key="i"
          :class="{ cur: iscur == i }"
          @click="(iscur = i), tabChange(item.name)"
        >
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <component v-bind:is="tabView"></component>
    </div>
  </div>
</template>

<script type="text/javascript">
import page1 from "./com-page/page3";
import page2 from "./com-page/page2";
import page3 from "./com-page/page3";
import page4 from "./com-page/page4";
export default {
  name: "rules",
  components:{page1,page2,page3,page4},
  filters: {
  },
  created() {
  },
  data() {
    return {
      tabView: "page1",
      iscur: 0,
      tabs: [
        {
          text: "查房路线",
          name: "page1"
        },
        {
          text: "查房班次",
          name: "page2"
        },
        {
          text: "查房排班",
          name: "page3"
        },
        {
          text: "通用规则",
          name: "page4"
        }
      ]
    };
  },
  methods: {
    tabChange: function(tab) {
      this.tabView = tab;
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
    padding: 12px 12px 0 12px;
  }
}
</style>
