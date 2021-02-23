<template>
  <div class="app-container" id="dashed" v-loading="loading">
    <div class="dashContainer">
      <p class="cancelTit" style="margin-top: 10px">
        <span style="position: relative;top: -5px">今日数据统计</span>
      </p>
      <el-row :gutter="20">
        <el-col :xl="12" :lg="24">
          <el-row :gutter="20">
            <el-col :xl="12" :lg="12">
              <div class="itemBox itemBox1">
                <p class="itemTitle">{{todayDate}}</p>
                <p v-if="weekDay==0" class="whatDay">周日</p>
                <p v-if="weekDay==1" class="whatDay">周一</p>
                <p v-if="weekDay==2" class="whatDay">周二</p>
                <p v-if="weekDay==3" class="whatDay">周三</p>
                <p v-if="weekDay==4" class="whatDay">周四</p>
                <p v-if="weekDay==5" class="whatDay">周五</p>
                <p v-if="weekDay==6" class="whatDay">周六</p>
              </div>
            </el-col>
            <el-col :xl="12" :lg="12">
              <div class="itemBox itemBox2">
              
                <p class="itemTitle">{{todayTotalNum}}<span>人</span> </p>
                <p class="itemText">今日上班员工数量</p>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="0" style="margin-top: 20px">
            <el-col :xl="24" :lg="24">
              <el-card class="box-card" style="position: relative;">
              	<!--<span style="font-weight: bolder;float: right;">合计：{{todayTotalNum}}<span v-if="todayTotalNum != undefined ">人</span></span>-->
                <div slot="header" class="clearfix"><span>今日上班员工数量</span></div>
                <div class="barSex" id="pieSex" style="width:100%; height:40.5vh;"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>

        <el-col :xl="12" :lg="24">
          <el-row :gutter="20">
            <el-col :xl="12" :lg="12">
              <div class="itemBox itemBox3" >
                  <p class="itemTitle">{{form.toDayVisitorNum}}<span>人</span> </p>
                <p class="itemText">今日访客总数量</p>
              </div>
            </el-col>
            <el-col :xl="12" :lg="12">
              <div class="itemBox itemBox4">
                <p class="itemTitle">{{form.monthVisitorNum}}<span>人</span> </p>
                <p class="itemText">今日外出老人数量</p>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin: 20px 0 10px 0">
            <el-col :xl="12" :lg="12" style="padding-left: 0">
              <el-card class="box-card" style="position: relative;">
                <div slot="header" class="clearfix"><span>今日访客统计</span></div>
                <div class="barSex" id="todayWork" style="width:100%; height:40.5vh;"></div>
              </el-card>
            </el-col>
            <el-col :xl="12" :lg="12" style="padding-right: 0">
              <el-card class="box-card" style="position: relative;">
                <div slot="header" class="clearfix"><span>今日老人进出统计</span></div>
                <div class="barSex" id="todayView" style="width:100%; height:40.5vh;"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <p class="cancelTit" style="margin:10px 0 10px">
        <span style="position: relative;top: -5px">历史数据统计</span>
      </p>
      <el-row :gutter="20" style="margin-top: 10px;">
        <el-col :span="16">        
          <el-card class="box-card">
          	<el-form ref="searchForm" :model="searchForm" label-width="75px">
                <el-form-item label="月份" style="position: absolute;z-index: 1;">
                    <el-date-picker :clearable="false"  value-format="yyyy-MM" v-model="searchForm.dateMonth" type="month" placeholder="选择月份" @change="changeMonth">
                    </el-date-picker>
                </el-form-item>
            </el-form>
						
          	<span style="font-weight: bolder;float: right;margin-right: 10px;">合计：{{monthTotalNum}} <span v-if="monthTotalNum != undefined ">人次</span></span>
            <div slot="header" class="clearfix"><span>{{monthToday}}份访客数量</span></div>
            <div class="columnType" id="eightMonth" style="width:100%; height:40.5vh;"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
          	<span style="font-weight: bolder;float: right;margin-right: 10px;">合计：{{yearTotalNum}} <span v-if="yearTotalNum != undefined ">人次</span></span>
            <div slot="header" class="clearfix"><span>近一年访客数量</span></div>
            <div class="columnType" id="oneYear" style="width:100%; height:40.5vh;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
    import echarts from 'echarts'
    import moment from 'moment'
    export default {
        data() {
            return {
            	searchForm:{
            		dateMonth:moment().utc().format('YYYY-MM'),
            	},
                todayDate:moment().utc().format('YYYY年M月D日'),
                weekDay:moment().utc().format('d'),
                form:{
                   
                    monthVisitorNum:'',
                    toDayVisitorNum:'',
                    todayWorkNum:'',
                },
               loading:'',
               todayEmpNum:[],
               deptName:[],
               todayTotalNum:'',
               visitorType:[],               
               visitorNum:[],
               
               visitorNum:[],
               todayPeoleGoOut:[],//每类人代表的数值数组
               peopleData:[],//每类人的数组
               eightMon:[],
               eightMonthNum:[],
               monthTotalNum:'',
               monthToday:moment().utc().format('M月'),
               oneYearMonth:[],
               oneYearNum:[],
               yearTotalNum:'',
            }
        },
        watch: {
        },
        mounted() {
            this.oldSex(); //数据展示
        },
        methods: {
        	changeMonth(){
                var _this = this;
                _this.eightMonth = echarts.init(document.getElementById('eightMonth'));
                window.addEventListener("resize",function(){
                    _this.eightMonth.resize()   
                })
                // 月份访客量
                let data3 = {
                    category: '智能门卫',
                    dataType: '每日访问数量',
                    value: this.searchForm.dateMonth
                };
                axios.fetch("statServer", "/stat/getStatResultsByIssueValue", data3).then(res => {
                    if (res.code == "200") {
                        this.eightMon = res.data.map(v=>v.keyValue)
                        this.eightMonthNum = res.data.map(v=>v.itemValue)
                        this.monthTotalNum = eval(this.eightMonthNum.join("+"))
                        _this.eightMonth.setOption({
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '4%',
                                containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                data:this.eightMon,
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    },
                                    formatter: '{value}',
                                },
                            }],
                            yAxis: [{
                                type: 'value',
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    },
                                    formatter: '{value}',
                                },
                            }],
                            series: [{
                                name: '',
                                type: 'bar',
                                barWidth: '18px',
                                data: this.eightMonthNum,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true, //开启显示
                                            position: 'top', //在上方显示
                                            textStyle: { //数值样式
                                                color: '#333',
                                                fontSize: 16
                                            }
                                        },
                                        color: '#70AFEA',
                                    }
                                },
                            }]
                        });
                    } else if (res.data.code == "401") {
                        this.$message({
                            message: res.data.message,
                            type: "warning"
                        });
                        this.$router.push("/login");
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        	},
            oldSex() {
                var _this = this;
                _this.barSex = echarts.init(document.getElementById('pieSex'));             
                _this.todayWork = echarts.init(document.getElementById('todayWork'));
                _this.todayView = echarts.init(document.getElementById('todayView'));
                _this.eightMonth = echarts.init(document.getElementById('eightMonth'));
                _this.oneYear = echarts.init(document.getElementById('oneYear'));
                //echarts图表随化
                window.addEventListener("resize",function(){
                    _this.barSex.resize()
                    _this.todayWork.resize()
                    _this.todayView.resize()
                    _this.eightMonth.resize()
                    _this.oneYear.resize()        		    
                })
                // 今日上班员工数量
                let data1 = {
                    category: '智能门卫',
                    dataType: '今日上班员工数量',
                    value: ''
                };
                axios.fetch("statServer", "/stat/getStatResultsByIssueValue", data1).then(res => {
                    if (res.code == "200") {
                        // 今日上班员工数量
                        let empData = res.data.filter(val => val.title == '今日上班员工数量');
                        this.todayEmpNum = empData.map(v=>v.itemValue)   
                        if(this.todayEmpNum.length>0){
                            this.todayTotalNum = eval(this.todayEmpNum.join("+"))//合计  
                        }else{
                            this.todayTotalNum = 0
                        }
                        this.deptName = empData.map(v=>v.stringValue)
                        this.todayWorkNum = empData.map(v=>{
                            return{
                                value:v.itemValue,
                                name:v.stringValue
                            }
                        })
                        let data = empData
                        _this.barSex.setOption({
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                data: this.deptName,
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    },
                                    formatter: '{value}',
                                },
                            }],
                            yAxis: [{
                                type: 'value',
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    },
                                    formatter: '{value}',
                                },
                            }],
                            series: [{
                                name: '',
                                type: 'bar',
                                barWidth: '36px',
                                data: this.todayEmpNum,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true, //开启显示
                                            position: 'top', //在上方显示
                                            textStyle: { //数值样式
                                                color: '#333',
                                                fontSize: 16
                                            }
                                        },
                                        color: '#70AFEA',
                                    }
                                },
                            }]
                        });
                    } else if (res.data.code == "401") {
                        this.$message({
                            message: res.data.message,
                            type: "warning"
                        });
                        this.$router.push("/login");
                    }
                })
                .catch(err => {
                    this.loading = false;
                });

                // 今日访客统计
                let data2 = {
                    category: '智能门卫',
                    dataType: '今日访客统计',
                    value: ''
                };
                axios.fetch("statServer", "/stat/getStatResultsByIssueValue", data2).then(res => {
                    if (res.code == "200") {
                        // 今日访客统计
                        let visitorData = res.data.filter(val => val.title == '今日访客统计');
                        this.visitorNum = visitorData.map(v=>v.itemValue)  
                        if(this.visitorNum.length>0){
                            this.form.toDayVisitorNum = eval(this.visitorNum.join("+"))//合计
                        }else{
                            this.form.toDayVisitorNum = 0
                        }
                                                                            
                        this.visitorType = visitorData.map(v=>v.stringValue)              
                        this.peopleData = visitorData.map(v=>{
                            return{
                                value:v.itemValue,
                                name:v.stringValue
                            }
                        })
                        //今日访客统计
                        _this.todayWork.setOption({
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                right:20,
                                bottom:'10%',
                                icon:'circle',
                                align:'left',
                                data:this.visitorType
                            },
                            series: [
                                {
                                    name:'访问来源',
                                    type:'pie',
                                    radius: ['40%', '60%'],
                                    center:['35%','50%'],
                                    avoidLabelOverlap: false,
                                    label: {
                                        normal: {
                                                formatter: '{c}',
                                                position: 'inner'
                                        },
                                        emphasis: {
                                            show: true,
                                            textStyle: {
                                                fontSize: '30',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data:this.peopleData,
                                    itemStyle:{
                                        color: function(params) {
                                            var colorList = [
                                                '#63C4C7','#B2A2DA','#70AFEA' ,
                                                '#F4BB89','#DF8B8E','#8F98B1',
                                                '#666666'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    },
                                }
                            ]
                        });
                    } else if (res.data.code == "401") {
                        this.$message({
                            message: res.data.message,
                            type: "warning"
                        });
                        this.$router.push("/login");
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
                        
                //今日外出老人数量
            
                // 今日访客统计
                let data3 = {
                    category: '智能门卫',
                    dataType: '今日老人进出数量',
                    value: ''
                };
                axios.fetch("statServer", "/stat/getStatResultsByIssueValue", data3).then(res => {
                    if (res.code == "200") {
                        let visitorData = res.data.filter(val => val.stringValue == '已外出');
                        this.form.monthVisitorNum = visitorData[0].itemValue;
                        this.todayPeoleGoOut = res.data.map(v=> v.stringValue)
                        this.todayEmpNum =  res.data.map(v=> v.itemValue)
                        //今日访客统计
                        _this.todayView.setOption({
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                data: this.todayPeoleGoOut,
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    },
                                    formatter: '{value}',
                                },
                            }],
                            yAxis: [{
                                type: 'value',
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    },
                                    formatter: '{value}',
                                },
                            }],
                            series: [{
                                name: '',
                                type: 'bar',
                                barWidth: '36px',
                                data: this.todayEmpNum,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true, //开启显示
                                            position: 'top', //在上方显示
                                            textStyle: { //数值样式
                                                color: '#333',
                                                fontSize: 16
                                            }
                                        },
                                        color: '#70AFEA',
                                    }
                                },
                            }]
                        });
                    } else if (res.data.code == "401") {
                        this.$message({
                            message: res.data.message,
                            type: "warning"
                        });
                        this.$router.push("/login");
                    }
                })
                .catch(err => {
                    this.loading = false;
                });

                this.changeMonth();

                //一年的访客量
                let data4 = {
                    category: '智能门卫',
                    dataType: '每月访问数量',
                    value: ''
                };
                axios.fetch("statServer", "/stat/getStatResultsByIssueValue", data4).then(res => {
                    if (res.code == "200") {
                        this.oneYearMonth = res.data.map(v=> v.keyValue.slice(5)+'月')                         
                        this.oneYearNum = res.data.map(v=> v.itemValue)
                        this.yearTotalNum = eval(this.oneYearNum.join("+"))                    
                        _this.oneYear.setOption({
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '4%',
                                containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                data: this.oneYearMonth,
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    },
                                    formatter: '{value}',
                                },
                            }],
                            yAxis: [{
                                type: 'value',
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    },
                                    formatter: '{value}',
                                },
                            }],
                            series: [{
                                name: '',
                                type: 'bar',
                                barWidth: '18px',
                                data: this.oneYearNum,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true, //开启显示
                                            position: 'top', //在上方显示
                                            textStyle: { //数值样式
                                                color: '#333',
                                                fontSize: 16
                                            }
                                        },
                                        color: '#70AFEA',
                                    }
                                },
                            }]
                        });
                    } else if (res.data.code == "401") {
                        this.$message({
                            message: res.data.message,
                            type: "warning"
                        });
                        this.$router.push("/login");
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
            }
        }
    }
</script>
<style scoped>
  .clearfix{
    /*margin-bottom: 20px;*/
    font-weight: bolder;
    font-size:18px;
  }
  .cancelTit{
    width:120px;
    height:28px;
    font-size:20px;
    font-family:PingFangSC;
    font-weight:bolder;
    color:#333333;

  }
  .itemBox{
    text-align: center;
  }
  .itemBox1{
    background: #5274DF;
    height: 139px;
    border-radius: 5px;
    margin-top: 10px;
  }
  .itemBox2{
    background: #ED9079;
    height: 139px;
    border-radius: 5px;
    margin-top: 10px;
  }
  .itemBox3{
    background: #A372E3;
    height: 139px;
    border-radius: 5px;
    margin-top: 10px;
  }
  .itemBox4{
    background: #8590EC;
    height: 139px;
    border-radius: 5px;
    margin-top: 10px;
  }
  .itemTitle{
    padding-top: 20px;
    height:59px;
    font-size:42px;
    font-family:PingFangSC;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:59px;
  }
  .itemTitle span{
    font-size: 16px;
  }
  .whatDay{
    background:white;
    width: 69px;
    height: 28px;
    font-size:18px;
    line-height: 28px;
    color: #5274DF;
    margin: 12px auto;
    border-radius: 5px;
  }
  .itemText{
    font-size:18px;
    font-family:PingFangSC;
    font-weight:500;
    color:rgba(255,255,255,1);
    margin-top: 15px;
  }
</style>
