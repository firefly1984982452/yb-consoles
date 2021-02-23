<template>
  <div class="page">
    <h2 class="title">首次服务项目确认表</h2>
    <table cellspacing="0" cellpadding="0" class="table">
      <tr>
        <td width="15%">姓名</td>
        <td width="15%">{{elderData.baseInfo.elderName}}</td>
        <td width="12%">性别</td>
        <td width="14%">{{elderData.baseInfo.gender}}</td>
        <td width="21%">出生年月</td>
        <td width="23%">{{elderData.baseInfo.birthDay | dateFormat}}</td>
      </tr>
      <tr>
        <td>入住区域</td>
        <td>{{elderData.baseInfo.area}}</td>
        <td>床号</td>
        <td>{{elderData.baseInfo.bedName}}</td>
        <td colspan="2">
          照护等级&nbsp;{{elderData.baseInfo.nursingLevel | levelFilter}} 
          日期：{{elderData.baseInfo.checkinDate}}
        </td>
      </tr>
      <tr>
        <td>服务项目</td>
        <td colspan="4">服务内容</td>
        <td>合计</td>
      </tr>
      
      <tr v-for="(Item,Index) in nursingServiceArr" :key="Index">
          <td>{{Item.category}}</td>
          <td colspan="4">
            <span v-for="(item,index) in Item.content" :key="index" :span="6">
              <input type="checkbox" :checked="item.isDraw"/>{{item.itemNo}} {{item.itemTitle}}
              </span>
              <!-- <el-row style="margin-bottom: 0px;">
                  <el-col v-for="(item,index) in Item.content" :key="index" :span="6">
                      <el-checkbox v-model="item.isDraw">{{item.itemNo}} {{item.itemTitle}}</el-checkbox>
                  </el-col>
              </el-row> -->
          </td>
        <td>提供 {{Item.num}} 项服务</td>
      </tr>
      <tr>
        <td>约定服务</td>
        <td colspan="4">
          
        </td>
        <td></td>
      </tr>
      <tr class="qianming">
        <td colspan="3">
          <p v-if="!elderData.baseInfo.operatorSign">甲方代表签字: _________甲方盖章</p>
          <p v-else>甲方代表签字:<img style="width:80px;height:40px;" :src="elderData.baseInfo.operatorSign"> 甲方盖章</p>
          <p class="right">{{elderData.baseInfo.checkinDate}}</p>
        </td>
        <td colspan="3">
          <p v-if="!elderData.baseInfo.guarantorSign">乙方代表签字: _________乙方盖章</p>
          <p v-else>乙方代表签字:<img style="width:80px;height:40px;" :src="elderData.baseInfo.guarantorSign"> 乙方盖章</p>
          <p class="right">{{elderData.baseInfo.checkinDate}}</p>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <p>注：</p>
          <p>1.根据入住老年人的照护等级确定相应服务内容。</p>
          <p>2.“服务内容”一栏中确认内容后的“□”内打勾。</p>
          <p>3.“合计”一栏中“提供______项服务”内填写字母 </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
	import axios from "axios";
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
        efsEat: [],
			  efsBathing: [],
				efsDressing: [],
				efsTobathroom: [],
				efsMove: [],
				efsNursing: [],
				efsArrangement: [],
				efsMedication: [],
				efsDiet: [],
				efsWash: [],
				efsOther: [],
				efsEstimateTime: '',
        efsContractService: "",
        nursingIds: [],
        nursingServiceArr:[],
        itemTitles: ["进食","修饰洗浴","穿（脱）衣","如厕排泄","移动",
        "压疮护理","物品整理", "用药","膳食","洗涤","其他","约定服务","评估时间"]

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
        console.log(this.elderData)
        let data = {
          elderId: this.elderData.elderId
        };
        axios.fetch('elderServer', '/nursingService/elder', data).then(res => {
          this.init(res.data);
        });
      },
     //组装初始化的数据
      initAssemble(data){
        //itemName和remark
        let itemNames= ["","","","","","","","","","","","",""];
        for(let i=0; i<this.itemTitles.length; i++){
          for(let j=0; j<data.length; j++){  
            if(data[i].itemType==="首次服务项目"){
              this.nursingIds[i] = data[i].nursingId;
              if(this.itemTitles[i]===data[i].itemTitle&&(this.itemTitles[i]==="约定服务"||this.itemTitles[i]==="评估时间")){
                itemNames[i] = data[i].itemName;
              }else if(this.itemTitles[i]===data[i].itemTitle){
                itemNames[i] = data[i].itemName?data[i].itemName.split(","):[];
              }
            }
          }
        }
        this.efsEat = itemNames[0]; 
        this.efsBathing = itemNames[1];
        this.efsDressing = itemNames[2];
        this.efsTobathroom = itemNames[3];
        this.efsMove = itemNames[4];
        this.efsNursing = itemNames[5];
        this.efsArrangement = itemNames[6];
        this.efsMedication = itemNames[7];
        this.efsDiet = itemNames[8];
        this.efsWash = itemNames[9];
        this.efsOther = itemNames[10];
        this.efsContractService = itemNames[11];
        this.efsEstimateTime = itemNames[12];
      },
			// 根据对象中的属性进行去重
      filterArr(arr, name) {
          let hash = {};
          return arr.reduce((ss, item) => {// reduce累计器, ss是具体满足条件后返回的数据, item是数组依次循环的每一项
              hash[item[name]] ? '' : hash[item[name]] = true && ss.push(item);
              // 1、判断对象的键值是否存在
              return ss;
          }, []);
      },
      init(data){
        let nursingServiceArr = [];
        let nursingServiceTwoVoList = data.nursingServiceTwoVoList;
        let categoryArr = this.filterArr(nursingServiceTwoVoList, 'category');
        for(let i=0; i<categoryArr.length; i++){
            let categoryItem = {
                category: categoryArr[i].category,
                content: []
            };
            for(let j=0; j<nursingServiceTwoVoList.length; j++){
                nursingServiceTwoVoList[j].isDraw = nursingServiceTwoVoList[j].isDraw==0?false:true;
                if(categoryArr[i].category===nursingServiceTwoVoList[j].category){
                    categoryItem.content.push(nursingServiceTwoVoList[j])
                }
            }
            nursingServiceArr.push(categoryItem);
        }
        nursingServiceArr.map(val => {
          let data = 0
          val.content.map(item=>{
            if(item.isDraw===true) data += 1;
          })
          val.num = data
        })
        this.nursingServiceArr = nursingServiceArr;
        console.log(this.nursingServiceArr)
      }
    },
    filters: {
      fwFilter: val => {
				if(val.length > 0) {
					val = val.join(",")
				} else if(val.length == 0) {
					val = " ";
				}
				return val;
      },
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
  .right {
    display: flex;
    justify-content: flex-end;
    padding-right: 100px;
  }
table{
  tr{
    &.qianming{
      height:40px;
    }
  }
  td{
    padding:6px 10px !important;
  }
}
input{
  margin:0 5px 0 10px;
}
</style>