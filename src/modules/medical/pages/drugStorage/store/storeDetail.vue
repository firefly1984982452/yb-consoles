<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button type="text" size="mini" @click="back()" style="min-width: 20px;">返回</el-button>
          <span v-if="flag=='view'">查看{{typeName}}详情</span>
          <span v-else>审核{{typeName}}单</span>
        </div>
        <div id="familyData">
          <!-- < -->
          <el-row>
            <el-col :span="12" style="display: flex; display: -webkit-flex;align-items:center;">
              <div>
                <i :class="statusIconClassName()" class="iconfont"></i>
              </div>
              <div style="margin-left:8px;" :class="statusClassName()">
                {{statusName()}}
              </div>
              <div style="margin-left:8px;">
                <el-button v-if="form.status==1" type="primary" icon="el-icon-check" :class="submit" @click="dialogFormVisible =true">审核通过</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span>{{typeName}}单号: {{form.no}}</span>
            </el-col>
            <el-col :span="6" v-if="type==1">
              <span>供应商: {{form.vendorName}}</span>
            </el-col>
            <el-col :span="6" v-if="type==1">
              <span>付款方式: {{form.payMethod}}</span>
            </el-col>
            <el-col :span="6" v-if="type==2">
              <span>{{typeName}}类型: {{subTypeName(form.subType)}}</span>
            </el-col>
            <el-col :span="6">
              <span>经办人: {{form.creator}}({{form.createTime}})</span>
            </el-col>
            <el-col :span="6" v-if="type==2">
              <span>{{typeName}}备注: {{form.remark}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" v-if="form.purchaseId">
              <span>采购单: <el-link type="primary" @click="toPurchaseDetail()">{{form.purchaseNo}}</el-link></span>
            </el-col>
            <el-col :span="6" v-if="type ==1">
              <span>{{typeName}}备注: {{form.remark}}</span>
            </el-col>
            <el-col :span="6" v-if="form.status ==0">
              <span>作废人: {{form.auditor}}({{form.auditTime}})</span>
            </el-col>
            <el-col :span="6" v-if="form.status ==0">
              <span>作废备注: {{form.invalidRemark}}</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-form>
    <div class="content" style="margin-top:8px;">
      <el-table ref="multipleTable" :data="listData" border class="ub-table">
        <el-table-column label="药品名称/条码" min-width="150" align="left">
          <template slot-scope="scope">
            {{scope.row.name}}<br>
            {{scope.row.barCode}}
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="standard" min-width="150" align="left"></el-table-column>
        <el-table-column label="包装单位" prop="unit" min-width="50"></el-table-column>
        <el-table-column label="采购数量" prop="purchaseQuantity" v-if="form.purchaseId"></el-table-column>
        <el-table-column :label="preappendTypeName('数量')" prop="quantity"></el-table-column>
        <el-table-column :label="preappendTypeName('单价(元)')" prop="unitPrice"></el-table-column>
        <el-table-column label="小计金额" width="100" align="right" prop="amount"></el-table-column>
      </el-table>
      <div style="font-weight: bolder;padding:15px 10px">共{{form.kind}}种药品，合计金额{{totalPrice}}元</div>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="400px">
      <el-form label-width="80px" ref="dictForm" :model="dictForm">
        <el-row>
          <el-col :span="24">
            <div style="font-size:18px;text-align:center;margin:8px 0px;">确认审核通过此{{typeName}}单？</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="color:#FF6600;text-align:center">提交后不可修改，请仔细核对后点击确认</div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listData: [],
      id: "",
      totalPrice: "",
      flag: "",
      form: {},
      dictForm: {
        status: "",
        remark: "",
      },
      form: {},
      allStatus: [
        {
          name: "待审核",
          id: 1,
        },
        {
          name: "已审核",
          id: 5,
        },
        {
          name: "已作废",
          id: 0,
        },
      ],
      logTypes: [
        { id: 1, name: "采购入库", type: 1 },
        { id: 2, name: "销售退货", type: 1 },
        { id: 3, name: "期初入库", type: 1 },
        { id: 4, name: "盘盈入库", type: 1 },
        { id: 9, name: "其它入库", type: 1 },
        { id: 11, name: "处方出库", type: 2 },
        { id: 12, name: "报损出库", type: 2 },
        { id: 13, name: "采购退货", type: 2 },
        { id: 14, name: "盘亏出库", type: 2 },
        { id: 19, name: "其它出库", type: 2 },
      ],
      dialogFormVisible: false,
      loading: false,
      typeName: "",
      fromPurchaseId: null,
      fromCheckId: null,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.flag = this.$route.query.flag;
    this.fromPurchaseId = this.$route.query.fromPurchaseId;
    this.fromCheckId = this.$route.query.fromCheckId;
    this.init();
  },
  methods: {
    preappendTypeName(label) {
      return this.typeName + label;
    },
    subTypeName(value) {
      let objects = this.logTypes;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == value) {
          return objects[key].name;
        }
      }
    },
    back() {
      if (this.fromPurchaseId) {
        this.$router.push({
          path: "/medical/drugStorage/store/purchaseDetail",
          query: { id: this.fromPurchaseId, state: 1 },
        });
      } else if (this.fromCheckId) {
        this.$router.push({
          path: "/medical/drugStorage/store/checkDetail",
          query: { id: this.fromCheckId },
        });
      } else {
        if (this.type == 1) {
          this.$router.push({
            path: "/medical/drugStorage/store/storeInMain?activeName=first",
          });
        } else {
          this.$router.push({
            path: "/medical/drugStorage/store/storeList",
            query: { type: this.type, flag: "view" },
          });
        }
      }
    },
    statusName() {
      let objects = this.allStatus;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == this.status) {
          return objects[key].name;
        }
      }
    },
    init() {
      axios
        .fetch("medicalServer", "/api/store/" + this.id, null, null, "get")
        .then((res) => {
          let resData = res.data;
          this.listData = resData.items;
          this.totalNum = resData.items.length;
          this.form = resData;
          this.totalPrice = resData.total;
          this.type = this.form.type;
          this.typeName = this.type == 1 ? "入库" : "出库";
        });
    },
    submitForm() {
      let data = {
        status: 5,
      };
      axios
        .fetch(
          "medicalServer",
          "/api/store/check/" + this.id,
          data,
          null,
          "get"
        )
        .then((res) => {
          this.$message.success("操作成功！");
          this.dialogFormVisible = false;
          this.back();
        });
    },
    statusName() {
      let objects = this.allStatus;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == this.form.status) {
          return objects[key].name;
        }
      }
    },
    statusIconClassName() {
      let status = this.form.status;
      if (status == 1) {
        return "icondaishenhe submit";
      } else if (status == 5) {
        return "iconnav-storage audited";
      } else if (status == 0) {
        return "iconzuofei1 invalid";
      }
    },
    statusClassName() {
      let status = this.form.status;
      if (status == 1) {
        return "submit";
      } else if (status == 5) {
        return "audited";
      } else if (status == 0) {
        return "invalid";
      }
    },
    toPurchaseDetail() {
      this.$router.push({
        path: "/medical/drugStorage/store/purchaseDetail",
        query: { id: this.form.purchaseId, state: 1, fromStore: true },
      });
    },
  },
};
</script>

<style  scoped>
/deep/ .finished {
  color: #5eb300;
}
/deep/ .submit {
  color: #ff9903;
  font-size: 18px;
}
/deep/ .invalid {
  color: #a6b2bd;
}
/deep/ .audited {
  color: #3f8ef8;
}
</style>