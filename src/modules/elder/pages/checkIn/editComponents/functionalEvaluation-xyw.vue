<template>
  <div>

    <table class="tableCss evaluation pgs" style="margin:20px;">
      <tr>
        <td style="padding: 14px 10px;">评测大类</td>
        <td style="padding: 14px 10px;">序号</td>
        <td style="padding: 14px 10px;">评测小项</td>
        <td style="text-align: center;">小项得分</td>
        <td style="padding: 14px 10px;">大类得分</td>
        <td style="padding: 14px 10px;">合计</td>
        <td>使用FLM量表说明</td>

      </tr>
      <tr>
        <td class="trTiitle" rowspan="6">A.自理</td>
        <td>1</td>
        <td>进食</td>
        <td>
          <el-radio-group :max="1" v-model="judgeA1" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
        <td rowspan="6">{{judgeAsum}}</td>
        <td rowspan="18" style="font-size:16px;color:#F6812B;font-weight:bold;">{{judgeAsum+judgeBsum+judgeCsum+judgeDsum+judgeEsum+judgeFsum}}分</td>
        <td rowspan="18" style="padding: 20px;width: 25%;">
          <div style="text-align: left;">
            <h4 style="font-size:16px;color:#333;font-weight:400;">FLM量表采用了7分制（1～7分）的评分方法，主要根据患者执行某项任务所需的帮助程度给予记分，6～7分表示功能独立，1～5分表示需要帮助。</h4>
            <h3 style="color:#333;font-size:18px;font-weight: bolder;margin: 10px 0;">其中:</h3>
            <ul class="FlmUlStyle">
              <li>·7分为完全独立（及时地完全地完成)</li>
              <li>·6分为能独立完成，单需要辅助用具</li>
              <li>·5分为需要人监护</li>
              <li>·4分为少量的帮助（主观努力完成75%以上</li>
              <li>·3分为中等度的帮助（主观努力完成50%～75%）</li>
              <li>·2分为很大的帮助（主观努力完成25%～50%）</li>
              <li>·1分为完全需要人帮助（主观努力完成0～25%）</li>
            </ul>
            <h3 style="color:#333;font-size:18px;font-weight: bolder;margin: 10px 0;">另:</h3>
            <p>有括约肌控制障碍者</p>
            <ul class="FlmUlStyle">
              <li>·5分为每月失禁≥1次</li>
              <li>·4分为每周失禁＜1次</li>
              <li>·3分为每周失禁>1次</li>
              <li>·2分为有办法使失禁次数减少</li>
              <li>·1分为每天均有失禁</li>
            </ul>
            <p>步行项目检查</p>
            <ul class="FlmUlStyle">
              <li>·7分为不用助行器，至少能走50m</li>
              <li>·6分为用助行器或轮椅，能走50m，并能越过至少30的斜坡</li>
              <li>·5分为需要监护，所需时间较（走50m）或用助行器或轮椅能走17m</li>
            </ul>
            <p>上下楼梯</p>
            <ul class="FlmUlStyle">
              <li>指一段楼梯（12～14级）</li>
            </ul>
            <p>视听理解和语言表达</p>
            <ul class="FlmUlStyle">
              <li>包括对复杂和抽象信息的理解，如日常生活或时事等方面的谈话、提问或陈述。</li>
            </ul>
            <p>社会交往</p>
            <ul class="FlmUlStyle">
              <li>观察患者在社会场合中与他人交往是否需要额外时间，以及是否需要帮助和帮助的时间</li>
            </ul>
            <p>解决问题</p>
            <ul class="FlmUlStyle">
              <li>包括日常生活中意外事件的处理</li>
            </ul>
            <p>记忆</p>
            <ul class="FlmUlStyle">
              <li>包括人物、日常生活和他人的请求等</li>
            </ul>
          </div>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>修饰</td>
        <td>
          <el-radio-group :max="1" v-model="judgeA2" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td>3</td>
        <td>洗澡</td>
        <td>
          <el-radio-group :max="1" v-model="judgeA3" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td>4</td>
        <td>穿上衣</td>

        <td>
          <el-radio-group :max="1" v-model="judgeA4" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td>5</td>
        <td>穿下衣</td>

        <td>
          <el-radio-group :max="1" v-model="judgeA5" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td>6</td>
        <td>如厕</td>
        <td>
          <el-radio-group :max="1" v-model="judgeA6" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <!--括约肌控制-->
      <tr>
        <td class="trTiitle" rowspan="2">B.括约肌控制</td>
        <td>7</td>
        <td>排便管理</td>
        <td>
          <el-radio-group :max="1" v-model="judgeB1" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
        <td rowspan="2">{{judgeBsum}}</td>
      </tr>
      <tr>
        <td>8</td>
        <td>排尿管理</td>
        <td>
          <el-radio-group :max="1" v-model="judgeB2" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <!--转移-->
      <tr>
        <td class="trTiitle" rowspan="3">C.转移</td>
        <td>9</td>
        <td>床椅转移</td>
        <td>
          <el-radio-group :max="1" v-model="judgeC1" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
        <td rowspan="3">{{judgeCsum}}</td>
      </tr>
      <tr>
        <td>10</td>
        <td>卫生间</td>
        <td>
          <el-radio-group :max="1" v-model="judgeC2" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td>11</td>
        <td>浴池浴室</td>
        <td>
          <el-radio-group :max="1" v-model="judgeC3" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <!--D.行进-->
      <tr>
        <td class="trTiitle" rowspan="2">D.行进</td>
        <td>12</td>
        <td>步行/轮椅</td>
        <td>
          <el-radio-group :max="1" v-model="judgeD1" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
        <td rowspan="2">{{judgeDsum}}</td>
      </tr>
      <tr>
        <td>13</td>
        <td>上下楼梯</td>
        <td>
          <el-radio-group :max="1" v-model="judgeD2" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <!--E.交流-->
      <tr>
        <td class="trTiitle" rowspan="2">E.交流</td>
        <td>14</td>
        <td>视听理解</td>
        <td>
          <el-radio-group :max="1" v-model="judgeE1" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
        <td rowspan="2">{{judgeEsum}}</td>
      </tr>
      <tr>
        <td>15</td>
        <td>语言表达</td>
        <td>
          <el-radio-group :max="1" v-model="judgeE2" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <!--F.社会认知-->
      <tr>
        <td class="trTiitle" rowspan="3">F.社会认知</td>
        <td>16</td>
        <td>社会往来</td>
        <td>
          <el-radio-group :max="1" v-model="judgeF1" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
        <td rowspan="3">{{judgeFsum}}</td>
      </tr>
      <tr>
        <td>17</td>
        <td>解决问题</td>
        <td>
          <el-radio-group :max="1" v-model="judgeF2" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td>18</td>
        <td>记忆能力</td>
        <td>
          <el-radio-group :max="1" v-model="judgeF3" :disabled="notEdit==true">
            <el-radio v-for="(p,index) in scorePoint" :label="p" :key="index">{{p}}分</el-radio>
          </el-radio-group>
        </td>
      </tr>
    </table>
    <el-row class="handleBtn" v-if="!notEdit">
      <el-button type="success" plain @click="save()">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </el-row>
  </div>

</template>

<script>
import axios from "axios";
export default {
  props: ["elderId", "notEdit"],
  data() {
    return {
      sign: "",
      judge: [],
      judgeA1: 0,
      judgeA2: 0,
      judgeA3: 0,
      judgeA4: 0,
      judgeA5: 0,
      judgeA6: 0,
      judgeB1: 0,
      judgeB2: 0,
      judgeC1: 0,
      judgeC2: 0,
      judgeC3: 0,
      judgeD1: 0,
      judgeD2: 0,
      judgeE1: 0,
      judgeE2: 0,
      judgeF1: 0,
      judgeF2: 0,
      judgeF3: 0,
      scorePoint: [1, 2, 3, 4, 5, 6, 7],
      bigCategory: [
        "自理",
        "自理",
        "自理",
        "自理",
        "自理",
        "自理",
        "括约肌控制",
        "括约肌控制",
        "转移",
        "转移",
        "转移",
        "行进",
        "行进",
        "交流",
        "交流",
        "社会认知",
        "社会认知",
        "社会认知"
      ],
      smallCategory: [
        "进食",
        "修饰",
        "洗澡",
        "穿上衣",
        "穿下衣",
        "如厕",
        "排便管理",
        "排尿管理",
        "床椅转移",
        "卫生间",
        "浴池浴室",
        "步行/轮椅",
        "上下楼梯",
        "视听理解",
        "语言表达",
        "社会往来",
        "解决问题",
        "记忆能力"
      ]
    };
  },
  created() {
    this.infoInit();
  },
  methods: {
    infoInit() {
      let data = {
        elderId: this.elderId
      };
      let that = this;
      axios.fetch("elderServer", "/elderNursing/all", data).then(res => {
        if (res.data) {
          this.initAssemble(res.data);
        }
      });
    },
    //组装初始化的数据
    initAssemble(data) {
      let array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < this.smallCategory.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (data[j].itemType === "功能性评估") {
            if (this.smallCategory[i] === data[j].itemName) {
              array[i] = data[j].itemValue;
            }
          }
        }
      }
      this.judgeA1 = array[0];
      this.judgeA2 = array[1];
      this.judgeA3 = array[2];
      this.judgeA4 = array[3];
      this.judgeA5 = array[4];
      this.judgeA6 = array[5];
      this.judgeB1 = array[6];
      this.judgeB2 = array[7];
      this.judgeC1 = array[8];
      this.judgeC2 = array[9];
      this.judgeC3 = array[10];
      this.judgeD1 = array[11];
      this.judgeD2 = array[12];
      this.judgeE1 = array[13];
      this.judgeE2 = array[14];
      this.judgeF1 = array[15];
      this.judgeF2 = array[16];
      this.judgeF3 = array[17];
    },
    //组装需要保存的数据
    saveAssemble() {
      let evaluationForm = [];
      let array = [
        this.judgeA1,
        this.judgeA2,
        this.judgeA3,
        this.judgeA4,
        this.judgeA5,
        this.judgeA6,
        this.judgeB1,
        this.judgeB2,
        this.judgeC1,
        this.judgeC2,
        this.judgeC3,
        this.judgeD1,
        this.judgeD2,
        this.judgeE1,
        this.judgeE2,
        this.judgeF1,
        this.judgeF2,
        this.judgeF3
      ];
      for (let i = 0; i < this.bigCategory.length; i++) {
        let item = {
          elderId: this.elderId,
          itemType: "功能性评估",
          itemTitle: this.bigCategory[i],
          itemName: this.smallCategory[i],
          itemValue: array[i],
          remark: ""
        };
        if (this.sign === "edit") item.nursingId = this.nursingIds[i];
        evaluationForm.push(item);
      }
      return evaluationForm;
    },
    //验证是否可以保存
    verify(evaluationForm) {
      let choice = false;
      let noChoice = false;
      let ifSave = true;
      var isChoiceList = evaluationForm.map(item => {
        return item.itemValue;
      });
      if (isChoiceList.indexOf(0) > -1) {
        return false;
      } else {
        return true;
      }
      // 之前的需求是全选或全不选都可以保存
      // for(let i=0; i<evaluationForm.length; i++){
      //     if(evaluationForm[i].itemValue!=0)  choice = true;
      //     if(evaluationForm[i].itemValue===0)  noChoice = true;
      // }
      // if(choice&&noChoice)  ifSave = false;
      // return ifSave;
    },
    save() {
      let evaluationForm = this.saveAssemble();
      let message = this.verify(evaluationForm);
      if (!message) {
        this.$message.error("请填写完整所有评估");
        return;
      }
      axios
        .fetch("elderServer", "/elderNursing/submit", evaluationForm, "json")
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.$emit(
            "nextStep",
            "careAssess"
          );
        });
    }
  },
  computed: {
    judgeAsum() {
      return (
        this.judgeA1 +
        this.judgeA2 +
        this.judgeA3 +
        this.judgeA4 +
        this.judgeA5 +
        this.judgeA6
      );
    },
    judgeBsum() {
      return this.judgeB1 + this.judgeB2;
    },
    judgeCsum() {
      return this.judgeC1 + this.judgeC2 + this.judgeC3;
    },
    judgeDsum() {
      return this.judgeD1 + this.judgeD2;
    },
    judgeEsum() {
      return this.judgeE1 + this.judgeE2;
    },
    judgeFsum() {
      return this.judgeF1 + this.judgeF2 + this.judgeF3;
    }
  }
};
</script>

<style scoped>
.ziDetail {
  width: 120px;
}
.trTiitle {
  font-weight: bolder;
  color: #333 !important;
}
.FlmUlStyle li {
  font-size: 14px;
  color: #999;
}
.tableCss tr td {
  font-size: 16px;
  padding: 14px 0px;
  color: #666;
  border: 1px solid #ebeef5;
  /*min-width: 80px;*/
  text-align: center;
}
.tableCss tr:first-child {
  background: #f3f3f3;
  color: #666;
}
.tableCss tr td:nth-child(5) {
  color: #333;
  font-size: 14px;
  font-weight: bolder;
}
.tableCss tr:first-child td:nth-child(5) {
  color: #666;
  font-size: 16px;
  font-weight: normal;
}
.tableCss tr:nth-child(13) td:nth-child(1),
.tableCss tr:nth-child(15) td:nth-child(1),
.tableCss tr:nth-child(17) td:nth-child(1) {
  background: #fff;
}
.tableCss tr:nth-child(13) td:nth-child(5),
.tableCss tr:nth-child(15) td:nth-child(5),
.tableCss tr:nth-child(17) td:nth-child(5) {
  background: #fff;
}
.tableCss tr:nth-child(odd) {
  background: #f8f8f8;
}
.tableCss p {
  font-size: 16px;
  color: #666;
  padding: 10px 0 !important;
  font-weight: bolder;
}
.el-radio-group {
  width: 100%;
}
table >>> .el-radio {
  margin-right: auto;
  color: #666;
  width: 20%;
}
table.pgs .el-radio {
  margin-right: auto;
  width: 14%;
}
.evaluation tr td {
  padding: 0;
}
.handleBtn {
    text-align: center;
    padding: 10px 0;
}
</style>