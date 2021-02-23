<template>
  <div>
    <!-- 费用明细 -->
    <el-form :inline="true" class="search" label-width="70px">
      <el-form-item label="长者姓名">
        <ub-elder v-model="elderId" @change='item => elderName = item.elderName' clearable></ub-elder>
      </el-form-item>
      <el-form-item label="收费项目">
        <el-cascader v-model="cascaderValue1" :options="cascaderOptions" @change="cascaderHandleChange1"></el-cascader>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker type="daterange" v-model="createStart" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="searchFn">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      <span class="iconfont iconjichutubiao-shaixuan" :class="senior ? 'yellow' : 'block'" @click="senior=!senior">
        <span :class="senior ? 'yellow' : 'block'" style="margin-left:8px;">高级筛选</span>
        <i :class="[
            senior ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
            senior ? 'yellow' : 'block'
          ]"></i>
      </span>
      <div v-if="senior" style="margin-top:20px;">
        <el-form-item label="护理区域">
          <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
        </el-form-item>
        <el-form-item label="房间号">
          <el-select filterable v-model="search.roomName" placeholder="请选择房间号">
            <el-option :label="item.roomName" :value="item.roomName" v-for="item in roomList" :key="item.roomId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="护理等级">
          <el-select v-model="tag1Level" clearable placeholder="请选择">
            <el-option v-for="(item,index) in levels" :key="index" :label="item.title" :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消费周期">
          <el-date-picker type="daterange" v-model="startDate" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="账单编号">
          <el-input placeholder="请输入账单编号" v-model="billNo"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <div class="content">
      <ul class="title">
        <el-button type="success" @click="dialogVisible=true">添加明细</el-button>
      </ul>
      <el-table :data="data" border :header-cell-style="{background:'#F3F3F5'}">
        <el-table-column prop="elderName" label="长者姓名" align="center"></el-table-column>

        <el-table-column label="房间床位" align="center">
          <template slot-scope="scope">
            {{scope.row.roomName +'-' + scope.row.bedName }}
          </template>
        </el-table-column>
        <el-table-column label="护理等级" align="center">
          <template slot-scope="scope">
            护理{{scope.row.nursingLevel | filterLevel }}级
          </template>
        </el-table-column>
        <el-table-column prop="title" label="收费项目" align="center"></el-table-column>
        <el-table-column label="消费周期" align="center" width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.title=='保证金'">{{scope.row.intervalStart}}</span>
            <span v-else>{{scope.row.intervalStart + ' - ' + scope.row.intervalEnd}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额（元）" align="right"></el-table-column>
        <el-table-column prop="creatorName" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
      </el-table>
      <el-pagination :page-size="pageSize" :current-page="pageIndex" @current-change="handleChange" :pager-count="11" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- 添加未出账单明细 -->
    <el-dialog title="添加未出账单明细" :visible.sync="dialogVisible" width="530px" @open="disalogInit" center="true">
      <el-form label-width="90px">
        <el-form-item label="老人姓名">
          <ub-elder v-model="elderId"></ub-elder>
        </el-form-item>
        <el-form-item label="收费项目">
          <!-- <el-select placeholder="请选择基础项" v-model="category1" size="mini" style="width:173px" @change="selectcate1">
            <el-option v-for="(item,index) in categoryList" :label="item" :value="item" :key="index"></el-option>
          </el-select>
          <el-select placeholder="请选择收费项目" value-key="title" size="mini" style="width:173px" v-model="shoufei" @change="selectcate2">
            <el-option v-for="(item,index) in shoufeilist" :label="item.title" :value="item" :key="index"></el-option>
          </el-select> -->
          <el-cascader v-model="cascaderValue" :options="cascaderOptions" @change="cascaderHandleChange"></el-cascader>
        </el-form-item>
        <div style="margin: -20px 0 0 100px;">
          <span>{{ cate2Remark }}</span>&nbsp;
        </div>
        <el-form-item label="消费周期">
          <el-date-picker size="mini" value-format="yyyy-MM-dd" v-model="interval" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <i v-if="isLock" class="el-icon-lock" style="color:#1ba5f6" @click="lockDate"></i>
          <i v-else class="el-icon-unlock" style="color:#666" @click="lockDate"></i>
        </el-form-item>
        <el-form-item label="应收金额">
          <el-input placeholder="请输入应收金额" v-model="amount" style="width:350px"></el-input>&nbsp;&nbsp;元
        </el-form-item>
        <el-form-item label="说明">
          <el-input placeholder="请输入备注" show-word-limit :maxlength="255" v-model="remark" type="textarea" rows="5" style="width:350px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addaccount">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { permission } from "youban-utils";
import ubElder from "@/components/elder";

let id = 0;
export default {
  components: { ubElder },
  data() {
    return {
      currentFeeObj: {},
      currentFeeObj1: {},
      cascaderValue: [],
      cascaderValue1: [],
      cascaderOptions: [],

      setArea: '',
      levels: [],
      roomList: [],
      elderId: '',
      show3: false,
      elderId: '',
      medicalFee: '', // 医药费
      senior: false,   //是否显示高级搜索
      data: [],
      dialogVisible: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      isLock: false, //是否锁定日期

      buildSelect: '',
      buildingOption: [],

      fllorSelect: '',
      floorsOption: [],

      roomSelect: '',
      roomsOption: [],
      elderName: '',
      startDate: [],
      createStart: [],


      category: '',
      titleselect: '',
      titlelist: [],
      tag1Level: "",
      search: {
        roomName: '',
        area: ''
      },

      elderId: '',
      elderData: [],
      creatorName: '',
      category1: '',
      shoufei: '',
      categoryList: [],
      cate2Remark: '',
      shoufeilist: [],
      interval: [],
      amount: '',
      remark: '',

      totalAmount: '',

      permissionItemRemove: false, // 是否有删除账单明细的权限
      allList: [],
      currentItem: {}
    }
  },
  created() {
    // 当前用户是否有删除账单明细的权限
    this.permissionItemRemove = permission.hasPermission('uban.finance.item.remove')

    axios.fetch('oaServer', "/org/building/list").then(res => {
      if (res.code == 200)
        this.buildingOption = res.data
    })
    axios.fetch("financeServer", "/accountStandard/all").then(res => {
      if (res.code == 200) {
        let tagsArr = [];

        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            tagsArr.push(item.category);
          });
          // 获取大类名称数组
          this.categoryList = [...new Set(tagsArr)];
        }

        this.categoryList.forEach(val => {
          this.cascaderOptions.push({
            value: val,
            label: val,
            children: []
          })
        })

        this.cascaderOptions = this.cascaderOptions.map(val => {
          this.getStandardDetail(val.value).then(data => {
            let allList = [];
            let list = JSON.parse(JSON.stringify(data.data));
            this.currentItem = {
              value: list[0].title,
              label: list[0].title,
              title: list[0].title,
              children: []
            }
            list.forEach(val1 => {
              if (val1.title == this.currentItem.value) {
                this.currentItem.children.push(val1);
              } else {
                allList.push(this.currentItem);
                this.currentItem = {
                  value: val1.title,
                  label: val1.title,
                  children: [val1]
                }
              }
            });
            allList.push(this.currentItem);

            allList = allList.map(val1 => {
              val1.children = val1.children.map(c => {
                return {
                  value: c.standardId,
                  label: c.itemType,
                  standardId: c.standardId,
                  itemType: c.itemType,
                  title: c.title,
                  evidence: c.evidence
                }
              })
              return val1;
            })
            val.children = allList;
          });
          return val;
        })
        console.log(this.cascaderOptions)
      }
    });
    this.getdata();
  },
  mounted() {
    this.getLevel();
    this.getRoomList();
  },

  methods: {
    getStandardDetail(name) {
      return new Promise((resolve, rej) => {
        axios.fetch('financeServer', '/accountStandard/all', { category: name }).then(data => {
          resolve(data)
        });
      });
    },
    // 获取所有房间列表
    getRoomList() {
      axios.fetch("oaServer", "/org/room/list", { type: null, pageSize: 1000 }).then(res => {
        this.roomList = res.data;
      });
    },
    getArea(val) {
      this.search.area = val.value;
      this.setArea = val.text;
    },
    getLevel() {
      axios.fetch('commonServer', "/dict/getItemViewsByGroup", { groups: '院方护理等级' }).then(res => {
        if (res.code == 200)
          this.levels = res.data
      })
    },
    cascaderHandleChange(value) {
      console.log(value, this.cascaderValue, this.cascaderOptions);
      let index1 = this.cascaderOptions.findIndex(val => {
        return val.label == value[0];
      });
      let index2 = this.cascaderOptions[index1].children.findIndex(val => {
        return val.label == value[1];
      });
      let index3 = this.cascaderOptions[index1].children[index2].children.findIndex(val => {
        return val.value == value[2];
      });

      this.currentFeeObj = this.cascaderOptions[index1].children[index2].children[index3];
    },
    cascaderHandleChange1(value) {
      console.log(value, this.cascaderValue1);
      let index1 = this.cascaderOptions.findIndex(val => {
        return val.label == value[0];
      });
      let index2 = this.cascaderOptions[index1].children.findIndex(val => {
        return val.label == value[1];
      });
      let index3 = this.cascaderOptions[index1].children[index2].children.findIndex(val => {
        return val.value == value[2];
      });

      this.currentFeeObj1 = this.cascaderOptions[index1].children[index2].children[index3];
    },
    // 改变老人或清除当前老人信息
    changePeople(val) { },
    lockDate() {
      this.isLock = !this.isLock;
    },
    addaccount() {
      if (!this.elderId) {
        this.$message.error('请选择老人');
        return;
      }
      if (!this.cascaderValue) {
        this.$message.error('请选择收费项目');
        return;
      }
      if (this.interval.length != 2) {
        this.$message.error('请选择消费周期');
        return;
      }
      if (!this.amount) {
        this.$message.error('请输入应收金额');
        return;
      }
      console.log(this.cascaderValue)
      let [intervalStart, intervalEnd] = this.interval
      let info = {
        elderId: this.elderId,
        category: this.cascaderValue[0],
        feeType: this.cascaderValue[1],
        itemType: this.currentFeeObj.itemType,
        title: this.currentFeeObj.title,
        standardId: this.currentFeeObj.standardId,
        evidence: this.currentFeeObj.evidence,
        intervalStart,
        intervalEnd,
        amount: this.amount,
        remark: this.remark
      }
      axios.fetch('financeServer', '/accountItem/add', info, 'json').then(res => {
        if (res.code == 200) {
          this.$message({ message: '新增成功', type: 'success' });
          this.getdata();
          this.elderId = '';
          // this.category1 = '';
          // this.shoufei = '';
          this.interval = this.isLock ? this.interval : [];
          this.amount = '';
          this.remark = '';
          // this.dialogVisible = false;
        }
      })
    },
    handleChange(i) {
      this.pageIndex = i;
      this.getdata();
    },
    topage1() {
      this.$router.push('/finance/electronic');
    },
    reset() {
      if (this.$refs.areaCom !== undefined) {
        this.$refs.areaCom.resetArea();
        this.setArea = '';
      }
      this.createStart = [];
      this.createStart = [];
      this.buildSelect = this.fllorSelect = this.roomSelect = this.elderName = this.category = this.titleselect = this.elderId = this.creatorName = this.tag1Level = this.search.roomName = '';
      this.startDate = []
      this.searchFn()
    },
    changetag(i) {
      this.getdata();
    },
    changeBuild() {
      this.fllorSelect = [];
      this.roomSelect = ''
      this.roomsOption = []
      this.floorsOption = []
      if (this.buildSelect == '') return;

      let currentFloor = this.getBuildDetail(), temp = []
      for (let i = 0; i < currentFloor.floors; i++) temp.push(i)
      this.floorsOption = temp
    },
    getBuildDetail() {
      for (let i = 0; i < this.buildingOption.length; i++)
        if (this.buildingOption[i].buildingId == this.buildSelect)
          return this.buildingOption[i]
    },
    changefloor() {
      this.roomsOption = []
      this.roomSelect = ''
      if (this.fllorSelect == '') return;
      axios.fetch('oaServer', "/org/room/list", { buildingId: this.buildSelect, floor: this.fllorSelect }).then(res => {
        if (res.code == 200) {
          this.roomsOption = res.data
        }
      })
    },
    searchFn() {
      this.pageIndex = 1;
      this.getdata();
    },
    getdata() {
      let info = {
        isPager: false,
        roomName: this.search.roomName,
        nursingLevel: this.tag1Level,
        elderName: this.elderName,
        createStart: this.createStart[0],
        createEnd: this.createStart[1],
        intervalStart: this.startDate[0],
        intervalEnd: this.startDate[1],
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        category: this.category,
        title: this.titleselect.title,
        buildingId: this.buildSelect,
        floor: this.fllorSelect,
        roomId: this.roomSelect,
        creatorName: this.creatorName
      }
      axios.fetch('financeServer', '/accountItem/allItem', info).then(res => {
        if (res.code == 200) {
          this.total = res.total
          this.data = res.data
        }
      })
    },
    selectcate() {
      this.titleselect = ''
      this.titlelist = [];

      axios.fetch('financeServer', '/accountStandard/all', { category: this.category }).then(res => {
        if (res.code == 200) {
          let data = res.data, result = [], temp = [];
          for (let i = 0; i < data.length; i++) {
            if (temp.indexOf(data[i].title) == -1) {
              result.push(data[i]);
              temp.push(data[i].title);
            }
          }
          this.titlelist = result;
        }
      })
    },
    selectcate1() {
      axios.fetch('financeServer', '/accountStandard/all', { category: this.category1 }).then(res => {
        if (res.code == 200) {
          let data = res.data, result = [], temp = [];
          for (let i = 0; i < data.length; i++) {
            if (temp.indexOf(data[i].title) == -1) {
              result.push(data[i]);
              temp.push(data[i].title);
            }
          }
          this.shoufeilist = result;
          this.shoufei = ''
        }
      })
    },
    selectcate2(item) {
      this.cate2Remark = item.remark ? item.remark : '';
    },
    disalogInit() {
      this.elderId = this.category1 = this.title1 = this.amount = this.remark = this.shoufei = this.cate2Remark = ''
      this.interval = []
      this.isLock = false;
    }

  },
  filters: {
    filterLevel: val => {
      return ['', '一', '二', '三', '四', '五', '六'][val]
    },
  }
}
</script>
<style lang="less" scoped>
.search {
  .el-date-editor--date,
  .el-input,
  .el-select {
    width: 178px;
  }
  .seniorFibler {
    cursor: pointer;
    margin-left: 12px;
    color: #222;
    span {
      margin: 0 2px 0 3px;
    }
  }
}
.content {
  .title {
    margin-bottom: 10px;
    li {
      display: inline-block;
      cursor: pointer;
      vertical-align: top;
      min-width: 140px;
      width: auto;
      height: 36px;
      text-align: center;
      line-height: 36px;
      padding: 0 4px;
      border-radius: 5px;
      &.cur {
        color: #fff;
        background: #4687e1;
      }
    }
    span {
      float: right;
      color: #222;
      line-height: 36px;
      margin-right: 30px;
      i {
        font-style: normal;
        &.i1 {
          color: #6cbc6c;
        }
        &.i2 {
          color: #eb6969;
        }
      }
    }
    .el-button {
      float: right;
      margin-right: 30px;
    }
  }
}
.resolveform {
  /deep/ .el-dialog__body {
    background: rgba(248, 248, 248, 1);
    margin: 0 10px 10px;
    .el-form-item {
      margin-bottom: 0;
    }
    .prespace {
      color: #2fc07a;
    }
    .reaspace {
      color: #eb6969;
    }
  }
}

.yellow {
  color: rgb(242, 129, 79);
}
.block {
  color: #222222;
}
</style>