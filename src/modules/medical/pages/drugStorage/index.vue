<template>
  <div class="content">
    <div class="menus">
      <el-row gutter="80">
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/drugStorage/medicine')">
            <el-badge class="item wardCategory">
              <i class="iconfont iconicon_yaopinguanli"></i>
            </el-badge>
            <p>药品管理</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/drugStorage/storeCheck')">
            <el-badge class="item history">
              <i class="iconfont iconicon_kucunchaxun"></i>
            </el-badge>
            <p>库存查询</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/drugStorage/store/storeInMain')">
            <el-badge class="item template21">
              <i class="iconfont iconicon_caigouruku"></i>
            </el-badge>
            <p>采购入库</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push({path:'/medical/drugStorage/store/storeList',query:{type:2}})">
            <el-badge class="item template31">
              <i class="iconfont iconicon_yaopinchuku"></i>
            </el-badge>
            <p>药品出库</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push({path:'/medical/drugStorage/store/checkList'})">
            <el-badge class="item template41">
              <i class="iconfont iconicon_kucunpandian"></i>
            </el-badge>
            <p>库存盘点</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active disabled">
            <el-badge class="item template8">
              <i class="iconfont iconicon_yaopintiaojia"></i>
            </el-badge>
            <p>药品调价</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/drugStorage/supplierList')">
            <el-badge class="item template41">
              <i class="iconfont iconicon_gongyingshang"></i>
            </el-badge>
            <p>供应商</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active disabled">
            <el-badge class="item template41">
              <i class="iconfont iconicon_changzheyaoxiang"></i>
            </el-badge>
            <p>长者药箱</p>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<style scoped>
.content {
  width: 100%;
  height: 350px;
}
.menus {
  width: 80%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.active {
  width: 124px;
  height: 124px;
  background: #f1f3fe;
  text-align: center;
  vertical-align: middle;
  border-radius: 8px;
  cursor: pointer;
  display: inline-block;
}
.active:focus,
.active:hover {
  background: #d0d4ee;
  font-weight: 700;
}
.el-badge {
  width: 56px;
  height: 56px;
  line-height: 100px;
  vertical-align: baseline;
}

.el-badge i {
  font-size: 56px;
  padding: 10px;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 16px;
}

.active i {
  color: #6178f6;
  font-size: 40px;
  padding: 10px;
}
.active p {
  font-size: 14px;
  color: #6178f6;
  margin-top: 8px;
}

.disabled {
  opacity: 0.6;
  cursor: default;
}
.el-col {
  margin-top: 16px;
}
</style>