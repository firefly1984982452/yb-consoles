<template>
  <div class="case_index">
    <div class="left">
      <div class="header">
        <span>​选择就诊人</span>
      </div>
      <div class="content">
        <Elders @selectPeople="selectPeople"></Elders>
      </div>
    </div>
    <div v-if="elder.id" class="case_right">
      <div class="header">
        <div class="header-left">
          <el-avatar shape="circle" :size="60" fit="contain" :src="elder.photo?elder.photo:require('@/assets/images/icon-bed-default.png')"></el-avatar>
          <div class="info">
            <p>
              <span><b>{{elder.name}}</b></span>&nbsp;&nbsp;
              <span>{{elder.gender}}</span>&nbsp;&nbsp;
              <span>{{elder.age}}周岁</span>
            </p>
            <p>
              <i class="iconfont iconcebianlantubiao-chuangweiguanli">&nbsp;&nbsp;</i>{{elder.roomName}}-{{elder.bedName}}&nbsp;&nbsp;&nbsp;&nbsp;
              <i class="iconfont iconcebianlantubiao-zhihuihuli"></i>&nbsp;&nbsp;{{elder.nursingLevelName}}
            </p>
          </div>
        </div>
        <ul class="header-right">
          <li v-for="(tab,index) in tabs" :class="{'cur':iscur === index }" :key="index" @click="tabChange(tab,index)">
            <i :class="`iconfont ${tab.icon}`">{{tab.name}}</i>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="content_header">
          <i :class="`iconfont ${tabs[this.iscur].icon}`">{{tabs[this.iscur].name}}</i>
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="toAdd">新开</el-button>
            <el-button type="success" icon="el-icon-refresh" @click="refreshData">刷新数据</el-button>
          </div>
        </div>
        <div class="content_table">
          <Prescription ref="prescription" v-if="iscur===1" :elder="elder"></Prescription>
        </div>
      </div>
    </div>
    <div v-else class="case_right">
      <span>暂无数据，请选择就诊人!</span>
    </div>

  </div>
</template>

<script type="text/javascript">
import Elders from "./components/elders";
import Prescription from "./clinic-prescription";
export default {
  name: "CaseIndex",
  data() {
    return {
      elder: {},
      iscur: 1,
      tabs: [
        {
          icon: "icontubiaozuocedaohangtubiaozhihuiyihujiankangdangan",
          name: "医嘱管理",
        },
        {
          icon: "iconchufang",
          name: "病历处方",
        },
        {
          icon: "iconzhinengyihu-mobanzidian-bingshixiangmuzidian",
          name: "病程记录",
        },
      ],
      tenantName: "",
    };
  },
  components: {
    Elders,
    Prescription,
  },
  created() {
    axios
      .fetch("medicalServer", "/api/base/tenant-name", null, null, "get")
      .then((res) => {
        this.tenantName = res.data;
      });
  },
  beforeRouteEnter(to, from, next) {
    if (from.query.elderId) {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    console.log(this.$route.meta.isBack);
    if (!this.$route.meta.isBack) {
      // this.reset();
    } else {
      if (this.$refs.prescription) {
        this.$refs.prescription.initData();
      }
    }
    this.$route.meta.isBack = false;
  },
  methods: {
    /**右上角切换 */
    tabChange(item, index) {
      this.iscur = index;
    },
    selectPeople(data) {
      this.elder = data;
    },
    refreshData(){
      this.$refs.prescription.currentPage = 1;
      this.$refs.prescription.pageIndex = 1;
      this.$refs.prescription.initData();
    },
    toAdd() {
      this.$router.push({
        path: "case-detail",
        query: {
          tenantName: this.tenantName,
          elderId: this.elder.id,
          sign: "add",
          // elderName:this.elder.name,
          // gender:this.elder.gender,
          // age:this.elder.age,
          // checkinNo:this.elder.checkinNo,
          // roomName:this.elder.roomName,
          // bedName:this.elder.bedName,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.case_index {
  height: 100%;
  display: flex;
  .left {
    border-radius: 5px;
    background-color: #fff;
    width: 360px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      height: 44px;
      line-height: 44px;
      padding-left: 10px;
      font-size: 18px;
      font-weight: 500;
      border-bottom: 1px solid #ccc;
    }
    .content {
      padding: 5px;
      flex: 1;
    }
  }
  .case_right {
    border-radius: 5px;
    padding: 12px;
    background-color: #fff;
    flex: 1;
    margin-left: 12px;
    text-align: center;
    position: relative;
    .header {
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      .header-left {
        display: flex;
        width: 50%;
        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 12px;
          > p {
            text-align: left;
            line-height: 26px;
            > span {
              font-size: 17px;
              margin-left: 8px;
            }
            i {
              color: #ccc;
              margin-left: 8px;
            }
          }
        }
      }
      .header-right {
        display: flex;
        width: 50%;
        justify-content: flex-end;
        box-sizing: border-box;
        height: 60px;
        padding: 10px 0;
        li {
          cursor: pointer;
          height: 100%;
          height: 40px;
          line-height: 40px;
        }
        li:nth-child(1)::after,
        li:nth-child(2)::after {
          content: " ";
          border-left: 1px solid #ccc;
          margin-left: 10px;
        }
        li + li {
          margin-left: 10px;
        }
        li.cur {
          color: #3e8ef7;
          border-bottom: 4px solid #3e8ef7;
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      .content_header {
        line-height: 44px;
        padding: 8px 0;
        height: 44px;
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        font-weight: 600;
        color: black;
        .el-button {
          height: 36px;
        }
      }
    }
    > span {
      position: absolute;
      top: 50%;
      transform: translate(-50%, 0);
    }
  }
}
</style>
