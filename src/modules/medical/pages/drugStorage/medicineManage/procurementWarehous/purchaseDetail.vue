<template>
  <div class="app-container createOuts" id="createOutss">
    <el-row :gutter="0" style="margin-bottom: 2rem;">
      <!--//:rules="rules"-->
      <el-form :model="form" label-width="120px">
        <el-col :span="24" style="margin-bottom: 15px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="1" class="backBtns">
                  <el-button type="text" size="mini" @click="backList()">返回</el-button>
                </el-col>
                <el-col :span="6">
                  <span v-if="state==1">查看采购单详情</span>
                  <span v-if="state==0">审核采购单</span>
                  <span></span>
                </el-col>
              </el-row>
            </div>
            <div id="familyData">
              <div class="imgBox">
                <img v-show="status==3" src="http://image.youbankeji.com/web/dahuaAdmin/successLive.png" alt="">
                <img v-show="status==-1" src="http://image.youbankeji.com/web/dahuaAdmin/cancelSuccess.png" alt="">
                <img v-show="status==-2" src="http://image.youbankeji.com/web/dahuaAdmin/cancelSuccess.png" alt="">
                <img v-show="status==0" src="../../../../../../assets/images/daishenhe.png" alt="">
                <img v-show="status==1" src="../../../../../../assets/images/daishenhe.png" alt="">
              </div>
              <div class="imgRight">
                <p class="purchaseTitle" v-show="status==0">待审核</p>
                <p class="purchaseTitle" v-show="status==1">待入库</p>
                <p class="purchaseTitle" v-show="status==3">已入库</p>
                <p class="purchaseTitle" v-show="status==-1">已作废</p>
                <p class="purchaseTitle" v-show="status==-2">审核不通过</p>
                <p class="infoBox">
                  <span style="font-size:14px;color:#999">采购单号:</span>
                  <span style="font-size:14px;color:#333">{{order.orderNo}}</span>
                </p>
                <p class="infoBox">
                  <span style="font-size:14px;color:#999">采购人:</span>
                  <span style="font-size:14px;color:#333">{{order.purchaser}}</span>
                </p>
                <p class="infoBox">
                  <span style="font-size:14px;color:#999">采购时间:</span>
                  <span style="font-size:14px;color:#333">{{order.purchaseDate}}</span>
                </p>
                <p class="infoBox">
                  <span style="font-size:14px;color:#999">供应商:</span>
                  <span style="font-size:14px;color:#333">{{order.vendorName}}</span>
                </p>
                <p class="infoBox">
                  <span style="font-size:14px;color:#999">付款方式:</span>
                  <span style="font-size:14px;color:#333">{{order.payMethod}}</span>
                </p>
                <el-button v-if="state==0" style="background: #3F51B5;color: #FFFFFF;width:94px;margin:10px 0" icon="el-icon-search" @click="dialogFormVisible =true">审核</el-button>
                <p class="infoBox" v-show="status==1||status==3||status==-2">
                  <span style="font-size:14px;color:#999">审核人:</span>
                  <span style="font-size:14px;color:#333">{{order.auditor}}</span>
                </p>
                <p class="infoBox" v-show="status==1||status==3||status==-2">
                  <span style="font-size:14px;color:#999">审核时间:</span>
                  <span style="font-size:14px;color:#333">{{order.auditDate}}</span>
                </p>
                <p class="infoBox" v-show="status==1||status==3||status==-2">
                  <span style="font-size:14px;color:#999">备注:</span>
                  <span style="font-size:14px;color:#333">{{order.remark}}</span>
                </p>
                <p class="infoBox" v-show="status==3">
                  <span style="font-size:14px;color:#999">入库人:</span>
                  <span style="font-size:14px;color:#333">{{order.storer}}</span>
                </p>
                <p class="infoBox" v-show="status==3">
                  <span style="font-size:14px;color:#999">入库时间:</span>
                  <span style="font-size:14px;color:#333">{{order.storeDate}}</span>
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col class="searchTop">
          <span style=" font-weight: bolder;padding:15px 10px">总金额 : {{totalPrice}}</span>
          <el-col style="background: rgb(255, 255, 255);border-radius: 4px;padding-top: 15px">
            <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border>
              <el-table-column label="序号" min-width="40">
                <template slot-scope="scope">{{scope.$index + 1}}</template>
              </el-table-column>
              <el-table-column label="药品统编" min-width="150" prop="no"></el-table-column>
              <el-table-column label="通用名称" min-width="100" prop="commonName"></el-table-column>
              <el-table-column label="商品名" min-width="150" prop="name"></el-table-column>
              <el-table-column label="规格" min-width="160" prop="standard"></el-table-column>
              <el-table-column label="包装单位" min-width="80" prop="packageUnit"></el-table-column>
              <el-table-column label="可用库存" min-width="100" prop="availableCount"></el-table-column>
              <el-table-column label="采购数量" min-width="100" prop="quantity"></el-table-column>
              <el-table-column label="采购价" min-width="100" prop="unitPrice"></el-table-column>
              <el-table-column label="小计" min-width="140" prop="amount"></el-table-column>
            </el-table>
          </el-col>
        </el-col>
      </el-form>
    </el-row>
    <el-dialog title="审核" :visible.sync="dialogFormVisible" width="400px" center>
      <el-form label-width="80px" ref="dictForm" :model="dictForm">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审核结果" prop="status">
              <el-radio-group v-model="dictForm.status">
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="-2">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="dictForm.remark" type="textarea" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col class :span="7">
            <el-button type="primary" @click="saveDict()">确认</el-button>
          </el-col>
          <el-col class :span="7">
            <el-button @click="dialogFormVisible=false">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      status: "",
      id: "",
      totalPrice: "",
      state: "",
      order: {},
      dictForm: {
        status: "",
        remark: "",
      },
      form: {},
      dialogFormVisible: false,
      loading: false,
    };
  },
  created() {
    this.status = this.$route.query.status;
    this.id = this.$route.query.id;
    this.state = this.$route.query.state;
    this.dingdanDetail();
  },
  methods: {
    backList() {
      this.$router.back(-1);
    },
    dingdanDetail() {
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
          this.tableData = [];
          for (var i in resData.items) {
            this.tableData.push({
              ...resData.items[i].medicine,
              quantity: resData.items[i].quantity,
              unitPrice: resData.items[i].unitPrice,
              amount: resData.items[i].amount,
            });
          }
          this.totalNum = resData.items.length;
          this.order = resData;
          this.totalPrice = resData.total;
        });
    },
    saveDict() {
      if (this.dictForm.status == "") {
        this.$message.error("请选择审核结果");
        return;
      }
      let data = {
        status: this.dictForm.status,
        remark: this.dictForm.remark,
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
          this.dialogFormVisible = false;
          this.$router.push({
            path: "/medical/drugStorage/purchaseStore",
          });
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
</style>