<!--批量打印选择页面-->
<template>
  <div class="content nopadding">
    <div class="content-title">
      <div class="bar"></div>
      <p>请选择要打印的单据</p>
    </div>
    <div class="body" v-if="elder">
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
        <el-col :span="6" class="elder">
          <div class="avatar">
            <img src="//image.youbankeji.com/static/console/elder_photo.png" />
          </div>
          <div class="info">
            <div><span>姓名</span><strong>{{ elder.elderName }}</strong></div>
            <div><span>年龄</span><strong>{{ getAge(elder.birthDay) }}</strong></div>
            <div><span>床位</span><strong>{{ elder.roomName }}-{{ elder.bedName }}</strong></div>
            <div><span>护理等级</span><strong>{{ elder.nursingLevel }}</strong></div>
            <div><span>长护险等级</span><strong>{{ elder.insuranceLevel | insuranceLevelFilter }}</strong></div>
          </div>
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
import _ from 'lodash';
import axios from 'axios';
import printMethods from '@/utils/print';
import printComponents from './forms';
import utils from '@/utils/index';

export default {
  data() {
    return {
      elder: null, //老人信息
      elderId: "",
      selectedList: [],
      items: [],
      dict: {}
    }
  },
  filters: {
    insuranceLevelFilter: function(value) {
      if(!value){
        return '未评级';
      } else{
        return value
      }
    }
  },
  created() {
    let elderId = this.$route.query.elderId;
    if(!elderId) {
      this.$message.error('请提供老人ID');
      return;
    }
    this.elderId = elderId;
    //获取老人信息
    axios.fetch('elderServer', '/elderInfo/all', { elderId }).then(res => {
      if(!res.data || res.data.length <= 0) {
        this.$message.error('未找到ID为 ' + elderId + ' 的老人');
      } else {
        this.elder = res.data[0];
      }
    });

    //初始化要打印的项目
    let list = [];
    printComponents.forEach(group => {
      list.push(group);
      group.isGroup = true; // 标记为数组
      group.values = []; // 保存子项的名称
      this.dict[group.name] = group;
      let children = group.children;
      let i = 0;
      let lastChild;
      children.forEach(child => {
        if(!child.type){
          group.values.push(child.name); // 保存子项的名称
          this.dict[child.name] = child;
          if(child.singleLine) {
            list.push(child);
            i = -1;
          } else if((i % 3) == 0) {
            lastChild = { children: [child] };
            list.push(lastChild);
          } else if(lastChild) {
            lastChild.children.push(child);
          }
        i++;
        }
      });
      // 补齐后面的单元格
      let k = i % 3;
      if(lastChild && k > 0) {
        for(let j = k; k < 3; k++) {
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
      if(val) {
        list = _.union(list, item.values)
      } else {
         _.pullAll(list, item.values);
      }
      this.selectedList = list;
    },
    print() {
      let list = [];
      this.selectedList.forEach(key => {
        if(this.dict[key] && !this.dict[key].isGroup) {
          list.push(key);
        }
      });
      if(list.length <= 0) {
        this.$message.warning('请选择需要打印的表单');
        return;
      }
      this.openPrint({
        name: '打印预览',
        query: {
          elderId: this.elderId,
          forms: list.join(',')
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.body {
  padding: 10px 0 10px 20px;
  margin-top: 20px;

  table {
    width: 100%;
    th, td  {
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
    padding-top: 20px;
    text-align: center;
  }

  .elder {
    padding: 0px 20px 0px 30px;

    .avatar {
      text-align: center;
      img {
        width: 129px;
      }
    }
    .info {
      padding: 20px 30px;

      div {
        border-bottom: 1px solid #eee;
        padding: 15px;
        font-size: 14px;
        color: #666;

        span {
          display: inline-block;
          width: 50%;
        }
        strong {
          display: inline-block;          
          width: 50%;
          text-align: right;
        }
      }
    }
  }
}
</style>