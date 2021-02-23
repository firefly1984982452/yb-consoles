import Vue from 'vue'
import Router from 'vue-router'

import consoleRoutes from '@/modules/console/routes'
import elderRoutes from '@/modules/elder/routes'
import desktopRoutes from '@/modules/desktop/routes'
import oaRoutes from '@/modules/oa/routes'
import financeRoutes from '@/modules/finance/routes'
import dataRoutes from '@/modules/data/routes'
import subsidyRoutes from '@/modules/subsidy/routes'
import emergencyRoutes from '@/modules/emergency/routes'
import medicalRoutes from '@/modules/medical/routes'
import careRoutes from '@/modules/care/routes'
import fireRoutes from '@/modules/fire/routes'
import visitRoutes from '@/modules/visit/routes'
import systemRoutes from '@/modules/system/routes'
import activityRoutes from "@/modules/activity/routes";
import dietRoutes from "@/modules/diet/routes";
import iotRoutes from "@/modules/iot/routes";
import mediaRoutes from "@/modules/media/routes";

import {
  tenantView
} from '@/components/_tenant'
import {
  MessageBox
} from 'element-ui'

Vue.use(Router)

let routes = [{
    path: "/",
    redirect: "/desktop"
  },
  // 这里添加子模块的路由
  ...consoleRoutes,
  ...desktopRoutes,
  ...oaRoutes,
  ...elderRoutes,
  ...financeRoutes,
  ...dataRoutes,
  ...subsidyRoutes,
  ...emergencyRoutes,
  ...medicalRoutes,
  ...careRoutes,
  ...fireRoutes,
  ...visitRoutes,
  ...systemRoutes,
  ...activityRoutes,
  ...dietRoutes,
  ...iotRoutes,
  ...mediaRoutes,
  { // 多租户入口页面
    path: "/tenant/:id",
    name: "tenant",
    meta: {
      allow: "*"
    },
    component: tenantView
  }, {
    path: "*",
    redirect: to => {
      return {
        name: "404",
        query: {
          url: to.fullPath,
          from: window.location.href
        }
      };
    }
  }
];

let router = new Router({
  mode: 'history',
  routes
});

// 修正跳转页面时提示框无法关闭，需要优化！！！
router.afterEach(to => {
  try {
    MessageBox.close();
  } catch (e) {}
});

export default router;
