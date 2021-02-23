<template>
    <div class="null">
        <div class="page">
            <img src="../assets/images/icon-echarts-null.png" alt="" srcset="">
            <p>敬请期待</p>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.null{
    display: flex;
    justify-content: center;
    align-items: center;
    height:30vh;
    .page{
        display: flex;
        height: 75px;
        justify-content: space-between;
        flex-direction: column;
        img{
            width: 64px;
            height: 41px;
        }
        p{
            width:60px;
            height:22px;
            font-size:14px;
            font-weight:400;
            color:rgba(0,0,0,1);
            line-height:22px;
        }
    }
}
</style>