<template>
  <div class="first">
    <!--评估参数项目总结-->
    <div>
      <h2>评估参数项目总结</h2>
      <table class="tableCss assessSum">
        <tr>
          <td width="20%" rowspan="2">{{addEstimateItemVos[0].itemCategory}}</td>
          <td width="20%">程度等级</td>
          <td>
            <el-radio-group v-model="addEstimateItemVos[0].itemName">
              <el-radio v-for="(p,index) in point1" :label="p.itemName" disabled :key="index">{{p.itemName}}</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td>评语</td>
          <td>
            <el-input style="width:100%;" type="textarea" maxlength="20" show-word-limit v-model="addEstimateItemVos[0].doctorRemark" placeholder="请输入"></el-input>
          </td>
        </tr>
        <tr>
          <td rowspan="2">{{addEstimateItemVos[1].itemCategory}}</td>
          <td>程度等级</td>
          <td>
            <el-radio-group v-model="addEstimateItemVos[1].itemName">
              <el-radio v-for="(p,index) in point2" :label="p.itemName" :key="index" disabled>{{p.itemName}}</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td>评语</td>
          <td>
            <el-input style="width:100%;" type="textarea" maxlength="20" show-word-limit v-model="addEstimateItemVos[1].doctorRemark" placeholder="请输入"></el-input>
          </td>
        </tr>
        <tr>
          <td rowspan="2">{{addEstimateItemVos[2].itemCategory}}</td>
          <td>程度等级</td>
          <td>
            <el-radio-group v-model="addEstimateItemVos[2].itemName">
              <el-radio v-for="(p,index) in point3" :label="p.itemName" disabled :key="index">{{p.itemName}}</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td>评语</td>
          <td>
            <el-input style="width:100%;" type="textarea" maxlength="20" show-word-limit v-model="addEstimateItemVos[2].doctorRemark" placeholder="请输入"></el-input>
          </td>
        </tr>
        <tr>
          <td rowspan="2">{{addEstimateItemVos[3].itemCategory}}</td>
          <td>程度等级</td>
          <td>
            <el-radio-group v-model="addEstimateItemVos[3].itemName">
              <el-radio v-for="(p,index) in point4" :label="p.itemName" disabled :key="index">
                <span v-if="p.itemName">
                  {{p.itemName}}
                </span>
                <span v-else>
                  一
                </span>
              </el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td>评语</td>
          <td>
            <el-input style="width:100%;" type="textarea" maxlength="20" show-word-limit v-model="addEstimateItemVos[3].doctorRemark" placeholder="请输入"></el-input>
          </td>
        </tr>
      </table>
      <el-row :gutter="0" style="text-align:center;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "First",
  data() {
    return {
      addEstimateItemVos: [
        {
          itemCategory: "生活自理能力",
          itemName: "",
          doctorRemark: "",
          itemId: ""
        },
        {
          itemCategory: "认知能力",
          itemName: "",
          doctorRemark: "",
          itemId: ""
        },
        {
          itemCategory: "情绪行为",
          itemName: "",
          doctorRemark: "",
          itemId: ""
        },
        {
          itemCategory: "视觉能力",
          itemName: "",
          doctorRemark: "",
          itemId: ""
        }
      ],
      point1: [
        {
          mark: "生活自理能力",
          itemName: "正常",
          doctorRemark: "自理能力正常"
        },
        {
          itemName: "轻度",
          doctorRemark: "生活需由护理员适当照顾"
        },
        {
          itemName: "中度",
          doctorRemark: "生活半自理，需由护理员经常照顾"
        },
        {
          itemName: "重度",
          doctorRemark: "生活需完全由护理员照顾"
        }
      ],
      point2: [
        {
          mark: "认知能力",
          itemName: "正常",
          doctorRemark: "认知能力尚好"
        },
        {
          itemName: "轻度",
          doctorRemark: "记忆力减退"
        },
        {
          itemName: "中度",
          doctorRemark: "间歇性思维不清"
        },
        {
          itemName: "重度",
          doctorRemark: "思维不清，答非所问"
        }
      ],
      point3: [
        {
          mark: "情绪行为",
          itemName: "正常",
          doctorRemark: "情绪尚好"
        },
        {
          itemName: "轻度",
          doctorRemark: "偶有情绪轻微波动"
        },
        {
          itemName: "中度",
          doctorRemark: "偶有情绪波动"
        },
        {
          itemName: "重度",
          doctorRemark: "情绪时有波动"
        }
      ],
      point4: [
        {
          mark: "视觉能力",
          itemName: "正常",
          doctorRemark: "视物尚好"
        },
        {
          itemName: null,
          doctorRemark: ""
        },
        {
          itemName: "中度",
          doctorRemark: ""
        },
        {
          itemName: "重度",
          doctorRemark: ""
        }
      ],
      levelName: "",
      isDoctorRemark: false,
      version:'',
      lookWording:'视觉能力',
      estimateId: "" // 评估报告的id
    };
  },
  components: {},
  mounted() {
    this.estimateId = this.$route.query.estimateId;
    this.version = this.$route.query.version;
    this.isDoctorRemark = this.$route.query.isDoctorRemark;
    this.getFirstData(this.estimateId);
    console.log(this.version);
    if(!this.version){
      this.lookWording = "视觉听觉";
      this.point4[0].mark = "视觉听觉";
      this.addEstimateItemVos[3].itemCategory = "视觉听觉";
    }
  },
  methods: {
    // 匹配默认评语
    // matchWording(data, point) {
    //   const res = data.filter(item => {
    //     return (item.itemCategory = point[0].mark);
    //   });
    //   point.forEach(o => {
    //     if (res[0].itemName == o.itemName) {
    //       o.doctorRemark = res[0].doctorRemark;
    //     }
    //   });
    // },
    async getFirstData(id) {
      const res = await axios.fetch("elderServer", "/elderEstimate/item", {
        estimateId: id
      });
      this.addEstimateItemVos = res.data.filter(item => {
        return (
          (item.itemTitle == "程度等级" && item.itemCategory == "生活自理能力") ||
          (item.itemTitle == "程度等级" && item.itemCategory == "认知能力") ||
          (item.itemTitle == "程度等级" && item.itemCategory == "情绪行为") ||
          (item.itemTitle == "程度等级" && item.itemCategory == this.lookWording)
        );
      });

      // this.matchWording(this.addEstimateItemVos, this.point1);
      // this.matchWording(this.addEstimateItemVos, this.point2);
      // this.matchWording(this.addEstimateItemVos, this.point3);
      // this.matchWording(this.addEstimateItemVos, this.point4);
      if (!this.isDoctorRemark || this.isDoctorRemark == 'false') {
        this.searchWording(0, this.addEstimateItemVos[0].itemName, this.point1);
        this.searchWording(1, this.addEstimateItemVos[1].itemName, this.point2);
        this.searchWording(2, this.addEstimateItemVos[2].itemName, this.point3);
        this.searchWording(3, this.addEstimateItemVos[3].itemName, this.point4);
      }
    },
    // 根据程度 匹配评语
    searchWording(index, itemName, point) {
      point.forEach(item => {
        if (item.itemName == itemName) {
          this.addEstimateItemVos[index].doctorRemark = item.doctorRemark;
        }
      });
    },
    // change1(val) {
    //   this.searchWording(0, val, this.point1);
    // },
    // change2(val) {
    //   this.searchWording(1, val, this.point2);
    // },
    // change3(val) {
    //   this.searchWording(2, val, this.point3);
    // },
    // change4(val) {
    //   this.searchWording(3, val, this.point4);
    // },
    async save() {
      let flag = this.addEstimateItemVos.every(item=>{
        return item.doctorRemark
      })
      if(flag){
        const param = {
          estimateId: this.estimateId,
          addEstimateItemVos: this.addEstimateItemVos
        };
        console.log(param,'====param');
        
        const res = await axios.fetch(
          "elderServer",
          "/elderEstimateItem/edit",
          param,
          "json"
        );
        if(res.code == 200 ){
          this.$message.success('保存成功');
          this.$router.go(-1);
        }
      } else {
        this.$message.warning('评语不能为空!')
      }
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.first {
  padding: 20px;
  .tableCss {
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
  }
  .tableCss tr td {
    font-size: 14px;
    padding: 14px 30px;
    border: 1px solid #ebeef5;
    text-align: center;
  }
}
</style>
