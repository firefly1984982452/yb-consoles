import Layout from '@/layouts/page';

const menuSet = () => import(/* webpackChunkName: "group-diet" */ "./pages/menuSet/index");
const menuWeekSet = () => import( /* webpackChunkName: "group-diet" */ "./pages/menuWeekSet/index");
const menuWeekChef = () => import( /* webpackChunkName: "group-diet" */ "./pages/menuWeekChef/index");
const menuCollect = () => import( /* webpackChunkName: "group-diet" */ "./pages/menuCollect/index");
const menuElder = () => import( /* webpackChunkName: "group-diet" */ "./pages/menuElder/index");


const routes = [
  {
    path: "/diet",
    name: "智慧护理",
    component: Layout,
    children: [
      {
        //配置默认首页
        path: "",
        redirect: "menuCollect"
      },
      {
        path: "menuSet",
        name: "菜品配置",
        component: menuSet
      },
      {
        path: "menuWeekSet",
        name: "菜谱配置",
        component: menuWeekSet
      },
      {
        path: "menuWeekChef",
        name: "厨师配置",
        component: menuWeekChef
      },
      {
        path: "menuCollect",
        name: "菜单汇总",
        component: menuCollect
      },
      {
        path: "menuElder",
        name: "长者菜单",
        component: menuElder
      },
      
    ]
  },
];

export default routes;