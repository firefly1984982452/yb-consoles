<template>
    <div>
        <el-form :inline="true" class="search" :model="searchData">
            <el-form-item label="姓名">
                <el-input v-model="searchData.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="入职日期">
                <el-date-picker v-model="dateValues" type="daterange" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="部门">
                <el-select v-model="searchData.deptId" placeholder="请选择" clearable>
                    <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                </el-select>
            </el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
            <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
        </el-form>
        <div class="content">
            <el-row type="flex" class="pannel">
                <el-col>
                    <el-button @click="searchByStatus(1)" :type="searchData.status == 1 ? 'primary' : ''">在职</el-button>
                    <el-button @click="searchByStatus(-1)" :type="searchData.status == -1 ? 'primary' : ''">离职</el-button>
                </el-col>
                <el-col class="right">
                    <el-button type="success" icon="el-icon-plus" @click="add()">添加员工</el-button>
                    <el-button icon="el-icon-document-copy" class="button-purple" @click="datasync()">同步数据</el-button>
                </el-col>
            </el-row>
            <el-table :data="listData" border class="ub-table">
                <el-table-column prop="deptName" label="部门"></el-table-column>
                <el-table-column prop="jobName" label="岗位"></el-table-column>
                <el-table-column prop="jobNumber" label="工号" min-width="60"></el-table-column>
                <el-table-column prop="employeeName" label="姓名" min-width="50"></el-table-column>
                <el-table-column prop="gender" label="性别" min-width="25"></el-table-column>
                <el-table-column prop="registerPlace" label="户籍类型" min-width="40"></el-table-column>
                <el-table-column prop="cardNo" label="身份证号" min-width="100"></el-table-column>
                <el-table-column prop="mobilePhone" label="联系方式" min-width="70"></el-table-column>
                <el-table-column prop="joinDate" label="入职日期" :formatter="date" min-width="50"></el-table-column>
                <el-table-column prop="dimissionDate" label="离职日期" v-if="searchData.status == -1" :formatter="date" min-width="50"></el-table-column>
                <el-table-column prop="syncStatus" label="是否同步" min-width="40">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.syncStatus"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="handleStatusChange(scope.row)"
                            >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看" placement="top">
                            <el-button icon="iconfont iconcaozuotubiao-chakan" @click="view(scope.row)" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button v-if="scope.row.status == 1" @click="edit(scope.row)" icon="iconfont iconcaozuotubiao-bianji" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="离职" placement="top">
                            <el-button v-if="scope.row.status == 1" @click="dismisson(scope.row)" icon="iconfont iconcaozuotubiao-lizhi-xuanfu" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="密码" placement="top">
                            <el-button v-if="permissionPassword && scope.row.status == 1" @click="showPassword(scope.row)" icon="iconfont iconcaozuotubiao-zhongzhimima" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="微信" placement="top">
                            <el-button v-if="permissionWechat && scope.row.status == 1" @click="showWechat(scope.row)" icon="el-icon-connection" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
        <el-dialog title="离职处理" :visible.sync="visibleQuit" width="600px" center top="20vh" modal="true">
            <el-row class="warp">
                <el-col style="margin-top:20px;">
                    <el-form :model="quitForm" :rules="quitRules" ref="quitForm">
                        <el-row :gutter="20">
                            <el-col :span="7" id="quitDiags" class="center">
                                <img :src="staffForm.employeePhoto" alt id="quitDiagsImg" v-if="staffForm.employeePhoto">
                                <img src="//image.youbankeji.com/web/dahuaAdmin/Group 4@2x.png" id="quitDiagsImg" alt class="cardId" v-if="!staffForm.employeePhoto">
                                <h5>{{staffForm.employeeName}}</h5>
                                <h6>{{staffForm.jobName}}</h6>
                            </el-col>
                            <el-col :span="17">
                                <el-row :gutter="0">
                                    <el-form-item label="离职日期：" prop="dimissionDate">
                                        <el-date-picker v-model="quitForm.dimissionDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
                                    </el-form-item>
                                </el-row>
                                <el-row>
                                    <el-form-item label="离职原因：" prop="dimissionRemark">
                                        <el-input type="textarea" v-model="quitForm.dimissionRemark" placeholder="请输入离职原因" rows="6"></el-input>
                                    </el-form-item>

                                </el-row>
                                <el-row>
                                    <el-col span="24" class="center">
                                        <el-button type="primary" @click="submitDismisson()">提交</el-button>
                                        <el-button @click="visibleQuit = false">关闭</el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
        <ub-wechat ref="wechat"></ub-wechat>
        <ub-password ref="thePassword"></ub-password>
    </div>
</template>

<script>
import { axios, permission } from "youban-utils";
import utilsTable from "@/utils/table";
import { makeElementTree } from "@/utils/tree.js";
import qs from "qs";
import ubWechat from '@/components/wechat-binding';
import ubPassword from '@/components/password'

export default {
    components: { ubWechat, ubPassword },
    data() {
        let that = this;
        return {
            permissionPassword: false,
            permissionWechat: false,
            visibleQuit: false,
            listData: [],
            dataCount: 0,
            deptList: [],
            staffForm: {},
            quitForm: {},
            searchData: {
                name: null,
                startDate: "",
                endDate: "",
                deptId: null,
                status: 1,
                pageSize: 10,
                pageIndex: 1
            },
            registerPlaces: [],
            quitRules: {
                dimissionDate: [
                    {
                        required: true,
                        message: "请输入离职日期",
                        trigger: ["blur", "change"]
                    }
                ],
                dimissionRemark: [
                    {
                        required: true,
                        message: "请输入离职原因",
                        trigger: ["blur", "change"]
                    }
                ]
            },
        };
    },
    computed: {
        dateValues: {
            get() {
                return [this.searchData.startDate, this.searchData.endDate];
            },
            set(value) {
                this.searchData.startDate = value ? value[0] : "";
                this.searchData.endDate = value ? value[1] : "";
            }
        }
    },
    mounted() {
        let data = {
            parentNos: "户籍类型"
        };
        axios
            .fetch("commonServer", "/dict/getItemViewsByParentNo", data)
            .then(res => {
                this.registerPlaces = res.data;
            });
    },
    created() {
        this.permissionPassword = permission.hasPermission('uban.oa.employee.password');
        this.permissionWechat = permission.hasPermission('uban.oa.employee.wechat');
        this.initData();
        this.fetchData();
    },
    methods: {
        ...utilsTable,
        registerPlaceFormatter(row, column, value, index) {
            let objects = this.registerPlaces;
            for (let key of Object.keys(objects)) {
                if (objects[key].itemValue == value) {
                    return objects[key].itemName;
                }
            }
        },
        initData() {
            let that = this;
            axios.fetch("oaServer", "/org/dept/list", {}).then(res => {
                that.deptList = res.data;
            });
        },
        search() {
            this.changePage(1);
        },
        searchByStatus(status) {
            this.searchData.status = status;
            this.changePage(1);
        },
        reset() {
            this.searchData.name = null;
            this.searchData.startDate = "";
            this.searchData.endDate = "";
            this.searchData.deptId = null;
            this.changePage(1);
        },
        changePage(value) {
            this.searchData.pageIndex = value;
            this.fetchData();
        },
        fetchData() {
            let that = this;
            axios
                .fetch("oaServer", "/employee/query", this.searchData)
                .then(res => {
                    that.listData = res.data;
                    that.dataCount = res.total;
                });
        },
        showPassword(item) {
            let thePassword = this.$refs["thePassword"];
            item.displayName = item.employeeName;
            thePassword.show(item);
        },
        edit(data) {
            this.$store.commit("setShowParent", 1);
            let employeeId = data.employeeId;
            this.$router.push({
                path: "/oa/employee/edit?currentTab=edit&sign=edit",
                query: {
                    employeeId: employeeId
                }
            });
        },
        add() {
            this.$router.push({
                path: "/oa/employee/edit?currentTab=edit&sign=add"
            });
        },
        view(data) {
            this.$store.commit("setShowParent", 1);
            let employeeId = data.employeeId;
            this.$router.push({
                path: "/oa/employee/viewDetail?currentTab=viewDetail&sign=view",
                query: {
                    employeeId: employeeId
                }
            });
        },
        dismisson(data) {
            let theForm = this.$refs["quitForm"];
            if (theForm) {
                theForm.resetFields();
            }
            this.quitForm = {};
            this.staffForm = data;
            this.visibleQuit = true;
        },
        submitDismisson() {
            this.quitForm.employeeId = this.staffForm.employeeId;
            let params = qs.stringify(this.quitForm);
            this.$refs["quitForm"].validate(valid => {
                if (!valid) {
                    return false;
                } else {
                    axios
                        .fetch("oaServer", "/employee/leaveOffice", params)
                        .then(res => {
                            this.$message({
                                message: "提交成功",
                                type: "success"
                            });
                            this.visibleQuit = false;
                            this.fetchData();
                        });
                }
            });
        },
        datasync(){
            this.$axios.fetch('datasyncServer',"/district/cityData").then(res => {
                if(res.code == 200){
                    this.$message.success(res.data);
                } else {
                    this.$message.error(res.message);
                }
            });
            this.$axios.fetch('datasyncServer','/district/employee').then(res=>{
                if(res.code == 200 ){
                    this.$message.success(res.data);
                    this.initData();
                } else {
                    this.$message.error(res.message);
                }
            })
        },
        showWechat(item) {
          this.$refs['wechat'].showQrCode(item.employeeId, item.employeeName);
        },
        // 切换区网同步
        handleStatusChange(data){
            axios.fetch('oaServer','/employee/editSync',{
                employeeId:data.employeeId,
                syncStatus:data.syncStatus,
            },'json').then(res=>{
                this.$message.success('操作成功!')
            })
        }
    }
};
</script>

<style lang="less" scoped>
.name-tips {
    margin-left: 30px;
}
.error-tips {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
}
#quitDiagsImg {
    width: 150px !important;
    height: 197px !important;
}
.el-textarea {
    display: inline-block;
    width: 220px;
}
.center {
    text-align: center;
}
</style>