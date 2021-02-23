<template>
    <div>
        <el-form ref="searchForm" :inline="true" class="search" :model="searchForm" label-width="75px">
            <el-button class="back-btn"  @click="backList()" size="mini">
                <span>返回</span>
            </el-button>
            <el-form-item label="评估类别:">
                <span>{{params.estimateType | typeFilter}}</span>
            </el-form-item>
            <el-form-item label="照护等级:">
                <span>{{params.levelName}}</span>
            </el-form-item>
            <el-form-item label="评估次数:">
                <span>{{params.estimateCount}}</span>
            </el-form-item>
            <el-form-item label="评估人:">
                <span>{{params.creator}} {{params.doctorName}}</span>
            </el-form-item>
            <el-form-item label="评估时间:">
                <span>{{params.createTime }}</span>
            </el-form-item>

        </el-form>
        <el-form label-width="5em">
            <div class="table-card">
                <el-row style="padding:10px 0 10px 20px;border-bottom: 1px solid #ddd;background: #FBFBFC;">
                    <el-button v-for="(item,index) in tabs" style="width: 8em;" :type="index==isActive?'primary':''" @click="isActive=index" :key="index">{{item}}</el-button>
                </el-row>
                <SeeProject v-if="isActive == 0 && !isNew"></SeeProject>
                <SeeProjectNew v-if="isActive == 0 && isNew"></SeeProjectNew>
                <SeeReport v-if="isActive == 1 && !isNew"></SeeReport>
                <SeeReportNew v-if="isActive == 1 && isNew"></SeeReportNew>
                <SeeOld v-if="isActive == 2"></SeeOld>
            </div>
        </el-form>
    </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";
import SeeProjectNew from "./viewProjectNew";
import SeeProject from "./viewProject";
import SeeReport from "./viewReport";
import SeeReportNew from "./viewReportNew";
import SeeOld from "./viewOld";
export default {
    components: { SeeProject, SeeReport, SeeOld ,SeeProjectNew ,SeeReportNew},
    data() {
        return {
            tabs: ["评估项目", "评估报告", "养老服务建议"],
            isActive: 0,
            // show: true,
            params: {},
            sign: "",
            formData: null,
            isNew:false
        };
    },
    created() {
        this.params = JSON.parse(this.$route.query.repairParams);
        this.isNew = this.params.version !== null ? true : false;
        console.log(typeof this.isNew);
    },
    methods: {
        backList() {
            this.$router.go(-1);
            // this.$router.push("/elder/care/assessList");
        }
    },
    filters: {
        typeFilter: val => {
            if (val === 0) {
                return "首次评估";
            } else if (val === 1) {
                return "复核评估";
            } else if (val === 2) {
                return "持续评估";
            } else {
                return "--";
            }
        }
    }
};
</script>

<style scoped>
.table-card {
    background: #fff;
    padding-bottom: 20px;
}
.table-card .el-button {
    width: 110px;
    height: 36px;
    margin-right: 20px;
    font-size: 16px;
}
.checkBtn {
    color: #fff;
    border-color: #fff;
    background-color: #4687e1;
}
.searchBtn {
    color: #333;
    background-color: #fff;
}
</style>