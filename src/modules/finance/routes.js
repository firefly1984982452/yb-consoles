import Layout from '@/layouts/page';
import PrintLayout from '@/layouts/print';

const electronic = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/index');
const elelist = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/list');
const elelist1 = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/list1');
const costdetail = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/cost-detail');
const receivable = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/receivable');
const realincome = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/real-income');
const arrearage = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/arrearage');

const peddingdetail = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/peddingdetail');
const alreadydetail = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/alreadydetail');
const print = () => import(/* webpackChunkName: "group-finance" */ './pages/electronic/print');

const leave = () => import(/* webpackChunkName: "group-finance" */ './pages/leave');
const elderly = () => import(/* webpackChunkName: "group-finance" */ './pages/elderly/index');
const elderlyindex = () => import(/* webpackChunkName: "group-finance" */ './pages/elderly/elderly');
const elderlychange = () => import(/* webpackChunkName: "group-finance" */ './pages/elderly/change');
// const charge = () => import(/* webpackChunkName: "group-finance" */ './pages/charge');
const charge = () => import(/* webpackChunkName: "group-finance" */ './pages/charge2');

const routes = [
  {
    path: "/finance",
    name: "结算管理",
    component: Layout,
    children: [
      { 
        path: "", 
        redirect: "electronic",
        name:"长者账单"
      }, 
      {
        path: "electronic",             
        component:electronic,
        name:"长者帐单",
        children:[
          {
            path:'',
            component:elelist,
            name:"长者帐单",
            meta:{
              keepAlive: true
            }
          },        
          {
            path:'peddingdetail/:id',
            name: '审核详情',
            component:peddingdetail
          },  
          {
            path:'alreadydetail/:id',
            component:alreadydetail
          },  
        ]
      },
      
      {
        path: "cost-detail",
        name:"费用明细",
        component: costdetail,
      },
      {
        path: "receivable",
        name:"本月应收",
        component: receivable,
      },
      {
        path: "realincome",
        name:"实收统计",
        component: realincome,
      },
      {
        path: "arrearage",
        name:"欠费明细",
        component: arrearage,
      },
      {
        path: "electronic1",
        name:"未出账单",
        component: elelist1,
        meta:{
          keepAlive: true
        }
      },
      {
        path: "leave",
        name:"请假记帐",
        component: leave
      },      
      {
        path: "elderly",     
        component: elderly,
        children:[
          {path:'',name:'老人账户',component: elderlyindex,
        meta:{
          keepAlive: false
        }},
          {path:'detail/:id/:type',name:'变更详情',component:elderlychange}

        ]
      },  
      {
        path: "charge",
        name:"收费项目",
        component: charge
      }     
    ]
  },
  {
    path:"/print",
    component:PrintLayout,
    children:[          
      {
        path:'electronic/:id',
        name:'打印预览',
        component:print}
    ]
  }  
];

export default routes;