<template>
  <div class="page">
    <h2 class="title">功能独立性评估表</h2>
    <table cellspacing="0" cellpadding="0" class="table">
      <tr><td width="15%">姓名</td><td width="25%">{{elderData.baseInfo.elderName}}</td><td width="10%">性别</td><td width="15%">{{elderData.baseInfo.gender}}</td><td width="15%">出生年月</td><td width="20%">{{elderData.baseInfo.birthDay | dateFormat}}</td></tr>
      <tr><td>入住日期</td><td>{{elderData.baseInfo.checkinDate | dateFormat}}</td><td>住院号</td><td>{{elderData.baseInfo.checkinNo}}</td><td>护理等级</td><td>{{elderData.baseInfo.nursingLevel | levelFilter}}</td></tr>
      <tr><td>部门</td><td>福利院</td><td>室号</td><td>{{elderData.baseInfo.roomName}}</td><td>床号</td><td>{{elderData.baseInfo.bedName}}</td></tr>
      <tr><td rowspan="2">评测内容</td><td colspan="5" style="text-align:center;">记分</td></tr>
      <tr><td >入院时</td><td colspan="4">入院时(评分)</td></tr>

      <tr><td rowspan="6">A.自理</td><td>1.进食</td><td  colspan="4">{{judge[0]}}</td></tr>
      <tr><td>2.修饰</td><td  colspan="4">{{judge[1]}}</td></tr>
      <tr><td>3.洗澡</td><td  colspan="4">{{judge[2]}}</td></tr>
      <tr><td>4.穿上衣</td><td  colspan="4">{{judge[3]}}</td></tr>
      <tr><td>5.穿下衣</td><td  colspan="4">{{judge[4]}}</td></tr>
      <tr><td>6.如厕</td><td  colspan="4">{{judge[5]}}</td></tr>

      <tr><td rowspan="2">B.括约肌控制</td><td>7.排便管理</td><td  colspan="4">{{judge[6]}}</td></tr>
      <tr><td>8.排尿管理</td><td  colspan="4">{{judge[7]}}</td></tr>

      <tr><td rowspan="3">C.转移</td><td>9.床椅转移</td><td  colspan="4">{{judge[8]}}</td></tr>
      <tr><td>10.卫生间</td><td  colspan="4">{{judge[9]}}</td></tr>
      <tr><td>11.浴池/浴室</td><td  colspan="4">{{judge[10]}}</td></tr>

      <tr><td rowspan="2">D.步行</td><td>12.步行/轮椅</td><td  colspan="4">{{judge[11]}}</td></tr>
      <tr><td>13.上下楼梯</td><td  colspan="4">{{judge[12]}}</td></tr>

      <tr><td rowspan="2">E.交流 </td><td>14.试听理解</td><td  colspan="4">{{judge[13]}}</td></tr>
      <tr><td>15.语言表达</td><td  colspan="4">{{judge[14]}}</td></tr>

      <tr><td rowspan="3">F.社会认知 </td><td>16.社会往来</td><td  colspan="4">{{judge[15]}}</td></tr>
      <tr><td>17.解决问题</td><td  colspan="4">{{judge[16]}}</td></tr>
      <tr><td>18.记忆能力</td><td  colspan="4">{{judge[17]}}</td></tr>

      <tr><td colspan="6">总分 ：{{judgeAll}}</td></tr>
    </table>
  </div>
</template>
<script>
  export default {
    props: {
      elderData: {
        type: Object,
        default() {
          return {
            elderId: "",
            baseInfo: {}, //基础信息和入住管理的数据
            familyData: {}, //家属信息
            healthInfo: {}, //健康状况
          };
        }
      }
    },
    data() {
      return {
        judge: [],
        judgeAll: 0, //总分
        smallCategory: ["进食","修饰","洗澡","穿上衣","穿下衣","如厕","排便管理","排尿管理",
        "床椅转移","卫生间","浴池浴室","步行/轮椅","上下楼梯","视听理解","语言表达","社会往来",
        "解决问题","记忆能力"]
      }
    },
    created(){
      this.assembleData();
    },
    methods:{
      //处理数据
      assembleData(){
        this.functionAssess();
      },
      //功能性评估
      functionAssess(){
        let data = {
          elderId: this.elderData.elderId
        };
        axios.fetch('elderServer', '/elderNursing/all', data).then(res => {
          this.initAssemble(res.data);
        });
      },
      //组装初始化的数据
      initAssemble(data){
        let array = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        for(let i=0; i<this.smallCategory.length; i++){
          for(let j=0; j<data.length; j++){
            if(data[j].itemType==="功能性评估"){
              if(this.smallCategory[i]===data[j].itemName){
                array[i] = data[j].itemValue;
              }
            }
          }
        }
        this.judge = array;
        this.judgeAll = array.reduce((sum,number)=>{return sum + number;},0);
      }
    },
    filters: {
      dateFormat: date => {
        if(date) {
          date = date.split('-')[0]+'年'+date.split('-')[1]+'月'+date.split('-')[2]+'日';
        }else {
          date = "";
        }
        return date;
      },
      //院方护理等级
      levelFilter: val => {
				if(val == 0) {
					val = "无护理";
				} else if(val == 1) {
					val = "护理一级";
				} else if(val == 2) {
					val = "护理二级";
				} else if(val == 3) {
					val = "护理三级";
				} else if(val == 4) {
					val = "护理四级";
				} else if(val == 5) {
					val = "护理五级";
				}else if(val == 6) {
					val = "护理六级";
				}
				return val;
			},
    }
  }
</script>

<style lang="less" scoped>
  /deep/ table {
    .el-checkbox__inner::after {
      border: 1px solid black;
      height: 8px;
      left: 6px;
    }
    .el-checkbox__label {
      width: 18px;
      height: 18px;
    }
    .el-checkbox__input+.el-checkbox__label {
      color: black;
      font-size: 16px;
    }
    .el-checkbox__input .el-checkbox__inner, 
    .el-checkbox__input .el-checkbox__inner{
      background-color: #fff;
      border-color: black;
    }
  }
  table{
    tr{
      td{
        padding:7px 10px !important;
      }
    }
  }
</style>