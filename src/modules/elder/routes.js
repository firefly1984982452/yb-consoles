import Layout from '@/layouts/page';
import PrintLayout from '@/layouts/print';

const CheckInList = () => import(/* webpackChunkName: "group-elder" */ './pages/checkIn/checkInList')
const CheckInEdit = () => import(/* webpackChunkName: "group-elder" */ "./pages/checkIn/checkInEdit");
const CheckInEdit1 = () => import(/* webpackChunkName: "group-elder" */ './pages/checkIn/checkInEdit1')
const CheckInSee = () => import(/* webpackChunkName: "group-elder" */ './pages/checkIn/checkInSee')
const SeeAssess = () => import(/* webpackChunkName: "group-elder" */ './pages/checkIn/seeComponents/careAssess')
const ContractRecord = () => import(/* webpackChunkName: "group-elder" */ './pages/checkIn/editComponents/contractRecord')
const AgreeChange = () => import(/* webpackChunkName: "group-elder" */ './pages/change/agreeChange')
const ChangeList = () => import(/* webpackChunkName: "group-elder" */ './pages/change/changeList')
const ChangeService = () => import(/* webpackChunkName: "group-elder" */ './pages/change/firstServer')
const CheckoutList = () => import(/* webpackChunkName: "group-elder" */ './pages/elderCheckout/checkoutList')
const ToConfirmed = () => import(/* webpackChunkName: "group-elder" */ './pages/elderCheckout/toConfirmed')
const ElderPrint = () => import(/* webpackChunkName: "group-elder" */ './pages/print/form')
const PrintPreview = () => import(/* webpackChunkName: "group-elder" */ './pages/print/preview')
const checkoutPrintPreview = () => import(/* webpackChunkName: "group-elder" */ "./pages/print/checkoutPrintPreview");
const PrintCatalog = () => import(/* webpackChunkName: "group-elder" */ './pages/print/catalog') 
const PrintContract = () => import(/* webpackChunkName: "group-elder" */ './pages/print/contract') 
const PrintExContract = () => import(/* webpackChunkName: "group-elder" */ './pages/print/exContract')
// const PrintChange = () => import(/* webpackChunkName: "group-elder" */ './pages/print/change') 
// const PrintChange = () => import(/* webpackChunkName: "group-elder" */ './pages/print/change2') 
const PrintChange = () => import(/* webpackChunkName: "group-elder" */ './pages/print/change3') 
const PrintCare = () => import(/* webpackChunkName: "group-elder" */ './pages/print/checkin12')
// const PrintOut = () => import(/* webpackChunkName: "group-elder" */ './pages/print/checkOut')
const PrintOut = () => import(/* webpackChunkName: "group-elder" */ "./pages/elderCheckout/checkoutPrintForm");

const CheckList = () => import(/* webpackChunkName: "group-elder" */ './pages/askLeaveCheck/checkList')
const CheckSee = () => import(/* webpackChunkName: "group-elder" */ './pages/askLeaveCheck/checkSee')

const ContractList = () => import(/* webpackChunkName: "group-elder" */ './pages/contract/contractList')
const ContractListMore = () => import(/* webpackChunkName: "group-elder" */ './pages/contract/contractListMore')
const LongNurseRisk = () => import(/* webpackChunkName: "group-elder" */ './pages/nurse/longNurseRisk')
const LongNurseRiskList = () => import(/* webpackChunkName: "group-elder" */ './pages/nurse/longNurseRiskList')
const LongNurseRiskSet = () => import(/* webpackChunkName: "group-elder" */ './pages/nurse/longNurseRiskSet')

const CareAssessList = () => import(/* webpackChunkName: "group-elder" */ './pages/care/assessList')
const CareAssessEdit = () => import(/* webpackChunkName: "group-elder" */ './pages/care/assessEdit')
const CareAssessView = () => import(/* webpackChunkName: "group-elder" */ './pages/care/assessView')
const CareAssessOld = () => import(/* webpackChunkName: "group-elder" */ './pages/care/assessOld')
const CareAssessProject = () => import(/* webpackChunkName: "group-elder" */ './pages/care/assessProject')
const CareAssessReport = () => import(/* webpackChunkName: "group-elder" */ './pages/care/assessReport')
const CareAssessOldView = () => import(/* webpackChunkName: "group-elder" */ './pages/care/viewOld')
const CareAssessProjectView = () => import(/* webpackChunkName: "group-elder" */ './pages/care/viewProject')
const CareAssessReportView = () => import(/* webpackChunkName: "group-elder" */ './pages/care/viewReport')

// 预定房间
const BookingRoom = () => import(/* webpackChunkName: "group-elder" */ "./pages/bookingRoom/index");
const BookingRoomDetail = () => import(/* webpackChunkName: "group-elder" */ "./pages/bookingRoom/detail");
const AddBookingRoom = () => import(/* webpackChunkName: "group-elder" */ "./pages/bookingRoom/addBooking");

// 代购订单打印
const order = () => import(/* webpackChunkName: "group-elder" */ "./pages/print/order");

// 菜谱打印
const menuCollect = () => import(/* webpackChunkName: "group-elder" */ "./pages/print/menu");
const menuWeek = () => import(/* webpackChunkName: "group-elder" */ "./pages/print/menuWeek");
const menuElder = () => import(/* webpackChunkName: "group-elder" */ "./pages/print/menuElder");
const menuCook = () => import(/* webpackChunkName: "group-elder" */ "./pages/print/menuCook");

// 交班报告打印
const shiftReport = () => import(/* webpackChunkName: "group-elder" */ "./pages/print/shiftReport");

const CheckoutSum = () => import(/* webpackChunkName: "group-elder" */ "./pages/print/checkoutSum");

const routes = [
  {
    path: "/elder",
    name: "长者管理",
    component: Layout,
    children: [
      {
        //配置默认首页
        path: "",
        redirect: "checkin"
      },
      {
        path: "checkin",
        name: "入住列表",
        component: CheckInList
      },
      {
        path: "checkInEdit",
        name: "入住编辑",
        meta: { groupPath: "/elder/checkin" }, // 设置与左边的菜单项一致
        component: CheckInEdit1
        // component: CheckInEdit
      },
      {
        path: "checkInSee",
        name: "入住查看",
        meta: { groupPath: "/elder/checkin" }, // 设置与左边的菜单项一致
        component: CheckInSee
      },
      {
        path: "contractRecord",
        name: "评估列表",
        meta: { groupPath: "/elder/checkin" }, // 设置与左边的菜单项一致
        component: ContractRecord
      },
      {
        path: "change",
        name: "变更约定",
        component: ChangeList
      },
      {
        path: "changeList",
        name: "变更列表",
        meta: { groupPath: "/elder/change" }, // 设置与左边的菜单项一致
        // component: ChangeList
        component: AgreeChange
      },
      {
        path: "changeService",
        name: "变更服务",
        component: ChangeService
      },
      {
        path: "checkout",
        name: "离院列表",
        component: CheckoutList
      },
      {
        path: "toConfirmed",
        name: "离院确认",
        meta: { groupPath: "/elder/checkout" }, // 设置与左边的菜单项一致
        // component: ToConfirmed
        component: CheckInSee
      },
      {
        path: "checoutDeal",
        name: "离院办理",
        meta: { groupPath: "/elder/checkout" }, // 设置与左边的菜单项一致
        component: ToConfirmed
        // component: CheckInSee
      },
      {
        path: "checkoutPrintForm",
        name: "离院办理打印",
        component: PrintOut
      },
      {
        path: "leave",
        name: "请假列表",
        component: CheckList,
        meta: {
          keepAlive: true,
          isBack: false
        }
      },
      {
        path: "checkSee",
        name: "请假查看",
        meta: { groupPath: "/elder/leave" },
        component: CheckSee
      },
      {
        path: "checkin/print",
        name: "打印单据",
        component: ElderPrint
      },
      {
        path: "contract",
        name: "合同约定",
        component: ContractList,
        meta: {
          keepAlive: true,
          isBack: false
        }
      },
      {
        path: "contractList",
        name: "合同约定列表",
        component: ContractListMore
      },
      {
        path: "longNurseRisk",
        name: "长护险",
        component: LongNurseRisk,
        meta: {
          keepAlive: true,
          isBack: false
        }
      },
      {
        path: "longNurseRiskList",
        name: "长护险列表",
        component: LongNurseRiskList
      },
      {
        path: "LongNurseRiskSet",
        name: "长护险设置",
        component: LongNurseRiskSet
      },
      {
        path: "care/assessList",
        name: "照护评估列表",
        component: CareAssessList,
        meta: {
          keepAlive: true,
          isBack: false
        }
      },
      {
        path: "seeAssess",
        name: "评估列表详情",
        meta: { groupPath: "/elder/care/assessList" }, // 设置与左边的菜单项一致
        component: SeeAssess
      },
      {
        path: "care/assessEdit",
        name: "照护评估编辑",
        meta: { groupPath: "/elder/care/assessList" },
        component: CareAssessEdit
      },
      {
        path: "care/assessView",
        name: "照护评估查看",
        meta: { groupPath: "/elder/care/assessList" },
        component: CareAssessView
      },
      {
        path: "care/assessOld",
        name: "照护评估老人",
        meta: { groupPath: "/elder/care/assessList" },
        component: CareAssessOld
      },
      {
        path: "care/assessProject",
        name: "照护评估项目",
        meta: { groupPath: "/elder/care/assessList" },
        component: CareAssessProject
      },
      {
        path: "care/assessReport",
        name: "照护评估报告",
        meta: { groupPath: "/elder/care/assessList" },
        component: CareAssessReport
      },
      {
        path: "care/viewOld",
        name: "照护评估老人查看",
        meta: { groupPath: "/elder/care/assessList" },
        component: CareAssessOldView
      },
      {
        path: "care/viewProject",
        name: "照护评估老人报告查看",
        meta: { groupPath: "/elder/care/assessList" },
        component: CareAssessProjectView
      },
      {
        path: "care/viewReport",
        name: "照护评估老人报告查看",
        meta: { groupPath: "/elder/care/assessList" },
        component: CareAssessReportView
      },
      {
        path: "bookingRoom",
        name: "预定房间列表",
        component: BookingRoom,
      },
      {
        path: "/elder/bookingRoom/bookingRoomDetail",
        name: "预定房间查看",
        component: BookingRoomDetail
      },
      {
        path: "/elder/bookingRoom/addBookingRoom",
        name: "添加预定房间",
        component: AddBookingRoom
      }
    ]
  },
  {
    path: "/print/elder",
    name: "打印管理",
    component: PrintLayout,
    children: [
      {
        path: "preview",
        name: "打印预览",
        component: PrintPreview
      },
      {
        path: "checkoutPrintPreview",
        name: "离院打印预览",
        component: checkoutPrintPreview
      },
      {
        path: "catalog",
        name: "目录",
        component: PrintCatalog
      },
      {
        path: "contract",
        name: "入院合同",
        component: PrintContract
      },
      {
        path: "exContract",
        name: "延长合同",
        component: PrintExContract
      },
      {
        path: "care",
        name: "照护评估",
        component: PrintCare
      },
      {
        path: "change",
        name: "变更约定",
        component: PrintChange
      },
      // {
      //   path: "checkOut",
      //   name: "离院办理打印",
      //   component: PrintOut
      // },
      {
        path: "order",
        name: "代订代购打印",
        component: order
      },
      {
        path: "menuCollect",
        name: "菜单汇总打印",
        component: menuCollect
      },
      {
        path: "menuElder",
        name: "菜单汇总打印",
        component: menuElder
      },
      {
        path: "menuCook",
        name: "菜单汇总打印",
        component: menuCook
      },
      {
        path: "menuWeek",
        name: "菜单打印",
        component: menuWeek
      },
      {
        path: "shiftReport",
        name: "交班报告打印",
        component: shiftReport
      },
      {
        path: "checkout-sum",
        name: "出院小结打印",
        component: CheckoutSum
      },
    ]
  }
];

export default routes;