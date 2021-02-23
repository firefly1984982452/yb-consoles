<template>
  <el-select v-model="currentItem" value-key="roomId" placeholder="房间" v-bind="$attrs" @change="selectChanged">
    <el-option v-for="item in options" :key="item.roomId" :label="item.roomName" :value="item"></el-option>
  </el-select>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ubBuilding from "./_building";

export default {
  name: 'ubRoom',
  props: {
    value: String,
    category: { // 实例组名，用于同一页面有多个实例的情形
      type: String,
      default: "default"
    }
  },
  data() {
    return {
      currentItem: null,
      options: [],
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
    let bus = ubBuilding[this.category];
    if(!bus) {
      bus = ubBuilding[this.category] = new Vue();
    }
    this.selectBus = bus;

    if(this.selectBus instanceof Vue) {
      this.selectBus.$on('ub-building-floor-change', this.parentChange);
    }
  },
  beforeDestroy() {
    if(this.selectBus instanceof Vue) {
      this.selectBus.$off('ub-building-floor-change', this.parentChange);
    }
  },
  methods: {
    findItem(value) {
      let item = this.options.find(item => {
        return item.roomId == value;
      });
      return item;
    },
    parentChange(data) {
      this.selectData = data;
      if(data && data.floor) {
        this.fetchData(data);
      } else {
        this.options = [];
        this.optionsChanged();
      }
    },
    optionsChanged() { // 下拉选项已发生变化
      let value = this.value;
      let item;
      if(value) {
        item = this.findItem(value);
      } else {
        item = null;
      }
      if(this.currentItem != item) {
        this.currentItem = item;
        this.currentItemChanged();
      }
    },
    valueChanged(newVal) { // 绑定值已发生变化（的回调！）
      let item = this.currentItem;
      if(!newVal) {
        item = null;
      } else if(this.currentItem == null || this.currentItem.roomId != newVal) {
        item = this.findItem(newVal);
      }
      if(this.currentItem != item) {
        this.currentItem = item;
        this.currentItemChanged(true);
      }
    },
    currentItemChanged(isValue) { // 当前项已发生变化
      let item = this.currentItem;
      let value = item ? item.roomId : null;

      if(!isValue) { // 如果不是值变化引起的，则通知上层值已经改变
        this.$emit('input', value);
        this.$emit('change', item);
      }

      // 发出变更通知
      if(this.selectData) {
        this.selectData.roomId = value;
      }
      if(this.selectBus instanceof Vue) {
        this.selectBus.$emit('ub-building-room-change', this.selectData);
      }
    },
    selectChanged() { //下拉框选中时触发
      this.currentItemChanged();
    },
    fetchData(data) {
      data.pageSize = 10000;
      axios.fetch("oaServer", "/org/room/list", data).then(res => {
        this.options = res.data;
        this.optionsChanged();
      });
    }
  }
}
</script>