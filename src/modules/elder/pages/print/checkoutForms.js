// 打印表单列表
export default [
  {
    title: "全选",
    name: "base",
    children: [
      {
        title: "目录",
        name: "checkoutCatalog",
        singleLine: true,
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkoutCatalog")
      },
      {
        title: "养老服务终止记录",
        name: "over",
        singleLine: true,
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkout2")
      },
      {
        title: "出院流转表",
        name: "cahnge",
        singleLine: true,
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkout1")
      },
      {
        title: "长者个人物品移交签收表",
        name: "transform",
        singleLine: true,
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkout3")
      }
    ]
  }
];
