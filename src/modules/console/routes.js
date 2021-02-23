import Layout from '@/layouts/console';

const Login = () => import(/* webpackChunkName: "group-console" */ './pages/login')
const Index = () => import(/* webpackChunkName: "group-console" */ './pages/index')
const NotFound = () => import(/* webpackChunkName: "group-console" */ './pages/404')
const Forbidden = () => import( /* webpackChunkName: "group-console" */ './pages/403')

const routes = [
  {
    path: "/console",
    name: "控制台",
    meta: { allow: "*" },
    component: Layout,
    children: [
      {
        path: "",
        name: "控制台首页",
        meta: { allow: "?" },
        component: Index
      },
      {
        path: "login",
        name: "PassportLogin",
        meta: { title: "登录", allow: "*" },
        component: Login
      },
      {
        path: "404",
        name: "404",
        meta: { allow: "*" },
        component: NotFound
      }, {
        path: "403",
        name: "403",
        meta: { allow: "*" },
        component: Forbidden
      }
    ]
  }
];

export default routes;