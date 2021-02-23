<template>
    <div>
        <el-form :inline="true" class="search" :model="searchData">
            <el-form-item label="描述分类">
                <el-input v-model="searchData.search_LIKES_name" placeholder=""></el-input>
            </el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
            <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
        </el-form>
        <div class="content">
            <el-row type="flex" class="pannel">
                <el-col class="right">
                    <el-button type="primary" icon="el-icon-plus" @click="add()">描述类别</el-button>
                </el-col>
            </el-row>
            <el-table :data="listData" border class="ub-table">
                <el-table-column prop="name" label="描述分类"></el-table-column>
                <el-table-column prop="childCount" label="模板条目"></el-table-column>
                <el-table-column prop="sortId" label="排序" min-width="60"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button @click="edit(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑模板内容条目" placement="top">
                            <el-button @click="editOptions(scope.row)" icon="iconfont iconcaozuotubiao-chakan" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" placement="top" content="删除">
                            <el-popconfirm confirmButtonText='确定' @onConfirm="deleteData(scope.row)" cancelButtonText='取消' icon="el-icon-info" iconColor="red" title="确认删除此类型？">
                                <i slot="reference" class="el-icon-delete-solid danger" />
                            </el-popconfirm>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>

        <el-dialog title="编辑描述类别" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :close-on-click-modal="false" width="400px" modal="true">
            <el-form :model="form" :label-position="left" :rules="rules" ref="ruleForm" label-width="80px">
                <el-form-item label="描述类别" prop="name">
                    <el-input clearable v-model.trim="form.name" placeholder="4字以内，如饮食、睡眠等" maxlength="4" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortId">
                    <input class="el-input__inner" v-model.trim="form.sortId" maxlength="7" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="从大到小排列，可以为小数">
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="submitForm()">确 定</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="optionTitle" :visible.sync="dialogOptionsVisible" :close-on-click-modal="false" width="800px" v-if="dialogOptionsVisible" :destroy-on-close="true" @close="fetchData();">
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
            dialogOptionsVisible: false,
            optionTitle: "",
            listData: [],
            dataCount: 0,
            form: {},
            optionParent: {},
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
                pageSize: 10,
                pageIndex: 1
            }
        };
    },
    computed: {},
    mounted() {},
    components: { editOption },
    created() {
        this.fetchData();
    },
    methods: {
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
                    "/api/category/page/1/0",
                    this.searchData,
                    null,
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
            this.$set(this.form, this.form);
            debugger;
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
                            if (!created) {
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
        editOptions(data) {
            data.type = 1;
            this.optionParent = data;
            this.optionTitle = "编辑模板内容【" + data.name + "】";
            this.dialogOptionsVisible = true;
        }
    }
};
</script>