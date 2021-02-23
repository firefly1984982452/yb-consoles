<template>
  <div class="content">
    <ul class="chooseTag">
      <li :class="currentTag=='tag1'?'current':''" @click="currentTag='tag1'">基础项</li>
      <li :class="currentTag=='tag2'?'current':''" @click="currentTag='tag2'">分摊项</li>
      <li :class="currentTag=='tag3'?'current':''" @click="currentTag='tag3'">消费项</li>
      <li :class="currentTag=='tag4'?'current':''" @click="currentTag='tag4'">自带物品</li>
      <li :class="currentTag=='tag5'?'current':''" @click="currentTag='tag5'">补贴项</li>
    </ul> 
    <component :is="currentTag"></component>

    <!-- <el-dialog title="编辑保证金" :visible.sync="dialogVisible" width="530px" center="true">
      <el-form label-width="90px">
        <el-form-item label="收费名称">
          <span>入院保证金</span>
        </el-form-item>
        <el-form-item label="收费标准">
          <el-input  placeholder="请输入"  type="text" ></el-input>
        </el-form-item>
        <el-form-item label="凭证">
          <el-select  placeholder="请选择凭证" size="mini" style="width:173px" >
              <el-option label="收据" value="收据"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input  placeholder="请输入备注"  type="textarea" rows="3" style="width:350px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>        
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { axios } from 'youban-utils';
import tag1 from '@/modules/finance/pages/charge/tag1';
import tag2 from '@/modules/finance/pages/charge/tag2';
import tag3 from '@/modules/finance/pages/charge/tag3';
import tag4 from '@/modules/finance/pages/charge/tag4';
import tag5 from '@/modules/finance/pages/charge/tag5';
export default {
  components:{tag1,tag2,tag3,tag4,tag5},
  data(){
    return {
      currentTag:'tag1'
    }
  },
}
</script>
<style lang="less" scoped>
.chooseTag{
  margin-bottom: 15px;
  li{
    display: inline-block;
    vertical-align: top;
    width: 95px;
    text-align: center;    
    line-height: 36px;
    height: 36px;
    cursor: pointer;
  }
  li.current{
    background: #4687E1;
    border-radius: 4px;
    color: #fff;
  }
}
</style>