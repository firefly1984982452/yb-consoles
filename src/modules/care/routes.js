import Layout from '@/layouts/page';

const Accident = () => import( /* webpackChunkName: "group-care" */ "./pages/accident/index");
const Goods = () => import( /* webpackChunkName: "group-care" */ "./pages/goods/index");
const Order = () => import( /* webpackChunkName: "group-care" */ "./pages/order/index");
const Project = () => import( /* webpackChunkName: "group-care" */ "./pages/project/index");
const Configuration = () => import( /* webpackChunkName: "group-care" */ "./pages/nurse/child/configuration");
const ConfigurationRoom = () => import( /* webpackChunkName: "group-care" */ "./pages/nurse/child/configurationRoom");
const Service = () => import( /* webpackChunkName: "group-care" */ "./pages/service/index");
const NurseProject = () => import(/* webpackChunkName: "group-care" */ "./pages/nurse/project");
const Plan = () => import(/* webpackChunkName: "group-care" */ "./pages/nurse/plan");
const PlanElder = () => import(/* webpackChunkName: "group-care" */ "./pages/nurse/plan-clild/elder");
const PlanElderDetail = () => import(/* webpackChunkName: "group-care" */ "./pages/nurse/plan-clild/elder-detail");
const Duty = () => import(/* webpackChunkName: "group-care" */ "./pages/nurse/duty");
const DutyDetail = () => import(/* webpackChunkName: "group-care" */ "./pages/nurse/duty-detail");
const ProChild = () => import(/* webpackChunkName: "group-care" */ "./pages/nurse/child/proChild");
const checkTour = () => import(/* webpackChunkName: "group-care" */ "./pages/checkTour/index");
const checkTourDetail = () => import(/* webpackChunkName: "group-care" */ "./pages/checkTour/detail");
const checkTourSet = () => import(/* webpackChunkName: "group-care" */ "./pages/checkTour/set");
const shiftChange = () => import(/* webpackChunkName: "group-care" */ "./pages/shiftChange/index");
const shiftChangeDetail = () => import(/* webpackChunkName: "group-care" */ "./pages/shiftChange/detail");
const shiftSet = () => import(/* webpackChunkName: "group-care" */ "./pages/shiftChange/shiftSet");


const routes = [
  {
    path: "/care",
    name: "智慧护理",
    component: Layout,
    children: [
      {
        //配置默认首页
        path: "",
        redirect: "duty"
      },
      {
        path: "accident",
        name: "事故登记",
        component: Accident
      },
      {
        path: "project",
        name: "护理项目",
        component: NurseProject
      },
      {
        path: "project/Configuration",
        name: "护理项目配置",
        component: Configuration
      },
      {
        path: "project/ConfigurationRoom",
        name: "房间项目配置",
        component: ConfigurationRoom
      },
      {
        path: "plan",
        name: "护理计划",
        component: Plan
      },
      {
        path: "plan/ProChild",
        name: "长者服务项目详情",
        component: ProChild
      },
      {
        path: "PlanElder",
        name: "护理计划1",
        component: PlanElder
      },
      {
        path: "plan/PlanElderDetail",
        name: "护理计划详情",
        component: PlanElderDetail
      },
      {
        path: "duty",
        name: "护理任务",
        component: Duty
      },
      {
        path: "duty/DutyDetail",
        name: "护理任务详情",
        component: DutyDetail
      },
      {
        path: "checkTour",
        name: "查房巡视",
        component: checkTour
      },
      {
        path: "checkTour/detail",
        name: "查房巡视详情",
        component: checkTourDetail
      },
      {
        path: "checkTour/set",
        name: "查房时段设置",
        component: checkTourSet
      },
      {
        path: "shiftChange",
        name: "交接班",
        component: shiftChange
      },
      {
        path: "shiftChange/detail",
        name: "交接班详情",
        component: shiftChangeDetail
      },
      {
        path: "shiftChange/shiftSet",
        name: "交接班设置",
        component: shiftSet
      }
    ]
  },
  {
    path: "/carer",
    name: "住养管理",
    component: Layout,
    children: [
      {
        //配置默认首页
        path: "",
        redirect: "goods"
      },
      {
        path: "goods",
        name: "物品发放",
        component: Goods
      },
      {
        path: "order",
        name: "代订代购",
        component: Order
      },
      {
        path: "service",
        name: "住养服务",
        component: Service
      },
      {
        path: "project",
        name: "消费项目",
        component: Project
      }
    ]
  }
];

export default routes;