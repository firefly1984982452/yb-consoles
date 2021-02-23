<template>
  <div class="bonus_detail" id="cancelLive">
    <el-row class="warp">
      <el-col class="top">
        <el-row class="title">
          <el-button class="backBtn" size="mini" @click="back">返回</el-button>
          <!-- <el-col :span="3" v-if="form.spsStatus!=0"> -->
          <el-button @click="handleFun(-1)" size="mini" v-if="form.status ==0 ">删除</el-button>
          <!-- </el-col> -->
          <!-- <el-col :span="3" v-if="sign=='tjsh'"> -->
          <el-button type="success" v-if="sign=='tjsh'" size="mini" @click="handleFun(2,'提交','qs')">提交申请</el-button>
          <!-- </el-col> -->
          <!-- <el-col :span="3" v-if="sign=='qs'"> -->
          <el-button type="success" v-if="sign=='qs'" size="mini" @click="handleFun(3,'签收','see')">签收确认</el-button>
          <!-- </el-col> -->
          <!-- <el-col :span="3" v-if="sign=='sh'"> -->
          <el-button type="success" v-if="sign=='sh'" size="mini" @click="handleFun(1,'审核','tjsh')">审核</el-button>
          <!-- </el-col> -->
          <!-- <el-col :span="3"> -->
          <el-button type="success" size="mini" @click="excelout()"><i class="btn iconfont iconjichutubiao-daochubiaoge"></i>导出Excel</el-button>
          <!-- </el-col> -->
        </el-row>
        <el-form ref="form" :model="form" label-width="110px">
          <el-row type="flex" class="row-bg" justify :gutter="5">
            <!-- <el-col :span="8"> -->
            <el-form-item label="统计时效：">
              <span>从{{$moment(form.startDate).format('YYYY-MM-DD')}}至{{$moment(form.endDate).format('YYYY-MM-DD')}}</span>
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="8"> -->
            <el-form-item label="状态：">
              <span>{{ form.status | statusFilter }}</span>
            </el-form-item>
            <!-- </el-col> -->
            <!-- </el-row> -->
            <!-- <el-row type="flex" class="row-bg" justify :gutter="5"> -->
            <!-- <el-col :span="8"> -->
            <el-form-item label="补贴金额：">
              <span>{{ form.amount }}元</span>
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="8"> -->
            <el-form-item label="创建时间：">
              <span>{{ form.creatorName }} {{ form.createTime }}</span>
            </el-form-item>
            <!-- </el-col> -->
          </el-row>
        </el-form>
      </el-col>
      <el-col class="main_content">
        <el-form ref="forms" :model="form" label-width="110px">
          <el-row>
            <el-col style="background:#fff;border-radius:4px;padding-top:15px" :gutter="20">
              <el-row style="width: 95%;position:relative;left:2%;margin:10px 0 20px 0;" class="button-grounp" id="grounpBtns">
                <!-- <el-col :span="2"> -->
                <el-button type @click="selectLive('all')" :class="{'active':colorBtn.all==1}">
                  <span class="btn-font-size">汇总</span>
                </el-button>
                <!-- </el-col> -->
                <!-- <el-col :span="2"> -->
                <el-button type @click="selectLive('dai')" :class="{'active':colorBtn.dai==1}">
                  <span class="btn-font-size">护理员明细表</span>
                </el-button>
                <!-- </el-col> -->
                <!-- <el-col :span="2"> -->
                <el-button type @click="selectLive('haved')" :class="{'active':colorBtn.haved==1}">
                  <span class="btn-font-size">专技人员明细表</span>
                </el-button>
                <!-- </el-col> -->
              </el-row>
            </el-col>
          </el-row>
          <Confluence :oid="id" ref="confluence" :sign="sign" v-if="colorBtn.all==1"></Confluence>
          <NursingStaffList ref="nursingStaffList" :oid="id" :sign="sign" v-if="colorBtn.dai==1"></NursingStaffList>
          <TransferTechnicians ref="transferTechnicians" :oid="id" :sign="sign" v-if="colorBtn.haved==1"></TransferTechnicians>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Confluence from "./child/confluence";
import NursingStaffList from "./child/nursingStaffList";
import TransferTechnicians from "./child/transferTechnicians";
export default {
  data() {
    return {
      form: {},
      id: "",
      sign: "",
      colorBtn: {
        all: 1,
        dai: 0,
        haved: 0,
      },
    };
  },
  components: {
    Confluence,
    NursingStaffList,
    TransferTechnicians,
  },
  created() {
    this.id = this.$route.query.id;
    this.sign = this.$route.query.sign;
    this.dataInit();
  },
  methods: {
    /*导出*/
    excelout() {
      if (this.colorBtn.all == 1) {
        this.$refs.confluence.toExcel();
      } else if (this.colorBtn.dai == 1) {
        this.$refs.nursingStaffList.toExcel();
      } else if (this.colorBtn.haved == 1) {
        this.$refs.transferTechnicians.toExcel();
      }
    },
    selectLive(type) {
      for (var key in this.colorBtn) {
        if (type == key) {
          this.colorBtn[key] = 1;
        } else {
          this.colorBtn[key] = 0;
        }
      }
    },
    /*初始化数据*/
    dataInit() {
      axios
        .fetch("oaServer", "/subsidyOrgItem/all", {
          id: this.id,
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            this.form = res.data[0];
          }
        });
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
        this.$confirm("是否确认删除该条数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            axios
              .fetch("oaServer", "/subsidyOrgItem/edit", param, "json")
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
          .fetch("oaServer", "/subsidyOrgItem/edit", param, "json")
          .then((res) => {
            this.$message.success(res.data);
            this.$router.go(-1);
          });
      }
    },
    back() {
      this.$router.go(-1);
    },
  },
  filters: {
    statusFilter: (val) => {
      if (val == -1) {
        val = "作废";
      } else if (val == 0) {
        val = "待审核";
      } else if (val == 1) {
        val = "待提交";
      } else if (val == 2) {
        val = "待签收";
      } else if (val == 3) {
        val = "已签收";
      }
      return val;
    },
  },
};
</script>
<style lang="less" scoped>
.bonus_detail {
  .warp {
    min-width: 1100px;
    /deep/ .el-form-item__content {
      font-weight: 600;
    }
    .top {
      padding: 0 !important;
      background: #fff;
      margin-bottom: 1rem;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      .title {
        padding: 0 20px;
        display: flex;
        align-items: center;
        height: 56px;
        border-bottom: 1px solid rgba(221, 221, 221, 1);
        background: #fbfbfc;
        justify-content: flex-end;
        position: relative;
        .el-button {
          min-width: 0px;
          //   display: flex;
          //   align-items: center;
          width: 90px;
          height: 36px;
          //   justify-content: center;
        }
        .backBtn {
          width: 60px;
          position: absolute;
          left: 20px;
        }
      }
    }
  }
  .main_content {
    background: #fff;
    padding: 10px;
    margin-bottom: 1rem;
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
</style>
