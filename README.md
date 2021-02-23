## 智慧养老云服务平台信息化系统

> 后台管理系统UI

### 项目结构
```
├── build  #webpack编译相关文件目录，一般不用动
├── config  #配置目录，一般不用动
├── dist  #生产环境下build后的文件存放目录（发布目录）
├── static  #开发模式下的静态资源目录
├── src #源码目录
│   ├─── assets  #资源目录
|   |    ├─── images #小图片存放目录（20K以内），大图片请放到OSS上
|   |    ├─── styles #公共样式文件，一般不允许自己修改，所有样式建议使用less格式书写
│   ├─── components  #公共组件及框架组件，一般不允许在此添加文件
│   ├─── layouts  #页面布局组件，基本布局都已经好了，一般不允许在此添加文件
|   |    ├─── console.vue #登录页等全屏的布局
|   |    ├─── default.vue #无侧边菜单的布局
|   |    ├─── index.vue #有侧边菜单的布局
|   |    ├─── page.vue #有侧边菜单的布局，实际业务页面均使用此布局
│   ├─── router  #总路由目录，一般不允许添加，如若需要请按照index.js内容依样添加内容
│   ├─── settings  #公用配置文件目录，主要保存API服务器地址及根据环境进行API地址切换
|   |    ├─── development.js #开发环境的配置，主要配置集成在youban-utils组件里了
|   |    ├─── production.js #线上或测试环境的配置，请不要修改
|   |    ├─── index.js #配置的入口文件，请不要修改
│   ├─── store #vuex相关目录
│   ├─── utils #公共工具类目录，如若添加修改请告知
│   ├─── modules #业务页面代码主目录，请按模块分类建立文件夹
|   |    ├─── console #登录等框架页面目录，请不要修改
|   |    |    ├─── pages #每个模块的页面请放到各自的pages目录
|   |    |    ├─── routes.js #每个模块的路由配置信息，路由使用动态载入，请按相应的格式书写
|   |    ├─── desktop #工作台模块
|   |    ├─── elder #长者服务模块
|   |    ├─── oa #智慧办公模块
|   |    ├─── finance #老人账户结算模块
│   ├─── App.vue #项目入口组件，请勿修改
│   ├─── bus.js  #公共通信组件，请勿修改
│   └─── main.js  #项目的入口文件，请勿修改
├── index.html #首页入口文件，你可以添加一些 meta 信息或同统计代码啥的
├── package.json #项目配置/依赖文件
└── README.md #项目的说明文档，markdown 格式
```

## 项目约定

### 接口统一调用方式

所有调用服务端的接口统一使用以下方法，此方法依附在axios上，方法原型如下：
``` js
async function fetch(serverName, path, params, dataType = "form", method = "POST", throwError = false)
```
参数含义如下：
- serverName：后台服务名称，由框架统一定义，具体可参看文档
- path：服务路径，一般以“/”打头
- params：服务调用参数，Object或FormData对象
- dataType：参数格式，默认为form格式，目前还有json表示json格式
- method：请求方法，默认为POST
- throwError：是否抛出错误，否的话框架会自动调用element-ui显示出错信息

调用示例：
``` js
logout() {
  let that = this;
  // 调用登出接口
  axios.fetch("userServer", "/user/logout", { appNo: 'console' }).then(response => {
    if (response.code == 200) {
      that.$message({
        message: "登出成功",
        type: "success"
      });
    }
  })
}
```

更多信息请参见文档：https://i.youbankeji.com/document/index?document_id=217

## 启动步骤

``` bash
# 安装项目依赖
npm install --registry https://i.youbankeji.com/nexus/content/groups/youban-npm/

# 本地运行
npm run dev

# 发布上线
npm run build
```
