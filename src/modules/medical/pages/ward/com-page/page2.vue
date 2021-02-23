<template>
  <div>
    <div class="content">
			<el-row type="flex" class="pannel">
				<el-col class="right">
					<el-button  type="success" @click="add" icon="el-icon-plus">新增班次</el-button>
				</el-col>
			</el-row>
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column prop="name" label="查房班次" align="center"></el-table-column>
        <el-table-column label="查房时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}} - {{scope.row.endTime}}</span>
          </template>
        </el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
							<el-button size="mini" @click="detail(scope.row)" icon="iconfont iconcaozuotubiao-bianji"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="top-end">
							<el-button size="mini" @click="del(scope.row)" icon="iconfont iconcaozuotubiao-shanchu-xuanfu"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" @current-change="handleChange" :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <!-- 新增弹出框 -->
    <el-dialog :title="addInfo.title" :visible.sync="dialogAddVisible" center  width="30%">
      <el-form label-width="100px" :model="addInfo" :rules="rules" ref='addInfo'>
        <el-form-item label="班次名称" prop="name">
          <el-input maxlength="4" show-word-limit v-model="addInfo.name" placeholder="请输入4字以内标题"></el-input>
        </el-form-item>
        <el-form-item label="查房时间段" prop="time">
          <el-time-picker
            is-range
            v-model="addInfo.time"
            format="HH:mm"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddOne">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      pageSize:10,
      pageIndex:1,
      currentPage:1,
      total:0,
      data:[],
      dialogAddVisible: false,
      addInfo: {
        name: '',
        time:[]
      },
      rules:{
        name:[
            { required: true, message: '请输入班次名称', trigger: 'blur' },
            { min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur' }
        ],
        time:[
            { required: true, message: '请选择时间', trigger: 'change' }
        ]
      }
    }
  },
  created(){
    this.getdata();
  },
  methods:{
    getdata(){
      axios.fetch('medicalServer', "/api/ward/setting/page",{
        pageIndex:this.pageIndex,
        pageSize:this.pageSize,
      },'form','get').then(res => {
        if(res.code ==200){
          this.total = res.total;
          this.data = res.data;
        }     
      })
    },
    handleChange(i){
      this.pageIndex=i;
      this.getdata();
    },
    // 编辑
    detail(val){
      axios.fetch('medicalServer', "/api/ward/setting/"+val.id,{},'form','get').then(res => {
        if(res.code ==200){
          this.dialogAddVisible = true;
          this.addInfo = {
            title: '编辑查房班次',
            id: res.data.id,
            name: res.data.name,
            time: [res.data.startTime,res.data.endTime]
          };
        }
      })
    },
    add () {
      this.dialogAddVisible = true;
      this.addInfo = {
        title: '新增查房班次',
        name:'',
        time:''
      };
      this.$refs['addInfo'].resetFields();
    },
    // 添加排班
    submitAddOne () {
      this.$refs['addInfo'].validate((valid) => {
        if (valid) {
          let param = {
            id: this.addInfo.id | '',
            name: this.addInfo.name,
            startTime: this.addInfo.time[0],
            endTime: this.addInfo.time[1]
          }
          if(this.addInfo.title == '新增查房班次') {
            delete param.id;
          }
          axios.fetch('medicalServer', "/api/ward/setting",param,'json','post',true).then(res => {
            if(res.code ==200){
              if (res.data !== false) {
                this.$message.success('成功！');
                this.$refs['addInfo'].resetFields();
                this.dialogAddVisible = false;
                this.getdata();
              } else {
                this.$message.error('失败');
              }
            }
          }).catch(res => {
            this.$message.error(res.msg);
          }) 
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 删除此班次
    del(val) {
      this.$confirm('确定删除此班次吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.fetch('medicalServer', "/api/ward/setting/" +val.id,{},'form','delete').then(res => {
          if(res.code ==200){
            if (res.data !== false) {
              this.$message.success('删除成功！');
              this.getdata();
            } else {
              this.$message.error('删除失败');
            }
          }     
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
  }
}
</script>

<style lang="less" scoped>
</style>