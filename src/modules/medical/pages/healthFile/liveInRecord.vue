<template>
  <!-- 健康档案详情-入院记录 -->
  <div class="live-record ruyuanxinxi">
    <p class="banner">{{ tableData.eldeName }} | {{ tableData.eldeName }}</p>
    <div class="ruyuanTable">
      <table>
        <tr>
          <td width="10%">主诉</td>
          <td>{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>现病史</td>
          <td colspan="3">{{ tableData.eldeName }}</td>
          <td>过去史</td>
          <td colspan="3">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>个人及月经史</td>
          <td colspan="3">{{ tableData.eldeName }}</td>
          <td>过敏及药敏史</td>
          <td colspan="2">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>家族史</td>
          <td colspan="6">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td rowspan="2">生命体征</td>
          <td class="itemLabel">体温</td>
          <td class="itemLabelwhite">{{ tableData.eldeName }}</td>
          <td class="itemLabel">心率</td>
          <td class="itemLabelwhite">{{ tableData.eldeName }}</td>
          <td class="itemLabel">高压</td>
          <td class="itemLabelwhite">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td class="itemLabel">呼吸</td>
          <td class="itemLabelwhite">{{ tableData.eldeName }}</td>
          <td class="itemLabel">脉搏</td>
          <td class="itemLabelwhite">{{ tableData.eldeName }}</td>
          <td class="itemLabel">低压</td>
          <td class="itemLabelwhite">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>一般情况</td>
          <td colspan="6">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>胸部</td>
          <td colspan="3" {{ tableData.eldeName }}</td> <td>肺部</td>
          <td colspan="2">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>心脏</td>
          <td colspan="3">{{ tableData.eldeName }}</td>
          <td>腹部</td>
          <td colspan="2">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>四肢</td>
          <td colspan="3">{{ tableData.eldeName }}</td>
          <td>头、颈部</td>
          <td colspan="2">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>会阴部</td>
          <td colspan="3">{{ tableData.eldeName }}</td>
          <td>脊柱、肾区</td>
          <td colspan="2">{{ tableData.eldeName }}</td>
        </tr>
        <tr>
          <td>全身皮肤及淋巴结</td>
          <td colspan="3">{{ tableData.skin }}</td>
          <td>神经系统</td>
          <td colspan="2">{{ tableData.nervous }}</td>
        </tr>
        <tr>
          <td>初步诊断</td>
          <td colspan="6">{{ tableData.diagnosis }}</td>
        </tr>
        <tr>
          <td>诊疗计划</td>
          <td colspan="6">{{ tableData.treatment }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "LiveInRecord",
  data() {
    return {
      tableData: {}
    };
  },
  components: {},
  created() {
    const documentId = this.$route.query.documentId
      ? Number(this.$route.query.documentId)
      : "";
    this.initData(documentId);
  },
  methods: {
    async initData(id) {
      const res = await axios.fetch(
        "medicalServer",
        "/elderDocument/selectElderDocumentByPrimaryKey",
        {
          documentId: id
        }
      );
      this.tableData = res.data[0];
    }
  }
};
</script>

<style lang="less" scoped>
.live-record {
  flex: 1;
  background-color: #fff;
}
.ruyuanxinxi {
  padding: 20px 15px;
}
.ruyuanxinxi > .banner {
  font-style: 14px;
  color: #333;
}
.ruyuanxinxi > .ruyuanTable {
  width: 100%;
  margin-top: 15px;
}
.ruyuanxinxi > .ruyuanTable table {
  width: 100%;
}
.ruyuanxinxi > .ruyuanTable table tr td {
  border: 1px solid #dcdfe6;
  color: #666;
  font-size: 14px;
  padding: 10px 0 10px 5px;
}
.ruyuanxinxi > .ruyuanTable table tr td:first-child {
  color: #333;
}
.ruyuanxinxi .itemLabel {
  background: #f3f3f3;
  text-align: center;
}
.ruyuanxinxi .itemLabelwhite {
  text-align: center;
}
</style>
