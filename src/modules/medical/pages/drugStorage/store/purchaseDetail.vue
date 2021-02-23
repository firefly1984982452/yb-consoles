<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button type="text" size="mini" @click="backList()" style="min-width: 20px;">返回</el-button>
          <span v-if="state==1">查看采购单详情</span>
          <span v-if="state==0">审核采购单</span>
        </div>
        <div id="familyData">
          <el-row>
            <el-col :span="12" style="display: flex; display: -webkit-flex;align-items:center;">
              <div>
                <i :class="statusIconClassName()" class="iconfont"></i>
              </div>
              <div style="margin-left:8px;" :class="statusClassName()">
                {{statusName()}}
              </div>
              <div style="margin-left:8px;">
                <el-button v-if="status==0" type="primary" icon="el-icon-check" :class="submit" @click="dialogFormVisible =true">审核通过</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top:8px">
            <el-col :span="6">
              <span>采购单号: {{order.orderNo}}</span>
            </el-col>
            <el-col :span="6">
              <span>供应商: {{order.vendorName}}</span>
            </el-col>
            <el-col :span="6">
              <span>付款方式: {{order.payMethod}}</span>
            </el-col>
            <el-col :span="6">
              <span>申请人: {{order.purchaser}}({{order.purchaseDate}})</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span>采购备注: {{order.remark}}</span>
            </el-col>
            <el-col :span="6" v-if="order.status ==3">
              <span>执行人: {{order.storer}}({{order.storeDate}})</span>
            </el-col>
            <el-col :span="12" v-if="order.status ==3">
              <span>入库单:
                <el-link type="primary" class="purchace-link" v-for="item in order.stores" key="item.id" @click="toStoreIn(item.id)">{{item.no}}</el-link>
              </span>
            </el-col>
            <el-col :span="6" v-if="order.status ==-1">
              <span>作废人: {{order.auditor}}({{order.auditDate}})</span>
            </el-col>
            <el-col :span="6" v-if="order.status ==-1">
              <span>作废备注: {{order.invalidRemark}}</span>
            </el-col>
          </el-row>
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
        <el-table-column label="采购量" prop="quantity"></el-table-column>
        <el-table-column label="单价(元)" prop="unitPrice"></el-table-column>
        <el-table-column label="小计(元)" width="100" align="right" prop="amount"></el-table-column>
      </el-table>
      <div style="font-weight: bolder;padding:15px 10px">共{{order.kind}}种药品，合计金额{{totalPrice}}元</div>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="400px">
      <el-form label-width="80px" ref="dictForm" :model="dictForm">
        <el-row>
          <el-col :span="24">
            <div style="font-size:18px;text-align:center;margin:8px 0px;">确认审核通过此采购单？</div>
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
      status: "",
      id: "",
      totalPrice: "",
      state: "",
      order: {},
      fromStore: null,
      dictForm: {
        status: "",
        remark: "",
      },
      form: {},
      allStatus: [
        {
          name: "待审核",
          id: 0,
        },
        {
          name: "待执行",
          id: 1,
        },
        {
          name: "已执行",
          id: 3,
        },
        {
          name: "已作废",
          id: -1,
        },
      ],
      dialogFormVisible: false,
      loading: false,
    };
  },
  created() {
    this.status = this.$route.query.status;
    this.id = this.$route.query.id;
    this.state = this.$route.query.state;
    this.fromStore = this.$route.query.fromStore;
    this.init();
  },
  methods: {
    backList() {
      if (this.fromStore) {
        history.go(-1);
      } else {
        this.$router.push({
          path: "/medical/drugStorage/store/storeInMain?activeName=second",
        });
      }
    },
    statusName() {
      let objects = this.allStatus;
      for (let key of Object.keys(objects)) {
        if (objects[key].id == this.order.status) {
          return objects[key].name;
        }
      }
    },
    init() {
      axios
        .fetch(
          "medicalServer",
          "/api/purchase-order/" + this.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          let resData = res.data;
          this.listData = resData.items;
          this.totalNum = resData.items.length;
          this.order = resData;
          this.status = this.order.status;
          this.totalPrice = resData.total;
        });
    },
    statusIconClassName() {
      let status = this.order.status;
      if (status == 0) {
        return "icondaishenhe submit";
      } else if (status == 1) {
        return "iconnav-storage audited";
      } else if (status == 3) {
        return "iconstatus-storage finished";
      } else if (status == -1) {
        return "iconzuofei1 invalid";
      }
    },
    statusClassName() {
      let status = this.order.status;
      if (status == 0) {
        return "submit";
      } else if (status == 1) {
        return "audited";
      } else if (status == 3) {
        return "finished";
      } else if (status == -1) {
        return "invalid";
      }
    },
    submitForm() {
      let data = {
        status: 1,
      };
      axios
        .fetch(
          "medicalServer",
          "/api/purchase-order/check/" + this.id,
          data,
          null,
          "get"
        )
        .then((res) => {
          this.$message.success("操作成功！");
          this.dialogFormVisible = false;
          this.$router.back(-1);
        });
    },
    toStoreIn(id) {
      this.$router.push({
        path: "/medical/drugStorage/store/storeDetail",
        query: { id: id, flag: "view", type: 1, fromPurchaseId: this.order.id },
      });
    },
  },
};
</script>

<style  scoped>
.imgBox {
  width: 70px;
  height: 70px;
  /* background: #F6812B; */
  float: left;
  margin: 45px 20px 45px 10px;
}
.imgBox img {
  width: 70px;
  height: 70px;
}
.imgRight {
  width: 750px;
  float: left;
  margin: 15px 0;
}
.purchaseTitle {
  font-size: 18px;
  color: #333;
  font-weight: bolder;
  margin-bottom: 5px;
}
.infoBox {
  float: left;
  width: 250px;
  text-align: left;
  margin: 5px 0;
}
#createOutss .box-card .el-card__header {
  line-height: 60px;
  padding: 10px 0;
}
.content .el-button--mini {
  font-size: 1rem;
}
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
/deep/ .purchace-link {
  margin-right: 8px;
}
</style>