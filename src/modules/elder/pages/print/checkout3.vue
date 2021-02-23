<template>
  <div>
    <div class="page signTable">
      <h2 class="title fontWeight">养老机构住养老人个人物品移交签收表</h2>
      <p>养老机构（长者照护之家）：</p>
      <table cellspacing="0" cellpadding="0" class="table">
        <tr>
          <td style="width:8em;">老人姓名</td>
          <td>{{elderCheckoutFlowVo.elderName}}</td>
          <td style="width:8em;">性别</td>
          <td>{{elderCheckoutFlowVo.gender}}</td>
        </tr>
        <tr>
          <td>身份证号</td>
          <td>{{elderCheckoutFlowVo.cardNo}}</td>
          <td>房间号</td>
          <td>{{elderCheckoutFlowVo.roomName}}</td>
        </tr>
        <tr>
          <td>入院日期</td>
          <td>{{elderServiceEndVo.checkinDate}}</td>
          <td>离院日期</td>
          <td>{{elderServiceEndVo.checkoutDate}}</td>
        </tr>
        <tr>
          <td>移交日期</td>
          <td></td>
          <td>接收人</td>
          <td></td>
        </tr>
        <tr>
          <td>序号</td>
          <td>个人物品内容</td>
          <td>数量</td>
          <td>备注</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td colspan="4">  
            <p style="text-indent:2em;text-align:left;">本单位（人）保证所移交的物品为老人的个人用品，且承诺未有替换、窃取、非法占有，如有上述情况，愿意承担相关责任。</p>
            <p style="text-align: right;margin-right: 30%;">移交单位/人（公章/签字）：</p>
            <p style="text-align: right;margin-right: 10%;">
              <span v-if="elderCheckoutFlowVo.businessTime">{{elderCheckoutFlowVo.businessTime | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            </p>
          </td>
        </tr>
        <tr>
          <td colspan="4">  
            <p style="text-indent:2em;text-align:left;">本人确认所接收的物品为老人的个人物品，且完整、齐全</p>
            <p style="text-align: right;margin-right: 15%;">接收人（签字）：
              <img class="sign-img" v-if="elderServiceEndVo.guarantorSign" :src="elderServiceEndVo.guarantorSign" alt="">
              <span class="sign-img" v-else alt=""></span>
            </p>
            <p style="text-align: right;margin-right: 10%;">
              <span v-if="elderCheckoutFlowVo.businessTime">{{elderCheckoutFlowVo.businessTime | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            </p>
          </td>
        </tr>
      </table>
      <p>注：此表一式两份，移交单位（人）和接收人各留一份</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        elderId: "",
        elderCheckoutFlowVo: {}, //离院流转表
        elderServiceEndVo: {}, //服务终结表
      }
    },
    created(){
      this.elderId = this.$route.query.elderId;
      this.initData();
    },
    methods:{
      //初始化数据
      initData(){
        let data = {
          elderId: this.elderId
        };
        axios.fetch('elderServer', '/elderCheckout/print', data).then(res => {
          this.elderCheckoutFlowVo = res.data.elderCheckoutFlowVo;
          this.elderServiceEndVo = res.data.elderServiceEndVo;
        });
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
    }
  }
</script>
<style lang="less" scoped>
.sign-img{
  width: 100px;
  height: 50px;
  display: inline-block;
}
.fontWeight {
  font-weight: bold;
}
.singleWord {
  width: 1em;
  line-height: 36px;
}
.width22 {
  span {
    display: inline-block;
    width: 22%;
  }
}
.applicant {
  padding-left: 50px;
  text-align: left;
  span {
    line-height: 30px;
    display: block;
    input {
      margin-right: 10px;
    }
  }
}
.record {
  position: relative;
  .handleName {
    position: absolute;
    bottom: 20%;
    min-width: 200px;
    right: 3%;
    font-size: 18px;
    text-align: left;
    display: flex;
    line-height: 40px;
    height: 40px;
    img.leaderSign {
      width: 80px;
      height: 40px;
      line-height: 40px;
    }
  }
  .handTime {
    position: absolute;
    bottom: 0;
    right: 10%;
  }
}   
.signTable {
  td {
    height: 1.3em;
  }
}
.td_title table {
  tr td{
    text-align: left;
    &.bottom {
      vertical-align: bottom;
    }
    .right {
      float: right;
      margin-right: 30%;
    }
  }
  tr td:first-child{
    width: 2em;
    padding: 30px;
    line-height: 30px;
    font-size: 20px;
  }
  tr:last-child td:first-child{
    width: 4em;
    padding: 15px;
  }
}
table td{
  text-align: center;
}
p{
  margin: 10px 0;
  &.remark {
    font-size: 12px;
  }
  &.right{
    text-align: right;
  }
}
</style>