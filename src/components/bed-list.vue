<template>
<el-card class="box-card" style="position: relative;margin:0 0 20px 0">
    <div slot="header" class="header-box">
        <span>房态图</span>
          <el-select v-model="currentBuilding" placeholder="请选择" @change="getBuildingRoom">
            <el-option
              v-for="item in buildingList"
              :key="item.buildingId"
              :label="item.buildingName"
              :value="item.buildingId">
            </el-option>
          </el-select>
    </div>
    <div class="bed-box">
        <div class="floor" v-for="item in buildingRoomList" :key="item">
            <div class="floor-name-box">
            <p>{{item.floor}}楼</p>
            <span>{{item.freeCount}}/{{item.totalCount}}</span>
            </div>
            <div class="floor-bed-box">
            <el-popover class="bed-box" v-for="room in item.buildingRoomVos" :key="room.roomId"
                placement="right-start"
                :width="room.beds * 135"
                :title="room.roomName + ' 朝'+room.direction"
                trigger="click">
                <div class="bed-detail">
                <div class="info" v-for="people in roomDetailInfo" :key="people">
                    <i v-show="people.status == 1">空</i>
                    <i v-show="people.status == 2" class="order">订</i>
                    <img v-if="people.status == 1" src="../assets/images/icon-bed-null.png" alt="" srcset="">
                    <img v-else-if="people.elderPhoto == '' || people.elderPhoto == null" src="../assets/images/icon-bed-default.png" alt="" srcset="">
                    <img v-else :src="people.elderPhoto" alt="" srcset="">
                    <p v-if="people.status !== 1">{{people.elderName}}</p>
                    <p v-else>空床</p>
                    <span>{{people.bedName}}号床</span>
                </div>
                </div>
                <div slot="reference" @click="detail(room.roomId)" class="bed-info" :class="room.free == 0 ? '' : room.free !== room.beds ? 'null-yellow' :'null-bed'">
                <i v-show="room.reserve>0">订{{room.reserve}}</i>
                <p v-if="room.free == 0">满</p>
                <div v-else><p >空</p><p >{{room.free}}</p></div>
                <span>{{room.roomName}} {{room.roomType.substr(0,1)}} <b v-show="room.free !== 0 && room.free !== room.beds">{{room.gender}}</b></span>
                </div>
            </el-popover>
            </div>
        </div>
    </div>
</el-card>
</template>

<script>
import axios from "axios";
import echarts from "echarts";

export default {
  data() {
    return {
      dataset: {
        source: []
      },
      currentBuilding: '',
      buildingList: [],
      buildingRoomList: [],
      roomDetailInfo: [], //单个房间的详情
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      axios.fetch('oaServer', "/org/building/list", {}).then(res => {
        this.buildingList = res.data;
        this.currentBuilding = this.buildingList[0].buildingId;
        this.$emit('currentBuilding',this.currentBuilding);
        this.getBuildingRoom();
      });
    },
    numberConvertToUppercase(num) {
      num = Number(num);
      var upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
      var length = String(num).length;
      if (length == 1) {
        return upperCaseNumber[num];
      } else if (length == 2) {
        if (num == 10) {
          return upperCaseNumber[num];
        } else if (num > 10 && num < 20) {
          return '十' + upperCaseNumber[String(num).charAt(1)];
        } else {
          return upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '');
        }
      }
    },
    getBuildingRoom () {
      this.$emit('currentBuilding',this.currentBuilding);
      axios.fetch('oaServer', "/org/get/buildingRoom", {buildingId: this.currentBuilding}).then(res => {
        res.data.map(val => {
          val.floor = this.numberConvertToUppercase(val.floor)
        });
        this.buildingRoomList = res.data.reverse();
      });
    },
    detail(id) {
      this.roomDetailInfo = [];
      axios.fetch('oaServer', "/org/get/buildingBed", {roomId: id}).then(res => {
        this.roomDetailInfo = res.data;
        // this.$set(this, 'roomDetailInfo', res.data)
      });
    },
  }
}
</script>

<style scoped>
.chart {
  width:100%; height:30vh;
}
.header-box{
  display: flex;
  justify-content: space-between;
}
.box-card >>> .el-card__header {
	font-size: 18px;
	font-weight: 550;
  border:none!important;
}
.box-card >>> .el-card__body{
  padding: 0!important;
}
</style>
<style lang="less" scoped>
div,p,span{
  box-sizing: border-box;
}
.bed-detail{
  display: flex;
  .info{
    width:120px;
    height:166px;
    background:rgba(250,250,250,1);
    border-radius:5px;
    border:1px solid rgba(240,240,240,1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    margin: 0 16px 0 0;
    padding: 24px 20px;
    position: relative;
    i{
      position: absolute;
      right: 3px;
      top: 1px;
      width:23px;
      height:16px;
      background:#FA8C16;
      border-radius:1px;
      color: #fff;
      font-size:12px;
      line-height:16px;
      font-style: normal;
      text-align: center;
    }
    i.order{
      background: #0078D4;
    }
    img{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-self: center;
    }
    p{
      width:80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      height:24px;
      font-size:16px;
      font-weight:bold;
      color:rgba(0,0,0,0.85);
      line-height:24px;
      margin: 12px 0 0 0;
    }
    span{
      width:auto;
      text-align: center;
      height:22px;
      font-size:16px;
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height:22px;
      display: flex;
      align-self: center;
    }
  }
}
.bed-box{
  display: flex;
  flex-direction: column;
  .floor{
    display: flex;
    .floor-name-box{
      width:126px;
      min-height:88px;
      height:auto;
      background:rgba(255,255,255,1);
      border:1px solid rgba(220,223,230,1);
      border-right: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p{
        width:50px;
        text-align: center;
        height:33px;
        font-size:24px;
        font-weight:500;
        color:rgba(0,0,0,0.85);
        line-height:33px;
      }
      span{
        width:50px;
        height:20px;
        text-align: center;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        line-height:20px;
      }
    }
    .floor-bed-box{
      width: 1750px;
      display: flex;
      flex-wrap: wrap;
      .bed-box{
        .bed-info{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width:124.85px;
          height:88px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(238,238,238,1);
          position: relative;
          i{
            position: absolute;
            right: 3px;
            top: 1px;
            width:23px;
            height:16px;
            background:rgba(0,120,212,1);
            border-radius:1px;
            color: #fff;
            font-size:12px;
            line-height:16px;
            font-style: normal;
            text-align: center;
          }
          div{
            display: flex;
          }
          p{
            width:18px;
            height:24px;
            font-size:18px;
            font-weight:bold;
            color:rgba(0,0,0,0.65);
            line-height:24px;
          }
          span{
            width:auto;
            height:20px;
            font-size:14px;
            font-weight:400;
            color:rgba(0,0,0,0.65);
            line-height:20px;
            b{
              font-weight: normal;
            }
          }
        }
        .null-bed {
          background: #FFDBD7;
          p{
            color: #FF3333;
          }
        }
        .null-yellow {
          background: #FFE1B2;
          p{
            color: #FF910E;
          }

        }
      }
    }
  }
}
</style>