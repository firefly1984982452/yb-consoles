<template>
  <div id="" style="padding: 0px;">
    <el-form ref="searchForm" :inline="true" class="search" :model="searchForm" label-width="75px">
      <el-form-item label="合同编号">
        <el-input v-model="searchForm.checkinNo" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="入住状态"> -->
        <!-- <el-select v-model="searchForm.elderStatus">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <!-- <ub-dictionary group="合同入住状态" clearable v-model="searchForm.elderStatus"></ub-dictionary>
      </el-form-item> -->
      <el-form-item label="到期时间">
        <el-select clearable v-model="searchForm.day" placeholder="请选择">
          <el-option v-for="item in byTime" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老人姓名">
        <!-- <el-input v-model="searchForm.elderName" placeholder="请输入" clearable></el-input> -->
          <ub-elder v-model="searchForm.elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="startDate" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
        </el-date-picker>
      </el-form-item>
      <el-button @click="searchInfo" type="primary"  icon="el-icon-search" style="background-color:#2368D3;">查询</el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <div class="content">
      <el-table :data="listData" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
        <el-table-column prop="elderName" label="姓名" min-width="50" align="center"></el-table-column>
        <el-table-column prop="checkinDate" label="入院日期"  align="center"></el-table-column>
        <el-table-column prop="roomName" label="房间床位" min-width="50" align="center"></el-table-column>
        <el-table-column prop="relationName" label="家属" min-width="50" align="center"></el-table-column>
        <el-table-column prop="guarantorContact" label="联系电话" min-width="80" align="center"></el-table-column>
        <el-table-column prop="agreementCount" label="合同次数" width="80"  align="center"></el-table-column>
        <el-table-column prop="checkinNo" label="合同编号" min-width="100" align="center"></el-table-column>
        <el-table-column prop="contractDuration" label="合同周期" min-width="120" align="center"></el-table-column>
        <el-table-column prop="contractType" label="合同类型" :formatter="contractTypeFormatter" min-width="80" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="80" align="center"></el-table-column>
        <el-table-column label="操作" min-width="100%">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button icon="iconfont iconcaozuotubiao-chakan" @click="print(scope.row)" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="延长" v-if="calcDataDiff($moment(),scope.row.serviceEndDate)" placement="top" >
              <el-button @click="extend(scope.row)" v-if="scope.row.isCurrent===true && scope.row.elderStatus == 100" icon="iconfont iconcaozuotubiao-yanchanghetong" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.contractType!=0&&scope.row.status == 0" class="item" effect="dark" content="编辑" placement="top">
              <el-button icon="iconfont iconcaozuotubiao-bianji" @click="edit(scope.row)" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 修改延长合同 -->
    <el-dialog title="延长合同编辑" :visible.sync="editDioalogVisible" center width="600px" class="dialog-extend">
      <el-row class="warp userList" id="userLists">
        <el-col>
          <el-form label-width="9em" :model="extendForm" style="padding:0 10px;">
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="入住老人" label-width="9em" class="dialog-item-label">{{editForm.elderName}}</el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="担保人" label-width="4em" class="dialog-item-label">{{editForm.relationName}}</el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上次合同有效期" class="dialog-item-label">{{ $moment(editForm.formerServiceStartDate).format('YYYY年MM月DD日')}}至{{$moment(editForm.formerServiceEndDate).format('YYYY年MM月DD日')}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="本次合同延长" class="dialog-item-label">
                  <el-date-picker style="width:45%" v-model="editForm.serviceStartDate" type="date" value-format="yyyy-MM-dd" format="yyyy年MM月dd日" placeholder="选择日期" clearable></el-date-picker>至
                  <el-date-picker style="width:45%" v-model="editForm.serviceEndDate" type="date" value-format="yyyy-MM-dd" format="yyyy年MM月dd日" placeholder="选择日期" clearable></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fee_adjust">
              <el-col :span="24">
                <span>被褥费</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;<input class="el-input__inner" style="width:100px" v-model="editForm.beddingFee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9" /> 元/天 </span>
              </el-col>
              <el-col :span="24">
                <span>托管费</span>
                <span>原 <input class="el-input__inner" style="width:100px" v-model="editForm.bed0Fee"  />元/月 </span>
                调至 <el-input v-model="editForm.bedFee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9" /> 元/月
              </el-col>
              <el-col :span="24">
                <span>护理费</span>
                <span>原 <input class="el-input__inner" style="width:100px" v-model="editForm.care0Fee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9" /> 元/月</span>
                调至 <el-input v-model="editForm.careFee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9"></el-input> 元/月
              </el-col>
              <el-col :span="24">
                <span>膳食费</span>
                <span>原 <input class="el-input__inner" style="width:100px" v-model="editForm.diet0Fee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9" /> 元/天</span>
                调至 <el-input v-model="editForm.dietFee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9"></el-input> 元/天
              </el-col>
            </el-row>
            <el-row style="text-align:center;margin: 0px 0px 20px;" :gutter="0">
              <el-button type="primary" @click="editSubmit()">确定</el-button>
              <el-button @click="editDioalogVisible = false ">取消</el-button>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 延长合同 -->
    <el-dialog title="延长合同" :visible.sync="dialogExtendVisible" center width="600px" class="dialog-extend">
      <el-row class="warp userList" id="userLists">
        <el-col>
          <el-form label-width="9em" :model="extendForm" style="padding:0 10px;">
            <el-row>
              <el-col :span="24">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="入住老人" label-width="9em" class="dialog-item-label">{{extendForm.elderName}}</el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="担保人" label-width="4em" class="dialog-item-label">{{extendForm.relationName}}</el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上次合同有效期" class="dialog-item-label">{{extendForm.validityPeriod}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="本次合同延长" class="dialog-item-label">
                  <el-date-picker style="width:45%" v-model="extendForm.serviceStartDate" type="date" value-format="yyyy-MM-dd" format="yyyy年MM月dd日" placeholder="选择日期" clearable></el-date-picker>至
                  <el-date-picker style="width:45%" v-model="extendForm.serviceEndDate" type="date" value-format="yyyy-MM-dd" format="yyyy年MM月dd日" placeholder="选择日期" clearable></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fee_adjust">
              <el-col :span="24">
                <span>被褥费</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;<input class="el-input__inner" style="width:100px" v-model="extendForm.beddingFee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9" /> 元/天 </span>
              </el-col>
              <el-col :span="24">
                <span>托管费</span>
                <span>原 <input class="el-input__inner" style="width:100px" v-model="extendForm.originalTrustee"  />元/月 </span>
                调至 <el-input v-model="extendForm.bedFee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9" /> 元/月
              </el-col>
              <el-col :span="24">
                <span>护理费</span>
                <span>原 <input class="el-input__inner" style="width:100px" v-model="extendForm.originalCare" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9" /> 元/月</span>
                调至 <el-input v-model="extendForm.careFee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9"></el-input> 元/月
              </el-col>
              <el-col :span="24">
                <span>膳食费</span>
                <span>原 <input class="el-input__inner" style="width:100px" v-model="extendForm.originalMeals" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9" /> 元/天</span>
                调至 <el-input v-model="extendForm.dietFee" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="9"></el-input> 元/天
              </el-col>
            </el-row>
            <el-row style="text-align:center;margin: 0px 0px 20px;" :gutter="0">
              <el-button type="primary" @click="save()">确定</el-button>
              <el-button @click="closeWin()">取消</el-button>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import printMethods from '@/utils/print';
import ubDictionary from '@/components/dictionary';
import ubElder from "@/components/elder";
export default {
    data() {
        return {
          startDate:['',''],
          options:[
            {
              value:100,
              label:'已入住'
            },
            {
              value:200,
              label:'已离院'
            }
          ],
            agreementId: '',
            extendForm: {
              byTime: ""
            },
            contractTypes: [
              { value: "0", label: "入院合同" },
              { value: "1", label: "延长合同" }
            ],
            searchForm: {
                startTime:"",
                endtTime:"",
                checkinNo: "",
                day: "",
                elderName: "",
                pageIndex: 1,
                pageSize: 10
            },
            sign: "",
            byTime: [
              {
                value: "15",
                label: "15天以内"
              },
              {
                value: "30",
                label: "30天以内"
              }
            ],
            listData: [],
            totalPage: 0,
            currentPage: 1,
            haveEdited: 0, //编辑后滞空
            dialogExtendVisible: false,
            repairParams: {},
            oldServiceStartDate:'',
            oldServiceEndDate:'',
            editDioalogVisible:false,
            editForm: {

            }
        };
    },
    components: { ubDictionary ,ubElder},
    mounted() {
      let status = this.$route.query.status;
      if(status) {
        this.searchForm.elderStatus = status;
      }
    },
    created() {
      let expireTime = this.$route.query.expireTime;
      if(expireTime) {
        this.searchForm.day = expireTime;
      }
      this.searchForm.pageIndex = 1;
    },
    methods: {
      ...printMethods,
      cellStyle({ row, column, rowIndex, columnIndex }) {
        return "padding: 5px 0";
      },
      dataInit() {
        let data = this.searchForm;
        axios.fetch("elderServer", "/elder/maxAll", data).then(res => {
          this.listData = res.data;
          this.totalPage = res.total;
          // this.currentPage = 1;
          for (let i = 0; i < this.listData.length; i++) {
            let serviceStartDate = this.listData[i].serviceStartDate;
            let serviceEndDate = this.listData[i].serviceEndDate;
            if (serviceStartDate && serviceEndDate) {
              this.listData[i].contractDuration = serviceStartDate + "-" + serviceEndDate;
            } else {
              this.listData[i].contractDuration = "";
            }
          }
        });
      },
      searchInfo() {
        this.searchForm.startTime = this.startDate[0];
        this.searchForm.endTime = this.startDate[1];
        this.searchForm.pageIndex = 1;
        this.currentPage = 1;
        this.dataInit();
      },
      /*刷新*/
      reset() {
        this.startDate = ['',''];
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
        this.loading = true;
        this.searchForm.checkinNo = "";
        this.searchForm.elderStatus = "";
        this.searchForm.day = "";
        this.searchForm.elderName = "";
        this.searchForm.elderId = "";
        this.searchForm.pageIndex = 1;
        this.currentPage = 1;
        this.dataInit();
      },
      /*查询第几页数据*/
      handleCurrentChange(val) {
        this.searchForm.pageIndex = val;
        this.dataInit();
      },
      //将yyyy-MM-dd格式的时间转化成yyyy年MM月dd日
      dateFormat(date) {
        return (date.split("-")[0] +"年" +date.split("-")[1] +"月" + date.split("-")[2] + "日");
      },
      //根据(时间+1)算出一年后的日期
      computeOneLater(val) {
        var d2 = new Date(val);
        d2.setFullYear(d2.getFullYear() + 1);
        // d2.setDate(d2.getDate() - 1);
        let y = d2.getFullYear();
        let m = (d2.getMonth()+1)<10?"0"+(d2.getMonth()+1):(d2.getMonth()+1);
        let d = d2.getDate()<10?"0"+d2.getDate():d2.getDate();
        d2 = y + '-' + m + '-' + d;
        return d2;
      },
      //删除一个对象中的多个属性
      delObjKeys(obj, keys) {
        keys.map(function(key) { delete obj[key]; });
        return obj;
      },
      //浅拷贝
      shallowCopy(obj) {
        var newobj = {};
        for (var attr in obj) { newobj[attr] = obj[attr];}
        newobj.byTime=''
        return newobj;
      },
      //查看合同
      print(data) {
        this.$router.push({
            path: "/elder/contractList",
            query: {
                assessList: true,
                elderId: data.elderId
            }
        });

        let type = "";
        if(data.contractType===0){
          type = "contract";
        }else if(data.contractType===1){
          type = "exContract";
        }
        // this.openPrint({
        //   path: "/print/elder/" + type,
        //   query: {
        //     agreementId: data.agreementId
        //   }
        // });
      },
      //延长合同
      extend(data) {
        this.oldServiceStartDate = ''+data.serviceStartDate;
        this.oldServiceEndDate = ''+data.serviceEndDate;
        console.log(data.serviceStartDate,this.oldServiceStartDate)
        let validityPeriod = "";
        let byTime = this.computeOneLater(data.serviceEndDate);
        if (data.serviceStartDate && data.serviceEndDate) {
          validityPeriod =this.dateFormat(data.serviceStartDate) +"至" +
          this.dateFormat(data.serviceEndDate);
        }
        this.extendForm = this.shallowCopy(data);
        this.extendForm.validityPeriod = validityPeriod;
        this.extendForm.byTime = byTime;

        this.extendForm.contractType = 1; //设置合同类型
        //新的服务时间赋值
        let nowDate = new Date();
        let m = nowDate.getMonth() + 1 < 10? "0" + (nowDate.getMonth() + 1): nowDate.getMonth() + 1;
        let d =nowDate.getDate() < 10? "0" + nowDate.getDate(): nowDate.getDate();
        nowDate = nowDate.getFullYear() + "-" + m + "-" + d;
        this.extendForm.signDate = nowDate;
        this.extendForm.serviceStartDate = data.serviceEndDate;
        this.extendForm.serviceEndDate = byTime;

        //调整费用
        this.extendForm.originalTrustee = data.bedFee;
        this.extendForm.originalCare = data.careFee;
        this.extendForm.originalMeals = data.dietFee;
        this.extendForm.bedFee = "";
        this.extendForm.careFee = "";
        this.extendForm.dietFee = "";
        this.agreementId = data.agreementId;
        this.dialogExtendVisible = true;
      },
      save() {
        console.log(this.agreementId);
        
        console.log('??', this.extendForm,this.oldServiceStartDate,this.oldServiceEndDate)
        if (this.extendForm.serviceEndDate == "" || this.extendForm.serviceEndDate == null || !this.extendForm.serviceEndDate) {
          this.$message.error("请选择延长合同结束时间");return;
        }else if (this.extendForm.bedFee == "" || this.extendForm.bedFee == null || !this.extendForm.bedFee) {
          this.$message.error("请输入托管费");return;
        }else if (this.extendForm.careFee === "" || this.extendForm.careFee === null || !this.extendForm.careFee) {
          this.$message.error("请输入护理费");return;
        }else if (this.extendForm.dietFee == "" || this.extendForm.dietFee == null || !this.extendForm.dietFee) {
          this.$message.error("请输入膳食费");return;
        }
        
        this.extendForm.parentId = this.agreementId; //设置原合同Id
        this.extendForm = this.delObjKeys(this.extendForm, ["seElderName","seBedName",
          "agreementId","checkinNo","isCurrent","status","createTime","updateTime",
          ,"byTime",
          "contractDuration"
        ]);
        this.extendForm.formerServiceStartDate = this.oldServiceStartDate;
        this.extendForm.formerServiceEndDate = this.oldServiceEndDate;
        this.extendForm.formerBedFee = this.extendForm.originalTrustee;
        this.extendForm.formerCareFee = this.extendForm.originalCare;
        this.extendForm.formerDietFee = this.extendForm.originalMeals;
        axios
        .fetch("elderServer", "/elder/insert", this.extendForm, "json")
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.searchForm.pageIndex = 1;
          this.dataInit();
  
          let type = "";
          if(this.extendForm.contractType===0){
            type = "contract";
          }else if(this.extendForm.contractType===1){
            type = "exContract";
          }
          this.openPrint( {
            path: "/print/elder/" + type,
            query: {
              agreementId: res.data.agreementId
            }
          });
        });

        this.dialogExtendVisible = false;
      },
      closeWin() {
        this.dialogExtendVisible = false;
      },
      contractTypeFormatter(row, column, value, index) {
        let objects = this.contractTypes;
        for (let key of Object.keys(objects)) {
          if (key == value) {
            return objects[key].label;
          }
        }
      },
      // 修改延长合同
      edit(data){
        this.editForm = Object.assign({},this.editForm,data);
        this.editDioalogVisible = true;
      },
      // 修改延长合同保存事件
      editSubmit(){
        axios.fetch('elderServer','/elder/edit',this.editForm,'json').then(res=>{
          if( res.code == 200 ){
            this.$message({
            message: "修改成功",
            type: "success"
          });
          this.editDioalogVisible = false;
          this.dataInit();
          this.openPrint( {
            path: "/print/elder/exContract",
            query: {
              agreementId: this.editForm.agreementId
            }
          });
          }
        })
      },
      // 计算时间差 param2-param1
      calcDataDiff(param1,param2){
        const date1 = this.$moment(param1).format('YYYY-MM-DD');
        const date2 = this.$moment(param2).format('YYYY-MM-DD');
        const result = this.$moment(date2).diff(date1,"day");
        if(result < 30){
          return true
        } else {
          return false;
        }
      }
    },
    beforeRouteEnter(to,from,next){
        if(from.name == '合同约定列表'){
            to.meta.isBack = true;
        }
        next();
    },
    activated(){
        if(!this.$route.meta.isBack){
            this.searchInfo();
        }
        this.$route.meta.isBack = false;
    },
    filters: {},
    watch: {}
};
</script>
<style scoped>
.dialog-item-label{
  color: #333333;
}
#userList .el-pagination {
    margin-top: 20px;
    float: right;
    position: relative;
    right: 130px;
}
#userList .el-pagination__editor.el-input {
    width: 50px;
}
#staffTableStyle {
    background: transparent;
    width: 95%;
    transform: translateX(-50%);
    position: relative;
    left: 50%;
}
#extendContractDialog >>> .el-form-item {
    margin-bottom: 0;
}
#extendContractDialog >>> .el-form-item__content {
    color: #333;
    font-weight: 500;
}
.fee_adjust {
    background-color: #f8f8f8;
    margin: 15px 0 30px 0;
    padding: 13px 0 13px 30px;
}
.fee_adjust .el-col-24 {
    color: #666;
}
.fee_adjust .el-col-24 span:nth-child(1) {
    color: #333;
    font-weight: 500;
    margin-right: 8px;
}
.fee_adjust .el-col-24 span:nth-child(2) {
    width: 12em;
    display: inline-block;
}
.fee_adjust .el-input {
    width: 8em;
    margin: 8px 0;
}
.fee_adjust >>> .el-input .el-input__inner {
    height: 2em;
}
</style>
<style >

.dialog-extend .el-form-item__label{
  color: #666;
}
.dialog-extend .el-input__inner{
  color: #333;
}
</style>