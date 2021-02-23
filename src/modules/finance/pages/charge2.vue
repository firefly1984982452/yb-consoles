<template>
  <div class="content">
    <ul class="chooseTag">
      <li v-for="(item, i) in categorys" :key="i" :class="currentTag == i ? 'current' : ''" @click="tagClick(i)">
        {{ item }}
      </li>
    </ul>
    <p style="margin: 20px;" v-show="categorys[currentTag] == '消费项'"><i class="el-icon-info"></i>提示：各个收费项在【消费管理 -> 消费项目】中配置维护。</p>
    <p style="margin: 20px;" v-show="categorys[currentTag] == '医药项'"><i class="el-icon-info"></i>提示：各个收费项在【智慧医疗 -> 配置维护 -> 费用类型】中配置维护。</p>

    <div v-for="(title, index) in titles" :key="index" class="tableContent">
      <div class="header">
        <s :class="`ba${(index % 7) + 1}`"></s>
        <p>{{ title }}</p>
      </div>
      <el-table :data="tableDataObj[title]" border :header-cell-style="{ background: '#F3F3F5' }">
        <el-table-column prop="itemType" label="收费项" align="center"></el-table-column>
        <el-table-column align="center" label="收费标准">
          <template slot-scope="scope">
            <span>{{ scope.row | datamatter2 }}</span>
            <el-tooltip class="item" effect="dark" content="修改收费标准" placement="top-start">
              <i class="el-icon-edit" @click="updateFee(scope.row)" style="color:#3193fa"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="evidence" label="凭证" align="center"></el-table-column>
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 修改收费标准 -->
    <el-dialog center title="修改收费标准" :visible.sync="dialogNewVisible" width="450px">
      <el-form :rules="rules" label-width="80px">
        <el-form-item label="收费项" prop="checkoutRemark">
          <b>{{ newInfo.itemType }}</b>
        </el-form-item>
        <el-form-item label="收费标准" prop="checkoutDate">
          <b v-if="type === 3">按实</b>
          <div v-else>
            <el-input style="width: 50%" v-if="type === 0" v-model.number="newInfo.feeAmount" maxlength="15"></el-input>
            <el-input style="width: 50%" v-if="type === 1" v-model.number="newInfo.feeAmountDay" maxlength="15"></el-input>
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
          <el-button @click="applyCancel()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "Charge2",
  data() {
    return {
      allData: [], // 所有数据
      categoryData: [], //当前大类中的所有数据
      categorys: [], // 所有大类的名称
      titles: [], // 所有小类标题的名称
      tableDataObj: {},
      currentTag: 0,
      dialogNewVisible: false,
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
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      // 初始化获取所有数据
      axios.fetch("financeServer", "/accountStandard/all").then(res => {
        if (res.code == 200) {
          let tagsArr = [];
          this.allData = res.data;
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              tagsArr.push(item.category);
            });
            // 获取大类名称数组
            this.categorys = [...new Set(tagsArr)];
            // 初始化 默认第一个
            this.tagClick(this.currentTag);
          }
        }
      });
    },
    tagClick(param) {
      let titleArr = [];
      this.tableDataObj = {};
      this.categoryData = [];
      this.currentTag = param;
      //   循环所有数据根据当前大类 获取该大类的所有数据
      this.allData.forEach(item => {
        if (item.category == this.categorys[param]) {
          this.categoryData.push(item);
        }
      });
      //   console.log(this.categoryData);
      // 循环大类数据 获取小类名称数组
      this.categoryData.forEach(titleItem => {
        titleArr.push(titleItem.title);
      });
      this.titles = [...new Set(titleArr)];
      //   console.log(this.titles);
      //根据小类名称创建表格数据结构
      this.titles.forEach(title => {
        this.tableDataObj[title] = [];
      });
      // 再去循环大类数据 根据小类名称将小类数据插入到对应的key中
      this.categoryData.forEach(titleItem => {
        for (const key in this.tableDataObj) {
          if (titleItem.title == key) {
            this.tableDataObj[key].push(titleItem);
          }
        }
      });
      // console.log(this.tableDataObj);
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
      // let {
      //   standardId,
      //   standardCode,
      //   category,
      //   title,
      //   itemType,
      //   feeAmount,
      //   feeAmountDay,
      //   feeAmount_day,
      //   feeAmountRemark,
      //   evidence,
      //   remark
      // } = val;
      // this.newInfo = {
      //   standardId,
      //   standardCode,
      //   category,
      //   title,
      //   itemType,
      //   feeAmount,
      //   feeAmountDay,
      //   feeAmount_day,
      //   feeAmountRemark,
      //   evidence,
      //   remark
      // };
    },
    submitApply() {
      console.log(this.newInfo);
      if (this.type === 0 && this.newInfo.feeAmount <= 0) {
        this.$message.warning('收费标准必须大于0!');
        return false;
      }
      if (this.type === 1 && this.newInfo.feeAmountDay <= 0) {
        this.$message.warning('收费标准必须大于0!');
        return false;
      }
      axios
        .fetch("financeServer", "/accountStandard/edit", this.newInfo, "json")
        .then(res => {
          if (res.code === 200) {
            this.$message.success("修改成功");
            this.newInfo = {};
            this.dialogNewVisible = false;
            this.getdata();
          }
        });
    },
    applyCancel() {
      this.dialogNewVisible = false;
    }
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
.chooseTag {
  margin-bottom: 15px;
  li {
    display: inline-block;
    vertical-align: top;
    width: 95px;
    text-align: center;
    line-height: 36px;
    height: 36px;
    cursor: pointer;
  }
  li.current {
    background: #4687e1;
    border-radius: 4px;
    color: #fff;
  }
}

.tableContent {
  .header {
    display: flex;
    padding: 16px 0 16px 20px;
    border-bottom: 1px solid #ddd;
    background: #fbfbfc;
    color: #333;
    line-height: 25px;
    font-weight: 700;
    border-radius: 5px 5px 0 0;
    .ba1,
    .ba2,
    .ba3,
    .ba4,
    .ba5,
    .ba6,
    .ba7 {
      display: inline-block;
      width: 4px;
      height: 20px;
      border-radius: 3px;
      position: relative;
      top: 4px;
      margin-right: 10px;
    }

    .ba1 {
      background: #3e6fa8;
    }

    .ba2 {
      background: #2fc07a;
    }

    .ba3 {
      background: #f36969;
    }

    .ba4 {
      background: #6cbc6c;
    }

    .ba5 {
      background: #f49b31;
    }

    .ba6 {
      background: #41c5d1;
    }

    .ba7 {
      background: #9a6ef2;
    }
  }
}
</style>
