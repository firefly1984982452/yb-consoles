import Layout from "@/layouts/page";

const longNursingRisksList = () =>
  import(
    /* webpackChunkName: "group-subsidy" */ "./pages/longNursingRisksList"
  );
const SubsidysetUpList = () =>
  import(/* webpackChunkName: "group-subsidy" */ "./pages/subsidySetting/list");
const SubsidysetUpDetail = () =>
  import(
    /* webpackChunkName: "group-subsidy" */ "./pages/subsidySetting/detail"
  );

const BonuSubsidyList = () =>
  import(/* webpackChunkName: "group-subsidy" */ "./pages/bonusSubsidy/list");

const BonuSubsidyDetail = () =>
  import(/* webpackChunkName: "group-subsidy" */ "./pages/bonusSubsidy/detail");
const SubsidyList = () =>
  import(/* webpackChunkName: "group-subsidy" */ "./pages/staffSubsidy/list");
const SubsidyDetail = () =>
  import(/* webpackChunkName: "group-subsidy" */ "./pages/staffSubsidy/detail");
const routes = [
  {
    path: "/subsidy",
    name: "政府补贴",
    component: Layout,
    children: [
      {
        path: "",
        redirect: "longNursingRisksList"
      },
      {
        path: "subsidyList",
        component: SubsidyList,
        name: "员工补贴"
      },
      {
        path: "subsidyList/subsidyDetail",
        component: SubsidyDetail,
        name: "员工补贴数据"
      },
      {
        path: "longNursingRisksList",
        component: longNursingRisksList,
        name: "长护险"
      },
      {
        path: "subsidysetUpList",
        component: SubsidysetUpList,
        name: "补贴设置",
      },
      {
        path: "subsidysetUpList/subsidysetUpDetail",
        component: SubsidysetUpDetail,
        name: "补贴标准编辑"
      },
      {
        path: "bonuSubsidyList",
        component: BonuSubsidyList,
        name: "以奖代补"
      },
      {
        path: "bonuSubsidyList/bonuSubsidyDetail",
        component: BonuSubsidyDetail,
        name: "以奖代补明细"
      }
    ]
  }
];

export default routes;
