import Layout from '@/layouts/page';

const Equipment = () => import(/* webpackChunkName: "group-fire" */ './pages/equipment');
const Dangerous = () => import(/* webpackChunkName: "group-fire" */ './pages/dangerous');

/*消防*/
// const FireDictionary = () => import(/* webpackChunkName: "group-fire" */ './pages/FireDictionary');
// const checkManager = () => import(/* webpackChunkName: "group-fire" */ './pages/checkManager');
// const safeFireData = () => import(/* webpackChunkName: "group-fire" */ './pages/safeFireData');
// const facilitiesManager = () => import(/* webpackChunkName: "group-fire" */ './pages/facilitiesManager');
// const addEquipment = () => import(/* webpackChunkName: "group-fire" */ './pages/addEquipment');
// const addFacilities = () => import(/* webpackChunkName: "group-fire" */ './pages/addFacilities');
// const xuBao = () => import(/* webpackChunkName: "group-fire" */ './pages/xuBao');

//消防巡查
const xunChaIndex = () => import( /* webpackChunkName: "group-fire" */ "./pages/xunChaIndex");
// const xunChaCataloge = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/xunChaCataloge');
// const xunChaData = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/xunChaData');
// const xunChaManager = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/xunChaManager');
const xunChaPlan = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/xunChaPlan');
const xunChaWork = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/xunChaWork');
// const addXunChaCataloge = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/addXunChaCataloge');
const addXunChaPlan = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/addXunChaPlan');
const createCodes = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/createCodes');
const erCodePrint = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/erCodePrint');
const xunChaWorkDetail = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/xunChaWorkDetail');
// const addXunChaManage = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/addXunChaManage');
// const piLiangAddXunCha = () => import(/* webpackChunkName: "group-fire" */ './pages/xunCha/piLiangAddXunCha');

const routes = [
  {
    path: "/fire",
    name: "消防管理",
    component: Layout,
    children: [
      {
        path: "", 
        redirect: "equipment"
      },
      {
        path: "equipment",
        component: Equipment,
        name: "设备查询"
      }, {
        path: "dangerous",
        component: Dangerous,
        name: "告警管理"
      }, {
        path: "xunCha",
        name: "巡更管理",
        component: xunChaIndex,
        children:[
          {
            path:'',
            redirect:'xunChaPlan'
          },
          {
            path: "xunChaPlan",
            component: xunChaPlan,
            name: "巡更计划",
          },
          {
            path: "addXunChaPlan",
            component: addXunChaPlan,
            name: "新增巡更计划",
          },
          {
            path: "xunChaWork",
            component: xunChaWork,
            name: "巡更任务",
          },
          {
            path: "createCodes",
            component: createCodes,
            name: "二维码选择",
          },
          {
            path: "erCodePrint",
            component: erCodePrint,
            name: "二维码显示",
          },
          {
            path: "xunChaWorkDetail",
            component: xunChaWorkDetail,
            name: "巡查任务详情",
          },
        ]
      }
    ]
  }
];

export default routes;