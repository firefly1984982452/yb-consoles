<template>
  <div class="content">
    <div class="menus">
      <el-row gutter="80">
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/template/wardCategory')">
            <el-badge class="item wardCategory">
              <i class="iconfont iconzhinengyihu-mobanzidian-chafangmiaoshumoban"></i>
            </el-badge>
            <p>查房描述模板</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/template/history')">
            <el-badge class="item history">
              <i class="iconfont iconzhinengyihu-mobanzidian-bingshixiangmuzidian"></i>
            </el-badge>
            <p>病史项目字典</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/template/templateContent?type=21')">
            <el-badge class="item template21">
              <i class="iconfont iconzhinengyihu-mobanzidian-bingchenglumoban"></i>
            </el-badge>
            <p>病程录</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/template/templateContent?type=31')">
            <el-badge class="item template31">
              <i class="iconfont iconzhinengyihu-mobanzidian-zhenliaoxiangmu"></i>
            </el-badge>
            <p>诊疗项目</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/template/templateContent?type=41')">
            <el-badge class="item template41">
              <i class="iconfont iconzhinengyihu-mobanzidian-binglimoban"></i>
            </el-badge>
            <p>诊断病历模板</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/template/adviceItems')">
            <el-badge class="item template8">
              <i class="iconfont iconcaozuotubiao-hulizhibiao"></i>
            </el-badge>
            <p>医嘱项目</p>
          </div>
        </el-col>
        <el-col :span="4" class="item">
          <div class="active" @click.stop="$router.push('/medical/template/historyTemplate')">
            <el-badge class="item template41">
              <i class="iconfont iconzhinengyihu-mobanzidian-bingshixiangmumokuai"></i>
            </el-badge>
            <p>病历打印模板</p>
          </div>
        </el-col>
        <!-- <el-col :span="4" class="item">
                    <div class="active disabled">
                        <el-badge class="item template51">
                            <i class="iconfont iconzhinengyihu-mobanzidian-chufangmoban"></i>
                        </el-badge>
                        <p>处方模板</p>
                    </div>
                </el-col> -->
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