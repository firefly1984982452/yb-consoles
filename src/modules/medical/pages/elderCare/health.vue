<template>
    <div class="health">
        <el-form @submit.native.prevent ref="form" :rules="rules" :model="form" label-position="right" label-width="120px" style="width:60%">
            <el-row :gutter="0">
                <el-form-item label="现病史">
                    <el-row :gutter="0">
                        <el-button v-if="!currentInputVisible" class="button-new-tag" size="small" @click="showInput">+ 添加病史</el-button>
                        <el-input v-if="currentInputVisible" class="input-new-tag" v-model="inputValue" ref="currentTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                        </el-input>
                        <el-tag :key="tag" v-for="tag in medicalCurrent" closable :disable-transitions="false" @close="handleClose(tag)">
                            {{tag}}
                        </el-tag>
                        <el-row :gutter="5" v-show="currentInputVisible" class="illDialog">
                            <i class="el-icon-close" @click=" currentInputVisible = false"></i>
                            <el-checkbox-group v-model="medicalCurrent">
                                <el-checkbox v-for="(ill,i) in illOption" :key="i" :label="ill"></el-checkbox>
                            </el-checkbox-group>
                        </el-row>
                    </el-row>
                </el-form-item>
                <el-form-item label="既往病史">
                    <el-row :gutter="0">
                        <el-button v-if="!oldInputVisible" class="button-new-tag" size="small" @click="showOldInput">+ 添加病史</el-button>
                        <el-input v-if="oldInputVisible" class="input-new-tag" v-model="oldInputValue" ref="oldTagInput" size="small" @keyup.enter.native="handleOldInputConfirm" @blur="handleOldInputConfirm">
                        </el-input>
                        <el-tag :key="tag" v-for="tag in medicalHistory" closable :disable-transitions="false" @close="handleOldClose(tag)">
                            {{tag}}
                        </el-tag>
                        <el-row :gutter="5" v-show="oldInputVisible" class="illDialog">
                            <i class="el-icon-close" @click=" oldInputVisible = false"></i>
                            <el-checkbox-group v-model="medicalHistory">
                                <el-checkbox v-for="(ill,i) in illOption" :key="i" :label="ill"></el-checkbox>
                            </el-checkbox-group>
                        </el-row>
                    </el-row>
                </el-form-item>
                <el-form-item label="其他疾病">
                    <el-input type="textarea" plain v-model.trim="form.medicalOther" placeholder="请输入其他疾病" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="禁忌药品">
                    <el-input type="textarea" plain v-model.trim="form.medicalAvoid" placeholder="请输入禁忌药品" maxlength="50" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="饮食禁忌">
                    <el-row :gutter="0">
                        <el-col :xl="4" :lg="4">
                            <el-checkbox v-model="hasTaboo" label="无禁忌" :disabled="showHasTaboo"></el-checkbox>
                        </el-col>
                    </el-row>
                    <el-checkbox-group v-model="yinshi" size="mini">
                        <el-row :gutter="0">
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="流质" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="半流质" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="软食" :disabled="otherDis"></el-checkbox>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0">
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="低盐" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="低糖" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="普食" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="糖尿病饮食" :disabled="otherDis"></el-checkbox>
                            </el-col>
                        </el-row>
                        <el-row :gutter="0">
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="忌糖" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="忌盐" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="忌海鲜" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="忌酸" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="忌辣" :disabled="otherDis"></el-checkbox>
                            </el-col>
                            <el-col :xl="4" :lg="4" :md="4">
                                <el-checkbox label="忌油" :disabled="otherDis"></el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </el-form-item>
            </el-row>
            <el-row :gutter="0">
                <el-form-item label="体检报告结论" prop="reportResult">
                    <el-input type="textarea" plain v-model.trim="form.reportResult" placeholder="请输入" maxlength="50" show-word-limit :disabled="notEdit==true"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="form.agreeStatus" :label="1">同意入院</el-radio>
                    <el-radio v-model="form.agreeStatus" :label="0">不同意入院</el-radio>
                </el-form-item>
            </el-row>
            <el-row :gutter="0">
                <el-form-item label="" style="text-align:center;">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>

<script type="text/javascript">
export default {
    name: "Health",
    props: ["estimateId"],
    data() {
        return {
            form: {
                reportResult: "", // 体检报告结论
                medicalOther: "", //  其他疾病
                medicalAvoid: "", //禁忌药品
                agreeStatus: null // 是否同意入院 默认1:同意入院
            },
            rules: {
                reportResult: [
                    {
                        required: true,
                        message: "请填写体检报告结论",
                        trrigger: "blur"
                    }
                ]
            },
            yinshi: [], // 禁忌饮食的值 空数组说明无禁忌
            illOption: [], // 后台获取的所有病列
            medicalHistory: [], // 既往病史的值
            medicalCurrent: [], // 现病史的值
            oldInputVisible: false, //控制既往病史手动添加病史 输入框的显示或隐藏
            oldIllVisible: false, //控制既往病史病史弹框显示与否
            currentInputVisible: false, // 控制现病史手动添加病史 输入框的显示或隐藏
            currentIllVisible: false, //控制先病史病史弹框显示与否
            inputValue: "", // 现病史手动添加的值
            oldInputValue: "", // 既往病史手动添加的值
            elderId: "", // 老人id
            otherDis: true, // 控制其他禁忌食品 禁用与否
            hasTaboo: true, // 是否无禁忌
            showHasTaboo: false // 是否显示“无禁忌”那一项，false表示显示
        };
    },
    components: {},
    mounted() {
        this.elderId = this.$route.query.elderId;
        this.getEvaluationData(this.elderId);
    },
    computed: {
        yinshiLength() {
            return this.yinshi.length;
        }
    },
    watch: {
        hasTaboo(newValue, oldValue) {
            if (newValue) {
                this.yinshi = [];
                this.otherDis = true;
            } else {
                // this.showHasTaboo = true;
                this.otherDis = false;
            }
        },
        yinshiLength(newValue, oldValue) {
            if (newValue > 0) {
                this.showHasTaboo = true;
                this.hasTaboo = false;
            } else {
                this.showHasTaboo = false;
                this.hasTaboo = true;
            }
        }
    },
    created() {
        this.getMedicalHistory();
    },
    methods: {
        /*添加过往病例*/
        getMedicalHistory(str) {
            let data = {
                parentNos: "病史"
            };
            axios
                .fetch(
                    "medicalServer",
                    "/api/template/diagnosis-names",
                    null,
                    null,
                    "get"
                )
                .then(res => {
                    this.illOption = res.data;
                });
        },
        // 现病史
        handleClose(tag) {
            this.medicalCurrent.splice(this.medicalCurrent.indexOf(tag), 1);
        },
        // 现病史
        showInput() {
            this.currentInputVisible = true;
            this.oldInputVisible = false;
            this.$nextTick(_ => {
                this.$refs.currentTagInput.$refs.input.focus();
            });
        },
        // 现病史失焦/回车事件
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                const flag = this.medicalCurrent.includes(inputValue);
                if (!flag) {
                    this.medicalCurrent.push(inputValue);
                    this.inputValue = "";
                } else {
                    this.$message.warning("该疾病已存在,无须重复添加");
                }
            }
            // this.currentInputVisible = false;
        },
        /** 既往病史 */
        showOldInput() {
            this.currentInputVisible = false;
            this.oldInputVisible = true;
            this.$nextTick(_ => {
                this.$refs.oldTagInput.$refs.input.focus();
            });
        },
        // 既往病史失焦/回车事件
        handleOldInputConfirm() {
            let oldInputValue = this.oldInputValue;
            const flag = this.medicalHistory.includes(oldInputValue);
            if (oldInputValue) {
                if (!flag) {
                    this.medicalHistory.push(oldInputValue);
                    this.oldInputValue = "";
                } else {
                    this.$message.warning("该疾病已存在,无须重复添加");
                }
            }
        },
        // 删除选择后的既往病史的值
        handleOldClose(tag) {
            this.medicalHistory.splice(this.medicalHistory.indexOf(tag), 1);
        },

        /** 获取评估数据 */
        async getEvaluationData(id) {
            const res = await axios.fetch("elderServer", "/elderMedical/all", {
                elderId: id
            });
            console.log(res);
            if (res.data) {
                this.form.medicalAvoid = res.data.medicalAvoid
                    ? res.data.medicalAvoid
                    : ""; //禁忌药品
                this.form.reportResult = res.data.reportResult; //体检结论
                this.form.medicalOther = res.data.medicalOther; //其他疾病
                this.form.agreeStatus = res.data.agreeStatus ? 1 : 0; //其他疾病
                if (!res.data.dietAvoid) {
                    this.hasTaboo = true;
                }
                this.yinshi = res.data.dietAvoid
                    ? res.data.dietAvoid.split(",")
                    : [];
                this.medicalCurrent = res.data.medicalCurrent
                    ? res.data.medicalCurrent.split(",")
                    : [];
                this.medicalHistory = res.data.medicalHistory
                    ? res.data.medicalHistory.split(",")
                    : [];
            }
        },
        /** 保存健康评估 */
        save() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    const param = {
                        elderId: this.elderId,
                        dietAvoid:
                            this.yinshi.length > 0 ? this.yinshi.join() : "",
                        medicalCurrent:
                            this.medicalCurrent.length > 0
                                ? this.medicalCurrent.join()
                                : "",
                        medicalHistory:
                            this.medicalHistory.length > 0
                                ? this.medicalHistory.join()
                                : "",
                        medicalAvoid: this.form.medicalAvoid,
                        medicalOther: this.form.medicalOther,
                        reportResult: this.form.reportResult,
                        agreeStatus: this.form.agreeStatus
                    };
                    const res = await axios.fetch(
                        "elderServer",
                        "/elderMedical/submit",
                        param,
                        "json"
                    );
                    if (res.code == 200) {
                        this.$message.success("保存成功!");
                        this.$router.go(-1);
                    }
                } else {
                    this.$message.warning("请完善表单信息");
                }
            });
        },
        cancel() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="less" scoped>
.health {
    padding: 20px;
    .el-tag {
        border: 1px solid rgba(0, 0, 0, 0.4);
        color: black;
        background-color: #fff;
        /deep/ .el-icon-close {
            color: #fff;
            background-color: black;
            transform: scale(0.6);
            border: 1px solid black;
        }
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .illDialog {
        i {
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 0;
            text-align: center;
            width: 20px;
            height: 20px;
        }
        z-index: 10;
        background-color: #fff;
        padding: 10px;
        position: absolute;
        border: 1px solid #cccccc;
        border-radius: 5px;
    }
}
</style>
