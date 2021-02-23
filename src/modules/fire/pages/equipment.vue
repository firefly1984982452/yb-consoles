<template>
    <div class="app-container" id="liveCrList">
        <el-form ref="searchData" :model="searchData" inline="true" class="search" label-width="70px">
            <el-form-item label="分类" label-width="40px">
                <!--{{searchData.category}}-->
                <el-select v-model="searchData.category" placeholder="系统分类" clearable @change="shebeiFL(searchData.category)">
                    <el-option v-for="(item,index) in systemOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="" label-width="0">
                <el-select v-model="searchData.equipmentType" placeholder="设备分类" clearable>
                    <el-option v-for="(item,index) in systemOptionItems" :key="index" :label="item.equipmentName" :value="item.equipmentType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="安装位置" label-width="80px">
                <el-select v-model="searchData.floorName" placeholder="楼层" clearable @change="floorFL(searchData.floorName)">
                    <el-option v-for="(item,index) in floorOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="" label-width="20px">
                <el-select v-model="searchData.roomName" placeholder="具体位置" clearable>
                    <el-option v-for="(item,index) in installPositiondata" :key="index" :label="item.installPosition" :value="item.installPosition"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="设备名称">
                <el-input v-model="searchData.equipmentName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
            <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
        </el-form>
        <div class="content">
            <el-table :data="listData" border class="ub-table">
                <el-table-column label="序号" width="50" type="index" :index="indexAdd"></el-table-column>
                <el-table-column label="系统分类" min-width="100">
                    <template slot-scope="scope">{{scope.row.category | xitongFilter}}</template>
                </el-table-column>
                <el-table-column label="设备分类" min-width="120">
                    <template slot-scope="scope">{{scope.row.equipmentType | shebeiFilter}}</template>
                </el-table-column>
                <el-table-column label="图片" min-width="60">
                    <template slot-scope="scope">
                        <img style="width: 20px;" :src="ossUrl+scope.row.iconUrl" alt="" class="vistorClass" />
                        <div class="bglarge" @click="lgPic(ossUrl+scope.row.iconUrl)"></div>
                    </template>
                </el-table-column>
                <el-table-column label="设备编号" min-width="100">
                    <template slot-scope="scope">{{scope.row.deviceNo | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="设备名称" min-width="160">
                    <template slot-scope="scope">{{scope.row.equipmentName | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="型号" min-width="100">
                    <template slot-scope="scope">{{scope.row.equipmentModel | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="安装位置" min-width="100">
                    <template slot-scope="scope">{{scope.row.floorName}}<span>楼-</span>{{scope.row.installPosition | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="安装时间" min-width="100">
                    <template slot-scope="scope">{{scope.row.installDate | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="质保到期时间" min-width="100">
                    <template slot-scope="scope">{{scope.row.warrantyDate | nothingFilter}}</template>
                </el-table-column>
                <el-table-column label="状态" min-width="60">
                    <template slot-scope="scope">
                        <span style="color: #2FC07A;" v-if="scope.row.deviceStatus==1">正常</span>
                        <span style="color: #EB6969;" v-if="scope.row.deviceStatus==2">告警</span>
                        <span style="color: #F6812B;" v-if="scope.row.deviceStatus==3">故障</span>
                        <span style="color: #0078D4;" v-if="scope.row.deviceStatus==4">维保</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="70">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="已完成" placement="top-end" v-if="scope.row.deviceStatus==4">
                            <el-button size="mini" class="lookta" @click="already(scope.row)"><i class="iconfont iconcaozuotubiao-qiyong-zhengchang"></i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="复位" placement="top-end" v-if="scope.row.deviceStatus==3">
                            <el-button size="mini" class="lookta" @click="fuWei(scope.row)"><i class="iconfont iconcaozuotubiao-fuwei-zhengchang"></i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="报修" placement="top-end" v-if="scope.row.deviceStatus==3">
                            <el-button size="mini" class="lookta" @click="baoXiu(scope.row)"><i class="iconfont icontubiao-caozuotubiao-baoxiu"></i></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="报修" placement="top-end" v-if="scope.row.deviceStatus==1 || scope.row.deviceStatus==2">
                            <el-button size="mini" class="lookta"><i class="iconfont icontubiao-caozuotubiao-baoxiu" style="color: transparent;"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
        <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%" center>
            <el-row :gutter="20">
                <p style="text-align:center">{{text}}</p>
            </el-row>
            <span slot="footer">
                <el-button type="primary" @click="sureWaste()">确 定</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <LargerPic v-if="largePic == 1"></LargerPic>
    </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import LargerPic from "@/components/largerPic";

export default {
    data() {
        return {
            /*系统分类筛选*/
            systemOptions: [
                {
                    value: 0,
                    label: "火灾报警系统"
                },
                {
                    value: 1,
                    label: "消防灭火系统"
                },
                {
                    value: 2,
                    label: "应急疏散系统"
                }
            ],
            floorOptions: [
                {
                    value: 1,
                    label: "一楼"
                },
                {
                    value: 2,
                    label: "二楼"
                },
                {
                    value: 3,
                    label: "三楼"
                },
                {
                    value: 4,
                    label: "四楼"
                },
                {
                    value: 5,
                    label: "五楼"
                }
            ],
            listData: [],
            dataCount: 0,
            form: {},
            systemOptionItems: [],
            installPositiondata: [],
            loading: false,
            title: "提示",
            text: "",
            dialogFormVisible: false,
            currentPage3: 1,
            searchData: {
                category: "",
                equipmentType: "",
                floorName: "",
                roomName: "",
                installPosition: "",
                equipmentName: "",
                pageIndex: 1,
                pageSize: 10
            },
            option1: [],
            di_id: "",
            hdevice: ""
        };
    },
    components: {
        LargerPic
    },
    computed: {},
    created() {
        this.fetchData();
    },
    mounted() {},
    methods: {
        shebeiFL(cate) {
            this.searchData.equipmentType = "";
            if (cate === null || cate === "") {
                this.searchData.equipmentType = "";
                this.systemOptionItems = [];
                return;
            }
            let data = {
                category: cate
            };
            axios
                .fetch("fireServer", "/equipment/getEquipmentTypes", data)
                .then(res => {
                    this.systemOptionItems = res.data;
                });
        },
        floorFL(cate) {
            if (cate === null || cate === "") {
                this.searchData.roomName = "";
                this.installPositiondata = [];
                return;
            }
            let data = {
                floorName: cate
            };
            axios
                .fetch("fireServer", "/equipment/getInstallPositions", data)
                .then(res => {
                    this.installPositiondata = res.data;
                    this.searchData.roomName = "";
                });
        },
        indexAdd(index) {
            return (this.currentPage3 - 1) * 10 + (index + 1);
        },
        search() {
            this.changePage(1);
        },
        reset() {
            this.searchData = {
                category: "",
                equipmentType: "",
                floorName: "",
                roomName: "",
                installPosition: "",
                equipmentName: "",
                pageIndex: 1,
                pageSize: 10
            };
            this.changePage(1);
        },
        changePage(value) {
            this.searchData.pageIndex = value;
            this.fetchData();
        },
        fetchData() {
            axios
                .fetch(
                    "fireServer",
                    "/equipment/getDevicesPager",
                    this.searchData
                )
                .then(res => {
                    this.listData = res.data;
                    this.dataCount = res.total;
                });
        },
        lgPic(src) {
            this.$store.commit("setLargePic", 1);
            this.$store.commit("setLgwhichpic", src);
        },
        baoXiu(value) {
            this.dialogFormVisible = true;
            this.di_id = value.deviceId;
            this.hdevice = "报修";
            this.text =
                "确定要将" + "【" + value.equipmentName + "】" + "报修吗？";
        },
        fuWei(value) {
            this.dialogFormVisible = true;
            this.di_id = value.deviceId;
            this.hdevice = "复位";
            this.text =
                "确定要将" + "【" + value.equipmentName + "】" + "复位吗？";
        },
        already(value) {
            this.dialogFormVisible = true;
            this.di_id = value.deviceId;
            this.hdevice = "维保完成";
            this.text =
                "确定要将" +
                "【" +
                value.equipmentName +
                "】" +
                "已完成维保吗？";
        },
        /*确认*/
        sureWaste() {
            let diId = this.di_id;
            let hdevice = this.hdevice;
            axios
                .fetch(
                    "fireServer",
                    "/equipment/editEquipmentDevice" +
                        `?deviceId=${diId}&handleDevice=${hdevice}`
                )
                .then(res => {
                    if (res.data) {
                        this.$message.success("操作成功");
                        this.fetchData();
                        this.dialogFormVisible = false;
                    }
                });
        }
    },
    filters: {
        xitongFilter: val => {
            if (val === 0) {
                val = "火灾报警系统";
            } else if (val == 1) {
                val = "消防灭火系统";
            } else if (val == 2) {
                val = "应急疏散系";
            } else if (val == 100) {
                val = "智能健康";
            } else {
                val = "--";
            }
            return val;
        },
        shebeiFilter: val => {
            if (val === 1) {
                val = "感温探测器";
            } else if (val == 2) {
                val = "光电感烟探测器";
            } else if (val == 3) {
                val = "可燃气体探测器";
            } else if (val == 4) {
                val = "手动报警按钮";
            } else if (val == 5) {
                val = "水流指示器";
            } else if (val == 6) {
                val = "消火栓按钮";
            } else if (val == 7) {
                val = "压力开关";
            } else if (val == 8) {
                val = "声光报警器";
            } else if (val == 9) {
                val = "喷淋泵";
            } else if (val == 10) {
                val = "消防水泵";
            } else if (val == 11) {
                val = "信号蝶阀";
            } else if (val == 12) {
                val = "水压探测器";
            } else if (val == 13) {
                val = "消防栓";
            } else if (val == 14) {
                val = "灭火器";
            } else if (val == 15) {
                val = "消防门磁";
            } else if (val == 16) {
                val = "应急灯";
            }
            return val;
        }
    }
};
</script>
<style scoped>
.addBtn {
    margin: 0 0 0 10px;
    float: left;
}

.checkBtn {
    width: 95px;
    height: 36px;
    border: none;
    margin-left: 16px;
    margin-top: 10px;
}

.searchBtnsStyle {
    width: 95px;
    height: 36px;
    background: #4687e1;
    border: 1px solid #4687e1;
    border-radius: 4px;
    color: white;
    margin-left: 16px;
    margin-top: 10px;
}

.addEquipment {
    width: 95px;
    height: 36px;
    background: #6cbc6c;
    color: white;
    float: right;
    margin-right: 1%;
    /* margin-top: 10px; */
}

.addEquipment .iconfont {
    color: white;
    font-size: 12px;
}
/deep/ .search .el-select .el-input {
    width: 130px;
}
</style>