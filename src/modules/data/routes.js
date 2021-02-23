import Layout from '@/layouts/default';

const elderData = () => import( /* webpackChunkName: "group-data" */ './pages/elderData');
const carerData = () => import( /* webpackChunkName: "group-data" */ './pages/carerData');
const employeeData = () => import( /* webpackChunkName: "group-data" */ './pages/employeeData');
const bedData = () => import( /* webpackChunkName: "group-data" */ './pages/bedData');
const settlementData = () => import( /* webpackChunkName: "group-data" */ './pages/settlementData');

const routes = [{
    path: "/data",
    name: "数据展示",
    component: Layout,
    children: [{
        path: "",
        redirect: "elder"
      },
      {
        path: "elder",
        component: elderData,
        name: "长者数据"
      },
      {
        path: "carer",
        name: "护工数据",
        component: carerData
      },
      {
        path: "employee",
        name: "员工数据",
        component: employeeData
      },
      {
        path: "bed",
        name: "床位数据",
        component: bedData
      },
      {
        path: "settlement",
        name: "结算数据",
        component: settlementData
      }
    ]
  }
];

export default routes;