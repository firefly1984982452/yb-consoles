import Layout from "@/layouts/page";

//活动
const Activity = () => import( /* webpackChunkName: "group-activity" */ './activity');
const Point = () => import( /* webpackChunkName: "group-activity" */ './point');
const Project = () => import( /* webpackChunkName: "group-activity" */ './project/index');
const Show = () => import( /* webpackChunkName: "group-activity" */ './show/showList');

const routes = [{
  path: "/activity",
  name: "活动管理",
  component: Layout,
  children: [{
    // 配置默认首页
    path: "",
    redirect: "1"
  }, {
    path: "1",
    name: "开心锻炼",
    component: Activity
  }, {
    path: "1/project",
    name: "开心项目",
    component: Project
  }, {
    path: "point",
    name: "积分榜",
    component: Point
  }, , {
    path: "show",
    name: "活动展示",
    component: Show
  }]
}];

export default routes;
