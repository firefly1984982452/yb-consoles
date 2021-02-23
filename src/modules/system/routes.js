import Layout from '@/layouts/page';

const routes = [
  {
    path: '/system',
    name: '系统管理',
    component: Layout,
    children: [
      { //配置默认首页
        path: "",
        meta: { allow: "uban.sys.permission" },
        redirect: "role"
      }, {
        path: "resource",
        name: "资源管理",
        meta: { title: "资源管理", allow: "uban.sys.resource" },
        component: () => import( /* webpackChunkName: "group-system" */ './pages/resource')
      }, {
        path: "role",
        name: "角色管理",
        meta: { title: "角色管理", allow: "uban.sys.role" },
        component: () => import( /* webpackChunkName: "group-system" */ './pages/role')
      }, {
        path: "relation",
        name: "角色授权",
        meta: { title: "角色授权", allow: "uban.sys.relation" },
        component: () => import( /* webpackChunkName: "group-system" */ './pages/relation')
      }, {
        path: "userRole",
        name: "用户角色",
        meta: { title: "用户角色", allow: "uban.sys.userrole" },
        component: () => import( /* webpackChunkName: "group-system" */ './pages/userRole')
      }, {
        path: "tenant",
        name: "机构资源",
        meta: { title: "机构资源", allow: "uban.sys.tenant" },
        component: () => import( /* webpackChunkName: "group-system" */ './pages/tenant')
      }, {
        path: "users",
        name: "用户管理",
        meta: { title: "用户管理", allow: "uban.sys.user" },
        component: () => import( /* webpackChunkName: "group-system" */ './pages/user')
      }, {
        path: "account",
        name: "登录账号",
        meta: { title: "登录账号", allow: "uban.sys.account" },
        component: () => import( /* webpackChunkName: "group-system" */ './pages/account')
      },
    ]
  },
  {
    path: '/tools',
    name: '运维工具',
    component: Layout,
    children: [
      { //配置默认首页
        path: "",
        meta: {
          allow: "uban.tools"
        },
        redirect: "statlist"
      }, {
        path: "statlist",
        name: "statlist",
        meta: {
          title: "统计管理",
          allow: "uban.tools.statlist"
        },
        component: () => import( /* webpackChunkName: "group-stats" */ './stat/statlist')
      }
    ]
  }
];

export default routes;