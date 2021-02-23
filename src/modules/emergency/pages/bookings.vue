<template>
  <div class="page">
    <div class="top">
      <div class="left">
        <el-date-picker
          v-model="checkinDate"
          type="date"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getData"
          clearable
        ></el-date-picker>
        <div :class="isActived == 1 ? 'actived' : ''" @click="changeTime(1)">
          上午 
        </div>
        <div :class="isActived == 2 ? 'actived' : ''" @click="changeTime(2)">
          下午 
        </div>
      </div>
      <div class="right">
        <p class="data">
          <span>已预约：{{ book }}人&nbsp;&nbsp;</span>
          <span>已探视：{{ visit }}人</span>
        </p>
        <el-button @click="getData" type="primary" icon="el-icon-refresh-right">刷新数据</el-button>
        <el-button @click="bookingSettingVisible = true" type="primary" plain icon="el-icon-setting">预约配置</el-button>
        <!-- <div class="history">
          <i class="el-icon-user-solid"></i>
          <span>历史访客</span>
        </div> -->
      </div>
    </div>
    <div class="booking-content">
      <div
        class="box"
        @click="detail(item)"
        v-for="item in peopleList"
        :key="item.id"
        v-show="item.schedulePeriod == isActived"
      >
        <div :class="item.status != 1 ? 'gray' : ''">
          <p>{{ item.elderName }}</p>
          <span>{{ item.roomName }}</span>
          <b>{{ item.peopleNum }}人探视</b>
        </div>
        <p v-show="item.status >= 2" class="visitTime">
        {{ item.visitTime }}
        </p>
        <i v-if="item.status == 2">已探视</i>
        <i class="alert" v-if="item.status == 3">已禁止</i>
      </div>
    </div>
    <el-dialog center title="探视详情" :visible.sync="dialogDetailVisible" width="400px">
      <el-form :rules="rules" label-width="90px" size="mini">
        <el-form-item label="长者姓名">
          <span>{{ detailInfo.elderName }}</span>
        </el-form-item>
        <el-form-item label="房间号">
          <span>{{ detailInfo.roomName }}</span>
        </el-form-item>
        <el-form-item label="与长者关系">
          <span>{{ detailInfo.relationName }}</span>
        </el-form-item>
        <el-form-item label="探视人">
          <span>{{ detailInfo.visitorName }}</span>
        </el-form-item>
        <el-form-item label="同行人">
          <span>{{ detailInfo.mateName }}</span>
        </el-form-item>
        <el-form-item label="操作时间" v-show="detailInfo.status != 1">
          <span>{{ detailInfo.visitTime }}</span>
        </el-form-item>
        <el-form-item label="操作人" v-show="detailInfo.status != 1">
          <span>{{ detailInfo.operator }}</span>
        </el-form-item>
        <div class="buttons" style="text-align:center;" v-show="detailInfo.status === 1">
          <el-button v-show="(this.$moment().format('YYYY/MM/DD')===this.$moment(checkinDate).format('YYYY/MM/DD'))" type="primary" @click="submitApply(detailInfo.bookingId, 2)"
            >同意入院</el-button>
          <el-button v-permission="'uban.emergency.cancelvisit'" v-if="(this.$moment().format('YYYY/MM/DD')===this.$moment(checkinDate).format('YYYY/MM/DD'))" type="danger" @click="submitApply(detailInfo.bookingId, 3)"
            >禁止入院</el-button>
          <el-button v-permission="'uban.emergency.cancelvisit'" v-if="(this.$moment().format('YYYY/MM/DD').valueOf()<=this.$moment(checkinDate).format('YYYY/MM/DD').valueOf())" @click="submitApply(detailInfo.bookingId, -1)"
            >取消预约</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog center title="预约配置" :visible.sync="bookingSettingVisible" top="20vh" modal="true" width="600px">
      <el-form :model="bookingSetting" label-width="120px" status-icon ref="settingForm" size="mini">
        <el-form-item prop="availableAm" :show-message="false" label="上午可约人次" required>
          <el-input-number clearable v-model="bookingSetting.availableAm" :precision="0" :min="0" :max="100000" type="text" placeholder="上午可约人次"></el-input-number>
        </el-form-item>
        <el-form-item prop="availablePm" :show-message="false" label="下午可约人次" required>
          <el-input-number clearable v-model="bookingSetting.availablePm" :precision="0" :min="0" :max="100000" type="text" placeholder="下午可约人次"></el-input-number>
        </el-form-item>
        <el-form-item prop="description" label-width="0px">
          <el-input clearable v-model="bookingSetting.description" maxlength="1024" :rows="10" show-word-limit type="textarea" placeholder="探视须知"></el-input>
          <el-popover placement="right" trigger="hover" title="安全探视（主标题）">
            这里是副标题<br/>
            <ul>
              <li>· 文字项1</li>
              <li>· 文字项2</li>
              <li>· 文字项3</li>
              <li>...</li>
            </ul>
            <div slot="reference">探视须知的内容按行分隔：第一行为主标题，第二行为副标题，之后为文字项<i class="el-icon-question"></i></div>
          </el-popover>
        </el-form-item>
        <div class="buttons" style="text-align:center;">
          <el-button @click="bookingSettingVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveSetting">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { permission } from "youban-utils";

export default {
  data() {
    return {
      peopleList: [],
      isActived: 1,
      dialogDetailVisible: false,
      detailInfo: {},
      checkinDate: this.$moment().format("YYYY-MM-DD"),
      visit:0,
      book:0,
      bookingSettingVisible: false,
      bookingSetting: {}
    };
  },
  created() {
    this.getData();
    this.settingData();
  },
  methods: {
    settingData() {
      axios.fetch('familyServer', '/booking/getVisitBookingSetting').then(res => {
        this.bookingSetting = res.data;
      });
    },
    saveSetting() {
      this.$refs["settingForm"].validate(valid => {
        if (!valid) {
          return false;
        }
        axios.fetch('familyServer', '/booking/updateVisitBookingSetting', this.bookingSetting).then(res => {
          this.$message.success("保存成功");
          this.bookingSettingVisible = false;
        });
      })
    },
    getData() {
      axios.fetch("familyServer", "/booking/getVisitBookingsTwo", {
          area:'',
          date: this.checkinDate
      }).then(res => {
          if (res.code == 200) {
            this.peopleList = res.data.visitBookingViews;
            this.book = res.data.book;
            this.visit = res.data.visit;
            for (var i in this.peopleList) {
              this.peopleList[i].peopleNum = 1;
              this.peopleList[i].peopleNum +=
              this.peopleList[i].mateName == "" ? 0 : 1;
            }
          }
      });
    },
    submitApply(id, status) {
      axios.fetch("familyServer", "/booking/updateVisitBookingStatus", { bookingId: id, status}).then(res => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.dialogDetailVisible = false;
          this.getData();
        }
      });
    },
    changeTime(index) {
      this.isActived = index;
    },
    detail(item) {
      this.dialogDetailVisible = true;
      this.detailInfo = item;
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.page {
  padding: 15px;
  .top {
    width: 100%;
    height: 36px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 0 15px 0;
    .left {
      width: 550px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      div {
        width: 175px;
        height: 36px;
        background: rgba(255, 255, 255, 1);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .actived {
        background: rgba(70, 135, 225, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
    .right {
      // width:100px;
      height: 36px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      div {
        width: 100px;
        height: 36px;
        background: rgba(134, 65, 255, 1);
        border-radius: 4px;
        color: #ffffff;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        i {
          width: 12px;
          height: 12px;
        }
        span {
          width: 48px;
          height: 17px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 17px;
          margin: 0 0 0 12px;
        }
      }
      .data {
        line-height: 36px;
        margin-right: 16px;
        font-weight: 600;
      }
      .reset {
        background: #2368d3;
      }
    }
  }
  .booking-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .box {
      width: 19.2%;
      height: 289px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 10px 10px 0;
      position: relative;
      i {
        position: absolute;
        right: 15px;
        top: 15px;
        width: 60px;
        height: 24px;
        line-height: 24px;
        background: #efefef;
        font-size: 14px;
        font-weight: 500;
        color: #666666;
        text-align: center;
        font-style: normal;
        border-radius: 5px;
      }
      .alert {
        color: red;
      }
      div {
        width: 145px;
        height: 143px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
          width: 145px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
          min-width: 108px;
          height: 50px;
          font-size: 36px;
          font-weight: 500;
          color: rgba(34, 34, 34, 1);
          line-height: 50px;
        }
        span {
          width: auto;
          height: 33px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
          line-height: 33px;
          display: flex;
          align-self: center;
        }
        b {
          width: 90px;
          height: 32px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          // border:1px solid rgba(211,212,214,1);
          font-size: 14px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          display: flex;
          align-self: center;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
      .visitTime {
        font-size: 14px;
        font-weight: 600;
        margin-top: 16px;
        text-align: center;
        color: #999;
      }
      .gray {
        p,
        span,
        b {
          color: #999;
        }
      }
    }
  }
}
</style>
