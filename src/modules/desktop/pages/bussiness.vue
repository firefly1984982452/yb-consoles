<template>
  <!-- 业务工作台 -->
  <div class="yz-desktop">
    <div class="top">
      <div class="left">
        <div
          v-for="(item, i) in tabs"
          :key="i"
          :class="{ cur: iscur == i }"
          @click="tabChange(item.name,i)"
        >
          <i :class="`iconfont ${item.icon}`"></i>
          <span>{{ item.text }}</span>
        </div>
      </div>
      <div class="right">
        <span class="date"
          >{{ this.$moment().format("YYYY年MM月DD日") }}&nbsp;星期{{
            week | weekFilter
          }}</span
        >
        <!-- <span>18℃~32℃</span>
        <span></span> -->
      </div>
    </div>
    <div class="content">
      <component v-bind:is="tabView"></component>
    </div>
  </div>
</template>

<script type="text/javascript">
import DaHua from "./leader/dahua-bussiness";
import Elder from "./leader/elder";
import JieSuan from "./leader/jiesuan";
import YuanGong from "./leader/yuangong";
import HuGong from "./leader/hugong";
import ChuangWei from "./leader/chuangwei";
import FangKe from "./leader/fangke";
export default {
  name: "Index2",
  components: {
    DaHua,
    Elder,
    JieSuan,
    YuanGong,
    HuGong,
    ChuangWei,
    FangKe
  },
  filters: {
    weekFilter: function(val) {
      return ["日", "一", "二", "三", "四", "五", "六"][val];
    }
  },
  created() {
    this.week = new Date().getDay();
  },
  data() {
    return {
      tabView: "DaHua",
      iscur: 0,
      week: 0, // 今天是周几
      tabs: [
        {
          text: "首页",
          name: "DaHua",
          icon:'iconcebianlantubiao-ruyuanliyuan'
        },
        {
          text: "入住",
          name: "checkin",
          icon:'iconcebianlantubiao-ruyuanliyuan'
        },
        {
          text: "合同",
          name: "Contract",
          icon:'iconyewugongzuotai-fenye-hetong'
        },
        {
          text: "评估",
          name: "Access",
          icon:'iconyewugongzuotai-fenye-pinggu'
        },
        {
          text: "床位",
          name: "ChuangWei",
          icon:'iconyuanchanggongzuotai-fenye-chuangwei'
        },
        {
          text: "长者",
          name: "Elder",
          icon:'iconyuanchanggongzuotai-fenye-changzhe'
        }
      ],
    };
  },
  mounted(){
  },
  methods: {
    tabChange: function(tab,index) {
      switch (tab) {
        case 'DaHua':
          this.tabView = tab;
          this.iscur = index;
          break;
      
        case 'checkin':
          var routerUrl = this.$router.resolve({path:'/elder/checkin'})
          window.open(routerUrl.href,'_blank');
          break;
      
        case 'Contract':
          var routerUrl = this.$router.resolve({path:'/elder/contract'})
          window.open(routerUrl.href,'_blank');
          break;
      
        case 'Access':
          var routerUrl = this.$router.resolve({path:'/elder/care/assessList'})
          window.open(routerUrl.href,'_blank');
          break;
      
        case 'ChuangWei':
          this.tabView = tab;
          this.iscur = index;
          break;
      
        case 'Elder':
          this.tabView = tab;
          this.iscur = index;
          break;
      
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.yz-desktop {
  position: relative;
  // height: 100%;
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
        width: 80px;
        padding-left: 12px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        border-radius: 4px;
        // background: rgba(0, 0, 0, 0.04);
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
          margin-left: 22px;
        }
      }
      div.cur {
        background-color: #5b8ff9ff;
        color: rgba(255, 255, 255, 1);
      }
    }
    .right {
      line-height: 40px;
      display: flex;
      span:nth-child(3) {
        margin-left: 12px;
        display: inline-block;
        height: 48px;
        width: 40px;
        background: url("../../../assets/images/weather.png") no-repeat 0 0;
        background-size: 100%;
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
