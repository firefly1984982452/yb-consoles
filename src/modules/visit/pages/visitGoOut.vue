<template>
	<div class="app-container">
		<el-row class="warp userList" v-loading="loading" id="tableList" style="padding-top: 0px;background: #ECF0F4;;border: none;">
			<el-col class="searchTop">
				<el-form  :inline="true" class="search" ref="searchForm" :model="searchForm" label-width="70px">
					<el-row :gutter="0">
						<el-col :xl="4" :lg="5">
							<el-form-item label="记录类型">
                <ub-dictionary @optionsChanged="onVisitTypeChanged" group="门卫来访记录类型" v-model="searchForm.visitType" clearable></ub-dictionary>
							</el-form-item>
						</el-col>
						<el-col :xl="4" :lg="5">
							<el-form-item label="人员姓名">
								<el-input v-model="searchForm.visitorName" placeholder="请输入人员姓名" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xl="4" :lg="5">
							<el-form-item label="绑定老人">
								<el-input v-model="searchForm.intervieweeName" placeholder="请输入老人姓名" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xl="4" :lg="5">
							<el-form-item label="设备">
                <ub-dictionary group="门卫设备列表" v-model="searchForm.deviceId" clearable></ub-dictionary>
							</el-form-item>
						</el-col>
						<el-col :xl="7" :lg="9">
							<el-form-item label="起止日期" style="margin-left: 1.5%">
								<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-button type="primary" @click="handleCurrentChange(1)" icon="el-icon-search">查询</el-button>
						<el-button @click="resizeData()" icon="el-icon-refresh-right">重置</el-button>
            <el-button @click="toExcel()" icon="el-icon-download">导出</el-button>
            <el-button @click="toExcelForEmployee()" icon="el-icon-download">导出员工记录</el-button>
            <el-button @click="toExcelForFamily()" icon="el-icon-download">导出家属记录</el-button>
					</el-row>
				</el-form>
			</el-col>
			<!-- 2 -->
			<el-col style="background: #fff;padding-top: 30px;border: 1px solid rgb(220, 223, 230);border-radius: 4px;">
				<el-table 
					:data="tableData" 
					style="width:98%;position:relative;left:1%;"
					:header-cell-style="{background:'#F3F3F5'}" 
					class="ub-table" 
					border>
					<el-table-column prop="id" label="记录ID" min-width="50">
						<template slot-scope="scope">{{scope.row.id}}</template>
					</el-table-column>
					<el-table-column prop="visitorId" label="访客ID" min-width="50">
						<template slot-scope="scope">{{scope.row.visitorId}}</template>
					</el-table-column>
					<el-table-column prop="photoUrl" label="照片" min-width="100">
						<template slot-scope="scope">
              <ub-image class="image" fit="cover" :src="scope.row.photoUrl" imageStyle="avatar"></ub-image>
						</template>
					</el-table-column>
					<el-table-column prop="visitType" label="来访类型" min-width="100">
						<template slot-scope="scope">
							<span>{{scope.row.visitType | filterVisitType}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="realName" label="姓名/标签">
						<template slot-scope="scope">{{scope.row.realName || '-'}}</template>
					</el-table-column>
					<el-table-column prop="intervieweeName" label="被访人" min-width="200">
						<template slot-scope="scope">
							<span v-if="scope.row.intervieweeId">{{scope.row.buildingName}}-{{scope.row.roomName}}-{{scope.row.bedName}}-{{scope.row.intervieweeName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="备注">
						<template slot-scope="scope">{{scope.row.remark}}</template>
					</el-table-column>
					<el-table-column prop="healthStatus" label="健康码" min-width="60">
						<template slot-scope="{ row }">
              <div v-if="row.healthStatus == 1"><i class="el-icon-success green"> 绿色</i></div>
              <div v-if="row.healthStatus == -1"><i class="el-icon-remove red"> 红色</i></div>
						</template>
					</el-table-column>
					<el-table-column prop="tempStatus" label="体温" min-width="60">
						<template slot-scope="{ row }">
              <div v-if="row.tempStatus == 1"><i class="el-icon-success green"> {{ row.tempValue ? row.tempValue + "℃" : "正常" }}</i></div>
              <div v-if="row.tempStatus == -1"><i class="el-icon-remove red"> {{ row.tempValue ? row.tempValue + "℃" : "异常" }}</i></div>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="时间" min-width="150">
						<template slot-scope="scope">{{scope.row.createTime || '-'}}</template>
					</el-table-column>
					<el-table-column prop="deviceName" label="设备" min-width="150">
						<template slot-scope="scope">
							<span>{{scope.row.deviceName}}</span>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					style="margin: 20px auto;text-align: center;"
					@current-change="handleCurrentChange"
					:current-page.sync="searchForm.pageIndex"
					:page-size="10"
					layout="total, prev, pager, next, jumper"
					:total="totalPage">
			    </el-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import _ from 'lodash'
import ubImage from '@/components/image'
import ubDictionary from '@/components/dictionary'
import { dataToExcel } from '@/components/excel'

let that;
export default {
	data() {
		return {
      loading: false,
      visitTypes: [],
			searchForm: {
				visitType: '',
				time: '',
				visitorName: '',
        intervieweeName: '',
        deviceId:'',
        startDate: '',
        endDate: '',
				pageIndex:1
			},
			tableData:[],
			totalPage:0
		};
	},
	components: {
		ubImage, ubDictionary
	},
  created() {
    ubDictionary.init(this);
  },
	mounted() {
    this.searchVisitorDate();
	},
	methods: {
    getFormData() {
			let startDate = this.searchForm.startDate = this.searchForm.time ? this.searchForm.time[0] : '';
			let endDate = this.searchForm.endDate = this.searchForm.time ? this.searchForm.time[1] : '';
      if(!startDate || !endDate) {
        this.$message.error("起止日期必选");
        return null;
      }
      let diffTime = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
      if(diffTime > 3600 * 24 * 7 * 1000) {
        this.$message.error("起止日期仅可选择7天范围内");
        return null;
      }
      return { startDate, endDate };
    },
    // 导出到Excel
    toExcel() {
      if(!this.getFormData()) {
        return;
      }
      let formData = _.clone(this.searchForm);
      formData.export = true;
      axios.fetch('visitServer', "/visitor/query/visitRecord", formData).then(res => {
        dataToExcel(res.data, {
          visitType: {
            title: "来访类型",
            format: val => this.getVisitTypeName(val)
          },
          realName: "姓名/标签",
          intervieweeName: "被访人",
          remark: "备注",
          healthStatus: {
            title: "健康码",
            format: val => val == 1 ? '绿色' : val == -1 ? '红色' : ''
          },
          tempStatus: {
            title: "体温",
            format: (val, item) => item.tempValue ? (item.tempValue + "℃") : val == 1 ? '正常' : val == -1 ? '异常' : ''
          },
          createTime: "时间",
          deviceName: "设备"
        }, `来访记录_${this.searchForm.startDate}_${this.searchForm.endDate}.xlsx`);
        this.$message.success(`导出成功，共计 ${ res.total } 条记录`);
			});
    },
    toExcelForEmployee() {
      let formData = this.getFormData();
      if(!formData) {
        return;
      }
      axios.fetch('visitServer', "/visitor/getVisitDaysForEmployee", formData).then(res => {
        let i = 1;
        dataToExcel(res.data, {
          index: { title: "序号", format: val => i++ },
          visitDate: { title: "日期", format: val => val.substr(0, 10) },
          employeeName: "姓名",
          jobName: "岗位",
          inTime: "进院时间",
          tempValue: { title: "体温值", format: val => val ? (val + "℃") : "正常" },
          outTime: "离院时间",
          visitRemark: "备注"
        }, `养老机构工作人员进出院登记表_${this.searchForm.startDate}_${this.searchForm.endDate}.xlsx`, "养老机构工作人员进出院登记表");
        this.$message.success(`导出成功，共计 ${ res.total } 条记录`);
      });
    },
    toExcelForFamily() {
      let formData = this.getFormData();
      if(!formData) {
        return;
      }
      axios.fetch('visitServer', "/visitor/getVisitDaysForFamily", formData).then(res => {
        let i = 1;
        dataToExcel(res.data, {
          index: { title: "序号", format: val => i++ },
          visitDate: { title: "日期", format: val => val.substr(0, 10) },
          familyName: "家属姓名",
          elderName: "老人姓名",
          bedName: { title: "床位号", format: (val, item) => `${item.buildingName}-${item.roomName}-${item.bedName}` },
          visitRemark: "进院事由",
          inTime: "进院时间",
          tempValue: { title: "体温值", format: val => val ? (val + "℃") : "正常" },
          outTime: "离院时间",
          healthStatus: { title: "随申码", format: val => "绿色" }
        }, `养老机构住养老人家属进出院登记表_${this.searchForm.startDate}_${this.searchForm.endDate}.xlsx`,
        "养老机构住养老人家属进出院登记表", "注：疫情防控期间，本院实施封闭式管理，除老人有特殊情况，暂停家属入院探望。");
        this.$message.success(`导出成功，共计 ${ res.total } 条记录`);
      });
    },
		/*查询第几页数据*/
		handleCurrentChange(val) {
			this.searchForm.pageIndex = val;
			this.searchVisitorDate();
		},
		searchVisitorDate(val) {
			this.loading = true;
			this.searchForm.startDate = this.searchForm.time ? this.searchForm.time[0] :'';
			this.searchForm.endDate = this.searchForm.time ? this.searchForm.time[1] : '';
      axios.fetch('visitServer', "/visitor/query/visitRecord",this.searchForm).then(res => {
				this.loading = false;
				if(res.code == 200) {
					this.tableData = res.data;
					this.totalPage = res.total;
				}
			}).catch(e => {
				this.loading = false;
			});
		},
		resizeData() {
			this.searchForm.visitType = '';
			this.searchForm.deviceId= '';
			this.searchForm.visitorName = '';
      this.searchForm.intervieweeName = '';
			this.searchForm.pageIndex = 1;
			this.searchForm.time = '';
			this.searchVisitorDate();
    },
    onVisitTypeChanged(options) {
      this.visitTypes = options;
    },
    getVisitTypeName(val) {
			let it = that.visitTypes.find(item => item.itemValue == val);
			return it ? it.title : '';
    },
	},
	beforeCreate(){
		that = this;
	},
	filters: {
		filterVisitType: val => that.getVisitTypeName(val),
	}
};
</script>
<style scoped>
#userList .el-pagination__editor.el-input {
  width: 50px;
}
.el-button {
  width: auto !important;
}
.green {
  color: green;
}
.red {
  color: red;
}
</style>