<template>
    <el-tabs v-model="activeName" class="content" @tab-click="handleClick" style="padding:20px">
        <el-tab-pane label="病史" name="tab2">
            <historyTree v-model="category" :key="category.type" v-if="activeName=='tab2'"></historyTree>
        </el-tab-pane>
        <el-tab-pane label="体格检查" name="tab3" lazy="true">
            <historyTree v-model="category" :key="category.type" v-if="activeName=='tab3'">></historyTree>
        </el-tab-pane>
        <el-tab-pane label="实验室及器械检查" name="tab4" lazy="true">
            <historyTree v-model="category" :key="category.type" v-if="activeName=='tab4'">></historyTree>
        </el-tab-pane>
        <el-tab-pane label="疾病诊断" name="tab5" lazy="true">
            <historyList v-model="category" :key="category.type" v-if="activeName=='tab5'">></historyList>
        </el-tab-pane>
        <el-tab-pane label="鉴别诊断" name="tab6" lazy="true">
            <historyList v-model="category" :key="category.type" v-if="activeName=='tab6'">></historyList>
        </el-tab-pane>
        <el-tab-pane label="诊疗计划" name="tab7" lazy="true">
            <historyList v-model="category" :key="category.type" v-if="activeName=='tab7'">></historyList>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import { axios } from "youban-utils";
import historyTree from "./historyTree";
import historyList from "./historyList";

import qs from "qs";

export default {
    data() {
        return {
            activeName: "tab2",
            tabs: {
                tab2: { name: "病史", type: 2 },
                tab3: { name: "体格检查", type: 3 },
                tab4: { name: "实验室及器械检查", type: 4 },
                tab5: { name: "疾病诊断", type: 5 },
                tab6: { name: "鉴别诊断", type: 6 },
                tab7: { name: "诊疗计划", type: 7 }
            },
            category: {}
        };
    },
    components: {
        historyTree,
        historyList
    },
    created() {
        this.category = this.tabs["tab2"];
    },
    methods: {
        handleClick(tab, event) {
            this.category = this.tabs[tab.name];
        }
    }
};
</script>