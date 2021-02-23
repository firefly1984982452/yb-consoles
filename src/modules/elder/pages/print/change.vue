<template>
  <div>
    <div class="page confirm_table1">
      <p style="font-size:18px;margin-top:60px;"><span style="margin-right:1em;">附件3</span>变更事项确认表（1-3）</p>
      <h2 class="title">变更事项确认表（1）</h2>
      <table cellspacing="0" cellpadding="0" class="table">
        <tr>
          <td width="13%">姓名</td>
          <td width="14%">{{changeInfo.elderName}}</td>
          <td width="10%">性别</td>
          <td width="12%">{{changeInfo.gender}}</td>
          <td width="13%">出生年月</td>
          <td width="38%">{{changeInfo.birthDay | dateFormat}}</td>
        </tr>
        <tr>
          <td>入住区域</td>
          <td>{{changeInfo.area}}</td>
          <td>床号</td>
          <td>{{changeInfo.bedName}}</td>
          <td colspan="2">
            照护等级(首次)
            <span class="info2" v-if="changeInfo.levelName">{{changeInfo.levelName}}</span>
            <span class="info2" v-else></span>
            评估日期
            <span class="info" v-if="changeInfo.createTime">{{changeInfo.createTime}}</span>
            <span class="info" v-else></span>
            </td>
        </tr>
        <tr>
          <td>变更事项</td>
          <td colspan="3" class="center">变更后的状况</td>
          <td colspan="2" class="center">变更后签章</td>
        </tr>
        <tr>
          <td rowspan="2" class="center">
            <span style="display:inline-block;width:2em;">照护等级</span>
          </td>
          <td colspan="3" valign="top" style="position: relative;">
            <p><b>第一次变更</b></p>
            <div style="position:absolute;bottom:2em;">照护等级
              <span class="info" v-if="firstChange.estimatePrintVos">{{firstChange.estimatePrintVos}}</span>
              <span class="info" v-else></span>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">
              <span class="info" style="width:150px;" v-if="firstChange.nursingTime">{{firstChange.nursingTime | dateFormat}}</span>
              <span v-else>日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3" valign="top" style="position: relative;">
            <p><b>第二次变更</b></p>
            <div style="position:absolute;bottom:2em;">照护等级
              <span class="info" v-if="secondeChange.estimatePrintVos">{{secondeChange.estimatePrintVos}}</span>
              <span class="info" v-else></span>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">
              <span class="info" style="width:150px;" v-if="secondeChange.nursingTime">{{secondeChange.nursingTime | dateFormat}}</span>
              <span v-else>日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</span>
            </div>
          </td>
        </tr>
        <tr>
          <td rowspan="2" class="center">
            <span style="display:inline-block;width:2em;">付费标准</span>
          </td>
          <td colspan="3" valign="top">
            <div>
              <p><b>第一次变更</b></p>
              <div style="margin:2em 0;">床位(托管)费：
                <span class="info2" v-if="firstChange.printBedVos">{{firstChange.printBedVos}}</span>
                <span class="info2" v-else></span>
                元/月
              </div>
              <div>护理费：
                <span class="info2" v-if="firstChange.printNursingVos">{{firstChange.printNursingVos}}</span>
                <span class="info2" v-else></span>
                元/月
              </div>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">
              <span class="info" style="width:150px;" v-if="firstChange.bedTime">{{firstChange.bedTime | dateFormat}}</span>
              <span v-else>日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3" valign="top">
            <p><b>第二次变更</b></p>
            <div style="margin:2em 0;">床位(托管)费：
              <span class="info2" v-if="secondeChange.printBedVos">{{secondeChange.printBedVos}}</span>
              <span class="info2" v-else></span>
              元/月</div>
            <div>护理费：
              <span class="info2" v-if="secondeChange.printNursingVos">{{secondeChange.printNursingVos}}</span>
              <span class="info2" v-else></span>
              元/月
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">
              <span class="info" style="width:150px;" v-if="secondeChange.bedTime">{{secondeChange.bedTime | dateFormat}}</span>
              <span v-else>日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="page confirm_table2">
      <h2 class="title">变更事项确认表（2）</h2>
      <table cellspacing="0" cellpadding="0" class="table">
        <tr>
          <td width="13%">姓名</td>
          <td width="14%">{{changeInfo.elderName}}</td>
          <td width="10%">性别</td>
          <td width="12%">{{changeInfo.gender}}</td>
          <td width="13%">出生年月</td>
          <td width="38%">{{changeInfo.birthDay | dateFormat}}</td>
        </tr>
        <tr>
          <td>入住区域</td>
          <td>{{changeInfo.area}}</td>
          <td>床号</td>
          <td>{{changeInfo.bedName}}</td>
          <td colspan="2">
            照护等级(首次)
            <span class="info2" v-if="changeInfo.levelName">{{changeInfo.levelName}}</span>
            <span class="info2" v-else></span>
            评估日期
            <span class="info" v-if="changeInfo.createTime">{{changeInfo.createTime}}</span>
            <span class="info" v-else></span>
            </td>
        </tr>
        <tr>
          <td>变更事项</td>
          <td colspan="3" class="center">变更后状况</td>
          <td colspan="2" class="center">变更后签章</td>
        </tr>
        <tr>
          <td rowspan="4" class="center">
            <span style="display:inline-block;width:2em;">照护内容</span>
          </td>
          <td rowspan="2" colspan="3" valign="top">
            <p><b>第一次变更</b></p>
            <div class="pline">
              <h2>增加服务内容</h2>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <div class="pline">
              <h2>减少服务内容</h2>
              <p></p>
              <p></p>
              <p></p>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</div>
          </td>
        </tr>
        <tr>
          <td rowspan="2" colspan="3" valign="top">
            <p><b>第二次变更</b></p>
            <div class="pline">
              <h2>增加服务内容</h2>
              <p></p>
              <p></p>
              <p></p>
            </div>
            <div class="pline">
              <h2>减少服务内容</h2>
              <p></p>
              <p></p>
              <p></p>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</div>
          </td>
        </tr>
      </table>
    </div>
    <div class="page confirm_table3">
      <h2 class="title">变更事项确认表（3）</h2>
      <table cellspacing="0" cellpadding="0" class="table">
        <tr>
          <td style="width:4em;text-align-last:justify;">姓名</td>
          <td style="width:18%">{{changeInfo.elderName}}</td>
          <td style="width:2em">性别</td>
          <td style="width:18%">{{changeInfo.gender}}</td>
          <td style="width:6em;text-align:center;">出生年月</td>
          <td>{{changeInfo.birthDay | dateFormat}}</td>
        </tr>
        <tr>
          <td>入住区域</td>
          <td>{{changeInfo.area}}</td>
          <td>床号</td>
          <td>{{changeInfo.bedName}}</td>
          <td colspan="2">
            照护等级(首次)
            <span class="info2" v-if="changeInfo.levelName">{{changeInfo.levelName}}</span>
            <span class="info2" v-else></span>
            评估日期
            <span class="info" v-if="changeInfo.createTime">{{changeInfo.createTime}}</span>
            <span class="info" v-else></span>
            </td>
        </tr>
        <tr>
          <td>变更事项</td>
          <td colspan="3" class="center">变更后状况</td>
          <td colspan="2" class="center">变更后签章</td>
        </tr>
        <tr>
          <td rowspan="2" class="center">
            <span style="display:inline-block;width:2em;">外出约定</span>
          </td>
          <td colspan="3" valign="top">
            <p><b>第一次变更</b></p>
            <div>
              <p>1.乙方
                <span v-if="firstChange.agreeOutPrintVos">{{firstChange.agreeOutPrintVos | outFilter}}</span>
                <span v-else>______</span>
                （应填写能或者不能）自主决定外出。
              </p>
              <p>2.能自主外出的，安全由乙/丙方自行承担</p>
              <p>注：外出时请带好个人信息卡</p>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">
              <span class="info" style="width:150px;" v-if="firstChange.outTime">{{firstChange.outTime | dateFormat}}</span>
              <span v-else>日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3" valign="top">
            <p><b>第二次变更</b></p>
            <div>
              <p>1.乙方
                <span class="info2" v-if="secondeChange.agreeOutPrintVos">{{secondeChange.agreeOutPrintVos | outFilter}}</span>
                <span class="info2" v-else></span>
                （应填写能或者不能）自主决定外出。
              </p>
              <p>2.能自主外出的，安全由乙/丙方自行承担</p>
              <p>注：外出时请带好个人信息卡</p>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">
              <span class="info" style="width:150px;" v-if="secondeChange.outTime">{{secondeChange.outTime | dateFormat}}</span>
              <span v-else>日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</span>
            </div>
          </td>
        </tr>
        <tr>
          <td rowspan="2" class="center">
            <span style="display:inline-block;width:2em;">委托发放外配药品约定</span>
          </td>
          <td colspan="3" valign="top">
            <p><b>第一次变更</b></p>
            <div>
              <p>1.乙方外出就医所配药品
                <span class="info2" v-if="firstChange.agreeMedicinePrintVos">{{firstChange.agreeMedicinePrintVos | medicineFilter}}</span>
                <span class="info2" v-else></span>
                （应填写委托或不委托）甲方按医嘱发放
              </p>
              <p>2.甲方
                <span class="info2" v-if="firstChange.agreeMedicinePrintVos">{{firstChange.agreeMedicinePrintVos | agreeFilter}}</span>
                <span class="info2" v-else></span>
                （应填写接受或不接受）乙/丙方委托：外出就医所配药品按医嘱发放</p>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">
              <span class="info" style="width:150px;" v-if="firstChange.medicineTime">{{firstChange.medicineTime | dateFormat}}</span>
              <span v-else>日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3" valign="top">
            <p><b>第二次变更</b></p>
            <div>
              <p>1.乙方外出就医所配药品
                  <span class="info2" v-if="secondeChange.agreeMedicinePrintVos">{{secondeChange.agreeMedicinePrintVos | medicineFilter}}</span>
                  <span class="info2" v-else></span>
                （应填写委托或不委托）甲方按医嘱发放
                </p>
              <p>2.甲方
                  <span class="info2" v-if="secondeChange.agreeMedicinePrintVos">{{secondeChange.agreeMedicinePrintVos | agreeFilter}}</span>
                  <span class="info2" v-else></span>
                （应填写接受或不接受）乙/丙方委托：外出就医所配药品按医嘱发放</p>
            </div>
          </td>
          <td colspan="2">
            <p>甲方代表签章：</p>
            <p>&nbsp;</p>
            <p>乙/丙方代表签章：</p>
            <div class="right">
              <span class="info" style="width:150px;" v-if="secondeChange.medicineTime">{{secondeChange.medicineTime | dateFormat}}</span>
              <span v-else>日期：<span class="info1"></span>年<span class="info1"></span>月<span class="info1"></span>日</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="page measure" v-show="false">
      <h2 class="title">安全保护措施告知书</h2>
      <div class="first_div">
        <p>
          <span class="info3"></span>
          老人家属（担保人）：
          <span>范承鄂</span>
        </p>
        <p>
          <span class="info3"></span>
          男（女）年龄：
          <span class="info3"></span>
          岁
        </p>
        <p class="measure_content">根据本院对
          <span class="info3"></span>
          老人进行的“风险评估”的状况显示，老人存在发生
          <span class="info3" style="width:200px"></span>
          的风险，为了避免此风险，更是为了老人生命的安全，本院建议该老人使用
          <span class="info3"></span>
          安全保护措施
        </p>
        <div class="sign_date">
          <div class="sign_date_div">
            <p>告知单位：{{nursingHomeName}}业务部</p>
            <p>
              <span>2020年3月12日</span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <p class="measure_content">
          本人
          <span class="info3"></span>
          系
          <span class="info3"></span>
          老人的担保人（家属），对于院方针对老人提出的风险评估和使用安全保护措施的
          告知书，本人已经知晓，并同意院方评估结果和使用保护措施的建议。
        </p>
        <div class="sign_date">
          <div class="sign_date_div">
            <p>被告知人（担保人）</p>
            <p>
              <span>2020年3月12日</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tenant from '@/components/_tenant';
  export default {
    props: {
      elderData: {
        type: Object,
        default() {
          return {
            elderId: "",
            baseInfo: {}, //基础信息和入住管理的数据
            familyData: {}, //家属信息
            healthInfo: {}, //健康状况
            careAssess: [] //照护评估
          };
        }
      }
    },
    data() {
      return {
        createTime: "",
        changeInfo: {},
        firstChange: {
          printBedVos: "",
          printNursingVos: "",
          estimatePrintVos: "",
          agreeOutPrintVos: "",
          agreeMedicinePrintVos: "",
          bedTime: "",
          nursingTime: "",
          outTime: "",
          medicineTime: ""
        },
        secondeChange: {
          printBedVos: "",
          printNursingVos: "",
          estimatePrintVos: "",
          agreeOutPrintVos: "",
          agreeMedicinePrintVos: "",
          bedTime: "",
          nursingTime: "",
          outTime: "",
          medicineTime: ""
        },
        nursingHomeName:''
      }
    },
    created(){
      tenant.fetchCurrentTenant().then(t => {
        this.nursingHomeName = t.tenantName; // 租户名称
      });
      if(this.$route.query.createTime){
        this.elderData.elderId = this.$route.query.elderId;
        this.createTime = this.$route.query.createTime;
      }
      this.assembleData();
    },
    methods:{
      //处理数据
      assembleData(){
        this.changeData();
      },
      //老人变更事项数据
      changeData(){
        let data = {};
        if(this.createTime){
          data = {
            elderId: this.elderData.elderId,
            createTime: this.createTime
          };
        }else{
          data = {
            elderId: this.elderData.elderId
          };
        }
        axios.fetch('elderServer', '/elderChange/print', data).then(res => {
          this.assembleChange(res.data);
        });
      },
      //处理变更数据
      assembleChange(data){
        this.changeInfo = data;
        this.changeInfo.createTime = this.changeInfo.createTime.slice(0,10)
        //第一次变更
        this.firstChange = {
          printBedVos: data.printBedVos[1] !== undefined ?data.printBedVos[1].currentBedFee:"",
          printNursingVos: data.printNursingVos[1] !== undefined ?data.printNursingVos[1].currentNursingFee:"",
          estimatePrintVos: data.estimatePrintVos[1] !== undefined ?data.estimatePrintVos[1].currentDescription:"",
          agreeOutPrintVos: data.agreeOutPrintVos[1] !== undefined ?data.agreeOutPrintVos[1].currentDescription:"",
          agreeMedicinePrintVos: data.agreeMedicinePrintVos[1] !== undefined?data.agreeMedicinePrintVos[1].currentDescription:"",
          bedTime: data.printBedVos[1] !== undefined?data.printBedVos[1].currentStart:"",
          nursingTime: data.printNursingVos[1] !== undefined ?data.printNursingVos[1].currentStart:"",
          outTime: data.agreeOutPrintVos[1] !== undefined ?data.agreeOutPrintVos[1].currentStart:"",
          medicineTime: data.agreeMedicinePrintVos[1] !== undefined ?data.agreeMedicinePrintVos[1].currentStart:"",
        }
        //第二次变更
        this.secondeChange = {
          printBedVos: data.printBedVos[0].currentBedFee?data.printBedVos[0].currentBedFee:"",
          printNursingVos: data.printNursingVos[0].currentNursingFee?data.printNursingVos[0].currentNursingFee:"",
          estimatePrintVos: data.estimatePrintVos[0].currentDescription?data.estimatePrintVos[0].currentDescription:"",
          agreeOutPrintVos: data.agreeOutPrintVos[0].currentDescription?data.agreeOutPrintVos[0].currentDescription:"",
          agreeMedicinePrintVos: data.agreeMedicinePrintVos[0].currentDescription?data.agreeMedicinePrintVos[0].currentDescription:"",
          bedTime: data.printBedVos[0].currentStart?data.printBedVos[0].currentStart:"",
          nursingTime: data.printNursingVos[0].currentStart?data.printNursingVos[0].currentStart:"",
          outTime: data.agreeOutPrintVos[0].currentStart?data.agreeOutPrintVos[0].currentStart:"",
          medicineTime: data.agreeMedicinePrintVos[0].currentStart?data.agreeMedicinePrintVos[0].currentStart:"",
        }
      }
    },
    filters: {
      dateFormat: date => {
        if(date) {
          date = date.split(' ')[0];
          date = date.split('-')[0]+'年'+date.split('-')[1]+'月'+date.split('-')[2]+'日';
        }else {
          date = "";
        }
        return date;
      },
      outFilter: val => {
        if(val==="同意") {
          val = "能";
        }else if(val==="不同意") {
          val = "不能";
        }
        return val;
      },
      medicineFilter: val => {
        if(val==="同意") {
          val = "委托";
        }else if(val==="不同意") {
          val = "不委托";
        }
        return val;
      },
      agreeFilter: val => {
        if(val==="同意") {
          val = "接受";
        }else if(val==="不同意") {
          val = "不接受";
        }
        return val;
      },
    }
  }
</script>

<style lang="less" scoped>
  .center {
    text-align: center;
  }
  .right {
    text-align: right;
  }
  p {
    line-height: 2.5em;
  }
  .confirm_table1 p {
    line-height: 2em;
  }
  .confirm_table2 p {
    line-height: 2.3em;
  }
  .confirm_table3 p {
    line-height: 1.8em;
    
  }
  .confirm_table3{
    /deep/ td{
      padding:8px 10px;
    }
  }
  .measure {
    font-size: 18px;
    h2 {
      margin: 30px 0 50px;
    }
    .first_div {
      padding-bottom: 40px;
      border-bottom: 1px dotted black;
      margin-bottom: 50px;
    }
    .measure_content {
      text-indent:2em;
      margin:3em 0;
    }
    .sign_date {
        text-align:right;
        .sign_date_div {
          display:inline-block;
          text-align:center;
          p {
            line-height: 40px;
          }
        }
      }
  }
  span{
    &.info{
      display: inline-block;
      vertical-align: top;
      height: 21px;;
      line-height: 21px;
      text-align: center;    
      border-bottom: 1px solid #333;
      width:100px;
    }
    &.info1{
      display: inline-block;
      vertical-align: top;
      height: 21px;;
      line-height: 21px;
      text-align: center;    
      border-bottom: 1px solid #333;
      width:50px;
    }
    &.info2{
      display: inline-block;
      vertical-align: top;
      height: 21px;;
      line-height: 21px;
      text-align: center;    
      border-bottom: 1px solid #333;
      width:50px;
    }
    &.info3{
      display: inline-block;
      vertical-align: top;
      height:2em;
      line-height: 3em;
      text-align: center;    
      border-bottom: 1px solid #333;
      width:80px;
    }
  }
  .pline{
    h2{
      font-weight: normal;
    }
    p{
      width:100%;
      border-bottom: 1px solid #333;
      height: 37px;
      line-height: 38px;
    }
  }
</style>