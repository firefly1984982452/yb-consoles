
<template>
  <div id="erweimabox">
    <el-card>
      <div class="ewtit">生成二维码</div>
      <div v-if="scheduleType==1" class="ewtablebox">
        <P class="p1">设备巡更:{{form1.scheduleName}}</P>
        <p
          class="p2"
        >设备巡查&nbsp;|&nbsp;{{form1.interval}}次/{{form1.durationType|duration}}&nbsp;|&nbsp;{{form1.startDate|substr}}至{{form1.endDate|substr}}&nbsp;|&nbsp;巡查主点位{{form1.positionCount}}个，设备总个数{{sbdwnum}}个</p>
        <table id="dwtable">
          <tr class="thead">
            <td class="dwck">
              <el-button size="mini" class="lookta" @click="checkall">
                <i
                  class="iconfont iconbiaodanxuanzekuangfuxuankuangxuanzhong"
                  v-if="sbcheckall"
                  style="color:#3F51B5"
                ></i>
                <i class="iconfont iconbiaodanxuanzekuangfuxuankuangchangtai" v-if="!sbcheckall"></i>
              </el-button>
            </td>
            <td class="thxh">序号</td>
            <td>名称</td>
            <td>编号</td>
            <td>位置</td>
          </tr>
          <tbody v-for="(item,index) in addTableData" :key="index">
            <tr>
              <td class="dwck">
                <el-button size="mini" class="lookta" @click="fjdcheck(index)">
                  <i
                    class="iconfont iconbiaodanxuanzekuangfuxuankuangxuanzhong"
                    v-if="item.check"
                    style="color:#3F51B5"
                  ></i>
                  <i class="iconfont iconbiaodanxuanzekuangfuxuankuangchangtai" v-if="!item.check"></i>
                </el-button>
              </td>
              <td class="dwxh">{{index+1}}</td>
              <td>
                <div class="dwmc">
                  <!-- <span :class="{'dwxlic':true,'dwzk':item.zjdzk!==false}" @click="dwzk(index)">
                    <i
                      class="iconfont iconjichutubiao-xiangyoujiantou"
                      v-if="item.children.length!=0"
                    ></i>
                  </span> -->
                  {{item.equipmentName | nothingFilter}}
                </div>
              </td>
              <td>
                <div class="dwbh">{{item.deviceNo | nothingFilter}}</div>
              </td>
              <td>
                <div class="dwwz">
                  {{item.buildingName}}{{item.floorName}}
                  <span v-if="item.floorName">楼</span>
                  {{item.installPosition}}
                </div>
              </td>
            </tr>
            <!-- 子节点部分 -->
            <!-- <tr
              v-if="item.zjdzk==true"
              v-for="(item2,index2) in item.children"
              :key="index2"
              id="dwchild">
              <td class="dwxh">
                <el-button size="mini" class="lookta" @click="zjdcheck(index,index2)">
                  <i
                    class="iconfont iconbiaodanxuanzekuangfuxuankuangxuanzhong"
                    v-if="item2.check"
                    style="color:#3F51B5"
                  ></i>
                  <i class="iconfont iconbiaodanxuanzekuangfuxuankuangchangtai" v-if="!item2.check"></i>
                </el-button>
              </td>
              <td class="dwxh"></td>
              <td>
                <div class="dwmc">
                  <span class="dwxlic"></span>
                  {{item2.equipmentName}}
                </div>
              </td>
              <td>
                <div class="dwbh">{{item2.deviceNo}}</div>
              </td>
              <td>
                <div class="dwwz">
                  {{item2.buildingName}}{{item2.floorName}}
                  <span v-if="item2.floorName">楼</span>
                  {{item2.installPosition}}
                </div>
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <div v-if="scheduleType==2" class="ewtablebox">
        <P class="p1">楼层巡更:{{scheduleName2}}</P>
        <p
          class="p2"
        >楼层巡查&nbsp;|&nbsp;{{form2.interval}}次/{{form2.durationType|duration}}&nbsp;|&nbsp;{{form2.startDate|substr}}至{{form2.endDate|substr}}&nbsp;|&nbsp;巡查点位{{form2.positionCount}}个</p>
        <table id="dwtable">
          <tr class="thead">
            <td class="dwck">
              <el-button size="mini" class="lookta" @click="checkall2" style="color:#3F51B5">
                <i class="iconfont iconbiaodanxuanzekuangfuxuankuangxuanzhong" v-if="lccheckall"></i>
                <i class="iconfont iconbiaodanxuanzekuangfuxuankuangchangtai" v-if="!lccheckall"></i>
              </el-button>
            </td>
            <td class="thxh">序号</td>
            <td>点位名称</td>
          </tr>
          <tbody v-for="(item,index) in addTableData2" :key="index">
            <tr>
              <td class="dwck">
                <el-button size="mini" class="lookta" @click="lccheck(index)">
                  <i
                    class="iconfont iconbiaodanxuanzekuangfuxuankuangxuanzhong"
                    v-if="item.check"
                    style="color:#3F51B5"
                  ></i>
                  <i class="iconfont iconbiaodanxuanzekuangfuxuankuangchangtai" v-if="!item.check"></i>
                </el-button>
              </td>
              <td class="dwxh">{{index+1}}</td>

              <td>
                <div class="dwwz">
                  {{item.buildingName}}{{item.floorName}}
                  <span v-if="item.floorName">楼</span>
                  {{item.roomName}}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
    <div class="zhanwei"></div>

    <div class="tijiao">
      <el-row :gutter="40">
        <el-col :lg="2" :xl="2">
          <el-button
            style="width: 100px"
            type="success"
            plain
            @click="scewmrt()"
            v-bind:style="{'background':firstZhuTi}"
          >生成二维码</el-button>
        </el-col>
        <el-col :lg="2" :xl="2">
          <el-button style="width: 100px" @click="backList()">取消</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="tijiao" v-if="scheduleType==2">
      <el-row :gutter="40">
        <el-col :lg="2" :xl="2">
          <el-button
            style="width: 100px"
            type="success"
            plain
            @click="sendData2()"
            v-bind:style="{'background':firstZhuTi}"
          >生成二维码</el-button>
        </el-col>
        <el-col :lg="2" :xl="2">
          <el-button style="width: 100px" @click="backList()">取消</el-button>
        </el-col>
      </el-row>
    </div>-->
    <!-- <button @click="scewmrt()">生成二维码</button> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      form1: {},
      scheduleName2: "",
      form2: {},
      sbdwnum: 0,
      scheduleType: "",
      scheduleId: "",
      addTableData: [],
      addTableData2: [],
      sbcheckall: false,
      sendarr: [],
      lccheckall: false
    };
  },
  created() {
    // let scheduleType = this.$route.query.scheduleType;

    this.scheduleType = this.$route.query.scheduleType;
    this.scheduleId = this.$route.query.scheduleId;
    // let scheduleId = this.$route.query.scheduleId;
    if (this.scheduleType == 1) { 
      let data = {
        scheduleId: this.scheduleId
      };
      axios.fetch('fireServer', "/patrol/schedule/get/device/schedule",data).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.form1 = res.data[0];
            console.log();
            this.addTableData = res.data[0].patrolPositions.map(v => {
              return {
                equipmentName: v.deviceName,
                deviceNo: v.uid,
                installPosition: v.roomName,
                buildingName: v.buildingName,
                floorName: v.floorName,
                deviceId: v.deviceId,
                bedName: "",
                groupId: v.groupId,
                check: false
              };
            });
            let tempary = this.addTableData;
            let fjdarray = [];
            let zjdarray = [];

            for (var i = 0; i < tempary.length; i++) {
              if (tempary[i].groupId == tempary[i].deviceId) {
                tempary[i].node = "fjd";
                tempary[i].zjdzk = true;
                tempary[i].children = [];
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

            this.sbdwnum =
              parseInt(fjdarray.length) + parseInt(zjdarray.length);
            this.addTableData = fjdarray;
            this.zjdidarr = zjdarray;
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
    } else if (this.scheduleType == 2) {
      let data = {
        scheduleId: this.scheduleId
      };
      axios.fetch('fireServer', "/patrol/schedule/get/position/no",data).then(res => {
          this.loading = false;
          if (res.code == 200) {
            this.form2 = res.data.patrolSchedule[0];
            this.addTableData2 = res.data.patrolPositionDefines;
            this.addTableData2.forEach(function(item, index) {
              item.check = false;
            });
            if (this.form2.scheduleName) {
              this.scheduleName2 = this.form2.scheduleName;
            }
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  methods: {
    backList() {
      this.$router.back(-1);
    },
    dwzk(index) {
      this.addTableData[index].zjdzk = !this.addTableData[index].zjdzk;
      this.$forceUpdate();
    },
    checkall() {
      this.sendarr = [];
      this.sbcheckall = !this.sbcheckall;
      if (this.sbcheckall == true) {
        this.addTableData.forEach((item, index) => {
          item.check = true;

          let temp1 = {
            deviceNo: item.deviceNo,
            equipmentName: item.equipmentName,
            buildingName: item.buildingName,
            floorName: item.floorName,
            installPosition: item.installPosition
          };
          this.sendarr.push(temp1);
          // for (let m = 0; m < item.children.length; m++) {
          //   item.children[m].check = true;
          //   let temp2 = {
          //     deviceNo: item.children[m].deviceNo,
          //     equipmentName: item.children[m].equipmentName,
          //     buildingName: item.children[m].buildingName,
          //     floorName: item.children[m].floorName,
          //     installPosition: item.children[m].installPosition
          //   };
          //   this.sendarr.push(temp2);
          // }
        });
      } else if (this.sbcheckall == false) {
        this.addTableData.forEach(function(item, index) {
          item.check = false;
          for (let i = 0; i < item.children.length; i++) {
            item.children[i].check = false;
          }
        });
        this.sendarr = [];
      }
      this.$forceUpdate();
    },
    fjdcheck(index) {
      this.sendarr = [];
      let checkarr = [];
      this.addTableData[index].check = !this.addTableData[index].check;
      if (this.addTableData[index].check == false) {
        this.sbcheckall = false;
      } else {
        this.addTableData.forEach(function(item, index) {
          if (item.check == true) {
            checkarr.push(item.check);
          }
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].check == true) {
              checkarr.push(item.children[i].check);
            }
          }
        });
      }

      for (let i = 0; i < this.addTableData.length; i++) {
        if (this.addTableData[i].check == true) {
          let temp = {
            deviceNo: this.addTableData[i].deviceNo,
            equipmentName: this.addTableData[i].equipmentName,
            buildingName: this.addTableData[i].buildingName,
            floorName: this.addTableData[i].floorName,
            installPosition: this.addTableData[i].installPosition
          };
          this.sendarr.push(temp);
        }
        if (this.addTableData[i].children.length != 0) {
          for (let j = 0; j < this.addTableData[i].children.length; j++) {
            if (this.addTableData[i].children[j].check == true) {
              let temp2 = {
                deviceNo: this.addTableData[i].children[j].deviceNo,
                equipmentName: this.addTableData[i].children[j].equipmentName,
                buildingName: this.addTableData[i].children[j].buildingName,
                floorName: this.addTableData[i].children[j].floorName,
                installPosition: this.addTableData[i].children[j]
                  .installPosition
              };
              this.sendarr.push(temp2);
            }
          }
        }
      }
      if (checkarr.length == this.sbdwnum) {
        this.sbcheckall = true;
      }
      this.$forceUpdate();
    },
    zjdcheck(index, index2) {
      let checkarr = [];
      this.sendarr = [];
      this.addTableData[index].children[index2].check = !this.addTableData[
        index
      ].children[index2].check;

      if (this.addTableData[index].children[index2].check == false) {
        this.sbcheckall = false;
      } else {
        this.addTableData.forEach(function(item, index) {
          if (item.check == true) {
            checkarr.push(item.check);
          }
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].check == true) {
              checkarr.push(item.children[i].check);
            }
          }
        });
      }

      for (let i = 0; i < this.addTableData.length; i++) {
        if (this.addTableData[i].check == true) {
          let temp = {
            deviceNo: this.addTableData[i].deviceNo,
            equipmentName: this.addTableData[i].equipmentName,
            buildingName: this.addTableData[i].buildingName,
            floorName: this.addTableData[i].floorName,
            installPosition: this.addTableData[i].installPosition
          };
          this.sendarr.push(temp);
        }
        if (this.addTableData[i].children.length != 0) {
          for (let j = 0; j < this.addTableData[i].children.length; j++) {
            if (this.addTableData[i].children[j].check == true) {
              let temp2 = {
                deviceNo: this.addTableData[i].children[j].deviceNo,
                equipmentName: this.addTableData[i].children[j].equipmentName,
                buildingName: this.addTableData[i].children[j].buildingName,
                floorName: this.addTableData[i].children[j].floorName,
                installPosition: this.addTableData[i].children[j]
                  .installPosition
              };
              this.sendarr.push(temp2);
            }
          }
        }
      }
      if (checkarr.length == this.sbdwnum) {
        this.sbcheckall = true;
      }
      this.$forceUpdate();
    },
    lccheck(index) {
      this.sendarr = [];
      let checkarr = [];
      this.addTableData2[index].check = !this.addTableData2[index].check;

      if (this.addTableData2[index].check == false) {
        this.lccheckall = false;
      } else {
        this.addTableData2.forEach(function(item, index) {
          if (item.check == true) {
            checkarr.push(item.check);
          }
        });
      }

      for (let i = 0; i < this.addTableData2.length; i++) {
        if (this.addTableData2[i].check == true) {
          let temp = {
            positionNo: this.addTableData2[i].positionNo,
            buildingName: this.addTableData2[i].buildingName,
            floorName: this.addTableData2[i].floorName,
            bedName: this.addTableData2[i].roomName,
            roomName: this.addTableData2[i].roomName
          };
          this.sendarr.push(temp);
        }
      }
      if (checkarr.length == this.form2.positionCount) {
        this.lccheckall = true;
      }
      this.$forceUpdate();
    },
    checkall2(index) {
      this.sendarr = [];
      this.lccheckall = !this.lccheckall;
      if (this.lccheckall == true) {
        this.addTableData2.forEach((item, index) => {
          item.check = true;
          let temp1 = {
            positionNo: item.positionNo,
            buildingName: item.buildingName,
            floorName: item.floorName,
            roomName: item.roomName,
            bedName: item.bedName
          };
          this.sendarr.push(temp1);
        });
      } else if (this.sbcheckall == false) {
        this.addTableData2.forEach(function(item, index) {
          item.check = false;
        });
        this.sendarr = [];
      }
      this.$forceUpdate();
    },

    scewmrt() {
      console.log(this.sendarr)
      if (this.sendarr.length == 0) {
        this.$message({
          message: "至少选择一条信息来生成二维码",
          type: "warning"
        });
        return;
      }
      this.$router.push({
        path: "/fire/xunCha/erCodePrint",
        query: {
          scheduleType: this.scheduleType,
          sendArr: JSON.stringify(this.sendarr)
        }
      });
    }
  },
  filters: {
    duration: val => {
      if (val == 1) {
        val = "天";
      } else if (val == 2) {
        val = "周";
      } else if (val == 3) {
        val = "双周";
      } else if (val == 4) {
        val = "半月";
      } else if (val == 5) {
        val = "一个月";
      }
      return val;
    },
    substr: val => {
      if (val) {
        val = val.substr(0, 10);
      }
      return val;
    }
  }
};
</script>

<style>
#erweimabox {
  margin-left: 70px;
}
#erweimabox .lookta {
  width: 35px;
  height: 35px;
}

#dwtable {
  margin-top: 10px;
}

#dwtable .thead td {
  height: 48px;
  text-align: center;
  background: rgba(248, 248, 248, 1);
}
#dwtable .thxh,
#dwtable .dwxh {
  width: 57px;
}
#dwtable td {
  width: 200px;
  height: 48px;
  border: 1px solid rgba(220, 223, 230, 1);
}
#dwtable td:nth-child(3) {
  min-width: 350px;
  width: auto;
}
#dwtable th {
  text-align: center;
  background: rgba(243, 243, 243, 1);
}
#dwtable td {
  background: #fff;
}
#dwtable .dwxh,
#dwtable .dwbh {
  text-align: center;
}
#dwtable .dwck,
#dwtable .dwck {
  width: 50px;
  text-align: center;
}
#dwtable .dwmc,
#dwtable .dwwz,
#dwtable .dwcz {
  min-width: 200px;
  width: auto;
  padding-left: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.dwmc .dwxlic {
  display: inline-block;
  width: 15px;
}
.dwzk {
  transform: rotate(90deg);
  margin-top: -3px;
}
#dwchild td {
  background: rgba(248, 248, 248, 1);
}

#erweimabox .el-card__body {
  padding: 0px 0px 20px 0px;
}
.ewtablebox {
  padding-left: 20px;
}

.ewtit {
  background: rgba(251, 251, 252, 1);
  font-weight: 600;
  padding-left: 20px;
  height: 50px;
  line-height: 55px;
  border-bottom: 1px solid #ddd;
}
.p1 {
  margin-top: 10px;
  height: 28px;
  font-size: 20px;
  font-weight: 600;
  color: rgba(34, 34, 34, 1);
  line-height: 28px;
}
.zhanwei {
  height: 80px;
}
</style>




















