<template>
  <el-radio-group v-model="value" v-bind="$attrs" @change="selectChanged">
    <el-radio v-for="item in options" :key="item.itemValue" :label="item.itemValue">{{ item.title }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: "ubDictionaryRadio",
  props: {
    value: String,
    dictBus: Vue, // 页面级通讯组件
    category: String, // 数据字典实例组名，用于同一页面有多个同类字典的情形
    group: { // 数据字典类别名称，比如“房屋权属证明”
      type: String,
      required: true
    }
  },
  data() {
    return {
      options: [],
      pageBus: null, // 页面级通讯组件
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
    // 侦听总数据的变化
    if(this.pageBus instanceof Vue && this.pageBus.__ubDictionary) {
      this.pageBus.__ubDictionary.groups.push(this.group);
      this.pageBus.$on("ub-dictionary-change-items", this.itemsChange);
      return;
    }
    // 根级
    axios.fetch('commonServer', '/dict/getItemViewsByGroup', { groups: this.group }).then(res => {
      let data = this.selectData.items = res.data;
      this.itemsInit(data);
    });
  },
  methods: {
    selectChanged(val) { //选项变更选中时触发
      this.$emit('input', val);
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
      this.itemsInit(list);
    }
  }
}
</script>