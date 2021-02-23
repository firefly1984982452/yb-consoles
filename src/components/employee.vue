<!--人员选择框：员工-->
<template>
  <el-select v-model="currentItem" popper-class="people" v-bind="$attrs" value-key="itemValue"
    filterable :filter-method="peopleFilter" default-first-option
    @visible-change="visibleChange" @change="selectChange">
    <el-option v-for="item in options" :key="item.itemValue" :label="item.itemName" :value="item">
      <span class="name">{{ item.employeeName }}</span>
      <span class="title">{{ `${item.jobName}/${item.deptName}` }}</span>
    </el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'
import people from './_people'
import axios from 'axios'

export default _.merge({}, people, {
  name: "ubEmployee",
  props:{
    deptName: String, // 按部门过滤
    jobName: String, // 按岗位名称过滤
    filter: { // 自定义的过滤函数
      type: Function,
      default: item => item.status == 1 // 仅显示在职人员
    }
  },
  methods: {
    getStoreName(currentUser) {
      return `uban-people-employees-${currentUser.customerId}-v1`;
    },
    handleItem(item) {
      item.itemValue = item.employeeId;
      item.itemName = item.employeeName;
      return item;
    },
    fetchData(lastUpdate) {
      return axios.fetch('oaServer', '/employee/fetch', { lastUpdate });
    },
    listFilter(list) {
      if(!list || list.length <= 0) {
        return list;
      }
      let filter = this.filter;
      if(!this.deptName && !this.jobName && typeof filter !== 'function') {
        return list;
      }
      let list1 = [];
      let that = this;
      list.forEach(item => {
        if(filter) {
          if(filter(item) === true) {
            list1.push(item);
          }
        } else if((!that.deptName || item.deptName == that.deptName) && (!that.jobName || item.jobName == that.jobName)) {
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