<template>
  <!-- 健康档案-病程记录 -->
  <div class="progress-note bingchengjilu">
    <div class="bcjilu" v-for="(item,index) in bcData" :key="index">
      <p class="banner">{{item.name}} | 2019年11月25日 18:00</p>
      <table>
        <tr>
          <td class='leftCenter'>主诉</td>
          <td colspan="8">{{item.zs}}</td>
        </tr>
        <tr>
          <td class='leftCenter' rowspan="2">生命体征</td>
          <td class="leftCenterbg">体温</td>
          <td class='leftCenter'>{{item.tw}}℃</td>
          <td class="leftCenterbg">心率</td>
          <td class='leftCenter'>{{item.xl}}次/分</td>
          <td class="leftCenterbg">脉搏</td>
          <td class='leftCenter'>{{item.mb}}次/分</td>
          <td class="leftCenterbg">呼吸</td>
          <td class='leftCenter'>{{item.hx}}次/分</td>
        </tr>
        <tr>
          <td class="leftCenterbg">睡眠状况</td>
          <td class='leftCenter'>
            <el-popover v-if="item.sm=='异常'" placement="right-end" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <el-button slot="reference" style="border: none;line-height: 0;height: auto;">{{item.sm}}</el-button>
            </el-popover>
            <span v-else>{{item.sm}}</span>
          </td>
          <td class="leftCenterbg">饮食状况</td>
          <td class='leftCenter'>{{item.ys}}</td>
          <td class="leftCenterbg">大小便情况</td>
          <td class='leftCenter'>{{item.xb}}</td>
          <td class="leftCenterbg">血压</td>
          <td class='leftCenter'>{{item.xy}}/100mmHg</td>
        </tr>
        <tr>
          <td class='leftCenter'>其它</td>
          <td colspan="8">{{item.qt}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script type="text/javascript">
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      bcData: [
        {
          name: "黄俊宇",
          zs: "半夜起夜床",
          tw: "32",
          xl: "70",
          mb: "23",
          hx: "61",
          sm: "正常",
          ys: "一般",
          xb: "正常",
          xy: "22",
          qt: "快要大小便失禁了"
        },
        {
          name: "江雨婷",
          zs: "未老先衰",
          tw: "32",
          xl: "2",
          mb: "23",
          hx: "61",
          sm: "异常",
          ys: "一般",
          xb: "正常",
          xy: "22",
          qt: "老人生命垂危，已于19：20送往市医院",
          detail: "该老人身体不适，一直在吃药，最近处于浅睡状态，后续持续观察"
        },
        {
          name: "江雨婷",
          zs: "未老先衰",
          tw: "32",
          xl: "2",
          mb: "23",
          hx: "61",
          sm: "异常",
          ys: "一般",
          xb: "正常",
          xy: "22",
          qt: "老人生命垂危，已于19：20送往市医院",
          detail: "该老人身体不适，一直在吃药，最近处于浅睡状态，后续持续观察"
        },
        {
          name: "江雨婷",
          zs: "未老先衰",
          tw: "32",
          xl: "2",
          mb: "23",
          hx: "61",
          sm: "异常",
          ys: "一般",
          xb: "正常",
          xy: "22",
          qt: "老人生命垂危，已于19：20送往市医院",
          detail: "该老人身体不适，一直在吃药，最近处于浅睡状态，后续持续观察"
        },
        {
          name: "江雨婷",
          zs: "未老先衰",
          tw: "32",
          xl: "2",
          mb: "23",
          hx: "61",
          sm: "异常",
          ys: "一般",
          xb: "正常",
          xy: "22",
          qt: "老人生命垂危，已于19：20送往市医院",
          detail: "该老人身体不适，一直在吃药，最近处于浅睡状态，后续持续观察"
        },
        {
          name: "江雨婷",
          zs: "未老先衰",
          tw: "32",
          xl: "2",
          mb: "23",
          hx: "61",
          sm: "异常",
          ys: "一般",
          xb: "正常",
          xy: "22",
          qt: "老人生命垂危，已于19：20送往市医院",
          detail: "该老人身体不适，一直在吃药，最近处于浅睡状态，后续持续观察"
        }
      ]
    };
  },
  mounted() {},
  components: {},
  computed: {
    state: {
      get() {
        return this.$store.getters.showChilds;
      },
      set() {}
    },
    firstZhuTi: {
      get() {
        return this.$store.getters.firstColors;
      },
      set() {}
    },
    secondZhuTi: {
      get() {
        return this.$store.getters.secondColors;
      },
      set() {}
    },
    thirdZhuTi: {
      get() {
        return this.$store.getters.thirdColors;
      },
      set() {}
    }
  },
  created() {},
  methods: {},
  filters: {}
};
</script>

<style lang="less" scoped>
.progress-note {
  flex: 1;
  background-color: #fff;
}
.bingchengjilu {
  padding: 5px 15px 20px 15px;
}
.bingchengjilu .bcjilu {
  width: 60%;
  /*border: 1px solid #000000;*/
}
.bingchengjilu .banner {
  margin: 15px 0;
  font-style: 14px;
  color: #333;
}
.bingchengjilu table {
  width: 100%;
}
.bingchengjilu table td {
  border: 1px solid #dcdfe6;
  color: #666;
  font-size: 14px;
  padding: 10px 0 10px 5px;
}
.bingchengjilu table td:first-child {
  color: #333;
}
.leftCenter {
  text-align: center;
}
.leftCenterbg {
  text-align: center;
  color: #666;
  background: #f3f3f3;
}
.bingchengjilu .el-button:hover {
  color: #eb6969;
}
</style>
