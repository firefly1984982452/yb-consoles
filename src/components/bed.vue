<template>
  <el-select v-model="currentItem" value-key="bedId" placeholder="床位" v-bind="$attrs" @change="selectChanged">
    <el-option v-for="item in options" :key="item.bedId" :label="item.label" :value="item"></el-option>
  </el-select>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import ubBuilding from "./_building";

export default {
  name: 'ubBed',
  props: {
    value: String,
    category: { // 实例组名，用于同一页面有多个实例的情形
      type: String,
      default: "default"
    },
    showStatus: { // 是否显示床位被占用的状态
      type: Boolean,
      default: true
    },
    status: Number, // 需要显示哪种状态的床位
    valueTitle: String // 项名称回调
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
      this.selectBus.$on('ub-building-room-change', this.parentChange);
    }
  },
  beforeDestroy() {
    if(this.selectBus instanceof Vue) {
      this.selectBus.$off('ub-building-room-change', this.parentChange);
    }
  },
  methods: {
    findItem(value) {
      let item = this.options.find(item => {
        return item.bedId == value;
      });
      return item;
    },
    parentChange(data) {
      this.selectData = data;
      if(data && data.roomId) {
        if(this.status >= 0) {
          data.status = this.status
        }
        data.bedId = undefined;
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
      } else if(this.currentItem == null || this.currentItem.bedId != newVal) {
        item = this.findItem(newVal);
      }
      if(this.currentItem != item) {
        this.currentItem = item;
        this.currentItemChanged(true);
      }
    },
    currentItemChanged(isValue) { // 当前项已发生变化
      let item = this.currentItem;
      let value = item ? item.bedId : null;

      if(!isValue) { // 如果不是值变化引起的，则通知上层值已经改变
        this.$emit('input', value);
        this.$emit('change', item);
      }

      // 发出变更通知
      if(this.selectData) {
        this.selectData.bedId = value;
      }
      if(this.selectBus instanceof Vue) {
        this.selectBus.$emit('ub-building-bed-change', this.selectData);
      }
    },
    selectChanged() { //下拉框选中时触发
      this.currentItemChanged();
    },
    fetchData(data) {
      data.pageSize = 100;
      axios.fetch("oaServer", "/org/bed/list", data).then(res => {
        let options = res.data
        if(this.showStatus) {
          options.forEach(item => {
            switch(item.status){
              case 0:
                item.label = item.bedName + "（未知）";
                break;
              case 1:
                item.label = item.bedName + "（空闲）";
                break;
              case 2:
                item.label = item.bedName + "（预定）";
                break;
              case 3:
                item.label = item.bedName + "（入住）";
                break;
              case 4:
                item.label = item.bedName + "（占有）";
                break;
            }
          });
        } else {
          options.forEach(item => item.label = item.bedName);
        }

        this.options = options;
        this.optionsChanged();
      });
    }
  }
}
</script>