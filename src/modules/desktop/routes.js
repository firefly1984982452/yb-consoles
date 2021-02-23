import Layout from '@/layouts/default';

const Select = () => import( /* webpackChunkName: "group-desktop" */ './pages/select')
const Default = () => import(/* webpackChunkName: "group-desktop" */ './pages/default')
const Leader = () => import(/* webpackChunkName: "group-desktop" */ './pages/leader')
const Index = () => import(/* webpackChunkName: "group-desktop" */ './pages/index')
const Finance = () => import(/* webpackChunkName: "group-desktop" */ './pages/finance')
const Bussiness = () => import(/* webpackChunkName: "group-desktop" */ './pages/bussiness')

const routes = [
  {
    path: "/desktop",
    name: "工作台",
    component: Layout,
    children: [
      {
        path: "",
        meta: { title: "首页" },
        component: Select
      },
      {
        path: "default",
        meta: { title: "首页", nofooter: true },
        component: Default
      },
      {
        path: "index",
        meta: { title: "业务工作台", allow: "uban.oa.desktop.biz" },
        component: Index
      },
      {
        path: "finance",
        meta: { title: "财务工作台", allow: "uban.oa.desktop.finance" },
        component: Finance
      },
      {
        path: "bussiness",
        meta: { title: "业务工作台", allow: "uban.oa.desktop.biz" },
        component: Bussiness
      },
      {
        path: "leader",
        meta: { title: "院长工作台", allow: "uban.oa.desktop.leader" },
        component: Leader
      }
    ]
  }
];

export default routes;