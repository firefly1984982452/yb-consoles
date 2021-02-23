import Layout from '@/layouts/page';

const Organization = () => import(/* webpackChunkName: "group-oa" */ './pages/organization')
const Department = () => import(/* webpackChunkName: "group-oa" */ './pages/department')
const Job = () => import(/* webpackChunkName: "group-oa" */ './pages/job')
const Bed = () => import(/* webpackChunkName: "group-oa" */ './pages/bed')
const Employee = () => import(/* webpackChunkName: "group-oa" */ "./pages/employee");
const EmployeeEdit = () => import(/* webpackChunkName: "group-oa" */ "./pages/employeeEdit");
const EmployeeContract = () => import(/* webpackChunkName: "group-oa" */ "./pages/employeeContract");
const EmployeeCertificate = () => import(/* webpackChunkName: "group-oa" */ "./pages/employeeCertificate");
const EmployeeAttachment = () => import(/* webpackChunkName: "group-oa" */ "./pages/employeeAttachment");
const EmployeeViewDetail = () => import(/* webpackChunkName: "group-oa" */ "./pages/employeeViewDetail");
const Bulletin = () => import( /* webpackChunkName: "group-oa" */ "./pages/bulletin/index");

const ScheduleTime = () => import(/* webpackChunkName: "group-oa" */ "./pages/scheduleTime");
const ScheduleTemplate = () => import(/* webpackChunkName: "group-oa" */ "./pages/scheduleTemplate");
const EditScheduleTemplate = () => import(/* webpackChunkName: "group-oa" */ "./pages/editScheduleTemplate");
const Attendance = () => import(/* webpackChunkName: "group-oa" */ "./pages/attendance");
const ScheduleManagement = () => import(/* webpackChunkName: "group-oa" */ "./pages/scheduleManagement");
const Responsibility = () => import(/* webpackChunkName: "group-oa" */ "./pages/responsibility");

const Building = () => import( /* webpackChunkName: "group-oa" */ "./pages/building");
const Area = () => import( /* webpackChunkName: "group-oa" */ "./pages/area");
const Room = () => import( /* webpackChunkName: "group-oa" */ "./pages/room");

const routes = [
  {
    path: "/oa",
    name: "智慧办公",
    component: Layout,
    children: [
      { //配置默认首页
        path: "",
        redirect: "organization"
      },
      {
        path: "organization",
        name: "机构管理",
        component: Organization
      },
      {
        path: "department",
        name: "部门管理",
        component: Department
      },
      {
        path: "job",
        name: "岗位管理",
        component: Job
      },
      {
        path: "bed",
        name: "床位配置",
        component: Bed
      },
      {
        path: "employee",
        name: "员工档案列表",
        component: Employee
      },
      {
        path: "employee/edit",
        name: "编辑员工档案",
        component: EmployeeEdit
      },
      {
        path: "employee/contract",
        name: "编辑员工合同",
        component: EmployeeContract
      },
      {
        path: "employee/certificate",
        name: "编辑员工证书",
        component: EmployeeCertificate
      },
      {
        path: "employee/attachment",
        name: "编辑员工合同",
        component: EmployeeAttachment
      },
      {
        path: "employee/viewDetail",
        name: "查看员工档案",
        component: EmployeeViewDetail
      }, {
        path: "schedule/time",
        name: "排班设置",
        component: ScheduleTime
      }, {
        path: "schedule/time/template",
        name: "排班模板",
        component: ScheduleTemplate
      }, {
        path: "schedule/time/template/edit",
        name: "修改模板",
        component: EditScheduleTemplate
      }, {
        path: "attendance",
        name: "考勤记录",
        component: Attendance
      }, {
        path: "schedule/management",
        name: "排班管理",
        component: ScheduleManagement
      }, {
        path: "bulletin/index",
        name: "通知公告",
        component: Bulletin
      }, {
        path: "responsibility",
        name: "职责关系",
        component: Responsibility
      }, {
        path: "building",
        name: "楼区管理",
        component: Building
      }, {
        path: "building/area",
        name: "区域管理",
        component: Area
      }, {
        path: "room",
        name: "房间管理",
        component: Room
      }
    ]
  }
];

export default routes;