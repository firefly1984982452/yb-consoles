<template>
    <div class="page">
        <el-card class="box-card">
            <el-button size="mini" class="back" @click="back">返回</el-button>
        </el-card>
        <div class="content">
            <el-table
                class="ub-table"
                :data="data"
                show-summary
                :summary-method="getSummaries"
                :span-method="cellMerge"
                border>
                <el-table-column label="项目">
                    <el-table-column prop="category" label="服务内容分类"></el-table-column>
                    <el-table-column prop="itemTitle" label="服务内容">
                        <template slot="header">
                            <el-tooltip content="蓝色内容表示护理员在执行该内容时需要手动提交记录" placement="top">
                            <span>
                                服务内容
                                <i class="el-icon-info"></i>
                            </span>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <span @click="taskSet(scope.row)" :class="{'blueRemark':scope.row.schedulable,'canClick':true}">{{scope.row.itemTitle}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="等级">
                    <el-table-column v-for="item in nursingList" :key="item.itemId" :label="item.itemNo">
                        <template slot-scope="scope">
                            <span 
                            v-for="task in scope.row.scheduleVoList" 
                            :key="task.targetName" 
                            v-show="task.targetName == item.itemNo">
                            {{task.timeType | filterTimeType}}
                            <span v-show="task.timeType > 0">{{task.frequency}}次</span>
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    <TaskSet @handleDiaClose="handleDiaClose" @refresh="getData" :currentItem="nurseTask" :dialogTableVisible="dialogTableVisible"></TaskSet>
    </div>
</template>

<script>
var that;
import TaskSet from "./taskSet";
export default {
    components:{TaskSet},
    data(){
        return {
            data:[],
            optionsPlanType:[],
            nursingList:[],
            dialogTableVisible: false,
            nurseTask:{},
            spanArr:[],
            contentSpanArr:[],
        }
    },
    mounted(){
        this.optionsPlanType = this.$constant.optionsPlanType;
        this.getData();
        this.getNurse();
    },
    methods:{
        handleDiaClose() {
            this.dialogTableVisible = false;
        },
        back () {
            this.$router.back()
        },
        getData(){
            axios.fetch("careServer", "/nursingService/summary",{targetType:0}).then(res => {
                if(res.code ==200){
                    this.data = res.data;
                    this.detailList = res.data[0].scheduleVoList;
                    this.getSpanArr();
                }
            })
        },
        //获取spanArr
        getSpanArr() {　
            let data = this.data;
            console.log(data,'====data');
            
            this.spanArr = [];
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0;
                } else {
                    // 判断当前元素与上一个元素是否相同(第1和第2列)
                    if (data[i].categoryId === data[i-1].categoryId) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
        // 获取护理等级
        async getNurse() {
            const res = await axios.fetch(
                "commonServer",
                "/dict/getItemViewsByGroup",
                {
                groups: "院方护理等级"
                }
            );
            const arr = [];
            if (res.data.length > 0) {
                this.nursingList = res.data;
                res.data.forEach(item => {
                    const obj = {};
                    obj.targetName = item.itemNo;
                    obj.targetValue = item.itemValue;
                    obj.timeType = 3;
                    obj.frequency = 1;
                    obj.taskDuration = 1;
                    obj.taskInterval = 1;
                    obj.available = false;
                    arr.push(obj);
                });
                console.log(this.nursingList)
            }
            return arr;
        },
        // 点击等级任务配置按钮
        taskSet(data) {
            this.nurseTask = data;
            this.dialogTableVisible = true;
        },
        cellMerge({ row, column, rowIndex, columnIndex }) {
             if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计项';
                    return;
                }
                if (index == 1) {
                    sums[index] = data.length + ' 项';
                    return;
                } else{
                    let arrLeng = 0;
                    data.forEach(val => {
                        let item = val.scheduleVoList.filter(v => {
                            return v.targetName == column.label
                        })
                        if(item.length>0){
                            ++ arrLeng;
                        }
                    })
                    console.log(arrLeng)
                    sums[index] = arrLeng + ' 项';
                    return;
                }
            });

            return sums;
        }
    },
    beforeCreate(){
        that = this;
    },
    filters:{
        filterTimeType:val=>{
            let index = that.optionsPlanType.findIndex(item => item.value == val);
            return that.optionsPlanType[index].label;
        },
    }
}
</script>

<style lang="less" scoped>
.table{
    width: 100%;
    text-align: center;
}
.canClick {
    cursor: pointer;
}
.blueRemark {
    color: rgb(0, 119, 255);
}
</style>