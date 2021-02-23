<template>
    <div>
        <div class="content">
            <el-form :model="searchData">
                <el-row type="flex" class="pannel">
                    <el-col class="left" :span="3">
                        <el-button type="primary" icon="el-icon-plus" @click="addTemplate()">新增{{category.name}}</el-button>
                    </el-col>
                    <el-col class="right" :span="4" offset="17">
                        <el-input v-model="searchData.search_LIKES_name" placeholder="项目名称" @change="search" clearable>
                            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="listData" border class="ub-table">
                <el-table-column prop="name" :label="typeName()"></el-table-column>
                <el-table-column prop="childCount" :label="countName()" v-if="category.type!=7"></el-table-column>
                <el-table-column prop="diagnosisNames" label="适用诊断" v-if="category.type==7" :formatter="diagnosisNamesFormatter"></el-table-column>
                <el-table-column prop="sortId" label="排序" min-width="60"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button @click="editTemplate(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑模板内容条目" placement="top" v-if="category.type!=7">
                            <el-button @click="editOptions(scope.row)" icon="iconfont iconcaozuotubiao-chakan" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" placement="top" content="删除">
                            <el-popconfirm confirmButtonText='确定' @onConfirm="deleteTemplate(scope.row)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此类型？">
                                <i slot="reference" class="el-icon-delete-solid danger" style="font-size:18px;margin-left:8px" />
                            </el-popconfirm>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>

        <el-dialog title="新增/编辑类型" :visible.sync="dialogTemplateFormVisible" v-if="dialogTemplateFormVisible" :close-on-click-modal="false" width="650px" :append-to-body="true">
            <el-form :model="form" :label-position="left" :rules="rules" status-icon ref="ruleForm" label-width="80px">
                <el-form-item :label="typeName()" prop="name">
                    <el-input clearable v-model.trim="form.name" placeholder="16字以内" maxlength="16" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="拼音码" prop="pinyin" v-if="category.type==5">
                    <el-input clearable v-model.trim="form.pinyin" placeholder="拼音助记码" maxlength="16" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark" v-if="category.type==7">
                    <el-input type="textarea" rows="3" clearable v-model.trim="form.remark" placeholder="默认备注" maxlength="255" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="适用诊断" prop="diagnosis" v-if="category.type==7">
                    <el-select v-model="form.diagnosisNames" clearable placeholder="请选择" multiple @change=" filterByTag" style="width:100%">
                        <el-option v-for="item in diagnosisList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="sortId">
                    <input class="el-input__inner" clearable v-model.trim="form.sortId" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="从大到小排列，可以为小数">
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="submitTemplateForm()">确 定</el-button>
                <el-button @click="dialogTemplateFormVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="项目参数" :visible.sync="dialogOptionsVisible" :close-on-click-modal="false" width="800px" v-if="dialogOptionsVisible" :destroy-on-close="true" @close="fetchData();">
            <editOption v-model="optionParent"></editOption>
            <span slot="footer" class="right">
                <span>双击行进行修改，点保存按扭完成修改</span>
                <el-button @click="dialogOptionsVisible = false;fetchData();">关 闭</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { axios } from "youban-utils";
import editOption from "./editOption";
import qs from "qs";

export default {
    data() {
        let that = this;
        return {
            dialogFormVisible: false,
            dialogTemplateFormVisible: false,
            dialogOptionsVisible: false,
            optionTitle: "",
            listData: [],
            dataCount: 0,
            form: {},
            optionParent: {},
            sign: "",
            diagnosisList: [],
            typeNames: {
                "6": "疾病名称",
                "5": "项目名称",
                "7": "诊疗计划"
            },
            countNames: {
                "6": "鉴别诊断条目",
                "5": "参数条目"
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入描述类别",
                        trigger: ["blur", "change"]
                    }
                ],
                sortId: [
                    {
                        required: true,
                        message: "请输入排序",
                        trigger: ["blur", "change"]
                    }
                ]
            },
            searchData: {
                search_LIKES_name: "",
                pageSize: 10,
                pageIndex: 1
            }
        };
    },
    watch: {
        // $route: "fetchData"
    },
    props: {
        value: {
            type: Object,
            default() {
                return null;
            }
        }
    },
    components: { editOption },
    computed: {
        category: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        }
    },
    mounted() {},
    created() {
        if (this.category.type == 7) {
            axios
                .fetch(
                    "medicalServer",
                    "/api/template/list/5/0",
                    null,
                    null,
                    "get"
                )
                .then(res => {
                    this.diagnosisList = res.data;
                });
        }
        this.fetchData();
    },
    methods: {
        search() {
            this.changePage(1);
        },
        reset() {
            this.changePage(1);
        },
        changePage(value) {
            this.searchData.pageIndex = value;
            this.fetchData();
        },
        fetchData() {
            let that = this;
            axios
                .fetch(
                    "medicalServer",
                    "/api/template/page/" + this.category.type + "/0",
                    this.searchData,
                    "form",
                    "get"
                )
                .then(res => {
                    that.listData = res.data;
                    that.dataCount = res.total;
                });
        },

        edit(data) {
            this.form = JSON.parse(JSON.stringify(data));
            this.dialogFormVisible = true;
        },
        add() {
            this.form = {};
            this.dialogFormVisible = true;
        },
        submitForm() {
            let that = this;
            this.$refs["ruleForm"].validate(valid => {
                if (!valid) {
                    return true;
                } else {
                    let created = !this.form.id;
                    axios
                        .fetch(
                            "medicalServer",
                            "/api/category/1",
                            this.form,
                            "json"
                        )
                        .then(res => {
                            var msg = "";
                            if (created) {
                                msg = "修改成功";
                            } else {
                                msg = "添加成功";
                            }
                            this.$message.success(msg);
                            this.fetchData();
                            this.dialogFormVisible = false;
                        });
                }
            });
        },
        deleteData(data) {
            axios
                .fetch(
                    "medicalServer",
                    "/api/category/1/" + data.id,
                    null,
                    null,
                    "delete"
                )
                .then(res => {
                    this.$message.success("删除成功！");
                    this.fetchData();
                });
        },
        editTemplate(data) {
            this.form = JSON.parse(JSON.stringify(data));
            this.dialogTemplateFormVisible = true;
        },
        addTemplate() {
            this.form = {};
            this.dialogTemplateFormVisible = true;
        },
        submitTemplateForm() {
            let that = this;
            if (
                this.form.diagnosisNames &&
                this.form.diagnosisNames.length > 0
            ) {
                let temp = "";
                for (var i in this.form.diagnosisNames) {
                    temp += this.form.diagnosisNames[i] + ",";
                }
                this.form.content = temp.substring(0, temp.length - 1);
            } else {
                this.form.content = "";
            }
            this.$refs["ruleForm"].validate(valid => {
                if (!valid) {
                    return true;
                } else {
                    let created = !this.form.id;
                    axios
                        .fetch(
                            "medicalServer",
                            "/api/template/" + this.category.type,
                            this.form,
                            "json"
                        )
                        .then(res => {
                            var msg = "";
                            if (created) {
                                msg = "修改成功";
                            } else {
                                msg = "添加成功";
                            }
                            this.$message.success(msg);
                            this.fetchData();
                            this.dialogTemplateFormVisible = false;
                        });
                }
            });
        },
        deleteTemplate(data) {
            axios
                .fetch(
                    "medicalServer",
                    "/api/template/" + this.category.type + "/" + data.id,
                    null,
                    null,
                    "delete"
                )
                .then(res => {
                    this.$message.success("删除成功！");
                    this.fetchData();
                });
        },
        editOptions(data) {
            data.type = this.category.type * 10 + 1;
            this.optionParent = data;
            this.dialogOptionsVisible = true;
        },
        diagnosisNamesFormatter(row, column, value, index) {
            let objects = this.diagnosisList;
            let result = "";
            for (let i in value) {
                result += value[i] + "，";
            }
            if (result.length > 0) {
                result = result.substring(0, result.length - 1);
            }
            return result;
        },
        typeName() {
            return this.typeNames[this.category.type];
        },
        countName() {
            return this.countNames[this.category.type];
        }
    }
};
</script>
<style scoped>
/deep/ .el-input-group__append {
    padding: 0px;
}

/deep/ .el-input-group__append button {
    width: 60px;
    min-width: 60px;
    padding: 0px;
    margin: 0px;
}
</style>