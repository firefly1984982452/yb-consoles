// 打印表单列表
export default [
  {
    title: "基本档案",
    name: "base",
    children: [
      {
        title: "目录",
        name: "catalog",
        singleLine: true,
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./catalogTable")
      },
      {
        title: "入院申请表",
        name: "checkin",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin")
      },
      {
        title: "调查访问表",
        name: "checkin01",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin01")
      },
      {
        title: "审批表",
        name: "checkin02",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin02")
      },
      {
        title: "入院通知单",
        name: "checkin03",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin03")
      },
      {
        title: "照护等级评估材料",
        name: "checkin12",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin12")
      },
      {
        title: "养老服务合同",
        name: "contract",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./contract")
      },
      {
        title: "体验报告（或近期出院小结）",
        name: "checkin04",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin04")
      },
      {
        title: "首次服务项目确认表",
        name: "checkin05",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin05")
      },
      // {
      //   title: "功能独立性评估表",
      //   name: "checkin06",
      //   component: () =>
      //     import(/* webpackChunkName: "group-elder" */ "./checkin06")
      // },
      {
        title: "老人外出约定",
        name: "checkin07",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin07")
      },
      {
        title: "长者住养告知书",
        name: "checkin09",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin09")
      },
      {
        title: "委托发放医疗药品约定",
        name: "checkin08",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin08")
      },
      {
        title: "入院介绍",
        name: "checkin10",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin10")
      },
      {
        title: "老人长护险事宜的知情告知书",
        name: "checkin11",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./checkin11")
      },
      {
        title: "老年人身份证及户口簿",
        name: "photo1",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./photo1")
      },
      {
        title: "担保人身份证及联系方式",
        name: "photo2",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./photo2")
      },
      {
        title: "变更项目确认表",
        name: "change",
        type: "hidden",
        component: () =>
          import(/* webpackChunkName: "group-elder" */ "./change")
      }
    ]
  },
  // {
  //   title: "图片档案",
  //   name: "photo",
  //   children: [
  //   ]
  // },
  // {
  //   title: "其他档案",
  //   name: "other",
  //   children: [
  //     {
  //       title: "安置通知单（食堂）",
  //       name: "other1",
  //       component: () =>
  //         import(/* webpackChunkName: "group-elder" */ "./other1")
  //     }
  //   ]
  // }
];