<template>
    <div>
        <el-form :rules="rules" label-width="150px" :model="addInfo" ref='addInfo'>
            <el-form-item :label="detailInfo.itemTitle+'操作时间'" prop="operateTime">
                <el-date-picker
                    width="200px"
                    v-model="addInfo.operateTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss" 
                    format="yyyy-MM-dd HH:mm:ss" 
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item  v-for="(op,index) in optionsTitleList" :key="op.id">
                <label slot="label"><i style="color: #f00;">*</i>&nbsp;{{op.title}}</label>
                <!-- 1单选，2多选，3文本，4时间，5整数 -->
                <div v-if="op.inputType == 1">
                    <el-select v-model="op.optionValue" clearable placeholder="请选择" @change="changeOptionValue">
                        <el-option v-for="(item,index) in op.inputTextList" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </div>
                <div v-if="op.inputType == 2">
                    <el-checkbox-group v-model="op.optionValue" @change="changeOptionValue">
                        <el-tooltip :content="item" v-for="(item,index) in op.inputTextList" :key="index">
                            <el-checkbox :key="index" :label="item"></el-checkbox>
                        </el-tooltip>
                    </el-checkbox-group>
                </div>
                <div v-if="op.inputType == 3">
                    <el-input v-model="op.optionValue" />
                    <el-tooltip :content="item" v-for="(item,i) in op.inputTextList" :key="i">
                        <el-tag @click="addTag(item,index)" class="tag">{{item}}</el-tag>
                    </el-tooltip>
                </div>
                <div v-if="op.inputType == 4">
                    <el-date-picker
                        width="200px"
                        v-model="op.optionValue"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss" 
                        format="yyyy-MM-dd HH:mm:ss" 
                        placeholder="选择日期时间">
                    </el-date-picker>
                </div>
                <div v-if="op.inputType == 5">
                    <input type="number" v-model="op.optionValue" placeholder="请输入整数" oninput="value=value.replace(/[^\d.]/g,'')" class="el-input__inner" /> 
                </div>
            </el-form-item>
            <el-form-item>
                <label slot="label"><i style="color: #f00;">*</i>&nbsp;护理员</label>
                <ub-employee deptName="护理部" v-model="addInfo.employeeId" @change="item => addInfo.employee = item"></ub-employee>
            </el-form-item>
            <el-form-item label="附件">
                <ub-picture category="elder" v-model="addInfo.attachmentUrl"></ub-picture>
            </el-form-item>
            <el-form-item label="说明">
                <el-input type="textarea" v-model.trim="addInfo.remark" maxlength="200" placeholder="请输入说明"  clearable></el-input>
            </el-form-item>
            <div class="buttons" style="text-align:center;">
                <el-button type="primary" @click="submitApply">保存</el-button>
                <el-button @click="closePage">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script type="text/javascript">
import ubEmployee from "@/components/employee";
import ubElder from "@/components/elder";
import ubPicture from '@/components/picture';
export default {
    components: { ubEmployee,ubElder,ubPicture},
    props: {
        detailInfo: {
            type: Array,
            default: []
        },
        optionsTitleList: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            addInfo:{
                operateTime: '',
                employeeId: '',
                employee: {},
                operatorName: '',
                attachmentUrl: null,
                remark:'',
            },
            rules:{
                operateTime: [
                    { required: true, message: '请选择任务操作时间', trigger: 'change' }
                ]
            },
        };
    },
    mounted(){
    },
    methods: {
        // 初始化数据
        resetData(){
            if (this.$refs["addInfo"] !== undefined) {
                this.$refs["addInfo"].resetFields();
                this.addInfo = {
                    operateTime: '',
                    employeeId: '',
                    employee: {},
                    operatorName: '',
                    attachmentUrl: null,
                    remark:'',
                }
            }
        },
        // 关闭页面
        closePage(){
            this.resetData();
            this.$emit('close')
        },
        changeOptionValue(){
            this.$set(this,'addInfo',this.addInfo);
        },
        addTag(val,index) {
            this.optionsTitleList[index].optionValue = this.optionsTitleList[index].optionValue+val;
        },
        submitApply() {
            this.$refs['addInfo'].validate((valid) => {
                if (valid) {
                    let arr = this.optionsTitleList.map(val => {
                        return {
                            optionName : val.title,
                            optionValue : val.inputType == 2 ? val.optionValue.join(',') : val.optionValue
                        }
                    })
                    let param = {
                        taskId:this.$route.query.id,
                        serviceId: this.$route.query.serviceId,
                        operatorId: this.addInfo.employee.employeeId,
                        operatorName: this.addInfo.employee.employeeName,
                        operateTime: this.addInfo.operateTime,
                        attachmentUrl:this.addInfo.attachmentUrl,
                        remark: this.addInfo.remark,
                        taskDetailList: arr
                    }
                    for (const val of arr) {
                        if(val.optionValue === '') {
                            return this.$message.error(val.optionName + '不能为空！');
                        }
                    }
                    if(!this.addInfo.employeeId) {
                        return this.$message.error('护理员不能为空！');
                    }
                    axios.fetch("careServer", "/careTaskItem/add", param,'json').then(res => {
                        if(res.code == 200){
                            this.$message.success('添加成功！');
                            this.closePage();
                        } else {
                            this.$message.error('添加失败！');
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
