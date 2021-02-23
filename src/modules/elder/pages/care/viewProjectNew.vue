<template>
  <div class="assess-project" style="padding-left: 20px;">
    <div v-for="(json,jsonIndex) in jsons" :key="jsonIndex">
      <h2>{{json.itemCategory}}</h2>
      <table class="tableCss">
        <tr>
          <td width="33%" class="td-center" colspan="2">评估事项</td>
          <td width="44%" class="td-center">程度等级</td>
          <td class="td-center" v-if="json.itemCategory !=='社会生活环境'">合计</td>
          <td class="td-center" v-if="json.itemCategory !=='社会生活环境'">评分参考值</td>
        </tr>
        <tr v-for="(item,itemIndex) in json.ev_items_grade" :key="itemIndex">
          <td class="td-center" width="10%">{{ item.ev_items }}</td>
          <td>{{ item.description }}</td>
          <td>
            <el-radio-group v-model="item.ev_grade" :class="{'radio':json.itemCategory !=='社会生活环境'}">
              <el-radio
              style="padding:5px 0;"
              :disabled="value==item.ev_grade?false:true"
              v-for="(value,index) in item.values" 
              :label="value" :key="index"
              >
                <span v-if="json.itemCategory !=='社会生活环境'&&value!==null">
                  {{levels[index]}}{{index===0?'':json.wording}}（{{value}}分）
                  <!-- {{levels[index]}}{{index===0?'':json.wording}}-{{value}} -->
                </span>
                <span v-else-if="json.itemCategory !=='社会生活环境'&&value===null">
                  一
                </span>
                <span v-else-if="json.itemCategory ==='社会生活环境'">
                  {{ value }}
                </span>
              </el-radio>
            </el-radio-group>
          </td>
          <td v-if="itemIndex === 0 && json.itemCategory !=='社会生活环境'" rowspan="5" class="score-sum td-center">
            <span>
              {{ json.ev_combined }}分
            </span>
          </td>
          <td  class="td-center" v-if="itemIndex === 0 && json.itemCategory !=='社会生活环境'" rowspan="5">
            <div class="score-reference">
              <p v-for="(score,scoreIndex) in json.scoreStandard" :key="scoreIndex">
                <span v-if="score!==null">
                  {{json.itemCategory}}{{ levels[scoreIndex] }}{{ scoreIndex===0?'':json.wording }}
                </span>
                <b>{{ score }}</b>
              </p>
            </div>
          </td>
        </tr>
      </table>
      <el-form-item v-if="json.itemCategory !=='社会生活环境'" label="备注">
        <el-input type="textarea" v-model="json.ev_note" placeholder="这里是备注内容"></el-input>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
export default {
  props: ["estimateIds"],
  data() {
    return {
      estimateId: "",
      jsons: [
        {
          itemCategory: "生活自理能力",
          ev_items_grade: [
            {
              ev_items: "进食",
              description: "使用餐具将饭菜送入口、咀嚼、吞咽等步骤。",
              ev_grade: "",
              values: [0, null, 3, 5],
              itemId: "",
            },
            {
              ev_items: "个人卫生",
              description: "修饰、洗澡等。",
              ev_grade: "",
              values: [0, 1, 3, 7],
              itemId: "",
            },
            {
              ev_items: "穿衣",
              description: "穿上衣、穿下衣等。",
              ev_grade: "",
              values: [0, null, 3, 5],
              itemId: "",
            },
            {
              ev_items: "如厕及排泄",
              description: "如厕、小便、大便等。",
              ev_grade: "",
              values: [0, 1, 5, 10],
              itemId: "",
            },
            {
              ev_items: "移动",
              description: "站立、转移、行走、上下楼梯等。",
              ev_grade: "",
              values: [0, 1, 5, 10],
              itemId: "",
            },
          ],
          combinedId: "",
          noteId: "",
          ev_combined: 0,
          ev_note: "",
          wording: "依赖",
          scoreStandard: ["0-3分", "4-9分", "10-18分", "19分或以上"],
        },
        {
          itemCategory: "认知能力",
          ev_items_grade: [
            {
              ev_items: "近期记忆",
              description: "回想近期发生的事情。",
              ev_grade: "",
              values: [0, 2, 5, 10],
              itemId: "",
            },
            {
              ev_items: "程序记忆",
              description: "完成习得的生活技能，如穿衣程序、烧水泡茶程序等。",
              ev_grade: "",
              values: [0, null, 5, 10],
              itemId: "",
            },
            {
              ev_items: "定向能力",
              description:
                "现实导向能力，对人物、地点、时间、空间等的识别和判断能力。",
              ev_grade: "",
              values: [0, null, 5, 10],
              itemId: "",
            },
            {
              ev_items: "判断能力",
              description: "对日常生活的内容、时间、谁人处理等作出判断。",
              ev_grade: "",
              values: [0, null, 5, 10],
              itemId: "",
            },
          ],
          combinedId: "",
          noteId: "",
          ev_combined: 0,
          ev_note: "",
          wording: "缺失",
          scoreStandard: ["0-4分", "5-14分", "15-29分", "30分或以上"],
        },
        {
          itemCategory: "情绪行为",
          ev_items_grade: [
            {
              ev_items: "情绪",
              description:
                "对客观事物的主观态度体验是否与实际相符，能否被常人理解。",
              ev_grade: "",
              values: [0, 2, 6, 10],
              itemId: "",
            },
            {
              ev_items: "行为",
              description: "动作行为表现是否异常。",
              ev_grade: "",
              values: [0, 2, 6, 10],
              itemId: "",
            },
            {
              ev_items: "沟通能力",
              description: "在交流中能否互相理解。",
              ev_grade: "",
              values: [0, null, 1, 2],
              itemId: "",
            },
          ],
          combinedId: "",
          noteId: "",
          ev_combined: 0,
          ev_note: "",
          wording: "异常",
          scoreStandard: ["0-1分", "2-5分", "6-14分", "15分或以上"],
        },
        {
          itemCategory: "视觉能力",
          ev_items_grade: [
            {
              ev_items: "视力",
              description: "有否视力障碍，能否安全照顾自己。",
              ev_grade: "",
              values: [0, null, 5, 10],
              itemId: "",
            },
          ],
          combinedId: "",
          noteId: "",
          ev_combined: 0,
          ev_note: "",
          wording: "障碍",
          scoreStandard: ["0分", null, "5分", "10分"],
        },
        {
          itemCategory: "社会生活环境",
          ev_items_grade: [
            {
              ev_items: "居住情况",
              description: "老人居住、生活情况。",
              ev_grade: "",
              values: [
                "与子女或亲戚朋友同住",
                "与配偶同住",
                "独自居住",
                "入住养老机构",
              ],
              itemId: "",
            },
            {
              ev_items: "家庭支持",
              description: "老人家庭、社会网络的支持情况。",
              ev_grade: "",
              values: [
                "亲属提供足够的生活支持（物质和感情）",
                "亲属提供些许生活支持",
                "亲属只提供感情上的支持",
                "很少看望，没有物质和感情支持",
              ],
              itemId: "",
            },
            {
              ev_items: "社区生活",
              description: "老人参与社区活动的情况。",
              ev_grade: "",
              values: [
                "经常参加社区活动",
                "较少到社区走动或参加活动",
                "偶尔到社区走动或参加活动",
                "从不参加社区活动",
              ],
              itemId: "",
            },
            {
              ev_items: "居住条件（出入无障碍设施）",
              description: "老人的住房设施和条件。",
              ev_grade: "",
              values: ["有", "无"],
              itemId: "",
            },
            {
              ev_items: "居住条件（室内无障碍设施）",
              description: "老人的住房设施和条件。",
              ev_grade: "",
              values: ["有", "无"],
              itemId: "",
            },
            {
              ev_items: "居住条件（厕所）",
              description: "老人的住房设施和条件。",
              ev_grade: "",
              values: ["独用", "合用", "无"],
              itemId: "",
            },
            {
              ev_items: "居住条件（洗浴设备）",
              description: "老人的住房设施和条件。",
              ev_grade: "",
              values: ["独用", "合用", "无"],
              itemId: "",
            },
            {
              ev_items: "安全卫生",
              description: "老人居住环境的卫生和安全。",
              ev_grade: "",
              values: [
                "环境条件符合老人生活卫生与安全",
                "卫生条件陈旧，安全仍能保障",
                "卫生条件较差，生活较不方便，安全缺乏保障",
                "居住条件很差，有明显居住安全风险",
              ],
              itemId: "",
            },
          ],
          combinedId: "",
          noteId: "",
          ev_combined: 0,
          ev_note: null,
          wording: null,
          scoreStandard: null,
        },
      ],
      levels: ["正常", "轻度", "中度", "重度"],
    };
  },
  created() {
    if (this.$route.query.estimateId) {
      this.estimateId = this.$route.query.estimateId;
    } else {

      this.estimateId = this.estimateIds;
    }
    this.searchById();
  },
  methods: {
    //根据照护评估id查询具体评估项目
    searchById() {
      let data = {
        estimateId: this.estimateId,
      };
      axios.fetch("elderServer", "/elderEstimate/item", data).then((res) => {
        this.assembleSearchData(res.data);
      });
    },
    //处理编辑查询数据
    assembleSearchData(data) {
      this.jsons.map((item) => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].itemType === "评估项目") {
            for (var j = 0; j < item.ev_items_grade.length; j++) {
              if (item.ev_items_grade[j].ev_items === data[i].itemTitle) {
                // hard code
                item.ev_items_grade[j].ev_grade =
                  data[i].itemCategory !== "社会生活环境"
                    ? data[i].itemValue
                    : data[i].itemName;
                item.ev_items_grade[j].itemId = data[i].itemId;
              }
            }
            if (
              data[i].itemTitle === "程度等级" &&
              item.itemCategory === data[i].itemCategory
            ) {
              item.ev_combined = data[i].itemValue;
              item.ev_grade = data[i].itemName;
              item.combinedId = data[i].itemId;
            }
            if (
              data[i].itemTitle === "备注" &&
              item.itemCategory === data[i].itemCategory
            ) {
              item.ev_note = data[i].remark;
              item.noteId = data[i].itemId;
            }
          }
        }
      });
    },
  },
  computed: {
    firstZhuTi: {
      get() {
        return this.$store.getters.firstColors;
      },
      set() {},
    },
  },
};
</script>

<style scoped>
.score-sum {
  color: #f6812b;
}
.score-reference div {
  display: inline-block;
}
.score-reference p {
  margin: 8px 0;
}
.score-reference div:nth-child(1) p span {
  font-weight: bold;
}
.score-reference div:nth-child(2) p span {
  font-weight: bold;
  margin-left: 10px;
}
.score-reference div:nth-child(1) {
  width: 150px;
}
.score-reference div:nth-child(2) {
  width: 250px;
  border-left: 1px solid #ddd;
}
.score-reference div:nth-child(2) p {
  text-align: left;
  margin-left: 35px;
}
.tableCss {
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
}
.tableCss tr td {
  font-size: 14px;
  padding: 14px 10px;
  border: 1px solid #ebeef5;
  /* text-align: center; */
}
.tableCss tr:first-child {
  background: rgba(243, 243, 243, 1);
  color: #666;
}
.tableCss tr td:nth-child(2) {
  text-align: left;
}
.tableCss tr td:first-child {
  font-weight: bold;
}
.tableCss tr:first-child td:first-child {
  font-weight: normal;
}
.tableCss tr td:nth-child(2),
.tableCss tr td:nth-child(3) {
  color: #666;
}
.tableCss tr:nth-child(odd) td:nth-child(2),
.tableCss tr:nth-child(odd) td:nth-child(3) {
  background: rgba(243, 243, 243, 1);
}
.td-center {
  text-align: center !important;
}
/deep/ .el-textarea {
  width: 25%;
  height: 4em !important;
}
/deep/ .el-textarea__inner {
  height: 4em;
  resize: none;
}
h2 {
  margin: 30px 0 20px 0;
}
.hidden {
  visibility: hidden;
}

.miniGrade {
  width: 55px !important;
  float: left;
  text-align: left;
}

.grade {
  width: 220px !important;
  float: left;
  text-align: left;
}
</style>

<style lang="less" scoped>
  /deep/ .el-radio-group {
    padding: 0 15px;
  }
  /deep/ .el-radio-group.radio {
    display: flex;
    flex-wrap: wrap;
    .el-radio {
      flex: 1;
    }
}
</style>