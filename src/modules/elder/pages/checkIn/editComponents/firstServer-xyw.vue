<template>
  <el-card class="box-card" style="padding-top:20px;">
    <el-form label-width="80px" :rules="rules" :model="form" :disabled="notEdit==true" style="margin:20px;">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="6">
            <s class="greenBa"></s>
            <span>老人的首次服务项目</span>
          </el-col>
        </el-row>
      </div>
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
              <!-- <span class="serviceType" v-if="Index===1">[{{efstSort1}}]</span>
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
        <div style="width:40%;color:#666666;">
          <el-form-item label="约定服务" label-width="80px">
            <el-input type="textarea" maxlength="20" plain v-model="customService" placeholder="请输入约定服务"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-row class="handleBtn" v-if="!notEdit">
      <el-button type="success" plain @click="save()">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </el-row>
  </el-card>
</template>

<script>
import axios from "axios";
export default {
  props: ["elderId", "nursingLevel", "notEdit"],
  data() {
    return {
      nursingLevel: "",
      itemId: "",
      customService: "",
      nursingServiceArr: [],
      change: false //判断是不是从变更约定过来的
    };
  },
  created() {
    this.change = this.$route.query.change;
    if (this.change) {
      this.elderId = this.$route.query.elderId;
      this.nursingLevel = this.$route.query.nursingLevel;
    }
    this.infoInit();
  },
  watch: {
    nursingServiceArr: {
      handler(newName, oldName) {
        //特别注意，不能用箭头函数，箭头函数，this指向全局
        // console.log(newName);
        newName.forEach((item, index) => {
          const arr = item.content.filter(o => {
            return o.isDraw == true;
          });
          item.num = arr.length;
        });
        // console.log("nursingServiceArr.content changed");
      },
      immediate: true, //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 obj 对象的属性值的变化
    }
  },
  methods: {
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
    getItemService(index) {
      let data = "";
      // this.nursingServiceArr[index].content.map(item => {
      //   if (item.isDraw === true) data += item.itemNo + ",";
      // });
      data = data.substr(0, data.length - 1);
      return data;
    },
    infoInit() {
      let data = {
        elderId: this.elderId,
        nursingLevel: this.nursingLevel
      };
      let url = "";
      if (this.$route.query.type == "submitElderService") {
        url = "/nursingService/get/nursingService";
      } else {
        url = "/nursingService/elder";
      }
      axios.fetch("elderServer", url, data).then(res => {
        if (res.data) {
          this.initAssemble(res.data);
        }
      });
    },
    //组装初始化的数据
    initAssemble(data) {
      this.itemId = data.itemId;
      this.customService = data.customService;
      let nursingServiceArr = [];
      let nursingServiceTwoVoList = data.nursingServiceTwoVoList;
      let categoryArr = this.filterArr(nursingServiceTwoVoList, "category");
      for (let i = 0; i < categoryArr.length; i++) {
        let categoryItem = {
          category: categoryArr[i].category,
          num: categoryArr[i].num,
          content: []
        };
        for (let j = 0; j < nursingServiceTwoVoList.length; j++) {
          nursingServiceTwoVoList[j].isDraw =
            nursingServiceTwoVoList[j].isDraw == 0 ? false : true;
          if (categoryArr[i].category === nursingServiceTwoVoList[j].category) {
            categoryItem.content.push(nursingServiceTwoVoList[j]);
          }
        }
        nursingServiceArr.push(categoryItem);
      }
      this.nursingServiceArr = nursingServiceArr;
    },
    //组装需要保存的数据
    saveAssemble() {
      let contentArr = [];
      let firstForm = {
        elderId: this.elderId,
        itemId: this.itemId,
        customService: this.customService,
        nursingServiceTwoVoList: []
      };
      for (let i = 0; i < this.nursingServiceArr.length; i++) {
        for (let j = 0; j < this.nursingServiceArr[i].content.length; j++) {
          this.nursingServiceArr[i].content[j].isDraw =
            this.nursingServiceArr[i].content[j].isDraw == true ? 1 : 0;
        }
        contentArr = contentArr.concat(this.nursingServiceArr[i].content);
      }
      firstForm.nursingServiceTwoVoList = contentArr;
      return firstForm;
    },
    save() {
      let firstForm = this.saveAssemble();
      console.log(firstForm, "====");

      axios
        .fetch("elderServer", "/elderServiceItem/submit", firstForm, "json")
        .then(res => {
          this.$store.state.submitElderServiceSuccess = true;
          this.$message({
            message: "保存成功",
            type: "success"
          });
          if (!this.change) {
            this.$emit("controlNavClick", "SpecialProtect");
          } else {
            this.$router.push("/elder/change");
          }
        });
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
    }
  }
};
</script>

<style scoped>
.firstServerTable table {
  width: 100%;
  margin-bottom: 30px;
}
.firstServerTable table thead th,
.firstServerTable table tr td {
  background: #f3f3f3;
  border: 1px solid #dcdfe6;
  height: 50px;
  text-align: center;
}
.firstServerTable >>> table tr td {
  background: #fff;
}
.el-checkbox,
.el-checkbox__input {
  display: inline-block;
  position: relative;
  word-wrap: break-word !important;
}
.firstServerTable >>> .el-checkbox__label {
  width: 120px;
  text-align: left;
}
.serviceType {
  color: #333333;
  font-weight: bold;
  padding: 0 5px;
}
table tr td >>> .el-checkbox {
  color: #666666;
}
table tr td {
  font-size: 14px;
  color: #666666;
}
table tr td:first-child {
  font-size: 16px;
}
.handleBtn {
  margin-top: 30px;
  text-align: center;
}
</style>