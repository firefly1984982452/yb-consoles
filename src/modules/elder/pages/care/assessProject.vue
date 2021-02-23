<template>
    <div class="assess-project">
        <!--生活能力-->
        <div>
            <h2>{{form[0].itemCategory}}</h2>
            <table class="tableCss">
                <tr>
                    <td colspan="2">评估事项</td>
                    <td class="td-center">程度等级</td>
                    <td>合计</td>
                    <td>评分参考值</td>
                </tr>
                <tr v-if="form[0].ev_items_grade[0]&&form[0].ev_items_grade[0]!=''">
                    <td width="12%">{{form[0].ev_items_grade[0].ev_items}}</td>
                    <td width="25%">使用餐具将饭菜送入口、咀嚼、吞咽等步骤</td>
                    <td width="28%">
                        <el-radio-group v-model="form[0].ev_items_grade[0].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point1" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td rowspan="5" class="score-sum">{{ev_combined1}}分</td>
                    <td rowspan="5">
                        <div class="score-reference">
                            <div>
                                <p>正常<span>（0分）</span></p>
                                <p>轻度依赖<span>（1分）</span></p>
                                <p>中度依赖<span>（5分）</span></p>
                                <p>重度依赖<span>（10分）</span></p>
                            </div>
                            <div>
                                <p>生活自理能力正常<span> 0-2分</span></p>
                                <p>生活自理轻度依赖<span>3-14分</span></p>
                                <p>生活自理中度依赖<span>15-30分</span></p>
                                <p>生活自理重度依赖 <span>31分或以上</span></p>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="form[0].ev_items_grade[1]&&form[0].ev_items_grade[1]!=''">
                    <td>{{form[0].ev_items_grade[1].ev_items}}</td>
                    <td>修饰、洗浴</td>
                    <td>
                        <el-radio-group v-model="form[0].ev_items_grade[1].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point1" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[0].ev_items_grade[2]&&form[0].ev_items_grade[2]!=''">
                    <td>{{form[0].ev_items_grade[2].ev_items}}</td>
                    <td>穿（脱）衣服</td>
                    <td>
                        <el-radio-group v-model="form[0].ev_items_grade[2].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point1" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[0].ev_items_grade[3]&&form[0].ev_items_grade[3]!=''">
                    <td>{{form[0].ev_items_grade[3].ev_items}}</td>
                    <td>大便、小便、如厕等</td>
                    <td>
                        <el-radio-group v-model="form[0].ev_items_grade[3].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point1" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[0].ev_items_grade[4]&&form[0].ev_items_grade[4]!=''">
                    <td>{{form[0].ev_items_grade[4].ev_items}}</td>
                    <td>站立、转移、行走、上下楼梯等</td>
                    <td>
                        <el-radio-group v-model="form[0].ev_items_grade[4].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point1" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
            </table>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form[0].ev_note" placeholder="这里是备注内容"></el-input>
            </el-form-item>
        </div>
        <!--认知能力-->
        <div>
            <h2>{{form[1].itemCategory}}</h2>
            <table class="tableCss">
                <tr>
                    <td colspan="2">评估事项</td>
                    <td class="td-center">程度等级</td>
                    <td>合计</td>
                    <td>评分参考值</td>
                </tr>
                <tr v-if="form[1].ev_items_grade[0]&&form[1].ev_items_grade[0]!=''">
                    <td width="12%">{{form[1].ev_items_grade[0].ev_items}}</td>
                    <td width="25%">回想近期发生的事</td>
                    <td width="28%">
                        <el-radio-group v-model="form[1].ev_items_grade[0].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point2" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td rowspan="5" class="score-sum">{{ev_combined2}}分</td>
                    <td rowspan="5">
                        <div class="score-reference">
                            <div>
                                <p>正常<span>（0分）</span></p>
                                <p>轻度缺失<span>（1分）</span></p>
                                <p>中度缺失<span>（5分）</span></p>
                                <p>重度缺失<span>（10分）</span></p>
                            </div>
                            <div>
                                <p>认知能力正常<span>0-4分</span></p>
                                <p>认知能力轻度缺失 <span>5-14分</span></p>
                                <p>认知能力中度缺失<span>15-29分</span></p>
                                <p>认知能力重度缺失<span>30分或以上</span></p>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="form[1].ev_items_grade[1]&&form[1].ev_items_grade[1]!=''">
                    <td>{{form[1].ev_items_grade[1].ev_items}}</td>
                    <td>完成习得的生活技能(如穿衣、烧水泡茶等程序)</td>
                    <td>
                        <el-radio-group v-model="form[1].ev_items_grade[1].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point2" :label="p" :key="index" :class="{'hidden':index==1}">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[1].ev_items_grade[2]&&form[1].ev_items_grade[2]!=''">
                    <td width="12%">{{form[1].ev_items_grade[2].ev_items}}</td>
                    <td width="25%">现实导向能力，对人物、地点、时间、空间等识别和判断能力</td>
                    <td width="28%">
                        <el-radio-group v-model="form[1].ev_items_grade[2].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point2" :label="p" :key="index" :class="{'hidden':index==1}">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[1].ev_items_grade[3]&&form[1].ev_items_grade[3]!=''">
                    <td>{{form[1].ev_items_grade[3].ev_items}}</td>
                    <td>对日常生活的内容、时间等作出判断</td>
                    <td>
                        <el-radio-group v-model="form[1].ev_items_grade[3].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point2" :label="p" :key="index" :class="{'hidden':index==1}">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
            </table>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form[1].ev_note" placeholder="这里是备注内容"></el-input>
            </el-form-item>
        </div>
        <!--情绪行为-->
        <div>
            <h2>{{form[2].itemCategory}}</h2>
            <table class="tableCss">
                <tr>
                    <td colspan="2">评估事项</td>
                    <td class="td-center">程度等级</td>
                    <td>合计</td>
                    <td>评分参考值</td>
                </tr>
                <tr v-if="form[2].ev_items_grade[0]&&form[2].ev_items_grade[0]!=''">
                    <td width="12%">{{form[2].ev_items_grade[0].ev_items}}</td>
                    <td width="25%">对客观事物的主观态度体验是否与实际相符，能否被常人理解</td>
                    <td width="28%">
                        <el-radio-group v-model="form[2].ev_items_grade[0].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point3" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td rowspan="5" class="score-sum">{{ev_combined3}}分</td>
                    <td rowspan="5">
                        <div class="score-reference">
                            <div>
                                <p>正常<span>（0分）</span></p>
                                <p>轻度缺失<span>（1分）</span></p>
                                <p>中度缺失<span>（5分）</span></p>
                                <p>重度缺失<span>（10分）</span></p>
                            </div>
                            <div>
                                <p>情绪行为正常<span>0-1分</span></p>
                                <p>情绪行为轻度异常<span>2-5分</span></p>
                                <p>情绪行为中度异常<span>6-15分</span></p>
                                <p>情绪行为重度异常<span>15分或以上</span></p>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="form[2].ev_items_grade[1]&&form[2].ev_items_grade[1]!=''">
                    <td>{{form[2].ev_items_grade[1].ev_items}}</td>
                    <td>动作举止等行为表现异常</td>
                    <td>
                        <el-radio-group v-model="form[2].ev_items_grade[1].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point3" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[2].ev_items_grade[2]&&form[2].ev_items_grade[2]!=''">
                    <td>{{form[2].ev_items_grade[2].ev_items}}</td>
                    <td>在交流中能否互相理解</td>
                    <td>
                        <el-radio-group v-model="form[2].ev_items_grade[2].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point3" :label="p" :key="index" :class="{'hidden':index==1}">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
            </table>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form[2].ev_note" placeholder="这里是备注内容"></el-input>
            </el-form-item>
        </div>
        <!--视觉-->
        <div>
            <h2>{{form[3].itemCategory}}</h2>
            <table class="tableCss evaluation">
                <tr>
                    <td colspan="2">评估事项</td>
                    <td class="td-center">程度等级</td>
                    <td>合计</td>
                    <td>评分参考值</td>
                </tr>
                <tr v-if="form[3].ev_items_grade[0]&&form[3].ev_items_grade[0]!=''">
                    <td width="12%">{{form[3].ev_items_grade[0].ev_items}}</td>
                    <td width="25%">有否视力障碍，能否安全照顾自己</td>
                    <td width="28%">
                        <el-radio-group v-model="form[3].ev_items_grade[0].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point9" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td rowspan="2" class="score-sum">{{ev_combined4}}分</td>
                    <td rowspan="2">
                        <div class="score-reference">
                            <div>
                                <p>正常<span>（0分）</span></p>
                                <p>中度障碍<span>（5分）</span></p>
                                <p>重度障碍<span>（10分）</span></p>
                            </div>
                            <div>
                                <p>视觉正常<span>0分</span></p>
                                <p>视觉中度异常 <span>5分</span></p>
                                <p>视觉重度异常 <span>10分</span></p>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="form[3].ev_items_grade[0]&&form[3].ev_items_grade[0]!=''">
                    <td width="12%">{{form[3].ev_items_grade[1].ev_items}}</td>
                    <td width="25%"></td>
                    <td width="28%">
                        <el-radio-group v-model="form[3].ev_items_grade[1].ev_grade">
                            <el-radio class="miniGrade" v-for="(p,index) in point4" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <!-- <td rowspan="1"></td>
                    <td rowspan="1"> -->
                    </td>
                </tr>
            </table>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form[3].ev_note" placeholder="这里是备注内容"></el-input>
            </el-form-item>
        </div>
        <!--听力-->
        <!-- <div>
            <h2>{{form[4].itemCategory}}</h2>
            <table class="tableCss radio-align">
                <tr>
                    <td>评估事项</td>
                    <td class="td-center">程度等级</td>
                </tr>
                <tr v-if="form[4].ev_items_grade[0]&&form[4].ev_items_grade[0]!=''">
                    <td width="37%">{{form[4].ev_items_grade[0].ev_items}}</td>
                    <td class="td-center">
                        <el-radio-group v-model="form[4].ev_items_grade[0].ev_grade">
                            <el-radio class="grade" v-for="(p,index) in point4" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
            </table>
        </div> -->
        <!--社会生活环境-->
        <div>
            <h2>{{form[4].itemCategory}}</h2>
            <table class="tableCss radio-align">
                <tr>
                    <td colspan="2">评估事项</td>
                    <td class="td-center">程度等级</td>
                </tr>
                <tr v-if="form[4].ev_items_grade[0]&&form[4].ev_items_grade[0]!=''">
                    <td width="12%">{{form[4].ev_items_grade[0].ev_items}}</td>
                    <td width="25%">居住状况</td>
                    <td>
                        <el-radio-group v-model="form[4].ev_items_grade[0].ev_grade">
                            <el-radio class="grade" v-for="(p,index) in point5" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[4].ev_items_grade[1]&&form[4].ev_items_grade[1]!=''">
                    <td>{{form[4].ev_items_grade[1].ev_items}}</td>
                    <td>家庭支持状况</td>
                    <td>
                        <el-radio-group v-model="form[4].ev_items_grade[1].ev_grade">
                            <el-radio class="grade" v-for="(p,index) in point6" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[4].ev_items_grade[2]&&form[4].ev_items_grade[2]!=''">
                    <td>{{form[4].ev_items_grade[2].ev_items}}</td>
                    <td>参加社区或集体活动情况</td>
                    <td>
                        <el-radio-group v-model="form[4].ev_items_grade[2].ev_grade">
                            <el-radio class="grade" v-for="(p,index) in point7" :label="p" :key="index">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[4].ev_items_grade[3]&&form[4].ev_items_grade[3]!=''">
                    <td>{{form[4].ev_items_grade[3].ev_items}}</td>
                    <td>居住环境、卫生设施等情况</td>
                    <td>
                        <el-radio-group v-model="form[4].ev_items_grade[3].ev_grade">
                            <el-radio class="grade" v-for="(p,index) in point8" :label="p" :key="index" :class="{'hidden':index==3}">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-if="form[4].ev_items_grade[4]&&form[4].ev_items_grade[4]!=''">
                    <td>{{form[4].ev_items_grade[4].ev_items}}</td>
                    <td>居住环境、卫生设施等情况</td>
                    <td>
                        <el-radio-group v-model="form[4].ev_items_grade[4].ev_grade">
                            <el-radio class="grade" v-for="(p,index) in point8" :label="p" :key="index" :class="{'hidden':index==3}">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
            </table>
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
            form: [
                {
                    itemCategory: "生活自理能力",
                    ev_items_grade: [
                        {
                            ev_items: "进食",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "修饰与洗浴",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "穿（脱）衣",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "排泄及如厕",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "移动",
                            ev_grade: "",
                            itemId: ""
                        }
                    ],
                    combinedId: "",
                    noteId: "",
                    ev_combined: 0,
                    ev_grade: "",
                    ev_note: ""
                },
                {
                    itemCategory: "认知能力",
                    ev_items_grade: [
                        {
                            ev_items: "近期记忆",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "程序记忆",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "定向力",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "判断力",
                            ev_grade: "",
                            itemId: ""
                        }
                    ],
                    ev_combined: 0,
                    ev_grade: "",
                    ev_note: ""
                },
                {
                    itemCategory: "情绪行为",
                    ev_items_grade: [
                        {
                            ev_items: "情绪",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "行为",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "沟通力",
                            ev_grade: "",
                            itemId: ""
                        }
                    ],
                    ev_combined: 0,
                    ev_grade: "",
                    ev_note: ""
                },
                {
                    itemCategory: "视觉听觉",
                    ev_items_grade: [
                        {
                            ev_items: "视觉",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "听觉",
                            ev_grade: "",
                            itemId: ""
                        },
                    ],
                    ev_combined: 0,
                    ev_grade: "",
                    ev_note: ""
                },
                // {
                //     itemCategory: "听力",
                //     ev_items_grade: [
                //         {
                //             ev_items: "听力",
                //             ev_grade: "",
                //             itemId: ""
                //         }
                //     ],
                //     ev_combined: 0,
                //     ev_grade: "",
                //     ev_note: ""
                // },
                {
                    itemCategory: "社会生活环境",
                    ev_items_grade: [
                        {
                            ev_items: "居住状况",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "家庭支持",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "社会参与",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "居住环境（厕所）",
                            ev_grade: "",
                            itemId: ""
                        },
                        {
                            ev_items: "居住环境（洗浴设备）",
                            ev_grade: "",
                            itemId: ""
                        }
                    ],
                    ev_combined: 0,
                    ev_grade: "",
                    ev_note: ""
                }
            ],
            point1: ["正常", "轻度依赖", "中度依赖", "重度依赖"],
            point2: ["正常", "轻度缺失", "中度缺失", "重度缺失"],
            point3: ["正常", "轻度异常", "中度异常", "重度异常"],
            point4: ["正常", "轻度障碍", "中度障碍", "重度障碍"],
            point5: [
                "与配偶或子女同住",
                "与亲戚朋友等同住",
                "独自居住",
                "入住养老机构"
            ],
            point6: [
                "提供足够的物质和情感支持",
                "仅提供物质支持",
                "仅提供情感支持",
                "缺乏物质和情感支持"
            ],
            point7: ["经常参加", "较少参加", "偶尔参加", "不参加"],
            point8: ["独用", "合用", "无", "无"],
            point9: ["正常", "中度障碍", "重度障碍"]
        };
    },
    computed: {
        ev_combined1() {
            let sum = 0;
            let ev_grade = "";
            this.form[0].ev_items_grade.map(item => {
                let score = 0;
                switch (item.ev_grade) {
                    case "正常":
                        score = 0;
                        break;
                    case "轻度依赖":
                        score = 1;
                        break;
                    case "中度依赖":
                        score = 5;
                        break;
                    case "重度依赖":
                        score = 10;
                        break;
                }
                sum = sum + score;
            });
            if (sum >= 0 && sum <= 2) {
                ev_grade = "正常";
            } else if (sum >= 3 && sum <= 14) {
                ev_grade = "轻度";
            } else if (sum >= 15 && sum <= 30) {
                ev_grade = "中度";
            } else if (sum >= 31) {
                ev_grade = "重度";
            }
            this.form[0].ev_grade = ev_grade;
            this.form[0].ev_combined = sum;
            return sum;
        },
        ev_combined2() {
            let sum = 0;
            this.form[1].ev_items_grade.map(item => {
                let score = 0;
                switch (item.ev_grade) {
                    case "正常":
                        score = 0;
                        break;
                    case "轻度缺失":
                        score = 1;
                        break;
                    case "中度缺失":
                        score = 5;
                        break;
                    case "重度缺失":
                        score = 10;
                        break;
                }
                sum = sum + score;
            });
            let ev_grade = "";
            if (sum >= 0 && sum <= 4) {
                ev_grade = "正常";
            } else if (sum >= 5 && sum <= 14) {
                ev_grade = "轻度";
            } else if (sum >= 15 && sum <= 29) {
                ev_grade = "中度";
            } else if (sum >= 30) {
                ev_grade = "重度";
            }
            this.form[1].ev_grade = ev_grade;
            this.form[1].ev_combined = sum;
            return sum;
        },
        ev_combined3() {
            let sum = 0;
            this.form[2].ev_items_grade.map(item => {
                let score = 0;
                switch (item.ev_grade) {
                    case "正常":
                        score = 0;
                        break;
                    case "轻度异常":
                        score = 1;
                        break;
                    case "中度异常":
                        score = 5;
                        break;
                    case "重度异常":
                        score = 10;
                        break;
                }
                sum = sum + score;
            });
            let ev_grade = "";
            if (sum >= 0 && sum <= 1) {
                ev_grade = "正常";
            } else if (sum >= 2 && sum <= 5) {
                ev_grade = "轻度";
            } else if (sum >= 6 && sum <= 15) {
                ev_grade = "中度";
            } else if (sum >= 15) {
                ev_grade = "重度";
            }
            this.form[2].ev_grade = ev_grade;
            this.form[2].ev_combined = sum;
            return sum;
        },
        ev_combined4() {
            let sum = 0;
            [this.form[3].ev_items_grade[0]].map(item => {
                let score = 0;
                switch (item.ev_grade) {
                    case "正常":
                        score = 0;
                        break;
                    case "中度障碍":
                        score = 5;
                        break;
                    case "重度障碍":
                        score = 10;
                        break;
                }
                sum = sum + score;
            });
            let ev_grade = "";
            if (sum == 0) {
                ev_grade = "正常";
            } else if (sum == 5) {
                ev_grade = "中度";
            } else if (sum == 10) {
                ev_grade = "重度";
            }
            this.form[3].ev_grade = ev_grade;
            this.form[3].ev_combined = sum;
            return sum;
        }
    },
    created() {
        if (this.sign === "repair") {
            this.estimateId = this.$route.query.estimateId;
            this.searchById();
        }
        //注册事件
        this.$on("hello", function(data) {
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
            if (value >= 0 && value <= 7) {
                levelName = "正常";
            } else if (value >= 8 && value <= 21) {
                levelName = "轻度";
            } else if (value >= 22 && value <= 35) {
                levelName = "中度";
            } else if (value >= 36) {
                levelName = "重度";
            }
            return levelName;
        },
        //验证评估项目是否填写完整
        requiredProjectValidator() {
            let message = "";
            this.form.map(item => {
                for (var i = 0; i < item.ev_items_grade.length; i++) {
                    if (
                        item.ev_items_grade[i].ev_grade == "" ||
                        item.ev_items_grade[i].ev_grade == undefined
                    ) {
                        message = "请填写完整所有评估";
                    }
                }
            });
            return message;
        },
        //根据照护评估id查询具体评估项目
        searchById() {
            let data = {
                estimateId: this.estimateId
            };
            axios
            .fetch("elderServer", "/elderEstimate/item", data)
            .then(res => {
                this.assembleSearchData(res.data);
            });
        },
        //处理编辑查询数据
        assembleSearchData(data) {
            this.form.map(item => {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].itemType === "评估项目") {
                        for (var j = 0; j < item.ev_items_grade.length; j++) {
                            if (
                                item.ev_items_grade[j].ev_items ===
                                data[i].itemTitle
                            ) {
                                item.ev_items_grade[j].ev_grade =
                                    data[i].itemName;
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
        //处理新增数据
        assembleAddData() {
            let addEstimateItemVos = [];
            let degreeLevel = 0; //程度等级分数
            let levelName = ""; //程度等级
            this.form.map(item => {
                console.log(item,'===item');
                for (let j = 0; j < item.ev_items_grade.length; j++) {
                    let itemValue = 0;
                    if (item.ev_items_grade[j].ev_grade.startsWith("正常")) {
                        itemValue = 0;
                    } else if (
                        item.ev_items_grade[j].ev_grade.startsWith("轻度")
                    ) {
                        itemValue = 1;
                    } else if (
                        item.ev_items_grade[j].ev_grade.startsWith("中度")
                    ) {
                        itemValue = 5;
                    } else if (
                        item.ev_items_grade[j].ev_grade.startsWith("重度")
                    ) {
                        itemValue = 10;
                    }
                    let addEstimateItemVo = {
                        itemType: "评估项目",
                        itemCategory: item.itemCategory,
                        itemTitle: item.ev_items_grade[j].ev_items,
                        itemName: item.ev_items_grade[j].ev_grade,
                        remark: "",
                        itemValue: itemValue
                    };
                    addEstimateItemVos.push(addEstimateItemVo);
                }
                degreeLevel = degreeLevel + parseInt(item.ev_combined);
                addEstimateItemVos.push({
                    itemType: "评估项目",
                    itemCategory: item.itemCategory,
                    itemTitle: "备注",
                    itemName: "备注",
                    remark: item.ev_note,
                    itemValue: 0
                });
                addEstimateItemVos.push({
                    itemType: "评估项目",
                    itemCategory: item.itemCategory,
                    itemTitle: "程度等级",
                    itemName: item.ev_grade,
                    remark: "",
                    itemValue: item.ev_combined
                });
            });
            levelName = this.degreeLevel(degreeLevel);
            let projectForm = {
                estimateType: this.contentTitleData.estimateType,
                elderId: this.contentTitleData.elderId,
                elderName: this.contentTitleData.elderName,
                startDate: this.contentTitleData.startDate,
                endDate: this.contentTitleData.endDate,
                levelName: levelName,
                addEstimateItemVos: addEstimateItemVos
            };

            return projectForm;
        },
        //处理编辑数据
        assembleRepairData() {
            let addEstimateItemVos = [];
            let degreeLevel = 0;
            let levelName = "";
            this.form.map(item => {
                for (let i = 0; i < item.ev_items_grade.length; i++) {
                    let itemValue = 0;
                    if (item.ev_items_grade[i].ev_grade.startsWith("正常")) {
                        itemValue = 0;
                    } else if (
                        item.ev_items_grade[i].ev_grade.startsWith("轻度")
                    ) {
                        itemValue = 1;
                    } else if (
                        item.ev_items_grade[i].ev_grade.startsWith("中度")
                    ) {
                        itemValue = 5;
                    } else if (
                        item.ev_items_grade[i].ev_grade.startsWith("重度")
                    ) {
                        itemValue = 10;
                    }
                    let addEstimateItemVo = {
                        itemId: item.ev_items_grade[i].itemId,
                        itemName: item.ev_items_grade[i].ev_grade,
                        itemValue: itemValue,
                        remark: "",
                        doctorRemark: ""
                    };
                    addEstimateItemVos.push(addEstimateItemVo);
                }
                degreeLevel = degreeLevel + parseInt(item.ev_combined);
                addEstimateItemVos.push({
                    itemId: item.combinedId,
                    itemName: item.ev_grade,
                    itemValue: item.ev_combined,
                    remark: "",
                    doctorRemark: ""
                });
                addEstimateItemVos.push({
                    itemId: item.noteId,
                    itemName: "备注",
                    itemValue: "",
                    remark: item.ev_note,
                    doctorRemark: ""
                });
            });
            levelName = this.degreeLevel(degreeLevel);

            let projectForm = {
                levelName: levelName,
                estimateId: this.estimateId,
                addEstimateItemVos: addEstimateItemVos
            };
            return projectForm;
        },
        //保存新增数据
        saveAddData() {
            let message = this.requiredProjectValidator();
            if (this.contentTitleData.elderName === "" || this.contentTitleData.elderName === undefined) {
                this.$message.error("请选择老人"); return;
            } else if (this.contentTitleData.estimateType === "" || this.contentTitleData.estimateType === undefined) {
                this.$message.error("请选择评估类别"); return;
            } else if (this.contentTitleData.startDate === "" || this.contentTitleData.startDate === undefined) {
                this.$message.error("请选择评估时间"); return;
            } else if (message === "请填写完整所有评估") {
                this.$message.error("请填写完整所有评估"); return;
            }

            let data = this.assembleAddData();
            console.log(data,'====data');
            // axios
            // .fetch("elderServer", "/elderEstimate/add", data, "json")
            // .then(res => {
            //     this.$message({
            //         message: "保存成功",
            //         type: "success"
            //     });
            //     console.log(this.contentTitleData.liveIn,'====liveIn');
                
            //     if(this.contentTitleData.liveIn == true){
            //         //入住管理
            //         this.$emit(
			// 			"handleCareAssess",
            //             "careAssess",
            //             "careAssess"
			// 		);
            //     }else{
            //         //照护评估
            //         this.$router.push("/elder/care/assessList");
            //     }
            // });
        },
        //保存编辑数据
        saveRepairData() {
            let message = this.requiredProjectValidator();
            if (message === "请填写完整所有评估") {
                this.$message.error("请填写完整所有评估");
                return;
            }

            let data = this.assembleRepairData();
            axios
            .fetch("elderServer", "/elderEstimateItem/edit", data, "json")
            .then(res => {
                this.$message({
                    message: "保存成功",
                    type: "success"
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
        }
    }
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
    text-align: center;
}
.tableCss tr:first-child {
    background: rgba(243,243,243,1);;
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
    background: rgba(243,243,243,1);;
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