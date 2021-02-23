<template>
  <div class="live-table">
    <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
      <el-table-column label="姓名/身份证" min-width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.elderName }}</div>
          <div>{{ scope.row.cardNo }}</div>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80" prop="gender"></el-table-column>
      <el-table-column label="年龄" width="100" prop="age"></el-table-column>
      <el-table-column prop="checkinNo" label="入院编号" align="center"></el-table-column>
      <el-table-column prop="checkinDate" label="入院日期" align="center"></el-table-column>
      <el-table-column prop="checkoutRemark" label="离院原因" align="center"></el-table-column>
      <el-table-column prop="checkoutDate" label="离院日期" align="center"></el-table-column>
      <el-table-column label="离院小结" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.formStatus == 1">
            <el-tooltip class="item" effect="dark" :content="scope.row.formHandlerName" placement="top">
              <el-button size="mini">
                <i class="iconfont iconjichutubiao-yiwancheng" style="color:#5eb300;"></i>
              </el-button>
            </el-tooltip>
            <div>{{ scope.row.formHandleTime }}</div>
          </span>
          <span v-else>
            <!-- <i class="iconfont iconjichutubiao-dengdaizhong" style="color:grey;"></i> -->
            <div style="color:#ED7268">待录入</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="离院交接" min-width="100" prop="firstEv">
        <template slot-scope="scope">
          <span v-if="scope.row.flowStatus == 1">
            <el-tooltip class="item" effect="dark" :content="scope.row.handlerName" placement="top">
              <el-button size="mini">
                <i class="iconfont iconjichutubiao-yiwancheng" style="color:#5eb300;"></i>
              </el-button>
            </el-tooltip>
            <div>{{ scope.row.handleTime }}</div>
          </span>
          <span v-else>
            <div style="color:#ED7268">待完成</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.flowStatus == 1 || scope.row.formStatus == 1" class="item" effect="dark" content="打印" placement="top">
            <el-button size="mini" @click="print(scope.row)">
              <i class="iconfont iconcaozuotubiao-dayin"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 200 " class="item" effect="dark" content="查看" placement="top">
            <el-button size="mini" @click="check(scope.row)">
              <i class="iconfont iconcaozuotubiao-chakan"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.status !== 200" class="item" effect="dark" content="编辑" placement="top">
            <el-button size="mini" @click="edit(scope.row)">
              <i class="iconfont iconcaozuotubiao-bianji"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
    <el-dialog  style="width:420mm" class="dialog-print" title="" center :visible.sync="dialogFormVisible">
      <div ref="mainContent" class="print-content" id="print-content">
        <table border="0" style="font-size:9pt;padding: 20px; " width="100%" id="checkout-table" align="center">
          <thead>
            <tr>
              <td align="center" style="font-weight:bold;border-bottom:1px solid rgba(0,0,0,.4)">
                <el-row class="page-header">
                  <el-col :span="3">
                    姓名
                  </el-col>
                  <el-col :span="3">
                    {{ form.elderName }}
                  </el-col>
                  <el-col :span="3">
                    病区
                  </el-col>
                  <el-col :span="3">
                    {{ form.area }}
                  </el-col>
                  <el-col :span="3">
                    房间床位
                  </el-col>
                  <el-col :span="3"> {{ form.roomName }}-{{ form.bedName }} </el-col>
                  <el-col :span="3">
                    住院号
                  </el-col>
                  <el-col :span="3">
                    {{ form.checkinNo }}
                  </el-col>
                </el-row>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <h2 class="title" style="text-align:center;font-size:25px;padding:30px 0 15px 0;">{{ form.tenantName }}</h2>
                <h4 v-if="form.formType === 0 " style="text-align:center;margin-bottom:20px;font-size:16px">出院小结</h4>
                <h4 v-else style="text-align:center;margin-bottom:20px;font-size:16px">死亡小结</h4>
                <el-form label-position="left" label-width="110px">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="姓名">
                        {{ form.elderName }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="性别">
                        {{ form.gender }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="年龄">
                        {{ form.age }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="职业">
                        {{ form.job }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="入院日期">
                        {{ form.checkinDate }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item v-if="form.formType === 0 " label="出院日期">
                        {{ form.checkoutDate }}
                      </el-form-item>
                      <el-form-item v-else label="死亡日期">
                        {{ form.checkoutDate }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="入院诊断">
                      <div v-if="form.checkinMedical">
                        <b v-for="(item,index) in form.checkinMedical.split(',')" :key="index">
                          {{ index +1 }}、{{ item }}
                        </b>
                      </div>
                    </el-form-item>
                    <el-form-item label="入院情况">
                      <b>{{ form.checkinDescription }}</b>
                      </el-form-item>
                    <el-form-item label="在院治疗情况">
                      <b>{{ form.medicalDescription }}
                      </b>
                    </el-form-item>
                    <el-form-item v-if="form.formType === 0" label="出院情况">
                      <b>{{ form.checkoutDescription }}
                      </b>
                    </el-form-item>
                    <el-form-item v-else label="抢救经过">
                      <b>{{ form.checkoutDescription }}
                      </b>
                    </el-form-item>
                    <el-form-item v-if="form.formType === 0 " label="出院诊断">
                      <div v-if="form.checkoutMedical">
                        <b v-for="(item,index) in form.checkoutMedical.split(',')" :key="index">
                          {{ index +1 }}、{{ item }}
                        </b>
                      </div>
                    </el-form-item>
                    <el-form-item v-else label="死亡诊断">
                      <div v-if="form.checkoutMedical">
                        <b v-for="(item,index) in form.checkoutMedical.split(',')" :key="index">
                          {{ index +1 }}、{{ item }}
                        </b>
                      </div>
                    </el-form-item>
                    <el-form-item v-if="form.formType === 0 " label="出院医嘱">
                      <b>{{ form.checkoutAdvice }}</b>
                    </el-form-item>
                    <el-form-item v-else label="死亡原因">
                      <b>{{ form.checkoutAdvice }}</b>
                    </el-form-item>
                  </el-row>
                </el-form>
              </td>
            </tr>
            <tr>
              <td style="line-height:40px;text-align:right;padding-right:80px">
                医生签名：
              </td>
            </tr>
            <tr>
              <td v-if="form.createTime" style="line-height:40px;text-align:right">
                日期：{{ $moment(form.createTime).format('YYYY-MM-DD')}}
              </td>
              <td v-else>
                日期：
              </td>
            </tr>
            <tr>
              <td class="blank" id="blank"></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="8" style="font-weight: bold;border-top: 1px solid rgba(0, 0, 0, 0.4);height: 40px;">
                <el-form>
                  <el-row style="text-align: right;padding-right: 80px;">
                    签名：
                  </el-row>
                </el-form>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doPrint">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Print from "@/utils/printjs";
Vue.use(Print);
import printMethods from "@/utils/print";
export default {
  name: "",
  data () {
    return {
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      dialogFormVisible: false,
      form: {
        formType: 0
      }
    };
  },
  methods: {
    ...printMethods,
    // 编辑
    edit (data) {
      this.$router.push({
        path: "elderCareList/addLeaveHandle",
        query: {
          sign: "add",
          elderId: data.elderId,
          elderName: data.elderName,
          gender: data.gender,
          age: data.age,
          roomName: data.roomName,
          bedName: data.bedName,
          nursingLevel: data.nursingLevel,
          checkinDate: data.checkinDate,
          checkoutDate: data.checkoutDate,
          checkinNo: data.checkinNo,
          checkoutRemark: data.checkoutRemark,
          elderPhoto: data.elderPhoto,
          formStatus: data.formStatus,
          flowStatus: data.flowStatus,
          status: data.status,
          handlerName: data.handlerName,
          handleTime: data.handleTime,
        }
      });
    },
    // 查看
    check (data) {
      this.$router.push({
        path: "elderCareList/leaveHandleDetail",
        query: {
          sign: "detail",
          elderId: data.elderId,
          elderName: data.elderName,
          gender: data.gender,
          age: data.age,
          roomName: data.roomName,
          bedName: data.bedName,
          nursingLevel: data.nursingLevel,
          checkinDate: data.checkinDate,
          checkoutDate: data.checkoutDate,
          checkinNo: data.checkinNo,
          checkoutRemark: data.checkoutRemark,
          elderPhoto: data.elderPhoto,
          formStatus: data.formStatus,
          flowStatus: data.flowStatus,
          status: data.status,
          handlerName: data.handlerName,
          handleTime: data.handleTime,
        }
      });
    },
    /*查询第几页数据*/
    handleCurrentChange (val) {
      // this.searchForm.pageIndex = val;
      this.$emit("leaveChildInit", val);
    },
    // 搜索
    searchInfo () {
      console.log(this.searchForm);
      this.searchForm.pageIndex = 1;
      this.currentPage = 1;
      this.initData();
    },
    doPrint () {
      this.$nextTick(() => {
        this.$print(this.$refs.mainContent);
      });
    },
    async initPrintData (elderId) {
      const res = await axios
        .fetch("elderServer", "/elderCheckoutForm/get/byElderId", {
          elderId
        });
      return res;
    },
    // 打印
    print (data) {
      // console.log(this.initPrintData(data.elderId));
      // this.initPrintData(data.elderId).then(res => {
      //   console.log(res);
      //   this.form = Object.assign({}, res.data);
      //   this.form.elderName = data.elderName,
      //     this.form.roomName = data.roomName,
      //     this.form.gender = data.gender,
      //     this.form.bedName = data.bedName,
      //     this.form.age = data.age,
      //     this.form.checkinDate = data.checkinDate,
      //     this.form.area = data.area,
      //     this.form.job = data.job,
      //     this.form.checkinNo = data.checkinNo,
      //     this.form.tenantName = data.tenantName,
      //     this.dialogFormVisible = true;
      //   this.$nextTick(() => {
      //     const contentObj = document.getElementById("print-content");
      //     const blankObj = document.getElementById("blank");
      //     const divHeight = contentObj.offsetHeight -81; //容器高度
      //     let pageHeight = this.getOneMmsPx() *297 -81;
      //     console.log(divHeight, '=====divHeight');
      //     console.log(contentObj.style.width, '=====',this.getOneMmsPx() *210);
      //     console.log(pageHeight);
      //     let pages = Math.ceil(divHeight / pageHeight);
      //     console.log(pages);
      //     blankObj.style.height = (pages * pageHeight - divHeight) + "px";
      //     console.log(blankObj.style.height);
      //   })
      // })
      this.openPrint({
        path: "/print/elder/checkout-sum",
        query: {
          elderId: data.elderId,
          elderName: data.elderName,
          gender: data.gender,
          age: data.age,
          roomName: data.roomName,
          bedName: data.bedName,
          checkinDate: data.checkinDate,
          checkoutDate: data.checkoutDate,
          checkinNo: data.checkinNo,
          area: data.area,
          job: data.job,
          tenantName: data.tenantName,
        }
      });
    },
    // 获取每毫米的像素值
    getOneMmsPx () {
      // 创建一个1mm宽的元素插入到页面，然后坐等出结果
      let div = document.createElement("div");
      div.id = "mm";
      div.style.width = "1mm";
      document.querySelector("body").appendChild(div);
      // 原生方法获取浏览器对元素的计算值
      let mm1 = document.getElementById("mm").getBoundingClientRect();
      console.log(mm1);
      return mm1.width;
    }
  }
};
</script>
<style lang="less" scoped>
@media print {
  * {
    -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
    color-adjust: exact !important; /*Firefox*/
  }
}
//  /deep/ .el-dialog {
//     .print-content {
//       .el-dialog__body{
//         display: flex!important;
//         align-items: center!important;
//         flex-direction: column!important;
//       }
//       table {
//         thead {
//           display: table-header-group;
//           .el-row {
//             height: 40px;
//             line-height: 40px;
//             .el-col {
//               text-align: center;
//               height: 100%;
//               font-weight: normal;
//             }
//             .el-col:nth-child(2n) {
//               text-align: left;
//               font-weight: bolder;
//             }
//             .el-form-item {
//               margin-bottom: 0;
//             }
//           }
//         }
//         tfoot {
//           display: table-footer-group;
//           font-weight: bold;
//         }
//       }
//     }
// }
</style>
