<template>
    <div>
        <EmployeeHeader></EmployeeHeader>
        <div class="content" style="padding:0px">
            <el-row>
                <el-col :span="24">
                    <el-row class="warp userList">
                        <el-col :span="4" class style="z-index:1;">
                            <div id="imgPreview" style="position:relative;left: 20%;top:20px">
                                <img id="img3" :src="form.employeePhoto" v-if="form.employeePhoto">
                                <img id="img3" src="//image.youbankeji.com/web/dahuaAdmin/Group 4@2x.png" alt v-if="!form.employeePhoto ||form.employeePhoto == ''">
                            </div>
                        </el-col>
                        <!-- 2 -->
                        <el-col :span="20" style="margin-top:20px;">
                            <el-form label-width="140px" :model="form" :rules="rules" ref="ruleForm">
                                <el-row :gutter="10">
                                    <el-col :span="7">
                                        <el-form-item label="姓名" prop="employeeName">
                                            <span>{{form.employeeName}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="7">
                                        <el-form-item label="性别" prop="gender">
                                            <span>{{form.gender}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="7">
                                        <el-form-item label="出生日期" prop="birthDay">
                                            <span>{{form.birthDay}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="7">
                                        <el-form-item label="籍贯" prop="birthPlace">
                                            <span>{{form.birthPlace}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="身份证号" prop="cardNo">
                                            <span>{{form.cardNo}}</span>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="7">
                                        <el-form-item label="民族" prop="nation">
                                            <span>{{form.nation}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="7">
                                        <el-form-item label="学历" prop="educational">
                                            <span>{{form.educational}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="手机号" prop="mobilePhone">
                                            <span>{{form.mobilePhone}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="婚姻状况" prop="marriage">
                                            <span>{{form.marriage}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="7">
                                        <el-form-item label="部门" prop="selectDeptIds">
                                            <span>{{form.deptName}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="岗位" prop="jobId">
                                            <span>{{form.jobName}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="入职日期" prop="joinDate">
                                            <span>{{form.joinDate}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="7">
                                        <el-form-item label="紧急联系人" prop="emergencyName">
                                            <span>{{form.emergencyName}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="紧急联系电话" prop="emergencyPhone">
                                            <span>{{form.emergencyPhone}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="政治面貌">
                                            <span>{{form.polity}}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row :gutter="0">
                                    <el-form-item label="户籍类型" prop="registerPlace">
                                        <span>{{form.registerPlace}}</span>
                                    </el-form-item>
                                </el-row>
                                <el-row :gutter="0">
                                    <el-row>
                                        <el-col :span="24" style="margin-right: 10px;">
                                            <el-form-item label="户籍地址" prop="registerProvince">
                                                <span v-if="form.registerProvince">{{form.registerProvince}}{{form.registerCity}}{{form.registerDistrict}}{{form.registerAddress}}</span>
                                                <span v-else>--</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-if="form.registerRoad!=''||form.registerAlley!=''||form.registerNumber!=''||form.registerRoom!=''">
                                        <el-col :span="24">
                                            <el-form-item label="" prop="registerRoad">
                                                <span>{{form.registerRoad|addressFilter}}路{{form.registerAlley|addressFilter}}弄{{form.registerNumber|addressFilter}}号{{form.registerRoom|addressFilter}}室</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="0">
                                        <el-col :span='24'>
                                            <el-form-item label="" prop="registerAddress">
                                                <span>{{form.registerAddress}}</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-row>
                                <el-row>
                                    <el-row :gutter="10">
                                        <el-col :span="24">
                                            <el-form-item label="现居住地" prop="residenceProvince">
                                                <span v-if="form.residenceProvince">{{form.residenceProvince}}{{form.residenceCity}}{{form.residenceDistrict}}{{form.residenceAddress}}</span>
                                                <span v-else>--</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-if="form.residenceRoad!=''||form.residenceAlley!=''||form.residenceNumber!=''||form.residenceRoom!=''">
                                        <el-col :span="24">
                                            <el-form-item label="" prop="residenceRoad">
                                                <span>{{form.residenceRoad|addressFilter}}路{{form.residenceAlley|addressFilter}}弄{{form.residenceNumber|addressFilter}}号{{form.residenceRoom|addressFilter}}室</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="0">
                                        <el-col :span='24'>
                                            <el-form-item label="" prop="residenceAddress">
                                                <span>{{form.residenceAddress}}</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-row>
                                <el-row>
                                    <el-row :gutter="10">
                                        <el-col :span="7">
                                            <el-form-item label="工资银行卡号">
                                                <span>{{form.salaryBankNo}}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item label="工资卡开户行">
                                                <span>{{form.salaryBankName}}</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="10">
                                        <el-col :span="7">
                                            <el-form-item label="补贴卡号">
                                                <span>{{form.subsidyBankNo}}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="7">
                                            <el-form-item label="补贴卡开户行">
                                                <span>{{form.subsidyBankName}}</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row class="center" :gutter="0">
                                        <el-form-item label="">
                                            <el-col :span="2" style="margin-left: 10px;">
                                                <el-button @click="back()">关闭</el-button>
                                            </el-col>
                                        </el-form-item>
                                    </el-row>
                                </el-row>
                            </el-form>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import { OssUrlPic, OssUrlNoPic } from "@/utils/utils.js";
import EmployeeHeader from "./employeeHeader";
export default {
    inject: ["reload"],
    data() {
        return {
            ossUrl: OssUrlPic,
            ossNoUrl: OssUrlNoPic,
            showDash: 1,
            form: {},
            employeeId: null,
            loading: false
        };
    },
    created() {
        this.employeeId = this.$route.query.employeeId;
        this.sign = this.$route.query.sign;
        let data = {
            employeeId: this.employeeId
        };
        axios.fetch("oaServer", "/employee/get", data).then(res => {
            let resData = res.data;
            this.form = resData;
            this.changeArea("籍贯", 0, 1, resData.birthPlace);
            this.changeArea("户籍地址", 0, 1, resData.registerProvince);
            this.changeArea(
                "户籍地址",
                resData.registerProvince,
                2,
                resData.registerCity
            );
            this.changeArea(
                "户籍地址",
                resData.registerCity,
                3,
                resData.registerDistrict
            );
            this.changeArea(
                "户籍地址",
                resData.registerDistrict,
                4,
                resData.registerStreet
            );
            this.changeArea("现居住地", 0, 1, resData.residenceProvince);
            this.changeArea(
                "现居住地",
                resData.residenceProvince,
                2,
                resData.residenceCity
            );
            this.changeArea(
                "现居住地",
                resData.residenceCity,
                3,
                resData.residenceDistrict
            );
            this.changeArea(
                "现居住地",
                resData.residenceDistrict,
                4,
                resData.residenceStreet
            );
        });
    },
    computed: {},
    mounted() {},
    components: { EmployeeHeader },
    methods: {
        back() {
            this.$router.push("/oa/employee");
        },
        changeArea(category, parentNo, level, district) {
            let data = {
                parentNo: parentNo
            };
            axios
                .fetch("commonServer", "/dict/getDistrictByParentNo", data)
                .then(res => {
                    this.assembleArea(category, level, res.data, district);
                });
        },
        assembleArea(category, level, data, district) {
            let dis = data.filter(item => {
                return item.districtNo == district;
            });
            if (dis && dis.length > 0) {
                let districtNo = dis[0].title;
                if (category === "籍贯") {
                    this.form.birthPlace = districtNo;
                } else if (category === "户籍地址") {
                    if (level == 1) {
                        this.form.registerProvince = districtNo;
                    } else if (level == 2) {
                        this.form.registerCity = districtNo;
                    } else if (level == 3) {
                        this.form.registerDistrict = districtNo;
                    } else if (level == 4) {
                        this.form.registerStreet = districtNo;
                    }
                } else if (category === "现居住地") {
                    if (level == 1) {
                        this.form.residenceProvince = districtNo;
                    } else if (level == 2) {
                        this.form.residenceCity = districtNo;
                    } else if (level == 3) {
                        this.form.residenceDistrict = districtNo;
                    } else if (level == 4) {
                        this.form.residenceStreet = districtNo;
                    }
                }
            }
        }
    },
    filters: {
        addressFilter: val => {
            if (!val || val == "") {
                val = "--";
            }
            return val;
        }
    }
};
</script>
<style scoped>
@import url("../../../assets/styles/main.css");
@import url("../../../assets/styles/media.css");
</style>