<template>
  <!--菜单列表-->
  <div>
    <div class="menu-mask" @click="hideMenu()" v-if="menuVisible">
      <div class="button">
        <img src="@/assets/images/btn_home.png" />
      </div>
    </div>
    <transition name="el-zoom-in-center">
      <div class="menu" v-if="menuVisible">
        <el-row class="title">
          <span @click="gotoDesktop()"><i class="el-icon-arrow-left"></i>我的工作台</span>
        </el-row>
        <el-row class="content">
          <div class="item" v-for="(item,index) in menuGroups" :key="index">
            <el-row class="group">
              <span>{{ item.title }}</span>
            </el-row>
            <el-row class="list">
              <el-col :span="6" v-for="(it,idx) in item.children" :key="idx">
                <el-button @click="gotoPage(it)">
                  <p><i :class="it.icon"></i></p>
                  <span>{{ it.title }}</span>
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div class="item">&nbsp;</div>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script>
import { axios } from 'youban-utils';
import menuMethods from './_menu';

export default {
  name: 'main-menu',
  props: {
    menuVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuGroups: []
    }
  },
  created() {
    let menus = axios.getCurrentMenus();
    if(menus && menus[0] && menus[0].children && menus[0].children.length > 0) {
      this.menuGroups = menus[0].children;
    }
  },
  methods: {
    ...menuMethods
  }
}
</script>

<style lang="less" scoped>
.menu-mask {
  position: absolute;
  background: transparent;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 9;

  .button {
    height: 60px;
    width: 100px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;

    img {
      margin-top: 18px;
      width: 28px;
      height: 23px;
    }
  }
}
.menu {
  background: #fff;
  position: absolute;
  z-index: 10;
  width: 420px;
  height: ~"calc(100% - 80px)";
  padding-top: 20px;
  box-shadow: 0 10px 12px 0 #999;
  color: #777;
  top: 60px;
  overflow: hidden;

  .title {
    margin: 0 0 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 12px;
    cursor: pointer;
    color: #000;

    i {
      margin: 0 15px 0 20px;
      color: #444444;
    }
    span {
      color: #222222;
      font-size: 16px;
    }
  }

  .content {
    overflow: auto;
    scrollbar-width: none;
    height: 100%;
    background-color: #fff;

    &::-webkit-scrollbar { /* WebKit */
      display: none;
    }
    -ms-overflow-style:none; /* Edge */
	  scrollbar-width: none; /* Firefox */
  }

  .item {
    padding: 10px 15px;

    .group {
      margin-bottom: 10px;

      span {
        color: #000;
        font-weight: bold;
      }
    }

    .list {
      button {
        padding: 15px;
        border: 1px solid #fff;
        font-size: 13px;
        color: #777;
      }
      button:hover {
        background-color: #EAEAEA;
      }
      button:active {
        background-color: #EAEAEA;
      }
      i {
        font-size: 1.6rem;
      }
      p {
        margin-bottom: 14px;
      }
    }
  }
}
</style>