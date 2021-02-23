<template>
  <div class="desktop">
    <el-row>
      <el-col :span="12">
        <div class="content content-small">
          <div class="title">
            <div class="bar"></div>
            <p>待办事项</p>
          </div>
          <div class="backlog">
            <el-row>
              <el-col v-for="(item,index) in backlog" :key="index" :span="6">
                <router-link :to="item.url">
                  <p>{{item.amount}}</p>
                  <p>{{item.type}}</p>
                </router-link>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="content content-small">
          <div class="title">
            <div class="bar"></div>
            <p>今日动态</p>
          </div>
          <div class="today-dynamic">
            <el-row>
              <el-col v-for="(item,index) in todayDynamic" :key="index" :span="12" class="indexItems">
                <span class="indexItem">{{item.name}}</span>
                <el-progress :percentage="item.percent" text-inside color="#83BFFB"></el-progress>
                <span class="itemPer"><b>{{item.amount}}</b><span>人</span></span>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="padding-right">
        <div class="content content-small today-weather">
          <div>
            <p><img src="../../../assets/images/weather.png"/></p>
            <p>14℃～22℃</p>
            <p>{{nowDate}}</p>
            <p>{{nowDay}}</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="content content-mini">
          <div class="title">
            <div class="bar"></div>
            <p>常用菜单</p>
          </div>
          <div class="common-menu">
            <ul>
              <li v-for="(item,index) in favoriteUrls" :key="index">
                <router-link :to="item.url">
                  <img :src="item.icon"/>
                  <p>{{item.name}}</p>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="content content-normal margin-top">
          <div class="title">
            <div class="bar"></div>
            <p>数据统计</p>
          </div>
          <table class="data-statistics" border="1" style="border: 1px solid #fff;">
            <tr>
              <td>核定床位</td>
              <td>{{dataStatistics[0]}}</td>
              <td>入住老人</td>
              <td>{{dataStatistics[1]}}</td>
              <td>入住率</td>
              <td>{{dataStatistics[2]}}</td>
            </tr>
            <tr>
              <td>空床位</td>
              <td>{{dataStatistics[3]}}</td>
              <td>已预订</td>
              <td>{{dataStatistics[4]}}</td>
              <td>房间数</td>
              <td>{{dataStatistics[5]}}</td>
            </tr>
            <tr>
              <td>员工数</td>
              <td>{{dataStatistics[6]}}</td>
              <td>护理员</td>
              <td>{{dataStatistics[7]}}</td>
              <td>医护</td>
              <td>{{dataStatistics[8]}}</td>
            </tr>
          </table>
        </div>
      </el-col>
      <el-col :span="12" class="padding-right">
        <div class="content content-large">
          <div class="title">
            <div class="bar"></div>
            <p>寿星统计</p>
          </div>
          <div class="longevity">
            <p>
              <span>月份：
                <el-select v-model="nowMonth" class="month" placeholder="月份" @change="dateSearch">
                  <el-option
                    v-for="item in months"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </span>
              <el-button type="primary" round>导出</el-button>
            </p>
            <p>共计：{{oldData.length}} 位寿星</p>
            <el-table :data="oldData" stripe style="width: 100%;height:445px;overflow:auto;">
              <el-table-column prop="keyValue" label="姓名" width="180"></el-table-column>
              <el-table-column prop="stringValue2" label="性别" width="180"></el-table-column>
              <el-table-column prop="stringValue" label="出生日期"></el-table-column>
              <el-table-column prop="itemValue" label="年龄"></el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
	import axios from "axios";
	export default {
		data() {
			return {
        nowDay: "",
        nowMonth: "",
        nowDate: "",     
        oldData: [], //寿星统计
        backlog:[
          {type:"合同延长",amount:0,url:"/elder/contract?expireTime=30&status=100"},
					{type:"照护评估",amount:0,url:"/elder/care/assessList?expireTime=30"},
					{type:"长护险评估",amount:0,url:"/elder/longNurseRisk?expireTime=60"},
					{type:"员工合同",amount:0,url:"/oa/employee"},
        ],
        todayDynamic:[
          {name:"今日咨询",percent:100,amount:0},
					{name:"今日预约",percent:100,amount:0},
					{name:"今日入院",percent:100,amount:0},
					{name:"今日离院",percent:100,amount:0},
        ],
				favoriteUrls:[
					{icon:"//image.youbankeji.com/static/console/icon_checkin.png",name:"入住登记",url:"/elder/checkin"},
					{icon:"//image.youbankeji.com/static/console/icon_contract.png",name:"合同约定",url:"/elder/contract"},
					{icon:"//image.youbankeji.com/static/console/icon_change.png",name:"等级变更",url:"/elder/change"},
					{icon:"//image.youbankeji.com/static/console/icon_care.png",name:"照护评估",url:"/elder/care/assessList"},
					{icon:"//image.youbankeji.com/static/console/icon_data.png",name:"数据统计",url:"/data/elder"},
        ],
        dataStatistics: ["0","0","0","0","0","0","0","0","0"],
        months: [
          { label: "一月", value: "01" },
          { label: "二月", value: "02" },
          { label: "三月", value: "03" },
          { label: "四月", value: "04" },
          { label: "五月", value: "05" },
          { label: "六月", value: "06" },
          { label: "七月", value: "07" },
          { label: "八月", value: "08" },
          { label: "九月", value: "09" },
          { label: "十月", value: "10" },
          { label: "十一月", value: "11" },
          { label: "十二月", value: "12" }
        ]
			};
		},
		created() {
      //获取当前时间
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			if(month<10) month = '0'+month;
      let valueMonth = month;
      
			this.dataOldInit('机构数据','工作台数据统计',"");//待办事项 今日动态 数据统计
			this.dataOldInit('老人数据','按月统计老人生日',valueMonth);//寿星排行
    },
    mounted() {
      this.weatherDay();
    },
		methods: {
			//寿星排行
			dataOldInit(category,dataType,value){
				let data = {
					category: category,
          dataType: dataType,
          value: value
        };
        axios
				.fetch('statServer', "/stat/getStatResultsByIssueValue", data)
				.then(res => {
          let resData = res.data;
          if(category === "老人数据"){							
					  this.oldData = resData;
					}else if(category === "机构数据"){
            for(var i=0; i<resData.length; i++){
              let title = resData[i].title;
              let itemValue = resData[i].itemValue;
              let itemValue2 = resData[i].itemValue2;
              //待办事项
              if(title == "合同延长"){this.backlog[0].amount = itemValue}
              else if(title == "照护评估"){this.backlog[1].amount = itemValue}
              else if(title == "长护险评估"){this.backlog[2].amount = itemValue}
              else if(title == "员工合同"){this.backlog[3].amount = itemValue}
              //今日动态
              else if(title == "今日咨询"){this.todayDynamic[0].amount = itemValue}
              else if(title == "今日预约"){this.todayDynamic[1].amount = itemValue}
              else if(title == "今日入院"){this.todayDynamic[2].amount = itemValue}
              else if(title == "今日离院"){this.todayDynamic[3].amount = itemValue}
              //数据统计
              else if(title == "核定床位"){this.dataStatistics[0] = itemValue}
              else if(title == "入住老人"){this.dataStatistics[1] = itemValue}
              else if(title == "入住率"){this.dataStatistics[2] = (itemValue2*100).toFixed(2)+"%"}
              else if(title == "空床位"){this.dataStatistics[3] = itemValue}
              else if(title == "已预定床位"){this.dataStatistics[4] = itemValue}
              else if(title == "房间数"){this.dataStatistics[5] = itemValue}
              else if(title == "员工数"){this.dataStatistics[6] = itemValue}
              else if(title == "护理员数"){this.dataStatistics[7] = itemValue}
              else if(title == "医护人数"){this.dataStatistics[8] = itemValue}
            }
          }
				})
			},
			dateSearch(val){
				this.dataOldInit('老人数据','按月统计老人生日',val);
			},
      weatherDay() { 
        let nowDate = new Date();
        //获取当前年月日
        let y = nowDate.getFullYear();   
        let m = (nowDate.getMonth()+1)<10?"0"+(nowDate.getMonth()+1):(nowDate.getMonth()+1);
        let d = nowDate.getDate()<10?"0"+nowDate.getDate():nowDate.getDate();
        this.nowMonth = m;
        this.nowDate = y + "年" + m  + "月" + d + "日";
        //获取当前星期
        let day = nowDate.getDay();
        let weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        this.nowDay = weekday[day];
      },
		},
		filters: {
		    paseIntFilter: val => {
				val = val.toFixed(1);	     
		      	return val;
		    }
		},
	};
</script>

<style lang="less" scoped>
.el-table::before{
  z-index: inherit;
}
.desktop {
  width: 100%;

  .el-col {
    padding: 10px 0px 0px 10px;
  }
  .content {
    background-color: #fff;
    border-radius: 4px;
    padding: 10px 20px;
  }
  .content-mini {
    height: 180px;
  }
  .content-small {
    height: 240px;
  }
  .content-normal {
    height: 390px;
  }
  .content-large {
    height: 600px;
  }
  .padding-right {
    padding-right: 10px;
  }
  .margin-top {
    margin-top: 10px;
  }
  .title {
    height: 40px;

    .bar {
      position: relative;
      width: 7px;
      height: 24px;
      background-color: #1333e2;
      display: inline-block;
      border-radius: 2px;
      top: 6px;
    }
    p {
      display: inline-block;
      margin-left: 5px;
      font-size: 20px;
      font-weight: bold;
      color: #222222;
    }
  }
}
//待办事项
.backlog {
  display: flex;
  align-items: center;
  height: 200px;
  .el-row {
    width: 100%;
    .el-col-6 {
      text-align: center;
      p:nth-child(1) {
        font-size: 38px;
        font-weight: bold;
        color: #222222;
      }
      p:nth-child(2) {
        margin-top: 10px;
        font-size: 16px;
        color: #999999;
      }
    }
  }
}
//常用菜单
.common-menu {
  display: flex;
  align-items: center;
  height: 140px;
  ul {
    width: 100%;
    text-align: center;
    li {
      display: inline-block;
      width: 20%;
      p {
        margin-top: 10px;
        font-size: 18px;
        color: #666666;
      }
    }
  }
  img {
    width: 75px;
  }
}
//今日动态
.today-dynamic {
  display: flex;
  align-items: center;
  height: 200px;
  .el-row {
    width: 100%;
    .el-col-12 {
      margin: 20px 0;
      span:nth-child(1) {
        font-size: 18px;
        color: #222222;
      }
      .el-progress {
        display: inline-block;
        width: 50%;
        /deep/ .el-progress-bar__innerText {
          font-size: 0;
        }
      }
    }
  }
}
//数据统计
.data-statistics {
  width: 100%;
  height: 350px;
  text-align: center;
  tr {
    width: 100%;
    td {
      width: 16.5%;
    }
    td:nth-child(odd) {
      font-size: 18px;
      color: #666666;
      background-color: #EDF4FE;
    }
    td:nth-child(even) {
      font-size: 20px;
      font-weight: bold;
      color: #222222;
      background-color: #FAFAFA;
    }
  }
}
//寿星统计
.longevity {
  p:nth-child(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 2px solid #E5E5E5;
    span {
      font-size: 16px;
      color: #666666;
      .el-date-editor {
        width: 7em;
      }
    }
    .el-button {
      padding: 6px 15px;
      background: #4E8BF3;
    }
    .month {
      width: 100px;
    }
  }
  p:nth-child(2) {
    margin: 15px 0 5px;
    color: #666666;
    font-size: 14px;
  }
}
//今日天气
.today-weather {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 18px;
  color: #222222;
  p:nth-child(2) {
    margin: 1em 0;
  }
}
</style>