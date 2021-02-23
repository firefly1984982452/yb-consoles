<template>
  <div class="padding-content">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header"><span>费用占比</span></div>
          <div class="chart" ref="allBeds"></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header"><span>结算统计</span></div>
          <div class="chart" ref="floorBeds"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import echarts from "echarts";

export default {
  data() {
    return {
      dataset: {
        source: []
      }
    }
  },
  mounted() {
    axios.fetch('statServer', '/stat/getStatResultsByCategories', { categories: '床位数据' }).then(res => {
      this.showAllBeds(res.data);
      this.showFloorBeds(res.data);
    });
  },
  methods: {
    showAllBeds(dataList) {
      let list = [];
      let totalBeds = 0;
      dataList.forEach(element => {
        if(element.dataType == "床位统计") {
          let name = element.title;
          let value = element.itemValue;
          if(name == '总床位') {
            totalBeds = value;
          } else {
            list.push({ name, value });
          }
        }
      });
      let chart = echarts.init(this.$refs.allBeds);
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function(a) {
            // "{a} <br/>{b}: {c} ({d}%)"
            return a.seriesName + " <br />" + a.name + ": " + a.data.value + " (" + a.percent + "%)"
          }
        },
        legend: {
          orient: 'vertical',
          right:30,
          bottom:'30%',
          icon:'circle',
          align:'left',
          textStyle: {
            fontSize: '14',
            fontWeight: '550',
            color: '#333'
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
            fontSize: 36,
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
            // radius: ['45%', '70%'],
            center:['50%','50%'],
            dimensions: ['name', 'value'],
            avoidLabelOverlap: false,
            label: {
              normal: {                                 
                formatter: a => a.data.value,
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
            itemStyle:{
              color: function(params) {
                // build a color map as your need.
                var colorList = [
                    '#DF8B8E','#70AFEA','#F4BB89'
                ];
                return colorList[params.dataIndex]
              },
            },
        }]
      };
      chart.setOption(option);
    },
    showFloorBeds(dataList) {
      let list = [];
      let data = {};
      dataList.forEach(element => {
        if(element.title == "使用情况") {
          let name = element.stringValue;
          let item = data[name];
          if(!item) {
            data[name] = item = { name: name, '入住': 0, '空闲': 0 };
            list.push(item);
          }
          item[element.stringValue1] = element.itemValue;
        }
      });

      let chart = echarts.init(this.$refs.floorBeds);
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        dataset: { source: list },
        legend: {
          icon: "circle",
          bottom: 0
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
          name: '床位数量',
          nameRotate: 90,
          nameTextStyle: {
            'color': '#333',
            'fontSize': 13,
            'padding': [13, 4, 100, -180]
          },
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
              color: '#70AFEA',
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
              color: '#CCCCCC',
            }
          },
          dimensions: ['name', '空闲']
        }]
      };
      chart.setOption(option);
    }
  }
}
</script>

<style scoped>
.chart {
  width:100%; height:30vh;
}
.box-card >>> .el-card__header {
	font-size: 18px;
	font-weight: 550;
  border:none!important;
}
</style>