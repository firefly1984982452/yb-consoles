
<template>
  <div id="ewmdybox" class="iePrint">
    <!-- <button @click="qrcode">iiii</button> -->
    <div v-if="scheduleType==1">
      <div v-for="(item,index) in erCodePrintArr" :key="index">
        <div id="printbox" :class="index==0?'':'fenyeNum'">
          <ul v-for="(item2,index2) in item" :key="index2">
            <li class="imgitembox">
              <div :id="'qrcode'+ (parseInt('' + index +index2))" class="imgitem"></div>
              <p>{{item2.equipmentName}}</p>
              <p>{{item2.deviceNo}}</p>
              <p>
                <span>{{item2.floorName}}</span>
                <span v-if="item2.floorName">楼</span>
                <span>{{item2.installPosition}}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="scheduleType==2">
      <div v-for="(item,index) in erCodePrintArr" :key="index">
        <div id="printbox" :class="index==0?'':'fenyeNum'">
          <ul v-for="(item2,index2) in item" :key="index2">
            <li class="imgitembox">
              <div :id="'qrcode'+(parseInt('' + index +index2))" class="imgitem"></div>
              <!-- <p>{{item.equipmentName}}</p> -->
              <p>{{item2.positionNo}}</p>
              <p>
                <span>{{item2.buildingName}}</span>
                <span>{{item2.floorName}}</span>
                <span v-if="item2.floorName">楼</span>
              </p>
              <p>
                <span>{{item2.roomName}}</span>
              </p>
            </li>
            <!-- <li class="imgitembox">
          <p>222</p>
          <div id="qrcode2" class="imgitem"></div>
            </li>-->
          </ul>
        </div>
      </div>
    </div>
    <div class="zhanwei"></div>
    <div class="tijiao">
      <el-row :gutter="40">
        <el-col :lg="2" :xl="2">
          <el-button
            style="width: 100px"
            type="success"
            plain
            @click="print()"
            v-bind:style="{'background':firstZhuTi}"
          >打印</el-button>
        </el-col>
        <el-col :lg="2" :xl="2">
          <el-button style="width: 100px" @click="backList()">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
export default {
  data() {
    return {
      scheduleType: 0,
      erCodePrintArr: [],
      urlpre1: "https://dh.youbankeji.com/qr-api/index?type=1&data=",
      urlpre2: "https://dh.youbankeji.com/qr-api/index?type=2&data="
    };
  },

  created() {
    this.scheduleType = this.$route.query.scheduleType;
    this.handle();
  },
  methods: {
    handle() {
      var num = 9;
      var arr2 = [];
      var arr1 = JSON.parse(this.$route.query.sendArr);
      for (let i = 0, len = arr1.length; i < len; i += num) {
        arr2.push(arr1.slice(i, i + num));
      }
      this.erCodePrintArr = arr2;
    },
    print() {
      // if (!!window.ActiveXObject || "ActiveXObject" in window) {
      //   //是否ie

      //   this.pagesetup_null();
      // }

      window.print();
    },
    backList() {
      this.$router.back(-1);
    },
    // 生成二维码
    qrcode() {
      if (this.scheduleType == 1) {
        for (let i = 0; i < this.erCodePrintArr.length; i++) {
          for (let m = 0; m < this.erCodePrintArr[i].length; m++) {
            let qrcode = new QRCode("qrcode" + parseInt("" + i + m), {
              width: 100,
              height: 100, // 高度
              text: this.urlpre1 + this.erCodePrintArr[i][m].deviceNo, // 二维码内容
              colorDark: "#000", //前景色
              colorLight: "#fff", //背景色
              correctLevel: QRCode.CorrectLevel.L //容错等级
            });
          }
        }
      } else if (this.scheduleType == 2) {
        for (let i = 0; i < this.erCodePrintArr.length; i++) {
          for (let m = 0; m < this.erCodePrintArr[i].length; m++) {
            let qrcode = new QRCode("qrcode" + parseInt("" + i + m), {
              width: 100,
              height: 100, // 高度
              text: this.urlpre2 + this.erCodePrintArr[i][m].positionNo, // 二维码内容
              colorDark: "#000", //前景色
              colorLight: "#fff", //背景色
              correctLevel: QRCode.CorrectLevel.L //容错等级
            });
          }
        }
      }
    }
  },
  mounted() {
    this.handle();
    this.qrcode();
  },
};
</script>

<style>
#ewmdybox {
  min-height: 100%;
  padding-left: 70px;
  padding-top: 10px;
}
#printbox {
  width: 600px;
  overflow: hidden;
}
#printbox li {
  display: float;
  float: left;
}
#printbox ul .imgitembox {
  margin-left: 25px;
  width: 150px;
  margin-top: 20px;
  /* height: 220px; */
}
#printbox ul .imgitembox p {
  text-align: center;
  margin-left: 10px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  /* height: 20px; */
}
.imgitem img {
  margin-left: 10px;
  float: left;
  width: 150px;
  height: 150px;
}
.fenyeNum {
  page-break-before: always;
}
.zhanwei {
  height: 80px;
}
@media print {
  #ewmdybox {
    margin: 0 auto;
  }
}
</style>




















