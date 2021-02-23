<template>
    <div>
        <el-row type="flex" class="pannel">
            <el-col class="left">
                <s class="redBa"></s>
                <span class="gray">新增类别后点击 <i class="iconfont iconzuocedaohangtubiao-jiesuanguanli-zhangdanpeizhi"></i> 配置图标管理模板内容条目</span>
            </el-col>
            <el-col class="right">
                <el-button type="success" @click="add" icon="el-icon-plus">类别</el-button>
            </el-col>
        </el-row>
        <el-table
            class="ub-table"
            :data="list"
            row-key="id"
            border>
            <el-table-column prop="title" label="分类"></el-table-column>
            <el-table-column prop="itemCount" label="模板条目"></el-table-column>
            <el-table-column prop="dispIndex" label="排序"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top-end">
                        <el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
                    </el-tooltip>
                    <el-tooltip content="管理模板内容条目" placement="top-end">
                        <el-button size="mini" @click="set(scope.row)" icon="iconfont iconzuocedaohangtubiao-jiesuanguanli-zhangdanpeizhi"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top-end">
                        <el-button size="mini" @click="del(scope.row)" icon="el-icon-delete-solid"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 新增/编辑类别 -->
        <el-dialog center title="新增/编辑类别" :visible.sync="dialogTaskVisible" :before-close="closePage" width="25%">
            <el-form :rules="rules" label-width="90px" :model="addInfo" ref='addInfo'>
                <el-form-item label="类别">
                    <el-input style="width:200px" v-model.trim="addInfo.title" maxlength="4" placeholder="4字以内，如：饮食、睡眠" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number size="medium" v-model="addInfo.dispIndex" :min="0" label="请输入数字"></el-input-number>
                </el-form-item>
                <div class="buttons" style="text-align:center;">
                    <el-button type="primary" @click="submitApply">保存</el-button>
                    <el-button @click="closePage">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 编辑模板内容 -->
        <el-dialog center :title="'编辑【'+setInfo.title+'】模板内容'" :visible.sync="dialogSetVisible" :before-close="closePage" width="45%">
            <el-table
                class="ub-table"
                :data="modelList"
                row-key="id"
                border>
                <el-table-column width="440" label="描述内容">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isUpdate">{{scope.row.title}}</span>
                        <div v-else>
                            <el-input
                                maxlength="50"
                                show-word-limit
                                type="textarea"
                                placeholder="请输入描述内容"
                                v-model="scope.row.title" >
                            </el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isUpdate">{{scope.row.dispIndex}}</span>
                        <div v-else>
                            <el-input-number size="medium" v-model="scope.row.dispIndex" :min="0" label="请输入数字"></el-input-number>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" v-if="!scope.row.isUpdate" placement="top-end">
                            <el-button size="mini" @click="editModel(scope.row,scope.$index)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
                        </el-tooltip>
                        <el-tooltip content="保存" v-else placement="top-end">
                            <el-button size="mini" @click="saveModel(scope.row,scope.$index)" icon="iconfont iconcaozuotubiao-baocun"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top-end">
                            <el-button size="mini" @click="delModel(scope.row,scope.$index)" icon="el-icon-delete-solid"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="buttons" style="text-align:right;margin: 10px 0">
                <el-button @click="addOne" type="success">新增一条</el-button>
            </div>
            <div class="buttons" style="text-align:right;">
                <el-button @click="closePage">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
    name: "",
    data() {
        return {
            dialogTaskVisible: false,
            dialogSetVisible: false,
            addInfo:{
                title:'',
                dispIndex:0
            },
            setInfo:{},
            list:[],
            modelList:[]
        };
    },
    mounted(){
        this.getDetail();
    },
    methods: {
        // 添加、修改保存
        async submitApply(){
            if(this.addInfo.title == '') {
                return this.$message.error('请输入类别名称！');
            }
            if(this.addInfo.dispIndex == undefined) {
                return this.$message.error('请输入排序！');
            }
            if(Number.isInteger(this.addInfo.dispIndex) == false) {
                return this.$message.error('排序必须为整数！');
            }
            var param = {
                id:this.addInfo.id,
                templateType: 1,
                title: this.addInfo.title,
                dispIndex: this.addInfo.dispIndex,
                parentId: 0
            }
            console.log(param.id)
            let url = param.id ? '/template/update' : "/template/create";
            await axios.fetch("commonServer", url, param).then(res => {
                if(res.code == 200){
                    this.$message.success('添加成功！');
                    this.closePage();
                }
            });
        },
        // 获取列表
        getDetail(){
            axios.fetch("commonServer", "/template/list", {
                templateType:1,
                parentId:0
            }).then(res => {
                this.list = JSON.parse(JSON.stringify(res.data));
            });
        },
        // 显示添加
        add(){
            this.addInfo = {
                title:'',
                dispIndex:0
            }
            this.dialogTaskVisible = true
        },
        // 显示详情修改
        detail(val){
            this.dialogTaskVisible = true;
            let {id} = val;
            this.addInfo = {
                id,
                title:val.title,
                dispIndex:val.dispIndex
            };
        },
        // 显示设置模板
        set(val){
            this.dialogSetVisible = true;
            let {id} = val;
            axios.fetch("commonServer", "/template/list", {
                templateType:1,
                parentId:id
            }).then(res => {
                this.modelList = res.data.map(val => {
                    val.isUpdate = false;
                    return val;
                });
                this.setInfo = {
                    id:id,
                    title:val.title
                }
            });
        },
        // 添加单条模板
        addOne(){
            let list = this.modelList.map(val => val.dispIndex);
            this.modelList.push({
                isUpdate: true,
                title:'',
                dispIndex:Math.max.apply(null,list)+1
            })
        },
        // 删除整条模板
        del(val){
            this.$confirm("是否删除该查房记录模板?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                axios.fetch("commonServer", "/template/remove", {
                    id: val.id
                }).then(res => {
                    if (res.code == 200) {
                        this.getDetail();
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        },
        // 关闭弹出框
        closePage(){
            this.dialogTaskVisible = false;
            this.dialogSetVisible = false;
            this.getDetail();
        },
        // 编辑单条模板内容
        editModel(val,index) {
            this.modelList[index].isUpdate = true;
            console.log(this.modelList[index].isUpdate)
        },
        // 保存单条模板内容
        saveModel(val,index) {
            if(val.title == '') {
                return this.$message.error('请输入描述内容！');
            }
            if(val.dispIndex == undefined) {
                return this.$message.error('请输入排序！');
            }
            if(Number.isInteger(val.dispIndex) == false) {
                return this.$message.error('排序必须为整数！');
            }
            var param = {
                id:val.id,
                templateType: 1,
                title: val.title,
                dispIndex: val.dispIndex,
                parentId: this.setInfo.id
            }
            let url = param.id ? '/template/update' : "/template/create";
            axios.fetch("commonServer", url, param).then(res => {
                if(res.code == 200){
                    this.$message.success('添加成功！');
                    this.modelList[index].isUpdate = false;
                    this.set(this.setInfo);
                }
            });
        },
        // 删除单条模板内容
        delModel(val,index) {
            console.log(val.id)
            this.$confirm("是否删除该模板内容?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                if (val.id == undefined) {
                    this.modelList.splice(index,1);
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                } else {
                    axios.fetch("commonServer", "/template/remove", {
                        id: val.id
                    }).then(res => {
                        if (res.code == 200) {
                            this.modelList.splice(index,1);
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                        }
                    });
                }
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        },
    }
};
</script>

<style lang="less" scoped>
/deep/ .picture{
    display: flex;
    flex-direction: column;
}
/deep/ .el-checkbox__label{
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
}
.tag{
    cursor: pointer;
    margin: 2px 5px;
}
.tab {
    height: 100%;
}
.box-card{
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;

}
	.record_title {
       margin-left: 20px;
       display: flex;
       align-items: center;
	}
    .record_title span:nth-child(1){
	   margin-right: 10px;
	   font-size: 18px;
	   font-weight: 500;
	   color: #333333;
	}
	.record_title span:nth-child(2){
	   font-size: 14px;
	   color: #999999;
	}
.header {
    box-sizing: border-box;
    border-bottom: 1px solid #dddddd;
    background-color: #fff;
    padding: 10px 20px;
    margin: 10px 0;
    /deep/ .el-button {
    i {
        color: #409eff;
        font-weight: 700;
    }
  }
  /deep/ .el-button.cur {
    background-color: #5b8ff9ff;
    color: rgba(255, 255, 255, 1);
    i {
        color: #fff;
        font-weight: 700;
    }
  }
}
.content{
  margin: 10px 0;
}

.list-info-right{
  font-size: 14px;
  margin: 0 0 0 30px;
  color: #666666;;
  font-weight: 600;
}
.list-info-right i{
  font-style: normal;
  color: #333333;;
}
.gray{
    color: #999;
    font-size: 14px;
}
</style>
