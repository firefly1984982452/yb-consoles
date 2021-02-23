<template>
  <div class="page">
    <h2 class="title">首次入住健康状况</h2>
    <table cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td>乙方姓名</td>
        <td>{{elderData.baseInfo.elderName}}</td>
        <td>性别</td>
        <td>{{elderData.baseInfo.gender}}</td>
        <td>出生年月</td>
        <td>{{elderData.baseInfo.birthDay | dateFormat}}</td>
      </tr>
      <tr>
        <td>入住部门</td>
        <td colspan="3"><span v-if="elderData.baseInfo.bedName">{{elderData.baseInfo.buildingName}}-{{elderData.baseInfo.roomName}}-{{elderData.baseInfo.bedName}}</span></td>
        <td>护理等级</td>
        <td>{{elderData.baseInfo.nursingLevel | levelFilter}}</td>
      </tr>
      <tr>
        <td>丙方姓名</td>
        <td colspan="3">{{elderData.familyData.relationName}}</td>
        <td>与老人关系</td>
        <td>{{elderData.familyData.relationType}}</td>
      </tr>
      <tr>
        <td colspan="6" class="info">
          <h3>既往病史介绍</h3>
          <!-- <p v-show="medicalHistory"> -->
            <p>{{medicalHistory}}</p>
            <!-- <p><input type="checkbox" :checked="medicalHistory.indexOf('高血压')!==-1?'checked':''"/>高血压</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('糖尿病')!==-1?'checked':''"/>糖尿病</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('老年性痴呆')!==-1?'checked':''"/>老年性痴呆</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('冠心病')!==-1?'checked':''"/>冠心病</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('骨质疏松')!==-1?'checked':''"/>骨质疏松</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('脑血管意外')!==-1?'checked':''"/>脑血管意外</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('脑出血')!==-1?'checked':''"/>脑出血</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('脑梗塞')!==-1?'checked':''"/>脑梗塞</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('帕金森氏综合征')!==-1?'checked':''"/>帕金森氏综合征</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('脑瘫')!==-1?'checked':''"/>脑瘫</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('心肌梗塞')!==-1?'checked':''"/>心肌梗塞</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('抑郁倾向')!==-1?'checked':''"/>抑郁倾向</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('肺气肿')!==-1?'checked':''"/>肺气肿</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('慢性消化系统疾病')!==-1?'checked':''"/>慢性消化系统疾病</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('白内障')!==-1?'checked':''"/>白内障</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('心肌病')!==-1?'checked':''"/>心肌病</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('肺源性心脏病')!==-1?'checked':''"/>肺源性心脏病</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('慢性支气管炎')!==-1?'checked':''"/>慢性支气管炎</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('青光眼')!==-1?'checked':''"/>青光眼</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('慢性心衰')!==-1?'checked':''"/>慢性心衰</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('肺管炎')!==-1?'checked':''"/>肺管炎</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('肺结核')!==-1?'checked':''"/>肺结核</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('支气管哮喘，扩张')!==-1?'checked':''"/>支气管哮喘，扩张</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('泌尿系结石')!==-1?'checked':''"/>泌尿系结石</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('消化道出血')!==-1?'checked':''"/>消化道出血</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('气胸')!==-1?'checked':''"/>气胸</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('甲状腺')!==-1?'checked':''"/>甲状腺</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('肝炎')!==-1?'checked':''"/>肝炎</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('前列腺炎')!==-1?'checked':''"/>前列腺炎</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('心脏瓣膜病')!==-1?'checked':''"/>心脏瓣膜病</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('痛风')!==-1?'checked':''"/>痛风</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('关节炎')!==-1?'checked':''"/>关节炎</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('红斑狼疮')!==-1?'checked':''"/>红斑狼疮</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('贫血')!==-1?'checked':''"/>贫血</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('胃溃疡')!==-1?'checked':''"/>胃溃疡</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('皮肤病')!==-1?'checked':''"/>皮肤病</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('美尼尔氏综合征')!==-1?'checked':''"/>美尼尔氏综合征</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('肿瘤')!==-1?'checked':''"/>肿瘤</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('重症肌无力')!==-1?'checked':''"/>重症肌无力</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('焦虑症')!==-1?'checked':''"/>焦虑症</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('肝硬化')!==-1?'checked':''"/>肝硬化</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('听力受损')!==-1?'checked':''"/>听力受损</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('失聪')!==-1?'checked':''"/>失聪</p>
            <p><input type="checkbox" :checked="medicalHistory.indexOf('肢体骨折')!==-1?'checked':''"/>肢体骨折</p> -->
          <!-- </p> -->
          <br />
          <br />
            <div class="clr"></div>
            <p>其它疾病: {{elderData.healthInfo.medicalOther}}</p>
        </td>
      </tr>
      <tr>
        <td colspan="6" class="info">
          <h3>现有病史介绍</h3>
          <p>{{medicalCurrent}}</p>
          <!-- <p v-show="medicalCurrent"> -->
            <!-- <p><input type="checkbox" :checked="medicalCurrent.indexOf('高血压')!==-1?'checked':''"/>高血压</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('糖尿病')!==-1?'checked':''"/>糖尿病</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('老年性痴呆')!==-1?'checked':''"/>老年性痴呆</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('冠心病')!==-1?'checked':''"/>冠心病</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('骨质疏松')!==-1?'checked':''"/>骨质疏松</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('脑血管意外')!==-1?'checked':''"/>脑血管意外</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('脑出血')!==-1?'checked':''"/>脑出血</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('脑梗塞')!==-1?'checked':''"/>脑梗塞</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('帕金森氏综合征')!==-1?'checked':''"/>帕金森氏综合征</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('脑瘫')!==-1?'checked':''"/>脑瘫</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('心肌梗塞')!==-1?'checked':''"/>心肌梗塞</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('抑郁倾向')!==-1?'checked':''"/>抑郁倾向</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('肺气肿')!==-1?'checked':''"/>肺气肿</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('慢性消化系统疾病')!==-1?'checked':''"/>慢性消化系统疾病</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('白内障')!==-1?'checked':''"/>白内障</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('心肌病')!==-1?'checked':''"/>心肌病</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('肺源性心脏病')!==-1?'checked':''"/>肺源性心脏病</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('慢性支气管炎')!==-1?'checked':''"/>慢性支气管炎</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('青光眼')!==-1?'checked':''"/>青光眼</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('慢性心衰')!==-1?'checked':''"/>慢性心衰</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('肺管炎')!==-1?'checked':''"/>肺管炎</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('肺结核')!==-1?'checked':''"/>肺结核</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('支气管哮喘，扩张')!==-1?'checked':''"/>支气管哮喘，扩张</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('泌尿系结石')!==-1?'checked':''"/>泌尿系结石</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('消化道出血')!==-1?'checked':''"/>消化道出血</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('气胸')!==-1?'checked':''"/>气胸</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('甲状腺')!==-1?'checked':''"/>甲状腺</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('肝炎')!==-1?'checked':''"/>肝炎</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('前列腺炎')!==-1?'checked':''"/>前列腺炎</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('心脏瓣膜病')!==-1?'checked':''"/>心脏瓣膜病</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('痛风')!==-1?'checked':''"/>痛风</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('关节炎')!==-1?'checked':''"/>关节炎</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('红斑狼疮')!==-1?'checked':''"/>红斑狼疮</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('贫血')!==-1?'checked':''"/>贫血</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('胃溃疡')!==-1?'checked':''"/>胃溃疡</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('皮肤病')!==-1?'checked':''"/>皮肤病</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('美尼尔氏综合征')!==-1?'checked':''"/>美尼尔氏综合征</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('肿瘤')!==-1?'checked':''"/>肿瘤</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('重症肌无力')!==-1?'checked':''"/>重症肌无力</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('焦虑症')!==-1?'checked':''"/>焦虑症</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('肝硬化')!==-1?'checked':''"/>肝硬化</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('听力受损')!==-1?'checked':''"/>听力受损</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('失聪')!==-1?'checked':''"/>失聪</p>
            <p><input type="checkbox" :checked="medicalCurrent.indexOf('肢体骨折')!==-1?'checked':''"/>肢体骨折</p> -->
          <!-- </p> -->
          <br />
          <br />
          <div class="clr"></div>
          其它疾病: {{elderData.healthInfo.medicalOther}}
        </td>
      </tr>
      <tr>
        <td colspan="6">现服药情况：</td>
      </tr>
      <tr>
        <td colspan="6">
          <p>注：1、乙方申请入住甲方时，由乙方或丙方填写，介绍乙方所患疾病情况。</p>
          <!-- <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、在“口”内用“√”表示确认患有疾病</p> -->
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    props:['elderData'],
    computed:{
      medicalHistory(){
        return this.elderData.healthInfo.medicalHistory?this.elderData.healthInfo.medicalHistory:''
      },
      medicalCurrent(){
        return this.elderData.healthInfo.medicalCurrent?this.elderData.healthInfo.medicalCurrent:''
      }
      
    },
    filters: {
      dateFormat: date => {
        if(date) {
          date = date.split('-')[0]+'年'+date.split('-')[1]+'月'+date.split('-')[2]+'日';
        }else {
          date = "";
        }
        return date;
      },
      //院方护理等级
      levelFilter: val => {
				if(val == 0) {
					val = "无护理";
				} else if(val == 1) {
					val = "护理一级";
				} else if(val == 2) {
					val = "护理二级";
				} else if(val == 3) {
					val = "护理三级";
				} else if(val == 4) {
					val = "护理四级";
				} else if(val == 5) {
					val = "护理五级";
				}else if(val == 6) {
					val = "护理六级";
				}
				return val;
			},
    }
  }
</script>

<style lang="less" scoped>
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
    &.table{
      /deep/ td{
        padding:5px;
      }
    }
  }
  h3{
    font-weight: normal;
  }
  .info{
    p{
      display: block;
      float: left;      
      width:100%;
      height: 21px;
      margin: 2px;
      input{
        margin-right: 2px;
      }
    }
  }
  .clr{
    clear: both;
  }
</style>