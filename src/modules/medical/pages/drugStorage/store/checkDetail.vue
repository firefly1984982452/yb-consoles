<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button type="text" size="mini" @click="back()" style="min-width: 20px;">返回</el-button>
          <span v-if="flag=='view'">查看盘点单详情</span>
          <span v-else>审核盘点单</span>
        </div>
        <div id="familyData">
          <!-- < -->
          <el-row>
            <el-col :span="8" style="display: flex; display: -webkit-flex;align-items:center;">
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
            <el-col :span="4" v-if="form.status==5" class="right">
              <span :class="statusClassName()" class="related-no">关联单据</span>
            </el-col>
            <el-col :span="6" v-if="form.storeInId">
              <span>盘盈入库: <el-link type="primary" @click="toStoreDetail(form.storeInId)">{{form.storeInNo}}</el-link></span>
            </el-col>
            <el-col :span="6" v-if="form.storeOutId">
              <span>盘亏出库: <el-link type="primary" @click="toStoreDetail(form.storeOutId)">{{form.storeOutNo}}</el-link></span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span>盘点单号: {{form.no}}</span>
            </el-col>
            <el-col :span="6">
              <span>经办人: {{form.creator}}({{form.createTime}})</span>
            </el-col>
            <el-col :span="6">
              <span>盘点备注: {{form.remark}}</span>
            </el-col>
            <el-col :span="6" v-if="form.status ==0">
              <span>作废人: {{form.auditor}}({{form.auditTime}})</span>
            </el-col>
            <el-col :span="24" v-if="form.status ==0">
              <span>作废备注: {{form.invalidRemark}}</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-form>
    <div class="content" style="margin-top:8px;">
      <el-table ref="multipleTable" :data="listData" border class="ub-table" :row-class-name="tableRowClassName">
        <el-table-column label="药品名称/条码" min-width="150" align="left">
          <template slot-scope="scope">
            {{scope.row.name}}<br>
            {{scope.row.barCode}}
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="standard" min-width="150" align="left"></el-table-column>
        <el-table-column label="包装单位" prop="unit" min-width="50"></el-table-column>
        <el-table-column label="帐面数量" prop="quantity" min-width="50"></el-table-column>
        <el-table-column label="盘点数量" prop="realQuantity" min-width="50"></el-table-column>
        <el-table-column label="盘点盈亏" min-width="50" align="right" prop="diff">
          <template slot-scope="scope">
            <span class="diff" v-if="scope.row.diff>0">+{{scope.row.diff}}</span>
            <span class="diff" v-else>{{scope.row.diff}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="font-weight: bolder;padding:15px 10px">共{{form.kind}}种药品，合计盘点数量{{form.quantity}}件</div>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="400px">
      <el-form label-width="80px" ref="dictForm" :model="dictForm">
        <el-row>
          <el-col :span="24">
            <div style="font-size:18px;text-align:center;margin:8px 0px;">确认审核通过此盘点单？</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="color:#FF6600;text-align:center">审核后不可修改，请仔细核对后点击确认</div>
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

      dialogFormVisible: false,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.flag = this.$route.query.flag;
    this.fromStoreId = this.$route.query.fromStoreId;
    this.init();
  },
  methods: {
    back() {
      if (this.fromStoreId) {
        this.$router.push({
          path: "/medical/drugStorage/store/storeDetail",
          query: { id: this.fromStoreId, state: 1 },
        });
      } else {
        this.$router.push({
          path: "/medical/drugStorage/store/checkList",
        });
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
        .fetch("medicalServer", "/api/check/" + this.id, null, null, "get")
        .then((res) => {
          let resData = res.data;
          this.listData = resData.items;
          this.totalNum = resData.items.length;
          this.form = resData;
          this.totalPrice = resData.total;
        });
    },
    submitForm() {
      let data = {
        status: 5,
      };
      axios
        .fetch(
          "medicalServer",
          "/api/check/check/" + this.id,
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
    toStoreDetail(storeId) {
      this.$router.push({
        path: "/medical/drugStorage/store/storeDetail",
        query: { id: storeId, flag: "view", fromCheckId: this.form.id },
      });
    },
    tableRowClassName({ row }) {
      if (this.form.status == 0) {
        return "";
      }
      let className = "";
      let diff = row.diff;
      if (diff > 0) {
        className += " plus";
      } else if (diff == 0) {
        className += " normal";
      } else if (diff < 0) {
        className += "minus";
      }
      return className;
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
  color: #5eb300;
}
/deep/ .related-no {
  border: 1px solid #5eb300;
  border-radius: 4px;
  padding: 2px;
  font-size: 12px;
  margin-right: 16px;
}
/deep/ .minus .cell .diff {
  color: #5eb300;
}
/deep/ .plus .cell .diff {
  color: #ff4444;
}
/deep/ .normal .cell .diff {
  color: #a6b2bd;
}
</style>