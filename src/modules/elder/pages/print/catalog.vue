<template>
  <div class="page">
    <h2 class="title">目录</h2>
    <div class="page">
      <ul class="ul menu">
        <!-- <li v-for="item in items" :key="item">{{ item.dispTitle }}</li> -->
        <li v-for="item in items" :key="item">
          <span class="strong">{{ item.dispTitle }}</span>
          <span class="em">{{ item.index }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import printComponents from "./forms";

const titleLength = 12; //标题最长的中文字数

export default {
  data() {
    return {
      items: []
    };
  },
  created() {
    let i = 0;
    let list = [];
    printComponents.forEach(group => {
      group.children.forEach(child => {
        child.index = i++;
        list.push(child);
        // 补齐标题
        child.dispTitle = child.title;
        // let dispTitle = child.title;
        // let len = dispTitle.length;
        // for(let j = len; j < titleLength; j++) {
        //   dispTitle += "…";
        // }
        // if(child.title==='变更项目确认表（1-3）'){
        //   dispTitle+="……";
        // }
        // child.dispTitle = dispTitle + "……………………………………………" + child.index;
      });
    });
    //去除第一项“目录”
    list.splice(0, 1);
    this.items = list;
  }
};
</script>

<style lang="less" scoped>
.page {
  width: 500px;
  position: relative;
  left: 50%;
  margin-left: -250px;
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
