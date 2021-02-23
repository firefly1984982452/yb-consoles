<template>
  <div class="checkout-sum" style="width:210mm">
    <table border="0" style="font-size:9pt;" width="100%" id="checkout-table" align="center">
      <thead>
        <tr>
          <td align="center" style="font-weight:bold;border-bottom:1px solid rgba(0,0,0,.4)">
            <el-row class="page-header">
              <el-col :span="3">
                姓名
              </el-col>
              <el-col :span="3">
                {{ elderName }}
              </el-col>
              <el-col :span="3">
                病区
              </el-col>
              <el-col :span="3">
                {{ area }}
              </el-col>
              <el-col :span="3">
                房间床位
              </el-col>
              <el-col :span="3"> {{ roomName }}-{{ bedName }} </el-col>
              <el-col :span="3">
                住院号
              </el-col>
              <el-col :span="3">
                {{ checkinNo }}
              </el-col>
            </el-row>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <h2 class="title" style="padding-bottom:20px">{{ tenantName }}</h2>
            <h4 v-if="form.formType === 0" style="text-align:center;margin-bottom:20px;font-size:16px">
              出院小结
            </h4>
            <h4 v-else style="text-align:center;margin-bottom:20px;font-size:16px">
              死亡小结
            </h4>
            <el-form label-position="left" label-width="110px">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="姓名">
                    {{ elderName }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="性别">
                    {{ gender }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="年龄">
                    <!-- {{ roomName }}-{{ bedName }} -->
                    {{ age }}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="职业">
                    {{ job }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="入院日期">
                    {{ checkinDate }}
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item v-if="form.formType === 0" label="出院日期">
                    {{ form.checkoutDate }}
                  </el-form-item>
                  <el-form-item v-else label="死亡日期">
                    {{ form.checkoutDate }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="入院诊断">
                  <div v-if="form.checkinMedical">
                    <b v-for="(item, index) in form.checkinMedical.split(',')" :key="index">
                      {{ index + 1 }}、{{ item }}
                    </b>
                  </div>
                  <b v-else>无</b>
                </el-form-item>
                <el-form-item label="入院情况">
                  <b>{{ form.checkinDescription }}</b>
                  </el-form-item>
                <el-form-item label="在院治疗情况">
                  <b>{{ form.medicalDescription }} </b>
                </el-form-item>
                <el-form-item v-if="form.formType === 0" label="出院情况">
                  <b>{{ form.checkoutDescription }} </b>
                </el-form-item>
                <el-form-item v-else label="抢救经过">
                  <b>{{ form.checkoutDescription }} </b>
                </el-form-item>
                <el-form-item v-if="form.formType === 0" label="出院诊断">
                  <div v-if="form.checkoutMedical">
                    <b v-for="(item, index) in form.checkoutMedical.split(',')" :key="index">
                      {{ index + 1 }}、{{ item }}
                    </b>
                  </div>
                </el-form-item>
                <el-form-item v-else label="死亡诊断">
                  <div v-if="form.checkoutMedical">
                    <b v-for="(item, index) in form.checkoutMedical.split(',')" :key="index">
                      {{ index + 1 }}、{{ item }}
                    </b>
                  </div>
                  <!-- <b>{{ form.checkoutMedical }}</b> -->
                </el-form-item>
                <el-form-item v-if="form.formType === 0" label="出院医嘱">
                  <b>{{ form.checkoutAdvice }}</b>
                </el-form-item>
                <el-form-item v-else label="死亡原因">
                  <b>{{ form.checkoutAdvice }}</b>
                </el-form-item>
              </el-row>
            </el-form>
          </td>
        </tr>
        <tr>
          <td style="line-height:40px;text-align:right;padding-right:80px">
            医生签名：
          </td>
        </tr>
        <tr>
          <td v-if="form.createTime" style="line-height:40px;text-align:right">
            日期：{{ $moment(form.createTime).format("YYYY-MM-DD") }}
          </td>
          <td v-else style="line-height:40px;text-align:right;padding-right:60px">
            日期：
          </td>
        </tr>
        <tr>
          <!-- <td class="blank" id="blank" style="height:2388px"></td> -->
          <td class="blank" id="blank"></td>
        </tr>
      </tbody>
      <div class="print-footer" style="height:40px;">
        <span style="padding-left:30px">第_________页</span>
        <span style="text-align:right;">签名：__________________________</span>
      </div>
    </table>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data () {
    return {
      elderId: "",
      elderName: "",
      gender: "",
      age: "",
      roomName: "",
      bedName: "",
      checkinDate: "",
      checkoutDate: "",
      checkinNo: "",
      job: "",
      area: "",
      tenantName: "",
      form: {}
    };
  },
  mounted () {
    this.elderId = this.$route.query.elderId;
    this.elderName = this.$route.query.elderName;
    this.gender = this.$route.query.gender;
    this.age = this.$route.query.age;
    this.roomName = this.$route.query.roomName;
    this.bedName = this.$route.query.bedName;
    this.checkinDate = this.$route.query.checkinDate;
    this.checkinNo = this.$route.query.checkinNo;
    this.job = this.$route.query.job;
    this.area = this.$route.query.area;
    this.tenantName = this.$route.query.tenantName;
    this.initPrintData(this.elderId);
  },
  methods: {
    initPrintData (elderId) {
      axios
        .fetch("elderServer", "/elderCheckoutForm/get/byElderId", {
          elderId
        })
        .then(res => {
          console.log(res);
          this.form = Object.assign({}, this.form, res.data);
        });
    },
    // 获取每毫米的像素值
    getOneMmsPx () {
      // 创建一个1mm宽的元素插入到页面，然后坐等出结果
      let div = document.createElement("div");
      div.id = "mm";
      div.style.width = "1mm";
      document.querySelector("body").appendChild(div);
      // 原生方法获取浏览器对元素的计算值
      let mm1 = document.getElementById("mm").getBoundingClientRect();
      console.log(mm1.width * 297);
      return mm1.width;
    }
  }
};
</script>

<style lang="less" scoped>
@page {
  size: 210mm 297mm;
  margin: 40px;
}
@media print {
  .print-footer {
    position: fixed;
    bottom: 0;
  }
}
.checkout-sum {
  table {
    // position: relative;
    thead {
      display: table-header-group;
      .el-row {
        height: 40px;
        line-height: 40px;
        .el-col {
          text-align: center;
          height: 100%;
          font-weight: normal;
        }
        .el-col:nth-child(2n) {
          text-align: left;
          font-weight: bolder;
        }
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .print-footer {
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      width: 210mm;
      border-top: 1px solid rgba(0, 0, 0, 0.4);
      display: flex;
      padding: 22px 0 0 0;
      span {
        flex: 1;
      }
    }
  }
}
</style>
