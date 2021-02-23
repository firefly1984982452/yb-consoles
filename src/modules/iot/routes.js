const iotPlatformFire = () => import( /* webpackChunkName: "group-iot" */ './iotPlatformFire');
const routes = [{
  path: "/iotPlatform/fire",
  component: iotPlatformFire,
  name: "智慧消防平台",
}];

export default routes;
