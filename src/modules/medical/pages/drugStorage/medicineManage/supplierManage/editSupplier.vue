<template>
  <div id="huangCss">
    <el-button @click="backList()" style="margin:0 0 10px;">返回</el-button>
    <div :class="isactive == 0 ? 'minContent2' : 'minContent' ">
      <el-button v-for="(item,index) in btnArr" :key="index" :class="isactive == index ? 'searchBtnsStyle' : 'checkBtn' " @click="checkPage(index)" v-if="form.partnerType==1">{{item}}</el-button>
      <el-row v-if="isactive==0" style="padding-top: 20px;">
        <el-form ref="searchData" :model="form" :rules="rules">
          <el-row>
            <el-col :xl="4" :lg="6">
              <el-form-item label="供应商名称" label-width="120px" prop="partnerName">
                <el-input v-model="form.partnerName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="4" :lg="6">
              <el-form-item label="联系人" label-width="120px" prop="contactName">
                <el-input v-model="form.contactName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="4" :lg="6">
              <el-form-item label="联系电话" label-width="120px" prop="contactPhone">
                <el-input v-model="form.contactPhone" maxlength="11" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xl="6" :lg="8">
              <el-form-item label="联系地址" label-width="120px" prop="contactAddress">
                <el-input v-model="form.contactAddress" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row v-if="isactive==1">
        <el-table ref="multipleTable" tooltip-effect="dark" :data="listData" border style="top:20px" :cell-style="{padding: '5px 0'}">
          <el-table-column label="药品统编" min-width="100" prop="no"></el-table-column>
          <el-table-column label="通用名称" min-width="100" prop="commonName"></el-table-column>
          <el-table-column label="商品名" min-width="100" prop="name"></el-table-column>
          <el-table-column label="规格" min-width="140" prop="standard"></el-table-column>
          <el-table-column label="包装单位" min-width="100" prop="pacpackageUnit"></el-table-column>
          <el-table-column label="批准文号" min-width="100" prop="approvalNo"></el-table-column>
          <el-table-column label="生产企业" min-width="100" prop="vendorName"></el-table-column>
          <el-table-column label="操作" min-width="40" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
                <el-button size="mini" class="lookta" @click="deleteMedicine(scope.row,scope.$index)">
                  <i class="el-icon-delete-solid danger"></i>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="changePage" :total="dataCount" :current-page="searchData.pageIndex" :page-size="searchData.pageSize" layout="total, prev, pager, next, jumper"></el-pagination>
      </el-row>
    </div>
    <div class="tijiao" v-if="isactive==0">
      <el-row :gutter="40">
        <el-col :span="2" offset="2">
          <el-button type="primary" @click="sendData()">提交</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="cancel()">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      btnArr: ["企业信息", "药品信息"],
      supplierOptions: [
        { value: 1, label: "供应商" },
        // { value: 2, label: "生产商" }
      ],
      isactive: "0",
      searchData: { pageSize: 10, pageIndex: 1 },
      dataCount: "",
      form: {},
      listData: [],
      medicineID: "",
      rules: {
        orderNo: [
          {
            required: true,
            message: "",
            trigger: "blur,change",
          },
        ],
      },
    };
  },
  created() {
    let partnerId = this.$route.query.partnerId;
    let data = {
      partnerId: partnerId,
    };
    if (partnerId) {
      axios
        .fetch("medicalServer", "/api/partner/" + partnerId, null, null, "get")
        .then((res) => {
          this.form = res.data;
        });

      this.fetchData();
    }
  },
  methods: {
    checkPage(index) {
      this.isactive = index;
    },
    backList() {
      this.$router.back(-1);
    },
    cancel() {
      this.$router.push("/medical/drugStorage/supplierList");
    },
    addStore() {
      this.$router.push("/medical/drugStorage/addstore");
    },
    search() {
      this.changePage(1);
    },
    reset() {
      this.searchData.search_LIKES_name = "";
      this.dateRange = [];
      this.changePage(1);
    },
    changePage(value) {
      this.searchData.pageIndex = value;
      this.fetchData();
    },
    fetchData() {
      let partnerId = this.$route.query.partnerId;
      axios
        .fetch(
          "medicalServer",
          "/api/medicine/supplier/" + partnerId,
          this.searchData,
          null,
          "get"
        )
        .then((res) => {
          this.listData = res.data;
          this.dataCount = res.total;
        });
    },

    deleteMedicine(val, index) {
      this.partnerId = this.$route.query.partnerId;
      this.$confirm("确认删除【" + val.name + "】药品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          let data = {
            providerId: this.partnerId,
            medicineId: val.id,
          };
          axios
            .fetch("medicalServer", "/api/partner/delete-medicine", data)
            .then((res) => {
              if (res.data) {
                this.$message.success("操作成功");
                this.fetchData();
              }
            });
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    sendData() {
      if (
        this.form["partnerName"] === "" ||
        this.form["partnerName"] === null ||
        !this.form["partnerName"]
      ) {
        this.$message.error("请输入供应商名称");
        this.loading = false;
        return;
      }
      if (
        this.form["contactName"] === "" ||
        this.form["contactName"] === null ||
        !this.form["contactName"]
      ) {
        this.$message.error("请输入联系人");
        this.loading = false;
        return;
      }
      if (Number.isNaN(Number(this.form.contactPhone))) {
        return this.$message.error("联系电话只能输入数字！");
      }
      if (
        this.form["contactPhone"] === "" ||
        this.form["contactPhone"] === null ||
        !this.form["contactPhone"]
      ) {
        this.$message.error("请输入联系电话");
        this.loading = false;
        return;
      }
      if (
        this.form["contactAddress"] === "" ||
        this.form["contactAddress"] === null ||
        !this.form["contactAddress"]
      ) {
        this.$message.error("请输入联系地址");
        this.loading = false;
        return;
      }
      if (
        this.form["partnerType"] === "" ||
        this.form["partnerType"] === null ||
        !this.form["partnerType"]
      ) {
        this.$message.error("请输入供应商类型");
        this.loading = false;
        return;
      }
      this.partnerId = this.$route.query.partnerId;
      axios
        .fetch("medicalServer", "/api/partner", this.form, "json")
        .then((res) => {
          this.$message({
            message: "提交成功",
            type: "success",
          });
          this.$router.push("/medical/drugStorage/supplierList");
        });
    },
  },
};
</script>
<style scoped>
#huangCss .minContent {
  /* border: 1px solid red; */
  /*height: 80vh;*/
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: relative;
}
#huangCss .minContent2 {
  /*height: 40vh;*/
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
#huangCss .content-wrapper {
  margin-top: 0px !important;
}
.tijiao {
  margin-top: 16px;
}
</style>