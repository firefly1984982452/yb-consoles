<template>
    <div style="padding-left: 20px;">
        <!--评估参数项目总结-->
        <div>
            <h2>评估参数项目总结</h2>
            <table class="tableCss assessSum">
                <tr>
                    <td rowspan="2">生活自理能力</td>
                    <td>程度等级</td>
                    <td>
                        <el-radio-group v-model="sumForm[0].ev_grade">
                            <el-radio v-for="(p,index) in point" :label="p" :key="index" :disabled="p==sumForm[0].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>评语</td>
                    <td>
                        <el-input v-model="sumForm[0].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">认知能力</td>
                    <td>程度等级</td>
                    <td>
                        <el-radio-group v-model="sumForm[1].ev_grade">
                            <el-radio v-for="(p,index) in point" :label="p" :key="index" :disabled="p==sumForm[1].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>评语</td>
                    <td>
                        <el-input v-model="sumForm[1].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">情绪行为</td>
                    <td>程度等级</td>
                    <td>
                        <el-radio-group v-model="sumForm[2].ev_grade">
                            <el-radio v-for="(p,index) in point" :label="p" :key="index" :disabled="p==sumForm[2].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>评语</td>
                    <td>
                        <el-input v-model="sumForm[2].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">视觉听觉</td>
                    <td>程度等级</td>
                    <td>
                        <el-radio-group v-model="sumForm[3].ev_grade">
                            <el-radio v-for="(p,index) in point" :label="p" :key="index" :disabled="p==sumForm[3].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>评语</td>
                    <td>
                        <el-input v-model="sumForm[3].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td rowspan="4">社会生活与环境</td>
                    <td>居住状况</td>
                    <td>
                        <el-input v-model="societyForm[0].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td>家庭支持</td>
                    <td>
                        <el-input v-model="societyForm[1].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: normal;">社会参与</td>
                    <td>
                        <el-input v-model="societyForm[2].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td>居住环境</td>
                    <td>
                        <el-input v-model="societyForm[3].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
            </table>
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
            sumForm: [
                {
                    ev_classes: "生活自理能力",
                    ev_grade: "",
                    ev_doctoral: "",
                    itemId: ""
                },
                {
                    ev_classes: "认知能力",
                    ev_grade: "",
                    ev_doctoral: "",
                    itemId: ""
                },
                {
                    ev_classes: "情绪行为",
                    ev_grade: "",
                    ev_doctoral: "",
                    itemId: ""
                },
                {
                    ev_classes: "视觉听觉",
                    ev_grade: "",
                    ev_doctoral: "",
                    itemId: ""
                }
            ],
            societyForm: [
                {
                    ev_classes: "社会生活环境",
                    ev_items: "居住状况",
                    ev_grade: "",
                    ev_doctoral: "",
                    itemId: ""
                },
                {
                    ev_classes: "社会生活环境",
                    ev_items: "家庭支持",
                    ev_grade: "",
                    ev_doctoral: "",
                    itemId: ""
                },
                {
                    ev_classes: "社会生活环境",
                    ev_items: "社会参与",
                    ev_grade: "",
                    ev_doctoral: "",
                    itemId: ""
                },
                {
                    ev_classes: "社会生活环境",
                    ev_items: "居住环境",
                    ev_grade: "",
                    ev_doctoral: "",
                    itemId: ""
                }
            ],
            point: ["正常", "轻度", "中度", "重度"],
            point1: ["是", "否"],
            point2: ["部分帮助", "完全帮助"],
            point3: ["提醒", "扶助", "扶助使用便器", "更换尿布"],
            point4: ["站立", "行走", "上下楼", "使用步行器"],
            point5: ["定时翻身", "清洁皮肤"],
            point6: ["保管药品", "发放药品", "帮助服药"],
            point7: ["衣物", "被褥", "尿布"],
            point8: ["陪同就诊", "帮助配药"],
            point9: ["喂食", "饮水", "切碎或搅拌"],
            point10: ["社区居家养老", "机构养老"]
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
            this.sumForm.map(item => {
                for (let i = 0; i < data.length; i++) {
                    if (
                        item.ev_classes === data[i].itemCategory &&
                        data[i].itemTitle === "程度等级"
                    ) {
                        item.ev_grade = data[i].itemName;
                        item.ev_doctoral = data[i].doctorRemark;
                    }
                }
            });
            let doctoralEnv = "";
            this.societyForm.map(item => {
                for (let i = 0; i < data.length; i++) {
                    if (
                        data[i].itemType === "评估项目" &&
                        data[i].itemCategory === "社会生活环境" &&
                        data[i].itemTitle.includes(item.ev_items)
                    ) {
                        if (data[i].itemTitle.includes("居住环境")) {
                            doctoralEnv =
                                doctoralEnv +
                                (data[i].itemTitle
                                    .split("（")[1]
                                    .split("）")[0] +
                                    ":" +
                                    data[i].itemName +
                                    ";");
                        } else {
                            item.ev_doctoral = data[i].itemName;
                            item.itemId = data[i].itemId;
                        }
                    }
                }
            });
            this.societyForm[3].ev_doctoral = doctoralEnv;
            // if(this.sign==='see'){
            this.sumForm.map(item => {
                for (let i = 0; i < data.length; i++) {
                    if (
                        item.ev_classes === data[i].itemCategory &&
                        data[i].itemType === "评估报告"
                    ) {
                        item.ev_doctoral = data[i].itemName;
                        item.itemId = data[i].itemId;
                    }
                }
            });
            // }
        }
    },
    computed: {
        firstZhuTi: {
            get() {
                return this.$store.getters.firstColors;
            },
            set() {}
        }
    }
};
</script>

<style scoped>
.el-card {
    margin-bottom: 10px;
}
.choose-old-man .el-col {
    margin: 0 10px;
}
.score-reference div {
    display: inline-block;
}
.score-reference div:nth-child(1) {
    width: 150px;
}
.score-reference div:nth-child(2) {
    width: 210px;
    border-left: 1px solid #ddd;
}
.tableCss {
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
}
.tableCss tr td {
    font-size: 14px;
    padding: 14px 30px;
    border: 1px solid #ebeef5;
    text-align: center;
}
.el-checkbox {
    width: 10em;
    margin-right: 0;
}
.el-radio {
    width: 10em;
    margin-right: 0;
}
.checkbox-input {
    width: 3.8em;
}
.tableCss tr td:last-child {
    text-align: left;
}
.assessSum tr td:first-child {
    font-weight: bold;
}
.assessSum tr:nth-child(even) td:nth-child(1),
.assessSum tr:nth-child(even) td:nth-child(2) {
    background: #fbfbfc;
    color: #666;
}
.pensionAdvice tr:first-child {
    background: #fbfbfc;
    color: #666;
}
.pensionAdvice tr:nth-child(odd) td:nth-child(2),
.pensionAdvice tr:nth-child(odd) td:nth-child(3) {
    background: #fbfbfc;
    color: #666;
}
.pensionAdvice tr:last-child td {
    background: #fff !important;
    color: #2c3e50 !important;
}
.pensionAdvice tr td:first-child,
.pensionAdvice tr td:nth-child(2) {
    font-weight: bold;
}
.pensionAdvice tr:first-child td:nth-child(2),
.pensionAdvice tr:last-child td:nth-child(2) {
    font-weight: normal;
}
.el-textarea {
    width: 25%;
    height: 4em !important;
}
.el-textarea__inner {
    height: 4em !important;
}
h2 {
    margin: 30px 0 20px 0;
}
.time {
    width: 1.5em;
    margin: 0 5px;
}
/deep/ .time input {
    padding: 0 5px;
    height: 1.5em;
    line-height: 1.5em;
}
</style>