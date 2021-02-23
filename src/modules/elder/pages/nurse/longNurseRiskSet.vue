<template>
  <el-card class="box-card" style="margin: 0 0 20px 0;">
    <div slot="header" class="clearfix">
      <span>长护险等级补贴与护理项目配置</span>
      <span class="annotation" v-show="isCare">
        <el-icon class="el-icon-info"></el-icon>已对接长护险结算系统，收费标准以最终实际结算结果为准
      </span>
    </div>
    <div class="text item">
      <div :key="index" class="tableContent">
        <el-table :data="allData" border :header-cell-style="{ background: '#F3F3F5' }">
          <el-table-column prop="itemType" label="护理等级" align="center"></el-table-column>
          <el-table-column align="center" label="收费标准">
            <template slot-scope="scope">
              <span>{{ scope.row | datamatter2 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="evidence" label="凭证" align="center"></el-table-column>
          <el-table-column prop="remark" label="说明" align="center"></el-table-column>
          <el-table-column label="护理项目" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.num}}项</span>
            </template>
          </el-table-column>
          <el-table-column label="设置" align="center">
            <template slot-scope="scope">
              <el-link class="el-icon-edit" @click="updateFee(scope.row)" type="primary">收费标准</el-link>
              &emsp;
              <el-link type="primary" @click="detail(scope.row)">护理项目</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 修改护理等级 -->
    <el-dialog center title="设置收费标准" :visible.sync="dialogNewVisible" width="450px">
      <el-form :rules="rules" label-width="80px">
        <el-form-item label="护理等级" prop="checkoutRemark">
          <b>{{ newInfo.itemType }}</b>
        </el-form-item>
        <el-form-item label="收费标准" prop="checkoutDate">
          <b v-if="type === 3">按实</b>
          <div v-else>
            <el-input style="width: 50%" v-if="type === 0" v-model="newInfo.feeAmount" maxlength="15"></el-input>
            <el-input style="width: 50%" v-if="type === 1" v-model="newInfo.feeAmountDay" maxlength="15"></el-input>
            <span>{{ newInfo.feeAmountRemark }}</span>
          </div>
        </el-form-item>
        <el-form-item label="凭证" prop="checkoutDate">
          <el-select v-model="newInfo.evidence" placeholder="请选择">
            <el-option v-for="item in optionsEvidence" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" v-model="newInfo.remark" maxlength="200" show-word-limit clearable></el-input>
        </el-form-item>
        <div class="buttons" style="text-align:center;">
          <el-button type="primary" @click="submitApply()">确认修改</el-button>
          <el-button @click="dialogNewVisible = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 长护险护理项目详情 -->
    <el-dialog :title="'设置【' + dialogTitle + '】的默认护理项目'" center :visible.sync="dialogOptionVisible" id="optionDialog" width="550px">
      <div class="el-checkbox-box">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.title" v-for="(item,index) in checkboxList" :key="index"></el-checkbox>
        </el-checkbox-group>
        <div class="button-box">
          <el-button type="primary" @click="saveNew()">确认</el-button>
          <el-button @click="dialogOptionVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script type="text/javascript">
import tenant from "@/components/_tenant";
export default {
  name: "LongNurseRiskSet",
  data() {
    return {
      isCare: false, // 是否对接了医保
      allData: [], // 所有数据
      currentTag: 0,
      dialogNewVisible: false,
      dialogOptionVisible: false,
      dialogTitle: '',
      newInfo: {},
      optionsEvidence: [
        {
          value: "收据",
          label: "收据"
        },
        {
          value: "发票",
          label: "发票"
        },
        {
          value: "代收代付",
          label: "代收代付"
        }
      ],
      type: "",// 修改时控制展示哪个字段
      checkList: [],
      checkboxList: [{ title: '' }],
      currentLevel: 0
    };
  },
  async created() {
    let data = await tenant.fetchCurrentTenant();
    let setting = tenant.getTenantSetting('medical_agent', data);
    this.isCare = setting != null ? true : false;
    this.getdata();
    this.getItemViewsByParentNo();
  },
  methods: {
    getItemViewsByParentNo() {
      axios.fetch("commonServer", "/dict/getItemViewsByParentNo", { parentNos: '长护险护理项目' }).then(res => {
        this.checkboxList = res.data;
      });
    },
    getdata() {
      // 初始化获取所有数据
      let param = {
        category: "补贴项",
        title: "长护险"
      }
      axios.fetch("financeServer", "/accountStandard/all", param).then(res => {
        if (res.code == 200) {
          this.allData = res.data;
        }
      });
    },
    datamatter(row, column, cellValue) {
      if (Number(row.feeAmount) > 0) {
        return `${row.feeAmount} ${row.feeAmountRemark}`;
      } else if (Number(row.feeAmountDay) > 0) {
        return `${row.feeAmountDay} ${row.feeAmountRemark}`;
      } else {
        return "按实";
      }
    },
    detail(val) {
      this.currentLevel = val.standardCode.substr(val.standardCode.length - 1, 1)

      axios.fetch("elderServer", "/elderInsuranceItem/insuranceTitle", { insuranceLevel: this.currentLevel }).then(res => {
        if (res.code == 200) {
          this.checkList = res.data.map(val => val.itemTitle);
        }
      });
      this.dialogTitle = val.itemType;
      this.dialogOptionVisible = true;
    },
    saveNew() {
      let newArr = this.checkList.map(val => {
        let arr = this.checkboxList.filter(v => v.title === val);
        return {
          itemNo: arr[0].itemNo,
          itemTitle: arr[0].title
        }
      })
      if (!newArr.length && this.isCare) {
        return this.$message.error('请至少选择1个配置内容！')
      }
      let param = {
        level: this.currentLevel,
        elderInsuranceItems: newArr
      }
      axios.fetch("elderServer", "/elderInsuranceItem/bingInsuranceTitle", param, 'json').then(res => {
        if (res.code == 200) {
          this.getdata();
          this.dialogOptionVisible = false;
        }
      });
    },
    updateFee(val) {
      console.log(val);
      if (val.feeAmount > 0) {
        this.type = 0;
      } else if (val.feeAmountDay > 0) {
        this.type = 1;
      } else {
        this.type = 3;
      }
      this.newInfo = Object.assign({}, this.newInfo, val);
      this.dialogNewVisible = true;
    },
    submitApply() {
      console.log(this.newInfo);
      if (Number.isNaN(Number(this.newInfo.feeAmountDay))) {
        return this.$message.error('收费标准请输入正确金额！')
      }
      if (this.type === 0 && this.newInfo.feeAmount <= 0) {
        this.$message.warning('收费标准必须大于0!');
        return false;
      }
      if (this.type === 1 && this.newInfo.feeAmountDay <= 0) {
        this.$message.warning('收费标准必须大于0!');
        return false;
      }
      axios
        .fetch("financeServer", "/accountStandard/submit", this.newInfo, "json")
        .then(res => {
          if (res.code === 200) {
            this.$message.success("修改成功");
            this.newInfo = {};
            this.dialogNewVisible = false;
            this.getdata();
          }
        });
    },
  },
  components: {},
  filters: {
    datamatter2(row) {
      if (Number(row.feeAmount) > 0) {
        return `${row.feeAmount} ${row.feeAmountRemark}`;
      } else if (Number(row.feeAmountDay) > 0) {
        return `${row.feeAmountDay} ${row.feeAmountRemark}`;
      } else {
        return "按实";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.annotation {
  padding: 0 13px;
  color: #ff5b21;
  font-size: 13px;
}
.el-checkbox-box {
  width: 450px;
  margin: 0 auto;
  .el-checkbox-group {
    height: 400px;
    overflow-y: auto;
    .el-checkbox {
      display: block;
      line-height: 30px;
    }
  }
  .button-box {
    text-align: center;
    margin: 20px;
  }
}
</style>
