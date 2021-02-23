<template>
  <div>
    <div class="page">
      <h2 class="title">上海市养老服务合同</h2>
      <span class="smallinfo">(2019机构版)</span>
      <h4>甲 方 (养老机构):{{contractInfo.tenantName}}</h4>
      <h4>乙 方 (入住老年人): {{contractInfo.elderName}}</h4>
      <h4>丙 方 (担保人): {{contractInfo.relationName}}</h4>
      <p>根据《中华人民共和国合同法》 《中华人民共和国老年人权益保障法》 《上海市老年人权益保障条例》 《上海市养老机构条例》及有关法律、法规的规定，甲方、乙方、丙方本着平等、自愿、诚实信的原则，经协商一致，签订本合同。</p>
      
      <h3>第一条　服务内容 </h3>
      <p>甲方根据本市老年照护等级评估等相关标准，确定乙方照护等级为{{contractInfo.nursingLevel | levelFilter}}。甲方为乙方提供相应服务，见《首次服务项目确认表》(附件1)。</p>
      
      <h3>第二条　服务期限 </h3>
      <p>本合同服务期限为
        <span v-if="contractInfo.serviceInterval">{{contractInfo.serviceInterval}}</span>
        <span v-else>1</span>
        年， 
        <span v-if="contractInfo.serviceStartDate">{{contractInfo.serviceStartDate | dateFormat}}</span>
        <span v-else>_______</span>
        起至
        <span v-if="contractInfo.serviceEndDate">{{contractInfo.serviceEndDate | dateFormat}}</span>
        <span v-else>_______</span>
        止，其中首月为试住观察期。试住期为
        <span v-if="contractInfo.probationInterval">{{contractInfo.probationInterval}}</span>
        <span v-else>30</span>
        日，至
        <span v-if="contractInfo.probationStartDate">{{contractInfo.probationStartDate | dateFormat}}</span>
        <span v-else>_______</span>
        起至
        <span v-if="contractInfo.probationEndDate">{{contractInfo.probationEndDate | dateFormat}}</span>
        <span v-else>_______</span>
        止(原则上不超过30日)。</p>

      <h3>第三条　费用 </h3>
      <p>1、乙方向甲方支付费用明细如下： </p>
      <p>(1) 服务费用
        <span v-if="contractInfo.serviceFee">{{contractInfo.serviceFee}}</span>
        <span v-else>_______</span>
        元/月，包括床位费：
        <span v-if="contractInfo.bedFee">{{contractInfo.bedFee}}</span>
        <span v-else>_______</span>
        元/月，护理费:
        <span v-if="contractInfo.careFee">{{contractInfo.careFee}}</span>
        <span v-else>_______</span>
        元/月；</p>
      <p>(2) 膳食费：
        <span v-if="contractInfo.dietFee">{{contractInfo.dietFee}}</span>
        <span v-else>_______</span>
        元/天；</p>
      <p>(3) 其它费用：
        <span v-if="contractInfo.otherFeeRemark">{{contractInfo.otherFeeRemark}}</span>
        <span v-else>_______</span>，
        <span v-if="contractInfo.otherFee">{{contractInfo.otherFee}}</span>
        <span v-else>_______</span>
        元/月。</p>
      <p>2. 费用按现金支付方式支付：</p>
      <P>(1) 按月支付(每月15 - 25日前支付当月费用)</P>
      <p>(2)其它：无。</p>
      <p>3. 试住期按以上标准，根据实际入住天数结算费用。</p>

      <h3>第四条　入住保证金</h3>
      <p>1. 自本合同签订之日起 3 日内，乙方向甲方支付入住保证金、金额为壹万圆整 (原则上不超过月费用的四倍)。本合同终止后，甲方根据实际使用情况向乙方无息返还入住保证金。</p>
      <p>2. 入住保证金的用途为补足月费用、医疗费、违约金、赔偿金及其它经乙方同意的甲方为乙方垫付的费用。</p>
      <p>3. 乙方未按规定期限支付本合同第三条约定的费用超过 30 日的，经甲方书面催告仍不支付的，甲方有权将入住保证金的部分或全部直接抵付相应费用。入住保证金抵付后，乙方应在收到甲方付款通知后__3_日内，补足入住保证金。</p>
      
      <h3>第五条　合同的变更</h3>
      <p>1. 甲方在乙方入住期间对其身体状况进行持续评估。根据评估结果，需要调整乙方相应的照护等级、服务内容和服务费用的，经乙方确认，变更合同的有关内容，见《变更事项确认表(1-3)(附件3)。</p>
      <p>2. 乙方对评估结果有异议的，可自行向有资质的第三方机构申请复评，根据复评结果，仍需要调整乙方相应的照护等级、服务内容和服务费用的，经乙方确认，变更合同的有关内容，见《变更事项确认表》(1-3)(附件3)</p>

      <h3>第六条　甲方权利义务</h3>
      <p>1. 乙方出现机能进行性衰退、认知能力下降、精神异常导致行为不能自主，危及自身或他人安的，经丙方同意（紧急情况除外），甲方有权采取必要的安全保护措施。</p>
      <p>2. 甲方向乙方提供符合有关国家、行业、地方标准和规范要求以及本合同约定的服务。</p>
      <p>3. 甲方的收费标准和调整遵守本市养老机构服务收费管理的相关现定。</p>
      <p>4. 甲方定期组织所在地的医疗卫生机构为乙方开展体检，建立包含乙方的入住登记表、体检报告、日常费用开支情况等信息在内的个人档案资料。</p>
      <p>5. 乙方需外出就医的，甲方应及时告知丙方并由丙方携乙方就诊。紧急情况下，甲方可送急诊处置，由此产生的医疗费等相关费用由乙方承担。</p>
      <p>6. 自乙方委托甲方管理其外出就诊所配药品并办理药品移交手续之日起，甲方应按卫生行政部门的规定及相关医嘱，提供相应的服务与管理。</p>

      <h3>第七条　乙方权利义务</h3>
      <p>1. 乙方有权查阅、复印甲方为其建立的个人档案资料，对自身的健康状况、费用支出等享有知情权。</p>
      <p>2. 乙方享有人身、财产安全依法受保护的权利，乙方人格尊严应当受到尊重。</p>
      <p>3. 乙方有优先续约权，可以在合同期满30日前提出续约。</p>
      <p>4. 乙方应当向甲方如实告知健康状况、用药情况及过往病史，并填写《首次入住健康状况说明》(附件2)。</p>
      <p>5. 乙方应当配合甲方的正常服务和管理，遵守甲方制定的规章制度。</p>
      <p>6. 乙方应当按照本合同约定的费用、支付时间和支付方式向甲方支付费用。</p>

      <h3>第八条　丙方权利义务</h3>
      <p>1. 丙方有权探视乙方，有权对甲方的照护工作提出意见建议，但不得影响甲方的正常服务和管理。</p>
      <p>2. 乙方不能履行告知义务的，丙方应当向甲方如实告知乙方的健康状况、用药情况以及过往病史，并填写《首次入住健康状况说明》(附件2)。</p>
      <p>3. 乙方支付本合同约定的费用，丙方承担连带责任。</p>
      <p>4. 乙方违反本合同约定或甲方制定的规章制度，造成甲方损失或第三人人身、财产损害的，乙方向甲方或第三人承担赔偿责任，丙方承担连带责任。</p>
      <p>5. 乙方需外出就医的，丙方应当及时携乙方到医院就诊，并向甲方如实告知乙方的就医情况。</p>
      <p>6. 对甲方反映的乙方事宜，丙方应当配合甲方共同处理。</p>

      <h3>第九条　合同的解除 </h3>
      <p>1. 有下列情形之一的，甲方可以书面通知乙方、丙方解除本合同：</p>
      <p>(1) 乙方逾期未补足入住保证金13日以上，经甲方书面催告，仍不补足的;</p>
      <p>(2) 乙方出现精神障得或患有必须隔离治疗的传染病，危及自身或他人人身、财产安全的；</p>
      <p>(3) 乙方连续请假外出超过60日(30日以上)；</p>
      <p>(4) 乙方违反本合同第七条第4款、第5款或者丙方违反本合同第八条第2款之一的;</p>
      <p>(5) 当事人不能就本合同第五条第2款或者当事人不能就本合同第六条第1款达成一致的;</p>
      <p>(6) 乙方无法适应集体生活或出现其它乙方不适宜继续入住的情况。</p>
      <p>2. 有下列情形之一的，乙方、丙方可以书面通知甲方解除本合同:</p>
      <p>(1) 甲方未按合同约定提供相应服务的;</p>
      <p>(2) 当事人不能就本合同第五条第2款或当事人不能就本合同第六条第1款达成一致的；</p>
      <p>(3) 乙方提前办理出院或死亡的；</p>
      <p>(4) 乙方对甲方的服务不满意或出现其它乙方认为不适宜继续入住的情况。</p>

      <h3>第十条　违约责任 </h3>
      <p>1. 甲方未按合同约定提供相应服务，给乙方造成损失的，甲方应当予以赔偿。</p>
      <p>2. 乙方逾期支付入住保证金的，每逾期一日应按逾期未付金额的1％向甲方支付违约金。</p>
      <p>3. 乙方或丙方未将乙方健康状况、用药情况及过往病史如实告知甲方，造成甲方在提供服务过程中护理失当的，由乙方或丙方承担相应的后果。</p>
      <p>4. 乙方需外出就医的，丙方拒绝及时携乙方到医院就诊而造成的后果，由丙方承担。</p>
      <p>5. 其他违约责任：无。</p>
      
      <h3>第十一条　其他约定 </h3>
      <p>1. 外出约定：
        <span v-if="contractInfo.otherFee">{{contractInfo.agreeOut | agreeFilter}}</span>
        <span v-else>_______</span>。
      </p>
      <p>2. 委托发放外配药品约定：
        <span v-if="contractInfo.otherFee">{{contractInfo.agreeMedicine | agreeFilter}}</span>
        <span v-else>_______</span>。
      </p>
      <p>3. 紧急联系人约定：
        <span v-if="contractInfo.emergencyContact">{{contractInfo.emergencyContact}}</span>
        <span v-else>_______</span>。
      </p>
      <p>4. 其它约定：
        <span v-if="contractInfo.otherRemark">{{contractInfo.otherRemark}}</span>
        <span v-else>_______</span>。
      </p>

      <h3>第十二条　争议解决方式 </h3>
      <p>本合同在履行过程中发生争议，当事人可以协商解决。协商不成的，当事人可以选择下列方式:</p>
      <p>1.向 上海 仲裁委员会申请仲裁。</p>
      <p>2.向人民法院提起诉讼。</p>
      
      <h3>第十三条 附则 </h3>
      <p>1. 本合同未尽事宜，可以另行协商签订补充协议。本合同补充协议与本合同具有同等法律效力。</p>
      <p>2. 本命同附件是本合同的组成部分，与合同正文具有同等法律效力。</p>
      <p>3. 本合同自甲方、乙方、丙方签字或盖章之日起生效。本合同一式三份，甲方、乙方、丙方各执一份。</p>
      <p>本合同附件：</p>
      <p>1.《首次服务项目确认表》</p>
      <p>2.《首次入住健康状况说明》</p>
      <p>3.《变更事项确认表》(1-3)</p>

      <h3>甲方(养老机构）： </h3>
      <p>名 称：
        <span v-if="contractInfo.tenantName">{{contractInfo.tenantName}}</span>
        <span v-else>_______</span>
      </p>
      <p>统一社会信用代码：
        <span v-if="contractInfo.creditCode">{{contractInfo.creditCode}}</span>
        <span v-else>_______</span>
      </p>
      <p>住所(址）：
        <span v-if="contractInfo.addressDetail">{{contractInfo.addressDetail}}</span>
        <span v-else>_______</span>
        邮编：201100</p>
      <p>法定代表人：
        <span v-if="contractInfo.legalName">{{contractInfo.legalName}}</span>
        <span v-else>_______</span>
      </p>
      <p>联系电话：
        <span v-if="contractInfo.legalContact">{{contractInfo.legalContact}}</span>
        <span v-else>_______</span>
      </p>
      <p>经办人签字盖章：_________________________</p>

      <h3>乙方(入住老年人)： </h3>
      <p>姓 名：
        <span v-if="contractInfo.elderName">{{contractInfo.elderName}}</span>
        <span v-else>_______</span>
        性别:
        <span v-if="contractInfo.gender">{{contractInfo.gender}}</span>
        <span v-else>_______</span>
        出生年月：
        <span v-if="contractInfo.birthDay">{{contractInfo.birthDay | dateFormat}}</span>
        <span v-else>_______</span>
      </p>
      <p>身份证号：
        <span v-if="contractInfo.cardNo">{{contractInfo.cardNo}}</span>
        <span v-else>_______</span>
      </p>
      <p>住所(址）：
        <span v-if="contractInfo.residenceAddress">{{contractInfo.residenceAddress}}</span>
        <span v-else>_______</span>
      </p>
      <p>户籍所在地：
        <span v-if="contractInfo.registerAddress">{{contractInfo.registerAddress}}</span>
        <span v-else>_______</span>
      </p>
      <p>邮编：_______</p>
      <p>签字盖章：_________________________</p>

      <h3>丙方(担保人) </h3>
      <p>姓 名：
        <span v-if="contractInfo.relationName">{{contractInfo.relationName}}</span>
        <span v-else>_______</span>
        性别:
        <span v-if="contractInfo.relationGender">{{contractInfo.relationGender}}</span>
        <span v-else>_______</span>
        出生年月：  
        <span v-if="contractInfo.relationBirthDay">{{contractInfo.relationBirthDay | dateFormat}}</span>
        <span v-else>_______</span>
      </p>
      <p>与乙方关系：
        <span v-if="contractInfo.relationType">{{contractInfo.relationType}}</span>
        <span v-else>_______</span>
      </p>
      <p>联系电话：
        <span v-if="contractInfo.relationMobilePhone">{{contractInfo.relationMobilePhone}}</span>
        <span v-else>_______</span>
      </p>
      <p>身份证号：
        <span v-if="contractInfo.relationCardNo">{{contractInfo.relationCardNo}}</span>
        <span v-else>_______</span>
      </p>
      <p>住所(址): 
        <span v-if="contractInfo.relationRegisterAddress">{{contractInfo.relationRegisterAddress}}</span>
        <span v-else>_______</span>
      </p>
      <p>户籍所在地:
        <span v-if="contractInfo.relationResidenceAddress">{{contractInfo.relationResidenceAddress}}</span>
        <span v-else>_______</span>
      </p>
      <p>邮编：_______</p>
      <p>签字盖章：_________________________</p>

      <p class="right">签约日期：
        <span v-if="contractInfo.relationResidenceAddress">{{contractInfo.signDate | dateFormat}}</span>
        <span v-else>_____年_____月_____日</span>
      </p>

    </div>
    <div class="page">
      <h2 class="title">《上海市养老服务合同》补充协议</h2>
      <h3>甲 方 (养老机构):
        <span v-if="contractInfo.tenantName">{{contractInfo.tenantName}}</span>
        <span v-else>_______</span>
      </h3>
      <h3>乙 方 (入住老年人): 
        <span v-if="contractInfo.elderName">{{contractInfo.elderName}}</span>
        <span v-else>_______</span>
      </h3>
      <h3>丙 方 (担保人):
        <span v-if="contractInfo.relationName">{{contractInfo.relationName}}</span>
        <span v-else>_______</span>
      </h3>
      <p>甲、乙、丙三方于
        <span v-if="contractInfo.signDate">{{contractInfo.signDate | dateFormat}}</span>
        <span v-else>_____年_____月_____日</span>
        就乙方入住事宜制作签订了编号为《上海市住养机构服务合同》（以下称为主合同），现经双方协商一致达成特补充如下协议：
      </p>
      <p>1、医药费以实际情况结算；（7、8、9、12、1、2）6个月每室福利院补贴30度电，超额电费自理；家电实行定额付费（小冰箱:20元/月、大冰箱:30元/月、电风扇10元/月、气垫床自带3元/天、气垫床租用5元/天、电脑10 元/月），按月结清 。</p>
      <p>2、如在本院临终，收取临终关怀和处置费600元；外出陪诊费50元/次，且不得超过4小时。</p>
      <p>3、代办费按实际计算，即：电话费、空调电费、医药费、理发、日常生活用品代购费、牛奶费等老人生活发生的其它费用。</p>
      <p>4、乙方因请假外出或因其他原因暂时中断住养的，中断第一个月，时间连续不满7天的，乙方全额支付，中断时间连续超过7天（包括7天）不满15天的，按实际天数退伙食费；中断时间连续超过15天（包括15天）的，收取二级护理费、按实际请假天数退还伙食费。</p>
      <p>5、乙方的医保卡统一由甲方保管，，如乙方或丙方要求自行保管医保卡又出现需紧急用药的，乙方和丙方需及时将乙方医保卡交给本院拉卡结算，未及时拉卡结算的，请在产生医保费用当月25日之前的工作日内来甲方结算，如未在规定时间内持医保卡前来结算的，则视为自费。每月乙方长护险结算日期为当月15日至25日止，在此期间请将乙方医保卡交由本院进行长护险拉卡结算，逾期后果自负。</p>
      <p>6、本属协议是《上海市养老服务合同》的合同附加协议，本协议一式三份，甲、乙、丙三方各执一份，并与{{nursingHomeName}}签署的《上海市养老服务合同》具有同等法律效力，自签订之日起生效。</p>
      <table cellspacing="0" cellpadding="0">
        <tr><td width="50%">甲方（盖章）：{{contractInfo.tenantName}}</td><td width="25%">乙方：</td><td width="25%">丙方：</td></tr>
        <tr><td>经办人签名：</td><td>签名：</td><td>签名：</td></tr>
      </table>
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
            nursingHomeName:''
          };
        }
      }
    },
    data() {
      return {
        agreementId: "",
        contractInfo: {}
      }
    },
    created(){
      tenant.fetchCurrentTenant().then(t => {
        this.nursingHomeName = t.tenantName; // 租户名称
      });
      this.agreementId = this.$route.query.agreementId;
      this.contractData();
    },
    methods:{
      //老人入院合同数据
      contractData(){
        let data = {};
        if(this.agreementId){
          data = {
            agreementId: this.agreementId
          };
        }else{
          data = {
            elderId: this.elderData.elderId
          };
        }
        axios.fetch('elderServer', '/elder/agreement', data).then(res => {
          this.contractInfo = res.data;
        });
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
      },
      //是否同意
      agreeFilter: val => {
				if(val === 0) {
					val = "不同意";
				} else if(val === 1) {
					val = "同意";
				} 
				return val;
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
span{
  &.smallinfo{
    text-align: center;
    display: block;
    font-weight: normal;
  }
}
h3{
  line-height: 30px;
}
h4{
  line-height: 36px;
}
p{
  text-indent: 2em;
  line-height: 30px;
  &.right{
    text-align: right;
    padding-right: 30px;
  }
}
table{
  width:100%;
  margin-top: 8px;
  text-align: left;
  tr{
    height:40px;
  }
}
</style>