<template>
  <div id="huangCss">
    <div class="topContent1">
      <el-row align="middle">
        <el-form ref="searchForm" :model="searchForm">
          <div class="back">
            <p class="backText" @click="backList()">返回</p>
          </div>
          <div class="imgBox">
            <img v-show="status==1" src="http://image.youbankeji.com/web/dahuaAdmin/successLive.png" alt="">
            <img v-show="status==0" src="../../../../../../assets/images/daishenhe.png" alt="">
          </div>
          <div class="imgRight">
            <p class="purchaseTitle" v-show="status==0">待出库</p>
            <p class="purchaseTitle" v-show="status==1">已出库</p>
            <p class="infoBox">
              <span style="font-size:14px;color:#999">处方单号:</span>
              <span style="font-size:14px;color:#333">{{orderNo | nothingFilter}}</span>
            </p>
            <p class="infoBox">
              <span style="font-size:14px;color:#999">创建时间:</span>
              <span style="font-size:14px;color:#333">{{createTime | nothingFilter}}</span>
            </p>
            <p class="infoBox">
              <span style="font-size:14px;color:#999">老人姓名:</span>
              <span style="font-size:14px;color:#333">{{elderName | nothingFilter}}</span>
            </p>
            <p class="infoBox">
              <span style="font-size:14px;color:#999">医生姓名:</span>
              <span style="font-size:14px;color:#333">{{doctorName | nothingFilter}}</span>
            </p>
            <p v-show="status==1" class="infoBox">
              <span style="font-size:14px;color:#999">出库人:</span>
              <span style="font-size:14px;color:#333">{{handlerName | nothingFilter}}</span>
            </p>
            <p v-show="status==1" class="infoBox">
              <span style="font-size:14px;color:#999">出库时间:</span>
              <span style="font-size:14px;color:#333">{{handleTime | nothingFilter}}</span>
            </p>
          </div>
        </el-form>
      </el-row>
    </div>
    <div class="minContent" style="padding-top:10px;">
      <p style=" font-weight: bolder;width:200px;margin-left:20px">总金额 : {{totalPrice}}</p>
      <el-row>
        <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="margin: 20px 0;" :cell-style="{padding: '5px 0'}">
          <el-table-column label="序号" min-width="100">
            <template slot-scope="scope">{{scope.$index+1}}</template>
          </el-table-column>
          <el-table-column label="药品统编" min-width="100">
            <template slot-scope="scope">{{scope.row.medicineNo | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="商品名" min-width="100">
            <template slot-scope="scope">{{scope.row.medicineName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="通用名称" min-width="100">
            <template slot-scope="scope">{{scope.row.commonName | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="规格" min-width="160">
            <template slot-scope="scope">{{scope.row.medicineStandard | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="用药单位" min-width="160">
            <template slot-scope="scope">{{scope.row.useUnit | nothingFilter}}</template>
          </el-table-column>
          <el-table-column label="用药数量" min-width="140">
            <template slot-scope="scope">{{scope.row.itemCount | nothingFilter}}</template>
          </el-table-column>
          <!--<el-table-column label="金额" min-width="140">
						<template slot-scope="scope">{{scope.row.sellingPrice}}</template>
					</el-table-column>-->
        </el-table>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchForm: {},
      orderId: "",
      orderNo: "",
      elderName: "",
      handleName: "",
      doctorName: "",
      createTime: "",
      handleTime: "",
      status: "",
      tableData: [],
      currentPage3: 1,
      totalPage: 0,
      totalPrice: "",
    };
  },
  computed: {},
  created() {
    this.orderId = this.$route.query.id;
    this.orderNo = this.$route.query.outNo;
    this.elderName = this.$route.query.eldName;
    this.handleName = this.$route.query.handleName;
    this.doctorName = this.$route.query.doctor;
    this.createTime = this.$route.query.ctime;
    this.handleTime = this.$route.query.handleTime;
    this.status = this.$route.query.state;
    this.dataInit();
  },
  methods: {
    backList() {
      this.$router.back("/medicineManage/medicineUninstore/unInstoreList");
    },
    dataInit() {
      let data = {
        id: this.orderId,
      };
      axios
        .fetch("medicalServer", "/medicalElderOrderDetail/order", data)
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.tableData = res.data;
            let priceArr = this.tableData.map((v) => v.amount);

            this.totalPrice = eval(priceArr.join("+")).toFixed(2);

            //						this.totalPage = res.total;
            //						this.currentPage3 = res.total;
            //
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning",
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
#huangCss {
  width: 94%;
  /* border: 1px solid red; */
  height: 90.2vh;
  margin-left: 2.7%;
  /* position: relative; */
}

#huangCss .topContent1 {
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

#huangCss .minContent {
  /* border: 1px solid red; */
  /*height: 74vh;*/
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: relative;
}

#huangCss .el-button i {
  font-size: 14px;
  margin-right: 5px;
}

#huangCss .jishu {
  text-align: center;
  padding: 16px 0 0 0;
  font-size: 12px;
  font-weight: 300;
  color: rgba(165, 165, 165, 1);
}

#huangCss .el-pagination {
  bottom: 0;
}

.imgBox {
  width: 70px;
  height: 70px;
  /* background: #F6812B; */
  float: left;
  margin: 30px 20px 20px 20px;
}

.imgBox img {
  width: 70px;
  height: 70px;
}

.back {
  height: 40px;
  background: rgba(251, 251, 252, 1);
  border-radius: 5px 5px 0px 0px;
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  padding: 10px 0 0 20px;
}

.backText {
  width: 50px;
  height: 30px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(211, 212, 214, 1);
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}

.imgRight {
  width: 520px;
  height: 110px;
  /* border: #F6812B 1px solid; */
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
</style>