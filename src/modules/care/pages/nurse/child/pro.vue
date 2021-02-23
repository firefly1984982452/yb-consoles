<template>
    <div class="page">
        <div class="box">
            <div class="left">
                <el-table
                    class="ub-table"
                    :data="projectLife"
                    show-summary
                    :summary-method="getSummaries"
                    :span-method="cellMerge"
                    border>
                    <el-table-column label="服务分类">
                        <template slot-scope="scope">
                            <span>{{scope.row.categoryType | filterCategoryType}}</span>
                        </template>
                    </el-table-column>
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
                            <span :class="{'blueRemark':scope.row.schedulable}">{{scope.row.itemTitle}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isNursing" :label="'护理'+detailInfo.nursingLevelText+'级标准'">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isNursing">√</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="长者内容">
                        <template slot-scope="scope">
                            <el-switch
                                @change="changeItem(scope.$index)"
                                v-model="scope.row.isElderItem"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="right">
                <el-table
                    class="ub-table"
                    :data="elderData"
                    :span-method="arraySpanMethod"
                    border>
                    <el-table-column prop="creatorName" label="姓名"></el-table-column>
                    <el-table-column prop="createTime" width="200" label="日期"></el-table-column>
                    <el-table-column prop="remark" label="内容"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
                                <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-chakan"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="resetForm">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        id:'',
        elderId:'',
    },
    watch:{
        id(){
            this.getDetail();
        },
        elderId(){
            this.getElderDetail();
        },
    },
    data(){
        return {
            value:true,
            projectLife:[],
            spanArr:[],
            contentSpanArr:[],
            pos:0,
            position:0,
            elderData:[],
            detailInfo:{}
        }
    },
    mounted(){
        if (this.id !== '') {
            this.getDetail();
            this.getElderDetail();
        }
    },
    methods:{
        detail(val){
            this.$router.push({
                path: "/care/plan/ProChild",
                query: {
                    id: val.itemId,
                    elderId: this.elderId
                }
            })
        },
        getDetail(){
            let param = {
                itemId:this.id,
                type:1
            } 
            axios.fetch("careServer", "/elderService/nursingProject/elder",param).then(res => {
                if(res.code ==200){
                    if(res.data.length > 0 && res.total == 1) {
                        this.detailInfo.nursingLevelText = ['','一','二','三','四','五','六'][res.data[0].nursingLevel];
                        this.projectLife = res.data[0].elderServiceItems.map(val => {
                            val.isEdit = false;
                            return val;
                        })
                        this.getSpanArr();
                    } else {
                        this.$message.error('该长者没有数据，请返回！')
                    }
                }
            })
        },
        getElderDetail(){
            axios.fetch("careServer", "/elderService/history",{elderId:this.elderId}).then(res => {
                if(res.code ==200){
                    this.elderData = res.data;
                }
            })
        },
        submitForm(){
            console.log(this.projectLife)
            let has  = this.projectLife.some(val => {
                return val.isEdit
            })
            if(has) {
                let arr = this.projectLife.filter(val => {return val.isEdit == true});
                arr = arr.map(val => {
                    return {
                        save:val.isElderItem,
                        itemId: val.itemId,
                        serviceId: val.serviceId
                    }
                })
                axios.fetch('careServer', "/elderService/saveItem",arr,'json').then(res => {
                    if(res.code ==200){
                        this.$message.success('修改成功！');
                        this.getDetail();
                    }
                })
            } else {
                this.$message.warning('当前没有修改选项，已保存最新项目');
            }
        },
        resetForm(){
            window.opener = null;
            window.close();
        },
        changeItem(index){
            this.projectLife[index].isEdit = !this.projectLife[index].isEdit;
        },
        //获取spanArr
        getSpanArr() {　
            let data = this.projectLife;
            this.spanArr = [];
            this.contentSpanArr = [];
            for (var i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0;
                    this.contentSpanArr.push(1);
                    this.position = 0;
                } else {
                    // 判断当前元素与上一个元素是否相同(第1和第2列)
                    if (data[i].categoryType === data[i - 1].categoryType
                        && data[i].category === data[i-1].category) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
        cellMerge({ row, column, rowIndex, columnIndex }) {
             if (columnIndex === 0 || columnIndex === 1) {
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
                if (index == 0) {
                    sums[index] = '合计项';
                    return;
                }
                if (index == 3) {
                    var leng = data.filter(val => {return val.isNursing == true}).length
                    sums[index] = leng + ' 项';
                    return;
                }
                if (index == 4) {
                    var leng = data.filter(val => {return val.isElderItem == true}).length
                    sums[index] = leng + ' 项';
                    return;
                }
            });

            return sums;
        }
    }
}
</script>

<style lang="less" scoped>
.page{
    .box{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .left {
            width: 60%;
        }
        .right {
            width: 30%;
            padding-left: 5%;
            border-left: 1px solid #eee;
        }
    }
    .footer{
        margin: 10px auto;
    }
}
.blueRemark {
    color: rgb(0, 119, 255);
}
</style>