<template>
  <div class="checkout-catalog page">
    <h2 class="title">长者入出院档案资料目录</h2>
    <table border cellspacing="0" cellpadding="0" class="table">
      <thead>
        <td>序号</td>
        <td>项目</td>
        <td>资料内容</td>
        <td>资料选择</td>
        <!-- <td>页码</td> -->
      </thead>
      <tbody>
        <tr v-for="(item,index) in items" :key="index">
          <td style="text-align:center" :rowspan="item.fatherSum" v-if="item.childIndex == 0">{{item.fatherIndex}}</td>
          <td style="text-align:left" :rowspan="item.fatherSum" v-if="item.childIndex == 0">{{item.father}}</td>
          <td style="text-align:left" >{{item.title}}</td>
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
      </tbody>
    </table>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "CheckoutCatalog",
  data() {
    return {
      items: [
        {title:'养老服务合同终止记录表',checked:true,fatherIndex:1,father:'服务合同终止档案',childIndex:0,fatherSum:3},
        {title:'出院流转单',checked:true,fatherIndex:1,father:'服务合同终止档案',childIndex:1,fatherSum:3},
        {title:'长者个人物品移交签收表',checked:true,fatherIndex:1,father:'服务合同终止档案',childIndex:2,fatherSum:3},
        {title:'入住申请表',checked:true,fatherIndex:2,father:'入院档案',childIndex:0,fatherSum:14},
        {title:'调查访问表',checked:true,fatherIndex:2,father:'入院档案',childIndex:1,fatherSum:14},
        {title:'审批表',checked:true,fatherIndex:2,father:'入院档案',childIndex:2,fatherSum:14},
        {title:'入院通知单',checked:true,fatherIndex:2,father:'入院档案',childIndex:3,fatherSum:14},
        {title:'照护等级评估材料',checked:true,fatherIndex:2,father:'入院档案',childIndex:4,fatherSum:14},
        {title:'养老服务合同',checked:true,fatherIndex:2,father:'入院档案',childIndex:5,fatherSum:14},
        {title:'体检报告（或近期出院小结）',checked:true,fatherIndex:2,father:'入院档案',childIndex:6,fatherSum:14},
        {title:'委托约定',checked:true,fatherIndex:2,father:'入院档案',childIndex:7,fatherSum:14},
        {title:'入院介绍',checked:true,fatherIndex:2,father:'入院档案',childIndex:8,fatherSum:14},
        {title:'老人长护险事宜的知情告知书',checked:true,fatherIndex:2,father:'入院档案',childIndex:9,fatherSum:14},
        {title:'长者住养告知书',checked:true,fatherIndex:2,father:'入院档案',childIndex:10,fatherSum:14},
        {title:'老年人身份证和户口簿复印件',checked:true,fatherIndex:2,father:'入院档案',childIndex:11,fatherSum:14},
        {title:'担保人身份证复印件及联系方式等',checked:true,fatherIndex:2,father:'入院档案',childIndex:12,fatherSum:14},
        {title:'变更项目确认表',checked:true,fatherIndex:2,father:'入院档案',childIndex:13,fatherSum:14},
        {title:'老人健康档案',checked:true,fatherIndex:3,father:'健康档案',childIndex:0,fatherSum:1},
        ]
    };
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
  z-index: 0!important;
}
.page {
  width: 700px;
  position: relative;
  left: 50%;
  margin-left: -350px;
}
table {
  width: 100%;
  text-align: center;
  thead {
    background-color: #f8f8f8;
  }
}
</style>


<style type="text/css">
	@media print {
		.noprint{
			display: none;
		}
	}
</style>