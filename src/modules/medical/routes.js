import Layout from "@/layouts/page";

// 药房管理
const drugStorageIndex = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/index");
const storeCheck = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/inventoryQuery/storeCheck"); // 库存查询
const purchaseStore = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/procurementWarehous/purchaseStore"); // 采购入库
const addPurchaseDan = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/procurementWarehous/addPurchaseDan"); // 采购入库-添加purchaseDetail
const purchaseDetail = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/procurementWarehous/purchaseDetail"); // 采购入库-详情
const unInstoreList = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/medicineUninstore/unInstoreList"); // 药品出库
const unInstoreDetail = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/medicineUninstore/unInstoreDetail"); // 药品出库-详情
const Medicine = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/medicineManage/medicine"); // 药品管理
const InvalidMedicine = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/medicineManage/invalidMedicine"); // 药品回收站
const addMedicine = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/medicineManage/addMedicine"); // 药品管理- 添加

const supplierList = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/supplierManage/supplierList"); // 供应商
const addSupplier = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/supplierManage/addSupplier"); // 供应商addSupplier
const editSupplier = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/supplierManage/editSupplier"); // 供应商editSupplier
const supplierDetail = () => import( /* webpackChunkName: "group-medical" */ "./pages/drugStorage/medicineManage/supplierManage/supplierDetail"); // 供应商supplierDetail

const HealthFile = () => import( /* webpackChunkName: "group-medical" */ "./pages/healthFile/index");
const HealthFileDetail = () => import( /* webpackChunkName: "group-medical" */ "./pages/healthFile/detail");
const AdviceMng = () => import( /* webpackChunkName: "group-medical" */ "./pages/yizhuguanli/index");
const ElderCareList = () => import( /* webpackChunkName: "group-medical" */ "./pages/elderCare/index");
const AddEvaluation = () => import( /* webpackChunkName: "group-medical" */ "./pages/elderCare/evaluate");
const AddLeaveHandle = () => import( /* webpackChunkName: "group-medical" */ "./pages/elderCare/leaveAdd");

const TemplateIndex = () => import( /* webpackChunkName: "group-medical" */ './pages/template/templateIndex')
const WardCategory = () => import( /* webpackChunkName: "group-medical" */ './pages/template/wardCategory')
const History = () => import( /* webpackChunkName: "group-medical" */ './pages/template/history')
const TemplateContent = () => import( /* webpackChunkName: "group-medical" */ './pages/template/templateContent')
const HistoryTemplate = () => import( /* webpackChunkName: "group-medical" */ './pages/template/historyTemplate')
const AdviceItems = () => import( /* webpackChunkName: "group-medical" */ './pages/template/adviceItems')
const DocumentList = () => import( /* webpackChunkName: "group-medical-document" */ './pages/health/document')
const DocumentDetail = () => import( /* webpackChunkName: "group-medical-document" */ './pages/health/documentDetail')
const EditDocument = () => import( /* webpackChunkName: "group-medical-document" */ './pages/health/editDocument')
const EditDocumentData = () => import( /* webpackChunkName: "group-medical" */ './pages/health/editDocumentData')
const EditDocumentDiagnosis = () => import( /* webpackChunkName: "group-medical" */ './pages/health/editDocumentDiagnosis')

// 查房
const checkRoom = () => import( /* webpackChunkName: "group-medical" */ './pages/ward/checkRoom');
const checkRoomDetail = () => import( /* webpackChunkName: "group-medical" */ './pages/ward/checkRoomDetail');
const rules = () => import( /* webpackChunkName: "group-medical" */ './pages/ward/rules');

//医嘱
const Advice = () => import( /* webpackChunkName: "group-medical-advice" */ './pages/advice/advice');
const Recipel = () => import( /* webpackChunkName: "group-medical-recipel" */ './pages/advice/recipel');
const Clinic = () => import( /* webpackChunkName: "group-medical-clinic" */ './pages/advice/clinic');

//出入库
const StoreInMain = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/storeInMain');
const StoreOutMain = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/storeOutMain');
const EditPurchase = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/editPurchase');
const PurchaseDetail = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/purchaseDetail');

const EditStore = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/editStore');
const StoreDetail = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/storeDetail');
const StoreList = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/storeList');

const EditCheck = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/editCheck');
const CheckDetail = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/checkDetail');
const CheckList = () => import( /* webpackChunkName: "group-medical-store" */ './pages/drugStorage/store/checkList');
// 病例处方

const CaseIndex = () => import( /* webpackChunkName: "group-medical-advice" */ './pages/casesPrescription/index');
const CaseDetail = () => import( /* webpackChunkName: "group-medical-advice" */ './pages/casesPrescription/detail');

const routes = [{
  path: "/medical",
  name: "智慧医护",
  component: Layout,
  children: [{
      //配置默认首页
      path: "",
      redirect: "elderCareList"
    },
    {
      path: "health-file",
      name: "健康档案",
      component: HealthFile
    },
    {
      path: "health-file-detail",
      name: "健康档案查看",
      component: HealthFileDetail
    },
    {
      path: "yizhuguanli",
      name: "医嘱管理",
      component: AdviceMng
    },
    {
      path: "elderCareList",
      name: "长者评估",
      component: ElderCareList,
      meta:{
        keepAlive:true
      }
    },
    {
      path: "elderCareList/addEvaluation",
      name: "添加长者评估",
      component: AddEvaluation
    },
    // AddLeaveHandle
    {
      path: "elderCareList/addLeaveHandle",
      name: "添加离院小结",
      component: AddLeaveHandle
    },
    {
      path: "elderCareList/leaveHandleDetail",
      name: "离院办离详情",
      component: AddLeaveHandle
    },
    {
      path: "drugStorage",
      name: "药库管理首页",
      redirect: "drugStorage/index",
    },
    {
      path: "drugStorage/index",
      name: "药库管理首页",
      component: drugStorageIndex
    }, {
      path: "drugStorage/storeCheck",
      name: "库存查询",
      component: storeCheck
    }, {
      path: "drugStorage/purchaseStore",
      name: "采购入库",
      component: purchaseStore
    }, {
      path: "drugStorage/addPurchaseDan",
      name: "新增采购单",
      component: addPurchaseDan
    }, {
      path: "drugStorage/purchaseDetail",
      name: "采购单详情",
      component: purchaseDetail
    }, {
      path: "drugStorage/unInstoreList",
      name: "药品出库",
      component: unInstoreList
    }, {
      path: "drugStorage/unInstoreDetail",
      name: "药品出库详情",
      component: unInstoreDetail
    }, {
      path: "drugStorage/medicine",
      name: "药品管理",
      component: Medicine
    }, {
      path: "drugStorage/medicine/invalid",
      name: "药品加收站",
      component: InvalidMedicine
    }, {
      path: "drugStorage/addMedicine",
      name: "新增药品",
      component: addMedicine
    }, {
      path: "drugStorage/supplierList",
      name: "供应商",
      component: supplierList
    }, {
      path: "drugStorage/addSupplier",
      name: "新增供应商",
      component: addSupplier
    }, {
      path: "drugStorage/editSupplier",
      name: "编辑供应商",
      component: editSupplier
    }, {
      path: "drugStorage/supplierDetail",
      name: "供应商详情",
      component: supplierDetail
    }, {
      path: "template",
      name: "模板字典首页",
      component: TemplateIndex
    },
    {
      path: "template/wardCategory",
      name: "查房描述模板",
      component: WardCategory
    }, {
      path: "template/history",
      name: "病史项目字典",
      component: History
    }, {
      path: "template/templateContent",
      name: "其它模板",
      component: TemplateContent
    }, {
      path: "health/document",
      name: "健康档案",
      component: DocumentList
    },
    {
      path: "health/document/detail",
      name: "健康信息首页",
      component: DocumentDetail
    }, {
      path: "health/document/edit",
      name: "编辑健康档案",
      component: EditDocument
    }, {
      path: "health/document/data",
      name: "编辑健康档案数据",
      component: EditDocumentData
    }, {
      path: "health/document/diagnosis",
      name: "编辑健康档案诊断计划",
      component: EditDocumentDiagnosis
    }, {
      path: "template/historyTemplate",
      name: "病史项目模板",
      component: HistoryTemplate
    }, {
      path: "template/adviceItems",
      name: "医嘱项目",
      component: AdviceItems
    },
    {
      path: "checkRoom",
      component: checkRoom,
      name: "查房列表",
    },
    {
      path: "checkRoomDetail",
      component: checkRoomDetail,
      name: "查房详情"
    },
    {
      path: "checkRoomRules",
      component: rules,
      name: "查房规则"
    },
    {
      path: "advice",
      component: Advice,
      name: "医嘱管理"
    },
    {
      path: "recipel",
      component: Recipel,
      name: "处方管理"
    },
    {
      path: "clinic",
      component: Clinic,
      name: "门诊管理"
    },
    {
      path: "drugStorage/store/storeInMain",
      component: StoreInMain,
      name: "采购入库"
    },
    {
      path: "drugStorage/store/storeOutMain",
      component: StoreOutMain,
      name: "药品出库"
    }, {
      path: "drugStorage/store/editPurchase",
      component: EditPurchase,
      name: "编辑采购单"
    }, {
      path: "drugStorage/store/purchaseDetail",
      component: PurchaseDetail,
      name: "采购单详情"
    }, {
      path: "drugStorage/store/editStore",
      component: EditStore,
      name: "修改出入库单"
    }, {
      path: "drugStorage/store/storeDetail",
      component: StoreDetail,
      name: "出入库单详情"
    }, {
      path: "drugStorage/store/storeList",
      component: StoreList,
      name: "出入库单列表"
    }, {
      path: "drugStorage/store/editCheck",
      component: EditCheck,
      name: "修改盘库单"
    }, {
      path: "drugStorage/store/checkDetail",
      component: CheckDetail,
      name: "盘库单详情"
    }, {
      path: "drugStorage/store/checkList",
      component: CheckList,
      name: "盘库单列表"
    }, {
      path: "case-index",
      component: CaseIndex,
      name: "病例处方",
      meta: {
        keepAlive: true
      }
    },
    {
      path: "case-detail",
      component: CaseDetail,
      name: "处方详情"
    },
  ]
}];

export default routes;
