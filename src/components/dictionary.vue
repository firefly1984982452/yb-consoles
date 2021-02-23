<template>
    <el-select v-model="currentItem" v-bind="$attrs" value-key="itemValue" @change="selectChanged" v-if="!this.hiddenEmpty || (this.options && this.options.length)">
      <el-option v-for="item in options" :key="item.itemValue" :label="item.title" :value="item"></el-option>
    </el-select>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

const init = function (vue) {
  if(vue.__ubDictionary) { // 已经初始化过了
    return;
  }
  let instance = vue.__ubDictionary = {
    groups: [] // 用于保存有多少个字典组
  };
  // 监听当前页面的mounted事件
  vue.$on('hook:mounted', function () {
    let groups = instance.groups;
    if (groups && groups.length) {
      axios.fetch('commonServer', '/dict/getItemViewsByGroup', { groups: groups.join(",") }).then(res => {
        let list = res.data;
        vue.$emit('ub-dictionary-change-items', list);
      });
    }
  });
};

export default {
  name: 'ubDictionary',
  init,
  props: {
    value: String,
    dictBus: Vue, // 页面级通讯组件
    category: String, // 数据字典实例组名，用于同一页面有多个同类字典的情形
    group: { // 数据字典类别名称，比如“房屋权属证明”
      type: String,
      required: true
    },
    level: { // 级联下拉框的层次，第一层为1
      type: Number,
      default: 1
    },
    hiddenEmpty: Boolean, // 如果没有下来选项，是否需要隐藏
    empty: Boolean
  },
  data() {
    return {
      currentItem: null,
      options: [],
      parentLevel: 0,
      selectData: {},
      value0: undefined, // 表单首次绑定值
      pageBus: null, // 页面级通讯组件
      selectBus: null // 当前组通讯组件（级联）
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueChanged(newVal);
    }
  },
  created() {
    this.pageBus = this.dictBus;
    if(!this.pageBus) { //未提供通讯组件，则向上查找
      let parent = this.$parent;
      while(parent) {
        if(parent.__ubDictionary) {
          break;
        }
        parent = parent.$parent;
      }
      this.pageBus = parent;
    }
    if(this.pageBus && this.category) {
      let bus = this.pageBus.__ubDictionary[this.category];
      if(!bus) {
        bus = this.pageBus.__ubDictionary[this.category] = new Vue();
      }
      this.selectBus = bus;
    } else {
      this.selectBus = this.pageBus;
    }
    if(this.pageBus && this.pageBus.__ubDictionary && this.level == 1) {
      this.pageBus.__ubDictionary.groups.push(this.group);
    }

    if(this.level > 1) { // 联动下拉框
      this.parentLevel = this.level - 1;
      if(this.selectBus instanceof Vue) { // 侦听上级变化的事件
        this.selectBus.$on('ub-dictionary-change-' + this.group + '-' + this.parentLevel, this.parentChanged);
      }
      return;
    }
    // 侦听总数据的变化
    if(this.pageBus instanceof Vue && this.pageBus.__ubDictionary) {
      this.pageBus.$on("ub-dictionary-change-items", this.itemsChange);
      return;
    }
    // 根级
    axios.fetch('commonServer', '/dict/getItemViewsByGroup', { groups: this.group }).then(res => {
      let data = this.selectData.items = res.data;
      this.itemsInit(data);
    });
  },
  beforeDestroy() {
    if(this.parentLevel && (this.selectBus instanceof Vue)) {
      this.selectBus.$off('ub-dictionary-change-' + this.group + '-' + this.parentLevel, this.parentChanged);
    }
    if(this.pageBus instanceof Vue && this.pageBus.__ubDictionary) {
      this.pageBus.$off("ub-dictionary-change-items", this.itemsChange);
    }
  },
  methods: {
    findItem(value) {
      let item = this.options.find(item => {
        return item.itemValue == value;
      });
      return item;
    },
    parentChanged(data) { // 父级编号已变化
      this.selectData = data;
      if(data && data.items && data.items.length && data['value' + this.parentLevel]) {
        let parentNo = data['value' + this.parentLevel];
        let items = data.items;
        let list = [];
        items.forEach(element => {
          if(element.itemGroup == this.group && element.parentNo == parentNo && element.itemLevel == this.level) {
            list.push(element);
          }
        });
        this.options = list;
      } else {
        this.options = [];
      }
      this.optionsChanged();
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
      // 发出通知选项已变空
      let isEmpty = !this.options || !this.options.length;
      this.$emit('update:empty', isEmpty);
      this.$emit('optionsChanged', this.options);
    },
    valueChanged(newVal) { // 绑定值已发生变化（的回调！）
      let item = this.currentItem;
      if(!newVal) {
        item = null;
      } else if(this.currentItem == null || this.currentItem.itemValue != newVal) {
        item = this.findItem(newVal);
      }
      if(this.currentItem != item) {
        this.currentItem = item;
        this.currentItemChanged(true);
      }
    },
    currentItemChanged(isValue) { // 当前项已发生变化
      let item = this.currentItem;
      let itemValue = item ? item.itemValue : '';

      // 通知使用者值已经改变
      if(!isValue) {
        this.$emit('input', itemValue);
        this.$emit('change', item);
      }

      // 发出变更通知
      if(this.selectData) {
        this.selectData['value' + this.level] = itemValue;
      }
      if(this.selectBus instanceof Vue) {
        this.selectBus.$emit('ub-dictionary-change-' + this.group + '-' + this.level, this.selectData);
      }
    },
    selectChanged() { //下拉框选中时触发
      this.currentItemChanged();
    },
    itemsInit(data) { // 从服务器获取数据后的处理
      let list = [];
      if(data) {
        data.forEach(element => {
          if(element.parentNo == this.group) {
            list.push(element);
          }
        });
      }
      this.options = list;
      this.optionsChanged();
    },
    itemsChange(items) { // 从总数据里获得数据后的处理
      if(!items || items.length <= 0) {
        return;
      }
      let list = [];
      items.forEach(element => {
        if(element.itemGroup == this.group) {
          list.push(element);
        }
      });
      this.selectData.items = list;
      this.itemsInit(list);
    }
  }
}
</script>