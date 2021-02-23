import Layout from '@/layouts/page';

/*员工考勤统计*/
const visitorRegister = () => import( /* webpackChunkName: "group-visit" */ './pages/visitorregister');
/*数据统计*/
const visitorMaterialize = () => import( /* webpackChunkName: "group-visit" */ './pages/visitorMaterialize');
/*人脸库*/
const faceView = () => import( /* webpackChunkName: "group-visit" */ './pages/faceView');
/*人员进出*/
const visitGoOut = () => import( /* webpackChunkName: "group-visit" */ './pages/visitGoOut');
/*老人外出*/
const oldPeopleGoOut = () => import( /* webpackChunkName: "group-visit" */ './pages/oldPeopleGoOut');
/*考勤统计*/
const attendanceTotal = () => import( /* webpackChunkName: "group-visit" */ './pages/attendanceTotal');
/*老人外出详情*/
const goOutDetail = () => import( /* webpackChunkName: "group-visit" */ './pages/goOutDetail');

const routes = [
  {
    path: "/visit",
    name: "智慧门卫",
    component: Layout,
    children: [
      { 
        path: "", 
        redirect: "visitGoOut"
      },
      {
        path: "visitorRegister",             
        component:visitorRegister,
        name:"员工考勤"
      },
      {
        path: "visitorMaterialize",             
        component:visitorMaterialize,
        name:"数据统计"
      },
      {
        path: "faceView",             
        component:faceView,
        name:"人脸库"
      },
      {
        path: "visitGoOut",             
        component:visitGoOut,
        name:"人员进出"
      },
      {
        path: "oldPeopleGoOut",             
        component:oldPeopleGoOut,
        name:"老人外出"
      },
      {
        path: "attendanceTotal",             
        component:attendanceTotal,
        name:"考勤统计"
      },
      {
        path: "goOutDetail",             
        component:goOutDetail,
        name:"老人外出详情"
      },
    ]
  },
];

export default routes;