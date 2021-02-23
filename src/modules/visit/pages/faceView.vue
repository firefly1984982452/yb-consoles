<template>
  <div class="app-container">
    <el-row class="warp" v-loading="loading"  id="tableList" style="padding-top: 0px;border: none">
      <el-col class="searchTop">
        <el-form :inline="true" class="search" ref="searchForm" :model="searchForm" label-width="70px">
          <el-row :gutter="0">
          	<el-col :xl="4" :lg="4">
							<el-form-item label="人员分类" style="margin-left: 1%">
              <ub-dictionary @optionsChanged="onVisitorTypeChanged" group="门卫来访者类型" v-model="searchForm.visitorType" clearable></ub-dictionary>
            </el-form-item>
						</el-col>
						<el-col :xl="4" :lg="4">
							<el-form-item label="人员姓名" style="margin-left: 2%">
								<el-input v-model="searchForm.realName" placeholder="请输入人员姓名" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xl="4" :lg="4">
							<el-form-item label="绑定老人" style="margin-left: 2%">
								<el-input v-model="searchForm.relationName" placeholder="请输入老人姓名" clearable></el-input>
							</el-form-item>
						</el-col>
              <el-button
                type
                style="background-color:#2368D3;color:#fff;"
                @click="searchVisitorDate()"
                icon="el-icon-search"
              >查询</el-button>
              <el-button type @click="resizeData()" icon="el-icon-refresh-right">重置</el-button>
						<el-col :xl="3" :lg="4" style='margin-right: 1%;float: right;'>
							<div class="shaixuan" @click="show3 = !show3" style="margin-top: 10px;">
								<i v-if="!show3" class="iconfont iconjichutubiao-shaixuan" style="font-size: 12px;"></i>
								<i v-if="show3" class="iconfont iconjichutubiao-shaixuan" style="font-size: 12px;color:#F2814F;"></i>
								<span v-if="!show3">高级筛选</span>
								<span v-if="show3" style="color:#F2814F;">高级筛选</span>
								<img v-if="!show3" src='//image.youbankeji.com/web/dahuaAdmin/jiantouFunction.png' alt="" />
								<img v-if="show3" src='//image.youbankeji.com/web/dahuaAdmin/jiantouFunction2.png' alt="" />
							</div>
						</el-col>
          </el-row>
         	<el-collapse-transition>
						<div v-show="show3" style="margin-top: 10px;">
              <el-form-item label="登记日期">
                <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
							<el-form-item label="出闸权限" style="margin-left: 5.7%">
              <el-select v-model="searchForm.allowLeave" placeholder="请选择" clearable @change="changeStatus">
                  <el-option v-for="item in statusOption" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
						</div>
					</el-collapse-transition>
        </el-form>
      </el-col>
      <!-- 2 -->
      <el-col style="background: #fff;padding-top: 30px;border: 1px solid rgb(220, 223, 230);border-radius: 4px;">
        <el-table
          :data="tableData"
          :cell-style="cellStyle"
          style="width:98%;position:relative;left:1%;"
          :header-cell-style="{background:'#F3F3F5'}" class="ub-table"
          border>
          <el-table-column prop="visitorId" label="ID" min-width="100">
            <template slot-scope="scope">{{scope.row.visitorId}}</template>
          </el-table-column>
          <el-table-column prop="photoUrl" label="照片" min-width="100">
            <template slot-scope="scope">
              <ub-image class="image" fit="cover" :src="scope.row.photoUrl" imageStyle="avatar"></ub-image>
            </template>
          </el-table-column>
          <el-table-column prop="lastPhoto" label="刷脸照片" min-width="100">
            <template slot-scope="scope">
              <ub-image class="image" fit="cover" :src="scope.row.lastPhoto" defaultSrc="" imageStyle="avatar"></ub-image>
            </template>
          </el-table-column>
          <el-table-column prop="visitorType" label="分类" min-width="100">
          	<template slot-scope="scope">{{scope.row.visitorType | filterVisitorType}}</template>
          </el-table-column>
          <el-table-column prop="relationName" label="标签" min-width="100">
          	<template slot-scope="scope">{{ scope.row.relationId == 0 ? scope.row.relationName : '' }}</template>
          </el-table-column>
          <el-table-column prop="realName" label="称呼">
          	<template slot-scope="scope">{{scope.row.realName || '-'}}</template>
          </el-table-column>
          <el-table-column prop="relationName" label="绑定老人" min-width="240">
          	<template slot-scope="scope">
              <span v-if="scope.row.visitorType == 9002">{{scope.row.buildingName}}-{{scope.row.roomName}}-{{scope.row.bedName}}-{{scope.row.relationName}}</span>
            </template>
          </el-table-column>
					<el-table-column prop="remark" label="备注" min-width="100"></el-table-column>
          <el-table-column prop="createTime" label="登记日期" min-width="200">
          	<template slot-scope="scope">{{scope.row.createTime || '-'}}</template>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" min-width="200">
          	<template slot-scope="scope">{{scope.row.updateTime || '-'}}</template>
          </el-table-column>
          <el-table-column prop="allowIncome" label="闸机进" min-width="100">
          	<template slot-scope="scope">
              <el-tooltip :content="'当前闸机进状态: ' + scope.row.allowIncomeBool" placement="top">
                <el-switch
                  @change="changeAllow(scope.row,scope.$index,'In')"
                  v-model="scope.row.allowIncomeBool"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="有"
                  inactive-value="无">
                </el-switch>
              </el-tooltip>
              <span>{{scope.row.allowIncomeBool}}</span>
          	</template>
          </el-table-column>
          <el-table-column prop="allowLeave" label="闸机出" min-width="100">
          	<template slot-scope="scope">
              <el-tooltip :content="'当前闸机出状态: ' + scope.row.allowLeaveBool" placement="top">
                <el-switch
                  @change="changeAllow(scope.row,scope.$index,'Leave')"
                  v-model="scope.row.allowLeaveBool"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="有"
                  inactive-value="无">
                </el-switch>
              </el-tooltip>
              <span>{{scope.row.allowLeaveBool}}</span>
          	</template>
          </el-table-column>                 
          <el-table-column label="状态" min-width="100">
						<template slot-scope="scope">
                <span v-if="scope.row.status==1">有效</span>
                <span v-if="scope.row.status==-1">无效</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="100">
          	<template slot-scope="scope">        
						    <el-tooltip class="item" effect="dark" content="同步" placement="top-end">
          		    <i class="iconfont iconjichutubiao-zhongxinyuding" @click="sync(scope.row)"></i>
          		  </el-tooltip>
                &nbsp;
						    <el-tooltip class="item" effect="dark" content="作废" placement="top-end">
          		    <i class="iconfont iconcaozuotubiao-quxiao" @click="del(scope.row)"></i>
          		  </el-tooltip>
          	</template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin:20px auto;text-align:center;"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-size="pageSize"
		      layout="total, prev, pager, next, jumper"
		      :total="totalPage">
		    </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
var that;
import ubImage from '@/components/image'
import ubDictionary from '@/components/dictionary'

export default {
  data() {
    return {
      show3:false,
      visitorTypes: [],
      statusOption:[
          {label:'无',value: 0},
          {label:'有',value: 1}
      ],
    	loading:false,
      searchForm:{
        status:'',
        visitorType:'',
        realName:'',
        relationName:'',
        time:[],
        allowLeave:''
      },
      tableData:[],
      currentPage3:1,
      totalPage:0,
      pageSize:10
    };
  },
  components: { ubImage, ubDictionary },
  created() {
    ubDictionary.init(this);
  },
  mounted() {
    this.searchVisitorDate();
  },
  methods:{
    changeAllow(val,index,type) {
      console.log(val,index,type)
      let data = {
        visitorId: val.visitorId,
        allowIncome: type == 'In' ? (val.allowIncome == -1 ? 1 : -1) : val.allowIncome,
        allowLeave: type == 'Leave' ? (val.allowLeave == -1 ? 1 : -1) : val.allowLeave,
      }
      axios.fetch('visitServer', "/visitor/updateInOut",data).then(res => {
        if(res.code == 200) {
          this.$message.success('修改成功');
          this.searchVisitorDate();
        } else {
          this.$message.error(res.message);
          this.searchVisitorDate();
        }
      })
    },
  	changeStatus(e){
  		this.searchForm.status = e
  	},
    cellStyle({row,column,rowIndex,columnIndex}){
        return 'text-align:center;'
    },
    sync(item) {
      axios.fetch('visitServer', "/visitor/syncVisitorToDevices", { visitorId: item.visitorId }).then(res => {
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    del(data) {
      let datas = {
        visitorId: data.visitorId,
      };
      this.$confirm("确认作废此项吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: ""
      }).then(() => {
        axios.fetch('visitServer', "/visitor/cancelVisitor",datas).then(res => {
          this.loading = false;
          if(res.code == "200") {
            this.searchVisitorDate();
            this.$message({
              message: "作废成功",
              type: "success"
            });
          } else if(res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.loading = false;
            this.$router.push("/login");
          } else {
            this.loading = false;
            this.$message.error(res.message);
          }
        });
      }).catch(() => {
        this.loading = false;
        this.$message({
          type: "info",
          message: "已取消作废"
        });
      });
    },
  	/*查询第几页数据*/
		handleCurrentChange(val){
      this.currentPage3 = val;
      this.searchVisitorDate();
		},
    searchVisitorDate(){
      this.loading = true;
      this.searchForm.pageIndex = this.currentPage3;
      this.searchForm.pageSize = this.pageSize;
      this.searchForm.startDate = this.searchForm.time ? this.searchForm.time[0] :'';
      this.searchForm.endDate = this.searchForm.time ? this.searchForm.time[1] : '';
      axios.fetch('visitServer', "/visitor/query/visitor",this.searchForm).then(res => {
        this.loading = false;
        if(res.code == 200) {
          res.data.map(val => {
            val.allowLeaveBool = val.allowLeave == 1 ? '有' : '无';
            val.allowIncomeBool = val.allowIncome == 1 ? '有' : '无';
          })
          this.tableData = res.data;
          this.totalPage = res.total;
        } else if(res.code == "401") {
            this.$message({
                message: res.message,
                type: "warning"
            });
            this.$router.push("/login");
        } else {
            this.$message.error(res.message);
        }
      })
      .catch(err => {
          this.loading = false;
      });
    },
    resizeData(){
      this.searchForm.visitorType='',
      this.searchForm.realName='',
      this.searchForm.relationName='',
      this.searchForm.time='',
      this.searchForm.status = '';
      this.searchForm.allowLeave = '';
      this.searchVisitorDate();
    },
    onVisitorTypeChanged(options) {
      this.visitorTypes = options;
    }
  },
  beforeCreate(){
    that = this;
  },
  filters: {
		filterVisitorType: val => {
			let it = that.visitorTypes.find(item => item.itemValue == val);
			return it ? it.title : '';
		}
  },
};
</script>
<style scoped>
#userList .el-pagination {
  margin-top: 20px;
  float: right;
  position: relative;
  right: 130px;
  margin:  0 auto;
}
#userList .el-pagination__editor.el-input {
  width: 50px;
}

</style>

