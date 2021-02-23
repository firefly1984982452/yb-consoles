<template>
  <div class="page">
    <h2 class="title">调查访问表</h2>
    <table cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td colspan="6">一、老人基本信息</td>
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
        <td colspan="5" class="inp">
          <input type="checkbox" :checked="elderData.baseInfo.marriage==='已婚'?'checked':''" />已婚
          <input type="checkbox" :checked="elderData.baseInfo.marriage==='未婚'?'checked':''" />未婚
          <input type="checkbox" :checked="elderData.baseInfo.marriage==='丧偶'?'checked':''" />丧偶
          <input type="checkbox" :checked="elderData.baseInfo.marriage==='离异'?'checked':''" />离异
        </td>
      </tr>
      <tr>
        <td>受教育程度</td>
        <td colspan="5" class="inp">
          <input type="checkbox" :checked="elderData.baseInfo.educational==='小学及以下'?'checked':''" />小学及以下
          <input type="checkbox" :checked="elderData.baseInfo.educational==='初中'?'checked':''" />初中
          <input type="checkbox" :checked="elderData.baseInfo.educational==='高中'?'checked':''" />高中
          <input type="checkbox" :checked="elderData.baseInfo.educational==='大专'?'checked':''" />大专
          <input type="checkbox" :checked="elderData.baseInfo.educational==='本科'?'checked':''" />本科
          <input type="checkbox" :checked="elderData.baseInfo.educational==='研究生及以上'?'checked':''" />研究生及以上
        </td>
      </tr>
      <tr>
        <td>户口地址</td>
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
    </table>

    <table cellspacing="0" cellpadding="0" class="table page">
      <tr>
        <td colspan="4">二、老人自理信息</td>
      </tr>
      <tr style="text-align:center;">
        <td>进食</td>
        <td>个人卫生</td>
        <td>修饰</td>
        <td>穿衣</td>
      </tr>
      <tr class="info">
        <td>
          <p><input type="checkbox" :checked="feed==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="feed==='轻度依赖'?'checked':''" />轻度依赖</p>
          <p><input type="checkbox" :checked="feed==='中度依赖'?'checked':''" />中度依赖</p>
          <p><input type="checkbox" :checked="feed==='重度依赖'?'checked':''" />重度依赖</p>
        </td>
        <td>
          <p><input type="checkbox" :checked="bath==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="bath==='轻度依赖'?'checked':''" />轻度依赖</p>
          <p><input type="checkbox" :checked="bath==='中度依赖'?'checked':''" />中度依赖</p>
          <p><input type="checkbox" :checked="bath==='重度依赖'?'checked':''" />重度依赖</p>
        </td>
        <td>
          <p><input type="checkbox" :checked="decorate==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="decorate==='轻度依赖'?'checked':''" />轻度依赖</p>
          <p><input type="checkbox" :checked="decorate==='中度依赖'?'checked':''" />中度依赖</p>
          <p><input type="checkbox" :checked="decorate==='重度依赖'?'checked':''" />重度依赖</p>
        </td>
        <td>
          <p><input type="checkbox" :checked="dress==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="dress==='轻度依赖'?'checked':''" />轻度依赖</p>
          <p><input type="checkbox" :checked="dress==='中度依赖'?'checked':''" />中度依赖</p>
          <p><input type="checkbox" :checked="dress==='重度依赖'?'checked':''" />重度依赖</p>
        </td>
      </tr>
      <tr style="text-align:center;">
        <td>如厕排泄</td>
        <td>移动</td>
        <td>认知能力</td>
        <td>情绪行为</td>
      </tr>
      <tr class="info">
        <td>
          <p><input type="checkbox" :checked="toilet==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="toilet==='轻度依赖'?'checked':''" />轻度依赖</p>
          <p><input type="checkbox" :checked="toilet==='中度依赖'?'checked':''" />中度依赖</p>
          <p><input type="checkbox" :checked="toilet==='重度依赖'?'checked':''" />重度依赖</p>
        </td>
        <td>
          <p><input type="checkbox" :checked="move==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="move==='轻度依赖'?'checked':''" />轻度依赖</p>
          <p><input type="checkbox" :checked="move==='中度依赖'?'checked':''" />中度依赖</p>
          <p><input type="checkbox" :checked="move==='重度依赖'?'checked':''" />重度依赖</p>
        </td>
        <td>
          <p><input type="checkbox" :checked="know==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="know==='轻度'?'checked':''" />轻度缺失</p>
          <p><input type="checkbox" :checked="know==='中度'?'checked':''" />中度缺失</p>
          <p><input type="checkbox" :checked="know==='重度'?'checked':''" />重度缺失</p>
        </td>
        <td>
          <p><input type="checkbox" :checked="emotion==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="emotion==='轻度'?'checked':''" />轻度异常</p>
          <p><input type="checkbox" :checked="emotion==='中度'?'checked':''" />中度异常</p>
          <p><input type="checkbox" :checked="emotion==='重度'?'checked':''" />重度异常</p>
        </td>
      </tr>
      <tr style="text-align:center;">
        <td>视觉能力</td>
        <!-- <td>听力</td> -->
        <td colspan="3">其他特殊情况</td>
      </tr>
      <tr class="info">
        <td>
          <p><input type="checkbox" :checked="vision==='正常'?'checked':''" />正常</p>
          <p><input type="checkbox" :checked="vision==='中度障碍'?'checked':''" />中度障碍</p>
          <p><input type="checkbox" :checked="vision==='重度障碍'?'checked':''" />重度障碍</p>
        </td>
        <!-- <td>
          <p><input type="checkbox" :checked="hearing==='正常'?'checked':''"/>正常</p>
          <p><input type="checkbox" :checked="hearing==='轻度障碍'?'checked':''"/>轻度障碍</p>
          <p><input type="checkbox" :checked="hearing==='中度障碍'?'checked':''"/>中度障碍</p>
          <p><input type="checkbox" :checked="hearing==='重度障碍'?'checked':''"/>重度障碍</p>
        </td> -->
        <td colspan="3">
        </td>
      </tr>
    </table>
    <table cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td colspan="4">三、特殊服务需求申请</td>
      </tr>
      <tr>
        <td colspan="2">服务项目内容</td>
        <td colspan="2">需要频率说明</td>
      </tr>
      <tr>
        <td colspan="2"></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td colspan="2"></td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td colspan="4">四、调访表基本信息</td>
      </tr>
      <tr>
        <td>调访者</td>
        <td></td>
        <td>调访者职务</td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>调访日期</td>
        <td colspan="3">
          <span v-if="elderData.baseInfo.checkinDate">{{elderData.baseInfo.checkinDate | dateFormat}}</span>
          <span v-else>年月日</span>
        </td>
      </tr>
      <tr>
        <td>调访者结论</td>
        <td colspan="3" class="inp">
          <p>该老人初步符合入院条件，可作体检</p>
          <p>
            <input type="checkbox" checked />是
            <input type="checkbox" />否
          </p>
          <p style="height:40px;line-height:40px;display:flex;">访问者签名: <img
              style="width:80px;height:40px;visibility:hidden"> </p>
        </td>
      </tr>
      <tr>
        <td colspan="4">五、医生调访信息</td>
      </tr>
      <tr>
        <td>医生调访日期</td>
        <td colspan="3">
          <span v-if="elderData.baseInfo.checkinDate">{{elderData.baseInfo.checkinDate | dateFormat}}</span>
          <span v-else>年月日</span>
        </td>
      </tr>
      <tr>
        <td>调访者结论</td>
        <td colspan="3" class="inp">
          <p>该老人初步符合入院条件，可作体检</p>
          <p>
            <input type="checkbox" checked />是
            <input type="checkbox" />否
          </p>
          <p style="height:40px;line-height:40px;display:flex;">医生签名: <img
              style="width:80px;height:40px;visibility:hidden"> </p>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <p>附：老人身份证复印件</p>
          <p>
            <img style="width:100px;height:100px;visibility:hidden" />
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ["elderData", "estimateId"],
  props: {
    elderData: {
      type: Object,
      default: {},
    },
    estimateId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      feed: [],
      bath: [],
      decorate: [],
      dress: [],
      toilet: [],
      move: [],
      know: [],
      emotion: [],
      vision: [],
      hearing: [],
      careInfo: {},
    };
  },
  watch: {
    estimateId(newValue, oldValue) {
      console.log(newValue);
      this.careAssess(this.estimateId);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.careAssess(this.estimateId);
    });
  },
  methods: {
    //照护评估
    careAssess(estimateId) {
      let data = {
        estimateId: estimateId,
      };
      axios.fetch("elderServer", "/elderEstimate/item", data).then((res) => {
        this.careInfo = res.data;
        this.assembleCareAssess();
        console.log(this.feed, "=====");
      });
    },
    //处理照护评估的数据
    assembleCareAssess() {
      this.feed = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "生活自理能力" &&
          item.itemTitle == "进食"
        );
      })[0].itemName;
      this.bath = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "生活自理能力" &&
          item.itemTitle == "个人卫生"
        );
      })[0].itemName;
      this.decorate = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "生活自理能力" &&
          item.itemTitle == "个人卫生"
        );
      })[0].itemName;
      this.dress = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "生活自理能力" &&
          item.itemTitle == "穿衣"
        );
      })[0].itemName;
      this.toilet = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "生活自理能力" &&
          item.itemTitle == "如厕及排泄"
        );
      })[0].itemName;
      this.move = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "生活自理能力" &&
          item.itemTitle == "移动"
        );
      })[0].itemName;
      this.know = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "认知能力" &&
          item.itemTitle == "程度等级"
        );
      })[0].itemName;
      this.emotion = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "情绪行为" &&
          item.itemTitle == "程度等级"
        );
      })[0].itemName;
      this.vision = this.careInfo.filter((item) => {
        return (
          item.itemType == "评估项目" &&
          item.itemCategory == "视觉能力" &&
          item.itemTitle == "视力"
        );
      })[0].itemName;
      // this.hearing = this.careInfo.filter(item=>{
      //   return (item.itemType=="评估项目"&&item.itemCategory=="视觉听觉"&&item.itemTitle=="听觉")
      // })[0].itemName;
    },
  },
  filters: {
    dateFormat: (date) => {
      if (date) {
        date =
          date.split("-")[0] +
          "年" +
          date.split("-")[1] +
          "月" +
          date.split("-")[2] +
          "日";
      } else {
        date = "";
      }
      return date;
    },
  },
};
</script>

<style lang="less" scoped>
tr.page {
  page-break-after: always;
}
.int {
  input {
    margin-left: 6px;
  }
}
.info {
  td {
    padding: 6px 4px;
    p {
      width: 50%;
      float: left;
      font-size: 14px;
      input {
        margin-right: 2px;
      }
    }
  }
}

p {
  span {
    display: inline-block;
    width: 260px;
    text-align: right;
    vertical-align: top;
    line-height: 30px;
  }
}
</style>