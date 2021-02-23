<template>
  <div class="order">
    <!-- 汇总--搜索区域 -->
    <el-form :inline="true" class="search">
          
          <el-form-item label="登记时间">
            <!-- <el-date-picker v-model="searchForm.startDate" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
            </el-date-picker> -->
            <el-date-picker v-model="searchForm.startTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
            <el-date-picker v-model="searchForm.endTime" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
          </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请输入" clearable>
          <el-option :label="item.label" :value='item.value' v-for="item in statusList" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="结算方式">
        <el-select v-model="searchForm.accountType" placeholder="请输入" clearable>
          <el-option :label="item.label" :value='item.value' v-for="item in accountTypes" :key="item.value"></el-option>
        </el-select>
       </el-form-item>
       <el-form-item label="是否结算">
        <el-select v-model="searchForm.isAccounted" placeholder="请输入" clearable>
          <el-option :label="item.label" :value='item.value' v-for="item in isAccounts" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search" style="background-color:#2368D3;">查询
      </el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>

      <span @click="show = !show" class="btniconfont iconfont iconjichutubiao-shaixuan right" :class="show ? 'yellow' : 'block'">
        <span :class="show ? 'yellow' : 'block'" style="margin-left:8px;">高级筛选</span>
        <i :class="[
                show ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
                show ? 'yellow' : 'block'
              ]"></i>
      </span>

      <el-collapse-transition>
        <div v-show="show" style="margin-top: 10px;">
      <el-form-item label="长者姓名">
            <!-- <el-input v-model="searchForm.elderName" placeholder="请输入老人姓名" clearable></el-input> -->
            <ub-elder v-model="elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
          </el-form-item>
          <el-form-item label="护理区域">
            <Area ref="areaCom" @currentArea="getArea" :area="setArea" />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="searchForm.categoryType" @change="getCategroryList()" placeholder="请选择分类" clearable>
              <el-option :label="item.title" :value="item.itemValue" v-for="item in categoryList" :key="item.itemId"></el-option>
            </el-select>
            <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
              <el-option :label="item.categoryTitle" :value="item.id" v-for="item in categoryList2" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购买时间" label-width="5em">
            <el-date-picker v-model="searchForm.buyStart" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="开始日期" clearable></el-date-picker>
            <el-date-picker v-model="searchForm.buyEnd" type="date" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="结束日期" clearable></el-date-picker>
             <!-- <el-date-picker v-model="searchForm.startDate" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
            </el-date-picker> -->
          </el-form-item>
        </div>
      </el-collapse-transition>
    </el-form>
    <div class="content">
      <el-row style="line-height:56px;">
        <el-select v-model="orderParam" placeholder="请输入" @change="orderChange" style="width:100px">
          <el-option label="按物品" :value='1'></el-option>
          <el-option label="按长者" :value='2'></el-option>
        </el-select>
        &nbsp;&nbsp;{{eldersTotal}}人&nbsp;&nbsp;{{goodsTotal}}种物品
        <el-button type="success" style="float:right;" @click="print">打印</el-button>
      </el-row>
      <el-table tooltip-effect="dark" :data="tableData" :cell-style="cellStyle" border :header-cell-style="{ background: '#F3F3F5' }" class="ub-table">
        <el-table-column label="序号" width="70" type="index" prop="id">
        </el-table-column>
        <el-table-column label="房间床位" prop="roomName" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.roomName }}-{{ scope.row.bedName }}
          </template>
        </el-table-column>
        <el-table-column label="长者姓名" prop="elderName" min-width="80"></el-table-column>
        <el-table-column label="物品类别" min-width="70" prop="categoryTitle"></el-table-column>
        <el-table-column label="物品" min-width="70" prop="goodsTitle">
          <template slot-scope="scope">
            {{ scope.row.goodsTitle }}<span v-if="scope.row.quantity !='' || scope.row.quantity !=null">{{ scope.row.quantity }}{{ scope.row.priceUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额(元)" min-width="60">
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.currentUpdate && scope.$index == currentUpdate"> -->
            <div v-if="scope.row.edit" class="price_i">
              <el-input ref="price_input" @blur="scope.row.edit = false" style="width:80%" oninput="value=value.replace(/[^0-9.]/g,'')" v-model="scope.row.amount" />
              <i @click="confirmEdit(scope.$index,scope.row.status)" class="iconfont iconjichutubiao-yiwancheng"></i>
            </div>
            <div v-else style="cursor: pointer;">
              <span>{{scope.row.amount}}</span>
              <i @click.stop="updateAmount(scope.row,scope.$index)" v-show="scope.row.status !== -1&&!scope.row.isAccounted" class="iconfont iconcaozuotubiao-bianji"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="70" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status | statusFilter }}
          </template>
        </el-table-column>
        <el-table-column label="登记人" min-width="70" prop="creatorName"></el-table-column>
        <el-table-column label="登记时间" min-width="130" prop="createTime"></el-table-column>
        <el-table-column label="购买人" min-width="70" prop="buyerName"></el-table-column>
        <el-table-column label="购买时间" min-width="110" prop="buyTime">
           <template slot-scope="scope">
            <el-date-picker
              v-if="!scope.row.isAccounted&&scope.row.status != -1&&scope.row.status != 0"
              v-model="scope.row.buyTime"
              type="date"
              placeholder="选择购买日期"
              style="width:100%;" 
              :clearable="false"
              @change="changeBuyTime(scope.row)">
            </el-date-picker>
            <span v-else>
              {{ scope.row.buyTime }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="结算方式" min-width="100">
           <template slot-scope="scope">
            {{ scope.row.accountType | accountTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="是否结算" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.isAccounted | isAccountedTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.status !== -1 && !scope.row.isAccounted" class="item" effect="dark" content="作废" placement="top">
              <el-button size="mini" @click="drag(scope.row)"><i class="iconfont iconcaozuotubiao-zuofei"></i></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status == -1" class="item" effect="dark" content="取消作废" placement="top">
              <el-button size="mini" @click="cancelDrag(scope.row)"><i class="iconfont iconcaozuotubiao-quxiao"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/javascript">
import printMethods from "@/utils/print";
import ubDictionary from "@/components/dictionary";
import ubElder from "@/components/elder";
export default {
  name: "Order",
  data() {
    return {
      setArea:'',
      elderId:'',
      show: false,
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
        categoryType: "",
        categoryId: "",
        accountType:'',
        isAccounted:'',
        startTime:'',
        endTime:'',
        buyStart:'',
        buyEnd:''
      },
      orderParam: 1,
      statusList: [
        {
          label: "已作废",
          value: "-1"
        },
        {
          label: "待购买",
          value: "0"
        },
        {
          label: "已购买",
          value: "1"
        }
      ],
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      eldersTotal: 0,
      goodsTotal: 0,
      categoryList: [], // 收费项目
      categoryList2: [], // 收费项目的2级分类
      // currentUpdate: -1,
      accountTypes: [],
      isAccounts:[
        {
          value:true,
          label:'已结算'
        },
        {
          value:false,
          label:'未结算'
        }
      ]
    };
  },
  filters: {
    statusFilter: function(value) {
      switch (value) {
        case 0:
          return "待购买";
          break;
        case 1:
          return "已购买";
          break;
        case -1:
          return "已作废";
          break;

        default:
          break;
      }
    },
    goodsTypeFilter: function(value) {
      switch (value) {
        case 0:
          return "物品";
          break;
        case 1:
          return "服务";
          break;
        case 2:
          return "代购";
          break;

        default:
          break;
      }
    },
    accountTypeFilter(value){
      return value==0?'记账':'现付'
    },
    isAccountedTypeFilter(value){
      return value?'已结算':'未结算'
    }
  },
  directives: {
    numberOnly: {
      bind: function(el) {
        el.handler = function() {
          el.value = Number(el.value.replace(/\D+/, ""));
        };
        el.addEventListener("input", el.handler);
      },
      unbind: function(el) {
        el.removeEventListener("input", el.handler);
      }
    }
  },
  components: { ubDictionary ,ubElder },
  mounted() {
    this.initTableData(this.searchForm);
    this.getPrintData(this.searchForm);
    this.getOptionData(); 
    this.getAccountType(); 
  },
  methods: {
    ...printMethods,
    getArea(val){
      this.searchForm.area = val.text;
      this.setArea = val.text;
    },
    getAccountType() {
      axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: "护理物品结算方式",
        })
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              const obj = {};
              obj.label = item.title;
              obj.value = item.itemValue;
              this.accountTypes.push(obj);
            });
          }
        });
    },
    // 从字典获取列表
    getOptionData() {
      let arr = ["收费项目"];
      axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: arr.join(",")
        })
        .then(res => {
          let data = res.data;
          this.categoryList = data.filter(
            item => item.itemGroup == "收费项目" && item.parentNo == "消费项"
          );
        });
    },
    // 一级分类改变后立马获取二级分类
    async getCategroryList() {
      this.searchForm.categoryId = "";
      await axios
        .fetch("careServer", "/careCategory/all", {
          categoryType: this.searchForm.categoryType
        })
        .then(res => {
          if (res.code == 200) {
            this.categoryList2 = res.data;
          }
        });
    },
    // 排序
    orderChange(val) {
      this.initTableData(this.searchForm);
    },
    initTableData(param) {
      param.orderParam = this.orderParam;
      axios.fetch("careServer", "/careOrderDetail/buy", param).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.map(val=> {
            this.$set(val, 'edit', false)
            val.buyTime = val.buyTime !== null && val.buyTime !== '' ? val.buyTime.substr(0,10) : '';
            return val;
          })
          // this.eldersTotal = res.data.elders;
          // this.goodsTotal = res.data.goods;
          this.totalPage = res.total;
        }
      });
    },
    getPrintData(param) {
      param.orderParam = this.orderParam;
      delete param.pageIndex;
      delete param.pageSize;
      axios.fetch("careServer", "/careOrderDetail/print", param).then(res => {
        if (res.code == 200) {
          this.eldersTotal = res.data.elders;
          this.goodsTotal = res.data.goods;
        }
      });
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.initTableData(this.searchForm);
    },
    // 查询
    searchInfo() {
      if (this.searchForm.buyStart && !this.searchForm.buyEnd) {
					this.$message.warning("请选择结束时间");
					return false;
				}
				if (!this.searchForm.buyStart && this.searchForm.buyEnd) {
					this.$message.warning("请选择开始时间");
					return false;
				}
				if (this.searchForm.buyStart && this.searchForm.buyEnd) {
					if (
					this.$moment(this.searchForm.buyStart).valueOf() >
					this.$moment(this.searchForm.buyEnd).valueOf()
					) {
					this.$message.warning("开始时间不能超过结束时间");
					return false;
					}
				}
      if (this.searchForm.startTime && !this.searchForm.endTime) {
					this.$message.warning("请选择结束时间");
					return false;
				}
				if (!this.searchForm.startTime && this.searchForm.endTime) {
					this.$message.warning("请选择开始时间");
					return false;
				}
				if (this.searchForm.startTime && this.searchForm.endTime) {
					if (
					this.$moment(this.searchForm.startTime).valueOf() >
					this.$moment(this.searchForm.endTime).valueOf()
					) {
					this.$message.warning("开始时间不能超过结束时间");
					return false;
					}
				}
      this.currentPage = this.searchForm.pageIndex = 1;
      this.initTableData(this.searchForm);
      this.getPrintData(this.searchForm);
    },
    // 编辑单个
    updateAmount(item, index) {
      // console.log(this.currentUpdate);
      // console.log(item, index);
      // if (this.currentUpdate !== -1) {
      //   return this.$message.error("请先将修改的其它数据保存！");
      // }
      // this.tableData[index].currentUpdate = true;
      // this.currentUpdate = index;
      console.log(index);
      this.tableData.forEach((data,i)=>{
        console.log(i);
        if(index === i){
            item.edit = !item.edit;
            this.$nextTick(()=>{
              this.$refs.price_input.focus();
          })
        } else {
          this.tableData[i].edit = false;
        }
      })
    },
    // 点击任意区域取消编辑
    confirmEdit(index,status) {
      if (Number.isNaN(Number(this.tableData[index].amount))) {
        return this.$message.error("请输入正确的数值！");
      } else if (Number(this.tableData[index].amount) < 0) {
        return this.$message.error("不能输入负数");
      } else {
        if(status==1&& Number(this.tableData[index].amount) === 0){
          this.$message.warning('已购买物品的价格不能为0');
          return false;
        }
        let param = {
          id: this.tableData[index].id,
          amount: this.tableData[index].amount,
          status: Number(this.tableData[index].amount) === 0 ? 0 : 1 
        };
        axios
          .fetch("careServer", "/careOrderDetail/edit", param, "json")
          .then(res => {
            if (res.code == 200) {
              this.$message.success(res.data);
              this.initTableData(this.searchForm);
              // this.currentUpdate = -1;
            }
          });
      }
    },
    // 作废
    drag(data) {
      this.$confirm("是否确认作废该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {};
          param = Object.assign({}, param, data);
          param.status = -1;
          axios
            .fetch("careServer", "/careOrderDetail/edit", param, "json")
            .then(res => {
              if (res.code == 200) {
                this.$message.success(res.data);
                //  this.centerDialogVisible = false;
                this.initTableData(this.searchForm);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废"
          });
        });
    },
    // 取消作废
    cancelDrag(data) {
      this.$confirm("是否确认取消作废该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {};
          param = Object.assign({}, param, data);
          param.status = 0;
          axios
            .fetch("careServer", "/careOrderDetail/edit", param, "json")
            .then(res => {
              if (res.code == 200) {
                this.$message.success(res.data);
                //  this.centerDialogVisible = false;
                this.initTableData(this.searchForm);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 重置
    reset() {
      if (this.$refs.areaCom !== undefined) {
          this.$refs.areaCom.resetArea();
          this.setArea = '';
      }
      this.elderId = '';
      this.currentPage = 1;
      this.searchForm = {
        pageIndex: 1,
        pageSize: 10,
        categoryType: "",
        categoryId: ""
      };
      this.initTableData(this.searchForm);
      this.getPrintData(this.searchForm);
    },
    // 打印
    print() {
      this.searchForm.orderParam = this.orderParam;
      delete this.searchForm.pageIndex;
      delete this.searchForm.pageSize;
      this.openPrint({
        path: "/print/elder/order",
        query: {
          data: JSON.stringify(this.searchForm)
        }
      });
    },
    // 更改购买时间
    changeBuyTime(data) {
      console.log(data);
      this.$confirm("确定要改变购买时间?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const param = {
            id: data.id,
            // status: data.status,
            buyTime: this.$moment(data.buyTime).format('YYYY-MM-DD HH:mm:ss'),
          };
          console.log(param);
          axios
            .fetch("careServer", "/careOrderDetail/edit", param, "json")
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.initTableData(this.searchForm);
                this.getPrintData(this.searchForm);
              }
            });
        })
        .catch(() => {
          this.initTableData(this.searchForm);
          this.getPrintData(this.searchForm);
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
  }
};
</script>

<style lang="less" scoped>
.right {
  float: right;
  height: 40px;
  line-height: 40px;
}
.yellow {
  color: rgb(242, 129, 79);
}
.block {
  color: #222222;
}
/deep/ .cell .el-date-editor {
  .el-input__inner {
    border: none;
    cursor: pointer;
  }
}
/deep/ .price_i {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-input__inner {
    width: 80%;
    padding: 0 5px;
    text-align: center;
  }
}
</style>
