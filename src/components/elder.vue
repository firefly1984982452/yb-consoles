<!--人员选择框：长者-->
<template>
  <el-select v-model="currentItem" popper-class="people" v-bind="$attrs" value-key="itemValue"
    filterable :filter-method="peopleFilter" default-first-option
    @visible-change="visibleChange" @change="selectChange">
    <el-option v-for="item in options" :key="item.itemValue" :label="item.itemName" :value="item">
      <span class="name">{{ item.elderName }}</span>
      <span class="title" v-if="item.status == 100">{{ `${item.roomName}-${item.bedName}` }}</span>
      <del class="title" v-else-if="item.status == 200">已离院</del>
      <i class="title" v-else-if="item.status == 0">办理中</i>
    </el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'
import people from './_people'
import axios from 'axios'

export default _.merge({}, people, {
  name: "ubElder",
  props: {
    status: Array, // 按老人状态（0入住办理中，入住100、150离院办理中、离院200）过滤
    filter: Function,  // 自定义的过滤函数
  },
  methods: {
    getStoreName(currentUser) {
      return `uban-people-elders-${currentUser.customerId}-v1`;
    },
    handleItem(item) {
      item.itemValue = item.elderId;
      item.itemName = item.elderName;
      return item;
    },
    itemFilter(val, item) {
      if(item.roomName && item.roomName.indexOf(val) != -1) return true;
    },
    fetchData(lastUpdate) {
      return axios.fetch('elderServer', '/elderInfo/fetch', { lastUpdate });
    },
    listFilter(list) {
      if(!list || list.length <= 0) {
        return list;
      }
      let filter = this.filter;
      if((this.status === undefined || this.status == '' || this.status.length <= 0) && typeof filter !== 'function') {
        return list;
      }
      let list1 = [];
      let status0 = this.status;
      list.forEach(item => {
        if(filter) {
          if(filter(item) === true) {
            list1.push(item);
          }
        } else if(_.indexOf(status0, item.status) >= 0) {
          list1.push(item);
        }
      });
      return list1;
    }
  }
})
</script>

<style lang="less" scoped>
.people {
  .name {
    float: left;
    width: 80px;
  }
  .title {
    float: right;
    color: #8492a6;
    font-size: 13px
  }
}
</style>