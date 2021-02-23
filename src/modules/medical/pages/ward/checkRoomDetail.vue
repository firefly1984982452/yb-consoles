<template>
  <div>
    <el-form :inline="true" class="search">
      <el-button class="back" size="mini" @click="back">返回</el-button>
      <el-form-item label="状态">
        <el-select placeholder="请选择状态" clearable v-model="statusSelect" size="mini" @change="changeStatus">
          <el-option :label="item.name" :key="item.index" v-for="item in statusList" :value="item.index">{{item.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班次">
        <el-select placeholder="请选择班次" clearable v-model="detailID" size="mini" @change="changeStatus">
          <el-option :label="item.name+' | '+item.startTime+'-'+item.endTime" :key="item.id" v-for="item in scheduleDateList" :value="item.id">{{item.name}} | {{item.startTime}}-{{item.endTime}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="长者">
        <ub-elder v-model="elderId" :status="[100]" @change='item => elderName = item.elderName' clearable></ub-elder>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="querydata">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="left">
          <s class="redBa"></s>
          <span>查房记录</span>
        </el-col>
        <el-col class="right">
          <span class="list-info-right">记录日期 <i>{{scheduleDate}}</i></span>
          <span class="list-info-right">查房人数 <i>{{schedule.checkedCount}}/</i>{{schedule.scheduleCount}}</span>
          <span class="list-info-right">异常记录 <i style="color:#EB6969">{{schedule.abnormalCount}}</i></span>
        </el-col>
      </el-row>
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column label="房间床位" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.roomName}}-{{scope.row.bedName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span :class="'color-'+scope.row.checkStatus">{{scope.row.checkStatus | filterStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="doctorName" label="查房医生" align="center"></el-table-column>
        <el-table-column prop="checkTime" label="记录时间" align="center"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top-end" v-show="scope.row.checkStatus == 2">
              <el-button size="mini" @click="repair(scope.row)" icon="iconfont iconcaozuotubiao-chakan"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end" v-show="scope.row.checkStatus == 2 && today == scheduleDate">
              <el-button size="mini" @click="del(scope.row)" icon="iconfont iconcaozuotubiao-shanchu-xuanfu"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!-- 编辑异常信息弹出框 -->
    <el-dialog title="异常记录" :visible.sync="dialogEditVisible" center width="612px">
      <div class="detail-content">
        <div class="user-card">
          <img class="user-img" :src="detailElderInfo.photo" alt="" srcset="">
          <div class="user-info">
            <div class="name">
              <p>{{detailElderInfo.name}}</p>
              <div class="sex-age">
                <img v-if="detailElderInfo.gender == '女'" src="../../../../assets/images/icon-sex-famale.png" alt="" srcset="">
                <img v-else src="../../../../assets/images/icon-sex-male.png" alt="" srcset="">
                <span>{{detailElderInfo.age}}</span>
              </div>
            </div>
            <div class="other-info">
              <div class="bed-info">
                <i class="iconfont iconzuocedaohangtubiao-chuangweiguanli-chuanghaoguanli"></i>
                <p>{{detailElderInfo.roomName}}-{{detailElderInfo.bedName}}</p>
              </div>
              <div class="bed-info">
                <i class="iconfont iconcebianlantubiao-zhihuihuli"></i>
                <p>护理{{detailElderInfo.nursingLevel | filterLevel}}级</p>
              </div>
            </div>
          </div>
          <div class="no">编号 {{detailElderInfo.checkinNo}}</div>
        </div>
        <div class="user-detail">
          <div class="detail-header">
            <div class="line-info">
              <div class="name">记录时间</div>
              <div class="value">{{detailElderInfo.checkTime}}</div>
            </div>
            <div class="line-info">
              <div class="name">记录人</div>
              <div class="value">{{detailElderInfo.doctorName}}</div>
            </div>
          </div>
          <div class="line-info2">
            <div class="name">记录内容</div>
            <div class="value">{{editInfo.description || '-'}}</div>
          </div>
          <div class="detail-content-box">
            <div class="base-info">
              <div class="base" v-show="editInfo.temperature">
                <p class="name">体温(℃)</p>
                <p class="value">{{editInfo.temperature || '-'}}</p>
              </div>
              <div class="base" v-show="editInfo.heartRate">
                <p class="name">心率(次/分)</p>
                <p class="value">{{editInfo.heartRate || '-'}}</p>
              </div>
              <div class="base" v-show="editInfo.respirationRate">
                <p class="name">呼吸(次/分)</p>
                <p class="value">{{editInfo.respirationRate || '-'}}</p>
              </div>
              <div class="base" v-show="editInfo.pulseRate">
                <p class="name">脉搏(次/分)</p>
                <p class="value">{{editInfo.pulseRate || '-'}}</p>
              </div>
              <div class="base" v-show="editInfo.pressureHign || editInfo.pressureLow">
                <p class="name">血压(mmHg)</p>
                <p class="value">{{editInfo.pressureHign || '-'}}/{{editInfo.pressureLow || '-'}}</p>
              </div>
            </div>
            <div class="img-info">
              <ub-image v-for="item in editInfo.attachments" :key="item.id" class="image" fit="cover" :src="item.url" :defaultSrc="item.url"></ub-image>
            </div>
            <div class="audio" v-show="false">
              <audio src="http://wechatapppro-1252524126.file.myqcloud.com/appG1VMUALC2470/audio_compressed/1505377565_4fd15d83213bceb23a97ad6af45f1dae.mp3" controls="controls">
                您当前使用的浏览器不支持听语音，建议换Chrome浏览器。
              </audio>
            </div>
          </div>
        </div>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="submitEditDate">修 改</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import ubElder from "@/components/elder";
import ubImage from "@/components/image";
export default {
  components: { ubElder, ubImage },
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      currentPage: 1,
      total: 0,
      data: [],
      detailID: "",
      // 0：待查，1：已查，2：异常，3:人暂离，9：请假
      statusList: [
        {
          name: "全部记录",
          index: "",
        },
        {
          name: "待查",
          index: 0,
        },
        {
          name: "正常",
          index: 1,
        },
        {
          name: "异常",
          index: 2,
        },
        {
          name: "人暂离",
          index: 3,
        },
        {
          name: "请假",
          index: 9,
        },
      ],
      statusSelect: 2, //当前选择的状态
      scheduleDateList: [], // 当天有多少班次
      scheduleDate: "", // 当天年月日
      today: "", // 今天
      elderId: "",
      elderName: "",
      checkedCount: "", // 应查
      scheduleCount: "", // 实查
      abnormalCount: "", // 异常
      dialogEditVisible: false,
      detailElderInfo: "", // 异常老人详情
      editInfo: "", // 异常详情
      currentUser: "",
      schedule: {},
    };
  },
  created() {
    this.currentUser = axios.getCurrentUser();
    this.detailID = Number(this.$route.query.id);
    this.scheduleDate = this.$route.query.scheduleDate;
    this.checkedCount = this.$route.query.checkedCount;
    this.scheduleCount = this.$route.query.scheduleCount;
    this.abnormalCount = this.$route.query.abnormalCount;
    this.getScheduleDate();
    this.getdata();
    this.getToday();
  },
  methods: {
    getToday() {
      var time = new Date();
      var Y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      if (m < 10) m = "0" + m;
      if (d < 10) d = "0" + d;
      this.today = Y + "-" + m + "-" + d;
    },
    // 获取当天所有日程
    getScheduleDate() {
      axios
        .fetch(
          "medicalServer",
          "/api/ward/schedule/same-day/" + this.scheduleDate,
          {},
          "form",
          "get"
        )
        .then((res) => {
          if (res.code == 200) {
            this.scheduleDateList = res.data;
          }
        });
    },
    // 将异常变为正常
    del(val) {
      this.$confirm("确定删除异常记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .fetch(
              "medicalServer",
              "/api/ward/abnormal/" + val.id,
              {},
              "form",
              "delete"
            )
            .then((res) => {
              if (res.code == 200) {
                if (res.data !== false) {
                  this.$message.success("操作成功！");
                  this.getdata();
                } else {
                  this.$message.error("操作失败！");
                }
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 获取当前班次所有查房记录
    getdata() {
      console.log(this.elderId, this.elderName);
      axios
        .fetch(
          "medicalServer",
          "/api/ward/record/page",
          {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            scheduleId: this.detailID,
            searchKey: this.elderName,
            status: this.statusSelect,
          },
          "form",
          "get"
        )
        .then((res) => {
          if (res.code == 200) {
            this.total = res.total;
            this.data = res.data.records;
            this.schedule = res.data.schedule;
          }
        });
    },
    handleChange(i) {
      this.pageIndex = i;
      this.getdata();
    },
    // 编辑
    repair(val) {
      console.log(val);
      this.detailElderInfo = val;
      this.dialogEditVisible = true;
      this.getDialogDetail(val);
    },
    // 修改异常
    submitEditDate() {},
    // 获取异常详情
    getDialogDetail(val) {
      axios
        .fetch("medicalServer", "/api/ward/record/" + val.id, {}, "form", "get")
        .then((res) => {
          if (res.code == 200) {
            this.editInfo = res.data.abnormal;
          }
        });
    },
    querydata() {
      this.pageIndex = 1;
      this.currentPage = 1;
      this.getdata();
    },
    reset() {
      this.elderId = this.elderName = this.statusSelect = "";
      this.querydata();
    },
    back() {
      this.$router.back();
    },
  },
  filters: {
    filterStatus: (val) => {
      let arr = [
        {
          name: "待查",
          index: 0,
        },
        {
          name: "正常",
          index: 1,
        },
        {
          name: "异常",
          index: 2,
        },
        {
          name: "人暂离",
          index: 3,
        },
        {
          name: "请假",
          index: 9,
        },
      ];
      let index = arr.findIndex((value) => value.index == val);
      return arr[index].name;
    },
    filterLevel: (val) => {
      return ["", "一", "二", "三", "四", "五", "六"][val];
    },
  },
};
</script>

<style lang="less" scoped>
.redBa {
  margin: 0 10px;
  background: #f49b31;
}
div {
  box-sizing: border-box;
}
.detail-content {
  width: 552px;
  margin: 0 auto;
  .user-card {
    width: 100%;
    height: 92px;
    border: 1px solid #dcdfe6;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    display: flex;
    padding: 16px 0 16px 16px;
    position: relative;
    .user-img {
      width: 60px;
      height: 60px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      margin: 0 16px 0 0;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name {
        display: flex;
        flex-direction: row;
        height: 22px;
        align-items: center;
        p {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
        }
        .sex-age {
          width: 42px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          margin: 0 0 0 16px;
          img {
            width: 12px;
            height: 12px;
            display: inline-block;
          }
          span {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
          }
        }
      }
      .other-info {
        width: 200px;
        display: flex;
        justify-content: space-between;
        height: 20px;
        align-items: center;
        .bed-info {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          i {
            width: 13px;
            height: 13px;
            display: flex;
            margin: 0 8px 0 0;
            display: flex;
          }
          p {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
          }
        }
      }
    }
    .no {
      width: auto;
      padding: 0 5px 0 10px;
      // min-width: 95px;
      height: 20px;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 100px 0 0 100px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      letter-spacing: 0;
      text-align: right;
      line-height: 20px;
      position: absolute;
      right: 0;
      top: 20px;
    }
  }
  .user-detail {
    display: flex;
    flex-direction: column;
    .detail-header {
      display: flex;
      flex-direction: row;
      width: 394px;
      justify-content: space-between;
      margin: 20px 0;
      .line-info {
        display: flex;
        font-size: 14px;
        font-weight: bold;
        .name {
          color: #666666;
        }
        .value {
          margin: 0 0 0 10px;
          color: #333333;
        }
      }
    }
    .line-info2 {
      display: flex;
      font-size: 14px;
      font-weight: bold;
      .name {
        flex: 1;
        color: #666666;
      }
      .value {
        flex: 8;
        margin: 0 0 0 10px;
        color: #333333;
      }
    }
    .detail-content-box {
      width: 430px;
      margin: 0 0 0 74px;
      .base-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 15px 0;
        .base {
          display: flex;
          flex-direction: column;
          .name {
            font-size: 12px;
            color: #3f3f3f;
            line-height: 20px;
          }
          .value {
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            text-align: center;
          }
        }
      }
      .img-info {
        margin: 0 0 15px;
        .image {
          width: 68px;
          height: 68px;
          border-radius: 2px;
          margin: 0 24px 0 0;
        }
      }
      .audio {
        audio {
          width: 169px;
          height: 36px;
        }
      }
    }
  }
}
.el-button.back {
  width: 60px;
  height: 34px;
  padding: 0;
  min-width: 0;
  margin: 0 20px 0 0;
}
.list-info-right {
  font-size: 14px;
  margin: 0 0 0 30px;
  color: #666666;
  font-weight: 600;
}
.list-info-right i {
  font-style: normal;
  color: #333333;
}
.color-0 {
  color: #f6812b;
}
.color-1 {
  color: #2fc07a;
}
.color-2 {
  color: #eb6969;
}
.color-3 {
  color: #f6812b;
}
.color-9 {
  color: #666666;
}
</style>