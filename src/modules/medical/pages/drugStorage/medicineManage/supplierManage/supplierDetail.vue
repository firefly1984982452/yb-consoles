<template>
  <div id="huangCss">
    <div class="topContent1">
      <el-row align="middle">
        <el-form ref="searchForm" :model="searchForm">
          <div class="back">
            <p class="backText" style="float:left" @click="backList()">返回</p>
            <p style="float:left;margin:5px;font-weight:bolder">查看供应商信息</p>
          </div>
        </el-form>
      </el-row>
    </div>
    <div :class="isactive == 0 ? 'minContent1' : 'minContent' ">
      <el-button v-for="(item,index) in btnArr" :key="index" :class="isactive == index ? 'searchBtnsStyle' : 'checkBtn' " @click="checkPage(index)" v-if="searchForm.partnerType==1">{{item}}</el-button>
      <el-row v-if="isactive==0">
        <p class="infoText">
          <span>供应商名称</span>
          <span>{{searchForm.partnerName}}</span>
        </p>
        <p class="infoText">
          <span>联系人</span>
          <span>{{searchForm.contactName}}</span>
        </p>
        <p class="infoText">
          <span>联系电话</span>
          <span>{{searchForm.contactPhone}}</span>
        </p>
        <p class="infoText">
          <span>联系地址</span>
          <span>{{searchForm.contactAddress}}</span>
        </p>
      </el-row>
      <el-row v-if="isactive==1">
        <el-table ref="multipleTable" tooltip-effect="dark" :data="tableData" border style="top:20px">
          <el-table-column label="药品统编" min-width="90" prop="no"></el-table-column>
          <el-table-column label="商品名" min-width="100" prop="name"></el-table-column>
          <el-table-column label="通用名称" min-width="50" prop="commonName"></el-table-column>
          <el-table-column label="规格" min-width="110" prop="standard"></el-table-column>
          <el-table-column label="包装单位" min-width="30" prop="packageUnit"></el-table-column>
          <el-table-column label="批准文号" min-width="90" prop="approvalNo"></el-table-column>
          <el-table-column label="生产企业" min-width="150" prop="vendorName"></el-table-column>
        </el-table>
        <el-pagination @current-change="fetchData" :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage"></el-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      btnArr: ["企业信息", "药品信息"],
      isactive: "0",
      searchForm: {},
      totalPage: 0,
      tableData: [],
      currentPage: 1,
    };
  },
  computed: {},
  created() {
    let partnerId = this.$route.query.partnerId;
    let data = {
      partnerId: partnerId,
    };
    if (partnerId) {
      axios
        .fetch("medicalServer", "/api/partner/" + partnerId, null, null, "get")
        .then((res) => {
          this.searchForm = res.data;
        });

      this.fetchData();
    }
  },
  methods: {
    backList() {
      this.$router.back(-1);
    },

    checkPage(index) {
      this.isactive = index;
    },
    addStore() {
      this.$router.push("/medical/drugStorage/addstore");
    },
    fetchData(page) {
      let partnerId = this.$route.query.partnerId;
      let data = {
        pageIndex: page || 1,
        pageSize: 10,
      };
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/supplier/" + partnerId,
          data,
          null,
          "get"
        )
        .then((res) => {
          this.tableData = res.data;
          this.totalPage = res.total;
        });
    },
  },
};
</script>
<style scoped>
#huangCss .topContent {
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 15px 2% 0 5px;
}
#huangCss .minContent {
  /* border: 1px solid red; */
  /*height: 78vh;*/
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: relative;
}
#huangCss .minContent1 {
  /*height: 30vh;*/
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: relative;
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
#huangCss .checkBtn {
  width: 95px;
  height: 36px;
  border: none;
  margin-left: 16px;
  margin-top: 10px;
}
#huangCss .checkBtn:hover {
  background: #fff;
  color: #606266;
}
#huangCss .searchBtnsStyle {
  width: 95px;
  height: 36px;
  background: #4687e1;
  border: 1px solid #4687e1;
  border-radius: 4px;
  color: white;
  margin-left: 16px;
  margin-top: 10px;
}

#huangCss .addEquipment {
  width: 95px;
  height: 36px;
  background: #6cbc6c;
  color: white;
  float: right;
  margin-right: 1%;
  margin-top: 10px;
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
.infoText {
  font-size: 14px;
  width: 500px;
  margin: 20px 40px;
}
.infoText span:nth-child(1) {
  display: block;
  float: left;
  width: 70px;
  text-align: right;
}
.infoText span:nth-child(2) {
  font-weight: bolder;
  margin-left: 10px;
}
</style>