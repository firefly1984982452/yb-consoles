<template>
  <div class="padding-content">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card" style="position: relative;">
          <div slot="header" class="clearfix"><span>户籍占比</span></div>
          <div class="barSex" id="pieHuji" style="width:100%; height:30vh;position: relative;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>年龄分布</span></div>
          <div class="addressChart" id="pieAge" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>学历比例</span></div>
          <div class="columnType" id="pieEducation" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>护工持证</span></div>
          <!-- <div class="chartTop">护理员总数：{{staffCertAll}}</div> -->
          <div class="levelHuLi" id="columnStaffCert" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>工龄分布</span></div>
          <!-- <div style="height:20px;"></div> -->
          <div class="columnType" id="columnWorkAge" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card no-border">
          <div slot="header" class="clearfix"><span>&nbsp;</span></div>
          <echarts-null />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
	import axios from "axios";
  import echarts from 'echarts';
  import echartsNull from '@/components/echarts-null';
  import {getAdapterFont} from '../../../settings/echarts';
	export default {
		data() {
			return {
        /*初始化数据*/
        initDatas: [],
        /*性别比例*/
        allNum: 0,   
        staffCertAll: '',
        chartColorArr: {
          hujiColor: ['#FFB16D','#6395FA'],
          ageColor: ['#FFB16D','#DF8B8E','#8F8BDF','#6395FA'],
          educationColor: ['#6293F8','#AA91EA','#FFB16D','#4ECACE']
        }
			}
		},
		mounted() { 
      this.initData();
		},
		methods: {
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
            groups: '护理员数据'
        }
        axios
				.fetch('statServer', "/stat/getStatResultsByGroups", data)
				.then(res => {
					that.getItemData(res.data);
				});
      },
      getItemData(data){
        //获得对应数据类型的数据   
        let huji = data.filter(item=>{return item.dataType==='户籍占比' && item.title === '户籍占比'});
        let age = data.filter(item=>{return item.dataType==='年龄分布' && item.title === '年龄分布'});
        let education = data.filter(item=>{return item.dataType==='学历比例' && item.title === '学历比例'});
        let staffCert = data.filter(item=>{return (item.dataType==='护理员持证人数' && item.title === '护理员持证人数') || item.title === '无证书'});
        // this.staffCertAll = staffCert.filter(item=>{return item.title==='护理员总数'})[0].itemValue;
        // staffCert.splice(staffCert.findIndex(item => item.title === '护理员总数'), 1);
        let workAge = data.filter(item=>{return item.dataType==='工龄分布' && item.title === '工龄分布'});

        this.baseAnnulus('户籍占比',huji,this.chartColorArr.hujiColor,'pieHuji');  
        this.basePie('年龄分布',age,this.chartColorArr.ageColor,'pieAge');  
        this.basePie('学历比例',education,this.chartColorArr.educationColor,'pieEducation');
        this.singleColumn(staffCert,'columnStaffCert');
        this.singleColumn(workAge,'columnWorkAge');
      },
      baseAnnulus(name,data,chartColor,chartId){
        // data = data.filter(item => item.itemValue != 0);	
        data = data.sort(this.compare('dispIndex'));
        let total = 0;
        data.forEach(element => {
            total += element.itemValue;
        });
        let genderNum = data.map(v=>{
          return{
            value: v.itemValue,
            name: v.stringValue,
            value2: parseFloat((v.itemValue2*100).toFixed(2)),
            labelLine: {
              normal: {
                show: v.itemValue===0?false:true,
                lineStyle: {
                  color: '#333'
                }
              },
              emphasis: {
                show: v.itemValue===0?false:true
              }
            },
            label: {
              normal: {
                show: v.itemValue===0?false:true,
                formatter: '{b|{b}}\n {d|{d}%}',
                rich:{
                  b: {
                    lineHeight: 20,
                    fontSize: getAdapterFont(),
                    fontWeight: '400',
                    color: '#666'
                  },
                  d: {
                    lineHeight: 20,
                    fontSize: getAdapterFont(),
                    fontWeight: '400',
                    color: '#666'
                  }
                }
              },
              emphasis: {
                show: v.itemValue===0?false:true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
            }      
          }
        })
        let allNumArr = data.map(v=>v.itemValue)
        
        this.annulus(name,genderNum,chartColor,chartId,total);
      },
      basePie(name,data,chartColor,chartId){		
        // data = data.filter(item => item.itemValue != 0);
        data = data.sort(this.compare('dispIndex'));				
        let genderNum = data.map(v=>{
          return{
            value: v.itemValue,
            name: v.stringValue,
            value2: parseFloat((v.itemValue2*100).toFixed(2)),
            labelLine: {
                normal: {
                    show: v.itemValue===0?false:true,
                    lineStyle: {
                        color: '#333'
                    }
                },
                emphasis: {
                    show: v.itemValue===0?false:true
                }
            },
            label: {
              normal: {
                show: v.itemValue===0?false:true,
                formatter: '{b|{b}}\n {d|{d}%}',
                rich:{
                  b: {
                    lineHeight: 20,
                    fontSize: getAdapterFont(),
                    fontWeight: '400',
                    color: '#666'
                  },
                  d: {
                    lineHeight: 20,
                    fontSize: getAdapterFont(),
                    fontWeight: '400',
                    color: '#666'
                  }
                }
              },
              emphasis: {
                show: v.itemValue===0?false:true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
            }      
          }
        })
        let allNumArr = data.map(v=>v.itemValue)

        this.pie(name,genderNum,chartColor,chartId);
      },
      singleColumn(data,chartId){
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
      annulus(name,options,chartColor,chartId,total){
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
                console.log(data)
                  let res = '<p style="color:#999;padding:0 5px;font-size: 14px;">' +data.name+'</p>';
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">人数：' +data.value+'</p>';
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">占比：' +data.data.value2+'%</p>';
                  return res
              }
          },
          title: [{
              text: '{val|'+total+'}\n{name|护工总数}',
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
                          fontSize: 22,
                          fontWeight: 'bold',
                          color: '#222222',
                      }
                  }
              }
          }],
          legend: {
            right: 0,
            top: 0,
            orient: 'vertical',
            icon:'circle',
            textStyle: {
              fontSize: getAdapterFont(),
              color: '#000'
            },
            data:options
          },
          series: [{
            name:name,
            type:'pie',
            radius: ['45%', '60%'],
          //  center: ['40%', '50%'],
            avoidLabelOverlap: true,
              itemStyle:{
                normal:{
                  label:{
                    show:true,
                    textStyle:{color:'#3c4858',fontSize:"18"},
                  },
                  color: function(params) {
                    var colorList = chartColor;
                    return colorList[params.dataIndex]
                  },
                }
              },
              data:options
            }
          ]
        });
      },
      pie(name,options,chartColor,chartId){
        //饼形图封装
        let pieItem = echarts.init(document.getElementById(chartId));
        window.addEventListener("resize",function(){pieItem.resize()})
        pieItem.setOption({
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
                  let res = '<p style="color:#999;padding:0 5px;font-size: 14px;">' +data.name+'</p>';
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">人数：' +data.value+'</p>';
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">占比：' +data.data.value2+'%</p>';
                  return res
              }
          },
          legend: {
            right: 0,
            top: 0,
            orient: 'vertical',
            icon:'circle',
            textStyle: {
              fontSize: getAdapterFont(),
              color: '#000'
            },
            data:options
          },
          grid: {
            width: '100',
            height: '50',
            right: '14%',
            bottom: '3%',
            containLabel: true
          },
          series: [{
            name:name,
            type:'pie',
            radius: '60%',
            center: ['40%', '50%'],
            avoidLabelOverlap: true,
            itemStyle:{
              normal:{
                label:{
                  show:true,
                  textStyle:{color:'#3c4858',fontSize:"18"},
                },
                color: function(params) {
                  var colorList = chartColor;
                  return colorList[params.dataIndex]
                },
              }
            },
            data:options
          }
        ]});
      },
      histogram(options,title, chartId){
        //单维柱状图封装
        let histogramItem = echarts.init(document.getElementById(chartId));
        window.addEventListener("resize",function(){histogramItem.resize()})
        histogramItem.setOption({
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
            top:'7%',
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
                color: '#666'
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
                color: '#666'
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
		},
    components:{
      echartsNull
    }
	};
</script>
<style scoped>
	.dashContainer .el-card__body {
		padding: 20px;
  }
  .box-card >>> .el-card__header{
    font-size: 18px;
    font-weight: 550;
    border:none!important;
  }
  .chartTop {
    text-align:right;
    padding-right:5%;
    height:20px;
    font-size:18px;
    color:#333;
    font-weight:600;
  }
</style>
<style >

    .no-border /deep/.el-card__header{
      border: none!important;
    }
</style>