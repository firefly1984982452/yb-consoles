<template>
    <div>
        <!--评估参数项目总结-->
        <div>
            <h2>评估参数项目总结</h2>
            <table class="tableCss assessSum">
                <tr>
                    <td rowspan="2">{{sumForm[0].ev_classes}}</td>
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
                        <el-input style="width:100%;" type="textarea" maxlength="20" show-word-limit v-model="sumForm[0].ev_doctoral" placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">{{sumForm[1].ev_classes}}</td>
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
                        <el-input style="width:100%;" type="textarea" maxlength="20" show-word-limit v-model="sumForm[1].ev_doctoral" placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">{{sumForm[2].ev_classes}}</td>
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
                        <el-input style="width:100%;" type="textarea" maxlength="20" show-word-limit v-model="sumForm[2].ev_doctoral" placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">{{sumForm[3].ev_classes}}</td>
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
                        <el-input style="width:100%;" type="textarea" maxlength="20" show-word-limit v-model="sumForm[3].ev_doctoral" placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td rowspan="4">社会生活与环境</td>
                    <td>{{societyForm[0].ev_items}}</td>
                    <td>
                        <el-input v-model="societyForm[0].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td>{{societyForm[1].ev_items}}</td>
                    <td>
                        <el-input v-model="societyForm[1].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: normal;">{{societyForm[2].ev_items}}</td>
                    <td>
                        <el-input v-model="societyForm[2].ev_doctoral" placeholder="请输入" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td>{{societyForm[3].ev_items}}</td>
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
    data() {
        return {
            loading: false,
            sign: "",
            contentTitleData: {},
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
            washBeddingTime: "",
            point: ["正常", "轻度", "中度", "重度"],
            point1: ["是", "否"],
            point2: ["部分帮助", "完全帮助"],
            point3: ["提醒", "扶助", "扶助使用便器", "更换尿布"],
            point4: ["站立", "行走", "上下楼", "使用步行器"],
            point5: ["定时翻身", "清洁皮肤"],
            point6: ["保管药品", "发放药品", "帮助服药"],
            point7: ["喂食", "饮水", "切碎或搅拌"],
            point8: ["衣物", "被褥", "尿布"],
            point9: ["社区居家养老", "机构养老"],
            point10: ["陪同就诊", "帮助配药"]
        };
    },
    computed: {
        firstZhuTi: {
            get() {
                return this.$store.getters.firstColors;
            },
            set() {}
        }
    },
    created() {
        this.sign = "add";
        if (this.$route.query.sign === "repair") {
            this.estimateId = this.$route.query.estimateId;
            this.searchById(this.estimateId);
        }
        //注册事件
        this.$on("hello", param => {
            this.contentTitleData = this.shallowCopy(param);
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
        //根据照护评估id查询具体评估项目
        searchById(estimateId) {
            let data = {
                estimateId: estimateId
            };
            axios
                .fetch("elderServer", "/elderEstimate/item", data)
                .then(res => {
                    this.assembleSearchData(res.data);
                });
        },
        //验证项目总结的必填状况
        requiredSumValidator() {
            let sumForm = [...this.sumForm, ...this.societyForm];
            let message = "";
            sumForm.map(item => {
                if (
                    item.ev_classes == "生活自理能力" ||
                    item.ev_classes == "认知能力" ||
                    item.ev_classes == "情绪行为" ||
                    item.ev_classes == "视觉听觉"
                ) {
                    if (
                        item.ev_doctoral == "" ||
                        item.ev_doctoral == undefined
                    ) {
                        message = "请填写完整所有的评语";
                    }
                }
            });
            if (message === "请填写完整所有的评语") {
                return message;
            }
        },
        //处理编辑查询数据
        assembleSearchData(data) {
            // data.map(item => {
            //     if (item.itemType === "评估报告") {
            //         this.sign = "repair";
            //     }
            // });
            this.sumForm.map(item => {
                for (let i = 0; i < data.length; i++) {
                    if (
                        item.ev_classes === data[i].itemCategory &&
                        data[i].itemTitle === "程度等级"
                    ) {
                        item.ev_grade = data[i].itemName;
                        item.ev_doctoral = data[i].doctorRemark;
                        item.itemId = data[i].itemId;
                // console.log(item,'===============');
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
            if (this.sign === "repair") {
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
            }
        },
        //处理新增数据
        assembleAddData() {
            let addEstimateItemVos = [];

            this.sumForm.map(item => {
                let projectFormItem = {
                    itemType: "评估报告",
                    itemCategory: item.ev_classes,
                    itemTitle: "评语",
                    itemName: item.ev_doctoral,
                    itemValue: 0,
                    remark: ""
                };
                addEstimateItemVos.push(projectFormItem);
            });
            let projectForm = {
                estimateId: this.estimateId,
                estimateType: this.contentTitleData.estimateType,
                elderId: this.contentTitleData.elderId,
                elderName: this.contentTitleData.elderName,
                startDate: this.contentTitleData.startDate,
                endDate: this.contentTitleData.endDate,
                levelName: this.contentTitleData.levelName,
                addEstimateItemVos: addEstimateItemVos
            };
            return projectForm;
        },
        //处理编辑数据
        assembleRepairData() {
            let addEstimateItemVos = [];
            this.sumForm.map(item => {
                // console.log(item,'===========');
                
                let editFormItme = {
                    itemId: item.itemId,
                    doctorRemark: item.ev_doctoral
                };
                addEstimateItemVos.push(editFormItme);
            });
            let editForm = {
                levelName: this.contentTitleData.levelName,
                estimateId: this.estimateId,
                addEstimateItemVos: addEstimateItemVos
            };
            return editForm;
        },
        //保存新增数据
        saveAddData() {
            let sumMessage = this.requiredSumValidator();
            if (sumMessage === "请填写完整所有的评语") {
                this.$message.error("请填写完整所有的评语");
                return;
            }

            let data = this.assembleAddData();

            axios
                .fetch("elderServer", "/elderEstimate/add", data, "json")
                .then(response => {
                    this.$message({
                        message: "保存成功",
                        type: "success"
                    });
                    this.$router.push("/elder/care/assessList");
                });
        },
        //保存编辑数据
        saveRepairData() {
            let sumMessage = this.requiredSumValidator();
            if (sumMessage === "请填写完整所有的评语") {
                this.$message.error("请填写完整所有的评语");
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
                    this.$router.push("/elder/care/assessList");
                });
        },
        //保存
        childAction() {
            this.saveRepairData();
            // if (this.sign === "add") {
            //     this.saveAddData();
            // } else if (this.sign === "repair") {
            //     this.saveRepairData();
            // }
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