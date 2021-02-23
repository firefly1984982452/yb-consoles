import Layout from '@/layouts/default';

const Bookings = () => import( /* webpackChunkName: "group-emergency" */ './pages/bookings');

const routes = [
  {
    path: "/emergency",
    name: "家属管理",
    component: Layout,
    children: [
      { 
        path: "", 
        redirect: "bookings"
      }, 
      {
        path: "bookings",
        component: Bookings,
        name: "预约探视"
      }
    ]
  }
];

export default routes;