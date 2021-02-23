<template>
	<div class="app-container" id="liveCrList" v-if="diType=='1'">
		<el-row class="warp" v-loading="loading" id="staffTableStyle">

			<el-col class="searchTop">
				<el-form ref="searchForm" :model="searchForm" label-width="70px">

					<el-row type="flex" class="row-bg" :gutter="0">
						
						
						<el-col :xl="4" :lg="5">
							<el-form-item label="设施状态">
								<el-select v-model="searchForm.di_status" placeholder="请选择" clearable>
									<el-option v-for="item in option3" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						
                        <el-col :xl="6" :lg="8">
									<el-form-item label="安装时间">
										<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="searchForm.enterDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
										</el-date-picker>
									</el-form-item>
						</el-col>
					
					<el-col :xl="4" :lg="5">
									<el-form-item label="设施名称">
										<el-input v-model="searchForm.di_name" placeholder="请输入" clearable></el-input>
									</el-form-item>
								</el-col>
					 
						<el-col  :span="2" class="searchBtns" style="margin-left: 1.5%">
							<el-button style="background: #2368D3;color: #FFFFFF;" type="" @click="searchData()"><i class="btniconfont iconjichutubiao-chaxun"></i>查询</el-button>
						</el-col>
						<el-col  :span="2" class="searchBtns" style="margin-left: 0.5%">
							<el-button type="" @click="resizeData()"><i class="btniconfont iconjichutubiao-zhongzhi"></i>重置</el-button>
						</el-col>
		
					</el-row>
				</el-form>
			</el-col>
			<el-col class="searchTop">

				<el-button v-for="(item,index) in btnArr" :key="index" :class="isactive == index ? 'searchBtnsStyle' : 'checkBtn' " @click="checkPage(index)">{{item}}</el-button>
				<el-button @click="addFacilities" class="addEquipment"><i class="btniconfont iconjichutubiao-tianjia-huise"></i>添加设施</el-button>
				<el-col style="background: rgb(255, 255, 255);border-radius: 4px;padding-top: 25px;">
					<el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="width:95%;position:relative;left:2%;">
						<el-table-column label="序号" width="60" type="index"></el-table-column>
						<el-table-column label="设施图片" min-width="110">
							<template slot-scope="scope">
							<img style="width: 31px;" :src="ossUrl+scope.row.di_img" alt="" class="vistorClass"/>
							<div class="bglarge" @click="lgPic(ossUrl+scope.row.di_img)"></div>
							</template>
						</el-table-column>
						<el-table-column label="合格证图片" min-width="110">
							<template slot-scope="scope">
							<img style="width: 31px;" :src="ossUrl+scope.row.di_certificate" alt="" class="vistorClass"/>
							<div class="bglarge" @click="lgPic(ossUrl+scope.row.di_certificate)"></div>
							</template>
						</el-table-column>
						<el-table-column label="设施编号" min-width="100">
							<template slot-scope="scope">{{scope.row.di_number | nothingFilter}}</template>
						</el-table-column>
						<el-table-column label="安装位置" min-width="100">
							<template slot-scope="scope">{{scope.row.di_install | nothingFilter}}</template>
						</el-table-column>
						<el-table-column label="安装日期" min-width="100">
							<template slot-scope="scope">{{scope.row.di_time | nothingFilter}}</template>
						</el-table-column>
						<el-table-column label="设施名称" min-width="160">
							<template slot-scope="scope">{{scope.row.di_name | nothingFilter}}</template>
						</el-table-column>
						<el-table-column label="生产厂家" min-width="100">
							<template slot-scope="scope">{{scope.row.di_manufactor | nothingFilter}}</template>
						</el-table-column>
						<el-table-column label="联系电话" min-width="140">
							<template slot-scope="scope">{{scope.row.di_phone | nothingFilter}}</template>
						</el-table-column>
						<el-table-column label="设施型号" min-width="140">
							<template slot-scope="scope">{{scope.row.di_model | nothingFilter}}</template>
						</el-table-column>
						<el-table-column label="质保剩余时间" min-width="180">
							<template slot-scope="scope">{{scope.row.di_warranty_time | nothingFilter}}</template>
						</el-table-column>
						
						<el-table-column label="设施状态" min-width="90">
							<template slot-scope="scope">
								<span v-if="scope.row.di_status==0">删除</span>
								<span v-if="scope.row.di_status==1">正常</span>
								<span style="color: #EB6969;" v-if="scope.row.di_status==2">报警</span>
								<span style="color: #F6812B;" v-if="scope.row.di_status==3">故障</span>
							</template>
						</el-table-column>
						
						<el-table-column label="操作" min-width="100">
							<template slot-scope="scope">
								<el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
									<el-button size="mini" class="lookta" @click="Edit(scope.row)"><i class="btniconfont iconcaozuotubiao-bianji-xuanfu"></i></el-button>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination @current-change="handleCurrentChange" :current-page="currentPage3" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
					</el-pagination>
				</el-col>
			</el-col>
		</el-row>
		<LargerPic v-if="largePic == 1"></LargerPic>
	</div>
</template>
<script>
	import axios from "axios";
	import qs from "qs";
	import { OssUrlPic,OssUrlNoPic } from "@/common/js/utils.js";
	import LargerPic from '@/components/live/largerPic'
	export default {
		data() {
			return {
				btnArr: ['设备管理', '设施管理'],
				isactive: '1',
				show3: false,
				ossUrl:OssUrlPic,
				ossNoUrl:OssUrlNoPic,
				options: [], //楼层
				optionRoom: [], //房间
				optionBed: [], //床位
				option2:[],
				option4: [],
				option3: [{
					label: '删除',
					value: 0
				}, {
					label: '正常',
					value: 1
				}, {
					label: '报警',
					value: 2
				}, {
					label: '故障',
					value: 3
				}],
				option4: [{
					label: '离线',
					value: 0
				}, {
					label: '在线',
					value: 1
				}],
				option1: [],
				diType: '1',
				loading: true,
				searchForm: {
//					diType:2,
					page: 1,
					row:10,
					di_status:'',//设备状态
					di_name:'',//设备名称
					enterDate:'',//时间
				},
			}
		},
		 components: {
			LargerPic
		},
		computed: {
			state: {
				get() {
					return this.$store.getters.showChilds;
				},
				set() {}
			},
			tableData: {
				get() {
					return this.$store.getters.FacilitiesDatas;
				},
				set() {}
			},
			totalPage: {
				get() {
					return this.$store.getters.FacilitiesTotals;
				},
				set() {}
			},
			currentPage3: {
				get() {
					return this.$store.getters.FacilitiesPages;
				},
				set() {}
			},
			firstZhuTi: {
				get() {
					return this.$store.getters.firstColors;
				},
				set() {}
			},
			secondZhuTi: {
				get() {
					return this.$store.getters.secondColors;
				},
				set() {}
			},
			thirdZhuTi: {
				get() {
					return this.$store.getters.thirdColors;
				},
				set() {}
			},
			   largePic: {
				get() {
					return this.$store.getters.largePics;
				},
				set() {}
			},
		},
		created() {
			this.$store.commit("setFacilitiesPage", 1);
			this.allData()			
		},
		methods: {
			lgPic(src) {
				this.$store.commit("setLargePic", 1);
				this.$store.commit("setLgwhichpic", src);
			},
			checkPage(index) {
				this.isactive = index
				let routerArr = ['/fire/FireEquipment','/fire/facilitiesManager']
				this.$router.push({  //核心语句
				        path:routerArr[index],   //跳转的路径
//				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
//				          id:this.id ,  
//				        }
				     })
				
			},
			addFacilities (){
				this.$router.push({path:'/fire/addFacilities'})
			},
            allData(){
            	axios
				.post("/fire/Info/selectByPrimaryeQuipmentbyshebeisheshi", qs.stringify(this.searchForm))
				.then(res => {
					this.loading = false;
					if(res.data.code == 200) {
						console.log(res.data.data)
						this.$store.commit("setFacilitiesPage", 1);
						this.$store.commit("setFacilitiesData", res.data.data);
						this.$store.commit("setFacilitiesTotal", res.data.total);
					} else if(res.data.code == "401") {
						this.$message({
							message: res.data.message,
							type: "warning"
						});
						this.$router.push("/login");
					} else {
						this.$message.error(res.data.message);
					}
				})
				.catch(err => {
					this.loading = false;
				});
           },
           searchData(){
           	this.allData()
           },
           resizeData(){          	
           	this.searchForm.di_status = ''      
           	this.searchForm.di_name = ''
           	this.searchForm.enterDate = '' 
           	this.allData()
           },
           handleCurrentChange(val){
           	  this.searchForm.page = val
           	  this.allData()
           },
           Edit(value){
           	console.log(value)
           	let di_id = value.di_id
           	this.$router.push({  //核心语句
				        path:'/fire/addFacilities',   //跳转的路径
				        query:{           //路由传参时push和query搭配使用 ，作用时传递参数
				          di_id:di_id, 
				          sign:'edit'
				        }
				     })
           	
           	
           },
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
		background: #4687E1;
		border: 1px solid #4687E1;
		border-radius: 4px;
		color: white;
		margin-left: 16px;
		margin-top: 10px;
	}
	
	.addEquipment {
		width: 95px;
		height: 36px;
		background: #6CBC6C;
		color: white;
		float: right;
		margin-right: 1%;
		margin-top: 10px;
	}
	
	.addEquipment .btniconfont {
		color: white;
		font-size: 12px;
	}
</style>