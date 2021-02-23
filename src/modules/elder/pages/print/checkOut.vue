<template>
  <div>
    <div class="page td_title">
      <h2 class="title">出院流转表</h2>
      <table cellspacing="0" cellpadding="0" class="table">
        <tbody>
          <tr>
              <td>老人信息</td>
              <td>
                  <p>现有
                      <span v-if="elderCheckoutFlowVo.buildingName">{{elderCheckoutFlowVo.buildingName}}</span><span v-else>_________</span>部门
                      <span v-if="elderCheckoutFlowVo.roomName">{{elderCheckoutFlowVo.roomName}}</span><span v-else>________</span>室号
                      <span v-if="elderCheckoutFlowVo.bedName">{{elderCheckoutFlowVo.bedName}}</span><span v-else>_________</span>床号老人，因下列原因
                  </p>
                  <p class="width22">
                      <span><input type="checkbox" :checked="elderCheckoutFlowVo.checkoutRemark==='自动出院'?'checked':''"/>自动出院</span>
                      <span><input type="checkbox" :checked="elderCheckoutFlowVo.checkoutRemark==='本院死亡'?'checked':''"/>本院死亡</span>
                      <span><input type="checkbox" :checked="elderCheckoutFlowVo.checkoutRemark==='外院死亡'?'checked':''"/>外院死亡</span>
                      <span><input type="checkbox" :checked="elderCheckoutFlowVo.checkoutRemark==='其他'?'checked':''"/>其他</span>
                  </p>
                  <p>
                      <span>
                        申请人
                        <span v-if="elderCheckoutFlowVo.applyName">{{elderCheckoutFlowVo.applyName}}</span>
                        <span v-else>_________</span>
                      </span>
                      <span class="right">
                        <span v-if="elderCheckoutFlowVo.applyTime">{{elderCheckoutFlowVo.applyTime | dateFormat}}</span>
                        <span v-else>_____年____月_____日</span>
                      </span>
                  </p>
              </td>
          </tr>
          <tr>
              <td>护理部门</td>
              <td class="bottom">
                  <span>
                    负责人签字
                    <span v-if="elderCheckoutFlowVo.nurseName">{{elderCheckoutFlowVo.nurseName}}</span>
                    <span v-else>_________</span>
                  </span>
                  <span class="right">
                    <span v-if="elderCheckoutFlowVo.nurseTime">{{elderCheckoutFlowVo.nurseTime | dateFormat}}</span>
                    <span v-else>_____年____月_____日</span>
                  </span>
              </td>
          </tr>
          <tr>
              <td>医务部门</td>
              <td class="bottom">
                  <span>
                    负责人签字
                    <span v-if="elderCheckoutFlowVo.medicalName">{{elderCheckoutFlowVo.medicalName}}</span>
                    <span v-else>_________</span>
                  </span>
                  <span class="right">
                    <span v-if="elderCheckoutFlowVo.medicalTime">{{elderCheckoutFlowVo.medicalTime | dateFormat}}</span>
                    <span v-else>_____年____月_____日</span>
                  </span>
              </td>
          </tr>
          <tr>
              <td>总务部门</td>
              <td class="bottom">
                <span>
                  负责人签字
                  <span v-if="elderCheckoutFlowVo.generalName">{{elderCheckoutFlowVo.generalName}}</span>
                  <span v-else>_________</span>
                </span>
                <span class="right">
                  <span v-if="elderCheckoutFlowVo.generalTime">{{elderCheckoutFlowVo.generalTime | dateFormat}}</span>
                  <span v-else>_____年____月_____日</span>
                </span>
              </td>
          </tr>
          <tr>
              <td>财务部门</td>
              <td class="bottom">
                  <span>
                    负责人签字
                    <span v-if="elderCheckoutFlowVo.financeName">{{elderCheckoutFlowVo.financeName}}</span>
                    <span v-else>_________</span>
                  </span>
                  <span class="right">
                    <span v-if="elderCheckoutFlowVo.financeTime">{{elderCheckoutFlowVo.financeTime | dateFormat}}</span>
                    <span v-else>_____年____月_____日</span>
                  </span>
              </td>
          </tr>
          <tr>
              <td><p>入出院</p><p>管理部门</p></td>
              <td class="bottom">
                <span>
                  负责人签字
                  <span v-if="elderCheckoutFlowVo.businessName">{{elderCheckoutFlowVo.businessName}}</span>
                  <span v-else>_________</span>
                </span>
                <span class="right">
                  <span v-if="elderCheckoutFlowVo.businessTime">{{elderCheckoutFlowVo.businessTime | dateFormat}}</span>
                  <span v-else>_____年____月_____日</span>
                </span>
              </td>
          </tr>
        </tbody>
      </table>
      <p class="remark right">{{nursingHomeName}}制</p>
      <p class="remark">注：1.护理部门负责老人生活用品等清理；医务部门负责对治疗费用结清；总务部门负责对伙食费等进行结清，财务部门负责总结账。</p>
      <p class="remark">2.入出院管理部门负责说明手续齐全可出院，并负责材料归档。</p>
    </div>
    <div class="page">
      <h2 class="title fontWeight">服务终结记录</h2>
      <table cellspacing="0" cellpadding="0" class="table">
        <tr>
          <td colspan="2" class="fontWeight">服务对象</td>
          <td>{{elderServiceEndVo.elderName}}</td>
          <td class="fontWeight" style="width:8em;">入院日期</td>
          <td>{{elderServiceEndVo.checkinDate}}</td>
          <td class="fontWeight" style="width:8em;">离院日期</td>
          <td>{{elderServiceEndVo.checkoutDate}}</td>
        </tr>
        <tr>
          <td colspan="2" class="fontWeight">担保人</td>
          <td>{{elderServiceEndVo.relationName}}</td>
          <td class="fontWeight">双方关系</td>
          <td>{{elderServiceEndVo.relationType}}</td>
          <td class="fontWeight">联系电话</td>
          <td>{{elderServiceEndVo.mobilePhone}}</td>
        </tr>
        <tr>
          <td colspan="2" class="fontWeight singleWord" style="padding:50px;">终止申请方</td>
          <td colspan="5" class="record">
            <p class="applicant">
              <span><input type="checkbox" :checked="elderServiceEndVo.checkoutRemark==='自动出院'?'checked':''"/>1、自动出院</span>
              <span><input type="checkbox" :checked="elderServiceEndVo.checkoutRemark==='本院死亡'?'checked':''"/>2、本院死亡</span>
              <span><input type="checkbox" :checked="elderServiceEndVo.checkoutRemark==='外院死亡'?'checked':''"/>3、外院死亡</span>
              <span><input type="checkbox" :checked="elderServiceEndVo.checkoutRemark==='其他'?'checked':''"/>4、其他</span>
            </p>
            <!-- <p class="handleName">担保人：{{elderServiceEndVo.guarantorSign}}</p>  -->
            <p class="handleName">担保人：<img class="leaderSign" :src="elderServiceEndVo.guarantorSign?elderServiceEndVo.guarantorSign:''" alt=""></p> 
            <p class="handTime">
              <span v-if="elderServiceEndVo.guarantorTime">{{elderCheckoutFlowVo.guarantorTime | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            </p>
          </td>
        </tr>
        <tr>
          <td rowspan="2" class="fontWeight singleWord" style="padding: 0 20px;">机构服务意见</td>
          <td class="fontWeight singleWord" style="padding: 60px 20px;">出入院</td>
          <td colspan="5" class="record">
            <p class="applicant">
              <span>{{elderServiceEndVo.operatorRemark}}</span>
            </p>
            <!-- <p class="handleName">经办人：{{elderServiceEndVo.operatorSign}}</p> -->
            <p class="handleName">经办人：<img class="leaderSign" :src="elderServiceEndVo.operatorSign?elderServiceEndVo.operatorSign:''" alt=""></p>
            <p class="handTime">
              <span v-if="elderServiceEndVo.operatorTime">{{elderServiceEndVo.operatorTime | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            </p>
          </td>
        </tr>
        <tr>
          <td class="fontWeight singleWord" style="padding: 60px 20px;">院部</td>
          <td colspan="5" class="record">
            <p class="applicant">
              <span>{{elderServiceEndVo.leaderRemark}}</span>
            </p>
            <!-- <p class="handleName" style="bottom:36%;">院长签字：{{elderServiceEndVo.leaderSign}}</p> -->
            <p class="handleName" style="bottom:36%;">院长签字：<img class="leaderSign" :src="elderServiceEndVo.leaderSign?elderServiceEndVo.leaderSign:''" alt=""></p>
            <p class="handleName">盖章：</p>  
            <p class="handTime">
              <span v-if="elderServiceEndVo.leaderTime">{{elderServiceEndVo.leaderTime | dateFormat}}</span>
              <span v-else>_____年____月____日</span>
            </p>
          </td>
        </tr>
      </table>
      <p class="remark right">{{nursingHomeName}}制</p>
    </div>
    <div class="page signTable">
      <h2 class="title fontWeight">养老机构住养老人个人物品移交签收表</h2>
      <p>养老机构（长者照护之家）：</p>
      <table cellspacing="0" cellpadding="0" class="table">
        <tr>
          <td style="width:8em;">老人姓名</td>
          <td></td>
          <td style="width:8em;">性别</td>
          <td></td>
        </tr>
        <tr>
          <td>身份证号</td>
          <td></td>
          <td>房间号</td>
          <td></td>
        </tr>
        <tr>
          <td>入院日期</td>
          <td></td>
          <td>离院日期</td>
          <td></td>
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
            <p style="text-align: right;margin-right: 30%;">接收人（签字）：</p>
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
    }
  }
</script>
<style lang="less" scoped>
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