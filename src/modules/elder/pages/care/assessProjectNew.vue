<template>
  <div class="assess-project">
    <div v-for="(json,jsonIndex) in jsons" :key="jsonIndex">
      <h2>{{json.itemCategory}}</h2>
      <table class="tableCss">
        <tr>
          <td class="td-center" width="33%" colspan="2">评估事项</td>
          <td width="44%" class="td-center">程度等级</td>
          <td class="td-center" v-if="json.itemCategory !=='社会生活环境'">合计</td>
          <td class="td-center" v-if="json.itemCategory !=='社会生活环境'">评分参考值</td>
        </tr>
        <tr v-for="(item,itemIndex) in json.ev_items_grade" :key="itemIndex">
          <td class="td-center" width="10%">{{ item.ev_items }}</td>
          <td>{{ item.description }}</td>
          <td>
            <el-radio-group v-model="item.ev_grade" :class="{'radio':json.itemCategory !=='社会生活环境'}">
              <el-radio style="padding: 5px 0;" v-for="(value,index) in item.values" :label="value" :key="index"
                :disabled="value===null"
                @change="json.itemCategory !=='社会生活环境'?handleChange(jsonIndex,itemIndex,index):null">
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
            <!-- <span v-if="jsonIndex===1">
              {{ ev_combined2 }}分
            </span>
            <span v-if="jsonIndex===2">
              {{ ev_combined3 }}分
            </span>
            <span v-if="jsonIndex===3">
              {{ ev_combined4 }}分
            </span> -->
          </td>
          <td class="td-center" v-if="itemIndex === 0 && json.itemCategory !=='社会生活环境'" rowspan="5">
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

export default {
  props: ["sign"],
  data() {
    return {
      estimateId: "",
      contentTitleData: "",
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
          levelScore: [0, 6, 18, 30],
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
          levelScore: [0, 3, 9, 15],
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
          levelScore: [0, 1, 3, 5],
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
          levelScore: [0, 0, 6, 50],
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
      sumScoreStandard: [
        {
          range: "0-5",
          level: "正常",
          description: "",
        },
        {
          range: "6-17",
          level: "轻度",
          description: "日常生活自理能力欠佳，需要提供一些帮助。",
        },
        {
          range: "18-30",
          level: "中度",
          description: "日常生活自理能力较差，需要提供较大帮助。",
        },
        {
          range: "31-9999",
          level: "重度",
          description: "日常生活自理能力很差，需要提供很大帮助。",
        },
      ],
    };
  },
  computed: {},
  created() {
    if (this.sign === "repair") {
      this.estimateId = this.$route.query.estimateId;
      this.searchById();
    }
    //注册事件
    this.$on("hello", function (data) {
      this.contentTitleData = this.shallowCopy(data);
      this.childAction();
    });
  },
  methods: {
    //浅拷贝
    shallowCopy(obj) {
      var newobj = {};
      for (var attr in obj) {
        newobj[attr] = obj[attr];
      }
      return newobj;
    },
    //判断程度等级
    degreeLevel(value) {
      let levelName = "";
      let flag = false;
      // if (value >= 0 && value <= 5) {
      //   levelName = "正常";
      // } else if (value >= 6 && value <= 17) {
      //   levelName = "轻度";
      // } else if (value >= 18 && value <= 30) {
      //   levelName = "中度";
      // } else if (value >= 31) {
      //   levelName = "重度";
      // }
      for (let index = 0; index < this.sumScoreStandard.length; index++) {
        const element = this.sumScoreStandard[index];
        let arr = element.range.split("-");
        let max = Math.max(...arr);
        if (value - max <= 0 && !flag) {
          // console.log(index);
          levelName = element.level;
          flag = true;
        }
      }
      console.log(value, levelName, "=====照料等级");
      return levelName;
    },
    //验证评估项目是否填写完整
    requiredProjectValidator() {
      let message = "";
      this.jsons.map((item) => {
        for (var i = 0; i < item.ev_items_grade.length; i++) {
          if (
            item.ev_items_grade[i].ev_grade === "" ||
            item.ev_items_grade[i].ev_grade === undefined ||
            item.ev_items_grade[i].ev_grade === null
          ) {
            console.log(item.ev_items_grade[i]);
            message = "请填写完整所有评估";
          }
        }
      });
      return message;
    },
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
            // console.log(data[i]);
            for (var j = 0; j < item.ev_items_grade.length; j++) {
              if (item.ev_items_grade[j].ev_items === data[i].itemTitle) {
                // hard code
                item.ev_items_grade[j].ev_grade =
                  data[i].itemCategory !== "社会生活环境"
                    ? data[i].itemValue
                    : data[i].itemName;
                item.ev_items_grade[j].itemId = data[i].itemId;
                item.ev_items_grade[j].itemName = data[i].itemName;
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
    //处理新增数据
    assembleAddData() {
      let addEstimateItemVos = [];
      let degreeLevel = 0; //程度等级分数
      let levelName = ""; //程度等级
      this.jsons.map((item) => {
        for (let j = 0; j < item.ev_items_grade.length; j++) {
          let addEstimateItemVo = {
            itemType: "评估项目",
            itemCategory: item.itemCategory,
            itemTitle: item.ev_items_grade[j].ev_items,
            itemName: item.ev_items_grade[j].valueLevel
              ? item.ev_items_grade[j].valueLevel
              : item.ev_items_grade[j].ev_grade,
            remark: "",
            itemValue: isNaN(parseInt(item.ev_items_grade[j].ev_grade))
              ? 0
              : parseInt(item.ev_items_grade[j].ev_grade),
          };
          addEstimateItemVos.push(addEstimateItemVo);
        }
        addEstimateItemVos.push({
          itemType: "评估项目",
          itemCategory: item.itemCategory,
          itemTitle: "备注",
          itemName: "备注",
          remark: item.ev_note,
          itemValue: 0,
        });
        addEstimateItemVos.push({
          itemType: "评估项目",
          itemCategory: item.itemCategory,
          itemTitle: "程度等级",
          itemName: item.itemLevel ? item.itemLevel : "",
          remark: "",
          itemValue: item.ev_combined,
        });
        console.log(item.itemLevel);
        if(item.itemLevel){
          const scoreIndex = this.levels.indexOf(item.itemLevel);
          // item.score = item.levelScore[scoreIndex];
          console.log(item.levelScore[scoreIndex]);
          degreeLevel = degreeLevel + parseInt(item.levelScore[scoreIndex]);
        }
      });
      console.log(degreeLevel, "degreeLevel");
      console.log(addEstimateItemVos);
      levelName = this.degreeLevel(degreeLevel);
      let projectForm = {
        estimateType: this.contentTitleData.estimateType,
        elderId: this.contentTitleData.elderId,
        elderName: this.contentTitleData.elderName,
        startDate: this.contentTitleData.startDate,
        endDate: this.contentTitleData.endDate,
        levelName: levelName,
        addEstimateItemVos: addEstimateItemVos,
      };

      return projectForm;
    },
    //处理编辑数据
    assembleRepairData() {
      let addEstimateItemVos = [];
      let degreeLevel = 0;
      let levelName = "";
      console.log(this.jsons);
      this.jsons.map((item) => {
        for (let j = 0; j < item.ev_items_grade.length; j++) {
          // console.log(item);
          // console.log(item.ev_items_grade[j].ev_grade);
          let addEstimateItemVo = {
            itemId: item.ev_items_grade[j].itemId,
            itemName: item.ev_items_grade[j].itemName,
            itemValue: isNaN(parseInt(item.ev_items_grade[j].ev_grade))
              ? 0
              : parseInt(item.ev_items_grade[j].ev_grade),
            remark: "",
            doctorRemark: "",
          };
          addEstimateItemVos.push(addEstimateItemVo);
        }
        addEstimateItemVos.push({
          itemId: item.combinedId,
          itemName: item.ev_grade,
          itemValue: item.ev_combined,
          remark: "",
          doctorRemark: "",
        });
        addEstimateItemVos.push({
          itemId: item.noteId,
          itemName: "备注",
          itemValue: "",
          remark: item.ev_note,
          doctorRemark: "",
        });
         console.log(item);
        if(item.ev_grade && this.levels.indexOf(item.ev_grade)!==-1){
          const scoreIndex = this.levels.indexOf(item.ev_grade);
          // item.score = item.levelScore[scoreIndex];
          console.log(item.levelScore[scoreIndex]);
          degreeLevel = degreeLevel + parseInt(item.levelScore[scoreIndex]);
        }
      });
      console.log(degreeLevel);
      levelName = this.degreeLevel(degreeLevel);
      let projectForm = {
        levelName: levelName,
        estimateId: this.estimateId,
        addEstimateItemVos: addEstimateItemVos,
      };
      return projectForm;
    },
    //保存新增数据
    saveAddData() {
      let message = this.requiredProjectValidator();
      if (
        this.contentTitleData.elderName === "" ||
        this.contentTitleData.elderName === undefined
      ) {
        this.$message.error("请选择老人");
        return;
      } else if (
        this.contentTitleData.estimateType === "" ||
        this.contentTitleData.estimateType === undefined
      ) {
        this.$message.error("请选择评估类别");
        return;
      } else if (
        this.contentTitleData.startDate === "" ||
        this.contentTitleData.startDate === undefined
      ) {
        this.$message.error("请选择评估时间");
        return;
      } else if (message === "请填写完整所有评估") {
        this.$message.error("请填写完整所有评估");
        return;
      }

      let data = this.assembleAddData();
      console.log(data, "====");
      axios
        .fetch("elderServer", "/elderEstimate/add", data, "json")
        .then((res) => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          console.log(this.contentTitleData.liveIn, "====liveIn");

          if (this.contentTitleData.liveIn == true) {
            //入住管理
            this.$emit("handleCareAssess", "careAssess", "careAssess");
          } else {
            //照护评估
            this.$router.push("/elder/care/assessList");
          }
        });
    },
    //保存编辑数据
    saveRepairData() {
      let message = this.requiredProjectValidator();
      if (message === "请填写完整所有评估") {
        this.$message.error("请填写完整所有评估");
        return;
      }

      let data = this.assembleRepairData();
      console.log(data);
      axios
        .fetch("elderServer", "/elderEstimateItem/edit", data, "json")
        .then((res) => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          //照护评估
          this.$router.push("/elder/care/assessList");
        });
    },
    //保存
    childAction() {
      if (this.sign === "add") {
        this.saveAddData();
      } else if (this.sign === "repair") {
        this.saveRepairData();
      }
    },
    // 选分变化的事件
    handleChange(jsonIndex, itemIndex, valueIndex) {
      let itemData = this.jsons[jsonIndex];
      let arr = [];
      let flag = false;
      itemData.ev_items_grade[itemIndex].itemName = itemData.ev_items_grade[
        itemIndex
      ].valueLevel =
        this.levels[valueIndex] + (valueIndex ? itemData.wording : "");
      console.log(itemData.ev_items_grade[itemIndex].itemName, "===选择具体项");
      // 求总分
      itemData.ev_items_grade.forEach((item) => {
        if (!isNaN(Number(item.ev_grade))) {
          arr.push(Number(item.ev_grade));
        }
      });
      if (arr.length > 0) {
        itemData.ev_combined = arr.reduce((pre, cur) => pre + cur);
      }
      // 计算总分的范围 判断程度
      for (let index = 0; index < itemData.scoreStandard.length; index++) {
        const element = itemData.scoreStandard[index];
        // console.log(index,'=====index');
        if (element) {
          let str = element.substring(0, element.indexOf("分"));
          let arr = str.split("-");
          let max = Math.max(...arr);
          if (arr.length === 2) {
            if (itemData.ev_combined - max <= 0 && !flag) {
              // console.log(index);
              itemData.ev_grade = itemData.itemLevel = this.levels[index];
              flag = true;
            }
          } else {
            if (index === itemData.scoreStandard.length - 1) {
              if (itemData.ev_combined - max >= 0 && !flag) {
                itemData.ev_grade = itemData.itemLevel = this.levels[index];
                flag = true;
              }
            } else {
              if (itemData.ev_combined - max === 0 && !flag) {
                itemData.ev_grade = itemData.itemLevel = this.levels[index];
                flag = true;
              }
            }
          }
        }
      }
      console.log(itemData.ev_grade, "======总分的范围等级");
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
  text-align: left;
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