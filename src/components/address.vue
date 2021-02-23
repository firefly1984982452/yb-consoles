<template>
  <el-select v-model="currentItem" v-bind="$attrs" value-key="districtNo" @change="selectChanged" v-if="!this.hiddenEmpty || (this.options && this.options.length)">
    <el-option v-for="item in options" :key="item.districtNo" :label="item.title" :value="item"></el-option>
  </el-select>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

const ubAddress = {};

export default {
  name: 'ubAddress',
  props: {
    value: String,
    dataType: String, // 地址类型：省、市、区、镇、村
    category: { // 地址实例组名，用于同一页面有多个地址的情形
      type: String,
      default: "default"
    },
    hiddenEmpty: Boolean,
    empty: Boolean
  },
  data() {
    return {
      currentItem: null,
      options: [],
      parentName: null,
      selectData: {},
      selectBus: null // 当前组通讯组件
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueChanged(newVal);
    }
  },
  created() {
    let name = null;
    if(this.dataType == 'province') { // 省
      this.fetchData('0');
    } else if(this.dataType == 'city') { // 市
      name = 'province';
    } else if(this.dataType == 'district') { // 区/县
      name = 'city';
    } else if(this.dataType == 'street') { // 镇
      name = 'district';
    } else if(this.dataType == 'committee') { // 村
      name = 'street';
    }
    this.parentName = name;

    let bus = ubAddress[this.category];
    if(!bus) {
      bus = ubAddress[this.category] = new Vue();
    }
    this.selectBus = bus;

    if(this.selectBus instanceof Vue) { // 侦听上级变化的事件
      this.selectBus.$on('ub-address-change-' + name, this.parentChange);
    }
  },
  beforeDestroy() {
    if(this.parentName && (this.selectBus instanceof Vue)) {
      this.selectBus.$off('ub-address-change-' + this.parentName, this.parentChange);
    }
  },
  methods: {
    findItem(title) {
      let item = this.options.find(item => {
        return item.title == title;
      });
      return item;
    },
    parentChange(data) {
      this.selectData = data;
      if(data && data[this.parentName]) {
        this.fetchData(data[this.parentName]);
      } else {
        this.options = [];
        this.optionsChanged();
      }
    },
    optionsChanged() { // 下拉列表已发生变化
      let value = this.value;
      let item;
      if(value) {
        item = this.findItem(value);
      } else {
        item = null;
      }
      if(this.currentItem != item) {
        this.currentItem = item;
        this.currentItemChanged(!this.selectData.selecting, this.selectData.selecting);
      }
      // 发出通知选项是否已变空
      let isEmpty = !this.options || !this.options.length;
      this.$emit('update:empty', isEmpty);
    },
    valueChanged(newVal) { // 绑定值已发生变化（的回调！）
      let item = this.currentItem;
      if(!newVal) {
        item = null;
      } else if(this.currentItem == null || this.currentItem.title != newVal) {
        item = this.findItem(newVal);
      }
      if(this.currentItem != item) {
        this.currentItem = item;
        this.currentItemChanged(true, false);
      }
    },
    currentItemChanged(isValue, isSelect) { // 当前项已发生变化
      let item = this.currentItem;
      let title = item ? item.title : '';
      let districtNo = item ? item.districtNo : null;

      // 通知使用者值已经改变
      if(!isValue) {
        this.$emit('input', title);
        this.$emit('change', item);
      }

      // 发出变更通知
      if(this.selectData) {
        this.selectData.selecting = isSelect; // 是否是人为点击下拉框
        this.selectData[this.dataType] = districtNo;
      }
      if(this.selectBus instanceof Vue) {
        this.selectBus.$emit('ub-address-change-' + this.dataType, this.selectData);
      }
    },
    selectChanged() { //下拉框选中时触发
      this.currentItemChanged(false, true);
    },
    fetchData(parentNo) {
      axios.fetch('commonServer', '/dict/getDistrictByParentNo', { parentNo }).then(res => {
        this.options = res.data;
        this.optionsChanged();
      });
    }
  }
}
</script>