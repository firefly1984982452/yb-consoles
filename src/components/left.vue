<template>
  <div class="left">
    <ul>
      <li @click="gotoPageCurrent(item)" v-for="(item, index) in menuList" :key="index" :class="currentClass(item)">
        <p><i :class="item.icon"></i></p>
        <span>{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { axios } from 'youban-utils';
import menuMethods from './_menu';

export default {
  name: 'main-left',
  data() {
    return {
      menuList: [],
      viewableResouces: [],
      isClickBySelf: false
    }
  },
  watch: {
    $route(to, from) {
      if(!this.isClickBySelf) {
        this.showMenu();
      }
      this.isClickBySelf = false;
    }
  },
  methods: {
    ...menuMethods,
    gotoPageCurrent(item) {
      this.isClickBySelf = this.gotoPage(item);
    },
    currentClass(item) {
      let route = this.$route;
      let path = route.meta.groupPath ? route.meta.groupPath : this.$route.fullPath;
      let isCurrent = item.url && path != null && path.startsWith(item.url);
      return isCurrent ? 'current' : '';
    },
    showMenu() {
      let path = this.$route.fullPath;
      if(!path.endsWith('/')) {
        path += '/';
      }
      let resources = this.viewableResouces;
      let currentItems = [];
      resources.forEach(item => {
        let url = item.url;
        if(url) {
          if(!url.endsWith('/')) {
            url += '/';
          }
          if(path.startsWith(url)) {
            currentItems.push(item);
          }
        }
      });
      let children;
      if(currentItems.length > 0) {
        currentItems.sort((a, b) => {
          return b.level - a.level;
        });
        let currentItem = currentItems[0];
        if(currentItem.level <= 2) {
          children = currentItem.children;
        } else if(currentItem.parent) {
          children = currentItem.parent.children;
        } else {
          children = [currentItem];
        }
      }
      if(!children) {
        children = [];
      }
      
      this.menuList = children;
    }
  },
  created() {
    axios.getCurrentMenus();
    let currentUser = axios.getCurrentUser();
    if(currentUser && currentUser.viewableResouces && currentUser.viewableResouces.length > 0) {
      this.viewableResouces = currentUser.viewableResouces;
      this.showMenu();
    }
  }
}
</script>

<style lang="less" scoped>
.left {
  li {
    text-align: center;
    padding: 15px 0px;
    font-size: 13px;

    i {
      font-size: 1.6rem;
    }

    p {
      padding-bottom: 5px;
    }
  }
  li.current {
    color: #FFF;
    background-color: #3F51B5;
  }
  li:hover {
    color: #038CDB;
    background-color: #EAEAEA;
    cursor: pointer;
  }
  li:active {
    color: #038CDB;
    background-color: #3F51B5;
    cursor: pointer;
  }
  li.current:hover {
    color: #038CDB;
    background-color: #3F51B5;
  }
}
</style>