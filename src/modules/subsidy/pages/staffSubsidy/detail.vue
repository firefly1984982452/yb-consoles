<template>
  <div class="staff_detail">
    <el-row class="warp">
      <el-col class="top">
        <div class="header">
          <div class="left">
            <el-button class="backBtn" size="mini" @click="$router.go(-1)">返回</el-button>
            <span v-if="sign=='add'">新建补贴标准</span>
            <span v-if="sign!='add'">
              <span v-if="sign=='tjsh' || sign=='qs'|| sign=='see'">员工补贴明细</span>
              <span v-if="sign=='sh'">审核员工补贴</span>
            </span>
          </div>
          <div class="right">
            <!-- <el-col :xl="2" :lg="2" v-if="sign=='tjsh'"> -->
            <el-button type="primary" v-if="sign=='tjsh'" @click="handleFun(2,'提交','qs')">提交申请</el-button>
            <!-- </el-col> -->
            <!-- <el-col :xl="2" :lg="2" v-if="sign=='qs'"> -->
            <el-button type="primary" v-if="sign=='qs'" @click="handleFun(3,'签收','see')">签收确认</el-button>
            <!-- </el-col> -->
            <!-- <el-col :xl="2" :lg="2" v-if="sign=='sh'"> -->
            <el-button type="primary" v-if="sign=='sh'" @click="handleFun(1,'审核','tjsh')">审核通过</el-button>
            <!-- </el-col> -->
            <!-- <el-col :xl="2" :lg="2" v-if="form.sesStatus!=0&&alls!=1"> -->
            <el-button @click="handleFun(-1,'作废','del')" v-if="form.status == 0">删除</el-button>
            <!-- </el-col> -->
          </div>
        </div>
        <el-form ref="form" :model="form" label-width="110px">
          <el-row type="flex" class="row-bg" justify :gutter="5">
            <el-col :span="5">
              <el-form-item label="月份：">
                <span v-if="form.startDate&&form.endDate">从{{$moment(form.startDate).format('YYYY年MM月')}}至{{$moment(form.endDate).format('YYYY年MM月')}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="补贴金额：">
                <span v-if="alls">{{form.amountFull}}元</span>
                <span v-else>{{form.amountFull+form.amountHalf}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="!alls">
              <el-form-item label="状态：">
                <span>{{form.status | statusFilter}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify :gutter="5">
            <el-col :span="5" v-if="!alls">
              <el-form-item label="生成时间：">
                <span>{{form.createTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="!alls">
              <el-form-item label="补贴人数：">
                <span v-if="form">{{form.countFull+form.countHalf}}人</span>
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="!alls">
              <el-form-item label="操作人：">
                <span>{{form.creatorName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>

      <el-col class="main_content">
        <el-row style="margin:10px 0 0 0;" class="button-grounp" id="grounpBtns">
          <el-button type plain @click="selectLive('all')" :class="{'active':colorBtn.all==1}">
            <span class="btn-font-size">绩效奖励</span>
          </el-button>
          <el-button type plain @click="selectLive('dai')" :class="{'active':colorBtn.dai==1}">
            <span class="btn-font-size">职业技能补贴</span>
          </el-button>
          <el-button type plain @click="selectLive('haved')" :class="{'active':colorBtn.haved==1}">
            <span class="btn-font-size">专技人员补贴</span>
          </el-button>
          <el-button type plain @click="selectLive('cancel')" :class="{'active':colorBtn.cancel==1}">
            <span class="btn-font-size">岗位补贴</span>
          </el-button>
          <el-button type plain @click="selectLive('ruyuan')" :class="{'active':colorBtn.ruyuan==1}">
            <span class="btn-font-size">就业补贴</span>
          </el-button>
          <el-button type plain @click="selectLive('ruzhu')" :class="{'active':colorBtn.ruzhu==1}">
            <span class="btn-font-size">申请审批表</span>
          </el-button>
          <el-button type plain @click="selectLive('ly')" :class="{'active':colorBtn.ly==1}">
            <span class="btn-font-size">统计表</span>
          </el-button>
          <el-button type plain @click="selectLive('newTable')" :class="{'active':colorBtn.newTable==1}">
            <span class="btn-font-size">签收表</span>
          </el-button>
          <el-button type="success" style="float:right" @click="excelout()"><i class="btn iconfont iconjichutubiao-daochubiaoge"></i>导出Excel</el-button>
        </el-row>
        <!-- <Jixiao :oid="id" :sign="sign" v-if="colorBtn.all == 1"></Jixiao>
        <Zhiye :oid="id" :sign="sign" v-if="colorBtn.dai == 1"></Zhiye> -->
        <Zhuanji ref="table1" :oid="id" :alls="alls" :sign="sign" :subsidyType="subsidyType" v-if="subsidyType"></Zhuanji>
        <!-- <Gangwei :oid="id" :sign="sign" v-if="colorBtn.cancel == 1"></Gangwei>
        <Jiuye :oid="id" :sign="sign" v-if="colorBtn.ruyuan == 1"></Jiuye> -->

        <Apply ref="table2" :oid="id" :alls="alls" :sign="sign" v-if="colorBtn.ruzhu == 1"></Apply>
        <Tongji ref="table3" :oid="id" :alls="alls" :sign="sign" v-if="colorBtn.ly == 1"></Tongji>
        <Qianshou ref="table4" :oid="id" :alls="alls" :sign="sign" v-if="colorBtn.newTable == 1"></Qianshou>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Apply from "./child/apply";
// import Gangwei from "./child/gangwei";
// import Jiuye from "./child/jiuye";
// import Jixiao from "./child/jixiao";
import Qianshou from "./child/qianshou";
import Tongji from "./child/tongji";
// import Zhiye from "./child/zhiye";
import Zhuanji from "./child/zhuanji";
export default {
  data() {
    return {
      id: "",
      form: {},
      /*绩效子组件传给我的*/
      sign: "",
      /******************/
      colorBtn: {
        all: 1,
        dai: 0,
        haved: 0,
        cancel: 0,
        ruyuan: 0,
        ruzhu: 0,
        ly: 0,
        newTable: 0,
      },
      subsidyType: 3,
      api: "", //导出excel时查询数据的接口
      tableColums: {},
      alls: "",
    };
  },
  components: {
    Apply,
    // Gangwei,
    // Jiuye,
    // Jixiao,
    Qianshou,
    Tongji,
    // Zhiye,
    Zhuanji,
  },
  created() {
    this.id = this.$route.query.id;
    this.sign = this.$route.query.sign;
    this.alls = this.$route.query.all;
    this.dataInit();
  },
  methods: {
    // 返回
    closeCancel() {
      this.$router.push("/subsidy/subsidyList");
    },
    /*导出*/
    excelout() {
      if (this.subsidyType) {
        this.$refs.table1.toExcel();
      } else {
        if (this.colorBtn.ruzhu == 1) {
          this.$refs.table2.toExcel();
        } else if (this.colorBtn.ly == 1) {
          this.$refs.table3.toExcel();
        } else if (this.colorBtn.newTable == 1) {
          this.$refs.table4.toExcel();
        }
      }
    },
    /**
     *
     * 员工补贴操作(审核/提交申请/签收/作废)
     * @status 下个阶段的status
     *
     */
    handleFun(status) {
      let param = {
        id: this.id,
        status,
      };
      if (status == -1) {
        this.$confirm("是否确认删除该补贴明细?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            axios
              .fetch("oaServer", "/subsidyEmployeeItem/edit", param, "json")
              .then((res) => {
                this.$message.success(res.data);
                this.$router.go(-1);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        axios
          .fetch("oaServer", "/subsidyEmployeeItem/edit", param, "json")
          .then((res) => {
            this.$message.success(res.data);
            this.$router.go(-1);
          });
      }
    },
    /*切换tab*/
    selectLive(type) {
      for (var key in this.colorBtn) {
        if (type == key) {
          this.colorBtn[key] = 1;
        } else {
          this.colorBtn[key] = 0;
        }
      }
      switch (type) {
        case "all":
          this.subsidyType = 3;
          break;
        case "dai":
          this.subsidyType = 4;
          break;
        case "haved":
          this.subsidyType = 5;
          break;
        case "cancel":
          this.subsidyType = 2;
          break;
        case "ruyuan":
          this.subsidyType = 1;
          break;
        case "ruzhu":
          this.subsidyType = null;
          break;
        case "ly":
          this.subsidyType = null;
          break;
        case "newTable":
          this.subsidyType = null;
          break;
        default:
          this.subsidyType = null;
          break;
      }
    },
    /*初始化数据*/
    dataInit() {
      if (!this.alls) {
        axios
          .fetch("oaServer", "/subsidyEmployeeItem/all", {
            id: this.id,
          })
          .then((res) => {
            if (res.data && res.data.length > 0) {
              this.form = res.data[0];
            }
          });
      } else {
        const ids = this.$route.query.id.split(",");
        axios
          .fetch("oaServer", "/subsidyEmployeeItem/all/map", {
            id: ids,
            startDate: this.$route.query.startDate,
            endDate: this.$route.query.endDate,
          })
          .then((res) => {
            if (res.data) {
              this.form = res.data;
            }
          });
      }
    },
  },
  filters: {
    statusFilter: (val) => {
      if (val === 0) {
        val = "待审核";
      } else if (val == 1) {
        val = "待提交";
      } else if (val == 2) {
        val = "待签收";
      } else if (val == 3) {
        val = "已签收";
      } else if (val == -1) {
        val = "已作废";
      }
      //状态：0待审核，1待提交，2待签收，3已签收，-1已作废
      return val;
    },
    timerFilter: (val) => {
      val = val.substr(0, 4) + "年" + val.substr(5, 2) + "月";
      return val;
    },
  },
};
</script>
<style lang="less" scoped>
.staff_detail {
  .warp {
    min-width: 1100px;
    .top {
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 15px;
      .header {
        background: #fff;
        margin-bottom: 1rem;
        border-bottom: 1px solid #dcdfe6;
        display: flex;
        padding: 0 20px;
        align-items: center;
        background: #fbfbfc;
        .left {
          // width: 150px;
          .backBtn {
            min-width: 0px;
            width: 60px;
            // position: absolute;
            left: 20px;
          }
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
          height: 56px;
          justify-content: flex-end;
          .el-button {
            min-width: 0px;
            //   display: flex;
            //   align-items: center;
            width: 90px;
            height: 36px;
            //   justify-content: center;
          }
        }
      }

      /deep/ .el-form-item__content {
        font-weight: 600;
      }
    }
    .main_content {
      background: #fff;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      margin-top: 0px;
      .el-button + .el-button {
        margin-left: 5px;
      }
      .el-button.active {
        background: #4687e1 !important;
        color: #fff !important;
        border: 1px solid #4687e1 !important;
      }
    }
  }
}
</style>