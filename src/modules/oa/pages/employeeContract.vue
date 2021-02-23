<template>
    <div>
        <EmployeeHeader></EmployeeHeader>
        <div class="content" style="padding:0px">
            <el-card class="box-card">
                <el-row type="flex" class="block">
                    <el-col>
                        <s class="qingseBa"></s>
                        <span>{{employee.employeeName}}</span><span class="small">入职时间{{ employee.joinDate}}</span>
                    </el-col>
                    <el-col :span="2" class="right">
                        <el-button type="success" @click="add()" icon="el-icon-plus" v-if="sign!='view'">添加合同</el-button>
                    </el-col>
                </el-row>
                <div>
                    <el-timeline>
                        <el-timeline-item v-for="(item, index) in contracts" :key="index" size="large" :color="item.isCurrent===1?'#f49b31':''">
                            <p>
                                <span>{{item.startDate|dateFilter}}</span>
                                <span v-if="item.isCurrent===1" class="using">使用中</span>
                            </p>
                            <el-card class="contact-content">
                                <el-row>
                                    <el-col :span="5">
                                        <span class="contract-label">合同编号</span><span>{{item.contractNo}}</span>
                                    </el-col>
                                    <el-col :span="5">
                                        <span class="contract-label">岗位类型</span><span>{{item.workType|workTypeFilter}}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        <span class="contract-label">有效期</span><span>{{item.startDate}} 至 {{item.endDate || '不定期'}}</span>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="5">
                                        <span class="contract-label">聘用方式</span><span>{{item.contractType|contractTypeFilter}}</span>
                                    </el-col>
                                    <el-col :span="5">
                                        <span class="contract-label">是否缴金</span><span>{{item.joinInsurance|booleanText}}</span>
                                    </el-col>
                                    <el-col :span="8">
                                        <span class="contract-label">是否事业编制</span><span>{{item.isOfficial|booleanText}}</span>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-card>
            <el-dialog title="添加合同" :show-close="false" :visible="formVisible" width="450px" center top="20vh" v-if="sign!='view'">
                <el-form :model="form" :label-position="left" status-icon :rules="rules" ref="ruleForm" label-width="120px" size="mini">
                    <el-form-item label="合同期限" prop="startDate">
                        <el-date-picker v-model="form.startDate" value-format="yyyy-MM-dd" type="date" placeholder="合同开始日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="endDate">
                        <el-date-picker v-model="form.endDate" type="date" value-format="yyyy-MM-dd" placeholder="合同结束日期"></el-date-picker>
                        <div>（结束日期不填则为不定期合同）</div>
                    </el-form-item>
                    <el-form-item label="聘用方式" prop="contractType">
                        <el-select v-model="form.contractType" placeholder="请选择">
                            <el-option v-for="item in contractTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="岗位类型" prop="workType">
                        <el-select v-model="form.workType" placeholder="请选择">
                            <el-option v-for="item in workTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否事业编制" prop="isOfficial">
                        <el-radio-group v-model="form.isOfficial">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否缴金" prop="joinInsurance">
                        <el-radio-group v-model="form.joinInsurance">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                    <el-button @click="formVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import { OssUrlPic, OssUrlNoPic } from "@/utils/utils.js";
import EmployeeHeader from "./employeeHeader";

export default {
    data() {
        return {
            contractTypes: [
                { value: "1", label: "劳务合同" },
                { value: "0", label: "劳动合同" }
            ],
            workTypes: [
                { value: "1", label: "全职" },
                { value: "0", label: "兼职" }
            ],
            org: {},
            formVisible: false,
            employeeId: null,
            employee: {},
            currentTab: "contract",
            isReadOnly: false,
            ossUrl: OssUrlPic,
            show: false,
            option: [],
            contract: {},
            contracts: [],
            loading: false,
            selectDeptIds: [],
            form: {
                startDate:'',
                endDate:''
            },
            sign: "view",
            rules: {
                startDate: [
                    {
                        required: true,
                        message: "请输入合同开始期限",
                        trigger: ["blur", "change"]
                    }
                ],
                endDate: [
                    {
                        required: false,
                        message: "请输入合同结束期限",
                        trigger: ["blur", "change"]
                    }
                ],
                workType: [
                    {
                        required: true,
                        message: "请输入岗位类型",
                        trigger: ["blur", "change"]
                    }
                ],
                contractType: [
                    {
                        required: true,
                        message: "请输入聘用方式",
                        trigger: ["blur", "change"]
                    }
                ],
                isOfficial: [
                    {
                        required: true,
                        message: "请输入是否事业编制",
                        trigger: ["blur", "change"]
                    }
                ],
                joinInsurance: [
                    {
                        required: true,
                        message: "请输入是否缴金",
                        trigger: ["blur", "change"]
                    }
                ]
            }
        };
    },
    created() {
        this.employeeId = this.$route.query.employeeId;
        this.form.employeeId = this.employeeId;
        this.sign = this.$route.query.sign;
        let data = { employeeId: this.employeeId };

        axios.fetch("oaServer", "/employee/get", data).then(res => {
            this.employee = res.data;
        });
        this.init();
    },
    computed: {},
    components: {
        EmployeeHeader
    },
    mounted() {},
    methods: {
        init() {
            let data = { employeeId: this.employeeId };
            axios
                .fetch("oaServer", "/employee/contract/get", data)
                .then(res => {
                    this.contracts = res.data;
                });
        },
        selectTool(cid) {
            let data = {
                parentNos: cid
            };
            axios
                .fetch("commonServer", "/dict/getItemViewsByParentNo", data)
                .then(res => {
                    this.option = res.data;
                });
        },

        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return true;
                } else {
                    let data = qs.stringify(this.form);
                    axios
                        .fetch("oaServer", "/employee/contract/update", data)
                        .then(res => {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            });
                            this.init();
                            this.formVisible = false;
                        });
                }
            });
        },
        add() {
            let theForm = this.$refs["ruleForm"];
            if (theForm) {
                theForm.resetFields();
            }
            this.form = {
                employeeId: this.employeeId,
                startDate:'',
                endDate:'',
                contractType: "",
                workType: "",
                isOfficial: "",
                joinInsurance: ""
            };
            this.formVisible = true;
        }
    },
    filters: {
        booleanText: val => {
            if (val == 1) {
                return "是";
            } else {
                return "否";
            }
        },
        dateFilter: val => {
            if (val) {
                val =
                    parseInt(val.substr(0, 4)) +
                    1 +
                    "年" +
                    val.substr(5, 2) +
                    "月" +
                    val.substr(8, 2) +
                    "日";
            } else {
                val = "";
            }
            return val;
        },
        workTypeFilter: val => {
            if (val == 1) {
                return "全职";
            } else {
                return "兼职";
            }
        },
        contractTypeFilter: val => {
            if (val == 1) {
                return "劳务合同";
            } else {
                return "劳动合同";
            }
        }
    }
};
</script>
<style scoped>
@import url("../../../assets/styles/media.css");

.el-timeline-item span.using {
    background: #f49b31;
    color: #fff;
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 4px;
}
.contact-content {
    margin-top: 10px;
}
.contract-label {
    margin-right: 20px;
}
.small {
    font-size: 12px;
    color: gainsboro;
    margin-left: 10px;
}

.block {
    margin-bottom: 15px;
    padding: 0 0 10px 0;
    border-bottom: 1px solid darkgrey;
}
.view-container button {
    width: 10%;
}

.qingseBa {
    display: inline-block;
    width: 4px;
    height: 20px;
    border-radius: 3px;
    position: relative;
    top: 4px;
    margin-right: 10px;
}

.qingseBa {
    background: #2fc07a;
}

/deep/ .el-card__body {
    padding: 25px;
}
/deep/ .el-input__inner {
    width: 250px;
}
</style>