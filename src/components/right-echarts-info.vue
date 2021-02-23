<template>
    <div class="list">
      <div v-for="item in list" :key="item.title">
        <i :style="item.style"></i>
        <span>{{item.title}}</span>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    list: {
      type:Array,
      default: () => []
    }
  },
  watch:{
    list:{
        handler: function (newval, oldval) {
          console.log(newval,oldval)
        },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
  .list{
    width: auto;
    height: 27px;
    display: flex;
    flex-direction: row;
    div{
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 0 0 10px;
      i{
        display: flex;
        width:10px;
        height:10px;
        background:rgba(105,216,155,1);
        border-radius:50%;
      }
      span{
        width:auto;
        height:17px;
        font-size:13px;
        font-weight:400;
        color:#000000;
        line-height:17px;
        margin: 0 0 0 2px;
      }
    }
  }
</style>
