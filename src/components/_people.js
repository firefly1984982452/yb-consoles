import pinyin from '@/utils/pinyin'
import axios from 'axios'

export default {
  props: {
    value: String
  },
  data() {
    return {
      currentItem: null,
      list: [],
      options: [],
      lastUpdate: null, // 最后更新时间
      storeData: {}, // 键值列表
      storeName: null, // 存储名称
      storage: sessionStorage // 存储
    }
  },
  watch: {
    value(newVal) {
      this.valueChange(newVal);
    }
  },
  created() {
    this.initData();
  },
  methods: {
    findPeople(val) {
      if (!val || !this.list || this.list.length <= 0) {
        return null;
      }
      let item = this.list.find(item => item.itemValue == val );
      return item;
    },
    peopleFilter(val) { // 下拉框输入文字时过滤
      let list = this.list;
      if (!val) {
        this.options = list;
        return;
      }
      let itemFilter = this.itemFilter;
      val = val.toUpperCase();
      this.options = list.filter(item => {
        if (item.itemName.indexOf(val) != -1) return true;
        if (item.pinyin && item.pinyin.indexOf(val) != -1) return true;
        if (itemFilter && itemFilter(val, item)) return true;
      });
    },
    valueChange(newVal) {
      if (!newVal) {
        this.currentItem = null;
      } else if (this.currentItem == null || this.currentItem.itemValue != newVal) {
        let item = this.findPeople(newVal);
        this.currentItem = item;
      }
    },
    selectChange() {
      let item = this.currentItem;
      let value = item ? item.itemValue : '';
      this.$emit('input', value);
      this.$emit('change', item);
    },
    visibleChange(visible) {
      if (visible) {
        this.options = this.list;
      }
    },
    initData() {
      let currentUser = axios.getCurrentUser();
      this.storeName = this.getStoreName(currentUser);
      if (!this.storeName) {
        throw "storeName must be provided"
      }
      let json = this.storage.getItem(this.storeName);
      if (json) {
        let storeObject = JSON.parse(json);
        this.lastUpdate = storeObject.lastUpdate;
        this.storeData = storeObject.data;
        let list = Object.values(storeObject.data);
        this.list = this.listFilter(list);
      }
      this.options = this.list;
      let fetchHandle = this.fetchData;
      if (!fetchHandle) {
        throw "fetchData method must be defined";
      }
      fetchHandle(this.lastUpdate).then(res => {
        this.handleData(res.data);
        this.valueChange(this.value);
      });
    },
    handleData(items) {
      if (!items || items.length <= 0) {
        return;
      }
      let lastUpdate = this.lastUpdate;
      if (!lastUpdate) lastUpdate = '';
      let list = this.list;
      let itemHandle = this.handleItem;
      if (!itemHandle) {
        throw "handleItem method must be defined";
      }
      let list1 = [];
      let data = this.storeData;
      items.forEach(item => {
        if (item.updateTime > lastUpdate) {
          lastUpdate = item.updateTime;
        }
        item = itemHandle(item);
        let name = item.itemName;
        item.pinyin = name ? pinyin.getCamelChars(name) : name;
        data[item.itemValue] = item;
        list1.push(item);
      });
      list1 = this.listFilter(list1);
      list1.forEach(item => list.push(item));
      this.options = list;
      this.lastUpdate = lastUpdate;
      this.storage.setItem(this.storeName, JSON.stringify({ lastUpdate, data }));
    },
    listFilter(list) { // 用于过滤原始列表，比如按部门过滤员工等
      return list; // 默认不过滤
    }
  }
}