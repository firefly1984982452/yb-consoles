<template>
    <el-select v-model="area" value-key="value" @change="changeArea" clearable placeholder="请选择">
        <el-option v-for="(item,index) in areas" :key="index" :label="item.text" :value="item"></el-option>
    </el-select>
</template>

<script>
export default {
    name: 'area',
    props:{
        area: ''
    },
    data() {
        return {
            areas:[],
        }
    },
    created(){
        this.getEaras();
    },
    methods: {
        // 获取全部区域
        async getEaras() {
            await axios.fetch("oaServer", "/org/area/list", {groups: "楼宇区域"}).then(res => {
                if (res.data.length > 0) {
                    res.data.forEach(item => {
                        const obj = {};
                        obj.text = item.areaName;
                        obj.value = item.areaId;
                        this.areas.push(obj);
                    });
                }
            });
        },
        changeArea(){
            this.$emit('currentArea',this.area);
        },
        resetArea(){
            this.area = '';
        },
        getAllArea() {
            if(this.areas) {
                this.$emit('allAreas',this.areas);
            }
        }
    }
}
</script>