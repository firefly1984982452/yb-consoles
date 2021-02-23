<template>
    <div>
        <el-container>
            <el-aside style="border-right: 1px solid #eee;width:350px;padding-right:6px">
                <div class="category-header">
                    <div class="left">
                        <h3>项目类型</h3>
                    </div>
                    <div class="right" v-if="category.type==3">
                        <el-select v-model="tagId" clearable placeholder="全部分类" style="width:140px;" @change="filterByTag">
                            <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="categories">
                    <draggable class="" element="ul" :list="filterCategories" :options="{group:'title', animation:150}" :no-transition-on-drag="true" @change="sortChanged">
                        <transition-group type="transition">
                            <div v-for="item in filterCategories" :key="item.id" class="category" :class="{active:parent.id ==item.id}" @click="selectCategory(item)">
                                <span>{{item.name}}</span>
                                <span>
                                    <el-popconfirm confirmButtonText='确定' @onConfirm="deleteData(item)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此条数据？">
                                        <i slot="reference" class="el-icon-delete-solid danger" />
                                    </el-popconfirm>
                                </span>
                                <span>
                                    <i class="iconfont iconcaozuotubiao-bianji" @click="edit(item)" />
                                </span>
                                <el-tag type="success" effect="dark" size="mini" v-if="category.type==3">{{tagName(item.tagId)}}</el-tag>
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div class="footer right">
                    <el-button type="primary" icon="el-icon-plus" @click="add()">新增类型</el-button>
                </div>
            </el-aside>
            <el-container>
                <el-main>
                    <div class="content">
                        <el-form :inline="true" v-model="searchData">
                            <el-row>
                                <el-col class="left" :span="3">
                                    <el-button type="primary" icon="el-icon-plus" @click="addTemplate()">新增项目</el-button>
                                </el-col>
                                <el-col class="right" :span="21">
                                    <el-form-item label="" label-width="0px">
                                        <el-input v-model="searchData.search_LIKES_name" placeholder="项目名称" @change="search" clearable>
                                            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-table :data="listData" border>
                            <el-table-column prop="name" label="项目名称" min-width="80"></el-table-column>
                            <el-table-column prop="inputType" label="输入模式" :formatter="inputTypeFormatter" min-width="60"></el-table-column>
                            <el-table-column prop="unit" label="参数单位" min-width="60"></el-table-column>
                            <el-table-column prop="childCount" label="参数条目" min-width="60"></el-table-column>
                            <el-table-column prop="sortId" label="排序" min-width="50"></el-table-column>
                            <el-table-column label="操作" align="left" min-width="50" class-name="operation">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                        <el-button @click="editTemplate(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="编辑模板内容条目" placement="top" v-if="scope.row.inputType<6">
                                        <el-button @click="editOptions(scope.row)" icon="iconfont iconcaozuotubiao-chakan" size="mini"></el-button>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" placement="top" content="删除">
                                        <el-popconfirm confirmButtonText='确定' @onConfirm="deleteTemplate(scope.row)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此类型？">
                                            <i slot="reference" class="el-icon-delete-solid danger" />
                                        </el-popconfirm>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
                    </div>
                </el-main>
            </el-container>
        </el-container>

        <el-dialog title="新增/编辑类型" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :close-on-click-modal="false" width="500px" :append-to-body="true">
            <el-form :model="form" :label-position="left" :rules="rules" status-icon ref="ruleForm" label-width="80px">
                <el-form-item label="类别名称" prop="name">
                    <el-input clearable v-model.trim="form.name" placeholder="16字以内" maxlength="16" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="分类标签" prop="tagId" v-if="category.type==3">
                    <el-select v-model.trim="form.tagId" clearable placeholder="选择分类">
                        <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="项目类型" :visible.sync="dialogTemplateFormVisible" v-if="dialogTemplateFormVisible" :close-on-click-modal="false" width="650px" :append-to-body="true">
            <el-form :model="form" :label-position="left" :rules="rules" status-icon ref="ruleTemplateForm" label-width="100px">
                <el-form-item label="项目类型">
                    <span>{{parent.name}}</span>
                </el-form-item>
                <el-form-item label="项目名称" prop="name">
                    <el-input clearable v-model="form.name" placeholder="16字以内" maxlength="16" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="输入模式" prop="inputType">
                    <el-radio-group v-model="form.inputType">
                        <el-radio-button v-for="item in inputTypes" :label="item.id" :key="item.id">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="参数单位" prop="unit">
                    <el-input clearable v-model="form.unit" placeholder="" maxlength="16" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortId">
                    <input class="el-input__inner" clearable v-model="form.sortId" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="从大到小排列，可以为小数">
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogTemplateFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitTemplateForm()">确 定</el-button>
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
import qs from "qs";
import editOption from "./editOption";
import draggable from "vuedraggable";

export default {
    data() {
        return {
            searchData: {},
            listData: [],
            dataCount: 0,
            form: {},
            dialogFormVisible: false,
            dialogTemplateFormVisible: false,
            dialogOptionsVisible: false,
            categories: [],
            filterCategories: [],
            //当前选择的目录
            parent: {},
            optionParent: {},
            tags: [],
            tagId: "",
            searchData: {
                search_LIKES_name: "",
                pageSize: 10,
                pageIndex: 1
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
                ],
                tagId: [
                    {
                        required: true,
                        message: "请选择分类标签",
                        trigger: ["blur", "change"]
                    }
                ],
                inputType: [
                    {
                        required: true,
                        message: "请选择输入模式",
                        trigger: ["blur", "change"]
                    }
                ]
            },
            inputTypes: [
                { id: 1, name: "单选框" },
                { id: 2, name: "多选框" },
                { id: 6, name: "单行输入框" },
                { id: 7, name: "多行输入框" }
            ]
        };
    },
    watch: {
        // $route: "init"
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
    created() {
        if (this.category.type == 3) {
            axios
                .fetch(
                    "medicalServer",
                    "/api/category/tags/",
                    null,
                    null,
                    "get"
                )
                .then(res => {
                    this.tags = res.data;
                });
        }
        this.init();
    },
    methods: {
        init() {
            axios
                .fetch(
                    "medicalServer",
                    "/api/category/list/" + this.category.type + "/0",
                    null,
                    null,
                    "get"
                )
                .then(res => {
                    this.categories = res.data;
                    this.filterCategories = this.categories;
                    if (res.data.length > 0) {
                        this.selectCategory(res.data[0]);
                    }
                });
        },
        filterByTag() {
            if (this.tagId != "") {
                this.filterCategories = this.categories.filter(item => {
                    return item.tagId == this.tagId;
                });
            } else {
                this.filterCategories = this.categories;
            }
            if (this.filterCategories.length > 0) {
                this.selectCategory(this.filterCategories[0]);
            } else {
                this.listData = [];
                this.total = 0;
            }
        },
        search() {
            this.changePage(1);
        },
        reset() {
            this.searchData.search_LIKES_name = "";
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
                    "/api/template/page/" +
                        this.category.type +
                        "/" +
                        this.parent.id,
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
                            "/api/category/" + this.category.type,
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
                            this.init();
                            this.dialogFormVisible = false;
                        });
                }
            });
        },
        deleteData(data) {
            axios
                .fetch(
                    "medicalServer",
                    "/api/category/" + this.category.type + "/" + data.id,
                    null,
                    null,
                    "delete"
                )
                .then(res => {
                    this.$message.success("删除成功！");
                    this.init();
                });
        },
        selectCategory(item) {
            this.parent = item;
            this.searchData.search_EQI_parentId = item.id;
            this.reset();
        },
        editTemplate(data) {
            data.position = data.position + "";
            this.form = JSON.parse(JSON.stringify(data));
            this.dialogTemplateFormVisible = true;
        },
        addTemplate() {
            this.form = {};
            this.dialogTemplateFormVisible = true;
        },
        submitTemplateForm() {
            let that = this;
            this.form.parentId = this.parent.id;
            this.$refs["ruleTemplateForm"].validate(valid => {
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
        inputTypeFormatter(row, column, value, index) {
            let objects = this.inputTypes;
            for (let key of Object.keys(objects)) {
                if (objects[key].id == value) {
                    return objects[key].name;
                }
            }
        },
        tagName(value) {
            let objects = this.tags;
            for (let key of Object.keys(objects)) {
                if (objects[key].id == value) {
                    return objects[key].name;
                }
            }
            return "";
        },
        sortChanged() {
            let ids = [];
            for (var i in this.filterCategories) {
                ids.push(this.filterCategories[i].id);
            }
            axios
                .fetch("medicalServer", "/api/category/sort", ids, "json")
                .then(res => {
                    this.$message.success("排序保存成功");
                });
        }
    }
};
</script>
<style scoped>
.category {
    background-color: rgba(241, 244, 245, 1);
    margin: 4px 4px 4px 0px;
    padding: 6px;
    border-radius: 4px;
    font-size: 14px;
}
.category :nth-child(2) {
    float: right;
}
.category :nth-child(3) {
    float: right;
    margin-right: 4px;
}
.active {
    background-color: rgba(142, 194, 255, 1);
}
/deep/ .el-input-group__append {
    padding: 0px;
}
.category-header {
    margin-top: 8px;
    /* padding-bottom: 4px; */
    /* margin-bottom: 16px; */
    border-bottom: 1px solid #eeeeee;
    height: 32px;
}
.category-header .left {
    float: left;
}
.category-header .right {
    float: right;
    display: inline-block;
    margin-top: -4px;
}
/deep/ .category-header .el-input__inner {
    border: none;
}
.categories {
    height: 430px;
    border-bottom: 1px solid #eeeeee;
    overflow: auto;
}
/deep/ .el-input-group__append button {
    width: 60px;
    min-width: 60px;
    padding: 0px;
    margin: 0px;
}
</style>