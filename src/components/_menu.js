// 菜单模块内部使用
import {
  permission
} from "youban-utils";

const gotoPage = function (item, vue, replace) {
  vue = vue ? vue : this;
  let url = item.url;
  if (!url) {
    vue.$message.info("【" + item.title + "】尚未开放，敬请期待");
    console.log(item.title + " 未配置Url")
    return false;
  }
  vue.$emit("clickMenu", false);
  let currentPath = vue.$route.path.toLowerCase();
  if (currentPath == url.toLowerCase()) {
    console.info("当前路由一致，不可进行跳转");
    return false;
  }
  if (!url.startsWith("//") && url.startsWith("/")) {
    let result = replace ? vue.$router.replace(url) : vue.$router.push(url);
    result.catch(e => {
      console.info("当前路由一致，不可进行跳转：" + e.message);
    });
  } else {
    //处理打开新窗口的菜单
    if (url.startsWith("^")) {
      url = url.substr(1);
      window.open(url);
    } else if (url.startsWith("~")) { // 处理不是本项目的地址，但处在同一个域名下
      url = url.substr(1);
      window.location.href = url;
    } else { 
      window.location.href = url;
    }
  }
  return true;
}

const hideMenu = function (vue) {
  vue = vue ? vue : this;
  vue.$emit("clickMenu", false);
}

const gotoDesktop = function (vue, replace) {
  let item;
  if (permission.hasPermission('uban.oa.desktop.leader')) {
    item = {
      title: '院长工作台',
      url: '/desktop/leader'
    }
  } else if (permission.hasPermission('uban.oa.desktop.finance')) {
    item = {
      title: '财务工作台',
      url: '/desktop/finance'
    }
  } else if (permission.hasPermission('uban.oa.desktop.biz')) {
    item = {
      title: '业务工作台',
      url: '/desktop/bussiness'
    }
  } else {
    item = {
      title: '工作台',
      url: '/desktop/default'
    }
  }
  vue = vue ? vue : this;
  gotoPage(item, vue, replace);
}

export default {
  gotoPage,
  hideMenu,
  gotoDesktop
}
