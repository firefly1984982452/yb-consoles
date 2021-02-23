<template>

	<div class="app-container" id="liveCrList">
		<el-row class="warp" id="staffTableStyle">
			<el-col class="searchTop">
				<el-row type="flex" class="row-bg" :gutter="0">
					<router-link v-for="(item,index) in btnArr" :key="index" :to="{path:routerArr[index]}">
						<el-button :class="isactive == index ? 'searchBtnsStyle' : 'checkBtn' " @click="isactive = index">{{item}}</el-button>
					</router-link>
				</el-row>
			</el-col>
			<el-col>
					<router-view></router-view>
			</el-col>
		</el-row>
		<!--<el-row class="ybBanner">
			<span>技术支持：有伴（上海）智能科技有限公司</span>
		</el-row>-->
	</div>
</template>
<script>
	import axios from "axios";
	import qs from "qs";
	import echarts from 'echarts'
	export default {
		data() {
			return {
				// btnArr: ['巡查数据', '巡查分类', '巡查计划', '巡查任务', '巡查点管理'],
				btnArr: [ '巡查计划', '巡查任务'],
				// routerArr: ['/fire/xunCha/xunChaData', '/fire/xunCha/xunChaCataloge', '/fire/xunCha/xunChaPlan', '/fire/xunCha/xunChaWork', '/fire/xunCha/xunChaManager'],
				routerArr: ['/fire/xunCha/xunChaPlan', '/fire/xunCha/xunChaWork'],
				isactive: '0',
				timeActive: '0',
			}
		},
		computed: {

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
		},
		mounted() {          
		},
		created() {
			let routerPath = this.$route.path
			for(var i = 0; i<this.routerArr.length;i++){
				if(this.routerArr[i] == routerPath)this.isactive = i
			}
		},
		methods: {
			addFacilities() {
				this.$router.push({
					path: '/fire/addFacilities'
				})
			},

		},

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
		margin-bottom: 5px;
	}
	
	.searchBtnsStyle {
		width: 95px;
		height: 36px;
		background: #4687E1;
		border: 1px solid #4687E1;
		border-radius: 4px;
		color: white;
		margin-bottom: 5px;
	}
	
	.checkTimeBtn {
		width: 72px;
		height: 36px;
		background: rgba(255, 255, 255, 1);
		color: #333333;
		margin-left: 0;
		border: none;
		font-weight: 500;
	}
	
	.timeBtn {
		width: 72px;
		height: 36px;
		background: rgba(35, 104, 211, 1);
		border-radius: 4px 0px 0px 4px;
		color: #fff;
		margin-left: 0;
		border: none;
		font-weight: 500;
	}
</style>