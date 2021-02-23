<template>
    <el-form label-width="110px" disabled label-position="left">
        <el-card class="box-card"> 
            <div slot="header" class="clearfix">
                <s class="greenBa"></s>
                <span>首次服务项目</span>
            </div>
            <el-row class="zdList">
                <el-col :span="8">
                    <el-form-item label="约定服务：" style="margin-bottom:2px;">
                        <span>{{customService}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <div class="firstServerTable">
                    <table>
                        <thead>
                            <th style="width:4em;padding:0 3em;">服务项目</th>
                            <th>服务内容</th>
                            <th style="width:28%;">合计</th>
                        </thead>
                        <tr v-for="(Item,Index) in nursingServiceArr" :key="Index">
                            <td>{{Item.category}}</td>
                            <td>
                                <el-row style="margin-bottom: 0px;">
                                    <el-col v-for="(item,index) in Item.content" :key="index" :span="6">
                                        <el-checkbox v-model="item.isDraw">{{item.itemNo}} {{item.itemTitle}}</el-checkbox>
                                    </el-col>
                                </el-row>
                            </td>
                            <td>
                                提供
                                <span class="serviceType">{{Item.num}}</span>
                                <!-- <span class="serviceType" v-if="Index===0">[{{efstSort0}}]</span>
                                <span class="serviceType" v-if="Index===1">[{{efstSort1}}]</span>
                                <span class="serviceType" v-if="Index===2">[{{efstSort2}}]</span>
                                <span class="serviceType" v-if="Index===3">[{{efstSort3}}]</span>
                                <span class="serviceType" v-if="Index===4">[{{efstSort4}}]</span>
                                <span class="serviceType" v-if="Index===5">[{{efstSort5}}]</span>
                                <span class="serviceType" v-if="Index===6">[{{efstSort6}}]</span>
                                <span class="serviceType" v-if="Index===7">[{{efstSort7}}]</span>
                                <span class="serviceType" v-if="Index===8">[{{efstSort8}}]</span>
                                <span class="serviceType" v-if="Index===9">[{{efstSort9}}]</span>
                                <span class="serviceType" v-if="Index===10">[{{efstSort10}}]</span> -->
                                项服务
                            </td>
                        </tr>
                    </table>
                </div>
            </el-row>
        </el-card>
    </el-form>
</template>

<script>
	import axios from "axios";
	export default {
        props: ["elderId","nursingLevel"],
		data() {
			return {
                itemId: '',
                nursingLevel: '',
                customService: '',
                nursingServiceArr: [],
			}
        },
        computed: {
            //排序
			efstSort0: {
				get() {
                    let data = this.getItemService(0);
					return data;
				},
				set() {}
			},
			efstSort1: {
				get() {
					let data = this.getItemService(1);
					return data;
				},
				set() {}
			},
			efstSort2: {
				get() {
					let data = this.getItemService(2);
					return data;
				},
				set() {}
			},
			efstSort3: {
				get() {
					let data = this.getItemService(3);
					return data;
				},
				set() {}
			},
			efstSort4: {
				get() {
					let data = this.getItemService(4);
					return data;
				},
				set() {}
			},
			efstSort5: {
				get() {
					let data = this.getItemService(5);
					return data;
				},
				set() {}
			},
			efstSort6: {
				get() {
					let data = this.getItemService(6);
					return data;
				},
				set() {}
			},
			efstSort7: {
				get() {
					let data = this.getItemService(7);
					return data;
				},
				set() {}
			},
			efstSort8: {
				get() {
					let data = this.getItemService(8);
					return data;
				},
				set() {}
            },
			efstSort9: {
				get() {
					let data = this.getItemService(9);
					return data;
				},
				set() {}
			},
			efstSort10: {
				get() {
					let data = this.getItemService(10);
					return data;
				},
				set() {}
			},
        },
        created(){
            this.infoInit();
        },
		methods:{
			// 根据对象中的属性进行去重
            filterArr(arr, name) {
               let hash = [];
                return arr.reduce((ss, item, index) => {
                    // reduce累计器, ss是具体满足条件后返回的数据, item是数组依次循环的每一项
                    // hash[item[name]] ? "" : (hash[item[name]] = true && ss.push(item));
                    const obj = {};
                    if (hash.includes(item[name])) {
                    if (item.isDraw == 1) {
                        ss[hash.indexOf(item[name])].num++;
                    }
                    } else {
                    item.num = item.isDraw;
                    hash.push(item[name]);
                    ss.push(item);
                    }
                    // 1、判断对象的键值是否存在
                    return ss;
                }, []);
            },
            getItemService(index){
                let data = "";
                this.nursingServiceArr[index].content.map(item=>{
                    if(item.isDraw===true) data += item.itemNo + ',';
                })
                data = data.substr(0, data.length - 1);
                return data;
            },
            infoInit(){
                let data = {
                    elderId: this.elderId,
                    nursingLevel: this.nursingLevel
                };
                axios
				.fetch('elderServer', "/nursingService/elder", data)
				.then(res => {
					if(res.data) {
                        this.initAssemble(res.data);
                    }
				})
            },
            //组装初始化的数据
            initAssemble(data){
                this.itemId = data.itemId;
                this.customService = data.customService;
                let nursingServiceArr = [];
                let nursingServiceTwoVoList = data.nursingServiceTwoVoList;
                let categoryArr = this.filterArr(nursingServiceTwoVoList, 'category');
                for(let i=0; i<categoryArr.length; i++){
                    let categoryItem = {
                        num: categoryArr[i].num,
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
                this.nursingServiceArr = nursingServiceArr;
            },
        }
    }
</script>

<style scoped>
   .serviceType{
       color: #333333;
       font-weight: bold;
       padding: 0 5px;
   }
   table tr td >>> .el-checkbox{
       color: #666666;
   }
   table tr td{
       font-size: 14px;
       color: #666666;
   }
   table tr td:first-child{
       font-size: 16px;
   }
   .firstServerTable table {
        width: 100%;
        margin-bottom: 30px;
   }
   .firstServerTable table thead th, .firstServerTable table tr td {
        background: #f3f3f3;
        border: 1px solid #dcdfe6;
        height: 50px;
        text-align: center;
   }
   .firstServerTable >>> table tr td {
        background: #fff;
    }
    .el-checkbox, .el-checkbox__input {
        display: inline-block;
        position: relative;
        word-wrap: break-word !important;
    }
    .firstServerTable >>> .el-checkbox__label {
        width: 120px;
        text-align: left;
    }
    .el-form-item__label {
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
</style>