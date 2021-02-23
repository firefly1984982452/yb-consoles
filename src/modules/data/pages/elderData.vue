<template>
  <div class="padding-content">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card" style="position: relative;">
          <div slot="header" class="header-box">
            <span>性别比例</span>
            <div class="chartTop">{{allNum}}人</div>
          </div>
          <div class="echarts-box">
            <div class="echarts-div">
              <div class="barSex" id="pieSex" style="width:100%; height:30vh;position: relative;"></div>
              <span>男</span>
            </div>
            <div class="echarts-div">
              <div class="barSex" id="pieSex2" style="width:100%; height:30vh;position: relative;"></div>
              <span>女</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="header-box"><span>户籍分布</span></div>
          <div class="addressChart" id="addressCol" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="header-box">
            <span>年龄分布</span>
            <div class="chartTop">平均{{averageAge}}周岁</div>
          </div>
          <div class="columnAge" id="columnAge" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="header-box">
            <span>照护等级</span>
            <right-echarts-info :list="elderHomeCommunityist"></right-echarts-info>
          </div>
          <div class="columnType" id="columnType" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <!-- <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="header-box"><span>院方护理等级</span></div>
          <div class="levelHuLi" id="levelHuLi" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col> -->
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="header-box">
            <span>长护险等级</span>
            <el-button-group>
              <el-button :type="currentLoneIndex == 0 ? 'primary' : ''" size="mini" @click="changeLong(0)">标准 {{longNum1}}</el-button>
              <el-button :type="currentLoneIndex == 1 ? 'primary' : ''" size="mini" @click="changeLong(1)">其它 {{longNum2}}</el-button>
            </el-button-group>
          </div>
          <div class="longHuli" v-show="currentLoneIndex == 0" id="longHuli" :style="'width:'+currentLongWidth" style="height:30vh;"></div>
          <div class="longHuli" v-show="currentLoneIndex == 1" id="longHuli2" :style="'width:'+currentLongWidth" style="height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card in-out-summer">
          <div class="header-box">
            <!-- <span>离入院人数</span> -->
            <span>
              <el-date-picker
                :class="currentInOutIndex == 4 ?'week-picker' : ''"
                v-model="searchData"
                @change="changeInout(4)"
                size="mini"
                value-format="yyyy-MM-dd"
                style="width:230px"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>

            </span>
            <div class="right-menu">
              <el-button-group>
                <el-button :type="currentInOutIndex == 0 ? 'primary' : ''" size="mini" @click="changeInout(0)">本&nbsp;&nbsp;&nbsp;周</el-button>
                <el-button :type="currentInOutIndex == 1 ? 'primary' : ''" size="mini" @click="changeInout(1)">本&nbsp;&nbsp;&nbsp;月</el-button>
                <el-button :type="currentInOutIndex == 2 ? 'primary' : ''" size="mini" @click="changeInout(2)">本季度</el-button>
                <el-button :type="currentInOutIndex == 3 ? 'primary' : ''" size="mini" @click="changeInout(3)">本年度</el-button>
              </el-button-group>
            </div>
          </div>
          <div style="text-align: center;font-weight:bold;margin: 24px 0">入出院人数（{{currentInOutDate[0]}}~{{currentInOutDate[1]}}）</div>
          <div id="inOut" :style="'width:100%;height:'+currentLongHeight"></div>
        </el-card>
      </el-col> 
    </el-row>
  </div>
</template>
<script>
	import axios from "axios";
  import echarts from 'echarts';
  import echartsNull from '@/components/echarts-null';
  import {getAdapterFont,getAdapterFontBold} from '../../../settings/echarts';
	export default {
		data() {
			return {
        searchData:'',
        initDatas: [], //初始化数据
        allNum: 0, //性别比例
        MaleNum: 0, //男性人数
        FemaleNum: 0, //女性人数
        averageAge: '', //平均年龄
        elderHomeCommunityist: [{
            title:'二级',
            style: 'background:#6395FA'
        },{
            title:'三级',
            style: 'background:#4ECACE'
        },{
            title:'四级',
            style: 'background:#AB92EB'
        },{
            title:'五级',
            style: 'background:#FFB16D'
        },{
            title:'六级',
            style: 'background:#EF8380'
        }],
        currentLoneIndex: 0 , // 当前长护险在看哪个
        currentInOutIndex: 0, // 当前出入院在看哪个
        currentInOutDate: '', // 当前出入院在看哪个
        longCharts : '',
        longNum1: 0,//  长护险护理等级-标准
        longNum2: 0,//  长护险护理等级-其它
        currentLongHeight: '26vh',
        currentLongWidth: '600px'
			}
    },
    created(){
      this.currentLongHeight = window.innerWidth < 1900 ? '22.5vh' : '26.5vh';
      this.currentLongWidth = window.innerWidth*0.3+'px';
      window.addEventListener("resize", () => {
        this.$nextTick(() => {
          this.currentLongHeight = window.innerWidth < 1900 ? '22.5vh' : '26.5vh';
          this.currentLongWidth = window.innerWidth*0.3+'px';
          console.log('???',window.innerWidth,this.currentLongHeight)
        })
      })
    },
		mounted() {
      this.currentInOutDate = this.getCurrWeekDays();
      this.initData();
      this.changeInout(0)
		},
		methods: {
      // 当前周
      getCurrWeekDays () {
        let weekOfday = parseInt(this.$moment().format('d')) // 计算今天是这周第几天
        let start = this.$moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD') // 周一日期
        let end = this.$moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
        return [start,end]
      },
      // 当前月
      getCurrMonthDays () {
        let start = this.$moment().add('month', 0).format('YYYY-MM') + '-01'
        let end = this.$moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
        return [start,end]
      },
      // 当前季度
      getCurrJiDays () {
        let start = this.$moment().startOf('quarter').format("YYYY-MM-DD")
        let end = this.$moment().endOf('quarter').format("YYYY-MM-DD")
        return [start,end]
      },
      // 当前年
      getCurrYearDays () {
        let start = this.$moment().format('YYYY-01-01')
        let end = this.$moment().format('YYYY-12-31')
        return [start,end]
      },
      changeLong(index) {
        this.currentLoneIndex = index;
      },
      changeInout(index) {
        console.log(index,this.searchData)

        if(index == 4 && (this.searchData == null || this.searchData == '')) {
          index = 0;
        } else {
          this.currentInOutDate = this.searchData;
        }

        switch (index) {
          // 本周
          case 0:
            this.searchData = '';
            this.currentInOutDate = this.getCurrWeekDays();
            break;
          // 本月
          case 1:
            this.searchData = '';
            this.currentInOutDate = this.getCurrMonthDays();
            break;
          // 本季度
          case 2:
            this.searchData = '';
            this.currentInOutDate = this.getCurrJiDays();
            break;
          // 本年度
          case 3:
            this.searchData = '';
            this.currentInOutDate = this.getCurrYearDays();
            break;
          default:
            break;
        }
        this.currentInOutIndex = index;
        console.log(this.currentInOutIndex)
        this.$forceUpdate();
        let data = {
          startTime: this.currentInOutDate[0],
          endTime: this.currentInOutDate[1]
        }
        axios
				.fetch('elderServer', "/elderInfo/statistics/check/in/out", data)
				.then(res => {
          this.getInOut(res.data);
				});

      },
      compare(property){
        return function(a,b){
          let value1 = a[property];
          let value2 = b[property];
          return value1 - value2;
        }
      },
      initData(){
        // 初始化拿到当前页面的所有数据
        let that = this;
        let data = {
          groups: '老人数据'
        }
        axios
				.fetch('statServer', "/stat/getStatResultsByGroups", data)
				.then(res => {
          that.getItemData(res.data);
				});
      },
      getInOut(data){
        let sum = data.checkOutNum + data.checkInNum
        let dataList = [
          {
            stringValue:'入院',
            itemValue:data.checkInNum,
            itemValue2: sum === 0 ? 0 : data.checkInNum / sum,
          },
          {
            stringValue:'出院',
            itemValue:data.checkOutNum,
            itemValue2: sum === 0 ? 0 : data.checkOutNum / sum,
          }
        ]
        this.singleColumn(dataList,'inOut');
      },
      getItemData(data){
        //获得对应数据类型的数据
        let sex = data.filter(item=>{return item.dataType==='性别比例' && item.stringValue === '男'});
        let sex2 = data.filter(item=>{return item.dataType==='性别比例' && item.stringValue === '女'});

        sex = sex[0] ? sex : [{itemValue:0,stringValue:'男',itemValue2:0}]
        sex2 = sex2[0] ? sex2 : [{itemValue:0,stringValue:'女',itemValue2:0}]
        let huji = data.filter(item=>{return item.dataType==='户籍类型' && item.title === '户籍类型'});
        let age = data.filter(item=>{return item.dataType==='年龄分布'});
        let ageIndex = age.findIndex(val => val.stringValue==='平均年龄');
        if(ageIndex != -1) {
          this.averageAge = age[ageIndex].itemValue;
        } else {
          this.averageAge = 81;
        }
        age.splice(ageIndex, 1);
        let oldManLevel = data.filter(item=>{return item.dataType==='照护等级'});
        let hospitalLevel = data.filter(item=>{return item.dataType==='院方护理等级'});
        let changLevel = data.filter(item=>{return item.dataType==='长护险护理等级' && (item.keyValue > 1 && item.keyValue < 7)});
        let changLevel2 = data.filter(item=>{return item.dataType==='长护险护理等级' && (item.keyValue < 1 || item.keyValue > 6) && item.keyValue !== ''});

        console.log(huji)
        this.MaleNum = sex[0].itemValue;
        this.FemaleNum = sex2[0] ? sex2[0].itemValue : 0;
        this.allNum += this.MaleNum + this.FemaleNum;

        changLevel.map(val => {
          this.longNum1 += val.itemValue
        })
        changLevel2.map(val => {
          this.longNum2 += val.itemValue
        })
        console.log(oldManLevel)
        oldManLevel.map(item => {
          switch (item.keyValue) {
            case "2":
            case "3":
              item.stringValue += '(轻)'
              break;
          
            case "4":
              item.stringValue += '(中)'
              break;

            case "5":
            case "6":
              item.stringValue += '(重)'
              break;
            default:
              break;
          }
        })
        this.sex('性别比例',sex,'pieSex');
        this.sex2('性别比例',sex2,'pieSex2');
        this.singleColumn(huji,'addressCol');
        this.singleColumn(age,'columnAge');
        this.singleColumn2(oldManLevel,'columnType'); // 照护等级彩色
        // this.singleColumn(hospitalLevel,'levelHuLi');
        this.singleColumn(changLevel,'longHuli');
        this.singleColumn(changLevel2,'longHuli2');
      },
      sex(name,data,chartId){
        let genderNum = data.map(v=>{
          return{
            value: v.itemValue,
            name: v.stringValue,
            value2: parseFloat((v.itemValue2*100).toFixed(2))
          }
        })
        
        let nullItem = {
          value: this.FemaleNum,
          name: '',
          value2: ''
        }
        genderNum.push(nullItem);

        this.annulus(name,genderNum,chartId);
      },
      sex2(name,data,chartId){
        let genderNum = data.map(v=>{
          return{
            value: v.itemValue,
            name: v.stringValue,
            value2: parseFloat((v.itemValue2*100).toFixed(2))
          }
        })
        
        let nullItem = {
          value: this.MaleNum,
          name: '',
          value2: ''
        }
        genderNum.push(nullItem);

        this.annulus2(name,genderNum,chartId);
      },
      singleColumn(data,chartId){
        //一维柱形图数据提取
        // data = data.sort(this.compare('dispIndex'));
        // let title = data.map(v=>v.stringValue);
        // let itemValue = data.map(v=>v.itemValue);
        // let itemValue2 = data.map(v=>v.itemValue2);
        // let options = [title,itemValue, itemValue2];
        data = data.sort(this.compare('dispIndex'));
        let options = data.map(v=>{
          return{
            value: v.itemValue,
            name: v.title,
            value2: parseFloat((v.itemValue2*100).toFixed(2))
          }
        })
        let title = data.map(v=>v.stringValue);
        this.histogram(options,title,chartId);
      },
      singleColumn2(data,chartId){
        data = data.sort(this.compare('dispIndex'));
        let options = data.map(v=>{
          return{
            value: v.itemValue,
            name: v.title,
            value2: parseFloat((v.itemValue2*100).toFixed(2))
          }
        })
        let title = data.map(v=>v.stringValue);

        this.histogram2(options,title,chartId);
      },
      annulus(name,options,chartId){
        //环形图封装
        let annulusItem = echarts.init(document.getElementById(chartId));
        window.addEventListener("resize",function(){annulusItem.resize()})
        annulusItem.setOption({
          tooltip: {
              trigger: 'item',
              axisPointer: {
                  type: 'shadow',
                  show: false
              },
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(0,0,0,0.12)',
              borderWidth: 2,
              extraCssText: '#81ACF4',
              formatter: function(data) {
                 if(data.name == '') {
                   return ''
                 } else {
                    let res = '<p style="color:#999;padding:0 5px;font-size: 14px;">' +data.name+'</p>';
                        res+='<p style="color:#000;padding:0 5px;font-size: 14px;">人数：' +data.value+'</p>';
                        res+='<p style="color:#000;padding:0 5px;font-size: 14px;">占比：' +data.data.value2+'%</p>';
                    return res
                 }
              }
          },
          title: [{
              text: '{name|'+options[0].value+'人}\n{val|'+options[0].value2+'%}',
              top: 'center',
              left: 'center',
              textStyle: {
                  rich: {
                      name: {
                          fontSize: getAdapterFont(),
                          color: 'rgba(0,0,0,0.45)',
                          padding: [10, 0]
                      },
                      val: {
                          fontSize: getAdapterFontBold(),
                          fontWeight: 'bold',
                          color: '#222222',
                      }
                  }
              }
          }],
          series: [{
            name:name,
            type:'pie',
            radius: ['45%', '60%'],
            center:['50%','50%'],
            avoidLabelOverlap: true,
            hoverAnimation: false,
            label: {
              normal: {       
                show: false,
              }
            },
            data:options,
            itemStyle:{
              color: function(params) {
                var colorList = ['#6395FA','rgba(0,0,0,0.04)'];
                return colorList[params.dataIndex]
              },
            },
          }
        ]});
      },
      // 女
      annulus2(name,options,chartId){
        //环形图封装
        let annulusItem = echarts.init(document.getElementById(chartId));
        window.addEventListener("resize",function(){annulusItem.resize()})
        annulusItem.setOption({
          tooltip: {
              trigger: 'item',
              axisPointer: {
                  type: 'shadow',
                  show: false
              },
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(0,0,0,0.12)',
              borderWidth: 2,
              extraCssText: '#81ACF4',
              formatter: function(data) {
                 if(data.name == '') {
                   return ''
                 } else {
                    let res = '<p style="color:#999;padding:0 5px;font-size: 14px;">' +data.name+'</p>';
                        res+='<p style="color:#000;padding:0 5px;font-size: 14px;">人数：' +data.value+'</p>';
                        res+='<p style="color:#000;padding:0 5px;font-size: 14px;">占比：' +data.data.value2+'%</p>';
                    return res
                 }
              }
          },
          title: [{
              text: '{name|'+options[0].value+'人}\n{val|'+options[0].value2+'%}',
              top: 'center',
              left: 'center',
              textStyle: {
                  rich: {
                      name: {
                          fontSize: getAdapterFont(),
                          color: 'rgba(0,0,0,0.45)',
                          padding: [10, 0]
                      },
                      val: {
                          fontSize: getAdapterFontBold(),
                          fontWeight: 'bold',
                          color: '#222222',
                      }
                  }
              }
          }],
          series: [{
            name:name,
            type:'pie',
            radius: ['45%', '60%'],
            center:['50%','50%'],
            avoidLabelOverlap: true,
            hoverAnimation: false,
            label: {
              normal: {       
                show: false,                             
              }
            },
            data:options,
            itemStyle:{
              color: function(params) {
                var colorList = ['#EF8380','rgba(0,0,0,0.04)'];
                return colorList[params.dataIndex]
              },
            },
          }
        ]});
      },
      histogram(options,title,chartId){
        //单维柱状图封装
        let histogram = echarts.init(document.getElementById(chartId));
        this.longCharts = histogram;
        window.addEventListener("resize",function(){histogram.resize()});
        histogram.setOption({
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow',
                  show: false
              },
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(0,0,0,0.12)',
              borderWidth: 2,
              extraCssText: '#81ACF4',
              formatter: function(datas) {
                  let res = '<p style="color:#999;padding:0 5px;font-size: 14px;">'+datas[0].axisValue+'</p>';
                  for(var i in datas) {
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">人数：' +datas[i].value+'</p>';
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">占比：' +datas[i].data.value2+'%</p>';
                  }
                  return res
              }
          },
          grid: {
            top:'10%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: title,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#DDDDDD",
                width: 1,
                type: "solid"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                  fontSize:getAdapterFont(),
                  color: '#666'
                },
                // formatter: '{value}',
                formatter:function(val) {
                  if(title.length>8){
                    var strs = val.split(''); //字符串数组
                    var str = ''
                    for(var i = 0, s; s = strs[i++];) { //遍历字符串数组
                      str += s;
                      if(!(i % 2)) str += '\n'; //按需要求余
                    }
                    return str
                  }else{
                    return val
                  } 
                },
              },
            }],
            yAxis: [{
              type: 'value',
              show: true,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                textStyle: {
                  fontSize: 12,
                  color: '#333'
                },
                formatter: '{value}',
              },
              splitLine: {
                lineStyle:{
                  color: '#EEEEEE'
                }
              }
            }],
            series: [{
              name: '',
              type: 'bar',
              barWidth: '36px',
              data: options,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: 'top', //在上方显示
                    textStyle: { //数值样式
                      color: '#666',
                      fontSize: 16
                    }
                  },
                  color: '#6395FA',
                }
              },
            }]
          }); 
      },
      histogram2(options,titleArr,chartId){
        //单维柱状图封装
        let histogram = echarts.init(document.getElementById(chartId));
        window.addEventListener("resize",function(){histogram.resize()});
        let data = options
        histogram.setOption({
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow',
                  show: false
              },
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(0,0,0,0.12)',
              borderWidth: 2,
              extraCssText: '#81ACF4',
              formatter: function(datas) {
                  let res = '<p style="color:#999;padding:0 5px;font-size: 14px;">'+datas[0].axisValue+'</p>';
                  for(var i in datas) {
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">人数：' +datas[i].value+'</p>';
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">占比：' +datas[i].data.value2+'%</p>';
                  }
                  return res
              }
          },
          grid: [
              {
                  top: '7%',
                  left: '7%',
                  right: '4%',
                  bottom: '8%',
              },
              {
                  height: 0,
                  bottom: 0
              }
          ],
          xAxis: [{
              type: 'category',
              data: titleArr,
              gridIndex: 0,
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#DDDDDD",
                  width: 1,
                  type: "solid"
                }
              },
              axisTick: {
                show: false
              },
            axisLabel: {
                show: true,
                textStyle: {
                  fontSize:getAdapterFont(),
                  color: '#666'
                }
            }
          }, {
              type: 'category',
              gridIndex: 1,
              axisLine: {
                  show: false
              }
          }],
          yAxis: [{
              type: 'value',
              gridIndex: 0,
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
              splitLine: {
                lineStyle:{
                  color: '#EEEEEE'
                }
              }
          },{
              type: 'value',
              gridIndex: 1,
              axisLabel: {
                  show: false
              },
              axisLine: {
                  show: false
              },
              splitLine: {
                  show: false
              },
              axisTick: {
                  show: false
              }
          }],
          series: [{
              data: data,
              itemStyle: {
                  normal: {
                      color: function(params) {
                          var colorList = [
                            '#6395FA','#4ECACE','#AB92EB','#FFB16D','#EF8380'
                          ];
                          return colorList[params.dataIndex]
                      }
                  }
              },
              type: 'bar',
              barWidth:36,
              label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                      color: '#666',
                      fontSize: 16
                  }
              },
              xAxisIndex: 0,
              yAxisIndex: 0
          },
          // {
          //     data: [{
          //         name: '轻',
          //         value: 1
          //     }],
          //     label: {
          //         show: true,
          //         position: 'inside',
          //         formatter: '{b}',
          //         offset: [0, 10],
          //         textStyle: {
          //             color: '#000'
          //         }
          //     },
          //     type: 'bar',
          //     barGap: 0,
          //     barWidth: '40%',
          //     itemStyle: {
          //         normal: {
          //             color: 'rgba(255,255,255, 0)'
          //         }
          //     },
          //     xAxisIndex: 1,
          //     yAxisIndex: 1
          // },{
          //     data: [{
          //         name: '中',
          //         value: 1
          //     }],
          //     label: {
          //         show: true,
          //         position: 'inside',
          //         formatter: '{b}',
          //         offset: [0, 10],
          //         textStyle: {
          //             color: '#000'
          //         }
          //     },
          //     type: 'bar',
          //     barGap: 0,
          //     barWidth: '20%',
          //     itemStyle: {
          //         normal: {
          //             color: 'rgba(255,255,255, 0)'
          //         }
          //     },
          //     xAxisIndex: 1,
          //     yAxisIndex: 1
          // },{
          //     data: [{
          //         name: '重',
          //         value: 1
          //     }],
          //     label: {
          //         show: true,
          //         formatter: '{b}',
          //         offset: [0, 10],
          //         textStyle: {
          //             color: '#000'
          //         }
          //     },
          //     type: 'bar',
          //     barGap: 0,
          //     barWidth: '40%',
          //     itemStyle: {
          //         normal: {
          //             color: 'rgba(255,255,255, 0)'
          //         }
          //     },
          //     xAxisIndex: 1,
          //     yAxisIndex: 1
          // }
          ]
          }); 
      }
    },
    components:{
      echartsNull
    }
	};
</script>
<style scoped>
  .right-menu{
    display: flex;
    flex-direction: row;
  }
  .right-menu .el-button-group{
    margin: 0 0 0 10px;
  }
  .in-out-summer .title {
    text-align: center;
    font-size: 18px;
    font-weight: 550;
    height: 4vh;
    line-height: 4vh;
  }
	.dashContainer .el-card__body {
		padding: 20px;
    }
    .box-card >>> .el-card__header{
        font-size: 18px;
        font-weight: 550;
        border:none!important;
    }
    .header-box{
      display: flex;
      justify-content: space-between;
    }
    .chartTop {
        height:24px;
        font-size:16px;
        color:rgba(34,34,34,0.65);
        font-weight:400;
    }
    .echarts-box{
      display: flex;
    }
    .echarts-div{
      display: flex;
      flex-direction: column;
      width: 280px;
      align-items: center;
      position: relative;
    }
    .echarts-div span{
      position: absolute;
      bottom: 20px;
      width:auto;
      height:22px;
      font-size:16px;
      font-weight:400;
      color:rgba(0,0,0,0.65);
      line-height:22px;
    }
</style>
<style >
.week-picker {
    border: 1px solid #449efb;
}

    .no-border /deep/.el-card__header{
      border: none!important;
    }
</style>