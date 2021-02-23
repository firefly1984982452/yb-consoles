<template>
  <div class="shift-form">
    <p>长者离院交接</p>
    <div :class="{ flow: true, actived: flow.status }" v-for="(flow, index) in flows" :key="index">
      <i :class="flow.icon"></i>
      <div class="text">
        <p>{{ flow.title }}</p>
        <p>{{ flow.description }}</p>
      </div>
      <i v-if="canEdit" class="el-icon-success" @click="index === 0 ? null : handleSelect(index)"></i>
      <i v-else class="el-icon-success"></i>
    </div>
    <div class="tips">
      <div class="warning" v-if="canEdit">
        <i class="iconfont iconcaozuotubiao-baojing-zhengchang"></i>
        提示：确认提交后系统自动按以下规则处理未完成的单据，如有需要请手动处理后再确认提交
      </div>
      <div class="success" v-else>
        <i class="el-icon-circle-check"></i>
        离院交接已完成，{{ handlerName }} ，{{ handleTime }}
      </div>
      <p>1，自动作废未执行的临时医嘱以及未校对的长期医嘱；</p>
      <p>2，自动停止未确认停止的长期医嘱；</p>
      <p>3，自动作废未审核以及未出库的处方单；</p>
      <p>4，自动提交未结算的处方费用单；</p>
      <p>5，自动清空长者药箱</p>
      <div class="btn" v-if="canEdit">
        <el-button type="primary" @click="handleSubmit">确认提交</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
      <div class="btn" v-else>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "ShiftForm",
  data () {
    return {
      flows: [
        {
          title: "停止医嘱",
          icon: "iconfont iconcebianlantubiao-yisheng",
          description: "自动停止或作废所有未终止的医嘱 (系统自动处理)",
          status: true
        },
        {
          title: "医疗费结算",
          icon: "iconfont iconzuocedaohangtubiao-zhihuihuli-xiaofeijilu",
          description: "请确认所有医疗费用单都已提交财务结算",
          status: false
        },
        {
          title: "医保卡交接",
          icon: "iconfont iconyibaoka",
          description: "请确认医保卡已交还给长者或家属",
          status: false
        },
        {
          title: "药品交接",
          icon: "iconfont iconyaopin1",
          description: "请确认长者药品已经交还给长者或家属",
          status: false
        }
      ],
      sign: "add",
      flowStatus: "",
      canEdit: false,
      handlerName: '',
      handleTime: '',
    };
  },
  created () {
    this.sign = this.$route.query.sign;
    this.handlerName = this.$route.query.handlerName;
    this.handleTime = this.$route.query.handleTime;
    this.flowStatus = this.$route.query.flowStatus === '0'? 0 : this.$route.query.flowStatus;
    if (this.$route.query.sign == "detail") {
      this.canEdit = false;
    } else {
      // 修改进来的
      this.canEdit = !this.flowStatus ? true : false;
    }
    console.log(this.canEdit);
    if (!this.canEdit) {
      this.flows.forEach(item => {
        item.status = true;
      });
    }
  },
  methods: {
    handleSelect (index) {
      console.log(this.flows[index]);
      let status = !this.flows[index].status;
      console.log(status);
      this.$set(this.flows[index], "status", status);
    },
    handleSubmit () {
      let flag = this.flows.every(item => {
        return item.status;
      });
      console.log(flag);
      if (flag) {
        this.$confirm('离院交接信息提交后不可修改?', '确认提交吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios
            .fetch("elderServer", "/elderCheckout/nurse/check", {
              elderId: this.$route.query.elderId,
              currentStatus: 20,
              checkoutDate: this.$route.query.checkoutDate,
              isForm: false
            })
            .then(res => {
              this.$message.success("提交成功");
              this.$router.go(-1);
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        this.$message.warning("请勾选所有选项");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.shift-form {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > p {
    text-align: center;
    line-height: 88px;
    font-size: 24px;
    font-weight: 600;
  }
  .flow {
    display: flex;
    align-items: center;
    width: 720px;
    padding: 15px;
    margin-top: 20px;
    .text {
      flex: 1;
      p {
        color: #606266;
        line-height: 1.5;
      }
      p:nth-child(1) {
        font-weight: bolder;
      }
      p:nth-child(2) {
        color: #909399;
        font-size: 14px;
      }
    }
    i:nth-child(1) {
      font-size: 44px;
      margin-right: 25px;
    }
    i:nth-child(3) {
      font-size: 36px;
      color: #ccc;
      cursor: pointer;
    }
  }
  .flow.actived {
    .text {
      p:nth-child(1) {
        color: #303133;
      }
    }
    i:nth-child(1) {
      color: #3e8ef7;
    }
    i:nth-child(3) {
      color: #1dcc8d;
    }
  }
  .tips {
    margin-top: 15px;
    width: 720px;
    padding: 10px 20px 20px 20px;
    border-radius: 12px;
    background-color: #fafafa;
    .warning {
      // text-align: center;
      padding: 10px;
      color: #ff6600;
    }
    .success {
      padding: 10px;
      color: #5eb300;
    }
    > p {
      padding-left: 18px;
      line-height: 1.5;
      color: #76838f;
      font-size: 14px;
    }
    .btn {
      text-align: center;
      margin-top: 15px;
    }
  }
}
</style>
