<template>
  <div class="padding-content">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card" style="position: relative;">
          <div slot="header" class="clearfix"><span>性别占比</span></div>
          <div class="barSex" id="pieSex" style="width:100%; height:30vh;position: relative;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>年龄分布</span></div>
          <div class="columnType" id="pieAge" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>学历比例</span></div>
          <div class="levelHuLi" id="pieEducation" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
        <!-- <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>员工数量</span></div>
          <div class="chartTop">员工总数：{{staffAll}}</div>
          <div class="addressChart" id="columnStaff" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col> -->
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>聘用方式</span></div>
          <div class="columnType" id="pieEmployee" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>缴金情况</span></div>
          <div class="columnType" id="piePay" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>医务分布</span></div>
          <div class="levelHuLi" id="pieMedicalStaff" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>近一年人员流动率</span></div>
          <div class="levelHuLi" id="columnStaffFlow" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col> -->
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>部门组成</span></div>
          <div class="levelHuLi" id="component" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>员工持证</span></div>
          <div class="levelHuLi" id="columnStaffCert" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>工龄分布</span></div>
          <div class="levelHuLi" id="columnWorkAge" style="width:100%; height:30vh;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
    </el-row>
  </div>
</template>
<script>
	import axios from "axios";
  import echarts from 'echarts';
  import {getAdapterFont} from '../../../settings/echarts';
	export default {
		data() {
			return {
				/*初始化数据*/
          initDatas: [],
          /*性别比例*/
          allNum: 0,  
          staffAll: '',//总员工数
          chartColorArr: {
            sexColor: ['#EF8380','#6395FA'],
            ageColor: ['#3BCD87','#6395FA','#A88FE8','#FFB16D'],
            employeeColor: ['#AB92EB','#4ECACE','#FFB16D'],
            payColor: ['#AB92EB','#FFB16D','#4ECACE'],
            medicalStaffColor: ['#AD8CD3','#6395FA','#FFB16D','#F1B179','#75CFE6','#E98CB9'],
            educationColor: ['#6293F8','#3CCE88','#AA91EA','#FFB16D','#4ECACE']
          }
			}
		},
		mounted() {
            this.initData();  
            // this.initLatest();
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
            groups: '员工数据'
        }
        axios
        .fetch('statServer', "/stat/getStatResultsByGroups", data)
        .then(res => {
          that.getItemData(res.data);
        });
      },
      getItemData(data){
        //获得对应数据类型的数据
        let sex = data.filter(item=>{return item.dataType==='性别占比' && item.title === '性别占比'});
        let staff = data.filter(item=>{return item.dataType==='员工数量'});
        this.staffAll = staff.filter(item=>{return item.title==='员工总数'})[0].itemValue;
        staff.splice(staff.findIndex(item => item.title === '员工总数'), 1);
        let age = data.filter(item=>{return item.dataType==='年龄分布' && item.title === '年龄分布'});
        let employee = data.filter(item=>{return item.dataType==='聘用方式' && item.title === '聘用方式'});
        let staffCert = data.filter(item=>{return (item.dataType==='员工持证数量' && item.title === '员工持证数量') || item.title === '无证书'});
        let componentData = data.filter(item=>{return item.dataType==='部门组成' && item.title === '部门组成'});
        let workAge = data.filter(item=>{return item.dataType==='工龄分布' && item.title === '工龄分布'});
        let pay = data.filter(item=>{return item.dataType==='缴金情况' && item.title === '缴金情况'});
        let medicalStaff = data.filter(item=>{return item.dataType==='医务人员占比' && item.title === '医务人员占比'});
        let education = data.filter(item=>{return item.dataType==='学历比例' && item.title === '学历比例'});
        console.log(sex)
        this.baseAnnulusSex('性别占比',sex,this.chartColorArr.sexColor,'pieSex');  
        this.baseAnnulus('年龄分布',age,this.chartColorArr.ageColor,'pieAge');   
        this.basePie('聘用方式',employee,this.chartColorArr.employeeColor,'pieEmployee');  
        this.basePie('缴金情况',pay,this.chartColorArr.payColor,'piePay');
        this.basePie('医务人员占比',medicalStaff,this.chartColorArr.medicalStaffColor,'pieMedicalStaff');
        this.baseAnnulus('学历比例',education,this.chartColorArr.educationColor,'pieEducation');
        // this.singleColumn(staff,'columnStaff');
        this.singleColumn(staffCert,'columnStaffCert');
        this.singleColumn(componentData,'component');
        this.singleColumn(workAge,'columnWorkAge');
      },
      initLatest(){
        //初始化拿到最近的统计结果
        let that = this;
        let data = {
          category: '员工情况',
          dataType: '近一年人员流动率',
          size: 24
        }
        axios
        .fetch('statServer', "/stat/getStatResultsByRecently", data)
        .then(res => {
          let staffFlow = res.data.filter(item=>{return item.dataType==='近一年人员流动率'});
          // that.singleLineColumn(staffFlow,'columnStaffFlow');
        });
      },
      //对应图形的数据提取
      baseAnnulusSex(name,data,chartColor,chartId){
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
        
        this.annulusSex(name,genderNum,chartColor,chartId, total);
      },
      //对应图形的数据提取
      baseAnnulus(name,data,chartColor,chartId){
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
        
        this.annulus(name,genderNum,chartColor,chartId);
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
        // let title = data.map(v=>v.title);
        // let itemValue = data.map(v=>v.itemValue);
        // let options = [title,itemValue];

        this.histogram(options,title,chartId);
      },
      singleLineColumn(data,chartId){
        let monthArr = this.getMonth();
        monthArr = monthArr.reverse();
        let ByMonth = Number(monthArr[0].split('-').join(''));
        let entryInit = data.filter(v=>v.title==='入职'&&(Number(v.issueValue)>ByMonth||Number(v.issueValue)===ByMonth));
        let leaveOfficeInit = data.filter(v=>v.title==='离职'&&(Number(v.issueValue)>ByMonth||Number(v.issueValue)===ByMonth));
        let entry = [0,0,0,0,0,0,0,0,0,0,0,0];
        let leaveOffice = [0,0,0,0,0,0,0,0,0,0,0,0];
        for(let i=0; i<monthArr.length; i++){
          for(let j=0; j<entryInit.length; j++){
            let month = Number(monthArr[i].split('-').join(''));
            if(month === Number(entryInit[j].issueValue)){
              entry[i] = entryInit[j].itemValue
            }
          }
        }
        for(let i=0; i<monthArr.length; i++){
          for(let j=0; j<leaveOfficeInit.length; j++){
            let month = Number(monthArr[i].split('-').join(''));
            if(month === Number(leaveOfficeInit[j].issueValue)){
              leaveOffice[i] = leaveOfficeInit[j].itemValue
            }
          }
        }
        let options = [monthArr,entry,leaveOffice];

        this.histogramLine(options,chartId);
      },
      getMonth(){
        //获取当前月份前12个月
        let dataArr = [];
        let data = new Date();
        let year = data.getFullYear();
        data.setMonth(data.getMonth()+1, 1)
        for (let i = 0; i < 12; i++) {
          data.setMonth(data.getMonth() - 1);
          let m = data.getMonth() + 1;
          m = m < 10 ? "0" + m : m;
          dataArr.push(data.getFullYear() + "-" + (m))
        }
        return dataArr;
      },
      //chart图封装
      annulusSex(name,options,chartColor,chartId,total){
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
                  let res = '<p style="color:#999;padding:0 5px;font-size: 14px;">' +data.name+'</p>';
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">人数：' +data.value+'</p>';
                      res+='<p style="color:#000;padding:0 5px;font-size: 14px;">占比：' +data.data.value2+'%</p>';
                  return res
              }
          },
          grid: {
              right: '20%'
          },
          title: [{
              text: '{val|'+total+'}\n{name|员工总数}',
              top: 'center',
              left: 'center',
              textStyle: {
                  rich: {
                      name: {
                          fontSize: 14,
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
              color: '#666'
            },
            data:options,
          },
          series: [{
            name:name,
            type:'pie',
            radius: ['45%', '60%'],
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
      //chart图封装
      annulus(name,options,chartColor,chartId){
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
              color: '#666'
            },
            data:options,
          },
          series: [{
            name:name,
            type:'pie',
            radius: ['45%', '60%'],
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
              color: '#666'
            },
            data:options,
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
      histogram(options,title,chartId){
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
                color: '#333',
                fontSize: getAdapterFont()
              },
              formatter: '{value}',
              interval: 0
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
      histogramLine(options,chartId){
        //单维柱状图折线图封装
        let histogramLineItem = echarts.init(document.getElementById(chartId));
        window.addEventListener("resize",function(){histogramLineItem.resize()})
        histogramLineItem.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            orient: 'horizontal',
            x: 'center', 
            y: 'bottom',
            icon:'circle',
            itemGap: 50,
            data:['入职','离职']
          },
          xAxis: [{
            type: 'category',
            data: options[0],
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
            splitLine: {
              lineStyle:{
                color: '#EEEEEE'
              }
            }
          }],
          series: [{
            name: '入职',
            type: 'bar',
            barWidth: '36px',
            data: options[1],
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
          },
          {
            name:'离职',
            type:'line',
            itemStyle : {  /*设置折线颜色*/
              normal : {
                  color:'#6ED897'
              }
            },
            data: options[2],
          }]
        });
      }
		},
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
        font-weight:550;
    }
</style>