<!--用于打印的布局-->
<template>
  <div :class="containerClass">
    <router-view />
    <div class="buttons">
      <el-button type="primary" @click="print">打印</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      containerClass: 'print-container'
    }
  },
  created() {
    let f = this.$route.query.from;
    if(f) {
      this.containerClass += " " + f;
    }
  },
  methods: {
    print() {
      window.print();
      /* this.$confirm('确认要打印这些表单吗?', '打印表单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.print();
      }); */
    }
  }
}
</script>

<style lang="less">
@import url('../assets/styles/print.less');
</style>

<style lang="less">
// 嵌入到APP里面
.consoleapp {
  padding: 0 10px 0 10px;
  margin-bottom: 0px;

  .buttons {
    display: none;
  }
}
</style>