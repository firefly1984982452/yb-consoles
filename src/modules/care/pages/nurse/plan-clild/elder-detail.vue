<template>
    <div class="ass">
        <el-form label-width="5em">
            <div class="box-card">
                <el-button size="mini" class="back" @click="back">返回</el-button>
                <p class="record_title">
                    <span>{{detail.elderName}}&nbsp;&nbsp;&nbsp;&nbsp;{{detail.gender}}</span> 
                    <span>
                        入住时间 <c style="color:#666">{{detail.checkinDate}}</c>&nbsp;&nbsp;&nbsp;&nbsp;
                        区域 <c style="color:#666">{{detail.area}} {{detail.roomName}}-{{detail.bedName}}</c> 
                        等级 <c style="color:#666"> 护理{{detail.nursingLevel | filterLevel}}级</c>
                    </span>
                </p>
            </div>
            <div class="header">
                <el-button v-for="(item, i) in tabs" :key="i" :class="{ cur: iscur == i }" type="text" @click="(iscur = i), tabChange(item.name)">
                    <span>{{ item.text }}</span>
                </el-button>
            </div>
            <div class="content">
                <component v-bind:is="tabView" :id="id" :elderId="detail.elderId" :roomId="detail.roomId"></component>
            </div>
        </el-form>
    </div>
</template>
<script type="text/javascript">
import pro from "../child/pro"; 
import plan from "../child/plan"; 
import room from "../child/room";
export default {
  name: "NurseProject",
  data() {
    return {
      id:'',
      iscur: 0,
      tabView: "pro",
      tabs: [
        {
          text: "长者服务项目",
          name: "pro"
        },
        {
          text: "长者服务计划",
          name: "plan"
        },
        {
          text: "房间服务项目",
          name: "room"
        }
      ],
      detail:{

      }
    };
  },
  components: { pro, plan,room },
  mounted(){
    this.id = this.$route.query.id;
    this.getDetail();
  },
  methods: {
    back () {
      // this.$router.back()
      // window.opener.location.reload();
      window.opener = null;
      window.close();
    },
    tabChange: function(tab) {
      this.tabView = tab;
    },
    getDetail(){
        let param = {
            itemId:this.id,
            type:1
        } 
        axios.fetch("careServer", "/elderService/nursingProject/elder",param).then(res => {
            if(res.code ==200){
                if(res.data.length > 0 && res.total == 1) {
                    this.detail = res.data[0]
                }
            }
        })
    }
  },
  filters:{
    filterLevel: val => {
        return ['','一','二','三','四','五','六'][val]
    },
  }
};
</script>

<style lang="less" scoped>
.tab {
    height: 100%;
}

.box-card{
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;

}
	.record_title {
       margin-left: 20px;
       display: flex;
       align-items: center;
	}
    .record_title span:nth-child(1){
	   margin-right: 10px;
	   font-size: 18px;
	   font-weight: 500;
	   color: #333333;
	}
	.record_title span:nth-child(2){
	   font-size: 14px;
	   color: #999999;
	}
.header {
    box-sizing: border-box;
    border-bottom: 1px solid #dddddd;
    background-color: #fff;
    padding: 10px 20px;
    margin: 10px 0;
    /deep/ .el-button {
    i {
        color: #409eff;
        font-weight: 700;
    }
  }
  /deep/ .el-button.cur {
    background-color: #5b8ff9ff;
    color: rgba(255, 255, 255, 1);
    i {
        color: #fff;
        font-weight: 700;
    }
  }
}
</style>
