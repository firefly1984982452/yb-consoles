<template>
  <div>
    <div class="page">
      <h2 class="title fontWeight" style="text-align:center;">养老服务终止记录表</h2>
      <table cellspacing="0" cellpadding="0" class="table">
        <tr>
          <td class="fontWeight">
            <div style="width:7vw;">姓名</div>
          </td>
          <td>
            <div style="width:7vw">{{elderCheckoutFlowVo.elderName}}</div>
          </td>
          <td class="fontWeight">
            <div style="width:11vw">性别</div>
          </td>
          <td>{{elderCheckoutFlowVo.gender}}</td>
          <td class="fontWeight">
            <div style="width:12vw">出生年月</div>
          </td>
          <td>{{elderCheckoutFlowVo.birthDay}}</td>
        </tr>
        <tr>
          <td class="fontWeight">入住区域</td>
          <td>{{elderCheckoutFlowVo.area}}</td>
          <td class="fontWeight">床号</td>
          <td>{{elderCheckoutFlowVo.bedName}}</td>
          <td class="fontWeight">身份证号</td>
          <td><p style="width:220px;">{{elderCheckoutFlowVo.cardNo}}</p></td>
        </tr>
        <tr>
          <td class="fontWeight">照护等级</td>
          <td>{{elderCheckoutFlowVo.nursingLevel | filterLevel}}</td>
          <td colspan="2" class="fontWeight">评估日期（末次）</td>
          <td colspan="2">{{elderCheckoutFlowVo.estimateCreateTime}}</td>
        </tr>
        <tr>
          <td class="fontWeight">担保人姓名</td>
          <td>{{elderServiceEndVo.relationName}}</td>
          <td class="fontWeight">担保人联系电话</td>
          <td>{{elderServiceEndVo.mobilePhone}}</td>
          <td class="fontWeight">担保人与老年人关系</td>
          <td>{{elderServiceEndVo.relationType}}</td>
        </tr>
        <tr>
          <td class="fontWeight">养老服务合同终止原因</td>
          <td colspan="5">
            <p class="applicant">
              <span><input type="checkbox" :checked="elderServiceEndVo.checkoutRemark==='自动出院'?'checked':''"/>自动出院</span>
              <span><input type="checkbox" :checked="elderServiceEndVo.checkoutRemark==='本院死亡'?'checked':''"/>本院死亡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="checkbox" :checked="elderServiceEndVo.checkoutRemark==='外院死亡'?'checked':''"/>外院死亡</span>
              <span><input type="checkbox" :checked="elderServiceEndVo.checkoutRemark==='其他'?'checked':''"/>其他（需具体描述）</span>
            </p>
          </td>
        </tr>
        <tr>
          <td rowspan="4" class="fontWeight" style="width:100px">入出院管理部处置情况</td>
          <td colspan="5">
            <p style="text-align:left;">原提供的各项服务于
              <span v-if="elderServiceEndVo.checkoutDate">{{elderServiceEndVo.checkoutDate | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            予以终止</p>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <p style="text-align:left;">原签约合同于
              <span v-if="elderServiceEndVo.checkoutDate">{{elderServiceEndVo.checkoutDate | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            予以终止</p>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="record">
            <p class="applicant">
              <span>担保人签字盖章：</span>
            </p>
            <p class="handleName"><img v-show="elderServiceEndVo.guarantorSign" class="leaderSign" :src="elderServiceEndVo.guarantorSign" alt=""></p>
            <p class="handTime">
              <span v-if="elderServiceEndVo.guarantorTime">{{elderServiceEndVo.guarantorTime | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            </p>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="record">
            <p class="applicant">
              <span>机构签字盖章：</span>
            </p>
            <p class="handleName"><img v-show="elderServiceEndVo.leaderSign" class="leaderSign" :src="elderServiceEndVo.leaderSign" alt=""></p>
            <p class="handTime">
              <span v-if="elderServiceEndVo.leaderTime">{{elderServiceEndVo.leaderTime | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import tenant from '@/components/_tenant';
  export default {
    data() {
      return {
        elderId: "",
        elderCheckoutFlowVo: {}, //离院流转表
        elderServiceEndVo: {}, //服务终结表
        nursingHomeName:''
      }
    },
    created(){
      tenant.fetchCurrentTenant().then(t => {
        this.nursingHomeName = t.tenantName; // 租户名称
      });
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
      filterLevel: val => {
        return ['','一级','二级','三级','四级','五级','六级'][val]
      }
    }
  }
</script>
<style lang="less" scoped>
.print-container .title{
  padding: 0!important;
}
p{
  margin: 0!important;
}
.fontWeight {
  font-weight: bold;
  text-align: left;
  >div{
    text-align: left;
  }
}
.applicant {
  padding-left: 0px;
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
  height: 80px;
  position: relative;
  .handleName {
    position: absolute;
    bottom: 36%;
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
table td{
  text-align: left;
}
</style>