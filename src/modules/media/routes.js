import Layout from '@/layouts/page';

const index = () => import(/* webpackChunkName: "group-media" */ "./pages/index");
const content = () => import(/* webpackChunkName: "group-media" */ "./pages/content");

const routes = [
  {
    path: "/media",
    name: "媒体管理",
    component: Layout,
    children: [
      {
        //配置默认首页
        path: "",
        redirect: "index"
      },
      {
        path: "index",
        name: "专辑管理",
        component: index
      },
      {
        path: "/media/content",
        name: "专辑内容",
        component: content
      }
    ]
  },
];

export default routes;