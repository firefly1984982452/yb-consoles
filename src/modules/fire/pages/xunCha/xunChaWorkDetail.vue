<template>
  <div class="app-container createOuts" id="createOut">
    <el-row :gutter="0" style="margin-bottom: 2rem;">
      <!--//:rules="rules"-->

      <el-col :span="24" style="width: 93.7%;margin-left: 3%;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="2" class="backBtns">
                <el-button @click="backList()">返回</el-button>
              </el-col>
              <el-col :xl="5" :lg="6">
                <span>巡查任务详情</span>
              </el-col>
            </el-row>
          </div>

          <div id="familyData" v-if="this.scheduleType==1">
            <el-row :gutter="20">
              <el-row>
                <h1 style="float: left;">设备巡更:{{scheduleName1}}</h1>
                <p v-if="status==0" class="xunChaState bgccolrgry">未开始</p>
                <p v-if="status==1" class="xunChaState bgccolrblu">进行中</p>
                <p v-if="status==2" class="xunChaState bgccolrgre">已完成</p>
                <p v-if="status==3" class="xunChaState bgccolrpur">已核查</p>
                <p v-if="status==4" class="xunChaState bgccolrpin">已过期</p>
              </el-row>
              <el-row>
                <p class="xunChaPeoople">
                  <span v-if="durationType==0">{{interval}}次 / 小时 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==1">{{interval}}次 / 天 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==2">{{interval}}次 / 周 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==3">{{interval}}次 / 月 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==4">{{interval}}次 / 季 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==5">{{interval}}次 / 年 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==6">{{interval}}次 / 双周 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==7">{{interval}}次 / 半个月 | 巡查人员 : {{handlerName}}</span>
                </p>
              </el-row>

              <el-row>
                <div v-for="(item,index) in equipmentArr" :key="index">
                  <div class="sbitembox">
                    <div class="xhbox">
                      <p class="sbsy">{{index+1}}</p>
                    </div>
                    <div class="imgbox">
                      <img
                        v-if="item.deviceImg==''"
                        class="image"
                        src="../../../../assets/images/equipment.png"
                      />
                      <img v-if="item.deviceImg!=''" class="image" :src="item.deviceImg" />
                    </div>
                    <div class="discrbox">
                      <p class="equipmentTitle">{{item.deviceName}}</p>
                      <p class="bianHao">设备编号&nbsp;&nbsp;{{item.uid}}</p>
                      <p
                        class="bianHao"
                        v-if="item.children.length>0"
                      >设备数量&nbsp;&nbsp;{{item.children.length}}个</p>
                      <p class="bianHao">
                        设备位置&nbsp;
                        <span
                          v-if="item.floorName"
                        >{{item.floorName}}楼{{item.install}}</span>
                      </p>
                      <div v-show="item.positionStatus==2" class="reasonBox">
                        <div class="reasonBox1">
                          <p style="color: #666;" class="pmargin">
                            现场回报:
                            <span style="color: #000;">{{item.checkInfo}}</span>
                          </p>
                          <p style="color: #666;">
                            处理方式:
                            <span style="color: #000;">{{item.handleWay}}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="ztbox">
                      <p v-show="item.positionStatus==0" class="stateText stateColor1">未查</p>
                      <p v-show="item.positionStatus==1" class="stateText stateColor2">已查</p>
                      <p v-show="item.positionStatus==2" class="stateText stateColor3">故障</p>
                      <p class="timeStyle" v-if="item.positionStatus!=0">{{item.checkTime}}</p>
                    </div>
                    <div class="sbzkbox" @click="sbzk(index)">
                      <span v-bind:class="{'sbzk':true, 'jjs':item.sbzk==false}"  v-if="item.children.length!=0">
                        <i class="iconfont iconjichutubiao-yuanxingjiantouxiangshang"></i>&nbsp;
                      </span>
                    </div>
                  </div>

                  <el-row>
                    <div v-if="item.sbzk==true">
                      <div class="sbchilren" v-for="(item2,index2) in item.children" :key="index2">
                        <el-row>
                          <div class="sbitembox">
                            <div class="xhbox">
                              <p class="sbsy">&nbsp;</p>
                            </div>
                            <div class="imgbox">
                              <img
                                v-if="item2.deviceImg==''"
                                class="image"
                                src="../../../../assets/images/equipment.png"
                              />
                              <img
                                v-if="item2.deviceImg!=''"
                                class="image"
                                :src="ossUrl+item2.deviceImg"
                              />
                            </div>
                            <div class="discrbox">
                              <p class="equipmentTitle">{{item2.deviceName}}</p>
                              <p class="bianHao">设备编号&nbsp;&nbsp;{{item2.uid}}</p>
                              <p class="bianHao">
                                设备位置&nbsp;
                                <span
                                  v-if="item2.floorName"
                                >{{item2.floorName}}楼{{item2.install}}</span>
                              </p>
                              <div v-show="item2.positionStatus==2" class="reasonBox">
                                <div class="reasonBox1">
                                  <p style="color: #666;" class="pmargin">
                                    现场回报:
                                    <span style="color: #000;">{{item2.checkInfo}}</span>
                                  </p>
                                  <p style="color: #666;">
                                    处理方式:
                                    <span style="color: #000;">{{item2.handleWay}}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="ztbox">
                              <p v-show="item2.positionStatus==0" class="stateText stateColor1">未查</p>
                              <p v-show="item2.positionStatus==1" class="stateText stateColor2">已查</p>
                              <p v-show="item2.positionStatus==2" class="stateText stateColor3">故障</p>
                              <p
                                class="timeStyle"
                                v-if="item2.positionStatus!=0"
                              >{{item2.checkTime}}</p>
                            </div>
                            <div class="sbzkbox">
                              <span>&nbsp;</span>
                            </div>
                          </div>
                        </el-row>
                      </div>
                    </div>
                  </el-row>
                </div>
              </el-row>
            </el-row>
          </div>

          <div id="familyData" v-if="this.scheduleType==2">
            <el-row :gutter="20">
              <el-row>
                <h2 style="float: left;">楼层巡更:{{scheduleName}}</h2>
                <p v-if="status==0" class="xunChaState bgccolrgry">未开始</p>
                <p v-if="status==1" class="xunChaState bgccolrblu">进行中</p>
                <p v-if="status==2" class="xunChaState bgccolrgre">已完成</p>
                <p v-if="status==3" class="xunChaState bgccolrpur">已核查</p>
                <p v-if="status==4" class="xunChaState bgccolrpin">已过期</p>
              </el-row>
              <el-row>
                <p class="xunChaPeoople">
                  <span v-if="durationType==0">{{interval}}次 / 小时 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==1">{{interval}}次 / 天 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==2">{{interval}}次 / 周 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==3">{{interval}}次 / 月 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==4">{{interval}}次 / 季 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==5">{{interval}}次 / 年 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==6">{{interval}}次 / 双周 | 巡查人员 : {{handlerName}}</span>
                  <span v-if="durationType==7">{{interval}}次 / 半个月 | 巡查人员 : {{handlerName}}</span>
                </p>
              </el-row>
              <el-row>
                <el-col style="background: rgb(255, 255, 255);border-radius: 4px;">
                  <el-table
                    ref="multipleTable"
                    tooltip-effect="dark"
                    :data="finallyData"
                    border
                    style="width:50%!important;left:0!important;transform: translateX(0%) !important;"
                    :cell-style="{padding: '5px 0'}"
                  >
                    <el-table-column label="序号" width="60" type="index"></el-table-column>
                    <el-table-column label="巡查内容" min-width="100">
                      <template slot-scope="scope">
                        <p style="text-align:left">{{scope.row.contentInfo | nothingFilter}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="巡查情况" width="140">
                      <template slot-scope="scope">
                        <span v-if="scope.row.contentStatus==0" style="color:#666666">未开始</span>
                        <span v-if="scope.row.contentStatus==1" style="color:#2FC07A">正常</span>
                        <span v-if="scope.row.contentStatus==2" style="color:#F6812B">异常</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <el-pagination @current-change="handleCurrentChange" :current-page="currentPage3" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
                  </el-pagination>-->
                </el-col>
              </el-row>
              <el-row style="margin:10px 0">
                <h2 style="float: left;">点位巡查情况</h2>
              </el-row>
              <el-row>
                <el-col style="background: rgb(255, 255, 255);border-radius: 4px;">
                  <el-table
                    ref="multipleTable"
                    tooltip-effect="dark"
                    :data="tableDataDianWei"
                    border
                    style="width:70%!important;left:0!important;transform: translateX(0%) !important;"
                    :cell-style="{padding: '5px 0'}"
                  >
                    <el-table-column label="序号" width="60" type="index"></el-table-column>
                    <el-table-column label="巡查位置" min-width="100">
                      <template slot-scope="scope">{{scope.row.floorName}}-{{scope.row.roomName}}</template>
                    </el-table-column>
                    <el-table-column label="是否巡查">
                      <template slot-scope="scope">
                        <span v-if="scope.row.positionStatus==0">未查</span>
                        <span style="color:#2FC07A" v-if="scope.row.positionStatus==1">已查</span>
                        <span style="color:#2FC07A" v-if="scope.row.positionStatus==2">已查</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="巡查时间" min-width="150">
                      <template slot-scope="scope">{{scope.row.checkTime}}</template>
                    </el-table-column>
                    <el-table-column label="巡查情况">
                      <template slot-scope="scope">
                        <div v-if="scope.row.positionStatus==1||scope.row.positionStatus==2">
                          <p
                            style="text-align:center"
                            v-for="(item,index) in scope.row.patrolTaskContent"
                            :key="index"
                            v-show="index==0"
                          >
                            <span v-if="item.contentStatus==0" style="color:#666666">未处理</span>
                            <span v-if="item.contentStatus==1" style="color:#2FC07A">正常</span>
                            <span v-if="item.contentStatus==2" style="color:#EB6969">异常</span>
                          </p>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="异常巡查内容" min-width="200">
                      <template slot-scope="scope">
                        <div v-if="scope.row.positionStatus==1||scope.row.positionStatus==2">
                          <p
                            style="text-align:left"
                            v-for="(item,index) in scope.row.patrolTaskContent"
                            :key="index"
                            v-if="item.contentStatus==2"
                          >{{item.contentInfo}}</p>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="问题描述" width="140">
                      <template slot-scope="scope">
                        <div v-if="scope.row.positionStatus==1||scope.row.positionStatus==2">
                          <p
                            v-for="(item,index) in scope.row.patrolTaskContent"
                            :key="index"
                            v-if="item.contentStatus==2"
                          >{{item.checkInfo}}</p>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="处理情况" min-width="100">
                      <template slot-scope="scope">
                        <div v-if="scope.row.positionStatus==1||scope.row.positionStatus==2">
                          <p
                            v-for="(item,index) in scope.row.patrolTaskContent"
                            :key="index"
                            v-if="item.contentStatus==2"
                          >{{item.handleWay}}</p>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <el-pagination @current-change="handleCurrentChange" :current-page="currentPage3" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
                  </el-pagination>-->
                </el-col>
              </el-row>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      scheduleName1: "",
      shebeiArray: [],
      handlerName: "",
      durationType: "",
      equipmentArr: [],
      data1: {},
      tableDataAll: [],
      tableDataDianWei: [],
      scheduleType: "",
      status: "",
      finallyData: [] //第一个表格的最终数组
    };
  },
  created() {
    this.scheduleType = this.$route.query.scheduleType;

    let data = {
      taskId: this.$route.query.taskId
    };
    axios.fetch("fireServer", "/patrol/task//device/detail", data).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.data1 = res.data.patrolTaskData;
          this.status = res.data.patrolTaskData.status;
          if (res.data.patrolTaskData.patrolScheduleData) {
            if (res.data.patrolTaskData.patrolScheduleData.durationType) {
              this.durationType =
                res.data.patrolTaskData.patrolScheduleData.durationType;
            }
          }
          if (res.data.patrolTaskData.patrolScheduleData) {
            if (res.data.patrolTaskData.patrolScheduleData.interval) {
              this.interval =
                res.data.patrolTaskData.patrolScheduleData.interval;
            }
          }
          if (res.data.patrolTaskData.patrolScheduleData) {
            if (res.data.patrolTaskData.patrolScheduleData.handlerName) {
              this.handlerName =
                res.data.patrolTaskData.patrolScheduleData.handlerName;
            }
            if (res.data.patrolTaskData.patrolScheduleData.scheduleName) {
              this.scheduleName1 =
                res.data.patrolTaskData.patrolScheduleData.scheduleName;
            }
          }

          this.shebeiArray = res.data;
          // this.equipmentArr = res.data.patrolTaskPositions;

          let tempary = res.data.patrolTaskPositions;
          let fjdarray = [];
          let zjdarray = [];
          for (var i = 0; i < tempary.length; i++) {
            if (tempary[i].groupId == tempary[i].deviceId) {
              tempary[i].node = "fjd";
              tempary[i].children = [];
              tempary[i].sbzk = false;
              fjdarray.push(tempary[i]);
            } else {
              tempary[i].node = "zjd";
              zjdarray.push(tempary[i]);
            }
          }
          for (var m = 0; m < fjdarray.length; m++) {
            for (var n = 0; n < zjdarray.length; n++) {
              if (fjdarray[m].groupId == zjdarray[n].groupId) {
                fjdarray[m].children.push(zjdarray[n]);
              }
            }
          }
          this.equipmentArr = fjdarray;
          console.log(this.equipmentArr);
          // this.equipmentArr = res.data.patrolTaskPositions.map(v => {
          //   return {
          //     deviceName: v.deviceName,
          //     install: v.install,
          //     uid: v.uid,
          //     floorName:v.floorName,
          //     positionStatus: v.positionStatus,
          //     checkTime: this.data1.checkTime,
          //     checkInfo: v.checkInfo
          //   };
          // });
        } else if (res.code == "401") {
          this.$message({
            message: res.message,
            type: "warning"
          });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => {
        this.loading = false;
      });
    axios.fetch("fireServer", "/patrol/task/check/all", data).then(res => {
        this.loading = false;
        if (res.code == 200) {
          //把相同任务筛选出来组成二维数组
          var map = {},
            dest = [];
          for (var i = 0; i < res.data.length; i++) {
            var ai = res.data[i];
            if (!map[ai.contentInfo]) {
              dest.push({
                contentInfo: ai.contentInfo,
                contentStatus: ai.contentStatus,
                data: [ai]
              });
              map[ai.contentInfo] = ai;
            } else {
              for (var j = 0; j < dest.length; j++) {
                var dj = dest[j];
                if (dj.contentInfo == ai.contentInfo) {
                  dj.data.push(ai);
                  break;
                }
              }
            }
          }
          //排序处理完之后的
          let arrData = dest.map(v => v.data);
          //		 console.log(arrData)
          function compare(property) {
            return function(a, b) {
              var value1 = a[property];
              var value2 = b[property];
              return value1 - value2;
            };
          }
          for (var i = 0; i < arrData.length; i++) {
            for (var j = 0; j < arrData[i].length; j++) {
              arrData[i].sort(compare("contentStatus"));
            }
          }
          for (var i = 0; i < arrData.length; i++) {
            this.finallyData.push(arrData[i][arrData[0].length - 1]);
          }
          //		console.log(finallyData)
        } else if (res.code == "401") {
          this.$message({
            message: res.message,
            type: "warning"
          });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => {
        this.loading = false;
      });
    axios.fetch("fireServer", "/patrol/task/get/detail", data).then(res => {
        this.loading = false;
        if (res.code == 200) {
          // debugger
          let that = this;
          // debugger
          // for(var i=0;i<res.data.length;i++){
          // 	for(var j=0;j<res.data[i]['patrolTaskContent'].length;j++)
          // 	if(j>0){
          // 		res.data[i]['patrolTaskContent'][j]['contentStatus'] = 3";
          // 	}
          // }
          //

          that.tableDataDianWei = res.data;

          console.log(res.data);

          function compare(property) {
            return function(a, b) {
              var value1 = a[property];
              var value2 = b[property];
              return value1 - value2;
            };
          }

          for (var i = 0; i < that.tableDataDianWei.length; i++) {
            for (
              var j = 0;
              j < that.tableDataDianWei[i].patrolTaskContent.length;
              j++
            ) {
              that.tableDataDianWei[i].patrolTaskContent.sort(
                compare("contentStatus")
              );
            }
          }
          console.log(that.tableDataDianWei);
          for (var i = 0; i < that.tableDataDianWei.length; i++) {
            var data3 = [];
            that.tableDataDianWei[i].patrolTaskContent.map((v, j) => {
              if (j == 0 && v.contentStatus == 1) {
                that.tableDataDianWei[i].patrolTaskContent = [].concat(v);
              } else if (v.contentStatus == 2) {
                data3.push(v);
              }
            });
            if (data3.length > 0) {
              that.tableDataDianWei[i].patrolTaskContent = [].concat(data3);
            }
          }
          console.log(this.tableDataDianWei);
        } else if (res.code == "401") {
          this.$message({
            message: res.message,
            type: "warning"
          });
          this.$router.push("/login");
        } else {
          this.$message.error(res.message);
        }
      })
      .catch(err => {
        this.loading = false;
      });
    // this.$nextTick(function() {
    // 	this.qrcode();
    // })
  },

  methods: {
    backList() {
      this.$router.back(-1);
    },
    sbzk(index) {
      this.equipmentArr[index].sbzk = !this.equipmentArr[index].sbzk;
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
  margin-left: 10px;
}
.xunChaState {
  float: left;
  font-size: 14px;
  width: 60px;
  height: 24px;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  line-height: 24px;
  margin-left: 15px;
}
.xunChaPeoople {
  margin-left: 10px;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #999;
}

.sbitembox {
  background: rgba(255, 255, 255, 1);
  width: 95%;
  padding: 10px 20px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
}
.xhbox {
  flex: 1;
}
.imgbox {
  flex: 1;
}
.discrbox {
  flex:6;
}
.ztbox{
flex: 7;
}
.sbzkbox{
flex: 7;
}
.sbsy {
  width: 62px;
  text-align: center;
  line-height: 62px;
  font-size: 30px;
  color: rgba(51, 51, 51, 1);
  font-weight: 600;
}
.rowIndex {
  width: 40px;
  height: 40px;
  float: left;
  font-size: 30px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  line-height: 40px;
  text-align: center;
  margin: 19px 18px;
}
.image {
  width: 60px;
  height: 60px;
}

.equipmentTitle {
  width: 150px;
  height: 22px;
  font-size: 16px;
  font-weight: bolder;
  color: rgba(34, 34, 34, 1);
  line-height: 22px;
  margin-bottom: 5px;
}
.bianHao {
  width: 175px;
  margin-top: 2px;
  font-size: 12px;
  color: #999;
}
.stateBox {
  height: 44px;
  width: 140px;
  /*background: red;*/
  margin: 18px 20px;
  float: left;
  left: 50%;
}
.timeStyle {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
.stateText {
  margin-bottom: 5px;
  font-size: 16px;
}
.stateColor1 {
  color: #f6812b;
}
.stateColor2 {
  color: #2fc07a;
}
.stateColor3 {
  color: #eb6969;
}
.reasonBox {
  width: 420px;
  height: 56px;
  background: rgba(248, 248, 248, 1);
  margin-top: 10px;
}
.reasonBox1 {
  width: 420px;
  font-size: 14px;
  height: 40px;
  margin: 7px auto;
}
.pmargin {
  padding-top: 7px;
}
.sbzkbox {
  padding-top: 20px;
}
.sbzk {
  width: 18px;
  height: 18px;
}
.jjs {
  width: 14px;
  display: inline-block;
  transform: rotate(180deg);
  transition: all 0.3s linear;
}
.bgccolrgry {
  background: rgba(102, 102, 102, 1);
}
.bgccolrblu {
  background: rgba(0, 120, 212, 1);
}
.bgccolrgre {
  background: rgba(47, 192, 122, 1);
}
.bgccolrpur {
  background: rgba(138, 48, 198, 1);
}
.bgccolrpin {
  background: rgba(235, 105, 105, 1);
}
</style>