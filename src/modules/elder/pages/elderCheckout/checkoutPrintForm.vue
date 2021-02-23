<!--批量打印选择页面-->
<template>
  <div class="content nopadding">
    <div class="content-title">
      <div class="bar"></div>
      <p>请选择要打印的单据</p>
    </div>
    <div class="body">
      <el-row>
        <el-col :span="18">
          <el-checkbox-group v-model="selectedList">
            <table>
              <tr v-for="item in items" :key="item">
                <th colspan="3" v-if="item.isGroup">
                  <el-checkbox @change="val => groupSelect(item, val)" :label="item.name"><span class="title">{{ item.title }}</span></el-checkbox>
                </th>
                <td v-else-if="item.singleLine" colspan="3">
                  <el-checkbox :label="item.name">{{ item.title }}</el-checkbox>
                </td>
                <td v-else v-for="child in item.children" :key="child">
                  <el-checkbox v-if="!child.isEmpty" :label="child.name">{{ child.title }}</el-checkbox>
                </td>
              </tr>
            </table>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <div class="buttons">
        <el-button type="primary" @click="print">打印预览</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import printMethods from "@/utils/print";
import printComponents from "../print/checkoutForms";
import utils from "@/utils/index";

export default {
  data() {
    return {
      elder: null, //老人信息
      elderId: "",
      selectedList: [],
      items: [],
      dict: {}
    };
  },
  filters: {
    insuranceLevelFilter: function(value) {
      if (!value) {
        return "未评级";
      } else {
        return value;
      }
    }
  },
  created() {
      this.elderId = this.$route.query.elderId;
    //初始化要打印的项目
    let list = [];
    printComponents.forEach(group => {
      list.push(group);
      console.log(list);
      
      group.isGroup = true; // 标记为数组
      group.values = []; // 保存子项的名称
      this.dict[group.name] = group;
      let children = group.children;
      let i = 0;
      let lastChild;
      children.forEach(child => {
        if (!child.type) {
          group.values.push(child.name); // 保存子项的名称
          this.dict[child.name] = child;
          if (child.singleLine) {
            list.push(child);
            i = -1;
          } else if (i % 3 == 0) {
            lastChild = { children: [child] };
            list.push(lastChild);
          } else if (lastChild) {
            lastChild.children.push(child);
          }
          i++;
        }
      });
      // 补齐后面的单元格
      let k = i % 3;
      if (lastChild && k > 0) {
        for (let j = k; k < 3; k++) {
          lastChild.children.push({ isEmpty: true });
        }
      }
    });
    this.items = list;
  },
  methods: {
    ...utils,
    ...printMethods,
    groupSelect(item, val) {
      let list = this.selectedList;
      if (val) {
        list = _.union(list, item.values);
      } else {
        _.pullAll(list, item.values);
      }
      this.selectedList = list;
    },
    print() {
      let list = [];
      this.selectedList.forEach(key => {
        if (this.dict[key] && !this.dict[key].isGroup) {
          list.push(key);
        }
      });
      if (list.length <= 0) {
        this.$message.warning("请选择需要打印的表单");
        return;
      }
      this.openPrint({
        name: "离院打印预览",
        query: {
          elderId: this.elderId,
          forms: list.join(",")
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.body {
  padding: 10px 0 10px 20px;
  margin-top: 20px;
  table {
    width: 100%;
    th,
    td {
      color: #333;
      font-size: 18px;
      border: 1px solid #dcdfe6;
      padding: 15px;
      text-align: left;
    }
    th {
      background-color: #f8f8f8;

      span.title {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .buttons {
    padding-top: 360px;
    text-align: center;
  }

}
</style>