<template>
  <div class="page">
    <h2 class="title">长者入院档案资料目录</h2>
    <div class="page">
      <table cellspacing="0" cellpadding="0" class="table" border="1">
        <tr style="text-align:center">
          <td width="10%">序号</td>
          <!-- <td width="20%">项目</td> -->
          <td width="40%">资料内容</td>
          <td width="15%">资料选择</td>
          <!-- <td width="25%">页码</td> -->
        </tr>
        <tr v-for="(item,index) in items" :key="index">
          <td style="text-align:center">{{index+1}}</td>
          <!-- <td :rowspan="item.fatherSum" v-if="item.childIndex == 0">{{item.father}}</td> -->
          <td>{{item.title}}</td>
          <td style="text-align:center">
            <span class="noprint">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </span>
            <span class="print">
              <span v-show="item.checked">✓</span>
            </span>
          </td>
          <!-- <td></td> -->
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      items: [
        { title: '入院申请表', checked: true },
        { title: '调查访问表', checked: true },
        { title: '审批表', checked: true },
        { title: '入院通知单', checked: true },
        { title: '照护等级评估材料', checked: true },
        { title: '养老服务合同', checked: true },
        { title: '体验报告（或近期出院小结）', checked: true },
        { title: '长者住养告知书', checked: true },
        { title: '委托约定', checked: true },
        { title: '入院介绍', checked: true },
        { title: '老人长护险事宜的知情告知书', checked: true },
        { title: '老年人身份证和户口簿复印件', checked: true },
        { title: '担保人身份证复印件及联系方式等', checked: true },
        { title: '变更项目确认表', checked: true },
      ]
    };
  },
  created() {
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  z-index: 0 !important;
}
.page {
  width: 700px;
  position: relative;
  left: 50%;
  margin-left: -350px;
}
.ul {
  width: 500px;
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    // display: flex;
    // justify-content: space-between;
    font-size: 20px;
    line-height: 2em;
    font-family: monospace;
    // text-align: center;
    position: relative;
    border-bottom: dotted 2px #999;
    padding: 41px 0 5px 0;
    .strong {
      position: absolute;
      left: 0;
      bottom: -1em;
      background: #fff;
      padding-left: 10px;
    }
    .em {
      position: absolute;
      right: 0;
      bottom: -1em;
      background: #fff;
      padding-left: 10px;
    }
  }
  /* clearfix */
  .menu li:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
</style>

<style type="text/css">
@media screen {
  .print {
    display: none;
  }
}
@media print {
  .noprint {
    display: none;
  }
}
</style>