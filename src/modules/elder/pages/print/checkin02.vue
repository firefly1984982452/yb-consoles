<template>
  <div class="page">
    <h2 class="title">审批表</h2>
    <table cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td colspan="6">老人基本信息</td>
      </tr>
      <tr>
        <td>姓名</td>
        <td>{{elderData.baseInfo.elderName}}</td>
        <td>性别</td>
        <td>{{elderData.baseInfo.gender}}</td>
        <td>出生年月</td>
        <td>{{elderData.baseInfo.birthDay | dateFormat}}</td>
      </tr>
      <tr>
        <td>籍贯</td>
        <td>{{elderData.baseInfo.birthPlace}}</td>
        <td>民族</td>
        <td>{{elderData.baseInfo.nation}}</td>
        <td>身份证号</td>
        <td>{{elderData.baseInfo.cardNo}}</td>
      </tr>
      <tr>
        <td>政治面貌</td>
        <td colspan="2">{{elderData.baseInfo.polity}}</td>
        <td>社保卡号</td>
        <td colspan="2">{{elderData.baseInfo.insuranceNo}}</td>
      </tr>
      <tr>
        <td>婚姻状况</td>
        <td colspan="5">
          <input type="checkbox" :checked="elderData.baseInfo.marriage==='已婚'?'checked':''"/>已婚
          <input type="checkbox" :checked="elderData.baseInfo.marriage==='未婚'?'checked':''"/>未婚
          <input type="checkbox" :checked="elderData.baseInfo.marriage==='丧偶'?'checked':''"/>丧偶
          <input type="checkbox" :checked="elderData.baseInfo.marriage==='离异'?'checked':''"/>离异
        </td>
      </tr>
      <tr>
        <td>受教育程度</td>
        <td colspan="5">
          <input type="checkbox" :checked="elderData.baseInfo.educational==='小学及以下'?'checked':''"/>小学及以下
          <input type="checkbox" :checked="elderData.baseInfo.educational==='初中'?'checked':''"/>初中
          <input type="checkbox" :checked="elderData.baseInfo.educational==='高中'?'checked':''"/>高中
          <input type="checkbox" :checked="elderData.baseInfo.educational==='大专'?'checked':''"/>大专
          <input type="checkbox" :checked="elderData.baseInfo.educational==='本科'?'checked':''"/>本科
          <input type="checkbox" :checked="elderData.baseInfo.educational==='研究生及以上'?'checked':''"/>研究生及以上
        </td>
      </tr>
      <tr>
        <td>户口所在地</td>
        <td colspan="5">
          {{elderData.baseInfo.registerProvince}}{{elderData.baseInfo.registerCity}}
          {{elderData.baseInfo.registerDistrict}}{{elderData.baseInfo.registerStreet}}
          {{elderData.baseInfo.registerAddress}}
        </td>
      </tr>
      <tr>
        <td>现居住地址</td>
        <td colspan="5">
          {{elderData.baseInfo.residenceProvince}}{{elderData.baseInfo.residenceCity}}
          {{elderData.baseInfo.residenceDistrict}}{{elderData.baseInfo.residenceStreet}}
          {{elderData.baseInfo.residenceAddress}}
        </td>
      </tr>
      <tr>
        <td rowspan="3">联系人情况</td>
        <td>姓名</td>
        <td colspan="2">{{elderData.familyData.relationName}}</td>
        <td>与老人关系</td>
        <td>{{elderData.familyData.relationType}}</td>
      </tr>
      <tr>
        <td>电话</td>
        <td colspan="2">{{elderData.familyData.mobilePhone}}</td>
        <td>邮政编码</td>
        <td></td>
      </tr>
      <tr>
        <td>联系地址</td>
        <td colspan="4">
          {{elderData.familyData.residenceProvince}}{{elderData.familyData.residenceCity}}
          {{elderData.familyData.residenceDistrict}}{{elderData.familyData.residenceAddress}}
        </td>
      </tr>
      <tr>
        <td>老人体检结论</td>
        <td colspan="5">
          <p v-if="elderData.healthInfo !== null">{{ elderData.healthInfo.reportResult }}</p>
          <p class="right sign">医务部门负责人签字：<img style="visibility:hidden" /></p>
        </td>
      </tr>
      <tr>
        <td>护理等级评估</td>
        <td colspan="5">
          <p>
            <input type="checkbox" :checked="elderData.baseInfo.nursingLevel===5||elderData.baseInfo.nursingLevel===6?'checked':''"/>重度（五级、六级）
            <input type="checkbox" :checked="elderData.baseInfo.nursingLevel===4?'checked':''"/>中度（四级）
            <input type="checkbox" :checked="elderData.baseInfo.nursingLevel===1||elderData.baseInfo.nursingLevel===2||elderData.baseInfo.nursingLevel===3?'checked':''"/>轻度（三级、二级、一级）
          </p>
          <p class="right sign">评估者签字：<img style="visibility:hidden" /></p>
        </td>
      </tr>
      <tr>
        <td rowspan="1">入出院管理<br />部门意见</td>
        <td colspan="5">
          <p v-if="!disagreeIn">同意入院</p>
          <p v-else>不同意入院</p>
          <div>
            <p>住院号 {{elderData.baseInfo.checkinNo}}</p>
            <p>{{elderData.baseInfo.buildingName}} 部门 {{elderData.baseInfo.roomName}} 室 {{elderData.baseInfo.bedName}}床</p>
          </div>
        <p class="right sign">负责人签名：<img v-if="elderData.baseInfo.operatorSign" :src="elderData.baseInfo.operatorSign" alt="" /><img v-else style="visibility:hidden" /></p>
        </td>
      </tr>
      <tr class="qianming">
        <td>审批意见</td>
        <td colspan="5" valign="bottom">
          <span>{{ elderData.baseInfo.leaderRemark }}</span>
          <p class="info right sign">院长签名：<img v-if="elderData.baseInfo.leaderSign" :src="elderData.baseInfo.leaderSign" alt="" /><img v-else style="visibility:hidden" /></p>
          <p class="zhang">单位盖章</p>
          <p>{{elderData.baseInfo.checkinDate | dateFormat}}</p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    props:['elderData'],
    data() {
      return {
        checked: "",
        disagreeIn: false, //不同意入院
        agreeIn: true //同意入院
      }
    },
    created(){
      this.assembleData();
    },
    methods:{
      //处理数据
      assembleData(){
        
      },
    },
    filters: {
      dateFormat: date => {
        if(date) {
          date = date.split('-')[0]+'年'+date.split('-')[1]+'月'+date.split('-')[2]+'日';
        }else {
          date = "";
        }
        return date;
      }
    }
  }
</script>

<style lang="less" scoped>
  .right {
    display: flex;
    justify-content: flex-end;
    padding-right: 100px;
  }
  /deep/ table {
    .el-checkbox__inner::after {
      border: 1px solid black;
      height: 8px;
      left: 6px;
    }
    .el-checkbox__label {
      width: 18px;
      height: 18px;
    }
    .el-checkbox__input+.el-checkbox__label {
      color: black;
      font-size: 16px;
    }
    .el-checkbox__input .el-checkbox__inner, 
    .el-checkbox__input .el-checkbox__inner{
      background-color: #fff;
      border-color: black;
    }
  }

  input{
    margin-right:6px;
  }
  .qianming{
    height:120px;
    span{
      &.info{
        margin-right: 50px;
      }
      &.zhang{
        margin-left:20px;
      }
    }
    p {
      text-align: right;
    }
    p.zhang {
      margin-right:100px;
    }
    p:nth-child(3){
      margin-right: 40px;
    }
  }
  .sign {
    height: 40px;
    line-height: 40px;
    padding-right: 0;
    img {
      height: 40px;
      width: 80px;
    }
  }
</style>