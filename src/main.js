// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from "./store";
import settings from "./settings";
import uban from "youban-utils";
import ElementUI from "element-ui";
import moment from 'moment';
import { permission, axios } from 'youban-utils';
import constant from './utils/constant';
import tenant from "@/components/_tenant";

Vue.use(ElementUI);
Vue.use(uban);
Vue.use(permission); // 权限控制指令，给元素加上v-permission

Vue.prototype.$moment = moment;
window.$moment = moment;
Vue.prototype.$axios = axios;
Vue.prototype.$constant = constant;
Vue.config.productionTip = false;

 // 调试
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// export default vConsole 

// 引入echarts右上角角标公用组件
import RightEchartsInfo from '@/components/right-echarts-info'; 
Vue.component('RightEchartsInfo', RightEchartsInfo);

// 引入护理区域全局组件
import Area from '@/components/area';
Vue.component('Area', Area);

// 性别全局过滤
Vue.filter("genderFilter", function(value) {
  return value == 0 ? '男' : '女';
});
Vue.filter("filterCategoryType", function(value) {
  return ['','日常照护','清洁卫生','预防保健'][value];
});
  
/* eslint-disable no-new */
Vue.create({
  el: '#app',
  settings,
  withoutRoutes: true,
  router,
  store,
  components: { App },
  template: '<App/>'
}, function (vue, opts) {
  (async () => {
    // 在创建全局Vue实例前，尝试获取当前登录用户（用户后续判断是否登录）
    await axios.fetchCurrentUser();
    // 初始化当前租户信息
    await tenant.initTenant();

    new vue(opts);
  })();
});
/* new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
 */