<template>
  <div class="padding-content">
    <bed-list @currentBuilding="getCurrentBuilding"/>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header"><span>床位统计</span></div>
          <div class="chart" ref="allBeds" style="width:100%; height:30vh;position: relative;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="header-box">
            <span>楼层统计</span>
            <right-echarts-info :list="elderHomeCommunityist"></right-echarts-info>
          </div>
          <div class="chart" ref="floorBeds" style="width:100%; height:30vh;position: relative;"></div>
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
import echarts from "echarts";
import echartsNull from '@/components/echarts-null';
import bedList from '@/components/bed-list';
import {getAdapterFont,getAdapterFontBold} from '../../../settings/echarts';

export default {
  data() {
    return {
      elderHomeCommunityist: [{
          title:'已入住',
          style: 'background:#6395FA'
      },{
          title:'空床位',
          style: 'background:#EF8380'
      }],
      dataset: {
        source: []
      },
      currentBuildingId: '',
    }
  },
  watch:{
    currentBuildingId(val){
      this.getData();
      this.getCurrentBuilding(val);
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData(){
      axios.fetch('statServer', '/stat/getStatResultsByCategories', { categories: '床位数据' }).then(res => {
        this.showAllBeds(res.data);
        this.showFloorBeds(res.data.filter(val => {return val.title == "使用情况" && val.issueValue == this.currentBuildingId}));
      });
    },
    getCurrentBuilding(val){
      this.currentBuildingId = val;
    },
    numberConvertToUppercase(num) {
      num = Number(num);
      var upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
      var length = String(num).length;
      if (length == 1) {
        return upperCaseNumber[num];
      } else if (length == 2) {
        if (num == 10) {
          return upperCaseNumber[num];
        } else if (num > 10 && num < 20) {
          return '十' + upperCaseNumber[String(num).charAt(1)];
        } else {
          return upperCaseNumber[String(num).charAt(0)] + '十' + upperCaseNumber[String(num).charAt(1)].replace('零', '');
        }
      }
    },
    showAllBeds(dataList) {
      let list = [];
      let totalBeds = 0;
      dataList.forEach(element => {
        if(element.dataType == "床位统计" && element.title === '床位统计' && element.issueValue == this.currentBuildingId) {
          let name = element.stringValue+ ' ' + element.itemValue;
          let value = element.itemValue;
          totalBeds += value;
          list.push({ name, value });
        }
      });
      let chart = echarts.init(this.$refs.allBeds);
      let option = {
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
                    res+='<p style="color:#000;padding:0 5px;font-size: 14px;">人数：' +data.data.value+'</p>';
                    res+='<p style="color:#000;padding:0 5px;font-size: 14px;">占比：' +data.percent+'%</p>';
                return res
            }
        },
        legend: {
          orient: 'vertical',
            right: 0,
            top: 0,
          icon:'circle',
          align:'left',
          textStyle: {
            fontSize: getAdapterFont(),
            color: '#000'
          },
        },
        graphic: [{ //环形图中间添加文字
          type: 'text', //通过不同top值可以设置上下显示
          left: 'center',
          top: '44%',
          style: {　　　　　　　　　　　　　　　　
            text: totalBeds,
            textAlign: 'center',
            fill: '#333',　　　　　　　//文字的颜色
            width: 30,
            height: 30,
            fontSize: getAdapterFontBold(),
            color: "#4d4f5c",
            fontFamily: "Microsoft YaHei"
          }
        }, {
          type: 'text',
          left: 'center',
          top: '55%',
          style: {
            text: '总床位',
            textAlign: 'center',
            fill: '#333',
            width: 30,
            height: 30,
            fontSize: 12,
          }
        }],
        dataset: { source: list },
        series: [{
            name:'床位统计',
            type:'pie',
            radius: ['45%', '70%'],
            center:['50%','50%'],
            dimensions: ['name', 'value'],
            avoidLabelOverlap: false,
            label: {
              show: false
              // normal: {                                 
              //   formatter: a => a.data.value,
              //   position: 'inner'
              // },
              // emphasis: {
              //   show: true,
              //   textStyle: {
              //     fontSize: '30',
              //     fontWeight: 'bold'
              //   }
              // }
            },
            itemStyle:{
              color: function(params) {
                // build a color map as your need.
                var colorList = [
                    '#AA91EA','#EF8380','#F7A970','#6395FA', '#4ECACE'
                ];
                return colorList[params.dataIndex]
              },
            },
        }]
      };
      chart.setOption(option);
    },
    showFloorBeds(dataList) {
      let floorArr = []
      for (var i in dataList) {
        let floorIndex = floorArr.findIndex(val => val.name == dataList[i].stringValue);
        if( floorIndex == -1) {
          let item = {
            name: dataList[i].stringValue,
            data: [dataList[i]]
          }
          floorArr.push(item)
        } else {
          floorArr[floorIndex].data.push(dataList[i])
        }
      }
      for (var i in floorArr) {
        for(var j in floorArr[i].data){
          let typeName = floorArr[i].data[j].stringValue2;
          floorArr[i][typeName] = floorArr[i].data[j].itemValue || 0;
          floorArr[i][typeName+'百分比'] = parseFloat((floorArr[i].data[j].itemValue2*100).toFixed(2)) || 0
        }
      }

      let chart = echarts.init(this.$refs.floorBeds);
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',
            show: false
          },
          backgroundColor: '#FFFFFF',
          borderColor: 'rgba(0,0,0,0.12)',
          borderWidth: 2,
          extraCssText: '#81ACF4',
          formatter: function(datas) {
            let free1 = datas[0].value['空闲'] || 0;
            let free2 = datas[0].value['空闲百分比'] || 0;
            let has1 = datas[0].value['入住'] || 0;
            let has2 = datas[0].value['入住百分比'] || 0;
              let res = '<p style="color:#999;padding:0 5px;font-size: 14px;">'+datas[0].axisValue+'</p>';
                  res+='<p style="color:#000;padding:0 5px;font-size: 14px;">空床位：' +free1+'&nbsp;&nbsp;&nbsp;&nbsp;' +free2+'%</p>';
                  res+='<p style="color:#000;padding:0 5px;font-size: 14px;">已入住：' +has1+'&nbsp;&nbsp;&nbsp;&nbsp;' +has2+'%</p>';
              return res
          }
        },
        dataset: { source: floorArr },
        grid: {
          top:'7%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
        },
        series: [{
          name: '入住',
          type: 'bar',
          stack: "床",
          barWidth: '36',
          itemStyle: {
            normal: {
              color: '#6395FA',
              barBorderRadius: 0,
              label: {
                  show: true,
                  position: "inside",
                  formatter: function(p) {
                      return p.value['入住'];
                  }
              }
            }
          },
          dimensions: ['name', '入住']
        }, {
          name: '空闲',
          type: 'bar',
          stack: "床",
          barWidth: '36',
          itemStyle: {
            normal: {
              color: 'rgb(239, 131, 128)',
              barBorderRadius: 0,
              label: {
                  show: true,
                  position: "inside",
                  formatter: function(p) {
                      return p.value['空闲'];
                  }
              }
            }
          },
          dimensions: ['name', '空闲']
        }]
      };
      chart.setOption(option);
    }
  },
  components:{
    echartsNull,
    bedList
  }
}
</script>

<style scoped>
.chart {
  width:100%; height:30vh;
}
.header-box{
  display: flex;
  justify-content: space-between;
}
.box-card >>> .el-card__header {
	font-size: 18px;
	font-weight: 550;
  border:none!important;
}
.box-card >>> .el-card__body{
  padding: 0!important;
}
</style>
<style lang="less" scoped>
div,p,span{
  box-sizing: border-box;
}
.bed-detail{
  display: flex;
  .info{
    width:120px;
    height:166px;
    background:rgba(250,250,250,1);
    border-radius:5px;
    border:1px solid rgba(240,240,240,1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    margin: 0 16px 0 0;
    padding: 24px 20px;
    position: relative;
    i{
      position: absolute;
      right: 3px;
      top: 1px;
      width:23px;
      height:16px;
      background:#FA8C16;
      border-radius:1px;
      color: #fff;
      font-size:12px;
      line-height:16px;
      font-style: normal;
      text-align: center;
    }
    i.order{
      background: #0078D4;
    }
    img{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-self: center;
    }
    p{
      width:80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      height:24px;
      font-size:16px;
      font-weight:bold;
      color:rgba(0,0,0,0.85);
      line-height:24px;
      margin: 12px 0 0 0;
    }
    span{
      width:auto;
      text-align: center;
      height:22px;
      font-size:16px;
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height:22px;
      display: flex;
      align-self: center;
    }
  }
}
.bed-box{
  display: flex;
  flex-direction: column;
  .floor{
    display: flex;
    .floor-name-box{
      width:126px;
      min-height:88px;
      height:auto;
      background:rgba(255,255,255,1);
      border:1px solid rgba(220,223,230,1);
      border-right: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p{
        width:50px;
        text-align: center;
        height:33px;
        font-size:24px;
        font-weight:500;
        color:rgba(0,0,0,0.85);
        line-height:33px;
      }
      span{
        width:50px;
        height:20px;
        text-align: center;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        line-height:20px;
      }
    }
    .floor-bed-box{
      width: 1750px;
      display: flex;
      flex-wrap: wrap;
      .bed-box{
        .bed-info{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width:124.85px;
          height:88px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(238,238,238,1);
          position: relative;
          i{
            position: absolute;
            right: 3px;
            top: 1px;
            width:23px;
            height:16px;
            background:rgba(0,120,212,1);
            border-radius:1px;
            color: #fff;
            font-size:12px;
            line-height:16px;
            font-style: normal;
            text-align: center;
          }
          div{
            display: flex;
          }
          p{
            width:18px;
            height:24px;
            font-size:18px;
            font-weight:bold;
            color:rgba(0,0,0,0.65);
            line-height:24px;
          }
          span{
            width:auto;
            height:20px;
            font-size:14px;
            font-weight:400;
            color:rgba(0,0,0,0.65);
            line-height:20px;
            b{
              font-weight: normal;
            }
          }
        }
        .null-bed {
          background: #FFDBD7;
          p{
            color: #FF3333;
          }
        }
        .null-yellow {
          background: #FFE1B2;
          p{
            color: #FF910E;
          }

        }
      }
    }
  }
}
</style>