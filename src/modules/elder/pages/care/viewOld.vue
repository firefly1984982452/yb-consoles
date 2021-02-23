<template>
    <div style="padding-left: 20px;">
        <!--养老服务建议-->
        <div>
            <h2>养老服务建议</h2>
            <table class="tableCss pensionAdvice">
                <tr>
                    <td></td>
                    <td>服务项目</td>
                    <td>是否需要提供</td>
                    <td style="text-align: center;">服务程度及频次</td>
                </tr>
                <tr>
                    <td rowspan="15">养老服务建议</td>
                    <td>{{pensionForm[0].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[0].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[0].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        每日<el-input v-model="pensionForm[0].ev_note" maxlength="1" class="time" disabled></el-input>次
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[1].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[1].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[1].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-checkbox-group v-model="pensionForm[1].ev_note">
                            <el-checkbox v-for="(p,index) in point7" :label="p" :key="index" disabled></el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[2].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[2].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[2].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-radio-group v-model="pensionForm[2].ev_note">
                            <el-radio v-for="(p,index) in point2" :label="p" :key="index" :disabled="p==pensionForm[2].ev_note?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[3].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[3].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[3].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-radio-group v-model="pensionForm[3].ev_note">
                            <el-radio v-for="(p,index) in point2" :label="p" :key="index" :disabled="p==pensionForm[3].ev_note?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[4].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[4].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[4].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-radio-group v-model="pensionForm[4].ev_note">
                            <el-radio v-for="(p,index) in point3" :label="p" :key="index" :disabled="p==pensionForm[4].ev_note?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[5].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[5].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[5].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-radio-group v-model="pensionForm[5].ev_note">
                            <el-radio v-for="(p,index) in point4" :label="p" :key="index" :disabled="p==pensionForm[5].ev_note?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[6].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[6].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[6].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-radio-group v-model="pensionForm[6].ev_note">
                            <el-radio v-for="(p,index) in point5" :label="p" :key="index" :disabled="p==pensionForm[6].ev_note?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[7].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[7].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[7].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-radio-group v-model="pensionForm[7].ev_note">
                            <el-radio v-for="(p,index) in point6" :label="p" :key="index" :disabled="p==pensionForm[7].ev_note?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[8].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[8].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[8].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        每月<el-input v-model="pensionForm[8].ev_note" maxlength="1" class="time" disabled></el-input>次
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[9].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[9].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[9].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>{{pensionForm[10].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[10].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[10].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-checkbox-group v-model="pensionForm[10].ev_note">
                            <el-checkbox label="衣物" :disabled="p==pensionForm[10].ev_note?false:true"></el-checkbox>
                            <el-checkbox label="被褥" :disabled="p==pensionForm[10].ev_note?false:true" class="checkbox-input"></el-checkbox>
                            <span style="font-size:14px;color: #606266;">每月</span>
                            <el-input v-model="washBeddingTime" maxlength="1" class="time" disabled></el-input>
                            <span style="font-size:14px;color: #606266;margin-right:6em;">次</span>
                            <el-checkbox label="尿布" :disabled="p==pensionForm[10].ev_note?false:true"></el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[11].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[11].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[11].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        每周<el-input v-model="pensionForm[11].ev_note" maxlength="1" class="time" disabled></el-input>次
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[12].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[12].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[12].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-radio-group v-model="pensionForm[12].ev_note">
                            <el-radio v-for="(p,index) in point10" :label="p" :key="index" :disabled="p==pensionForm[12].ev_note?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[13].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[13].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[13].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        每周<el-input v-model="pensionForm[13].ev_note" maxlength="1" class="time" disabled></el-input>次
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[14].ev_items}}</td>
                    <td>
                        <el-radio-group v-model="pensionForm[14].ev_grade">
                            <el-radio v-for="(p,index) in point1" :label="p" :key="index" :disabled="p==pensionForm[14].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        每周<el-input v-model="pensionForm[14].ev_note" maxlength="1" class="time" disabled></el-input>次
                    </td>
                </tr>
                <tr>
                    <td>{{pensionForm[15].ev_items}}</td>
                    <td colspan="2">
                        <el-radio-group v-model="pensionForm[15].ev_grade">
                            <el-radio v-for="(p,index) in point9" :label="p" :key="index" :disabled="p==pensionForm[15].ev_grade?false:true">{{p}}</el-radio>
                        </el-radio-group>
                    </td>
                    <td>
                        <el-input v-model="pensionForm[15].ev_note" placeholder="这里是原因内容" disabled></el-input>
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
            sign: "",
            estimateId: "",
            pensionForm: [
                {
                    ev_items: "送餐",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "进食",
                    ev_grade: "",
                    ev_note: [],
                    itemId: ""
                },
                {
                    ev_items: "修饰与洗浴",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "穿(脱)衣",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "如厕及排泄",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "移动",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "压疮处理",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "用药",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "物品整理",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "物品清洁消毒",
                    ev_grade: "",
                    ev_note: "物品清洁消毒",
                    itemId: ""
                },
                {
                    ev_items: "洗涤",
                    ev_grade: "",
                    ev_note: [],
                    itemId: ""
                },
                {
                    ev_items: "打扫房间",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "陪诊",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "购物",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "康复保健",
                    ev_grade: "",
                    ev_note: "",
                    itemId: ""
                },
                {
                    ev_items: "建议服务形式",
                    ev_grade: "",
                    ev_note: "",
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
    created() {
        this.sign = this.$route.query.sign;
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
            // if(this.sign==='see'){
            this.pensionForm.map(item => {
                for (let i = 0; i < data.length; i++) {
                    if (
                        item.ev_items === data[i].itemTitle &&
                        data[i].itemType === "养老服务建议"
                    ) {
                        item.ev_grade = data[i].itemName;
                        item.ev_note = data[i].remark;
                        item.itemId = data[i].itemId;
                        if (
                            (item.ev_items === "进食" &&
                                data[i].itemTitle === "进食") ||
                            (item.ev_items === "洗涤" &&
                                data[i].itemTitle === "洗涤")
                        ) {
                            this.washBeddingTime = data[i].remark.split(",")[0];
                            item.ev_note = data[i].remark.split(",");
                        }
                    }
                }
            });
            // }
        }
    },
    computed: {}
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