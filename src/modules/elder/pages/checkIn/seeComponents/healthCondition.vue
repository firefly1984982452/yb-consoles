<template>
  <el-form label-width="8em" :rules="rules" style="padding:20px;">
    <el-row style="width:75%;display:flex">
      <el-col class="health-left">
        <div class="header">
          <s class="greenBa"></s>
          <span>评估信息</span>
        </div>
        <el-form-item label="既往病例介绍">
          <span>{{ medicalHistory }}</span>
          <!-- <span v-for="(item,index) in medicalHistory" :key="index" v-if="item">{{item}}</span> -->
          <span v-if="medicalHistory.length === 0">无</span>
        </el-form-item>
        <el-form-item label="现有病例介绍">
          <span>{{ medicalCurrent }}</span>
          <span v-if="medicalCurrent.length === 0">无</span>
        </el-form-item>
        <el-form-item label="其他疾病">
          {{ medicalOther | nothingFilter }}
        </el-form-item>
        <el-form-item label="禁忌药品">
          {{ medicalAvoid | nothingFilter }}
        </el-form-item>
        <el-form-item label="体检报告结论" prop="Eh_report_result">
          <p>{{ reportResult | nothingFilter }}</p>
        </el-form-item>
        <el-form-item label="饮食禁忌">
          <span>{{ dietAvoid }}</span>
          <!-- <span v-for="(item,index) in dietAvoid" :key="index" v-if="item">{{item}}</span> -->
          <span v-if="dietAvoid.length === 0">无</span>
        </el-form-item>
      </el-col>
      <el-col class="health-right">
        <div class="header">
          <s class="greenBa"></s>
          <span>
            检查报告
          </span>
        </div>
        <el-row :gutter="20" class="plPic">
          <!-- <el-form-item label="体检报告：" label-width="6em"> -->
          <el-row :gutter="20">
            <br />
            <!-- <b>● 生化检验</b> -->
            <el-form-item label="生化检验" label-width="6em">
              <div class="demo-image__preview">
                <el-image
                  v-for="(item, index) in shjyAttachment"
                  :key="index"
                  style="width: 50px; height: 50px;margin-right:10px"
                  :src="item"
                  :preview-src-list="shjyAttachment"
                >
                </el-image>
              </div>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="X光" label-width="6em">
              <div class="demo-image__preview">
                <el-image
                  v-for="(item, index) in xAttachment"
                  :key="index"
                  style="width: 50px; height: 50px;margin-right:10px"
                  :src="item"
                  :preview-src-list="xAttachment"
                >
                </el-image>
              </div>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="超声检查" label-width="6em">
              <div class="demo-image__preview">
                <el-image
                  v-for="(item, index) in csAttachment"
                  :key="index"
                  style="width: 50px; height: 50px;margin-right:10px"
                  :src="item"
                  :preview-src-list="csAttachment"
                >
                </el-image>
              </div>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="心电图" label-width="6em">
              <div class="demo-image__preview">
                <el-image
                  v-for="(item, index) in xdtAttachment"
                  :key="index"
                  style="width: 50px; height: 50px;margin-right:10px"
                  :src="item"
                  :preview-src-list="xdtAttachment"
                >
                </el-image>
              </div>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="CT" label-width="6em">
              <div class="demo-image__preview">
                <el-image
                  v-for="(item, index) in ctAttachment"
                  :key="index"
                  style="width: 50px; height: 50px"
                  :src="item"
                  :preview-src-list="ctAttachment"
                >
                </el-image>
              </div>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <!-- <b>● 其他</b>
            <ul class="clearfix">
              <li
                v-for="(item, index) in otherAttachment"
                :key="index"
                style="overflow: hidden;border-radius:2px;display:flex;"
              >
                <img :src="item" alt="" class="vistorClass" />
                <div class="bigBtn" @click="lgPic(item)"></div>
              </li>
            </ul> -->
            <el-form-item label="其他" label-width="6em">
              <div class="demo-image__preview">
                <el-image
                  v-for="(item, index) in otherAttachment"
                  :key="index"
                  style="width: 50px; height: 50px;margin-right:10px"
                  :src="item"
                  :preview-src-list="otherAttachment"
                >
                </el-image>
              </div>
            </el-form-item>
          </el-row>
          <!-- </el-form-item> -->
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import axios from "axios";
export default {
  props: ["elderId"],
  data() {
    return {
      medicalCurrent: [],
      medicalHistory: [],
      dietAvoid: [],
      shjyAttachment: [],
      xAttachment: [],
      csAttachment: [],
      xdtAttachment: [],
      ctAttachment: [],
      otherAttachment: [],
      eh_sickness: "",
      reportResult: "",
      medicalAvoid: "",
      medicalOther: "",
      rules: {
        Eh_report_result: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  created() {
    this.infoInit();
  },
  methods: {
    async infoInit() {
      let data = {
        elderId: this.elderId
      };
      const res = await axios.fetch("elderServer", "/elderMedical/all", data);
      const res2 = await axios.fetch("elderServer", "/elderAttachment/elder", {
        elderId: this.elderId,
        category: "elder_medical"
      });
      let resData = res.data;
      if (resData) {
        this.medicalCurrent = resData.medicalCurrent;
        this.medicalHistory = resData.medicalHistory;
        this.dietAvoid = resData.dietAvoid;
        // this.reportChest = resData.reportChest?resData.reportChest.split(","):[];
        // this.reportHeart = resData.reportHeart?resData.reportHeart.split(","):[];
        // this.reportLiver = resData.reportLiver?resData.reportLiver.split(","):[];
        this.reportResult = resData.reportResult ? resData.reportResult : "";
        this.medicalAvoid = resData.medicalAvoid ? resData.medicalAvoid : "";
        this.medicalOther = resData.medicalOther ? resData.medicalOther : "";
      }
      if (res2.data.length > 0) {
        res2.data.forEach(item => {
          switch (item.title) {
            case "生化检验":
              this.shjyAttachment.push(item.url);
              break;
            case "X光":
              this.xAttachment.push(item.url);
              break;
            case "超声检查":
              this.csAttachment.push(item.url);
              break;
            case "心电图":
              this.xdtAttachment.push(item.url);
              break;
            case "CT":
              this.ctAttachment.push(item.url);
              break;
            case "其他":
              this.otherAttachment.push(item.url);
              break;
            default:
              break;
          }
        });
      }
    },
    lgPic(src) {
      // this.$store.commit("setLargePic", 1);
      // this.$store.commit("setLgwhichpic", src);
    }
  },
  filters: {
    nothingFilter: val => {
      if (val == "") {
        return "无";
      } else {
        return val;
      }
    }
  }
};
</script>

<style scoped>
.vistorClass {
  width: 150px;
  height: 150px;
}
.plPic span {
  font-size: 12px;
  margin-left: 10px;
  color: #999;
}
.bigBtn {
  width: 148px;
  height: 160px;
  position: relative;
  bottom: 170px;
}
.bigBtn:hover {
  background: url("//image.youbankeji.com/web/dahuaAdmin/largeInmg.png")
    rgba(0, 0, 0, 0.5) no-repeat 50% 50%;
  background-size: 15%;
}
.header {
  padding-left: 20px;
  background-color: #f8f8f8;
  line-height: 36px;
  margin-bottom: 10px;
}
.health-left {
  flex: 2;
  padding-right: 25px;
  border-right: 1px solid #eeeeee;
}
.health-right {
  flex: 1;
  padding-left: 25px;
}
</style>
